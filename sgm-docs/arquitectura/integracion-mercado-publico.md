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

| Modalidad | Deep links | Lecturas API |
|---|---|---|
| Compra Ágil | 1 (inicio de cotización) | 1 (OC Aceptada) |
| Convenio Marco | 1-2 (carro de compras / Gran Compra) | 1 (OC Aceptada) |
| Licitación Pública | 0 (SGM en modo monitor desde el inicio) | 3 (hitos de publicación, Resolución de Adjudicación, OC Aceptada) |
| Trato Directo | 0 (fase inicial 100% interna) | 1 (doble validación: Publicado + OC Aceptada) |

El detalle de cada punto está documentado dentro del macroproceso correspondiente (`modulos/adquisiciones/<modalidad>/`).

## Fuente

Este documento resume los hallazgos de la *Guía de integración SGM – ChileCompra* (cargada al proyecto en julio 2026). Ante cualquier discrepancia, la guía original y los mapeos de estado por modalidad documentados en cada macroproceso son la fuente de mayor detalle.
