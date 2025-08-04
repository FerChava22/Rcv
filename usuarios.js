document.addEventListener("DOMContentLoaded", () => {
  const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));
  if (!usuarioSesion || usuarioSesion.role !== "administrador") {
    alert("Acceso restringido.");
    location.href = "login.html";
    return;
  }

  const form = document.getElementById("formUsuario");
  const tabla = document.getElementById("tablaUsuarios");
  const listaPermisos = document.getElementById("listaPermisos");
  const btnCrearAdmin = document.getElementById("crearAdmin");

  const PERMISOS_DISPONIBLES = [
    { id: "ver_clientes", texto: "Ver Clientes" },
    { id: "editar_vehiculos", texto: "Editar Vehículos" },
    { id: "crear_orden", texto: "Crear Órdenes" },
    { id: "ver_inventario", texto: "Ver Inventario" },
    { id: "gestion_usuarios", texto: "Gestionar Usuarios" }
  ];

  const PERMISOS_POR_ROL = {
    administrador: PERMISOS_DISPONIBLES.map(p => p.id),
    mecanico: ["editar_vehiculos", "crear_orden"],
    recepcion: ["ver_clientes", "crear_orden"],
    bodega: ["ver_inventario"],
    calidad: ["ver_clientes"],
    gerencia: ["ver_clientes", "ver_inventario"]
  };

  function cargarPermisosSeleccionables(rolSeleccionado = "") {
    listaPermisos.innerHTML = "";
    PERMISOS_DISPONIBLES.forEach(p => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "permiso";
      checkbox.value = p.id;
      if (rolSeleccionado && PERMISOS_POR_ROL[rolSeleccionado]?.includes(p.id)) {
        checkbox.checked = true;
      }

      const label = document.createElement("label");
      label.appendChild(checkbox);
      label.append(" " + p.texto);
      listaPermisos.appendChild(label);
    });
  }

  document.getElementById("rol").addEventListener("change", e => {
    cargarPermisosSeleccionables(e.target.value);
  });

  function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  function guardarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
  }

  function renderizarUsuarios() {
    const usuarios = obtenerUsuarios();
    tabla.innerHTML = "";
    usuarios.forEach(user => {
      const tr = document.createElement("tr");

      const td1 = document.createElement("td");
      td1.textContent = user.username;
      const td2 = document.createElement("td");
      td2.textContent = user.nombre;
      const td3 = document.createElement("td");
      td3.textContent = user.role;
      const td4 = document.createElement("td");
      td4.textContent = (user.permisos || []).join(", ");

      const td5 = document.createElement("td");
      td5.className = "acciones";

      if (user.username !== usuarioSesion.username) {
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => {
          if (user.role === "administrador" && user.username === "admin") {
            return alert("No puedes eliminar al administrador principal.");
          }
          const confirmacion = confirm("¿Eliminar usuario?");
          if (confirmacion) {
            const nuevos = usuarios.filter(u => u.username !== user.username);
            guardarUsuarios(nuevos);
            renderizarUsuarios();
          }
        };
        td5.appendChild(btnEliminar);

        const btnReset = document.createElement("button");
        btnReset.textContent = "Reiniciar Contraseña";
        btnReset.onclick = () => {
          const nueva = prompt("Nueva contraseña:");
          if (nueva?.length < 6) return alert("Debe tener al menos 6 caracteres.");
          user.password = nueva;
          guardarUsuarios(usuarios);
          alert("Contraseña actualizada.");
        };
        td5.appendChild(btnReset);
      } else {
        td5.textContent = "(Tú mismo)";
      }

      tr.append(td1, td2, td3, td4, td5);
      tabla.appendChild(tr);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    if (password.length < 6) return alert("Contraseña muy débil");

    const permisos = Array.from(document.querySelectorAll('input[name="permiso"]:checked'))
      .map(cb => cb.value);

    const usuarios = obtenerUsuarios();
    if (usuarios.find(u => u.username === username)) {
      alert("Nombre de usuario ya existe.");
      return;
    }

    usuarios.push({
      nombre,
      username,
      password,
      role: rol,
      permisos
    });

    guardarUsuarios(usuarios);
    form.reset();
    listaPermisos.innerHTML = "";
    renderizarUsuarios();
    alert("Usuario creado.");
  });

  // Siempre mostrar el botón para crear admin
  const verificarAdmin = () => {
    btnCrearAdmin.style.display = "inline-block";
    btnCrearAdmin.onclick = () => {
      const usuarios = obtenerUsuarios();
      const yaExiste = usuarios.some(u => u.username === "admin");

      if (yaExiste) {
        alert("El usuario admin ya existe.");
        return;
      }

      usuarios.push({
        nombre: "Administrador Principal",
        username: "admin",
        password: "admin123",
        role: "administrador",
        permisos: PERMISOS_POR_ROL["administrador"]
      });

      guardarUsuarios(usuarios);
      renderizarUsuarios();
      alert("Usuario admin creado correctamente.");
    };
  };

  cargarPermisosSeleccionables();
  renderizarUsuarios();
  verificarAdmin();
});