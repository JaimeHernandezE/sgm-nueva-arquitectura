# Capa analítica de Adquisiciones: catálogo semántico y contrato de consulta

> Documento de trabajo — módulo Adquisiciones / analítica
> Estado: borrador para discusión interna (julio 2026). Documento del módulo Adquisiciones.
> Origen: decisión de incluir un dashboard de resumen configurable para municipios. El **diseño del dashboard es entregable del adjudicatario**; lo que este documento especifica es la capa que lo hace posible: qué datos agregados existen, qué significan y cómo se consultan.
> Pendientes registrados en [`pendientes.md`](../../arquitectura/decisiones/pendientes.md).

---

## 1. Propósito y alcance

Los municipios necesitan analizar su gestión de compras sin depender de reportes fijos: cruzar modalidad con unidad, montos con períodos, tiempos de ciclo con etapas. La respuesta de especificación **no es diseñar el dashboard** — es publicar un **catálogo semántico** (dimensiones y medidas con definición exacta) y un **contrato de consulta agregada** sobre ese catálogo.

Aplicación directa del criterio de nivel de detalle (`entregable-licitacion.md` §3):

| Pieza | Tratamiento |
|---|---|
| Definición de dimensiones y medidas (§3–§4) | **Especificación completa de SUBDERE.** Redefinir una medida ya publicada invalida comparaciones históricas — no es corregible de forma aditiva |
| Contrato de consulta (§5) | Especificación completa de la interfaz; implementación interna libre |
| Diseño visual, widgets, interacción del dashboard | **Del adjudicatario**, recibido contra propiedades (§8); wireframe y prototipo solo como referencia UX |
| Nuevas dimensiones o medidas futuras | Corregible en operación: se agregan de forma aditiva bajo versionamiento del contrato |

Consumidores previstos del mismo contrato: el dashboard del frontend base, los terceros de la categoría reportería del ecosistema (`decisiones-macro-stack.md` §7.1) y los sistemas propios de municipios en modo à la carte. **Un solo contrato para todos** — el dashboard base no tiene privilegios (paridad de acceso).

## 2. Principios

1. **Consume de la capa de lectura, nunca de la transaccional** (`musts-arquitectura.md` §4). Toda respuesta declara su frescura (§6).
2. **Catálogo cerrado y publicado.** Solo se puede consultar lo que el catálogo declara; el catálogo es parte del contrato del módulo y se versiona con él.
3. **Mono-tenant.** Este contrato agrega datos de un municipio. La reportería nacional cruzada (SUBDERE, SINIM) es otro consumidor de la capa de lectura con scope propio — fuera del alcance de este documento. SINIM no es integración de credenciales ni almacenamiento documental (C10).
4. **Toda medida tiene definición exacta y fecha ancla declarada** (§4). Una cifra sin definición auditable no entra al catálogo.
5. **Agregados sin datos personales.** Los resultados son cifras agregadas; las dimensiones que identifican personas naturales se restringen (§7).

## 3. Catálogo de dimensiones (v0 propuesta)

Derivadas de las entidades existentes en `entidades-core.md`. Toda dimensión referencia su campo canónico:

| Dimensión | Fuente canónica | Valores | Estado |
|---|---|---|---|
| `period` | Fecha ancla de la medida (§4), truncada a mes/trimestre/año | `2026-03`, `2026-Q1`, `2026` | Propuesta |
| `modality` | `ProcurementCase.procurement_type` | Compra Ágil, Convenio Marco, Licitación Pública, Trato Directo | Firme |
| `case_status` | `ProcurementCase.status` | Estados del expediente | Firme |
| `current_step` | `CaseStep` activo del expediente | Etapas 1–5 y sub-pasos | Firme |
| `requesting_unit` | `PurchaseRequest.requesting_unit` → `OrganizationalUnit` | Unidades del municipio | Depende de **P-49** |
| `supplier` | Proveedor de la OC | RUT/razón social | Restricción §7 |
| `amount_bracket` | Monto del expediente contra tramos de `NormativeParameter` | Tramos vigentes a la fecha ancla | Propuesta — ver punto a resolver §9.4 |
| `budget_line` | `BudgetLine` asociada (vía preobligación) | Clasificador presupuestario | Propuesta |
| `item_category` | Rubro/categoría de las líneas | ⚠ | **No existe campo canónico de rubro en el modelo actual** — ver §9.5 |

## 4. Catálogo de medidas (v0 propuesta)

Cada medida declara: definición exacta, entidad/campo fuente, **fecha ancla** (a qué fecha se atribuye la cifra al agrupar por `period`) y estado.

### 4.1 Medidas de volumen y estado

| Medida | Definición | Fecha ancla | Estado |
|---|---|---|---|
| `case_count` | N° de expedientes (`ProcurementCase`) | Creación del expediente | Firme |
| `cases_by_status` | N° de expedientes cuyo estado actual es X | — (foto al momento de consulta) | Firme |
| `solped_count` | N° de `PurchaseRequest` por estado (borrador, aprobada, rechazada) | Creación de la SOLPED | Firme |
| `pending_actions` | N° de `CaseStep` activos con responsable asignado, agrupables por unidad | — (foto) | Propuesta |

### 4.2 Medidas financieras

| Medida | Definición | Fecha ancla | Estado |
|---|---|---|---|
| `amount_requested` | Suma de montos estimados de SOLPEDs | Aprobación SOLPED | Propuesta |
| `amount_precommitted` | Suma de `BudgetPreCommitment` vigentes | Emisión de la preobligación | Propuesta |
| `amount_committed` | Suma de montos de OC emitidas | Emisión de la OC | Propuesta |
| `amount_accrued` | Suma de devengados | ⚠ | **Bloqueada por P-46** — dos definiciones de devengado no reconciliadas; esta medida no se publica hasta resolverlo (§9.1) |
| `amount_paid` | Suma de pagos materializados | Fecha de pago | Propuesta — depende de la frontera Pago/Tesorería (**P-47**) |

⚠ **Regla de integridad:** las medidas financieras de distintas fases (solicitado → preobligado → comprometido → devengado → pagado) forman un embudo; el catálogo debe declarar explícitamente por qué pueden no cuadrar entre sí (desviaciones de monto —pendiente transversal de tolerancias—, cancelaciones, regularizaciones **P-40**). Sin esa nota, todo tablero generará la pregunta "¿por qué no suman lo mismo?" y erosionará confianza.

### 4.3 Medidas de desempeño

| Medida | Definición | Fecha ancla | Estado |
|---|---|---|---|
| `cycle_time_total` | Días corridos entre creación del expediente y pago (solo expedientes terminados) | Cierre del expediente | Propuesta |
| `cycle_time_by_step` | Días por `CaseStep` (entrada → salida del paso), desde sus timestamps ya exigidos por `musts-arquitectura.md` §10.2 | Cierre del paso | Propuesta |
| `on_time_rate` | % de pasos cerrados dentro del plazo configurado | Cierre del paso | ⚠ Depende de timers configurables (**P-33**): sin plazo definido no hay "a tiempo" |
| `rejection_rate` | % de SOLPEDs / decisiones de modalidad rechazadas en aprobación | Fecha del rechazo | Propuesta |

**Candidatas futuras, no v0:** concentración de proveedores e indicador de fraccionamiento (conecta con la regla V6 del gateway y **P-35**) — valiosas pero sensibles; requieren definición con DM/jurídica antes de exponerlas como cifra oficial.

## 5. Contrato de consulta agregada (propuesta)

Una operación genérica sobre el catálogo cerrado, en el `contracts.md` del módulo y su OpenAPI según [`estandares-api.md`](../../arquitectura/especificacion/estandares-api.md) Parte II:

```
GET /analytics/procurement-cases
    ?metrics=case_count,amount_committed
    &group_by=modality,period
    &period_granularity=month
    &filters[case_status]=in_progress
    &filters[period]=2026-01..2026-06
```

Respuesta (esquema estable, independiente del cruce pedido):

```json
{
  "metrics": ["case_count", "amount_committed"],
  "group_by": ["modality", "period"],
  "freshness": { "as_of": "2026-07-10T06:00:00Z", "max_lag_declared": "PT6H" },
  "rows": [
    { "modality": "agile_purchase", "period": "2026-03",
      "case_count": 41, "amount_committed": 18734500 }
  ],
  "warnings": []
}
```

Reglas del contrato:

1. Solo acepta dimensiones y medidas del catálogo; combinación desconocida → error estructurado (`UNKNOWN_METRIC`, `UNKNOWN_DIMENSION`) según `estandares-api.md` §3.
2. **Límites declarados:** máximo de dimensiones por consulta, máximo de filas de respuesta, rangos de período acotados. Protegen la capa de lectura de consultas patológicas y hacen la operación testeable en carga (`musts-arquitectura.md` §7).
3. `warnings` transporta avisos no bloqueantes (ej. medida con datos parciales en el período).
4. Un endpoint hermano `GET /analytics/catalog` publica el catálogo vigente (dimensiones, medidas, definiciones, fecha ancla) en formato máquina-legible — es lo que permite a un dashboard **configurable** construir su UI de cruces sin hardcodear el catálogo.

## 6. Frescura

Toda respuesta declara `as_of` (a qué momento corresponde el dato) y el contrato declara el retraso máximo comprometido. El valor exacto es **P-08** (un tablero DAF probablemente exige más frescura que SINIM); lo no negociable es que la frescura sea **visible en el dashboard** — una cifra sin "actualizado a las HH:MM" genera decisiones sobre datos que no son lo que el usuario cree.

## 7. Seguridad y visibilidad

1. **Scope propio de lectura analítica** (plano personas y M2M), distinto del scope transaccional — un tercero de reportería obtiene agregados sin acceso a expedientes individuales.
2. **Tenant siempre implícito:** ninguna consulta cruza municipios.
3. **Visibilidad por rol:** ⚠ punto a resolver (§9.3) — ¿un usuario de una unidad solicitante ve agregados de todo el municipio o solo de su unidad? La decisión afecta el contrato (filtro forzado por rol) y debe ser consistente con el catálogo RBAC (**P-24**).
4. **Personas naturales:** la dimensión `supplier` se expone solo para proveedores persona jurídica en v0; el tratamiento de proveedores persona natural queda sujeto al catastro de datos personales (**P-27**, Ley 21.719).

## 8. Relación con dashboard, wireframe y prototipo

1. El prototipo (`sgm-prototipos/`) incluirá **un ejemplo** de dashboard — referencia UX, no especificación, igual que el resto del prototipo.
2. El wireframe del ejemplo sigue la regla de `plantilla-maestra-sgm.md` §7 adaptada: **cada widget del ejemplo se anota con la consulta del contrato que lo alimenta** (medidas, cruces, filtros) — equivalente analítico de "todo botón mapea a una operación".
3. Exigencia de bases para el dashboard del adjudicatario (propiedades, no diseño): construido exclusivamente sobre `GET /analytics/*`; cruces configurables por el usuario desde el catálogo publicado (`/analytics/catalog`); frescura visible; exportación de cualquier vista (CSV como mínimo); sin consultas privilegiadas fuera del contrato.
4. **Fixtures analíticos:** el catálogo de fixtures del sandbox incluye un tenant demo con volumen suficiente y agregados conocidos y documentados (ej. "municipio-demo-norte tiene 41 expedientes CA en marzo 2026 por $18.734.500"), para que un tercero verifique sus dashboards contra cifras esperadas.

## 9. Puntos a resolver

| # | Punto | Por qué importa | Contraparte |
|---|---|---|---|
| **9.1 [PENDIENTE P-54]** | Definiciones exactas de las medidas financieras del embudo (solicitado → pagado), incluida la nota de integridad de §4.2. `amount_accrued` bloqueada hasta reconciliar el devengado (**P-46**); `amount_paid` sujeta a la frontera Pago/Tesorería (**P-47**) | Son las cifras que mirarán alcaldía y concejo; una definición ambigua convierte el dashboard en fuente de conflicto en vez de gestión | Contabilidad / DM / Finanzas |
| **9.2 [PENDIENTE P-55]** | Decisión de forma del contrato: operación genérica única (§5) vs. set de consultas predefinidas parametrizables, y calibración de los límites (dimensiones máx., filas máx., rangos) | Afecta rendimiento exigible, pruebas de carga y flexibilidad del ecosistema; propuesta de trabajo: genérica sobre catálogo cerrado con límites | Interna (arquitectura) |
| **9.3 [PENDIENTE P-56]** | Visibilidad de agregados por rol: municipio completo vs. propia unidad, y si montos de otras unidades son visibles para una unidad solicitante | Cambia el contrato (filtros forzados por rol) y el diseño RBAC; en municipios chicos el agregado "anónimo" de una unidad de 2 personas no anonimiza nada | DM / pilotos, junto a **P-24** |
| **9.4** | `amount_bracket` con parámetros de vigencia temporal: ¿el tramo se calcula con la norma vigente a la fecha del expediente o a la fecha de consulta? Propuesta: fecha del expediente (consistente con histórico inmutable de `NormativeParameter`) | Sin regla, dos consultas del mismo período darían tramos distintos tras un cambio normativo | Interna — resoluble junto a **P-37** |
| **9.5** | Categoría de bien/servicio (`item_category`): no existe campo canónico de rubro en el modelo. ¿Se adopta el clasificador de Mercado Público (Rubro/ONU-SPSC), el presupuestario, o ambos? | Es el cruce que más pedirán los municipios ("cuánto gastamos en combustible") y hoy no se puede responder | DM; conecta con catálogo CM y **P-42** |
| **9.6** | Frescura comprometida de la capa analítica | Ya registrado como **P-08**; este documento agrega el caso de uso dashboard municipal a su calibración | Interna / pilotos |
| **9.7** | Medidas sensibles futuras (concentración de proveedores, señal de fraccionamiento): si se publican como cifra oficial del catálogo o quedan como herramienta interna de control | Exponer una "señal de fraccionamiento" en un dashboard tiene efectos administrativos y jurídicos que exceden la analítica | Jurídica / DM, junto a **P-35** |

Nuevos pendientes formales para el registro: **P-54** (9.1), **P-55** (9.2), **P-56** (9.3). Los puntos 9.4–9.7 se resuelven dentro de pendientes existentes o en este documento.

## 10. Referencias

- [`entregable-licitacion.md`](../../arquitectura/licitacion/entregable-licitacion.md) — criterio de nivel de detalle (§3) y modelo de entregable
- [`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) — §4 capa de lectura, §7 carga, §10 estados consultables
- [`estandares-api.md`](../../arquitectura/especificacion/estandares-api.md) Parte II — formato de la spec y fixtures analíticos
- [`decisiones-macro-stack.md`](../../arquitectura/decisiones/decisiones-macro-stack.md) — §7.1 categoría reportería del ecosistema
- [`seguridad.md`](../../arquitectura/especificacion/seguridad.md) — scopes, RBAC, datos personales
- [`plataforma-core.md`](../../arquitectura/especificacion/plataforma-core.md) — parámetros normativos con vigencia temporal
- `modelo-datos/entidades-core.md` — fuente canónica de dimensiones y medidas
