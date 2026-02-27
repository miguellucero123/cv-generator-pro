# 📚 Documentación de API - CV Generator Pro

## Acceso a la documentación Swagger

Una vez que el servidor backend está corriendo, puedes acceder a la documentación interactiva de la API en:

```
http://localhost:5000/api-docs
```

## ¿Qué es Swagger/OpenAPI?

Swagger es una herramienta que genera documentación interactiva de APIs REST. Te permite:
- Ver todos los endpoints disponibles
- Entender qué parámetros requiere cada endpoint
- Ver ejemplos de respuestas
- Probar los endpoints directamente desde el navegador

## Estructura de la Documentación

La documentación está organizada en 4 categorías principales:

### 1. **Auth** 🔐
Endpoints para autenticación y gestión de usuarios:
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener perfil actual
- `PUT /auth/profile` - Actualizar perfil
- `PUT /auth/password` - Cambiar contraseña
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/forgot-password` - Recuperar contraseña
- `POST /auth/reset-password/:token` - Restablecer contraseña

### 2. **CV** 📄
Operaciones CRUD para CVs:
- `POST /cvs` - Crear nuevo CV
- `GET /cvs` - Obtener todos los CVs del usuario
- `GET /cvs/:id` - Obtener detalle de un CV
- `PUT /cvs/:id` - Actualizar CV
- `DELETE /cvs/:id` - Eliminar CV
- `POST /cvs/:id/duplicate` - Duplicar CV
- `GET /cvs/:id/export` - Exportar CV a PDF

### 3. **Share** 🔗
Crear y gestionar enlaces públicos compartibles:
- `POST /share/:cvId` - Crear enlace compartible
- `GET /share/:cvId` - Obtener info del enlace
- `GET /share/:shareId/cv` - Ver CV compartido
- `POST /share/:shareId/revoke` - Revocar enlace

### 4. **Analytics** 📊
Estadísticas y analíticas:
- `GET /analytics` - Estadísticas generales del usuario
- `GET /analytics/:cvId` - Estadísticas de un CV específico
- `POST /analytics/:cvId/views` - Registrar una visualización

## Autenticación

Todos los endpoints excepto Auth/login, Auth/register, Auth/forgot-password y Share/view requieren autenticación JWT.

### Cómo autenticarte en Swagger:

1. **Registra una cuenta**:
   - Click en `Auth` → `POST /auth/register`
   - Click en "Try it out"
   - Ingresa name, email, password
   - Click en "Execute"

2. **Inicia sesión**:
   - Click en `Auth` → `POST /auth/login`
   - Click en "Try it out"
   - Ingresa email y password
   - Click en "Execute"
   - **Copia el token** de la respuesta

3. **Usa el token**:
   - Click en el botón "Authorize" (ícono de candado) en la parte superior
   - Pega el token en el campo: `Bearer <tu_token>`
   - Click en "Authorize"
   - Ahora puedes usar todos los endpoints protegidos

## Ejemplos de Respuestas

### Login Exitoso
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error de Validación
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## Variables de Entorno Requeridas

Para que todos los endpoints funcionen correctamente, asegúrate de configurar en `.env`:

```env
# Obligatorias
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cv-generator
JWT_SECRET=tu-secreto-muy-largo-de-32-caracteres-minimo-recomendado-aleatorio

# OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
LINKEDIN_CLIENT_ID=tu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tu-linkedin-client-secret

# Cloudinary (para subida de imágenes)
CLOUDINARY_NAME=tu-cloudinary-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Email (para recuperación de contraseña)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-app
```

## Testing de Endpoints

### Herramientas Recomendadas:
1. **Swagger UI** (en el frontend) - Lo más fácil
2. **Postman** - Cliente HTTP avanzado
3. **cURL** - Terminal

### Ejemplo con cURL:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'

# Crear CV (con token)
curl -X POST http://localhost:5000/api/cvs \
  -H "Authorization: Bearer tu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi CV","personalInfo":{"name":"Juan Pérez"}}'
```

## Códigos de Error Comunes

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | CREATED - Recurso creado |
| 400 | BAD REQUEST - Datos inválidos |
| 401 | UNAUTHORIZED - Token faltante o inválido |
| 404 | NOT FOUND - Recurso no encontrado |
| 500 | SERVER ERROR - Error interno |

## Actualizar la Documentación

Para agregar nuevos endpoints:

1. Crea un archivo en `src/docs/` con las anotaciones Swagger
2. Importa el archivo en `src/config/swagger.js`
3. Reinicia el servidor
4. La documentación se actualizará automáticamente en `/api-docs`

## Más Información

- Documentación oficial de OpenAPI: https://spec.openapis.org/
- Swagger UI: https://swagger.io/tools/swagger-ui/
- JWT: https://jwt.io/
