import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ToggleLikeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  publicacion_id: number;
}
