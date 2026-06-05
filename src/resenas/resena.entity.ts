import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Profesionale } from '../profesionales/profesional.entity';

@Entity('Resenas')
export class Resena {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente_id: number;

  @Column()
  profesional_id: number;

  @Column({ nullable: true })
  publicacion_id: number;

  @Column({ type: 'int' })
  puntuacion: number;

  @Column({ length: 500, nullable: true })
  comentario: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_creacion: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Profesionale, (pro) => pro.resenas)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
