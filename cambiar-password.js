const form = document.getElementById("formCambiarPassword");
const passwordNueva = document.getElementById("passwordNueva");
const passwordConfirmar = document.getElementById("passwordConfirmar");
const errorMsg = document.getElementById("errorMsg");

const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));

if (!usuarioSesion) {
  alert("No has iniciado sesión. Redirigiendo al login...");
  window.location.href = "login.html";
} else if (!usuarioSesion.requiereCambio) {
  // Si no requiere cambio, va directo al panel
  window.location.href = "admin.html";
}

function notificar(mensaje) {
  const n = document.createElement("div");
  n.className = "notificacion";
  n.textContent = mensaje;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  errorMsg.textContent = "";

  const nueva = passwordNueva.value.trim();
  const confirmar = passwordConfirmar.value.trim();

  if (nueva.length < 6) {
    errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }
  if (!/\d/.test(nueva) || !/[a-zA-Z]/.test(nueva)) {
    errorMsg.textContent = "La contraseña debe incluir letras y números.";
    return;
  }
  if (nueva !== confirmar) {
    errorMsg.textContent = "Las contraseñas no coinciden.";
    return;
  }

  // Actualizar contraseña en usuarios almacenados
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuarioIndex = usuarios.findIndex(u => u.username === usuarioSesion.username);
  if (usuarioIndex === -1) {
    alert("Usuario no encontrado. Redirigiendo a login.");
    window.location.href = "login.html";
    return;
  }

  usuarios[usuarioIndex].password = nueva;
  usuarios[usuarioIndex].requiereCambio = false;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Actualizar también usuarioSesion
  usuarioSesion.password = nueva;
  usuarioSesion.requiereCambio = false;
  localStorage.setItem("usuarioSesion", JSON.stringify(usuarioSesion));

  notificar("Contraseña cambiada con éxito.");

  // Después de unos segundos, redirige al panel
  setTimeout(() => {
    window.location.href = "admin.html";
  }, 1500);
});