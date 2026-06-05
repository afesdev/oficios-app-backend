import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Profesionale } from '../profesionales/profesional.entity';
import { FotosPublicacione } from './fotos-publicacione.entity';

@Entity('Publicaciones')
export class Publicacione {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profesionale, (pro) => pro.publicaciones)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;

  @Column({ length: 150 })
  titulo: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  descripcion: string;

  @Column({ length: 2083 })
  imagen_url: string;

  @Column({ length: 2083, nullable: true })
  video_url: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_creacion: Date;

  @OneToMany(() => FotosPublicacione, (foto) => foto.publicacion)
  fotos: FotosPublicacione[];
}
