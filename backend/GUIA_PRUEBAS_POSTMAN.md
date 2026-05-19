# Documentación de Pruebas API (Postman)

Este documento detalla los endpoints disponibles y cómo probarlos mediante Postman. 

> **Nota sobre CSRF**: Al utilizar `routes/web.php` para las rutas de la API, Laravel exige un token CSRF. Para pruebas locales mediante Postman, añade temporalmente la siguiente exclusión en `bootstrap/app.php`:
> ```php
> $middleware->validateCsrfTokens(except: ['*']);
> ```

---

## 1. Autenticación

Las rutas web de Laravel utilizan cookies para gestionar la sesión. Al hacer login a través de Postman, la cookie `laravel_session` se almacenará automáticamente y se adjuntará en peticiones posteriores.

### 1.1. Registrar Usuario Normal
Registra una cuenta estándar con rol `USUARIO` y un saldo inicial por defecto (ej. 100).
- **Método**: `POST`
- **URL**: `http://localhost:8000/register`
- **Body (JSON)**:
```json
{
    "name": "Usuario Test",
    "email": "usuario@test.com",
    "password": "password",
    "password_confirmation": "password"
}
```

### 1.2. Iniciar Sesión (Login)
Autentica al usuario y guarda la cookie de sesión.
- **Método**: `POST`
- **URL**: `http://localhost:8000/login`
- **Body (JSON)**:
```json
{
    "email": "usuario@test.com",
    "password": "password"
}
```

---

## 2. Rutas de Administrador

Para probar estos endpoints, debes haber iniciado sesión previamente (Login) con un usuario que tenga el valor `ADMIN` en la columna `role` de la base de datos (por ejemplo, `admin@test.com`).

### 2.1. Crear Anuncio
Crea un anuncio y genera automáticamente las entradas configuradas en la propiedad `cantidad`.
- **Método**: `POST`
- **URL**: `http://localhost:8000/anuncios`
- **Body (JSON)**:
```json
{
    "titulo": "Festival de Música",
    "descripcion": "Descripción del festival.",
    "fecha": "2027-10-15",
    "entradasDisponibles": true,
    "cantidad": 50,
    "precio": 20.00
}
```

### 2.2. Ver Mis Anuncios
Devuelve los anuncios creados exclusivamente por el administrador autenticado, junto con un conteo de las entradas totales y las vendidas.
- **Método**: `GET`
- **URL**: `http://localhost:8000/admin/anuncios`

---

## 3. Rutas de Usuario Registrado

Para probar estos endpoints, debes haber iniciado sesión previamente (Login) con una cuenta estándar.

### 3.1. Gestionar Billetera
Permite añadir o retirar saldo de la cuenta del usuario autenticado.
- **Método**: `POST`
- **URL**: `http://localhost:8000/billetera`
- **Body (JSON)**:
```json
{
    "operacion": "agregar",
    "monto": 50.00
}
```
*(Valores permitidos en operación: `agregar`, `quitar`)*

### 3.2. Comprar Entrada
Compra una entrada para el anuncio especificado en la URL. Resta el dinero de la billetera y asigna la entrada al usuario.
- **Método**: `POST`
- **URL**: `http://localhost:8000/anuncios/1/comprar` *(Reemplazar "1" por el ID del anuncio)*

### 3.3. Ver Mis Entradas
Devuelve el listado de entradas que pertenecen al usuario autenticado.
- **Método**: `GET`
- **URL**: `http://localhost:8000/mis-entradas`

### 3.4. Detalle de Entrada
Muestra los detalles de una entrada específica, solo si pertenece al usuario autenticado.
- **Método**: `GET`
- **URL**: `http://localhost:8000/mis-entradas/1` *(Reemplazar "1" por el ID de la entrada)*

---

## 4. Rutas Públicas

Estas rutas están disponibles sin necesidad de autenticación.

### 4.1. Listar Anuncios
Devuelve todos los anuncios publicados en el sistema.
- **Método**: `GET`
- **URL**: `http://localhost:8000/anuncios`

### 4.2. Detalle de Anuncio
Devuelve la información de un anuncio en concreto.
- **Método**: `GET`
- **URL**: `http://localhost:8000/anuncios/1` *(Reemplazar "1" por el ID del anuncio)*
