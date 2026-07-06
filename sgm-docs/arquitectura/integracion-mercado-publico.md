# Integración SGM ↔ Mercado Público

## Principio arquitectónico

La integración con Mercado Público (ChileCompra) es **unidireccional read-only**: SGM nunca escribe datos hacia Mercado Público a través de API. Toda interacción de escritura ocurre porque una persona actúa manualmente en el portal de Mercado Público — SGM en ningún caso automatiza esa escritura.

Esto no es una limitación técnica temporal; es una decisión de arquitectura confirmada explícitamente (julio 2026) y debe mantenerse como restricción de diseño en el nuevo stack.

## Los dos únicos tipos de interacción permitidos

### 1. Deep link (navegación, no integración)

Un enlace que abre una URL específica de Mercado Público en el navegador del usuario — equivalente a un `<a href="...">`. No hay payload, no hay llamada POST, no hay datos viajando de SGM hacia MP por la vía del sistema. La persona, no el sistema, ejecuta todas las acciones dentro de la interfaz de MP.

### 2. Lectura API (polling o webhook)

SGM consulta o recibe notificación del estado de un proceso en MP (ej. "OC Aceptada", "Resolución de Adjudicación publicada") y actualiza su propio estado interno en consecuencia. Es la única forma en que MP "informa" algo a SGM.

## Lo que está explícitamente prohibido

**Escritura API**: SGM enviando datos a MP para crear o modificar algo en MP de forma automática. Ningún punto de integración documentado en los macroprocesos de Adquisiciones debe implementar esto.

## Puntos de integración por modalidad (resumen)

| Modalidad | Deep links | Lecturas API | Momento de vinculación (`mp_process_id`) |
|---|---|---|---|
| Compra Ágil | 1 (inicio de cotización) | 1 (OC Aceptada) | Inmediato — cierre de etapa 2 |
| Convenio Marco | 1-2 (carro de compras / Gran Compra) | 1 (OC Aceptada) | Inmediato — cierre de etapa 2 |
| Licitación Pública | 0 (SGM en modo monitor desde la publicación) | 3 (hitos de publicación, Resolución de Adjudicación, OC Aceptada) | **Diferido** — sub-paso 3.5 de su etapa 3, tras bases aprobadas |
| Trato Directo | 0 (fase inicial 100% interna) | 1 (doble validación: Publicado + OC Aceptada) | **Diferido** — en su subproceso, al momento de la publicación |

La etapa 2 (`modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md` §2.3) cierra siempre con la modalidad confirmada; la vinculación con Mercado Público ocurre en el momento que cada modalidad define, reutilizando la misma operación (`linkMpProcess`) sea inmediata o diferida. El detalle de cada punto está documentado dentro del macroproceso correspondiente (`modulos/adquisiciones/<modalidad>/`).

## Requerimientos a negociar con ChileCompra

La *Guía de integración SGM – ChileCompra* registra además cinco requerimientos estratégicos a negociar en mesa técnica con ChileCompra:

1. **APIs transaccionales completas** para las cuatro modalidades.
2. **Sincronización diferencial del catálogo** de Convenio Marco (deltas diarios de productos, precios, quiebres de stock y cobertura regional).
3. **Arquitectura de webhooks** para eventos críticos (OC Aceptada/Rechazada, Proveedor Inhábil) en reemplazo de polling.
4. **Entorno sandbox** de certificación.
5. **Acuerdo de rate limits** para fechas de alta demanda.

Estos requerimientos no pertenecen a los overviews de modalidad; su resolución define el alcance futuro de esta integración más allá del diseño read-only actual.

## Fuente

Este documento resume los hallazgos de la *Guía de integración SGM – ChileCompra* (cargada al proyecto en julio 2026). Ante cualquier discrepancia, la guía original y los mapeos de estado por modalidad documentados en cada macroproceso son la fuente de mayor detalle.
