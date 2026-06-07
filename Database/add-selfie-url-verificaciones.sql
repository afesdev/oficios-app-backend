-- =====================================================
-- Agrega la columna selfie_url a la tabla Verificaciones
-- =====================================================
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Verificaciones' AND COLUMN_NAME = 'selfie_url'
)
BEGIN
    ALTER TABLE Verificaciones ADD selfie_url VARCHAR(2083) NULL;
    PRINT '✔ Columna selfie_url agregada a Verificaciones.';
END
ELSE
    PRINT '– selfie_url ya existe, se omite.';
GO
