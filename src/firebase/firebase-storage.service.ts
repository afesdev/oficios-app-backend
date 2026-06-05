import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as admin from 'firebase-admin';
import type { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseStorageService {
  private readonly bucket: Bucket;
  private readonly logger = new Logger(FirebaseStorageService.name);

  constructor(private readonly config: ConfigService) {
    const serviceAccountJson = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    const bucketName = this.config.get<string>('FIREBASE_STORAGE_BUCKET');

    if (!serviceAccountJson || !bucketName) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON y FIREBASE_STORAGE_BUCKET son requeridos');
    }

    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: bucketName,
      });
    }

    this.bucket = admin.storage().bucket();
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
    userId: string = 'system',
  ): Promise<{ url: string; fileName: string }> {
    const ext = path.extname(file.originalname);
    const fileName = `uploads/${userId}/${folder}/${crypto.randomUUID()}${ext}`;
    const blob = this.bucket.file(fileName);

    await blob.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });

    await blob.makePublic();

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
    return { url: publicUrl, fileName };
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.bucket.file(fileName).delete();
    } catch (err) {
      this.logger.error(`Error al eliminar archivo ${fileName}`, err);
    }
  }
}
