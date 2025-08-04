// logout.js

function logout() {
  // Borra los datos de sesión del usuario
  localStorage.removeItem("usuarioSesion");

  // Redirige a la página de login
  window.location.href = "login.html";
}