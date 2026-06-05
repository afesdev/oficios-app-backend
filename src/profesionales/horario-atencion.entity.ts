import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profesionale } from './profesional.entity';

@Entity('HorariosAtencion')
export class HorarioAtencion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profesional_id: number;

  @Column({ type: 'tinyint' })
  dia_semana: number;

  @Column({ type: 'time' })
  hora_apertura: string;

  @Column({ type: 'time' })
  hora_cierre: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Profesionale, (pro) => pro.horariosAtencion)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
