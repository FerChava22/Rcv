let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

const listaClientes = document.getElementById('listaClientes');
const formCliente = document.getElementById('formCliente');
const buscarCliente = document.getElementById('buscarCliente');

function mostrarClientes(filtro = '') {
  listaClientes.innerHTML = '';
  let clientesFiltrados = clientes.filter(c => c.nombre.toLowerCase().includes(filtro.toLowerCase()));
  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = '<li>No hay clientes que coincidan.</li>';
    return;
  }
  clientesFiltrados.forEach((cliente, i) => {
    let li = document.createElement('li');
    li.textContent = `${cliente.nombre} - Tel: ${cliente.telefono}`;
    listaClientes.appendChild(li);
  });
}

formCliente.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();

  if (!nombre || !telefono) return alert('Complete todos los campos.');

  clientes.push({ nombre, telefono });
  localStorage.setItem('clientes', JSON.stringify(clientes));

  formCliente.reset();
  mostrarClientes();
});

buscarCliente.addEventListener('input', () => {
  mostrarClientes(buscarCliente.value);
});

// Mostrar inicialmente
mostrarClientes();