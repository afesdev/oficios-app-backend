import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Profesionale } from '../profesionales/profesional.entity';

@Entity('HistorialContactos')
export class HistorialContacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  cliente_id: number;

  @Column()
  profesional_id: number;

  @Column({ length: 20 })
  tipo_contacto: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_contacto: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Profesionale, (pro) => pro.historialContactos)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
