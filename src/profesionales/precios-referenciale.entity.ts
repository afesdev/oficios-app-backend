import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Servicio } from './servicio.entity';

@Entity('PreciosReferenciales')
export class PreciosReferenciale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  servicio_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_min: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_max: number;

  @Column({ length: 3, default: 'MXN' })
  moneda: string;

  @Column({ length: 255, nullable: true })
  descripcion_precio: string;

  @ManyToOne(() => Servicio, (serv) => serv.preciosReferenciales)
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicio;
}
