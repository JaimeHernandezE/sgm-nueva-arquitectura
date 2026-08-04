# Gobierno del repositorio — coherencia operativa

Documento de **gobierno operativo** del repo `nueva-arquitectura`. Define cómo editar sin romper enlaces entre artefactos.

**No confundir con** [`../plan-general.md`](../../plan-general.md): ese gobierna el **corpus de producto** (consistencia entre módulos, B0–B2, grafo `X-nn`). Este documento gobierna el **acto de editar** el repositorio (humano o agente).

**Principio:** una decisión o un hecho vive en un solo lugar; el resto referencia. Duplicar prosa es lo que produce la deriva.

**Regla Cursor orquestadora:** [`.cursor/rules/sgm-gobierno-repo.mdc`](../../../.cursor/rules/sgm-gobierno-repo.mdc) (`alwaysApply: true`).

---

## 1. Mapa de fuentes de verdad

| Tema | Fuente canónica | Al cambiar, también… |
|---|---|---|
| Pendiente transversal | [`decisiones/pendientes.md`](../decisiones/pendientes.md) | Marcador inline `**[PENDIENTE X-nn]**` en el documento origen |
| Norma citada | [`especificacion/registro-normas.md`](../especificacion/registro-normas.md) | Forma canónica + ID `N-nn`; sumar aparición (ruta §) |
| Rol RBAC | [`especificacion/catalogo-roles.md`](../especificacion/catalogo-roles.md) | Fichas, wireframes, `contracts.md` (código estable `adq.*`) |
| Documento firmable / anclas | [`especificacion/catalogo-documentos-firmables.md`](../especificacion/catalogo-documentos-firmables.md) | Mantenedor / prototipo de firmas; patrón anclas |
| Estructura de ficha / contrato / wireframe | [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md) | Cumplir secciones obligatorias; no inventar formato |
| Consistencia entre módulos / secuencia B0–B2 | [`plan-general.md`](../../plan-general.md) | Planes de módulo proponen; no alteran el plan general solos |
| Decisión arquitectónica | ADR en [`decisiones/`](../decisiones/) | Quitar prosa duplicada en módulos; dejar referencia |
| Operación API / borde de módulo | `modulos/<módulo>/contracts.md` + OpenAPI del módulo | Ficha §3.6 (`legal_reference`); fixtures si aplica |
| Campo de dominio | `modelo-datos/entidades-*.md` | Wireframe (Campo UI = Label ES) + prototipo HTML |
| Pantalla de flujo | Wireframe `.md` + prototipo HTML + `steps-manifest.json` | Misma `operationId`; no editar UI en aislamiento |
| Patrón UI expediente / formularios / anclas | [`patron-vista-expediente.md`](./patron-vista-expediente.md), [`patron-formularios-secciones.md`](./patron-formularios-secciones.md), [`patron-edicion-anclas-firma.md`](./patron-edicion-anclas-firma.md) | Wireframe + prototipo alineados |
| NFR / API / seguridad exigibles | Musts, estándares API, seguridad en `especificacion/` | Pendientes `X-nn` si queda abierto |

---

## 2. Checklist pre-cambio

Antes de editar (o al cerrar un cambio):

1. **¿Qué capas toca?** Ficha · contrato · OpenAPI · entidades · wireframe · prototipo · manifiesto · registro (X / N / rol).
2. **¿Hay pendiente nuevo o cerrado?** Alta o estado en `pendientes.md` + marcador inline.
3. **¿Se cita una norma?** Consultar / actualizar `registro-normas.md` (regla `sgm-docs-normas`).
4. **¿Cruza borde de módulo?** El borde vive en `contracts.md` (+ OpenAPI); no acceso directo a datos de otro módulo.
5. **¿Es pantalla o fila de expediente?** Seguir checklist de `sgm-ui-conexiones` (no editar en aislamiento).
6. **¿Es decisión transversal?** Elevar a ADR o `plan-general.md`; en el módulo, solo referencia.
7. **¿Validación `blocking`?** `legal_reference` normativo (forma canónica `N-nn`) o `integridad:*`.

Si el cambio no encaja en ninguna fila del mapa, documentar la excepción en el PR/comentario o proponer alta al mapa.

---

## 3. Qué no hacer

- Inventar artículos, números de norma o umbrales legales no presentes en el corpus / fuente verificada.
- Endpoint o botón sin `operationId` publicada en `contracts.md`.
- Campo en UI sin `entidad.campo` en el modelo.
- Duplicar una decisión ya cerrada en ADR o en `plan-general.md`.
- Engordar reglas Cursor `alwaysApply` con detalle de dominio (eso va en reglas por glob o en este mapa).

---

## 4. Reglas Cursor (índice)

| Regla | Activación | Alcance |
|---|---|---|
| [`sgm-gobierno-repo.mdc`](../../../.cursor/rules/sgm-gobierno-repo.mdc) | **Siempre** | Orquestador: leer este mapa; derivar a dominio |
| [`sgm-ui-conexiones.mdc`](../../../.cursor/rules/sgm-ui-conexiones.mdc) | Globs UI / wireframes / procesos Adq | No editar pantalla en aislamiento |
| [`sgm-docs-wireframes.mdc`](../../../.cursor/rules/sgm-docs-wireframes.mdc) | `sgm-docs/**/wireframes/**` | Spec ↔ prototipo |
| [`sgm-prototipos-html.mdc`](../../../.cursor/rules/sgm-prototipos-html.mdc) | `sgm-prototipos/**` | Convenciones HTML / shell |
| [`sgm-docs-normas.mdc`](../../../.cursor/rules/sgm-docs-normas.mdc) | `sgm-docs/**/*.md` | Citas → `registro-normas.md` |

**Segunda ola (solo si el error se repite):** pendientes `X-nn`, sync contracts↔OpenAPI, modelo de datos. No crearlas de antemano.

---

## 5. Mantención

- Dueño: equipo de arquitectura SGM (mismo criterio que `plan-general.md`).
- Revisar este mapa en cada cierre de bloque (B0/B1/B2) o cuando aparezca un tipo nuevo de artefacto canónico.
- Cambios al mapa = cambio de gobierno; preferir PRs pequeños y regla Cursor alineada.
