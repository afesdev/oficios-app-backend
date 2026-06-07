import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import { Promocion } from './promocion.entity';

@Entity('PromocionPerfiles')
export class PromocionPerfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocion_id' })
  promocion_id: number;

  /** Frase opcional: "10 años de experiencia · Disponible ahora" */
  @Column({ name: 'mensaje_personalizado', length: 100, nullable: true })
  mensaje_personalizado: string;

  @OneToOne(() => Promocion, (p) => p.promo_perfil)
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;
}
