-- Agrega campo de visibilidad en mapa a la tabla Ubicaciones
-- Por defecto 1 (visible) para no romper los registros existentes
-- El profesional puede desactivarlo cuando quiera dejar de aparecer en el mapa

IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID(N'Ubicaciones')
    AND name = 'visible_en_mapa'
)
BEGIN
  ALTER TABLE Ubicaciones
    ADD visible_en_mapa BIT NOT NULL DEFAULT 1;
END;
