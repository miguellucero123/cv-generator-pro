# =============================================================================
# quickstart.ps1 - Inicio rápido (Setup + Dev en un comando)
# Automatiza la configuración inicial y abre el navegador
# Uso: .\scripts\quickstart.ps1
# =============================================================================

param(
    [switch]$SkipBrowser = $false,
    [switch]$BackendOnly = $false,
    [switch]$FrontendOnly = $false
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $($args[0])" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠ $($args[0])" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  ⚡ QUICKSTART - CV GENERATOR PRO"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

# Verificar si ya está configurado
$backendEnv = Join-Path $backendDir ".env"
$frontendEnv = Join-Path $frontendDir ".env"

$needsSetup = (-not (Test-Path $backendEnv)) -or (-not (Test-Path $frontendEnv))

if ($needsSetup) {
    Write-Header "🔧 PRIMER USO DETECTADO - EJECUTANDO SETUP..."
    Write-Host ""
    
    # Ejecutar setup en paralelo
    & "$rootDir\scripts\setup.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Setup falló. Por favor, resuelve los problemas."
        exit 1
    }
    
    Write-Host ""
    Write-Warning-Custom "IMPORTANTE:"
    Write-Host "  1. Edita los archivos .env con tus valores reales:"
    Write-Host "     • $backendEnv"
    Write-Host "     • $frontendEnv"
    Write-Host ""
    Write-Host "  2. Presiona ENTER cuando hayas completado la configuración..."
    Read-Host "  > "
    
}
else {
    Write-Success "Archivos .env encontrados - Inicio rápido"
}

Write-Host ""
Write-Header "🚀 INICIANDO DESARROLLO..."
Write-Host ""

# Opciones de inicio
$devArgs = @()

if ($BackendOnly) {
    $devArgs += "-Backend"
}
if ($FrontendOnly) {
    $devArgs += "-Frontend"
}

# Ejecutar dev
& "$rootDir\scripts\dev.ps1" @devArgs &

$devPID = $?

# Esperar a que se inicie
Start-Sleep -Seconds 4

# Abrir navegadores
if (-not $SkipBrowser -and -not $BackendOnly) {
    Write-Info "Abriendo navegador..."
    Start-Sleep -Seconds 2
    
    # Intentar abrir con chrome, edge o navegador por defecto
    try {
        $browsers = @(
            "C:\Program Files\Google\Chrome\Application\chrome.exe",
            "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        )
        
        $browser = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1
        
        if ($browser) {
            & $browser "http://localhost:5173"
            Write-Success "Navegador abierto: http://localhost:5173"
        }
        else {
            Start-Process "http://localhost:5173"
            Write-Success "Navegador abierto: http://localhost:5173"
        }
    }
    catch {
        Write-Warning-Custom "No se pudo abrir navegador automáticamente"
        Write-Host "  Abre manualmente: http://localhost:5173"
    }
}

Write-Host ""
Write-Header "════════════════════════════════════════════════════════"
Write-Success "✅ ENTORNO INICIADO"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

if (-not $BackendOnly) {
    Write-Host "📍 Acceso rápido:" -ForegroundColor Green
    Write-Host "   • Frontend (esta ventana): http://localhost:5173"
    if (-not $FrontendOnly) {
        Write-Host "   • Backend (otra ventana): http://localhost:5000"
        Write-Host "   • API Health: http://localhost:5000/api/health"
    }
}

Write-Host ""
Write-Host "💡 Atajos útiles:" -ForegroundColor Cyan
Write-Host "   • Ctrl+C: Detener desarrollo"
Write-Host "   • Editar .env: Requiere reinicio de dev"
Write-Host "   • .\scripts\status.ps1: Ver estado"
Write-Host "   • .\scripts\clean.ps1: Limpiar cachés"
Write-Host ""

# Esperar (dev se ejecuta en primer plano)
Wait-Process -ID $devPID 2>$null
