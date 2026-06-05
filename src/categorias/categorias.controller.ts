import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/public.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar categorías (público)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID (público)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles('admin', 'profesional')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear categoría' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar categoría (solo admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar categoría (solo admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
