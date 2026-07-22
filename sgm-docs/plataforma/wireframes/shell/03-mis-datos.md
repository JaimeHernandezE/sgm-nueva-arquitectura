# Wireframe: Mis datos

**Consola:** Shell global (entrada desde menú de cuenta del topbar)  
**Operaciones:** `getCurrentUser`; *(inferida)* `requestProfileChange`  
**Prototipo:** [`sgm-prototipos/plataforma/shell/03-mis-datos.html`](../../../../sgm-prototipos/plataforma/shell/03-mis-datos.html)  
**Catálogo de roles:** [`arquitectura/especificacion/catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24)

Ficha de **solo lectura** del funcionario autenticado: identidad mínima de plataforma, nodos orgánicos y roles vigentes. No es administración de usuarios ni módulo RRHH (vacaciones, liquidaciones, etc. — fuera de alcance).

## Layout

```
+----------------------------------------------------------+
| Mis datos                                                |
+----------------------------------------------------------+
| Datos personales                                         |
| RUN              12.345.678-9                            |
| Nombre visible   Ana Pérez                               |
| Estado           active                                  |
+----------------------------------------------------------+
| Organización y roles                                     |
| | Depto › Unidad              | Rol              | Code | Vigencia |
| | Finanzas › Abastecimiento   | Aprobador de unidad | adq.aprobador_unidad | 2026-01-01 — |
| | Finanzas › Abastecimiento   | Gestor de compra | adq.gestor_compra | 2026-01-01 — |
| (vacío: «Sin roles asignados»)                           |
| Nota: los roles no se editan aquí; el administrador      |
| municipal los gestiona en Roles y unidades.              |
+----------------------------------------------------------+
| Solicitar cambio                                         |
| Nombre visible propuesto (opcional)  [____________]      |
| Motivo / detalle *                   [____________]      |
| [ Enviar solicitud al administrador ]                    |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| RUN | `User.run` | Sí (solo lectura) |
| Nombre visible | `User.display_name` | Sí (solo lectura) |
| Estado | `User.status` | Sí (solo lectura) |
| Depto › Unidad | `OrganizationalUnit` del `RoleAssignment.organizational_unit_id` (+ padre si `kind = unit`) | Sí si hay asignación |
| Rol (`name`) | `Role.name` | Sí si hay asignación |
| Code | `Role.code` | Sí si hay asignación |
| Vigencia | `RoleAssignment.valid_from` / `valid_until` | Sí / No |
| Nombre propuesto | cuerpo `requestProfileChange.proposed_display_name` | No |
| Motivo | cuerpo `requestProfileChange.reason` | Sí |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Cargar ficha | `getCurrentUser` | `User` + `RoleAssignment[]` enriquecidas (Role + OrganizationalUnit) |
| Enviar solicitud | `requestProfileChange` *(inferido)* | Solicitud al admin municipal; no muta `User` en el acto |

## Estados de pantalla

- **Sin roles:** tabla vacía + texto «Sin roles asignados».
- **Varias asignaciones:** todas las vigentes (N filas); no hay «departamento home» en `User`.
- **403 / sesión:** redirigir a login.
- **Solicitud enviada (demo):** confirmación; el cambio real lo aplica el admin vía `updateUser`.

## Frontera con RRHH

Esta pantalla es **core de identidad/RBAC**. Adscripción laboral enriquecida, vacaciones, liquidaciones, días administrativos, capacitaciones y evaluaciones de desempeño corresponden al módulo RRHH/Remuneraciones (aún no documentado) y no se inventan aquí.

## Validaciones visibles

- Motivo obligatorio al enviar solicitud de cambio.
- Campos de identidad y de organización/roles no editables en esta pantalla.
