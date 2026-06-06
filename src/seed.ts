import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const ds = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.ts'],
    extra: { trustServerCertificate: true },
  });

  await ds.initialize();
  console.log('✓ Conectado a BD');

  // --- Categorías extra ---
  const categoriasExtra = [
    ['Fotógrafo', 'Fotografía profesional para eventos, retratos y productos.'],
    ['Entrenador Personal', 'Entrenamiento físico, rutinas personalizadas y nutrición.'],
    ['Diseñador Gráfico', 'Diseño de logos, branding, redes sociales y material impreso.'],
    ['Veterinario', 'Atención médica para mascotas, consultas y vacunación.'],
    ['Técnico en Gas', 'Instalación y mantenimiento de sistemas de gas domiciliario.'],
  ];

  for (const [nombre, descripcion] of categoriasExtra) {
    await ds.query(
      `IF NOT EXISTS (SELECT 1 FROM Categorias WHERE nombre = @0)
       INSERT INTO Categorias (nombre, descripcion) VALUES (@0, @1)`,
      [nombre, descripcion],
    );
  }
  console.log('✓ 5 categorías extra insertadas');

  // --- Admin ---
  const adminHash = await bcrypt.hash('admin123', 10);
  await ds.query(
    `IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE email = 'admin@oficiosapp.com')
     INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado)
     VALUES ('Admin OficiosApp', 'admin@oficiosapp.com', @0, '5550000000', 'admin', 'activo')`,
    [adminHash],
  );
  console.log('✓ Admin: admin@oficiosapp.com / admin123');

  // --- Cliente ---
  const clientHash = await bcrypt.hash('cliente123', 10);
  await ds.query(
    `IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE email = 'cliente@test.com')
     INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado)
     VALUES ('Cliente Test', 'cliente@test.com', @0, '5550000001', 'cliente', 'activo')`,
    [clientHash],
  );
  console.log('✓ Cliente: cliente@test.com / cliente123');

  // --- Profesional ---
  const profHash = await bcrypt.hash('prof123', 10);
  const profUser = await ds.query(
    `IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE email = 'profesional@test.com')
     BEGIN
       INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado)
       VALUES ('Profesional Test', 'profesional@test.com', @0, '5550000002', 'profesional', 'activo');
       SELECT SCOPE_IDENTITY() AS id;
     END
     ELSE
       SELECT id FROM Usuarios WHERE email = 'profesional@test.com'`,
    [profHash],
  );
  const profUserId = profUser[0]?.id;
  console.log('✓ Profesional: profesional@test.com / prof123');

  // --- Perfil profesional + datos relacionados ---
  if (profUserId) {
    const existing = await ds.query(
      `SELECT 1 FROM Profesionales WHERE usuario_id = @0`, [profUserId],
    );

    if (!existing.length) {
      const cat = await ds.query(`SELECT TOP 1 id FROM Categorias ORDER BY id`);
      const catId = cat[0]?.id;

      await ds.query(
        `INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, ciudad)
         VALUES (@0, @1, 'Especialista con más de 10 años de experiencia. Trabajos garantizados.', 'Ciudad de México')`,
        [profUserId, catId],
      );
      const profId = (await ds.query(`SELECT SCOPE_IDENTITY() AS id`))[0]?.id;

      // Servicios
      await ds.query(
        `INSERT INTO Servicios (profesional_id, nombre, descripcion) VALUES
         (@0, 'Servicio Básico', 'Incluye revisión y diagnóstico'),
         (@0, 'Servicio Completo', 'Incluye materiales y mano de obra'),
         (@0, 'Servicio Express', 'Resolución en menos de 24 horas')`,
        [profId],
      );

      // Horarios
      for (let d = 1; d <= 6; d++) {
        await ds.query(
          `INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre)
           VALUES (@0, @1, '09:00', '18:00')`,
          [profId, d],
        );
      }

      // Ubicación
      await ds.query(
        `INSERT INTO Ubicaciones (profesional_id, direccion, ciudad, estado, pais, latitud, longitud, es_principal)
         VALUES (@0, 'Av. Reforma 222, Col. Juárez', 'Ciudad de México', 'CDMX', 'México', 19.4333, -99.1333, 1)`,
        [profId],
      );

      // Publicaciones de ejemplo
      await ds.query(
        `INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
         VALUES
         (@0, 'Trabajo realizado en Colonia Del Valle', 'Remodelación completa de baño. Cambio de tuberías y azulejos.', 'https://via.placeholder.com/600x400?text=Trabajo+1'),
         (@0, 'Instalación en edificio corporativo', 'Instalación eléctrica completa para oficinas de 3 pisos.', 'https://via.placeholder.com/600x400?text=Trabajo+2'),
         (@0, 'Reparación de emergencia', 'Fuga de gas controlada y reparación de línea principal.', 'https://via.placeholder.com/600x400?text=Trabajo+3')`,
        [profId],
      );

      console.log('✓ Perfil profesional con servicios, horarios, ubicación y publicaciones');
    }
  }

  console.log('');
  console.log('Seed completado exitosamente.');
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
