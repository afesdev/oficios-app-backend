import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DenunciasService } from './denuncias.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/public.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Denuncias')
@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly service: DenunciasService) {}

  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar denuncias (solo admin)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener denuncia por ID (solo admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear denuncia (público)' })
  create(@Body() dto: CreateDenunciaDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolver denuncia (solo admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDenunciaDto) {
    return this.service.update(id, dto);
  }
}
