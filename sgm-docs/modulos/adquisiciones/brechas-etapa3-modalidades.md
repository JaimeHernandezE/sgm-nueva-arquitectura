# Brechas de la etapa 3 (Resolución de Compra) — estado post-llenado

## Propósito

Inventario histórico de brechas + **estado actual** tras el llenado de CM, LP y TD frente a Compra Ágil y a las instrucciones de Jul 20–22 (`plantilla-maestra` §3.6/§4.1, `patron-formularios-secciones`, `patron-vista-expediente`).

---

## 1. Resumen comparativo (actualizado)

| Dimensión | Compra Ágil | Convenio Marco | Licitación Pública | Trato Directo |
|---|---|---|---|---|
| Sub-pasos etapa 3 | 6 (3.1–3.6) | 8 (3.1–3.8) | 14 (3.1–3.14) | **4** (3.1–3.4) ✅ |
| Entidades reconciliadas | Todas | ✅ | ✅ | ✅ (`ProcurementCase`, `BudgetCommitment` canónica, `AdministrativeAct.founded_resolution`, `ComptrollerReview`) |
| Operaciones en `contracts.md` | §2.3 | §2.7 ✅ | §2.4 ✅ | **§2.8 ✅** |
| Eventos §4 | Sí | ✅ | ✅ | ✅ (reuso + TD) |
| Wireframes `.md` | 6/6 | 8/8 ✅ | 14/14 ✅ | **4/4 ✅** (`wireframes/trato-directo/`) |
| Prototipo HTML | 6/6 | 8/8 ✅ | 14/14 ✅ | **4/4 ✅** (`demoValidation`) |
| OpenAPI real | Sí | **Sí** (`2-convenio-marco/3-resolucion-compra.yaml`) | **Sí** (`3-licitacion-publica/…`) | **Sí** (docs + examples; rutas reutilizadas) |
| Fixture etapa 3 | Sí | ✅ `ADQ-2026-00089` | ✅ `ADQ-2026-00045` | ✅ `ADQ-2026-00012` (vinculado, 3.3 pendiente) |
| QA P0/P1 dedicada | Sí | Pendiente | Pendiente | Pendiente |
| Pendientes humanos | Varios | P-68 | P-64…P-67 | **P-69, P-70, P-71** (+ P-64 compartido) |

---

## 2. Trato Directo — ✅ ciclo de contenido cerrado

Cerrado el vacío estructural del diagnóstico original:

- Sub-paso de **publicación / vinculación MP** (3.2) — cumple tabla de `2-modalidad-compra.md` §2.3.
- `DirectProcurementCase` corregido → `ProcurementCase`; `BudgetCommitment` marcada canónica.
- Toma de Razón > 8.000 UTM modelada en 3.1 (reuso `ComptrollerReview`).
- Rechazo OC en 3.4 con enum propuesto — **[PENDIENTE P-69]** (no inventar regla de negocio).
- Borde OC Aceptada clasificado asíncrono (agnóstico push/polling) — **[PENDIENTE P-70]**.
- Plazo 24 h — **[PENDIENTE P-71]**.
- `contracts.md` §2.8; wireframes; prototipos; fixture; OpenAPI fragmento.

---

## 3. CM / LP — deuda de norma nueva (cerrada en esta pasada)

- OpenAPI real de etapa 3 + `$ref` en `adquisiciones.openapi.yaml`.
- Wireframes ASCII con títulos de sección (`## …`) alineados a `.form-section`.
- Prototipos CM migrados a `demoValidation`.
- Drift documental: ficha LP (entidades ya en core + P-64…P-67), `catalogo.md`, `MANIFEST.md`, refs `contracts.md` (§2.3 no §2.6; `commitBudget` incluye CM/TD).

**Sigue pendiente (humano / pasada QA):** fichas QA P0/P1 para CM/LP/TD; cierre de P-64…P-71 con división de municipalidades. No hay specs Playwright versionadas en el repo (el claim e2e previo era solo documental).

---

## 4. Qué requiere decisión humana

| ID | Tema | Dueño |
|---|---|---|
| P-64 | Canal consulta CGR | Contraloría |
| P-65 | Aclaración → acto formal | jurídica |
| P-66 | Inhabilidades comisión LP | jurídica |
| P-67 | Firma contratista LP | DM / jurídica |
| P-68 | Límite reintentos CA/CM | DM |
| P-69 | Camino rechazo OC en TD | DM / división municipalidades |
| P-70 | Polling vs webhook MP | ChileCompra / plataforma |
| P-71 | Control bloqueante plazo 24 h TD | DM / jurídica |

---

## 5. Nota histórica

Las secciones §2.1–§2.3 del diagnóstico original (antes del llenado) se conservan en git history; este archivo refleja el **estado post-implementación** del plan «Estado modalidades etapa 3 vs brechas + instrucciones».
