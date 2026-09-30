# Cómo contribuir

Guía para proponer cambios al repositorio de especificación del SGM (Sistema de Gestión Municipal, SUBDERE): documentación en `sgm-docs/`, prototipos en `sgm-prototipos/` y material de apoyo.

Este documento cubre **cómo llega un cambio a `main`**. **Qué** hay que mantener coherente al editar lo define [`gobierno-repositorio.md`](sgm-docs/arquitectura/instrucciones/gobierno-repositorio.md): léelo antes del primer aporte.

---

## El flujo en una línea

**Nada entra directo a `main`.** Todo cambio —incluidos los del mantenedor— llega por una rama y un Pull Request revisado por otra persona.

`main` es lo publicado: cada push que toca `sgm-prototipos/` despliega los prototipos en [GitHub Pages](https://jaimehernandeze.github.io/sgm-nueva-arquitectura/), y `main` se replica a GitLab SUBDERE.

---

## Dónde se trabaja

**GitHub es el origen:** [`JaimeHernandezE/sgm-nueva-arquitectura`](https://github.com/JaimeHernandezE/sgm-nueva-arquitectura).

El repositorio en `gitlab.subdere.gob.cl/modernizacion/sgm/nueva-arquitectura` es un **espejo**: el job `sync_from_github` de [`.gitlab-ci.yml`](.gitlab-ci.yml) lo sobrescribe con `git push --mirror`. No hagas push ni abras Merge Requests allá; se pierden en la siguiente sincronización.

- **Con acceso de escritura:** clona el repositorio y trabaja en ramas dentro de él.
- **Sin acceso:** haz un *fork*, trabaja en tu copia y abre el Pull Request hacia este repositorio.

---

## Antes de empezar

- **Cambios acotados** (una errata, un enlace roto, una aclaración dentro de una ficha): abre el Pull Request directamente.
- **Cambios que tocan varias capas o una decisión** (un campo nuevo, una operación de contrato, una pantalla, un cambio de patrón UI, un módulo nuevo): abre primero un *issue* y descríbelo. Si el tema es un pendiente ya registrado, cita su ID (`X-nn`, `C-nn`, …).

---

## Paso a paso

```bash
# 1. Partir de lo último
git switch main
git pull

# 2. Una rama por tarea
git switch -c docs/adquisiciones-aclara-cdp

# 3. Editar, revisar y guardar
git add <archivos>
git commit -m "docs(adquisiciones): aclara firmante del CDP en 1.5"

# 4. Subir la rama
git push -u origin docs/adquisiciones-aclara-cdp
```

Luego, en GitHub, abre un Pull Request hacia `main` y completa la plantilla. Si te piden cambios, agrégalos como commits nuevos en la misma rama.

**Desde un fork**, mantén tu copia al día:

```bash
git remote add upstream https://github.com/JaimeHernandezE/sgm-nueva-arquitectura
git fetch upstream
git rebase upstream/main
```

### Nombres de rama

`tipo/ámbito-descripción`, por ejemplo `feat/contabilidad-conciliacion` o `fix/prototipos-enlace-bandeja`.

| Tipo | Para qué |
|---|---|
| `docs/` | Fichas, contratos, modelo de datos, ADR, registros |
| `feat/` | Pantalla, flujo o módulo nuevo en prototipos |
| `fix/` | Corregir algo que no funciona o está inconsistente |
| `estilo/` | Cambios visuales sin cambio de contenido |
| `chore/` | CI, reglas de Cursor, mantenimiento |

### Mensajes de commit

El repositorio usa `tipo(ámbito): descripción`, en español y en presente:

```
docs(presupuestos): agrega validación de saldo en 1.3
feat(contabilidad): prototipo de flujos de devengado
fix(prototipos): corrige siteUrl en consolas municipales
```

El ámbito es el módulo (`adquisiciones`, `contabilidad`, `tesoreria`, `presupuestos`, `rrhh`), `plataforma`, `arquitectura` o `prototipos`. Un commit por idea; evita commits por archivo cuando el cambio es uno solo.

### Tamaño

Un Pull Request, un cambio coherente. **Coherente no es lo mismo que pequeño:** si un campo nuevo exige tocar entidad, contrato, wireframe y prototipo, esas capas van **juntas** en el mismo Pull Request (ver abajo). Lo que no conviene es mezclar dos temas independientes.

---

## Coherencia del corpus

El corpus está enlazado: una ficha cita operaciones de `contracts.md`, un wireframe cita campos de `entidades-*.md`, un prototipo refleja un wireframe. Un cambio en una capa sin las otras produce deriva.

Antes de abrir el Pull Request, recorre el [checklist pre-cambio](sgm-docs/arquitectura/instrucciones/gobierno-repositorio.md#2-checklist-pre-cambio) y el [mapa de fuentes de verdad](sgm-docs/arquitectura/instrucciones/gobierno-repositorio.md#1-mapa-de-fuentes-de-verdad) de `gobierno-repositorio.md`. Los casos más frecuentes:

| Si cambias… | Revisa también |
|---|---|
| Un campo de dominio | `modelo-datos/entidades-*.md`, wireframe y prototipo HTML |
| Una operación o botón | `contracts.md` + OpenAPI del módulo; ninguna acción sin `operationId` publicada |
| Una pantalla o fila del expediente | Wireframe `.md`, HTML, `steps-manifest.json` / `.js` y [`MANIFEST.md`](sgm-prototipos/MANIFEST.md) |
| Una cita normativa | [`registro-normas.md`](sgm-docs/arquitectura/especificacion/registro-normas.md) (forma canónica, `N-nn`) |
| Un pendiente abierto o cerrado | [`pendientes.md`](sgm-docs/arquitectura/decisiones/pendientes.md) + marcador `**[PENDIENTE X-nn]**` en el origen |
| Una decisión transversal | ADR en [`decisiones/`](sgm-docs/arquitectura/decisiones/) o [`plan-general.md`](sgm-docs/plan-general.md); en el módulo, solo la referencia |

Y lo que **no** se hace (detalle en [§3 del gobierno](sgm-docs/arquitectura/instrucciones/gobierno-repositorio.md#3-qué-no-hacer)): inventar normas, artículos, umbrales, endpoints o campos que no estén en el corpus o en una fuente verificada. Si falta el dato, se registra como pendiente.

---

## Reglas por carpeta

### `sgm-docs/`

- Fichas, contratos y wireframes siguen la [plantilla maestra](sgm-docs/arquitectura/instrucciones/plantilla-maestra-sgm.md): no inventes formato.
- Los wireframes son baja fidelidad y viven aquí; el HTML vive solo en `sgm-prototipos/`.
- Nombres de entidad en inglés técnico (`PurchaseRequest`); cada campo con su Label (ES).

### `sgm-prototipos/`

- Vanilla HTML/CSS/JS con `type="module"`: sin frameworks ni build.
- Necesita servidor (los módulos ES no cargan con doble clic):

  ```bash
  npx serve sgm-prototipos
  ```

- Convenciones de shell, numeración `NN-nombre.html`, enlaces con `siteUrl()` y acciones demo: [`sgm-prototipos/README.md`](sgm-prototipos/README.md) y la regla [`sgm-prototipos-html.mdc`](.cursor/rules/sgm-prototipos-html.mdc).

### `bd-export-odoo/`

Diccionario de la base Odoo **legado**, como referencia de migración. No es especificación del sistema nuevo: los modelos nuevos se definen en `sgm-docs/modelo-datos/`.

### `informes/`

Los `.docx` no se revisan en un diff. Si modificas uno, describe en el Pull Request qué secciones cambiaron. Si el documento se genera con un script (`_generar_*.py`), cambia el script y regenera; no edites el `.docx` a mano.

### `inventario-repositorio.md` y `anatomia-y-arquitectura.md`

Son actas fechadas, no índices vivos. No se actualizan en cada cambio; se rehacen cuando se decide un nuevo corte, y el Pull Request que lo haga debe actualizar la fecha.

---

## Si trabajas con agentes de código

El repositorio está pensado para leerse también con Cursor o Claude Code. Las reglas de [`.cursor/rules/`](.cursor/rules/) se aplican solas en Cursor; con otras herramientas, pide al agente que lea `gobierno-repositorio.md` antes de editar.

Un cambio hecho por un agente se revisa igual que uno humano. Presta atención a normas, artículos o campos que no existían en el corpus: es el error más frecuente.

---

## Qué pasa después

1. Alguien revisa el Pull Request y comenta.
2. Cuando está aprobado, se integra con **Squash and merge**: queda un solo commit en `main`.
3. Si tocaba `sgm-prototipos/`, GitHub Pages se republica solo en unos minutos.
4. La rama se borra. La réplica a GitLab ocurre en la siguiente sincronización programada.

Dudas o comentarios: jaime.hernandez@subdere.gov.cl — SUBDERE.
