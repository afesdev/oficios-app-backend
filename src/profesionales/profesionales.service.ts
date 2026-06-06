import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ProfesionalesService {
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
        categoria: true, usuario: true, publicaciones: true, resenas: true,
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
    const skip = (page - 1) * limit;

    const result = await this.repo
      .createQueryBuilder('prof')
      .leftJoinAndSelect('prof.categoria', 'cat')
      .leftJoinAndSelect('prof.usuario', 'usr')
      .innerJoinAndSelect('prof.ubicaciones', 'ub')
      .where(
        `(6371 * ACOS(
          COS(RADIANS(:lat)) * COS(RADIANS(CAST(ub.latitud AS FLOAT))) *
          COS(RADIANS(CAST(ub.longitud AS FLOAT)) - RADIANS(:lng)) +
          SIN(RADIANS(:lat)) * SIN(RADIANS(CAST(ub.latitud AS FLOAT)))
        )) <= :radio`,
        { lat, lng, radio: radioKm },
      )
      .orderBy('prof.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const [data, total] = result;

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
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

    return this.serviciosRepo.findOne({
      where: { id },
      relations: { preciosReferenciales: true },
    });
  }

  async removeServicio(id: number) {
    const servicio = await this.serviciosRepo.findOneOrFail({ where: { id } });
    return this.serviciosRepo.remove(servicio);
  }
}
