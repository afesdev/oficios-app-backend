import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Reseñas')
@Controller('resenas')
export class ResenasController {
  constructor(private readonly service: ResenasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reseñas de un profesional' })
  findByProfesional(
    @Query('profesional_id', ParseIntPipe) profesionalId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByProfesional(profesionalId, pagination);
  }

  @Get('promedio/:profesionalId')
  @ApiOperation({ summary: 'Obtener puntuación promedio de un profesional' })
  getAverage(@Param('profesionalId', ParseIntPipe) profesionalId: number) {
    return this.service.getAverage(profesionalId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear reseña' })
  create(@Body() dto: CreateResenaDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar reseña' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
