import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseStorageService } from './firebase-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class FirebaseModule {}
