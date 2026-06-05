import {
  Controller, Post, Get, Body, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@ApiTags('Likes')
@Controller('likes-publicaciones')
export class LikesController {
  constructor(private readonly service: LikesService) {}

  /**
   * POST /likes-publicaciones/toggle
   * Alterna like/unlike en una publicación.
   * Requiere autenticación (JWT).
   */
  @Post('toggle')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dar o quitar "me gusta" a una publicación' })
  toggle(
    @CurrentUser() user: Usuario,
    @Body() dto: ToggleLikeDto,
  ) {
    return this.service.toggle(user.id, dto.publicacion_id);
  }

  /**
   * GET /likes-publicaciones/mis-likes
   * Lista los IDs de publicaciones que le gustan al usuario autenticado.
   */
  @Get('mis-likes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'IDs de publicaciones que le gustan al usuario (para precarga del feed)' })
  getMisLikes(@CurrentUser() user: Usuario) {
    return this.service.getMisLikes(user.id);
  }

  /**
   * GET /likes-publicaciones/publicacion/:id
   * Estado público de likes de una publicación.
   * Si se pasa usuario_id como query param, incluye si ese usuario dio like.
   */
  @Get('publicacion/:id')
  @Public()
  @ApiOperation({ summary: 'Obtener total de likes (y estado del usuario si se provee usuario_id)' })
  @ApiQuery({ name: 'usuario_id', required: false, type: Number })
  getStatus(
    @Param('id', ParseIntPipe) publicacionId: number,
    @Query('usuario_id') usuarioId?: string,
  ) {
    return this.service.getStatus(
      publicacionId,
      usuarioId ? Number(usuarioId) : undefined,
    );
  }
}
