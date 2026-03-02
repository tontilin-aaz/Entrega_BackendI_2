const socket = io();
const socketStatus = document.getElementById('socketStatus');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const productsContainer = document.getElementById('productsContainer');
const productForm = document.getElementById('productForm');

// Estado de conexión
socket.on('connect', () => {
    updateStatus('🟢 Conectado al servidor', 'status-connected', 'fa-plug');
    console.log('Conectado al servidor WebSocket');
});

socket.on('disconnect', () => {
    updateStatus('🔴 Desconectado del servidor', 'status-disconnected', 'fa-plug');
    console.log('Desconectado del servidor WebSocket');
});

// Actualizar productos cuando hay cambios
socket.on('productsUpdated', (products) => {
    console.log('Productos actualizados recibidos:', products);
    renderProducts(products);
});

// Confirmación de producto agregado
socket.on('productAdded', (newProduct) => {
    console.log('✅ Producto agregado exitosamente:', newProduct);
});

// Confirmación de producto eliminado
socket.on('productDeleted', (productId) => {
    console.log('✅ Producto eliminado exitosamente:', productId);
});

// Manejo de errores
socket.on('error', (error) => {
    console.error('❌ Error del servidor:', error);
    alert('Error: ' + error.message);
});

function updateStatus(text, className, iconClass) {
    statusText.textContent = text;
    socketStatus.className = 'socket-status ' + className;
    statusIcon.className = 'fas ' + iconClass;
}

function renderProducts(products) {
    if (!products || products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }

    const productsHTML = products.map(product => `
        <div class="product-card" id="product-${product.id}">
            <div class="product-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <span class="category">${product.category}</span>
                <div class="product-details">
                    <div class="price">$${product.price}</div>
                    <div class="stock">${product.stock} unidades</div>
                </div>
                <div class="product-details">
                    <div>ID: ${product.id}</div>
                    <div>Código: ${product.code}</div>
                </div>
                ${product.status 
                    ? '<div style="color: #48bb78; font-weight: bold;">✓ Disponible</div>' 
                    : '<div style="color: #f56565; font-weight: bold;">✗ No disponible</div>'}
                <button class="delete-btn" onclick="deleteProduct('${product.id}')" style="margin-top: 10px; width: 100%;">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = productsHTML;
}

// Manejar envío del formulario
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(productForm);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        status: true,
        thumbnails: []
    };

    // Validar datos
    if (!productData.title || !productData.description || !productData.code || 
        !productData.price || !productData.stock || !productData.category) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (isNaN(productData.price) || productData.price <= 0) {
        alert('El precio debe ser un número positivo');
        return;
    }

    if (isNaN(productData.stock) || productData.stock < 0) {
        alert('El stock debe ser un número no negativo');
        return;
    }

    console.log('Enviando producto:', productData);
    
    // Deshabilitar botón temporalmente
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agregando...';
    
    // Emitir evento para agregar producto
    socket.emit('addProduct', productData);
    
    // Resetear formulario después de un pequeño delay
    setTimeout(() => {
        productForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar Producto';
        alert('✅ Producto agregado correctamente!');
    }, 500);
});

// Función global para eliminar productos
window.deleteProduct = function(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        console.log('Eliminando producto:', productId);
        socket.emit('deleteProduct', productId);
    }
};