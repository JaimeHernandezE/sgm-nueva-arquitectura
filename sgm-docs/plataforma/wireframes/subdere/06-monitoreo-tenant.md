# Wireframe: Monitoreo por tenant

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** *(pendiente — observabilidad musts-arquitectura §8 / P-08)*; sin `operationId` estable en `contracts.md` aún

## Layout

```
+----------------------------------------------------------+
| Monitoreo por tenant                                     |
+----------------------------------------------------------+
| Tenant *           [ Mun. Alpha              v ]         |
| Ventana            [ últimas 24 h            v ]         |
+----------------------------------------------------------+
| Request rate     [ #### / min ]                          |
| Error rate 5xx   [ #.# % ]                               |
| Latencia p95     [ ### ms ]                              |
| Docs almacenados [ # ]  (C10, si disponible)             |
+----------------------------------------------------------+
| [ Actualizar ]  [ Exportar CSV ]                         |
+----------------------------------------------------------+
| ⚠ Pantalla estructural: la fuente de métricas y el      |
|   contrato de consulta de observabilidad están pendientes |
|   (musts §8, P-08). No inventar endpoints aquí.          |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Tenant | filtro por `Tenant.id` | Sí |
| Ventana | parámetro de consulta | Sí |

No hay entidad de dominio propia; lectura de capa de observabilidad.

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Actualizar / Exportar | *(pendiente P-08)* | — |

## Estados de pantalla

- **Sin backend de métricas:** empty state con enlace a pendiente.
- **Tenant suspendido:** métricas históricas disponibles; live opcional.

## Validaciones visibles

- Tenant obligatorio para consulta.
