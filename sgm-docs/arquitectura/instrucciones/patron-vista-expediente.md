# Patrón: vista de expediente detallada

Documento normativo de **UI transversal** (todos los módulos que usan expediente / `CaseStep`). Guía el armado de prototipos y wireframes: fila de sub-paso, tintes de origen, botones vs badges y correlación con contrato.

> Ilustración con el piloto Adquisiciones / Compra Ágil (etapas 1–5). El patrón aplica a cualquier modalidad y, por extensión, a otros módulos con la misma vista de expediente.

[Mockup: listado](https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/01-listado-expedientes.html) · [detalle Compra Ágil](https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/00-expediente/index.html?expediente=ADQ-2026-00123)

**Alcance:** profundiza el patrón «expediente como vista principal» de [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md) §7. Wireframes por sub-paso viven en `modulos/<módulo>/…/wireframes/`.
**Patrón visual:** acordeón por etapa; dentro, una fila por sub-paso.
**Estado:** Propuesta a validar con el equipo (junto con el shell de expediente del prototipo).

## Estructura de la fila de sub-paso (el patrón central)

Cada sub-paso instanciado se representa como una fila de tres zonas más una línea secundaria:

```
N.N — Nombre del sub-paso    |    Unidad Municipal / Rol / Nombre responsable    |    [Acción o Badge]
Tiempo transcurrido: N d N h · Última modificación: fecha · [contexto adicional del paso]
```

- **Zona 1 — identidad:** número y nombre, directamente desde la ficha del sub-paso.
- **Zona 2 — responsable:** formato fijo `Unidad / Rol / Nombre`. El nombre es la persona concreta asignada (resuelta por RBAC dentro del tenant); para actores externos, la contraparte (`Proveedor (MP) / Externo / [razón social]`); para pasos sin unidad SGM, la plataforma (`Mercado Público / — / (proceso externo)`).
- **Zona 3 — acción o estado:** exactamente uno de tres elementos (ver leyenda):
  - **Botón primario** (`Completar formulario`, `Aprobar`, `Registrar recepción`): el paso espera acción del usuario que está mirando. Solo visible si el RBAC lo habilita; para el resto, badge.
  - **Botón secundario** (`Ver formulario`, `Ver OC`, `Ver CDP`): consulta del documento/entidad del paso finalizado.
  - **Badge**: estado puro sin acción (`Finalizado`, `En curso`, `Pendiente`, `Omitido (optativo)`, `Pendiente en MP`, `Esperando sync MP`).
- **Línea secundaria:** tiempo transcurrido y última modificación (de `CaseStep.started_at`/`completed_at`), más contexto propio del paso: monto preobligado (1.6), n° de cotizaciones (3.1), pendiente de sync MP (3.2), condición pendiente (3.4).

## Correlación UI ↔ modelo / contrato

| Elemento | Origen |
|---|---|
| Fila de sub-paso | `CaseStep` (uno por sub-paso instanciado según modalidad) |
| Unidad / Rol | Ficha del sub-paso (tabla de materias) → `CaseStep.responsible_unit` |
| Nombre responsable | Asignación RBAC del tenant (⚠ campo de asignación por definir en `CaseStep`, ver pendientes) |
| Botón primario/secundario | Operación del `contracts.md` del módulo — regla plantilla §7: todo botón mapea a una operación publicada |
| Badge `Omitido (optativo)` | Sub-paso con Optativo=Verdadero no ejecutado; muestra la razón (ej. "disponibilidad verificada en 1.3") |
| Condición pendiente (3.4) | Lectura MP esperada, con su estado confirmada/deseada según plantilla §5.3 |
| Tinte azul + chip externo | Materia Plataforma ≠ SGM (Mercado Público, FirmaGob, Contraloría, SII…) — formato `{Plataforma} · {modo}` |
| Tinte rojizo + chip de módulo | Borde de módulo §3.5 hacia otro módulo SGM (Presupuestos, Contabilidad, Tesorería…) — formato `{Módulo} · {modo}` |
| `border_modules[]` (derivado) | Lista de contrapartes SGM en §3.5; la primera Dependencia alimenta el chip; las demás van en línea secundaria |
| Resumen de etapa plegada | Agregado de sus `CaseStep` + dato clave (ID MP en etapa 2, perfil de recepción en etapa 4) |
| Nota de etapa 5 | Patrón "etapa observada" (ficha 5-pago): eventos del proveedor de tesorería |

## Reglas de comportamiento no evidentes en el dibujo

1. **Estados de despliegue por defecto:** etapa en curso desplegada; finalizadas plegadas con resumen de una línea (el prototipo puede mostrar la etapa 1 desplegada solo para ilustrar el patrón de filas); pendientes plegadas y atenuadas (borde punteado). El usuario puede desplegar cualquiera.
2. **Distinción visual de origen del paso (dos familias de tinte):**
   - **2a — Plataforma externa (tinte azul):** todo sub-paso cuya materia Plataforma sea distinta de SGM (Mercado Público, FirmaGob, Contraloría, SII…) lleva **fondo tintado azul** más un **chip de origen y modo** — ej. «Mercado Público · solo lectura». El chip explicita que SGM refleja y nunca escribe hacia sistemas externos (estándar plantilla §5); para Contraloría en LP, el chip diría «Contraloría · registro manual».
   - **2b — Módulo SGM (tinte rojizo):** todo sub-paso con borde de módulo §3.5 hacia otro módulo SGM distinto del módulo dueño del expediente (p. ej. en Adquisiciones: Presupuestos, Contabilidad, Tesorería…) lleva **fondo tintado rojizo** más un **chip `{Módulo} · {modo}`** — ej. «Presupuestos · dependencia» (1.3, 1.5, 1.6), «Presupuestos · observado» (1.4), «Tesorería · observado». Aplica aunque la ficha mantenga `Plataforma = SGM` y **también si el paso está omitido** (optativo no ejecutado): el tinte identifica el módulo contraparte, no el estado de ejecución.
   - **Prioridad:** si un sub-paso tiene plataforma externa y borde SGM (ej. 5.1 con MP + Contabilidad), prevalece el **tinte azul**; los módulos SGM adicionales se mencionan en la línea secundaria.
   - **Múltiples contrapartes SGM:** el chip muestra la primera contraparte de tipo Dependencia en §3.5; si solo hay Evento, el módulo consumidor del evento (ej. 1.4 → Presupuestos); las demás en línea secundaria (ej. «También: Contabilidad»).
   - **Dependencias externas adicionales:** si el paso ya lleva tinte por borde SGM, las dependencias a sistemas externos adicionales (ej. FirmaGob en 1.5) **no cambian el tinte** — se mencionan solo en la línea secundaria.
   - La condición se deriva de la ficha, no se decide en UI.
3. **Caminos alternativos no se listan como pendientes:** en Compra Ágil, 3.5 (rechazo) y 3.6 (desierto) aparecen solo si ocurren, como intento registrado en la historia del paso — coherente con el pendiente de retrocesos del shell de expediente: la propuesta es "nuevo intento visible en el historial", no reescritura del paso.
4. **El botón primario es personal:** la misma fila muestra `Completar formulario` al responsable habilitado y `En curso` (badge) a cualquier otro usuario. La UI refleja el permiso; la validación vive en el servidor.
5. **Pasos pendientes en MP:** todo sub-paso cuya acción principal ocurre en Mercado Público (o cuyo avance espera una lectura deseada aún no disponible) se muestra de forma **explícita** en el seguimiento con badge `Pendiente en MP` o `Esperando sync MP`, deep link «Gestionar en MP» si la modalidad lo declara, y sin campos editables de datos de MP. Tras la lectura, badge de estado (`Sincronizado`, `Finalizado`, etc.) y, si el volumen de información lo amerita, botón secundario a vista de detalle solo lectura; si no, basta el badge. **Prohibido** transcribir en SGM datos de negocio de MP (plantilla §5.3). Las reglas 2a/2b mantienen el origen siempre visible (`Mercado Público · solo lectura`).
6. **Totales de etapa:** cada etapa desplegada cierra con su tiempo total; alimenta las métricas congeladas al cierre del expediente (ficha 5.5 cuando exista).

## Leyenda visual

| Elemento | Significado |
|---|---|
| Botón oscuro (`Completar formulario`) | Acción requerida del usuario actual (si RBAC lo habilita) |
| Botón con borde (`Ver formulario`, `Ver OC`…) | Consulta de documento/entidad finalizada |
| Badge gris | Estado sin acción disponible para el usuario actual |
| Fondo azul + chip | Paso en plataforma externa a SGM — chip indica origen y modo (`solo lectura`; Contraloría u otros fuera de MP pueden usar `registro manual`) |
| Fondo rojizo + chip | Paso con borde hacia otro módulo SGM — chip indica módulo y modo (`dependencia`, `observado`, `consulta`) |

**Modos del chip de módulo SGM** (derivados de §3.5):

| Modo | Cuándo | Ejemplo |
|---|---|---|
| `dependencia` | Borde Dependencia síncrona bloqueante | `Presupuestos · dependencia` |
| `observado` | Borde Evento asíncrono consumido desde el expediente | `Tesorería · observado` |
| `consulta` | Dependencia cacheada o lectura | `Contabilidad · consulta` |

## Pendientes de definir

> ⚠ **Pendiente de definir:** campo de asignación de persona responsable en `CaseStep` (¿`assigned_user_id` con resolución RBAC al instanciar, reasignable con auditoría?) — necesario para la Zona 2; hoy el modelo solo tiene unidad.

> ⚠ **Pendiente de definir:** catálogo de verbos de botón primario por sub-paso (Completar / Aprobar / Registrar / Decidir) — derivable de las operaciones del `contracts.md`; mantener consistencia de lenguaje en toda la UI.

> ⚠ **Pendiente de definir:** comportamiento del acordeón en expedientes con muchas filas (LP etapa 3: 14 sub-pasos) — ¿paginación interna, agrupación por bloques (bases / evaluación / adjudicación / formalización)? Validar con el equipo usando LP como caso de estrés.

> Heredados del shell de expediente (prototipo `00-expediente/`): formato de folio, momento de instanciación de pasos, estados globales del expediente.
