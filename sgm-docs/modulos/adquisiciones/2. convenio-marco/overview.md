# Macroproceso: Convenio Marco

Ficha de flujo SOLPED → Pago para la modalidad Convenio Marco. Documenta la etapa **específica** de esta modalidad (3, "Resolución de Compra"); las etapas transversales (1, 2, 4 y 5) están en [`procesos-transversales/`](../procesos-transversales/overview.md). Ver [`3-resolucion-compra-convenio-marco v2.md`](./3-resolucion-compra-convenio-marco%20v2.md) para el detalle de los 8 sub-pasos.

## Contexto de la modalidad

**Qué es.** **Primera opción legal de compra** para bienes y servicios estandarizados de consumo frecuente. Opera como tienda virtual/catálogo electrónico cuyas condiciones comerciales y técnicas ya fueron licitadas a nivel nacional por ChileCompra: el municipio compra sobre condiciones pre-adjudicadas.

**Características legales clave:**
- **Obligatoriedad de consulta:** si el bien/servicio está en el catálogo, esta vía antecede a las demás. Si el producto no existe en el catálogo (o no cubre la región del municipio), el comprador queda liberado para usar otra modalidad (Compra Ágil o Licitación).
- **Dos sub-modalidades según monto:**
  - **Compra Directa** (< 1.000 UTM): OC directa al proveedor del catálogo.
  - **Gran Compra** (> 1.000 UTM): obligación legal de crear una "Intención de Compra"; el sistema alerta a todos los proveedores del catálogo del rubro para que ofrezcan descuentos, con plazo mínimo de respuesta de **10 días hábiles**; luego se evalúa y selecciona.
- **Regla de precio externo menor:** si el mismo bien existe más barato fuera del catálogo, el comprador debe primero pedir al proveedor del Convenio que iguale el precio; solo si no accede puede comprar fuera.
- Sin límite de monto (la sub-modalidad cambia en 1.000 UTM).

**Plazos característicos:** compra directa inmediata (catálogo online); Gran Compra ≥ 10 días hábiles de ventana de ofertas.

**Integración con Mercado Público:** 1–2 deep links (carro de compras / inicio de Gran Compra) + 1 lectura API (OC Aceptada). Ver [`integracion-mercado-publico.md`](../../../arquitectura/especificacion/integracion-mercado-publico.md). **Particularidad de esta modalidad:** requiere **sincronización diferencial del catálogo** (deltas diarios de productos, precios, quiebres de stock y cobertura regional) para que la SOLPED se arme sobre el catálogo espejado en SGM con valores exactos — es el único punto de la integración MP que va más allá de estados de proceso. **Hito contable crítico:** lectura de OC Aceptada → Compromiso Cierto.

**Edge cases normativos que el proceso debe cubrir:** rechazo de OC por proveedor sin stock (justificado; habilita "Reclamo" en ChileCompra con eventuales multas o suspensión del proveedor); producto inexistente en catálogo o sin cobertura regional (→ liberación hacia otra modalidad, decisión que debe quedar registrada); precio externo menor (→ flujo de solicitud de igualación antes de comprar fuera).

**Fuente base:** *Guía de integración SGM – ChileCompra* (cargada julio 2026); ficha QA de Adquisiciones (`../qa/ficha-qa-adquisiciones.csv`).

Ver [`modelo-datos/entidades-core.md`](../../../modelo-datos/entidades-core.md) para las entidades ya definidas en Compra Ágil que probablemente se reutilizan aquí (`PurchaseRequest`, `PurchaseOrder`, `BudgetCommitment`, etc.) — extender esa fuente única en vez de redefinir.
