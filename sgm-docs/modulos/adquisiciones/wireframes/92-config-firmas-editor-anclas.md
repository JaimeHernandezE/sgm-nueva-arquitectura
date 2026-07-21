# Wireframe: Editor de anclas de firma (CDP)

**Pantalla:** Configuraciones › Firmas › CDP  
**Documento:** `adq.cdp` — Certificado de Disponibilidad Presupuestaria  
**Rol:** Administrador municipal / operador de plantillas  
**Prototipo:** `sgm-prototipos/modulos/adquisiciones/configuraciones/92-editor-anclas.html`  
**Patrón:** [`patron-edicion-anclas-firma.md`](../../../arquitectura/instrucciones/patron-edicion-anclas-firma.md)

## Layout

```
| Adquisiciones › Configuraciones › Firmas › CDP                    |
|-------------------------------------------------------------------|
| Vista previa plantilla              | Puntos de firma             |
|                                     |                             |
| CERTIFICADO DE DISPONIBILIDAD       | 1. Firmante CDP             |
| PRESUPUESTARIA                      |    rol: adq.firmante_cdp    |
| Folio: CDP-····                     |    ancla:                   |
| …                                   |    {{firma:adq.firmante_cdp}}|
| Monto: $ ···                        |    orden: 1 · obligatorio   |
|                                     |                             |
| ___________________________         | Insertar ancla              |
| [{{firma:adq.firmante_cdp}}]        | Rol * [ Firmante CDP   v ]  |
|                                     | [ Insertar en cursor ]      |
|-------------------------------------------------------------------|
| [ Volver ]                                [ Guardar plantilla ]   |
```

## Campos ↔ entidad (sugerida)

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Rol del punto | `SignaturePoint.role` | Sí |
| Ancla | `SignaturePoint.anchor` | Sí |
| Orden | `SignaturePoint.order` | Sí si multi-firmante |
| Opcional | `SignaturePoint.optional` | Sí |

## Acciones

| Control | Operación |
|---|---|
| Insertar en cursor | UI local (coloca token en preview) |
| Guardar plantilla | `configureDocumentTemplate` (stub `demoAction`) |

## Notas

- No hay botón “Firmar”.
- Ancla canónica: `{{firma:adq.firmante_cdp}}`.
- Preview es HTML simulado (no PDF).
