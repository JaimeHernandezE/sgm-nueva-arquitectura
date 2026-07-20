# Catálogo de documentos firmables

> **Estado:** v1 — poblado con Adquisiciones; otros módulos sin entradas aún.  
> **Documento transversal** de arquitectura: una sola fuente de tipología de documentos firmables (no duplicar catálogos por módulo).  
> **Marco:** [`estandar-firma-electronica.md`](./estandar-firma-electronica.md) · [`catalogo-roles.md`](./catalogo-roles.md)  
> **Vista de módulo (Adquisiciones):** [`modulos/adquisiciones/catalogo-documentos-firmables.md`](../../modulos/adquisiciones/catalogo-documentos-firmables.md)

Cada entrada tipifica un **tipo de documento** que SGM genera o prepara y envía al circuito de firma. La unidad de tipología es el `code`, no la pantalla. Los módulos publican vistas filtradas; no redefinen códigos.

```
DocumentTemplate (versionada)
  → tipificada por DocumentType.code (este catálogo)
  → SignaturePoint[] (role + anchor + order + mode + optional)
```

---

## 1. Convenciones

| Campo | Significado |
|---|---|
| `code` | Identificador estable (`adq.cdp`). Prefijo = módulo. Usado en plantillas, contratos y UI de configuración. |
| `name` | Etiqueta en español para listados y configuración. |
| `module` | `adquisiciones` \| … |
| `process_area` | Nodo del árbol de proceso ([`catalogo-roles.md`](./catalogo-roles.md) §2). |
| `mode` | `unattended` \| `attended` (modo de firma del estándar §2). |
| `signature_points` | Lista de puntos: `role`, `anchor`, `order`, `optional`. |
| `owner_department_hint` | Departamento típico que administra la plantilla (configuración de anclas). |
| `ficha` | Sub-paso o ficha donde se emite / firma. |

**Ancla canónica:** `{{firma:<role_code>}}` — ver estándar §3.

**Configuración:** operación sugerida `configureDocumentTemplate` (administración municipal / operador de plantillas del módulo), distinta de las operaciones de firma del flujo. Patrón UI: [`patron-edicion-anclas-firma.md`](../instrucciones/patron-edicion-anclas-firma.md).

---

## 2. Adquisiciones (`adq`)

| `code` | `name` | `process_area` | `mode` | Puntos de firma (`role` · `anchor` · order) | Departamento dueño (hint) | Ficha |
|---|---|---|---|---|---|---|
| `adq.solped_vb` | V°B° / aprobación de SOLPED | `adq.solped` | `unattended` | `adq.aprobador_unidad` · `{{firma:adq.aprobador_unidad}}` · 1 | Unidad / depto solicitante | [`1-solped.md`](../../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.2 |
| `adq.cdp` | Certificado de Disponibilidad Presupuestaria (CDP) | `adq.solped` | `unattended` | `adq.firmante_cdp` · `{{firma:adq.firmante_cdp}}` · 1 | Finanzas › Presupuestos | [`1-solped.md`](../../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.5 |
| `adq.modalidad_aprobacion` | Aprobación de modalidad | `adq.modalidad` | `unattended` | `adq.aprobador_modalidad` · `{{firma:adq.aprobador_modalidad}}` · 1 | Abastecimiento / jefatura DAF | [`2-modalidad-compra.md`](../../modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md) §2.2 — condicional **[P-38]** |
| `adq.acto_bases` | Decreto/resolución que aprueba bases | `adq.resolucion` | `unattended` | `adq.aprobador_modalidad` · `{{firma:adq.aprobador_modalidad}}` · 1 | Alcaldía / autoridad | LP 3.3 — [`3-resolucion-compra.md`](../../modulos/adquisiciones/3.%20licitacion-publica/3-resolucion-compra.md) |
| `adq.acto_comision` | Acto de designación de comisión | `adq.resolucion` | `unattended` | `adq.aprobador_modalidad` · `{{firma:adq.aprobador_modalidad}}` · 1 | Alcaldía / autoridad | LP 3.9 (a) |
| `adq.acta_evaluacion` | Acta de evaluación | `adq.resolucion` | `attended` | Integrantes comisión (v1 vía gestor/aprobador) · anclas por firmante · orden secuencial o paralelo según comisión | Abastecimiento | LP 3.9 (c) — firmantes de comisión pendientes de rol dedicado |
| `adq.acto_adjudicacion` | Resolución de adjudicación / deserción / revocación | `adq.resolucion` | `unattended` | `adq.aprobador_modalidad` · `{{firma:adq.aprobador_modalidad}}` · 1 | Alcaldía (+ Jurídica previa en flujo) | LP 3.10 |
| `adq.contrato` | Contrato | `adq.resolucion` | `attended` | Municipio: `adq.aprobador_modalidad` · `{{firma:adq.aprobador_modalidad}}` · 1; proveedor: **pendiente** | Alcaldía / Jurídica | LP 3.13 — compareciente externo pendiente |
| `adq.recepcion_confirmacion` | Confirmación de recepción conforme | `adq.recepcion` | `unattended` | `adq.confirmante_recepcion` · `{{firma:adq.confirmante_recepcion}}` · 1 | Unidad receptora / control | [`4-recepcion-conforme.md`](../../modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md) §4.2 — condicional `SIGNATURE_REQUIRED` |
| `adq.decreto_pago` | Decreto de pago | `adq.pago` | `unattended` | `adq.operador_pago` · `{{firma:adq.operador_pago}}` · 1 | Finanzas › Tesorería | [`5-pago.md`](../../modulos/adquisiciones/procesos-transversales/5-pago.md) §5.3 |

### 2.1 Fuera de este catálogo (no firmables vía SGM / FirmaGob)

| Documento | Situación |
|---|---|
| Orden de compra (OC) | Emisión/aceptación en **Mercado Público**; no `requestSignature` en SGM. |
| Resolución Fundada (Trato Directo) | Hoy es **adjunto** (`founded_resolution_attachment`); no circuito de firma SGM en v1. |

---

## 3. Otros módulos

Sin entradas en v1. Al tipificar el primer documento firmable de Presupuestos, Contabilidad, Tesorería o RRHH, se agrega aquí con prefijo de módulo y se publica vista filtrada en el overview del módulo.

---

## 4. Relación con roles y departamentos

1. El `role` de cada punto es un código de [`catalogo-roles.md`](./catalogo-roles.md).
2. Al firmar, SGM resuelve persona vía `RoleAssignment` en el nodo orgánico del expediente o del departamento dueño del acto ([`estandar-firma-electronica.md`](./estandar-firma-electronica.md) §4).
3. La **configuración de anclas** la realiza quien tenga permiso de plantillas del módulo (`configureDocumentTemplate`), tipicamente administrador municipal con alcance al `process_area` / departamento dueño — no el firmante en el acto de firma.
