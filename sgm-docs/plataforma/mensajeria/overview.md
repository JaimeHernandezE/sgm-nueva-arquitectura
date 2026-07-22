# Mensajería in-app (contextual)

Producto de **comunicación entre personas** en el SGM, distinto del servicio de notificaciones (C6). Permite iniciar una conversación desde cualquier vista autenticada, con o sin contexto de proceso.

**Prototipo demo (no vinculante):** FAB [`chat-contextual-ui.js`](../../../sgm-prototipos/shared/chat-contextual-ui.js) · listado [`05-chats.html`](../../../sgm-prototipos/plataforma/shell/05-chats.html)  
**Wireframes:** [`04-chat-contextual.md`](../wireframes/shell/04-chat-contextual.md) · [`05-chats.md`](../wireframes/shell/05-chats.md)
**Relación con C6:** [`../notificaciones/overview.md`](../notificaciones/overview.md) §6

---

## 1. Separación respecto de notificaciones (C6)

| | Notificación (C6) | Mensajería |
|---|---|---|
| Origen | Evento de dominio / sistema | Persona |
| Destinatario | Reglas rol/unidad/tenant | Elegido por el emisor (1..N) |
| Efecto de flujo | Puede ser tarea formal (`action_required`) | **No** sustituye firma ni aprobación |
| Archivo | Ítem en bandeja + entregas | Hilo conversacional archivado en el sistema |

El envío de un mensaje **puede** emitir un evento de dominio que C6 entregue como `info` / `action_required` a los participantes (diseño futuro de contrato). La mensajería **no** notifica desde el módulo: si hay aviso, pasa por el bus de eventos.

---

## 2. Must de producto — contexto de vista (opt-in)

Al abrir el chat, la conversación inicia como **pregunta abierta** (sin contexto de proceso).

El sistema **debe** ofrecer incluir el **contexto de la vista actual** con una acción explícita (p. ej. «Incluir contexto de esta vista»):

| Elemento | Ejemplo |
|---|---|
| Pantalla / título | «Creación SOLPED» |
| Recurso de proceso | `ProcurementCase` / folio `ADQ-2026-00045` cuando exista |
| Deep link estable | Ruta al paso o expediente |
| Módulo / área | Adquisiciones, Plataforma, … |

### Quitar contexto

Si el contexto ya está adjunto, el usuario **debe** poder **quitarlo** y volver a pregunta abierta. La decisión (con / sin contexto) se registra en el hilo.

Regla de UX: el contexto **no** se adjunta solo al abrir; se agrega bajo demanda y se puede retirar.

---

## 3. Capacidades

**Must (versión real)**

1. Entrada global (p. ej. FAB) en shell autenticado; se puede cerrar el panel (×, Escape, clic fuera); **cerrado por defecto**.
2. Inicio sin contexto; botón para **incluir** contexto de vista; opción de quitarlo.
3. Destinatarios 1..N con búsqueda por persona y por departamento/unidad (usuarios del tenant visibles según RBAC).
4. Hilo archivado en el sistema (consulta posterior por participantes).
5. Deep link al recurso cuando hay contexto.
6. Listado de conversaciones del usuario con acceso a hilos y, si hay contexto, enlace a la vista citada.

**Ya en prototipo (demo, no vinculante):** FAB [`chat-contextual-ui.js`](../../../sgm-prototipos/shared/chat-contextual-ui.js); listado [`05-chats.html`](../../../sgm-prototipos/plataforma/shell/05-chats.html) con `chatThreads` y CTA «Ir a la vista citada».

**Should**

- Resaltar contexto en el encabezado del hilo.
- Aviso vía C6 a destinatarios al recibir mensaje.

**Could**

- @menciones desde comentarios de expediente (alternativa más liviana).
- Adjuntar documentos (`DocumentRef`) al hilo.

---

## 4. Riesgos

- Usar el chat como sustituto de firma, aprobación o decisión formal del BPMN.
- Tratar el chat como canal de notificación oficial (DocDigital / expediente).
- Perder el deep link cuando el contexto está activo (rompe trazabilidad).

---

## 5. Estado de especificación

- Visión y musts de contexto: este documento.
- Contrato HTTP / entidades (`Conversation`, `Message`, …): **pendiente** (fuera de esta pasada).
- Prototipo: demo UX sin persistencia ni sync multi-usuario; FAB cerrado por defecto; búsqueda de destinatarios; listado de chats en nav Plataforma.
