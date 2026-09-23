# SGM — Prototipos HTML interactivos

Prototipos de validación UX para el Sistema de Gestión Municipal (SGM). Complementan la documentación en [`sgm-docs/`](../sgm-docs/) sin sustituir los wireframes de baja fidelidad (entregable de licitación).

## Relación con sgm-docs

| Artefacto | Ubicación | Propósito |
|---|---|---|
| Ficha de proceso | `sgm-docs/modulos/.../procesos-transversales/` | Reglas de negocio, materias, bordes §3.5 |
| Wireframe spec (`.md`) | `sgm-docs/modulos/.../wireframes/` | Estructura y comportamiento (baja fidelidad) |
| Prototipo HTML | `sgm-prototipos/` | Navegación y validación interactiva |

Antes de editar cualquier pantalla, consultar [`MANIFEST.md`](./MANIFEST.md) y [`shared/steps-manifest.json`](./shared/steps-manifest.json) (espejo ejecutable: `steps-manifest.js`).

## Compartir con quien no usa consola

Los prototipos se publican en **GitHub Pages** al hacer push a `main` (workflow [`.github/workflows/pages-prototipos.yml`](../.github/workflows/pages-prototipos.yml)).

**URL pública** (tras el primer deploy exitoso):

```
https://jaimehernandeze.github.io/sgm-nueva-arquitectura/
```

Abre el **landing** de SGM. Flujo de acceso:

```
/ (landing)
  → auth/clave-unica.html   (simulación ClaveÚnica)
  → home.html               (bienvenida → redirige)
  → plataforma/shell/02-bandeja.html   (bandeja de entrada)
```

Desde la bandeja, el sidebar lleva a Adquisiciones, consolas de plataforma, etc.

**Listado de expedientes** (requiere sesión demo):

```
https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/01-listado-expedientes.html
```

### Activar GitHub Pages (una sola vez)

1. En GitHub: **Settings → Pages**
2. **Build and deployment → Source:** `GitHub Actions`
3. Push a `main` o ejecutar manualmente **Actions → Deploy prototipos → Run workflow**
4. Cuando termine en verde: **Settings → Pages** muestra la URL

### Desarrollo local

Requiere servidor HTTP (los módulos ES no funcionan con doble clic en el archivo):

```bash
npx serve sgm-prototipos
```

`serve` activa *clean URLs* (quita `.html` con redirect). Los enlaces del prototipo se generan **sin** `.html` (vía `siteUrl` / `relativeFormHref`) para no perder el query `?expediente=` en esas redirecciones.

## Estructura

```
sgm-prototipos/
├── index.html              # Landing (entrada GitHub Pages)
├── home.html               # Post-login → redirige a bandeja
├── auth/clave-unica.html   # Simulación ClaveÚnica
├── MANIFEST.md
├── shared/
│   ├── auth-demo.js        # Sesión demo (sessionStorage)
│   ├── landing.css         # Estilos landing / auth
│   ├── app-shell.js        # Sidebar + siteUrl() + requireAuth
│   ├── notifications-ui.js # Campanita + menú cuenta; kinds en ES; leído solo en memoria (reset al refrescar)
│   ├── chat-contextual-ui.js # FAB chat (cerrado por defecto; contexto opt-in; búsqueda persona/depto)
│   ├── shell.css
│   ├── modules-registry.js # Adquisiciones + Plataforma (consolas + Chats)
│   ├── expedientes-demo.js # Perfiles de expediente demo (4 modalidades + caso sin saldo)
│   ├── demo-data/          # Timeline por expediente + plataforma.js (notifications, chatThreads, users)
│   ├── form-presets.js     # Valores de formulario por expediente
│   ├── form-bootstrap.js   # Aplica presets al cargar HTML
│   ├── steps-manifest.json # Pasos transversales del shell
│   ├── steps-manifest-*.js # Etapa 3 por modalidad (CA, CM, LP, TD)
├── plataforma/             # Consolas del core (SUBDERE + municipal)
│   ├── index.html          # Hub elegir consola / bandeja / chats
│   ├── shell/              # 02-bandeja, 03-mis-datos, 05-chats (+ FAB/campanita globales)
│   ├── subdere/            # 01–07 pantallas admin plataforma
│   └── municipal/          # 01–09 pantallas admin municipio (09 = preferencias notificación)
└── modulos/
    └── adquisiciones/
        ├── index.html                  # Bienvenida del módulo
        ├── 01-listado-expedientes.html # Listado (4 modalidades)
        ├── 00-expediente/              # Detalle (wireframe 01) — 5 etapas
        ├── procesos-transversales/     # Etapas 1, 2, 4, 5 — comunes
        ├── 1-compra-agil/              # Etapa 3 Compra Ágil
        ├── 2-convenio-marco/           # Etapa 3 Convenio Marco
        ├── 3-licitacion-publica/       # Etapa 3 Licitación Pública
        └── 4-trato-directo/            # Etapa 3 Trato Directo
```

Local: `npx serve sgm-prototipos` → `/` (landing) → ClaveÚnica → home → bandeja.

### Shell autenticado (resumen demo)

| Pieza | Comportamiento en prototipo |
|---|---|
| Sesión | `auth-demo.js` (sessionStorage); sin sesión → login |
| Campanita / bandeja | C6; tipos en español; marcar leída **solo en memoria** (al refrescar vuelven las no leídas del seed) |
| Preferencias | `municipal/09-preferencias-notificacion.html` |
| FAB Chat | Cerrado por defecto; pregunta abierta; «Incluir contexto»; búsqueda por persona/departamento |
| Chats | Nav Plataforma → `shell/05-chats.html`; hilos con contexto tienen «Ir a la vista citada» |

Cada fila del listado abre un expediente con **las 5 etapas** parametrizadas por modalidad vía `?expediente=`. La **etapa 3** es específica de cada modalidad y está enlazada desde el shell. Los formularios transversales reutilizan el mismo HTML; los valores visibles vienen de `form-presets.js`.

## Convención de numeración

`NN` = etapa × 10 + sub-paso (ej. `11` → sub-paso 1.1 Creación SOLPED).

## Módulo Contabilidad

Módulo construido desde los diagramas draw.io de flujos contables (devengado, pagado, ingresos, tesorería, conciliación, factoring), habilitado dentro del mismo shell. Estado en `localStorage` (botón "Restablecer datos de ejemplo" en Configuración). Entrada directa: `modulos/contabilidad/index.html`. Análisis, supuestos y decisiones en [`docs/contabilidad-flujos-analisis.md`](./docs/contabilidad-flujos-analisis.md).

### Cómo se conectan Adquisiciones y Contabilidad

| Punto | Qué pasa |
|---|---|
| Menú lateral | Contabilidad aparece como módulo habilitado; su navegación (Mi bandeja, Mapa de flujos, Desde Adquisiciones…) vive en el mismo sidebar. |
| 5.1 Cruce de 3 vías | Tras "Ejecutar match" aparece **Registrar devengado en Contabilidad (5.2)**, que abre Contabilidad con la solicitud precargada. |
| Deep link | `modulos/contabilidad/index.html?expediente=ADQ-2026-00123&origen=5.2` (también `4.4`). Si ese expediente ya tiene solicitud, abre la existente: una sola por folio. |
| Datos compartidos | Contabilidad lee `shared/expedientes-demo.js` y `shared/form-presets.js` (glosa, modalidad, monto, OC, proveedor) y lista "Todavía en Adquisiciones" los expedientes en curso antes de 4.4. |
| Enlaces de vuelta | Documentos, recorrido y la tabla "Qué quedó en Adquisiciones" (Mapa de flujos) enlazan a las pantallas de Adquisiciones del mismo sitio. |
| Manifiesto de pasos | `shared/steps-manifest.*` incluye 4.4, 5.2, 5.3 y 5.4 apuntando a Contabilidad. |

Rutas internas de Contabilidad: `#bandeja`, `#flujos`, `#oc`, `#sinoc`, `#ing`, `#tes`, `#conc`, `#pres`, `#diario`, `#inv`, `#cfg`, `#sup`, `#exp=EXP-2026-0001`.

### Cambios sobre Adquisiciones y shared

Todos marcados con el comentario `[Integración SGM]`:

- `shared/app-shell.js`: los enlaces conservan `.html` (y `carpeta/` → `carpeta/index.html`) para funcionar en hosting estático sin clean URLs; nav de Contabilidad en el sidebar.
- `shared/form-shell.js`, `shared/expedientes-demo.js`, `procesos-transversales/12-visto-bueno-jefatura.html`: mismos ajustes de `.html`.
- `shared/modules-registry.js`: módulo Contabilidad habilitado + `contabilidadNav`.
- `shared/auth-demo.js`: sesión en memoria si `sessionStorage` no está disponible; sin sesión abre una sesión demo en vez de redirigir.
- `shared/steps-manifest.js/.json`: pasos 4.4, 5.2, 5.3, 5.4.
- `procesos-transversales/51-cruce-tres-vias.html`: botón hacia Contabilidad (5.2).

### Pendientes para alinear con Adquisiciones

1. El devengado se pide dos veces (4.4 `recordAccrual` y 5.2 `registerAccrual`): debería ser una sola solicitud.
2. `registerInventoryEntry` (4.3) no tiene dueño (X-44); Contabilidad propone el alta de activos en el devengado (MC-3).
3. 5.3/5.4 no contemplan facturas cedidas (factoring): el decreto y el pago deben ir al cesionario (MC-7).

Detalle en `docs/contabilidad-flujos-analisis.md`.
