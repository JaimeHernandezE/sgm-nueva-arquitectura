# Wireframe: Preferencias de notificación

**Consola:** Municipal (ajuste del propio usuario; política municipal restringe opt-out)  
**Operaciones:** `getNotificationPreferences`, `upsertNotificationPreferences`; *(inferida, admin)* `upsertTenantNotificationPolicy`  
**Prototipo:** [`sgm-prototipos/plataforma/municipal/09-preferencias-notificacion.html`](../../../../sgm-prototipos/plataforma/municipal/09-preferencias-notificacion.html)

## Layout — preferencias del usuario

```
+----------------------------------------------------------+
| Preferencias de notificación                             |
+----------------------------------------------------------+
| Canales                                                  |
| ☑ Bandeja in-app (siempre activa)                        |
| ☑ Correo electrónico                                     |
| ☐ (WhatsApp — no disponible en v1)                       |
+----------------------------------------------------------+
| Correo — por tipo                                        |
| Acción requerida (obligatorios del municipio) [fijo: sí] |
| Informativas                              [ sí / no  v ] |
| Recordatorios / plazos                    [ sí / no  v ] |
| Digest diario (agrupado)                  [ sí / no  v ] |
+----------------------------------------------------------+
| Horario (correo)                                         |
| No molestar desde [ 20:00 ] hasta [ 08:00 ]              |
| Solo días hábiles                         [ sí / no  v ] |
+----------------------------------------------------------+
| [ Guardar ]  [ Cancelar ]                                |
+----------------------------------------------------------+
| Nota: el municipio puede forzar correo en hechos         |
| críticos; esos no admiten opt-out.                       |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Correo habilitado | `NotificationPreference.email_enabled` | Sí |
| Correo para `info` | `NotificationPreference.email_for_info` | Sí |
| Correo para `deadline` | `NotificationPreference.email_for_deadline` | Sí |
| Digest diario | `NotificationPreference.email_digest_daily` | Sí |
| No molestar desde/hasta | `NotificationPreference.quiet_hours_start` / `quiet_hours_end` | No |
| Solo días hábiles | `NotificationPreference.quiet_weekends` | Sí |
| Política obligatorios | `TenantNotificationPolicy.mandatory_email_kinds` / event types | (admin) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Cargar | `getNotificationPreferences` | Preferencias del actor |
| Guardar | `upsertNotificationPreferences` | Persistencia; rechaza opt-out de obligatorios |
| (Admin política) | `upsertTenantNotificationPolicy` *(inferido)* | Qué eventos exigen correo |

## Estados de pantalla

- **Opt-out bloqueado:** control deshabilitado + texto “Exigido por política municipal”.
- **Sin correo en perfil:** aviso; canal correo no entregará hasta completar email de `User` (o atributo de contacto — ⚠ alinear con identidad).

## Validaciones visibles

- Si correo está activo, al menos un tipo (`action_required` fijo o `info`/`deadline`/`digest`) debe quedar habilitado o la política municipal lo impone.
- `quiet_hours_start` / `end` coherentes si ambos presentes.
