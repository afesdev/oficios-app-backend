import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface PushPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class FirebaseFcmService {
  private readonly logger = new Logger(FirebaseFcmService.name);

  /** Envía una notificación push a un único token FCM */
  async sendToToken(payload: PushPayload): Promise<void> {
    try {
      await admin.messaging().send({
        token: payload.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data ?? {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'oficiosapp_default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });
    } catch (err) {
      this.logger.error(`Error enviando FCM a token ${payload.token.substring(0, 20)}…`, err);
    }
  }

  /** Envía a múltiples tokens (ej. todos los del usuario) */
  async sendToTokens(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<void> {
    if (!tokens.length) return;
    const sends = tokens.map((token) => this.sendToToken({ token, title, body, data }));
    await Promise.allSettled(sends);
  }
}
