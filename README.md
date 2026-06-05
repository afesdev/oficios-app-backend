# 🛠️ OficiosApp - Portafolio Móvil de Profesionales

¡Bienvenido a **OficiosApp**! Una plataforma móvil moderna diseñada para conectar a clientes con profesionales de servicios técnicos y especializados (plomeros, carpinteros, electricistas, médicos, mecánicos, etc.) a través de un **enfoque 100% visual y directo**. 

A diferencia de los directorios de empleo tradicionales basados en texto, esta aplicación funciona como un "Instagram de profesionales", donde el valor principal radica en el **portafolio fotográfico de trabajos reales** realizados por los prestadores de servicios, facilitando la confianza y el contacto inmediato vía WhatsApp o llamada telefónica.

---

## 🎯 Objetivo del Proyecto

Democratizar y formalizar el acceso al trabajo independiente en América Latina, brindando a los profesionales técnicos una herramienta gratuita y profesional para exhibir su talento visualmente, y ofreciendo a los ciudadanos un motor de búsqueda geolocalizado, transparente y seguro para contratar servicios de confianza.

---

## 📱 Arquitectura del Sistema y Stack Tecnológico

El proyecto está construido bajo una arquitectura desacoplada, limpia y de alto rendimiento:

* **Frontend (Aplicación Móvil):** **Flutter & Dart** (Compilación nativa para Android e iOS con una sola base de código e interfaces fluidas).
* **Backend (API REST):** **NestJS (TypeScript)** (Arquitectura empresarial, robusta, escalable y modular basada en Node.js).
* **Base de Datos:** **SQL Server** (Modelo relacional de alta velocidad optimizado con índices no agrupados para búsquedas inmediatas).
* **Infraestructura de Servidores:** Hospedado en la nube administrada de **Cloud Clusters** (servidores independientes para la API y la Base de Datos).

---

## 🚀 Funcionalidades Principales

### 👥 1. Sistema de Doble Perfil
* **Perfil Cliente:** Registro rápido para explorar, buscar, guardar profesionales favoritos y calificar servicios.
* **Perfil Profesional:** Configuración de categoría (profesión), descripción comercial, área de cobertura (ciudad), datos de contacto y disponibilidad en tiempo real.

### 🔍 2. Buscador Inteligente y Geolocalización
* Filtrado avanzado por **Profesión / Categoría** combinada con la **Ciudad** del usuario para mostrar únicamente perfiles con cobertura local.
* Índices optimizados en base de datos para garantizar respuestas en pocos milisegundos.

### 📸 3. Portafolio Visual (El Corazón de la App)
* Módulo de publicaciones tipo *feed* donde el profesional puede subir fotos de sus proyectos terminados o procesos de "Antes y Después" con descripciones detalladas.
* Almacenamiento optimizado: Las imágenes se almacenan externamente y en la base de datos solo se indexan las URLs nativas de alta velocidad.

### 📞 4. Contacto Directo Sin Fricciones
* Botones de acción inmediata para **"Llamar ahora"** o **"Enviar WhatsApp"** integrados directamente con las aplicaciones nativas del teléfono del cliente, eliminando la necesidad de chats internos complejos.

### ⭐️ 5. Confianza, Seguridad y Métricas (Fases Avanzadas)
* **Sistema de Reseñas:** Calificaciones de 1 a 5 estrellas y comentarios auditables de clientes reales.
* **Métricas de Rendimiento:** Panel privado para el profesional donde puede ver cuántos clicks o intenciones de contacto ha recibido gracias a la app.
* **Verificación de Identidad:** Módulo de carga de documentos de identidad para obtener la insignia de "Perfil Verificado".

---

## 🗄️ Estructura del Modelo de Datos (SQL Server)

El núcleo relacional de la base de datos está compuesto por las siguientes entidades interconectadas:

### Tablas Principales
1.  `Categorias`: Control maestro de las profesiones e íconos dinámicos (15 categorías precargadas).
2.  `Usuarios`: Gestión de cuentas, credenciales encriptadas, roles (`cliente`/`profesional`) y estado (`activo`/`suspendido`/`baneado`).
3.  `Profesionales`: Extensión de perfil público, descripción, ciudad y radio de cobertura en km.
4.  `Publicaciones`: Galería fotográfica con soporte para imágenes y videos (Portafolio).
5.  `FotosPublicaciones`: Múltiples imágenes adicionales por publicación.

### Interacción y Confianza
6.  `Resenas`: Calificaciones de 1 a 5 estrellas y comentarios auditables.
7.  `Favoritos`: Registro de persistencia para guardar perfiles favoritos.
8.  `HistorialContactos`: Métricas de clics en llamadas y WhatsApp.
9.  `Verificaciones`: Control de documentos e insignias de perfil verificado.
10. `Denuncias`: Moderación de contenido inapropiado.

### Servicios y Disponibilidad
11. `Servicios`: Catálogo de servicios específicos que ofrece cada profesional.
12. `PreciosReferenciales`: Precios por servicio con moneda configurable.
13. `HorariosAtencion`: Días y horarios laborales del profesional.
14. `Ubicaciones`: Direcciones detalladas con coordenadas (lat/lng) para mapa.

### Infraestructura
15. `EnlacesProfesionales`: Redes sociales y sitio web del profesional.
16. `NotificacionesPush`: Tokens FCM/APNs para notificaciones push.
17. `TokensRecuperacion`: Tokens para restablecimiento de contraseña.
18. `Auditoria`: Log de cambios en datos sensibles (INSERT/UPDATE/DELETE).

---

## 🛠️ Requisitos de Desarrollo

Para correr este ecosistema de forma local o en producción necesitarás:

* **Flutter SDK** (v3.x o superior)
* **Node.js** (v18.x o superior) & npm/yarn
* **NestJS CLI**
* **SQL Server** (2019 o superior) o acceso al cluster asignado.

---

## 📈 Roadmap / Próximos Pasos

- [ ] Diseño UI/UX de alta fidelidad en Figma de las pantallas móviles.
- [x] Script de base de datos completo (18 tablas + índices + seed data).
- [ ] Inicialización del proyecto NestJS y configuración de la conexión mediante variables de entorno (`.env`).
- [ ] Desarrollo de los endpoints de autenticación (JWT) y CRUD de publicaciones.
- [ ] Construcción de las vistas principales en Flutter (Home, Buscador, Perfil Profesional).