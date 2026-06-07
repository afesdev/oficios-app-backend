import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class SolicitarVerificacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo_documento: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2083)
  documento_url: string;

  @IsString()
  @IsOptional()
  @MaxLength(2083)
  selfie_url?: string;
}
