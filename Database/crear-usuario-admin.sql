-- ============================================================
-- Script: Crear usuario administrador
-- Descripción: Crea el primer usuario con rol 'admin' para
--              gestionar promociones y otros contenidos.
--
-- ⚠️  IMPORTANTE: Cambia la contraseña antes de ejecutar.
--     El hash corresponde a: Admin2024@OficiosApp
--     Generado con bcrypt (10 rounds).
--     Para generar un nuevo hash puedes usar:
--       node -e "const b=require('bcryptjs'); b.hash('TuNuevaPass',10).then(h=>console.log(h))"
-- ============================================================

-- Verificar que el rol admin está permitido en la tabla
-- (ya debería estar si ejecutaste add-role-admin.sql)

-- Insertar usuario admin (si no existe ya)
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE email = 'afesdev2025@gmail.com' AND rol = 'admin')
BEGIN
    INSERT INTO Usuarios (
        nombre_completo,
        email,
        password_hash,
        telefono,
        rol,
        fecha_registro,
        estado
    )
    VALUES (
        'Andres Espitia (Admin)',
        'afesdev2025@gmail.com',
        -- Hash bcrypt de: Admin2024@OficiosApp  (10 rounds)
        '$2b$10$qNHVsOUx9ZYxGmbJyvsZlu9vjj9B8MFnnOOMd5VFTOd2/NlcHvHqm',
        '3000000000',
        'admin',
        GETDATE(),
        'activo'
    );

    PRINT 'Usuario administrador creado correctamente.';
    PRINT 'Email: afesdev2025@gmail.com';
    PRINT 'Contraseña temporal: Admin2024@OficiosApp';
    PRINT '*** CAMBIA LA CONTRASEÑA DESPUÉS DEL PRIMER INICIO DE SESIÓN ***';
END
ELSE
BEGIN
    PRINT 'Ya existe un usuario admin con ese email. No se realizaron cambios.';
END

-- Ver el usuario creado
SELECT id, nombre_completo, email, rol, fecha_registro, estado
FROM Usuarios
WHERE email = 'afesdev2025@gmail.com';
