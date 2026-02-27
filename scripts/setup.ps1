# =============================================================================
# setup.ps1 - Configuración inicial del proyecto CV Generator Pro
# Uso: .\scripts\setup.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "METGO_3D CV Generator - Setup" -ForegroundColor Cyan
Write-Host ""

$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

# 1. Frontend
if (Test-Path $frontendDir) {
    Write-Host "[1/2] Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location $frontendDir
    npm install
    if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
        Copy-Item ".env.example" ".env"
        Write-Host "      .env creado desde .env.example" -ForegroundColor Gray
    }
    Set-Location $rootDir
    Write-Host "      OK" -ForegroundColor Green
} else {
    Write-Host "[1/2] Frontend no encontrado" -ForegroundColor Red
}

# 2. Backend
if (Test-Path $backendDir) {
    Write-Host "[2/2] Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location $backendDir
    npm install
    if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
        Copy-Item ".env.example" ".env"
        Write-Host "      .env creado desde .env.example" -ForegroundColor Gray
    }
    Set-Location $rootDir
    Write-Host "      OK" -ForegroundColor Green
} else {
    Write-Host "[2/2] Backend no encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Configura .env en cada proyecto con tus credenciales." -ForegroundColor Cyan
Write-Host "Backend: MONGODB_URI, JWT_SECRET, FRONTEND_URL" -ForegroundColor Gray
Write-Host "Frontend: VITE_API_URL=http://localhost:5000/api" -ForegroundColor Gray
Write-Host ""
Write-Host "Para iniciar: .\scripts\dev-full.ps1" -ForegroundColor Cyan
