import {
  Controller, Get, Post, Patch, Param, Body,
  ParseIntPipe, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam,
} from '@nestjs/swagger';

import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { ResolverPromocionDto } from './dto/resolver-promocion.dto';

import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@ApiTags('Promociones')
@ApiBearerAuth()
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly service: PromocionesService) {}

  // ──────────────────────────────────────────────────────────────────
  // PLANES (público — cualquiera puede ver qué planes existen)
  // ──────────────────────────────────────────────────────────────────

  @Get('planes')
  @Public()
  @ApiOperation({ summary: 'Lista los planes de promoción disponibles con precios en COP' })
  getPlanes() {
    return this.service.getPlanes();
  }

  // ──────────────────────────────────────────────────────────────────
  // FEED — Promociones activas para el Home (público)
  // ──────────────────────────────────────────────────────────────────

  @Get('activas')
  @Public()
  @ApiOperation({
    summary: 'Promociones activas para el feed del Home',
    description:
      'Retorna banners, perfiles y publicaciones patrocinadas vigentes. ' +
      'Ordenadas por plan (Premium → Pro → Básico). Registra impresiones automáticamente.',
  })
  getActivas() {
    return this.service.getActivas();
  }

  // ──────────────────────────────────────────────────────────────────
  // REGISTRAR CLIC (público — la app lo llama al tocar un banner)
  // ──────────────────────────────────────────────────────────────────

  @Patch(':id/clic')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registra un clic en una promoción (para estadísticas)' })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  registrarClic(@Param('id', ParseIntPipe) id: number) {
    return this.service.registrarClic(id);
  }

  // ──────────────────────────────────────────────────────────────────
  // CREAR PROMOCIÓN (profesional autenticado)
  // ──────────────────────────────────────────────────────────────────

  @Post()
  @Roles('profesional', 'admin')
  @ApiOperation({
    summary: 'Crear una nueva promoción',
    description:
      'El profesional elige tipo (banner/perfil/publicacion) y plan. ' +
      'La promoción queda en estado "pendiente_pago" hasta que se registre el pago.',
  })
  create(
    @CurrentUser() user: Usuario,
    @Body() dto: CreatePromocionDto,
  ) {
    const profesionalId = user.profesional?.id ?? (user as any).profesional_id;
    return this.service.create(profesionalId, dto);
  }

  // ──────────────────────────────────────────────────────────────────
  // REGISTRAR PAGO (profesional)
  // ──────────────────────────────────────────────────────────────────

  @Post(':id/pagar')
  @Roles('profesional', 'admin')
  @ApiOperation({
    summary: 'Registrar el pago de una promoción',
    description:
      'Cambia el estado a "pendiente_aprobacion". ' +
      'El admin debe aprobar manualmente para activarla.',
  })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  registrarPago(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Usuario,
    @Body() dto: RegistrarPagoDto,
  ) {
    const profesionalId = user.profesional?.id ?? (user as any).profesional_id;
    return this.service.registrarPago(id, profesionalId, dto);
  }

  // ──────────────────────────────────────────────────────────────────
  // CANCELAR (profesional cancela la suya)
  // ──────────────────────────────────────────────────────────────────

  @Patch(':id/cancelar')
  @Roles('profesional', 'admin')
  @ApiOperation({ summary: 'Cancelar una promoción propia (solo si está pendiente)' })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Usuario,
  ) {
    const profesionalId = user.profesional?.id ?? (user as any).profesional_id;
    return this.service.cancelar(id, profesionalId);
  }

  // ──────────────────────────────────────────────────────────────────
  // MIS PROMOCIONES (profesional ve las suyas)
  // ──────────────────────────────────────────────────────────────────

  @Get('mis-promociones')
  @Roles('profesional', 'admin')
  @ApiOperation({ summary: 'Lista todas las promociones del profesional autenticado con estadísticas' })
  getMisPromociones(@CurrentUser() user: Usuario) {
    const profesionalId = user.profesional?.id ?? (user as any).profesional_id;
    return this.service.getMisPromociones(profesionalId);
  }

  // ──────────────────────────────────────────────────────────────────
  // VER UNA PROMOCIÓN
  // ──────────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalle de una promoción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ──────────────────────────────────────────────────────────────────
  // ADMIN — Ver todas las promociones
  // ──────────────────────────────────────────────────────────────────

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] Lista todas las promociones, opcionalmente filtradas por estado' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado' })
  getAll(@Query('estado') estado?: string) {
    return this.service.getAll(estado);
  }

  // ──────────────────────────────────────────────────────────────────
  // ADMIN — Aprobar
  // ──────────────────────────────────────────────────────────────────

  @Patch(':id/aprobar')
  @Roles('admin')
  @ApiOperation({
    summary: '[Admin] Aprobar una promoción y activarla',
    description: 'Activa la promoción, aprueba el pago y calcula fecha_fin según el plan.',
  })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Usuario,
  ) {
    return this.service.aprobar(id, user.id);
  }

  // ──────────────────────────────────────────────────────────────────
  // ADMIN — Rechazar
  // ──────────────────────────────────────────────────────────────────

  @Patch(':id/rechazar')
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] Rechazar una promoción con motivo' })
  @ApiParam({ name: 'id', description: 'ID de la promoción' })
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Usuario,
    @Body() dto: ResolverPromocionDto,
  ) {
    return this.service.rechazar(id, user.id, dto);
  }

  // ──────────────────────────────────────────────────────────────────
  // ADMIN — Expirar vencidas manualmente
  // ──────────────────────────────────────────────────────────────────

  @Patch('admin/expirar-vencidas')
  @Roles('admin')
  @ApiOperation({
    summary: '[Admin] Marca como "finalizada" todas las promociones cuya fecha_fin ya pasó',
    description: 'Útil para ejecutar manualmente. En producción se puede conectar a un cron job.',
  })
  expirarVencidas() {
    return this.service.expirarVencidas().then((affected) => ({
      message: `${affected} promoción(es) marcada(s) como finalizada(s)`,
      affected,
    }));
  }
}
