import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Publicacione } from './publicacione.entity';

@Entity('FotosPublicaciones')
export class FotosPublicacione {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Publicacione, (pub) => pub.fotos)
  @JoinColumn({ name: 'publicacion_id' })
  publicacion: Publicacione;

  @Column({ length: 2083 })
  imagen_url: string;

  @Column({ type: 'tinyint', default: 0 })
  orden: number;
}
