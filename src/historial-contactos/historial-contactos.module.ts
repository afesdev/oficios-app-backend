import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialContacto } from './historial-contacto.entity';
import { HistorialContactosController } from './historial-contactos.controller';
import { HistorialContactosService } from './historial-contactos.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialContacto]), AuditoriaModule, MailModule],
  controllers: [HistorialContactosController],
  providers: [HistorialContactosService],
  exports: [TypeOrmModule],
})
export class HistorialContactosModule {}
