-- Elimina la columna disponibilidad_inmediata de Profesionales
-- La disponibilidad ahora se determina según los horarios de atención (HorariosAtencion.activo + hora actual)

ALTER TABLE Profesionales DROP CONSTRAINT DF_Profesionales_Disp;
GO

ALTER TABLE Profesionales DROP COLUMN disponibilidad_inmediata;
GO

DROP INDEX IX_Profesionales_Ciudad_Categoria ON Profesionales;
GO

CREATE NONCLUSTERED INDEX IX_Profesionales_Ciudad_Categoria
ON Profesionales (ciudad, categoria_id)
INCLUDE (foto_perfil_url);
GO
