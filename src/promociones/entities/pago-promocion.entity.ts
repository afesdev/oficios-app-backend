import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Promocion } from './promocion.entity';
import { Profesionale } from '../../profesionales/profesional.entity';

export type MetodoPago = 'tarjeta' | 'nequi' | 'pse' | 'efectivo' | 'manual';
export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'reembolsado';

@Entity('PagosPromociones')
export class PagoPromocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocion_id' })
  promocion_id: number;

  @Column({ name: 'profesional_id' })
  profesional_id: number;

  /** Monto en COP como entero */
  @Column({ type: 'int' })
  monto: number;

  @Column({ name: 'metodo_pago', length: 20, default: 'manual' })
  metodo_pago: MetodoPago;

  /** ID devuelto por pasarela externa (Wompi, Stripe, etc.) */
  @Column({ name: 'referencia_externa', length: 255, nullable: true })
  referencia_externa: string;

  @Column({ length: 20, default: 'pendiente' })
  estado: EstadoPago;

  @Column({ length: 255, nullable: true })
  notas: string;

  @Column({ name: 'fecha_pago', type: 'datetime', nullable: true })
  fecha_pago: Date;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  @ManyToOne(() => Promocion, (p) => p.pagos)
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;

  @ManyToOne(() => Profesionale)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
