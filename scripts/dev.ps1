# =============================================================================
# dev.ps1 - Inicia desarrollo (backend + frontend)
# Es una versión mejorada de dev-full.ps1
# Uso: .\scripts\dev.ps1
# Opciones:
#   -Backend: Solo backend
#   -Frontend: Solo frontend
#   -Both: Ambos (por defecto)
# =============================================================================

param(
    [switch]$Backend = $false,
    [switch]$Frontend = $false,
    [switch]$Both = $true,
    [string]$BackendPort = "5000",
    [string]$FrontendPort = "5173"
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $($args[0])" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

# Si se especifica Backend o Frontend, anular Both
if ($Backend -or $Frontend) {
    $Both = $false
}

$runBackend = $Backend -or $Both
$runFrontend = $Frontend -or $Both

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  DESARROLLO - CV GENERATOR PRO"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

# Validaciones
if ($runBackend -and -not (Test-Path (Join-Path $backendDir ".env"))) {
    Write-Error-Custom "ERROR: Backend .env no encontrado"
    Write-Host "Ejecuta: .\scripts\setup.ps1"
    exit 1
}

if ($runFrontend -and -not (Test-Path (Join-Path $frontendDir ".env"))) {
    Write-Error-Custom "ERROR: Frontend .env no encontrado"
    Write-Host "Ejecuta: .\scripts\setup.ps1"
    exit 1
}

# Validar MongoDB si es necesario
if ($runBackend) {
    Write-Info "Validando MongoDB..."
    try {
        $mongoTest = & mongosh --eval "db.getMongo()" 2>&1
        Write-Success "MongoDB conectado"
    }
    catch {
        Write-Error-Custom "⚠️  MongoDB no está disponible"
        Write-Host "Asegúrate de que MongoDB esté ejecutándose:"
        Write-Host "  • Local: mongod"
        Write-Host "  • Atlas: Verificar MONGODB_URI en .env"
        Write-Host ""
        Write-Host "¿Continuar de todas formas? (Presiona 'S' para continuar, otra tecla para cancelar)"
        $response = Read-Host
        if ($response -ne "S" -and $response -ne "s") {
            exit 1
        }
    }
}

Write-Host ""

# Procesos en ejecución
$processes = @()

try {
    # INICIAR BACKEND
    if ($runBackend) {
        Write-Header "[1/$([int]$runBackend + [int]$runFrontend)] INICIANDO BACKEND (Puerto $BackendPort)"
        Write-Host ""
        
        $backendWindow = Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command",
            "cd '$backendDir'; Write-Host 'Backend iniciándose...' -ForegroundColor Cyan; npm run dev"
        ) -PassThru
        
        $processes += $backendWindow
        Write-Success "Backend iniciado (PID: $($backendWindow.Id))"
        
        Start-Sleep -Seconds 3
        Write-Host ""
    }
    
    # INICIAR FRONTEND
    if ($runFrontend) {
        $step = if ($runBackend) { 2 } else { 1 }
        $total = [int]$runBackend + [int]$runFrontend
        Write-Header "[$step/$total] INICIANDO FRONTEND (Puerto $FrontendPort)"
        Write-Host ""
        
        # Cambiar a directorio frontend y ejecutar dev
        Set-Location $frontendDir
        Write-Success "Frontend iniciando en ventana actual..."
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  🚀 DESARROLLO EN EJECUCIÓN" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        
        if ($runBackend) {
            Write-Host "Backend:  http://localhost:$BackendPort" -ForegroundColor Blue
            Write-Host "Frontend: http://localhost:$FrontendPort" -ForegroundColor Blue
            Write-Host ""
            Write-Host "Presiona Ctrl+C para detener." -ForegroundColor Gray
        }
        Write-Host ""
        
        # Ejecutar frontend en primer plano
        npm run dev
    }
    else {
        # Si solo es backend, esperar indefinidamente
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  🚀 BACKEND EN EJECUCIÓN" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend: http://localhost:$BackendPort" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Presiona Ctrl+C para detener todas las ventanas." -ForegroundColor Gray
        Write-Host ""
        
        # Esperar indefinidamente
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }

}
catch {
    Write-Error-Custom "Error: $_"
    exit 1
}
finally {
    # Limpiar procesos
    Write-Host ""
    Write-Host "Cerrando aplicaciones..." -ForegroundColor Yellow
    
    foreach ($proc in $processes) {
        if ($proc -and -not $proc.HasExited) {
            try {
                Stop-Process -Id $proc.Id -Force
                Write-Info "Proceso $($proc.Id) finalizado"
            }
            catch {
                # Ya está cerrado
            }
        }
    }
}
