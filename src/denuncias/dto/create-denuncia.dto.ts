import { IsInt, IsString, MaxLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDenunciaDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  denunciante_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  profesional_id: number;

  @ApiProperty({ example: 'mal_servicio', enum: ['spam', 'fotos_falsas', 'informacion_incorrecta', 'mal_servicio', 'estafa', 'otro'] })
  @IsString()
  @IsIn(['spam', 'fotos_falsas', 'informacion_incorrecta', 'mal_servicio', 'estafa', 'otro'])
  motivo: string;

  @ApiPropertyOptional({ example: 'No se presentó a la cita acordada.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
