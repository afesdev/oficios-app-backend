import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profesionale } from './profesional.entity';

@Entity('EnlacesProfesionales')
export class EnlaceProfesional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profesional_id: number;

  @Column({ length: 50 })
  plataforma: string;

  @Column({ length: 2083 })
  url: string;

  @ManyToOne(() => Profesionale, (pro) => pro.enlacesProfesionales)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
