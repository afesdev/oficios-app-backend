import { IsString, IsNotEmpty, IsOptional, IsInt, Min, MaxLength, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrecioReferencialeDto {
  @IsNumber()
  @Min(0)
  precio_min: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_max?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  moneda?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion_precio?: string;
}

export class CreateServicioDto {
  @IsInt()
  @IsNotEmpty()
  profesional_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracion_estimada_min?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrecioReferencialeDto)
  @IsOptional()
  precios?: CreatePrecioReferencialeDto[];
}
