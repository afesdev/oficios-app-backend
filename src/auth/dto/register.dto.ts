import { IsEmail, IsString, MinLength, MaxLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  nombre_completo: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'miPassword123', description: 'Contraseña (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty({ example: '5512345678', description: 'Teléfono de contacto' })
  @IsString()
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ example: 'cliente', enum: ['cliente', 'profesional'] })
  @IsString()
  @IsIn(['cliente', 'profesional'])
  rol: string;
}

export class LoginDto {
  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'miPassword123' })
  @IsString()
  password: string;
}
