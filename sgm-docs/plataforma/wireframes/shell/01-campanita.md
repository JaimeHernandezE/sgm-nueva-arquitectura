# Wireframe: Campanita (shell)

**Consola:** Shell global (todas las consolas y módulos)  
**Operaciones:** `listNotifications`; *(inferida)* `markNotificationRead`  
**Prototipo:** chrome en [`sgm-prototipos/shared/notifications-ui.js`](../../../../sgm-prototipos/shared/notifications-ui.js) (montado por `initAppShell`); bandeja [`02-bandeja.html`](../../../../sgm-prototipos/plataforma/shell/02-bandeja.html)

## Layout — icono + dropdown

```
+-- shell header ------------------------------------------+
|  [Logo SGM]  ... navegación ...          [ (3) 🔔 ] [👤] |
+----------------------------------------------------------+

  Al abrir 🔔:
  +----------------------------------------------+
  | Notificaciones                    Ver bandeja|
  +----------------------------------------------+
  | ● Firmar CDP — ADQ-2026-00045                |
  |   Adquisiciones · Acción requerida · hace 12m |
  |   [ Ir a firmar ]                            |
  +----------------------------------------------+
  | ○ OC aceptada — proveedor ACME               |
  |   Adquisiciones · Informativa · hace 1h      |
  |   [ Abrir expediente ]                       |
  +----------------------------------------------+
  | ○ Modalidad pendiente de aprobación          |
  |   Adquisiciones · Acción requerida · ayer    |
  |   [ Ir a actuar ]                            |
  +----------------------------------------------+
  | (máx. N recientes; resto en bandeja)         |
  +----------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Badge no leídas | conteo `Notification` con `read_at` nulo del actor | Sí |
| Título | `Notification.title` | Sí |
| Módulo | `Notification.module` | Sí |
| Tipo | `Notification.kind` (UI: etiqueta ES vía `kindLabel`) | Sí |
| Antigüedad | `Notification.created_at` | Sí |
| Deep link / CTA | `Notification.deep_link` | Sí |
| Leída (●/○) | `Notification.read_at` | No |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Abrir campanita | `listNotifications` (`limit` recientes, `unread_first`) | Dropdown |
| Ir a firmar / Abrir / Ir a actuar | navegación `deep_link` + `markNotificationRead` *(inferido)* | Marca leída; abre destino |
| Ver bandeja | navegación a bandeja | Pantalla [`02-bandeja.md`](./02-bandeja.md) |

## Estados de pantalla

- **Sin no leídas:** badge oculto o `0`; lista puede mostrar recientes leídas.
- **Fallo de carga:** mensaje breve; reintento.
- **Scope:** solo notificaciones del usuario autenticado (y las que le correspondan por subrogancia activa).
- **Demo prototipo:** marcar leída no persiste entre refrescos (solo memoria de página).

## Validaciones visibles

- Ninguna de formulario; solo lectura + marcar leída.
