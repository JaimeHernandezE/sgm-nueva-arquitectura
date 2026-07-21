# Módulo: Adquisiciones

## Qué cubre

Todo el ciclo de compras públicas municipales, desde la solicitud interna (SOLPED) hasta el pago al proveedor, en sus 4 modalidades según la Ley 19.886:

- **Compra Ágil** — etapas 2 y 3 documentadas (ver `1. compra-agil/`)
- **Convenio Marco** — pendiente
- **Licitación Pública** — pendiente
- **Trato Directo** — pendiente

## Procesos transversales

Las etapas **1 (SOLPED), 4 (Recepción Conforme) y 5 (Pago)** son compartidas por las 4 modalidades. Su documentación está centralizada en [`procesos-transversales/`](./procesos-transversales/overview.md).

## Por qué las 4 modalidades tienen documentación separada

Un hallazgo temprano del proceso de auditoría (julio 2026) identificó que, en la implementación Odoo previa, los subprocesos "Modalidad de Compra" y "Resolución de Compra" estaban modelados como un único proceso genérico aplicado indistintamente a las 4 modalidades — cuando en la práctica cada una tiene validadores, campos y flujos de aprobación propios (ej. Licitación requiere Comisión Evaluadora; Trato Directo requiere Decreto Alcaldicio fundado; Compra Ágil y Convenio Marco no tienen ninguno de los dos).

Por eso cada modalidad documenta por separado solo sus etapas 2 y 3 — no se fuerza a las 4 a compartir la misma cantidad de etapas internas ni la misma nomenclatura de subproceso.

## Estructura común a las 4 modalidades

Aunque el contenido interno de las etapas 2 y 3 difiere, las 4 modalidades comparten el mismo esqueleto de 5 etapas de alto nivel:

| Etapa | Alcance | Documentación |
|---|---|---|
| 1. SOLPED | Transversal | `procesos-transversales/1-solped.md` |
| 2. Modalidad de Compra | Por modalidad | `1. compra-agil/`, `2. convenio-marco/`, etc. |
| 3. Resolución de Compra | Por modalidad | `1. compra-agil/`, `2. convenio-marco/`, etc. |
| 4. Recepción Conforme | Transversal | `procesos-transversales/4-recepcion-conforme.md` |
| 5. Pago | Transversal | `procesos-transversales/5-pago.md` |

## Integración con Mercado Público

Lecturas y sincronización vía **core (C7)** — contraparte en fichas: `Core (Mercado Público)`. Ver [`integracion-mercado-publico.md`](../../arquitectura/especificacion/integracion-mercado-publico.md). Adjuntos y archivos vía **core (C10)** — `DocumentRef` / `storeDocument`.

## Ficha QA

`qa/ficha-qa-adquisiciones.csv` — 67 ítems documentados con priorización P0-P3 y asignación Interno/Licitación/Por evaluar. Ver también la nota de contexto en `arquitectura/decisiones/2026-07-eliminacion-odoo.md`: tras la decisión de eliminar Odoo, cada ítem de esta ficha se reinterpreta como un requisito funcional que el ERP nuevo debe cumplir, no como un bug a corregir sobre la base existente.

## Diagramas

`diagramas/` — BPMN de cada macroproceso en formato `.drawio`, editable.

## Contrato API

[`contracts.md`](./contracts.md) — contrato del módulo (piloto Compra Ágil). Estándares transversales en [`arquitectura/especificacion/estandares-api.md`](../../arquitectura/especificacion/estandares-api.md).

## Vista de expediente (UI)

Patrón transversal de filas, tintes y botones: [`arquitectura/instrucciones/patron-vista-expediente.md`](../../arquitectura/instrucciones/patron-vista-expediente.md). Wireframes por sub-paso: [`wireframes/`](./wireframes/README.md).

## Documentos firmables

Tipología del módulo (CDP, actos LP, decreto de pago, etc.): [`catalogo-documentos-firmables.md`](./catalogo-documentos-firmables.md). Fuente transversal: [`arquitectura/especificacion/catalogo-documentos-firmables.md`](../../arquitectura/especificacion/catalogo-documentos-firmables.md). Estándar de anclas y FirmaGob: [`estandar-firma-electronica.md`](../../arquitectura/especificacion/estandar-firma-electronica.md).

## Configuración de firmas (UI)

El hub del módulo incluye **Configuraciones → Firmas**: listado de plantillas firmables y editor de anclas de texto por rol/departamento. Patrón: [`patron-edicion-anclas-firma.md`](../../arquitectura/instrucciones/patron-edicion-anclas-firma.md). Wireframes: [`00-hub-modulo.md`](./wireframes/00-hub-modulo.md), [`90-configuraciones.md`](./wireframes/90-configuraciones.md) y siguientes.
