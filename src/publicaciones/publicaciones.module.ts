import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacione } from './publicacione.entity';
import { FotosPublicacione } from './fotos-publicacione.entity';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { LikesModule } from '../likes/likes.module';
import { ResenasModule } from '../resenas/resenas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacione, FotosPublicacione]),
    LikesModule,
    ResenasModule, // para ResenasService (ratings batch) y rutas anidadas
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [TypeOrmModule],
})
export class PublicacionesModule {}
