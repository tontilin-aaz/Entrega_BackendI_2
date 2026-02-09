const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
});

socket.on('productsUpdated', (products) => {
    console.log('Productos actualizados:', products);
});

socket.on('productAdded', (newProduct) => {
    console.log('Nuevo producto agregado:', newProduct);
    location.reload();
});

socket.on('productDeleted', (productId) => {
    console.log('Producto eliminado:', productId);
    location.reload();
});