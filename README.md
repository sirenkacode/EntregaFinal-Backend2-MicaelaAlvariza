# 🛒 Ecommerce Backend -- Entrega Final

Backend desarrollado en Node.js y Express como proyecto final del
curso.\
El objetivo fue profesionalizar la arquitectura del servidor
implementando patrones de diseño, manejo de roles, seguridad y mejoras
en la lógica de negocio.

------------------------------------------------------------------------

## 🚀 Tecnologías Utilizadas

-   Node.js
-   Express
-   MongoDB + Mongoose
-   Passport (JWT Strategy)
-   Bcrypt
-   Nodemailer
-   UUID
-   Dotenv
-   Nodemon

------------------------------------------------------------------------

## 🏗 Arquitectura del Proyecto

Estructura basada en separación por capas:

    src/
     ├── dao/                → Acceso directo a base de datos
     ├── repositories/       → Patrón Repository
     ├── services/           → Lógica de negocio
     ├── dto/                → Data Transfer Objects
     ├── middlewares/        → Autorización y autenticación
     ├── routes/             → Endpoints
     ├── utils/              → Mailing y utilidades
     └── app.js              → Inicialización del servidor

### 🔹 Patrón Repository

Permite desacoplar la lógica de acceso a datos (DAO) de la lógica de
negocio (Services), facilitando escalabilidad y mantenimiento.

### 🔹 DTO

Se utiliza `UserDTO` en `/api/sessions/current` para evitar exponer
información sensible como la contraseña.

------------------------------------------------------------------------

## 🔐 Sistema de Autenticación

-   Registro y Login con JWT
-   Estrategia `current` para validar usuario autenticado
-   Middleware de autorización por roles
-   Protección de endpoints sensibles

------------------------------------------------------------------------

## 👥 Roles y Autorización

### 🔑 Admin

-   Crear productos
-   Actualizar productos
-   Eliminar productos

### 👤 User

-   Agregar productos al carrito
-   Modificar carrito
-   Finalizar compra

------------------------------------------------------------------------

## 🔁 Recuperación de Contraseña

-   Envío de correo con enlace de recuperación
-   Token con expiración de 1 hora
-   Validación segura del token
-   No permite reutilizar la misma contraseña anterior
-   No revela si el email existe

------------------------------------------------------------------------

## 🧾 Sistema de Compra y Ticket

-   Verifica stock de cada producto
-   Permite compras parciales
-   Genera ticket con:
    -   Código único
    -   Fecha de compra
    -   Monto total
    -   Email del comprador
-   Devuelve productos no comprados si falta stock

------------------------------------------------------------------------

## ⚙ Variables de Entorno

Crear un archivo `.env` basado en `.env.example`

Ejemplo:

    MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
    PORT=8080
    JWT_SECRET=superSecretJWT
    RESET_PASSWORD_SECRET=resetSecret
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=tu_email@gmail.com
    SMTP_PASS=tu_app_password
    SMTP_FROM=Ecommerce <tu_email@gmail.com>

------------------------------------------------------------------------

## ▶ Cómo Ejecutar el Proyecto

1.  Clonar el repositorio\
2.  Instalar dependencias

```{=html}
<!-- -->
```
    npm install

3.  Crear archivo `.env`\
4.  Ejecutar en modo desarrollo

```{=html}
<!-- -->
```
    npm run dev

Servidor disponible en:

    http://localhost:8080

------------------------------------------------------------------------

## 🧪 Endpoints Principales

### 🔐 Sesiones

-   POST /api/sessions/register
-   POST /api/sessions/login
-   GET /api/sessions/current
-   POST /api/sessions/forgot-password
-   POST /api/sessions/reset-password

### 📦 Productos

-   GET /api/products
-   POST /api/products (admin)
-   PUT /api/products/:pid (admin)
-   DELETE /api/products/:pid (admin)

### 🛒 Carrito

-   POST /api/carts/:cid/product/:pid
-   POST /api/carts/:cid/purchase

------------------------------------------------------------------------

## 📌 Objetivos Cumplidos

✔ Implementación de DAO y DTO\
✔ Patrón Repository correctamente aplicado\
✔ Middleware de autorización por roles\
✔ Sistema de recuperación de contraseña seguro\
✔ Arquitectura profesional y modular\
✔ Lógica de compra robusta con generación de Ticket

