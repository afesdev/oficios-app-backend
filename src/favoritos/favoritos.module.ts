import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './favorito.entity';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito]), AuditoriaModule],
  controllers: [FavoritosController],
  providers: [FavoritosService],
  exports: [TypeOrmModule],
})
export class FavoritosModule {}
