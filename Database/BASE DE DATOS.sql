-- ==========================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS Y TABLAS
-- Proyecto: Portafolio de Profesionales Móvil
-- Motor: SQL Server
-- ==========================================

-- 1. CREACIÓN DE LA BASE DE DATOS
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'OficiosApp')
BEGIN
    CREATE DATABASE OficiosApp;
END
GO

USE OficiosApp;
GO

-- 2. ELIMINACIÓN DE TABLAS EN ORDEN INVERSO
IF OBJECT_ID('dbo.FotosPublicaciones', 'U') IS NOT NULL DROP TABLE dbo.FotosPublicaciones;
IF OBJECT_ID('dbo.Denuncias', 'U') IS NOT NULL DROP TABLE dbo.Denuncias;
IF OBJECT_ID('dbo.PreciosReferenciales', 'U') IS NOT NULL DROP TABLE dbo.PreciosReferenciales;
IF OBJECT_ID('dbo.Servicios', 'U') IS NOT NULL DROP TABLE dbo.Servicios;
IF OBJECT_ID('dbo.NotificacionesPush', 'U') IS NOT NULL DROP TABLE dbo.NotificacionesPush;
IF OBJECT_ID('dbo.TokensRecuperacion', 'U') IS NOT NULL DROP TABLE dbo.TokensRecuperacion;
IF OBJECT_ID('dbo.Auditoria', 'U') IS NOT NULL DROP TABLE dbo.Auditoria;
IF OBJECT_ID('dbo.HorariosAtencion', 'U') IS NOT NULL DROP TABLE dbo.HorariosAtencion;
IF OBJECT_ID('dbo.Ubicaciones', 'U') IS NOT NULL DROP TABLE dbo.Ubicaciones;
IF OBJECT_ID('dbo.HistorialContactos', 'U') IS NOT NULL DROP TABLE dbo.HistorialContactos;
IF OBJECT_ID('dbo.Favoritos', 'U') IS NOT NULL DROP TABLE dbo.Favoritos;
IF OBJECT_ID('dbo.Resenas', 'U') IS NOT NULL DROP TABLE dbo.Resenas;
IF OBJECT_ID('dbo.EnlacesProfesionales', 'U') IS NOT NULL DROP TABLE dbo.EnlacesProfesionales;
IF OBJECT_ID('dbo.Verificaciones', 'U') IS NOT NULL DROP TABLE dbo.Verificaciones;
IF OBJECT_ID('dbo.Publicaciones', 'U') IS NOT NULL DROP TABLE dbo.Publicaciones;
IF OBJECT_ID('dbo.Profesionales', 'U') IS NOT NULL DROP TABLE dbo.Profesionales;
IF OBJECT_ID('dbo.Usuarios', 'U') IS NOT NULL DROP TABLE dbo.Usuarios;
IF OBJECT_ID('dbo.Categorias', 'U') IS NOT NULL DROP TABLE dbo.Categorias;
GO

-- ==========================================
-- 3. CREACIÓN DE TABLAS
-- ==========================================

-- Tabla: Categorias
CREATE TABLE Categorias (
    id INT IDENTITY(1,1) NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(255) NULL,
    icono_url NVARCHAR(2083) NULL,
    CONSTRAINT PK_Categorias PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Categorias_Nombre UNIQUE (nombre)
);
GO

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) NOT NULL,
    nombre_completo NVARCHAR(150) NOT NULL,
    email NVARCHAR(150) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(20) NOT NULL,
    rol NVARCHAR(20) NOT NULL CONSTRAINT DF_Usuarios_Rol DEFAULT 'cliente',
    fecha_registro DATETIME NOT NULL CONSTRAINT DF_Usuarios_Fecha DEFAULT GETDATE(),
    estado NVARCHAR(20) NOT NULL CONSTRAINT DF_Usuarios_Estado DEFAULT 'activo',
    CONSTRAINT PK_Usuarios PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Usuarios_Email UNIQUE (email),
    CONSTRAINT CK_Usuarios_Rol CHECK (rol IN ('cliente', 'profesional', 'admin')),
    CONSTRAINT CK_Usuarios_Estado CHECK (estado IN ('activo', 'suspendido', 'baneado'))
);
GO

-- Tabla: Profesionales
CREATE TABLE Profesionales (
    id INT IDENTITY(1,1) NOT NULL,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    descripcion_perfil NVARCHAR(MAX) NULL,
    foto_perfil_url NVARCHAR(2083) NULL,
    ciudad NVARCHAR(100) NOT NULL,
    disponibilidad_inmediata BIT NOT NULL CONSTRAINT DF_Profesionales_Disp DEFAULT 1,
    cobertura_km DECIMAL(6,2) NULL,
    CONSTRAINT PK_Profesionales PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Profesionales_Usuario UNIQUE (usuario_id),
    CONSTRAINT FK_Profesionales_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios (id) ON DELETE CASCADE,
    CONSTRAINT FK_Profesionales_Categorias FOREIGN KEY (categoria_id)
        REFERENCES Categorias (id)
);
GO

-- Tabla: Publicaciones
CREATE TABLE Publicaciones (
    id INT IDENTITY(1,1) NOT NULL,
    profesional_id INT NOT NULL,
    titulo NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(MAX) NULL,
    imagen_url NVARCHAR(2083) NOT NULL,
    video_url NVARCHAR(2083) NULL,
    fecha_creacion DATETIME NOT NULL CONSTRAINT DF_Publicaciones_Fecha DEFAULT GETDATE(),
    CONSTRAINT PK_Publicaciones PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_Publicaciones_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales (id) ON DELETE CASCADE
);
GO

-- Fotos adicionales por publicación
CREATE TABLE FotosPublicaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    publicacion_id INT NOT NULL,
    imagen_url NVARCHAR(2083) NOT NULL,
    orden TINYINT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Fotos_Publicaciones FOREIGN KEY (publicacion_id)
        REFERENCES Publicaciones(id) ON DELETE CASCADE
);
GO

-- Tabla: EnlacesProfesionales
CREATE TABLE EnlacesProfesionales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profesional_id INT NOT NULL,
    plataforma NVARCHAR(50) NOT NULL,
    url NVARCHAR(2083) NOT NULL,
    CONSTRAINT FK_Enlaces_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id) ON DELETE CASCADE
);
GO

-- Tabla: Verificaciones
CREATE TABLE Verificaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profesional_id INT NOT NULL UNIQUE,
    tipo_documento NVARCHAR(50) NOT NULL,
    documento_url NVARCHAR(2083) NOT NULL,
    estado NVARCHAR(20) DEFAULT 'pendiente',
    notas_admin NVARCHAR(255) NULL,
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    fecha_resolucion DATETIME NULL,
    CONSTRAINT FK_Verificaciones_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id) ON DELETE CASCADE,
    CONSTRAINT CK_Verificaciones_Estado CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
);
GO

-- Tabla: Resenas
CREATE TABLE Resenas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    profesional_id INT NOT NULL,
    puntuacion INT NOT NULL CONSTRAINT CK_Resenas_Puntuacion CHECK (puntuacion BETWEEN 1 AND 5),
    comentario NVARCHAR(500) NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Resenas_Clientes FOREIGN KEY (cliente_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_Resenas_Profesionales FOREIGN KEY (profesional_id) REFERENCES Profesionales(id) ON DELETE CASCADE
);
GO

-- Tabla: Favoritos
CREATE TABLE Favoritos (
    cliente_id INT NOT NULL,
    profesional_id INT NOT NULL,
    fecha_guardado DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Favoritos PRIMARY KEY (cliente_id, profesional_id),
    CONSTRAINT FK_Favoritos_Clientes FOREIGN KEY (cliente_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    CONSTRAINT FK_Favoritos_Profesionales FOREIGN KEY (profesional_id) REFERENCES Profesionales(id)
);
GO

-- Tabla: HistorialContactos
CREATE TABLE HistorialContactos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NULL,
    profesional_id INT NOT NULL,
    tipo_contacto NVARCHAR(20) NOT NULL,
    fecha_contacto DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Historial_Clientes FOREIGN KEY (cliente_id) REFERENCES Usuarios(id) ON DELETE NO ACTION,
    CONSTRAINT FK_Historial_Profesionales FOREIGN KEY (profesional_id) REFERENCES Profesionales(id) ON DELETE CASCADE,
    CONSTRAINT CK_Historial_Tipo CHECK (tipo_contacto IN ('whatsapp', 'llamada'))
);
GO

-- Tabla: Servicios (catálogo de servicios por profesional)
CREATE TABLE Servicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profesional_id INT NOT NULL,
    nombre NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(500) NULL,
    duracion_estimada_min INT NULL,
    CONSTRAINT FK_Servicios_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id) ON DELETE CASCADE
);
GO

-- Tabla: PreciosReferenciales
CREATE TABLE PreciosReferenciales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    servicio_id INT NOT NULL,
    precio_min DECIMAL(10,2) NOT NULL,
    precio_max DECIMAL(10,2) NULL,
    moneda NVARCHAR(3) NOT NULL DEFAULT 'MXN',
    descripcion_precio NVARCHAR(255) NULL,
    CONSTRAINT FK_Precios_Servicios FOREIGN KEY (servicio_id)
        REFERENCES Servicios(id) ON DELETE CASCADE
);
GO

-- Tabla: HorariosAtencion
CREATE TABLE HorariosAtencion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profesional_id INT NOT NULL,
    dia_semana TINYINT NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Horarios_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id) ON DELETE CASCADE,
    CONSTRAINT CK_Horarios_Dia CHECK (dia_semana BETWEEN 1 AND 7),
    CONSTRAINT CK_Horarios_Rango CHECK (hora_apertura < hora_cierre)
);
GO

-- Tabla: Ubicaciones
CREATE TABLE Ubicaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profesional_id INT NOT NULL,
    direccion NVARCHAR(255) NOT NULL,
    ciudad NVARCHAR(100) NOT NULL,
    estado NVARCHAR(100) NULL,
    pais NVARCHAR(100) NOT NULL DEFAULT 'México',
    latitud DECIMAL(10,7) NULL,
    longitud DECIMAL(10,7) NULL,
    es_principal BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Ubicaciones_Profesionales FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id) ON DELETE CASCADE
);
GO

-- Tabla: NotificacionesPush
CREATE TABLE NotificacionesPush (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    token NVARCHAR(500) NOT NULL,
    plataforma NVARCHAR(10) NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE(),
    ultimo_uso DATETIME DEFAULT GETDATE(),
    activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Notificaciones_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id) ON DELETE CASCADE,
    CONSTRAINT CK_Notificaciones_Plataforma CHECK (plataforma IN ('android', 'ios'))
);
GO

-- Tabla: Denuncias
CREATE TABLE Denuncias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    denunciante_id INT NOT NULL,
    profesional_id INT NOT NULL,
    motivo NVARCHAR(50) NOT NULL,
    descripcion NVARCHAR(500) NULL,
    estado NVARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_resolucion DATETIME NULL,
    notas_admin NVARCHAR(255) NULL,
    CONSTRAINT FK_Denuncias_Denunciante FOREIGN KEY (denunciante_id)
        REFERENCES Usuarios(id),
    CONSTRAINT FK_Denuncias_Profesional FOREIGN KEY (profesional_id)
        REFERENCES Profesionales(id),
    CONSTRAINT CK_Denuncias_Motivo CHECK (motivo IN (
        'spam', 'fotos_falsas', 'informacion_incorrecta',
        'mal_servicio', 'estafa', 'otro'
    )),
    CONSTRAINT CK_Denuncias_Estado CHECK (estado IN (
        'pendiente', 'revisando', 'aprobado', 'rechazado'
    ))
);
GO

-- Tabla: TokensRecuperacion
CREATE TABLE TokensRecuperacion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    token NVARCHAR(255) NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    usado BIT NOT NULL DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Tokens_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id) ON DELETE CASCADE
);
GO

-- Tabla: Auditoria
CREATE TABLE Auditoria (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NULL,
    tabla_afectada NVARCHAR(100) NOT NULL,
    registro_id INT NOT NULL,
    accion NVARCHAR(20) NOT NULL,
    valor_anterior NVARCHAR(MAX) NULL,
    valor_nuevo NVARCHAR(MAX) NULL,
    fecha DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Auditoria_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id) ON DELETE SET NULL,
    CONSTRAINT CK_Auditoria_Accion CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE'))
);
GO

-- ==========================================
-- 4. ÍNDICES
-- ==========================================

CREATE NONCLUSTERED INDEX IX_Profesionales_Ciudad_Categoria
ON Profesionales (ciudad, categoria_id)
INCLUDE (foto_perfil_url, disponibilidad_inmediata);
GO

CREATE NONCLUSTERED INDEX IX_Publicaciones_Profesional
ON Publicaciones (profesional_id)
INCLUDE (imagen_url, titulo, fecha_creacion);
GO

CREATE NONCLUSTERED INDEX IX_Resenas_Profesional
ON Resenas (profesional_id)
INCLUDE (puntuacion, comentario, fecha_creacion);
GO

CREATE NONCLUSTERED INDEX IX_Servicios_Profesional
ON Servicios (profesional_id)
INCLUDE (nombre, descripcion);
GO

CREATE NONCLUSTERED INDEX IX_Horarios_Profesional_Dia
ON HorariosAtencion (profesional_id, dia_semana)
WHERE activo = 1;
GO

CREATE NONCLUSTERED INDEX IX_Ubicaciones_Coordenadas
ON Ubicaciones (latitud, longitud)
WHERE latitud IS NOT NULL AND longitud IS NOT NULL;
GO

CREATE NONCLUSTERED INDEX IX_Notificaciones_Usuario
ON NotificacionesPush (usuario_id, activo)
INCLUDE (token, plataforma);
GO

CREATE NONCLUSTERED INDEX IX_Auditoria_Tabla_Fecha
ON Auditoria (tabla_afectada, fecha DESC);
GO

-- ==========================================
-- 5. DATOS DE PRUEBA
-- ==========================================

INSERT INTO Categorias (nombre, descripcion, icono_url) VALUES
('Plomero / Fontanero', 'Expertos en tuberías, griferías, fugas de agua y desagües.', 'https://tu-storage.com/icons/plumber.png'),
('Carpintero', 'Diseño, reparación e instalación de estructuras y muebles de madera.', 'https://tu-storage.com/icons/carpenter.png'),
('Electricista', 'Instalaciones eléctricas residenciales, cortos, tableros y mantenimiento.', 'https://tu-storage.com/icons/electrician.png'),
('Pintor', 'Acabados, pintura de interiores, exteriores, texturas y drywall.', 'https://tu-storage.com/icons/painter.png'),
('Médico General', 'Consultas de salud general, recetas y chequeos preventivos.', 'https://tu-storage.com/icons/doctor.png'),
('Mecánico Automotriz', 'Diagnóstico, reparación y mantenimiento de vehículos.', 'https://tu-storage.com/icons/mechanic.png'),
('Cerrajero', 'Apertura de puertas, instalación de chapas y sistemas de seguridad.', 'https://tu-storage.com/icons/locksmith.png'),
('Jardinero / Paisajista', 'Diseño y mantenimiento de jardines, poda y áreas verdes.', 'https://tu-storage.com/icons/gardener.png'),
('Abogado', 'Asesoría legal, trámites civiles, penales, laborales y corporativos.', 'https://tu-storage.com/icons/lawyer.png'),
('Contador / Fiscalista', 'Declaraciones de impuestos, contabilidad, facturación y nóminas.', 'https://tu-storage.com/icons/accountant.png'),
('Arquitecto', 'Diseño y supervisión de proyectos de construcción y remodelación.', 'https://tu-storage.com/icons/architect.png'),
('Técnico en Refrigeración', 'Instalación y reparación de aires acondicionados y refrigeración.', 'https://tu-storage.com/icons/hvac.png'),
('Barbero / Estilista', 'Corte de cabello, arreglo de barba y servicios de barbería.', 'https://tu-storage.com/icons/barber.png'),
('Chef / Cocinero Particular', 'Servicios de cocina privada, eventos y comidas a domicilio.', 'https://tu-storage.com/icons/chef.png'),
('Técnico en Reparación de Electrodomésticos', 'Reparación de lavadoras, refrigeradores, microondas y más.', 'https://tu-storage.com/icons/appliance.png');
GO

PRINT 'BASE DE DATOS OficiosApp CREADA EXITOSAMENTE.';
GO
