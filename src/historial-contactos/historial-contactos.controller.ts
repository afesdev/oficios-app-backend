import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistorialContactosService } from './historial-contactos.service';
import { CreateHistorialContactoDto } from './dto/create-historial-contacto.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Historial de Contactos')
@Controller('historial-contactos')
export class HistorialContactosController {
  constructor(private readonly service: HistorialContactosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar contactos de un profesional' })
  findByProfesional(
    @Query('profesional_id', ParseIntPipe) profesionalId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByProfesional(profesionalId, pagination);
  }

  @Get('metricas/:profesionalId')
  @ApiOperation({ summary: 'Métricas de contactos (WhatsApp vs llamada)' })
  getMetrics(@Param('profesionalId', ParseIntPipe) profesionalId: number) {
    return this.service.getMetrics(profesionalId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar contacto' })
  create(@Body() dto: CreateHistorialContactoDto) {
    return this.service.create(dto);
  }
}
