document.addEventListener("DOMContentLoaded", () => {
  const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));
  if (!usuarioSesion) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nombreUsuario").textContent =
    usuarioSesion.nombre + " (" + usuarioSesion.role + ")";

  const permisos = usuarioSesion.permisos || [];
  const contenedor = document.getElementById("contenedorOpciones");

  const modulos = [
    { permiso: "ver_clientes", nombre: "Clientes", archivo: "clientes.html" },
    { permiso: "editar_vehiculos", nombre: "Vehículos", archivo: "vehiculos.html" },
    { permiso: "crear_orden", nombre: "Órdenes de Servicio", archivo: "ordenes-crear.html" },
    { permiso: "ver_inventario", nombre: "Inventario", archivo: "inventario.html" },
    { permiso: "gestion_usuarios", nombre: "Gestión de Usuarios", archivo: "usuarios.html" }
  ];

  modulos.forEach(modulo => {
    if (permisos.includes(modulo.permiso)) {
      const div = document.createElement("div");
      div.className = "opcion";
      div.innerHTML = `
        <h3>${modulo.nombre}</h3>
        <a href="${modulo.archivo}">Entrar</a>
      `;
      contenedor.appendChild(div);
    }
  });
});