import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/paginate';
import { Profesionale } from './profesional.entity';
import { Servicio } from './servicio.entity';
import { PreciosReferenciale } from './precios-referenciale.entity';
import { HorarioAtencion } from './horario-atencion.entity';
import { Ubicacione } from './ubicacione.entity';
import { EnlaceProfesional } from './enlace-profesional.entity';
import { Verificacione } from './verificacione.entity';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';
import { AuditService } from '../auditoria/audit.service';
import { AuditContextService } from '../auditoria/audit-context.service';

@Injectable()
export class ProfesionalesService {
  private readonly logger = new Logger(ProfesionalesService.name);
  constructor(
    @InjectRepository(Profesionale)
    private readonly repo: Repository<Profesionale>,
    @InjectRepository(Servicio)
    private readonly serviciosRepo: Repository<Servicio>,
    @InjectRepository(PreciosReferenciale)
    private readonly preciosRepo: Repository<PreciosReferenciale>,
    @InjectRepository(HorarioAtencion)
    private readonly horariosRepo: Repository<HorarioAtencion>,
    @InjectRepository(Ubicacione)
    private readonly ubicacionesRepo: Repository<Ubicacione>,
    @InjectRepository(EnlaceProfesional)
    private readonly enlacesRepo: Repository<EnlaceProfesional>,
    @InjectRepository(Verificacione)
    private readonly verificacionesRepo: Repository<Verificacione>,
    private readonly audit: AuditService,
    private readonly ctx: AuditContextService,
  ) {}

  findByUsuario(usuarioId: number) {
    return this.repo.findOne({
      where: { usuario_id: usuarioId },
      relations: {
        categoria: true, servicios: { preciosReferenciales: true }, horariosAtencion: true,
        enlacesProfesionales: true, verificacion: true,
      },
    });
  }

  findAll(pagination: PaginationDto) {
    return paginate(this.repo, pagination, undefined, { id: 'DESC' }, { categoria: true, usuario: true });
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({
      where: { id },
      relations: {
        categoria: true, usuario: true, publicaciones: true,
        resenas: { cliente: true },
        servicios: { preciosReferenciales: true }, horariosAtencion: true, ubicaciones: true,
        enlacesProfesionales: true, verificacion: true,
      },
    }).catch(() => {
      throw new NotFoundException('Profesional no encontrado');
    });
  }

  async getFrequentCities(limit: number = 6) {
    const result = await this.repo
      .createQueryBuilder('prof')
      .select('prof.ciudad', 'ciudad')
      .addSelect('COUNT(prof.id)', 'count')
      .groupBy('prof.ciudad')
      .orderBy('count', 'DESC')
      .take(limit)
      .getRawMany();
    return result.map((r) => ({ ciudad: r.ciudad, count: parseInt(r.count, 10) }));
  }

  async autocomplete(q: string) {
    if (!q || q.length < 2) return { profesionales: [], categorias: [], ciudades: [] };

    const [profesionales, categorias, ciudades] = await Promise.all([
      this.repo.createQueryBuilder('prof')
        .leftJoin('prof.usuario', 'usr')
        .select(['prof.id', 'usr.nombre_completo', 'prof.ciudad'])
        .where('usr.nombre_completo LIKE :q', { q: `%${q}%` })
        .take(5)
        .getMany(),

      this.repo.createQueryBuilder('prof')
        .leftJoin('prof.categoria', 'cat')
        .select('cat.nombre')
        .where('cat.nombre LIKE :q', { q: `%${q}%` })
        .groupBy('cat.nombre')
        .take(5)
        .getRawMany(),

      this.repo.createQueryBuilder('prof')
        .select('prof.ciudad', 'ciudad')
        .where('prof.ciudad LIKE :q', { q: `%${q}%` })
        .groupBy('prof.ciudad')
        .orderBy('COUNT(prof.id)', 'DESC')
        .take(5)
        .getRawMany(),
    ]);

    return {
      profesionales: profesionales.map((p) => ({
        id: p.id,
        nombre: (p as any).usuario?.nombre_completo ?? '',
        ciudad: p.ciudad,
      })),
      categorias: categorias.map((c: any) => c.cat_nombre),
      ciudades: ciudades.map((c: any) => c.ciudad),
    };
  }

  async search(pagination: PaginationDto, q?: string, ciudad?: string, categoriaId?: number) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('prof')
      .leftJoinAndSelect('prof.categoria', 'cat')
      .leftJoinAndSelect('prof.usuario', 'usr')
      .orderBy('prof.id', 'DESC');

    if (q) {
      qb.andWhere(
        '(prof.ciudad LIKE :q OR usr.nombre_completo LIKE :q OR cat.nombre LIKE :q)',
        { q: `%${q}%` },
      );
    } else {
      if (ciudad) qb.andWhere('prof.ciudad LIKE :ciudad', { ciudad: `%${ciudad}%` });
      if (categoriaId) qb.andWhere('prof.categoria_id = :categoriaId', { categoriaId });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async searchNearby(lat: number, lng: number, radioKm: number, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 50;

    const all = await this.repo
      .createQueryBuilder('prof')
      .leftJoinAndSelect('prof.categoria', 'cat')
      .leftJoinAndSelect('prof.usuario', 'usr')
      .leftJoinAndSelect('prof.ubicaciones', 'ub')
      .where('ub.latitud IS NOT NULL AND ub.longitud IS NOT NULL AND ub.visible_en_mapa = 1')
      .getMany();

    this.logger.debug(`searchNearby: total professionals with ubicaciones: ${all.length}`);

    // Debug: contar cuántos profesionales existen en total y cuántas ubicaciones
    const totalProfs = await this.repo.count();
    const totalUbs = await this.ubicacionesRepo.count();
    const ubsWithCoords = await this.ubicacionesRepo
      .createQueryBuilder('ub')
      .where('ub.latitud IS NOT NULL AND ub.longitud IS NOT NULL AND ub.visible_en_mapa = 1')
      .getCount();
    this.logger.debug(`searchNearby DB stats: profesionales=${totalProfs}, ubicaciones=${totalUbs}, ubs_with_coords=${ubsWithCoords}`);

    const matching = all.filter((prof) => {
      return prof.ubicaciones?.some((ub) => {
        if (ub.latitud == null || ub.longitud == null) return false;
        const dist = this.haversine(lat, lng, ub.latitud, ub.longitud);
        return dist <= radioKm;
      });
    });

    this.logger.debug(`searchNearby: after haversine filter: ${matching.length}`);

    const total = matching.length;
    const skip = (page - 1) * limit;
    const data = matching.slice(skip, skip + limit);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  create(dto: CreateProfesionalDto) {
    const profesional = this.repo.create(dto);
    return this.repo.save(profesional);
  }

  async update(id: number, dto: UpdateProfesionalDto) {
    const profesional = await this.findOne(id);
    Object.assign(profesional, dto);
    return this.repo.save(profesional);
  }

  async remove(id: number) {
    const profesional = await this.findOne(id);
    return this.repo.remove(profesional);
  }

  async addServicio(profesionalId: number, dto: any) {
    const servicio = this.serviciosRepo.create({
      ...dto,
      profesional_id: profesionalId,
    });
    const saved = await this.serviciosRepo.save(servicio) as any;

    if (dto.precios && Array.isArray(dto.precios)) {
      for (const p of dto.precios) {
        await this.preciosRepo.save(
          this.preciosRepo.create({ ...p, servicio_id: (saved as Servicio).id }),
        );
      }
    }

    this.audit.log({
      usuarioId: this.ctx.get().usuarioId,
      tabla: 'Servicios',
      registroId: (saved as Servicio).id,
      accion: 'INSERT',
      valorNuevo: { ...dto, profesional_id: profesionalId },
    });

    return this.serviciosRepo.findOne({
      where: { id: (saved as Servicio).id },
      relations: { preciosReferenciales: true },
    });
  }

  async updateServicio(id: number, dto: UpdateServicioDto) {
    const servicio = await this.serviciosRepo.findOneOrFail({
      where: { id },
      relations: { preciosReferenciales: true },
    });

    const old = { ...servicio, precios: servicio.preciosReferenciales?.map(p => ({ ...p })) };

    if (dto.nombre !== undefined) servicio.nombre = dto.nombre;
    if (dto.descripcion !== undefined) servicio.descripcion = dto.descripcion;
    if (dto.duracion_estimada_min !== undefined) servicio.duracion_estimada_min = dto.duracion_estimada_min;

    const saved = await this.serviciosRepo.save(servicio);

    if (dto.precios && Array.isArray(dto.precios)) {
      await this.preciosRepo.delete({ servicio_id: id });
      for (const p of dto.precios) {
        await this.preciosRepo.save(
          this.preciosRepo.create({ ...p, servicio_id: id }),
        );
      }
    }

    this.audit.log({
      usuarioId: this.ctx.get().usuarioId,
      tabla: 'Servicios',
      registroId: id,
      accion: 'UPDATE',
      valorAnterior: old,
      valorNuevo: { ...dto, precios: dto.precios },
    });

    return this.serviciosRepo.findOne({
      where: { id },
      relations: { preciosReferenciales: true },
    });
  }

  async removeServicio(id: number) {
    const servicio = await this.serviciosRepo.findOneOrFail({ where: { id } });
    this.audit.log({
      usuarioId: this.ctx.get().usuarioId,
      tabla: 'Servicios',
      registroId: id,
      accion: 'DELETE',
      valorAnterior: { nombre: servicio.nombre, descripcion: servicio.descripcion, duracion_estimada_min: servicio.duracion_estimada_min },
    });
    return this.serviciosRepo.remove(servicio);
  }

  // ─── Precios Referenciales ──────────────────────────────────────

  async getPrecios(servicioId: number) {
    return this.preciosRepo.find({ where: { servicio_id: servicioId } });
  }

  async createPrecio(dto: CreatePrecioDto) {
    const servicio = await this.serviciosRepo.findOneBy({ id: dto.servicio_id });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    const precio = this.preciosRepo.create(dto);
    return this.preciosRepo.save(precio);
  }

  async updatePrecio(id: number, dto: UpdatePrecioDto) {
    const precio = await this.preciosRepo.findOneBy({ id });
    if (!precio) throw new NotFoundException('Precio no encontrado');
    Object.assign(precio, dto);
    return this.preciosRepo.save(precio);
  }

  async removePrecio(id: number) {
    const precio = await this.preciosRepo.findOneByOrFail({ id });
    return this.preciosRepo.remove(precio);
  }
}
