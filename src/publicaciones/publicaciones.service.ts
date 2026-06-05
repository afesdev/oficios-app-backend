import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacione } from './publicacione.entity';
import { FotosPublicacione } from './fotos-publicacione.entity';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, PaginatedResult } from '../common/utils/paginate';
import { LikesService } from '../likes/likes.service';
import { ResenasService } from '../resenas/resenas.service';

@Injectable()
export class PublicacionesService {
  private readonly logger = new Logger(PublicacionesService.name);

  constructor(
    @InjectRepository(Publicacione)
    private readonly repo: Repository<Publicacione>,
    @InjectRepository(FotosPublicacione)
    private readonly fotosRepo: Repository<FotosPublicacione>,
    private readonly likesService: LikesService,
    private readonly resenasService: ResenasService,
  ) {}

  /** Enriquece una lista paginada de publicaciones con likes, user_liked y ratings (batch). */
  private async withLikes(result: PaginatedResult<Publicacione>, usuarioId?: number) {
    const ids = result.data.map((p) => p.id);
    const counts = await this.likesService.getCountsForPublicaciones(ids);

    let likedIds = new Set<number>();
    if (usuarioId) {
      const all = await this.likesService.getMisLikes(usuarioId);
      likedIds = new Set(all.filter((id) => ids.includes(id)));
    }

    const profIds = [...new Set(
      result.data.map((p) => (p.profesional as any)?.id).filter(Boolean) as number[]
    )];
    const ratings = await this.resenasService.getRatingsBatch(profIds);

    return {
      ...result,
      data: result.data.map((p) => {
        const profId = (p.profesional as any)?.id;
        const rating = profId ? ratings[profId] : undefined;
        return {
          ...p,
          likes_count: counts[p.id] ?? 0,
          user_liked: likedIds.has(p.id),
          promedio_resenas: rating?.promedio ?? 0,
          total_resenas: rating?.total ?? 0,
        };
      }),
    };
  }

  async findAll(pagination: PaginationDto, usuarioId?: number) {
    const result = await paginate(
      this.repo, pagination,
      undefined,
      { fecha_creacion: 'DESC' },
      { fotos: true, profesional: { usuario: true, categoria: true } },
    );
    return this.withLikes(result, usuarioId);
  }

  async findByProfesional(profesionalId: number, pagination: PaginationDto, usuarioId?: number) {
    const result = await paginate(
      this.repo, pagination,
      { profesional: { id: profesionalId } },
      { fecha_creacion: 'DESC' },
      { fotos: true },
    );
    return this.withLikes(result, usuarioId);
  }

  async findByQuery(q: string, pagination: PaginationDto, usuarioId?: number) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('pub')
      .leftJoinAndSelect('pub.fotos', 'fotos')
      .leftJoinAndSelect('pub.profesional', 'prof')
      .leftJoinAndSelect('prof.usuario', 'usr')
      .leftJoinAndSelect('prof.categoria', 'cat')
      .where(
        'pub.titulo LIKE :q OR usr.nombre_completo LIKE :q OR cat.nombre LIKE :q',
        { q: `%${q}%` },
      )
      .orderBy('pub.fecha_creacion', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    const result: PaginatedResult<Publicacione> = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
    return this.withLikes(result, usuarioId);
  }

  async findByCategoria(categoriaId: number, pagination: PaginationDto, usuarioId?: number) {
    const result = await paginate(
      this.repo, pagination,
      { profesional: { categoria: { id: categoriaId } } },
      { fecha_creacion: 'DESC' },
      { fotos: true, profesional: { usuario: true, categoria: true } },
    );
    return this.withLikes(result, usuarioId);
  }

  async findOne(id: number, usuarioId?: number) {
    const pub = await this.repo.findOneOrFail({
      where: { id },
      relations: { fotos: true, profesional: { usuario: true, categoria: true } },
    }).catch(() => {
      throw new NotFoundException('Publicación no encontrada');
    });

    const { liked, total_likes } = await this.likesService.getStatus(id, usuarioId);
    return { ...pub, likes_count: total_likes, user_liked: liked };
  }

  async create(dto: CreatePublicacioneDto) {
    const { fotos_urls, profesional_id, ...pubData } = dto;
    this.logger.log(`Creando publicación para profesional_id=${profesional_id}: "${pubData.titulo}"`);
    const pub = await this.repo.save({
      ...pubData,
      profesional: { id: profesional_id },
    } as any);

    if (fotos_urls && fotos_urls.length > 0) {
      const fotos = fotos_urls.map((url, i) => ({
        publicacion: pub,
        imagen_url: url,
        orden: i,
      }));
      await this.fotosRepo.insert(fotos as any);
      this.logger.log(`Guardadas ${fotos.length} fotos para publicación id=${pub.id}`);
    }

    this.logger.log(`Publicación creada: id=${pub.id}, profesional_id=${profesional_id}`);
    return this.findOne(pub.id);
  }

  async update(id: number, dto: UpdatePublicacioneDto) {
    const pub = await this.findOne(id);
    Object.assign(pub, dto);
    return this.repo.save(pub);
  }

  async remove(id: number) {
    const pub = await this.repo.findOneOrFail({ where: { id } })
      .catch(() => { throw new NotFoundException('Publicación no encontrada'); });
    this.logger.warn(`Publicación eliminada: id=${pub.id}, titulo="${pub.titulo}"`);
    return this.repo.remove(pub);
  }
}
