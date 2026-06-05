import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('Auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  usuario_id: number;

  @Column({ length: 100 })
  tabla_afectada: string;

  @Column()
  registro_id: number;

  @Column({ length: 20 })
  accion: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  valor_anterior: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  valor_nuevo: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
