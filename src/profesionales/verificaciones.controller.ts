import {
  Controller, Get, Post, Patch, Param, Body, UseGuards, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verificacione } from './verificacione.entity';
import { SolicitarVerificacionDto } from './dto/solicitar-verificacion.dto';
import { RevisarVerificacionDto } from './dto/revisar-verificacion.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';
import { MailService } from '../mail/mail.service';
import { FirebaseFcmService } from '../firebase/firebase-fcm.service';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';

@ApiTags('Verificaciones')
@Controller('verificaciones')
export class VerificacionesController {
  constructor(
    @InjectRepository(Verificacione)
    private readonly repo: Repository<Verificacione>,
    @InjectRepository(NotificacionePush)
    private readonly pushRepo: Repository<NotificacionePush>,
    private readonly mail: MailService,
    private readonly fcm: FirebaseFcmService,
  ) {}

  private async notificarVerificacion(usuarioId: number, estado: string): Promise<void> {
    const pushRows = await this.pushRepo.find({ where: { usuario_id: usuarioId, activo: true } });
    const tokens = pushRows.map((r) => r.token);
    if (!tokens.length) return;

    const aprobado = estado === 'aprobado';
    this.fcm.sendToTokens(
      tokens,
      aprobado ? '✅ Verificación aprobada' : '❌ Verificación rechazada',
      aprobado
        ? 'Tu identidad ha sido verificada exitosamente.'
        : 'Tu solicitud de verificación fue rechazada. Revisa las notas en tu perfil.',
      { tipo: 'verificacion', estado },
    ).catch(() => {});
  }

  @Post('solicitar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Solicitar verificación (profesional)' })
  async solicitar(
    @Body() dto: SolicitarVerificacionDto,
    @CurrentUser() user: Usuario,
  ) {
    const profId = user.profesional?.id;
    if (!profId) throw new NotFoundException('No tienes perfil profesional');

    const existente = await this.repo.findOneBy({ profesional_id: profId });
    if (existente) {
      Object.assign(existente, dto, { estado: 'pendiente', fecha_resolucion: null });
      return this.repo.save(existente);
    }

    const nueva = this.repo.create({ ...dto, profesional_id: profId });
    return this.repo.save(nueva);
  }

  @Get('mi-verificacion')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estado de mi verificación (profesional)' })
  async miVerificacion(@CurrentUser() user: Usuario) {
    const profId = user.profesional?.id;
    if (!profId) throw new NotFoundException('No tienes perfil profesional');
    const v = await this.repo.findOneBy({ profesional_id: profId });
    if (!v) return null;
    return v;
  }

  @Get('pendientes')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar verificaciones pendientes (admin)' })
  async pendientes() {
    return this.repo.find({
      where: { estado: 'pendiente' },
      relations: { profesional: { usuario: true, categoria: true } },
      order: { fecha_solicitud: 'ASC' },
    });
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las verificaciones (admin)' })
  async todas() {
    return this.repo.find({
      relations: { profesional: { usuario: true, categoria: true } },
      order: { fecha_solicitud: 'DESC' },
    });
  }

  @Patch(':id/revisar')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar/rechazar verificación (admin)' })
  async revisar(
    @Param('id') id: number,
    @Body() dto: RevisarVerificacionDto,
  ) {
    const v = await this.repo.findOne({
      where: { id },
      relations: { profesional: { usuario: true } },
    });
    if (!v) throw new NotFoundException('Verificación no encontrada');

    v.estado = dto.estado;
    v.notas_admin = (dto.notas_admin ?? null) as any;
    v.fecha_resolucion = new Date();
    const saved = await this.repo.save(v);

    // Notificar al profesional por email y push (fire-and-forget)
    if (saved.profesional?.usuario) {
      const u = saved.profesional.usuario;
      if (u.email) {
        this.mail.sendVerificacionResuelta({
          to: u.email,
          nombre: u.nombre_completo,
          estado: saved.estado,
          notasAdmin: saved.notas_admin ?? undefined,
        }).catch(() => {});
      }
      this.notificarVerificacion(u.id, saved.estado);
    }

    return saved;
  }
}
