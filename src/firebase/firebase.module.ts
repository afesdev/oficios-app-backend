import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseStorageService } from './firebase-storage.service';
import { FirebaseFcmService } from './firebase-fcm.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FirebaseStorageService, FirebaseFcmService],
  exports: [FirebaseStorageService, FirebaseFcmService],
})
export class FirebaseModule {}
