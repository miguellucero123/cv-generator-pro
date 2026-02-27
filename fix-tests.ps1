# Script para convertir vitest a jest syntax

$testDir = ".\cv-generator-backend\__tests__\unit"
$files = Get-ChildItem -Path $testDir -Filter "*.test.js"

foreach ($file in $files) {
    Write-Host "Procesando: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Reemplazar vi.fn() por jest.fn()
    $content = $content -replace 'vi\.fn\(\)', 'jest.fn()'
    
    # Reemplazar vi.clearAllMocks() por jest.clearAllMocks()  
    $content = $content -replace 'vi\.clearAllMocks\(\)', 'jest.clearAllMocks()'
    
    # Reemplazar vi.mock( por jest.mock(
    $content = $content -replace 'vi\.mock\(', 'jest.mock('
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "✓ Completado: $($file.Name)"
}

Write-Host "✓ Todos los archivos han sido procesados"
