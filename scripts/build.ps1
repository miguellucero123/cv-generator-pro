# =============================================================================
# build.ps1 - Construir proyecto para producción
# Compila frontend y prepara backend para deployment
# Uso: .\scripts\build.ps1
# =============================================================================

param(
    [switch]$Backend = $false,
    [switch]$Frontend = $false,
    [switch]$Both = $true,
    [switch]$Silent = $false
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $($args[0])" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  BUILD PARA PRODUCCIÓN - CV GENERATOR PRO"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

# Si se especifica Backend o Frontend, anular Both
if ($Backend -or $Frontend) {
    $Both = $false
}

$buildBackend = $Backend -or $Both
$buildFrontend = $Frontend -or $Both

$startTime = Get-Date
$failedBuilds = @()

# BUILD BACKEND
if ($buildBackend) {
    Write-Header "📦 COMPILANDO BACKEND..."
    Write-Host ""
    
    Push-Location $backendDir
    try {
        Write-Info "Validando configuración..."
        if (-not (Test-Path ".env")) {
            Write-Error-Custom "ERROR: No existe archivo .env"
            Write-Host "Ejecuta primero: .\scripts\setup.ps1"
            $failedBuilds += "Backend (.env faltante)"
            Pop-Location
        }
        else {
            Write-Success "Archivo .env encontrado"
            
            Write-Info "Limpiando directorio dist (si existe)..."
            if (Test-Path "dist") {
                Remove-Item -Path "dist" -Recurse -Force
            }
            
            Write-Info "Instalando dependencias..."
            npm install --legacy-peer-deps 2>&1 | Out-Null
            
            Write-Info "Validando sintaxis..."
            npm test 2>&1 | Out-Null
            
            Write-Success "Backend compilado exitosamente"
            Write-Info "Ubicación: $backendDir"
            Write-Info "Inicia con: npm start"
        }
    }
    catch {
        Write-Error-Custom "Error en build del backend: $_"
        $failedBuilds += "Backend"
    }
    finally {
        Pop-Location
    }
    
    Write-Host ""
}

# BUILD FRONTEND
if ($buildFrontend) {
    Write-Header "🎨 COMPILANDO FRONTEND..."
    Write-Host ""
    
    Push-Location $frontendDir
    try {
        Write-Info "Validando configuración..."
        if (-not (Test-Path ".env")) {
            Write-Error-Custom "ERROR: No existe archivo .env"
            Write-Host "Ejecuta primero: .\scripts\setup.ps1"
            $failedBuilds += "Frontend (.env faltante)"
            Pop-Location
        }
        else {
            Write-Success "Archivo .env encontrado"
            
            Write-Info "Instalando dependencias..."
            npm install 2>&1 | Out-Null
            
            Write-Info "Ejecutando linter..."
            npm run lint 2>&1 | Out-Null
            
            Write-Info "Compilando con Vite..."
            npm run build 2>&1 | Out-Null
            
            if (Test-Path "dist") {
                $distSize = (Get-ChildItem -Path "dist" -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
                Write-Success "Frontend compilado exitosamente (${distSize:F1}M)"
                Write-Info "Ubicación: $frontendDir\dist"
            }
            else {
                throw "No se encontró directorio dist después del build"
            }
        }
    }
    catch {
        Write-Error-Custom "Error en build del frontend: $_"
        $failedBuilds += "Frontend"
    }
    finally {
        Pop-Location
    }
    
    Write-Host ""
}

# RESUMEN FINAL
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Header "════════════════════════════════════════════════════════"

if ($failedBuilds.Count -eq 0) {
    Write-Success "✅ BUILD COMPLETADO EXITOSAMENTE"
    Write-Header "════════════════════════════════════════════════════════"
    Write-Host ""
    Write-Host "⏱️  Tiempo total: $([math]::Round($duration.TotalSeconds, 2))s" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host ""
    if ($buildBackend) {
        Write-Host "Backend:"
        Write-Host "  npm start  # Desde: $backendDir"
        Write-Host ""
    }
    if ($buildFrontend) {
        Write-Host "Frontend:"
        Write-Host "  npm preview  # Desde: $frontendDir"
        Write-Host ""
    }
}
else {
    Write-Error-Custom "BUILD CON ERRORES - Falló en:"
    Write-Header "════════════════════════════════════════════════════════"
    $failedBuilds | ForEach-Object { Write-Host "  ✗ $_" }
    exit 1
}
