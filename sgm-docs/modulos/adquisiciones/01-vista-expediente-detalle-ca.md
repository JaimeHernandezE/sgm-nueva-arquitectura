# Wireframe 01 — Vista de Expediente detallada (Compra Ágil)

[Mockup interactivo](./01-vista-expediente-detalle-ca.html)

**Pantalla:** Vista principal del expediente con etapas desplegables y sub-pasos en formato fila.
**Sub-paso(s) que la motivan:** Transversal — profundiza el wireframe `00-vista-expediente` con el detalle intra-etapa. Compra Ágil como ejemplo (etapas 1–5 según fichas vigentes).
**Patrón:** acordeón por etapa; dentro, una fila por sub-paso.
**Estado:** Propuesta a validar con el equipo, junto con el wireframe 00.

## Estructura de la fila de sub-paso (el patrón central de esta pantalla)

Cada sub-paso instanciado se representa como una fila de tres zonas más una línea secundaria:

```
N.N — Nombre del sub-paso    |    Unidad Municipal / Rol / Nombre responsable    |    [Acción o Badge]
Tiempo transcurrido: N d N h · Última modificación: fecha · [contexto adicional del paso]
```

- **Zona 1 — identidad:** número y nombre, directamente desde la ficha del sub-paso.
- **Zona 2 — responsable:** formato fijo `Unidad / Rol / Nombre`. El nombre es la persona concreta asignada (resuelta por RBAC dentro del tenant); para actores externos, la contraparte (`Proveedor (MP) / Externo / [razón social]`); para pasos sin unidad SGM, la plataforma (`Mercado Público / — / (proceso externo)`).
- **Zona 3 — acción o estado:** exactamente uno de tres elementos (ver leyenda del SVG):
  - **Botón primario** (`Completar formulario`, `Aprobar`, `Registrar recepción`): el paso espera acción del usuario que está mirando. Solo visible si el RBAC lo habilita; para el resto, badge.
  - **Botón secundario** (`Ver formulario`, `Ver OC`, `Ver CDP`): consulta del documento/entidad del paso finalizado.
  - **Badge**: estado puro sin acción (`Finalizado`, `En curso`, `Pendiente`, `Omitido (optativo)`, `Esperando MP`).
- **Línea secundaria:** tiempo transcurrido y última modificación (de `CaseStep.started_at`/`completed_at`), más contexto propio del paso: monto preobligado (1.6), n° de cotizaciones (3.1), modo degradado (3.2), condición pendiente (3.4).

## Correlación UI ↔ modelo / contrato

| Elemento | Origen |
|---|---|
| Fila de sub-paso | `CaseStep` (uno por sub-paso instanciado según modalidad) |
| Unidad / Rol | Ficha del sub-paso (tabla de materias) → `CaseStep.responsible_unit` |
| Nombre responsable | Asignación RBAC del tenant (⚠ campo de asignación por definir en `CaseStep`, ver pendientes) |
| Botón primario/secundario | Operación del `contracts.md` de Adquisiciones — regla plantilla §7: todo botón mapea a una operación publicada |
| Badge `Omitido (optativo)` | Sub-paso con Optativo=Verdadero no ejecutado; muestra la razón (ej. "disponibilidad verificada en 1.3") |
| Condición pendiente (3.4) | Lectura MP esperada, con su estado confirmada/deseada según plantilla §5.3 |
| Tinte azul + chip externo | Materia Plataforma ≠ SGM (Mercado Público, FirmaGob, Contraloría, SII…) — formato `{Plataforma} · {modo}` |
| Tinte rojizo + chip de módulo | Borde de módulo §3.5 hacia otro módulo SGM (Presupuestos, Contabilidad, Tesorería…) — formato `{Módulo} · {modo}` |
| `border_modules[]` (derivado) | Lista de contrapartes SGM en §3.5; la primera Dependencia alimenta el chip; las demás van en línea secundaria |
| Resumen de etapa plegada | Agregado de sus `CaseStep` + dato clave (ID MP en etapa 2, perfil de recepción en etapa 4) |
| Nota de etapa 5 | Patrón "etapa observada" (ficha 5-pago): eventos del proveedor de tesorería |

## Reglas de comportamiento no evidentes en el dibujo

1. **Estados de despliegue por defecto:** etapa en curso desplegada; finalizadas plegadas con resumen de una línea (el SVG muestra la etapa 1 desplegada solo para ilustrar el patrón de filas); pendientes plegadas y atenuadas (borde punteado). El usuario puede desplegar cualquiera.
2. **Distinción visual de origen del paso (dos familias de tinte):**
   - **2a — Plataforma externa (tinte azul):** todo sub-paso cuya materia Plataforma sea distinta de SGM (Mercado Público, FirmaGob, Contraloría, SII…) lleva **fondo tintado azul** más un **chip de origen y modo** — ej. «Mercado Público · solo lectura». El chip explicita que SGM refleja y nunca escribe hacia sistemas externos (estándar plantilla §5); para Contraloría en LP, el chip diría «Contraloría · registro manual».
   - **2b — Módulo SGM (tinte rojizo):** todo sub-paso con borde de módulo §3.5 hacia otro módulo SGM distinto de Adquisiciones (Presupuestos, Contabilidad, Tesorería…) lleva **fondo tintado rojizo** más un **chip `{Módulo} · {modo}`** — ej. «Presupuestos · dependencia», «Tesorería · observado». Aplica aunque la ficha mantenga `Plataforma = SGM` (casos 1.3, 1.6).
   - **Prioridad:** si un sub-paso tiene plataforma externa y borde SGM (ej. 5.1 con MP + Contabilidad), prevalece el **tinte azul**; los módulos SGM adicionales se mencionan en la línea secundaria.
   - **Múltiples contrapartes SGM:** el chip muestra la primera contraparte de tipo Dependencia en §3.5; las demás en línea secundaria (ej. «También: Contabilidad»).
   - **Exclusión (sin cambio):** pasos SGM con dependencia externa *secundaria* (ej. 1.5 firma vía FirmaGob) no se tintan: la plataforma del paso es SGM y la dependencia se menciona en la línea secundaria.
   - La condición se deriva de la ficha, no se decide en UI.
3. **Caminos alternativos no se listan como pendientes:** 3.5 (rechazo) y 3.6 (desierto) aparecen solo si ocurren, como intento registrado en la historia del paso — coherente con el pendiente de retrocesos del wireframe 00: la propuesta de esta pantalla es "nuevo intento visible en el historial", no reescritura del paso.
4. **El botón primario es personal:** la misma fila muestra `Completar formulario` al responsable habilitado y `En curso` (badge) a cualquier otro usuario. La UI refleja el permiso; la validación vive en el servidor.
5. **Contexto degradado explícito:** cuando un dato entró por registro manual (`entry_mode = manual`), la línea secundaria lo dice y recuerda que MP prevalece — el usuario nunca debe dudar del origen del dato. Las reglas 2a/2b son la versión visual del mismo principio: origen siempre visible.
6. **Totales de etapa:** cada etapa desplegada cierra con su tiempo total; alimenta las métricas congeladas al cierre del expediente (ficha 5.5).

## Leyenda visual

| Elemento | Significado |
|---|---|
| Botón oscuro (`Completar formulario`) | Acción requerida del usuario actual (si RBAC lo habilita) |
| Botón con borde (`Ver formulario`, `Ver OC`…) | Consulta de documento/entidad finalizada |
| Badge gris | Estado sin acción disponible para el usuario actual |
| Fondo azul + chip | Paso en plataforma externa a SGM — chip indica origen y modo (`solo lectura`, `registro manual`…) |
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

> Heredados del wireframe 00 (no duplicar): formato de folio, momento de instanciación de pasos, estados globales del expediente.
