import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './auditoria.entity';
import { AuditService } from './audit.service';
import { AuditSubscriber } from './audit.subscriber';
import { AuditContextService } from './audit-context.service';
import { AuditContextInterceptor } from './audit-context.interceptor';
import { AuditoriaController } from './auditoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  controllers: [AuditoriaController],
  providers: [
    AuditService,
    AuditContextService,
    AuditSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditContextInterceptor,
    },
  ],
  exports: [AuditService, AuditContextService],
})
export class AuditoriaModule {}
