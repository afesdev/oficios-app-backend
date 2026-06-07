import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Denuncia } from './denuncia.entity';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Denuncia]), AuditoriaModule, MailModule],
  controllers: [DenunciasController],
  providers: [DenunciasService],
  exports: [TypeOrmModule],
})
export class DenunciasModule {}
