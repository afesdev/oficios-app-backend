import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistorialContactoDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  cliente_id?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  profesional_id: number;

  @ApiProperty({ example: 'whatsapp', enum: ['whatsapp', 'llamada'] })
  @IsString()
  @IsIn(['whatsapp', 'llamada'])
  tipo_contacto: string;
}
