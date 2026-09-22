# Guion de demo — prototipo de Contabilidad

Doce casos preparados (C1–C12) para mostrar los flujos de Contabilidad de punta a punta. Cada caso parte detenido justo donde empieza lo que hay que mostrar. La vista **Guía de demo** del prototipo lista los mismos casos con su estado actual. Revisado 22-09-2026.

## Antes de empezar

1. Levanta los prototipos (`npx serve sgm-prototipos`) o abre la publicación de GitHub Pages.
2. Ingresa con ClaveÚnica simulada (cualquier clave) y entra a **Contabilidad** desde el menú lateral. Abre en **Guía de demo**.
3. Pulsa **Reiniciar datos de demo** antes de cada presentación. Los datos viven en el `localStorage` del navegador: lo que ejecutes no lo ve nadie más.
4. En cada caso usa **Abrir caso**: te lleva al expediente y cambia al rol que debe actuar.

**Cambiar de rol.** No hay que cerrar sesión. Cuando una etapa pertenece a otro rol, el expediente muestra un recuadro amarillo con el botón **Actuar como …**. También se puede elegir en el selector **Actuando como** de la barra superior (el número es la cantidad de pendientes de ese rol).

**Qué es real y qué es simulado.** ADQ-2026-00123, 00202 y 00231 existen en `expedientes-demo.js`. Los folios 00250, 00252 y 00253 son simulados y el expediente lo indica. Proveedores y contribuyentes son ficticios; los saldos presupuestarios anteriores a septiembre son de partida.

## Los 12 casos

Recorrido recomendado en 20 minutos: C5 → C1 → C2 → C6 → C8 → C10 → C12.

| Caso | Flujo | Tipo | Expediente | Roles | Qué demuestra |
| --- | --- | --- | --- | --- | --- |
| C1 | Desde Adquisiciones | Camino feliz | ADQ-2026-00123 Insumos de oficina, $1.180.000 | Adquisiciones, Contabilidad | Integración: del cruce de 3 vías al pago, sin duplicados |
| C2 | Desde Adquisiciones | Bloqueo | Servicio de aseo agosto, $24.500.000 | Contabilidad | No hay devengado sin cuenta configurada |
| C3 | Desde Adquisiciones | Camino feliz | Notebooks Oficina de Partes, $5.940.000 | Contabilidad | Alta de activo fijo en el devengado |
| C4 | Desde Adquisiciones | Camino feliz | ADQ-2026-00202 Señalética, $2.950.000 | Adquisiciones, Contabilidad | Contabilidad registra el pago que informa Tesorería |
| C5 | Desde Adquisiciones | Referencia | ADQ-2026-00231 Equipamiento ergonómico, $3.980.000 | (solo mirar) | Expediente cerrado |
| C6 | Factoring | Bloqueo | Tóner impresoras DAF, $980.000 | Contabilidad, DAF, Alcaldía, Tesorería | Pago suspendido y rehecho al factor |
| C7 | Sin OC | Camino feliz | Agua potable agosto, $612.400 | Unidad, Presupuesto, Contabilidad, Alcaldía, Tesorería | Servicio básico de punta a punta |
| C8 | Sin OC | Bloqueo | Alumbrado público agosto, $14.380.000 | Presupuesto | Control de saldo y suplemento |
| C9 | Sin OC | Bloqueo sin salida | Arriendo DIDECO, cobro duplicado, $1.650.000 | Unidad | Rechazo del DTE en el SII |
| C10 | Ingresos | Camino feliz | Patente Almacén El Roble, $68.000 | Unidad emisora, Tesorería | CID automático y percibido |
| C11 | Ingresos | Bloqueo | Derecho de aseo Minimarket Doña Rosa, $92.500 | Unidad emisora, Contabilidad | CID con revisión manual |
| C12 | Tesorería | Camino feliz | Conciliación bancaria agosto | Tesorería, Revisor, DAF | Cotejos, partidas conciliatorias y doble revisión |

## Gasto desde Adquisiciones (C1, C3, C4, C5)

**C5 — Expediente terminado.** Solo mirar: Recorrido del flujo, Documentos (CED, alta de inventario, decreto, pago), Asientos contables e Historial con fecha y rol.

**C1 — De la compra al pago.** ADQ-2026-00123, Compra Ágil, Comercial Sur SpA, $1.180.000.

| # | Rol | Qué hacer | Qué se ve |
| --- | --- | --- | --- |
| 1 | Adquisiciones | "Abrir caso" (abre 5.1 Cruce de 3 vías). "Ejecutar match", cerrar el aviso de validaciones y "Registrar devengado en Contabilidad (5.2)" | Salta a Contabilidad |
| 2 | Adquisiciones | "Recibir solicitud" | Monto, OC 4021-33-SE26, proveedor y cuenta 22.04.001 precargados |
| 3 | Contabilidad | "Crear egreso devengado" | CED en borrador con su asiento |
| 4 | Contabilidad | Marcar las dos verificaciones y "Cambiar estado a CONFIRMADO" | Devengado +$1.180.000; respuesta a Adquisiciones con el asiento |
| 5 | Adquisiciones/Tesorería | "Simular: pago completado" | Representa 5.3 y 5.4 |
| 6 | Contabilidad | "Registrar egreso pagado" | Estado Pagado, cargo en el Libro banco |
| 7 | — | Volver a pulsar el botón 5.2 en Adquisiciones | Abre el mismo expediente: una solicitud por folio |

**C3 — Bien inventariable.** Como Contabilidad: "Crear egreso devengado" → verificaciones y "Cambiar estado a CONFIRMADO" → "Registrar alta" con "Activo — alta en inventario". En **Inventario** aparece INV-2026-… en la cuenta 141.06.

**C4 — Pago informado por Adquisiciones.** Adquisiciones/Tesorería: "Simular: pago completado". Contabilidad: "Registrar egreso pagado".

## Bloqueo: cuenta sin configurar (C2)

| # | Rol | Qué hacer | Qué se ve |
| --- | --- | --- | --- |
| 1 | Contabilidad | "Crear egreso devengado" | Error: la cuenta 215.22.08.001 no tiene cuenta de egreso devengado |
| 2 | Administrador contable | "Ir a configuración de cuentas"; en la fila en rojo elegir 531.22.08 en "Contra egreso devengado" | Se guarda al elegir |
| 3 | Contabilidad | "Volver a EXP-…" y reintentar | Funciona; seguir con "Cambiar estado a CONFIRMADO" |

## Gasto sin orden de compra (C7, C8, C9)

**C7 — Camino feliz** (Aguas del Valle, $612.400): Unidad "Cobro y servicio correctos" → Unidad "Emitir V°B°" → Presupuesto "Imputar y comprometer" → Presupuesto "Enviar a Contabilidad" → Contabilidad "Crear egreso devengado" → Contabilidad "Cambiar estado a CONFIRMADO" → Contabilidad "Elaborar decreto de pago" → Alcaldía "Firmar decreto" → Tesorería "Registrar pago".

**C8 — Sin saldo** ($14.380.000 contra $12.700.000 disponibles en 22.05.001):

1. Presupuesto: "Imputar y comprometer" está deshabilitado. "Solicitar modificación o suplemento" (queda En espera).
2. Presupuesto: "Registrar suplemento aprobado por el Concejo" (vigente +$1.680.000).
3. Presupuesto: "Imputar y comprometer" y seguir como C7.

**C9 — Factura rechazada.** Unidad: "Rechazar DTE en el SII". Queda Rechazado y no toca presupuesto ni contabilidad; el proveedor debe emitir un DTE nuevo.

## Ingresos (C10, C11)

**C10 — Devengado automático.** Unidad emisora: "Confirmar orden" (el CID se genera solo). Tesorería: medio "Tarjeta (Transbank)" y "Registrar pago recibido".

**C11 — Revisión manual.** Desmarcar en Configuración de cuentas "Generar automáticamente el comprobante…" → Unidad emisora "Confirmar orden" → Contabilidad "Aprobar y generar CID" → volver a marcar la casilla.

## Factoring (C6)

| # | Rol | Qué hacer |
| --- | --- | --- |
| 1 | Cualquiera | En "¿La factura fue cedida?" elegir Factor Capital Andino S.A. y "Registrar cesión" |
| 2 | Contabilidad | "Enviar orden de suspensión a Tesorería" |
| 3 | DAF | "Elaborar decreto de cesión" |
| 4 | Alcaldía | "Firmar" |
| 5 | DAF | "Elaborar nuevo decreto" (a nombre del cesionario) |
| 6 | Alcaldía | "Firmar decreto" |
| 7 | Tesorería | "Registrar pago" |

## Conciliación bancaria (C12)

| # | Rol | Qué hacer |
| --- | --- | --- |
| 1 | Tesorería | "Cargar cartola de agosto", "Cotejar cheques", "Cotejar tarjetas", "Comparar movimientos" |
| 2 | Tesorería | "Contabilizar comisiones bancarias" ($59.730) y "Generar conciliación" (cuadra) |
| 3 | Revisor | "Visar" (o "Devolver con observaciones" para mostrar el bloqueo) |
| 4 | DAF | "Autorizar" y "Archivar" |

Partidas conciliatorias que quedan: cheque 118841 no cobrado ($356.900), depósito en tránsito ($845.000) y abono no identificado ($120.000).

## Qué mirar y qué no cubre

- **Libro diario**, **Ejecución presupuestaria**, **Pagos y cobros** (libro banco) e **Inventario** muestran los efectos de cada caso.
- Prototipo sin backend; cuentas patrimoniales ilustrativas (falta plan de cuentas CGR y matriz de asientos real); supuestos S1–S13 por validar.
- Fuera de alcance: baja de bienes de inventario y cierres mensual/anual.
