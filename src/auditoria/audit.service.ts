import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between, FindOptionsWhere } from 'typeorm';
import { Auditoria } from './auditoria.entity';
import { SearchAuditDto } from './dto/search-audit.dto';
import { paginate } from '../common/utils/paginate';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly repo: Repository<Auditoria>,
  ) {}

  log(data: {
    usuarioId: number | null;
    tabla: string;
    registroId: number;
    accion: string;
    valorAnterior?: any;
    valorNuevo?: any;
  }) {
    return this.repo.insert({
      usuario_id: data.usuarioId ?? undefined,
      tabla_afectada: data.tabla,
      registro_id: data.registroId,
      accion: data.accion,
      valor_anterior: data.valorAnterior ? JSON.stringify(data.valorAnterior) : undefined,
      valor_nuevo: data.valorNuevo ? JSON.stringify(data.valorNuevo) : undefined,
    } as any);
  }

  async search(dto: SearchAuditDto) {
    const where: FindOptionsWhere<Auditoria> = {};

    if (dto.tabla) where.tabla_afectada = dto.tabla;
    if (dto.accion) where.accion = dto.accion;
    if (dto.usuario_id) where.usuario_id = dto.usuario_id;
    if (dto.desde || dto.hasta) {
      where.fecha = dto.desde && dto.hasta
        ? Between(new Date(dto.desde), new Date(dto.hasta))
        : dto.desde
          ? MoreThan(new Date(dto.desde))
          : LessThan(new Date(dto.hasta!));
    }

    return paginate(this.repo, dto, where, { fecha: 'DESC' }, { usuario: true });
  }
}
