# Macroproceso: Compra Ágil

Ficha de flujo SOLPED → Pago para la modalidad Compra Ágil. Documenta las etapas **específicas** de esta modalidad (2 y 3); las etapas transversales (1, 4 y 5) están en [`procesos-transversales/`](../procesos-transversales/overview.md).

## Contexto de la modalidad

**Qué es.** Mecanismo simplificado de compra para adquisiciones de **hasta 100 UTM** (umbral elevado por la Ley 21.634, en rigor desde fines de 2024). Es una de las modalidades más utilizadas por los organismos públicos.

**Características legales clave:**
- **No requiere Decreto ni Resolución para iniciarse**, ni contrato formal: el vínculo legal se perfecciona íntegramente con la emisión y **aceptación de la Orden de Compra** — ese clic del proveedor crea el contrato.
- Requisito de competencia: mínimo 3 cotizaciones electrónicas.
- **Filtro MiPyme:** en primera instancia, la solicitud se dirige automáticamente solo a Empresas de Menor Tamaño y proveedores locales del rubro. Si ninguna MiPyme cotiza, el comprador puede ampliar la convocatoria a empresas de cualquier tamaño en segunda ronda.
- **Declaración de habilidad:** el proveedor acepta una declaración jurada automática al cotizar (sin deudas previsionales/tributarias ni condenas antisindicales). La habilidad se revalida al emitir la OC: si el proveedor se inhabilitó durante el proceso, el sistema de MP **bloquea la compra**.
- Justificación obligatoria si el comprador no selecciona la oferta de menor precio.

**Plazos característicos:** cotización abierta 2–5 días hábiles (los define el comprador); adjudicación usualmente en 24–48 horas tras el cierre; pago máximo 30 días corridos desde la recepción de la factura con recepción conforme.

**Integración con Mercado Público** (unidireccional read-only, ver [`integracion-mercado-publico.md`](../../../arquitectura/integracion-mercado-publico.md)): 1 deep link (inicio de cotización, "Gestionar en MP") + 1 lectura API (OC Aceptada). **Hito contable crítico:** la lectura de "OC Aceptada" gatilla el paso de Pre-afectación a **Compromiso Cierto**. El usuario copia el ID de Cotización en el SGM al conectar; desde ese momento la SOLPED queda bloqueada en estado "En proceso de cotización".

**Edge cases normativos que el proceso debe cubrir:** cancelación de la solicitud antes de emitir OC (con motivo); proceso desierto (nadie cotiza → reevaluar presupuesto/condiciones y republicar); rechazo de OC por el proveedor (→ emitir a la segunda mejor oferta o cancelar y republicar); proveedor inhábil al momento de emitir OC (bloqueo).

**Fuente base:** *Guía de integración SGM – ChileCompra* (cargada julio 2026); Ficha QA Adquisiciones.

## Nota metodológica

El ciclo de compras se organiza en 5 etapas de alto nivel. Las etapas **1 (SOLPED), 4 (Recepción Conforme) y 5 (Pago)** son transversales — compartidas por las 4 modalidades. Las etapas **2 (Modalidad de Compra) y 3 (Resolución de Compra)** documentadas aquí son específicas de Compra Ágil.

Cada sub-paso documenta: Unidad municipal, Rol, Plataforma, Optativo, entidades y campos del modelo de datos, edge cases, y puntos marcados explícitamente como **pendientes de definir** cuando la fuente no resuelve una regla de negocio — candidatos directos para el levantamiento con DM y municipios piloto.

## Convenciones de la ficha

Alineadas con [`plantilla-maestra-sgm.md`](../../../arquitectura/plantilla-maestra-sgm.md) §3.2.

| Materia | Valores | Notas |
|---|---|---|
| Unidad municipal | Unidad Solicitante / DAF Finanzas / DAF Abastecimiento / Contabilidad / Tesorería / `—` | Departamento u oficina del municipio responsable del paso |
| Rol | Usuario / Aprobador / N/A | Rol funcional según RBAC del módulo (`seguridad.md` §3; catálogo en P-24) |
| Plataforma | SGM / Mercado Público / Otra | Sistema donde se ejecuta la acción principal del sub-paso |
| Optativo | Verdadero / Falso | Si el sub-paso puede omitirse en el flujo (`Verdadero`) o es obligatorio (`Falso`) |

## Etapas del ciclo

| Etapa | Alcance | Documentación |
|---|---|---|
| 1. SOLPED | Transversal | [procesos-transversales/1-solped.md](../procesos-transversales/1-solped.md) |
| 2. Modalidad de Compra | Compra Ágil | [2-modalidad-compra.md](./2-modalidad-compra.md) |
| 3. Resolución de Compra | Compra Ágil | [3-resolucion-compra.md](./3-resolucion-compra.md) |
| 4. Recepción Conforme | Transversal | [procesos-transversales/4-recepcion-conforme.md](../procesos-transversales/4-recepcion-conforme.md) |
| 5. Pago | Transversal | [procesos-transversales/5-pago.md](../procesos-transversales/5-pago.md) |

## Mapa de bordes del macroproceso

Agregado de las secciones 3.5 de los 14 sub-pasos. Insumo directo de [`contracts.md`](../contracts.md).

| Sub-paso | Tipo | Contrato / Evento | Contraparte | Clasificación |
|---|---|---|---|---|
| 1.1 | Sistema externo | `getPriceReference` | SII / Mercado Público | Cacheada |
| 1.1 | Dependencia *(propuesta)* | `checkStockAvailability` | Inventario | Síncrona bloqueante ⚠ |
| 1.2 | Dependencia | `requestSignature`, `confirmSignature` | FirmaGob | Síncrona bloqueante |
| 1.2 | Evento | `PurchaseRequestApproved` | — | Asíncrona |
| 1.3 | Dependencia | `checkBudgetAvailability`, `createBudgetPreCommitment` | Presupuestos | Síncrona bloqueante |
| 1.3 | Evento | `BudgetPreCommitmentCreated` | — | Asíncrona |
| 2.1 | Sistema externo | Deep link (sin API) | Mercado Público | — |
| 2.2 | Sistema externo | `validateQuoteId` | Mercado Público | Síncrona bloqueante ⚠ |
| 2.3 | Sistema externo | `getQuoteSummary` | Mercado Público | Asíncrona |
| 2.4 | Sistema externo + Evento | `getPurchaseOrderFromMP`, `PurchaseOrderIssued` | Mercado Público | Asíncrona |
| 3.1 | Sistema externo | `getPurchaseOrderStatus` | Mercado Público | Asíncrona |
| 3.2 | Sistema externo | `syncPurchaseOrderAccepted` | Mercado Público | Asíncrona |
| 3.2 | Dependencia | `convertPreCommitmentToCommitment` | Presupuestos | Síncrona bloqueante |
| 3.2 | Dependencia | `registerBudgetCommitment` | Contabilidad | Asíncrona |
| 3.2 | Evento | `PurchaseOrderAccepted`, `BudgetCommitmentCreated` | — | Asíncrona |
| 4.1 | Dependencia *(opcional)* | `requestSignature` | FirmaGob | Síncrona bloqueante |
| 4.1 | Evento | `GoodsReceiptConfirmed` | — | Asíncrona |
| 5.1 | Dependencia | `getInvoiceForMatch` | SII / Contabilidad | Síncrona bloqueante |
| 5.1 | Sistema externo | `getPurchaseOrderFromMP` | Mercado Público | Cacheada |
| 5.1 | Evento | `ThreeWayMatchCompleted` | — | Asíncrona |
| 5.2 | Dependencia + Evento | `registerAccrual`, `AccrualRegistered` | Contabilidad | Síncrona bloqueante |
| 5.3 | Dependencia + Evento | `requestSignature`, `PaymentDecreeIssued` | FirmaGob | Síncrona bloqueante |
| 5.4 | Dependencia + Evento | `executePayment`, `PaymentCompleted` | Tesorería | Síncrona bloqueante |

Ver definición detallada de payload y edge cases en cada ficha de sub-paso.

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una etapa y son candidatos a resolverse con una única regla de negocio reutilizable, en vez de definirse de forma independiente en cada punto:

- **Regla de tolerancia de desviación de montos/precios** — aparece en 1.1 (precio de línea vs. `PriceReference`), 3.2 (monto MP vs. Pre-afectación) y 5.1 (discrepancia en Three-Way Match).
- **Fuente(s) API externas confiables** — `PriceReference` (1.1) queda sin fuente definida (SII, histórico Mercado Público, u otra).
- **Manejo de fallas de sincronización/disponibilidad de API externa** — aparece en 2.1 (deep link sin completar) y 3.2 (falla de notificación MP).

Ver también [`contracts.md`](../contracts.md) para el contrato API del módulo, [`wireframes/`](./wireframes/README.md) para pantallas SGM prioritarias, y `modelo-datos/entidades-core.md` para la definición canónica de todas las entidades usadas en este macroproceso.
