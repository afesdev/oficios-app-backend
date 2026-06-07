import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Promocion } from './entities/promocion.entity';
import { PlanPromocion } from './entities/plan-promocion.entity';
import { PromocionBanner } from './entities/promocion-banner.entity';
import { PromocionPublicacion } from './entities/promocion-publicacion.entity';
import { PromocionPerfil } from './entities/promocion-perfil.entity';
import { PagoPromocion } from './entities/pago-promocion.entity';
import { NotificacionePush } from '../usuarios/notificacione-push.entity';

import { CreatePromocionDto } from './dto/create-promocion.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { ResolverPromocionDto } from './dto/resolver-promocion.dto';
import { AuditService } from '../auditoria/audit.service';
import { MailService } from '../mail/mail.service';
import { FirebaseFcmService } from '../firebase/firebase-fcm.service';

@Injectable()
export class PromocionesService {
  private readonly logger = new Logger(PromocionesService.name);

  constructor(
    @InjectRepository(Promocion)
    private readonly promoRepo: Repository<Promocion>,

    @InjectRepository(PlanPromocion)
    private readonly planRepo: Repository<PlanPromocion>,

    @InjectRepository(PromocionBanner)
    private readonly bannerRepo: Repository<PromocionBanner>,

    @InjectRepository(PromocionPublicacion)
    private readonly promoPublicacionRepo: Repository<PromocionPublicacion>,

    @InjectRepository(PromocionPerfil)
    private readonly promoPerfilRepo: Repository<PromocionPerfil>,

    @InjectRepository(PagoPromocion)
    private readonly pagoRepo: Repository<PagoPromocion>,

    @InjectRepository(NotificacionePush)
    private readonly fcmRepo: Repository<NotificacionePush>,

    private readonly audit: AuditService,
    private readonly mail: MailService,
    private readonly fcm: FirebaseFcmService,
    private readonly config: ConfigService,
  ) {}

  // ────────────────────────────────────────────────────────────────────
  // PLANES
  // ────────────────────────────────────────────────────────────────────

  /** Lista los planes activos ordenados de mayor a menor (Premium primero) */
  getPlanes(): Promise<PlanPromocion[]> {
    return this.planRepo.find({
      where: { activo: true },
      order: { posicion_preferente: 'ASC' },
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // FEED — Promociones activas para el Home
  // ────────────────────────────────────────────────────────────────────

  /**
   * Retorna todas las promociones activas y vigentes para el feed.
   * Ordenadas por posición del plan (Premium primero), luego por fecha.
   * Incluye el detalle específico según el tipo (banner / perfil / publicacion).
   */
  async getActivas() {
    const ahora = new Date();

    const promos = await this.promoRepo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.plan', 'plan')
      .innerJoinAndSelect('p.profesional', 'prof')
      .innerJoinAndSelect('prof.usuario', 'usuario')
      .innerJoinAndSelect('prof.categoria', 'categoria')
      .leftJoinAndSelect('prof.ubicaciones', 'ubicaciones')
      .leftJoinAndSelect('p.banner', 'banner')
      .leftJoinAndSelect('p.promo_publicacion', 'promo_pub')
      .leftJoinAndSelect('promo_pub.publicacion', 'publicacion')
      .leftJoinAndSelect('publicacion.fotos', 'fotos')
      .leftJoinAndSelect('p.promo_perfil', 'promo_perfil')
      .where('p.activo = :activo', { activo: true })
      .andWhere('p.estado = :estado', { estado: 'activa' })
      .andWhere('p.fecha_fin > :ahora', { ahora })
      .orderBy('plan.posicion_preferente', 'ASC')
      .addOrderBy('p.fecha_inicio', 'ASC')
      .getMany();

    // Registrar impresiones en background (sin await para no bloquear)
    if (promos.length > 0) {
      this.promoRepo
        .createQueryBuilder()
        .update(Promocion)
        .set({ impresiones: () => 'impresiones + 1' })
        .whereInIds(promos.map((p) => p.id))
        .execute()
        .catch(() => {});
    }

    return promos;
  }

  // ────────────────────────────────────────────────────────────────────
  // CREAR PROMOCIÓN
  // ────────────────────────────────────────────────────────────────────

  async create(
    profesionalId: number,
    usuarioId: number,
    dto: CreatePromocionDto,
  ): Promise<Promocion> {
    // Validar plan
    const plan = await this.planRepo.findOneBy({ id: dto.plan_id, activo: true });
    if (!plan) throw new NotFoundException('Plan de promoción no encontrado o inactivo');

    // Validar campos requeridos según tipo
    this.validarCamposPorTipo(dto);

    // Verificar que no tenga ya una promoción activa del mismo tipo
    const promoActiva = await this.promoRepo.findOne({
      where: {
        profesional_id: profesionalId,
        tipo: dto.tipo,
        estado: 'activa',
      },
    });
    if (promoActiva) {
      throw new BadRequestException(
        `Ya tienes una promoción de tipo "${dto.tipo}" activa. Espera a que finalice o cancélala primero.`,
      );
    }

    // Verificar slots disponibles para este plan
    const ocupados = await this.promoRepo.countBy({
      plan_id: dto.plan_id,
      estado: 'activa',
      activo: true,
    });
    if (ocupados >= plan.slots_disponibles) {
      throw new BadRequestException(
        `El plan ${plan.nombre} está lleno (${plan.slots_disponibles} slots). Intenta con otro plan o espera disponibilidad.`,
      );
    }

    // Crear cabecera
    const promo = this.promoRepo.create({
      profesional_id: profesionalId,
      plan_id: dto.plan_id,
      tipo: dto.tipo,
      estado: 'pendiente_pago',
      activo: false,
    });
    await this.promoRepo.save(promo);

    // Crear detalle según tipo
    await this.crearDetalle(promo.id, dto);

    this.audit.log({
      usuarioId,
      tabla: 'Promociones',
      registroId: promo.id,
      accion: 'INSERT',
      valorNuevo: { tipo: dto.tipo, plan_id: dto.plan_id },
    });

    return this.findOne(promo.id);
  }

  // ────────────────────────────────────────────────────────────────────
  // REGISTRAR PAGO
  // ────────────────────────────────────────────────────────────────────

  async registrarPago(
    promocionId: number,
    profesionalId: number,
    usuarioId: number,
    dto: RegistrarPagoDto,
  ): Promise<{ pago: PagoPromocion; promocion: Promocion }> {
    const promo = await this.findOne(promocionId);

    if (promo.profesional_id !== profesionalId) {
      throw new ForbiddenException('No tienes permiso para pagar esta promoción');
    }
    if (promo.estado !== 'pendiente_pago') {
      throw new BadRequestException(
        `No se puede registrar pago en estado "${promo.estado}"`,
      );
    }

    // Validar que el monto coincida con el plan
    const plan = await this.planRepo.findOneByOrFail({ id: promo.plan_id });
    if (dto.monto !== plan.precio) {
      throw new BadRequestException(
        `El monto debe ser $${plan.precio.toLocaleString('es-CO')} COP`,
      );
    }

    // Guardar pago
    const pago = this.pagoRepo.create({
      promocion_id: promocionId,
      profesional_id: profesionalId,
      monto: dto.monto,
      metodo_pago: dto.metodo_pago,
      referencia_externa: dto.referencia_externa,
      notas: dto.notas,
      estado: 'pendiente',
    });
    await this.pagoRepo.save(pago);

    // Pasar promoción a pendiente_aprobacion (update directo para no afectar relaciones cargadas)
    await this.promoRepo.update(promocionId, { estado: 'pendiente_aprobacion' });
    promo.estado = 'pendiente_aprobacion';

    this.audit.log({
      usuarioId,
      tabla: 'PagosPromociones',
      registroId: pago.id,
      accion: 'INSERT',
      valorNuevo: { monto: dto.monto, metodo_pago: dto.metodo_pago },
    });

    // Notificar al administrador por correo (en background)
    const promoConRelaciones = await this.findOne(promo.id);
    const adminEmail = this.config.get<string>('ADMIN_EMAIL', 'andresfelipeespitiasanchez@gmail.com');
    this.mail.sendNuevaPromocion({
      adminEmail,
      profesionalNombre: promoConRelaciones.profesional?.usuario?.nombre_completo ?? 'Profesional',
      profesionalEmail: promoConRelaciones.profesional?.usuario?.email ?? '',
      tipo: promo.tipo,
      planNombre: plan.nombre,
      metodoPago: dto.metodo_pago,
      monto: dto.monto,
      promocionId: promo.id,
    }).catch((e) => this.logger.error('Error notificando admin por nueva promoción', e));

    return { pago, promocion: promo };
  }

  // ────────────────────────────────────────────────────────────────────
  // APROBAR (admin)
  // ────────────────────────────────────────────────────────────────────

  async aprobar(promocionId: number, adminId: number): Promise<Promocion> {
    const promo = await this.findOne(promocionId);

    if (promo.estado !== 'pendiente_aprobacion') {
      throw new BadRequestException(
        `Solo se puede aprobar una promoción en estado "pendiente_aprobacion". Estado actual: "${promo.estado}"`,
      );
    }

    const plan = await this.planRepo.findOneByOrFail({ id: promo.plan_id });
    const ahora = new Date();
    const fechaFin = new Date(ahora);
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias);

    // Aprobar el pago pendiente o crear uno automático si no existe
    const updateResult = await this.pagoRepo
      .createQueryBuilder()
      .update(PagoPromocion)
      .set({ estado: 'aprobado', fecha_pago: ahora })
      .where('promocion_id = :id AND estado = :estado', {
        id: promocionId,
        estado: 'pendiente',
      })
      .execute();

    if (updateResult.affected === 0) {
      const pago = this.pagoRepo.create({
        promocion_id: promocionId,
        profesional_id: promo.profesional_id,
        monto: plan.precio,
        metodo_pago: 'manual',
        estado: 'aprobado',
        fecha_pago: ahora,
      });
      await this.pagoRepo.save(pago);
    }

    // Activar promoción (update directo para no afectar relaciones cargadas)
    await this.promoRepo.update(promocionId, {
      estado: 'activa',
      activo: true,
      aprobado_por: adminId,
      fecha_inicio: ahora,
      fecha_fin: fechaFin,
    });
    promo.estado = 'activa';
    promo.activo = true;
    promo.aprobado_por = adminId;
    promo.fecha_inicio = ahora;
    promo.fecha_fin = fechaFin;

    this.audit.log({
      usuarioId: adminId,
      tabla: 'Promociones',
      registroId: promocionId,
      accion: 'UPDATE',
      valorAnterior: { estado: 'pendiente_aprobacion' },
      valorNuevo: { estado: 'activa', fecha_inicio: ahora, fecha_fin: fechaFin },
    });

    const promoFinal = await this.findOne(promocionId);

    // Notificar al profesional por email y FCM (en background)
    const usuario = promoFinal.profesional?.usuario;
    if (usuario) {
      this.mail.sendPromocionResuelta({
        to: usuario.email,
        nombre: usuario.nombre_completo,
        aprobada: true,
        planNombre: plan.nombre,
        tipo: promo.tipo,
        fechaFin,
      }).catch((e) => this.logger.error('Error enviando email aprobación', e));

      this.fcmRepo.find({ where: { usuario_id: usuario.id, activo: true } }).then((tokens) => {
        const tkns = tokens.map((t) => t.token);
        this.fcm.sendToTokens(tkns, '🎉 ¡Tu promoción está activa!',
          `Tu promoción de tipo "${promo.tipo}" (${plan.nombre}) ya aparece en la app.`,
          { tipo: 'promocion_aprobada', promocion_id: String(promocionId) },
        ).catch((e) => this.logger.error('Error enviando FCM aprobación', e));
      });
    }

    return promoFinal;
  }

  // ────────────────────────────────────────────────────────────────────
  // RECHAZAR (admin)
  // ────────────────────────────────────────────────────────────────────

  async rechazar(
    promocionId: number,
    adminId: number,
    dto: ResolverPromocionDto,
  ): Promise<Promocion> {
    const promo = await this.findOne(promocionId);

    if (!['pendiente_aprobacion', 'pendiente_pago'].includes(promo.estado)) {
      throw new BadRequestException(
        `No se puede rechazar una promoción en estado "${promo.estado}"`,
      );
    }

    // Rechazar el pago si existe
    await this.pagoRepo
      .createQueryBuilder()
      .update(PagoPromocion)
      .set({ estado: 'rechazado', notas: dto.motivo })
      .where('promocion_id = :id AND estado = :estado', {
        id: promocionId,
        estado: 'pendiente',
      })
      .execute();

    await this.promoRepo.update(promocionId, {
      estado: 'rechazada',
      activo: false,
      aprobado_por: adminId,
    });
    promo.estado = 'rechazada';
    promo.activo = false;
    promo.aprobado_por = adminId;

    this.audit.log({
      usuarioId: adminId,
      tabla: 'Promociones',
      registroId: promocionId,
      accion: 'UPDATE',
      valorAnterior: { estado: promo.estado },
      valorNuevo: { estado: 'rechazada', motivo: dto.motivo },
    });

    const promoFinal = await this.findOne(promocionId);
    const planRechazado = await this.planRepo.findOneBy({ id: promo.plan_id });

    // Notificar al profesional por email y FCM (en background)
    const usuario = promoFinal.profesional?.usuario;
    if (usuario) {
      this.mail.sendPromocionResuelta({
        to: usuario.email,
        nombre: usuario.nombre_completo,
        aprobada: false,
        planNombre: planRechazado?.nombre ?? 'Plan',
        tipo: promo.tipo,
        motivo: dto.motivo,
      }).catch((e) => this.logger.error('Error enviando email rechazo', e));

      this.fcmRepo.find({ where: { usuario_id: usuario.id, activo: true } }).then((tokens) => {
        const tkns = tokens.map((t) => t.token);
        this.fcm.sendToTokens(tkns, '❌ Promoción rechazada',
          dto.motivo ?? 'Tu solicitud de promoción fue rechazada. Contacta al soporte para más información.',
          { tipo: 'promocion_rechazada', promocion_id: String(promocionId) },
        ).catch((e) => this.logger.error('Error enviando FCM rechazo', e));
      });
    }

    return promoFinal;
  }

  // ────────────────────────────────────────────────────────────────────
  // CANCELAR (profesional cancela la suya)
  // ────────────────────────────────────────────────────────────────────

  async cancelar(
    promocionId: number,
    profesionalId: number,
    usuarioId: number,
  ): Promise<Promocion> {
    const promo = await this.findOne(promocionId);

    if (promo.profesional_id !== profesionalId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta promoción');
    }
    if (!['pendiente_pago', 'pendiente_aprobacion'].includes(promo.estado)) {
      throw new BadRequestException(
        `Solo puedes cancelar una promoción en estado "pendiente_pago" o "pendiente_aprobacion"`,
      );
    }

    await this.promoRepo.update(promocionId, { estado: 'cancelada', activo: false });
    promo.estado = 'cancelada';
    promo.activo = false;

    this.audit.log({
      usuarioId,
      tabla: 'Promociones',
      registroId: promocionId,
      accion: 'UPDATE',
      valorAnterior: { estado: 'pendiente_pago' },
      valorNuevo: { estado: 'cancelada' },
    });

    return promo;
  }

  // ────────────────────────────────────────────────────────────────────
  // REGISTRAR CLIC
  // ────────────────────────────────────────────────────────────────────

  async registrarClic(promocionId: number): Promise<void> {
    await this.promoRepo
      .createQueryBuilder()
      .update(Promocion)
      .set({ clics: () => 'clics + 1' })
      .where('id = :id', { id: promocionId })
      .execute();
  }

  // ────────────────────────────────────────────────────────────────────
  // MIS PROMOCIONES (panel del profesional)
  // ────────────────────────────────────────────────────────────────────

  getMisPromociones(profesionalId: number): Promise<Promocion[]> {
    if (!profesionalId) return Promise.resolve([]);   // usuario sin perfil profesional
    return this.promoRepo.find({
      where: { profesional_id: profesionalId },
      relations: {
        plan: true,
        banner: true,
        promo_publicacion: { publicacion: true },
        promo_perfil: true,
        pagos: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // TODAS LAS PROMOCIONES (admin)
  // ────────────────────────────────────────────────────────────────────

  getAll(estado?: string): Promise<Promocion[]> {
    const where: any = {};
    if (estado) where.estado = estado;

    return this.promoRepo.find({
      where,
      relations: {
        plan: true,
        profesional: { usuario: true },
        pagos: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // EXPIRAR PROMOCIONES VENCIDAS (job manual o cron)
  // ────────────────────────────────────────────────────────────────────

  async expirarVencidas(): Promise<number> {
    const result = await this.promoRepo
      .createQueryBuilder()
      .update(Promocion)
      .set({ estado: 'finalizada', activo: false })
      .where('estado = :estado', { estado: 'activa' })
      .andWhere('fecha_fin < :ahora', { ahora: new Date() })
      .execute();

    return result.affected ?? 0;
  }

  // ────────────────────────────────────────────────────────────────────
  // HELPERS PRIVADOS
  // ────────────────────────────────────────────────────────────────────

  async findOne(id: number): Promise<Promocion> {
    const promo = await this.promoRepo.findOne({
      where: { id },
      relations: {
        plan: true,
        profesional: { usuario: true, categoria: true },
        banner: true,
        promo_publicacion: { publicacion: true },
        promo_perfil: true,
        pagos: true,
      },
    });
    if (!promo) throw new NotFoundException(`Promoción #${id} no encontrada`);
    return promo;
  }

  private validarCamposPorTipo(dto: CreatePromocionDto) {
    if (dto.tipo === 'banner' && !dto.imagen_url) {
      throw new BadRequestException('imagen_url es requerida para tipo "banner"');
    }
    if (dto.tipo === 'publicacion' && !dto.publicacion_id) {
      throw new BadRequestException('publicacion_id es requerido para tipo "publicacion"');
    }
  }

  private async crearDetalle(promocionId: number, dto: CreatePromocionDto) {
    if (dto.tipo === 'banner') {
      await this.bannerRepo.save(
        this.bannerRepo.create({
          promocion_id: promocionId,
          imagen_url: dto.imagen_url!,
          titulo: dto.titulo,
          descripcion: dto.descripcion,
          url_destino: dto.url_destino ?? 'perfil',
        }),
      );
    } else if (dto.tipo === 'publicacion') {
      await this.promoPublicacionRepo.save(
        this.promoPublicacionRepo.create({
          promocion_id: promocionId,
          publicacion_id: dto.publicacion_id!,
        }),
      );
    } else if (dto.tipo === 'perfil') {
      await this.promoPerfilRepo.save(
        this.promoPerfilRepo.create({
          promocion_id: promocionId,
          mensaje_personalizado: dto.mensaje_personalizado,
        }),
      );
    }
  }
}
