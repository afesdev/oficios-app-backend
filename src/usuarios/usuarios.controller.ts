import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar usuarios (solo admin)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener usuario por ID (solo admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear usuario (solo admin)' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar usuario (solo admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
