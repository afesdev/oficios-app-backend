import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialContacto } from './historial-contacto.entity';
import { HistorialContactosController } from './historial-contactos.controller';
import { HistorialContactosService } from './historial-contactos.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialContacto])],
  controllers: [HistorialContactosController],
  providers: [HistorialContactosService],
  exports: [TypeOrmModule],
})
export class HistorialContactosModule {}
