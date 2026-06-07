import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profesionale } from './profesional.entity';

@Entity('Verificaciones')
export class Verificacione {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  profesional_id: number;

  @Column({ length: 50 })
  tipo_documento: string;

  @Column({ length: 2083 })
  documento_url: string;

  @Column({ length: 2083, nullable: true })
  documento_trasero_url: string;

  @Column({ length: 2083, nullable: true })
  selfie_url: string;

  @Column({ length: 20, default: 'pendiente' })
  estado: string;

  @Column({ length: 255, nullable: true })
  notas_admin: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_solicitud: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_resolucion: Date;

  @OneToOne(() => Profesionale, (pro) => pro.verificacion)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
