import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resena]), AuditoriaModule],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [TypeOrmModule, ResenasService],
})
export class ResenasModule {}
