import {
  IsEnum, IsInt, IsPositive, IsOptional, IsString,
  MaxLength, IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TipoPromocion } from '../entities/promocion.entity';

export class CreatePromocionDto {
  @ApiProperty({ enum: ['banner', 'perfil', 'publicacion'], description: 'Tipo de promoción' })
  @IsEnum(['banner', 'perfil', 'publicacion'])
  tipo: TipoPromocion;

  @ApiProperty({ description: 'ID del plan contratado (1=Premium, 2=Pro, 3=Básico)' })
  @IsInt()
  @IsPositive()
  plan_id: number;

  // ── Campos para tipo = 'banner' ─────────────────────────────────────
  @ApiPropertyOptional({ description: 'URL de la imagen del banner (requerido si tipo=banner)' })
  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @ApiPropertyOptional({ description: 'Título del banner (máx 60 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  titulo?: string;

  @ApiPropertyOptional({ description: 'Descripción del banner (máx 120 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  descripcion?: string;

  @ApiPropertyOptional({
    description: "Destino al tocar el banner: 'perfil' o 'publicacion:{id}'",
    default: 'perfil',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  url_destino?: string;

  // ── Campos para tipo = 'publicacion' ────────────────────────────────
  @ApiPropertyOptional({ description: 'ID de la publicación a destacar (requerido si tipo=publicacion)' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  publicacion_id?: number;

  // ── Campos para tipo = 'perfil' ─────────────────────────────────────
  @ApiPropertyOptional({ description: 'Frase personalizada en la tarjeta de perfil (máx 100 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mensaje_personalizado?: string;
}
