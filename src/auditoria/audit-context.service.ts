import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface AuditContext {
  usuarioId: number | null;
}

@Injectable()
export class AuditContextService {
  private readonly storage = new AsyncLocalStorage<AuditContext>();

  run<T>(context: AuditContext, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  get(): AuditContext {
    return this.storage.getStore() ?? { usuarioId: null };
  }
}
