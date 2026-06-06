import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profesionale } from './profesional.entity';

@Entity('Ubicaciones')
export class Ubicacione {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profesional_id: number;

  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 100 })
  ciudad: string;

  @Column({ length: 100, nullable: true })
  estado: string;

  @Column({ length: 100, default: 'Colombia' })
  pais: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud: number;

  @Column({ default: false })
  es_principal: boolean;

  @ManyToOne(() => Profesionale, (pro) => pro.ubicaciones)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
