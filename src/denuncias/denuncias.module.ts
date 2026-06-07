import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Denuncia } from './denuncia.entity';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Denuncia, NotificacionePush]),
    AuditoriaModule,
    MailModule,
    FirebaseModule,
  ],
  controllers: [DenunciasController],
  providers: [DenunciasService],
  exports: [TypeOrmModule],
})
export class DenunciasModule {}
