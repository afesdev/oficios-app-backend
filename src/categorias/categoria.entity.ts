import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Profesionale } from '../profesionales/profesional.entity';

@Entity('Categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ length: 2083, nullable: true })
  icono_url: string;

  @OneToMany(() => Profesionale, (profesional) => profesional.categoria)
  profesionales: Profesionale[];
}
