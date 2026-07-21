# Patrón: edición de anclas de firma en plantillas

Documento normativo de **UI/UX transversal** para la vista de configuración de plantillas de documentos firmables: colocación de **anclas de texto** (`{{firma:<role_code>}}`) asociadas a roles funcionales.

> Ilustración con el piloto Adquisiciones (CDP — `adq.cdp`). El patrón aplica a cualquier módulo con documentos firmables.

[Mockup referencia: editor de anclas CDP](https://jaimehernandeze.github.io/sgm-nueva-arquitectura/modulos/adquisiciones/configuraciones/92-editor-anclas.html)

**Alcance:** complementa [`estandar-firma-electronica.md`](../especificacion/estandar-firma-electronica.md) §3–§4 y el [`catalogo-documentos-firmables.md`](../especificacion/catalogo-documentos-firmables.md). Convive con [`patron-formularios-secciones.md`](./patron-formularios-secciones.md) en el panel lateral.

**Estado:** Norma de prototipos — exigible en pantallas de configuración de plantillas/anclas.

---

## Problema que resuelve

Sin un patrón único, cada módulo inventaría coordenadas arrastrables o pantallas de firma que mezclan “firmar” con “mover la firma”. Eso contradice el estándar (coordenadas derivadas; el firmante no edita plantillas) y rompe la trazabilidad rol ↔ ancla ↔ departamento.

---

## Regla

1. La pantalla es de **configuración de plantilla**, no del acto de firma. El firmante no la usa.
2. Layout fijo: **preview del documento** (centro/izquierda) + **panel de puntos de firma** (derecha).
3. Cada punto de firma declara: `role` (catálogo RBAC), `anchor` (token visible), `order`, `optional`, `mode` (informativo según catálogo).
4. Insertar ancla = colocar el token `{{firma:<role_code>}}` en la plantilla (cursor o posición de inserción marcada). **Prohibido** arrastrar cajas de coordenadas libres como fuente de verdad.
5. Un `role` por punto de firma en la misma plantilla (salvo circuitos multi-firmante con `order` distinto y roles distintos).
6. Guardar invoca la operación de configuración (sugerida: `configureDocumentTemplate`), no `requestSignature`.
7. El listado de documentos firmables del módulo precede al editor; cada fila abre la plantilla tipificada por `code` del catálogo.

---

## RBAC

| Quién | Operación (sugerida) | Alcance |
|---|---|---|
| Administrador municipal / operador de plantillas del módulo | `configureDocumentTemplate` | `process_area` / departamento dueño del tipo de documento |
| Firmante (`adq.firmante_cdp`, etc.) | Operaciones de firma del flujo | Expediente — **sin** acceso de edición a plantillas |

La persona que firma se resuelve al momento del acto vía `RoleAssignment` en el nodo orgánico; la configuración de anclas no asigna personas.

---

## Markup canónico

```html
<div class="anchor-editor">
  <div class="anchor-editor__preview" aria-label="Vista previa de la plantilla">
    <!-- documento simulado; anclas como .signature-anchor -->
    <span class="signature-anchor" data-role="adq.firmante_cdp">{{firma:adq.firmante_cdp}}</span>
  </div>
  <aside class="anchor-editor__panel">
    <section class="form-section">
      <h3 class="form-section__title">Puntos de firma</h3>
      <!-- lista de puntos: rol, ancla, orden, opcional -->
    </section>
    <section class="form-section">
      <h3 class="form-section__title">Insertar ancla</h3>
      <!-- select rol + botón insertar en cursor -->
    </section>
  </aside>
</div>
<div class="form-actions">
  <a class="btn btn--secondary">Volver</a>
  <button class="btn btn--primary" type="button">Guardar plantilla</button>
</div>
```

Implementación de estilos: [`sgm-prototipos/shared/shell.css`](../../../sgm-prototipos/shared/shell.css) (clases `.anchor-editor`, `.signature-anchor`).

---

## Layout ASCII (wireframe)

```
| Configuración › Firmas › CDP                                      |
|-------------------------------------------------------------------|
| Vista previa plantilla          | Puntos de firma                 |
|                                 | 1. Firmante CDP                 |
| CERTIFICADO DE DISPONIBILIDAD   |    rol: adq.firmante_cdp        |
| …                               |    ancla: {{firma:adq.firmante_cdp}} |
|                                 |    orden: 1 · obligatorio       |
| [{{firma:adq.firmante_cdp}}]    |                                 |
|                                 | Insertar ancla                  |
|                                 | Rol * [ Firmante CDP      v ]   |
|                                 | [ Insertar en cursor ]          |
|-------------------------------------------------------------------|
| [ Volver ]                              [ Guardar plantilla ]     |
```

Los títulos de sección del panel deben coincidir con el prototipo HTML.

---

## Checklist al crear o editar

1. El `code` del documento existe en el catálogo transversal.
2. Cada `role` existe en [`catalogo-roles.md`](../especificacion/catalogo-roles.md).
3. El token de ancla sigue `{{firma:<role_code>}}`.
4. Wireframe ASCII y HTML comparten secciones y acciones.
5. Ningún control de “firmar ahora” en esta pantalla.
