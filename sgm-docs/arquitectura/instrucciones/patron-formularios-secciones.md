# Patrón: secciones y subtítulos en formularios

Documento normativo de **UI/UX transversal** para pantallas de captura y revisión (`form-card`). Guía el armado de prototipos HTML y wireframes: jerarquía visual, agrupación semántica y markup canónico.

> Ilustración con el piloto Adquisiciones (SOLPED 1.1). El patrón aplica a cualquier módulo con formularios en `sgm-prototipos/`.

[Mockup referencia: creación SOLPED](https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/procesos-transversales/11-creacion-solped.html)

**Alcance:** complementa [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md) §7 (wireframes) y convive con [`patron-vista-expediente.md`](./patron-vista-expediente.md) (vista de expediente).
**Estado:** Norma de prototipos — exigible en toda pantalla `form-card` nueva o existente.

## Problema que resuelve

Sin subtítulos de sección, los campos quedan en una lista plana bajo el título del card. El usuario no distingue bloques temáticos (cabecera vs líneas vs adjuntos vs decisión). Los títulos ad hoc con estilo inline no son reutilizables ni auditables.

## Regla

1. Toda pantalla `form-card` con **más de un bloque temático** agrupa los campos en secciones con:
   - subtítulo visible (`.form-section__title`);
   - corte visual (borde superior / espaciado) vía `.form-section`;
   - texto de ayuda opcional (`.form-section__hint`) cuando aclare el contenido del bloque.
2. Pantallas de **un solo bloque** llevan **un** subtítulo de sección: no dejar campos huérfanos bajo el header del card.
3. No inventar secciones artificiales: el criterio es **agrupación semántica** del sub-paso (datos de cabecera, líneas, adjuntos, decisión, firma, lectura de contexto, etc.).
4. El layout ASCII del wireframe debe mostrar **los mismos títulos de sección** que el prototipo HTML.

## Markup canónico

Implementación en [`sgm-prototipos/shared/forms.css`](../../../sgm-prototipos/shared/forms.css).

```html
<div class="form-card__body">
  <section class="form-section">
    <h3 class="form-section__title">Datos de la solicitud</h3>
    <div class="form-row">…</div>
  </section>

  <section class="form-section">
    <h3 class="form-section__title">Documentos de respaldo (opcional)</h3>
    <p class="form-section__hint">Cotizaciones, fotos referenciales…</p>
    …
  </section>
</div>
```

| Clase | Uso |
|---|---|
| `form-section` | Contenedor de un bloque; primera sección sin borde superior |
| `form-section__title` | Subtítulo de sección (`h3`) — no usar `style=` inline |
| `form-section__hint` | Texto secundario bajo el título (tipos de adjunto, avisos cortos) |

## Ejemplo de agrupación — 1.1 Creación de SOLPED

| Sección | Campos |
|---|---|
| Datos de la solicitud | Unidad, descripción, justificación, fecha, modalidad, Resolución Fundada |
| Líneas de bienes/servicios | Tabla + agregar línea |
| Documentos de respaldo (opcional) | Tabla de adjuntos + hint de tipos |
| Pista presupuestaria (opcional) | Línea, año fiscal, enlace consulta saldo |

## Contraejemplos

- Lista continua de `form-row` sin títulos entre cabecera, tablas y acciones secundarias.
- Un solo `h3` a mitad del formulario y el resto de campos sin sección.
- Títulos con `style="font-size:14px;margin:…"` en lugar de `.form-section__title`.

## Correlación wireframe ↔ prototipo

| Artefacto | Exigencia |
|---|---|
| Wireframe `.md` | En el layout ASCII, cada bloque temático lleva su título de sección (texto visible, no solo línea divisoria) |
| Prototipo HTML | Mismos títulos, markup `form-section*` |
| Consolas plataforma | Mismo markup cuando usen `form-card` |

## Relación con otros patrones

- **Expediente:** filas de sub-paso y tintes → [`patron-vista-expediente.md`](./patron-vista-expediente.md).
- **Obligatoriedad de campos:** asteriscos / `(opcional)` → plantilla §7.
- **Operaciones:** todo botón mapea a `contracts.md` → plantilla §7 API-first.
