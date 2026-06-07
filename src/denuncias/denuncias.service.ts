import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Denuncia } from './denuncia.entity';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, PaginatedResult } from '../common/utils/paginate';
import { AuditService } from '../auditoria/audit.service';
import { MailService } from '../mail/mail.service';
import { FirebaseFcmService } from '../firebase/firebase-fcm.service';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';

@Injectable()
export class DenunciasService {
  private readonly logger = new Logger(DenunciasService.name);

  constructor(
    @InjectRepository(Denuncia)
    private readonly repo: Repository<Denuncia>,
    @InjectRepository(NotificacionePush)
    private readonly pushRepo: Repository<NotificacionePush>,
    private readonly audit: AuditService,
    private readonly mail: MailService,
    private readonly fcm: FirebaseFcmService,
  ) {}

  private async notificarDenunciaResuelta(usuarioId: number, estado: string): Promise<void> {
    const pushRows = await this.pushRepo.find({ where: { usuario_id: usuarioId, activo: true } });
    const tokens = pushRows.map((r) => r.token);
    if (!tokens.length) return;
    const aprobada = estado === 'resuelto';
    this.fcm.sendToTokens(
      tokens,
      aprobada ? '✅ Denuncia resuelta' : 'ℹ️ Denuncia procesada',
      aprobada
        ? 'Tu denuncia fue revisada y resuelta por el equipo de OficiosApp.'
        : 'Tu denuncia fue revisada pero no encontramos una infracción. Gracias por reportar.',
      { tipo: 'denuncia_resuelta', estado },
    ).catch(() => {});
  }

  findAll(pagination: PaginationDto): Promise<PaginatedResult<Denuncia>> {
    return paginate(this.repo, pagination, undefined, { fecha_creacion: 'DESC' });
  }

  findOne(id: number) {
    return this.repo.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Denuncia no encontrada');
    });
  }

  async create(dto: CreateDenunciaDto) {
    const denuncia = this.repo.create(dto);
    await this.repo.save(denuncia);

    this.logger.warn(
      `Denuncia recibida: id=${denuncia.id}, tipo="${(denuncia as any).tipo}", referencia_id=${(denuncia as any).referencia_id}, motivo="${(denuncia as any).motivo}"`,
    );
    this.audit.log({
      usuarioId: (denuncia as any).denunciante_id ?? null,
      tabla: 'Denuncias',
      registroId: denuncia.id,
      accion: 'INSERT',
      valorNuevo: {
        tipo: (denuncia as any).tipo,
        referencia_id: (denuncia as any).referencia_id,
        motivo: (denuncia as any).motivo,
        descripcion: (denuncia as any).descripcion,
      },
    });

    return denuncia;
  }

  async update(id: number, dto: UpdateDenunciaDto) {
    const denuncia = await this.repo.findOne({
      where: { id },
      relations: { denunciante: true },
    });
    if (!denuncia) throw new NotFoundException('Denuncia no encontrada');

    const anterior = { estado: (denuncia as any).estado };
    Object.assign(denuncia, dto);
    await this.repo.save(denuncia);

    this.logger.log(`Denuncia resuelta: id=${id}, estado="${(denuncia as any).estado}"`);
    this.audit.log({
      usuarioId: null,
      tabla: 'Denuncias',
      registroId: id,
      accion: 'UPDATE',
      valorAnterior: anterior,
      valorNuevo: { estado: (denuncia as any).estado },
    });

    // Notificar al denunciante por email y push (fire-and-forget)
    if (denuncia.denunciante) {
      const u = denuncia.denunciante;
      if (u.email) {
        this.mail.sendDenunciaResuelta({
          to: u.email,
          nombre: u.nombre_completo,
          estado: (denuncia as any).estado,
          notasAdmin: (denuncia as any).notas_admin ?? undefined,
        }).catch(() => {});
      }
      this.notificarDenunciaResuelta(u.id, (denuncia as any).estado);
    }

    return denuncia;
  }
}
