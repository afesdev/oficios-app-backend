import { IsInt, IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class PrecioDto {
  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  precio_min: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  precio_max?: number;

  @ApiPropertyOptional({ example: 'Por servicio' })
  @IsOptional()
  @IsString()
  descripcion_precio?: string;
}

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

  @ApiPropertyOptional({ type: [PrecioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrecioDto)
  precios?: PrecioDto[];
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

class UbicacionDto {
  @ApiPropertyOptional({ example: 'Cra 15 #85-60' })
  @IsString()
  @MaxLength(255)
  direccion: string;

  @ApiPropertyOptional({ example: 'Bogotá' })
  @IsString()
  @MaxLength(100)
  ciudad: string;

  @ApiPropertyOptional({ example: 'Cundinamarca' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  estado?: string;

  @ApiPropertyOptional({ example: 'Colombia', default: 'Colombia' })
  @IsString()
  @MaxLength(100)
  pais: string;

  @ApiPropertyOptional({ example: 4.7110 })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional({ example: -74.0721 })
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  es_principal?: boolean;

  @ApiPropertyOptional({ example: true, default: true, description: 'Si está en true, la ubicación aparece en el mapa público' })
  @IsOptional()
  @IsBoolean()
  visible_en_mapa?: boolean;
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

  @ApiPropertyOptional({ type: [UbicacionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UbicacionDto)
  ubicaciones?: UbicacionDto[];
}
