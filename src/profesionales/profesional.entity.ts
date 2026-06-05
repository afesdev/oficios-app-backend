import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Publicacione } from '../publicaciones/publicacione.entity';
import { Resena } from '../resenas/resena.entity';
import { Favorito } from '../favoritos/favorito.entity';
import { HistorialContacto } from '../historial-contactos/historial-contacto.entity';
import { Servicio } from './servicio.entity';
import { HorarioAtencion } from './horario-atencion.entity';
import { Ubicacione } from './ubicacione.entity';
import { EnlaceProfesional } from './enlace-profesional.entity';
import { Verificacione } from './verificacione.entity';
import { Denuncia } from '../denuncias/denuncia.entity';

@Entity('Profesionales')
export class Profesionale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column()
  categoria_id: number;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  descripcion_perfil: string;

  @Column({ length: 2083, nullable: true })
  foto_perfil_url: string;

  @Column({ length: 100 })
  ciudad: string;

  @Column({ default: true })
  disponibilidad_inmediata: boolean;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  cobertura_km: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.profesionales)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @OneToOne(() => Usuario, (usuario) => usuario.profesional)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Publicacione, (pub) => pub.profesional)
  publicaciones: Publicacione[];

  @OneToMany(() => Resena, (resena) => resena.profesional)
  resenas: Resena[];

  @OneToMany(() => Favorito, (fav) => fav.profesional)
  favoritos: Favorito[];

  @OneToMany(() => HistorialContacto, (hc) => hc.profesional)
  historialContactos: HistorialContacto[];

  @OneToMany(() => Servicio, (serv) => serv.profesional)
  servicios: Servicio[];

  @OneToMany(() => HorarioAtencion, (hor) => hor.profesional)
  horariosAtencion: HorarioAtencion[];

  @OneToMany(() => Ubicacione, (ub) => ub.profesional)
  ubicaciones: Ubicacione[];

  @OneToMany(() => EnlaceProfesional, (enl) => enl.profesional)
  enlacesProfesionales: EnlaceProfesional[];

  @OneToOne(() => Verificacione, (ver) => ver.profesional)
  verificacion: Verificacione;

  @OneToMany(() => Denuncia, (den) => den.profesional)
  denuncias: Denuncia[];
}
