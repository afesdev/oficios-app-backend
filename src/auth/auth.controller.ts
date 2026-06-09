import { Controller, Post, Body, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FcmTokenDto } from './dto/fcm-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { CurrentUser } from './current-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  profile(@CurrentUser() user: Usuario) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  updateProfile(@CurrentUser() user: Usuario, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/profesional')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil profesional del usuario autenticado' })
  updateProfessionalProfile(@CurrentUser() user: Usuario, @Body() dto: UpdateProfessionalProfileDto) {
    return this.authService.updateProfessionalProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('fcm-token')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registrar token FCM para notificaciones push' })
  registrarFcmToken(@CurrentUser() user: Usuario, @Body() dto: FcmTokenDto) {
    return this.authService.registrarFcmToken(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fcm-tokens')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar tokens FCM del usuario' })
  getFcmTokens(@CurrentUser() user: Usuario) {
    return this.authService.getFcmTokens(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/profesional/ubicaciones/:id/visibilidad')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Activar o desactivar visibilidad en mapa de una ubicación' })
  toggleVisibilidadUbicacion(
    @CurrentUser() user: Usuario,
    @Param('id', ParseIntPipe) id: number,
    @Body('visible_en_mapa') visible: boolean,
  ) {
    return this.authService.toggleVisibilidadUbicacion(user.id, id, visible);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('fcm-tokens/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un token FCM' })
  deleteFcmToken(@CurrentUser() user: Usuario, @Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteFcmToken(id, user.id);
  }
}
