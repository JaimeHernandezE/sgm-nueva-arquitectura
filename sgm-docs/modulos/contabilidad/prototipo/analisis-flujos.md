# Contabilidad — análisis de flujos y prototipo navegable

Análisis de los diagramas de procesos de Contabilidad (carpeta [`../diagramas/`](../diagramas/), 6 archivos draw.io, 13 diagramas) y descripción del prototipo `sgm-prototipos/modulos/contabilidad/`. Revisado 22-09-2026.

> Documento de trabajo de levantamiento. No reemplaza al [plan de trabajo](../plan-de-trabajo-contabilidad.md) ni crea decisiones de arquitectura: los supuestos S1–S13 son propuestas a validar con Contabilidad municipal.

## 1. Inventario de flujos

| Flujo | Archivo | Nivel de detalle | Estado |
|---|---|---|---|
| Registro de preobligación (compromiso) | Registro de preobligacion.drawio | Proceso, 4 roles | Completo |
| Recepción conforme e inventario | proceso_inventario_Recepcion_Conforme.drawio | Proceso, 4 roles | Completo pero con conexiones ambiguas |
| Registro de obligaciones (devengado con OC) | registro_obligaciones.drawio | Proceso, 4 roles | Completo |
| Obligaciones sin OC (servicios básicos, arriendos) | Registro_obligaciones_sin_oc.drawio | Proceso, 4 roles | Completo |
| Egreso devengado en sistema (CED) | Contabilidad_Diagramas_SGM › 02- Registro Egreso devengado | **Pantalla/sistema** | El más detallado |
| Factoring (cesión de facturas) | Contabilidad_Diagramas_SGM › Factoring 2 | Proceso, DAF/Alcaldía/Tesorería | Decisión sin etiquetas |
| Conciliación bancaria | Contabilidad_Diagramas_SGM › Conciliación Bancaria | Proceso | Completo, simple |
| Inventario (baja de bienes) | Contabilidad_Diagramas_SGM › Inventario | Proceso | Simple |
| Ingreso devengado (orden de ingreso → CID) | Ingreso devengado e Ingreso Percibido › p.1 | **Pantalla/sistema** | Completo |
| Ingreso percibido | Ingreso devengado e Ingreso Percibido › p.2 | — | **Página vacía** |
| 02 Egreso devengado / 04 Registro de obligaciones | Contabilidad_Diagramas_SGM | Stub (Inicio → 1 tarea → Fin) | Reemplazados por los archivos separados |
| 06 Cierre mensual / 07 Cierre anual | Contabilidad_Diagramas_SGM | Stub | Por desarrollar |

## 2. El ciclo que describen (vista integrada)

**Ciclo del gasto** (etapas presupuestarias: disponibilidad → compromiso → devengado → pagado)

1. **Requerimiento** (Unidad solicitante) → **CDP** (Presupuesto/SECPLAN valida saldo; si no hay, devuelve o pide modificación).
2. **Compra** (DAF/Abastecimiento: licitación o trato directo) → **Decreto de adjudicación** → **Registro contable de preobligación/compromiso** → **Emisión OC** en Mercado Público.
3. **Recepción**: recepción física en bodega → cotejo con OC → V°B° técnico de la unidad → CRC en Mercado Público + verificación del DTE (o reclamo/rechazo) → clasificación NICSP (activo vs. gasto) y codificación de inventario.
4. **Match 3 vías** (OC + CRC + DTE) → **Expediente** → **Devengado**: en sistema se crea el **Comprobante de Egreso Devengado (CED)** desde el registro de compra; el sistema exige que la cuenta tenga configuradas sus "cuentas relacionadas" (contra egreso devengado / contra egreso pagado). CED: Borrador → revisar y cuadrar asiento → validar factura y recepción → Confirmado.
5. **Decreto de pago** (firma Alcaldía) → **Pago** en Tesorería → (si la factura fue cedida: suspender pago, decreto de cesión, rehacer decreto y pagar al cesionario).
6. **Conciliación bancaria** (libro banco vs. cartola, cheques, tarjetas) → revisión Revisor → autorización DAF → archivo.

Variante **sin OC** (servicios básicos, arriendos): DTE del proveedor → análisis técnico y V°B° → imputación y verificación de saldo → expediente → devengado → decreto de pago.

**Ciclo del ingreso**

1. **Orden de ingreso** (unidad emisora: Patentes, Permisos, etc.): departamento, fechas de vencimiento/pago, contribuyente (RUT), ítems y montos → Borrador → Confirmar.
2. Motor de reglas: si la auto-generación está activa, crea el **Comprobante de Ingreso Devengado (CID)** con correlativo y cuentas; si no, revisión y aprobación manual en Contabilidad/Tesorería.
3. CID Confirmado → **Ingreso percibido** al recepcionar el pago (flujo no dibujado).

## 3. Modelo de datos que se desprende

- **Maestros**: Plan de cuentas (con código CGR, p. ej. 2152205006) · Clasificador presupuestario (subtítulo/ítem/asignación, p. ej. 22.05.006) · **Cuentas relacionadas** por cuenta (contra devengado, contra pagado; p. ej. 11103 Bancos sist. financiero, 11102 Banco Estado) · Proveedores/contribuyentes (RUT) · Departamentos/unidades · Cuentas bancarias · Presupuesto vigente por cuenta.
- **Documentos del gasto**: Requerimiento · CDP · Compromiso/Preobligación · Orden de compra · Recepción (acta, V°B°, CRC) · DTE · Expediente · Comprobante de egreso devengado (CED) · Decreto de pago · Pago/egreso · Cesión (factoring).
- **Documentos del ingreso**: Orden de ingreso · Comprobante de ingreso devengado (CID) · Ingreso percibido.
- **Transversales**: Asiento contable (debe/haber/beneficiario) · Bien de inventario (clasificación NICSP, código, baja con decreto) · Conciliación bancaria · Cierre de período.
- **Estados comunes**: Borrador → Confirmado (y Rechazado/Anulado, que los diagramas no detallan).

## 4. Reglas de negocio explícitas

- No se emite CDP sin saldo disponible.
- No se crea el CED si la cuenta no tiene configurada su cuenta de egreso devengado (error bloqueante → parametrización → reintento).
- El devengado con OC requiere match de OC + CRC + DTE (y acta de recepción conforme).
- El DTE que no calza con la OC se rechaza (Mercado Público/SII).
- Bajas de inventario requieren decreto firmado por Alcaldía.
- Factura cedida (factoring) obliga a suspender el pago y rehacer el decreto a nombre del cesionario.
- El CID puede generarse automáticamente o por aprobación manual según configuración.

## 5. Vacíos e inconsistencias a resolver

1. **Ingreso percibido**: página vacía.
2. **Pago / egreso pagado (Tesorería)**: varios flujos terminan en "Decreto de pago", pero no hay flujo del pago ni de su asiento (egreso pagado), salvo dentro de factoring.
3. **Ramas de rechazo sin cierre**: "Devolver a unidad", "Rechazo DTE", "Solicitar modificación presupuestaria", "Acta de observaciones", "Notificar/re-evaluar" no vuelven al flujo ni terminan.
4. **Recepción conforme/inventario**: "¿Cotejo con OC?" tiene 3 salidas (SI, NO y una sin etiqueta); "Verificación DTE/CRC" sale a 3 destinos; "¿Recepción conforme registrada?" solo tiene rama SÍ; los nodos de Contabilidad quedaron fuera de su carril.
5. **Terminología preobligación vs. compromiso**: el flujo registra la "preobligación (compromiso cierto)" después de la adjudicación y antes de la OC. Confirmar si la preobligación corresponde al CDP (reserva) y el compromiso a la adjudicación/OC.
6. **Factoring**: el rombo "X/Decidir" no dice cuál es la condición (presumiblemente "¿factura cedida?").
7. **Ingreso devengado**: conectores duplicados; la rama manual no dice si genera el CID.
8. **Matriz de asientos**: solo hay un ejemplo (telefonía celular). Para automatizar asientos se necesita la tabla evento → cuenta debe/haber por tipo de gasto/ingreso.
9. **Cierre mensual/anual y conciliación**: solo a nivel macro; faltan reglas (qué se valida, qué se bloquea al cerrar).

## 6. Supuestos propuestos (validar con Contabilidad municipal)

S1 Ingreso percibido (CIP: Debe Banco / Haber C x C) · S2 Pago y egreso pagado (Debe C x P / Haber Banco) · S3 Matriz de asientos (contra devengado = cuenta de gasto o activo; el ejemplo del diagrama usa 11103 Bancos, reinterpretado) · S4 Sin saldo para el CDP: devolver o pedir modificación presupuestaria · S5 Preobligación (CDP) vs. compromiso (tras la adjudicación) · S6 OC rechazada: vuelve al proceso de compra · S7 Recepción con observaciones: se repite la recepción · S8 Rechazo de DTE: 8 días (Ley 19.983); con OC se espera un nuevo DTE, sin OC se cierra · S9 Sin OC: compromiso al imputar · S10 Condición del factoring = factura cedida y notificada en el SII · S11 Conciliación: Revisor y luego DAF; partidas estándar · S12 CID manual: al aprobar se genera el CID · S13 NICSP: subtítulo 29 = activo con alta en inventario.

## 7. Relación con Adquisiciones

El prototipo no duplica el ciclo de compra: todo lo anterior al devengado vive en `modulos/adquisiciones/`.
- Salieron de Contabilidad: requerimiento/SOLPED, CDP, preobligación, compromiso, proceso de compra, OC, recepción conforme y cruce de 3 vías (Adq 1.1–5.1).
- El flujo "Desde Adquisiciones" de Contabilidad parte con la solicitud de devengado (recordAccrual): crear CED → confirmar CED (responde accounting_entry_ref) → alta de activo si es inventariable (MC-3) → espera pago de Adq 5.3/5.4 → registrar egreso pagado.
- Se mantienen en Contabilidad: gasto sin OC, ingresos, factoring (MC-7), conciliación, configuración de cuentas.
- La pestaña "Mapa de flujos" tiene la tabla "Qué quedó en Adquisiciones", que enlaza cada nodo de los draw.io a la pantalla de Adquisiciones.
- Supuestos S5, S6 y S7 quedan resueltos por Adquisiciones (1.6/3.4, 3.5, 4.5); S4 aplica solo a sin OC (en compras = Adq 1.4).

Temas abiertos con Adquisiciones (candidatos a `pendientes.md`):
1. El devengado aparece dos veces: 4.4 recordAccrual y 5.2 registerAccrual. Contabilidad debería recibir una sola solicitud.
2. 4.3 registerInventoryEntry no tiene dueño (X-44); el plan de Contabilidad propone el alta en el devengado (MC-3).
3. 5.3/5.4 asumen que se paga al proveedor; con factoring el beneficiario puede ser un cesionario y Contabilidad debe poder suspender el decreto (MC-7).

## 8. Qué implementa el prototipo

- **Módulo en el shell común:** `modulos/contabilidad/` habilitado en `shared/modules-registry.js`; su menú agrupado vive en el sidebar. Rutas internas por hash (`#guia`, `#bandeja`, `#flujos`, `#oc`, `#sinoc`, `#ing`, `#tes`, `#conc`, `#pres`, `#diario`, `#inv`, `#cfg`, `#sup`, `#exp=EXP-…`).
- **Roles:** selector "Actuando como" con 10 roles (los carriles de los diagramas) y bandeja de pendientes por rol.
- **Flujos:** gasto desde Adquisiciones (5 etapas), gasto sin OC (9), ingreso (3), factoring (6, reemplaza la cola de pago al registrar una cesión) y conciliación bancaria (8 pasos).
- **Efectos:** ejecución presupuestaria (vigente, comprometido, devengado, pagado, disponible), asientos cuadrados automáticos, libro banco, inventario y correlativos CED/CID/CIP/DP.
- **Integración con Adquisiciones:** en 5.1 Cruce de 3 vías, "Registrar devengado en Contabilidad (5.2)" abre Contabilidad con la solicitud precargada desde `expedientes-demo.js` y `form-presets.js` (deep link `?expediente=ADQ-…&origen=5.2`). Una sola solicitud por folio: si ya llegó, se abre el expediente existente.
- **Guía de demo:** 12 casos (C1–C12) con pasos por rol y botón "Reiniciar datos de demo". Guion completo en [`guion-demo.md`](guion-demo.md).
- **Persistencia:** `localStorage` del navegador (clave `sgm-conta-proto-v5`); sin backend.

## 9. Próximos pasos

1. Validar el prototipo y los supuestos con 1 o 2 encargados de contabilidad municipal (pauta de sesión por hacer).
2. Obtener la matriz de asientos real y el plan de cuentas CGR vigente.
3. Etapa 2: especificación técnica (modelo de datos, máquina de estados por documento, reglas, API) para el equipo dev.

