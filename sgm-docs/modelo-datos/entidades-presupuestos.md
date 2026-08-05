# Entidades — Presupuestos

**Estado:** stubs mínimos consumidos por Adquisiciones; especificación completa pendiente del plan [`modulos/presupuestos/plan-de-trabajo_presupuestos.md`](../modulos/presupuestos/plan-de-trabajo_presupuestos.md) (D-5, D-6, P-21…P-31).

Índice del modelo: [`entidades-core.md`](entidades-core.md).

## Dependencias ya referenciadas desde Adquisiciones

Estas entidades (o refs) aparecen en el ciclo SOLPED→Pago y deberán definirse formalmente aquí:

| Entidad / concepto | Uso desde Adquisiciones | Nota |
|---|---|---|
| `BudgetLine` | Imputación / cuenta (`proposed_budget_line_id`, resolución 1.3, CDP, preobligación) | Clave de negocio = **cuenta × nodo de gestión** (D-5). Label: **imputación presupuestaria**. Solo cuentas `DETALLE` admiten imputación (**[PENDIENTE P-25]**). |
| `ManagementArea` | Catálogo nacional del eje de gestión (seis valores BEP) | D-5 |
| `ManagementNode` | Árbol local PROGRAM / SUBPROGRAM / PROJECT / ACTIVITY; SOLPED propone hoja; 1.3/CDP resuelve | D-5, D-6; `listManagementNodes` |
| `BudgetAvailabilityCertificate` (CDP) | Emisión / firma en 1.5 | Definición **provisional** en [`entidades-adquisiciones.md`](entidades-adquisiciones.md) |
| `BudgetPreCommitment` | Preobligación 1.6 | Idem, provisional en Adquisiciones |
| `BudgetCommitment` | Compromiso cierto (OC aceptada) | Idem, provisional en Adquisiciones |

### Campos mínimos de `BudgetLine` consumidos por Adquisiciones (provisional)

| Campo | Label (ES) | Uso en Adq |
|---|---|---|
| `id` | Identificador | `proposed_budget_line_id`, resolución 1.3, CDP, preobligación |
| `code` | Código / clasificador | Texto del selector (ej. `22.01.03`) |
| `description` | Descripción de la cuenta | Solo lectura al seleccionar (`getBudgetLine`) |
| `available_balance` | Saldo disponible | Orientativo vía `previewBudgetAvailability` / `checkBudgetAvailability` |
| `management_node_id` | Nodo de gestión | Ref. `ManagementNode` — parte de la clave cuenta × nodo (**[PENDIENTE P-21]**) |

### `ManagementArea` (stub)

Catálogo nacional de áreas de gestión del gasto municipal (seis valores del BEP). Ver plan Presupuestos §5.3 / D-5.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `id` | Identificador | texto | **Obligatorio** |
| `code` | Código | texto | **Obligatorio** |
| `name` | Nombre | texto | **Obligatorio** (ej. Gestión Interna) |

### `ManagementNode` (stub)

Árbol recursivo local del eje de gestión. Niveles tipados: `PROGRAM` \| `SUBPROGRAM` \| `PROJECT` \| `ACTIVITY`. Profundidad variable por rama. **Solo nodos hoja** admiten imputación (D-5). El nivel `PROJECT` **no** es `InvestmentInitiative` del subtítulo 31.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `id` | Identificador | texto | **Obligatorio** |
| `code` | Código | texto | **Obligatorio** — convención municipal (**[PENDIENTE P-27]**) |
| `name` | Nombre | texto | **Obligatorio** |
| `level` | Nivel | enum | **Obligatorio**: `PROGRAM` \| `SUBPROGRAM` \| `PROJECT` \| `ACTIVITY` |
| `parent_id` | Nodo padre | ref. `ManagementNode` | **Opcional** en raíz bajo área; obligatorio en niveles inferiores |
| `management_area_id` | Área de gestión | ref. `ManagementArea` | **Obligatorio** — ancla al catálogo nacional |
| `is_leaf` | Es hoja | booleano | **Obligatorio** — solo hoja imputable |
| `path_label` | Ruta (derivada) | texto | **Opcional en lectura** — Área › … › Actividad para UI |

Operación de borde hacia Adq: `listManagementNodes` (cacheada; listado jerárquico / hojas del ejercicio). **No** filtrar por unidad organizacional en SOLPED 1.1; pre-sugerencia unidad→nodo en 1.3 — **[PENDIENTE P-23]**.

No inventar el resto del modelo de Presupuestos aquí.
