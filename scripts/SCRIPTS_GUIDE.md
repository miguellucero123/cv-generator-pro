# 📚 GUÍA DE SCRIPTS - CV Generator Pro

Colección de scripts PowerShell para automatizar tareas de desarrollo, construcción e implementación del proyecto CV Generator Pro.

## 📋 Requisitos Previos

- **Node.js 18+** - Descargar de [nodejs.org](https://nodejs.org/)
- **npm 9+** - Se instala con Node.js
- **Git** - Descargar de [git-scm.com](https://git-scm.com/)
- **MongoDB** - Local ([mongodb.com](https://www.mongodb.com/)) o Atlas (cloud)
- **PowerShell 5.1+** - Windows

## 📂 Estructura de Scripts

```
scripts/
├── setup.ps1         # Configuración inicial (instalar deps, crear .env)
├── dev.ps1           # Iniciar desarrollo (backend + frontend)
├── dev-full.ps1      # Iniciar desarrollo (versión anterior)
├── build.ps1         # Compilar para producción
├── clean.ps1         # Limpiar cachés y temporales
├── status.ps1        # Verificar estado del proyecto
└── README.md         # Esta guía
```

---

## 🚀 Scripts Disponibles

### 1. **setup.ps1** - Configuración Inicial

Instala dependencias, crea archivos `.env` y valida requisitos del sistema.

#### Uso:

```powershell
.\scripts\setup.ps1                 # Configuración completa
.\scripts\setup.ps1 -SkipDeps       # Sin instalar dependencias
.\scripts\setup.ps1 -Silent         # Sin confirmaciones
```

#### Qué hace:

- ✅ Verifica instalación de Node.js, npm, Git
- ✅ Valida estructura de directorios
- ✅ Instala dependencias (npm install)
- ✅ Crea archivos `.env` si no existen
- ✅ Genera `.env.example` para versionamiento

#### Después de ejecutar:

1. Edita `.env` en backend y frontend con tus valores reales:
   ```bash
   cv-generator-backend/.env
   metgo3d-cv-generator/.env
   ```

2. Variables críticas a configurar:
   - **Backend:**
     - `MONGODB_URI` - Conexión a MongoDB
     - `JWT_SECRET` - Secreto para tokens
     - `FRONTEND_URL` - URL del frontend

   - **Frontend:**
     - `VITE_API_URL` - URL de la API backend

---

### 2. **dev.ps1** - Iniciar Desarrollo

Inicia el entorno de desarrollo con backend y frontend.

#### Uso:

```powershell
.\scripts\dev.ps1                   # Backend + Frontend
.\scripts\dev.ps1 -Backend          # Solo backend
.\scripts\dev.ps1 -Frontend         # Solo frontend
.\scripts\dev.ps1 -BackendPort 3000 # Puerto personalizado
```

#### Opciones:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `-Backend` | Switch | Solo inicia backend |
| `-Frontend` | Switch | Solo inicia frontend |
| `-BackendPort` | String | Puerto backend (default: 5000) |
| `-FrontendPort` | String | Puerto frontend (default: 5173) |

#### Qué hace:

- ✅ Valida archivos `.env`
- ✅ Verifica MongoDB
- ✅ Abre ventana del backend (nodemon)
- ✅ Inicia frontend (Vite dev server)
- ✅ Muestra URLs de desarrollo

#### URLs después de ejecutar:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Backend Health:** http://localhost:5000/api/health

#### Detener:

Presiona `Ctrl+C` en la ventana del frontend (detendrá todo).

---

### 3. **build.ps1** - Compilar para Producción

Compila frontend y prepara backend para deployment.

#### Uso:

```powershell
.\scripts\build.ps1                 # Backend + Frontend
.\scripts\build.ps1 -Backend        # Solo backend
.\scripts\build.ps1 -Frontend       # Solo frontend
.\scripts\build.ps1 -Full           # Con limpieza previa
```

#### Qué hace:

- ✅ Valida archivos `.env`
- ✅ Limpia directorios anteriores
- ✅ Instala/actualiza dependencias
- ✅ Ejecuta tests (si existen)
- ✅ Compila con Vite (frontend)
- ✅ Genera carpeta `dist/` (frontend)

#### Salida:

- **Backend:** Listo para ejecutar con `npm start`
- **Frontend:** Compilado en carpeta `dist/`

#### Deployment:

```bash
# Backend
cd cv-generator-backend
npm start

# Frontend (servir dist/)
npm preview
```

---

### 4. **clean.ps1** - Limpiar Proyecto

Elimina cachés, `node_modules` y archivos temporales.

#### Uso:

```powershell
.\scripts\clean.ps1                 # Limpiar normal (cachés)
.\scripts\clean.ps1 -Deep           # Eliminar node_modules
.\scripts\clean.ps1 -Full           # Todo (node_modules + dist)
.\scripts\clean.ps1 -Confirm        # Sin pedir confirmación
```

#### Opciones:

| Parámetro | Descripción |
|-----------|-------------|
| `-Deep` | Elimina node_modules (requiere reinstalación) |
| `-Full` | Elimina todo: node_modules + dist + cachés |
| `-Confirm` | Ejecuta sin preguntar |

#### Archivos eliminados por modo:

**Normal:**
- `.npm` cache
- `.coverage` reports

**Deep:**
- `node_modules/` (ambos)
- `package-lock.json` (ambos)
- Normal files

**Full:**
- Deep files +
- `dist/` y `build/`

#### Nota:

Después de ejecutar con `-Deep` o `-Full`, ejecuta `setup.ps1` para reinstalar:

```powershell
.\scripts\setup.ps1
```

---

### 5. **status.ps1** - Verificar Estado

Revisa salud del proyecto, dependencias y servicios.

#### Uso:

```powershell
.\scripts\status.ps1
```

#### Información mostrada:

- ✅ Sistema (Node.js, npm, Git)
- ✅ Dependencias (Backend & Frontend)
- ✅ Configuración (.env variables)
- ✅ Repositorio Git (rama, cambios)
- ✅ Servicios (MongoDB)
- ✅ Puertos (disponibilidad)
- ✅ Disco (uso de espacio)

#### Ejemplo de salida:

```
💻 SISTEMA
✔ Node.js: v18.16.0
✔ npm: 9.6.7
✔ Git: OK

📦 BACKEND - DEPENDENCIAS
✔ node_modules: 245 paquetes instalados

🔧 BACKEND - CONFIGURACIÓN
✔ .env: ENCONTRADO
  ✓ MONGODB_URI configurado
  ✓ JWT_SECRET configurado
  ✓ PORT configurado

🌳 REPOSITORIO GIT
✔ Rama: main
✔ Árbol limpio: Sin cambios pendientes
```

---

## 🔄 Flujos de Trabajo Comunes

### Primera Vez (Setup Inicial)

```powershell
# 1. Configuración inicial
.\scripts\setup.ps1

# 2. Editar .env con valores reales
# vi cv-generator-backend/.env
# vi metgo3d-cv-generator/.env

# 3. Iniciar desarrollo
.\scripts\dev.ps1
```

### Desarrollo Diario

```powershell
# Iniciar desarrollo (ambos)
.\scripts\dev.ps1

# O solo uno:
.\scripts\dev.ps1 -Backend
.\scripts\dev.ps1 -Frontend
```

### Antes de Commit

```powershell
# Verificar estado
.\scripts\status.ps1

# Limpieza (cachés)
.\scripts\clean.ps1
```

### Antes de Deployment

```powershell
# Limpieza profunda
.\scripts\clean.ps1 -Full

# Reinstalar dependencias
.\scripts\setup.ps1

# Compilar para producción
.\scripts\build.ps1

# Verificar estado final
.\scripts\status.ps1
```

---

## 🛠️ Variables de Entorno Importantes

### Backend (.env)

```env
# Críticas
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cv-generator
JWT_SECRET=tu-secreto-seguro
FRONTEND_URL=http://localhost:5173

# Opcionales
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
CLOUDINARY_NAME=...
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
VITE_CLOUDINARY_CLOUD_NAME=...
```

---

## 🚨 Solución de Problemas

### MongoDB no está disponible

```powershell
# Verificar si está ejecutándose
.\scripts\status.ps1

# Iniciar MongoDB local
mongod

# O usar MongoDB Atlas (actualizar MONGODB_URI en .env)
```

### Puerto en uso

```powershell
# Cambiar puerto del backend
.\scripts\dev.ps1 -BackendPort 3000

# Cambiar puerto del frontend
.\scripts\dev.ps1 -FrontendPort 3173
```

### Dependencias corruptas

```powershell
# Limpiar e instalar nuevamente
.\scripts\clean.ps1 -Deep
.\scripts\setup.ps1
```

### Archivos .env no se crean

```powershell
# Verificar permisos
Get-Acl cv-generator-backend

# Ejecutar como administrador si es necesario
Start-Process powershell -Verb RunAs
.\scripts\setup.ps1
```

---

## 📊 Comandos npm Directos

Si prefieres ejecutar comandos npm directamente:

### Backend

```bash
# Desarrollo (con hot reload)
cd cv-generator-backend
npm run dev

# Producción
npm start

# Tests
npm test
```

### Frontend

```bash
# Desarrollo
cd metgo3d-cv-generator
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Tests
npm run test
```

---

## 🔐 Seguridad

### Archivos a NO versionear

Agregar a `.gitignore` (ya debería estar):

```
.env
.env.local
node_modules/
dist/
build/
.coverage
.npm
*.log
```

### Variables sensibles

- **Nunca** commitear `.env` con valores reales
- Usar `.env.example` como referencia
- En CI/CD, usar secrets/variables de entorno

---

## 📝 Notas Adicionales

### Scripts para Linux/Mac

Para sistemas Unix, usa los archivos `.sh`:

```bash
./scripts/dev-full.sh
```

### Ejecutar como Administrador

Si tienes problemas de permisos:

```powershell
Start-Process powershell -Verb RunAs -ArgumentList "-NoExit -File scripts\setup.ps1"
```

### Ver logs en tiempo real

```powershell
# Backend
.\scripts\dev.ps1 -Backend

# Frontend en otra ventana
.\scripts\dev.ps1 -Frontend
```

---

## 📞 Soporte

- **Documentación:** Ver [README.md](../README.md)
- **Problemas:** Crear issue en GitHub
- **Preguntas:** Revisar documentación del backend y frontend

---

**Última actualización:** 26 de febrero de 2026
