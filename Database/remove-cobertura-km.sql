-- Elimina la columna cobertura_km de Profesionales
-- La cobertura ahora se calcula dinámicamente desde las Ubicaciones del profesional
-- (distancia máxima entre sus ubicaciones, o 30 km por defecto si solo tiene una)

ALTER TABLE Profesionales DROP COLUMN cobertura_km;
GO

-- Actualiza el índice si es necesario (ya no incluye cobertura_km)
DROP INDEX IF EXISTS IX_Profesionales_Ciudad_Categoria ON Profesionales;
GO

CREATE NONCLUSTERED INDEX IX_Profesionales_Ciudad_Categoria
ON Profesionales (ciudad, categoria_id)
INCLUDE (foto_perfil_url);
GO
