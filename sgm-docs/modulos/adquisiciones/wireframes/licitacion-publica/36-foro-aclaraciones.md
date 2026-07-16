# Wireframe: Foro de preguntas y aclaraciones

**Sub-paso:** 3.6 — Foro de preguntas y aclaraciones *(Licitación Pública)* — obligatorio como período, gestión condicional a que existan preguntas
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md), con insumos técnicos de la Unidad Solicitante
**Operación:** `recordClarification` · Dependencia: `readMpProcess` — preguntas / aclaración (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Foro de aclaraciones          [Período abierto]  |
+----------------------------------------------------------------+
| [ Simular lectura MP (demo): 3 preguntas recibidas ▾ ]           |
| [ Consultar ]                                                    |
+----------------------------------------------------------------+
| Preguntas recibidas en MP: 3  (gestionadas en el portal)         |
+----------------------------------------------------------------+
| Documento de Aclaración a las Bases (adjunto) *                  |
| [ subir archivo ]                                                |
| ¿La aclaración modifica sustantivamente las bases?  ( ) Sí ( ) No|
+----------------------------------------------------------------+
| [ Registrar aclaración ]                                        |
+----------------------------------------------------------------+
| (si modifica: advertencia — puede requerir acto complementario   |
|  y extensión de plazo)                                           |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Documento de aclaración | *(campo de la operación, no persiste como entidad propia — evento con referencia)* | Sí |
| ¿Modifica sustantivamente? | *(campo de la operación)* | Sí |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Simular lectura MP (demo) | — *(solo prototipo)* | Ilustra preguntas recibidas |
| Registrar aclaración | `recordClarification` | `readMpProcess` (deseada) |

## Estados de pantalla

- **Sin preguntas:** el período transcurre sin gestión — el sub-paso se marca completado sin acción del usuario al vencer el plazo de preguntas de las bases.
- **Con preguntas (camino feliz):** el comprador responde en MP a todas simultáneamente mediante el documento oficial, sin identificar preguntantes; SGM registra el hito y el documento en el expediente. Evento `ClarificationRecorded`.
- **Aclaración que modifica sustantivamente:** advertencia visible — puede requerir `AdministrativeAct` complementario y extensión de plazo; criterio exacto de cuándo exige acto formal **[PENDIENTE P-65]**, no resuelto automáticamente por el sistema.
- **Modo degradado:** sin lecturas MP, registro manual del documento de aclaración únicamente.

## Validaciones visibles

- Documento de aclaración obligatorio para registrar el hito.

## Notas

- Las lecturas de preguntas recibidas y aclaración publicada son **deseadas** (no confirmadas) — degradado: registro manual del documento.
- El selector "Simular lectura MP" es artefacto de prototipo.
