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

@ApiTags('Verificaciones')
@Controller('verificaciones')
export class VerificacionesController {
  constructor(
    @InjectRepository(Verificacione)
    private readonly repo: Repository<Verificacione>,
    private readonly mail: MailService,
  ) {}

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

    // Notificar al profesional
    if (saved.profesional?.usuario?.email) {
      this.mail.sendVerificacionResuelta({
        to: saved.profesional.usuario.email,
        nombre: saved.profesional.usuario.nombre_completo,
        estado: saved.estado,
        notasAdmin: saved.notas_admin ?? undefined,
      }).catch(() => {});
    }

    return saved;
  }
}
