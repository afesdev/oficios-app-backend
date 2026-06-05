import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoritoDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  cliente_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  profesional_id: number;
}
