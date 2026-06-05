import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany,
} from 'typeorm';
import { Profesionale } from '../profesionales/profesional.entity';
import { TokenRecuperacione } from './token-recuperacione.entity';

@Entity('Usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre_completo: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 20, default: 'cliente' })
  rol: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_registro: Date;

  @Column({ length: 20, default: 'activo' })
  estado: string;

  @OneToOne(() => Profesionale, (profesional) => profesional.usuario)
  profesional: Profesionale;

  @OneToMany(() => TokenRecuperacione, (token) => token.usuario)
  tokensRecuperacion: TokenRecuperacione[];
}
