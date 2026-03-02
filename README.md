# 🛒 E-commerce Backend - Proyecto Final

Este proyecto es una API RESTful para un sistema de e-commerce desarrollada con **Node.js**, **Express**, **MongoDB** y **Handlebars** como motor de plantillas.

Incluye funcionalidades en tiempo real con **Socket.io**, gestión completa de productos y carritos, paginación, filtros, ordenamiento y vistas dinámicas.

Proyecto desarrollado como trabajo final del curso de Backend.

---

# 🚀 Tecnologías utilizadas

- **Node.js** + **Express** — Servidor backend
- **MongoDB** + **Mongoose** — Base de datos principal
- **Handlebars** — Motor de plantillas
- **Socket.io** — Comunicación en tiempo real
- **dotenv** — Variables de entorno
- **mongoose-paginate-v2** — Paginación de productos
- **nodemon** — Desarrollo

---

# 📋 Funcionalidades principales

## 🔹 Productos

- CRUD completo de productos.
- Listado con:
  - ✅ Paginación
  - ✅ Filtros (por categoría y disponibilidad)
  - ✅ Ordenamiento (precio asc/desc)
- Endpoint `GET /api/products` con respuesta formateada.
- Vistas:
  - `/products` — Lista paginada
  - `/products/:pid` — Detalle de producto
  - `/realtimeproducts` — Gestión en tiempo real

---

## 🔹 Carritos

- Creación automática desde el frontend (usando `localStorage`).
- Agregar productos.
- Eliminar producto específico.
- Actualizar todo el carrito.
- Actualizar cantidad de un producto.
- Vaciar carrito completo.
- `populate()` de Mongoose para devolver productos completos.
- Vista `/carts/:cid` para visualizar el carrito.

---

## 🔹 WebSockets (Tiempo real)

- Conexión persistente con Socket.io.
- Actualización automática en `/realtimeproducts`.
- Feedback visual de conexión/desconexión.

---

## 🔹 Vistas dinámicas con Handlebars

- Layout principal con navegación.
- Contador de carrito dinámico.
- Helpers personalizados:
  - `multiply`
  - `cartTotal`
  - `json`
- Estilos CSS integrados.

---

## 🔹 Mejoras de experiencia

- 🛒 Carrito automático al ingresar por primera vez.
- 🔢 Contador en el header.
- 🔄 Feedback visual en botones.
- ⚠️ Manejo de errores robusto.

---

# 📁 Estructura del proyecto


📦 proyecto-final
├── 📂 src
│ ├── 📂 data
│ ├── 📂 manager
│ │ ├── ProductManager.mongo.js
│ │ └── CartManager.mongo.js
│ ├── 📂 models
│ │ ├── product.model.js
│ │ └── cart.model.js
│ ├── 📂 routes
│ │ ├── products.router.js
│ │ ├── carts.router.js
│ │ └── views.router.js
│ ├── 📂 views
│ │ ├── layouts/main.handlebars
│ │ ├── home.handlebars
│ │ ├── products.handlebars
│ │ ├── productDetail.handlebars
│ │ ├── cart.handlebars
│ │ ├── realTimeProducts.handlebars
│ │ └── error.handlebars
│ ├── 📂 public
│ │ └── 📂 js
│ │ ├── realTimeProducts.js
│ │ └── home.js
│ └── app.js
├── 📂 scripts
│ ├── migrateProducts.js
│ └── cleanCarts.js
├── .env
├── .gitignore
├── package.json
└── README.md


---

# ⚙️ Instalación y configuración

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
2️⃣ Instalar dependencias
npm install
3️⃣ Configurar variables de entorno

Crear un archivo .env en la raíz:

MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=8080

Reemplazar con tus credenciales reales de MongoDB Atlas.

4️⃣ Ejecutar en desarrollo
npm run dev

La aplicación estará disponible en:

http://localhost:8080
Opcional
Migrar productos desde JSON
node scripts/migrateProducts.js
Limpiar productos huérfanos de carritos
node scripts/cleanCarts.js
📡 Endpoints de la API
🛍 Productos
Método	Ruta	Descripción
GET	/api/products	Lista con paginación, filtros y ordenamiento
GET	/api/products/:pid	Obtener producto por ID
POST	/api/products	Crear producto
PUT	/api/products/:pid	Actualizar producto
DELETE	/api/products/:pid	Eliminar producto

Query params disponibles:

limit
page
sort=asc | desc
query=categoría | disponibles | no-disponibles
🛒 Carritos
Método	Ruta	Descripción
POST	/api/carts	Crear carrito
GET	/api/carts/:cid	Obtener carrito con populate
POST	/api/carts/:cid/product/:pid	Agregar producto
DELETE	/api/carts/:cid/products/:pid	Eliminar producto
PUT	/api/carts/:cid	Reemplazar carrito completo
PUT	/api/carts/:cid/products/:pid	Actualizar cantidad
DELETE	/api/carts/:cid	Vaciar carrito
🌐 Vistas disponibles
Ruta	Descripción
/	Home con productos
/products	Lista paginada
/products/:pid	Detalle
/carts/:cid	Carrito
/realtimeproducts	Gestión en tiempo real
🧪 Ejemplos de uso
Obtener productos
GET /api/products?limit=5&page=2&sort=asc&query=Electrónica

Respuesta:

{
  "status": "success",
  "payload": [],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true
}
Agregar producto al carrito
fetch('/api/carts/{cid}/product/{pid}', {
  method: 'POST'
})
🧠 Decisiones técnicas

Managers separados para lógica de negocio.

Uso de mongoose-paginate-v2.

Transformación _id → id.

Persistencia de carrito con localStorage.

Integración WebSockets.

Manejo centralizado de errores.

📦 Scripts disponibles
Script	Descripción
npm run dev	Desarrollo con nodemon
npm start	Producción
node scripts/migrateProducts.js	Migración
node scripts/cleanCarts.js	Limpieza
🔒 Seguridad

Variables sensibles en .env

Validación de datos

Verificación de ObjectId

Manejo de errores

🧪 Testing recomendado

Puedes probar la API con:

Postman

Thunder Client

Navegador (vistas)

📄 Licencia

Proyecto desarrollado con fines académicos.

¿Dudas o sugerencias?
¡Gracias por visitar el proyecto! 🚀# 🛒 E-commerce Backend - Proyecto Final

Este proyecto es una API RESTful para un sistema de e-commerce desarrollada con **Node.js**, **Express**, **MongoDB** y **Handlebars** como motor de plantillas.

Incluye funcionalidades en tiempo real con **Socket.io**, gestión completa de productos y carritos, paginación, filtros, ordenamiento y vistas dinámicas.

Proyecto desarrollado como trabajo final del curso de Backend.

---

# 🚀 Tecnologías utilizadas

- **Node.js** + **Express** — Servidor backend
- **MongoDB** + **Mongoose** — Base de datos principal
- **Handlebars** — Motor de plantillas
- **Socket.io** — Comunicación en tiempo real
- **dotenv** — Variables de entorno
- **mongoose-paginate-v2** — Paginación de productos
- **nodemon** — Desarrollo

---

# 📋 Funcionalidades principales

## 🔹 Productos

- CRUD completo de productos.
- Listado con:
  - ✅ Paginación
  - ✅ Filtros (por categoría y disponibilidad)
  - ✅ Ordenamiento (precio asc/desc)
- Endpoint `GET /api/products` con respuesta formateada.
- Vistas:
  - `/products` — Lista paginada
  - `/products/:pid` — Detalle de producto
  - `/realtimeproducts` — Gestión en tiempo real

---

## 🔹 Carritos

- Creación automática desde el frontend (usando `localStorage`).
- Agregar productos.
- Eliminar producto específico.
- Actualizar todo el carrito.
- Actualizar cantidad de un producto.
- Vaciar carrito completo.
- `populate()` de Mongoose para devolver productos completos.
- Vista `/carts/:cid` para visualizar el carrito.

---

## 🔹 WebSockets (Tiempo real)

- Conexión persistente con Socket.io.
- Actualización automática en `/realtimeproducts`.
- Feedback visual de conexión/desconexión.

---

## 🔹 Vistas dinámicas con Handlebars

- Layout principal con navegación.
- Contador de carrito dinámico.
- Helpers personalizados:
  - `multiply`
  - `cartTotal`
  - `json`
- Estilos CSS integrados.

---

## 🔹 Mejoras de experiencia

- 🛒 Carrito automático al ingresar por primera vez.
- 🔢 Contador en el header.
- 🔄 Feedback visual en botones.
- ⚠️ Manejo de errores robusto.

---

# 📁 Estructura del proyecto


📦 proyecto-final
├── 📂 src
│ ├── 📂 data
│ ├── 📂 manager
│ │ ├── ProductManager.mongo.js
│ │ └── CartManager.mongo.js
│ ├── 📂 models
│ │ ├── product.model.js
│ │ └── cart.model.js
│ ├── 📂 routes
│ │ ├── products.router.js
│ │ ├── carts.router.js
│ │ └── views.router.js
│ ├── 📂 views
│ │ ├── layouts/main.handlebars
│ │ ├── home.handlebars
│ │ ├── products.handlebars
│ │ ├── productDetail.handlebars
│ │ ├── cart.handlebars
│ │ ├── realTimeProducts.handlebars
│ │ └── error.handlebars
│ ├── 📂 public
│ │ └── 📂 js
│ │ ├── realTimeProducts.js
│ │ └── home.js
│ └── app.js
├── 📂 scripts
│ ├── migrateProducts.js
│ └── cleanCarts.js
├── .env
├── .gitignore
├── package.json
└── README.md


---

# ⚙️ Instalación y configuración

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
2️⃣ Instalar dependencias
npm install
3️⃣ Configurar variables de entorno

Crear un archivo .env en la raíz:

MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=8080

Reemplazar con tus credenciales reales de MongoDB Atlas.

4️⃣ Ejecutar en desarrollo
npm run dev

La aplicación estará disponible en:

http://localhost:8080
Opcional
Migrar productos desde JSON
node scripts/migrateProducts.js
Limpiar productos huérfanos de carritos
node scripts/cleanCarts.js
📡 Endpoints de la API
🛍 Productos
Método	Ruta	Descripción
GET	/api/products	Lista con paginación, filtros y ordenamiento
GET	/api/products/:pid	Obtener producto por ID
POST	/api/products	Crear producto
PUT	/api/products/:pid	Actualizar producto
DELETE	/api/products/:pid	Eliminar producto

Query params disponibles:

limit
page
sort=asc | desc
query=categoría | disponibles | no-disponibles
🛒 Carritos
Método	Ruta	Descripción
POST	/api/carts	Crear carrito
GET	/api/carts/:cid	Obtener carrito con populate
POST	/api/carts/:cid/product/:pid	Agregar producto
DELETE	/api/carts/:cid/products/:pid	Eliminar producto
PUT	/api/carts/:cid	Reemplazar carrito completo
PUT	/api/carts/:cid/products/:pid	Actualizar cantidad
DELETE	/api/carts/:cid	Vaciar carrito
🌐 Vistas disponibles
Ruta	Descripción
/	Home con productos
/products	Lista paginada
/products/:pid	Detalle
/carts/:cid	Carrito
/realtimeproducts	Gestión en tiempo real
🧪 Ejemplos de uso
Obtener productos
GET /api/products?limit=5&page=2&sort=asc&query=Electrónica

Respuesta:

{
  "status": "success",
  "payload": [],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true
}
Agregar producto al carrito
fetch('/api/carts/{cid}/product/{pid}', {
  method: 'POST'
})
🧠 Decisiones técnicas

Managers separados para lógica de negocio.

Uso de mongoose-paginate-v2.

Transformación _id → id.

Persistencia de carrito con localStorage.

Integración WebSockets.

Manejo centralizado de errores.

📦 Scripts disponibles
Script	Descripción
npm run dev	Desarrollo con nodemon
npm start	Producción
node scripts/migrateProducts.js	Migración
node scripts/cleanCarts.js	Limpieza
🔒 Seguridad

Variables sensibles en .env

Validación de datos

Verificación de ObjectId

Manejo de errores

🧪 Testing recomendado

Puedes probar la API con:

Postman

Thunder Client

Navegador (vistas)

📄 Licencia

Proyecto desarrollado con fines académicos.

¿Dudas o sugerencias?
¡Gracias por visitar el proyecto! 🚀
