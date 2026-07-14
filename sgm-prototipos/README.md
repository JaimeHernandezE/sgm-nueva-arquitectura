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

Redirige al módulo Adquisiciones. Flujo de navegación:

```
/ → modulos/adquisiciones/ (bienvenida)
  → 01-listado-expedientes.html
  → 00-expediente/index.html?expediente=...
```

**URL pública:**

```
https://jaimehernandeze.github.io/sgm-nueva-arquitectura/
```

Listado de expedientes:

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
├── index.html              # Redirige a Adquisiciones
├── MANIFEST.md
├── shared/
│   ├── app-shell.js        # Sidebar módulos + siteUrl()
│   ├── shell.css
│   ├── modules-registry.js
│   ├── expedientes-demo.js # Perfiles de expediente demo (4 modalidades)
│   ├── demo-data/          # Timeline por expediente (getStages)
│   ├── form-presets.js     # Valores de formulario por expediente
│   ├── form-bootstrap.js   # Aplica presets al cargar HTML
│   ├── steps-manifest.json # Pasos transversales del shell
│   └── steps-manifest-compra-agil.json  # Etapa 3 CA (referencia)
└── modulos/
    └── adquisiciones/
        ├── index.html                  # Bienvenida del módulo
        ├── 01-listado-expedientes.html # Listado (4 modalidades, showcase transversal)
        ├── 00-expediente/              # Detalle (wireframe 01) — etapa 3 stub
        ├── procesos-transversales/     # Etapas 1, 2, 4, 5 — comunes a las 4 modalidades
        └── 1-compra-agil/              # Etapa 3 CA (HTML existente; no enlazada desde shell)
```

Cada fila del listado abre un expediente con **etapas transversales de ejemplo** (1, 2, 4 y 5) parametrizadas por modalidad vía `?expediente=`. La **etapa 3** queda pendiente en todas. Los formularios transversales reutilizan el mismo HTML; los valores visibles vienen de `form-presets.js`.

## Convención de numeración

`NN` = etapa × 10 + sub-paso (ej. `11` → sub-paso 1.1 Creación SOLPED).
