# Catálogo de fixtures — Adquisiciones

Índice de estados de negocio reproducibles en el sandbox. Formato: [`estandares-api.md`](../../arquitectura/especificacion/estandares-api.md) Parte II §14.

| Fixture ID | Tenant | Modalidad | Estado de negocio | Uso principal | Reset |
|---|---|---|---|---|---|
| [ADQ-2026-00123](ADQ-2026-00123.yaml) | `municipio-demo-norte` | Compra Ágil | Post etapa 2; etapa 3 pendiente | Tutorial integrador; `getProcurementCase` | nightly |
| [ADQ-2026-00142](ADQ-2026-00142.yaml) | `municipio-demo-norte` | Compra Ágil | Sin saldo; solo 1.4 activo | Camino `BUDGET_UNAVAILABLE` → financiamiento | nightly |
| [ADQ-2026-00089](ADQ-2026-00089.yaml) | `municipio-demo-norte` | Convenio Marco | Gran Compra activa en 3.5 | Variante modalidad CM | nightly |
| [ADQ-2026-00045](ADQ-2026-00045.yaml) | `municipio-demo-sur` | Licitación Pública | Demo transversal finalizado | Lectura estado terminal | nightly |
| [ADQ-2026-00012](ADQ-2026-00012.yaml) | `municipio-demo-sur` | Trato Directo | Etapa 3 en curso (vinculado 3.2; pendiente OC 3.3) | Causal, resolución fundada, doble validación | nightly |
| [escenarios-transaccionales](escenarios-transaccionales.yaml) | ambos tenants | Varias | Escrituras y errores de dominio | Pruebas POST y recepción | nightly |

Alineación con prototipos: IDs coinciden con `sgm-prototipos/shared/expedientes-demo.js`.

OpenAPI: [`../openapi/adquisiciones.openapi.yaml`](../openapi/adquisiciones.openapi.yaml) — mapa de fragmentos: [`../openapi/README.md`](../openapi/README.md)
