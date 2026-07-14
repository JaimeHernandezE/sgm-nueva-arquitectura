# Wireframe: Integraciones de plataforma

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** `listDmsAdapters`; *(inferida)* `upsertPlatformIntegration`

## Layout

```
+----------------------------------------------------------+
| Integraciones de plataforma                              |
+----------------------------------------------------------+
| Clave Única (OIDC)                                       |
| Issuer URL *      [ ________________ ]                   |
| Client ID *       [ ________________ ]                   |
| [ Guardar CU ]                                           |
+----------------------------------------------------------+
| Mercado Público — webhook nacional                       |
| Endpoint callback [ (solo lectura — generado) ]          |
| Estado suscripción [ activo / pendiente ]                |
| [ Guardar MP plataforma ]                                |
+----------------------------------------------------------+
| Catálogo DmsAdapter                        [ Solo lect.] |
| | adapter_id   | Nombre     | api_style | versión |     |
| | stub_generic | Stub DMS   | rest      | 0.1     |     |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Issuer / Client ID CU | config plataforma (no secreta) | Sí para habilitar C1 |
| Callback MP | config plataforma | No (sistema) |
| Catálogo | `DmsAdapter.*` | — (lectura) |

⚠ Campos secretos de CU/MP no se muestran en claro; rotación vía gestor de secretos (**P-57**).

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Guardar CU / MP | `upsertPlatformIntegration` *(inferido)* | Config plataforma |
| Ver catálogo DMS | `listDmsAdapters` | Lista adaptadores |

## Estados de pantalla

- **CU no configurada:** banner; login personas no disponible.
- **Catálogo DMS vacío:** permitido en v1; stub sandbox debe figurar.

## Validaciones visibles

- Issuer URL con formato URL válido.
- Sin marca de DMS en UI de módulos — solo catálogo aquí.
