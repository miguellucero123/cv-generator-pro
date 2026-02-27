# 🚀 PHASE 2 - Plan Detallado

**Objetivo**: Aumentar cobertura de tests a 30%+ (backend) y 20%+ (frontend) con tests de unidades críticas.

**Duración estimada**: 3 semanas

**Estado actual**: 
- Backend: ~5% cobertura (32 tests básicos)
- Frontend: 0% (tests listos pero no ejecutados)

---

## 📊 Análisis de Cobertura Actual

### Backend - Archivos sin cobertura (0%)
```
src/controllers/
  ├── cvController.js          (226 líneas) ❌
  ├── authController.js        (164 líneas) ❌
  ├── shareController.js       (200 líneas) ❌
  └── analyticsController.js   (166 líneas) ❌

src/routes/
  ├── auth.js                  (44 líneas) ❌
  ├── cv.js                    (30 líneas) ❌
  ├── share.js                 (11 líneas) ❌
  └── analytics.js             (14 líneas) ❌

src/middleware/
  ├── validation.js            (47 líneas) ❌
  └── auth.js                  (25% coverage) ⚠️

src/models/
  ├── CV.js                    (216 líneas) ❌
  ├── User.js                  (33.33% coverage) ⚠️
  └── Analytics.js             (82 líneas) ❌
```

### Frontend - Tests listos
```
src/__tests__/unit/
  ├── useLocalStorage.spec.js  (6 tests)
  ├── useI18n.spec.js          (6 tests)
  └── useEditor.spec.js        (10 tests)
STATUS: Listos pero no han corrido
```

---

## 🎯 Tareas Phase 2

### Semana 1: Tests Backend (Controllers)

#### Tarea 1: authController Tests
```
Archivo: cv-generator-backend/__tests__/unit/authController.test.js
Cover:
  - register() - validación, creación usuario, token
  - login() - validación credenciales, JWT
  - getMe() - usuario autenticado
  - updateProfile() - actualizar datos
  - changePassword() - validación password
  - logout() - limpiar sesión
  - forgotPassword() - email reset
  - resetPassword() - validar token y actualizar

Mocks necesarios:
  - User.findOne(), create(), findByIdAndUpdate()
  - jwt.sign(), verify()
  - nodemailer.sendMail()
  
Target: 15+ tests, 60%+ coverage del archivo
```

#### Tarea 2: cvController Tests
```
Archivo: cv-generator-backend/__tests__/unit/cvController.test.js
Cover:
  - createCV() - crear y guardar
  - getCVs() - listar con paginación
  - getCV() - obtener por ID
  - updateCV() - actualizar datos
  - deleteCV() - EliminarCV
  - duplicateCV() - clonar CV
  - exportPDF() - generar PDF (mock)

Mocks necesarios:
  - CV.create(), find(), findById(), findByIdAndUpdate(), deleteOne()
  - PDF library
  
Target: 18+ tests, 70%+ coverage del archivo
```

#### Tarea 3: shareController Tests
```
Archivo: cv-generator-backend/__tests__/unit/shareController.test.js
Cover:
  - createShare() - generar enlace público
  - getShare() - obtener info enlace
  - getSharedCV() - acceder a CV compartido
  - revokeShare() - desactivar enlace
  - validatePassword() - protección con contraseña

Target: 10+ tests, 60%+ coverage
```

### Semana 2: Tests Backend (Middleware + Modelos)

#### Tarea 4: Middleware Validation Tests
```
Archivo: cv-generator-backend/__tests__/unit/validation.test.js
Cover:
  - validateRegister()
  - validateLogin()
  - validateCV()
  - handleValidationErrors()

Target: 12+ tests, 80%+ coverage
```

#### Tarea 5: Model Tests
```
Archivo: cv-generator-backend/__tests__/unit/models.test.js
Cover:
  - User schema validation
  - CV schema validation
  - Analytics schema validation
  - Custom methods (generateAuthToken, comparePassword)

Target: 15+ tests, 50%+ coverage
```

### Semana 3: Tests Frontend + Refinement

#### Tarea 6: Frontend Composables (Completar)
```
Frontend:
  - Ejecutar tests existentes (useLocalStorage, useI18n, useEditor)
  - Agregar tests para useAPI.js
  - Agregar tests para useAuthAPI.js
  - Agregar tests para useCVAPI.js

Target: 30+ tests, 20%+ coverage
```

#### Tarea 7: Ajustar Cobertura y CI/CD
```
- jest.config.js: Ajustar umbrales a 30% (desde 20%)
- Verificar que CI/CD pase en GitHub Actions
- Generar reportes de cobertura
- Codecov integration (opcional)
```

---

## 📦 Archivos a Crear/Modificar

### Backend
```
__tests__/unit/
├── authController.test.js      ✅ CREAR (200+ líneas)
├── cvController.test.js        ✅ CREAR (250+ líneas)
├── shareController.test.js     ✅ CREAR (150+ líneas)
├── validation.test.js          ✅ CREAR (200+ líneas)
└── models.test.js              ✅ CREAR (250+ líneas)

__tests__/fixtures/
├── mockUser.js                 ✅ CREAR (datos mock)
├── mockCV.js                   ✅ CREAR (datos mock)
└── mockShare.js                ✅ CREAR (datos mock)

jest.config.js                  ✅ ACTUALIZAR (umbrales)
```

### Frontend
```
src/__tests__/unit/
├── useLocalStorage.spec.js     ✅ EJECUTAR, mejorar
├── useI18n.spec.js             ✅ EJECUTAR, mejorar
├── useEditor.spec.js           ✅ EJECUTAR, mejorar
├── useAPI.spec.js              ✅ CREAR
├── useAuthAPI.spec.js          ✅ CREAR
└── useCVAPI.spec.js            ✅ CREAR
```

---

## 📈 Métricas Objetivo

### Backend
| Métrica | Actual | Target |
|---------|--------|--------|
| Coverage | 5% | 30%+ |
| Tests | 32 | 80+ |
| Controllers | 0% | 60%+ |
| Middleware | 20% | 60%+ |
| Models | 10% | 50%+ |

### Frontend
| Métrica | Actual | Target |
|---------|--------|--------|
| Coverage | 0% | 20%+ |
| Tests | 22 ready | 40+ |
| Composables | Ready | Tested |

---

## ✅ Definición de Hecho (DoD)

Para completar Phase 2:

- [ ] 80+ tests backend pasando
- [ ] 40+ tests frontend pasando
- [ ] Coverage backend >= 30%
- [ ] Coverage frontend >= 20%
- [ ] Todos los tests en CI/CD pasan
- [ ] Documentación de patrón de tests actualizada
- [ ] No Hay regresiones (Phase 1 tests siguen pasando)
- [ ] Fixtures de tests creados
- [ ] Reportes de cobertura generados

---

## 🎬 Cómo Ejecutar

### Backend Tests
```bash
cd cv-generator-backend

# Ejecutar todos los tests
npm test

# Ver cobertura
npm run test:coverage

# Modo watch (desarrollo)
npm run test:watch

# Ver reporte HTML
# Abre: coverage/index.html
```

### Frontend Tests
```bash
cd metgo3d-cv-generator

# Ejecutar todos
npm test

# Con UI
npm run test:ui

# Coverage
npm run test:coverage
```

---

## 📝 Documentación a Generar

1. **PHASE_2_PROGRESS.md** - Progreso semanal
2. **TEST_PATTERNS.md** - Patrones de testing (mocks, fixtures)
3. **COVERAGE_REPORT.md** - Análisis de cobertura por módulo

---

## 🚨 Riesgos y Mitigation

| Riesgo | Probabilidad | Mitigación |
|--------|------------|-----------|
| Tests frágiles | Media | Usar fixtures, evitar DB real |
| Bajo coverage | Baja | Pruebas exhaustivas planeadas |
| Regresiones | Baja | Tests Phase 1 como baseline |
| Performance | Baja | Mocks eficientes, parallelization |

---

## 🔗 Enlaces Útiles

- [Jest Mocking](https://jestjs.io/docs/es-ES/manual-mocks)
- [Mongoose Mocking](https://www.npmjs.com/package/mongoose)
- [Vitest Guide](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Próximo paso**: Empezar con Tests de authController (Tarea 1)

*Última actualización: Phase 2 Iniciada*
