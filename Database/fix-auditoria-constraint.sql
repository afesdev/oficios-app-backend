-- Elimina la constraint antigua y la reemplaza para incluir LOGIN
ALTER TABLE Auditoria DROP CONSTRAINT CK_Auditoria_Accion;
GO

ALTER TABLE Auditoria ADD CONSTRAINT CK_Auditoria_Accion
CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN'));
GO

-- Agrega índice por usuario para consultas rápidas de "quién hizo qué"
CREATE NONCLUSTERED INDEX IX_Auditoria_Usuario
ON Auditoria (usuario_id, fecha DESC)
WHERE usuario_id IS NOT NULL;
GO
