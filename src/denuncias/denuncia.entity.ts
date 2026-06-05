import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Profesionale } from '../profesionales/profesional.entity';

@Entity('Denuncias')
export class Denuncia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  denunciante_id: number;

  @Column()
  profesional_id: number;

  @Column({ length: 50 })
  motivo: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ length: 20, default: 'pendiente' })
  estado: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_creacion: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_resolucion: Date;

  @Column({ length: 255, nullable: true })
  notas_admin: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'denunciante_id' })
  denunciante: Usuario;

  @ManyToOne(() => Profesionale, (pro) => pro.denuncias)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
