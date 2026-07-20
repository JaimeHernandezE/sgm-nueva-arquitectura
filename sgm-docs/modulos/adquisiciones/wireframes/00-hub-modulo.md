# Wireframe: Hub del módulo Adquisiciones

**Pantalla:** Inicio del módulo  
**Rol:** Lectura — cualquier rol Adquisiciones; Configuraciones — administrador municipal / operador de plantillas  
**Prototipo:** `sgm-prototipos/modulos/adquisiciones/index.html`

## Layout

```
| Módulo Adquisiciones                                              |
|-------------------------------------------------------------------|
| Ciclo de compras públicas municipales…                            |
|                                                                   |
| [1 SOLPED] → [2 Modalidad] → [3 Resolución] → [4 Recepción] → [5 Pago] |
|  (transv.)     (por mod.)      (por mod.)       (transv.)     (transv.) |
|                                                                   |
| Las etapas 1, 4 y 5 son transversales; 2 y 3 varían por modalidad.|
|                                                                   |
| [ Ver expedientes ]                                               |
|-------------------------------------------------------------------|
| Modalidades                                                       |
| +------------------+  +------------------+                        |
| | Compra Ágil      |  | Convenio Marco   |                        |
| | resumen…         |  | resumen…         |                        |
| | [ Ver expedientes ] → listado?modality=agile_purchase           |
| +------------------+  +------------------+                        |
| (igual Licitación Pública y Trato Directo con su modalityKey)     |
| Etapas 1, 4 y 5 son transversales a las cuatro modalidades.       |
|-------------------------------------------------------------------|
| Configuraciones                                                   |
| Plantillas de documentos firmables, anclas de firma por rol.      |
| [ Abrir configuraciones ]                                         |
```

## Notas

- Las cards de modalidad resumen el tipo de compra; **Ver expedientes** abre el listado con `?modality=` (`agile_purchase` | `framework_agreement` | `public_tender` | `direct_procurement`) y preselecciona el filtro Modalidad.
- El CTA del welcome abre el listado sin filtro.
- Configuraciones enlaza a `configuraciones/index.html`.
