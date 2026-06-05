-- =====================================================
-- MIGRACIÓN: Sistema de Me Gusta en Publicaciones
-- Motor: SQL Server  |  Proyecto: OficiosApp
-- Ejecutar una sola vez sobre la BD OficiosApp
-- =====================================================
--
-- ¿Por qué NO CASCADE en FK_Likes_Usuarios?
--   SQL Server no permite múltiples rutas de cascada al mismo destino.
--   Ruta 1: Usuarios → Profesionales → Publicaciones → LikesPublicaciones
--   Ruta 2: Usuarios → LikesPublicaciones  ← ciclo, error 1785
--   Solución: ON DELETE NO ACTION en usuario_id.
--   Las likes de un usuario se eliminan en cascada al borrar
--   sus publicaciones (FK_Likes_Publicaciones sí tiene CASCADE).
-- =====================================================

USE OficiosApp;
GO

IF OBJECT_ID('dbo.LikesPublicaciones', 'U') IS NULL
BEGIN
    CREATE TABLE LikesPublicaciones (
        usuario_id      INT      NOT NULL,
        publicacion_id  INT      NOT NULL,

        -- DATETIME es coherente con el resto del esquema (GETDATE()).
        -- Si se necesita precisión de microsegundos usar DATETIME2(0),
        -- pero DATETIME (precisión 3 ms) es suficiente para un timestamp de like.
        fecha_like      DATETIME NOT NULL
            CONSTRAINT DF_LikesPublicaciones_Fecha DEFAULT GETDATE(),

        CONSTRAINT PK_LikesPublicaciones
            PRIMARY KEY (usuario_id, publicacion_id),

        -- NO CASCADE: evita el ciclo Usuarios→Profesionales→Publicaciones→Likes
        -- y Usuarios→Likes al mismo tiempo (error 1785 de SQL Server).
        CONSTRAINT FK_Likes_Usuarios
            FOREIGN KEY (usuario_id)
            REFERENCES Usuarios (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,

        -- CASCADE: al borrar una publicación se eliminan sus likes automáticamente.
        CONSTRAINT FK_Likes_Publicaciones
            FOREIGN KEY (publicacion_id)
            REFERENCES Publicaciones (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
    );

    -- Índice para COUNT(*) de likes por publicación (feed).
    CREATE NONCLUSTERED INDEX IX_LikesPublicaciones_Publicacion
        ON LikesPublicaciones (publicacion_id)
        INCLUDE (usuario_id);

    -- Índice para listar qué publicaciones le gustaron a un usuario.
    CREATE NONCLUSTERED INDEX IX_LikesPublicaciones_Usuario
        ON LikesPublicaciones (usuario_id)
        INCLUDE (publicacion_id, fecha_like);

    PRINT 'Tabla LikesPublicaciones creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'La tabla LikesPublicaciones ya existe. No se realizó ningún cambio.';
END
GO
