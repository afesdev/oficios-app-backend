import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from './resena.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { CreateResenaPublicacionDto } from './dto/create-resena-publicacion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/paginate';
import { AuditService } from '../auditoria/audit.service';
import { MailService } from '../mail/mail.service';
import { Profesionale } from '../profesionales/profesional.entity';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';
import { FirebaseFcmService } from '../firebase/firebase-fcm.service';

@Injectable()
export class ResenasService {
  private readonly logger = new Logger(ResenasService.name);

  constructor(
    @InjectRepository(Resena)
    private readonly repo: Repository<Resena>,
    @InjectRepository(Profesionale)
    private readonly profRepo: Repository<Profesionale>,
    @InjectRepository(NotificacionePush)
    private readonly pushRepo: Repository<NotificacionePush>,
    private readonly audit: AuditService,
    private readonly mail: MailService,
    private readonly fcm: FirebaseFcmService,
  ) {}

  private async notificarNuevaResena(profesionalId: number, clienteNombre: string, puntuacion: number): Promise<void> {
    const prof = await this.profRepo.findOne({ where: { id: profesionalId }, relations: { usuario: true } });
    if (!prof?.usuario) return;
    const pushRows = await this.pushRepo.find({ where: { usuario_id: prof.usuario.id, activo: true } });
    const tokens = pushRows.map((r) => r.token);
    if (tokens.length) {
      const estrellas = '⭐'.repeat(Math.min(puntuacion, 5));
      this.fcm.sendToTokens(
        tokens,
        '⭐ Nueva reseña recibida',
        `${clienteNombre} te dejó ${estrellas} (${puntuacion}/5)`,
        { tipo: 'nueva_resena', profesional_id: String(profesionalId) },
      ).catch(() => {});
    }
  }

  findByPublicacion(publicacionId: number, pagination: PaginationDto) {
    return paginate(
      this.repo, pagination,
      { publicacion_id: publicacionId } as any,
      { fecha_creacion: 'DESC' },
      { cliente: true },
    );
  }

  async createForPublicacion(
    publicacionId: number,
    clienteId: number,
    dto: CreateResenaPublicacionDto,
    profesionalId: number,
  ) {
    const draft = this.repo.create({
      publicacion_id: publicacionId,
      cliente_id: clienteId,
      profesional_id: profesionalId,
      puntuacion: dto.puntuacion,
      comentario: dto.comentario,
    } as any);
    const saved = await this.repo.save(draft) as unknown as Resena;

    this.logger.log(
      `Reseña creada: id=${saved.id}, publicacion_id=${publicacionId}, cliente_id=${clienteId}, puntuacion=${saved.puntuacion}`,
    );
    this.audit.log({
      usuarioId: clienteId,
      tabla: 'Resenas',
      registroId: saved.id,
      accion: 'INSERT',
      valorNuevo: { publicacion_id: publicacionId, profesional_id: profesionalId, puntuacion: saved.puntuacion },
    });

    // Recargar con relación cliente para que el cliente reciba nombre e imagen
    const savedRel = await this.repo.findOne({ where: { id: saved.id }, relations: { cliente: true } });

    // Notificar al profesional por email y push (fire-and-forget)
    if (savedRel?.cliente) {
      const clienteNombre = savedRel.cliente.nombre_completo;
      this.profRepo.findOne({ where: { id: profesionalId }, relations: { usuario: true } }).then((prof) => {
        if (prof?.usuario?.email) {
          this.mail.sendNewReview({
            to: prof.usuario.email,
            profesionalNombre: prof.usuario.nombre_completo,
            clienteNombre,
            puntuacion: dto.puntuacion,
            comentario: dto.comentario ?? undefined,
          }).catch(() => {});
        }
      }).catch(() => {});
      this.notificarNuevaResena(profesionalId, clienteNombre, dto.puntuacion);
    }

    return savedRel;
  }

  findByProfesional(profesionalId: number, pagination: PaginationDto) {
    return paginate(
      this.repo, pagination,
      { profesional_id: profesionalId },
      { fecha_creacion: 'DESC' },
      { cliente: true },
    );
  }

  /** Devuelve promedio y total de reseñas para un array de profesional_ids en una sola query. */
  async getRatingsBatch(
    profesionalIds: number[],
  ): Promise<Record<number, { promedio: number; total: number }>> {
    if (profesionalIds.length === 0) return {};
    const rows = await this.repo
      .createQueryBuilder('r')
      .select('r.profesional_id', 'profesional_id')
      .addSelect('AVG(CAST(r.puntuacion AS FLOAT))', 'promedio')
      .addSelect('COUNT(r.id)', 'total')
      .where('r.profesional_id IN (:...ids)', { ids: profesionalIds })
      .groupBy('r.profesional_id')
      .getRawMany();
    const map: Record<number, { promedio: number; total: number }> = {};
    for (const row of rows) {
      map[Number(row.profesional_id)] = {
        promedio: Math.round(Number(row.promedio) * 10) / 10,
        total: Number(row.total),
      };
    }
    return map;
  }

  async getAverage(profesionalId: number) {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('AVG(r.puntuacion)', 'promedio')
      .addSelect('COUNT(r.id)', 'total')
      .where('r.profesional_id = :id', { id: profesionalId })
      .getRawOne();
    return { promedio: Number(result.promedio || 0).toFixed(1), total: Number(result.total) };
  }

  async create(dto: CreateResenaDto) {
    const resena = this.repo.create(dto);
    await this.repo.save(resena);

    this.logger.log(
      `Reseña creada: id=${resena.id}, cliente_id=${resena.cliente_id}, profesional_id=${resena.profesional_id}, puntuacion=${resena.puntuacion}`,
    );
    this.audit.log({
      usuarioId: resena.cliente_id,
      tabla: 'Resenas',
      registroId: resena.id,
      accion: 'INSERT',
      valorNuevo: {
        profesional_id: resena.profesional_id,
        puntuacion: resena.puntuacion,
        comentario: resena.comentario,
      },
    });

    // Notificar al profesional por email y push (fire-and-forget)
    const full = await this.repo.findOne({
      where: { id: resena.id },
      relations: { cliente: true },
    });
    if (full?.cliente) {
      const clienteNombre = full.cliente.nombre_completo;
      this.profRepo.findOne({ where: { id: resena.profesional_id }, relations: { usuario: true } }).then((prof) => {
        if (prof?.usuario?.email) {
          this.mail.sendNewReview({
            to: prof.usuario.email,
            profesionalNombre: prof.usuario.nombre_completo,
            clienteNombre,
            puntuacion: full.puntuacion,
            comentario: full.comentario ?? undefined,
          }).catch(() => {});
        }
      }).catch(() => {});
      this.notificarNuevaResena(resena.profesional_id, clienteNombre, full.puntuacion);
    }

    return resena;
  }

  async remove(id: number) {
    const resena = await this.repo.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Reseña no encontrada');
    });

    this.logger.warn(
      `Reseña eliminada: id=${resena.id}, cliente_id=${resena.cliente_id}, profesional_id=${resena.profesional_id}`,
    );
    this.audit.log({
      usuarioId: resena.cliente_id,
      tabla: 'Resenas',
      registroId: resena.id,
      accion: 'DELETE',
      valorAnterior: {
        profesional_id: resena.profesional_id,
        puntuacion: resena.puntuacion,
        comentario: resena.comentario,
      },
    });

    return this.repo.remove(resena);
  }
}
