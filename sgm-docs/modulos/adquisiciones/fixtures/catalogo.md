# Catálogo de fixtures — Adquisiciones

Índice de estados de negocio reproducibles en el sandbox. Formato: [`estandares-api.md`](../../arquitectura/estandares-api.md) Parte II §14.

| Fixture ID | Tenant | Modalidad | Estado de negocio | Uso principal | Reset |
|---|---|---|---|---|---|
| [ADQ-2026-00123](ADQ-2026-00123.yaml) | `municipio-demo-norte` | Compra Ágil | Post etapa 2; etapa 3 pendiente | Tutorial integrador; `getProcurementCase` | nightly |
| [ADQ-2026-00089](ADQ-2026-00089.yaml) | `municipio-demo-norte` | Convenio Marco | Post etapa 2; etapa 3 pendiente | Variante modalidad CM | nightly |
| [ADQ-2026-00045](ADQ-2026-00045.yaml) | `municipio-demo-sur` | Licitación Pública | Demo transversal finalizado | Lectura estado terminal | nightly |
| [ADQ-2026-00012](ADQ-2026-00012.yaml) | `municipio-demo-sur` | Trato Directo | Post etapa 2; etapa 3 pendiente | Causal y resolución fundada | nightly |
| [escenarios-transaccionales](escenarios-transaccionales.yaml) | ambos tenants | Varias | Escrituras y errores de dominio | Pruebas POST y recepción | nightly |

Alineación con prototipos: IDs coinciden con `sgm-prototipos/shared/expedientes-demo.js`.

OpenAPI: [`../openapi/adquisiciones.openapi.yaml`](../openapi/adquisiciones.openapi.yaml) — mapa de fragmentos: [`../openapi/README.md`](../openapi/README.md)
