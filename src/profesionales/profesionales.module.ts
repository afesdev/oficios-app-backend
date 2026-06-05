import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesionale } from './profesional.entity';
import { Servicio } from './servicio.entity';
import { PreciosReferenciale } from './precios-referenciale.entity';
import { HorarioAtencion } from './horario-atencion.entity';
import { Ubicacione } from './ubicacione.entity';
import { EnlaceProfesional } from './enlace-profesional.entity';
import { Verificacione } from './verificacione.entity';
import { ProfesionalesController } from './profesionales.controller';
import { ProfesionalesService } from './profesionales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profesionale, Servicio, PreciosReferenciale,
      HorarioAtencion, Ubicacione, EnlaceProfesional, Verificacione,
    ]),
  ],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService],
  exports: [TypeOrmModule, ProfesionalesService],
})
export class ProfesionalesModule {}
