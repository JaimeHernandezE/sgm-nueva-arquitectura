# Macroproceso: Licitación Pública

**Estado: pendiente de documentar.** Ficha de flujo SOLPED → Pago para la modalidad Licitación Pública. Las etapas 2 y 3 serán específicas de esta modalidad; las etapas transversales (1, 4 y 5) están en [`procesos-transversales/`](../procesos-transversales/overview.md). Ver [Compra Ágil](../1.%20compra-agil/overview.md) como referencia de estructura.

## Contexto de la modalidad

**Qué es.** Procedimiento administrativo de carácter general, abierto y competitivo, **obligatorio para adquisiciones que superen las 100 UTM** y no estén disponibles en Convenio Marco. Es la modalidad de mayor formalidad procesal.

**Características legales clave:**
- **Bases aprobadas por Decreto o Resolución** antes de publicar: Bases Administrativas (reglas legales) + Bases Técnicas (requerimiento), con criterios de evaluación y ponderaciones explícitas.
- **Foro de preguntas y respuestas:** los proveedores preguntan por el foro electrónico; el comprador responde a todas simultáneamente en un documento oficial de Aclaración a las Bases, sin identificar a quien preguntó.
- **Garantías:** Seriedad de la Oferta (si se exige, para postular) y Fiel Cumplimiento (usualmente previa a la OC), más contrato físico o electrónico en muchos casos.
- **Comisión Evaluadora** con Acta de Evaluación: puntajes asignados estrictamente según las bases, tras el Acto de Apertura Electrónica.
- La adjudicación se formaliza con **Resolución de Adjudicación** publicada en el portal.

**Plazos característicos:** publicación mínima de 5 días corridos (licitaciones menores) hasta 20–30 días corridos (gran envergadura), según monto.

**Integración con Mercado Público:** 0 deep links — SGM opera **en modo monitor desde el inicio** — y 3 lecturas API: hitos de publicación (Publicada / En Foro / En Evaluación), **Resolución de Adjudicación** y OC Aceptada. Ver [`integracion-mercado-publico.md`](../../../arquitectura/especificacion/integracion-mercado-publico.md). **Particularidad contable de esta modalidad:** el monto adjudicado suele diferir del estimado en la pre-afectación; la lectura de la Resolución de Adjudicación importa monto real y RUT del ganador y gatilla el **ajuste automático de disponibilidad presupuestaria** antes del Compromiso Cierto. **Hito contable crítico:** OC Aceptada → Compromiso Cierto (tras contrato y garantías).

**Edge cases normativos que el proceso debe cubrir:** oferta inadmisible (omisión de documento obligatorio o incumplimiento técnico mínimo → queda fuera aunque tenga mejor precio); licitación desierta (sin postulantes o todos inadmisibles → resolución de desierto; relicitar o, bajo causales, pasar a Trato Directo); revocación por interés público antes de adjudicar; ganador que no firma contrato (→ cobro de Garantía de Seriedad y facultad de **readjudicar** al segundo lugar).

**Fuente base:** *Guía de integración SGM – ChileCompra* (cargada julio 2026); ficha QA de Adquisiciones (`../qa/ficha-qa-adquisiciones.csv`).

Ver [`modelo-datos/entidades-core.md`](../../../modelo-datos/entidades-core.md) para las entidades ya definidas en Compra Ágil que probablemente se reutilizan aquí (`PurchaseRequest`, `PurchaseOrder`, `BudgetCommitment`, etc.) — extender esa fuente única en vez de redefinir.
