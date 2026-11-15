// ==========================================================================
// 1. ESTADO DEL CARRITO Y CONFIGURACIÓN
// ==========================================================================
let carrito = JSON.parse(localStorage.getItem('ferre_carrito')) || [];
const NUMERO_WHATSAPP = '584245737782'; // Cambia por tu número real con código de país

// Referencias del DOM
const btnCarrito = document.getElementById('btn-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const carritoPanel = document.getElementById('carrito-panel');
const carritoLista = document.getElementById('carrito-lista');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const btnToggleProductos = document.getElementById('btn-toggle-productos');
const productosExtra = document.getElementById('productos-extra');

// ==========================================================================
// 2. PESTAÑA DESPLEGABLE "VER MÁS / VER MENOS"
// ==========================================================================
btnToggleProductos.addEventListener('click', () => {
    const estaOculto = productosExtra.classList.contains('productos-ocultos');

    if (estaOculto) {
        productosExtra.classList.remove('productos-ocultos');
        btnToggleProductos.innerHTML = 'Ver menos productos 👆';
    } else {
        productosExtra.classList.add('productos-ocultos');
        btnToggleProductos.innerHTML = 'Ver más productos 👇';
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }
});

// ==========================================================================
// 3. FUNCIONES DEL CARRITO
// ==========================================================================

// Abrir / Cerrar Panel
btnCarrito.addEventListener('click', () => carritoPanel.classList.add('activo'));
btnCerrarCarrito.addEventListener('click', () => carritoPanel.classList.remove('activo'));

// Escuchar clics en los botones "Agregar al carrito"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);

        agregarAlCarrito(id, nombre, precio);
    }
});

function agregarAlCarrito(id, nombre, precio) {
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    actualizarCarritoUI();
    carritoPanel.classList.add('activo');
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(prod => prod.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(prod => prod.id !== id);
        }
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    localStorage.setItem('ferre_carrito', JSON.stringify(carrito));

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrecio.toFixed(2)}`;

    if (carrito.length === 0) {
        carritoLista.innerHTML = `<p class="carrito-vacio">El carrito está vacío.</p>`;
        return;
    }

    carritoLista.innerHTML = carrito.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0;">
            <div>
                <strong style="display: block; font-size: 0.95rem;">${item.nombre}</strong>
                <span style="color: #666; font-size: 0.85rem;">$${item.precio.toFixed(2)} c/u</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="cambiarCantidad('${item.id}', -1)" style="padding: 0.2rem 0.5rem; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 3px;">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad('${item.id}', 1)" style="padding: 0.2rem 0.5rem; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 3px;">+</button>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// 4. COTIZADOR POR WHATSAPP
// ==========================================================================
btnWhatsapp.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de cotizar.');
        return;
    }

    let mensaje = '👋 *Hola, Distribuidora y Ferrelectricos "Contreras"*\n';
    mensaje += 'Deseo solicitar la siguiente cotización:\n\n';

    carrito.forEach(item => {
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        mensaje += `• *${item.nombre}*\n  Cantidad: ${item.cantidad} | Subtotal: $${subtotal}\n`;
    });

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2);
    mensaje += `\n💵 *Total estimado: $${total}*\n\n`;
    mensaje += 'Quedo a la espera de confirmación de disponibilidad. ¡Muchas gracias!';

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
});

// Carga inicial
actualizarCarritoUI();