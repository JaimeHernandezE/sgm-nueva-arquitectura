# Wireframe: Lista de documentos firmables

**Pantalla:** Configuraciones › Firmas  
**Rol:** Administrador municipal / operador de plantillas  
**Prototipo:** `sgm-prototipos/modulos/adquisiciones/configuraciones/91-firmas.html`  
**Catálogo:** [`../catalogo-documentos-firmables.md`](../catalogo-documentos-firmables.md)

## Layout

```
| Adquisiciones › Configuraciones › Firmas                          |
|-------------------------------------------------------------------|
| Documentos firmables del módulo                                   |
| Anclas por rol; la persona se resuelve al firmar según            |
| departamento (RoleAssignment).                                    |
|-------------------------------------------------------------------|
| Documento              | Etapa   | Rol firmante     | Modo   |     |
| V°B° SOLPED            | 1.2     | aprobador_unidad | Desat. | [Editar anclas] |
| CDP                    | 1.5     | firmante_cdp     | Desat. | [Editar anclas] |
| Aprobación modalidad   | 2.2     | aprobador_mod.   | Desat. | [Editar anclas] |
| … (resto del catálogo) |         |                  |        |     |
|-------------------------------------------------------------------|
| [ Volver a configuraciones ]                                      |
```

## Notas

- Filas alineadas al catálogo del módulo; OC y Resolución Fundada no aparecen.
- Editor de muestra implementado para CDP (`adq.cdp`); resto puede abrir el mismo editor con aviso de plantilla demo o enlace deshabilitado según prototipo.
