# CV Generator Pro - Docker Scripts

## 🚀 Inicio Rápido

### Requisitos
- Docker Desktop instalado y corriendo

### Levantar todo con Docker

```powershell
# Desde la raíz del proyecto
docker-compose up -d
```

Esto levanta:
- **MongoDB** en `localhost:27017`
- **Backend API** en `localhost:5000`
- **Frontend** en `localhost:5173`

### Ver logs

```powershell
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo MongoDB
docker-compose logs -f mongodb
```

### Detener servicios

```powershell
docker-compose down
```

### Detener y eliminar datos

```powershell
docker-compose down -v
```

---

## 🔑 Credenciales de Demo

Al iniciar por primera vez, se crean estos usuarios:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `demo@metgo3d.com` | `demo123` | user |
| `admin@metgo3d.com` | `admin123` | admin |

---

## 📋 Comandos Útiles

### Reconstruir imágenes
```powershell
docker-compose up -d --build
```

### Entrar al contenedor de MongoDB
```powershell
docker exec -it cvgen-mongodb mongosh -u admin -p admin123
```

### Ver estado de contenedores
```powershell
docker-compose ps
```

---

## 🛠️ Sin Docker (solo MongoDB)

Si prefieres ejecutar el backend/frontend localmente pero usar Docker solo para MongoDB:

```powershell
# Levantar solo MongoDB
docker-compose up -d mongodb

# Luego en otra terminal
cd cv-generator-backend
npm run dev

# Y en otra terminal
cd metgo3d-cv-generator
npm run dev
```

Actualiza `.env` del backend:
```
MONGODB_URI=mongodb://admin:admin123@localhost:27017/cv-generator?authSource=admin
SKIP_MONGODB=false
```
