import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ResolverPromocionDto {
  @ApiPropertyOptional({ description: 'Motivo del rechazo (solo requerido al rechazar)' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  motivo?: string;
}
