import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Promocion } from './entities/promocion.entity';
import { PlanPromocion } from './entities/plan-promocion.entity';
import { PromocionBanner } from './entities/promocion-banner.entity';
import { PromocionPublicacion } from './entities/promocion-publicacion.entity';
import { PromocionPerfil } from './entities/promocion-perfil.entity';
import { PagoPromocion } from './entities/pago-promocion.entity';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';

import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promocion,
      PlanPromocion,
      PromocionBanner,
      PromocionPublicacion,
      PromocionPerfil,
      PagoPromocion,
      NotificacionePush,
    ]),
    AuditoriaModule,
    MailModule,
  ],
  controllers: [PromocionesController],
  providers: [PromocionesService],
  exports: [PromocionesService],
})
export class PromocionesModule {}
