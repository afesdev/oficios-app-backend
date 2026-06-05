const bcrypt = require('bcryptjs');
const pass = process.argv[2] || 'admin123';
bcrypt.hash(pass, 10).then(hash => {
  console.log(`Password: ${pass}`);
  console.log(`Hash:     ${hash}`);
  console.log(`\nSQL: INSERT INTO Usuarios (nombre_completo, email, password_hash, telefono, rol, estado) VALUES ('Andres Felipe Espitia Sanchez', 'andresfelipeespitiasanchez@email.com', '${hash}', '3245708137', 'admin', 'activo');`);
});
