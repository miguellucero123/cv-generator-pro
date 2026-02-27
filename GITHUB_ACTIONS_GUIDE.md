# 🚀 GitHub Actions CI/CD

## Resumen

Se han configurado tres workflows automáticos de GitHub Actions que se ejecutan en cada push y pull request:

### 1. **Backend Tests CI** (`backend-tests.yml`)
Ejecuta la suite de tests del backend en múltiples versiones de Node.js

**Triggers:**
- Push a `main` o `develop` en la carpeta `cv-generator-backend`
- Pull requests a `main` o `develop` que afecten el backend

**Acciones que realiza:**
- ✅ Instala dependencias
- ✅ Ejecuta ESLint (cuando esté configurado)
- ✅ Ejecuta tests con Jest
- ✅ Genera reporte de cobertura
- ✅ Sube cobertura a Codecov

**Versiones de Node.js testeadas:**
- Node 16.x
- Node 18.x
- Node 20.x

### 2. **Frontend Build & Test** (`frontend-build.yml`)
Valida que la compilación del frontend sea correcta

**Triggers:**
- Push a `main` o `develop` en la carpeta `metgo3d-cv-generator`
- Pull requests a `main` o `develop` que afecten el frontend

**Acciones que realiza:**
- ✅ Instala dependencias
- ✅ Ejecuta Vite build
- ✅ Verifica tamaño del bundle
- ✅ Reporta resultado

**Versiones de Node.js testeadas:**
- Node 16.x
- Node 18.x
- Node 20.x

### 3. **Project Validation** (`validate.yml`)
Valida la estructura y configuración general del proyecto

**Triggers:**
- Todos los push a `main` o `develop`
- Todos los pull requests

**Acciones que realiza:**
- ✅ Verifica estructura de carpetas
- ✅ Valida archivos críticos
- ✅ Análisis de markdown (opcional)
- ✅ Detección de secretos expuestos

## Ver el estado de los workflows

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Verás todos los workflows ejecutándose

## Interpretar los resultados

### ✅ Verde (Success)
El workflow se ejecutó correctamente. Todos los tests pasaron.

### ⏳ Amarillo (In Progress)
El workflow está en ejecución. Espera a que termine.

### ❌ Rojo (Failure)
El workflow falló. Haz click para ver los detalles del error.

### ⊘ Gris (Skipped)
El workflow fue skipped porque los paths no coincidieron (cambios en otra carpeta).

## Configurar notificaciones

GitHub te enviará automáticamente notificaciones si:
- Un workflow falla
- Una revisión es requerida
- Hay cambios importantes

Puedes personalizar estas notificaciones en:
Settings → Notifications → GitHub Actions

## Agregar nuevos workflows

Para agregar un nuevo workflow:

1. Crea un archivo en `.github/workflows/nombre.yml`
2. Sigue la sintaxis de GitHub Actions
3. Haz commit y push
4. El workflow se ejecutará automáticamente

Ejemplo mínimo:
```yaml
name: Mi Workflow

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run test
        run: echo "Hola!"
```

## Mejoras futuras

- [ ] Agregar deploy automático a producción
- [ ] Añadir análisis de seguridad (Dependabot)
- [ ] Configurar Codecov para tracking de cobertura
- [ ] Agregar tests de frontend (Vitest)
- [ ] Configurar pre-release automation

## Recursos útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Best Practices](https://docs.github.com/en/actions/guides)
