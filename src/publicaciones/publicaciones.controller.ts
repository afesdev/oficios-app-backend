import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query, Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Public } from '../auth/public.decorator';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ResenasService } from '../resenas/resenas.service';
import { CreateResenaPublicacionDto } from '../resenas/dto/create-resena-publicacion.dto';

class PublicacionesQueryDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  profesional_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoria_id?: number;

  @IsOptional()
  @IsString()
  q?: string;
}

@ApiTags('Publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly service: PublicacionesService,
    private readonly resenasService: ResenasService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Feed público de publicaciones. Si el token JWT es válido, incluye user_liked por publicación.' })
  @ApiQuery({ name: 'profesional_id', required: false, type: Number })
  @ApiQuery({ name: 'categoria_id', required: false, type: Number })
  findAll(@Query() query: PublicacionesQueryDto, @Request() req: any) {
    const usuarioId: number | undefined = req.user?.id;
    const { profesional_id, categoria_id, q, ...pagination } = query;
    if (profesional_id) return this.service.findByProfesional(profesional_id, pagination, usuarioId);
    if (categoria_id) return this.service.findByCategoria(categoria_id, pagination, usuarioId);
    if (q) return this.service.findByQuery(q, pagination, usuarioId);
    return this.service.findAll(pagination, usuarioId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener publicación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.findOne(id, req.user?.id);
  }

  @Roles('profesional')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear publicación (solo profesional)' })
  create(@Body() dto: CreatePublicacioneDto) {
    return this.service.create(dto);
  }

  @Roles('profesional')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar publicación (solo profesional)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePublicacioneDto) {
    return this.service.update(id, dto);
  }

  @Roles('profesional')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar publicación (solo profesional)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ── Reseñas anidadas ─────────────────────────────────────────────────────

  @Get(':id/resenas')
  @Public()
  @ApiOperation({ summary: 'Listar reseñas de una publicación' })
  getResenas(@Param('id', ParseIntPipe) id: number, @Query() pagination: PaginationDto) {
    return this.resenasService.findByPublicacion(id, pagination);
  }

  @Post(':id/resenas')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear reseña en una publicación (autenticado)' })
  async createResena(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateResenaPublicacionDto,
    @Request() req: any,
  ) {
    const pub = await this.service.findOne(id);
    const profesionalId = (pub as any).profesional?.id ?? (pub as any).profesional_id;
    if (!profesionalId) throw new NotFoundException('No se encontró el profesional de esta publicación');
    return this.resenasService.createForPublicacion(id, req.user.id, dto, profesionalId);
  }
}
