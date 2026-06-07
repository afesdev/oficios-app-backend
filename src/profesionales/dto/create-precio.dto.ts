import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrecioDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  servicio_id: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  precio_min: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_max?: number;

  @ApiPropertyOptional({ example: 'COP' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  moneda?: string;

  @ApiPropertyOptional({ example: 'Precio por metro cuadrado' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion_precio?: string;
}
