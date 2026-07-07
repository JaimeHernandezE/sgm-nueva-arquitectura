# SGM — Prototipos HTML interactivos

Prototipos de validación UX para el Sistema de Gestión Municipal (SGM). Complementan la documentación en [`sgm-docs/`](../sgm-docs/) sin sustituir los wireframes de baja fidelidad (entregable de licitación).

## Relación con sgm-docs

| Artefacto | Ubicación | Propósito |
|---|---|---|
| Ficha de proceso | `sgm-docs/modulos/.../procesos-transversales/` | Reglas de negocio, materias, bordes §3.5 |
| Wireframe spec (`.md`) | `sgm-docs/modulos/.../wireframes/` | Estructura y comportamiento (baja fidelidad) |
| Prototipo HTML | `sgm-prototipos/` | Navegación y validación interactiva |

Antes de editar cualquier pantalla, consultar [`MANIFEST.md`](./MANIFEST.md) y [`shared/steps-manifest.json`](./shared/steps-manifest.json) (espejo ejecutable: `steps-manifest.js`).

## Cómo abrir (desarrollo local)

Requiere un servidor HTTP (los módulos ES no funcionan abriendo el archivo directo con doble clic):

```bash
npx serve sgm-prototipos
```

Luego abrir: `http://localhost:3000/` (redirige al expediente de demo).

## Compartir con quien no usa consola

La forma más simple para el equipo es **publicar `sgm-prototipos/` como sitio estático** y compartir un enlace HTTPS. Opciones:

| Opción | Quién configura | Para el destinatario |
|---|---|---|
| **GitLab Pages** (recomendado) | Una vez, quien administra el repo en `gitlab.subdere.gob.cl` | Solo abrir el enlace en el navegador |
| **GitHub Pages** | Si el repo fuente está en GitHub | Igual — enlace en el navegador |
| **Netlify Drop** | Arrastrar la carpeta `sgm-prototipos/` a [app.netlify.com/drop](https://app.netlify.com/drop) | Enlace temporal sin consola ni CI |

Enlace de entrada una vez publicado:

```
https://<tu-dominio>/sgm-prototipos/
```

(o la URL que asigne GitLab Pages / Netlify)

El spec en [`01-vista-expediente-detalle-ca.md`](../sgm-docs/modulos/adquisiciones/01-vista-expediente-detalle-ca.md) puede enlazar a esa URL pública en lugar de la ruta local del repo.

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
