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
    const deepLink = `oficiosapp://reset-password?token=${token}`;

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
          Toca el botón desde tu celular para crear una nueva contraseña:
        </p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${deepLink}"
             style="display:inline-block;padding:14px 36px;background:#1E88E5;color:#ffffff;
                    border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;
                    letter-spacing:0.3px;box-shadow:0 4px 14px rgba(30,136,229,0.35);">
            Restablecer contraseña
          </a>
        </div>

        <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:6px;
                    padding:14px 16px;margin:24px 0;">
          <p style="margin:0;font-size:13px;color:#92400E;">
            ⏱ Este enlace expira en <strong>60 minutos</strong>.
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
