-- Agrega publicacion_id a Resenas para vincular reseñas a publicaciones específicas
ALTER TABLE Resenas
  ADD publicacion_id INT NULL,
  CONSTRAINT FK_Resenas_Publicaciones
    FOREIGN KEY (publicacion_id) REFERENCES Publicaciones(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
