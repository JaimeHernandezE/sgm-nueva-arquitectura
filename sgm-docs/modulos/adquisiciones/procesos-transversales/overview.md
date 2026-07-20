# Procesos transversales de Adquisiciones

Estos cuatro procesos son **compartidos por las 4 modalidades** de compra (Compra Ágil, Convenio Marco, Licitación Pública y Trato Directo). El contenido documentado aquí aplica igual sin importar la modalidad seleccionada.

Solo la etapa 3 (Resolución de Compra) tiene documentación específica por modalidad. *(La etapa 2 se documentó originalmente como específica de Compra Ágil y se reconcilió como transversal — ver nota metodológica en `1. compra-agil/overview.md`.)*

## Etapas transversales

0. [Consulta y alta de expedientes](./0-consulta-expedientes.md) — listado (`listProcurementCases`), apertura de expediente y arranque de creación (hacia 1.0/1.1)
1. [SOLPED](./1-solped.md) — verificación previa optativa (1.0), creación, V°B° de jefatura, verificación presupuestaria, CDP, preobligación (y solicitud de financiamiento optativa)
2. [Modalidad de Compra](./2-modalidad-compra.md) — ratificación/selección de modalidad legal (gateway de validación), aprobación de jefatura (condicional), vinculación con Mercado Público (inmediata en CA/CM, diferida en LP/TD)
4. [Recepción Conforme](./4-recepcion-conforme.md) — recepción física del bien/servicio, verificación de conformidad, alta en inventario/activo fijo (condicional), devengado
5. [Pago](./5-pago.md) — cruce de 3 vías, devengo, decreto y ejecución de pago

## Modalidades (etapa 3 específica)

- [Compra Ágil](../1.%20compra-agil/overview.md)
- [Convenio Marco](../2.%20convenio-marco/overview.md)
- [Licitación Pública](../3.%20licitacion-publica/overview.md)
- [Trato Directo](../4.%20trato-directo/overview.md)

Ver también `modelo-datos/entidades-core.md` para la definición canónica de las entidades usadas en estos procesos.

## OpenAPI

Las rutas HTTP de estas etapas viven en `../openapi/procesos-transversales/` (espejo de esta carpeta). Entrada del módulo: [`../openapi/adquisiciones.openapi.yaml`](../openapi/adquisiciones.openapi.yaml). Ver [`../openapi/README.md`](../openapi/README.md).

