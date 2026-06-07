import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module';
import { Profesionale } from '../profesionales/profesional.entity';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Profesionale, NotificacionePush]), AuditoriaModule, MailModule, FirebaseModule],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [TypeOrmModule, ResenasService],
})
export class ResenasModule {}
