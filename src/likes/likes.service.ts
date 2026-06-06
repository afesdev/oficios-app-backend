import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikePublicacion } from './like-publicacion.entity';
import { AuditService } from '../auditoria/audit.service';
import { AuditContextService } from '../auditoria/audit-context.service';

export interface LikeStatus {
  liked: boolean;
  total_likes: number;
}

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikePublicacion)
    private readonly repo: Repository<LikePublicacion>,
    private readonly audit: AuditService,
    private readonly ctx: AuditContextService,
  ) {}

  async toggle(usuarioId: number, publicacionId: number): Promise<LikeStatus> {
    const existing = await this.repo.findOneBy({
      usuario_id: usuarioId,
      publicacion_id: publicacionId,
    });

    if (existing) {
      await this.repo.remove(existing);
      this.audit.log({
        usuarioId: this.ctx.get().usuarioId,
        tabla: 'LikesPublicaciones',
        registroId: usuarioId,
        accion: 'DELETE',
        valorAnterior: { usuario_id: usuarioId, publicacion_id: publicacionId },
      });
    } else {
      const saved = await this.repo.save(
        this.repo.create({ usuario_id: usuarioId, publicacion_id: publicacionId }),
      );
      this.audit.log({
        usuarioId: this.ctx.get().usuarioId,
        tabla: 'LikesPublicaciones',
        registroId: usuarioId,
        accion: 'INSERT',
        valorNuevo: { usuario_id: usuarioId, publicacion_id: publicacionId },
      });
    }

    const total_likes = await this.repo.countBy({ publicacion_id: publicacionId });
    return { liked: !existing, total_likes };
  }

  async getStatus(publicacionId: number, usuarioId?: number): Promise<LikeStatus> {
    const [total_likes, liked] = await Promise.all([
      this.repo.countBy({ publicacion_id: publicacionId }),
      usuarioId
        ? this.repo.existsBy({ publicacion_id: publicacionId, usuario_id: usuarioId })
        : Promise.resolve(false),
    ]);
    return { liked, total_likes };
  }

  async getMisLikes(usuarioId: number): Promise<number[]> {
    const rows = await this.repo.find({
      select: { publicacion_id: true },
      where: { usuario_id: usuarioId },
    });
    return rows.map((r) => r.publicacion_id);
  }

  async getCountsForPublicaciones(ids: number[]): Promise<Record<number, number>> {
    if (!ids.length) return {};
    const rows = await this.repo
      .createQueryBuilder('l')
      .select('l.publicacion_id', 'pid')
      .addSelect('COUNT(*)', 'total')
      .where('l.publicacion_id IN (:...ids)', { ids })
      .groupBy('l.publicacion_id')
      .getRawMany<{ pid: number; total: string }>();

    return Object.fromEntries(rows.map((r) => [r.pid, Number(r.total)]));
  }
}
