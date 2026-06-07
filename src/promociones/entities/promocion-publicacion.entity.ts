import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn,
} from 'typeorm';
import { Promocion } from './promocion.entity';
import { Publicacione } from '../../publicaciones/publicacione.entity';

@Entity('PromocionPublicaciones')
export class PromocionPublicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocion_id' })
  promocion_id: number;

  @Column({ name: 'publicacion_id' })
  publicacion_id: number;

  @OneToOne(() => Promocion, (p) => p.promo_publicacion)
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;

  @ManyToOne(() => Publicacione)
  @JoinColumn({ name: 'publicacion_id' })
  publicacion: Publicacione;
}
