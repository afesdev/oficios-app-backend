import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.from = this.config.get<string>('MAIL_FROM', 'OfiApp <noreply@yourdomain.com>');
  }

  async sendPasswordReset(to: string, nombre: string, token: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Restablece tu contraseña — OfiApp',
      html: this.wrapLayout(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
          Recupera tu contraseña
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#6B7280;">
          Hola <strong style="color:#111827;">${nombre}</strong>, recibimos una solicitud
          para restablecer la contraseña de tu cuenta en OfiApp.
        </p>

        <p style="margin:0 0 16px;font-size:15px;color:#374151;">
          Copia el siguiente código y pégalo en la app en la pantalla de
          <strong>Restablecer contraseña</strong>:
        </p>

        <div style="background:#F3F4F6;border:2px dashed #D1D5DB;border-radius:10px;
                    padding:20px;margin:24px 0;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#9CA3AF;text-transform:uppercase;
                    letter-spacing:1px;font-weight:600;">Código de recuperación</p>
          <p style="margin:0;font-size:14px;font-family:monospace;color:#111827;
                    word-break:break-all;letter-spacing:1px;">${token}</p>
        </div>

        <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:6px;
                    padding:14px 16px;margin:24px 0;">
          <p style="margin:0;font-size:13px;color:#92400E;">
            ⏱ Este código expira en <strong>60 minutos</strong>.
          </p>
        </div>

        <p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;line-height:1.6;">
          Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña
          actual seguirá siendo la misma y nadie más tiene acceso a tu cuenta.
        </p>
      `),
    });

    if (error) {
      this.logger.error(`Error enviando correo de recuperación a ${to}: ${JSON.stringify(error)}`);
      throw new Error('No se pudo enviar el correo de recuperación.');
    }

    this.logger.log(`Correo de recuperación enviado a ${to}`);
  }

  async sendWelcome(to: string, nombre: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: '¡Bienvenido a OfiApp! 🎉',
      html: this.wrapLayout(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
          ¡Bienvenido, ${nombre}!
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#6B7280;">
          Tu cuenta en <strong style="color:#1E88E5;">OfiApp</strong> fue creada exitosamente.
          Estamos muy contentos de tenerte.
        </p>

        <div style="background:#F0F9FF;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#0369A1;">
            ¿Qué puedes hacer ahora?
          </p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:2;">
            <li>Explorar profesionales cerca de ti</li>
            <li>Publicar y compartir tu trabajo</li>
            <li>Guardar tus favoritos</li>
            <li>Conectar con clientes o profesionales</li>
          </ul>
        </div>

        <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
          Si no creaste esta cuenta, contáctanos respondiendo este correo
          y tomaremos las medidas necesarias de inmediato.
        </p>
      `),
    });

    if (error) {
      this.logger.error(`Error enviando bienvenida a ${to}: ${JSON.stringify(error)}`);
    }
  }

  /** Notifica al administrador que hay una nueva promoción esperando aprobación */
  async sendNuevaPromocion(opts: {
    adminEmail: string;
    profesionalNombre: string;
    profesionalEmail: string;
    tipo: string;
    planNombre: string;
    metodoPago: string;
    monto: number;
    promocionId: number;
  }): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: opts.adminEmail,
      subject: `🔔 Nueva promoción pendiente — ${opts.planNombre}`,
      html: this.wrapLayout(`
        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
          Nueva promoción pendiente de aprobación
        </h1>
        <p style="margin:0 0 20px;font-size:15px;color:#6B7280;">
          Un profesional ha registrado un pago y solicita aprobación.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;width:40%;">Profesional</td><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">${opts.profesionalNombre}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;">Correo</td><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">${opts.profesionalEmail}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;">Plan</td><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">${opts.planNombre}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;">Tipo</td><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;text-transform:capitalize;">${opts.tipo}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;">Método de pago</td><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">${opts.metodoPago.replace('_', ' ')}</td></tr>
          <tr><td style="padding:10px 0;font-weight:600;">Monto declarado</td><td style="padding:10px 0;font-weight:700;color:#1E88E5;">$${opts.monto.toLocaleString('es-CO')} COP</td></tr>
        </table>
        <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:6px;padding:14px 16px;margin:24px 0;">
          <p style="margin:0;font-size:13px;color:#92400E;">
            ⚡ ID de promoción: <strong>#${opts.promocionId}</strong><br/>
            Aprueba o rechaza con:<br/>
            <code>PATCH /promociones/${opts.promocionId}/aprobar</code>
          </p>
        </div>
      `),
    });
    if (error) this.logger.error(`Error enviando notificación de nueva promoción: ${JSON.stringify(error)}`);
    else this.logger.log(`Notificación de nueva promoción #${opts.promocionId} enviada a ${opts.adminEmail}`);
  }

  /** Notifica al profesional el resultado de su promoción (aprobada o rechazada) */
  async sendPromocionResuelta(opts: {
    to: string;
    nombre: string;
    aprobada: boolean;
    planNombre: string;
    tipo: string;
    motivo?: string;
    fechaFin?: Date;
  }): Promise<void> {
    const { aprobada } = opts;
    const accentColor = aprobada ? '#16A34A' : '#DC2626';
    const bgColor = aprobada ? '#F0FDF4' : '#FEF2F2';
    const emoji = aprobada ? '🎉' : '❌';
    const estado = aprobada ? 'APROBADA' : 'RECHAZADA';

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: opts.to,
      subject: `${emoji} Tu promoción fue ${estado.toLowerCase()} — OfiApp`,
      html: this.wrapLayout(`
        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
          ${emoji} Tu promoción fue ${estado.toLowerCase()}
        </h1>
        <p style="margin:0 0 20px;font-size:15px;color:#6B7280;">
          Hola <strong style="color:#111827;">${opts.nombre}</strong>,
          ${aprobada
            ? 'tu promoción ha sido <strong>aprobada</strong> y ya está activa en la app.'
            : 'tu promoción fue <strong>rechazada</strong>.'}
        </p>
        <div style="background:${bgColor};border-left:4px solid ${accentColor};border-radius:6px;padding:16px 20px;margin:0 0 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${accentColor};">Estado: ${estado}</p>
          <p style="margin:0;font-size:13px;color:#374151;">Plan: <strong>${opts.planNombre}</strong> · Tipo: <strong>${opts.tipo}</strong></p>
          ${aprobada && opts.fechaFin ? `<p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Activa hasta: <strong>${opts.fechaFin.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></p>` : ''}
          ${!aprobada && opts.motivo ? `<p style="margin:8px 0 0;font-size:13px;color:#374151;">Motivo: ${opts.motivo}</p>` : ''}
        </div>
        <p style="font-size:14px;color:#374151;">
          ${aprobada
            ? 'Revisa las estadísticas de tu promoción en <strong>Mis Promociones</strong> en la app.'
            : 'Puedes crear una nueva promoción desde <strong>Mis Promociones</strong> en la app.'}
        </p>
      `),
    });
    if (error) this.logger.error(`Error enviando resolución de promoción a ${opts.to}: ${JSON.stringify(error)}`);
    else this.logger.log(`Resolución de promoción enviada a ${opts.to} → ${estado}`);
  }

  private wrapLayout(content: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="background:#1E88E5;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                Ofi<span style="color:#BBDEFB;">App</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 12px 12px;padding:20px 32px;
                        text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                © ${new Date().getFullYear()} OfiApp. Todos los derechos reservados.<br/>
                Este es un correo automático, por favor no respondas directamente.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}
