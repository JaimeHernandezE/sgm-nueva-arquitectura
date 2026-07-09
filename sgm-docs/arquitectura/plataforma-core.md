# Plataforma core: servicios transversales del SGM

> Documento de trabajo — arquitectura / plataforma
> Estado: borrador para discusión interna (julio 2026).
> Origen: hasta ahora Adquisiciones se especifica como módulo aislado; este documento define qué existe **debajo y alrededor** de los módulos — identidad, autorización, tenants, parámetros, auditoría, eventos y administración mínima — para que la especificación del core tenga el mismo estándar que la de los módulos.
> Complementa `seguridad.md` (que define exigencias de seguridad del core sin declararlo como tal), `musts-arquitectura.md` §9 (notificaciones) y `plantilla-maestra-sgm.md` §5.2 (sincronización MP).
> Pendientes registrados en [`pendientes.md`](./pendientes.md).

---

## 1. Qué es el core y qué no es

**Definición.** El core de plataforma es el conjunto de servicios que ningún módulo funcional posee y todos requieren. Una capacidad pertenece al core cuando cumple al menos uno de estos criterios:

1. Es requerida por dos o más módulos con la **misma semántica** (identidad, permisos, auditoría).
2. Su propiedad no es atribuible a ningún dominio funcional (gestión de tenants, parámetros normativos).
3. Es condición de operación de la plataforma, no de un proceso de negocio (aprovisionamiento de schemas, emisión de credenciales).

**Anti-definición (igual de importante).** El core **no orquesta procesos de negocio**. No existe un motor central de flujos ni un bus de orquestación que dirija los macroprocesos: cada módulo es dueño de sus estados y transiciones (`musts-arquitectura.md` §10), y la coordinación entre módulos ocurre por **contratos** (dependencias declaradas) y **eventos de dominio** (coreografía), nunca por un director central. Esta decisión preserva el mandato API y el modo à la carte: un municipio que consume solo Adquisiciones no depende de un orquestador que conozca los cinco módulos.

**Consecuencia para la licitación:** el core se especifica, licita y recepciona con la misma disciplina que un módulo funcional — contrato versionado, OpenAPI, pruebas de recepción — porque para el modo à la carte el core **es** un módulo más que el sistema municipal externo consume (autenticación, identidad del funcionario, auditoría).

## 2. El core también cumple el mandato API

Regla derivada del mandato general (`contrato-api-first.md` §1), aplicable textual en las bases:

> El core expone un contrato de entrada/salida versionado (`plataforma/contracts.md`). Ningún módulo accede a las tablas del core ni a funcionalidad no publicada; las pantallas de administración —de SUBDERE y municipales— son consumidores sin privilegios de ese contrato.

Consecuencias:

- **Toda acción administrativa es una operación de API auditada** (ya exigido para roles en `seguridad.md` §3.3; aquí se generaliza a tenants, parámetros y credenciales).
- El core tiene su propio `contracts.md` con las cuatro secciones de `contrato-api-first.md` §3. Borrador mínimo en [`plataforma/contracts.md`](../plataforma/contracts.md) — **[PENDIENTE P-48]** extender a ciclo de vida completo de tenants.
- Las entidades del core (§4) se definen en el modelo de datos canónico con la misma regla de visibilidad interna/expuesta (`plantilla-maestra-sgm.md` §6.6).

## 3. Inventario de servicios del core

| # | Servicio | Qué resuelve | Base normativa ya escrita | Estado |
|---|---|---|---|---|
| C1 | **Identidad y autenticación** | Plano personas (Clave Única) y plano sistemas (M2M, scopes por módulo y municipio) | `seguridad.md` §2, `estandares-api.md` §8 | Exigencias definidas; diseño abierto (**P-02**, **P-22**, **P-23**) |
| C2 | **Autorización (RBAC + SoD)** | Roles por módulo asignados por tenant y unidad; incompatibilidades SoD aplicadas por el motor; administración delegada | `seguridad.md` §3–§4 | Modelo exigido; catálogo abierto (**P-24**, **P-25**) |
| C3 | **Gestión de tenants** | Ciclo de vida del municipio: alta, aprovisionamiento de schema, configuración, suspensión, baja; catálogo de módulos habilitados por tenant | `principios-no-negociables.md` §2, `musts-arquitectura.md` §3 | **Nuevo en este documento** (§5) |
| C4 | **Parámetros** | Dos familias: `NormativeParameter` (legal, administrado por SUBDERE, doble control, vigencia temporal) y parámetros operativos por tenant (perfil de recepción, vistos buenos configurables) | Fichas etapa 2; **P-37**, **P-39**, **P-42** | Entidad definida; administración sin especificar (§6) |
| C5 | **Auditoría** | Registro inmutable append-only, consultable vía API con scope restringido | `seguridad.md` §5 | Exigencias definidas; retención abierta (**P-26**) |
| C6 | **Eventos y notificaciones** | Servicio transversal suscrito a eventos de dominio; entrega por canal según reglas por rol/unidad/municipio; webhooks firmados hacia terceros | `musts-arquitectura.md` §9, `seguridad.md` §8.4 | Diseño exigido; mecanismo y matriz abiertos (**P-05**, **P-06**) |
| C7 | **Sincronización Mercado Público** | Servicio único de plataforma que produce el evento interno (`MpStateChanged`) sea por push o polling; los módulos nunca conocen el mecanismo | `plantilla-maestra-sgm.md` §5.2, `integracion-mercado-publico.md` | Estándar definido; es servicio de plataforma, no de Adquisiciones |
| C8 | **Ciclo de vida de usuarios** | Alta/modificación/baja como flujos especificados; subrogancias con vencimiento automático; recertificación | `seguridad.md` §9 | Exigencias definidas; proceso real abierto (**P-28**) |

Regla de lectura: donde la columna "Base normativa" apunta a un documento existente, este inventario **no duplica** esas exigencias — las organiza como servicios y agrega lo que falta (§4–§7).

Nota sobre C7: aunque hoy solo Adquisiciones consume estados MP, el servicio se clasifica como core por el criterio 2 de §1 (el mecanismo de sincronización y la negociación con ChileCompra son activos de plataforma). Sus eventos internos se declaran en el contrato del core; Adquisiciones los consume como dependencia.

## 4. Entidades del core

Entidades transversales que hoy las fichas usan de forma implícita (columnas Unidad municipal / Rol) sin definición canónica. Se agregan al modelo de datos como dominio propio (propuesta: `modelo-datos/entidades-plataforma.md`, hermano de `entidades-core.md`), con la misma regla de obligatoriedad explícita de campos:

| Entidad | Rol | Visibilidad propuesta |
|---|---|---|
| `Tenant` | Municipio como unidad de aislamiento (schema) y de configuración; incluye módulos habilitados y modo de consumo (hosting completo / à la carte) | Expuesta (lectura restringida) |
| `OrganizationalUnit` | Unidad municipal (Unidad Solicitante, DAF Abastecimiento…); jerarquía simple por tenant | Expuesta |
| `User` | Funcionario municipal o de SUBDERE; identidad ligada a RUN (Clave Única); estado activo/suspendido/baja | Expuesta (subconjunto mínimo, Ley 21.719) |
| `Role` / `Permission` | Rol por módulo; permiso = operación del contrato (`seguridad.md` §3.1) | Expuesta |
| `RoleAssignment` | Otorgamiento de rol a usuario en contexto tenant + unidad, con vigencia | Expuesta |
| `Delegation` | Subrogancia/suplencia: asignación temporal con fecha de término obligatoria y reversión automática | Expuesta |
| `SodRule` / `SodException` | Incompatibilidad entre roles y excepción configurada por tenant (explícita, registrada, auditada) | Interna; excepciones consultables |
| `ApiClient` | Credencial M2M: sistema municipal o tercero del ecosistema, con scopes por módulo y municipio, rotación y revocación | Expuesta (administración) |
| `NormativeParameter` | Ya definida en `entidades-core.md`; **se reclasifica como entidad de plataforma** (administración SUBDERE, lectura por todos los módulos) | Expuesta (lectura) |
| `TenantParameter` | Parámetro operativo por tenant (perfil de recepción **P-42**, visto bueno pre-OC **P-39**), distinto de `NormativeParameter` | Expuesta (administración municipal) |
| `AuditRecord` | Registro de auditoría según `seguridad.md` §5.2 | Expuesta (scope restringido) |
| `EventSubscription` | Suscripción de un consumidor (servicio de notificaciones, webhook de tercero) a eventos de dominio | Expuesta (administración) |

⚠ **Pendiente de definir:** la estructura organizacional municipal real (catálogo de unidades típicas, jerarquía, variación entre municipios grandes y pequeños) debe levantarse con pilotos/DM antes de cerrar `OrganizationalUnit` — las fichas usan nombres de unidad como texto y el RBAC exige asignación por unidad. **[PENDIENTE P-49]**

## 5. Ciclo de vida de tenants (nuevo)

Flujo de plataforma sin especificación previa. Etapas mínimas que el contrato del core debe cubrir:

1. **Alta:** creación del `Tenant` (convenio firmado como precondición administrativa — conecta con **P-01**), aprovisionamiento del schema (automatizado y demostrable a escala, `musts-arquitectura.md` §3), selección de modo de consumo y módulos habilitados, carga de configuración inicial (unidades, primer administrador municipal, parámetros operativos por defecto).
2. **Operación:** administración delegada (C8), cambios de módulos habilitados, cambio de modo de consumo (un municipio à la carte que migra a hosting completo, o viceversa).
3. **Suspensión / baja:** estados definidos con efecto sobre accesos (revocación inmediata) y sobre los datos (retención y devolución según el convenio — soberanía del dato, `decisiones-macro-stack.md` §2).

⚠ **Pendiente de definir:** el proceso real de incorporación de un municipio (quién firma, qué datos históricos se migran, quién capacita, plazos) es un flujo administrativo SUBDERE que debe levantarse y documentarse con ficha propia. La migración de datos históricos del municipio entrante (contratos vigentes, expedientes en curso) es la parte técnicamente sensible. **[PENDIENTE P-50]**

## 6. Administración de parámetros

Dos familias con gobernanza distinta — la distinción ya existe en las fichas (**P-42**); aquí se formaliza:

| Familia | Ejemplos | Quién administra | Control |
|---|---|---|---|
| `NormativeParameter` | Umbrales UTM, tramos de licitación, umbrales de garantías | SUBDERE (nivel plataforma) | **Doble control** (proponente ≠ aprobador), vigencia temporal, histórico inmutable — un cambio normativo nunca reescribe el pasado |
| `TenantParameter` | Perfil de recepción, visto bueno pre-OC, timers de escalamiento (**P-33**) | Administrador municipal, dentro del catálogo que la plataforma define | Auditado; con valores por defecto de plataforma |

Regla de diseño: los módulos **leen** parámetros vía contrato del core con clasificación *cacheada* (`musts-arquitectura.md` §5) y frescura declarada; nunca duplican valores normativos en su propio schema.

## 7. Autorización en runtime: decisión pendiente con opciones acotadas

El RBAC es del core, pero cada request llega a un módulo. Cómo valida el módulo los permisos es una decisión estructural que afecta latencia (musts §5) y revocación oportuna (seguridad §9.2):

| Opción | A favor | En contra |
|---|---|---|
| **Claims en el token** (roles/scopes embebidos, vida corta) | Validación local sin latencia; patrón estándar | Revocación no inmediata (ventana = vida del token); tokens crecen con muchos roles |
| **Consulta al core por request** | Revocación inmediata | Agrega latencia a toda operación; el core se vuelve punto único de falla |
| **Híbrido** (claims + lista de revocación corta propagada) | Balance conocido | Mayor complejidad de especificación |

**Propuesta de trabajo (no decisión):** claims en token de vida corta (≤ 15 min) + revocación efectiva vía expiración, con invalidación server-side para el plano personas (`seguridad.md` §2.1.2). Debe resolverse junto con **P-02** y **P-22**. **[PENDIENTE P-51]**

## 8. Pantallas de administración mínima

Dos consolas, ambas consumidoras sin privilegios del contrato del core (§2). Se especifican con wireframes de baja fidelidad según `plantilla-maestra-sgm.md` §7 — estructura y operaciones, no estética:

### 8.1 Consola de plataforma (SUBDERE)

| Pantalla | Operaciones de contrato que respalda |
|---|---|
| Gestión de tenants | Alta, configuración, módulos habilitados, suspensión (§5) |
| Parámetros normativos | Propuesta y aprobación con doble control, vigencias, histórico (§6) |
| Clientes M2M y convenios | Emisión, scopes, rotación, revocación de `ApiClient` (conecta con **P-15**) |
| Monitoreo por tenant | Consumo de la observabilidad exigida en `musts-arquitectura.md` §8 (métricas por tenant) |
| Auditoría de plataforma | Consulta de `AuditRecord` con scope de plataforma |

### 8.2 Consola municipal (administrador delegado)

| Pantalla | Operaciones de contrato que respalda |
|---|---|
| Usuarios del municipio | Alta, modificación, baja inmediata (`seguridad.md` §9) |
| Roles y unidades | `RoleAssignment` por unidad; detección de violaciones SoD al asignar |
| Subrogancias | `Delegation` con vencimiento obligatorio |
| Excepciones SoD | Configuración explícita y auditada (**P-25**) |
| Parámetros operativos | `TenantParameter` dentro del catálogo de plataforma |
| Recertificación de accesos | Reporte de cuentas y última actividad (`seguridad.md` §9.4) |

**[PENDIENTE P-52]** Wireframes de ambas consolas según el estándar de la plantilla maestra — mismo tratamiento que las pantallas de módulo: toda acción mapeada a operación del contrato del core.

## 9. Foliación

Los folios (`ADQ-AAAA-NNNNN`) son hoy responsabilidad del módulo. Se mantiene así — el folio es semántica del dominio — pero el **formato** se estandariza a nivel plataforma: `<MÓDULO>-<AAAA>-<NNNNN>`, único por tenant, año calendario, sin reutilización. Cada módulo declara su prefijo en su `contracts.md`. No se crea un servicio de foliación central: introduciría una dependencia síncrona bloqueante de todos los módulos hacia el core en operaciones de escritura, contra `musts-arquitectura.md` §5.

## 10. Resumen: qué va a las bases

1. El core es parte del entregable licitado, especificado con contrato propio (`plataforma/contracts.md` + OpenAPI) y recepcionado con las mismas pruebas que un módulo.
2. Prohibición de orquestador central de procesos de negocio: coordinación por contratos y eventos; cada módulo es dueño de sus estados.
3. Consolas de administración (SUBDERE y municipal) como consumidores sin privilegios del contrato del core; toda acción administrativa es operación de API auditada.
4. Ciclo de vida de tenants con aprovisionamiento demostrable a escala y estados de suspensión/baja con efecto verificable sobre accesos y datos.
5. Dos familias de parámetros con gobernanza diferenciada; módulos leen vía contrato, nunca duplican valores normativos.
6. Servicio de sincronización MP como servicio de plataforma conmutable (push/polling) que produce eventos internos estables.
7. Exigencias de identidad, RBAC, SoD, auditoría y ciclo de vida de usuarios según `seguridad.md` §13 (no se duplican aquí).

## 11. Pendientes abiertos

Nuevos de este documento: **P-48** (contracts.md de plataforma), **P-49** (estructura organizacional municipal / `OrganizationalUnit`), **P-50** (proceso de incorporación de municipio y migración de datos históricos), **P-51** (mecanismo de autorización en runtime), **P-52** (wireframes de consolas de administración).

Preexistentes que este documento organiza: P-01, P-02, P-05, P-06, P-15, P-22, P-23, P-24, P-25, P-26, P-28, P-33, P-37, P-39, P-42.

## 12. Referencias

- [`seguridad.md`](./seguridad.md) — exigencias de C1, C2, C5, C8
- [`musts-arquitectura.md`](./musts-arquitectura.md) — §3 tenants a escala, §5 clasificación, §8 observabilidad, §9 eventos, §10 flujos
- [`contrato-api-first.md`](./contrato-api-first.md) — mandato API y estructura de contratos
- [`plantilla-maestra-sgm.md`](./plantilla-maestra-sgm.md) — §5.2 sincronización MP, §7 wireframes
- [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) — §1 modos de consumo, §2 soberanía del dato, §7 ecosistema
- [`entregable-licitacion.md`](./entregable-licitacion.md) — modelo de entregable donde este core se integra
