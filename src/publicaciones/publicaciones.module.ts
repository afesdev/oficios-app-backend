import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacione } from './publicacione.entity';
import { FotosPublicacione } from './fotos-publicacione.entity';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Resena } from '../resenas/resena.entity';
import { LikePublicacion } from '../likes/like-publicacion.entity';
import { PromocionPublicacion } from '../promociones/entities/promocion-publicacion.entity';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { LikesModule } from '../likes/likes.module';
import { ResenasModule } from '../resenas/resenas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacione, FotosPublicacione, Resena, LikePublicacion, PromocionPublicacion]),
    AuditoriaModule,
    LikesModule,
    ResenasModule, // para ResenasService (ratings batch) y rutas anidadas
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [TypeOrmModule],
})
export class PublicacionesModule {}
