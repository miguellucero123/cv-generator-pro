# 🚀 START HERE - CV Generator Pro

**¿Dónde empezar?** Esta es tu guía de orientación.

---

## 📖 ¿QUÉ ES ESTO?

Este es el **cv-generator-pro**, un proyecto fullstack profesional para generar CVs:

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** Vue 3 + Vite
- **Funcionalidad:** Editor de CV, PDF export, compartir, QR codes
- **Usuarios:** Tu equipo de desarrollo (actualmente)

---

## 🎯 MISIÓN DE ESTE DOCUMENTO

Orientarte rápidamente sobre:
1. Qué tienes
2. Cómo empezar
3. Dónde encontrar información

---

## 📁 ESTRUCTURA DEL PROYECTO

```
cv-generator-pro/
├── cv-generator-backend/        👈 Node.js backend (CRUD, Auth)
├── metgo3d-cv-generator/        👈 Vue 3 frontend (UI, editor)
├── scripts/                     👈 Automatización (setup, dev, build)
│   └── SCRIPTS_GUIDE.md         👈 Lee esto para scripts
├── PROJECT_REVIEW.md            👈 Análisis completo
├── EXECUTIVE_SUMMARY.md         👈 Resumen visual
├── IMPROVEMENTS.md              👈 Recomendaciones
├── START_HERE.md                👈 TÚ ESTÁS AQUÍ
└── .git/                        👈 Repositorio Git
```

---

## ⚡ INICIO RÁPIDO (5 MINUTOS)

### 1. Una sola línea - Todo automático

```powershell
.\scripts\quickstart.ps1
```

Esto hace:
- ✅ Verifica requisitos (Node, npm, Git, MongoDB)
- ✅ Instala dependencias
- ✅ Crea archivos .env
- ✅ Abre navegador automáticamente
- ✅ Inicia backend + frontend

### 2. Luego de ejecutar quickstart

Tu navegador abrirá **http://localhost:5173** (frontend)

El backend estará en **http://localhost:5000**

---

## 📚 DOCUMENTACIÓN RÁPIDA

### ¿Quiero saber...?

| Pregunta | Lee Esto |
|----------|----------|
| Cómo usar los scripts | [SCRIPTS_GUIDE.md](scripts/SCRIPTS_GUIDE.md) |
| Análisis completo del proyecto | [PROJECT_REVIEW.md](PROJECT_REVIEW.md) |
| Resumen visual y métricas | [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) |
| Qué mejorar primero | [IMPROVEMENTS.md](IMPROVEMENTS.md) |
| Cómo contribuir | (Por crear) |

---

## 🛠️ COMANDOS QUE NECESITAS

### Desarrollo

```powershell
# Una sola línea - todo automático (RECOMENDADO)
.\scripts\quickstart.ps1

# O paso a paso
.\scripts\setup.ps1        # Primera vez: setup completo
.\scripts\dev.ps1          # Iniciar desarrollo
```

### Otros comandos útiles

```powershell
.\scripts\status.ps1       # Ver estado del proyecto
.\scripts\clean.ps1        # Limpiar cachés
.\scripts\build.ps1        # Compilar para producción
```

---

## ⚙️ REQUISITOS DEL SISTEMA

Antes de correr cualquier script, asegúrate de tener:

- [Node.js 18+](https://nodejs.org/) ✅ (Descargar e instalar)
- [npm](https://www.npmjs.com/) ✅ (Se instala con Node)
- [Git](https://git-scm.com/) ✅ (Control de versiones)
- [MongoDB](https://www.mongodb.com/) ✅ (Base de datos)

**Verificar que está instalado:**

```powershell
node --version      # Debe mostrar v18.x o superior
npm --version       # Debe mostrar 9.x o superior
git --version       # Debe mostrar 2.x o superior
mongod --version    # Debe mostrar versión de MongoDB
```

---

## 🔧 CONFIGURACIÓN INICIAL

Después de ejecutar `quickstart.ps1` o `setup.ps1`, edita estos archivos:

### 1. Backend - cv-generator-backend/.env

```env
# Variables críticas
MONGODB_URI=mongodb://localhost:27017/cv-generator
JWT_SECRET=tu-secreto-muy-seguro-cambiar-antes-de-produccion
FRONTEND_URL=http://localhost:5173

# Opcionales (OAuth)
GOOGLE_CLIENT_ID=tu-google-id
GOOGLE_CLIENT_SECRET=tu-google-secret
```

### 2. Frontend - metgo3d-cv-generator/.env

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎮 PRIMEROS PASOS DESPUÉS DE SETUP

### 1. Verifica que funciona

```powershell
.\scripts\dev.ps1
```

Deberías ver:
- Backend en http://localhost:5000
- Frontend en http://localhost:5173

### 2. Abre el navegador

Visita **http://localhost:5173**

Deberías ver la interfaz del generador de CV.

### 3. Prueba la app

- Intenta registrarte
- Crea un CV
- Descargalo como PDF

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ Funciona Bien

- Backend API
- Frontend UI
- PDF generation
- Autenticación
- OAuth (Google, LinkedIn)
- QR codes
- Compartir CVs

### ⚠️ Necesita Atención

- ❌ Tests (0% cobertura)
- ❌ API documentation
- ❌ CI/CD automation
- ❌ Error tracking
- ❌ TypeScript

### 📈 Próximas Prioridades

1. **Crear tests** (target: 20% cobertura)
2. **Documentar API** (Swagger)
3. **CI/CD setup** (GitHub Actions)
4. **Security hardening**

Ver [IMPROVEMENTS.md](IMPROVEMENTS.md) para plan completo.

---

## 🚀 ALTERNATIVAS A QUICKSTART

Si quieres más control:

### Opción 1: Setup + Dev separado

```powershell
# Paso 1: Setup (primera vez)
.\scripts\setup.ps1

# Paso 2: Editar .env files
# (editar cv-generator-backend/.env y metgo3d-cv-generator/.env)

# Paso 3: Iniciar desarrollo
.\scripts\dev.ps1
```

### Opción 2: Solo backend o frontend

```powershell
# Solo backend
.\scripts\dev.ps1 -Backend

# Solo frontend (en otra terminal)
.\scripts\dev.ps1 -Frontend
```

### Opción 3: Manual completo

```powershell
# Backend
cd cv-generator-backend
npm install
npm run dev

# Frontend (en otra terminal)
cd metgo3d-cv-generator
npm install
npm run dev
```

---

## 🛑 PROBLEMAS COMUNES

### "MongoDB no está disponible"

```powershell
# Instala MongoDB Community
https://www.mongodb.com/try/download/community

# O usa MongoDB Atlas (cloud)
# https://www.mongodb.com/cloud/atlas
```

### "Puerto 5000 ya está en uso"

```powershell
# Cambia el puerto
.\scripts\dev.ps1 -BackendPort 3000
```

### "npm install falla"

```powershell
# Limpia cachés
.\scripts\clean.ps1 -Deep

# Reinstala
.\scripts\setup.ps1
```

### "Los scripts no se ejecutan"

```powershell
# Ejecuta como administrador
Start-Process powershell -Verb RunAs
.\scripts\quickstart.ps1
```

---

## 📱 ESTRUCTURA BÁSICA

### Backend

Carpeta: `cv-generator-backend/`

```
app.js              <- Config principal de Express
servers.js          <- Punto de entrada
src/
  ├── config/       <- BD, OAuth, Passport
  ├── models/       <- User, CV, Analytics
  ├── routes/       <- API routes
  ├── controllers/  <- Lógica de negocio
  ├── middleware/   <- Auth, rate limit
  └── services/     <- Servicios externos
```

### Frontend

Carpeta: `metgo3d-cv-generator/`

```
src/
  ├── App.vue       <- Componente raíz
  ├── main.js       <- Punto de entrada
  ├── components/   <- Componentes reutilizables
  ├── composables/  <- Funciones compartidas
  ├── views/        <- Vistas (Home, Login, Dashboard)
  ├── layouts/      <- Layouts
  ├── router/       <- Rutas (vue-router)
  ├── assets/       <- CSS, imágenes
  └── i18n/         <- Idiomas
```

---

## 🎓 FLUJO DE DESARROLLO TÍPICO

### Día 1: Setup

```powershell
.\scripts\quickstart.ps1
```

### Días 2+: Desarrollo

```powershell
# Terminal 1: Backend
cd cv-generator-backend
npm run dev

# Terminal 2: Frontend
cd metgo3d-cv-generator
npm run dev

# Terminal 3: Controlar cambios
git status
git diff
```

### Antes de commit

```powershell
# Verificar estado
.\scripts\status.ps1

# Limpiar
.\scripts\clean.ps1
```

### Antes de deployment

```powershell
# Build producción
.\scripts\build.ps1

# Verificar resultado
.\scripts\status.ps1
```

---

## 🔗 ENLACES ÚTILES

**Repositorio:**
- GitHub: https://github.com/miguellucero123/cv-generator-pro

**Documentos del Proyecto:**
- [PROJECT_REVIEW.md](PROJECT_REVIEW.md) - Análisis completo
- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) - Resumen visual
- [IMPROVEMENTS.md](IMPROVEMENTS.md) - Plan de mejoras
- [SCRIPTS_GUIDE.md](scripts/SCRIPTS_GUIDE.md) - Guía de scripts

**Tecnologías Clave:**
- [Vue 3 Docs](https://vuejs.org/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Vite Docs](https://vitejs.dev/)

---

## ❓ PREGUNTAS FRECUENTES

### ¿Qué versión de Node necesito?

18+ recomendado. Si tienes 16, podría funcionar pero no está garantizado.

### ¿Puedo usar Windows/Mac/Linux?

Sí a todo. Los scripts .ps1 son Windows, los .sh son Linux/Mac.

### ¿Necesito MongoDB local?

No necesariamente. Puedes usar MongoDB Atlas (cloud). Solo cambia MONGODB_URI en .env

### ¿Cómo contribuyo cambios?

1. Haz tus cambios
2. `git add .`
3. `git commit -m "descripción"`
4. `git push`

### ¿Dónde reporto problemas?

GitHub Issues: https://github.com/miguellucero123/cv-generator-pro/issues

---

## 🎯 SIGUIENTE PASO

### Opción A: Empezar YA

```powershell
.\scripts\quickstart.ps1
```

Esto hace todo automáticamente. ⚡

### Opción B: Leer primero

Lee [PROJECT_REVIEW.md](PROJECT_REVIEW.md) para entender la arquitectura completa.

### Opción C: Plan detallado

Lee [IMPROVEMENTS.md](IMPROVEMENTS.md) para ver qué mejorar.

---

## 📝 NOTA IMPORTANTE

Este proyecto está **en buen estado** pero necesita:

1. **Tests** - 0% cobertura actualmente
2. **Documentación** - API docs faltantes
3. **CI/CD** - Automatización pendiente

Antes de ir a producción con usuarios reales, implementa la **Fase 1** del plan en [IMPROVEMENTS.md](IMPROVEMENTS.md).

---

## ✨ BIENVENIDO

¡Estás listo para contribuir al proyecto!

Tanto si es tu primera vez como si has trabajado aquí antes, estos documentos te ayudarán:

1. **Rápido:** `.\scripts\quickstart.ps1`
2. **Entender:** [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)
3. **Profundo:** [PROJECT_REVIEW.md](PROJECT_REVIEW.md)
4. **Mejorar:** [IMPROVEMENTS.md](IMPROVEMENTS.md)

¡Diviértete programando! 🚀

---

**Última actualización:** 26 de febrero de 2026  
**Mantén este documento actualizado conforme el proyecto evoluciona.**
