-- =====================================================
-- MIGRACIÓN: Sistema de Promociones Pagadas
-- Motor: SQL Server  |  Proyecto: OficiosApp
-- Ejecutar una sola vez sobre la BD OficiosApp
-- =====================================================
--
-- Tablas que se crean:
--   1. PlanesPromocion        → catálogo de planes (Básico, Pro, Premium)
--   2. Promociones            → cabecera de cada promoción contratada
--   3. PromocionBanners       → detalle cuando tipo = 'banner'
--   4. PromocionPublicaciones → detalle cuando tipo = 'publicacion'
--   5. PromocionPerfiles      → detalle cuando tipo = 'perfil'
--   6. PagosPromociones       → registro de cada pago realizado
--
-- Notas de diseño:
--   • Precios en COP como INTEGER (el peso colombiano no usa centavos).
--   • ON DELETE NO ACTION en FKs hacia Profesionales para evitar
--     la ruta de cascada múltiple que SQL Server rechaza (error 1785).
--   • La columna "activo" en Promociones es derivada del estado pero
--     se mantiene como BIT para simplificar los queries del feed.
-- =====================================================

USE OficiosApp;
GO

-- =====================================================
-- 1. PlanesPromocion
-- =====================================================
IF OBJECT_ID('dbo.PlanesPromocion', 'U') IS NULL
BEGIN
    CREATE TABLE PlanesPromocion (
        id                   INT          IDENTITY(1,1) NOT NULL,
        nombre               NVARCHAR(50) NOT NULL,
        precio               INT          NOT NULL,           -- COP sin decimales
        duracion_dias        TINYINT      NOT NULL,
        posicion_preferente  TINYINT      NOT NULL,           -- 1=Premium, 2=Pro, 3=Básico
        slots_disponibles    TINYINT      NOT NULL DEFAULT 10, -- cupos simultáneos por plan
        descripcion          NVARCHAR(255) NULL,
        activo               BIT          NOT NULL DEFAULT 1,
        created_at           DATETIME     NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_PlanesPromocion PRIMARY KEY CLUSTERED (id),
        CONSTRAINT UQ_PlanesPromocion_Nombre UNIQUE (nombre),
        CONSTRAINT CK_PlanesPromocion_Precio CHECK (precio > 0),
        CONSTRAINT CK_PlanesPromocion_Duracion CHECK (duracion_dias > 0),
        CONSTRAINT CK_PlanesPromocion_Posicion CHECK (posicion_preferente BETWEEN 1 AND 10),
        CONSTRAINT CK_PlanesPromocion_Slots CHECK (slots_disponibles > 0)
    );

    PRINT '✔ Tabla PlanesPromocion creada.';
END
ELSE
    PRINT '– PlanesPromocion ya existe, se omite.';
GO

-- =====================================================
-- 2. Promociones (cabecera)
-- =====================================================
IF OBJECT_ID('dbo.Promociones', 'U') IS NULL
BEGIN
    CREATE TABLE Promociones (
        id                INT           IDENTITY(1,1) NOT NULL,
        profesional_id    INT           NOT NULL,
        plan_id           INT           NOT NULL,
        tipo              NVARCHAR(20)  NOT NULL,
        estado            NVARCHAR(30)  NOT NULL DEFAULT 'pendiente_pago',
        activo            BIT           NOT NULL DEFAULT 0,   -- 1 solo cuando estado='activa'
        aprobado_por      INT           NULL,                 -- FK Usuarios (admin)
        fecha_inicio      DATETIME      NULL,                 -- se asigna al aprobar
        fecha_fin         DATETIME      NULL,                 -- fecha_inicio + duracion_dias
        impresiones       INT           NOT NULL DEFAULT 0,
        clics             INT           NOT NULL DEFAULT 0,
        created_at        DATETIME      NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_Promociones PRIMARY KEY CLUSTERED (id),

        CONSTRAINT CK_Promociones_Tipo CHECK (
            tipo IN ('banner', 'perfil', 'publicacion')
        ),
        CONSTRAINT CK_Promociones_Estado CHECK (
            estado IN (
                'pendiente_pago',
                'pendiente_aprobacion',
                'activa',
                'rechazada',
                'finalizada',
                'cancelada'
            )
        ),
        CONSTRAINT CK_Promociones_Fechas CHECK (
            fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin > fecha_inicio
        ),
        CONSTRAINT CK_Promociones_Impresiones CHECK (impresiones >= 0),
        CONSTRAINT CK_Promociones_Clics CHECK (clics >= 0),

        -- NO CASCADE: evita ruta múltiple
        -- Usuarios → Profesionales → Promociones
        -- Usuarios → Promociones (aprobado_por)
        CONSTRAINT FK_Promociones_Profesionales FOREIGN KEY (profesional_id)
            REFERENCES Profesionales (id)
            ON DELETE NO ACTION,

        CONSTRAINT FK_Promociones_Planes FOREIGN KEY (plan_id)
            REFERENCES PlanesPromocion (id)
            ON DELETE NO ACTION,

        CONSTRAINT FK_Promociones_Admin FOREIGN KEY (aprobado_por)
            REFERENCES Usuarios (id)
            ON DELETE NO ACTION
    );

    PRINT '✔ Tabla Promociones creada.';
END
ELSE
    PRINT '– Promociones ya existe, se omite.';
GO

-- =====================================================
-- 3. PromocionBanners  (tipo = 'banner')
-- =====================================================
IF OBJECT_ID('dbo.PromocionBanners', 'U') IS NULL
BEGIN
    CREATE TABLE PromocionBanners (
        id              INT            IDENTITY(1,1) NOT NULL,
        promocion_id    INT            NOT NULL,
        imagen_url      NVARCHAR(2083) NOT NULL,
        titulo          NVARCHAR(60)   NULL,
        descripcion     NVARCHAR(120)  NULL,
        -- url_destino define a dónde lleva el banner al tocarlo:
        -- 'perfil'               → perfil del profesional
        -- 'publicacion:{id}'     → publicación específica
        url_destino     NVARCHAR(255)  NOT NULL DEFAULT 'perfil',

        CONSTRAINT PK_PromocionBanners PRIMARY KEY CLUSTERED (id),
        CONSTRAINT UQ_PromocionBanners_Promo UNIQUE (promocion_id),   -- 1:1

        CONSTRAINT FK_PromoBanners_Promociones FOREIGN KEY (promocion_id)
            REFERENCES Promociones (id)
            ON DELETE CASCADE
    );

    PRINT '✔ Tabla PromocionBanners creada.';
END
ELSE
    PRINT '– PromocionBanners ya existe, se omite.';
GO

-- =====================================================
-- 4. PromocionPublicaciones  (tipo = 'publicacion')
-- =====================================================
IF OBJECT_ID('dbo.PromocionPublicaciones', 'U') IS NULL
BEGIN
    CREATE TABLE PromocionPublicaciones (
        id              INT  IDENTITY(1,1) NOT NULL,
        promocion_id    INT  NOT NULL,
        publicacion_id  INT  NOT NULL,

        CONSTRAINT PK_PromocionPublicaciones PRIMARY KEY CLUSTERED (id),
        CONSTRAINT UQ_PromocionPublicaciones_Promo UNIQUE (promocion_id),  -- 1:1

        CONSTRAINT FK_PromoPublicaciones_Promociones FOREIGN KEY (promocion_id)
            REFERENCES Promociones (id)
            ON DELETE CASCADE,

        -- NO CASCADE: al borrar publicación no se elimina la promo completa,
        -- solo queda huérfana → se gestiona a nivel de aplicación.
        CONSTRAINT FK_PromoPublicaciones_Publicaciones FOREIGN KEY (publicacion_id)
            REFERENCES Publicaciones (id)
            ON DELETE NO ACTION
    );

    PRINT '✔ Tabla PromocionPublicaciones creada.';
END
ELSE
    PRINT '– PromocionPublicaciones ya existe, se omite.';
GO

-- =====================================================
-- 5. PromocionPerfiles  (tipo = 'perfil')
-- =====================================================
IF OBJECT_ID('dbo.PromocionPerfiles', 'U') IS NULL
BEGIN
    CREATE TABLE PromocionPerfiles (
        id                      INT           IDENTITY(1,1) NOT NULL,
        promocion_id            INT           NOT NULL,
        -- Frase corta que el profesional quiere destacar en su tarjeta
        -- ej: "10 años de experiencia · Disponible ahora"
        mensaje_personalizado   NVARCHAR(100) NULL,

        CONSTRAINT PK_PromocionPerfiles PRIMARY KEY CLUSTERED (id),
        CONSTRAINT UQ_PromocionPerfiles_Promo UNIQUE (promocion_id),   -- 1:1

        CONSTRAINT FK_PromoPerfiles_Promociones FOREIGN KEY (promocion_id)
            REFERENCES Promociones (id)
            ON DELETE CASCADE
    );

    PRINT '✔ Tabla PromocionPerfiles creada.';
END
ELSE
    PRINT '– PromocionPerfiles ya existe, se omite.';
GO

-- =====================================================
-- 6. PagosPromociones
-- =====================================================
IF OBJECT_ID('dbo.PagosPromociones', 'U') IS NULL
BEGIN
    CREATE TABLE PagosPromociones (
        id                   INT            IDENTITY(1,1) NOT NULL,
        promocion_id         INT            NOT NULL,
        profesional_id       INT            NOT NULL,
        monto                INT            NOT NULL,    -- COP sin decimales
        metodo_pago          NVARCHAR(20)   NOT NULL DEFAULT 'manual',
        -- ID devuelto por la pasarela (Wompi, Stripe, etc.) — null si es manual
        referencia_externa   NVARCHAR(255)  NULL,
        estado               NVARCHAR(20)   NOT NULL DEFAULT 'pendiente',
        notas                NVARCHAR(255)  NULL,        -- observaciones del admin
        fecha_pago           DATETIME       NULL,        -- cuándo se confirmó
        created_at           DATETIME       NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_PagosPromociones PRIMARY KEY CLUSTERED (id),

        CONSTRAINT CK_PagosPromociones_Monto CHECK (monto > 0),
        CONSTRAINT CK_PagosPromociones_Metodo CHECK (
            metodo_pago IN ('tarjeta', 'nequi', 'pse', 'transferencia', 'efectivo', 'manual')
        ),
        CONSTRAINT CK_PagosPromociones_Estado CHECK (
            estado IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado')
        ),

        CONSTRAINT FK_PagosPromo_Promociones FOREIGN KEY (promocion_id)
            REFERENCES Promociones (id)
            ON DELETE CASCADE,

        -- NO CASCADE: evita ruta múltiple con Profesionales
        CONSTRAINT FK_PagosPromo_Profesionales FOREIGN KEY (profesional_id)
            REFERENCES Profesionales (id)
            ON DELETE NO ACTION
    );

    PRINT '✔ Tabla PagosPromociones creada.';
END
ELSE
    PRINT '– PagosPromociones ya existe, se omite.';
GO

-- =====================================================
-- 7. ÍNDICES
-- =====================================================

-- Promociones activas para el feed (query más frecuente)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Promociones_Activas_Plan'
    AND object_id = OBJECT_ID('dbo.Promociones')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_Promociones_Activas_Plan
    ON Promociones (activo, estado, fecha_fin)
    INCLUDE (profesional_id, plan_id, tipo, impresiones, clics)
    WHERE activo = 1 AND estado = 'activa';

    PRINT '✔ Índice IX_Promociones_Activas_Plan creado.';
END
GO

-- Promociones por profesional (panel "Mis promociones")
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Promociones_Profesional'
    AND object_id = OBJECT_ID('dbo.Promociones')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_Promociones_Profesional
    ON Promociones (profesional_id, created_at DESC)
    INCLUDE (tipo, estado, activo, fecha_inicio, fecha_fin);

    PRINT '✔ Índice IX_Promociones_Profesional creado.';
END
GO

-- Pagos por promoción
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_PagosPromociones_Promo'
    AND object_id = OBJECT_ID('dbo.PagosPromociones')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_PagosPromociones_Promo
    ON PagosPromociones (promocion_id, estado)
    INCLUDE (monto, metodo_pago, fecha_pago);

    PRINT '✔ Índice IX_PagosPromociones_Promo creado.';
END
GO

-- Pagos por profesional (historial de pagos)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_PagosPromociones_Profesional'
    AND object_id = OBJECT_ID('dbo.PagosPromociones')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_PagosPromociones_Profesional
    ON PagosPromociones (profesional_id, created_at DESC)
    INCLUDE (monto, estado, metodo_pago);

    PRINT '✔ Índice IX_PagosPromociones_Profesional creado.';
END
GO

-- PromocionPublicaciones → buscar por publicacion_id
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_PromoPublicaciones_Publicacion'
    AND object_id = OBJECT_ID('dbo.PromocionPublicaciones')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_PromoPublicaciones_Publicacion
    ON PromocionPublicaciones (publicacion_id)
    INCLUDE (promocion_id);

    PRINT '✔ Índice IX_PromoPublicaciones_Publicacion creado.';
END
GO

-- =====================================================
-- 8. DATOS INICIALES — Planes
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM PlanesPromocion)
BEGIN
    INSERT INTO PlanesPromocion
        (nombre, precio, duracion_dias, posicion_preferente, slots_disponibles, descripcion)
    VALUES
        (
            'Premium',
            40000,
            30,
            1,
            5,
            'Máxima visibilidad durante 30 días. Posición preferente en el carrusel y el feed.'
        ),
        (
            'Pro',
            20000,
            15,
            2,
            8,
            'Alta visibilidad durante 15 días. Segunda posición en el carrusel.'
        ),
        (
            'Básico',
            10000,
            7,
            3,
            10,
            'Visibilidad durante 7 días. Ideal para probar el sistema de promociones.'
        );

    PRINT '✔ Planes de promoción insertados (Básico $10.000 · Pro $20.000 · Premium $40.000 COP).';
END
ELSE
    PRINT '– Planes ya existen, se omiten.';
GO

-- =====================================================
-- 9. ACTUALIZAR BASE DE DATOS.sql — DROP ORDER
--    (comentario para mantener el script base actualizado)
-- =====================================================
--
-- Agregar estas líneas al inicio de la sección DROP del script base,
-- ANTES de las tablas existentes, en este orden exacto:
--
--   IF OBJECT_ID('dbo.PagosPromociones',       'U') IS NOT NULL DROP TABLE dbo.PagosPromociones;
--   IF OBJECT_ID('dbo.PromocionBanners',        'U') IS NOT NULL DROP TABLE dbo.PromocionBanners;
--   IF OBJECT_ID('dbo.PromocionPublicaciones',  'U') IS NOT NULL DROP TABLE dbo.PromocionPublicaciones;
--   IF OBJECT_ID('dbo.PromocionPerfiles',       'U') IS NOT NULL DROP TABLE dbo.PromocionPerfiles;
--   IF OBJECT_ID('dbo.Promociones',             'U') IS NOT NULL DROP TABLE dbo.Promociones;
--   IF OBJECT_ID('dbo.PlanesPromocion',         'U') IS NOT NULL DROP TABLE dbo.PlanesPromocion;
--
-- =====================================================

PRINT '';
PRINT '══════════════════════════════════════════════════';
PRINT '  Migración Sistema de Promociones completada.    ';
PRINT '  Tablas: 6  |  Índices: 4  |  Planes: 3         ';
PRINT '══════════════════════════════════════════════════';
GO
