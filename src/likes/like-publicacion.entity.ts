import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Publicacione } from '../publicaciones/publicacione.entity';

@Entity('LikesPublicaciones')
export class LikePublicacion {
  @PrimaryColumn()
  usuario_id: number;

  @PrimaryColumn()
  publicacion_id: number;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fecha_like: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Publicacione)
  @JoinColumn({ name: 'publicacion_id' })
  publicacion: Publicacione;
}
