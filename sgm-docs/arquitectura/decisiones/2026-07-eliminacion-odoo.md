# 2026-07 — Eliminación de Odoo como base del stack SGM

**Estado:** Aceptada
**Fecha:** Julio 2026

## Contexto

El SGM se venía desarrollando sobre Odoo 17, con un piloto en 5 municipios (Quilaco, Cochamó, Villarrica, María Pinto, y un quinto) cubriendo 5 módulos (Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH/Remuneraciones). El enfoque previo era de doble track: un desarrollo "Odoo viable máximo" en paralelo con bases de migración a futuro — este ADR reemplaza ese enfoque.

La auditoría QA del módulo de Adquisiciones (65+ ítems documentados) reveló que buena parte del trabajo de corrección clasificado como "Interno" requería una dotación de roles (PO, Analista funcional, Arquitecto, Desarrollador, UX/UI, QA) que el equipo real no tiene — el equipo SGM son 3 personas, con capacidad técnica profunda concentrada en una sola.

Adicionalmente, se identificaron hallazgos de diseño estructural — no solo bugs — como la sobre-generalización de "Modalidad de Compra" y "Resolución de Compra" en un único modelo/vista aplicado indistintamente a las 4 modalidades de compra (Compra Ágil, Convenio Marco, Licitación, Trato Directo), cuando en la práctica cada una requiere campos, validadores y flujos de aprobación propios (hallazgos 66 y 67 de la ficha QA).

A esto se suma un patrón recurrente detectado en la auditoría de la integración con FirmaGob: la existencia de una UI de configuración no implica que la integración funcione ("field presence ≠ functional integration"). Este criterio se generalizó como lente de evaluación para el resto de las integraciones con plataformas externas (Mercado Público, Clave Única, DocDigital, SEM, PISEE, Contraloría), y refuerza que los problemas de Odoo no eran solo de volumen de bugs sino de profundidad de integración real.

La conducta del proveedor anterior (Resit) también informó varios de los no negociables arquitectónicos adoptados en esta decisión, en particular la exigencia de que la arquitectura sea especificada por SUBDERE y no delegada al proveedor adjudicado.

## Decisión

Se descontinúa Odoo como base del stack SGM. Se licita un ERP desde cero, usando como insumo:

- Los BPMN de macroprocesos ya mapeados (sirven como especificación funcional, independiente de la plataforma de implementación).
- La ficha QA de 65+ ítems (cada hallazgo se traduce de "bug a corregir" a "requisito que el sistema nuevo debe cumplir").
- Documentación nueva: modelo entidad-relación (extraído del Odoo actual como insumo, luego rediseñado) y wireframes de baja fidelidad por proceso.

### Visión de arquitectura del nuevo stack

La decisión de abandonar Odoo va de la mano con una visión de arquitectura impulsada por la jefatura, que se fija como marco para las bases de licitación:

- **Motor de backend API-first**, con dos modos de consumo: hosting completo por SUBDERE para municipios pequeños, y consumo del módulo à la carte vía API para municipios grandes que ya cuentan con sistemas propios.
- **Independencia estricta entre módulos**, con contratos de entrada/salida versionados.
- **Ecosistema abierto de terceros** construido sobre la API pública — el frontend base debe consumir esa misma API sin privilegios especiales, para que la opción de ecosistema externo sea genuinamente viable a futuro.
- **Especificación por propiedades verificables, no por tecnología nombrada**, para no generar restricciones indebidas en la licitación (Ley 19.886).
- **Multitenancy basado en schemas.**
- La arquitectura debe quedar especificada por SUBDERE, nunca delegada al proveedor que se adjudique la licitación; si la capacidad interna no alcanza, se acota un contrato de asesoría menor manteniendo la propiedad de la decisión en SUBDERE.

## Consecuencias

- El objetivo de "5 pilotos con 5 módulos funcionando en Odoo para fin de 2026" queda sin vigencia en su forma original — pendiente de redefinir con la jefatura y DM.
- El track de "corrección interna de Odoo" (Interno/Licitación por umbral de complejidad) deja de aplicar tal cual — todo el desarrollo futuro pasa por licitación del ERP nuevo.
- El foco del equipo SGM se redirige a producir especificación de calidad (BPMN, modelo de datos, wireframes) para las bases de licitación, no a desarrollo directo. El módulo de Adquisiciones / macroproceso Compra Ágil ya sirve como prueba de método: fichas de proceso para las 5 etapas (SOLPED, Modalidad de Compra, Resolución de Compra CA/LP, Recepción Conforme, Pago), modelo de datos preliminar de 14 entidades, patrón de Expediente de Compra (`ProcurementCase`), estándar de integración read-only con Mercado Público, parámetros normativos configurables (`NormativeParameter`) y wireframes SVG del expediente. Esta metodología debe replicarse en Tesorería, Contabilidad, Presupuestos y RRHH.
- JPL, que ya estaba pensado para construirse directo en el nuevo stack sin pasar por Odoo, mantiene esa definición — a evaluar si se adelanta en el roadmap.
- El convenio DM/municipios para validación de procesos pasa a ser una dependencia dura que debe cerrarse de forma independiente al desarrollo, no como un supuesto implícito.
- La consulta al mercado para la licitación se formaliza como RFI vía Mercado Público (Ley 21.634), reemplazando el esquema de reuniones informales usado en la etapa Odoo.
- Impacto en el formulario EVALTIC 2027: la sección de OKR 2026 se reformula bajo un enfoque de consolidación de calidad en vez de expansión de pilotos; quedan pendientes los criterios objetivos de "hallazgo crítico", la línea base QA de Presupuestos, y el riesgo de cierre de la plataforma PISEE (fin de 2026).
- Quedan como pendientes transversales de la especificación de Adquisiciones (a resolver antes de incorporar a bases): reglas de tolerancia de desviación de precio/monto (sub-etapas 1.1, 3.2, 5.1), fuente concreta de API para `PriceReference`, y manejo de fallas de sincronización con APIs externas.

## Este repositorio

Este repositorio de documentación (`sgm-docs`) nace como consecuencia directa de esta decisión: es el vehículo para producir y versionar la especificación funcional y de datos que alimentará las bases de licitación del ERP nuevo. La vara de calidad exigida es que dos equipos independientes puedan construir sistemas funcionalmente equivalentes a partir solo de la especificación.