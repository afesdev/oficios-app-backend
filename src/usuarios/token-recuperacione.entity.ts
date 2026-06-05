import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('TokensRecuperacion')
export class TokenRecuperacione {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column({ length: 255 })
  token: string;

  @Column({ type: 'datetime' })
  fecha_expiracion: Date;

  @Column({ default: false })
  usado: boolean;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_creacion: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
