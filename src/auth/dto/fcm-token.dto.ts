import { IsString, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FcmTokenDto {
  @ApiProperty({ description: 'Token FCM del dispositivo', example: 'cXXXXXXX...' })
  @IsString()
  @MaxLength(500)
  token: string;

  @ApiProperty({ description: 'Plataforma del dispositivo', enum: ['android', 'ios', 'web'] })
  @IsIn(['android', 'ios', 'web'])
  plataforma: 'android' | 'ios' | 'web';
}
