# Inventario verificable del repositorio SGM (nueva-arquitectura)

**Fecha del inventario:** 30 de julio de 2026 (actualizado 31 de julio de 2026: `alcance-minimo-modulos-adyacentes.md`; integración de `estandar-pruebas.md`)  
**Alcance:** contenido versionado del repositorio, excluidos `.git/`, artefactos de build y `node_modules/` (este último no existe en el árbol).  
**Naturaleza:** acta de lo construido como archivo. No es README ni guía de uso.

---

## 1. Resumen en cifras

| Métrica | Valor | Cómo se obtuvo |
|---|---:|---|
| Archivos de especificación **sustantivas** (`.md`, sin README, sin wireframes, sin glosarios auxiliares, sin stubs OpenAPI, sin `MANIFEST`/README de prototipos) | **83** | Clasificación por ruta + conteo `Get-ChildItem` (incluye alcance-mínimo y `estandar-pruebas.md`) |
| Líneas de esas 83 | **16200** | `(Get-Content).Count` por archivo, suma (reconteo 31 jul 2026) |
| Palabras de esas 83 | **171620** | Tokens separados por whitespace, suma |
| Archivos de especificación **+ wireframes de contenido** (83 + 70) | **153** | Idem; wireframes sin sus 2 README |
| Líneas de esas 153 | **20676** | Suma |
| Palabras de esas 153 | **199481** | Suma |
| Total `.md` en el repo (antes de este inventario) | **166** / **21371** líneas | Incluye README, glosarios, wireframe README, prototipos md |
| Wireframes de contenido (`.md`) | **70** / **4476** líneas | Bajo `**/wireframes/`, excluye README |
| Prototipos HTML | **73** / **9800** líneas | `sgm-prototipos/**/*.html` |
| OpenAPI / YAML de contrato | **17** `.yaml` + **2** `.yml` CI | Conteo por extensión |
| Fixtures YAML Adquisiciones | **6** | Carpeta `fixtures/` (5 expedientes + escenarios) |
| Pendientes — ocurrencias de marca en corpus `sgm-docs`+`bd-export-odoo` | P **195** · C **132** · T **88** · R **82** · A **18** · X **900** | Regex `(?<![A-Z])[PCTRAX]-\d+` (reconteo 31 jul 2026 tras estandar-pruebas + registro X-86…X-93) |
| Pendientes — IDs únicos (mismo corpus) | P **30** · C **18** · T **14** · R **14** · A **5** · X **93** | Distinct; registro tabular X-01…X-93 |
| Entidades modelo canónico propuestas | Core **37** + plataforma **27** encabezados `###` | `entidades-core.md`, `entidades-plataforma.md`; 4 nombres en ambos (ver §1.2) |
| Decisiones de partida D-n / DC-n (filas de tabla) | Pres **4** · Cont **5** · Tes **6** · RRHH **6** · plan-general **11** (DC) · entregable-licitación **7** (D-01…07) | Filas `| D-… |` / `| DC-… |` |
| Macroprocesos nombrados | MC-1…MC-7 · MT-1…MT-7 · MR-1…MR-7 | Distinct en `sgm-docs` |
| ADR fechados `2026-07-*` | **5** | Carpeta `arquitectura/decisiones/` |
| Normas distintas (tras deduplicar grafías) | **36** ítems canónicos en [`registro-normas.md`](sgm-docs/arquitectura/especificacion/registro-normas.md) (`N-01`…`N-36`; lista espejo en §1.3) | Registro único + regex histórico Ley/DS/Decreto/Resolución/Dictamen/Oficio/Directiva/NICSP/NTDEE/PISEE/LOCM |
| Integraciones con sistemas del Estado (deduplicadas) | **15** | Ver §1.4 |
| Commits totales | **108** | `git rev-list --count HEAD` |
| Primer commit | **2026-07-01 16:10:41 -0400** | `git log --reverse` |
| Último commit (HEAD) | **2026-07-28 14:20:59 -0400** | `git log -1` |
| Modelos Odoo en `bd-export-odoo` | **55** (10 módulos con diccionario) | Encabezados `####` de modelo |
| Modelos en inventarios `modelos-odoo.md` (módulos) | Cont **42** · Tes **17** · Pres **13** · RRHH **7** (excl. `_inherit`) | Encabezados `###` de modelo; hay solapes entre módulos |
| Archivos totales (sin `.git`, sin este inventario ni auxiliares `_t_*`) | **300** | `Get-ChildItem -Recurse -File` |
| Archivos de contenido (md/html/js/css/yaml/yml/json/csv/drawio/mdc) | **298** (166 md + 132 otros) | Anexo §8 |

### 1.1 Nota sobre pendientes (ocurrencias ≠ IDs de serie)

Las **ocurrencias** cuentan cada mención en el cuerpo (incluye tablas resumen, referencias cruzadas y menciones históricas). Los **IDs únicos** del regex incluyen formas residuales de la renumeración P→X (p. ej. menciones a antiguos `P-44`, `P-71` junto a `X-44`, `X-71`) y grafías `P-1` vs `P-01`.

Serie canónica declarada en planes / registro:

| Prefijo | Serie declarada en documentos de origen | Filas en registro tabular central |
|---|---|---|
| X- | X-01…X-93 | **93** filas en `sgm-docs/arquitectura/decisiones/pendientes.md` |
| P- | P-1…P-31 (plan Presupuestos / plan-general) | Marcadores `> **PENDIENTE P-…**` y tablas |
| C- | C-1…C-18 | Marcadores en plan Contabilidad |
| T- | T-1…T-14 | Marcadores en plan Tesorería |
| R- | R-1…R-14 | Marcadores en plan RRHH |
| A- | A-1…A-5 | En `comparativa-odoo-vs-nuevo.md` / plan-general |

### 1.2 Entidades: solapes

Aparecen como encabezado tanto en `entidades-core.md` como en `entidades-plataforma.md`: `NormativeParameter`, `UtmValue`, `PriceReference`, `MpProcessSnapshot`. Encabezados totales 37+27=**64**, con **4** nombres compartidos entre documentos.

En `entidades-plataforma.md`, varios encabezados agrupan alias con `/` (p. ej. `Role` / `Permission`); el conteo **27** es de encabezados `###`, no de nombres atómicos tras partir por `/`.

### 1.3 Normas (lista consolidada deduplicada)

**Fuente de verdad:** [`sgm-docs/arquitectura/especificacion/registro-normas.md`](sgm-docs/arquitectura/especificacion/registro-normas.md) (`N-01`…`N-36`, apariciones y verificación). Esta sección es un espejo resumido del inventario; altas y citas nuevas van al registro.

**Leyes:** 15.076; 18.695 (LOCM); 18.883; 19.070; 19.378; 19.799; 19.880; 19.883; 19.886; 19.925; 19.983; 20.237; 20.422; 20.742; 21.180; 21.634; 21.719.

**Decretos / DS:** 1/2015; 4/2020; 7/2023; 10/2023; 12/2023; 854/2004; 661/2024; 1227/2024.

**Resoluciones:** N° 3/2020 (grafías «Resolución N° 3» y «3/2020» unificadas).

**Dictámenes CGR:** 60.449/2008; 11.365/2006.

**Oficios:** 3.899/2018; 36.640/2007; N° 32.228 (sin año en varias citas).

**Directivas / marcos:** Directiva N° 15; NICSP; NTDEE; PISEE; LOCM (acrónimo además de Ley 18.695).

**Total lista §1.3:** 36 ítems (17 leyes + 8 decretos + 1 resolución + 2 dictámenes + 3 oficios + 5 marcos/directivas).

**Declaradas verificadas en fuente primaria u oficial** (el propio corpus lo afirma; detalle en el registro §3):

| Norma / hecho | Archivo |
|---|---|
| Dictamen CGR N° 60.449/2008 (y corrección de cita del levantamiento) — **N-27** | `sgm-docs/modulos/presupuestos/plan-de-trabajo_presupuestos.md` |
| art. 24 DL 3.063; art. 65 c) LOCM (**N-02**); composición IPP/SINIM | `sgm-docs/arquitectura/decisiones/Nota-sobre-rentas.md` |
| Cobertura DocDigital 80 % municipios / funciones de la plataforma (fuente Ministerio de Hacienda); mecanismo M2M **no** verificado | `sgm-docs/arquitectura/especificacion/integracion-docdigital.md` y ADR DocDigital |

El resto de normas del corpus **no** declara verificación en fuente primaria en el texto leído.

### 1.4 Integraciones Estado (deduplicadas)

**Registro canónico:** [`sgm-docs/arquitectura/especificacion/integraciones-terceros.md`](sgm-docs/arquitectura/especificacion/integraciones-terceros.md) — 21 fichas Estado/organismos (Grupo A) + 7 dependencias infra/ecosistema en tabla (Grupo B). Esta tabla §1.4 conserva el índice histórico de **15**; el registro explica la diferencia (organismos adicionales en planes, desglose FCM/TGR/SEM/giradores, NTDEE como marco).

| Sistema | Evidencia en corpus (ejemplos de ruta) |
|---|---|
| Mercado Público / ChileCompra | `sgm-docs/arquitectura/especificacion/integracion-mercado-publico.md`; wireframes/fichas Adq |
| DocDigital | `integracion-docdigital.md`; ADR DocDigital; condicionada a X-72 |
| FirmaGob | `estandar-firma-electronica.md` |
| ClaveÚnica | ADR DocDigital; prototipo `sgm-prototipos/auth/` |
| SII | planes Contabilidad; SOLPED / precios |
| DIPRES | plan RRHH (informes); plan Presupuestos |
| CGR | planes Contabilidad/Presupuestos; toma de razón en Adq |
| SINIM | plan Contabilidad; Nota-sobre-rentas |
| TGR | plan Tesorería (FCM / Formulario 10) |
| Previred | plan / modelos Odoo RRHH |
| SIAPER | plan RRHH (R-2) |
| PISEE | `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md` |
| NTDEE | mismos |
| SEM (feed externo de caja; as-is Odoo) | `tesoreria/plan-de-trabajo-tesoreria.md`; `tesoreria/modelos-odoo.md`; hallazgo seguridad `POST /api/sem/data` |
| FCM | plan Tesorería |

---

## 2. Inventario por categoría

### 2.1 Planes de trabajo

**Qué pregunta responde en la licitación:** ¿Qué falta planificar y en qué orden, módulo a módulo, antes de poder especificar o licitar?

| Ruta | Título (H1) | Versión / estado | Líneas | H2 | D-n | Macros | Pendientes (únicos en archivo) |
|---|---|---|---:|---:|---:|---|---|
| `sgm-docs/plan-general.md` | Plan de trabajo general — Corpus SGM | v0.2 / consolidación B0 — no validado con DM | 299 | 11 | 11 DC | — | P18 C12 T3 R5 A5 X23 |
| `sgm-docs/modulos/presupuestos/plan-de-trabajo_presupuestos.md` | Plan de trabajo — Módulo Presupuestos | 0.17 / no validado con DM | ~1732 | 13 | 4 | — | P31 (+menciones C/R/X) |
| `sgm-docs/modulos/contabilidad/plan-de-trabajo-contabilidad.md` | Plan de trabajo — Módulo Contabilidad | 0.6 / no validado con DM | 438 | 11 | 5 | MC-1…7 | C18 |
| `sgm-docs/modulos/tesoreria/plan-de-trabajo-tesoreria.md` | Plan de trabajo — Módulo Tesorería | 0.3 / no validado con DM | 393 | 11 | 6 | MT-1…7 | T14 |
| `sgm-docs/modulos/rrhh/plan-de-trabajo-rrhh.md` | Plan de trabajo — Módulo RRHH y Remuneraciones | 0.3 / no validado con DM | 439 | 11 | 6 | MR-1…7 | R14 |

Propósito literal (plan-general): «Este documento **gobierna el conjunto** del corpus de planificación y especificación SGM…».

Los cuatro planes de módulo se autodeclaran «propuesta de plan, no validada con DM».

### 2.2 Especificaciones de módulo — Adquisiciones

**Qué pregunta responde:** ¿Cómo debe comportarse el ciclo de compra (SOLPED→pago) en las cuatro modalidades, a nivel de ficha, contrato API y entidades?

| Ruta | H1 | Líneas | H2 | Estado declarado |
|---|---|---:|---:|---|
| `sgm-docs/modulos/adquisiciones/overview.md` | Módulo: Adquisiciones | 64 | 12 | Índice de modalidades |
| `sgm-docs/modulos/adquisiciones/contracts.md` | Contrato del módulo: Adquisiciones | 855 | 6 | borrador funcional |
| `sgm-docs/modulos/adquisiciones/analitica.md` | Capa analítica… | 160 | 10 | borrador |
| `sgm-docs/modulos/adquisiciones/brechas-etapa3-modalidades.md` | Brechas de la etapa 3… | 68 | 6 | estado post-llenado |
| `sgm-docs/modulos/adquisiciones/comparativa-odoo-vs-nuevo.md` | Comparativa Adquisiciones: Odoo vs arquitectura nueva | 240 | 7 | — |
| `sgm-docs/modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md` | 3. Resolución de Compra — Compra Ágil | 249 | 8 | — |
| `sgm-docs/modulos/adquisiciones/2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` | 3. Resolución de Compra — Convenio Marco | 353 | 10 | — |
| `sgm-docs/modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md` | 3. Resolución de Compra — Licitación Pública | 395 | 16 | — |
| `sgm-docs/modulos/adquisiciones/4. trato-directo/3-resolucion-compra.md` | 3. Resolución de Compra — Trato Directo | 199 | 6 | — |
| `sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md` | 1. SOLPED | 394 | 9 | — |
| `sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md` | 2. Modalidad de Compra | 206 | 5 | — |
| `sgm-docs/modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md` | 4. Recepción Conforme | 214 | 7 | — |
| `sgm-docs/modulos/adquisiciones/procesos-transversales/5-pago.md` | 5. Pago | 175 | 6 | — |

(Overviews de modalidad, `0-consulta-expedientes.md`, catálogo de firmables del módulo y resto: tabla §2.11.)

Propósito overview Adq: «Todo el ciclo de compras públicas municipales, desde la solicitud interna (SOLPED) hasta el pago al proveedor, en sus 4 modalidades según la Ley 19.886».

### 2.3 Especificaciones transversales / plataforma / arquitectura

**Qué pregunta responde:** ¿Qué servicios compartidos, seguridad, API e integraciones debe ofrecer la plataforma con independencia del módulo?

Incluye: `arquitectura/especificacion/*` (12, incluido `estandar-pruebas.md` e `integraciones-terceros.md`), `plataforma/*` sustantivo (5), `modelo-datos/entidades-*.md` (2).

Documentos con más líneas: `estandares-api.md` (328), `plataforma-core.md` (270), `estandar-pruebas.md` (273), `entidades-core.md` (629), `entidades-plataforma.md` (443), `plataforma/contracts.md` (381), `seguridad.md` (162), `integracion-docdigital.md` (181), `integraciones-terceros.md` (registro canónico §1.4).

Estados frecuentes en cabecera: «borrador», «borrador condicionado a X-72», «borrador X-24», «borrador X-06». `estandar-pruebas.md`: borrador julio 2026, no validado con DM.

### 2.4 Decisiones de arquitectura (ADR y afines)

**Qué pregunta responde:** ¿Qué quedó fijado (o propuesto) como decisión de stack, patrón o alcance, y con qué condición?

| Ruta | H1 | Estado | Fecha | Líneas |
|---|---|---|---|---:|
| `sgm-docs/arquitectura/decisiones/2026-07-eliminacion-odoo.md` | Eliminación de Odoo como base del stack SGM | Aceptada | Julio 2026 | 50 |
| `sgm-docs/arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md` | DocDigital como servicio transversal… | Aceptada (cond. X-72 bloqueante) | Julio 2026 | 59 |
| `sgm-docs/arquitectura/decisiones/2026-07-ventana-mutabilidad.md` | Ventana de mutabilidad | Aceptada | Julio 2026 | 40 |
| `sgm-docs/arquitectura/decisiones/2026-07-atomicidad-efectos-borde.md` | Atomicidad de efectos de borde… | Aceptada como problema canónico (mecanismo abierto C-1) | Julio 2026 | 39 |
| `sgm-docs/arquitectura/decisiones/2026-07-patrones-transversales-corpus.md` | Patrones transversales del corpus | Aceptada | Julio 2026 | 97 |
| `sgm-docs/arquitectura/decisiones/decisiones-macro-stack.md` | Decisiones macro: elección de stack… | borrador | — | 136 |
| `sgm-docs/arquitectura/decisiones/nodo-integracion-subdere.md` | Nodo de integración SUBDERE… | borrador | julio 2026 | 206 |
| `sgm-docs/arquitectura/decisiones/brechas-estandarizacion-ntdee-pisee.md` | Brechas NTDEE / PISEE | propuesta / borrador | julio 2026 | 222 |
| `sgm-docs/arquitectura/decisiones/pendientes.md` | Pendientes de arquitectura — registro único | registro X-01…X-93 | — | 103 |
| `sgm-docs/arquitectura/decisiones/Nota-sobre-rentas.md` | Nota de decisión — Módulo Rentas… | dirigida a jefatura | julio 2026 | 126 |

### 2.5 Inventarios del sistema anterior (Odoo)

**Qué pregunta responde:** ¿Qué hay hoy en el as-is (export BD y/o lectura de modelos) para contrastar el diseño nuevo?

**A) `bd-export-odoo/`** — 14 archivos, 1072 líneas. Índice: `bd-sgm.md` (documentación técnica BD PostgreSQL / Odoo 17 Community, ResIT). **55** modelos con encabezado `####`. Módulos con diccionario: account-gov-cl (13), presupuesto-gov-cl (11), tupa (9), account-gov-adquisiciones (5), tesoreria-gov-cl (4), l10n-cl-hr (4), l10n-cl-viatic (3), employee-portal (2), l10n-cl-holidays-attendance (2), l10n-cl-hr-merit-demerit (2). El índice cita además módulos sin diccionario en esta carpeta: L10N_CL_HR_SCALE, INVENTORY_GOV_CL, AUTOSERVICIO_GOV_CL.

**B) `modelos-odoo.md` por módulo** — Contabilidad 691 líneas / 42 modelos; Tesorería 460 / 17; Presupuestos 452 / 13; RRHH 435 / 7. Los planes advierten contrastar el **ORM**, no solo el export BD.

**C) Comparativa Adq** — `comparativa-odoo-vs-nuevo.md` (240 líneas).

### 2.6 Notas a jefatura / debates de alcance

**Qué pregunta responde:** ¿Qué decisiones de alcance o de política no puede cerrar solo el equipo técnico?

| Ruta | Rol |
|---|---|
| `Nota-sobre-rentas.md` | ¿Incluir Rentas en el alcance de licitación sin levantamiento Magenta ni as-is Odoo? |
| `nodo-integracion-subdere.md` | Relación del nodo de integración SUBDERE con la licitación (X-82…X-85) |
| `decisiones-macro-stack.md` | Elección de stack (borrador) |
| `brechas-estandarizacion-ntdee-pisee.md` | Brechas de estandarización estatal |
| Filas X-44, X-72 en `pendientes.md` | Alcance inventario/AF; mecanismo DocDigital |

### 2.7 Instrucciones y material de método / licitación

**Qué pregunta responde:** ¿Con qué plantilla y reglas se escribe el corpus, y qué se exigirá al adjudicatario?

| Ruta | H1 | Líneas | Estado |
|---|---|---:|---|
| `sgm-docs/arquitectura/instrucciones/plantilla-maestra-sgm.md` | Plantilla Maestra de Documentación — SGM | 389 | norma de documentación |
| `patron-formularios-secciones.md` | Patrón: secciones… | 101 | norma de prototipos |
| `patron-edicion-anclas-firma.md` | Patrón: edición de anclas… | 101 | norma de prototipos |
| `patron-vista-expediente.md` | Patrón: vista de expediente… | 88 | propuesta a validar |
| `arquitectura/licitacion/alcance-minimo-modulos-adyacentes.md` | Alcance mínimo de módulos adyacentes | 230 | v0.2 / propuesta de alcance, no validada con DM; X-78…X-81 |
| `arquitectura/licitacion/entregable-licitacion.md` | Entregable exigible de licitación… | 441 | borrador v2; 7 decisiones D-01…D-07 |
| `principios-no-negociables.md` | Principios de Arquitectura No Negociables | 66 | — |
| `sandbox-desarrolladores.md` | Sandbox de desarrolladores SGM | 123 | borrador; cierra detalle X-16 |

### 2.8 Wireframes

**Qué pregunta responde:** ¿Qué pantallas se describieron para validar UX antes o junto al prototipo HTML?

| Carpeta | Archivos | Líneas |
|---|---:|---:|
| Adq transversales + Compra Ágil + config | 23 | 1553 |
| Adq Convenio Marco | 8 | 478 |
| Adq Licitación Pública | 14 | 905 |
| Adq Trato Directo | 4 | 226 |
| Plataforma municipal | 9 | 593 |
| Plataforma shell | 5 | 317 |
| Plataforma SUBDERE | 7 | 404 |
| **Total contenido** | **70** | **4476** |

Más 2 README de índice en carpetas wireframes (92 + 15 líneas), no contados en las 70.

### 2.9 Prototipos y material visual

**Qué pregunta responde:** ¿Qué se puede navegar hoy como demo HTML alineada a wireframes/contratos?

| Ítem | Cantidad |
|---|---:|
| HTML | 73 (9800 líneas) |
| JS | 27 |
| CSS | 6 |
| JSON | 2 |
| `MANIFEST.md` | 1 (222 líneas) — mapeo stepId ↔ wireframe ↔ HTML ↔ API |
| `README.md` prototipos | 1 (114 líneas) |
| Diagrama drawio | 1 — `sgm-docs/modulos/adquisiciones/diagramas/compra-agil.drawio` |

HTML por área: Compra Ágil 6; Convenio Marco 8; Licitación Pública 14; Trato Directo 4; procesos transversales 12; configuraciones 3; hubs/expediente/listado Adq 5; plataforma municipal 9; shell 3; SUBDERE 7; auth 1; home + index raíz.

### 2.10 Datos y fuentes (no-md de producto)

| Tipo | Ruta / conteo |
|---|---|
| OpenAPI Adquisiciones | `adquisiciones.openapi.yaml` (1365 líneas) + fragmentos por modalidad/transversales + `expediente.yaml` + `comunes.yaml` |
| Fixtures | 5 expedientes `ADQ-2026-*.yaml` + `escenarios-transaccionales.yaml` + `catalogo.md` |
| QA | `sgm-docs/modulos/adquisiciones/qa/ficha-qa-adquisiciones.csv` |
| CI | `.gitlab-ci.yml`; `.github/workflows/pages-prototipos.yml` |
| Reglas agente | `.cursor/rules/*.mdc` (3) |

### 2.11 Tabla de las 83 especificaciones sustantivas

| Ruta | H1 | Líneas | H2 | Versión/estado (cabecera) |
|---|---|---:|---:|---|
| ``bd-export-odoo/bd-sgm.md`` | Documentación Técnica - Sistema de Gestión Municipal (SGM) | 61 | 3 | 1.0 - Abril 2025 |
| ``bd-export-odoo/clasificacion-tablas.md`` | Documentación Técnica BD - SGM | 40 | 1 |  |
| ``bd-export-odoo/dependencias.md`` | Documentación Técnica BD - SGM | 28 | 1 |  |
| ``bd-export-odoo/modulos/account-gov-adquisiciones.md`` | Documentación Técnica BD - SGM | 89 | 1 |  |
| ``bd-export-odoo/modulos/account-gov-cl.md`` | Documentación Técnica BD - SGM | 198 | 1 |  |
| ``bd-export-odoo/modulos/employee-portal.md`` | Documentación Técnica BD - SGM | 38 | 1 |  |
| ``bd-export-odoo/modulos/l10n-cl-holidays-attendance.md`` | Documentación Técnica BD - SGM | 61 | 1 |  |
| ``bd-export-odoo/modulos/l10n-cl-hr.md`` | Documentación Técnica BD - SGM | 67 | 1 |  |
| ``bd-export-odoo/modulos/l10n-cl-hr-merit-demerit.md`` | Documentación Técnica BD - SGM | 39 | 1 |  |
| ``bd-export-odoo/modulos/l10n-cl-viatic.md`` | Documentación Técnica BD - SGM | 47 | 1 |  |
| ``bd-export-odoo/modulos/presupuesto-gov-cl.md`` | Documentación Técnica BD - SGM | 167 | 1 |  |
| ``bd-export-odoo/modulos/tesoreria-gov-cl.md`` | Documentación Técnica BD - SGM | 76 | 1 |  |
| ``bd-export-odoo/modulos/tupa.md`` | Documentación Técnica BD - SGM | 138 | 1 |  |
| ``bd-export-odoo/notas-tecnicas.md`` | Documentación Técnica BD - SGM | 23 | 1 |  |
| ``sgm-docs/arquitectura/decisiones/2026-07-atomicidad-efectos-borde.md`` | 2026-07 — Atomicidad de efectos de borde entre módulos | 39 | 4 | Aceptada como |
| ``sgm-docs/arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`` | 2026-07 — DocDigital como servicio transversal de tramitación documental | 59 | 6 | Aceptada (condicionada a verificación del mecanismo de integración — |
| ``sgm-docs/arquitectura/decisiones/2026-07-eliminacion-odoo.md`` | 2026-07 — Eliminación de Odoo como base del stack SGM | 50 | 4 | Aceptada |
| ``sgm-docs/arquitectura/decisiones/2026-07-patrones-transversales-corpus.md`` | 2026-07 — Patrones transversales del corpus (diagnóstico y método) | 97 | 7 | Aceptada |
| ``sgm-docs/arquitectura/decisiones/2026-07-ventana-mutabilidad.md`` | 2026-07 — Ventana de mutabilidad (patrón transversal) | 40 | 4 | Aceptada |
| ``sgm-docs/arquitectura/decisiones/brechas-estandarizacion-ntdee-pisee.md`` | Brechas y propuestas de estandarización — NTDEE / PISEE | 222 | 9 |  |
| ``sgm-docs/arquitectura/decisiones/decisiones-macro-stack.md`` | Decisiones macro: elección de stack para el nuevo SGM | 136 | 10 |  |
| ``sgm-docs/arquitectura/decisiones/nodo-integracion-subdere.md`` | Nodo de integración SUBDERE y su relación con la licitación SGM | 206 | 11 |  |
| ``sgm-docs/arquitectura/decisiones/Nota-sobre-rentas.md`` | Nota de decisión — Módulo Rentas en el alcance de SGM | 126 | 11 |  |
| ``sgm-docs/arquitectura/decisiones/pendientes.md`` | Pendientes de arquitectura — registro único | 103 | 0 |  |
| ``sgm-docs/arquitectura/especificacion/catalogo-documentos-firmables.md`` | Catálogo de documentos firmables | 71 | 4 | v1 — poblado con Adquisiciones; otros módulos sin entradas aún.   > |
| ``sgm-docs/arquitectura/especificacion/catalogo-roles.md`` | Catálogo de roles (borrador X-24) | 212 | 9 | borrador para discusión interna con el equipo / DM.   > |
| ``sgm-docs/arquitectura/especificacion/contrato-api-first.md`` | Contrato API-first: punto de partida | 95 | 8 |  |
| ``sgm-docs/arquitectura/especificacion/estandares-api.md`` | Estándares del contrato API | 328 | 15 |  |
| ``sgm-docs/arquitectura/especificacion/estandar-firma-electronica.md`` | Estándar de Firma Electrónica — SGM | 149 | 9 |  |
| ``sgm-docs/arquitectura/especificacion/estandar-pruebas.md`` | Estándar de pruebas y verificación — SGM | 273 | 12 | borrador (julio 2026). Propuesta de estándar, no validada con DM |
| ``sgm-docs/arquitectura/especificacion/integracion-docdigital.md`` | Integración SGM ↔ DocDigital | 181 | 8 |  |
| ``sgm-docs/arquitectura/especificacion/integracion-mercado-publico.md`` | Integración SGM ↔ Mercado Público | 58 | 7 |  |
| ``sgm-docs/arquitectura/especificacion/musts-arquitectura.md`` | Musts de arquitectura: escalabilidad y requisitos no funcionales veri... | 136 | 13 |  |
| ``sgm-docs/arquitectura/especificacion/plataforma-core.md`` | Plataforma core: servicios transversales del SGM | 270 | 14 |  |
| ``sgm-docs/arquitectura/especificacion/seguridad.md`` | Especificaciones de seguridad — SGM | 162 | 15 |  |
| ``sgm-docs/arquitectura/instrucciones/patron-edicion-anclas-firma.md`` | Patrón: edición de anclas de firma en plantillas | 101 | 6 | Norma de prototipos — exigible en pantallas de configuración de plantillas/anclas.  ---... |
| ``sgm-docs/arquitectura/instrucciones/patron-formularios-secciones.md`` | Patrón: secciones y subtítulos en formularios | 101 | 9 | Norma de prototipos — exigible en toda pantalla `form-card` nueva o existente.  ## Prob... |
| ``sgm-docs/arquitectura/instrucciones/patron-vista-expediente.md`` | Patrón: vista de expediente detallada | 88 | 5 | Propuesta a validar con el equipo (junto con el shell de expediente del prototipo).  ##... |
| ``sgm-docs/arquitectura/instrucciones/plantilla-maestra-sgm.md`` | Plantilla Maestra de Documentación — SGM | 389 | 9 |  |
| ``sgm-docs/arquitectura/licitacion/alcance-minimo-modulos-adyacentes.md`` | Alcance mínimo de módulos adyacentes | 230 | 10 | 0.2 (borrador para revisión interna) / propuesta de alcance, no validada con DM |
| ``sgm-docs/arquitectura/licitacion/entregable-licitacion.md`` | Entregable exigible de licitación: API, contratos y sandbox | 441 | 14 |  |
| ``sgm-docs/arquitectura/licitacion/principios-no-negociables.md`` | Principios de Arquitectura No Negociables | 66 | 9 |  |
| ``sgm-docs/arquitectura/licitacion/sandbox-desarrolladores.md`` | Sandbox de desarrolladores SGM | 123 | 9 |  |
| ``sgm-docs/modelo-datos/entidades-core.md`` | Entidades Core del Modelo de Datos | 629 | 3 |  |
| ``sgm-docs/modelo-datos/entidades-plataforma.md`` | Entidades de plataforma | 443 | 7 |  |
| ``sgm-docs/modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md`` | 3. Resolución de Compra — Compra Ágil | 249 | 8 |  |
| ``sgm-docs/modulos/adquisiciones/1. compra-agil/overview.md`` | Macroproceso: Compra Ágil | 108 | 6 |  |
| ``sgm-docs/modulos/adquisiciones/2. convenio-marco/3-resolucion-compra-convenio-marco v2.md`` | 3. Resolución de Compra — Convenio Marco | 353 | 10 |  |
| ``sgm-docs/modulos/adquisiciones/2. convenio-marco/overview.md`` | Macroproceso: Convenio Marco | 25 | 1 |  |
| ``sgm-docs/modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md`` | 3. Resolución de Compra — Licitación Pública | 395 | 16 |  |
| ``sgm-docs/modulos/adquisiciones/3. licitacion-publica/overview.md`` | Macroproceso: Licitación Pública | 24 | 1 |  |
| ``sgm-docs/modulos/adquisiciones/4. trato-directo/3-resolucion-compra.md`` | 3. Resolución de Compra — Trato Directo | 199 | 6 |  |
| ``sgm-docs/modulos/adquisiciones/4. trato-directo/overview.md`` | Macroproceso: Trato Directo | 24 | 1 |  |
| ``sgm-docs/modulos/adquisiciones/analitica.md`` | Capa analítica de Adquisiciones: catálogo semántico y contrato de con... | 160 | 10 |  |
| ``sgm-docs/modulos/adquisiciones/brechas-etapa3-modalidades.md`` | Brechas de la etapa 3 (Resolución de Compra) — estado post-llenado | 68 | 6 |  |
| ``sgm-docs/modulos/adquisiciones/catalogo-documentos-firmables.md`` | Catálogo de documentos firmables — Adquisiciones | 39 | 2 |  |
| ``sgm-docs/modulos/adquisiciones/comparativa-odoo-vs-nuevo.md`` | Comparativa Adquisiciones: Odoo vs arquitectura nueva | 240 | 7 |  |
| ``sgm-docs/modulos/adquisiciones/contracts.md`` | Contrato del módulo: Adquisiciones | 855 | 6 |  |
| ``sgm-docs/modulos/adquisiciones/overview.md`` | Módulo: Adquisiciones | 64 | 12 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/0-consulta-expedientes.md`` | 0. Consulta y alta de expedientes | 150 | 4 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md`` | 1. SOLPED | 394 | 9 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md`` | 2. Modalidad de Compra | 206 | 5 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md`` | 4. Recepción Conforme | 214 | 7 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/5-pago.md`` | 5. Pago | 175 | 6 |  |
| ``sgm-docs/modulos/adquisiciones/procesos-transversales/overview.md`` | Procesos transversales de Adquisiciones | 27 | 3 |  |
| ``sgm-docs/modulos/contabilidad/modelos-odoo.md`` | Modelos Odoo — Contabilidad | 691 | 16 |  |
| ``sgm-docs/modulos/contabilidad/overview.md`` | Módulo: Contabilidad | 16 | 2 |  |
| ``sgm-docs/modulos/contabilidad/plan-de-trabajo-contabilidad.md`` | Plan de trabajo — Módulo Contabilidad | 438 | 11 | 0.6 (borrador para revisión interna) propuesta de plan, no validada con DM |
| ``sgm-docs/modulos/presupuestos/modelos-odoo.md`` | Modelos Odoo — Presupuestos | 452 | 12 |  |
| ``sgm-docs/modulos/presupuestos/overview.md`` | Módulo: Presupuestos | 15 | 2 |  |
| ``sgm-docs/modulos/presupuestos/plan-de-trabajo_presupuestos.md`` | Plan de trabajo — Módulo Presupuestos | ~1732 | 13 | 0.17 (borrador; Anexo B; P-1…P-31) propuesta de plan, no validado con DM |
| ``sgm-docs/modulos/rrhh/modelos-odoo.md`` | Modelos Odoo — RRHH / Remuneraciones | 435 | 15 |  |
| ``sgm-docs/modulos/rrhh/overview.md`` | Módulo: RRHH / Remuneraciones | 17 | 2 |  |
| ``sgm-docs/modulos/rrhh/plan-de-trabajo-rrhh.md`` | Plan de trabajo — Módulo RRHH y Remuneraciones | 439 | 11 | 0.3 (borrador para revisión interna) propuesta de plan, no validada con DM |
| ``sgm-docs/modulos/tesoreria/modelos-odoo.md`` | Modelos Odoo — Tesorería | 460 | 15 |  |
| ``sgm-docs/modulos/tesoreria/overview.md`` | Módulo: Tesorería | 20 | 3 |  |
| ``sgm-docs/modulos/tesoreria/plan-de-trabajo-tesoreria.md`` | Plan de trabajo — Módulo Tesorería | 393 | 11 | 0.3 (borrador para revisión interna) propuesta de plan, no validada con DM |
| ``sgm-docs/plan-general.md`` | Plan de trabajo general — Corpus SGM | 299 | 11 | 0.2 (borrador para revisión interna) consolidación B0 — no validado con DM |
| ``sgm-docs/plataforma/contracts.md`` | Contrato del core de plataforma | 381 | 5 |  |
| ``sgm-docs/plataforma/mensajeria/overview.md`` | Mensajería in-app (contextual) | 82 | 5 |  |
| ``sgm-docs/plataforma/notificaciones/matriz-evento-canal.md`` | Matriz evento → canal → destinatario (borrador X-06) | 98 | 6 | borrador — cierra |
| ``sgm-docs/plataforma/notificaciones/overview.md`` | Notificaciones (C6) — visión de producto | 135 | 8 |  |
| ``sgm-docs/plataforma/overview.md`` | Core de plataforma | 78 | 8 |  |

### 2.12 Wireframes de contenido (70)

| Ruta | H1 | Líneas | H2 |
|---|---|---:|---:|
| ``sgm-docs/modulos/adquisiciones/wireframes/00-hub-modulo.md`` | Wireframe: Hub del módulo Adquisiciones | 39 | 2 |
| ``sgm-docs/modulos/adquisiciones/wireframes/01-listado-expedientes.md`` | Wireframe: Listado de expedientes de compra | 99 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/10-verificacion-previa.md`` | Wireframe: Verificación previa (Inventario / catálogo CM) | 70 | 5 |
| ``sgm-docs/modulos/adquisiciones/wireframes/11-creacion-solped.md`` | Wireframe: Creación de SOLPED | 163 | 7 |
| ``sgm-docs/modulos/adquisiciones/wireframes/12-visto-bueno-jefatura.md`` | Wireframe: Visto bueno de jefatura | 91 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/13-verificacion-disponibilidad.md`` | Wireframe: Verificación de disponibilidad presupuestaria | 68 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/14-emision-cdp.md`` | Wireframe: Emisión de CDP firmado | 87 | 7 |
| ``sgm-docs/modulos/adquisiciones/wireframes/15-preobligacion.md`` | Wireframe: Generación de preobligación | 60 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/16-solicitar-financiamiento.md`` | Wireframe: Solicitar financiamiento a DAF | 52 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/21-ratificacion-modalidad.md`` | Wireframe: Ratificación o selección de modalidad | 100 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/22-aprobacion-jefatura.md`` | Wireframe: Aprobación de modalidad por jefatura | 68 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/23-vinculacion-mp.md`` | Wireframe: Vinculación del proceso en Mercado Público | 78 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/31-periodo-cotizacion.md`` | Wireframe: Período de cotización | 53 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/32-cierre-seleccion-oferta.md`` | Wireframe: Cierre y selección de oferta | 56 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/33-emision-oc.md`` | Wireframe: Emisión de la Orden de Compra | 60 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/34-aceptacion-oc.md`` | Wireframe: Aceptación de la OC (perfeccionamiento del vín... | 57 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/35-rechazo-oc.md`` | Wireframe: Rechazo de la OC | 58 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/36-proceso-desierto-fallido.md`` | Wireframe: Proceso desierto o fallido | 56 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/41-recepcion-conforme.md`` | Wireframe: Registro recepción conforme | 66 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/51-cruce-tres-vias.md`` | Wireframe: Cruce de 3 vías (Match) | 68 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/90-configuraciones.md`` | Wireframe: Configuraciones del módulo | 26 | 2 |
| ``sgm-docs/modulos/adquisiciones/wireframes/91-config-firmas-lista.md`` | Wireframe: Lista de documentos firmables | 29 | 2 |
| ``sgm-docs/modulos/adquisiciones/wireframes/92-config-firmas-editor-anclas.md`` | Wireframe: Editor de anclas de firma (CDP) | 49 | 4 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/31-evaluacion-umbral.md`` | Wireframe: Evaluación de umbral y determinación de ruta | 53 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/32-compra-directa-catalogo.md`` | Wireframe: Compra Directa por Catálogo | 63 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/33-intencion-gran-compra.md`` | Wireframe: Publicación de Intención de Compra / Gran Compra | 65 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/34-periodo-competencia.md`` | Wireframe: Período de competencia Gran Compra | 58 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/35-seleccion-oferta.md`` | Wireframe: Selección de oferta Gran Compra | 58 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/36-gran-compra-desierta.md`` | Wireframe: Gran Compra desierta | 56 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/37-aceptacion-oc.md`` | Wireframe: Emisión y aceptación de la OC (hito contable) | 64 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/38-rechazo-oc.md`` | Wireframe: Rechazo de la OC | 61 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/310-resolucion-adjudicacion.md`` | Wireframe: Resolución de adjudicación (o deserción / inad... | 63 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/311-toma-razon-adjudicacion.md`` | Wireframe: Toma de Razón de la adjudicación (Contraloría) | 59 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/312-garantia-fiel-cumplimiento.md`` | Wireframe: Garantía de Fiel Cumplimiento | 58 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/313-contrato.md`` | Wireframe: Contrato | 66 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/314-aceptacion-oc.md`` | Wireframe: Emisión y aceptación de la OC | 61 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/31-elaboracion-bases.md`` | Wireframe: Elaboración de bases administrativas y técnicas | 75 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/32-revision-juridica-bases.md`` | Wireframe: Revisión jurídica de bases | 59 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/33-acto-aprueba-bases.md`` | Wireframe: Acto administrativo que aprueba las bases | 62 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/34-toma-razon-bases.md`` | Wireframe: Toma de Razón de las bases (Contraloría) | 60 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/35-publicacion-vinculacion-mp.md`` | Wireframe: Publicación en Mercado Público y vinculación | 60 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/36-foro-aclaraciones.md`` | Wireframe: Foro de preguntas y aclaraciones | 59 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/37-garantia-seriedad.md`` | Wireframe: Recepción y custodia de Garantía de Seriedad d... | 63 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/38-apertura-electronica.md`` | Wireframe: Acto de apertura electrónica | 53 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/39-comision-evaluadora.md`` | Wireframe: Comisión evaluadora y acta de evaluación | 107 | 8 |
| ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/31-toma-razon.md`` | Wireframe: Toma de Razón de la Resolución Fundada | 59 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/32-publicacion-vinculacion-mp.md`` | Wireframe: Publicación en Mercado Público y vinculación | 56 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/33-emision-aceptacion-oc.md`` | Wireframe: Emisión de OC y aceptación del proveedor | 56 | 6 |
| ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/34-rechazo-oc.md`` | Wireframe: Rechazo de la OC | 55 | 6 |
| ``sgm-docs/plataforma/wireframes/municipal/01-usuarios.md`` | Wireframe: Usuarios del municipio | 61 | 6 |
| ``sgm-docs/plataforma/wireframes/municipal/02-roles-unidades.md`` | Wireframe: Roles y unidades | 146 | 9 |
| ``sgm-docs/plataforma/wireframes/municipal/03-subrogancias.md`` | Wireframe: Subrogancias | 51 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/04-excepciones-sod.md`` | Wireframe: Excepciones SoD | 54 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/05-parametros-operativos.md`` | Wireframe: Parámetros operativos | 51 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/06-integraciones-municipio.md`` | Wireframe: Integraciones del municipio | 54 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/07-almacenamiento-documentos.md`` | Wireframe: Almacenamiento de documentos | 61 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/08-recertificacion-accesos.md`` | Wireframe: Recertificación de accesos | 52 | 5 |
| ``sgm-docs/plataforma/wireframes/municipal/09-preferencias-notificacion.md`` | Wireframe: Preferencias de notificación | 63 | 5 |
| ``sgm-docs/plataforma/wireframes/shell/01-campanita.md`` | Wireframe: Campanita (shell) | 63 | 5 |
| ``sgm-docs/plataforma/wireframes/shell/02-bandeja.md`` | Wireframe: Bandeja de notificaciones | 75 | 6 |
| ``sgm-docs/plataforma/wireframes/shell/03-mis-datos.md`` | Wireframe: Mis datos | 71 | 6 |
| ``sgm-docs/plataforma/wireframes/shell/04-chat-contextual.md`` | Wireframe: Chat contextual (shell) | 74 | 6 |
| ``sgm-docs/plataforma/wireframes/shell/05-chats.md`` | Wireframe: Listado de chats (shell) | 34 | 3 |
| ``sgm-docs/plataforma/wireframes/subdere/01-gestion-tenants.md`` | Wireframe: Gestión de tenants | 67 | 6 |
| ``sgm-docs/plataforma/wireframes/subdere/02-parametros-normativos.md`` | Wireframe: Parámetros normativos | 68 | 6 |
| ``sgm-docs/plataforma/wireframes/subdere/03-clientes-m2m.md`` | Wireframe: Clientes M2M y convenios | 64 | 6 |
| ``sgm-docs/plataforma/wireframes/subdere/04-integraciones-plataforma.md`` | Wireframe: Integraciones de plataforma | 53 | 5 |
| ``sgm-docs/plataforma/wireframes/subdere/05-provision-almacenamiento.md`` | Wireframe: Provisión de almacenamiento (buckets platform) | 49 | 5 |
| ``sgm-docs/plataforma/wireframes/subdere/06-monitoreo-tenant.md`` | Wireframe: Monitoreo por tenant | 50 | 5 |
| ``sgm-docs/plataforma/wireframes/subdere/07-auditoria-plataforma.md`` | Wireframe: Auditoría de plataforma | 53 | 5 |

---

## 3. Cobertura por módulo

Leyenda: **existe** = hay archivo(s) de ese tipo; **parcial** = hay material pero el propio corpus lo declara incompleto/borrador/sin fichas de proceso nuevas; **no existe** = no hay archivo.

| Tipo de artefacto | Adquisiciones | Presupuestos | Contabilidad | Tesorería | RRHH | Rentas | Transversal / plataforma |
|---|---|---|---|---|---|---|---|
| Plan de trabajo | no existe (spec directa; plan-general la referencia) | existe `modulos/presupuestos/plan-de-trabajo_presupuestos.md` | existe `…/plan-de-trabajo-contabilidad.md` | existe `…/plan-de-trabajo-tesoreria.md` | existe `…/plan-de-trabajo-rrhh.md` | no existe | existe `plan-general.md` |
| Overview de módulo | existe | existe (15 líneas) | existe (16) | existe (20) | existe (17) | no existe | existe `plataforma/overview.md` |
| Fichas de proceso / modalidad | existe (CA/CM/LP/TD + transversales) | no existe | no existe | no existe | no existe | no existe | N/A |
| Contrato API / `contracts.md` | existe (855 líneas) | no existe | no existe | no existe | no existe | no existe | existe `plataforma/contracts.md` |
| OpenAPI YAML | existe | no existe | no existe | no existe | no existe | no existe | parcial `comunes.yaml` |
| Modelo datos canónico | parcial (entidades en core + ficha) | parcial (referencias en plan) | parcial | parcial | parcial | no existe | existe `entidades-core.md` + `entidades-plataforma.md` |
| Inventario Odoo `modelos-odoo.md` | parcial (vía comparativa + bd-export adq) | existe | existe | existe | existe | no existe (Nota: ausente en Odoo) | bd-export transversal |
| Wireframes `.md` | existe (49) | no existe | no existe | no existe | no existe | no existe | existe (21) |
| Prototipos HTML | existe (50 bajo `modulos/adquisiciones`) | no existe | no existe | no existe | no existe | no existe | existe (municipal/shell/subdere) |
| ADR / decisión de alcance | menciones en ADRs transversales | vía plan + plan-general | C-1 / ADR atomicidad | D-6 DocDigital en plan | R-2 SIAPER | existe solo `Nota-sobre-rentas.md` | 5 ADR + decisiones |
| Analítica / QA / fixtures | existe | no existe | no existe | no existe | no existe | no existe | no existe |
| Documento `alcance-minimo-modulos-adyacentes.md` | — | — | — | — | — | — | existe `arquitectura/licitacion/alcance-minimo-modulos-adyacentes.md` (v0.2; X-78…X-81) |

---

## 4. Trazabilidad hacia el levantamiento (Magenta)

Fuente citada en planes: *Informe 2 — Anexo procesos, Magenta / C Amable para SUBDERE*.

### 4.1 Procesos Magenta listados en el corpus

| Módulo | N | Procesos (números) | Documento |
|---|---:|---|---|
| Presupuestos | 2 | 26 Elaboración; 27 Modificación | `presupuestos/plan-de-trabajo_presupuestos.md` |
| Contabilidad | 10 | 28…37 | `contabilidad/plan-de-trabajo-contabilidad.md` |
| Tesorería | 5 | 38…42 | `tesoreria/plan-de-trabajo-tesoreria.md` |
| RRHH | 18 | 1…18 | `rrhh/plan-de-trabajo-rrhh.md` |
| **Total listado** | **35** | | |
| Firma / Alcaldía | 1 ref. | proceso **25** («Alcaldía: Firmar») | ADR DocDigital; ficha LP; `integracion-docdigital.md` |
| Adquisiciones | 0 | La carpeta `modulos/adquisiciones/` **no** contiene la palabra «Magenta» | — |

### 4.2 Cubiertos por documento del repo vs no

- **Con plan que incorpora el proceso Magenta:** Pres 26–27; Cont 28–37; Tes 38–42; RRHH 1–18; proceso 25 referenciado en arquitectura/Adq.
- **Sin carpeta de módulo ni plan:** **Rentas** — `Nota-sobre-rentas.md`: «no aparece en el levantamiento de procesos de Magenta» y «no fue construido por el proveedor anterior».
- **Declarados no levantados / mal cubiertos por Magenta** (ejemplos del corpus, Presupuestos): ciclo CDP→devengo; Salud/Educación; Cementerio como entidad; reportes CGR/SINIM/BEP; programación de caja; presupuestos separados de servicios traspasados. Tesorería: caja chica, especies valoradas y SEM «no están levantadas como procesos» (provienen del as-is).

La tabla de `plan-general.md` §2 usa porcentajes aproximados de cobertura («~35–40 %» Presupuestos): este inventario **no** reproduce esa aproximación como cifra propia; remite al archivo fuente.

---

## 5. Hallazgos sobre el sistema anterior

| Hallazgo (síntesis factual del texto fuente) | Ruta |
|---|---|
| Diagnóstico Presupuestos contrastado con el ORM real; tablas «qué hace bien/mal» con evidencia en código | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` |
| Regla: contrastar ORM, no el export de BD | mismo |
| Contabilidad: diagnóstico contrastado con ORM y `modelos-odoo.md`; factoring/suspensión como expediente sin efecto de dominio | `modulos/contabilidad/plan-de-trabajo-contabilidad.md` |
| Tesorería: contraste ORM julio 2026; garantía sin cron; consolidación `action_done` sin asiento; API SEM `POST /api/sem/data`; conciliación auxiliar «entero comentado» | `modulos/tesoreria/plan-de-trabajo-tesoreria.md` |
| RRHH: contraste ORM; 13 addons; permisos = `hr.leave` (no `hr.holiday.request`); doble vía calidad jurídica; LRE solo wizard CSV | `modulos/rrhh/plan-de-trabajo-rrhh.md` |
| Adq: en Odoo, Presupuesto e Inventario/AF se materializan en el mismo commit de aprobación | `modulos/adquisiciones/comparativa-odoo-vs-nuevo.md` |
| Seguridad: endpoint `POST /api/sem/data` con `auth='none'` crea registros financieros | `arquitectura/especificacion/seguridad.md` |
| Export BD documenta 55 modelos en 10 diccionarios (Odoo 17 / PostgreSQL) | `bd-export-odoo/bd-sgm.md` + `modulos/*.md` |

---

## 6. Lo que el corpus declara como no resuelto

### 6.1 Etiquetados BLOQUEANTE / PRIORIDAD ALTA / estructurales

| ID | Etiqueta en fuente | Tema | Criterio de cierre (si el doc lo dice) | Perfil / dueño declarado |
|---|---|---|---|---|
| **X-72** | `[BLOQUEANTE]` en `pendientes.md` | Mecanismo DocDigital M2M vs solo web; condiciona C11 | Verificar existencia de interfaz; si no hay API, diseño de exportación/importación asistida (ADR + plan-general B1) | **Gobierno Digital** |
| **X-44** | `[PRIORIDAD ALTA]` | Alcance Bodega/Inventario/AF en licitación; default provisional (a) | Decisión de jefatura en bases (opciones a/b/c en plan-general §8) | **jefatura / decisión de bases** |
| **C-1** | «estructural» / «bloquea F4» en plan Contabilidad; ancla ADR atomicidad | Atomicidad de efectos de borde (devengo dual y manifestaciones M1–M3) | «mecanismo escrito» antes de bases (plan-general §8) | **Equipo interno (decisión arquitectónica)** — plan Cont.; plan-general: Arquitectura + DM |
| **T-1** | «estructural» / bloquea F3 | Contrato de entrada de órdenes de ingreso (giradores; SEM como referencia) | Especificar dos modos + inventariar giradores | **perfil no declarado** en el bloque PENDIENTE (T-12 asigna «Equipo + plataforma») |
| **R-2** | «bloqueante» en plan RRHH | SIAPER M2M vs carga manual; condiciona MR-6 | Verificar interfaz máquina a máquina | **perfil no declarado** en el marcador (análogo X-72) |

### 6.2 Otros pendientes de decisión humana (muestra con dueño en tabla de brechas)

De `brechas-etapa3-modalidades.md` §4:

| ID | Tema | Dueño en tabla |
|---|---|---|
| X-64 | Canal consulta CGR | Contraloría |
| X-65 | Aclaración → acto formal | jurídica |
| X-66 | Inhabilidades comisión LP | jurídica |
| X-67 | Firma contratista LP | DM / jurídica |
| X-68 | Límite reintentos CA/CM | DM |
| X-69 | Camino rechazo OC en TD | DM / división municipalidades |
| X-70 | Polling vs webhook MP | ChileCompra / plataforma |
| X-71 | Control bloqueante plazo 24 h TD | DM / jurídica |

Registro completo X-01…X-93: `sgm-docs/arquitectura/decisiones/pendientes.md`.

X-47 y X-80 constan cerrados en el registro / plan-general. X-46 absorbido bajo C-1. X-78, X-79, X-81 se desarrollan en `arquitectura/licitacion/alcance-minimo-modulos-adyacentes.md` (X-80 cerrado allí también, como antecedente de RRHH D-1).

### 6.3 Pendientes del estándar de pruebas (X-86…X-93)

Origen: `sgm-docs/arquitectura/especificacion/estandar-pruebas.md` §11 (registrados en `pendientes.md`).

| ID | Materia | Perfil / naturaleza de cierre |
|---|---|---|
| X-86 | Inventario derivado como denominador de cobertura | Trabajo de especificación |
| X-87 | Efecto de dominio verificable en fichas (plantilla §3.6) | Trabajo de especificación |
| X-88 | Calendario de días hábiles | Decisión técnica + fuente normativa |
| X-89 | Puntos de inyección de falla (T6) | Bloqueado por C-1 |
| X-90 | Calibración de coberturas antes de bases | Jefatura / bases |
| X-91 | Régimen contractual ante prueba fallida (alinear con X-10) | Jefatura / jurídica |
| X-92 | Anonimización staging (Ley 21.719) | Jurídica |
| X-93 | Extensión del estándar a módulos sin spec | Trabajo de especificación |

**Veredicto de coherencia (31 jul 2026):** el estándar es coherente con musts §6–§7/§10.6/§11, entregable §4.3/§5.4/§9.4, sandbox §4/§7, ADRs de ventana/atomicidad, hallazgos Cont/Tes y seguridad H-2. No redefine T10/T11; introduce T2 (efecto de dominio) como hueco que el corpus ya diagnosticaba.

---

## 7. Vacíos del inventario

1. **Código de aplicación** del SGM nuevo (0 `.py` / `.ts` / `.sql` de producto).
2. **Carpeta `sgm-docs/modulos/rentas/`** — solo existe la nota a jefatura.
3. **Planes de trabajo** para Adquisiciones (el módulo tiene spec, no plan).
4. **Fichas de proceso nuevas, OpenAPI, wireframes y prototipos** para Presupuestos, Contabilidad, Tesorería y RRHH.
5. **QA P0/P1 dedicada** para Convenio Marco, Licitación Pública y Trato Directo — `brechas-etapa3-modalidades.md` la declara pendiente; solo hay `ficha-qa-adquisiciones.csv`.
6. **Suite de código de pruebas versionada** — existe el estándar [`estandar-pruebas.md`](sgm-docs/arquitectura/especificacion/estandar-pruebas.md); no hay suite ejecutable (ni specs Playwright) en el repo.
7. **Diccionarios bd-export** para L10N_CL_HR_SCALE, INVENTORY_GOV_CL, AUTOSERVICIO_GOV_CL (citados en intro, sin archivo de módulo).
8. **README en la raíz** del monorepo.
9. **Validación con DM** — los planes y varios specs se autodeclaran no validados (incluye alcance-mínimo v0.2 y `estandar-pruebas.md`).

---

## 8. Anexo — Índice de archivos de contenido

### 8.1 Todos los `.md` (166) — líneas

| Líneas | Ruta |
|---:|---|
| 61 | ``bd-export-odoo/bd-sgm.md`` |
| 40 | ``bd-export-odoo/clasificacion-tablas.md`` |
| 28 | ``bd-export-odoo/dependencias.md`` |
| 89 | ``bd-export-odoo/modulos/account-gov-adquisiciones.md`` |
| 198 | ``bd-export-odoo/modulos/account-gov-cl.md`` |
| 38 | ``bd-export-odoo/modulos/employee-portal.md`` |
| 61 | ``bd-export-odoo/modulos/l10n-cl-holidays-attendance.md`` |
| 67 | ``bd-export-odoo/modulos/l10n-cl-hr.md`` |
| 39 | ``bd-export-odoo/modulos/l10n-cl-hr-merit-demerit.md`` |
| 47 | ``bd-export-odoo/modulos/l10n-cl-viatic.md`` |
| 167 | ``bd-export-odoo/modulos/presupuesto-gov-cl.md`` |
| 76 | ``bd-export-odoo/modulos/tesoreria-gov-cl.md`` |
| 138 | ``bd-export-odoo/modulos/tupa.md`` |
| 23 | ``bd-export-odoo/notas-tecnicas.md`` |
| 39 | ``sgm-docs/arquitectura/decisiones/2026-07-atomicidad-efectos-borde.md`` |
| 59 | ``sgm-docs/arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`` |
| 50 | ``sgm-docs/arquitectura/decisiones/2026-07-eliminacion-odoo.md`` |
| 97 | ``sgm-docs/arquitectura/decisiones/2026-07-patrones-transversales-corpus.md`` |
| 40 | ``sgm-docs/arquitectura/decisiones/2026-07-ventana-mutabilidad.md`` |
| 222 | ``sgm-docs/arquitectura/decisiones/brechas-estandarizacion-ntdee-pisee.md`` |
| 136 | ``sgm-docs/arquitectura/decisiones/decisiones-macro-stack.md`` |
| 206 | ``sgm-docs/arquitectura/decisiones/nodo-integracion-subdere.md`` |
| 126 | ``sgm-docs/arquitectura/decisiones/Nota-sobre-rentas.md`` |
| 103 | ``sgm-docs/arquitectura/decisiones/pendientes.md`` |
| 71 | ``sgm-docs/arquitectura/especificacion/catalogo-documentos-firmables.md`` |
| 212 | ``sgm-docs/arquitectura/especificacion/catalogo-roles.md`` |
| 95 | ``sgm-docs/arquitectura/especificacion/contrato-api-first.md`` |
| 328 | ``sgm-docs/arquitectura/especificacion/estandares-api.md`` |
| 149 | ``sgm-docs/arquitectura/especificacion/estandar-firma-electronica.md`` |
| 273 | ``sgm-docs/arquitectura/especificacion/estandar-pruebas.md`` |
| 181 | ``sgm-docs/arquitectura/especificacion/integracion-docdigital.md`` |
| 58 | ``sgm-docs/arquitectura/especificacion/integracion-mercado-publico.md`` |
| 136 | ``sgm-docs/arquitectura/especificacion/musts-arquitectura.md`` |
| 270 | ``sgm-docs/arquitectura/especificacion/plataforma-core.md`` |
| 162 | ``sgm-docs/arquitectura/especificacion/seguridad.md`` |
| 101 | ``sgm-docs/arquitectura/instrucciones/patron-edicion-anclas-firma.md`` |
| 101 | ``sgm-docs/arquitectura/instrucciones/patron-formularios-secciones.md`` |
| 88 | ``sgm-docs/arquitectura/instrucciones/patron-vista-expediente.md`` |
| 389 | ``sgm-docs/arquitectura/instrucciones/plantilla-maestra-sgm.md`` |
| 230 | ``sgm-docs/arquitectura/licitacion/alcance-minimo-modulos-adyacentes.md`` |
| 441 | ``sgm-docs/arquitectura/licitacion/entregable-licitacion.md`` |
| 66 | ``sgm-docs/arquitectura/licitacion/principios-no-negociables.md`` |
| 123 | ``sgm-docs/arquitectura/licitacion/sandbox-desarrolladores.md`` |
| 61 | ``sgm-docs/arquitectura/README.md`` |
| 24 | ``sgm-docs/glosario-siglas.md`` |
| 629 | ``sgm-docs/modelo-datos/entidades-core.md`` |
| 443 | ``sgm-docs/modelo-datos/entidades-plataforma.md`` |
| 36 | ``sgm-docs/modelo-datos/glosario.md`` |
| 249 | ``sgm-docs/modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md`` |
| 108 | ``sgm-docs/modulos/adquisiciones/1. compra-agil/overview.md`` |
| 353 | ``sgm-docs/modulos/adquisiciones/2. convenio-marco/3-resolucion-compra-convenio-marco v2.md`` |
| 25 | ``sgm-docs/modulos/adquisiciones/2. convenio-marco/overview.md`` |
| 395 | ``sgm-docs/modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md`` |
| 24 | ``sgm-docs/modulos/adquisiciones/3. licitacion-publica/overview.md`` |
| 199 | ``sgm-docs/modulos/adquisiciones/4. trato-directo/3-resolucion-compra.md`` |
| 24 | ``sgm-docs/modulos/adquisiciones/4. trato-directo/overview.md`` |
| 160 | ``sgm-docs/modulos/adquisiciones/analitica.md`` |
| 68 | ``sgm-docs/modulos/adquisiciones/brechas-etapa3-modalidades.md`` |
| 39 | ``sgm-docs/modulos/adquisiciones/catalogo-documentos-firmables.md`` |
| 240 | ``sgm-docs/modulos/adquisiciones/comparativa-odoo-vs-nuevo.md`` |
| 855 | ``sgm-docs/modulos/adquisiciones/contracts.md`` |
| 16 | ``sgm-docs/modulos/adquisiciones/fixtures/catalogo.md`` |
| 7 | ``sgm-docs/modulos/adquisiciones/openapi/2-convenio-marco/README.md`` |
| 7 | ``sgm-docs/modulos/adquisiciones/openapi/3-licitacion-publica/README.md`` |
| 7 | ``sgm-docs/modulos/adquisiciones/openapi/4-trato-directo/README.md`` |
| 54 | ``sgm-docs/modulos/adquisiciones/openapi/README.md`` |
| 64 | ``sgm-docs/modulos/adquisiciones/overview.md`` |
| 150 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/0-consulta-expedientes.md`` |
| 394 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md`` |
| 206 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md`` |
| 214 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md`` |
| 175 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/5-pago.md`` |
| 27 | ``sgm-docs/modulos/adquisiciones/procesos-transversales/overview.md`` |
| 39 | ``sgm-docs/modulos/adquisiciones/wireframes/00-hub-modulo.md`` |
| 99 | ``sgm-docs/modulos/adquisiciones/wireframes/01-listado-expedientes.md`` |
| 70 | ``sgm-docs/modulos/adquisiciones/wireframes/10-verificacion-previa.md`` |
| 163 | ``sgm-docs/modulos/adquisiciones/wireframes/11-creacion-solped.md`` |
| 91 | ``sgm-docs/modulos/adquisiciones/wireframes/12-visto-bueno-jefatura.md`` |
| 68 | ``sgm-docs/modulos/adquisiciones/wireframes/13-verificacion-disponibilidad.md`` |
| 87 | ``sgm-docs/modulos/adquisiciones/wireframes/14-emision-cdp.md`` |
| 60 | ``sgm-docs/modulos/adquisiciones/wireframes/15-preobligacion.md`` |
| 52 | ``sgm-docs/modulos/adquisiciones/wireframes/16-solicitar-financiamiento.md`` |
| 100 | ``sgm-docs/modulos/adquisiciones/wireframes/21-ratificacion-modalidad.md`` |
| 68 | ``sgm-docs/modulos/adquisiciones/wireframes/22-aprobacion-jefatura.md`` |
| 78 | ``sgm-docs/modulos/adquisiciones/wireframes/23-vinculacion-mp.md`` |
| 53 | ``sgm-docs/modulos/adquisiciones/wireframes/31-periodo-cotizacion.md`` |
| 56 | ``sgm-docs/modulos/adquisiciones/wireframes/32-cierre-seleccion-oferta.md`` |
| 60 | ``sgm-docs/modulos/adquisiciones/wireframes/33-emision-oc.md`` |
| 57 | ``sgm-docs/modulos/adquisiciones/wireframes/34-aceptacion-oc.md`` |
| 58 | ``sgm-docs/modulos/adquisiciones/wireframes/35-rechazo-oc.md`` |
| 56 | ``sgm-docs/modulos/adquisiciones/wireframes/36-proceso-desierto-fallido.md`` |
| 66 | ``sgm-docs/modulos/adquisiciones/wireframes/41-recepcion-conforme.md`` |
| 68 | ``sgm-docs/modulos/adquisiciones/wireframes/51-cruce-tres-vias.md`` |
| 26 | ``sgm-docs/modulos/adquisiciones/wireframes/90-configuraciones.md`` |
| 29 | ``sgm-docs/modulos/adquisiciones/wireframes/91-config-firmas-lista.md`` |
| 49 | ``sgm-docs/modulos/adquisiciones/wireframes/92-config-firmas-editor-anclas.md`` |
| 53 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/31-evaluacion-umbral.md`` |
| 63 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/32-compra-directa-catalogo.md`` |
| 65 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/33-intencion-gran-compra.md`` |
| 58 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/34-periodo-competencia.md`` |
| 58 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/35-seleccion-oferta.md`` |
| 56 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/36-gran-compra-desierta.md`` |
| 64 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/37-aceptacion-oc.md`` |
| 61 | ``sgm-docs/modulos/adquisiciones/wireframes/convenio-marco/38-rechazo-oc.md`` |
| 63 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/310-resolucion-adjudicacion.md`` |
| 59 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/311-toma-razon-adjudicacion.md`` |
| 58 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/312-garantia-fiel-cumplimiento.md`` |
| 66 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/313-contrato.md`` |
| 61 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/314-aceptacion-oc.md`` |
| 75 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/31-elaboracion-bases.md`` |
| 59 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/32-revision-juridica-bases.md`` |
| 62 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/33-acto-aprueba-bases.md`` |
| 60 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/34-toma-razon-bases.md`` |
| 60 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/35-publicacion-vinculacion-mp.md`` |
| 59 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/36-foro-aclaraciones.md`` |
| 63 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/37-garantia-seriedad.md`` |
| 53 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/38-apertura-electronica.md`` |
| 107 | ``sgm-docs/modulos/adquisiciones/wireframes/licitacion-publica/39-comision-evaluadora.md`` |
| 92 | ``sgm-docs/modulos/adquisiciones/wireframes/README.md`` |
| 59 | ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/31-toma-razon.md`` |
| 56 | ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/32-publicacion-vinculacion-mp.md`` |
| 56 | ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/33-emision-aceptacion-oc.md`` |
| 55 | ``sgm-docs/modulos/adquisiciones/wireframes/trato-directo/34-rechazo-oc.md`` |
| 691 | ``sgm-docs/modulos/contabilidad/modelos-odoo.md`` |
| 16 | ``sgm-docs/modulos/contabilidad/overview.md`` |
| 438 | ``sgm-docs/modulos/contabilidad/plan-de-trabajo-contabilidad.md`` |
| 452 | ``sgm-docs/modulos/presupuestos/modelos-odoo.md`` |
| 15 | ``sgm-docs/modulos/presupuestos/overview.md`` |
| 1732 | ``sgm-docs/modulos/presupuestos/plan-de-trabajo_presupuestos.md`` |
| 435 | ``sgm-docs/modulos/rrhh/modelos-odoo.md`` |
| 17 | ``sgm-docs/modulos/rrhh/overview.md`` |
| 439 | ``sgm-docs/modulos/rrhh/plan-de-trabajo-rrhh.md`` |
| 460 | ``sgm-docs/modulos/tesoreria/modelos-odoo.md`` |
| 20 | ``sgm-docs/modulos/tesoreria/overview.md`` |
| 393 | ``sgm-docs/modulos/tesoreria/plan-de-trabajo-tesoreria.md`` |
| 299 | ``sgm-docs/plan-general.md`` |
| 381 | ``sgm-docs/plataforma/contracts.md`` |
| 82 | ``sgm-docs/plataforma/mensajeria/overview.md`` |
| 98 | ``sgm-docs/plataforma/notificaciones/matriz-evento-canal.md`` |
| 135 | ``sgm-docs/plataforma/notificaciones/overview.md`` |
| 78 | ``sgm-docs/plataforma/overview.md`` |
| 61 | ``sgm-docs/plataforma/wireframes/municipal/01-usuarios.md`` |
| 146 | ``sgm-docs/plataforma/wireframes/municipal/02-roles-unidades.md`` |
| 51 | ``sgm-docs/plataforma/wireframes/municipal/03-subrogancias.md`` |
| 54 | ``sgm-docs/plataforma/wireframes/municipal/04-excepciones-sod.md`` |
| 51 | ``sgm-docs/plataforma/wireframes/municipal/05-parametros-operativos.md`` |
| 54 | ``sgm-docs/plataforma/wireframes/municipal/06-integraciones-municipio.md`` |
| 61 | ``sgm-docs/plataforma/wireframes/municipal/07-almacenamiento-documentos.md`` |
| 52 | ``sgm-docs/plataforma/wireframes/municipal/08-recertificacion-accesos.md`` |
| 63 | ``sgm-docs/plataforma/wireframes/municipal/09-preferencias-notificacion.md`` |
| 15 | ``sgm-docs/plataforma/wireframes/README.md`` |
| 63 | ``sgm-docs/plataforma/wireframes/shell/01-campanita.md`` |
| 75 | ``sgm-docs/plataforma/wireframes/shell/02-bandeja.md`` |
| 71 | ``sgm-docs/plataforma/wireframes/shell/03-mis-datos.md`` |
| 74 | ``sgm-docs/plataforma/wireframes/shell/04-chat-contextual.md`` |
| 34 | ``sgm-docs/plataforma/wireframes/shell/05-chats.md`` |
| 67 | ``sgm-docs/plataforma/wireframes/subdere/01-gestion-tenants.md`` |
| 68 | ``sgm-docs/plataforma/wireframes/subdere/02-parametros-normativos.md`` |
| 64 | ``sgm-docs/plataforma/wireframes/subdere/03-clientes-m2m.md`` |
| 53 | ``sgm-docs/plataforma/wireframes/subdere/04-integraciones-plataforma.md`` |
| 49 | ``sgm-docs/plataforma/wireframes/subdere/05-provision-almacenamiento.md`` |
| 50 | ``sgm-docs/plataforma/wireframes/subdere/06-monitoreo-tenant.md`` |
| 53 | ``sgm-docs/plataforma/wireframes/subdere/07-auditoria-plataforma.md`` |
| 39 | ``sgm-docs/README.md`` |
| 222 | ``sgm-prototipos/MANIFEST.md`` |
| 114 | ``sgm-prototipos/README.md`` |

### 8.2 Otros archivos de contenido (no `.md`)

| Líneas / marca | Ruta |
|---:|---|
| 15 | ``.cursor/rules/sgm-docs-wireframes.mdc`` |
| 25 | ``.cursor/rules/sgm-prototipos-html.mdc`` |
| 31 | ``.cursor/rules/sgm-ui-conexiones.mdc`` |
| 40 | ``.github/workflows/pages-prototipos.yml`` |
| 49 | ``.gitlab-ci.yml`` |
| 150 | ``sgm-docs/arquitectura/especificacion/openapi/comunes.yaml`` |
| drawio | ``sgm-docs/modulos/adquisiciones/diagramas/compra-agil.drawio`` |
| 57 | ``sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00012.yaml`` |
| 41 | ``sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00045.yaml`` |
| 41 | ``sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00089.yaml`` |
| 47 | ``sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00123.yaml`` |
| 56 | ``sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00142.yaml`` |
| 63 | ``sgm-docs/modulos/adquisiciones/fixtures/escenarios-transaccionales.yaml`` |
| 101 | ``sgm-docs/modulos/adquisiciones/openapi/1-compra-agil/3-resolucion-compra.yaml`` |
| 76 | ``sgm-docs/modulos/adquisiciones/openapi/2-convenio-marco/3-resolucion-compra.yaml`` |
| 283 | ``sgm-docs/modulos/adquisiciones/openapi/3-licitacion-publica/3-resolucion-compra.yaml`` |
| 29 | ``sgm-docs/modulos/adquisiciones/openapi/4-trato-directo/3-resolucion-compra.yaml`` |
| 1365 | ``sgm-docs/modulos/adquisiciones/openapi/adquisiciones.openapi.yaml`` |
| 312 | ``sgm-docs/modulos/adquisiciones/openapi/expediente.yaml`` |
| 556 | ``sgm-docs/modulos/adquisiciones/openapi/procesos-transversales/1-solped.yaml`` |
| 273 | ``sgm-docs/modulos/adquisiciones/openapi/procesos-transversales/2-modalidad-compra.yaml`` |
| 213 | ``sgm-docs/modulos/adquisiciones/openapi/procesos-transversales/4-recepcion-conforme.yaml`` |
| 227 | ``sgm-docs/modulos/adquisiciones/openapi/procesos-transversales/5-pago.yaml`` |
| 84 | ``sgm-docs/modulos/adquisiciones/qa/ficha-qa-adquisiciones.csv`` |
| 53 | ``sgm-prototipos/auth/clave-unica.html`` |
| 32 | ``sgm-prototipos/home.html`` |
| 49 | ``sgm-prototipos/index.html`` |
| 71 | ``sgm-prototipos/modulos/adquisiciones/00-expediente/index.html`` |
| 392 | ``sgm-prototipos/modulos/adquisiciones/01-listado-expedientes.html`` |
| 92 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/31-periodo-cotizacion.html`` |
| 104 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/32-cierre-seleccion-oferta.html`` |
| 126 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/33-emision-oc.html`` |
| 139 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/34-aceptacion-oc.html`` |
| 109 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/35-rechazo-oc.html`` |
| 113 | ``sgm-prototipos/modulos/adquisiciones/1-compra-agil/36-proceso-desierto-fallido.html`` |
| 134 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/31-evaluacion-umbral.html`` |
| 144 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/32-compra-directa-catalogo.html`` |
| 152 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/33-intencion-gran-compra.html`` |
| 117 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/34-periodo-competencia.html`` |
| 96 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/35-seleccion-oferta.html`` |
| 93 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/36-gran-compra-desierta.html`` |
| 140 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/37-aceptacion-oc.html`` |
| 130 | ``sgm-prototipos/modulos/adquisiciones/2-convenio-marco/38-rechazo-oc.html`` |
| 154 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/310-resolucion-adjudicacion.html`` |
| 147 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/311-toma-razon-adjudicacion.html`` |
| 113 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/312-garantia-fiel-cumplimiento.html`` |
| 153 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/313-contrato.html`` |
| 138 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/314-aceptacion-oc.html`` |
| 170 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/31-elaboracion-bases.html`` |
| 125 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/32-revision-juridica-bases.html`` |
| 124 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/33-acto-aprueba-bases.html`` |
| 139 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/34-toma-razon-bases.html`` |
| 132 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/35-publicacion-vinculacion-mp.html`` |
| 135 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/36-foro-aclaraciones.html`` |
| 131 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/37-garantia-seriedad.html`` |
| 105 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/38-apertura-electronica.html`` |
| 197 | ``sgm-prototipos/modulos/adquisiciones/3-licitacion-publica/39-comision-evaluadora.html`` |
| 159 | ``sgm-prototipos/modulos/adquisiciones/4-trato-directo/31-toma-razon.html`` |
| 130 | ``sgm-prototipos/modulos/adquisiciones/4-trato-directo/32-publicacion-vinculacion-mp.html`` |
| 117 | ``sgm-prototipos/modulos/adquisiciones/4-trato-directo/33-emision-aceptacion-oc.html`` |
| 107 | ``sgm-prototipos/modulos/adquisiciones/4-trato-directo/34-rechazo-oc.html`` |
| 94 | ``sgm-prototipos/modulos/adquisiciones/configuraciones/91-firmas.html`` |
| 160 | ``sgm-prototipos/modulos/adquisiciones/configuraciones/92-editor-anclas.html`` |
| 52 | ``sgm-prototipos/modulos/adquisiciones/configuraciones/index.html`` |
| 134 | ``sgm-prototipos/modulos/adquisiciones/index.html`` |
| 231 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/10-verificacion-previa.html`` |
| 505 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/11-creacion-solped.html`` |
| 298 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/12-visto-bueno-jefatura.html`` |
| 130 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/13-verificacion-disponibilidad.html`` |
| 141 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/14-emision-cdp.html`` |
| 90 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/15-preobligacion.html`` |
| 77 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/16-solicitar-financiamiento.html`` |
| 328 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/21-ratificacion-modalidad.html`` |
| 133 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/22-aprobacion-jefatura.html`` |
| 152 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/23-vinculacion-mp.html`` |
| 151 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/41-recepcion-conforme.html`` |
| 120 | ``sgm-prototipos/modulos/adquisiciones/procesos-transversales/51-cruce-tres-vias.html`` |
| 63 | ``sgm-prototipos/plataforma/index.html`` |
| 90 | ``sgm-prototipos/plataforma/municipal/01-usuarios.html`` |
| 333 | ``sgm-prototipos/plataforma/municipal/02-roles-unidades.html`` |
| 86 | ``sgm-prototipos/plataforma/municipal/03-subrogancias.html`` |
| 86 | ``sgm-prototipos/plataforma/municipal/04-excepciones-sod.html`` |
| 83 | ``sgm-prototipos/plataforma/municipal/05-parametros-operativos.html`` |
| 77 | ``sgm-prototipos/plataforma/municipal/06-integraciones-municipio.html`` |
| 114 | ``sgm-prototipos/plataforma/municipal/07-almacenamiento-documentos.html`` |
| 106 | ``sgm-prototipos/plataforma/municipal/08-recertificacion-accesos.html`` |
| 129 | ``sgm-prototipos/plataforma/municipal/09-preferencias-notificacion.html`` |
| 204 | ``sgm-prototipos/plataforma/shell/02-bandeja.html`` |
| 141 | ``sgm-prototipos/plataforma/shell/03-mis-datos.html`` |
| 124 | ``sgm-prototipos/plataforma/shell/05-chats.html`` |
| 102 | ``sgm-prototipos/plataforma/subdere/01-gestion-tenants.html`` |
| 95 | ``sgm-prototipos/plataforma/subdere/02-parametros-normativos.html`` |
| 100 | ``sgm-prototipos/plataforma/subdere/03-clientes-m2m.html`` |
| 87 | ``sgm-prototipos/plataforma/subdere/04-integraciones-plataforma.html`` |
| 70 | ``sgm-prototipos/plataforma/subdere/05-provision-almacenamiento.html`` |
| 65 | ``sgm-prototipos/plataforma/subdere/06-monitoreo-tenant.html`` |
| 87 | ``sgm-prototipos/plataforma/subdere/07-auditoria-plataforma.html`` |
| 148 | ``sgm-prototipos/shared/app-shell.js`` |
| 61 | ``sgm-prototipos/shared/auth-demo.js`` |
| 343 | ``sgm-prototipos/shared/chat-contextual-ui.js`` |
| 1 | ``sgm-prototipos/shared/demo-data.js`` |
| 99 | ``sgm-prototipos/shared/demo-data/catalog-search-demo.js`` |
| 120 | ``sgm-prototipos/shared/demo-data/compra-agil.js`` |
| 89 | ``sgm-prototipos/shared/demo-data/compra-agil-sin-saldo.js`` |
| 121 | ``sgm-prototipos/shared/demo-data/convenio-marco.js`` |
| 31 | ``sgm-prototipos/shared/demo-data/index.js`` |
| 123 | ``sgm-prototipos/shared/demo-data/licitacion-publica.js`` |
| 603 | ``sgm-prototipos/shared/demo-data/plataforma.js`` |
| 478 | ``sgm-prototipos/shared/demo-data/stage-builders.js`` |
| 121 | ``sgm-prototipos/shared/demo-data/trato-directo.js`` |
| 335 | ``sgm-prototipos/shared/expediente.js`` |
| 353 | ``sgm-prototipos/shared/expedientes-demo.js`` |
| 267 | ``sgm-prototipos/shared/form-bootstrap.js`` |
| 235 | ``sgm-prototipos/shared/form-presets.js`` |
| 415 | ``sgm-prototipos/shared/forms.css`` |
| 386 | ``sgm-prototipos/shared/form-shell.js`` |
| 334 | ``sgm-prototipos/shared/landing.css`` |
| 238 | ``sgm-prototipos/shared/layout.css`` |
| 76 | ``sgm-prototipos/shared/modules-registry.js`` |
| 206 | ``sgm-prototipos/shared/notifications-ui.js`` |
| 108 | ``sgm-prototipos/shared/origin.css`` |
| 77 | ``sgm-prototipos/shared/roles.js`` |
| 1329 | ``sgm-prototipos/shared/shell.css`` |
| 132 | ``sgm-prototipos/shared/steps-manifest.js`` |
| 131 | ``sgm-prototipos/shared/steps-manifest.json`` |
| 77 | ``sgm-prototipos/shared/steps-manifest-compra-agil.js`` |
| 76 | ``sgm-prototipos/shared/steps-manifest-compra-agil.json`` |
| 99 | ``sgm-prototipos/shared/steps-manifest-convenio-marco.js`` |
| 165 | ``sgm-prototipos/shared/steps-manifest-licitacion-publica.js`` |
| 55 | ``sgm-prototipos/shared/steps-manifest-trato-directo.js`` |
| 36 | ``sgm-prototipos/shared/tokens.css`` |
| 284 | ``sgm-prototipos/shared/validation-demos.js`` |

---

## 9. Método

### Comandos y procedimientos usados (30 jul 2026)

1. `git rev-list --count HEAD`; `git log --reverse -1`; `git log -1` → commits y fechas.
2. `Get-ChildItem -Recurse -File` excluyendo `.git` → totales y extensiones.
3. Por cada `.md`: `(Get-Content).Count` (líneas), split por whitespace (palabras), regex H1/H2, pendientes, entidades.
4. Clasificación **sustantiva** vs auxiliar por ruta (exclusión: README, `**/wireframes/**`, glosarios, `sgm-prototipos/*.md`, `fixtures/catalogo.md`).
5. Modelos Odoo: `####` en `bd-export-odoo/modulos`; `###` en `modelos-odoo.md` excluyendo `_inherit`.
6. Normas: regex de citas; deduplicación manual de grafías; verificación primaria solo donde el texto lo declara.
7. Magenta / hallazgos / bloqueantes: lectura de planes, `pendientes.md`, `Nota-sobre-rentas.md`, comparativa Adq, ADRs.
8. Existencia de vacíos: `Test-Path` sobre rutas citadas como destino y no presentes.
9. Este archivo se generó **después** de excluir borradores de sí mismo del conteo, para no inflar totales.

### Conteos que no son exactos al 100 % (declarados)

- **Normas:** el regex produjo 59 cadenas crudas; la lista canónica en `registro-normas.md` / §1.3 suma **36** ítems (`N-01`…`N-36`). Pueden existir citas en prosa sin número no capturadas; altas futuras van al registro.
- **Pendientes únicos P/C:** incluyen IDs históricos residuales; la serie canónica es la de los planes/registro.
- **Entidades plataforma:** 27 encabezados; nombres atómicos tras partir alias `A / B` no se contabilizaron aparte.
- **Cobertura Magenta en %:** no se recalculó; solo se inventarían los N de procesos que los planes enumeran.

### Archivos leídos en profundidad (no solo listados)

`plan-general.md`; cinco ADR `2026-07-*`; `pendientes.md` (X-01…X-93); `Nota-sobre-rentas.md`; `alcance-minimo-modulos-adyacentes.md`; `estandar-pruebas.md` (coherencia verificada e integrado 31 jul 2026); planes Pres/Cont/Tes/RRHH; `entidades-core.md` / `entidades-plataforma.md`; `brechas-etapa3-modalidades.md`; `comparativa-odoo-vs-nuevo.md`; `bd-sgm.md`; `seguridad.md`; cabeceras de specs de arquitectura y Adq; metadatos mecánicos de los 166 `.md` del corpus.

---

## 10. Autoverificación

1. **¿Hay cifra sin rastro a comando o archivo?** Las de la §1 remiten a comando o conteo descrito. Tras integrar `estandar-pruebas.md`, se recontearon specs sustantivas (83 / 16200 / 171620), totales `.md` (166 / 21371) y pendientes X (900 occ / 93 IDs).
2. **¿Rutas citadas existen?** `estandar-pruebas.md`, alcance-mínimo y registro X-86…X-93 existen. Sigue inexistente `modulos/rentas`.
3. **¿Adjetivos valorativos?** Evitados en la voz del inventario. El veredicto «coherente» en §6.3 es factual respecto a alineación de referencias, no un juicio de calidad.
4. **¿Trabajo futuro presentado como hecho?** No: el estándar de pruebas existe como documento; la suite de código no. X-86…X-93 figuran abiertos.
5. **¿La matriz muestra vacíos con la misma claridad que logros?** Sí; §7 distingue estándar existente vs suite ausente.

---

*Fin del inventario. Artefacto: `inventario-repositorio.md` en la raíz del repositorio.*
