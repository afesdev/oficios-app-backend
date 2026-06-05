import { Repository, FindOptionsWhere, FindOptionsOrder, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function paginate<T extends ObjectLiteral>(
  repo: Repository<T>,
  pagination: PaginationDto,
  where?: FindOptionsWhere<T>,
  order?: FindOptionsOrder<T>,
  relations?: any,
): Promise<PaginatedResult<T>> {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 20;
  const skip = (page - 1) * limit;

  const [data, total] = await repo.findAndCount({
    where,
    order: order ?? { id: 'DESC' } as any,
    skip,
    take: limit,
    relations,
  });

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
