import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Favoritos')
@ApiBearerAuth()
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly service: FavoritosService) {}

  @Get(':clienteId')
  @ApiOperation({ summary: 'Listar favoritos de un cliente' })
  findByCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByCliente(clienteId, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar profesional a favoritos' })
  create(@Body() dto: CreateFavoritoDto) {
    return this.service.create(dto);
  }

  @Delete(':clienteId/:profesionalId')
  @ApiOperation({ summary: 'Eliminar profesional de favoritos' })
  remove(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('profesionalId', ParseIntPipe) profesionalId: number,
  ) {
    return this.service.remove(clienteId, profesionalId);
  }
}
