import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'juan@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;
}
