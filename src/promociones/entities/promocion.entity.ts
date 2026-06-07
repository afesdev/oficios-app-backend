import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Profesionale } from '../../profesionales/profesional.entity';
import { Usuario } from '../../usuarios/usuario.entity';
import { PlanPromocion } from './plan-promocion.entity';
import { PromocionBanner } from './promocion-banner.entity';
import { PromocionPublicacion } from './promocion-publicacion.entity';
import { PromocionPerfil } from './promocion-perfil.entity';
import { PagoPromocion } from './pago-promocion.entity';

export type TipoPromocion = 'banner' | 'perfil' | 'publicacion';
export type EstadoPromocion =
  | 'pendiente_pago'
  | 'pendiente_aprobacion'
  | 'activa'
  | 'rechazada'
  | 'finalizada'
  | 'cancelada';

@Entity('Promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profesional_id' })
  profesional_id: number;

  @Column({ name: 'plan_id' })
  plan_id: number;

  @Column({ length: 20 })
  tipo: TipoPromocion;

  @Column({ length: 30, default: 'pendiente_pago' })
  estado: EstadoPromocion;

  /** Derivado del estado para simplificar queries del feed */
  @Column({ type: 'bit', default: false })
  activo: boolean;

  @Column({ name: 'aprobado_por', nullable: true })
  aprobado_por: number;

  @Column({ name: 'fecha_inicio', type: 'datetime', nullable: true })
  fecha_inicio: Date;

  @Column({ name: 'fecha_fin', type: 'datetime', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'int', default: 0 })
  impresiones: number;

  @Column({ type: 'int', default: 0 })
  clics: number;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  // ── Relaciones ──────────────────────────────────────────────────────
  @ManyToOne(() => Profesionale)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;

  @ManyToOne(() => PlanPromocion, (plan) => plan.promociones)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanPromocion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'aprobado_por' })
  aprobador: Usuario;

  @OneToOne(() => PromocionBanner, (b) => b.promocion, { nullable: true })
  banner: PromocionBanner;

  @OneToOne(() => PromocionPublicacion, (p) => p.promocion, { nullable: true })
  promo_publicacion: PromocionPublicacion;

  @OneToOne(() => PromocionPerfil, (p) => p.promocion, { nullable: true })
  promo_perfil: PromocionPerfil;

  @OneToMany(() => PagoPromocion, (pago) => pago.promocion)
  pagos: PagoPromocion[];
}
