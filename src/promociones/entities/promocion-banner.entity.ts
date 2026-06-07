import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import { Promocion } from './promocion.entity';

@Entity('PromocionBanners')
export class PromocionBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocion_id' })
  promocion_id: number;

  @Column({ name: 'imagen_url', length: 2083 })
  imagen_url: string;

  @Column({ length: 60, nullable: true })
  titulo: string;

  @Column({ length: 120, nullable: true })
  descripcion: string;

  /** 'perfil' | 'publicacion:{id}' */
  @Column({ name: 'url_destino', length: 255, default: 'perfil' })
  url_destino: string;

  @OneToOne(() => Promocion, (p) => p.banner)
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;
}
