import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDenunciaDto {
  @ApiPropertyOptional({ example: 'revisando', enum: ['pendiente', 'revisando', 'aprobado', 'rechazado'] })
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'revisando', 'aprobado', 'rechazado'])
  estado?: string;

  @ApiPropertyOptional({ example: 'Se revisó la evidencia y se procede con la suspensión.' })
  @IsOptional()
  @IsString()
  notas_admin?: string;
}
