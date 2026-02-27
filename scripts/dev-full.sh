#!/bin/bash
# =============================================================================
# dev-full.sh - Ejecuta backend + frontend simultáneamente (Linux/Mac)
# Uso: ./scripts/dev-full.sh
# =============================================================================

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "METGO_3D CV Generator - Iniciando entorno de desarrollo"
echo ""

BACKEND="$ROOT/cv-generator-backend"
FRONTEND="$ROOT/metgo3d-cv-generator"

[ -d "$BACKEND" ] || { echo "ERROR: No existe cv-generator-backend"; exit 1; }
[ -d "$FRONTEND" ] || { echo "ERROR: No existe metgo3d-cv-generator"; exit 1; }

trap 'kill $(jobs -p) 2>/dev/null' EXIT

echo "[1/2] Iniciando backend (puerto 5000)..."
cd "$BACKEND" && npm run dev &
sleep 3

echo "[2/2] Iniciando frontend (puerto 5173)..."
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Ctrl+C para detener ambos"
echo ""

cd "$FRONTEND" && npm run dev
