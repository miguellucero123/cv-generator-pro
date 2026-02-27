# =============================================================================
# dev-full.ps1 - Ejecuta backend + frontend simultáneamente
# Uso: .\scripts\dev-full.ps1
# Requiere: MongoDB en ejecución, Node.js instalado
# =============================================================================

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "METGO_3D CV Generator - Iniciando entorno de desarrollo" -ForegroundColor Cyan
Write-Host ""

# Backend
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

if (-not (Test-Path $backendDir)) {
    Write-Host "ERROR: No existe cv-generator-backend" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendDir)) {
    Write-Host "ERROR: No existe metgo3d-cv-generator" -ForegroundColor Red
    exit 1
}

# Iniciar backend en ventana nueva
Write-Host "[1/2] Iniciando backend (puerto 5000) en ventana nueva..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run dev"

Start-Sleep -Seconds 4

# Iniciar frontend en esta ventana
Write-Host "[2/2] Iniciando frontend (puerto 5173)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Cierra la ventana del backend cuando termines." -ForegroundColor Gray
Write-Host ""

Set-Location $frontendDir
npm run dev
