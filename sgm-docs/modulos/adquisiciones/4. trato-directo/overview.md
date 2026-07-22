# Macroproceso: Trato Directo

**Estado: etapa 3 documentada** (ficha [`3-resolucion-compra.md`](./3-resolucion-compra.md)). Las etapas transversales (1, 2, 4 y 5) están en [`procesos-transversales/`](../procesos-transversales/overview.md); la etapa 2 es común a las 4 modalidades (vinculación MP **diferida** a TD §3.2). Ver [Compra Ágil](../1.%20compra-agil/overview.md) como referencia de estructura.

## Contexto de la modalidad

**Qué es.** Mecanismo de contratación **excepcional con publicidad**: el Estado adquiere omitiendo la licitación pública, aplicable exclusivamente bajo **causales restrictivas definidas por ley**. Su corazón procesal no es la compra sino la justificación.

**Características legales clave:**
- **Resolución Fundada exhaustiva** redactada por el equipo legal, citando exactamente el artículo de la Ley 19.886 que habilita la causal y demostrando por qué aplica. Es el documento que sostiene todo el proceso.
- **Toma de Razón de Contraloría** obligatoria si la compra supera las **8.000 UTM** (puede demorar semanas) — modelada en etapa 3 §3.1. Si Contraloría repara la resolución (causal mal justificada), el proceso se cae y el organismo está **obligado a licitar**.
- **Cotizaciones previas:** salvo proveedor único, se solicitan presupuestos a un mínimo de tres proveedores para demostrar eficiencia en la elección.
- **Publicidad en 24 horas:** la resolución y la OC deben publicarse en el portal en máximo 24 horas desde su total tramitación (firma) — publicación + vinculación en §3.2 (**[PENDIENTE P-71]** control bloqueante vs. trazabilidad).
- **Riesgo administrativo:** el uso de Trato Directo sin justificación real detectado en fiscalización posterior deriva en sumarios administrativos graves contra los funcionarios — razón de diseño para que el SGM imponga controles duros en esta modalidad.

**Plazos característicos:** fase inicial 100% interna (sin plazos de portal); Toma de Razón de semanas si supera 8.000 UTM; publicación en 24 horas post-tramitación.

**Integración con Mercado Público:** 0 deep links en fase inicial (interna al SGM) + vinculación en §3.2 + lecturas con **doble validación**: el SGM verifica vía lectura que el proceso figure válidamente **"Publicado"** en MP **y** que la OC asociada esté **"Aceptada"** (§3.3). Ver [`integracion-mercado-publico.md`](../../../arquitectura/especificacion/integracion-mercado-publico.md). Sin ambas confirmaciones, el SGM **bloquea el paso contable a Compromiso Cierto** — garantía de diseño de que ninguna contratación directa oculta llega a pago. **Hito contable crítico:** doble validación (Publicado + OC Aceptada) → Compromiso Cierto.

**Edge cases normativos que el proceso debe cubrir:** reparo de Contraloría (→ proceso se cae, obligación de licitar); rechazo de OC por el proveedor (→ Trato Directo queda sin efecto; nuevo proceso con nueva justificación — **[PENDIENTE P-69]**); fiscalización posterior adversa (el sistema debe conservar la trazabilidad completa de la causal, cotizaciones previas y resolución para defensa en auditoría).

**Fuente base:** *Guía de integración SGM – ChileCompra* (cargada julio 2026); ficha QA de Adquisiciones (`../qa/ficha-qa-adquisiciones.csv`).

Ver [`modelo-datos/entidades-core.md`](../../../modelo-datos/entidades-core.md) para las entidades canónicas reutilizadas (`ProcurementCase`, `PurchaseOrder`, `BudgetCommitment`, `AdministrativeAct`, `ComptrollerReview`, etc.).
