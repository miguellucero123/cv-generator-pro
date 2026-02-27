# =============================================================================
# clean.ps1 - Limpia cachés, node_modules y archivos temporales
# Uso: .\scripts\clean.ps1
# Opciones:
#   -Deep: Elimina node_modules (requiere reinstalación)
#   -Full: Limpia todo incluyendo dist/build
# =============================================================================

param(
    [switch]$Deep = $false,
    [switch]$Full = $false,
    [switch]$Confirm = $false
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $rootDir "cv-generator-backend"
$frontendDir = Join-Path $rootDir "metgo3d-cv-generator"

function Write-Header { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host "✔ $($args[0])" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $($args[0])" -ForegroundColor Blue }

Write-Header "════════════════════════════════════════════════════════"
Write-Header "  LIMPIAR PROYECTOS"
Write-Header "════════════════════════════════════════════════════════"
Write-Host ""

if ($Deep) {
    Write-Host "Modo: 🔴 PROFUNDO (node_modules será eliminado)" -ForegroundColor Red
}
elseif ($Full) {
    Write-Host "Modo: 🟠 COMPLETO (node_modules + dist/build)" -ForegroundColor Yellow
}
else {
    Write-Host "Modo: 🟢 NORMAL (cachés y temporales)" -ForegroundColor Green
}
Write-Host ""

$filesToDelete = @()

# Backend
Write-Host "🔍 Analizando backend..." -ForegroundColor Yellow

$backendCaches = @(
    "node_modules",
    ".npm",
    "package-lock.json",
    "dist",
    "build",
    ".coverage"
)

foreach ($item in $backendCaches) {
    $path = Join-Path $backendDir $item
    if (Test-Path $path) {
        if ($item -eq "node_modules" -and -not $Deep -and -not $Full) {
            Write-Info "Saltando $item (usa -Deep para eliminar)"
        }
        elseif (($item -in "dist", "build") -and -not $Full -and -not $Deep) {
            Write-Info "Saltando $item (usa -Full para eliminar)"
        }
        else {
            $filesToDelete += $path
            if (Test-Path $path -PathType Container) {
                $size = (Get-ChildItem -Path $path -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
                Write-Host "  🗑️  $item (~${size:F1}M)" -ForegroundColor Red
            }
            else {
                Write-Host "  🗑️  $item" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""

# Frontend
Write-Host "🔍 Analizando frontend..." -ForegroundColor Yellow

$frontendCaches = @(
    "node_modules",
    ".npm",
    "package-lock.json",
    "dist",
    "build",
    ".coverage"
)

foreach ($item in $frontendCaches) {
    $path = Join-Path $frontendDir $item
    if (Test-Path $path) {
        if ($item -eq "node_modules" -and -not $Deep -and -not $Full) {
            Write-Info "Saltando $item (usa -Deep para eliminar)"
        }
        elseif (($item -in "dist", "build") -and -not $Full -and -not $Deep) {
            Write-Info "Saltando $item (usa -Full para eliminar)"
        }
        else {
            $filesToDelete += $path
            if (Test-Path $path -PathType Container) {
                $size = (Get-ChildItem -Path $path -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
                Write-Host "  🗑️  $item (~${size:F1}M)" -ForegroundColor Red
            }
            else {
                Write-Host "  🗑️  $item" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""

if ($filesToDelete.Count -eq 0) {
    Write-Success "✨ Todo está limpio, no hay nada que eliminar"
    exit 0
}

Write-Host "Total de archivos/carpetas a eliminar: $($filesToDelete.Count)" -ForegroundColor Yellow

# Pedir confirmación
if (-not $Confirm) {
    Write-Host ""
    $response = Read-Host "¿Continuar con la limpieza? (s/n)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Limpieza cancelada" -ForegroundColor Yellow
        exit 0
    }
}

# Eliminar archivos
Write-Host ""
Write-Host "Iniciando limpieza..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $filesToDelete) {
    try {
        if (Test-Path $file -PathType Container) {
            Remove-Item -Path $file -Recurse -Force -ErrorAction Stop
            Write-Success "Eliminado: $([System.IO.Path]::GetFileName($file))"
        }
        else {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Success "Eliminado: $([System.IO.Path]::GetFileName($file))"
        }
    }
    catch {
        Write-Host "⚠️  Error al eliminar $file : $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Header "════════════════════════════════════════════════════════"
Write-Success "✅ LIMPIEZA COMPLETADA"
Write-Header "════════════════════════════════════════════════════════"
