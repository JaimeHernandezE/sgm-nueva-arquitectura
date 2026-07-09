# Estándar OpenAPI y catálogo de fixtures

> Documento normativo — arquitectura / contratos
> Estado: borrador. Aplica a todos los módulos del SGM por igual; Adquisiciones es el piloto de adopción.
> Cierra las brechas 2 y 4 de [`entregable-licitacion.md`](./entregable-licitacion.md) §9: cómo se escribe la OpenAPI de un módulo y cómo se documentan los fixtures del sandbox. Los `contracts.md` siguen siendo la vista funcional; este documento define su contraparte técnica formal.
> Pendientes registrados en [`pendientes.md`](./pendientes.md).

---

## 1. Ubicación y estructura de archivos

```
sgm-docs/
├── arquitectura/
│   └── openapi/
│       └── comunes.yaml          # componentes compartidos (errores, paginación, seguridad)
└── modulos/
    └── <módulo>/
        ├── contracts.md          # vista funcional (ya normada)
        ├── openapi/
        │   └── <módulo>.openapi.yaml
        └── fixtures/
            ├── catalogo.md       # índice de fixtures con estado de negocio
            └── <FIXTURE-ID>.yaml # un archivo por fixture
```

- **Una especificación OpenAPI por módulo**, versión OpenAPI **3.1**, en YAML.
- Los componentes transversales (esquema de error de `estandares-api.md` §3, envoltorio de paginación §4, esquemas de seguridad §8) viven **una sola vez** en `arquitectura/openapi/comunes.yaml` y se referencian vía `$ref`. Ningún módulo los redefine — misma regla anti-duplicación que rige entre `contracts.md` y `estandares-api.md`.
- El core de plataforma ([`plataforma-core.md`](./plataforma-core.md)) tiene su propia OpenAPI bajo la misma estructura (`plataforma/openapi/`).

## 2. Convenciones de nomenclatura

Extienden las convenciones ya adoptadas del modelo de datos (`plantilla-maestra-sgm.md` §6):

| Elemento | Convención | Ejemplo |
|---|---|---|
| Rutas | kebab-case, recursos en plural | `/procurement-cases/{case_id}/steps` |
| `operationId` | camelCase, **idéntico al nombre de la operación en `contracts.md`** | `getProcurementCase` |
| Esquemas (`components.schemas`) | PascalCase, **idéntico al nombre de entidad en `entidades-core.md`** | `ProcurementCase` |
| Campos | snake_case, idénticos al modelo de datos | `procurement_case_id` |
| Parámetros de ruta | snake_case con sufijo `_id` o el identificador de negocio | `{case_id}`, `{folio}` |
| Códigos de error | `SCREAMING_SNAKE_CASE`, registrados en el esquema común | `BUDGET_UNAVAILABLE` |
| `tags` | Una por etapa del macroproceso o área funcional | `solped`, `modalidad-compra` |

La identidad de nombres entre `contracts.md`, `entidades-core.md` y OpenAPI no es estilo: es lo que permite verificar consistencia de forma automática (§5) y lo que sostiene la regla de resolución de discrepancias de `estandares-api.md` §1.

**Multitenancy:** hasta resolver **[P-03]**, las rutas se documentan sin prefijo de tenant y la spec incluye el comentario estándar `# P-03: tenant pendiente (ruta/token)` en `servers`. Resuelto P-03, la corrección es un cambio mecánico en un solo lugar por spec.

## 3. Extensiones obligatorias de trazabilidad

Cada operación lleva extensiones `x-` que preservan la trazabilidad proceso ↔ contrato exigida en `plantilla-maestra-sgm.md` §4:

| Extensión | Contenido | Obligatoria |
|---|---|---|
| `x-subpasos` | Sub-paso(s) de ficha donde se origina la operación (`["1.1", "3.2"]`) | Sí |
| `x-validation-class` | Para dependencias invocadas: `sync-blocking` / `async` / `cached` (`musts-arquitectura.md` §5) | Si la operación invoca dependencias |
| `x-legal-reference` | Ancla normativa de las reglas que la operación valida | Cuando aplique |
| `x-emits` | Eventos de dominio que la operación emite (`["PurchaseOrderIssued"]`) | Si emite |

## 4. Contenido mínimo por operación

Toda operación publicada debe incluir:

1. **`summary` y `description`** en español funcional (el público incluye contrapartes no técnicas); nombres técnicos en inglés.
2. **Esquema completo de request y response** con obligatoriedad explícita (`required`) — misma regla de oro que los campos de ficha: prohibido un campo sin obligatoriedad declarada.
3. **Todas las respuestas de error de dominio posibles**, cada una con su `error_code` estable, referenciando el esquema común. Nunca un `4xx` documentado sin cuerpo.
4. **Al menos un `example` de éxito y uno por cada error de dominio frecuente.** Los examples de operaciones cubiertas por fixtures usan los **IDs del catálogo de fixtures** (§6) — un integrador copia el example, lo ejecuta contra el sandbox y obtiene la misma respuesta. Esa es la definición operativa de la paridad `{a}` → `{b}` de `entregable-licitacion.md` §5.
5. **`security`** declarando el plano aplicable (personas / M2M) y scopes, según `estandares-api.md` §8.
6. **Paginación, filtrado y orden** en colecciones según la convención única de `estandares-api.md` §4, referenciando los componentes comunes.

## 5. Regla de sincronización y validación

1. **Correspondencia biunívoca:** toda operación de `contracts.md` §2 existe como `operationId` en la OpenAPI del módulo, y viceversa. Toda entidad expuesta en `contracts.md` §1 existe como esquema. Un endpoint en OpenAPI sin entrada en `contracts.md` es un **endpoint no documentado** — exactamente lo que las bases prohíben al adjudicatario; el repo se somete a su propia regla.
2. **Resolución de discrepancias:** según `estandares-api.md` §1 — se resuelve antes de dar por cerrado cualquiera de los dos. El código (del adjudicatario) se valida contra OpenAPI, no al revés.
3. **Validación automática en el repo:** lint de la spec (reglas de nomenclatura §2, extensiones §3, contenido mínimo §4) y verificación de correspondencia con `contracts.md` como paso de CI de `sgm-docs`. **[PENDIENTE P-53]** Selección de tooling (linter de referencia: Spectral con reglas propias; verificación de examples contra fixtures) — herramienta interna del repo, no exigencia de bases.
4. **Versionamiento:** `info.version` sigue el semver del contrato (`estandares-api.md` §2). Un cambio MAJOR requiere entrada en la política de deprecación (**P-04**).

## 6. Catálogo de fixtures

### 6.1 Qué es un fixture

Un fixture es un **estado de negocio reproducible** en el sandbox: un conjunto de entidades sembradas con IDs estables, más las operaciones canónicas ejecutables sobre ese estado y sus respuestas esperadas. Los fixtures son un activo versionado del repositorio (`entregable-licitacion.md` D-06): se despliegan con el sandbox y se usan como material de las pruebas de recepción.

### 6.2 Formato del archivo de fixture

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
      example_ref: "#/components/examples/ProcurementCaseAgile"   # ref a la OpenAPI
  - operationId: confirmModality
    request:
      method: POST
      path: /procurement-cases/ADQ-2026-00123/modality
      body: { modality: public_tender }
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
6. `catalogo.md` es el índice navegable: tabla de fixtures con tenant, estado de negocio y uso principal — versión repo de la tabla propuesta en `entregable-licitacion.md` §7.

### 6.3 Fixtures y recepción

Los fixtures cumplen doble función exigible en bases:

- **Para terceros:** tutorial ejecutable del sandbox — el portal de desarrollador los usa como guía de inicio.
- **Para SUBDERE:** casos de prueba de recepción — la contraparte técnica reproduce cada fixture contra el ambiente de recepción y verifica `{b}` conforme a OpenAPI. Cumple o no cumple.

## 7. Orden de adopción (piloto Adquisiciones)

1. Derivar `adquisiciones.openapi.yaml` de `contracts.md` + `entidades-core.md`, empezando por las operaciones de lectura del expediente (prerequisito según `entregable-licitacion.md` §5.3).
2. Crear `arquitectura/openapi/comunes.yaml` con error, paginación y seguridad.
3. Escribir los cuatro fixtures propuestos en `entregable-licitacion.md` §7 con este formato.
4. Montar la validación de CI (**P-53**).
5. Replicar en el contrato del core (**P-48**) y luego en los demás módulos.

## 8. Pendientes y referencias

Nuevo: **P-53** (tooling de validación CI de OpenAPI y fixtures). Relacionados: P-02, P-03, P-04 (afectan `security`, rutas y versionamiento de las specs).

- [`estandares-api.md`](./estandares-api.md) — estándares transversales que esta spec formaliza
- [`contrato-api-first.md`](./contrato-api-first.md) — vista funcional de contratos
- [`entregable-licitacion.md`](./entregable-licitacion.md) — modelo de entregable y sandbox
- [`plataforma-core.md`](./plataforma-core.md) — contrato del core bajo el mismo estándar
- [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md) — convenciones de fichas y modelo de datos
