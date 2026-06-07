import { IsIn, IsString, IsOptional, MaxLength } from 'class-validator';

export class RevisarVerificacionDto {
  @IsString()
  @IsIn(['aprobado', 'rechazado'])
  estado: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  notas_admin?: string;
}
