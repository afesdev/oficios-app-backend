-- =====================================================
-- SEED: 10 Usuarios de demostración
-- 6 Profesionales + 4 Clientes
-- Contraseña de TODOS: Demo1234!
-- =====================================================
-- Categorías (orden del INSERT original en BASE DE DATOS.sql):
--   1  Plomero / Fontanero
--   2  Carpintero
--   3  Electricista
--   4  Pintor
--   5  Médico General
--   6  Mecánico Automotriz
--   7  Cerrajero
--   8  Jardinero / Paisajista
--   9  Abogado
--  10  Contador / Fiscalista
--  11  Arquitecto
--  12  Técnico en Refrigeración
--  13  Barbero / Estilista
--  14  Chef / Cocinero Particular
--  15  Técnico en Reparación de Electrodomésticos
-- =====================================================

USE OficiosApp;
GO

-- =====================================================
-- 1. USUARIOS  (contraseña: Demo1234!)
-- =====================================================
INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado) VALUES
  ('Carlos Andrés Mendoza Ríos',   'carlos.mendoza@demo.com',   '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234501', 'profesional', 'activo'),
  ('Valentina Torres Acosta',      'valentina.torres@demo.com', '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234502', 'profesional', 'activo'),
  ('Sebastián Rojas Castillo',     'sebastian.rojas@demo.com',  '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234503', 'profesional', 'activo'),
  ('Andrés Felipe Gómez Herrera',  'andres.gomez@demo.com',     '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234504', 'profesional', 'activo'),
  ('Natalia Jiménez Ospina',       'natalia.jimenez@demo.com',  '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234505', 'profesional', 'activo'),
  ('Ricardo Palacios Bermúdez',    'ricardo.palacios@demo.com', '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234506', 'profesional', 'activo'),
  ('Miguel Ángel Ruiz Morales',    'miguel.ruiz@demo.com',      '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234507', 'cliente',     'activo'),
  ('Isabella Ramírez Salazar',     'isabella.ramirez@demo.com', '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234508', 'cliente',     'activo'),
  ('Camilo Estrada Peñaloza',      'camilo.estrada@demo.com',   '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234509', 'cliente',     'activo'),
  ('Daniela Suárez Londoño',       'daniela.suarez@demo.com',   '$2b$10$l0gqaCyIwJvIuMwHamVxU.H7jcpcWuuWHKexo.olm4exVUuEim8b2', '3001234510', 'cliente',     'activo');
GO

-- =====================================================
-- 2. PROFESIONALES  (todos los campos)
-- =====================================================

-- Carlos → Electricista (categoria_id = 3)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 3,
  'Electricista certificado con más de 8 años de experiencia en instalaciones residenciales y comerciales en Bogotá. Trabajo con materiales certificados RETIE y garantizo todos mis trabajos por 6 meses. Disponible para emergencias 24/7.',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'carlos.mendoza@demo.com';

-- Valentina → Barbero / Estilista (categoria_id = 13)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 13,
  'Estilista profesional con 6 años de experiencia en colorimetría, cortes modernos y tratamientos capilares. Egresada de L''Oréal Academy Medellín. Atiendo a domicilio con todos los insumos incluidos. Mi especialidad: balayage y mechas californianas.',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80',
  'Medellín'
FROM Usuarios u WHERE u.email = 'valentina.torres@demo.com';

-- Sebastián → Plomero / Fontanero (categoria_id = 1)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 1,
  'Técnico en fontanería con 10 años de experiencia en Cali. Especialista en detección de fugas, instalación de tuberías PVC y CPVC, griferías y sistemas hidráulicos. Cuento con equipo de cámara para inspección de ductos. Atención de emergencias 24/7.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Cali'
FROM Usuarios u WHERE u.email = 'sebastian.rojas@demo.com';

-- Andrés → Carpintero (categoria_id = 2)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 2,
  'Carpintero y ebanista con 12 años fabricando muebles a medida en Barranquilla. Trabajo en madera maciza, MDF y enchapados. Me especializo en cocinas integrales, closets y restauración de piezas antiguas. Cada trabajo tiene garantía de 1 año.',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
  'Barranquilla'
FROM Usuarios u WHERE u.email = 'andres.gomez@demo.com';

-- Natalia → Chef / Cocinero Particular (categoria_id = 14)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 14,
  'Chef profesional egresada del Politécnico de Gastronomía de Bogotá. Ofrezco servicios de cocina para eventos familiares, cenas privadas y preparación semanal de menús. Especialidad: cocina colombiana gourmet y pastelería. Manejo de dietas especiales y veganas.',
  'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'natalia.jimenez@demo.com';

-- Ricardo → Mecánico Automotriz (categoria_id = 6)
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 6,
  'Mecánico automotriz con certificación internacional ASE y 15 años de experiencia en vehículos a gasolina, diésel e híbridos. Cuento con scanner computarizado de última generación. Realizo mantenimientos preventivos, correctivos y revisiones técnico-mecánicas en mi taller y a domicilio.',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  'Medellín'
FROM Usuarios u WHERE u.email = 'ricardo.palacios@demo.com';
GO

-- =====================================================
-- 3. SERVICIOS Y PRECIOS
-- =====================================================

-- ── Carlos (Electricista) ──────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de tomacorrientes e interruptores',
  'Instalación o cambio de tomacorrientes sencillos, dobles y de 220V. Incluye materiales básicos.',
  60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Revisión y mantenimiento de tablero eléctrico',
  'Diagnóstico completo, corrección de fallos, cambio de breakers y puesta a tierra.',
  120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de iluminación y lámparas',
  'Montaje de lámparas colgantes, empotradas, de techo y sistemas de iluminación LED.',
  90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 40000, 90000, 'COP', 'Por punto eléctrico instalado'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'carlos.mendoza@demo.com' AND s.nombre LIKE '%tomacorriente%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 100000, 200000, 'COP', 'Revisión completa del tablero'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'carlos.mendoza@demo.com' AND s.nombre LIKE '%tablero%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 50000, 120000, 'COP', 'Por lámpara o punto de luz'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'carlos.mendoza@demo.com' AND s.nombre LIKE '%iluminación%';

-- ── Valentina (Estilista) ──────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Corte de cabello y peinado',
  'Corte personalizado con lavado, secado y peinado incluido. A domicilio.',
  75
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Coloración completa',
  'Tinte profesional L''Oréal con tóner, hidratación y secado. Incluye insumos.',
  150
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Balayage / Mechas californianas',
  'Técnica de aclarado degradado. Incluye tóner, baño de color y tratamiento hidratante.',
  240
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 35000, 70000, 'COP', 'Incluye desplazamiento a domicilio'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'valentina.torres@demo.com' AND s.nombre LIKE '%Corte%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 120000, 220000, 'COP', 'Según largo y densidad del cabello'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'valentina.torres@demo.com' AND s.nombre LIKE '%Coloración%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 250000, 450000, 'COP', 'Según largo y técnica aplicada'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'valentina.torres@demo.com' AND s.nombre LIKE '%Balayage%';

-- ── Sebastián (Plomero) ───────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Destape de cañerías y desagües',
  'Destape de lavamanos, sanitarios, fregaderos y desagües con equipo especializado de presión.',
  60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Detección y reparación de fugas',
  'Localización de fugas ocultas con cámara termográfica y reparación inmediata.',
  90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de grifería y sanitarios',
  'Instalación de lavamanos, duchas, llaves de paso, sanitarios y fluxómetros.',
  90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 60000, 150000, 'COP', 'Según tipo y gravedad de la obstrucción'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sebastian.rojas@demo.com' AND s.nombre LIKE '%Destape%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 300000, 'COP', 'Incluye diagnóstico con cámara'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sebastian.rojas@demo.com' AND s.nombre LIKE '%fugas%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 200000, 'COP', 'Por punto de instalación. Accesorios aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sebastian.rojas@demo.com' AND s.nombre LIKE '%grifería%';

-- ── Andrés (Carpintero) ───────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Closet a medida en MDF o madera',
  'Diseño, fabricación e instalación de closet con cajones, puertas corredizas y acabados laminados.',
  480
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Cocina integral',
  'Fabricación de muebles altos y bajos para cocina con cubierta y apliques de acero inoxidable.',
  960
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Reparación y restauración de muebles',
  'Reparación de bisagras, cajones, patas y restauración completa de muebles en madera y MDF.',
  120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 900000, 2800000, 'COP', 'Según dimensiones y material escogido'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'andres.gomez@demo.com' AND s.nombre LIKE '%Closet%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 2500000, 8000000, 'COP', 'Según metros lineales e incluye instalación'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'andres.gomez@demo.com' AND s.nombre LIKE '%Cocina%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 50000, 300000, 'COP', 'Según complejidad de la reparación'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'andres.gomez@demo.com' AND s.nombre LIKE '%Reparación%';

-- ── Natalia (Chef) ────────────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Cena privada para parejas o familias',
  'Menú de 3 tiempos preparado en tu cocina: entrada, plato fuerte y postre. Maridaje opcional.',
  180
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Preparación semanal de menús',
  'Cocino 5 días de almuerzo y cena para tu familia en tu hogar. Incluye compra de ingredientes.',
  360
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Cocina para eventos y celebraciones',
  'Menú buffet o embandejado para hasta 50 personas. Incluye montaje y presentación.',
  480
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 180000, 350000, 'COP', 'Para 2 a 6 personas. Ingredientes aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'natalia.jimenez@demo.com' AND s.nombre LIKE '%Cena%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 600000, 1200000, 'COP', 'Precio semanal para familia de hasta 4 personas'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'natalia.jimenez@demo.com' AND s.nombre LIKE '%semanal%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 1500000, 4000000, 'COP', 'Según número de personas y menú elegido'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'natalia.jimenez@demo.com' AND s.nombre LIKE '%evento%';

-- ── Ricardo (Mecánico) ────────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Mantenimiento preventivo 5000 km',
  'Cambio de aceite, filtros (aire, aceite, combustible), revisión de frenos y nivel de fluidos.',
  90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Diagnóstico computarizado',
  'Escáner OBD2 con reporte detallado de códigos de falla, sensores y estado general del vehículo.',
  60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Revisión técnico-mecánica previa',
  'Inspección completa antes de la revisión oficial: frenos, luces, emisiones, dirección y más.',
  120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 120000, 250000, 'COP', 'Incluye mano de obra. Aceite e insumos aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'ricardo.palacios@demo.com' AND s.nombre LIKE '%preventivo%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 60000, 80000, 'COP', 'Incluye reporte digital por correo'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'ricardo.palacios@demo.com' AND s.nombre LIKE '%Diagnóstico%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 120000, 'COP', 'Pre-revisión para vehículo particular'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'ricardo.palacios@demo.com' AND s.nombre LIKE '%técnico%';
GO

-- =====================================================
-- 4. HORARIOS DE ATENCIÓN
-- =====================================================

-- Carlos, Sebastián, Andrés, Ricardo → Lun–Vie 7am–6pm + Sáb 8am–1pm
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '07:00', '18:00', 1
FROM Profesionales p
JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS d(dia)
WHERE u.email IN ('carlos.mendoza@demo.com','sebastian.rojas@demo.com','andres.gomez@demo.com','ricardo.palacios@demo.com');

INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, 6, '08:00', '13:00', 1
FROM Profesionales p
JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email IN ('carlos.mendoza@demo.com','sebastian.rojas@demo.com','andres.gomez@demo.com','ricardo.palacios@demo.com');

-- Valentina, Natalia → Mar–Dom 9am–7pm (lunes descanso)
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '09:00', '19:00', 1
FROM Profesionales p
JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (2),(3),(4),(5),(6),(7)) AS d(dia)
WHERE u.email IN ('valentina.torres@demo.com','natalia.jimenez@demo.com');
GO

-- =====================================================
-- 5. ENLACES PROFESIONALES
-- =====================================================
INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/carlos.electrico.bta'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573001234501'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/valentina.estilista.mde'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'tiktok', 'https://tiktok.com/@valentina.estilista'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573001234503'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/andres.carpintero.baq'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/natalia.chef.bta'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573001234506'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';
GO

-- =====================================================
-- 6. RESEÑAS
-- =====================================================
INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'Carlos llegó puntual, explicó todo lo que iba a hacer y dejó todo impecable. Le cambió los 4 tomacorrientes de la sala en menos de una hora. Totalmente recomendado.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'miguel.ruiz@demo.com' AND up.email = 'carlos.mendoza@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'Valentina es una artista. Me hizo el balayage que llevaba tiempo buscando, quedó perfecto. Muy cuidadosa con el cabello y con excelentes productos.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'isabella.ramirez@demo.com' AND up.email = 'valentina.torres@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 4,
  'Sebastián resolvió la fuga que tenía hace meses en 40 minutos. Muy profesional y sus precios son justos. Le doy 4 porque tardó un poco más de lo acordado en llegar.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'camilo.estrada@demo.com' AND up.email = 'sebastian.rojas@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'Andrés nos fabricó el closet del cuarto principal. Quedó hermoso y muy sólido. Cumplió con los tiempos al pie de la letra y el precio fue muy razonable.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'daniela.suarez@demo.com' AND up.email = 'andres.gomez@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'La cena que preparó Natalia para nuestro aniversario fue increíble. Los tres tiempos estuvieron deliciosos, la presentación espectacular. Sin duda la volvemos a contratar.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'miguel.ruiz@demo.com' AND up.email = 'natalia.jimenez@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'Ricardo le hizo el mantenimiento al carro en mi edificio. Muy organizado, trajo todo su equipo y el diagnóstico fue muy detallado. Lo recomiendo a ojos cerrados.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'isabella.ramirez@demo.com' AND up.email = 'ricardo.palacios@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 4,
  'Buen trabajo el de Carlos con el tablero. Detectó el problema rápido y lo solucionó el mismo día. Volveré a llamarlo.'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'camilo.estrada@demo.com' AND up.email = 'carlos.mendoza@demo.com';

INSERT INTO Resenas (cliente_id, profesional_id, puntuacion, comentario)
SELECT uc.id, p.id, 5,
  'Natalia preparó el almuerzo para una reunión de 20 personas en la oficina. Todo estuvo delicioso y la presentación fue muy elegante. ¡Volveremos a contratarla!'
FROM Usuarios uc CROSS JOIN Profesionales p JOIN Usuarios up ON p.usuario_id = up.id
WHERE uc.email = 'daniela.suarez@demo.com' AND up.email = 'natalia.jimenez@demo.com';
GO

-- =====================================================
-- RESUMEN FINAL
-- =====================================================
PRINT '';
PRINT '══════════════════════════════════════════════════════════════════';
PRINT '  Seed de usuarios demo completado.  Contraseña: Demo1234!       ';
PRINT '══════════════════════════════════════════════════════════════════';
PRINT '  PROFESIONALES:';
PRINT '    carlos.mendoza@demo.com    → Electricista        (Bogotá)     ';
PRINT '    valentina.torres@demo.com  → Barbero / Estilista  (Medellín)  ';
PRINT '    sebastian.rojas@demo.com   → Plomero             (Cali)       ';
PRINT '    andres.gomez@demo.com      → Carpintero          (Barranquilla)';
PRINT '    natalia.jimenez@demo.com   → Chef Particular     (Bogotá)     ';
PRINT '    ricardo.palacios@demo.com  → Mecánico Automotriz (Medellín)   ';
PRINT '  CLIENTES:';
PRINT '    miguel.ruiz@demo.com       isabella.ramirez@demo.com          ';
PRINT '    camilo.estrada@demo.com    daniela.suarez@demo.com            ';
PRINT '══════════════════════════════════════════════════════════════════';
GO
