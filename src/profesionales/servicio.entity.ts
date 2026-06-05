import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Profesionale } from './profesional.entity';
import { PreciosReferenciale } from './precios-referenciale.entity';

@Entity('Servicios')
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profesional_id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  duracion_estimada_min: number;

  @ManyToOne(() => Profesionale, (pro) => pro.servicios)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;

  @OneToMany(() => PreciosReferenciale, (pre) => pre.servicio)
  preciosReferenciales: PreciosReferenciale[];
}
