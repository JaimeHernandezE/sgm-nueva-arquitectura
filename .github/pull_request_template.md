## Qué cambia

<!-- Una o dos frases. Si resuelve un issue, escribe "Closes #nn". Si toca un pendiente, cita su ID (X-nn, C-nn, …). -->

## Por qué

<!-- El problema, la fuente o la decisión detrás del cambio. -->

## Capas tocadas

<!-- Marca las que cambian en este Pull Request. -->

- [ ] Ficha de proceso
- [ ] `contracts.md` / OpenAPI
- [ ] Modelo de datos (`entidades-*.md`)
- [ ] Wireframe `.md`
- [ ] Prototipo HTML / `steps-manifest`
- [ ] Registro de normas / pendientes / roles
- [ ] ADR / `plan-general.md`
- [ ] Otro:

## Cómo revisarlo

<!-- Documentos y secciones a leer; pantallas a abrir con `npx serve sgm-prototipos`; qué debería verse. -->

## Capturas

<!-- Antes y después, si cambia algo visible en los prototipos. Si no, bórrala. -->

## Revisión previa ([gobierno del repositorio](https://github.com/JaimeHernandezE/sgm-nueva-arquitectura/blob/main/sgm-docs/arquitectura/instrucciones/gobierno-repositorio.md))

- [ ] La rama parte de un `main` actualizado y el Pull Request trata un solo tema.
- [ ] Las capas relacionadas están sincronizadas **en este mismo** Pull Request (campo ↔ wireframe ↔ prototipo; botón ↔ `operationId`).
- [ ] No inventé normas, artículos, umbrales, endpoints ni campos ausentes del corpus o de una fuente verificada.
- [ ] Normas citadas: forma canónica e ID `N-nn` en `registro-normas.md`, con la aparición sumada.
- [ ] Pendientes nuevos o cerrados: actualizados en `pendientes.md` con su marcador inline.
- [ ] No dupliqué una decisión que ya vive en un ADR o en `plan-general.md`; la referencio.
- [ ] Si toca `sgm-prototipos/`: lo probé servido con `npx serve sgm-prototipos`.
