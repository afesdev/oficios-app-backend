import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { ProfesionalesService } from './profesionales.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { SearchProfesionalDto } from './dto/search-profesional.dto';

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
}
