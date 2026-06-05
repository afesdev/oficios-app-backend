import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123def456...', description: 'Token de recuperación' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'nuevaPassword123', description: 'Nueva contraseña (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
