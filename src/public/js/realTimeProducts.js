const socket = io();
const socketStatus = document.getElementById('socketStatus');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const productsContainer = document.getElementById('productsContainer');
const productForm = document.getElementById('productForm');

socket.on('connect', () => {
    updateStatus('Conectado al servidor', 'status-connected', 'fa-plug');
});

socket.on('disconnect', () => {
    updateStatus('Desconectado del servidor', 'status-disconnected', 'fa-plug');
});

socket.on('productsUpdated', (products) => {
    renderProducts(products);
});

socket.on('productAdded', (newProduct) => {
    console.log('Producto agregado:', newProduct);
});

socket.on('productDeleted', (productId) => {
    console.log('Producto eliminado:', productId);
});

function updateStatus(text, className, iconClass) {
    statusText.textContent = text;
    socketStatus.className = 'socket-status ' + className;
    statusIcon.className = 'fas ' + iconClass;
}

function renderProducts(products) {
    if (products.length === 0) {
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
                <button class="delete-btn" onclick="deleteProduct(${product.id})" style="margin-top: 10px; width: 100%;">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = productsHTML;
}

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

    socket.emit('addProduct', productData);
    
    productForm.reset();
    alert('Producto agregado correctamente!');
});

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        socket.emit('deleteProduct', productId);
    }
}