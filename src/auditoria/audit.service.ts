import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './auditoria.entity';

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
}
