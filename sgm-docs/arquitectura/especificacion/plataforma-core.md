# Plataforma core: servicios transversales del SGM

> Documento de trabajo — arquitectura / plataforma
> Estado: borrador para discusión interna (julio 2026).
> Origen: hasta ahora Adquisiciones se especifica como módulo aislado; este documento define qué existe **debajo y alrededor** de los módulos funcionales — identidad, autorización, tenants, parámetros, auditoría, eventos, integraciones externas, gestión documental y administración mínima — para que la especificación del core tenga la misma disciplina contractual que la de los módulos de negocio.
> Complementa `seguridad.md` (que define exigencias de seguridad del core sin declararlo como tal), `musts-arquitectura.md` §9 (notificaciones) y `plantilla-maestra-sgm.md` §5.2 (sincronización MP).
> Pendientes registrados en [`pendientes.md`](../decisiones/pendientes.md).

**Cambios v0.2 (julio 2026):** servicio **C11 — Tramitación de actos administrativos (DocDigital)**; distinción explícita entre tramitación, notificación (C6) y DMS (`external_dms`); entidades `DocumentProcedure` / `SignatureChain` / folio externo. Decisión canónica: [`../decisiones/2026-07-docdigital-tramitacion-documental.md`](../decisiones/2026-07-docdigital-tramitacion-documental.md). Contrato funcional: [`integracion-docdigital.md`](./integracion-docdigital.md).

---

## 1. Qué es el core y qué no es

**Dos planos que no deben confundirse.** El core se describe en dos dimensiones independientes:

| Plano | Qué significa |
|---|---|
| **Dependencia** | Infraestructura obligatoria: ningún módulo funcional opera sin identidad, tenants, autorización, parámetros ni auditoría. No es elegible à la carte; es condición previa de cualquier módulo. |
| **Contrato** | Pieza licitable con la misma disciplina que un módulo funcional: `contracts.md`, OpenAPI, pruebas de recepción. Módulos y sistemas municipales externos acceden al core solo por ese contrato publicado (§2), nunca por tablas o llamadas internas no publicadas. |

En este documento, **módulo funcional** designa dominio de negocio (Adquisiciones, Presupuestos…); el core es **capa de plataforma**. Comparten disciplina contractual, no naturaleza ni opcionalidad.

**Definición.** El core de plataforma es el conjunto de servicios que ningún módulo funcional posee y todos requieren. Una capacidad pertenece al core cuando cumple al menos uno de estos criterios:

1. Es requerida por dos o más módulos con la **misma semántica** (identidad, permisos, auditoría).
2. Su propiedad no es atribuible a ningún dominio funcional (gestión de tenants, parámetros normativos).
3. Es condición de operación de la plataforma, no de un proceso de negocio (aprovisionamiento de schemas, emisión de credenciales).
4. Es una **integración externa** requerida por dos o más módulos con la misma semántica, o cuyas credenciales y configuración son responsabilidad del tenant (Mercado Público, FirmaGob, SII, DocDigital, almacenamiento de documentos).

**Anti-definición (igual de importante).** El core **no orquesta procesos de negocio**. No existe un motor central de flujos ni un bus de orquestación que dirija los macroprocesos: cada módulo es dueño de sus estados y transiciones (`musts-arquitectura.md` §10), y la coordinación entre módulos ocurre por **contratos** (dependencias declaradas) y **eventos de dominio** (coreografía), nunca por un director central. Ser transversal no implica centralizar flujos: implica proveer capacidades compartidas vía contrato.

**Modo à la carte.** Lo que el modo à la carte hace viable es consumir **módulos funcionales** de forma individual (p. ej. solo Adquisiciones), sustituyendo el resto con sistemas propios del municipio vía contratos de proveedor (`contrato-api-first.md` §2). El core **no** entra en esa elección: un municipio à la carte consume las APIs del core (autenticación, identidad del funcionario, autorización, auditoría) además de las del módulo de negocio elegido. Lo que evita el diseño es un orquestador que conozca todos los módulos funcionales, no la dependencia hacia el core.

**Consecuencia para la licitación.** El core es parte del entregable con contrato propio (`plataforma/contracts.md` + OpenAPI) y recepcionado con las mismas pruebas que un módulo funcional — no porque sea opcional, sino porque su frontera contractual debe ser tan verificable como la de Adquisiciones o Presupuestos.

## 2. El core también cumple el mandato API

Regla derivada del mandato general (`contrato-api-first.md` §1), aplicable textual en las bases:

> El core expone un contrato de entrada/salida versionado (`plataforma/contracts.md`). Ningún módulo accede a las tablas del core ni a funcionalidad no publicada; las pantallas de administración —de SUBDERE y municipales— son consumidores sin privilegios de ese contrato.

Consecuencias:

- **Toda acción administrativa es una operación de API auditada** (ya exigido para roles en `seguridad.md` §3.3; aquí se generaliza a tenants, parámetros y credenciales).
- El core tiene su propio `contracts.md` con las cuatro secciones de `contrato-api-first.md` §3. Borrador mínimo en [`plataforma/contracts.md`](../../plataforma/contracts.md) — **[PENDIENTE X-48]** extender a ciclo de vida completo de tenants.
- Las entidades del core (§4) se definen en el modelo de datos canónico con la misma regla de visibilidad interna/expuesta (`plantilla-maestra-sgm.md` §6.6).

## 3. Inventario de servicios del core

| # | Servicio | Qué resuelve | Base normativa ya escrita | Estado |
|---|---|---|---|---|
| C1 | **Identidad y autenticación** | Plano personas (Clave Única) y plano sistemas (M2M, scopes por módulo y municipio) | `seguridad.md` §2, `estandares-api.md` §8 | Exigencias definidas; diseño abierto (**X-02**, **X-22**, **X-23**) |
| C2 | **Autorización (RBAC + SoD)** | Roles por módulo asignados por tenant y unidad; incompatibilidades SoD aplicadas por el motor; administración delegada | `seguridad.md` §3–§4; [`catalogo-roles.md`](./catalogo-roles.md) | Modelo exigido; catálogo en **Borrador** (**X-24**, **X-25**) |
| C3 | **Gestión de tenants** | Ciclo de vida del municipio: alta, aprovisionamiento de schema, configuración, suspensión, baja; catálogo de módulos habilitados por tenant | `principios-no-negociables.md` §2, `musts-arquitectura.md` §3 | **Nuevo en este documento** (§5) |
| C4 | **Parámetros** | Dos familias: `NormativeParameter` (legal, administrado por SUBDERE, doble control, vigencia temporal) y parámetros operativos por tenant (perfil de recepción, vistos buenos configurables) | Fichas etapa 2; **X-37**, **X-39**, **X-42** | Entidad definida; administración sin especificar (§6) |
| C5 | **Auditoría** | Registro inmutable append-only, consultable vía API con scope restringido | `seguridad.md` §5 | Exigencias definidas; retención abierta (**X-26**) |
| C6 | **Eventos y notificaciones** | Servicio transversal suscrito a eventos de dominio; entrega por canal según reglas por rol/unidad/municipio; webhooks firmados hacia terceros; bandeja/campanita in-app | `musts-arquitectura.md` §9, `seguridad.md` §8.4; producto: [`plataforma/notificaciones/overview.md`](../../plataforma/notificaciones/overview.md) | Diseño exigido; mecanismo **X-05**; matriz **X-06** en borrador |
| C7 | **Sincronización Mercado Público** | Servicio único de plataforma que produce el evento interno (`MpStateChanged`) sea por push o polling; los módulos nunca conocen el mecanismo | `plantilla-maestra-sgm.md` §5.2, `integracion-mercado-publico.md` | Estándar definido; es servicio de plataforma, no de Adquisiciones |
| C8 | **Ciclo de vida de usuarios** | Alta/modificación/baja como flujos especificados; subrogancias con vencimiento automático; recertificación | `seguridad.md` §9 | Exigencias definidas; proceso real abierto (**X-28**) |
| C9 | **Adaptadores de integración externa** | FirmaGob (`requestSignature`, `confirmSignature`); SII (`getUtmValue`, `getPriceReference`); credenciales y config por tenant vía `TenantIntegrationConfig` | `seguridad.md` §7, `contrato-api-first.md` §2 | Marco en §7; detalle en `plataforma/contracts.md` (**X-48**, **X-57**) |
| C10 | **Gestión documental (Expediente y documentos)** | API de documentos (`storeDocument`, `getDownloadUrl`…), metadatos, retención; enrutamiento multi-backend (`platform` \| `tenant_owned` \| `external_dms`); adaptadores DMS plug-in. **Almacenamiento de bytes** del expediente — no tramita ni enumera actos | `principios-no-negociables.md` §6 | Marco en §7bis; contrato **X-48**, **X-58**, **X-59** |
| C11 | **Tramitación de actos administrativos (DocDigital)** | Envío a DocDigital para visación, FEA, **enumeración** y distribución; retorno del acto firmado con folio oficial; vía alternativa para municipios sin DocDigital (~20 %). Plataforma externa ya desplegada en el **80 %** de los municipios | Decisión [`2026-07-docdigital-tramitacion-documental.md`](../decisiones/2026-07-docdigital-tramitacion-documental.md); [`integracion-docdigital.md`](./integracion-docdigital.md) | Condicionado a **X-72** (bloqueante); inventarios y estados en la spec |

Regla de lectura: donde la columna "Base normativa" apunta a un documento existente, este inventario **no duplica** esas exigencias — las organiza como servicios y agrega lo que falta (§4–§7).

Nota sobre C7: aunque hoy solo Adquisiciones consume estados MP, el servicio se clasifica como core por el criterio 2 de §1 (el mecanismo de sincronización y la negociación con ChileCompra son activos de plataforma). Sus eventos internos se declaran en el contrato del core; Adquisiciones los consume como dependencia.

Nota sobre C9/C10/C11: los módulos funcionales **declaran** dependencias en su `contracts.md` §3; el **implementador** es siempre el core. Prohibido que un módulo almacene secretos, llame APIs de terceros directamente o implemente adaptadores HTTP. C11 no colapsa con C9 (FirmaGob directo para documentos no-acto) ni con C10 (bytes) ni con C6 (DocDigital como canal de notificación).

## 4. Entidades del core

Entidades transversales que hoy las fichas usan de forma implícita (columnas Unidad municipal / Rol) sin definición canónica. Definición canónica en [`modelo-datos/entidades-plataforma.md`](../../modelo-datos/entidades-plataforma.md) (índice de dominio: `entidades-core.md`), con la misma regla de obligatoriedad explícita de campos:

| Entidad | Rol | Visibilidad propuesta |
|---|---|---|
| `Tenant` | Municipio como unidad de aislamiento (schema) y de configuración; incluye módulos habilitados y modo de consumo (hosting completo / híbrido archivos / à la carte — ver `decisiones-macro-stack.md` §1) | Expuesta (lectura restringida) |
| `OrganizationalUnit` | Estructura orgánica del tenant en dos niveles: `department` (Finanzas, Tránsito, DOM…) → `unit` (Abastecimiento, Presupuestos…); clonada desde plantilla de plataforma y editable por el municipio | Expuesta |
| `OrgStructureTemplate` | Catálogo base de departamentos/unidades de plataforma; se clona al aprovisionar el tenant | Expuesta (admin SUBDERE) |
| `User` | Funcionario municipal o de SUBDERE; identidad ligada a RUN (Clave Única); estado activo/suspendido/baja | Expuesta (subconjunto mínimo, Ley 21.719) |
| `Role` / `Permission` | Rol por módulo (`code`, `process_area`); permiso = operación del contrato (`seguridad.md` §3.1); catálogo transversal [`catalogo-roles.md`](./catalogo-roles.md) (X-24) | Expuesta |
| `RoleAssignment` | Otorgamiento de rol a usuario en contexto tenant + unidad, con vigencia | Expuesta |
| `Delegation` | Subrogancia/suplencia: asignación temporal con fecha de término obligatoria y reversión automática | Expuesta |
| `SodRule` / `SodException` | Incompatibilidad entre roles y excepción configurada por tenant (explícita, registrada, auditada) | Interna; excepciones consultables |
| `ApiClient` | Credencial M2M: sistema municipal o tercero del ecosistema, con scopes por módulo y municipio, rotación y revocación | Expuesta (administración) |
| `NormativeParameter` | Canónica en `entidades-plataforma.md`; administración SUBDERE, lectura por todos los módulos | Expuesta (lectura) |
| `TenantParameter` | Parámetro operativo por tenant (perfil de recepción **X-42**, visto bueno pre-OC **X-39**), distinto de `NormativeParameter` | Expuesta (administración municipal) |
| `AuditRecord` | Registro de auditoría según `seguridad.md` §5.2 | Expuesta (scope restringido) |
| `EventSubscription` | Suscripción de un consumidor (servicio de notificaciones, webhook de tercero) a eventos de dominio | Expuesta (administración) |
| `Notification` | Ítem de bandeja/campanita por destinatario, derivado de evento de dominio | Expuesta (destinatario) |
| `NotificationDelivery` | Intento de entrega por canal (correo, DocDigital, webhook, …) | Interna (admin fallos) |
| `NotificationPreference` | Preferencias de canal del usuario | Expuesta (propietario) |
| `TenantNotificationPolicy` | Hechos de correo obligatorio sin opt-out | Expuesta (admin municipal) |
| `NotificationTemplate` | Plantilla título/cuerpo por evento y canal | Interna |
| `ExternalProvider` | Catálogo de proveedores externos integrables (`mercado_publico`, `firma_gob`, `sii`, `clave_unica`, `doc_digital`) | Interna |
| `TenantIntegrationConfig` | Configuración no secreta por tenant y proveedor (organismo MP, base URL, habilitación DocDigital, etc.) | Expuesta (administración) |
| `IntegrationCredential` | Referencia a secreto en gestor dedicado; rotación auditada | Interna |
| `TenantStorageConfig` | Backend documental del tenant: `platform`, `tenant_owned` o `external_dms` | Expuesta (administración) |
| `DmsAdapter` | Catálogo de adaptadores plug-in para `external_dms` (`adapter_id`, estilo de API) | Expuesta (lectura SUBDERE); catálogo |
| `Document` | Metadatos del archivo (hash, MIME, retención, `external_locator` opaco); bytes fuera de BD transaccional | Interna |
| `DocumentRef` | Identificador opaco que cruzan los módulos en campos `*_attachment` | Expuesta |
| `SignatureRequest` | Estado de solicitud de firma electrónica vía FirmaGob (C9) — documentos **no** tramitados como acto en DocDigital | Interna; subconjunto consultable |
| `SignatureChain` | Cadena de firma configurable por municipio (roles y orden: p. ej. Control → Jurídica → Alcalde/Administrador → Secretario Municipal); implementa el proceso 25 del levantamiento | Expuesta (administración municipal) |
| `DocumentProcedure` | Tramitación de un acto en plataforma externa (DocDigital u vía asistida): envío, visaciones, firmas, retorno, folio | Interna; subconjunto consultable por el módulo dueño del acto |

**Modelo fijado:** Municipio → Departamento → Unidad (`OrganizationalUnit.kind`), con plantilla de plataforma (`OrgStructureTemplate`) clonada al alta del tenant y editable después por el administrador municipal. Detalle canónico en `entidades-plataforma.md`.

⚠ **Pendiente de cerrar con pilotos/DM:** el **contenido** del catálogo base (lista típica de departamentos y unidades, variación por tamaño de municipio) — las fichas aún usan nombres como texto. El modelo de dos niveles + plantilla clonable ya no está abierto. **[PENDIENTE X-49]**

## 5. Ciclo de vida de tenants (nuevo)

Flujo de plataforma sin especificación previa. Etapas mínimas que el contrato del core debe cubrir:

1. **Alta:** creación del `Tenant` (convenio firmado como precondición administrativa — conecta con **X-01**), aprovisionamiento del schema (automatizado y demostrable a escala, `musts-arquitectura.md` §3), selección de modo de consumo y módulos habilitados, carga de configuración inicial (**clonación de `OrgStructureTemplate` → `OrganizationalUnit` del tenant**, primer administrador municipal, parámetros operativos por defecto).
2. **Operación:** administración delegada (C8), cambios de módulos habilitados, cambio de modo de consumo (un municipio à la carte que migra a hosting completo, o viceversa).
3. **Suspensión / baja:** estados definidos con efecto sobre accesos (revocación inmediata) y sobre los datos (retención y devolución según el convenio — soberanía del dato, `decisiones-macro-stack.md` §2).

⚠ **Pendiente de definir:** el proceso real de incorporación de un municipio (quién firma, qué datos históricos se migran, quién capacita, plazos) es un flujo administrativo SUBDERE que debe levantarse y documentarse con ficha propia. La migración de datos históricos del municipio entrante (contratos vigentes, expedientes en curso) es la parte técnicamente sensible. **[PENDIENTE X-50]**

## 6. Administración de parámetros

Dos familias con gobernanza distinta — la distinción ya existe en las fichas (**X-42**); aquí se formaliza:

| Familia | Ejemplos | Quién administra | Control |
|---|---|---|---|
| `NormativeParameter` | Umbrales UTM, tramos de licitación, umbrales de garantías | SUBDERE (nivel plataforma) | **Doble control** (proponente ≠ aprobador), vigencia temporal, histórico inmutable — un cambio normativo nunca reescribe el pasado |
| `TenantParameter` | Perfil de recepción, visto bueno pre-OC, timers de escalamiento (**X-33**) | Administrador municipal, dentro del catálogo que la plataforma define | Auditado; con valores por defecto de plataforma |

Regla de diseño: los módulos **leen** parámetros vía contrato del core con clasificación *cacheada* (`musts-arquitectura.md` §5) y frescura declarada; nunca duplican valores normativos en su propio schema.

## 7. Integraciones externas

Regla derivada del mandato API y del criterio §1.4:

> Las integraciones con terceros transversales (Mercado Público, FirmaGob, SII, DocDigital) se implementan en el core. Los módulos consumen operaciones publicadas en `plataforma/contracts.md`; nunca almacenan secretos ni llaman APIs de terceros directamente.

**Dos planos de credenciales (no confundir):**

| Plano | Entidad | Dirección | Quién administra |
|---|---|---|---|
| **Consumidores del SGM** | `ApiClient` | Municipio/ecosistema → SGM | SUBDERE emite; scopes por módulo y tenant |
| **SGM hacia terceros** | `TenantIntegrationConfig` + `IntegrationCredential` | SGM → MP / FirmaGob / SII / DocDigital / bucket municipal | SUBDERE (plataforma) o admin municipal (tenant), según proveedor |

**Configuración por nivel:**

- **Plataforma (SUBDERE):** Clave Única OIDC, webhook MP nacional, negociación con ChileCompra / Gobierno Digital (DocDigital), catálogo `ExternalProvider` y `DmsAdapter`.
- **Tenant (municipio):** organismo comprador MP, habilitación DocDigital, `SignatureChain`, credenciales de bucket propio (`tenant_owned`), adaptador DMS (`external_dms`), rotación delegada donde aplique.

**Servicios y responsabilidades:**

| Servicio | Tercero | Operaciones hacia módulos | Modo de invocación | Notas |
|---|---|---|---|---|
| C7 | Mercado Público | `readMpProcess`, evento `MpStateChanged` | Asíncrona (lectura); síncrona en vinculación | Mecanismo push/polling interno; ver `integracion-mercado-publico.md` |
| C9 | FirmaGob | `requestSignature`, `confirmSignature` | Síncrona bloqueante / asíncrona según modo de firma | Lee/escribe PDF vía C10; **no** sustituye C11 para actos administrativos |
| C9 | SII | `getUtmValue`, `getPriceReference` | Cacheada | Umbrales normativos vía C4 |
| C11 | DocDigital | `submitAdministrativeAct`, `recordActOutcome`, evento `AdministrativeActSigned` | **Asíncrona** (M2M o asistida — **X-72**) | Contrato funcional en `integracion-docdigital.md`; sin endpoints hasta verificar API |

**Convención de fichas:** columna Contraparte = `Core (FirmaGob)`, `Core (Mercado Público)`, `Core (SII)`, `Core (DocDigital)` — nunca el tercero como implementador del módulo.

## 7bis. Gestión documental

Servicio **C10**. Separa la lógica de negocio (módulos + BD transaccional) del almacenamiento de bytes, cumpliendo `principios-no-negociables.md` §6. **No delega el gestor documental a los módulos.**

**Backends por tenant (`storage_backend`):**

| Valor | Uso | Quién paga storage |
|---|---|---|
| `platform` | Bucket provisionado por SUBDERE al alta del tenant | SUBDERE (incluido en convenio hosting completo) |
| `tenant_owned` | Bucket S3-compatible en nube del municipio | Municipio (hosting híbrido) |
| `external_dms` | DMS municipal vía adaptador plug-in del catálogo `DmsAdapter` | Municipio |

Los módulos **nunca** escriben en S3/Azure/GCS ni en un DMS directamente. Siempre vía contrato C10.

**`DocumentRef`:** única forma de referenciar archivos desde módulos. Campos como `founded_resolution_attachment` son `DocumentRef` opacos emitidos por `storeDocument`. Patrón de upload: frontend → core (`POST /documents`) → obtiene `DocumentRef` → módulo recibe solo el ref en la operación de negocio.

**DMS comercial de mercado** (DocuWare, Alfresco, M-Files, DocDigital como repositorio…): integrable vía `external_dms` y adaptador en el core — el municipio no conecta su DMS a Adquisiciones. v1 licita backends `platform` y `tenant_owned` operativos; interfaz de adaptador DMS definida + stub en sandbox; primer producto certificado en **X-59**.

**Interfaz interna de backend documental** (exigible en bases, propiedades no marcas): todo adaptador (`tenant_owned` S3, `external_dms`) implementa operaciones mínimas alineadas con el contrato público C10: `put`, `get`, `delete`, `presignedUrl` o equivalente. Prohibido código condicional por marca de DMS en módulos funcionales.

**DocDigital — tres roles (no colapsar):**

| Rol | Servicio | Qué hace |
|---|---|---|
| **Tramitación de actos** | **C11** | Visación, FEA, enumeración, distribución; folio oficial externo. Decisión canónica y `integracion-docdigital.md` |
| **Canal de notificación formal** | C6 | Aviso de hechos que exigen canal formal (`musts-arquitectura.md` §9) — no enumera actos |
| **Repositorio DMS** | C10 `external_dms` | Solo si el municipio usa DocDigital como gestor documental de archivos |

**FirmaGob + documentos:** C9 lee el PDF vía C10 y persiste la versión firmada vía C10; el módulo solo recibe `DocumentRef` actualizado. Para actos administrativos tramitados en DocDigital, la FEA ocurre **dentro** de C11; C9 permanece para documentos que no son esos actos.

## 8. Autorización en runtime: decisión pendiente con opciones acotadas

El RBAC es del core, pero cada request llega a un módulo. Cómo valida el módulo los permisos es una decisión estructural que afecta latencia (musts §5) y revocación oportuna (seguridad §9.2):

| Opción | A favor | En contra |
|---|---|---|
| **Claims en el token** (roles/scopes embebidos, vida corta) | Validación local sin latencia; patrón estándar | Revocación no inmediata (ventana = vida del token); tokens crecen con muchos roles |
| **Consulta al core por request** | Revocación inmediata | Agrega latencia a toda operación; el core se vuelve punto único de falla |
| **Híbrido** (claims + lista de revocación corta propagada) | Balance conocido | Mayor complejidad de especificación |

**Propuesta de trabajo (no decisión):** claims en token de vida corta (≤ 15 min) + revocación efectiva vía expiración, con invalidación server-side para el plano personas (`seguridad.md` §2.1.2). Debe resolverse junto con **X-02** y **X-22**. **[PENDIENTE X-51]**

## 9. Pantallas de administración mínima

Dos consolas, ambas consumidoras sin privilegios del contrato del core (§2). Se especifican con wireframes de baja fidelidad según `plantilla-maestra-sgm.md` §7 — estructura y operaciones, no estética.

**Artefactos:** overview e índice en [`plataforma/overview.md`](../../plataforma/overview.md); wireframes en [`plataforma/wireframes/`](../../plataforma/wireframes/README.md). Operaciones admin aún sin cuerpo HTTP completo: `plataforma/contracts.md` §2.11.

### 9.1 Consola de plataforma (SUBDERE)

| Pantalla | Operaciones de contrato que respalda |
|---|---|
| Gestión de tenants | Alta, configuración, módulos habilitados, suspensión (§5) |
| Parámetros normativos | Propuesta y aprobación con doble control, vigencias, histórico (§6) |
| Clientes M2M y convenios | Emisión, scopes, rotación, revocación de `ApiClient` (conecta con **X-15**) |
| Integraciones de plataforma | Clave Única, webhook MP nacional, catálogo `DmsAdapter` |
| Provisión de almacenamiento | Buckets `platform` por tenant |
| Monitoreo por tenant | Consumo de la observabilidad exigida en `musts-arquitectura.md` §8 (métricas por tenant) |
| Auditoría de plataforma | Consulta de `AuditRecord` con scope de plataforma |

### 9.2 Consola municipal (administrador delegado)

| Pantalla | Operaciones de contrato que respalda |
|---|---|
| Usuarios del municipio | Alta, modificación, baja inmediata (`seguridad.md` §9) |
| Roles y unidades | Árbol departamento→unidad; `RoleAssignment` 1:N (usuario+nodo orgánico+rol); detección de violaciones SoD al asignar |
| Subrogancias | `Delegation` con vencimiento obligatorio |
| Excepciones SoD | Configuración explícita y auditada (**X-25**) |
| Parámetros operativos | `TenantParameter` dentro del catálogo de plataforma |
| Integraciones del municipio | `TenantIntegrationConfig` (MP, FirmaGob, DocDigital si aplica); `SignatureChain` |
| Almacenamiento de documentos | `TenantStorageConfig`: bucket propio (`tenant_owned`) o DMS (`external_dms`) |
| Recertificación de accesos | Reporte de cuentas y última actividad (`seguridad.md` §9.4) |
| Preferencias de notificación | Canales del usuario acotados por `TenantNotificationPolicy` (C6) |

**Shell global (no es consola admin):** campanita y bandeja de notificaciones — [`plataforma/notificaciones/overview.md`](../../plataforma/notificaciones/overview.md); ficha **Mis datos** (identidad + `RoleAssignment` vigentes + solicitud de cambio al admin); mensajería in-app (FAB + listado chats) — [`plataforma/mensajeria/overview.md`](../../plataforma/mensajeria/overview.md). Wireframes `plataforma/wireframes/shell/`. Frontera: self-service laboral (vacaciones, liquidaciones, etc.) queda en el módulo RRHH futuro, no en esta ficha.

**X-52:** wireframes de ambas consolas creados (`plataforma/wireframes/`); cuerpos HTTP de ops *(inferidas)* pendientes en **X-48** (§2.11 del contrato). Wireframes shell (C6 + mis datos + mensajería) y preferencias añadidos; ops inbox y `requestProfileChange` en contracts §2.7 / §2.11.

## 10. Foliación

Los folios (`ADQ-AAAA-NNNNN`) son hoy responsabilidad del módulo. Se mantiene así — el folio es semántica del dominio — pero el **formato** se estandariza a nivel plataforma: `<MÓDULO>-<AAAA>-<NNNNN>`, único por tenant, año calendario, sin reutilización. Cada módulo declara su prefijo en su `contracts.md`. No se crea un servicio de foliación central: introduciría una dependencia síncrona bloqueante de todos los módulos hacia el core en operaciones de escritura, contra `musts-arquitectura.md` §5.

## 11. Resumen: qué va a las bases

1. El core es infraestructura obligatoria y parte del entregable licitado, especificado con contrato propio (`plataforma/contracts.md` + OpenAPI) y recepcionado con las mismas pruebas que un módulo funcional.
2. Prohibición de orquestador central de procesos de negocio: coordinación por contratos y eventos; cada módulo es dueño de sus estados.
3. Consolas de administración (SUBDERE y municipal) como consumidores sin privilegios del contrato del core; toda acción administrativa es operación de API auditada.
4. Ciclo de vida de tenants con aprovisionamiento demostrable a escala y estados de suspensión/baja con efecto verificable sobre accesos y datos.
5. Dos familias de parámetros con gobernanza diferenciada; módulos leen vía contrato, nunca duplican valores normativos.
6. Servicio de sincronización MP (C7) conmutable (push/polling) que produce eventos internos estables.
7. Adaptadores de integración externa (C9), gestión documental multi-backend (C10) y tramitación de actos vía DocDigital (C11); credenciales por tenant en el core; módulos solo `DocumentRef` y dependencias declaradas.
8. Backends `platform` y `tenant_owned` demostrables en recepción; interfaz `external_dms` definida y extensible sin cambiar contratos de módulo.
9. Exigencias de identidad, RBAC, SoD, auditoría y ciclo de vida de usuarios según `seguridad.md` §13 (no se duplican aquí).
10. Tramitación de actos administrativos condicionada a verificación del mecanismo DocDigital (**X-72**); vía alternativa para municipios no habilitados (**X-73**).

## 12. Pendientes abiertos

Nuevos de este documento: **X-48** (contracts.md de plataforma — integraciones, documentos, interfaz DMS, cuerpos HTTP de ops admin §2.11), **X-49** (estructura organizacional municipal / `OrganizationalUnit`), **X-50** (proceso de incorporación de municipio y migración de datos históricos), **X-51** (mecanismo de autorización en runtime), **X-52** (wireframes de consolas — creados; ver `plataforma/wireframes/`), **X-57** (catálogo de proveedores externos y config por tenant), **X-58** (contrato documental: MIME, tamaños, retención), **X-59** (interfaz adaptador DMS + primer producto certificado / CMIS), **X-72…X-76** (DocDigital: mecanismo, vía alternativa, alcance, folio histórico, plazos).

Preexistentes que este documento organiza: X-01, X-02, X-05, X-06, X-15, X-22, X-23, X-24, X-25, X-26, X-28, X-33, X-37, X-39, X-42.

## 13. Referencias

- [`seguridad.md`](./seguridad.md) — exigencias de C1, C2, C5, C8
- [`musts-arquitectura.md`](./musts-arquitectura.md) — §3 tenants a escala, §5 clasificación, §8 observabilidad, §9 eventos, §10 flujos
- [`contrato-api-first.md`](./contrato-api-first.md) — mandato API y estructura de contratos
- [`integracion-docdigital.md`](./integracion-docdigital.md) — contrato funcional C11
- [`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) — §5.2 sincronización MP, §7 wireframes
- [`decisiones-macro-stack.md`](../decisiones/decisiones-macro-stack.md) — §1 modos de consumo, §2 soberanía del dato, §7 ecosistema
- [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) — modelo de entregable donde este core se integra
- [`2026-07-docdigital-tramitacion-documental.md`](../decisiones/2026-07-docdigital-tramitacion-documental.md) — decisión canónica DocDigital