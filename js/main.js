//SIMULADOR DE PRESUPUESTO Y INVENTARIO DINÁMICO (PRE-ENTREGA 7: DOM Y EVENTOS)

//1. CLASE MODELO (PASCALCASE)
class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);  
    }

    // Método para calcular precio con IVA (21%)
    sumarIva() {
        return this.precio * 1.21;
    }
}

//2.ESTADO INCIAL (ARRAY DE OBJETOS INSTANCIADOS)
const inventario = [
    new Producto(1, "Pan", 1500, 20),
    new Producto(2, "Leche", 1200, 15),
    new Producto(3, "Café", 4500, 10),
    new Producto(4, "Azúcar", 900, 8)
];

//3. SELECCIÓN DE ELEMENTOS DEL DOM 
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const inputBusqueda = document.getElementById("input-busqueda");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const resumenInventario = document.getElementById("resumen-inventario");

//4. FUNCIONES MODULARES Y DE RENDERIZADO 

//Función para mostrar feedback dinámico al usuario en el DOM 
function mostrarFeedback(mensaje, tipo = "exito") {
    mensajeFeedback.textContent = mensaje;
    mensajeFeedback.className = `feedback ${tipo}`;

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        mensajeFeedback.className = "feedback oculto";
    }, 3000);
}

// Función para calcular y renderizar el resumen acumulado con reduce()
function actualizarResumen(lista) {
    const totalInversion = lista.reduce((acumulador, prod) => acumulador + (prod.precio * prod.stock), 0);
    const totalUnidades = lista.reduce((acumulador, prod) => acumulador + prod.stock, 0);

    resumenInventario.innerHTML = `
        📊 <strong>Total de productos listados:</strong> ${lista.length} | 
        📦 <strong>Unidades totales:</strong> ${totalUnidades} | 
        💰 <strong>Valor en stock (base):</strong> $${totalInversion.toFixed(2)}
    `;
}

// Función principal de renderizado dinámico en pantalla
function renderizarProductos(lista) {
    // Limpiar el contenedor antes de dibujar
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No hay productos para mostrar.</p>`;
        actualizarResumen([]);
        return;
    }

    // Renderizado mediante Template Strings (innerHTML)
    for (const producto of lista) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        tarjeta.innerHTML = `
            <div>
                <h3>${producto.nombre}</h3>
                <p><strong>Precio Base:</strong> $${producto.precio.toFixed(2)}</p>
                <p><strong>Precio c/IVA:</strong> $${producto.sumarIva().toFixed(2)}</p>
                <p><strong>Stock:</strong> ${producto.stock} unidades</p>
            </div>
            <div class="acciones">
                <button class="btn btn-danger btn-eliminar" data-id="${producto.id}">🗑️ Eliminar</button>
            </div>
        `;
        contenedorProductos.appendChild(tarjeta);
    }

    // Actualizar bloque de totales
    actualizarResumen(lista);
}

// Función para agregar un nuevo producto desde el formulario
function agregarProducto(e) {
    e.preventDefault(); // Evita que la página se recargue

    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
        mostrarFeedback("⚠️ Por favor, completa todos los campos correctamente.", "error");
        return;
    }

    // Generar un ID único basado en el array
    const nuevoId = inventario.length > 0 ? Math.max(...inventario.map(p => p.id)) + 1 : 1;
    const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);

    inventario.push(nuevoProducto);
    
    // Limpiar formulario y re-renderizar
    formularioProducto.reset();
    inputNombre.focus();

    renderizarProductos(inventario);
    mostrarFeedback(`✅ Producto "${nombre}" agregado con éxito al inventario.`);
}

// Función para eliminar un producto mediante delegación de eventos
function eliminarProducto(e) {
    if (e.target.classList.contains("btn-eliminar")) {
        const idAEliminar = parseInt(e.target.getAttribute("data-id"));
        const indice = inventario.findIndex(p => p.id === idAEliminar);

        if (indice !== -1) {
            const productoEliminado = inventario[indice].nombre;
            inventario.splice(indice, 1);
            renderizarProductos(inventario);
            mostrarFeedback(`🗑️ Producto "${productoEliminado}" eliminado del inventario.`, "error");
        }
    }
}

// Función para filtrar por teclado en tiempo real mediante filter()
function filtrarProductos() {
    const terminoBusqueda = inputBusqueda.value.toLowerCase().trim();
    const productosFiltrados = inventario.filter(prod => 
        prod.nombre.toLowerCase().includes(terminoBusqueda)
    );
    renderizarProductos(productosFiltrados);
}

// 5. ASIGNACIÓN DE EVENTOS (LISTENERS)
formularioProducto.addEventListener("submit", agregarProducto);
contenedorProductos.addEventListener("click", eliminarProducto);
inputBusqueda.addEventListener("input", filtrarProductos); // Evento de teclado en tiempo real

// 6. INICIALIZACIÓN DE LA APLICACIÓN
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(inventario);
});