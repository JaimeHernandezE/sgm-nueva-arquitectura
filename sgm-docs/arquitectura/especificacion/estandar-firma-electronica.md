# Estándar de Firma Electrónica — SGM

Documento transversal del repositorio `sgm-docs`. Define cómo SGM gestiona la firma electrónica de documentos: modos de firma, plantillas y puntos de firma, posicionamiento de la representación gráfica, flujo de corrección (reparo) e integración con FirmaGob. Aplica a todos los módulos; los sub-pasos que involucran firma lo referencian, no lo duplican (misma disciplina que `integracion-mercado-publico.md`).

**Marco normativo:** Ley 19.799 (documentos electrónicos y firma electrónica), Ley 21.180 (transformación digital del Estado) y su normativa técnica asociada.

> ⚠ **Pendiente de definir:** verificar los decretos y normas técnicas vigentes aplicables a la firma electrónica avanzada del Estado al momento de redactar las bases (la normativa técnica de la Ley 21.180 ha tenido modificaciones).

---

## 1. Principio rector: validez criptográfica ≠ representación gráfica

La validez jurídica de un documento firmado electrónicamente proviene de la **firma criptográfica sobre los bytes del documento completo**, no de la imagen o timbre visible en la página. La representación gráfica (nombre, cargo, fecha, imagen de firma) es solo una visualización: puede estar desplazada, en otra página o ausente sin afectar la validez.

Consecuencias de diseño (propiedades verificables, no tecnologías):

1. **La posición visual de la firma no afecta la validez del documento firmado.** Un desfase de la representación gráfica es un defecto cosmético cuya corrección pertenece a la configuración de plantillas, nunca al acto de firmar.
2. **Toda modificación del documento posterior a una firma invalida las firmas existentes** (las firmas cubren los bytes del documento). Por tanto, no existe edición de contenido dentro del circuito de firma: solo firmar, rechazar o devolver.
3. **Los datos del firmante (nombre, RUT, cargo) no viven en la plantilla ni en el documento como texto editable**: se resuelven desde la fuente de identidad al momento de generar el documento. Su corrección ocurre en el módulo de identidad/RRHH, fuera del flujo de firma.

---

## 2. Modos de firma

| Materia | Firma desatendida | Firma atendida |
|---|---|---|
| **Uso típico en SGM** | Documentos prearmados de flujo masivo: resoluciones, decretos de pago, certificados, órdenes de compra internas | Documentos preparados caso a caso o con comparecientes variables: convenios, actas, contratos |
| **Quién define firmantes** | La plantilla, por **rol funcional** (nunca por persona) | El **editor** del documento, en el paso de preparación |
| **Posición de la firma** | Definida en la plantilla (ancla o campo, ver §3) | Marcada por el editor en el paso de preparación |
| **Acto de firma** | El firmante autoriza sobre documento prearmado; puede firmar en lote | El firmante comparece individualmente, con autenticación reforzada del proveedor de firma |
| **Corrección de errores** | Reparo → corrige plantilla o datos de identidad → se regenera el documento | Devolución con observaciones al editor → repreparación → reinicio del circuito |

Regla común a ambos modos: **el firmante nunca edita el documento ni mueve la firma al momento de firmar.** Sus acciones posibles son exactamente tres: firmar, rechazar, o devolver con observaciones.

---

## 3. Posicionamiento de la representación gráfica

Mecanismos existentes en la industria, del más rígido al más flexible:

| Mecanismo | Descripción | Riesgo |
|---|---|---|
| **Coordenadas absolutas** | Página + coordenadas (x, y) fijas por firmante | Se desfasa cuando el contenido varía de largo (una glosa más extensa corre todo el documento) |
| **Ancla de texto** | Marcador en el documento (ej. `{{firma:jefe_daf}}`); la posición se calcula relativa al ancla | Robusto ante contenido variable; requiere disciplina en las plantillas |
| **Campo de firma embebido** (AcroForm) | El PDF trae campos de firma nombrados; el motor solo los llena | El más limpio cuando el propio sistema genera el PDF |

**Regla SGM (propuesta):** las plantillas posicionan las firmas mediante **anclas o campos de firma nombrados, nunca coordenadas absolutas**. Dado que los documentos de SGM se generan con contenido variable (glosas, tablas de ítems), las coordenadas fijas garantizan el desfase que este estándar busca eliminar. Si el proveedor de firma exige coordenadas (caso FirmaGob, que recibe un *layout* con posición explícita), SGM **calcula** esas coordenadas a partir del ancla al momento de generar el documento — la coordenada es un dato derivado, nunca configurado a mano.

---

## 4. Plantillas y puntos de firma

Toda plantilla de documento firmable declara sus **puntos de firma**. Cada punto de firma define:

- `role` (obligatorio): rol funcional que firma, según el catálogo RBAC (`seguridad.md` §3; catálogo en **[PENDIENTE P-24]**). Nunca una persona.
- `anchor` (obligatorio): ancla o nombre de campo que determina la posición de la representación gráfica.
- `order` (obligatorio si hay más de un firmante): orden de firma cuando el circuito es secuencial; los circuitos paralelos se declaran explícitamente.
- `mode` (obligatorio): desatendida / atendida.
- `optional` (obligatorio): si el punto puede quedar sin firmar sin invalidar el documento (default: falso).

**Resolución de identidad al momento de firmar:** cuando el documento se genera, el rol se resuelve a la persona titular vigente (o subrogante, según las subrogancias configurables con expiración automática de `seguridad.md`). Nombre, RUT y cargo se toman de la fuente de identidad en ese momento. Un cambio de cargo o corrección de nombre se hace en el módulo de identidad y se refleja automáticamente en la siguiente generación — nunca editando el documento.

### Entidades (sugeridas, no confirmadas en fuente)

- `DocumentTemplate` — plantilla versionada con sus puntos de firma.
- `SignaturePoint` — punto de firma: `role` (obligatorio), `anchor` (obligatorio), `order` (obligatorio si multi-firmante), `mode` (obligatorio), `optional` (obligatorio).
- `SignatureRequest` — solicitud de firma en curso: documento, firmante resuelto, estado (`pending` / `signed` / `rejected` / `returned`), timestamps.

Estas entidades deben incorporarse a `modelo-datos/entidades-core.md` antes de ser referenciadas por fichas de sub-paso (regla 1 del modelo de datos).

---

## 5. Flujo de firma atendida: preparación y comparecientes

1. **Preparación:** el editor arma el documento y marca los puntos de firma — quiénes comparecen (por rol o, excepcionalmente, por persona si el compareciente es externo al municipio) y dónde firma cada uno (seleccionando anclas predefinidas o marcando posición sobre el documento). Sin puntos de firma marcados, el documento no puede entrar al circuito.
2. **Circuito:** cada firmante recibe la solicitud según el `order` definido. Comparece, se autentica ante el proveedor de firma y firma.
3. **Detección de error por un firmante:** si el firmante detecta cualquier error (contenido, glosa, posición de firma, compareciente faltante), **devuelve con observaciones** al editor. No corrige él mismo: cualquier modificación invalidaría las firmas ya estampadas por comparecientes anteriores (§1, consecuencia 2).
4. **Repreparación:** el editor corrige y el circuito **reinicia desde cero** — los firmantes que ya habían firmado deben volver a firmar sobre el documento corregido. Esto no es una molestia evitable: es una consecuencia criptográfica, y las bases deben decirlo explícitamente para que ningún oferente prometa lo contrario.

> ⚠ **Pendiente de definir:** si SGM permite comparecientes externos sin cuenta SGM (ej. representante legal de un proveedor en un contrato) y mediante qué mecanismo de autenticación (Clave Única u otro). Candidato a regla transversal — afecta a Adquisiciones (contratos) y potencialmente a RRHH (convenios).

---

## 6. Integración FirmaGob (sistema externo)

FirmaGob es el borde de sistema externo para la firma electrónica avanzada del Estado. Mismo patrón de diseño que Mercado Público: los módulos se especifican contra **eventos internos**, nunca contra el mecanismo del proveedor.

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Eventos** | Operación `requestSignature`; eventos internos `DocumentSigned`, `SignatureRejected`, `SignatureFailed` |
| **Contraparte** | FirmaGob |
| **Clasificación** | Asíncrona (la firma desatendida puede tener latencia; la atendida depende de una persona) |
| **Payload** | Documento a firmar, identificación del firmante, propósito (atendido/desatendido), layout de representación gráfica calculado desde el ancla (§3) |

Reglas de diseño:

1. **Servicio de firma único a nivel plataforma.** Ningún módulo integra FirmaGob directamente; todos consumen el servicio de firma de SGM, que encapsula el proveedor. Cambiar de proveedor de firma no toca ningún contrato de módulo.
2. **Verificación real de la integración como condición de recepción.** Lección directa de la auditoría FirmaGob del sistema anterior: *que exista la pantalla de configuración no significa que la integración funcione*. La recepción exige demostrar firma efectiva end-to-end (desatendida y atendida) en ambiente productivo o de certificación de FirmaGob, con verificación criptográfica del documento resultante por un validador independiente.
3. **Modo degradado obligatorio:** todo sub-paso cuyo avance dependa de una firma debe documentar qué ocurre si FirmaGob no está disponible (típicamente: la solicitud queda en cola con reintentos y retroceso exponencial; el expediente muestra el paso bloqueado con causa visible; escalamiento si supera un umbral de tiempo).

> ⚠ **Pendiente de definir:** capacidades exactas de la API de FirmaGob vigente (formatos de layout, firma en lote, límites de tamaño y volumen, ambientes de certificación disponibles). Debe verificarse contra documentación oficial y mesa técnica con la División de Gobierno Digital — no asumirse desde documentación de terceros.

---

## 7. Edge cases

| Caso | Comportamiento |
|---|---|
| FirmaGob no disponible | Cola con reintentos y retroceso exponencial; paso visible como bloqueado en el expediente con causa; escalamiento por umbral. ⚠ Umbral pendiente de definir. |
| Firmante rechaza | `SignatureRejected` con motivo obligatorio; el flujo de negocio del sub-paso define el camino (corrección, anulación, reasignación). |
| Firmante devuelve con observaciones (atendida) | Vuelve al editor; repreparación; circuito reinicia desde cero (§5.4). |
| Firmante sin certificado vigente / no habilitado en FirmaGob | `SignatureFailed`; tarea de gestión para el administrador de plataforma; el documento no avanza. |
| Cambio de titular del rol con firmas pendientes | La solicitud pendiente se reasigna al nuevo titular o subrogante **antes** de firmar; si el documento menciona al titular anterior en su texto, se regenera. ⚠ Regla de decisión (reasignar vs. regenerar) pendiente — candidato a regla transversal. |
| Documento modificado con firmas parciales | Imposible por diseño: el documento en circuito es inmutable; toda corrección pasa por repreparación (§5). |
| Firma visualmente desfasada detectada post-firma | El documento es válido (§1). Se registra hallazgo sobre la plantilla y se corrige el ancla para generaciones futuras; el documento firmado **no** se rehace salvo decisión de negocio. |

---

## 8. Resumen de pendientes

1. Normativa técnica vigente de firma electrónica avanzada del Estado (verificar decretos actualizados).
2. Catálogo RBAC de roles firmantes (**[PENDIENTE P-24]**).
3. Comparecientes externos sin cuenta SGM: mecanismo de autenticación (candidato a regla transversal).
4. Capacidades exactas de la API FirmaGob (mesa técnica con Gobierno Digital).
5. Umbral de escalamiento ante indisponibilidad de FirmaGob.
6. Regla reasignar vs. regenerar ante cambio de titular con firma pendiente (candidato a regla transversal).

---

## Fuente

Elaborado a partir de patrones estándar de la industria de firma electrónica (posicionamiento por coordenadas/anclas/campos, flujos atendido/desatendido) y de las lecciones de la auditoría FirmaGob del sistema anterior. Las afirmaciones sobre la API de FirmaGob son **propuestas de diseño pendientes de verificación** contra documentación oficial (§6).
