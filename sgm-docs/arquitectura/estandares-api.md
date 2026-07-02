# Estándares transversales del contrato API

> Documento normativo — arquitectura / contratos
> Estado: borrador. Aplica a todos los módulos del SGM por igual.
> Los `contracts.md` de cada módulo **referencian** este documento; no repiten estos estándares.
> Origen: sección 4 de [`contrato-api-first.md`](./contrato-api-first.md). Pendientes registrados en [`pendientes.md`](./pendientes.md).

---

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

**Nunca** un `400`/`422` sin cuerpo. La validación bloqueante vive en el servidor; el frontend solo la refleja.

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

## 5. Idempotencia

Las operaciones de escritura sensibles (creación de órdenes, devengados, pagos, compromisos presupuestarios) aceptan cabecera `Idempotency-Key` (UUID). Reintentos con la misma clave devuelven la misma respuesta sin duplicar efectos.

## 6. Multitenancy explícita en el contrato

**[PENDIENTE P-03]** Decidir si el tenant (municipio) viaja en la ruta (`/tenants/{tenant_id}/…`), en el token JWT, o ambos. Esta decisión afecta a todos los endpoints y debe resolverse antes del primer contrato definitivo.

Hasta resolverlo, los `contracts.md` documentan las rutas sin prefijo de tenant y marcan el pendiente.

## 7. Clasificación de validaciones entre módulos

Toda dependencia declarada en un `contracts.md` debe clasificarse según [`musts-arquitectura.md`](./musts-arquitectura.md) §5:

| Clase | Comportamiento |
|---|---|
| Síncrona bloqueante | La operación no procede sin respuesta del proveedor |
| Asíncrona | La operación procede; la validación confirma o revierte después |
| Cacheada | Se valida contra dato local con frescura declarada |

## 8. Autenticación y autorización

Dos planos distintos, ambos exigibles en las bases (detalle en [`contrato-api-first.md`](./contrato-api-first.md) §5):

| Plano | Mecanismo | Uso |
|---|---|---|
| Personas | Clave Única | Usuarios municipales operando vía frontend |
| Sistemas | OAuth2 client credentials (o equivalente) | Sistemas municipales consumiendo módulos M2M, con **scopes por módulo y por municipio** |

**[PENDIENTE P-02]** El plano M2M no existe en el diseño actual; especificarlo es prerequisito del modo à la carte.

Exigencias de seguridad de ambos planos: [`seguridad.md`](./seguridad.md) §2.

## 9. Referencias

- Mandato API y metodología de contratos: [`contrato-api-first.md`](./contrato-api-first.md)
- Plantilla de documentación de procesos: [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md)
- Latencia y SLOs: [`musts-arquitectura.md`](./musts-arquitectura.md)
- Pendientes de arquitectura: [`pendientes.md`](./pendientes.md)
