# Wireframe: Listado de chats (shell)

**Consola:** Shell / Plataforma  
**Producto:** [`mensajeria/overview.md`](../../mensajeria/overview.md)  
**Prototipo:** [`sgm-prototipos/plataforma/shell/05-chats.html`](../../../../sgm-prototipos/plataforma/shell/05-chats.html)

## Layout

```
+-- sidebar ------------------+-- main -----------------------------+
| Plataforma                 | Chats                               |
|  Inicio                    | +----------------+ +--------------+ |
|  Bandeja                   | | Conversaciones | | Detalle      | |
|  Chats  ←                  | | · hilo A       | | Asunto       | |
|                            | | · hilo B       | | Contexto →   | |
|                            | | · hilo abierta | | [Ir a vista] | |
|                            | +----------------+ | Mensajes…    | |
|                            |                    +--------------+ |
+----------------------------+-------------------------------------+
```

## Reglas

- Hilos **con contexto:** muestran chip/etiqueta y CTA **Ir a la vista citada** (deep link).
- Hilos **pregunta abierta:** sin CTA de vista; etiqueta «Abierta».
- Nav sidebar Plataforma: entrada **Chats** (hub, municipal y SUBDERE).

## Campos demo

| Campo | Origen |
|---|---|
| Asunto / participantes / preview | `chatThreads` en `demo-data/plataforma.js` |
| Contexto.label / deep_link | opt-in; null = abierta |
| Mensajes | array en el mismo seed |
