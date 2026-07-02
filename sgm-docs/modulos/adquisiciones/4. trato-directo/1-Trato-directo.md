# Plantilla Maestra de Documentación — SGM

Documento normativo del repositorio `sgm-docs`. Define la estructura obligatoria de toda la documentación de procesos, contratos de módulo, modelo de datos, wireframes y diagramas E-R. El objetivo es que cualquier persona del equipo (o un agente de código trabajando sobre el repo) pueda documentar un macroproceso nuevo sin depender de revisión de formato — solo de contenido.

**Criterio de calidad general (heredado del estándar de Etapa 1):** la especificación debe ser suficiente para que dos equipos independientes puedan construir sistemas funcionalmente equivalentes a partir de ella sola.

**Principio arquitectónico rector (mandato API):** cada módulo expone un contrato de entrada/salida versionado; ningún módulo accede a datos o funcionalidad de otro salvo a través de ese contrato. La documentación de procesos debe hacer visibles los bordes de módulo — cada vez que un flujo cruza de un módulo a otro, ahí vive un contrato. Detalle normativo en [`estandares-api.md`](./estandares-api.md) y [`contrato-api-first.md`](./contrato-api-first.md).

---

## 1. Jerarquía y nomenclatura

| Nivel | Definición | Ejemplo |
|---|---|---|
| **Módulo** | Área funcional mayor del ERP | Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH |
| **Macroproceso** | Flujo de negocio completo, de inicio a fin, dentro de un módulo | Compra Ágil, Licitación Pública |
| **Etapa** | División de alto nivel del macroproceso. Las etapas pueden compartir nombre entre macroprocesos (organizador común) aunque su contenido difiera | 1. SOLPED, 2. Modalidad de Compra |
| **Sub-paso** | Unidad mínima documentable: una acción concreta de una unidad en una plataforma | 1.1 Creación de solicitud |

### Reglas de numeración y archivos

- Etapas: número entero (`1.`, `2.`, ...). Sub-pasos: decimal por etapa (`1.1`, `1.2`, `2.1`, ...). La numeración de sub-pasos reinicia en cada etapa.
- Un archivo `.md` por etapa: `N-nombre-kebab-case.md` (ej. `2-modalidad-compra.md`).
- Cada macroproceso vive en su carpeta: `modulos/<módulo>/<macroproceso>/`, con un `overview.md` obligatorio.
- Carpetas hermanas por módulo: `qa/` (fichas QA en CSV) y `diagramas/` (BPMN en `.drawio`).
- **Contrato por módulo:** cada módulo tiene un `modulos/<módulo>/contracts.md` (estructura en sección 4). Es un documento de nivel módulo, no de macroproceso: los macroprocesos alimentan el contrato, no lo duplican.

---

## 2. Estructura obligatoria del `overview.md` de macroproceso

1. **Título y descripción breve** (1-2 líneas: qué cubre, de dónde a dónde).
2. **Contexto de la modalidad** (qué es, características legales clave, plazos, integración con Mercado Público, edge cases normativos — ver overviews de Adquisiciones como referencia).
3. **Fuente base**: documentos de los que se extrajo la información (con fecha de carga si aplica).
4. **Nota metodológica**: aclarar qué etapas son organizador común y cuáles tienen contenido específico de esta modalidad/macroproceso.
5. **Convenciones de la ficha** (tabla Unidad municipal / Rol / Plataforma / Optativo — puede referenciar esta plantilla en vez de repetirla).
6. **Índice de etapas** con enlaces relativos a cada archivo.
7. **Mapa de bordes del macroproceso:** tabla resumen de todos los cruces de borde de módulo identificados en los sub-pasos (sub-paso / contrato invocado o evento emitido / clasificación). Se construye agregando las secciones 3.5 de las fichas; es el insumo directo de `contracts.md`.
8. **Patrones transversales pendientes de definir**: vacíos que aparecen en más de una etapa y son candidatos a regla única reutilizable.
9. **Referencia al modelo de datos**: link a `modelo-datos/entidades-core.md`.

---

## 3. Estructura obligatoria de la ficha de sub-paso

Cada sub-paso se documenta con esta estructura, en este orden:

### 3.1 Encabezado
`## N.N — Nombre del sub-paso`

### 3.2 Tabla de ficha (obligatoria, 4 materias)

Metadatos del sub-paso: quién del municipio actúa, con qué rol, en qué sistema, y si el paso puede omitirse en el flujo.

| Materia | Valor |
|---|---|
| **Unidad municipal** | Departamento u oficina del municipio que ejecuta o es titular del paso. Valores típicos: Unidad Solicitante / DAF Finanzas / DAF Abastecimiento / Contabilidad / Tesorería / `—` (sin unidad municipal: paso automático o actor externo). |
| **Rol** | Rol funcional del actor humano en este paso, según el catálogo RBAC del módulo ([`seguridad.md`](./seguridad.md) §3; catálogo en **[PENDIENTE P-24]**). Valores provisionales: Usuario / Aprobador / N/A (automático o actor externo). |
| **Plataforma** | Sistema donde se realiza la acción principal de este sub-paso (no todos los sistemas tocados; las integraciones adicionales van en §3.5). Valores: SGM / Mercado Público / Otra (especificar) / secuencia explícita (ej. `SGM → MP (deep link)`). |
| **Optativo** | `Verdadero` si el sub-paso puede omitirse en el flujo sin invalidar el proceso; `Falso` si es obligatorio para continuar. Si la omisión es condicional, documentar la condición en §3.3. |

### 3.3 Detalle
Descripción funcional del sub-paso en prosa. Qué ocurre, quién lo hace, qué condiciones aplican, plazos si existen.

### 3.4 Entidad(es) y campos
- Referenciar entidades por su nombre canónico de `modelo-datos/entidades-core.md`.
- Indicar si el sub-paso **crea** una entidad nueva o **actualiza** una existente (y qué campos toca).
- Si una entidad es nueva, se agrega primero a `entidades-core.md` y luego se referencia aquí — nunca se define solo en el sub-paso.
- Formato: lista con nombre de entidad, campos relevantes con tipo entre paréntesis, y condiciones de obligatoriedad.

### 3.5 Borde de módulo (obligatoria; "Sin cruce" si no aplica)

Declara si el sub-paso cruza el borde del módulo. Un cruce existe cuando el sub-paso: (a) requiere validar o consultar algo que pertenece a otro módulo, (b) escribe o dispara efectos en otro módulo, (c) interactúa con un sistema externo (Mercado Público, FirmaGob, DocDigital), o (d) produce un hecho de dominio que otros deben poder observar.

Formato:

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia (este módulo consume) / Evento (este módulo emite) / Sistema externo / Sin cruce |
| **Contrato / Evento** | Nombre de la operación de contrato o del evento (nomenclatura inglesa: `checkBudgetAvailability`, `PurchaseOrderIssued`) |
| **Contraparte** | Módulo o sistema al otro lado del borde |
| **Clasificación** | Síncrona bloqueante / Asíncrona / Cacheada (ver `musts-arquitectura.md`, sección 5) |
| **Payload** | Entidades/campos que cruzan el borde (referencia a `entidades-core.md`) |

Reglas:
- Toda operación o evento nombrado aquí debe existir (o agregarse) en el `contracts.md` del módulo — nunca se define solo en el sub-paso, misma disciplina que las entidades.
- La clasificación síncrona/asíncrona/cacheada es obligatoria para dependencias; si no está decidida, se marca ⚠ pendiente.
- Heurística de detección sobre el BPMN: **todo cruce de carril hacia una unidad que corresponde a otro módulo es un candidato a borde.**

### 3.6 Edge cases
Todos los caminos no felices conocidos: rechazos, estados desiertos, fallas de integración, cancelaciones, datos inválidos. Si la fuente no define qué ocurre en un edge case identificado, se documenta el caso igualmente y su resolución se marca como pendiente. **Para sub-pasos con borde de módulo, es obligatorio documentar el edge case de proveedor no disponible o rechazo del contrato** (qué hace el flujo si Presupuestos no responde, si la firma falla, si MP está caído).

### 3.7 Pendientes de definir (si aplica)
Formato obligatorio de marcado:

> ⚠ **Pendiente de definir:** descripción del vacío — y si es candidato a regla transversal reutilizable, indicarlo.

**Regla de oro:** un vacío de la fuente se marca como pendiente explícito, nunca se rellena con un supuesto silencioso. Los supuestos razonables pueden proponerse, pero etiquetados como propuesta, no como definición.

### 3.8 Cierre de etapa
Cada archivo de etapa termina con:
- **Resumen de entidades de la etapa** (tabla: Entidad / Tipo de relación / Notas).
- **Resumen de bordes de la etapa** (tabla: Sub-paso / Tipo / Contrato o Evento / Contraparte) — omitible solo si la etapa no tiene ningún cruce.
- Enlaces de navegación: etapa anterior y siguiente.

---

## 4. Estructura obligatoria del `contracts.md` de módulo

Documento único por módulo, en `modulos/<módulo>/contracts.md`. Es la vista de arquitectura del módulo: qué expone, qué ofrece, qué necesita, qué anuncia. Se alimenta de los mapas de bordes de los macroprocesos del módulo. Cuatro secciones fijas (detalle metodológico en `contrato-api-first.md`):

1. **Entidades que expone:** entidades del dominio visibles fuera del borde, con esquema (referencia a `entidades-core.md` + qué subconjunto de campos cruza el borde). Toda entidad que cruza el borde es candidata a payload de API.
2. **Operaciones que ofrece:** endpoints con verbo, ruta, payload de entrada, respuesta, códigos de error posibles y reglas de negocio que valida (clasificación bloqueante/asesora y ancla normativa cuando aplique).
3. **Dependencias que requiere:** contratos de proveedor expresados como interfaces — operación, entrada, respuesta esperada, comportamiento ante falla o rechazo. Nunca como llamadas a un módulo concreto: el proveedor puede ser otro módulo SGM o un sistema municipal externo.
4. **Eventos que emite:** hechos de dominio observables, con esquema del evento.

Reglas:
- Nomenclatura inglesa técnica, consistente con el modelo de datos (`PascalCase` para eventos y entidades, `camelCase` para operaciones).
- Cada operación, dependencia y evento indica en qué sub-paso(s) se origina (trazabilidad proceso ↔ contrato en ambas direcciones).
- Los estándares transversales (esquema de error, versionamiento, paginación, idempotencia, autenticación) **no se repiten** en cada contrato: viven en [`estandares-api.md`](./estandares-api.md) y los contratos los referencian.
- Ante discrepancia entre una ficha de sub-paso y `contracts.md`, se resuelve la inconsistencia antes de dar por cerrado cualquiera de los dos — misma lógica que wireframe vs. entidades.

---

## 5. Reglas del modelo de datos

1. **Fuente única:** todas las entidades se definen en `modelo-datos/entidades-core.md`. Los procesos las referencian, no las redefinen.
2. **Nomenclatura:** inglés, estilo técnico, PascalCase para entidades (`PurchaseRequest`), snake_case para campos (`requesting_unit`).
3. **Extensión de entidades existentes:** si un proceso nuevo necesita un campo en una entidad ya definida, el campo se agrega en `entidades-core.md` con nota de qué proceso lo motivó, y se referencia desde el sub-paso.
4. **Entidades sugeridas:** si el análisis sugiere una entidad que la fuente no confirma (ej. `GoodsReceiptLine`), se marca explícitamente como *(sugerida, no confirmada en fuente)*.
5. **Glosario:** todo término técnico nuevo se agrega al mapeo técnico↔funcional en `modelo-datos/glosario.md`.
6. **Visibilidad de borde:** cada entidad en `entidades-core.md` indica si es **interna** al módulo o **expuesta** en el contrato (y en ese caso, qué subconjunto de campos cruza el borde). Por defecto toda entidad es interna; la exposición se declara, no se asume.

---

## 6. Estructura estándar de wireframes

**Decisión de proyecto: se producen wireframes de baja fidelidad, no mockups.** El diseño visual (colores, tipografía, sistema de diseño) es entregable del adjudicatario de la licitación, no de esta especificación. Los wireframes especifican estructura y comportamiento, no estética.

**Regla API-first:** el frontend base consume la API publicada sin privilegios. Por tanto, toda acción de un wireframe debe corresponder a una operación existente en el contrato del módulo (o en el de un módulo del que este depende). Si un botón no tiene operación de contrato que lo respalde, hay una inconsistencia que resolver — misma lógica que campos vs. entidades.

### Patrón expediente como vista principal

La vista principal de una compra es la **vista de expediente**: timeline vertical de pasos con estado, responsable, tiempo transcurrido y fecha de última modificación por paso (referencia: plataforma Transferencia de Competencias de SUBDERE). Las vistas por etapa son secciones dentro del expediente, no pestañas ni vistas independientes. El **folio** del expediente (`ProcurementCase.folio`) debe ser visible en toda pantalla del proceso.

### Ubicación
`modulos/<módulo>/<macroproceso>/wireframes/` — un archivo por pantalla, nombrado `NN-nombre-pantalla.<ext>` donde `NN` correlaciona con el sub-paso que la motiva (ej. `11-creacion-solped.png` para el sub-paso 1.1).

### Formato aceptado
Imagen exportada (PNG/SVG) + fuente editable si existe (Excalidraw, draw.io). Papel fotografiado es aceptable en fase borrador.

### Contenido obligatorio por wireframe
1. **Identificación:** nombre de pantalla + sub-paso(s) que la motivan.
2. **Todos los campos del formulario**, correlacionados con los campos de entidad del sub-paso — si el wireframe muestra un campo que no existe en `entidades-core.md`, o viceversa, hay una inconsistencia que resolver antes de dar por cerrada la pantalla.
3. **Acciones disponibles** (botones/enlaces), a dónde navega o qué transición de estado dispara cada una, y **qué operación de contrato invoca** (nombre de la operación en `contracts.md`).
4. **Estados de la pantalla:** al menos el estado normal + estados de bloqueo/solo lectura si el proceso los define (ej. SOLPED "En proceso de cotización").
5. **Validaciones visibles:** qué campos son obligatorios, qué condiciones bloquean el avance. Recordatorio de diseño: la validación bloqueante vive en el servidor y llega como error estructurado de la API; el wireframe la refleja, no la reemplaza.

### Anotación acompañante
Cada wireframe lleva un bloque de notas (en un `.md` hermano o dentro de la imagen) con: reglas de comportamiento no evidentes en el dibujo, y pendientes de definir de UI si los hay.

---

## 7. Estructura estándar de diagramas E-R

**Decisión de proyecto: un modelo lógico único, múltiples vistas.** No se produce un diagrama monolítico de todo el sistema.

### Los tres niveles

| Nivel | Contenido | Ubicación |
|---|---|---|
| **Diagrama de contexto** (uno solo) | Solo entidades raíz de cada módulo y las relaciones inter-módulo. **Toda relación inter-módulo del diagrama de contexto debe corresponder a un contrato o evento declarado en algún `contracts.md`** — el contexto es el mapa visual de los contratos. | `modelo-datos/diagramas/contexto-general.<ext>` |
| **Diagrama por dominio/módulo** | Todas las entidades del módulo con campos clave y cardinalidades completas. | `modelo-datos/diagramas/<módulo>.<ext>` |
| **Definición canónica** (texto) | La fuente de verdad: `entidades-core.md`. Los diagramas se derivan de este archivo; ante discrepancia, gana el texto. | `modelo-datos/entidades-core.md` |

### Contenido obligatorio por diagrama de dominio
1. Todas las entidades del módulo, con sus campos (mínimo: los obligatorios y las claves foráneas).
2. Cardinalidades explícitas en cada relación (1:1, 1:N, N:M).
3. Entidades compartidas de otros módulos (`User`, `BudgetLine`, `Invoice`...) se dibujan con estilo diferenciado (ej. borde punteado) y sin detalle de campos — solo el nombre, indicando que su definición vive en otra parte. **Una entidad de otro módulo dibujada con borde punteado implica una dependencia de contrato: debe existir en la sección "Dependencias que requiere" del `contracts.md` del módulo.**
4. Entidades sugeridas no confirmadas se marcan visualmente (ej. fondo distinto) igual que en el texto.
5. Las entidades expuestas en el contrato del módulo se distinguen visualmente de las internas (ej. borde grueso o etiqueta), consistente con la regla 6 del modelo de datos.

### Formato aceptado
Herramienta libre (draw.io, Mermaid embebido en el propio `.md`, dbdiagram) siempre que se versione la fuente editable en el repo. Mermaid tiene la ventaja de ser texto plano diffable y renderizable directo en GitLab.

### Regla de sincronización
Todo cambio en `entidades-core.md` que afecte relaciones o entidades debe reflejarse en el diagrama del dominio correspondiente en el mismo commit (o marcarse como deuda explícita en el mensaje de commit). La misma regla aplica entre mapas de bordes y `contracts.md`.

---

## 8. Criterios de completitud ("definition of done")

Un **sub-paso** está completo cuando:
- [ ] Tabla de ficha con las 4 materias llenas (sin celdas "por ver").
- [ ] Todas las entidades referenciadas existen en `entidades-core.md`.
- [ ] Sección de borde de módulo presente (aunque sea "Sin cruce"); si hay cruce, contrato/evento nombrado y existente en `contracts.md`, con clasificación declarada o marcada ⚠.
- [ ] Todos los edge cases conocidos están documentados, incluidos los de falla de proveedor si hay borde.
- [ ] Ningún vacío de la fuente quedó como supuesto silencioso — todos marcados con ⚠.

Una **etapa** está completa cuando:
- [ ] Todos sus sub-pasos están completos.
- [ ] Tiene resumen de entidades, resumen de bordes (si aplica) y enlaces de navegación.

Un **macroproceso** está completo cuando:
- [ ] Todas sus etapas están completas.
- [ ] El overview lista el mapa de bordes y los patrones transversales pendientes.
- [ ] Existe su ficha QA en `qa/` (si aplica) y su BPMN en `diagramas/`.
- [ ] Sus wireframes cubren al menos las pantallas de los sub-pasos con Plataforma = SGM, con acciones mapeadas a operaciones de contrato.
- [ ] El diagrama E-R del dominio incluye sus entidades.

Un **módulo** está completo cuando:
- [ ] Todos sus macroprocesos están completos.
- [ ] Su `contracts.md` tiene las cuatro secciones pobladas y trazadas a sub-pasos.
- [ ] Toda dependencia declarada tiene definido el comportamiento ante falla o rechazo del proveedor.
- [ ] Prueba de calidad: dos equipos independientes podrían construir, solo desde el contrato, un consumidor del módulo y un proveedor de sus dependencias funcionalmente equivalentes.
