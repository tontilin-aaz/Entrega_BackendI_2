# 🛒 E-commerce Backend - Proyecto Final

Este proyecto es una API RESTful para un sistema de e-commerce, desarrollada con **Node.js**, **Express**, **MongoDB** y **Handlebars** como motor de plantillas. Incluye funcionalidades de tiempo real con **Socket.io**, gestión completa de productos y carritos, paginación, filtros, ordenamiento y vistas dinámicas. Es el trabajo final del curso de Backend.

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express** - Servidor backend
- **MongoDB** + **Mongoose** - Base de datos principal
- **Handlebars** - Motor de plantillas para las vistas
- **Socket.io** - Comunicación en tiempo real
- **dotenv** - Variables de entorno
- **mongoose-paginate-v2** - Paginación de productos

---

## 📋 Funcionalidades principales

### 🔹 Productos
- CRUD completo de productos.
- Listado con **paginación**, **filtros** (por categoría y disponibilidad) y **ordenamiento** (por precio ascendente/descendente).
- Endpoint `GET /api/products` con respuesta formateada según consigna.
- Vistas:
  - `/products` - Lista paginada con filtros.
  - `/products/:pid` - Detalle completo de un producto.
  - `/realtimeproducts` - Productos en tiempo real con WebSockets (agregar/eliminar).

### 🔹 Carritos
- Creación de carritos (automática desde el frontend con `localStorage`).
- Agregar productos al carrito.
- Eliminar un producto específico del carrito.
- Actualizar **todo el carrito** con un arreglo de productos.
- Actualizar **solo la cantidad** de un producto.
- Vaciar el carrito por completo.
- Al obtener un carrito (`GET /api/carts/:cid`) se devuelven los productos **completos** gracias a `populate` de Mongoose.
- Vista `/carts/:cid` para visualizar el carrito con sus productos.

### 🔹 WebSockets (Tiempo real)
- Conexión persistente con Socket.io.
- Actualización automática de la lista de productos en `/realtimeproducts` cuando alguien agrega o elimina un producto.
- Feedback visual de conexión/desconexión.

### 🔹 Vistas dinámicas con Handlebars
- Layout principal con navegación y contador de carrito actualizado.
- Helpers personalizados: `multiply`, `cartTotal`, `json` (para debug).
- Estilos CSS integrados (sin dependencias externas adicionales).

### 🔹 Experiencia de usuario mejorada
- **Carrito automático**: al visitar el sitio por primera vez, se crea un carrito y se guarda su ID en `localStorage`.
- **Contador en el header**: muestra la cantidad de productos en el carrito actual.
- **Feedback visual** en botones (estados de carga, éxito, error).
- **Manejo de errores** robusto en todas las capas (API, vistas, WebSockets).

---

## 📁 Estructura del proyecto
📦 proyecto-final
├── 📂 src
│ ├── 📂 data # Archivos JSON (solo respaldo, ya no se usan)
│ ├── 📂 manager # Managers con lógica de negocio (MongoDB)
│ │ ├── ProductManager.mongo.js
│ │ └── CartManager.mongo.js
│ ├── 📂 models # Modelos de Mongoose
│ │ ├── product.model.js
│ │ └── cart.model.js
│ ├── 📂 routes # Rutas de la API y vistas
│ │ ├── products.router.js
│ │ ├── carts.router.js
│ │ └── views.router.js
│ ├── 📂 views # Plantillas Handlebars
│ │ ├── layouts
│ │ │ └── main.handlebars
│ │ ├── home.handlebars
│ │ ├── products.handlebars
│ │ ├── productDetail.handlebars
│ │ ├── cart.handlebars
│ │ ├── realTimeProducts.handlebars
│ │ └── error.handlebars
│ ├── 📂 public # Archivos estáticos (JS, CSS, imágenes)
│ │ └── 📂 js
│ │ ├── realTimeProducts.js
│ │ └── home.js
│ └── app.js # Punto de entrada principal
├── 📂 scripts # Utilidades (migración, limpieza)
│ ├── migrateProducts.js
│ └── cleanCarts.js
├── .env # Variables de entorno (no subir a GitHub)
├── .gitignore
├── package.json
└── README.md

text

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
Crea un archivo .env en la raíz con el siguiente contenido:

env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=8080
Nota: Reemplaza los valores con tus credenciales de MongoDB Atlas.

4. Ejecutar en modo desarrollo
bash
npm run dev
La aplicación estará disponible en http://localhost:8080.

5. (Opcional) Migrar productos desde JSON a MongoDB
bash
node scripts/migrateProducts.js
6. (Opcional) Limpiar carritos de productos huérfanos
bash
node scripts/cleanCarts.js
📡 Endpoints de la API
Productos
Método	Ruta	Descripción
GET	/api/products	Lista productos con paginación, filtros y ordenamiento. Query params: limit, page, sort (asc/desc), query (categoría o disponibles/no-disponibles).
GET	/api/products/:pid	Obtiene un producto por su ID.
POST	/api/products	Crea un nuevo producto (requiere body JSON).
PUT	/api/products/:pid	Actualiza un producto (requiere body JSON).
DELETE	/api/products/:pid	Elimina un producto.
Carritos
Método	Ruta	Descripción
POST	/api/carts	Crea un nuevo carrito vacío.
GET	/api/carts/:cid	Obtiene un carrito con productos populados.
POST	/api/carts/:cid/product/:pid	Agrega un producto al carrito (si ya existe, incrementa cantidad).
DELETE	/api/carts/:cid/products/:pid	Elimina un producto específico del carrito.
PUT	/api/carts/:cid	Reemplaza todos los productos del carrito (body: { products: [...] }).
PUT	/api/carts/:cid/products/:pid	Actualiza solo la cantidad de un producto (body: { quantity: number }).
DELETE	/api/carts/:cid	Vacía el carrito (elimina todos los productos).

🌐 Vistas disponibles
Ruta	Descripción
/	Página de inicio con todos los productos (sin paginación).
/products	Lista de productos con paginación, filtros y ordenamiento.
/products/:pid	Detalle completo de un producto con botón para agregar al carrito.
/carts/:cid	Visualización del carrito, con opciones de modificar cantidades, eliminar productos y vaciar.
/realtimeproducts	Vista en tiempo real para agregar/eliminar productos mediante WebSockets.

🧪 Ejemplos de uso
Obtener productos con paginación y filtros
http
GET /api/products?limit=5&page=2&sort=asc&query=Electrónica
Respuesta:

json
{
  "status": "success",
  "payload": [ ... ],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?limit=5&page=1&sort=asc&query=Electrónica",
  "nextLink": "/api/products?limit=5&page=3&sort=asc&query=Electrónica"
}
Agregar producto al carrito (desde frontend)
javascript
// Ejemplo usando fetch
fetch('/api/carts/67a5eef588b1f8667f92d399/product/67b6f123abc456def7890123', {
  method: 'POST'
})
Actualizar cantidad de un producto en el carrito
http
PUT /api/carts/67a5eef588b1f8667f92d399/products/67b6f123abc456def7890123
Content-Type: application/json

{
  "quantity": 5
}
🧠 Decisiones técnicas destacadas
Managers con MongoDB: Se crearon ProductManager.mongo.js y CartManager.mongo.js que reemplazan a los anteriores basados en File System.

Paginación con mongoose-paginate-v2: Plugin que simplifica la paginación y devuelve metadatos útiles.

Transformación de _id a id: Todos los objetos devueltos al frontend incluyen un campo id legible, manteniendo compatibilidad con las vistas existentes.

Carrito automático: Se utiliza localStorage para persistir el ID del carrito, mejorando la experiencia de usuario.

WebSockets: Integración con socket.io para actualizaciones en tiempo real sin recargar la página.

Manejo de errores: Captura de excepciones en todos los niveles, con respuestas adecuadas y logs en consola.

📦 Scripts disponibles
Script	Descripción
npm run dev	Inicia el servidor en modo desarrollo con nodemon.
npm start	Inicia el servidor en producción.
node scripts/migrateProducts.js	Migra los productos desde products.json a MongoDB.
node scripts/cleanCarts.js	Elimina productos huérfanos de todos los carritos.
🔒 Consideraciones de seguridad
Las variables sensibles (URI de MongoDB) se almacenan en .env y no se suben al repositorio.

Validación de datos en endpoints de creación/actualización.

Protección contra IDs inválidos en MongoDB (mongoose.Types.ObjectId.isValid).

🧪 Testing sugerido
Puedes probar la API con herramientas como Postman, Thunder Client o directamente desde el navegador en las vistas.

📄 Licencia
Este proyecto es de uso académico y fue desarrollado como entrega final del curso de Backend.



¿Dudas o sugerencias? ¡No dudes en contactarme!
