import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './favorito.entity';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/paginate';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly repo: Repository<Favorito>,
  ) {}

  findByCliente(clienteId: number, pagination: PaginationDto) {
    return paginate(
      this.repo, pagination,
      { cliente_id: clienteId },
      { fecha_guardado: 'DESC' },
      { profesional: { categoria: true, usuario: true } },
    );
  }

  async create(dto: CreateFavoritoDto) {
    const exists = await this.repo.findOneBy({
      cliente_id: dto.cliente_id,
      profesional_id: dto.profesional_id,
    });
    if (exists) throw new ConflictException('Ya está en favoritos');
    const fav = this.repo.create(dto);
    return this.repo.save(fav);
  }

  async remove(clienteId: number, profesionalId: number) {
    const fav = await this.repo.findOneByOrFail({
      cliente_id: clienteId,
      profesional_id: profesionalId,
    }).catch(() => {
      throw new NotFoundException('Favorito no encontrado');
    });
    return this.repo.remove(fav);
  }
}
