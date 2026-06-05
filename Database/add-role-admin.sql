USE OficiosApp;
GO

ALTER TABLE Usuarios DROP CONSTRAINT CK_Usuarios_Rol;
GO

ALTER TABLE Usuarios ADD CONSTRAINT CK_Usuarios_Rol CHECK (rol IN ('cliente', 'profesional', 'admin'));
GO
