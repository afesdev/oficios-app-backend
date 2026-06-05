import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Profesionale } from '../profesionales/profesional.entity';

@Entity('Favoritos')
export class Favorito {
  @PrimaryColumn()
  cliente_id: number;

  @PrimaryColumn()
  profesional_id: number;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_guardado: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Profesionale, (pro) => pro.favoritos)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesionale;
}
