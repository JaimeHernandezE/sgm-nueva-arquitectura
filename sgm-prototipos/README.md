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
│   ├── notifications-ui.js # Campanita + menú cuenta
│   ├── shell.css
│   ├── modules-registry.js # Adquisiciones + Plataforma (consolas)
│   ├── expedientes-demo.js # Perfiles de expediente demo (4 modalidades + caso sin saldo)
│   ├── demo-data/          # Timeline por expediente + plataforma.js (core)
│   ├── form-presets.js     # Valores de formulario por expediente
│   ├── form-bootstrap.js   # Aplica presets al cargar HTML
│   ├── steps-manifest.json # Pasos transversales del shell
│   ├── steps-manifest-*.js # Etapa 3 por modalidad (CA, CM, LP, TD)
├── plataforma/             # Consolas del core (SUBDERE + municipal)
│   ├── index.html          # Hub elegir consola
│   ├── shell/              # Bandeja C6 + Mis datos (cuenta)
│   ├── subdere/            # 01–07 pantallas admin plataforma
│   └── municipal/          # 01–09 pantallas admin municipio
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

Local: `npx serve sgm-prototipos` → `/` (landing) → login → bandeja.

Cada fila del listado abre un expediente con **las 5 etapas** parametrizadas por modalidad vía `?expediente=`. La **etapa 3** es específica de cada modalidad y está enlazada desde el shell. Los formularios transversales reutilizan el mismo HTML; los valores visibles vienen de `form-presets.js`.

## Convención de numeración

`NN` = etapa × 10 + sub-paso (ej. `11` → sub-paso 1.1 Creación SOLPED).
