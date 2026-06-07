import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { Promocion } from './promocion.entity';

@Entity('PlanesPromocion')
export class PlanPromocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  /** Precio en COP como entero (sin decimales) */
  @Column({ type: 'int' })
  precio: number;

  @Column({ name: 'duracion_dias', type: 'tinyint' })
  duracion_dias: number;

  /** 1 = Premium (primero), 2 = Pro, 3 = Básico */
  @Column({ name: 'posicion_preferente', type: 'tinyint' })
  posicion_preferente: number;

  @Column({ name: 'slots_disponibles', type: 'tinyint', default: 10 })
  slots_disponibles: number;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  @OneToMany(() => Promocion, (p) => p.plan)
  promociones: Promocion[];
}
