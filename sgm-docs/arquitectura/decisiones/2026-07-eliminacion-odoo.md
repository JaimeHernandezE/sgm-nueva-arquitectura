# 2026-07 — Eliminación de Odoo como base del stack SGM

**Estado:** Aceptada
**Fecha:** Julio 2026
**Versión:** v2 (agosto 2026) — agrega el fundamento arquitectónico determinante (§1.1) y la sección de alternativas consideradas (§2). **La decisión no cambia.** Ver registro de cambios al final.
**Origen:** Auditoría QA de Adquisiciones + revisión de arquitectura de la jefatura
**Plan general:** [`../../plan-general.md`](../../plan-general.md) §4

## Contexto

El SGM se venía desarrollando sobre Odoo 17, con un piloto en 5 municipios (Quilaco, Cochamó, Villarrica, María Pinto, y un quinto) cubriendo 5 módulos (Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH/Remuneraciones). El enfoque previo era de doble track: un desarrollo "Odoo viable máximo" en paralelo con bases de migración a futuro — este ADR reemplaza ese enfoque.

Cuatro hallazgos fundan la decisión. El primero es el determinante: es el único que no se resuelve con más presupuesto ni con más equipo.

### 1.1 Odoo no puede dar paridad de acceso sin una capa construida y mantenida a mano

El objetivo de arquitectura es que **cualquier tercero tenga exactamente los mismos accesos a la plataforma que SUBDERE**. Es el principio no negociable N°1 —el frontend base consume la API pública sin privilegios especiales— y es la condición de viabilidad tanto del modo à la carte como del ecosistema abierto ([`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §1, §7.2.5).

Odoo no es API-first. Su interfaz externa expone el ORM —el modelo interno— por RPC; no es un contrato de servicio diseñado como tal. Ya estaba documentado antes del desarrollo, en el propio levantamiento:

> «Ofrece APIs abiertas que facilitan la integración con otros sistemas, tanto internos como externos. **No es una API Rest**, sino que a partir de librerías (disponibles para varios lenguajes de programación) desarrollados por Odoo.»
> — Informe 4, «Levantamiento de procesos y diseño de servicio SGM», julio 2024, p. 58

Dar paridad de acceso obliga entonces a construir una capa de contrato encima del ORM, y esa capa es **deuda permanente**:

1. **Se rompe con cada actualización.** Cada versión de Odoo o de un addon puede mover el modelo que la capa expone. Mantenerla al día no es un costo de proyecto, es un costo indefinido.
2. **Si queda incompleta, el dato se bifurca.** Lo que la capa no cubre se consume por otra vía, y aparecen dos versiones de la misma información.
3. **Si cambia, los terceros quedan obsoletos sin aviso.** Un contrato que se mueve cuando se mueve la implementación no es un contrato: es un reflejo. Ninguna implementación externa puede depender de él.
4. **Y la brecha degrada la integridad del dato.** Cuando la capa no alcanza, el consumidor usa el acceso directo al modelo — y ahí se pierde la validación del lado del servidor que exige el principio no negociable N°7. La paridad incompleta no solo deja obsoletos a los proveedores: deteriora el dato municipal.

El principio no negociable pide exactamente la relación inversa: **OpenAPI como fuente de verdad, versionada, y el código validándose contra la especificación, no al revés** ([`../licitacion/principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §1). Esa inversión es la que una plataforma cuyo contrato lo fija su modelo interno no admite.

Formulado como criterio general: **un estándar del Estado no puede tener por contrato el modelo interno de un privado.**

### 1.2 La corrección excedía la capacidad real del equipo

La auditoría QA del módulo de Adquisiciones (65+ ítems documentados) reveló que buena parte del trabajo de corrección clasificado como "Interno" requería una dotación de roles (PO, Analista funcional, Arquitecto, Desarrollador, UX/UI, QA) que el equipo real no tiene — el equipo SGM son 3 personas, con capacidad técnica profunda concentrada en una sola.

### 1.3 Los hallazgos eran de diseño, no de volumen de errores

Se identificaron hallazgos de diseño estructural —no solo bugs— como la sobre-generalización de "Modalidad de Compra" y "Resolución de Compra" en un único modelo/vista aplicado indistintamente a las 4 modalidades de compra (Compra Ágil, Convenio Marco, Licitación, Trato Directo), cuando en la práctica cada una requiere campos, validadores y flujos de aprobación propios (hallazgos 66 y 67 de la [ficha QA](../../modulos/adquisiciones/qa/ficha-qa-adquisiciones.csv)).

### 1.4 Las integraciones estaban declaradas, no implementadas

La auditoría de la integración con FirmaGob mostró un patrón recurrente: la existencia de una UI de configuración no implica que la integración funcione («campo presente ≠ integración funcional»). Este criterio se generalizó como lente de evaluación para el resto de las integraciones con plataformas externas (Mercado Público, Clave Única, DocDigital, SEM, PISEE, Contraloría), y refuerza que los problemas no eran solo de volumen de bugs sino de profundidad de integración real.

La conducta del proveedor anterior (Resit) también informó varios de los no negociables arquitectónicos adoptados en esta decisión, en particular la exigencia de que la arquitectura sea especificada por SUBDERE y no delegada al proveedor adjudicado.

## 2. Alternativas consideradas

| Opción | Por qué se descarta |
|---|---|
| **A. Continuar el doble track** — corregir Odoo mientras se preparan las bases de migración | Es el enfoque vigente hasta este ADR. La auditoría mostró que el track de corrección interna excede la dotación real (§1.2) y que los hallazgos son de diseño, no de volumen (§1.3). Corregir no cambia la naturaleza del contrato (§1.1) |
| **B. Odoo + capa de API propia** — mantener la base y construir encima el contrato REST que da paridad de acceso | Técnicamente posible, y es la alternativa que más lejos llegó en la discusión. Se descarta por la deuda permanente de §1.1: la capa se rompe con cada actualización, y su mantención pasa a ser condición de existencia del ecosistema. Un estándar del Estado no puede depender de que alguien mantenga sincronizada una traducción del modelo interno de un tercero |
| **C. Licitar un ERP nuevo especificado por SUBDERE** | **Adoptada.** Es la única que permite que el contrato sea el artefacto de diseño y no la consecuencia de la implementación |

## 3. Decisión

> Se descontinúa Odoo como base del stack SGM. Se licita un ERP desde cero, especificado por SUBDERE, cuyo contrato de API es un artefacto de diseño versionado y no una derivación del modelo interno de la plataforma.

Insumos de la especificación:

- Los BPMN de macroprocesos ya mapeados (sirven como especificación funcional, independiente de la plataforma de implementación).
- La ficha QA de 65+ ítems (cada hallazgo se traduce de "bug a corregir" a "requisito que el sistema nuevo debe cumplir").
- Documentación nueva: modelo entidad-relación (extraído del Odoo actual como insumo, luego rediseñado) y wireframes de baja fidelidad por proceso.

### Visión de arquitectura del nuevo stack

Marco fijado por la jefatura para las bases de licitación. El catálogo canónico vive en [`../licitacion/principios-no-negociables.md`](../licitacion/principios-no-negociables.md) y [`decisiones-macro-stack.md`](./decisiones-macro-stack.md); aquí solo se enumeran los puntos que esta decisión determina:

- **Motor de backend API-first**, con dos modos de consumo: hosting completo por SUBDERE para municipios pequeños, y consumo del módulo à la carte vía API para municipios grandes con sistemas propios.
- **Independencia estricta entre módulos**, con contratos de entrada/salida versionados.
- **Ecosistema abierto de terceros** sobre la API pública — el frontend base consume esa misma API sin privilegios especiales. Es el requisito de §1.1, y su verificación en recepción está definida en [`../especificacion/contrato-api-first.md`](../especificacion/contrato-api-first.md) §1: cada módulo pasa sus pruebas de integración consumiendo únicamente los contratos publicados de los demás, con las bases de datos del resto inaccesibles.
- **Especificación por propiedades verificables, no por tecnología nombrada**, para no generar restricciones indebidas en la licitación (Ley 19.886, [**NORMA N-09**](../especificacion/registro-normas.md#n-09)).
- **Multitenancy basado en schemas.**
- La arquitectura queda especificada por SUBDERE, nunca delegada al adjudicatario; si la capacidad interna no alcanza, se acota un contrato de asesoría menor manteniendo la propiedad de la decisión en SUBDERE.

## 4. Consecuencias

1. El objetivo de "5 pilotos con 5 módulos funcionando en Odoo para fin de 2026" queda sin vigencia en su forma original — pendiente de redefinir con la jefatura y DM.
2. Los 5 municipios piloto siguen operando sobre la base descartada durante la licitación y el desarrollo. El nivel de soporte que reciben en ese período es decisión de jefatura (**X-14**) y no puede quedar implícita.
3. El track de "corrección interna de Odoo" (Interno/Licitación por umbral de complejidad) deja de aplicar tal cual — todo el desarrollo futuro pasa por licitación del ERP nuevo.
4. El foco del equipo SGM se redirige a producir especificación de calidad (BPMN, modelo de datos, wireframes) para las bases, no a desarrollo directo. Adquisiciones / Compra Ágil ya sirve como prueba de método: fichas de las 5 etapas (SOLPED, Modalidad de Compra, Resolución de Compra CA/LP, Recepción Conforme, Pago), modelo de datos preliminar de 14 entidades, patrón de Expediente de Compra (`ProcurementCase`), estándar de integración read-only con Mercado Público, parámetros normativos configurables (`NormativeParameter`) y wireframes del expediente. Esta metodología se replica en Tesorería, Contabilidad, Presupuestos y RRHH.
5. JPL, que ya estaba pensado para construirse directo en el nuevo stack sin pasar por Odoo, mantiene esa definición — a evaluar si se adelanta en el roadmap.
6. El convenio DM/municipios para validación de procesos pasa a ser una dependencia dura que debe cerrarse de forma independiente al desarrollo, no como un supuesto implícito.
7. La consulta al mercado para la licitación se formaliza como RFI vía Mercado Público (Ley 21.634, [**NORMA N-16**](../especificacion/registro-normas.md#n-16)), reemplazando el esquema de reuniones informales usado en la etapa Odoo.
8. Impacto en el formulario EVALTIC 2027: la sección de OKR 2026 se reformula bajo un enfoque de consolidación de calidad en vez de expansión de pilotos; quedan pendientes los criterios objetivos de "hallazgo crítico", la línea base QA de Presupuestos, y el riesgo de cierre de la plataforma PISEE (fin de 2026).
9. Quedan como pendientes transversales de la especificación de Adquisiciones (a resolver antes de incorporar a bases): reglas de tolerancia de desviación de precio/monto (sub-etapas 1.1, 3.2, 5.1), fuente concreta de API para `PriceReference`, y manejo de fallas de sincronización con APIs externas.

## 5. Pendientes derivados

Registrados en [`pendientes.md`](./pendientes.md); esta decisión es su documento origen o los condiciona directamente.

| ID | Pendiente | Relación con esta decisión |
|---|---|---|
| **X-02** | Especificación de autenticación M2M (scopes por módulo y municipio) | Sin plano M2M no hay paridad de acceso verificable. Es el correlato operativo de §1.1 |
| **X-14** | Nivel de soporte a los 5 pilotos Odoo durante licitación y desarrollo (18–24 meses) | Consecuencia 2. Sin default hasta jefatura |
| **X-17** | Revisión jurídica del contrato original con el proveedor | Condiciona qué se puede afirmar públicamente sobre la conducta del proveedor anterior |
| **X-18** | Encuadre jurídico de la consulta al mercado (RFI / diálogo competitivo) | Consecuencia 7 |
| **X-19** | Borrador mínimo de estándares que gatilla la primera consulta al mercado | Define qué paquete de `sgm-docs` se congela para la convocatoria |

## Este repositorio

Este repositorio de documentación (`sgm-docs`) nace como consecuencia directa de esta decisión: es el vehículo para producir y versionar la especificación funcional y de datos que alimentará las bases de licitación del ERP nuevo. La vara de calidad exigida es que dos equipos independientes puedan construir sistemas funcionalmente equivalentes a partir solo de la especificación ([`../../plan-general.md`](../../plan-general.md) §7.1).

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| v2 | Agosto 2026 | Se agrega §1.1, el fundamento arquitectónico determinante (paridad de acceso y por qué Odoo no la admite sin deuda permanente), con cita a fuente primaria del Informe 4. Se agrega §2, alternativas consideradas, donde queda registrado por qué se descarta «Odoo + capa de API propia». Se numeran los hallazgos del contexto y las consecuencias. Se agrega §5, pendientes derivados con sus IDs. Se condensa la visión de arquitectura, que duplicaba prosa de `principios-no-negociables.md` y `decisiones-macro-stack.md`, dejando referencia. Se agrega la consecuencia 2 (soporte a los pilotos, X-14), que no estaba explícita. **La decisión no cambia.** |
| v1 | Julio 2026 | Creación. Descarte de Odoo y licitación del ERP nuevo |
