# Macroproceso: Compra Ágil

Ficha de flujo SOLPED → Pago para la modalidad Compra Ágil. Documenta las etapas **específicas** de esta modalidad (2 y 3); las etapas transversales (1, 4 y 5) están en [`procesos-transversales/`](../procesos-transversales/overview.md).

**Fuente base:** *Guía de integración SGM – ChileCompra* (cargada julio 2026); Ficha QA Adquisiciones.

## Nota metodológica

El ciclo de compras se organiza en 5 etapas de alto nivel. Las etapas **1 (SOLPED), 4 (Recepción Conforme) y 5 (Pago)** son transversales — compartidas por las 4 modalidades. Las etapas **2 (Modalidad de Compra) y 3 (Resolución de Compra)** documentadas aquí son específicas de Compra Ágil.

Cada sub-paso documenta: Unidad, Rol, Plataforma, Optativo, entidades y campos del modelo de datos, edge cases, y puntos marcados explícitamente como **pendientes de definir** cuando la fuente no resuelve una regla de negocio — candidatos directos para el levantamiento con DM y municipios piloto.

## Convenciones de la ficha

| Campo | Valores | Notas |
|---|---|---|
| Unidad | Unidad Solicitante / DAF Finanzas / DAF Abastecimiento / Contabilidad / Tesorería | Área responsable del sub-paso |
| Rol | Usuario / Aprobador | Nivel de intervención requerido |
| Plataforma | SGM / Mercado Público / Otra | Dónde ocurre técnicamente la acción |
| Optativo | Verdadero / Falso | Si el sub-paso puede omitirse |

## Etapas del ciclo

| Etapa | Alcance | Documentación |
|---|---|---|
| 1. SOLPED | Transversal | [procesos-transversales/1-solped.md](../procesos-transversales/1-solped.md) |
| 2. Modalidad de Compra | Compra Ágil | [2-modalidad-compra.md](./2-modalidad-compra.md) |
| 3. Resolución de Compra | Compra Ágil | [3-resolucion-compra.md](./3-resolucion-compra.md) |
| 4. Recepción Conforme | Transversal | [procesos-transversales/4-recepcion-conforme.md](../procesos-transversales/4-recepcion-conforme.md) |
| 5. Pago | Transversal | [procesos-transversales/5-pago.md](../procesos-transversales/5-pago.md) |

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una etapa y son candidatos a resolverse con una única regla de negocio reutilizable, en vez de definirse de forma independiente en cada punto:

- **Regla de tolerancia de desviación de montos/precios** — aparece en 1.1 (precio de línea vs. `PriceReference`), 3.2 (monto MP vs. Pre-afectación) y 5.1 (discrepancia en Three-Way Match).
- **Fuente(s) API externas confiables** — `PriceReference` (1.1) queda sin fuente definida (SII, histórico Mercado Público, u otra).
- **Manejo de fallas de sincronización/disponibilidad de API externa** — aparece en 2.1 (deep link sin completar) y 3.2 (falla de notificación MP).

Ver también `modelo-datos/entidades-core.md` para la definición canónica de todas las entidades usadas en este macroproceso.
