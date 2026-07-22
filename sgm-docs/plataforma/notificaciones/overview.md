# Notificaciones (C6) — visión de producto

Servicio transversal del core: consume eventos de dominio de todos los módulos, resuelve destinatarios y entrega por canal. Los módulos **no notifican**; emiten eventos (`musts-arquitectura.md` §9).

**Marco:** [`plataforma-core.md`](../../arquitectura/especificacion/plataforma-core.md) C6 · [`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §9  
**Contrato:** [`../contracts.md`](../contracts.md) §2.7  
**Entidades:** [`entidades-plataforma.md`](../../modelo-datos/entidades-plataforma.md) (`Notification`, `NotificationPreference`, …)  
**Matriz evento → canal (borrador P-06):** [`matriz-evento-canal.md`](./matriz-evento-canal.md)  
**Wireframes:** [`../wireframes/shell/`](../wireframes/shell/) · preferencias en [`../wireframes/municipal/09-preferencias-notificacion.md`](../wireframes/municipal/09-preferencias-notificacion.md)  
**Prototipo:** campanita global (`sgm-prototipos/shared/notifications-ui.js`) · [`02-bandeja.html`](../../../sgm-prototipos/plataforma/shell/02-bandeja.html) · [`09-preferencias-notificacion.html`](../../../sgm-prototipos/plataforma/municipal/09-preferencias-notificacion.html)

---

## 1. Principios

1. **Un solo servicio** suscrito a eventos de todos los módulos.
2. **Canales desacoplados del evento:** la misma emisión puede ir a bandeja, correo y/o DocDigital según reglas.
3. **Destinatarios por rol, unidad y tenant** — más subrogancia (`Delegation`) cuando aplique.
4. **Idempotencia:** un mismo evento no genera ítems duplicados en campanita/bandeja (`dedupe_key`).
5. **La bandeja es de plataforma**, no de cada módulo. Adquisiciones filtra “Por firmar / aprobar” en el listado; el detalle de pendientes vive aquí ([`0-consulta-expedientes.md`](../../modulos/adquisiciones/procesos-transversales/0-consulta-expedientes.md)).

---

## 2. Tipos de ítem

| `kind` (API) | Etiqueta UI (ES) | Significado | Ejemplo |
|---|---|---|---|
| `action_required` | Acción requerida | El destinatario debe actuar para avanzar el flujo | Firmar CDP, aprobar SOLPED, confirmar recepción |
| `info` | Informativa | Hecho informativo; no bloquea al receptor | “Tu compra fue confirmada; proveedor X” |
| `deadline` | Plazo | Aviso de plazo o recordatorio (timers musts §10.4 / P-33) | Cotización sin respuesta en N días hábiles |
| `escalation` | Escalamiento | Escalamiento por inacción | Plazo vencido → rol superior |

Cada ítem lleva `deep_link` estable al expediente/paso (o recurso equivalente), no solo texto. En el prototipo, `kindLabel()` / `KIND_LABELS` en `notifications-ui.js` muestran siempre la etiqueta en español (campanita, bandeja, preferencias).

---

## 3. Canales (v1 y posteriores)

| Canal | Estado | Uso |
|---|---|---|
| **Bandeja in-app** (+ campanita en shell) | Exigible v1 | Canal primario para personas |
| **Correo electrónico** | Exigible v1 | Según preferencias y política municipal (eventos obligatorios sin opt-out) |
| **DocDigital** | Exigible cuando el hecho lo requiera | Notificación **formal**; no es repositorio (C10) |
| **Webhooks M2M** | Exigible (mecanismo P-05) | Sistemas externos / ecosistema; mismo bus de eventos |
| WhatsApp / SMS | Fuera de alcance v1 | Canal futuro opt-in vía `TenantIntegration`; no formal |
| Push móvil | Fuera de alcance v1 | Si hay app |

---

## 4. UX en el shell

### Campanita

Icono global (todas las consolas y módulos). Badge de no leídas. Dropdown con las más recientes: título, módulo, **etiqueta ES del `kind`**, antigüedad, deep link. CTA “Ver bandeja”.

Wireframe: [`../wireframes/shell/01-campanita.md`](../wireframes/shell/01-campanita.md).

**Demo prototipo:** el estado leído vive solo en memoria de la página; al **refrescar** vuelven las no leídas del seed (`notifications-ui.js`).

### Bandeja de entrada

Pantalla completa: filtros por tipo (UI en español; valor API = `kind`), módulo, leída/no leída, rango de fechas; listado con deep link / “Ir a actuar”. Es la fuente canónica de “acciones pendientes del actor”.

Wireframe: [`../wireframes/shell/02-bandeja.md`](../wireframes/shell/02-bandeja.md).

### Preferencias

El usuario elige, dentro de la política del municipio, qué informativas van a correo vs solo bandeja. Las **acciones requeridas** definidas como obligatorias por tenant **no** permiten opt-out de correo.

Wireframe: [`../wireframes/municipal/09-preferencias-notificacion.md`](../wireframes/municipal/09-preferencias-notificacion.md).

---

## 5. Capacidades por prioridad

### Must (v1)

- Campanita + bandeja + deep links
- Tipos `action_required` / `info` (`deadline` / `escalation` cuando existan timers)
- Preferencias de usuario acotadas por política municipal
- Subrogancia: entregar a titular y/o subrogante según reglas de `Delegation`
- Solo destinatarios autorizados (RBAC / SoD)
- Idempotencia y deduplicación
- Auditoría de entrega por canal (`NotificationDelivery`)
- Plantillas por tipo de evento (multi-tenant)

### Should (v1.1)

- Digest / agrupación (“3 OC pendientes”)
- Horario laboral / no molestar (correo)
- Escalamientos y recordatorios (P-33)
- Política municipal de eventos de correo obligatorios
- Vista admin de fallos de entrega y reenvío

### Could (posterior)

- WhatsApp / SMS, push
- Resúmenes diarios por correo
- Acciones one-click desde correo (con controles de seguridad)
- Mensajería in-app (ver §6)

---

## 6. Mensajería in-app (producto aparte)

**No forma parte de C6.** Spec: [`../mensajeria/overview.md`](../mensajeria/overview.md).

| | Notificación (C6) | Mensajería |
|---|---|---|
| Origen | Evento de dominio / sistema | Persona |
| Destinatario | Reglas rol/unidad | Elegido por el emisor |
| Efecto de flujo | Puede ser la tarea formal (`action_required`) | No sustituye firma ni aprobación |
| Archivo | Ítem en bandeja + entregas | Hilo conversacional |

Must de producto en mensajería: conversación inicia **sin** contexto (pregunta abierta); el usuario puede **incluir** el contexto de la vista actual y **quitarlo** después. Spec: [`../mensajeria/overview.md`](../mensajeria/overview.md). El envío de un mensaje puede, en el futuro, emitir un evento que C6 entregue a los participantes.

---

## 7. Riesgos a evitar

- Notificar desde el módulo (rompe musts §9).
- Bandeja duplicada por módulo (ya rechazada en listado de expedientes).
- Usar WhatsApp o chat como canal formal (lo oficial va por DocDigital / expediente).
- Sustituir tareas de firma/aprobación por mensajes informales.

---

## 8. Pendientes

| ID | Tema |
|---|---|
| **P-05** | Mecanismo de entrega a sistemas (webhooks, cola, ambos) |
| **P-06** | Matriz evento → canal → destinatario — borrador en [`matriz-evento-canal.md`](./matriz-evento-canal.md) |
| **P-33** | Timers / escalamientos que alimentan `deadline` y `escalation` |
| **P-48** | Cuerpos HTTP completos de ops de inbox (hoy stub / inferidas en contracts §2.7 / §2.11) |
