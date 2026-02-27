# 🧪 Pruebas del Frontend - Vitest

## Descripción

El frontend está configurado con **Vitest**, un framework de testing rápido y moderno para Vue.js y otras aplicaciones JavaScript.

## Instalación

Las dependencias de Vitest ya están configuradas. Solo necesitas instalarlas:

```bash
cd metgo3d-cv-generator
npm install
```

## Ejecutar Pruebas

### Comando básico - Ejecutar todos los tests
```bash
npm test
```

### Modo watch - Re-ejecuta tests automáticamente
```bash
npm run test:watch
```

Ideal para desarrollo. Los tests se re-ejecutan cada vez que guardas un archivo.

### Cobertura - Generar reporte de cobertura
```bash
npm run test:coverage
```

Genera un reporte de qué porcentaje del código está cubierto por tests.

### Interfaz Visual - UI Dashboard
```bash
npm run test:ui
```

Abre una interfaz visual en el navegador con:
- Ejecución de tests en tiempo real
- Visualización de cobertura
- Detalles de fallos
- Estadísticas

## Estructura de Tests

```
src/
├── __tests__/
│   └── unit/
│       ├── useLocalStorage.spec.js
│       ├── useI18n.spec.js
│       └── useEditor.spec.js
├── composables/
├── components/
└── ...
```

## Tests Actualmente Creados

### 1. **useLocalStorage.spec.js** - Composable de almacenamiento local
- ✅ Guardar valores en localStorage
- ✅ Obtener valores de localStorage
- ✅ Eliminar valores
- ✅ Limpiar todo localStorage
- ✅ Manejar datos complejos

### 2. **useI18n.spec.js** - Composable de internacionalización
- ✅ Traducción de strings
- ✅ Cambio de idioma (EN/ES)
- ✅ Persistencia en localStorage
- ✅ Idioma por defecto

### 3. **useEditor.spec.js** - Composable del editor de CV
- ✅ Funciones del editor
- ✅ Actualizar información personal
- ✅ Gestionar experiencia laboral
- ✅ Gestionar educación
- ✅ Gestionar habilidades
- ✅ Cambiar plantilla
- ✅ Resetear y guardar CV

## Crear Nuevos Tests

### Plantilla básica
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { miComposable } from '../../composables/miComposable';

describe('miComposable', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  it('debería hacer algo', () => {
    const { miFunction } = miComposable();
    
    const result = miFunction('input');
    
    expect(result).toBe('expected output');
  });
});
```

### Pasos para agregar un nuevo test
1. Crea un archivo `src/__tests__/unit/nombreComposable.spec.js`
2. Importa el composable que deseas probar
3. Escribe tus tests usando `describe`, `it`, `expect`
4. Ejecuta `npm run test:watch`
5. Los tests se ejecutarán automáticamente

## Estructura de un Test

```javascript
describe('Suite de tests', () => {           // Agrupar tests
  beforeEach(() => {                        // Ejecutar antes de cada test
    // Setup
  });

  it('debería hacer algo específico', () => { // Test individual
    // Arrange - Preparar datos
    const input = 'test';
    
    // Act - Ejecutar función
    const result = myFunction(input);
    
    // Assert - Verificar resultado
    expect(result).toBe('expected');
  });
});
```

## Mejores Prácticas

### 1. Nombra los tests claramente
```javascript
// ❌ Malo
it('prueba', () => {});

// ✅ Bueno
it('debería agregar un item a la lista cuando se llama addItem', () => {});
```

### 2. Una afirmación principal por test
```javascript
// ❌ Evitar múltiples asserts no relacionados
it('test', () => {
  expect(a).toBe(1);
  expect(b).toBe('string');
  expect(c).toBeTruthy();
});

// ✅ Separa en tests diferentes
it('debería retornar número 1', () => {
  expect(a).toBe(1);
});
```

### 3. Usa descriptores claros
```javascript
describe('useLocalStorage', () => {
  describe('getItem', () => {
    it('debería retornar null para claves inexistentes', () => {});
    it('debería retornar el objeto guardado', () => {});
  });
});
```

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecutar tests una vez |
| `npm run test:watch` | Modo observación |
| `npm run test:coverage` | Cobertura |
| `npm run test:ui` | Dashboard visual |
| `npm test -- --reporter=verbose` | Salida detallada |
| `npm test -- --reporter=html` | Reporte HTML |

## Debuggear Tests

### En VS Code
1. Abre la paleta de comandos: `Ctrl+Shift+P`
2. Selectiona "JavaScript Debug Terminal"
3. Ejecuta `npm run test:watch`
4. Abre DevTools (F12)
5. Los breakpoints funcionarán

### O usando debugger inline
```javascript
it('test', () => {
  debugger; // Empausa la ejecución
  const result = miFunction();
  expect(result).toBe('expected');
});
```

## Cobertura Esperada

Mientras avanza el desarrollo:
- **Fase 1**: 10-20% cobertura (tests básicos)
- **Fase 2**: 30-50% cobertura (tests de composables críticos)
- **Fase 3**: 60%+ cobertura (tests completos)

## Recursos Útiles

- [Documentación de Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Jest Matchers (compatible con Vitest)](https://vitest.dev/api/expect.html)

## Solucionar Problemas

### "Cannot find module" error
```bash
npm install
```

### Tests lentos
```bash
npm run test:ui  # Ver qué test es lento
```

### No se detectan cambios en watch
```bash
npm run test:watch -- --poll
```

## Próximos Pasos

- [ ] Tests para componentes Vue
- [ ] Tests de integración
- [ ] Coverage reports automatizados en CI/CD
- [ ] Snapshot testing
- [ ] E2E testing con Playwright/Cypress
