# OpenAPI — Adquisiciones

Carpeta hermana a las fichas de proceso (`.md`). Contiene el contrato HTTP del módulo, seccionado como los procesos.

## Punto de entrada (sandbox, CI, Swagger)

[`adquisiciones.openapi.yaml`](./adquisiciones.openapi.yaml)

Ahí viven `info`, `tags`, el ensamblado de `paths` vía `$ref` y los `components` compartidos (esquemas, respuestas, examples). Sandbox, fixtures y herramientas apuntan a este archivo.

## Estructura (espejo de procesos)

```
openapi/
├── adquisiciones.openapi.yaml     ← entrada única
├── expediente.yaml                ← lecturas transversales del expediente
├── procesos-transversales/
│   ├── 1-solped.yaml
│   ├── 2-modalidad-compra.yaml
│   ├── 4-recepcion-conforme.yaml
│   └── 5-pago.yaml
├── 1-compra-agil/
│   └── 3-resolucion-compra.yaml
├── 2-convenio-marco/              ← pendiente etapa 3
├── 3-licitacion-publica/          ← pendiente etapa 3
└── 4-trato-directo/               ← pendiente etapa 3
```

| Fragmento OpenAPI | Ficha de proceso (`.md`) |
|---|---|
| `expediente.yaml` | Lecturas §2.0 de `contracts.md`; ficha [`0-consulta-expedientes.md`](../procesos-transversales/0-consulta-expedientes.md); UI: [`patron-vista-expediente.md`](../../../arquitectura/instrucciones/patron-vista-expediente.md) |
| `procesos-transversales/1-solped.yaml` | `procesos-transversales/1-solped.md` |
| `procesos-transversales/2-modalidad-compra.yaml` | `procesos-transversales/2-modalidad-compra.md` |
| `procesos-transversales/4-recepcion-conforme.yaml` | `procesos-transversales/4-recepcion-conforme.md` |
| `procesos-transversales/5-pago.yaml` | `procesos-transversales/5-pago.md` |
| `1-compra-agil/3-resolucion-compra.yaml` | `1. compra-agil/3-resolucion-compra.md` |

Nombres de carpeta OpenAPI usan kebab-case (`1-compra-agil`) para evitar espacios en `$ref`; la carpeta de fichas puede seguir con el prefijo numerado con espacio (`1. compra-agil`).

## Uso

1. **Editar una operación** → fragmento del proceso/modalidad correspondiente.
2. **Editar esquema, error o example** → `components` en `adquisiciones.openapi.yaml`.
3. **Nueva modalidad etapa 3** → `N-modalidad/3-resolucion-compra.yaml` + `$ref` en el archivo raíz.
4. **Fixtures** → `example_ref` al raíz: `adquisiciones.openapi.yaml#/components/examples/...`

Comunes transversales: [`../../../arquitectura/especificacion/openapi/comunes.yaml`](../../../arquitectura/especificacion/openapi/comunes.yaml).  
Norma de módulo: [`plantilla-maestra-sgm.md`](../../../arquitectura/instrucciones/plantilla-maestra-sgm.md) §4.1.
