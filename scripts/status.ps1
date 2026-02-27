# =============================================================================
# status.ps1 - Verifica estado del proyecto
# Revisa dependencias, configuración, servicios y salud del sistema
# Uso: .\scripts\status.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $($args[0])" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠ $($args[0])" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  ESTADO - CV GENERATOR PRO"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

# 1. SISTEMA
Write-Header "💻 SISTEMA"
Write-Host ""

$nodeVersion = & node --version 2>$null
if ($nodeVersion) {
    Write-Success "Node.js: $nodeVersion"
} else {
    Write-Error-Custom "Node.js: NO INSTALADO"
}

$npmVersion = & npm --version 2>$null
if ($npmVersion) {
    Write-Success "npm: $npmVersion"
} else {
    Write-Error-Custom "npm: NO INSTALADO"
}

$gitVersion = & git --version 2>$null
if ($gitVersion) {
    Write-Success "Git: OK"
} else {
    Write-Error-Custom "Git: NO INSTALADO"
}

Write-Host ""

# 2. DEPENDENCIAS BACKEND
Write-Header "📦 BACKEND - DEPENDENCIAS"
Write-Host ""

$backendNodeModules = Join-Path $backendDir "node_modules"
if (Test-Path $backendNodeModules) {
    $packageCount = (Get-ChildItem $backendNodeModules -Directory | Measure-Object).Count
    Write-Success "node_modules: $packageCount paquetes instalados"
} else {
    Write-Error-Custom "node_modules: NO INSTALADOS"
    Write-Warning-Custom "Ejecuta: .\scripts\setup.ps1"
}

# Verificar si package.json es consistente con package-lock.json
$packageJson = Join-Path $backendDir "package.json"
$packageLock = Join-Path $backendDir "package-lock.json"
if ((Test-Path $packageJson) -and (Test-Path $packageLock)) {
    Write-Success "package.json y package-lock.json: OK"
} elseif (Test-Path $packageJson) {
    Write-Warning-Custom "package.json existe pero no hay package-lock.json"
}

Write-Host ""

# 3. CONFIGURACIÓN BACKEND
Write-Header "🔧 BACKEND - CONFIGURACIÓN"
Write-Host ""

$backendEnv = Join-Path $backendDir ".env"
if (Test-Path $backendEnv) {
    Write-Success ".env: ENCONTRADO"
    
    # Validar variables críticas
    $envContent = Get-Content $backendEnv -Raw
    $required = @("MONGODB_URI", "JWT_SECRET", "PORT")
    
    $missing = @()
    foreach ($var in $required) {
        if ($envContent -match "^$var=") {
            Write-Info "  ✓ $var configurado"
        } else {
            Write-Warning-Custom "  ✗ $var NO configurado"
            $missing += $var
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Warning-Custom "Variables faltantes: $($missing -join ', ')"
    }
} else {
    Write-Error-Custom ".env: NO ENCONTRADO"
    Write-Warning-Custom "Ejecuta: .\scripts\setup.ps1"
}

Write-Host ""

# 4. DEPENDENCIAS FRONTEND
Write-Header "🎨 FRONTEND - DEPENDENCIAS"
Write-Host ""

$frontendNodeModules = Join-Path $frontendDir "node_modules"
if (Test-Path $frontendNodeModules) {
    $packageCount = (Get-ChildItem $frontendNodeModules -Directory | Measure-Object).Count
    Write-Success "node_modules: $packageCount paquetes instalados"
} else {
    Write-Error-Custom "node_modules: NO INSTALADOS"
    Write-Warning-Custom "Ejecuta: .\scripts\setup.ps1"
}

Write-Host ""

# 5. CONFIGURACIÓN FRONTEND
Write-Header "⚙️  FRONTEND - CONFIGURACIÓN"
Write-Host ""

$frontendEnv = Join-Path $frontendDir ".env"
if (Test-Path $frontendEnv) {
    Write-Success ".env: ENCONTRADO"
    
    # Validar variables críticas
    $envContent = Get-Content $frontendEnv -Raw
    if ($envContent -match "VITE_API_URL=") {
        Write-Info "  ✓ VITE_API_URL configurado"
    } else {
        Write-Warning-Custom "  ✗ VITE_API_URL NO configurado"
    }
} else {
    Write-Error-Custom ".env: NO ENCONTRADO"
    Write-Warning-Custom "Ejecuta: .\scripts\setup.ps1"
}

Write-Host ""

# 6. REPOSITORIO GIT
Write-Header "🌳 REPOSITORIO GIT"
Write-Host ""

try {
    $status = & git status --short 2>&1
    $branch = & git rev-parse --abbrev-ref HEAD 2>&1
    Write-Success "Rama: $branch"
    
    if ($status) {
        $lines = $status.Split([Environment]::NewLine).Count
        Write-Warning-Custom "Cambios sin confirmar: $lines archivo(s)"
    } else {
        Write-Success "Árbol limpio: Sin cambios pendientes"
    }
} catch {
    Write-Error-Custom "No es un repositorio Git válido"
}

Write-Host ""

# 7. SERVICIOS EXTERNOS
Write-Header "🔗 SERVICIOS EXTERNOS"
Write-Host ""

# MongoDB
Write-Info "Verificando MongoDB..."
try {
    $mongoTest = & mongosh --eval "db.getMongo()" 2>&1
    Write-Success "MongoDB: CONECTADO"
} catch {
    Write-Error-Custom "MongoDB: NO DISPONIBLE"
}

Write-Host ""

# 8. PUERTOS
Write-Header "🔌 PUERTOS"
Write-Host ""

$backendPort = 5000
$frontendPort = 5173

$backendPortInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
$frontendPortInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

if ($backendPortInUse) {
    Write-Warning-Custom "Puerto $backendPort: EN USO"
} else {
    Write-Success "Puerto $backendPort: DISPONIBLE"
}

if ($frontendPortInUse) {
    Write-Warning-Custom "Puerto $frontendPort: EN USO"
} else {
    Write-Success "Puerto $frontendPort: DISPONIBLE"
}

Write-Host ""

# 9. ESPACIO EN DISCO
Write-Header "💾 ESPACIO EN DISCO"
Write-Host ""

$backendSize = if (Test-Path $backendDir) { 
    (Get-ChildItem -Path $backendDir -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB 
} else { 0 }

$frontendSize = if (Test-Path $frontendDir) { 
    (Get-ChildItem -Path $frontendDir -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB 
} else { 0 }

Write-Info "Backend: ${backendSize:F1} MB"
Write-Info "Frontend: ${frontendSize:F1} MB"
Write-Info "Total: $([math]::Round($backendSize + $frontendSize, 1)) MB"

Write-Host ""

# 10. RESUMEN
Write-Header "════════════════════════════════════════════════════════"
Write-Header "✅ REPORTE COMPLETADO"
Write-Header "════════════════════════════════════════════════════════"
