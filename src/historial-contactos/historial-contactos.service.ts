import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialContacto } from './historial-contacto.entity';
import { CreateHistorialContactoDto } from './dto/create-historial-contacto.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/paginate';
import { AuditService } from '../auditoria/audit.service';
import { AuditContextService } from '../auditoria/audit-context.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class HistorialContactosService {
  constructor(
    @InjectRepository(HistorialContacto)
    private readonly repo: Repository<HistorialContacto>,
    private readonly audit: AuditService,
    private readonly ctx: AuditContextService,
    private readonly mail: MailService,
  ) {}

  findByProfesional(profesionalId: number, pagination: PaginationDto) {
    return paginate(this.repo, pagination, { profesional_id: profesionalId }, { fecha_contacto: 'DESC' });
  }

  async getMetrics(profesionalId: number) {
    const result = await this.repo
      .createQueryBuilder('h')
      .select('h.tipo_contacto', 'tipo')
      .addSelect('COUNT(h.id)', 'total')
      .where('h.profesional_id = :id', { id: profesionalId })
      .groupBy('h.tipo_contacto')
      .getRawMany();
    return result;
  }

  async create(dto: CreateHistorialContactoDto) {
    const record = this.repo.create(dto);
    const saved = await this.repo.save(record);
    this.audit.log({
      usuarioId: this.ctx.get().usuarioId,
      tabla: 'HistorialContactos',
      registroId: saved.id,
      accion: 'INSERT',
      valorNuevo: { cliente_id: dto.cliente_id, profesional_id: dto.profesional_id, tipo_contacto: dto.tipo_contacto },
    });

    // Notificar al profesional por email (fire-and-forget)
    const loaded = await this.repo.findOne({
      where: { id: saved.id },
      relations: { profesional: { usuario: true }, cliente: true },
    });
    if (loaded?.profesional?.usuario?.email && loaded?.cliente) {
      this.mail.sendNewContact({
        to: loaded.profesional.usuario.email,
        profesionalNombre: loaded.profesional.usuario.nombre_completo,
        clienteNombre: loaded.cliente.nombre_completo,
        tipoContacto: dto.tipo_contacto,
      }).catch(() => {});
    }

    return saved;
  }
}
