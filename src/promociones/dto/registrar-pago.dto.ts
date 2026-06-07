import { IsEnum, IsInt, IsPositive, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { MetodoPago } from '../entities/pago-promocion.entity';

export class RegistrarPagoDto {
  @ApiProperty({ description: 'Monto pagado en COP (entero)' })
  @IsInt()
  @IsPositive()
  monto: number;

  @ApiProperty({ enum: ['tarjeta', 'nequi', 'pse', 'efectivo', 'manual'] })
  @IsEnum(['tarjeta', 'nequi', 'pse', 'transferencia', 'efectivo', 'manual'])
  metodo_pago: MetodoPago;

  @ApiPropertyOptional({ description: 'ID de referencia de la pasarela de pago' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  referencia_externa?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales del pago' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notas?: string;
}
