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

Redirige al expediente de demo. Enlace directo:

```
https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/00-expediente/index.html
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

## Estructura

```
sgm-prototipos/
├── MANIFEST.md           # Mapa de conexiones entre artefactos
├── shared/               # CSS, JS y manifiesto de pasos
└── modulos/
    └── adquisiciones/
        ├── 00-expediente/    # Shell del expediente (wireframe 01)
        └── 1-compra-agil/    # Formularios por sub-paso (NN-nombre.html)
```

## Convención de numeración

`NN` = etapa × 10 + sub-paso (ej. `11` → sub-paso 1.1 Creación SOLPED).
