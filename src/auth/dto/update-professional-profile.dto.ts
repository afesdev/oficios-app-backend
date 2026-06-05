import { IsInt, IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class ServicioDto {
  @ApiPropertyOptional({ example: 'Reparación de fugas' })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ example: 'Reparación de fugas de agua en tuberías' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  duracion_estimada_min?: number;
}

class HorarioDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt({ each: true })
  dia_semana: number;

  @ApiPropertyOptional({ example: '09:00' })
  @IsString()
  hora_apertura: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsString()
  hora_cierre: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

class EnlaceDto {
  @ApiPropertyOptional({ example: 'WhatsApp' })
  @IsString()
  @MaxLength(50)
  plataforma: string;

  @ApiPropertyOptional({ example: 'https://wa.me/5215551234567' })
  @IsString()
  @MaxLength(2083)
  url: string;
}

export class UpdateProfessionalProfileDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  categoria_id?: number;

  @ApiPropertyOptional({ example: 'Especialista con más de 10 años de experiencia.' })
  @IsOptional()
  @IsString()
  descripcion_perfil?: string;

  @ApiPropertyOptional({ example: 'https://tu-storage.com/fotos/perfil.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(2083)
  foto_perfil_url?: string;

  @ApiPropertyOptional({ example: 'Ciudad de México' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  disponibilidad_inmediata?: boolean;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cobertura_km?: number;

  @ApiPropertyOptional({ type: [ServicioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicioDto)
  servicios?: ServicioDto[];

  @ApiPropertyOptional({ type: [HorarioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horarios?: HorarioDto[];

  @ApiPropertyOptional({ type: [EnlaceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnlaceDto)
  enlaces?: EnlaceDto[];
}
