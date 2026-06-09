# Laburo API

Backend REST de Laburo, la plataforma de profesionales.

## Stack

- **NestJS** + **TypeScript**
- **TypeORM** — ORM
- **SQL Server** — base de datos
- **JWT** — autenticación
- **Firebase Admin** — FCM (notificaciones push) + Storage
- **Nodemailer** — envío de correos
- **Swagger** — documentación de API

## Scripts

```bash
npm run start:dev    # desarrollo con hot-reload
npm run build        # compilar
npm run start:prod   # producción
```

## Estructura

```
src/
├── auth/             # JWT, guards, decoradores
├── categorias/       # CRUD de categorías
├── common/           # Filtros, pipes, DTOs compartidos
├── denuncias/        # Denuncias de usuarios
├── favoritos/        # Favoritos de clientes
├── firebase/         # Firebase FCM + Storage
├── mail/             # Plantillas de correo
├── profesionales/    # Perfil profesional + verificación
├── promociones/      # Planes promocionales y pagos
├── publicaciones/    # Feed de publicaciones
├── resenas/          # Sistema de reseñas
├── uploads/          # Subida de archivos
└── usuarios/         # CRUD de usuarios
```

## API Docs

Disponible en `/api/swagger` (entorno dev).

## Variables de entorno

```
PORT=3000
DB_HOST=
DB_PORT=1433
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

## Endpoints principales

| Recurso | Descripción |
|---|---|
| `POST /auth/...` | Login, registro, refresh token |
| `GET /publicaciones` | Feed público (paginado) |
| `GET /profesionales` | Búsqueda de profesionales |
| `GET /categorias` | Listado de categorías |
| `POST /verificaciones/solicitar` | Solicitar verificación |
| `GET /verificaciones/pendientes` | Admin: pendientes |
| `PATCH /verificaciones/:id/revisar` | Admin: aprobar/rechazar |
| `CRUD /promociones` | Gestión de promociones |
| `POST /uploads/:folder` | Subir imágenes |
