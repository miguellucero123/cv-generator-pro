# =============================================================================
# setup.ps1 - Configuración inicial del proyecto CV Generator Pro
# Instala dependencias, crea .env y valida requisitos del sistema
# Uso: .\scripts\setup.ps1
# =============================================================================

param(
    [switch]$SkipDeps = $false,
    [switch]$Silent = $false
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

# Colores para output
function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $($args[0])" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠ $($args[0])" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  CV GENERATOR PRO - SETUP INICIAL"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

# 1. VERIFICAR REQUISITOS DEL SISTEMA
Write-Header "📋 REVISAR REQUISITOS DEL SISTEMA..."
Write-Host ""

$issues = @()

# Verificar Node.js
$nodeVersion = & node --version 2>$null
if ($nodeVersion) {
    Write-Success "Node.js instalado: $nodeVersion"
} else {
    $issues += "Node.js no está instalado. Descargar desde: https://nodejs.org/"
    Write-Error-Custom "Node.js no encontrado"
}

# Verificar npm
$npmVersion = & npm --version 2>$null
if ($npmVersion) {
    Write-Success "npm instalado: $npmVersion"
} else {
    $issues += "npm no está disponible"
    Write-Error-Custom "npm no encontrado"
}

# Verificar Git
$gitVersion = & git --version 2>$null
if ($gitVersion) {
    Write-Success "Git instalado: $($gitVersion.Split([Environment]::NewLine)[0])"
} else {
    $issues += "Git no está instalado. Descargar desde: https://git-scm.com/"
    Write-Error-Custom "Git no encontrado"
}

Write-Host ""

# 2. VERIFICAR DIRECTORIOS
Write-Header "📁 VALIDAR ESTRUCTURA DE DIRECTORIOS..."
Write-Host ""

if (Test-Path $backendDir) {
    Write-Success "Backend encontrado: $backendDir"
} else {
    $issues += "Directorio backend no encontrado: $backendDir"
    Write-Error-Custom "Backend no encontrado"
}

if (Test-Path $frontendDir) {
    Write-Success "Frontend encontrado: $frontendDir"
} else {
    $issues += "Directorio frontend no encontrado: $frontendDir"
    Write-Error-Custom "Frontend no encontrado"
}

Write-Host ""

# 3. REPORTAR PROBLEMAS
if ($issues.Count -gt 0) {
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Error-Custom "PROBLEMAS DETECTADOS ($($issues.Count)):"
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    $issues | ForEach-Object { Write-Host "  • $_" }
    Write-Host ""
    throw "Por favor, resuelve los problemas anteriores antes de continuar."
}

Write-Success "✅ Todos los requisitos están cumplidos!"
Write-Host ""

# 4. INSTALAR DEPENDENCIAS
Write-Header "📦 INSTALAR DEPENDENCIAS..."
Write-Host ""

if ($SkipDeps) {
    Write-Warning-Custom "Saltando instalación de dependencias (como se indicó)"
} else {
    # Backend
    Write-Info "Instalando dependencias del backend..."
    Push-Location $backendDir
    try {
        npm install --legacy-peer-deps
        Write-Success "Backend: dependencias instaladas"
    } catch {
        Write-Error-Custom "Error en backend: $_"
        Pop-Location
        throw
    }
    Pop-Location
    
    Write-Host ""
    
    # Frontend
    Write-Info "Instalando dependencias del frontend..."
    Push-Location $frontendDir
    try {
        npm install
        Write-Success "Frontend: dependencias instaladas"
    } catch {
        Write-Error-Custom "Error en frontend: $_"
        Pop-Location
        throw
    }
    Pop-Location
}

Write-Host ""

# 5. CREAR ARCHIVOS .env
Write-Header "🔑 CREAR ARCHIVOS DE CONFIGURACIÓN (.env)..."
Write-Host ""

# Backend .env
$backendEnv = Join-Path $backendDir ".env"
if (-not (Test-Path $backendEnv)) {
    Write-Info "Creando .env para backend..."
    @"
# ==================== BACKEND CONFIGURATION ====================
# Ambiente
NODE_ENV=development

# Puerto del servidor
PORT=5000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/cv-generator
# Para MongoDB Atlas, usa:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cv-generator?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRE=7d

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# ==================== OPTIONAL: OAUTH ====================
# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=tu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tu-linkedin-client-secret

# ==================== OPTIONAL: FILE UPLOAD ====================
# Cloudinary
CLOUDINARY_NAME=tu-cloudinary-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# ==================== OPTIONAL: EMAIL ====================
# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
SMTP_FROM=noreply@cv-generator.com

# ==================== OPTIONAL: ANALYTICS ====================
ANALYTICS_ENABLED=false

# ==================== DEBUG ====================
DEBUG=false
"@ | Set-Content $backendEnv -Encoding UTF8
    Write-Success "Archivo .env de backend creado: .env"
    Write-Warning-Custom "⚠️  IMPORTANTE: Edita este archivo con tus valores reales"
} else {
    Write-Warning-Custom "Backend .env ya existe, saltando..."
}

Write-Host ""

# Frontend .env
$frontendEnv = Join-Path $frontendDir ".env"
if (-not (Test-Path $frontendEnv)) {
    Write-Info "Creando .env para frontend..."
    @"
# ==================== FRONTEND CONFIGURATION ====================
# API Backend
VITE_API_URL=http://localhost:5000/api

# Ambiente
VITE_ENV=development

# Analytics
VITE_GOOGLE_ANALYTICS_ID=

# Cloudinary (opcional)
VITE_CLOUDINARY_CLOUD_NAME=
"@ | Set-Content $frontendEnv -Encoding UTF8
    Write-Success "Archivo .env de frontend creado: .env"
} else {
    Write-Warning-Custom "Frontend .env ya existe, saltando..."
}

Write-Host ""

# 6. CREAR ARCHIVOS .env.example
Write-Header "📝 CREAR ARCHIVOS .env.example..."
Write-Host ""

$backendEnvExample = Join-Path $backendDir ".env.example"
if (-not (Test-Path $backendEnvExample)) {
    Copy-Item $backendEnv $backendEnvExample
    Write-Success "Backend .env.example creado"
} else {
    Write-Warning-Custom "Backend .env.example ya existe"
}

$frontendEnvExample = Join-Path $frontendDir ".env.example"
if (-not (Test-Path $frontendEnvExample)) {
    Copy-Item $frontendEnv $frontendEnvExample
    Write-Success "Frontend .env.example creado"
} else {
    Write-Warning-Custom "Frontend .env.example ya existe"
}

Write-Host ""

# 7. RESUMEN FINAL
Write-Header "════════════════════════════════════════════════════════"
Write-Success "✅ SETUP COMPLETADO EXITOSAMENTE"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Edita los archivos .env con tus valores reales:"
Write-Host "   ├─ Backend: $backendEnv"
Write-Host "   └─ Frontend: $frontendEnv"
Write-Host ""
Write-Host "2️⃣  Asegúrate de que MongoDB esté ejecutándose:"
Write-Host "   • Local: mongod"
Write-Host "   • Atlas: Verificar conexión en .env"
Write-Host ""
Write-Host "3️⃣  Inicia el desarrollo:"
Write-Host "   • Ambos: .\scripts\dev.ps1"
Write-Host "   • Solo backend: cd cv-generator-backend && npm run dev"
Write-Host "   • Solo frontend: cd metgo3d-cv-generator && npm run dev"
Write-Host ""
Write-Host "📚 URLs:"
Write-Host "   • Frontend: http://localhost:5173"
Write-Host "   • Backend:  http://localhost:5000"
Write-Host "   • API Docs: http://localhost:5000/api"
Write-Host ""
