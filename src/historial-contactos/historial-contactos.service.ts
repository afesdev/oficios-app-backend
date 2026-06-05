import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialContacto } from './historial-contacto.entity';
import { CreateHistorialContactoDto } from './dto/create-historial-contacto.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/paginate';

@Injectable()
export class HistorialContactosService {
  constructor(
    @InjectRepository(HistorialContacto)
    private readonly repo: Repository<HistorialContacto>,
  ) {}

  findByProfesional(profesionalId: number, pagination: PaginationDto) {
    return paginate(this.repo, pagination, { profesional_id: profesionalId }, { fecha_contacto: 'DESC' });
  }

  async getMetrics(profesionalId: number) {
    const result = await this.repo
      .createQueryBuilder('h')
      .select('h.tipo_contacto', 'tipo')
      .addSelect('COUNT(h.id)', 'total')
      .where('h.profesional_id = :id', { id: profesionalId })
      .groupBy('h.tipo_contacto')
      .getRawMany();
    return result;
  }

  create(dto: CreateHistorialContactoDto) {
    const record = this.repo.create(dto);
    return this.repo.save(record);
  }
}
