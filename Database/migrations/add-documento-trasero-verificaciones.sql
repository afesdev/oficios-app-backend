-- Migración: agregar columna documento_trasero_url a Verificaciones
-- Ejecutar una sola vez en producción y desarrollo

USE OficiosApp;
GO

ALTER TABLE Verificaciones
  ADD documento_trasero_url NVARCHAR(2083) NULL;
GO

PRINT 'Columna documento_trasero_url agregada a Verificaciones.';
GO
