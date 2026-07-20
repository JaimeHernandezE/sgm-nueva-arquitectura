# Wireframe: Roles y unidades

**Consola:** Municipal  
**Operaciones:** `listRoleAssignments`, `listRoles` *(inferida)*; *(inferidas)* `createRoleAssignment`, `revokeRoleAssignment`, `listOrganizationalUnits`, `createOrganizationalUnit`, `updateOrganizationalUnit`  
**Catálogo:** [`arquitectura/especificacion/catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)

## Regla de modelo (jerarquía)

Bajo el tenant, la estructura es **Departamento → Unidad**:

```
Municipio
 └── Departamento (Finanzas, Tránsito, Dirección de Obras, …)
      └── Unidad (Abastecimiento, Presupuestos, Tesorería, …)
```

- Al aprovisionar el tenant se clona la **plantilla de plataforma** (`OrgStructureTemplate`). El municipio puede renombrar, agregar, desactivar o reubicar unidades.
- **RBAC:** un usuario puede tener **varias** asignaciones. Cada `RoleAssignment` es la terna **usuario + nodo orgánico + rol** (con vigencia). El nodo es una **unidad**; o un **departamento** solo si no tiene unidades hijas activas.
- SoD y permisos se evalúan sobre el **conjunto** de asignaciones vigentes (detalle ⚠ P-25 / catálogo §7).

## Dos vistas funcionales

Selector en cabecera: **[ Por usuario | Por módulo/proceso ]**. Ambas escriben las mismas operaciones (`createRoleAssignment` / `revokeRoleAssignment`); solo cambia el eje de navegación.

| Vista | Flujo | Para qué |
|---|---|---|
| Por usuario | Elegir persona → listar (Depto › Unidad) + rol → agregar/revocar | Perfil completo del funcionario |
| Por módulo/proceso | Elegir módulo → árbol de etapas → roles del nodo + usuarios asignados → asignar/revocar | Ver cobertura de SOLPED, CDP, recepción, pago; completar huecos |

El árbol de proceso **agrupa** roles del catálogo (`Role.process_area`); no crea permisos por pantalla.

---

## Layout — estructura orgánica (común)

```
+----------------------------------------------------------+
| Estructura del municipio                                 |
| [ + Departamento ]  [ + Unidad ]                         |
+----------------------------------------------------------+
| - Finanzas                                (department)   |
|   - Abastecimiento                        (unit)         |
|   - Presupuestos                          (unit)         |
|   - Tesorería                             (unit)         |
| - Dirección de Obras Municipales          (department)   |
| - Tránsito                                (department)   |
+----------------------------------------------------------+
```

---

## Layout — Por usuario

```
+----------------------------------------------------------+
| Roles y unidades   [ Por usuario | Por módulo/proceso ]  |
+----------------------------------------------------------+
| Usuario *  [ Ana Pérez                        v ]        |
+----------------------------------------------------------+
| Asignaciones vigentes de Ana Pérez          [ + Agregar ]|
| | Nodo orgánico              | Rol               |Desde|×|
| | Finanzas › Abastecimiento  | adq.aprobador_…   |01/01|×|
| | Finanzas › Presupuestos    | adq.firmante_cdp  |01/01|×|
+----------------------------------------------------------+
| Nueva asignación:                                        |
| Departamento * [ Finanzas                 v ]            |
| Unidad *       [ Abastecimiento           v ]            |
| Rol *          [ adq.gestor_compra        v ]            |
| Desde * / Hasta (opcional)                               |
| Advertencia SoD: [ si el conjunto de roles choca ]       |
| [ Guardar asignación ]  [ Cancelar ]                     |
+----------------------------------------------------------+
```

---

## Layout — Por módulo/proceso

```
+----------------------------------------------------------------+
| Roles y unidades   [ Por usuario | Por módulo/proceso ]         |
+----------------------------------------------------------------+
| Módulo * [ Adquisiciones v ]    Filtro unidad [ Todas     v ]  |
+----------------------------------------------------------------+
| Arbol                              | Involucrados               |
| v Adquisiciones                    | Nodo: adq.solped           |
|   > 1. SOLPED            <sel>     |                            |
|   v 2. Modalidad                   | Rol: adq.solicitante       |
|   v 3. Resolución / OC             |  - Ana (Obras)        [x]  |
|   v 4. Recepción                   |  - Luis (Tránsito)    [x]  |
|   v 5. Pago                        | [ + Asignar usuario ]      |
|                                    |                            |
|                                    | Rol: adq.aprobador_unidad  |
|                                    |  - (sin asignaciones)      |
|                                    | [ + Asignar usuario ]      |
+----------------------------------------------------------------+
| Modal asignar: Usuario * | Unidad * | Desde * | Hasta          |
| [ Guardar ]  [ Cancelar ]                                      |
+----------------------------------------------------------------+
```

Al seleccionar un nodo del árbol (`process_area`), el panel derecho lista cada rol del catálogo con ese área y las `RoleAssignment` vigentes (usuario + ruta orgánica). Revocar (×) = una sola asignación.

Nodos Adquisiciones (borrador): `adq.solped`, `adq.modalidad`, `adq.resolucion`, `adq.recepcion`, `adq.pago` — ver catálogo §2.

---

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Nombre departamento/unidad | `OrganizationalUnit.name` | Sí |
| Tipo | `OrganizationalUnit.kind` | Sí |
| Padre (solo unidad) | `OrganizationalUnit.parent_id` | Sí si unidad |
| Usuario | `RoleAssignment.user_id` | Sí |
| Nodo orgánico | `RoleAssignment.organizational_unit_id` | Sí |
| Rol | `RoleAssignment.role_id` → `Role.code` | Sí |
| Área de proceso (vista módulo) | `Role.process_area` | — (filtro UI) |
| Desde / Hasta | `valid_from` / `valid_until` | Desde sí; hasta no |

**Unicidad sugerida:** no duplicar la misma terna (`user_id`, `organizational_unit_id`, `role_id`) con vigencia solapada.

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar estructura | `listOrganizationalUnits` *(inferido)* | Árbol depto→unidad |
| + Departamento / + Unidad | `createOrganizationalUnit` *(inferido)* | Alta con `kind` |
| Catálogo / árbol proceso | `listRoles` *(inferido)* | Roles + `process_area` |
| Ver asignaciones | `listRoleAssignments` (filtro `user_id` o `module`) | 0..N filas |
| Agregar / Asignar | `createRoleAssignment` *(inferido)* | Alta; valida SoD |
| Revocar (×) | `revokeRoleAssignment` *(inferido)* | Baja solo esa fila |

## Estados de pantalla

- **Violación SoD:** bloqueo al agregar si el conjunto de roles vigentes es incompatible, salvo excepción vigente (`04-excepciones-sod`).
- **Usuario sin asignaciones / nodo sin cobertura:** empty state + CTA asignar.
- **Departamento sin unidades:** selector ofrece «(el departamento)» como nodo.
- **Catálogo / árbol:** borrador **P-24**; contenido orgánico **P-49**.

## Validaciones visibles

- Usuario, nodo orgánico y rol obligatorios.
- Unidad debe pertenecer al departamento seleccionado (si aplica).
- `valid_until` ≥ `valid_from` si presente.
- Misma terna con vigencia solapada → error.
