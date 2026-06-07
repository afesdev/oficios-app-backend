-- =====================================================
-- SEED 2: 10 Profesionales adicionales con todo incluido
-- Contraseña de TODOS: Demo1234!
-- Ejecutar DESPUÉS de seed-usuarios-demo.sql
-- =====================================================
-- Categorías usadas en este seed:
--   4  Pintor
--   5  Médico General
--   7  Cerrajero
--   8  Jardinero / Paisajista
--   9  Abogado
--  10  Contador / Fiscalista
--  11  Arquitecto
--  12  Técnico en Refrigeración
--  15  Técnico en Reparación de Electrodomésticos
--   3  Electricista (segunda ciudad: Cúcuta)
-- =====================================================

USE OficiosApp;
GO

-- =====================================================
-- 1. USUARIOS
-- =====================================================
INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado) VALUES
  ('Jorge Enrique Medina Varón',    'jorge.medina@demo.com',     '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234501', 'profesional', 'activo'),
  ('Paola Andrea Nieto Sánchez',    'paola.nieto@demo.com',      '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234502', 'profesional', 'activo'),
  ('Fernando Alexis Cárdenas Ruiz', 'fernando.cardenas@demo.com','$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234503', 'profesional', 'activo'),
  ('Marcela Inés Guerrero Prada',   'marcela.guerrero@demo.com', '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234504', 'profesional', 'activo'),
  ('Héctor Fabio Lozano Barrera',   'hector.lozano@demo.com',    '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234505', 'profesional', 'activo'),
  ('Claudia Patricia Mora Arévalo', 'claudia.mora@demo.com',     '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234506', 'profesional', 'activo'),
  ('Julián David Ospina Restrepo',  'julian.ospina@demo.com',    '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234507', 'profesional', 'activo'),
  ('Sandra Milena Castro Peña',     'sandra.castro@demo.com',    '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234508', 'profesional', 'activo'),
  ('William Ernesto Salcedo Torres','william.salcedo@demo.com',  '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234509', 'profesional', 'activo'),
  ('Adriana Lucía Fuentes Gómez',   'adriana.fuentes@demo.com',  '$2b$10$73o8GR16a3mWyfOdMji5HO817kI6d2KCj/S4bT01Fi/a7/Sr.uTvS', '3101234510', 'profesional', 'activo');
GO

-- =====================================================
-- 2. PROFESIONALES
-- =====================================================

-- Jorge → Pintor (4) — Bogotá
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 4,
  'Maestro pintor con 14 años de experiencia en pintura de interiores, exteriores, texturas decorativas y drywall. Trabajo con pinturas Sherwin-Williams, Pintuco y Sika. Mis acabados son limpios, sin goteos ni manchas. Me especializo en textura arena, estuco venezolano y pintura epóxica para pisos. Incluyo protección de muebles y limpieza total al finalizar.',
  'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'jorge.medina@demo.com';

-- Paola → Médico General (5) — Bogotá
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 5,
  'Médica general egresada de la Universidad Nacional de Colombia con especialización en medicina familiar. Ofrezco consultas a domicilio para adultos y niños, valoraciones preventivas, manejo de enfermedades crónicas y urgencias de baja complejidad. Trabajo con historia clínica digital y remito a especialistas cuando es necesario. Atención cálida, empática y basada en evidencia.',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'paola.nieto@demo.com';

-- Fernando → Cerrajero (7) — Medellín
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 7,
  'Cerrajero profesional con 9 años de experiencia en apertura de puertas sin daño, instalación de chapas de seguridad, cerraduras digitales y sistemas de control de acceso. Atención 24/7 para emergencias. Trabajo con marcas Schlage, Yale, Kwikset y Mul-T-Lock. Garantizo discreción, rapidez y precios sin sorpresas.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Medellín'
FROM Usuarios u WHERE u.email = 'fernando.cardenas@demo.com';

-- Marcela → Jardinero / Paisajista (8) — Cali
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 8,
  'Paisajista y diseñadora de jardines con formación en la Universidad del Valle. Transformo espacios exteriores e interiores con jardines verticales, huertos urbanos, terrazas verdes y jardines zen. Manejo de plantas tropicales, suculentas y orquídeas. Servicios de mantenimiento mensual y poda técnica de árboles ornamentales.',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Cali'
FROM Usuarios u WHERE u.email = 'marcela.guerrero@demo.com';

-- Héctor → Abogado (9) — Bogotá
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 9,
  'Abogado con 11 años de trayectoria en derecho laboral, civil y de familia. Egresado de la Universidad Externado de Colombia con especialización en derecho laboral y seguridad social. Atiendo consultas presenciales y virtuales. Me especializo en despidos injustificados, conciliaciones laborales, divorcios, custodia de menores y procesos sucesorales. Primera consulta gratuita.',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'hector.lozano@demo.com';

-- Claudia → Contador / Fiscalista (10) — Medellín
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 10,
  'Contadora pública titulada con especialización en tributaria y 10 años apoyando a pequeñas y medianas empresas en Medellín. Experta en declaraciones de renta persona natural y jurídica, contabilidad mensual, nómina, facturación electrónica DIAN y revisoría fiscal. Trabajo 100% virtual con entregables puntuales y sin sorpresas.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
  'Medellín'
FROM Usuarios u WHERE u.email = 'claudia.mora@demo.com';

-- Julián → Arquitecto (11) — Bogotá
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 11,
  'Arquitecto con maestría en diseño urbano y 8 años de experiencia en remodelaciones residenciales, diseño de interiores y ampliaciones. Manejo software BIM (Revit, ArchiCAD) y renderizado 3D fotorrealista. Gestiono licencias de construcción, permisos de curaduría y supervisión de obra. Mi filosofía: espacios funcionales, sostenibles y con identidad propia.',
  'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&q=80',
  'Bogotá'
FROM Usuarios u WHERE u.email = 'julian.ospina@demo.com';

-- Sandra → Técnico en Refrigeración (12) — Barranquilla
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 12,
  'Técnica en refrigeración y climatización certificada por el SENA con 7 años de experiencia en Barranquilla. Instalo, mantengo y reparo aires acondicionados de todas las marcas (LG, Samsung, Carrier, Panasonic, Mabe). Manejo sistemas inverter, split y de ventana. También reparo neveras, vitrinas refrigeradas y cuartos fríos comerciales. Disponible los 7 días de la semana.',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80',
  'Barranquilla'
FROM Usuarios u WHERE u.email = 'sandra.castro@demo.com';

-- William → Técnico en Reparación de Electrodomésticos (15) — Cali
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 15,
  'Técnico electrónico con 12 años reparando electrodomésticos de línea blanca en Cali. Me especializo en lavadoras (carga frontal y superior), neveras, secadoras, lavavajillas y hornos eléctricos. Trabajo con equipos Samsung, LG, Whirlpool, Haceb y Mabe. Diagnóstico a domicilio sin costo, repuestos originales y garantía de 3 meses sobre la reparación.',
  'https://images.unsplash.com/photo-1581092921461-39b1ee4cd4d3?w=400&q=80',
  'Cali'
FROM Usuarios u WHERE u.email = 'william.salcedo@demo.com';

-- Adriana → Electricista (3) — Cúcuta
INSERT INTO Profesionales (usuario_id, categoria_id, descripcion_perfil, foto_perfil_url, ciudad)
SELECT u.id, 3,
  'Ingeniera eléctrica con certificación RETIE y 6 años de experiencia en instalaciones industriales y residenciales en Cúcuta. Diseño y ejecuto proyectos eléctricos desde cero, cálculo de cargas, instalación de plantas eléctricas, UPS y paneles solares fotovoltaicos. Soy una de las pocas profesionales mujeres del sector en el nororiente colombiano. Trabajo con las más altas normas de seguridad.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'Cúcuta'
FROM Usuarios u WHERE u.email = 'adriana.fuentes@demo.com';
GO

-- =====================================================
-- 3. SERVICIOS Y PRECIOS
-- =====================================================

-- ── Jorge (Pintor) ────────────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Pintura de habitación completa', 'Pintura de techo, paredes y molduras. Incluye masilla, lija, sellador y 2 manos de pintura.', 300
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Textura estuco venezolano', 'Aplicación de estuco venezolano en paredes. Acabado liso, media naranja o rustico a elección.', 480
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Pintura fachada exterior', 'Pintura de fachada con pintura de caucho exterior, sellador anti-humedad e impermeabilizante.', 600
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 150000, 320000, 'COP', 'Por habitación estándar de 12 m²'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'jorge.medina@demo.com' AND s.nombre LIKE '%habitación%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 25000, 45000, 'COP', 'Por metro cuadrado de pared'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'jorge.medina@demo.com' AND s.nombre LIKE '%estuco%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 20000, 35000, 'COP', 'Por metro cuadrado de fachada'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'jorge.medina@demo.com' AND s.nombre LIKE '%fachada%';

-- ── Paola (Médica) ────────────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Consulta médica a domicilio', 'Valoración general, diagnóstico, formulación médica y remisiones si aplica. Con historia clínica digital.', 45
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Chequeo preventivo anual', 'Examen físico completo, toma de signos vitales, revisión de exámenes de laboratorio y plan de salud personalizado.', 60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Atención de urgencias domiciliarias', 'Valoración urgente para fiebre alta, dolor agudo, crisis asmática u otras urgencias de baja complejidad.', 30
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 120000, 'COP', 'Incluye desplazamiento dentro de Bogotá'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'paola.nieto@demo.com' AND s.nombre LIKE '%Consulta%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 130000, 180000, 'COP', 'No incluye exámenes de laboratorio'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'paola.nieto@demo.com' AND s.nombre LIKE '%preventivo%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 100000, 150000, 'COP', 'Disponible las 24 horas'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'paola.nieto@demo.com' AND s.nombre LIKE '%urgencias%';

-- ── Fernando (Cerrajero) ──────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Apertura de puerta sin daño', 'Apertura de puertas residenciales o de vehículos sin destruir la chapa. Técnica de bumping o picking.', 30
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de cerradura digital', 'Instalación de cerraduras inteligentes con huella, PIN, tarjeta o app. Compatible con Alexa y Google Home.', 60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Cambio de chapa de seguridad', 'Cambio de chapa de puerta principal con cerradura de alta seguridad. Incluye 3 llaves maestras.', 45
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 60000, 120000, 'COP', 'Según tipo de chapa y horario'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'fernando.cardenas@demo.com' AND s.nombre LIKE '%Apertura%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 250000, 600000, 'COP', 'Mano de obra incluida. Cerradura aparte según marca.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'fernando.cardenas@demo.com' AND s.nombre LIKE '%digital%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 180000, 'COP', 'Incluye chapa de seguridad nivel 3'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'fernando.cardenas@demo.com' AND s.nombre LIKE '%chapa%';

-- ── Marcela (Jardinera) ───────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Diseño y creación de jardín vertical', 'Diseño, instalación de estructura metálica, sustrato y siembra de plantas seleccionadas para interior o exterior.', 240
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Mantenimiento mensual de jardín', 'Poda, abono, control de plagas, riego programado y reposición de plantas. Visita quincenal o mensual.', 120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Huerto urbano en casa o apartamento', 'Diseño e instalación de huerto con plantas aromáticas y vegetales comestibles en cajones de madera o mesas de cultivo.', 180
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 350000, 1200000, 'COP', 'Según área en m² y plantas elegidas'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'marcela.guerrero@demo.com' AND s.nombre LIKE '%vertical%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 120000, 280000, 'COP', 'Por visita mensual según tamaño del jardín'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'marcela.guerrero@demo.com' AND s.nombre LIKE '%Mantenimiento%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 280000, 600000, 'COP', 'Incluye estructura, sustrato y 12 plantas'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'marcela.guerrero@demo.com' AND s.nombre LIKE '%Huerto%';

-- ── Héctor (Abogado) ──────────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Consulta jurídica inicial', 'Análisis del caso, orientación legal y hoja de ruta. Presencial o virtual. Primera consulta gratuita.', 60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Demanda laboral por despido injusto', 'Representación en proceso laboral ante juzgado. Incluye redacción de demanda, pruebas y audiencias.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Proceso de divorcio y custodia', 'Tramitación de divorcio de mutuo acuerdo o contencioso. Regulación de cuota alimentaria y custodia de menores.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 0, 0, 'COP', 'Primera consulta GRATUITA'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'hector.lozano@demo.com' AND s.nombre LIKE '%inicial%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 1500000, 5000000, 'COP', 'Honorarios según complejidad del caso'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'hector.lozano@demo.com' AND s.nombre LIKE '%laboral%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 1200000, 4000000, 'COP', 'Mutuo acuerdo o contencioso según el caso'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'hector.lozano@demo.com' AND s.nombre LIKE '%divorcio%';

-- ── Claudia (Contadora) ───────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Declaración de renta persona natural', 'Elaboración y presentación de declaración de renta ante la DIAN para personas naturales obligadas y no obligadas.', 120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Contabilidad mensual PyME', 'Registro contable mensual, conciliaciones bancarias, estados financieros y reporte de IVA bimestral.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Nómina y seguridad social', 'Liquidación mensual de nómina, aportes a EPS, AFP, ARL y caja de compensación. Certificados de ingresos.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 150000, 400000, 'COP', 'Según nivel de ingresos y activos'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'claudia.mora@demo.com' AND s.nombre LIKE '%renta%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 300000, 800000, 'COP', 'Mensual según volumen de transacciones'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'claudia.mora@demo.com' AND s.nombre LIKE '%Contabilidad%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 150000, 350000, 'COP', 'Por empleado al mes'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'claudia.mora@demo.com' AND s.nombre LIKE '%Nómina%';

-- ── Julián (Arquitecto) ───────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Diseño arquitectónico y renders 3D', 'Planos arquitectónicos, renders fotorrealistas y maqueta digital para remodelaciones o construcciones nuevas.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Supervisión de obra residencial', 'Visitas semanales de control de calidad, seguimiento a contratistas y reporte fotográfico al propietario.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Trámite de licencia de construcción', 'Gestión completa del proceso ante curaduría urbana: documentos, planos técnicos y seguimiento hasta aprobación.', 0
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 800000, 3000000, 'COP', 'Según m² del proyecto. Incluye 3 renders.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'julian.ospina@demo.com' AND s.nombre LIKE '%Diseño%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 600000, 1500000, 'COP', 'Por mes de supervisión'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'julian.ospina@demo.com' AND s.nombre LIKE '%Supervisión%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 1500000, 4000000, 'COP', 'Según tipo y área de la licencia'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'julian.ospina@demo.com' AND s.nombre LIKE '%licencia%';

-- ── Sandra (Técnico Refrigeración) ────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de aire acondicionado split', 'Instalación completa de unidad split: soporte, tubería de cobre, drenaje y carga de gas refrigerante.', 180
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Mantenimiento preventivo de aire acondicionado', 'Limpieza de filtros, evaporador, condensador, revisión de gas y corriente eléctrica.', 90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Reparación de nevera o refrigerador', 'Diagnóstico y reparación de neveras: compresor, termostato, gas, evaporador y sistema eléctrico.', 120
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 200000, 450000, 'COP', 'Mano de obra. Materiales y gas aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sandra.castro@demo.com' AND s.nombre LIKE '%Instalación%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 150000, 'COP', 'Por unidad. Incluye carga de gas si es necesario.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sandra.castro@demo.com' AND s.nombre LIKE '%preventivo%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 100000, 500000, 'COP', 'Según la falla encontrada. Repuestos aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sandra.castro@demo.com' AND s.nombre LIKE '%nevera%';

-- ── William (Técnico Electrodomésticos) ───────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Reparación de lavadora', 'Diagnóstico y reparación de lavadoras de carga frontal y superior. Problemas eléctricos, mecánicos y de software.', 90
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Reparación de horno eléctrico o microondas', 'Cambio de resistencias, magnetrón, temporizadores y tarjetas electrónicas. Todas las marcas.', 60
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Diagnóstico de electrodoméstico a domicilio', 'Visita técnica para diagnóstico de cualquier electrodoméstico de línea blanca. Sin costo si se realiza la reparación.', 45
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 120000, 400000, 'COP', 'Según falla y repuesto. Con garantía 3 meses.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'william.salcedo@demo.com' AND s.nombre LIKE '%lavadora%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 80000, 250000, 'COP', 'Según pieza a reponer. Repuesto original.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'william.salcedo@demo.com' AND s.nombre LIKE '%horno%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 40000, 40000, 'COP', 'Gratuito si se contrata la reparación'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'william.salcedo@demo.com' AND s.nombre LIKE '%Diagnóstico%';

-- ── Adriana (Electricista) ────────────────────────
INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de panel solar fotovoltaico', 'Diseño, suministro e instalación de sistemas solares on-grid u off-grid para hogares y negocios.', 480
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Instalación de planta eléctrica', 'Instalación de generadores a gasolina o gas con transferencia automática ATS para hogares y comercios.', 300
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO Servicios (profesional_id, nombre, descripcion, duracion_estimada_min)
SELECT p.id, 'Diseño de instalación eléctrica certificada', 'Diseño de planos eléctricos con cálculo de cargas, calibres y protecciones según norma RETIE vigente.', 240
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 4000000, 15000000, 'COP', 'Según capacidad del sistema en kWp'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'adriana.fuentes@demo.com' AND s.nombre LIKE '%solar%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 800000, 2500000, 'COP', 'Mano de obra. Planta y transferencia aparte.'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'adriana.fuentes@demo.com' AND s.nombre LIKE '%planta%';

INSERT INTO PreciosReferenciales (servicio_id, precio_min, precio_max, moneda, descripcion_precio)
SELECT s.id, 500000, 1500000, 'COP', 'Incluye planos y memoria de cálculo'
FROM Servicios s JOIN Profesionales p ON s.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'adriana.fuentes@demo.com' AND s.nombre LIKE '%Diseño%';
GO

-- =====================================================
-- 4. HORARIOS DE ATENCIÓN
-- =====================================================

-- Jorge, Fernando, William → Lun–Sáb 7am–6pm
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '07:00', '18:00', 1
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(dia)
WHERE u.email IN ('jorge.medina@demo.com','fernando.cardenas@demo.com','william.salcedo@demo.com');

-- Paola → Lun–Dom 8am–8pm (médica disponible todos los días)
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '08:00', '20:00', 1
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6),(7)) AS d(dia)
WHERE u.email = 'paola.nieto@demo.com';

-- Sandra → Lun–Dom 8am–7pm (refrigeración en ciudad caliente)
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '08:00', '19:00', 1
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6),(7)) AS d(dia)
WHERE u.email = 'sandra.castro@demo.com';

-- Marcela, Héctor, Claudia, Julián, Adriana → Lun–Vie 8am–6pm + Sáb 9am–1pm
INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, d.dia, '08:00', '18:00', 1
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS d(dia)
WHERE u.email IN ('marcela.guerrero@demo.com','hector.lozano@demo.com','claudia.mora@demo.com','julian.ospina@demo.com','adriana.fuentes@demo.com');

INSERT INTO HorariosAtencion (profesional_id, dia_semana, hora_apertura, hora_cierre, activo)
SELECT p.id, 6, '09:00', '13:00', 1
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email IN ('marcela.guerrero@demo.com','hector.lozano@demo.com','claudia.mora@demo.com','julian.ospina@demo.com','adriana.fuentes@demo.com');
GO

-- =====================================================
-- 5. ENLACES PROFESIONALES
-- =====================================================
INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/jorge.pintor.bogota'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573101234501'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/dra.paola.medica'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573101234503'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/marcela.jardines.cali'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'tiktok', 'https://tiktok.com/@jardines.marcela'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/hector.abogado.laboral'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/julian.arq.bogota'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'whatsapp', 'https://wa.me/573101234509'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO EnlacesProfesionales (profesional_id, plataforma, url)
SELECT p.id, 'instagram', 'https://instagram.com/adriana.ingeniera.electrica'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';
GO

-- =====================================================
-- 6. PUBLICACIONES + FOTOS ADICIONALES
-- =====================================================

-- ── Jorge (Pintor) ────────────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🎨 Transformación total: sala-comedor con estuco venezolano y molduras',
  'El cliente quería renovar su sala-comedor de 45 m² en un conjunto de Chapinero. El espacio tenía pintura vieja, manchas de humedad y las paredes en mal estado. Proceso: remoción de pintura antigua, resane completo con masilla vinílica, aplicación de sellador anti-humedad, estuco venezolano en acabado liso brillante, y pintura Sherwin-Williams color "Alabaster" en paredes con techo en blanco neutro. Instalamos molduras de yeso en el borde del techo como detalle decorativo. Resultado: el espacio se ve más amplio, luminoso y moderno. Tiempo: 4 días. Sin un solo grano de pintura fuera de lugar.',
  'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'jorge.medina@demo.com';

-- ── Paola (Médica) ────────────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🩺 Consulta a domicilio para adulto mayor — Manejo de hipertensión y diabetes',
  'Atendí a don Hernando, 74 años, en su domicilio en Teusaquillo. Su familia me contactó porque llevaba semanas sin ir al médico y se sentía cansado. En la visita encontré presión arterial descontrolada (160/100) y glucemia en 280 mg/dL, posiblemente por abandono del tratamiento. Realizamos: valoración física completa, ajuste de medicamentos antihipertensivos, nueva pauta de insulina basal, solicitud de laboratorios y educación al cuidador sobre señales de alarma. Coordiné además una tele-consulta con cardiólogo para la semana siguiente. Don Hernando salió con todo claro y su familia muy tranquila.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'paola.nieto@demo.com';

-- ── Fernando (Cerrajero) ──────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🔐 Modernización de seguridad: cerradura digital Yale con huella y app',
  'Una familia en El Poblado, Medellín, quería mejorar la seguridad de su casa después de un intento de robo en el vecindario. Instalamos una cerradura inteligente Yale Assure Lock 2 en la puerta principal: apertura por huella dactilar, código PIN, tarjeta NFC y aplicación móvil. La cerradura se integró con Google Home para control por voz. El trabajo incluyó: desmontaje de la chapa antigua, adecuación del marco metálico, instalación y programación de 5 huellas y 3 códigos, emparejamiento con el smartphone del cliente y una clase de uso de 30 minutos. Sin llaves, sin preocupaciones.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1566981731417-d4c4e2683bc2?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'fernando.cardenas@demo.com';

-- ── Marcela (Jardinera) ───────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🌿 Jardín vertical de 12 m² en terraza — Apartamento en Cali',
  'Transformamos una terraza de 30 m² completamente vacía en un oasis verde en el barrio Granada, Cali. El cliente quería privacidad y frescura sin renunciar al espacio. Instalamos un jardín vertical de 12 m² con estructura galvanizada de 3 niveles, geotextil de alta duración y sistema de riego automatizado con temporizador. Las plantas seleccionadas: helechos, pothos, filodendros, begonias y anturios (todas adaptadas al clima caleño). Complementamos con 4 materas de concreto con palmeras enanas en las esquinas. La terraza bajó 3°C en temperatura percibida y el cliente tiene su rincón verde de ensueño.',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'marcela.guerrero@demo.com';

-- ── Héctor (Abogado) ──────────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '⚖️ Caso ganado: reintegro laboral y pago de salarios caídos — 14 meses de lucha',
  'Mi cliente, ingeniero de sistemas de 38 años, fue despedido sin justa causa después de 7 años en una empresa de telecomunicaciones. Lo despidieron mientras tenía una incapacidad médica, lo que constituye un despido discriminatorio. Presentamos acción de tutela y demanda laboral ordinaria simultáneamente. En 14 meses logramos: reintegro al cargo, pago de 14 meses de salarios caídos, indemnización moratoria, reconocimiento de prestaciones sociales del período no laborado y pago de costas del proceso. El cliente hoy trabaja en mejores condiciones y con una estabilidad laboral reforzada. ¡La justicia sí existe!',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1453945995629-5b49f6e47e60?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'hector.lozano@demo.com';

-- ── Claudia (Contadora) ───────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '📊 Salvamos a una PyME de una sanción DIAN de $48 millones — Caso real',
  'Una empresa de confecciones de Medellín llegó a mí con una notificación de la DIAN por inconsistencias en las declaraciones de IVA de 3 años anteriores. La sanción estimada era de $48 millones. Revisé los libros contables, identifiqué errores del contador anterior (facturas mal clasificadas y retenciones no aplicadas correctamente) y presenté una respuesta formal al pliego de cargos con todos los soportes. Después de 4 meses de proceso, la sanción quedó en $3,2 millones — una reducción del 93%. Además, reestructuramos toda la contabilidad de la empresa y la dejamos al día con facturación electrónica. Hoy son clientes mensuales.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'claudia.mora@demo.com';

-- ── Julián (Arquitecto) ───────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🏗️ Remodelación integral de casa de 2 pisos — De años 70 a diseño contemporáneo',
  'Proyecto de remodelación completa de una casa de 180 m² en el barrio La Soledad, Bogotá. La vivienda era de los años 70 y el cliente quería un hogar moderno, luminoso y funcional manteniendo la estructura original. Trabajo realizado: demolición de muros no estructurales para abrir la planta baja, diseño de cocina abierta integrada al comedor, escalera metálica con vidrio templado, fachada nueva en concreto expuesto y madera teca, cambio total de redes eléctricas e hidráulicas, y terraza verde en el segundo piso. Tiempo de ejecución: 8 meses. El resultado habla solo.',
  'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'julian.ospina@demo.com';

-- ── Sandra (Refrigeración) ────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '❄️ Instalación de 4 aires split inverter — Oficinas comerciales en Barranquilla',
  'Una firma de abogados en el Centro Histórico de Barranquilla necesitaba climatizar 4 oficinas de forma eficiente. El edificio antiguo tenía restricciones de obra, así que diseñé un sistema con unidades condensadoras en la azotea y ductos ocultos en el cielo raso de drywall. Instalamos 4 equipos Carrier inverter de 18.000 BTU cada uno con control WiFi individual, tuberías de cobre tipo L encajonadas y sistema de drenaje silencioso. El consumo de energía bajó un 35% vs. los equipos de ventana que tenían antes. Todo en un fin de semana para no afectar las operaciones de la firma.',
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1499810631641-541e76d678a2?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sandra.castro@demo.com';

-- ── William (Técnico Electrodomésticos) ───────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🔧 Reparación de lavadora Samsung de carga frontal — Error 4E en 45 minutos',
  'La clienta me llamó desesperada: su lavadora Samsung WW10T534 de solo 8 meses tiraba el error 4E (falla de llenado de agua) y Samsung le decía que el técnico tardaba 2 semanas. Llegué en 2 horas. Diagnóstico: filtro de entrada de agua completamente obstruido por sedimento y la válvula de llenado con presión insuficiente por caída de agua en el edificio. Solución: limpieza del filtro, instalación de válvula de refuerzo de presión de 1/2" y prueba de ciclo completo. 45 minutos de trabajo, $85.000 de cobro (sin piezas adicionales). La lavadora funciona perfecta. Garantía: 3 meses.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1581092921461-39b1ee4cd4d3?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1626806787461-102c1a7f1c62?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'william.salcedo@demo.com';

-- ── Adriana (Electricista / Solar) ────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '☀️ Sistema solar fotovoltaico 5 kWp — Factura de luz de $800k a $45k al mes',
  'Instalamos un sistema solar on-grid de 5 kWp para una vivienda de 4 habitaciones en Cúcuta. La familia pagaba $820.000 mensuales de energía eléctrica. Sistema instalado: 12 paneles monocristalinos de 450W marca JA Solar, inversor on-grid Growatt de 5 kW, cableado DC y AC calibre 10, sistema de monitoreo en tiempo real por app. Tramitamos la conexión con Cens (empresa de energía local) y la activación del medidor bidireccional para inyección de excedentes a la red. Primer mes de factura: $45.000. El sistema se paga solo en 4,5 años con una vida útil de 25 años. La familia ahorra $9 millones al año.',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'adriana.fuentes@demo.com';
GO

-- =====================================================
-- RESUMEN
-- =====================================================
PRINT '';
PRINT '══════════════════════════════════════════════════════════════════';
PRINT '  Seed 2 completado.  Contraseña de todos: Demo1234!             ';
PRINT '══════════════════════════════════════════════════════════════════';
PRINT '  jorge.medina@demo.com      → Pintor              (Bogotá)      ';
PRINT '  paola.nieto@demo.com       → Médica General      (Bogotá)      ';
PRINT '  fernando.cardenas@demo.com → Cerrajero           (Medellín)    ';
PRINT '  marcela.guerrero@demo.com  → Jardinera/Paisajista(Cali)        ';
PRINT '  hector.lozano@demo.com     → Abogado             (Bogotá)      ';
PRINT '  claudia.mora@demo.com      → Contadora           (Medellín)    ';
PRINT '  julian.ospina@demo.com     → Arquitecto          (Bogotá)      ';
PRINT '  sandra.castro@demo.com     → Técnica Refrigeración(Barranquilla)';
PRINT '  william.salcedo@demo.com   → Técnico Electrod.  (Cali)         ';
PRINT '  adriana.fuentes@demo.com   → Electricista/Solar  (Cúcuta)      ';
PRINT '══════════════════════════════════════════════════════════════════';
GO
