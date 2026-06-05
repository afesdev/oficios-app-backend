import { IsInt, IsString, MaxLength, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResenaDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  cliente_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  profesional_id: number;

  @ApiProperty({ example: 5, description: 'Puntuación de 1 a 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @ApiPropertyOptional({ example: 'Excelente servicio, muy recomendado.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}
