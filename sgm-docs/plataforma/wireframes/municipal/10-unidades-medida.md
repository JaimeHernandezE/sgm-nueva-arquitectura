# Wireframe: Unidades de medida

**Consola:** Municipal  
**Operaciones:** `listUnitOfMeasures`; *(inferidas)* `createUnitOfMeasure`, `updateUnitOfMeasure`  
**Modelo:** [`UnitOfMeasure`](../../../modelo-datos/entidades-plataforma.md) — catálogo de plataforma, ampliable sin cambiar módulos.

## Layout

```
+----------------------------------------------------------+
| Unidades de medida                                       |
+----------------------------------------------------------+
| Catálogo del municipio (semilla plataforma + altas local)|
| Usado por SOLPED y demás formularios con cantidad.       |
|                                                          |
| | Código   | Nombre      | Símbolo | Origen    | Estado | |
| | unit     | Unidad      | Un      | plataforma| Activa | |
| | bag      | Bolsa       | Bolsa   | plataforma| Activa | |
| | box      | Caja        | Caja    | plataforma| Activa | |
| | ream     | Resma       | Resma   | plataforma| Activa | |
| | g        | Gramo       | g       | plataforma| Activa | |
| | l        | Litro       | L       | plataforma| Activa | |
| | …        | …           | …       | …         | …      | |
+----------------------------------------------------------+
| Agregar / editar                                         |
| Código *   [ ________ ]  (solo en alta; no editable luego)|
| Nombre *   [ ________ ]                                  |
| Símbolo    [ ________ ] (opcional)                       |
| Estado     ( ) Activa  ( ) Inactiva                      |
+----------------------------------------------------------+
| [ Guardar ]  [ Nueva unidad ]                            |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Código | `UnitOfMeasure.code` | Sí (alta) |
| Nombre | `UnitOfMeasure.name` | Sí |
| Símbolo | `UnitOfMeasure.symbol` | No |
| Estado | `UnitOfMeasure.status` | Sí |
| Origen | `UnitOfMeasure.source` | — (lectura: `platform_seed` / `tenant_custom`) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listUnitOfMeasures` (`status=all`) | Tabla completa |
| Nueva / Guardar alta | `createUnitOfMeasure` | Alta `tenant_custom` |
| Guardar edición | `updateUnitOfMeasure` | Nombre, símbolo, estado |
| Desactivar | `updateUnitOfMeasure` (`status=inactive`) | Deja de aparecer en selectores de módulos |

## Estados de pantalla

- **Semilla plataforma:** filas `source = platform_seed` — se puede desactivar o renombrar; no se elimina el `code`.
- **Alta municipal:** `source = tenant_custom`.
- **Código duplicado:** rechazo `UNIT_OF_MEASURE_CODE_DUPLICATE`.

## Notas

- Los módulos consumen solo unidades `active` vía `listUnitOfMeasures` — no hardcodean la lista.
- Ampliar el catálogo (bolsas, cajas, resmas, gramos, litros, …) es operación de **plataforma**, no de Adquisiciones.
