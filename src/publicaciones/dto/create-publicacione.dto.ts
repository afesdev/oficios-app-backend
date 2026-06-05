import { IsString, IsInt, IsOptional, MaxLength, IsArray, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublicacioneDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  profesional_id: number;

  @ApiProperty({ example: 'Instalación de piso cerámico 40x40' })
  @IsString()
  @MaxLength(150)
  titulo: string;

  @ApiPropertyOptional({ example: 'Trabajo realizado en Colonia Del Valle, cliente satisfecho.' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'https://tu-storage.com/fotos/trabajo1.jpg' })
  @IsString()
  @MaxLength(2083)
  imagen_url: string;

  @ApiPropertyOptional({ example: 'https://tu-storage.com/videos/demo.mp4' })
  @IsOptional()
  @IsString()
  @MaxLength(2083)
  video_url?: string;

  @ApiPropertyOptional({ example: ['https://...foto1.jpg', 'https://...foto2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  fotos_urls?: string[];
}
