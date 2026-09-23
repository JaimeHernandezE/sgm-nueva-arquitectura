# Contabilidad — análisis de flujos y prototipo navegable

Análisis de los diagramas de procesos de Contabilidad en su versión actualizada (carpeta [`../diagramas/`](../diagramas/): 4 archivos draw.io, 13 diagramas) y de los 6 Word de detalle entregados el 23-09-2026 ([`../diagramas/detalle/`](../diagramas/detalle/)). Describe el prototipo `sgm-prototipos/modulos/contabilidad/` en su versión 6. Revisado 23-09-2026.

> Documento de trabajo de levantamiento. No reemplaza al [plan de trabajo](../plan-de-trabajo-contabilidad.md) ni crea decisiones de arquitectura: los supuestos S1–S18 son propuestas a validar con Contabilidad municipal. El detalle de lo que cambió respecto de la versión 5 está en [`cambios-v6.md`](cambios-v6.md).

## 1. Inventario de flujos

| Flujo | Archivo › página | Nivel | Estado |
|---|---|---|---|
| Egreso devengado en sistema (CED) | 1. Contabilidad_Diagramas_SGM › 02- Registro Egreso devengado | Pantalla/sistema | Completo; el Word (video) aclara que el CED lo crea Adquisiciones |
| Egreso devengado (esbozo) | 1. Contabilidad_Diagramas_SGM › 02 - Egreso Devengado | Esbozo | Duplicado del anterior |
| Factoring (cesión de facturas) | 1. Contabilidad_Diagramas_SGM › Factoring | Proceso, DAF / Alcaldía / Tesorería / Factoring | Rombo rotulado; conectores sueltos; el Word agrega casos A y B y visación jurídica |
| Conciliación bancaria | 1. Contabilidad_Diagramas_SGM › Conciliación Bancaria | Proceso | Completo; el Word agrega roles, partidas y fórmula |
| Inventario (baja de bienes) | 1. Contabilidad_Diagramas_SGM › Inventario | Proceso | Simple, completo |
| Cierre mensual | 1. Contabilidad_Diagramas_SGM › 06 - Cierre Mensual | Proceso macro | El Word (video) detalla los pasos en el sistema |
| Cierre anual | 1. Contabilidad_Diagramas_SGM › 07 - Cierre Anual | Proceso macro | El Word (video) detalla pasos, asientos y tareas de la DAF |
| Ingreso devengado (orden de ingreso → CID) | 2. Ingreso devengado e Ingreso Percibido › Ingreso Devengado | Pantalla/sistema | Completo; conectores duplicados |
| Ingreso percibido | 2. Ingreso devengado e Ingreso Percibido › Ingreso Percibido | Proceso | **Nuevo** (antes vacío): caja → arqueo → depósito → asiento |
| Registro de preobligación (compromiso cierto) | 3. Registro Obligaciones (con y sin OC) + Registro preobligaciones › Registro Preobligacion | Proceso, 4 roles | Completo |
| Registro de obligaciones (devengado con OC) | 3. … › Registro Obligaciones | Proceso, 4 roles | Completo |
| Obligaciones sin OC (servicios básicos, arriendos) | 3. … › Obligacion sin OC | Proceso, 4 roles | Completo |
| Recepción conforme e inventario | proceso_inventario_Recepcion_Conforme.drawio | Proceso, 4 roles | Mismo dibujo; el Word aclara las ramas ambiguas |

## 2. El ciclo que describen

**Ciclo del gasto con OC** (disponibilidad → reserva → compromiso → devengado → pagado)

1. Requerimiento (Unidad solicitante) → evaluación de saldo y **CDP**, que reserva los fondos (Presupuesto / SECPLAN).
2. Proceso de compra y **decreto de adjudicación** (DAF / Abastecimiento).
3. **Preobligación = compromiso cierto**, registrada por Contabilidad con el decreto de adjudicación tramitado (S5).
4. Emisión de la **OC** en Mercado Público y aceptación del proveedor.
5. **Recepción**: recepción física y cotejo con la OC (Bodega) → V°B° técnico (Unidad) → verificación del DTE y CRC en MP/SII → **clasificación NICSP y código de inventario por Bodega** (S13).
6. **Cruce de 3 vías** (OC + CRC + DTE) e integración del expediente.
7. **Egreso devengado**: desde la resolución de compra, **Adquisiciones pulsa "Crear egreso devengado"**; el sistema exige las contracuentas configuradas; el CED nace en Borrador y **Contabilidad lo verifica y confirma** (S18).
8. Decreto de pago y pago (Adquisiciones 5.3 / Tesorería 5.4) → egreso pagado en Contabilidad (S2). Si la factura fue cedida: factoring, casos A y B (S10).

**Gasto sin OC**: DTE del proveedor → análisis técnico y V°B° (Unidad administradora) → imputación y verificación de saldo (Presupuesto) → envío del expediente → devengado (Contabilidad) → emisión y firma del decreto de pago → pago.

**Ciclo del ingreso**

1. **Orden de ingreso** (Unidad emisora: Rentas, Obras, Patentes, Tránsito, JPL): fechas de emisión, vencimiento y período; contribuyente (o ficha nueva); ítems con cálculo en pesos o UTM → Borrador → Confirmar.
2. Motor de reglas: **CID** automático, o revisión manual de Contabilidad.
3. **Ingreso percibido**: el cajero recibe el pago y timbra la orden → cierre de caja y **arqueo diario** (Tesorero) → **depósito** al día hábil siguiente → Contabilidad valida el depósito contra la rendición y registra el **asiento percibido** (Debe Banco / Haber Ingresos por percibir).

**Control y cierre**

- **Conciliación bancaria** por cuenta corriente: encargado de conciliaciones (DAF-Contabilidad) → Jefatura de Contabilidad / Director DAF → revisión independiente de Control interno → archivo → informes CGR y SINIM.
- **Cierre mensual**: Borrador → Enviado a revisión → Cerrado (con historial) → informe a la CGR (SICOGEN II); reapertura con razón obligatoria.
- **Cierre anual**: tareas previas coordinadas por la DAF → cierre del período → 3 asientos de cierre → confirmación → estados financieros a la CGR y SUBDERE.
- **Inventario**: mantener actualizado; baja con decreto firmado por Alcaldía.

## 3. Modelo de datos que se desprende

- **Maestros**: plan de cuentas; clasificador presupuestario; **cuentas relacionadas** por cuenta (contra egreso devengado, contra egreso pagado); proveedores y contribuyentes (RUT, nombre, dirección, correo); departamentos; cuentas corrientes (General, Salud, Educación, FNDR, Fondos de terceros); valor UTM; presupuesto vigente por cuenta.
- **Documentos del gasto**: requerimiento, CDP (reserva), preobligación (compromiso cierto), OC, recepción (acta, V°B°, CRC), DTE, expediente, CED, decreto de pago, pago, cesión (caso, decreto de cesión, visación).
- **Documentos del ingreso**: orden de ingreso, CID, comprobante de pago de caja, **rendición de caja** (pagos del día, arqueo, depósito), CIP.
- **Transversales**: asiento contable (con tipo: normal, traspaso, cierre), bien de inventario (código, valor, depreciación, estado, baja), conciliación por cuenta y período, **cierre** (tipo, período, rango, estado, respaldos, reaperturas, asientos de cierre).
- **Estados**: CED y CID Borrador → Confirmado; orden de ingreso Borrador → Confirmada → Pagada; rendición Abierta → Arqueada → Depositada → Contabilizada; cierre Borrador → Enviado a revisión → Cerrado ↔ Reabierto; bien Vigente → De baja.

## 4. Reglas de negocio explícitas

- No se emite CDP sin saldo disponible; sin OC, no se imputa sin saldo (modificación o suplemento).
- La preobligación (compromiso cierto) se registra con el decreto de adjudicación tramitado y antes de emitir la OC.
- No se crea el CED si la cuenta no tiene sus cuentas relacionadas configuradas; el CED queda en Borrador hasta verificar recepción conforme y factura.
- El devengado con OC exige el cruce OC + CRC + DTE; el DTE que no calza se rechaza (MP/SII).
- Factoring: sin decreto de pago, se cambia el receptor del pago (caso A); con decreto generado o en trámite, se suspende el pago (caso B). El decreto de cesión requiere visación jurídica o de control y firma; el pago va al RUT del factoring.
- Ingreso percibido: el asiento se registra después del depósito, validado contra la rendición de caja.
- Conciliación: los cargos bancarios se registran con comprobante de traspaso; los abonos no identificados van a una cuenta de pasivo hasta identificar al contribuyente.
- Cierre: la reapertura exige razón; el cierre anual genera traspaso de ingresos, traspaso de gastos y resultado a patrimonio neto.
- La baja de inventario requiere decreto firmado por Alcaldía.

## 5. Vacíos e inconsistencias de la versión actualizada

1. **Factoring**: conectores sueltos ("Elaborar Decreto de Pago" de la rama No no llega a su firma; "Actualizar factura" no llega a "Rehacer decreto"; el inicio no está conectado). La visación jurídica y los casos A/B solo están en el Word.
2. **Ingreso percibido**: el asiento está en el carril de Tesorería en el diagrama y en Contabilidad en el Word. No hay rama para diferencias de arqueo ni para cheques protestados.
3. **Egreso devengado**: el diagrama pone "Seleccionar registro de compra / Crear egreso devengado" en el carril de Contabilidad; el video lo muestra en Adquisiciones. Sigue la pestaña esbozo "02 - Egreso Devengado".
4. **Preobligación**: el Word la define como compromiso cierto posterior a la adjudicación; el modelo de Adquisiciones la tiene en 1.6 (tras el CDP) y el compromiso en 3.4.
5. **Clasificación NICSP**: el Word la asigna a Bodega (DAF), no a Contabilidad.
6. **Cruce de 3 vías**: el diagrama lo pone en el carril de Contabilidad y Tesorería; la pantalla está en Adquisiciones 5.1.
7. **Cierres**: no dicen qué condiciones bloquean el cierre ni quién revisa; los asientos de cierre no tienen cuentas.
8. **Conciliación**: la fórmula del Word está en una imagen cortada; el orden de aprobación del Word (DAF → Control) coincide con el diagrama, no con el prototipo v5.
9. **Matriz de asientos**: sigue habiendo un solo ejemplo (telefonía celular).
10. **Baja de inventario**: no dice qué asiento produce.

## 6. Supuestos (validar con Contabilidad municipal)

| # | Tema | Propuesta |
|---|---|---|
| S1 | Caja, rendición y depósito | Los pagos del día forman una rendición que avanza en bloque; el depósito cubre efectivo y cheques; tarjeta y transferencia llegan por su liquidación y entran al mismo asiento |
| S2 | Pago y egreso pagado | Debe C x P / Haber Banco; en compras lo informa Tesorería; la factura queda Pagada |
| S3 | Matriz de asientos | Contra devengado = cuenta de gasto o activo; códigos ilustrativos |
| S4 | Sin saldo (sin OC) | Solicitud de modificación o suplemento y reintento |
| S5 | Preobligación | Decisión 23-09: se sigue el Word (compromiso cierto tras la adjudicación); propuesta a Adquisiciones |
| S6 | OC rechazada | Adquisiciones 3.5 / 3.6 (renegociar o anular) |
| S7 | Recepción con observaciones | Acta de observaciones y reclamo del DTE; Adquisiciones 4.5 |
| S8 | Rechazo de DTE | 8 días corridos **[NORMA N-11]**; sin OC el expediente termina |
| S9 | Compromiso sin OC | Se compromete al imputar |
| S10 | Factoring | Condición "¿Cesión de factura?"; caso A (sin decreto) y caso B (con decreto) |
| S11 | Conciliación | Roles DAF-Contabilidad → DAF → Control interno; cuentas de ejemplo; 214.09 para abonos no identificados |
| S12 | CID manual | Contabilidad aprueba y se genera el CID |
| S13 | Alta de activo | Bodega clasifica **[NORMA N-33]** y codifica; Contabilidad registra el activo al confirmar el CED |
| S14 | Diferencia de arqueo | Bloquea el cierre de caja hasta recontar |
| S15 | Condiciones de cierre mensual | Conciliaciones del período archivadas y sin comprobantes en borrador; período cerrado no acepta asientos |
| S16 | Asientos de cierre anual | Ejecución 2025 de ejemplo; cuentas 611 y 311 ilustrativas; confirma la Jefatura de Contabilidad |
| S17 | Baja de bienes | Valor libro a gasto por baja; depreciación acumulada rebajada |
| S18 | CED desde Adquisiciones | Decisión 23-09: se sigue el video; resolución de compra = expediente con cruce 5.1 |

## 7. Relación con Adquisiciones

El prototipo no duplica el ciclo de compra: todo lo anterior al devengado vive en `modulos/adquisiciones/`, salvo el registro contable de la preobligación.

- **Entradas desde Adquisiciones**: 3.10 → "Registrar preobligación en Contabilidad" (`?origen=3.10`); 5.1 → "Crear egreso devengado (5.2)" (`?origen=5.2`). Una sola entrada por folio y tipo.
- **Se mantienen en Contabilidad**: preobligación, confirmación del CED, egreso pagado, gasto sin OC, ingresos y caja, factoring, conciliación, cierres, bajas, configuración de cuentas.
- La pestaña "Mapa de flujos" tiene la tabla "Qué quedó en Adquisiciones", que enlaza cada nodo de los draw.io a su pantalla.

Temas de borde (candidatos a `pendientes.md`):

1. **Preobligación (S5)**: mover `registerPreObligation` de 1.6 a después de 3.10 y revisar `commitBudget` en 3.4 / 3.14.
2. **Quién crea el CED (S18)**: Adquisiciones crea el CED en borrador; sigue pendiente elegir un solo disparo entre 4.4 (`recordAccrual`) y 5.2 (`registerAccrual`).
3. **Clasificación NICSP (S13, X-44)**: Bodega en 4.3; Contabilidad registra el activo con el CED.
4. **Factoring (S10, MC-7)**: 5.3 y 5.4 asumen pago al proveedor; se requiere beneficiario cesionario y suspensión de decreto en curso.
5. **Cruce de 3 vías**: el diagrama lo pone en Contabilidad y Tesorería; la pantalla sigue en 5.1.

## 8. Qué implementa el prototipo (v6)

- **Módulo en el shell común**: `modulos/contabilidad/`, menú agrupado en el sidebar; rutas por hash (`#guia`, `#bandeja`, `#flujos`, `#preob`, `#oc`, `#sinoc`, `#ing`, `#caja`, `#tes`, `#conc`, `#pres`, `#diario`, `#inv`, `#cierres`, `#cfg`, `#sup`, `#exp=…`).
- **Roles (11)**: Unidad, Presupuesto, DAF, Adquisiciones (externo), Contabilidad, Tesorería, Caja, Alcaldía, Control interno / Jurídica, Unidad emisora, Administrador contable.
- **Flujos**: preobligación (2 etapas), devengado desde Adquisiciones (4), gasto sin OC (9), ingreso (6), factoring caso B (8) y caso A (7), conciliación (8), cierre mensual (3), cierre anual (6), baja de inventario (4).
- **Efectos**: ejecución presupuestaria (vigente, reserva CDP, comprometido, devengado, pagado, disponible; ingresos devengado y percibido), asientos cuadrados (normales, de traspaso y de cierre), libro banco, rendiciones de caja, inventario con altas y bajas, correlativos PRE/CED/CID/RI/CIP/DP/DEP/CT.
- **Bloqueos reproducidos**: cuenta sin configurar (C2), sin saldo (C8), DTE rechazado (C9), CID manual (C11), factoring caso B (C6), arqueo con diferencia (C15), cierre sin conciliación archivada (C16).
- **Guía de demo**: 18 casos (C1–C18). Guion en [`guion-demo.md`](guion-demo.md).
- **Persistencia**: `localStorage` (clave `sgm-conta-proto-v6`); sin backend.

## 9. Próximos pasos

1. Validar el prototipo y los supuestos S1–S18 con 1 o 2 encargados de contabilidad municipal.
2. Acordar con el equipo de Adquisiciones los temas de borde de §7.
3. Obtener la matriz de asientos real, el plan de cuentas CGR vigente y las cuentas de cierre.
4. Etapa 2: especificación técnica (modelo de datos, máquina de estados, reglas, API).
