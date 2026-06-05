import { IsString, MaxLength, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Plomero / Fontanero' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ example: 'Expertos en tuberías, griferías y fugas de agua.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @ApiPropertyOptional({ example: 'https://tu-storage.com/icons/plumber.png' })
  @IsOptional()
  @IsUrl()
  @MaxLength(2083)
  icono_url?: string;
}
