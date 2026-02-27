# CV Generator Backend API

Backend para el proyecto CV Generator Pro (METGO_3D VIRTUALIZE).

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación

```bash
npm install
```

## Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables:
   - `MONGODB_URI` – Conexión a MongoDB
   - `JWT_SECRET` – Secreto para tokens JWT
   - `FRONTEND_URL` – URL del frontend Vue (ej: http://localhost:5173)
   - Opcional: Google OAuth, LinkedIn OAuth, Cloudinary, SMTP

## Ejecutar

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

Servidor: http://localhost:5000

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/me | Usuario actual (token) |
| GET | /api/cvs | Listar CVs (token) |
| POST | /api/cvs | Crear CV (token) |
| GET | /api/cvs/:id | Obtener CV (token) |
| PUT | /api/cvs/:id | Actualizar CV (token) |
| DELETE | /api/cvs/:id | Eliminar CV (token) |
| POST | /api/cvs/import | Importar CV JSON (token) |
| GET | /api/cvs/:id/export | Exportar CV JSON (token) |
| GET | /api/share/:publicUrl | Ver CV público |
| GET | /health | Health check |

## Integración con frontend Vue

El frontend en `metgo3d-cv-generator` puede:

- **Importar CV**: Enviar el JSON exportado al endpoint `POST /api/cvs/import` con `Authorization: Bearer <token>`
- **Exportar CV**: Obtener JSON desde `GET /api/cvs/:id/export`
- El formato del frontend (personal, perfil, competencias, etc.) se mapea automáticamente al formato del backend en importación
