# Scripts - CV Generator Pro

## dev-full.ps1 / dev-full.sh

Ejecuta el backend (puerto 5000) y el frontend (puerto 5173) simultáneamente.

**Windows (PowerShell):**
```powershell
.\scripts\dev-full.ps1
```

**Linux / Mac:**
```bash
chmod +x scripts/dev-full.sh
./scripts/dev-full.sh
```

**Requisitos:** MongoDB en ejecución.

---

## setup.ps1

Instala dependencias en ambos proyectos y crea archivos `.env` si no existen.

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

---

## Estructura recomendada

```
CV_Actualizado_Miguel_Lucero/
├── metgo3d-cv-generator/    # Frontend Vue
├── cv-generator-backend/    # Backend Express
├── scripts/
│   ├── dev-full.ps1
│   ├── dev-full.sh
│   ├── setup.ps1
│   └── README.md
├── Fase_4_CV_2026.txt       # Propuestas y roadmap
├── Fase_2_CV_2026.txt
├── Fase_3_CV_2026.txt
└── Miguel_Lucero_CV_2026.txt
```
