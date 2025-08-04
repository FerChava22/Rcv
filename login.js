// Ejemplo básico de usuarios guardados (puede mejorarse con almacenamiento seguro)
const usuarios = [
  { username: "admin", password: "admin123", role: "administrador", nombre: "Administrador" },
  { username: "mecanico1", password: "meca123", role: "mecanico", nombre: "Mecánico Uno" }
];

// Guardar usuarios en localStorage si no existen (para persistencia)
if (!localStorage.getItem('usuarios')) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;

  let listaUsuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  const usuarioEncontrado = listaUsuarios.find(u => u.username === usuario && u.password === password);

  if (usuarioEncontrado) {
    // Guardar sesión en localStorage o sessionStorage
    localStorage.setItem('usuarioSesion', JSON.stringify(usuarioEncontrado));
    window.location.href = "admin.html";
  } else {
    document.getElementById('error-msg').textContent = "Usuario o contraseña incorrectos.";
  }
});