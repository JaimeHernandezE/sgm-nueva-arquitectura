# Wireframe: Chat contextual (shell)

**Consola:** Shell global (pantallas autenticadas)  
**Producto:** [`mensajeria/overview.md`](../../mensajeria/overview.md)  
**Prototipo:** [`sgm-prototipos/shared/chat-contextual-ui.js`](../../../../sgm-prototipos/shared/chat-contextual-ui.js) (demo)

## Layout — FAB

```
+-- viewport ------------------------------------------+
|  ... contenido de la vista ...                       |
|                                                      |
|                                      [ chat FAB ]    |
+------------------------------------------------------+
```

## Layout — panel abierto (por defecto sin contexto)

```
+------------------------------------------+
| Chat                              [ × ]  |
+------------------------------------------+
| Contexto                                 |
| Pregunta abierta (sin contexto).         |
| [ Incluir contexto de esta vista ]       |
|   Disponible: Creación SOLPED · ADQ-…    |
+------------------------------------------+
| Para *                                   |
| [ chips seleccionados ]                  |
| [ Buscar por persona o departamento… ]   |
|   María López — Finanzas › Presupuestos  |
|   Carmen Díaz — Finanzas › Tesorería     |
+------------------------------------------+
| Mensajes                                 |
|  (vacío o hilo demo en memoria)          |
+------------------------------------------+
| [ Escribe un mensaje…          ] [ Enviar]|
+------------------------------------------+
```

## Layout — con contexto adjunto

```
| Contexto                                 |
| [ Creación SOLPED · ADQ-2026-00045  × ]  |
|   (× = Quitar → vuelve a pregunta abierta)|
```

## Campos ↔ producto

| Campo UI | Concepto | Obligatorio |
|---|---|---|
| Contexto | Opt-in: título + folio/recurso + deep link | No (pregunta abierta por defecto) |
| Destinatarios | Usuarios 1..N; búsqueda por persona o departamento | Sí (≥1 para enviar) |
| Mensaje | Texto del hilo | Sí |

## Acciones

| Botón | Efecto (producto real) | Demo prototipo |
|---|---|---|
| FAB / Abrir | Abre panel sin contexto | Igual |
| Incluir contexto | Adjunta contexto de la vista actual | Igual |
| Quitar contexto (× en chip) | Vuelve a pregunta abierta | Igual |
| Cerrar (× / Escape / clic fuera) | Cierra panel | Igual |
| Agregar destinatario | Busca por nombre o departamento y añade | Combobox demo |
| Enviar | Persiste mensaje; puede disparar evento → C6 | Stub en memoria + respuesta simulada |

## Estados

- **Cerrado por defecto:** al cargar la vista el panel está oculto; solo se ve el FAB.
- **Pregunta abierta (al abrir):** sin chip de proceso; CTA para incluir contexto.
- **Con contexto:** chip visible; deep link asociado; se puede quitar.
- **Sin destinatarios:** Enviar deshabilitado o validación visible.
- **Cerrado:** panel oculto (× / Escape / clic fuera / FAB); FAB visible.
