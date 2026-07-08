# Wireframe: Ratificación o selección de modalidad

**Sub-paso:** 2.1 — Ratificación o selección de modalidad
**Operaciones:** `confirmProcurementModality` · Dependencias: `getUtmValue` (SII, cacheada), `checkCatalogAvailability` (catálogo CM espejado, cacheada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Ratificación de modalidad         [Pendiente]    |
+----------------------------------------------------------------+
| [Datos SOLPED — solo lectura]                                   |
| Unidad: Unidad Solicitante | Monto total estimado: $ 1.250.000   |
| Modalidad indicada en SOLPED (1.1): Compra Ágil (provisional)    |
+----------------------------------------------------------------+
| Modalidad a ratificar/seleccionar *                             |
| ( ) Compra Ágil  ( ) Convenio Marco  ( ) Licitación Pública      |
| ( ) Trato Directo                                                |
|                                                                   |
| Valor UTM del mes: $ 65.084 (cacheado, fuente SII)               |
| Equivalente del monto en UTM: 19,21 UTM                          |
|                                                                   |
| [ ] ¿Ítem disponible en catálogo Convenio Marco? (demo, V2)      |
+----------------------------------------------------------------+
| Resultado del gateway de validación (V1–V8)                     |
| +----+--------------------------------+----------+-------------+ |
| | #  | Regla                          | Resultado| Severidad   | |
| +----+--------------------------------+----------+-------------+ |
| | V1 | Monto ≤ 100 UTM (Compra Ágil)  | OK       | blocking    | |
| | V2 | CM primera opción si aplica    | N/A      | blocking    | |
| | V3 | TD requiere causal + Res. Fund.| N/A      | blocking    | |
| | V4 | Monto > 100 UTM sin CM → LP    | N/A      | advisory    | |
| | V5 | TD > 8.000 UTM → Toma de Razón | N/A      | advisory    | |
| | V6 | Fraccionamiento sospechado     | Sin datos| advisory    | |
| | V7 | Tramo LP + plazo mínimo        | N/A      | advisory    | |
| | V8 | Garantías exigibles (LP)       | N/A      | advisory    | |
| +----+--------------------------------+----------+-------------+ |
+----------------------------------------------------------------+
| Causal de Trato Directo * (solo si TD)          [oculto]         |
| [________________________________________________]              |
|                                                                   |
| Justificación bypass catálogo CM * (solo si aplica V2) [oculto] |
| [________________________________________________]              |
+----------------------------------------------------------------+
| [ ] ¿Solicitar aprobación de jefatura antes de continuar?        |
|     (sub-paso 2.2 — optativo, ver nota)                          |
+----------------------------------------------------------------+
| [ Cancelar ]                          [ Confirmar modalidad ]    |
+----------------------------------------------------------------+
| Tras confirmar → Continuar a 2.2 (si se marcó) o a 2.3            |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Modalidad a ratificar/seleccionar | `ModalityDecision.selected_modality` |
| (derivado) ¿Coincide con SOLPED? | `ModalityDecision.ratified` |
| Justificación bypass catálogo CM | `ModalityDecision.catalog_bypass_justification` |
| Causal de Trato Directo | `ModalityDecision.direct_procurement_cause` |
| Resultado del gateway (tabla V1–V8) | `ModalityDecision.validation_results` (JSON) |
| Valor UTM del mes | `UtmValue.value_clp` |
| Umbrales V1/V5/V7/V8 | `NormativeParameter` (`AGILE_PURCHASE_UTM_LIMIT`, `COMPTROLLER_REVIEW_UTM_LIMIT`, `TENDER_TIER_THRESHOLDS`, `GUARANTEE_THRESHOLDS`) |
| ¿Solicitar aprobación de jefatura? | `ModalityDecision.requires_jefatura_approval` |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Confirmar modalidad | `confirmProcurementModality` | `getUtmValue` (SII), `checkCatalogAvailability` (catálogo CM) |
| Cambiar selección de modalidad | — (recalcula gateway en cliente antes de confirmar) | — |
| Checkbox "ítem en catálogo CM" *(solo demo)* | — (ilustra V2, no existe en la ficha como control de usuario) | `checkCatalogAvailability` |

## Estados de pantalla

- **Normal:** modalidad de SOLPED preseleccionada; gateway recalcula en vivo al cambiar selección o monto.
- **Bloqueado (V1/V2/V3):** botón "Confirmar modalidad" deshabilitado y fila de la regla en rojo con `error_code`.
- **UTM no disponible:** banner `UTM_VALUE_UNAVAILABLE`; gateway no puede evaluar V1 (bloqueante) — ver edge case en la ficha.
- **Catálogo desactualizado:** advertencia `CATALOG_STALE` con fecha del último delta (no bloquea).
- **Confirmado:** pantalla pasa a solo lectura, muestra `CaseStep[]` instanciados para la modalidad, y ofrece un enlace "Continuar" hacia 2.2 (si se marcó la casilla de aprobación) o directo a 2.3 (si no).

## Validaciones visibles

- V1 bloqueante: Compra Ágil no seleccionable si el monto supera el umbral vigente de `NormativeParameter`.
- V2 bloqueante sin justificación: ítem en catálogo CM y modalidad distinta de Convenio Marco.
- V3 bloqueante: Trato Directo sin causal + Resolución Fundada adjunta (heredada de 1.1 o cargada aquí).
- V4/V5/V7/V8 asesoras: informan, no bloquean — Licitación Pública nunca se bloquea (vía general de la Ley 19.886).
- Cambio de modalidad respecto a la indicada en SOLPED (1.1) queda registrado en auditoría (`ratified = false`).

## Notas

- El gateway completo (V1–V8) y sus umbrales configurables (`NormativeParameter`) están descritos en `procesos-transversales/2-modalidad-compra.md` §2.1.
- **[PENDIENTE P-34]** Este formulario no expone edición de una `ModalityDecision` ya confirmada — la reversión post-confirmación requiere flujo aparte, aún sin definir.
- **[PENDIENTE P-37]** Los valores exactos de `NormativeParameter` (tramos LP, umbrales de garantía) mostrados aquí son ilustrativos — pendientes de carga inicial verificada contra norma vigente.
- Al confirmar, el sistema instancia dinámicamente los `CaseStep` del subproceso de la modalidad seleccionada (visible en el expediente, no en este formulario).
- La casilla "¿Solicitar aprobación de jefatura?" operacionaliza como decisión por expediente el sub-paso 2.2, mientras su existencia formal no se ratifique con la DM (**[PENDIENTE P-38]**) — no reemplaza esa ratificación, solo permite ejercitar ambos caminos del flujo hoy.
