import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ResenasModule } from './resenas/resenas.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { HistorialContactosModule } from './historial-contactos/historial-contactos.module';
import { DenunciasModule } from './denuncias/denuncias.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { LikesModule } from './likes/likes.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UploadsModule } from './uploads/uploads.module';
import { PromocionesModule } from './promociones/promociones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: false,
        logging: config.get<string>('DB_LOGGING') === 'true',
        autoLoadEntities: true,
        extra: { trustServerCertificate: true },
      }),
    }),
    AuthModule,
    CategoriasModule,
    UsuariosModule,
    ProfesionalesModule,
    PublicacionesModule,
    ResenasModule,
    FavoritosModule,
    HistorialContactosModule,
    DenunciasModule,
    AuditoriaModule,
    LikesModule,
    FirebaseModule,
    UploadsModule,
    PromocionesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
