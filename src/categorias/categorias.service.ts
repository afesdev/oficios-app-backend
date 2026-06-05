import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, PaginatedResult } from '../common/utils/paginate';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  findAll(pagination: PaginationDto): Promise<PaginatedResult<Categoria>> {
    return paginate(this.repo, pagination, undefined, { nombre: 'ASC' });
  }

  findOne(id: number) {
    return this.repo.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Categoría no encontrada');
    });
  }

  create(dto: CreateCategoriaDto) {
    const categoria = this.repo.create(dto);
    return this.repo.save(categoria);
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    Object.assign(categoria, dto);
    return this.repo.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    return this.repo.remove(categoria);
  }
}
