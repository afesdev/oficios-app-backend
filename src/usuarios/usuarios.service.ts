import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, PaginatedResult } from '../common/utils/paginate';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  findAll(pagination: PaginationDto): Promise<PaginatedResult<Usuario>> {
    return paginate(this.repo, pagination, undefined, { fecha_registro: 'DESC' });
  }

  findOne(id: number) {
    return this.repo.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Usuario no encontrado');
    });
  }

  create(dto: CreateUsuarioDto) {
    const usuario = this.repo.create(dto);
    return this.repo.save(usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    Object.assign(usuario, dto);
    return this.repo.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    return this.repo.remove(usuario);
  }
}
