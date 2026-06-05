import { IsString, IsEmail, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(150)
  nombre_completo: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  password_hash: string;

  @IsString()
  @MaxLength(20)
  telefono: string;

  @IsOptional()
  @IsString()
  @IsIn(['cliente', 'profesional'])
  rol?: string;

  @IsOptional()
  @IsString()
  @IsIn(['activo', 'suspendido', 'baneado'])
  estado?: string;
}
