# Estándares del contrato API

> Documento normativo — arquitectura / contratos
> Estado: borrador. Aplica a todos los módulos del SGM por igual; Adquisiciones es el piloto de adopción.
> Los `contracts.md` de cada módulo **referencian** este documento; no repiten estos estándares.
> Origen: sección 4 de [`contrato-api-first.md`](./contrato-api-first.md); formato OpenAPI/fixtures consolidado desde el entregable de licitación. Pendientes en [`pendientes.md`](../decisiones/pendientes.md).

---

# Parte I — Estándares transversales

## 1. OpenAPI como fuente de verdad

La especificación OpenAPI de cada módulo se versiona en el repositorio. El código se valida contra la especificación, no al revés. Ante discrepancia entre `contracts.md` (vista funcional) y OpenAPI (vista técnica), se resuelve la inconsistencia antes de dar por cerrado cualquiera de los dos.

## 2. Versionamiento y deprecación

- Los contratos siguen **versionado semántico** (`MAJOR.MINOR.PATCH`).
- Toda versión publicada declara su política de deprecación.
- **[PENDIENTE P-04]** Definir plazo mínimo de convivencia entre versiones deprecadas y su reemplazo.

## 3. Errores verbosos y estructurados

Toda respuesta de error (`4xx`, `5xx` de negocio) incluye cuerpo JSON con el esquema único:

```json
{
  "error_code": "BUDGET_UNAVAILABLE",
  "field": "budget_line_id",
  "rule": "La línea presupuestaria no tiene saldo disponible para el monto solicitado",
  "legal_reference": "…cuando aplique…",
  "severity": "blocking"
}
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `error_code` | Sí | Identificador estable en `SCREAMING_SNAKE_CASE` |
| `field` | No | Campo o recurso que originó el error, si aplica |
| `rule` | Sí | Mensaje legible de la regla violada |
| `legal_reference` | No | Ancla normativa cuando la regla tiene respaldo legal |
| `severity` | Sí | `blocking` (impide avanzar) o `advisory` (informa sin bloquear) |

**Nunca** un `400`/`422` sin cuerpo. La validación bloqueante vive en el servidor; el frontend solo la refleja. Esquema OpenAPI compartido: [`openapi/comunes.yaml`](./openapi/comunes.yaml) (`ErrorResponse`).

## 4. Paginación, filtrado y orden

Convención única para todas las colecciones:

| Parámetro | Convención |
|---|---|
| Paginación | `page` (base 1) + `page_size` (default 20, máx. 100) |
| Orden | `sort` (campo) + `order` (`asc` \| `desc`) |
| Filtrado | Query params por campo filtrable, documentados en cada operación |

Respuesta de colección:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total_items": 0,
  "total_pages": 0
}
```

Parámetros y `PaginationMeta` viven en [`openapi/comunes.yaml`](./openapi/comunes.yaml).

## 5. Idempotencia

Las operaciones de escritura sensibles (creación de órdenes, devengados, pagos, compromisos presupuestarios) aceptan cabecera `Idempotency-Key` (UUID). Reintentos con la misma clave devuelven la misma respuesta sin duplicar efectos. Parámetro común: `IdempotencyKey` en [`openapi/comunes.yaml`](./openapi/comunes.yaml).

## 6. Multitenancy explícita en el contrato

**[PENDIENTE P-03]** Decidir si el tenant (municipio) viaja en la ruta (`/tenants/{tenant_id}/…`), en el token JWT, o ambos. Esta decisión afecta a todos los endpoints y debe resolverse antes del primer contrato definitivo.

Hasta resolverlo, los `contracts.md` documentan las rutas sin prefijo de tenant y marcan el pendiente. En OpenAPI, las specs incluyen el comentario estándar `# P-03: tenant pendiente (ruta/token)` en `servers`.

## 7. Clasificación de validaciones entre módulos

Toda dependencia declarada en un `contracts.md` debe clasificarse según [`musts-arquitectura.md`](./musts-arquitectura.md) §5:

| Clase | Comportamiento |
|---|---|
| Síncrona bloqueante | La operación no procede sin respuesta del proveedor |
| Asíncrona | La operación procede; la validación confirma o revierte después |
| Cacheada | Se valida contra dato local con frescura declarada |

En OpenAPI, la misma clasificación se declara con `x-validation-class` (`sync-blocking` / `async` / `cached`) — ver Parte II §12.

## 8. Autenticación y autorización

Dos planos distintos, ambos exigibles en las bases (detalle en [`contrato-api-first.md`](./contrato-api-first.md) §5):

| Plano | Mecanismo | Uso |
|---|---|---|
| Personas | Clave Única | Usuarios municipales operando vía frontend |
| Sistemas | OAuth2 client credentials (o equivalente) | Sistemas municipales consumiendo módulos M2M, con **scopes por módulo y por municipio** |

**[PENDIENTE P-02]** El plano M2M no existe en el diseño actual; especificarlo es prerequisito del modo à la carte.

Exigencias de seguridad de ambos planos: [`seguridad.md`](./seguridad.md) §2. Esquemas OpenAPI: `bearerPersonas` / `bearerM2M` en [`openapi/comunes.yaml`](./openapi/comunes.yaml).

---

# Parte II — OpenAPI y catálogo de fixtures

Cierra las brechas de formato de [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md): cómo se escribe la OpenAPI de un módulo y cómo se documentan los fixtures del sandbox. Los `contracts.md` siguen siendo la vista funcional; esta parte define su contraparte técnica formal. Ubicación resumida también en [`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) §4.1.

## 10. Ubicación y estructura de archivos

```
sgm-docs/
├── arquitectura/
│   └── openapi/
│       └── comunes.yaml              # error, paginación, seguridad (Parte I §3, §4, §8)
└── modulos/
    └── <módulo>/
        ├── contracts.md              # vista funcional
        ├── openapi/
        │   ├── <módulo>.openapi.yaml # entrada: info, tags, paths vía $ref, components
        │   ├── expediente.yaml       # lecturas transversales (si aplica)
        │   ├── procesos-transversales/
        │   │   └── N-….yaml
        │   └── N-modalidad/          # kebab-case; fragmentos por etapa
        │       └── ….yaml
        └── fixtures/
            ├── catalogo.md           # índice de fixtures
            └── <FIXTURE-ID>.yaml
```

- **Una especificación OpenAPI por módulo**, versión OpenAPI **3.1**, en YAML, **seccionada como los procesos**.
- La entrada `<módulo>.openapi.yaml` ensambla `paths` con `$ref` a fragmentos; no duplica el cuerpo de cada operación.
- Schemas, responses y `examples` viven en la entrada (o en `comunes.yaml` si son transversales).
- Los componentes transversales viven **una sola vez** en `arquitectura/especificacion/openapi/comunes.yaml` y se referencian vía `$ref`. Ningún módulo los redefine.
- El core de plataforma ([`plataforma-core.md`](./plataforma-core.md)) sigue la misma estructura bajo `plataforma/openapi/`.

Referencia piloto: [`modulos/adquisiciones/openapi/README.md`](../../modulos/adquisiciones/openapi/README.md).

## 11. Convenciones de nomenclatura

Extienden las convenciones del modelo de datos ([`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) §6):

| Elemento | Convención | Ejemplo |
|---|---|---|
| Rutas | kebab-case, recursos en plural | `/procurement-cases/{case_id}/steps` |
| `operationId` | camelCase, **idéntico al nombre de la operación en `contracts.md`** | `getProcurementCase` |
| Esquemas (`components.schemas`) | PascalCase, **idéntico al nombre de entidad en `entidades-core.md`** | `ProcurementCase` |
| Campos | snake_case, idénticos al modelo de datos | `procurement_case_id` |
| Parámetros de ruta | snake_case con sufijo `_id` o el identificador de negocio | `{case_id}`, `{folio}` |
| Códigos de error | `SCREAMING_SNAKE_CASE`, registrados en el esquema común | `BUDGET_UNAVAILABLE` |
| `tags` | Una por etapa del macroproceso o área funcional | `solped`, `modalidad-compra` |
| Carpetas OpenAPI de modalidad | `N-nombre-kebab` (sin espacios en `$ref`) | `1-compra-agil` |

La identidad de nombres entre `contracts.md`, `entidades-core.md` y OpenAPI no es estilo: es lo que permite verificar consistencia de forma automática (§13) y sostiene la regla de resolución de discrepancias de la Parte I §1.

**Multitenancy:** hasta resolver **[P-03]**, las rutas se documentan sin prefijo de tenant (Parte I §6).

## 12. Extensiones obligatorias de trazabilidad

Cada operación lleva extensiones `x-` que preservan la trazabilidad proceso → contrato exigida en [`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) §4:

| Extensión | Contenido | Obligatoria |
|---|---|---|
| `x-subpasos` | Sub-paso(s) de ficha donde se origina la operación (`["1.1", "3.2"]`) | Sí |
| `x-validation-class` | Para dependencias invocadas: `sync-blocking` / `async` / `cached` ([`musts-arquitectura.md`](./musts-arquitectura.md) §5) | Si la operación invoca dependencias |
| `x-legal-reference` | Ancla normativa de las reglas que la operación valida | Cuando aplique |
| `x-emits` | Eventos de dominio que la operación emite (`["PurchaseOrderIssued"]`) | Si emite |

## 13. Contenido mínimo por operación y regla de sincronización

### 13.1 Contenido mínimo por operación

Toda operación publicada debe incluir:

1. **`summary` y `description`** en español funcional (el público incluye contrapartes no técnicas); nombres técnicos en inglés.
2. **Esquema completo de request y response** con obligatoriedad explícita (`required`) — misma regla de oro que los campos de ficha: prohibido un campo sin obligatoriedad declarada.
3. **Todas las respuestas de error de dominio posibles**, cada una con su `error_code` estable, referenciando el esquema común. Nunca un `4xx` documentado sin cuerpo.
4. **Al menos un `example` de éxito y uno por cada error de dominio frecuente.** Los examples de operaciones cubiertas por fixtures usan los **IDs del catálogo de fixtures** (§14) — un integrador copia el example, lo ejecuta contra el sandbox y obtiene la misma respuesta. Esa es la definición operativa de la paridad `{a}` → `{b}` de [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md).
5. **`security`** declarando el plano aplicable (personas / M2M) y scopes, según Parte I §8.
6. **Paginación, filtrado y orden** en colecciones según Parte I §4, referenciando los componentes comunes.

### 13.2 Correspondencia y validación

1. **Correspondencia biunívoca:** toda operación de `contracts.md` §2 existe como `operationId` en la OpenAPI del módulo (entrada + fragmentos resueltos), y viceversa. Toda entidad expuesta en `contracts.md` §1 existe como esquema. Un endpoint en OpenAPI sin entrada en `contracts.md` es un **endpoint no documentado** — exactamente lo que las bases prohíben al adjudicatario; el repo se somete a su propia regla.
2. **Resolución de discrepancias:** según Parte I §1 — se resuelve antes de dar por cerrado cualquiera de los dos. El código (del adjudicatario) se valida contra OpenAPI, no al revés.
3. **Examples en OpenAPI:** al menos un ejemplo de éxito por operación publicada; los fixtures **referencian** esos examples (`example_ref`), no duplican el JSON de respuesta.
4. **Validación automática en el repo:** lint de la spec (nomenclatura §11, extensiones §12, contenido mínimo §13.1) y verificación de correspondencia con `contracts.md` como paso de CI de `sgm-docs`. **[PENDIENTE P-53]** Selección de tooling (linter de referencia: Spectral con reglas propias; verificación de examples contra fixtures) — herramienta interna del repo, no exigencia de bases.
5. **Versionamiento:** `info.version` sigue el semver del contrato (Parte I §2). Un cambio MAJOR requiere entrada en la política de deprecación (**P-04**).

## 14. Catálogo de fixtures

### 14.1 Qué es un fixture

Un fixture es un **estado de negocio reproducible** en el sandbox: un conjunto de entidades sembradas con IDs estables, más las operaciones canónicas ejecutables sobre ese estado y sus respuestas esperadas. Los fixtures son un activo versionado del repositorio ([`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) D-06): se despliegan con el sandbox y se usan como material de las pruebas de recepción.

### 14.2 Formato del archivo de fixture

Un archivo YAML por fixture en `modulos/<módulo>/fixtures/`:

```yaml
fixture: ADQ-2026-00123
tenant: municipio-demo-norte
module: adquisiciones
title: Compra Ágil con modalidad confirmada, resolución pendiente
business_state: >
  Expediente post etapa 2: SOLPED aprobada, modalidad Compra Ágil
  confirmada, etapa 3-CA sin iniciar.
seeds:                            # entidades sembradas, referencia al modelo canónico
  - entity: ProcurementCase
    id: ADQ-2026-00123
    key_fields: { procurement_type: agile_purchase, status: modality_confirmed }
  - entity: PurchaseRequest
    id: PR-2026-00123
    key_fields: { status: approved }
operations:                       # operaciones canónicas sobre este estado
  - operationId: getProcurementCase
    request:
      method: GET
      path: /procurement-cases/ADQ-2026-00123
    response:
      status: 200
      example_ref: adquisiciones.openapi.yaml#/components/examples/ProcurementCaseAgile
  - operationId: confirmProcurementModality
    request:
      method: POST
      path: /procurement-cases/ADQ-2026-00123/modality
      body: { selected_modality: public_tender }
    response:
      status: 422
      error_code: MODALITY_ALREADY_CONFIRMED
reset: nightly                    # política de reseteo del estado en sandbox
```

Reglas:

1. **IDs estables y documentados** — nunca cambian entre despliegues del sandbox; si un fixture se rediseña, se crea uno nuevo y el anterior se depreca con aviso (misma lógica que los contratos).
2. **Fuente única de examples:** el body de las respuestas vive en los `examples` de la OpenAPI; el fixture los referencia (`example_ref`), no los duplica. La CI verifica que la referencia exista.
3. **Datos 100% sintéticos** (Ley 21.719): tenants demo (`municipio-demo-norte`, `municipio-demo-sur`), personas ficticias con RUN de prueba, proveedores inventados. Ningún dato derivado de municipios reales, ni siquiera anonimizado.
4. **Cobertura mínima por módulo:** al menos un fixture por modalidad/macroproceso en estado intermedio, uno en estado terminal, y escenarios de error para cada regla bloqueante frecuente del catálogo QA.
5. **Alineación con prototipos:** los IDs de `sgm-prototipos/shared/expedientes-demo.js` se alinean con el catálogo (dirección de la corrección: el prototipo adopta los IDs del catálogo, no al revés).
6. `catalogo.md` es el índice navegable: tabla de fixtures con tenant, estado de negocio y uso principal.
7. **Cuándo crear o actualizar un fixture:** nueva operación `GET` de lectura del expediente; escenario de error bloqueante frecuente del catálogo QA; nuevo estado de negocio demostrable en sandbox o recepción.

### 14.3 Fixtures y recepción

Los fixtures cumplen doble función exigible en bases:

- **Para terceros:** tutorial ejecutable del sandbox — el portal de desarrollador los usa como guía de inicio.
- **Para SUBDERE:** casos de prueba de recepción — la contraparte técnica reproduce cada fixture contra el ambiente de recepción y verifica `{b}` conforme a OpenAPI. Cumple o no cumple.

## 15. Orden de adopción (piloto Adquisiciones)

1. ~~Derivar OpenAPI de Adquisiciones de `contracts.md` + `entidades-core.md`, empezando por lecturas del expediente.~~ *(Hecho — seccionada en `modulos/adquisiciones/openapi/`.)*
2. ~~Crear `arquitectura/especificacion/openapi/comunes.yaml` con error, paginación y seguridad.~~ *(Hecho.)*
3. ~~Escribir fixtures del catálogo con este formato.~~ *(Hecho — ver `modulos/adquisiciones/fixtures/`.)*
4. Montar la validación de CI (**P-53**).
5. Completar/replicar en el contrato del core (**P-48**) y luego en los demás módulos.

## 16. Pendientes y referencias

Pendientes que anclan este documento: **P-02**, **P-03**, **P-04**, **P-53** (y **P-48** para el core). Catálogo completo: [`pendientes.md`](../decisiones/pendientes.md).

- Mandato API y metodología de contratos: [`contrato-api-first.md`](./contrato-api-first.md)
- Modelo de entregable y sandbox: [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md)
- Plantilla de documentación (ubicación OpenAPI/fixtures): [`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) §4.1
- Core de plataforma: [`plataforma-core.md`](./plataforma-core.md)
- Latencia, SLOs y clasificación de validaciones: [`musts-arquitectura.md`](./musts-arquitectura.md)
- Componentes OpenAPI compartidos: [`openapi/comunes.yaml`](./openapi/comunes.yaml)
