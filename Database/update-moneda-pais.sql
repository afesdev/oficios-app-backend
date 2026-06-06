-- ==========================================
-- Actualizar moneda predeterminada a COP
-- y país predeterminado a Colombia
-- ==========================================
USE OficiosApp;
GO

-- 1. PreciosReferenciales: actualizar registros existentes
UPDATE PreciosReferenciales SET moneda = 'COP' WHERE moneda = 'MXN';
GO

-- 2. PreciosReferenciales: cambiar DEFAULT
DECLARE @df_name NVARCHAR(128);
SELECT @df_name = name
FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID('PreciosReferenciales')
  AND col_name(parent_object_id, parent_column_id) = 'moneda';
IF @df_name IS NOT NULL
  EXEC('ALTER TABLE PreciosReferenciales DROP CONSTRAINT ' + @df_name);
ALTER TABLE PreciosReferenciales ADD CONSTRAINT DF_Precios_Moneda DEFAULT 'COP' FOR moneda;
GO

-- 3. Ubicaciones: actualizar registros existentes
UPDATE Ubicaciones SET pais = 'Colombia' WHERE pais = 'México';
GO

-- 4. Ubicaciones: cambiar DEFAULT
DECLARE @df_name2 NVARCHAR(128);
SELECT @df_name2 = name
FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID('Ubicaciones')
  AND col_name(parent_object_id, parent_column_id) = 'pais';
IF @df_name2 IS NOT NULL
  EXEC('ALTER TABLE Ubicaciones DROP CONSTRAINT ' + @df_name2);
ALTER TABLE Ubicaciones ADD CONSTRAINT DF_Ubicaciones_Pais DEFAULT 'Colombia' FOR pais;
GO

PRINT 'Actualización completada: moneda → COP, país → Colombia';
GO
