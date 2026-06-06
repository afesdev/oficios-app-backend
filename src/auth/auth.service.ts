import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../usuarios/usuario.entity';
import { TokenRecuperacione } from '../usuarios/token-recuperacione.entity';
import { Profesionale } from '../profesionales/profesional.entity';
import { AuditService } from '../auditoria/audit.service';
import { ProfesionalesService } from '../profesionales/profesionales.service';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Profesionale)
    private readonly profesionalRepo: Repository<Profesionale>,
    @InjectRepository(TokenRecuperacione)
    private readonly tokenRepo: Repository<TokenRecuperacione>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
    private readonly profesionalesService: ProfesionalesService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usuarioRepo.findOneBy({ email: dto.email });
    if (exists) throw new ConflictException('El email ya está registrado');

    const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));
    const password_hash = await bcrypt.hash(dto.password, rounds);
    const usuario = this.usuarioRepo.create({
      nombre_completo: dto.nombre_completo,
      email: dto.email,
      password_hash,
      telefono: dto.telefono,
      rol: dto.rol,
    });
    await this.usuarioRepo.save(usuario);

    if (usuario.rol === 'profesional') {
      const prof = this.profesionalRepo.create({
        usuario_id: usuario.id,
        categoria_id: 1,
        ciudad: 'Por definir',
      });
      await this.profesionalRepo.save(prof);
      this.logger.log(`Perfil profesional creado automáticamente: profesional_id=${prof.id}`);
    }

    this.mail.sendWelcome(usuario.email, usuario.nombre_completo).catch(() => {});

    this.logger.log(`Nuevo registro: id=${usuario.id}, nombre="${usuario.nombre_completo}", email="${usuario.email}", telefono="${usuario.telefono}", rol="${usuario.rol}"`);
    this.audit.log({
      usuarioId: usuario.id,
      tabla: 'Usuarios',
      registroId: usuario.id,
      accion: 'INSERT',
      valorNuevo: {
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });

    return this.generateToken(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOneBy({ email: dto.email });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, usuario.password_hash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    this.logger.log(`Inicio de sesión: id=${usuario.id}, email="${usuario.email}"`);
    this.audit.log({
      usuarioId: usuario.id,
      tabla: 'Usuarios',
      registroId: usuario.id,
      accion: 'LOGIN',
      valorNuevo: { evento: 'login', email: usuario.email },
    });

    return this.generateToken(usuario);
  }

  async getProfile(id: number) {
    return this.usuarioRepo.findOne({
      where: { id },
      relations: {
        profesional: {
          categoria: true,
          servicios: { preciosReferenciales: true },
          horariosAtencion: true,
          enlacesProfesionales: true,
          verificacion: true,
          ubicaciones: true,
        },
      },
    });
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== usuario.email) {
      const exists = await this.usuarioRepo.findOneBy({ email: dto.email });
      if (exists) throw new ConflictException('El email ya está en uso');
    }

    if (dto.password) {
      const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));
      dto['password_hash'] = await bcrypt.hash(dto.password, rounds);
      delete dto.password;
    }

    Object.assign(usuario, dto);
    await this.usuarioRepo.save(usuario);

    this.logger.log(`Perfil actualizado: id=${usuario.id}, nombre="${usuario.nombre_completo}"`);
    this.audit.log({
      usuarioId: id,
      tabla: 'Usuarios',
      registroId: id,
      accion: 'UPDATE',
      valorNuevo: {
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        telefono: usuario.telefono,
      },
    });

    return usuario;
  }

  async updateProfessionalProfile(usuarioId: number, dto: UpdateProfessionalProfileDto) {
    const profesional = await this.profesionalesService.findByUsuario(usuarioId);
    if (!profesional) throw new NotFoundException('Perfil profesional no encontrado');

    const { servicios, horarios, enlaces, ...basic } = dto;

    if (Object.keys(basic).length > 0) {
      Object.assign(profesional, basic);
      if (basic.categoria_id) {
        (profesional as any).categoria = { id: basic.categoria_id };
      }
      await this.profesionalesService['repo'].save(profesional);
    }

    if (servicios) {
      await this.profesionalesService['serviciosRepo'].delete({ profesional_id: profesional.id });
      if (servicios.length > 0) {
        await this.profesionalesService['serviciosRepo'].insert(
          servicios.map((s) => ({ ...s, profesional_id: profesional.id })),
        );
      }
    }

    if (horarios) {
      await this.profesionalesService['horariosRepo'].delete({ profesional_id: profesional.id });
      if (horarios.length > 0) {
        await this.profesionalesService['horariosRepo'].insert(
          horarios.map((h) => ({ ...h, profesional_id: profesional.id })),
        );
      }
    }

    if (enlaces) {
      await this.profesionalesService['enlacesRepo'].delete({ profesional_id: profesional.id });
      if (enlaces.length > 0) {
        await this.profesionalesService['enlacesRepo'].insert(
          enlaces.map((e) => ({ ...e, profesional_id: profesional.id })),
        );
      }
    }

    this.logger.log(`Perfil profesional actualizado: usuario=${usuarioId}`);
    this.audit.log({
      usuarioId,
      tabla: 'Profesionales',
      registroId: profesional.id,
      accion: 'UPDATE',
      valorNuevo: { ...basic, servicios, horarios, enlaces },
    });

    return this.profesionalesService.findByUsuario(usuarioId);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const usuario = await this.usuarioRepo.findOneBy({ email: dto.email });

    if (!usuario) {
      this.logger.warn(`Intento de recuperación para email no registrado: "${dto.email}"`);
      return { mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }

    await this.tokenRepo.update(
      { usuario_id: usuario.id, usado: false },
      { usado: true },
    );

    const raw = crypto.randomBytes(32).toString('hex');
    const expiresInMinutes = 60;
    const token = this.tokenRepo.create({
      usuario_id: usuario.id,
      token: raw,
      fecha_expiracion: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    });
    await this.tokenRepo.save(token);

    this.logger.log(`Token de recuperación generado: usuario=${usuario.id}, email="${usuario.email}", token=${raw}`);

    await this.mail.sendPasswordReset(usuario.email, usuario.nombre_completo, raw);

    this.audit.log({
      usuarioId: usuario.id,
      tabla: 'TokensRecuperacion',
      registroId: token.id,
      accion: 'INSERT',
      valorNuevo: { evento: 'forgot_password', email: usuario.email },
    });

    return { mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token = await this.tokenRepo.findOne({
      where: { token: dto.token, usado: false },
      relations: { usuario: true },
    });

    if (!token) {
      throw new BadRequestException('Token inválido o ya fue utilizado.');
    }

    if (token.fecha_expiracion < new Date()) {
      token.usado = true;
      await this.tokenRepo.save(token);
      throw new BadRequestException('El token ha expirado. Solicita una nueva recuperación.');
    }

    const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));
    token.usuario.password_hash = await bcrypt.hash(dto.password, rounds);
    await this.usuarioRepo.save(token.usuario);

    token.usado = true;
    await this.tokenRepo.save(token);

    this.logger.log(`Contraseña restablecida: usuario=${token.usuario.id}, email="${token.usuario.email}"`);

    this.audit.log({
      usuarioId: token.usuario.id,
      tabla: 'Usuarios',
      registroId: token.usuario.id,
      accion: 'UPDATE',
      valorNuevo: { evento: 'password_reset', email: token.usuario.email },
    });

    return { mensaje: 'Contraseña restablecida exitosamente.' };
  }

  private generateToken(usuario: Usuario) {
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    };
  }
}
