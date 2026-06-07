-- =====================================================
-- SEED: Publicaciones de demostración
-- 1 publicación por profesional + 3 fotos adicionales cada una
-- Requiere haber ejecutado seed-usuarios-demo.sql antes
-- =====================================================

USE OficiosApp;
GO

-- =====================================================
-- PUBLICACIONES PRINCIPALES
-- =====================================================

-- ── Carlos Mendoza — Electricista ─────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '⚡ Instalación eléctrica completa — Apto 304, Bogotá',
  'Realizamos la instalación eléctrica completa de un apartamento de 80 m² en Chapinero. El trabajo incluyó: cableado nuevo en toda la unidad, instalación de 18 tomacorrientes dobles, 6 interruptores con dimmer, tablero de distribución de 20 circuitos con breakers termomagnéticos y puesta a tierra certificada RETIE. El cliente tenía problemas frecuentes de cortocircuito por una instalación antigua de los años 80. Tiempo de ejecución: 3 días. Garantía: 1 año sobre materiales y mano de obra.',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'carlos.mendoza@demo.com';

-- ── Valentina Torres — Estilista ──────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '✨ Balayage + Tóner violeta — Transformación completa',
  'Este fue uno de mis trabajos favoritos del mes. Mi clienta llegó con cabello castaño oscuro muy opaco y quería algo luminoso para el verano. Realizamos un balayage en 3 tonos (caramelo, miel y rubio claro) con tóner violeta para neutralizar amarillos. El proceso tomó 4 horas e incluyó: decoloración con papel aluminio, baño de color con tóner L''Oréal, mascarilla Kérastase de hidratación profunda y secado con keratina sin formol. Resultado: cabello brillante, sedoso y con movimiento natural. ¡Cero daño!',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'valentina.torres@demo.com';

-- ── Sebastián Rojas — Plomero ─────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🔧 Detección y reparación de fuga oculta en pared — Cali',
  'El cliente llevaba 2 meses con humedad en la pared del baño sin saber la causa. Utilizamos nuestra cámara termográfica para localizar la fuga exacta sin necesidad de derribar toda la pared. Encontramos una unión rota en la tubería de agua caliente a 40 cm de profundidad. Abrimos solo el área necesaria (40 × 20 cm), cambiamos el tramo de tubería CPVC, sellamos con membrana impermeabilizante y dejamos la pared lista para pintar. Sin la cámara, el cliente hubiera tenido que destruir todo el baño. Tiempo de trabajo: 3 horas.',
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'sebastian.rojas@demo.com';

-- ── Andrés Gómez — Carpintero ─────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🪵 Closet a medida en madera maciza — Barranquilla',
  'Proyecto de closet principal para habitación de 4 × 3 m en conjunto residencial de Barranquilla. El cliente quería maximizar el espacio y aprovechar el nicho de la pared lateral. Diseñamos un closet en L de 3,80 m lineales en cedro colombiano con acabado en laca blanca mate. Incluye: 3 cajones con guías telescópicas con cierre suave, doble barra colgante, 2 módulos de zapatos con separadores ajustables, luz LED integrada con sensor de apertura, y espejo de cuerpo completo con marco. Tiempo de fabricación e instalación: 8 días.',
  'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'andres.gomez@demo.com';

-- ── Natalia Jiménez — Chef ────────────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🍽️ Cena privada de aniversario para 2 — Menú degustación',
  'Preparé esta cena especial para una pareja que celebraba su décimo aniversario en su apartamento en Rosales, Bogotá. El menú constó de 5 tiempos: (1) Amuse-bouche de ceviche de camarón en cucharita, (2) Entrada: carpaccio de res con rúgula, parmesano y aceite de trufa, (3) Sopa: crema de champiñones portobello con crutones artesanales, (4) Plato fuerte: lomo de res en costra de hierbas con puré de papa trufado y verduras al dente, (5) Postre: coulant de chocolate con helado de vainilla artesanal. Montaje de mesa incluido. Duración del servicio: 4 horas.',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'natalia.jimenez@demo.com';

-- ── Ricardo Palacios — Mecánico ───────────────────
INSERT INTO Publicaciones (profesional_id, titulo, descripcion, imagen_url)
SELECT p.id,
  '🔩 Mantenimiento 50.000 km + Diagnóstico computarizado — Toyota Corolla 2019',
  'Cliente llegó con su Toyota Corolla 2019 para mantenimiento de los 50.000 km. Con el escáner OBD2 detectamos 3 códigos de falla activos relacionados con el sensor de oxígeno trasero y el sistema de escape. El trabajo incluyó: cambio de aceite full sintético 5W-30, filtros de aire, aceite y cabina, revisión de frenos (pastillas al 40% de vida útil — se recomendó cambio preventivo), alineación y balanceo de las 4 llantas, limpieza de inyectores con aditivo ultrasónico, cambio de sensor de oxígeno trasero. El vehículo salió sin ningún código de falla y con todo en óptimas condiciones. Tiempo: 4 horas.',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'
FROM Profesionales p JOIN Usuarios u ON p.usuario_id = u.id
WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80', 1
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&q=80', 2
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';

INSERT INTO FotosPublicaciones (publicacion_id, imagen_url, orden)
SELECT pub.id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 3
FROM Publicaciones pub JOIN Profesionales p ON pub.profesional_id = p.id
JOIN Usuarios u ON p.usuario_id = u.id WHERE u.email = 'ricardo.palacios@demo.com';
GO

-- =====================================================
-- RESUMEN
-- =====================================================
PRINT '';
PRINT '══════════════════════════════════════════════════════════════════';
PRINT '  Publicaciones demo insertadas exitosamente.                    ';
PRINT '  6 publicaciones + 18 fotos adicionales (3 por profesional).   ';
PRINT '══════════════════════════════════════════════════════════════════';
GO
