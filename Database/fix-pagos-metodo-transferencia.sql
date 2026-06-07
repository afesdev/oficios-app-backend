-- =====================================================
-- FIX: Agregar 'transferencia' al CHECK constraint de PagosPromociones
-- El constraint original omitía 'transferencia' causando que los INSERTs
-- con metodo_pago = 'transferencia' fallaran en SQL Server.
-- Ejecutar una sola vez sobre la BD OficiosApp.
-- =====================================================

USE OficiosApp;
GO

ALTER TABLE dbo.PagosPromociones
    DROP CONSTRAINT CK_PagosPromociones_Metodo;
GO

ALTER TABLE dbo.PagosPromociones
    ADD CONSTRAINT CK_PagosPromociones_Metodo
    CHECK (metodo_pago IN ('tarjeta', 'nequi', 'pse', 'transferencia', 'efectivo', 'manual'));
GO

PRINT '✔ CHECK constraint CK_PagosPromociones_Metodo actualizado con transferencia.';
GO
