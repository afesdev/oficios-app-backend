import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('NotificacionesPush')
export class NotificacionePush {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column({ length: 500 })
  token: string;

  @Column({ length: 10 })
  plataforma: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_registro: Date;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  ultimo_uso: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
