import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { ProfesionalesService } from './profesionales.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { SearchProfesionalDto } from './dto/search-profesional.dto';
import { SearchCercaDto } from './dto/search-cerca.dto';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

@ApiTags('Profesionales')
@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly service: ProfesionalesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar profesionales (con filtros y paginación)' })
  findAll(@Query() query: SearchProfesionalDto) {
    if (query.q || query.ciudad || query.categoria) {
      return this.service.search(query, query.q, query.ciudad, query.categoria);
    }
    return this.service.findAll(query);
  }

  @Get('ciudades-frecuentes')
  @Public()
  @ApiOperation({ summary: 'Ciudades con más profesionales registrados' })
  async getFrequentCities() {
    const data = await this.service.getFrequentCities();
    return { data };
  }

  @Get('autocomplete')
  @Public()
  @ApiOperation({ summary: 'Autocomplete para búsqueda (nombres, categorías, ciudades)' })
  async autocomplete(@Query('q') q: string) {
    return this.service.autocomplete(q || '');
  }

  @Get('cerca')
  @Public()
  @ApiOperation({ summary: 'Profesionales cercanos por geolocalización' })
  searchNearby(@Query() query: SearchCercaDto) {
    return this.service.searchNearby(query.lat, query.lng, query.radio_km, query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener profesional con todas sus relaciones' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil profesional' })
  create(@Body() dto: CreateProfesionalDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil profesional' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfesionalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar perfil profesional' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // --- Servicios ---

  @Post(':id/servicios')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar un servicio al profesional' })
  addServicio(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.service.addServicio(id, dto);
  }

  @Patch('servicios/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un servicio' })
  updateServicio(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.service.updateServicio(id, dto);
  }

  @Delete('servicios/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un servicio' })
  removeServicio(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeServicio(id);
  }

  // ─── Precios Referenciales ──────────────────────────────────────

  @Get('servicios/:servicioId/precios')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar precios de un servicio' })
  getPrecios(@Param('servicioId', ParseIntPipe) servicioId: number) {
    return this.service.getPrecios(servicioId);
  }

  @Post('precios')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar precio referencial' })
  createPrecio(@Body() dto: CreatePrecioDto) {
    return this.service.createPrecio(dto);
  }

  @Patch('precios/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar precio referencial' })
  updatePrecio(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrecioDto) {
    return this.service.updatePrecio(id, dto);
  }

  @Delete('precios/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar precio referencial' })
  removePrecio(@Param('id', ParseIntPipe) id: number) {
    return this.service.removePrecio(id);
  }
}
