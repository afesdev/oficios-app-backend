import { Injectable } from '@nestjs/common';
import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent,
  UpdateEvent, RemoveEvent, SoftRemoveEvent, RecoverEvent,
} from 'typeorm';
import { AuditService } from './audit.service';
import { AuditContextService } from './audit-context.service';

// Solo auditar tablas de negocio relevantes; excluir ruido operacional
const AUDITED_TABLES = new Set([
  'Usuarios',
  'Profesionales',
  'Publicaciones',
  'Resenas',
  'Denuncias',
  'Verificaciones',
  'Servicios',
  'PreciosReferenciales',
  'Favoritos',
  'HistorialContactos',
  'LikesPublicaciones',
  'Promociones',
  'PagosPromociones',
  'Categorias',
]);

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly audit: AuditService,
    private readonly ctx: AuditContextService,
  ) {}

  afterInsert(event: InsertEvent<any>) {
    const table = event.metadata.tableName;
    if (!AUDITED_TABLES.has(table)) return;

    const entityId = (event.entity as any)?.id;
    if (entityId == null) return;

    const ctx = this.ctx.get();
    this.audit.log({
      usuarioId: ctx.usuarioId,
      tabla: table,
      registroId: entityId,
      accion: 'INSERT',
      valorNuevo: event.entity,
    });
  }

  afterUpdate(event: UpdateEvent<any>) {
    const table = event.metadata.tableName;
    if (!AUDITED_TABLES.has(table) || !event.entity) return;

    const entityId = (event.entity as any)?.id;
    if (entityId == null) return;

    const ctx = this.ctx.get();
    this.audit.log({
      usuarioId: ctx.usuarioId,
      tabla: table,
      registroId: entityId,
      accion: 'UPDATE',
      valorAnterior: event.databaseEntity,
      valorNuevo: event.entity,
    });
  }

  beforeRemove(event: RemoveEvent<any>) {
    const table = event.metadata.tableName;
    if (!AUDITED_TABLES.has(table)) return;

    const entityId = (event.entity as any)?.id;
    if (entityId == null) return;

    const ctx = this.ctx.get();
    this.audit.log({
      usuarioId: ctx.usuarioId,
      tabla: table,
      registroId: entityId,
      accion: 'DELETE',
      valorAnterior: event.databaseEntity ?? event.entity,
    });
  }
}
