# Integración SGM ↔ DocDigital

> Documento de trabajo — arquitectura / especificación
> Estado: borrador condicionado a **[PENDIENTE X-72]** (bloqueante).
> Decisión canónica: [`../decisiones/2026-07-docdigital-tramitacion-documental.md`](../decisiones/2026-07-docdigital-tramitacion-documental.md).
> Este documento **no** repite la decisión; la implementa como contrato funcional.

---

## 1. Principio y ubicación en arquitectura

**SGM origina; DocDigital tramita.** Ver decisión canónica.

La integración es responsabilidad del **core de plataforma (servicio C11)**, no de los módulos funcionales:

- El adaptador (cuando exista API) o el circuito de exportación/importación asistida, credenciales y configuración por tenant viven en el core.
- Hacia los módulos solo se publican operaciones de contrato funcional (`submitAdministrativeAct`, `recordActOutcome` o equivalentes) y el evento interno `AdministrativeActSigned` / `DocumentProcedureCompleted`.
- **Ningún módulo llama a DocDigital directamente.** En fichas la contraparte es `Core (DocDigital)`.

DocDigital **no sustituye** C10 (almacenamiento de bytes) ni C6 (notificación formal). Son tres roles distintos — ver decisión §consecuencia 5.

### Vínculo con el levantamiento (proceso 25)

El proceso **25 — «Alcaldía: Firmar»** es el proceso transversal de firma ya levantado. Varios procesos remiten a él con *«Ver proceso Firmar Documentos en Alcaldía»*. **DocDigital es la implementación de sistema del proceso 25**, no un flujo nuevo. Las cadenas de firma municipales (Control, Jurídica, Alcalde/Administrador, Secretario Municipal) se modelan como `SignatureChain` configurable por tenant; la ejecución de visación/firma/enumeración ocurre en DocDigital (o en la vía alternativa si el municipio no está habilitado).

---

## 2. Contrato funcional (agnóstico de protocolo)

⚠ **No asumir API.** Hasta cerrar X-72, este contrato describe semántica, no endpoints.

### 2.1 Qué envía SGM

| Elemento | Descripción |
|---|---|
| Contenido sustantivo del acto | PDF (u otro formato admitido) generado en SGM, vía `DocumentRef` (C10) |
| Metadatos del acto | Tipo (`act_type`), entidad de origen, municipio, asunto, firmantes esperados según `SignatureChain` |
| Identificador interno de trazabilidad | ID SGM del `AdministrativeAct` / `PaymentDecree` — **no** es el folio oficial |
| Cadena de firma requerida | Roles y orden (`SignatureChain`) configurados por el municipio |

### 2.2 Qué retorna DocDigital (o el circuito asistido)

| Elemento | Descripción |
|---|---|
| Acto firmado | Documento con FEA; se persiste en C10; el módulo recibe `DocumentRef` actualizado |
| `ExternalFolio` | Folio oficial asignado por DocDigital — **identificador oficial del acto** |
| Evidencia de tramitación | Visaciones, firmas, timestamps (cuando la plataforma los exponga) |
| Estado terminal | Firmado / rechazado / anulado — dispara la transición fuera de `pending_signature` |

### 2.3 Estados de tramitación (`DocumentProcedure`)

| Estado | Significado |
|---|---|
| `draft` | Acto originado en SGM; aún no enviado |
| `submitted` | Enviado a DocDigital (o exportado para carga asistida) |
| `in_visation` | En cadena de visación/firma externa |
| `pending_signature` | Esperando retorno del acto firmado *(estado visible también en la entidad de negocio)* |
| `completed` | Retorno recibido; folio externo registrado; documento firmado en C10 |
| `rejected` | Rechazo en la cadena externa; el módulo define el camino (corrección / anulación) |
| `failed` | Falla técnica o timeout; reintento o vía alternativa |

**Regla:** ninguna máquina de estado cuyo avance dependa del acto firmado sale de `pending_signature` sin `completed` (o registro explícito en vía alternativa / contingencia).

### 2.4 Dos modos de invocación (condicionados a X-72)

| Modo | Cuándo | Clasificación |
|---|---|---|
| **M2M** (si API verificada) | SGM envía y recibe por adaptador C11 | Asíncrona (latencia de tramitación humana + plataforma) |
| **Asistido** (exportación / importación) | Sin API, o municipio en contingencia | Asíncrona; folio ingresado manualmente con auditoría |

Ambos modos producen el mismo evento interno hacia los módulos. Los módulos **no** conocen el modo.

### 2.5 Relación con FirmaGob (C9)

Para actos tramitados por DocDigital, la FEA se obtiene **dentro** de DocDigital (FirmaGob + Clave Única incluidos). C9 (`requestSignature` / `confirmSignature`) sigue vigente para documentos que **no** son actos administrativos tramitados en DocDigital (p. ej. CDP, vistos buenos internos, actas de evaluación si se excluyen — ver §3).

**Brecha actual:** gran parte del corpus cablea actos administrativos directamente a C9/FirmaGob. Debe reclasificarse a C11/DocDigital, manteniendo C9 como proveedor subyacente encapsulado o como vía para documentos no-acto. Ver §5.

---

## 3. Inventario de actos administrativos

Todo acto del corpus debe figurar aquí como **tramitado en DocDigital** o **excluido con razón**.

| Módulo | Acto administrativo | Origen | Tratamiento |
|---|---|---|---|
| Presupuestos | Decreto que promulga el presupuesto anual | Proceso 26.2.7 | DocDigital |
| Presupuestos | Decreto de modificación presupuestaria | Proceso 27.2.4 y 27.2.5 | DocDigital |
| Contabilidad | Decreto alcaldicio que aprueba donación de bienes | Proceso 28.2.2 | DocDigital |
| Contabilidad | Decreto de baja de bienes de inventario | Proceso 28.2.5 y 28.2.6 | DocDigital |
| Contabilidad | Decreto que registra la cesión de factura | Proceso 32.2.3 y 32.2.4 | DocDigital |
| Contabilidad | Decreto de pago, y su rehacer por cesión | Proceso 32.2.5, 32.2.6 y 32.2.8 | DocDigital — **alcance operativo abierto (X-74)** |
| Tesorería | Decreto de pago | Proceso 38 | DocDigital — **mismo pendiente X-74** (alta frecuencia) |
| Adquisiciones | Resolución de compra / actos de adjudicación (LP: bases, comisión, adjudicación/deserción/revocación) | Etapa 3 LP §§3.3, 3.9a, 3.10 | DocDigital |
| Adquisiciones | Resolución Fundada (Trato Directo) | TD §3.1 / etapa 1–2 | DocDigital |
| Adquisiciones | Decreto de pago (etapa 5) | Proceso transversal 5.3 | DocDigital — **X-74** |

### Exclusiones explícitas (no son actos administrativos DocDigital)

| Ítem | Razón |
|---|---|
| CDP / certificado de disponibilidad presupuestaria | Documento de control presupuestario; firma vía C9/FirmaGob (o escaneado), no enumeración DocDigital |
| Visto bueno de jefatura / aprobación de modalidad | Control interno de expediente; no es decreto/resolución |
| Acta de evaluación de ofertas (LP §3.9c) | Acta de comisión; firma de integrantes vía C9 salvo que normativa municipal exija acto — **confirmar en X-74** |
| Contrato con proveedor (LP §3.13) | Instrumento bilateral; FEA municipal vía C9; firma del contratista abierta (**X-67**) |
| OC en Mercado Público | Acto en plataforma ChileCompra, no DocDigital |
| Notificación formal por canal DocDigital (C6) | Canal de aviso, no tramitación del acto |

Si al recorrer el corpus aparece un acto no listado, **agregarlo a esta tabla**.

---

## 4. Entidades y naming

Naming técnico en inglés. **No crear duplicados** donde ya exista equivalente.

| Propuesta | Estado en corpus | Acción |
|---|---|---|
| `AdministrativeAct` | Ya existe en `entidades-core.md` (Adquisiciones) | **Extender:** `act_number` = trazabilidad interna; agregar `external_folio` (oficial cuando tramitado en DocDigital); `document_procedure_id`; ampliar `act_type` a decretos de otros módulos o usar sujeto polimórfico |
| `DocumentProcedure` | No existe | **Nueva** en entidades de plataforma — tramitación externa: envío, visaciones, firmas, retorno |
| `ExternalFolio` | No existe como entidad | Campo tipado / value object del acto: folio oficial DocDigital (o folio interno **solo** en vía alternativa sin DocDigital — X-73) |
| `SignatureChain` | Presupuestos propone `DecreeSignatureChain` | **Unificar** como entidad de plataforma configurable por tenant; `DecreeSignatureChain` queda alias de trabajo → `SignatureChain` |
| `PaymentDecree` | Existe; `decree_number` como correlativo | **Cambio vs as-is:** `decree_number` = trazabilidad interna; folio oficial = `external_folio` vía procedimiento DocDigital. Candidata a absorberse en `AdministrativeAct` a futuro (REVISAR vigente) |

### Cambio respecto del as-is Odoo

| As-is | To-be |
|---|---|
| `approval_resolution` Char con secuencia interna (Presupuestos) | Referencia a `ExternalFolio`; correlativo interno no oficial |
| Decretos de `tesoreria_gov_cl` con numeración propia | Ídem |
| FirmaGob directa en decretos TUPA de factoring | Tramitación DocDigital (C11); FirmaGob encapsulado |

---

## 5. Brechas actuales del corpus

| Brecha | Dónde | Qué falta |
|---|---|---|
| **Mecanismo de integración no verificado** | Plataforma | X-72 bloqueante: ¿API M2M o solo web? |
| Actos cableados a FirmaGob directo | LP §§3.3/3.10, TD, 5-pago, contracts.md, wireframes | Reclasificar borde a `Core (DocDigital)`; estado `pending_signature` ya existe en varios sitios — alinear semántica al retorno DocDigital |
| Folio / `act_number` / `decree_number` como identificador oficial | `AdministrativeAct`, `PaymentDecree`, Odoo as-is | Separar trazabilidad vs folio externo (X-75 históricos) |
| FEA como “capacidad a construir” | Contabilidad EEFF (parcialmente reclasificada a cableado) | Para actos: cablear DocDigital; para EEFF: confirmar si van por DocDigital o C9 directo (X-74) |
| Municipios sin DocDigital (~20 %) | Transversal | Vía alternativa + contingencia (X-73); mismo patrón que Presupuestos §5.1 |
| Latencia externa vs plazos legales | Presupuesto 15 dic; representación 10 días; publicidad TD 24 h | X-76 |
| DocDigital solo como notificación / DMS | `musts` §9, `plataforma-core` §7bis, brechas NTDEE arts. 27–28 | Actualizado: tramitación C11 es el rol principal para actos; notificación C6 se mantiene |
| Proceso 25 sin contraparte de sistema | Levantamiento Magenta | Este documento cierra el vínculo |

---

## 6. Operaciones candidatas hacia módulos (borrador)

Publicables en `plataforma/contracts.md` tras X-72. Nombres de trabajo:

| Operación | Dirección | Efecto |
|---|---|---|
| `submitAdministrativeAct` | Módulo → Core (DocDigital) | Crea/actualiza `DocumentProcedure`; deja el acto en `pending_signature` |
| `recordActOutcome` | Core → (evento) / operación de regularización asistida | Registra folio externo, documento firmado, cierra procedimiento |
| Evento `AdministrativeActSigned` | Core → módulos | Dispara transición de negocio (ya referenciado en Adquisiciones) |
| Evento `DocumentProcedureFailed` | Core → módulos | Modo degradado / reintento / contingencia |

Clasificación de borde: **asíncrona**. Prohibido especificar URLs o verbos HTTP de DocDigital hasta X-72.

---

## 7. Pendientes

| ID | Tema | Contenido | Estado |
|---|---|---|---|
| **X-72** | Mecanismo de integración | ¿DocDigital expone interfaz M2M para originar documentos y recibir el acto firmado con folio? **Verificar antes de diseñar.** Si no: exportación/importación asistida. | **Abierto — BLOQUEANTE** |
| **X-73** | Vía alternativa | Comportamiento del ~20 % sin DocDigital: circuito alternativo; ¿el folio pasa a ser interno? | Abierto |
| **X-74** | Alcance de los actos | Qué actos se tramitan efectivamente en DocDigital y cuáles quedan internos. En particular el **decreto de pago** (alta frecuencia) y EEFF / actas. | Abierto |
| **X-75** | Conflicto de folio | Reconciliar correlativo interno del as-is Odoo con folio externo; actos históricos migrados | Abierto |
| **X-76** | Plazos de tramitación | Efecto de la latencia externa sobre operaciones con plazo legal (presupuesto 15 dic, representación 10 días, otros) | Abierto |

Detalle centralizado en [`../decisiones/pendientes.md`](../decisiones/pendientes.md).

---

## 8. Fuentes

Ver decisión canónica. Afirmaciones sobre cobertura municipal (80 %) y funciones de la plataforma: **verificadas en fuente oficial**. Mecanismo de integración: **no verificado**.
