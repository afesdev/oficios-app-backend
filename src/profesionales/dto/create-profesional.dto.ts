import { IsInt, IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfesionalDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  categoria_id: number;

  @ApiPropertyOptional({ example: 'Especialista con más de 10 años de experiencia.' })
  @IsOptional()
  @IsString()
  descripcion_perfil?: string;

  @ApiPropertyOptional({ example: 'https://tu-storage.com/fotos/perfil.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(2083)
  foto_perfil_url?: string;

  @ApiProperty({ example: 'Ciudad de México' })
  @IsString()
  @MaxLength(100)
  ciudad: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cobertura_km?: number;
}
