# Integraciones SGM con terceros — registro único

> Documento de trabajo — arquitectura / especificación  
> Estado: borrador (primera versión orientada a jefatura y fase exploratoria CPI/RFI)  
> Fuente de pendientes: [`../decisiones/pendientes.md`](../decisiones/pendientes.md)  
> No inventa capacidades de terceros: solo afirma lo que el corpus declara.

**Audiencias.** (1) Jefatura — Parte 1 en unos diez minutos. (2) Fase exploratoria CPI / RFI — columna *Destino CPI* y Parte 3.2. (3) Bases de licitación y diseño de bordes — fichas y aperturas.

**Regla central.** Prohibido afirmar qué ofrece un sistema de un tercero si el corpus no lo declara. Marcadores del mecanismo:

| Marcador | Cuándo |
|---|---|
| **Verificado** | El corpus declara verificación y cómo o con quién |
| **Supuesto** | El corpus lo asume para diseñar, sin verificación declarada |
| **Desconocido** | El corpus no dice nada sobre el mecanismo |

**Destino CPI / consulta** (fase exploratoria). Cada mecanismo no verificado declara a quién se pregunta:

| Valor | Significado |
|---|---|
| **Consulta institucional** | Organismo del Estado; no admite consulta al mercado |
| **Consulta al mercado (RFI)** | Material de RFI / oferta |
| **Ambas** | Tramo institucional y tramo de oferta |
| **No aplica** | Verificado, fuera de alcance, o no hay pregunta de mecanismo |

Las integraciones son, para el diagnóstico CPI, parte de «las condiciones o recursos que deberá proveer la institución para instalar la solución».

**Conteo frente a inventario.** [`inventario-repositorio.md`](../../../inventario-repositorio.md) §1.4 lista **15** sistemas Estado. Este registro cubre **21** fichas de organismos/Estado (Grupo A) más **7** dependencias infra/ecosistema en tabla (Grupo B). La diferencia son organismos citados en planes (Registro Civil, COMPIN/Isapre, deudores de alimentos, reportes RRHH, bancos, giradores) y la separación FCM / TGR / SEM; NTDEE se mantiene aunque es marco, no endpoint.

**Fuera de alcance / no heredar (explícito en corpus):** escritura API hacia Mercado Público; heredar `auth=none` del feed SEM as-is en el to-be; Rentas/cálculo tributario salvo decisión de jefatura; construcción de giradores (Tesorería D-3); fundir el nodo SUBDERE de privados en la licitación SGM.

---

## Parte 1 — Triage

*Derivada de las fichas de la Parte 2. Leer sola.*

### 1.1 En diez líneas

SGM depende de **21 sistemas de terceros** para operar. **Sobre ninguno de ellos hay una capacidad de integración verificada:** no se ha confirmado con ningún organismo qué interfaz ofrece, en qué formato ni con qué disponibilidad.

De las 16 filas de organismos de la tabla §1.4 (algunas agrupan sistemas), **10 no tienen contraparte designada.** No es que esté ocupada: no existe.

Y de las 19 preguntas de mecanismo abiertas, **13 no las puede responder el mercado** (solo el organismo). Otras **3** tienen tramo institucional y tramo de oferta (**Ambas**). Hay que preguntar a cada organismo del Estado, una por una, lo que no es RFI puro.

| Cifra | Valor |
|---|---|
| Integraciones fichadas (Grupo A) | **21** |
| Capacidades de integración **verificadas con el organismo titular** | **0** |
| Mecanismo **Supuesto** o **Desconocido** | **19** de 21 |
| Organismos **sin contraparte designada** | **10** de 16 |
| Preguntas que **solo responde el organismo**, no el mercado | **13** de 19 |

Las **2** fichas que no entran en esos 19 no tienen capacidad de tercero verificada: Mercado Público (decisión propia read-only **Verificada**; el canal de lectura sigue **Desconocido**) y SEM (hallazgo H-2 del as-is **Verificado**; el feed to-be con auth sigue **Supuesto**).

Hay tres hechos verificados en el corpus, y conviene ser preciso sobre qué son: la cobertura municipal de DocDigital (~80 %, fuente Ministerio de Hacienda), el hallazgo H-2 sobre el sistema anterior, y la decisión propia de consumir Mercado Público en solo lectura. **Ninguno de los tres es una capacidad ofrecida por un tercero.**

Grupo B (7 filas): ninguna API de tercero Estado verificada; diseño de plataforma o pendiente.

### 1.2 Las que bloquean

#### Bloquean la redacción de las bases

Sin respuesta no se puede escribir la exigencia contractual con precisión.

| Integración | Qué está sin resolver | Qué bloquea | Quién puede resolverlo | Destino CPI |
|---|---|---|---|---|
| DocDigital | ¿API máquina-a-máquina (M2M: sistema a sistema) o solo web? (X-72) | Exigencia C11, modos M2M vs asistido, recepción | Gobierno Digital | Consulta institucional |
| SIAPER | ¿Interfaz M2M o solo portal? (R-2) | Exigencia MR-6 y vía alternativa | CGR / SIAPER | Consulta institucional |
| Mercado Público | Canal de lectura push vs polling (X-70); sandbox/rate limits a negociar | Texto de borde C7 y SLA de lectura | ChileCompra (+ SUBDERE negociación) | **Ambas** — ChileCompra (canal/sandbox); RFI para resiliencia si MP no responde (X-32) |
| PISEE | Quién opera el nodo y si el borde entra en v1 (X-61) | Alcance de interoperabilidad OAE en bases | DM / operación; oferta si entra RFI de diseño | Ambas |
| Giradores / SEM | Contrato de entrada de órdenes de ingreso (T-1) + feed SEM con auth (T-12) | Exigencia de Caja y superficie M2M | DM / giradores; plataforma | Ambas |
| SII (cesión) | ¿Existe push/consulta dirigida al Registro de Transferencias? (C-4) | Si las bases exigen automatizar factoring | SII | Consulta institucional |

#### Bloquean la puesta en marcha de un municipio

Las bases pueden redactarse; el municipio no opera completo sin esto.

| Integración | Qué está sin resolver | Qué bloquea | Quién puede resolverlo | Destino CPI |
|---|---|---|---|---|
| DocDigital (habilitación) | Vía del ~20 % sin DocDigital (X-73); habilitación por tenant | Dictar actos con folio oficial | DM / jurídica; municipio | Consulta institucional (política); operación municipal |
| ClaveÚnica | Operación OIDC del plano personas; duración de sesión (X-22) | Login de funcionarios | SUBDERE plataforma | Consulta institucional (valores de sesión si aplica) |
| Credenciales tenant (MP, FirmaGob, SII, DocDigital) | `TenantIntegrationConfig` / rotación (X-57) | Uso real de C7/C9/C11 | SUBDERE y/o admin municipal según proveedor | No aplica (gobernanza interna) |
| Previred / TGR Form. 10 / DIPRES | Canal, formato y acuse | Nómina previsional, aporte FCM, informe DIPRES | Municipio + organismo; formatos a verificar | Consulta institucional |
| SINIM / BEP / CGR reportes | Canal y periodicidad residuales (P-8, C-5) | Cumplir cargas e informes | SUBDERE / CGR / DM | Consulta institucional |

### 1.3 Lo que la consulta al mercado no resuelve

De las 19 preguntas de mecanismo abiertas (Parte 3.2), el destino se reparte así:

| Destino | Cantidad |
|---|---|
| **Consulta institucional** — solo la responde el organismo | **13** |
| **Ambas** — un tramo institucional y un tramo de oferta | **3** (Mercado Público, PISEE, SEM to-be) |
| **Consulta al mercado (RFI)** | **3** (NTDEE, bancos, giradores) |

**La fase exploratoria del CPI puede correr en paralelo, pero no destraba las integraciones.** Trece de estas preguntas se resuelven solo escribiendo a un organismo del Estado y sentándose con él, con CPI o sin CPI; las tres **Ambas** siguen exigiendo ese tramo institucional. La consulta al mercado no le puede preguntar al SII si existe un canal hacia el Registro de Transferencias de Créditos.

**Y esa es, probablemente, la ruta crítica del proyecto.** Estimación gruesa, para discutir y no para comprometer:

| Escenario | Resultado |
|---|---|
| Consultas institucionales ejecutadas en serie por una persona, a razón de 3 a 6 semanas cada una entre envío y respuesta utilizable | Las 13 (+ tramo institucional de las Ambas) superan el año |
| Consultas ejecutadas en paralelo, con contraparte designada por organismo | Las bloqueantes se cierran en 1 a 2 meses |

La diferencia entre ambos escenarios no es de esfuerzo: es de si existe o no una contraparte designada que conduzca cada consulta.

---

### 1.4 Qué se necesita de jefatura

#### 1. Contrapartes por designar

| Organismo / sistema | Contraparte en el corpus |
|---|---|
| DocDigital / FirmaGob | Gobierno Digital (verificación X-72; mesa firma) |
| Mercado Público | ChileCompra / Dirección de Compras |
| SIAPER / Toma de Razón CGR | CGR / SIAPER |
| SII (cesión, UTM) | SII |
| PISEE / nodo | SGD / DM / operación (X-61, X-82) — **sin persona o unidad nominada** |
| SEM / giradores | DM / giradores — **sin contraparte designada por organismo** |
| Previred | **sin contraparte designada** |
| DIPRES | **sin contraparte designada** |
| TGR / FCM | **sin contraparte designada** (TGR citado como destinatario) |
| SINIM / BEP | SUBDERE / DM |
| Registro Civil (RMTNP) | DM / Registro Civil |
| COMPIN / Isapre | DM (+ Tesorería/Cont) — **sin unidad nominada en el organismo** |
| Registro Deudores Pensiones Alimentos | DM / registro externo — **sin unidad nominada en el registro** |
| Transparencia / INE / LRE | DM + Jurídica (LRE); **sin contraparte en cada portal** |
| Bancos | **sin contraparte designada** (bancos del municipio) |
| ClaveÚnica | Operación plataforma SUBDERE; IdP Estado — **sin unidad nominada** |

*Las 10 sin contraparte designada (para el conteo de §1.1):* PISEE; SEM / giradores; Previred; DIPRES; TGR / FCM; COMPIN / Isapre; Registro Deudores; Transparencia / INE / LRE; Bancos; ClaveÚnica.

#### 2. Convenios o habilitaciones por gestionar

| Trámite | Quién tramita (si el corpus lo dice) |
|---|---|
| Habilitación municipal DocDigital | Municipio; config en `TenantIntegrationConfig` (`plataforma-core.md` §7) |
| Negociación nacional ChileCompra (webhooks, sandbox MP, rate limits) | SUBDERE como activo de plataforma (`integracion-mercado-publico.md`) |
| Negociación / verificación Gobierno Digital (DocDigital, FirmaGob) | SUBDERE / mesa citada en estándares |
| Enrolamiento / autorizaciones PISEE | Según X-61; Gestor PISEE citado en brechas |
| Convenio tipo soberanía del dato / acceso ecosistema | Jurídica — X-01, X-15 |
| Onboarding municipio (ficha + migración) | Flujo SUBDERE — X-50 (aún sin ficha de proceso) |

#### 3. Decisión de arquitectura que corresponde a jefatura

**¿Las integraciones las opera SUBDERE de forma centralizada o cada municipio con sus propias credenciales?**

| Opción | Consecuencia sobre incorporación de un municipio |
|---|---|
| **A — Todo centralizado SUBDERE** | Un solo set de credenciales hacia terceros; el alta del municipio no exige gestionar secretos locales hacia MP/FirmaGob/SII/DocDigital. Menor autonomía municipal; mayor carga y responsabilidad SUBDERE frente a cada organismo. |
| **B — Todo por municipio** | Cada alta exige habilitar y rotar credenciales del tenant; el municipio no opera si faltan. Escala con el número de municipios; negociación con terceros se multiplica. |

**Postura ya escrita en el corpus (híbrida), no inventada aquí:** [`plataforma-core.md`](./plataforma-core.md) §7 distingue dos planos y dos niveles:

- **Plataforma (SUBDERE):** ClaveÚnica OIDC, webhook MP nacional, negociación ChileCompra / Gobierno Digital, catálogos `ExternalProvider` / `DmsAdapter`.
- **Tenant (municipio):** organismo comprador MP, habilitación DocDigital, `SignatureChain`, bucket propio o DMS, rotación delegada donde aplique.

Sigue abierto: gobernanza exacta del catálogo y rotación (**X-57**), operación del nodo PISEE (**X-61**), proceso real de incorporación (**X-50**).

---

## Parte 2 — Fichas (Grupo A) y tabla (Grupo B)

Orden: criticidad para bases y puesta en marcha, no alfabético.

### A1. DocDigital

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Gobierno Digital / Ministerio de Hacienda — plataforma DocDigital |
| **Qué hace SGM con esto** | SGM prepara el acto (decreto, resolución); DocDigital lo visa, firma, numera y lo devuelve con folio oficial |
| **Módulos afectados** | Presupuestos, Contabilidad, Tesorería, Adquisiciones, RRHH — paso de tramitación de actos (proceso 25 «Alcaldía: Firmar»); core C11 |
| **Obligatoria por ley o por conveniencia** | Conveniencia de plataforma estatal + FEA (**[NORMA N-06]** Ley 19.799). Cobertura ~80 % municipios: Verificado (fuente Ministerio de Hacienda en ADR) |
| **Dirección del flujo** | Ambas: SGM envía contenido; DocDigital devuelve acto firmado + `ExternalFolio`. Fuente de verdad del folio oficial: DocDigital |
| **Estado del mecanismo** | Cobertura y funciones de plataforma: **Verificado**. Interfaz M2M: **Desconocido** — no asumir API (`integracion-docdigital.md`; ADR; X-72) |
| **Convenio o habilitación previa** | Habilitación municipal DocDigital; config por tenant. Quién tramita la habilitación municipal: no está en el corpus más allá del municipio/tenant |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Circuito asistido (export/import + folio manual); vía alternativa ~20 % (X-73); estados `failed` / indisponibilidad en spec |
| **Consecuencia jurídica de la falla** | No poder completar el acto con folio oficial (distinto de reportar tarde). Plazos legales tensionados si hay latencia (X-76) |
| **Plazos legales asociados** | Latencia vs plazos (p. ej. 15 dic; 10 días art. 29 c) LOCM — X-76 / P-20 |
| **Quién opera** | Adaptador en core SUBDERE; habilitación y cadena de firma por municipio |
| **¿Condición de puesta en marcha?** | Sí, para actos que el inventario asigne a DocDigital — salvo vía alternativa X-73 |
| **Datos personales que cruzan** | Firmantes/visadores vía ClaveÚnica en DocDigital; datos del acto. Base de licitud / rol responsable-encargado: no está en el corpus en esta spec |
| **Contraparte institucional** | Gobierno Digital (X-72) |
| **Qué hacía el sistema anterior** | Correlativos internos Odoo (`approval_resolution`, `payment.decree.code`) como folio; cableado de actos a FirmaGob — cambio respecto del as-is (ADR) |
| **Pendientes asociados** | X-72, X-73, X-74, X-75, X-76; P-18…P-20; C-16…C-18; T-11 |
| **Destino CPI / consulta** | **Consulta institucional** — Gobierno Digital: «¿DocDigital expone interfaz M2M para originar documentos desde un sistema externo y devolver el acto firmado con folio?» |

**Riesgo:** diseñar C11 asumiendo API inexistente y rehacer el borde (bloqueo X-72).

---

### A2. SIAPER

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Contraloría General de la República — SIAPER (registro de actos de personal) |
| **Qué hace SGM con esto** | Deja registrado en Contraloría el acto de personal; el acto en SGM queda incompleto hasta la confirmación externa |
| **Módulos afectados** | RRHH — MR-6 / procesos de personal (plan RRHH D-2) |
| **Obligatoria por ley o por conveniencia** | Obligatoriedad de registro en marco CGR/personal según levantamiento; norma de API: no está en el corpus |
| **Dirección del flujo** | SGM origina; SIAPER confirma. Fuente de verdad del registro externo: SIAPER/CGR |
| **Estado del mecanismo** | **Desconocido** — no asumir M2M (R-2, análogo X-72) |
| **Convenio o habilitación previa** | A verificar con CGR — no está en el corpus si existe convenio |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Diseño (a)+(b): M2M si se verifica, o registro asistido/portal |
| **Consecuencia jurídica de la falla** | Acto de personal incompleto frente a Contraloría |
| **Plazos legales asociados** | no está en el corpus (más allá de «hasta confirmación externa») |
| **Quién opera** | Registro en sistema CGR; SGM origina. Quién opera credenciales: no está en el corpus |
| **¿Condición de puesta en marcha?** | Sí para MR-6, salvo diferir (opción c de R-2) |
| **Datos personales que cruzan** | Actos de personal (sensibles; Ley 21.719 **[NORMA N-17]**). Rol responsable/encargado: no está en el corpus |
| **Contraparte institucional** | CGR / SIAPER |
| **Qué hacía el sistema anterior** | Campos/wizards Odoo; sin integración ni estado de registro (plan RRHH) |
| **Pendientes asociados** | R-2 |
| **Destino CPI / consulta** | **Consulta institucional** — CGR/SIAPER: «¿Existe interfaz M2M para registrar actos de personal desde un sistema municipal, o solo portal?» |

**Riesgo:** licitar MR-6 como integración automática sin vía asistida y no poder cerrar actos de personal.

---

### A3. Mercado Público / ChileCompra

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Dirección de Compras y Contratación Pública — Mercado Público (ChileCompra) |
| **Qué hace SGM con esto** | Abre el portal para que la persona compre o publique; lee el estado del proceso (p. ej. OC aceptada) y lo refleja en el expediente. No escribe en MP por API |
| **Módulos afectados** | Adquisiciones (todas las modalidades); core C7 |
| **Obligatoria por ley o por conveniencia** | Marco compras públicas **[NORMA N-09]** Ley 19.886. Integración read-only: decisión de arquitectura |
| **Dirección del flujo** | SGM lee (API) + deep link. Escritura: solo persona en el portal. Fuente de verdad del proceso de compra en portal: Mercado Público |
| **Estado del mecanismo** | Principio read-only y tipos de interacción: **Verificado** como decisión (julio 2026, `integracion-mercado-publico.md`). Canal push vs polling: **Desconocido** (X-70). Sandbox/webhooks/rate limits: requerimientos a negociar, no cerrados |
| **Convenio o habilitación previa** | Negociación nacional SUBDERE; organismo comprador por municipio |
| **Ambiente de pruebas del tercero** | Sandbox MP: aspiracional a negociar — no verificado en corpus como disponible |
| **Modo degradado** | X-32 (default propuesto: vínculo provisional + flag) |
| **Consecuencia jurídica de la falla** | Expediente desalineado del portal; no dicta por sí el acto de compra si el flujo exige lectura confirmada |
| **Plazos legales asociados** | Los de cada modalidad en fichas Adq (publicación, OC, etc.) |
| **Quién opera** | Core + credenciales; webhook nacional / negociación SUBDERE; organismo MP = municipio |
| **¿Condición de puesta en marcha?** | Sí para operar Adquisiciones con MP |
| **Datos personales que cruzan** | no está en el corpus como foco de esta integración |
| **Contraparte institucional** | ChileCompra |
| **Qué hacía el sistema anterior** | Continuidad del patrón read-only (no automatizar escritura) |
| **Pendientes asociados** | X-70, X-32, X-94 |
| **Destino CPI / consulta** | **Ambas** — ChileCompra: «¿Canal de lectura (webhook, polling o ambos) y condiciones de sandbox/rate limits?» · Mercado (RFI): «¿Cómo diseñan resiliencia si MP no responde (X-32)?» |

**Riesgo:** exigir escritura API en bases (prohibida) o dejar el canal de lectura sin acuerdo y no poder recepcionar C7.

---

### A4. FirmaGob

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | FirmaGob (División Gobierno Digital) — firma electrónica avanzada |
| **Qué hace SGM con esto** | Pide firma avanzada de documentos que no son actos tramitados en DocDigital (p. ej. CDP, vistos buenos, actas según inventario) |
| **Módulos afectados** | Todos los que firman documentos no-acto vía C9; Adquisiciones con fuerza |
| **Obligatoria por ley o por conveniencia** | FEA — **[NORMA N-06]** Ley 19.799; transformación digital **[NORMA N-15]** Ley 21.180 (citas en estándar firma / seguridad) |
| **Dirección del flujo** | SGM solicita y confirma firma (C9). En actos DocDigital, FEA ocurre dentro de DocDigital, no por C9 directo (ADR) |
| **Estado del mecanismo** | Diseño de eventos internos: **Supuesto** de arquitectura. Capacidades exactas de la API: **Desconocido** (`estandar-firma-electronica.md` §8 — mesa Gobierno Digital) |
| **Convenio o habilitación previa** | Credenciales por tenant (`IntegrationCredential`) |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Cola + reintentos; paso bloqueado; umbral de escalamiento pendiente en el estándar |
| **Consecuencia jurídica de la falla** | Documento sin FEA no avanza; distinto de no poder enumerar un acto (eso es DocDigital) |
| **Plazos legales asociados** | Umbral de escalamiento: no está en el corpus |
| **Quién opera** | Servicio único en core; módulos no integran directo |
| **¿Condición de puesta en marcha?** | Sí para flujos que exigen FEA no-acto |
| **Datos personales que cruzan** | Nombre, RUT, cargo del firmante. Comparecientes externos/ClaveÚnica: pendiente en estándar §5 |
| **Contraparte institucional** | FirmaGob / Gobierno Digital |
| **Qué hacía el sistema anterior** | Auditoría: pantalla de configuración ≠ integración funcional (lección de recepción E2E) |
| **Pendientes asociados** | Pendientes locales del estándar §8; X-67 (firma contratista); reclasificación actos → C11; X-72 |
| **Destino CPI / consulta** | **Consulta institucional** — Gobierno Digital: «¿Qué operaciones expone FirmaGob para firma asistida y desatendida, y con qué límites?» |

**Riesgo:** declarar recepción de firma sin prueba E2E real (misma falla del as-is).

---

### A5. ClaveÚnica

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | IdP del Estado — ClaveÚnica |
| **Qué hace SGM con esto** | Autentica a la persona funcionaria para entrar al sistema; DocDigital también la usa al tramitar actos |
| **Módulos afectados** | Plataforma transversal (C1); DocDigital (actos) |
| **Obligatoria por ley o por conveniencia** | Autenticación Estado — DS N°4/2020 citado en `seguridad.md` §2.1; **[NORMA N-15]** Ley 21.180 |
| **Dirección del flujo** | SGM consume identidad (OIDC). Fuente de verdad de identidad ciudadana: ClaveÚnica |
| **Estado del mecanismo** | Uso como IdP del plano personas: **Supuesto** de arquitectura (`seguridad.md`, `plataforma-core.md`). Duración/renovación de sesión: **Desconocido** (X-22) |
| **Convenio o habilitación previa** | Integración OIDC a nivel plataforma SUBDERE |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | no está en el corpus |
| **Consecuencia jurídica de la falla** | Sin acceso al plano personas no hay operación interactiva |
| **Plazos legales asociados** | no está en el corpus |
| **Quién opera** | SUBDERE (plano plataforma) |
| **¿Condición de puesta en marcha?** | Sí |
| **Datos personales que cruzan** | RUN / identidad. Tratamiento bajo **[NORMA N-17]** Ley 21.719 — detalle de roles en esta integración: no está en el corpus |
| **Contraparte institucional** | sin contraparte designada (unidad); operación citada como plataforma SUBDERE |
| **Qué hacía el sistema anterior** | no está en el corpus en las fuentes de esta ficha |
| **Pendientes asociados** | X-22; comparecientes externos (estándar firma §5) |
| **Destino CPI / consulta** | **Consulta institucional** (si se fijan valores de sesión con el IdP) — «¿Cuáles son los parámetros de sesión/renovación exigibles?» · Diseño interno X-22 también puede cerrarse en arquitectura |

**Riesgo:** municipios sin login usable o sesiones mal calibradas frente a política Estado.

---

### A6. SEM (feed externo de caja)

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | SEM — plataforma SUBDERE / feed hacia caja (as-is Odoo) |
| **Qué hace SGM con esto** | Recibe desde un sistema externo los datos para crear cobros en caja (órdenes de ingreso y pagos). En el to-be, esa semántica se conserva como ancla del contrato de giradores, con autenticación fuerte |
| **Módulos afectados** | Tesorería (Caja); plataforma |
| **Obligatoria por ley o por conveniencia** | Conveniencia operativa del ingreso externo; no es norma de «usar SEM» |
| **Dirección del flujo** | Externo → SGM (escritura). Fuente de verdad del cobro originado fuera: el girador/SEM; SGM registra OI/pago |
| **Estado del mecanismo** | As-is: **Verificado** — `POST /api/sem/data` con `auth='none'` crea recepción → OI + pago (**H-2**, `seguridad.md` Anexo A). To-be: semántica recuperable + auth M2M — **Supuesto** de diseño (T-12); heredar `auth=none` está **rechazado** como opción de T-12, no como «borrado» del hallazgo |
| **Convenio o habilitación previa** | Config as-is `sem.entry.config`; to-be: no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | To-be: cero superficie sin autenticación (`seguridad.md` §2.2.3). Sin feed válido, Caja no cobra de forma fiable (T-1) |
| **Consecuencia jurídica de la falla** | No cobrar lo originado fuera de Tesorería; exposición patrimonial si se replica sin auth (lección H-2) |
| **Plazos legales asociados** | no está en el corpus para el feed |
| **Quién opera** | SEM/plataforma SUBDERE como origen citado; consumo en municipio |
| **¿Condición de puesta en marcha?** | Sí para Caja alimentada por giradores (T-1) |
| **Datos personales que cruzan** | Pueden incluir RUT/contribuyente en OI. Base de licitud: no está en el corpus |
| **Contraparte institucional** | sin contraparte designada (más allá de «SEM» / plataforma SUBDERE) |
| **Qué hacía el sistema anterior** | Único patrón productivo de ingreso externo; API sin autenticación (H-2) |
| **Pendientes asociados** | T-12, T-1; fundamento H-2 / Anexo A |
| **Destino CPI / consulta** | **Ambas** — Institucional/plataforma: semántica del feed y dueños SEM. Mercado (RFI): «¿Cómo implementan el contrato de giradores con auth M2M fuerte sin heredar `auth=none`?» |

**Riesgo:** repetir un feed sin autenticación con efecto patrimonial, o no tener contrato de giradores y dejar Caja sin ingreso externo.

---

### A7. Giradores de órdenes de ingreso

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Sistemas o unidades municipales que originan el cobro (patentes, permisos, JPL, derechos, SEM, etc.) — no un único organismo Estado |
| **Qué hace SGM con esto** | Recibe la orden de ingreso para que Caja pueda cobrar; SGM no construye esos sistemas de origen |
| **Módulos afectados** | Tesorería (Caja); Contabilidad (OI pertenece Cont — D-1 Tes) |
| **Obligatoria por ley o por conveniencia** | Condición operativa de Caja. Construcción de giradores: **fuera de alcance** (Tesorería D-3) |
| **Dirección del flujo** | Girador → SGM. Fuente de verdad del cobro originado: el girador |
| **Estado del mecanismo** | Contrato dual (masivo + sincrónico): **Supuesto** (T-1). Inventario real de giradores: **Desconocido** |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Sin contrato fiable → Caja no cobra de forma fiable (riesgo T-1) |
| **Consecuencia jurídica de la falla** | Ingresos municipales no recaudados por canal digital de caja |
| **Plazos legales asociados** | Ventana anulación OI mismo día (proceso caja) — no es del girador |
| **Quién opera** | Unidades/sistemas giradores del municipio |
| **¿Condición de puesta en marcha?** | Sí para Caja con ingresos externos |
| **Datos personales que cruzan** | Contribuyentes en OI |
| **Contraparte institucional** | sin contraparte designada (DM / giradores en glosario de pendientes) |
| **Qué hacía el sistema anterior** | SEM como patrón productivo; resto parcial vía OI Cont |
| **Pendientes asociados** | T-1 (bloqueante); ancla T-12 |
| **Destino CPI / consulta** | **Consulta al mercado (RFI)** — «¿Cómo especifican e inventarian el contrato de entrada de OI desde giradores heterogéneos?» · Inventario local: DM/municipio piloto |

**Riesgo:** Caja sin entradas reales el día uno porque los giradores quedaron fuera de construcción y sin contrato.

---

### A8. SII

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Servicio de Impuestos Internos |
| **Qué hace SGM con esto** | (a) Consulta valores UTM / referencias de precio para umbrales de compra. (b) Detectar cesión de facturas (factoring). (c) Circuito DTE — propiedad abierta. (d) Rentas/cálculo tributario: fuera de alcance actual salvo decisión jefatura |
| **Módulos afectados** | Adquisiciones (SOLPED/umbrales); Contabilidad (cesión MC-7); Tesorería/Adq borde DTE (X-79/X-45) |
| **Obligatoria por ley o por conveniencia** | Cesión: Ley 19.983 citada en plan Contabilidad. UTM/precios: conveniencia/norma de umbrales vía parámetros |
| **Dirección del flujo** | SGM lee (diseño C9 UTM/precios; cesión preferir push o consulta dirigida). Barrido completo del registro: prohibido en diseño (C-4). Fuente de verdad tributaria/cesión: SII |
| **Estado del mecanismo** | Ops C9 UTM/precios: **Supuesto** de diseño en `plataforma-core.md`. Registro de Transferencias: **Desconocido** — sin asumir API (C-4). DTE: **Desconocido** (X-45, X-79) |
| **Convenio o habilitación previa** | Credenciales tenant para C9; verificación con SII para C-4 |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Cesión: detección manual (as-is TUPA). Precios: flags/manual según pendientes de SOLPED |
| **Consecuencia jurídica de la falla** | Pagar a quien no es cesionario; umbrales de compra mal aplicados |
| **Plazos legales asociados** | Conocimiento cesión / reclamo factura (8 días hábiles) — citados en plan Cont (C-14) |
| **Quién opera** | Adaptador core; uso municipal |
| **¿Condición de puesta en marcha?** | UTM/precios: sí para Adq si se cablean. Cesión automatizada: no hasta C-4 |
| **Datos personales que cruzan** | Facturas/proveedores posibles. Rol: no está en el corpus |
| **Contraparte institucional** | SII |
| **Qué hacía el sistema anterior** | Sin integración al Registro de Transferencias; factoring TUPA manual |
| **Pendientes asociados** | C-4; X-45; X-79; fuente de PriceReference abierta |
| **Destino CPI / consulta** | **Consulta institucional** — SII: «¿Existe push o consulta dirigida al Registro Público de Transferencias de Créditos? ¿Qué canal hay para UTM/DTE usable por un sistema municipal?» |

**Riesgo:** afirmar API de cesión en bases y no poder cumplir; o operar factoring a ciegas.

---

### A9. CGR (reportes y Toma de Razón; sin SIAPER)

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Contraloría General de la República |
| **Qué hace SGM con esto** | Genera o registra envíos de información a Contraloría (archivo plano, EEFF, informes) y deja constancia manual del trámite de Toma de Razón en compras |
| **Módulos afectados** | Contabilidad (MC-6, C-5); Presupuestos (export/P-8); Adquisiciones (`ComptrollerReview`, X-64) |
| **Obligatoria por ley o por conveniencia** | Reportes y control — marco NICSP-CGR / Res. CGR N° 3/2020 en corpus; art. 29 c)/d) LOCM **[NORMA N-02]** |
| **Dirección del flujo** | SGM escribe/exporta o registra resultado. Fuente de verdad del control externo: CGR |
| **Estado del mecanismo** | Archivo plano mensual: **Desconocido** (C-5). API Toma de Razón: **Desconocido** — default diseño **manual** (X-64). No asumir API |
| **Convenio o habilitación previa** | Canales institucionales a descubrir |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Registro manual de Toma de Razón (diseño actual) |
| **Consecuencia jurídica de la falla** | Incumplir deber de informe o dejar Toma de Razón sin trazabilidad en expediente |
| **Plazos legales asociados** | Mensual archivo plano; EEFF; 10 días art. 29 c) según planes |
| **Quién opera** | Municipio emite; formatos con CGR/SUBDERE |
| **¿Condición de puesta en marcha?** | Sí para obligaciones de reporte del módulo; TdR opera en manual |
| **Datos personales que cruzan** | Según reporte; a menudo agregados |
| **Contraparte institucional** | Contraloría |
| **Qué hacía el sistema anterior** | PDF/TXT parciales; archivo plano ausente; TdR no integrada |
| **Pendientes asociados** | X-64, C-5, C-6, P-8 (residual TXT CGR) |
| **Destino CPI / consulta** | **Consulta institucional** — Contraloría: «¿Existe API o canal machine-readable para estado de Toma de Razón? ¿Cuál es el formato vigente del archivo plano mensual?» |

**Riesgo:** comprometer automatización de TdR en bases sin verificación, o no cerrar formato de reporte exigible.

---

### A10. Previred

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Previred — pago de cotizaciones previsionales |
| **Qué hace SGM con esto** | Prepara y envía (o exporta) la nómina previsional para pagar cotizaciones a tiempo |
| **Módulos afectados** | RRHH (pago previsional / MR-4, MR-7) |
| **Obligatoria por ley o por conveniencia** | Obligatoriedad de pago previsional (marco laboral/previsional); integración M2M no citada como norma |
| **Dirección del flujo** | SGM → Previred (export/pago). Fuente de verdad del pago previsional: Previred / instituciones de previsión |
| **Estado del mecanismo** | Plazo horario del levantamiento: citado como hallazgo de proceso. Integración M2M: **Desconocido**. As-is: export/cálculo + firma TUPA |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | no está en el corpus |
| **Consecuencia jurídica de la falla** | Cotizaciones fuera de plazo; sanción previsional (efecto distinto de no dictar un acto) |
| **Plazos legales asociados** | Levantamiento: no posterior al **día 13 a las 13:45**; doble firma de cuentadantes (plan RRHH §3.1). Verificación en fuente primaria del plazo: no declarada en pendientes |
| **Quién opera** | Municipio (RRHH/Tesorería según plan) |
| **¿Condición de puesta en marcha?** | Sí para nómina previsional |
| **Datos personales que cruzan** | Remuneraciones y cotizaciones (**[NORMA N-17]**) |
| **Contraparte institucional** | sin contraparte designada |
| **Qué hacía el sistema anterior** | Export/cálculo; sin plazo 13:45 ni doble firma en código |
| **Pendientes asociados** | Sin ID dedicado en `pendientes.md` (propuesto en Parte 3.4) |
| **Destino CPI / consulta** | **Consulta institucional** — Previred: «¿Cuál es el canal, formato y acuse aceptados para nómina municipal desde un sistema de gestión?» |

**Riesgo:** perder el plazo previsional mensual por falta de canal/acuse definidos.

---

### A11. DIPRES

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Dirección de Presupuestos — informe de nómina / reportes |
| **Qué hace SGM con esto** | Genera el informe mensual de remuneraciones que debe enviarse a DIPRES |
| **Módulos afectados** | RRHH (MR-7); Contabilidad as-is reportes parciales |
| **Obligatoria por ley o por conveniencia** | Ley de reajustes del sector público art. 70 citada en plan RRHH (plazo 15 días) — forma canónica en registro-normas: verificar aparición; aquí se cita el plan |
| **Dirección del flujo** | SGM → DIPRES. Fuente de verdad del acuse: DIPRES si existe |
| **Estado del mecanismo** | Generación de reporte: parcial en Odoo. Canal/formato/acuse: **Desconocido** |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | no está en el corpus |
| **Consecuencia jurídica de la falla** | Informe fuera de plazo legal de envío |
| **Plazos legales asociados** | Mensual, 15 días tras fin de mes (cita plan RRHH) |
| **Quién opera** | Municipio (RRHH) |
| **¿Condición de puesta en marcha?** | Sí para cumplimiento del informe |
| **Datos personales que cruzan** | Nómina individual (alta sensibilidad) |
| **Contraparte institucional** | sin contraparte designada |
| **Qué hacía el sistema anterior** | XLSX en reportes; sin entidad de envío/acuse |
| **Pendientes asociados** | Spec F1 en plan RRHH; sin ID en `pendientes.md` (propuesto en Parte 3.4) |
| **Destino CPI / consulta** | **Consulta institucional** — DIPRES: «¿Formato, canal y acuse del informe mensual de nómina municipal?» |

**Riesgo:** entregar export sin canal verificable y no demostrar cumplimiento ante DIPRES.

---

### A12. TGR / Formulario 10

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Tesorería General de la República — Formulario 10 |
| **Qué hace SGM con esto** | Prepara el Formulario 10 para enterar aportes (FCM, alcoholes) ante TGR |
| **Módulos afectados** | Tesorería (MT-4, proceso 39) |
| **Obligatoria por ley o por conveniencia** | Obligación de enterar aportes (proceso 39 levantamiento); cifras % sujetas a T-2 |
| **Dirección del flujo** | SGM → TGR. Fuente de verdad del entero: TGR |
| **Estado del mecanismo** | Formato/canal/acuse: **Desconocido**. Plazos/%: verificación pendiente (T-2) |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Alertas de plazo (diseño propuesto en plan) |
| **Consecuencia jurídica de la falla** | Aporte fuera de plazo / multa |
| **Plazos legales asociados** | Formulario 10 ≤ 5° día hábil mes siguiente (levantamiento); 62,5 % FCM en fuente secundaria — T-2 |
| **Quién opera** | Tesorería municipal |
| **¿Condición de puesta en marcha?** | Sí para enteros TGR del proceso 39 |
| **Datos personales que cruzan** | Según formulario — detalle: no está en el corpus |
| **Contraparte institucional** | TGR (sin unidad nominada) |
| **Qué hacía el sistema anterior** | Sin modelos de dominio FCM/Form. 10; TUPA vacío |
| **Pendientes asociados** | T-2; spec Formulario 10 F1 |
| **Destino CPI / consulta** | **Consulta institucional** — TGR: «¿Formato, canal y acuse vigentes del Formulario 10 para municipios?» |

**Riesgo:** validadores legales con cifras no verificadas (T-2) o formulario sin canal.

---

### A13. FCM (Fondo Común Municipal)

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Fondo Común Municipal — obligación de aporte (no es un conector API propio en el corpus) |
| **Qué hace SGM con esto** | Calcula/sigue el aporte FCM y lo entera vía TGR Formulario 10; también aparece en reportes Cont/SINIM |
| **Módulos afectados** | Tesorería (MT-4); Contabilidad (proceso 36); Control (informe art. 29 d) |
| **Obligatoria por ley o por conveniencia** | Obligatoria (marco FCM / DL citado en planes y Nota-sobre-rentas) |
| **Dirección del flujo** | SGM prepara; entero vía TGR. No hay «API FCM» citada |
| **Estado del mecanismo** | **Desconocido** como sistema integrado; acoplado a TGR/SINIM |
| **Convenio o habilitación previa** | N/A normativo de aporte |
| **Ambiente de pruebas del tercero** | No aplica como API |
| **Modo degradado** | Alertas de plazo (Tes) |
| **Consecuencia jurídica de la falla** | Incumplir aporte FCM |
| **Plazos legales asociados** | Vía Form. 10 / T-2 |
| **Quién opera** | Municipio |
| **¿Condición de puesta en marcha?** | Sí en la medida del entero TGR |
| **Datos personales que cruzan** | Agregados de recaudación |
| **Contraparte institucional** | sin contraparte designada (marco FCM / TGR) |
| **Qué hacía el sistema anterior** | Sin modelos FCM; comentarios residuales |
| **Pendientes asociados** | T-2; C-7 / informes Cont |
| **Destino CPI / consulta** | **No aplica** como pregunta de API FCM — redirigir a ficha TGR / SINIM |

**Riesgo:** tratar FCM como integración distinta de TGR y duplicar exigencias contradictorias.

---

### A14. SINIM / BEP

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | SUBDERE — SINIM / carga BEP (Balanzas de Ejecución Presupuestaria) |
| **Qué hace SGM con esto** | Exporta planillas/información presupuestaria-contable para carga en SINIM y ciclo de observaciones |
| **Módulos afectados** | Presupuestos (MP-4, P-8); Contabilidad (proceso 36, C-7) |
| **Obligatoria por ley o por conveniencia** | Obligaciones de información / art. 29 d) LOCM residual P-8; Manual de Imputaciones vía SINIM |
| **Dirección del flujo** | Municipio carga; SUBDERE observa. Fuente de verdad del BEP publicado: SINIM/SUBDERE |
| **Estado del mecanismo** | Estructura BEP v0.7: **parcialmente Verificado** (P-8). Canal, periodicidad, vigencia: **Desconocido** (residual abierto) |
| **Convenio o habilitación previa** | Ciclo de observaciones BEP ya operado manualmente por SUBDERE (cita planes) |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Ciclo manual de observaciones (as-is) |
| **Consecuencia jurídica de la falla** | No cumplir carga/observaciones SINIM; informe Control |
| **Plazos legales asociados** | Según obligación trimestral/otras — reconfirmar (P-8) |
| **Quién opera** | Municipio carga; SUBDERE observa |
| **¿Condición de puesta en marcha?** | Sí para obligaciones BEP/SINIM del módulo |
| **Datos personales que cruzan** | Agregados presupuestarios |
| **Contraparte institucional** | SUBDERE / DM |
| **Qué hacía el sistema anterior** | Pres: TXT CGR parcial, SINIM/BEP no estructurados; Cont: PDF ≠ BEP |
| **Pendientes asociados** | P-8; C-7; P-12; X-08 (frescura SINIM) |
| **Destino CPI / consulta** | **Consulta institucional** — SUBDERE/SINIM: «¿Vigencia de planillas BEP, canal de carga y periodicidad exigibles al SGM?» |

**Riesgo:** exportar formatos obsoletos y fallar el ciclo nacional de observaciones.

---

### A15. PISEE

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Red de interoperabilidad del Estado (PISEE / NTI) — SGM no es el nodo |
| **Qué hace SGM con esto** | Consume/publica servicios entre organismos del Estado a través de un nodo PISEE, con traza distinta de la auditoría interna SGM |
| **Módulos afectados** | Plataforma (borde C-PISEE futuro); consumidores iniciales propuestos (p. ej. consulta expediente) |
| **Obligatoria por ley o por conveniencia** | Marco **[NORMA N-22]** DS N° 12/2023. Entrada en v1: abierta (X-61 opción diferir) |
| **Dirección del flujo** | OAE ↔ OAE vía nodo. No privados por PISEE (deslinde en nodo SUBDERE) |
| **Estado del mecanismo** | Requisitos NTI documentados desde guías; capacidad SGM: **ausente**. Operación del nodo: **Desconocido** (X-61) |
| **Convenio o habilitación previa** | Autorizaciones Gestor PISEE / enrolamiento Portal (brechas) |
| **Ambiente de pruebas del tercero** | Validación nodo — plazos citados en guías de brechas; ambiente SGM: no está en el corpus |
| **Modo degradado** | Diferir a fase 2 (opción c X-61) |
| **Consecuencia jurídica de la falla** | Incumplir interoperabilidad exigida si se compromete en bases; si se difiere, no hay falla operativa inmediata |
| **Plazos legales asociados** | Según guías PISEE citadas en brechas (p. ej. validación) |
| **Quién opera** | (a) nodo SGD municipio o (b) nodo en infra SUBDERE a nombre tenant — sin default (X-61) |
| **¿Condición de puesta en marcha?** | No, si se difiere fase 2; sí, si las bases lo exigen en v1 |
| **Datos personales que cruzan** | Según servicio del Catálogo; minimización citada en brechas |
| **Contraparte institucional** | SGD / DM / operación — sin persona nominada |
| **Qué hacía el sistema anterior** | Integraciones directas a terceros (patrón a no replicar para OAE↔OAE) |
| **Pendientes asociados** | X-61, X-82, X-57 |
| **Destino CPI / consulta** | **Ambas** — Institucional: quién opera el nodo y enrolamiento. **Consulta al mercado (RFI):** «¿Cómo resolverían la integración con múltiples organismos del Estado bajo estándar PISEE sin que SGM sea el nodo?» |

**Riesgo:** prometer PISEE en v1 sin decisión de operación, o omitirlo del RFI y descubrir el costo tarde.

---

### A16. NTDEE

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | No es un sistema externo a llamar. Marco **[NORMA N-21]** DS N° 10/2023 — Norma Técnica de Documentos y Expedientes Electrónicos |
| **Qué hace SGM con esto** | Cumple perfil de expediente electrónico (metadatos, exportación, política documental) sobre C10/expediente |
| **Módulos afectados** | Transversal documental; Adquisiciones como piloto propuesto (X-60) |
| **Obligatoria por ley o por conveniencia** | Obligatoria como estándar Estado (DS N° 10/2023) |
| **Dirección del flujo** | No hay flujo M2M a «NTDEE». Cumplimiento por perfil/export |
| **Estado del mecanismo** | Matriz SGM↔NTDEE definitiva: **Desconocido** / abierta (X-60). No confundir con API |
| **Convenio o habilitación previa** | N/A |
| **Ambiente de pruebas del tercero** | No aplica |
| **Modo degradado** | Subset piloto Adq; expedientes híbridos `scanned` |
| **Consecuencia jurídica de la falla** | Incumplir estándar de expediente electrónico en recepción/auditoría |
| **Plazos legales asociados** | Disponibilidad/retención arts. 32–33 — vía X-63/X-26; no inventar plazos aquí |
| **Quién opera** | Municipio como OAE; SGM soporta |
| **¿Condición de puesta en marcha?** | Según alcance de matriz X-60 en recepción |
| **Datos personales que cruzan** | Metadatos de expediente/documento |
| **Contraparte institucional** | Estándar Gobierno Digital (norma) — sin contraparte operativa de «API» |
| **Qué hacía el sistema anterior** | no está en el corpus como cumplimiento NTDEE |
| **Pendientes asociados** | X-60, X-62, X-63, X-58 |
| **Destino CPI / consulta** | **Consulta al mercado (RFI)** — «¿Cómo demuestran cumplimiento NTDEE (matriz + checklist art. 35) sin reescribir el expediente de negocio?» · Institucional solo si se valida interpretación normativa |

**Riesgo:** listarla como «integración Estado» con endpoint y malgastar el RFI; o no exigir checklist art. 35 en recepción.

---

### A17. Registro Civil — RMTNP

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Servicio de Registro Civil e Identificación — RMTNP (multas de tránsito) |
| **Qué hace SGM con esto** | Carga multas y recibe informe para decretos de pago asociados |
| **Módulos afectados** | Tesorería (MT-4, proceso 39.2.3) |
| **Obligatoria por ley o por conveniencia** | Proceso 39.2.3 del levantamiento |
| **Dirección del flujo** | Bidireccional (carga + informe). Mecanismo: **Desconocido** (T-9) |
| **Estado del mecanismo** | **Desconocido** — API / archivo / portal sin default (T-9) |
| **Convenio o habilitación previa** | Acuerdo DM/Registro Civil — a lograr |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Opciones T-9 incluyen portal manual |
| **Consecuencia jurídica de la falla** | No enterar/procesar multas RMTNP a tiempo |
| **Plazos legales asociados** | Carga mensual + informe (39.2.3) |
| **Quién opera** | Tesorería municipal |
| **¿Condición de puesta en marcha?** | Sí para ese proceso; prioridad Baja en registro (T-9) |
| **Datos personales que cruzan** | Multas / vehículos / RUT |
| **Contraparte institucional** | DM / Registro Civil |
| **Qué hacía el sistema anterior** | Sin dominio; comentario residual |
| **Pendientes asociados** | T-9 |
| **Destino CPI / consulta** | **Consulta institucional** — Registro Civil: «¿Mecanismo (API, archivo o portal), periodicidad y manejo de errores para RMTNP municipal?» |

**Riesgo:** asumir API y no poder cargar multas; o dejar el proceso solo en portal sin trazabilidad SGM.

---

### A18. COMPIN / Isapre

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | COMPIN / Isapres — licencias médicas y subsidios |
| **Qué hace SGM con esto** | Tramita el ciclo de licencia y la recuperación de subsidios (cobranza) |
| **Módulos afectados** | RRHH (MR-5); Contabilidad/Tesorería en cobranza (R-7) |
| **Obligatoria por ley o por conveniencia** | Procesos 7 y 18 del levantamiento |
| **Dirección del flujo** | Bidireccional potencial. Dueño del ciclo de cobranza: **Desconocido** (R-7) |
| **Estado del mecanismo** | Portales/integración: **Desconocido** |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Opción (c) R-7: fuera v1 |
| **Consecuencia jurídica de la falla** | Subsidios no recuperados; datos de salud mal tratados |
| **Plazos legales asociados** | A fijar en R-7 |
| **Quién opera** | RRHH vs Tes — sin default |
| **¿Condición de puesta en marcha?** | No si se deja fuera v1; sí si se incluye MR-5 completo |
| **Datos personales que cruzan** | Datos de salud (licencias) — **[NORMA N-17]** |
| **Contraparte institucional** | sin contraparte designada en el organismo; DM + Tes/Cont |
| **Qué hacía el sistema anterior** | Estados `hr.leave.isapre` + vínculo OI/pago; sin integración a portales |
| **Pendientes asociados** | R-7 |
| **Destino CPI / consulta** | **Consulta institucional** — COMPIN/Isapre (si se incluye v1): «¿Canal de consulta/estado de licencias y subsidios?» · Decisión de alcance: DM |

**Riesgo:** datos de salud sin dueño de cobranza ni canal, o prometer integración inexistente.

---

### A19. Registro Nacional de Deudores de Pensiones de Alimentos

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Registro Nacional de Deudores de Pensiones de Alimentos |
| **Qué hace SGM con esto** | Consulta previa a contratar honorarios (u otros) para no contratar deudores según la regla del levantamiento |
| **Módulos afectados** | RRHH (honorarios, R-11) |
| **Obligatoria por ley o por conveniencia** | Obligatoriedad citada en levantamiento (proceso 4.2.5) |
| **Dirección del flujo** | SGM consulta. Fuente de verdad: el Registro |
| **Estado del mecanismo** | Consulta portal en levantamiento; integrable: **Desconocido** (R-11) |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Evidencia manual (opción b); solo honorarios (c) |
| **Consecuencia jurídica de la falla** | Contratación indebida de deudor alimentario |
| **Plazos legales asociados** | Pre-contratación |
| **Quién opera** | RRHH + DM |
| **¿Condición de puesta en marcha?** | Sí para honorarios si se exige la consulta |
| **Datos personales que cruzan** | Deuda alimentaria / RUN |
| **Contraparte institucional** | DM / registro externo — sin unidad nominada |
| **Qué hacía el sistema anterior** | Ausente |
| **Pendientes asociados** | R-11 |
| **Destino CPI / consulta** | **Consulta institucional** — administrador del Registro: «¿Existe consulta integrable desde un sistema municipal o solo portal con evidencia manual?» |

**Riesgo:** contratar honorarios sin evidencia de consulta y quedar en falta legal.

---

### A20. Transparencia / INE / DJ1887 / LRE

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Portal de Transparencia; INE; DJ1887 (SII); LRE (Dirección del Trabajo) — agrupados como reportes externos RRHH |
| **Qué hace SGM con esto** | Genera reportes de remuneraciones/personal exigidos por distintos portales |
| **Módulos afectados** | RRHH (MR-7) |
| **Obligatoria por ley o por conveniencia** | Transparencia activa; encuesta INE; DJ1887; LRE — obligatoriedad LRE municipal **Desconocida** (R-5) |
| **Dirección del flujo** | SGM → portales (export). Acuse: **Desconocido** |
| **Estado del mecanismo** | Generación parcial Odoo; canales: **Desconocido** |
| **Convenio o habilitación previa** | no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | LRE: solo export CSV as-is |
| **Consecuencia jurídica de la falla** | Incumplir transparencia/estadística/declaración; LRE si aplica |
| **Plazos legales asociados** | Mensuales Transparencia/INE; DJ1887 anual (propuesto en plan) |
| **Quién opera** | RRHH; LRE → DM+Jurídica |
| **¿Condición de puesta en marcha?** | Sí para reportes incluidos en alcance; LRE condicionado a R-5 |
| **Datos personales que cruzan** | Remuneraciones individuales (máxima sensibilidad) |
| **Contraparte institucional** | sin contraparte designada por portal |
| **Qué hacía el sistema anterior** | `report.transparency`, `report.ine`; LRE wizard CSV sin dominio; sin envío/acuse |
| **Pendientes asociados** | R-5; spec reportes F1 |
| **Destino CPI / consulta** | **Consulta institucional** (por portal, si se exige envío): formato/canal/acuse. **R-5** es decisión jurídica interna SUBDERE/DM sobre LRE |

**Riesgo:** exportar CSV sin acuse y no poder demostrar cumplimiento; o implementar LRE sin saber si aplica a municipios.

---

### A21. Bancos

| Campo | Contenido |
|---|---|
| **Organismo y sistema** | Bancos comerciales del municipio |
| **Qué hace SGM con esto** | Genera archivos de transferencia, registra depósitos y usa certificados de saldo para cierre |
| **Módulos afectados** | Tesorería (caja/depósito); Contabilidad (conciliación, certificado saldos) |
| **Obligatoria por ley o por conveniencia** | Operativa de tesorería; no hay norma de «API bancaria» en corpus |
| **Dirección del flujo** | SGM ↔ banco (archivo/proceso). Host-to-host: **Desconocido** (no inventado) |
| **Estado del mecanismo** | As-is archivo/proceso: citado. API bancaria: **Desconocido** |
| **Convenio o habilitación previa** | Convenios banco-municipio — detalle: no está en el corpus |
| **Ambiente de pruebas del tercero** | no está en el corpus |
| **Modo degradado** | Cierre Cont condicionado si falta certificado (C-10 plan Cont) |
| **Consecuencia jurídica de la falla** | Pagos no ejecutados; cierre contable bloqueado |
| **Plazos legales asociados** | Depósito efectivo/cheques día hábil siguiente (levantamiento 42.2.6) |
| **Quién opera** | Tesorería opera; Cont concilia |
| **¿Condición de puesta en marcha?** | Sí para pagos y cierre |
| **Datos personales que cruzan** | Cuentas/beneficiarios |
| **Contraparte institucional** | sin contraparte designada (banco del municipio) |
| **Qué hacía el sistema anterior** | `partner.bank.transfer.file` en Cont Odoo |
| **Pendientes asociados** | Propiedad `BankTransferFile` (F0 Tes); T-5 / C-10 certificado saldos |
| **Destino CPI / consulta** | **Consulta al mercado (RFI)** — «¿Cómo cubren archivo bancario / host-to-host y certificado de saldos multi-banco municipal?» · Convenios: cada municipio |

**Riesgo:** frontera Cont/Tes sin dueño del archivo bancario y pagos o cierres rotos.

---

### Grupo B — Infraestructura y ecosistema (tabla compacta)

| Sistema o dependencia | Qué hace SGM | Estado del mecanismo | Quién opera | ¿Puesta en marcha? | Pendientes / nota |
|---|---|---|---|---|---|
| Object storage (S3-compatible) | Guarda bytes del expediente solo vía C10 (`platform` / `tenant_owned`) | Supuesto de diseño | SUBDERE o municipio según backend | Sí (algún backend) | X-58; `plataforma-core.md` §7bis |
| DMS externo | Opción `external_dms` plug-in | Supuesto; stub X-59 | Municipio | No en v1 si solo platform/tenant_owned | X-59; distinto de C11 DocDigital |
| IdP M2M / credenciales sistemas | Autentica sistemas que llaman a SGM (`ApiClient`) | Supuesto (OAuth2 propuesto) | SUBDERE emite | Sí para ecosistema M2M | X-02; cero `auth=none` (H-2) |
| Correo (C6) | Entrega notificaciones | Supuesto; matriz abierta | Plataforma / tenant | Sí para canales correo | X-05, X-06 |
| Webhooks a terceros | SGM notifica a sistemas municipales/privados | Supuesto | SUBDERE scopes; consumidor externo | Según modo ecosistema | X-05, X-15 |
| SIFIM / SIM / FIGEM | Plataformas SUBDERE (dato propio / integración interna) | Desconocido como API SGM | SUBDERE | Fuera licitación SGM (recomendación nodo) | `nodo-integracion-subdere.md`; X-83 |
| ERPs municipales | Consumen APIs SGM / actúan como giradores | Desconocido por municipio | Municipio | Según à la carte / T-1 | T-1; macro-stack |

---

## Parte 3 — Lo que el registro deja abierto

### 3.1 Integraciones sin contraparte designada

Las mismas **10** filas del listado bajo §1.4 punto 1: PISEE; SEM / giradores; Previred; DIPRES; TGR / FCM; COMPIN / Isapre; Registro Deudores Pensiones Alimentos; Transparencia / INE / LRE; Bancos; ClaveÚnica.

### 3.2 Mecanismos nunca verificados — pregunta exacta y destino CPI

| Integración | Pregunta exacta | Destino CPI |
|---|---|---|
| DocDigital | ¿Existe M2M para originar y recuperar acto+folio? | Consulta institucional — Gobierno Digital |
| SIAPER | ¿M2M o solo portal? | Consulta institucional — CGR |
| Mercado Público | ¿Webhook, polling o ambos? ¿Sandbox y rate limits? / ¿Cómo diseñan resiliencia si MP no responde? | **Ambas** — ChileCompra + RFI (X-32) |
| FirmaGob | ¿Operaciones FEA asistida/desatendida y límites? | Consulta institucional — Gobierno Digital |
| SII cesión / DTE / UTM | ¿Push o consulta dirigida? ¿Canal DTE/UTM? | Consulta institucional — SII |
| CGR TdR / archivo plano | ¿API TdR? ¿Formato archivo plano vigente? | Consulta institucional — Contraloría |
| Previred | ¿Canal, formato, acuse nómina municipal? | Consulta institucional — Previred |
| DIPRES | ¿Formato, canal, acuse informe nómina? | Consulta institucional — DIPRES |
| TGR Form. 10 | ¿Formato, canal, acuse? | Consulta institucional — TGR |
| SINIM/BEP | ¿Vigencia planillas, canal, periodicidad? | Consulta institucional — SUBDERE |
| Registro Civil RMTNP | ¿API, archivo o portal? | Consulta institucional — Registro Civil |
| Deudores alimentos | ¿Consulta integrable? | Consulta institucional — administrador del Registro |
| COMPIN/Isapre | ¿Canal de estado de licencias/subsidios? | Consulta institucional (si v1) |
| PISEE | ¿Quién opera el nodo? / ¿Cómo diseñar borde C-PISEE multi-organismo? | Ambas — DM/SGD + RFI |
| NTDEE | ¿Cómo demostrar matriz + art. 35? | RFI (+ jurídico si interpreta norma) |
| Giradores | ¿Contrato OI multi-origen? | RFI + inventario DM |
| SEM to-be | ¿Auth M2M sobre semántica SEM? | Ambas |
| Bancos | ¿Archivo vs host-to-host multi-banco? | RFI |
| ClaveÚnica sesión | ¿Parámetros de sesión exigibles? | Consulta institucional (si aplica) / cierre X-22 interno |

### 3.3 Contradicciones entre documentos

1. **DocDigital vs FirmaGob en actos.** ADR e `integracion-docdigital.md` mandan C11 para actos. Fichas/contracts históricos aún mencionan FirmaGob/C9 en resoluciones/decretos. La spec DocDigital §5 reconoce la reclasificación pendiente.
2. **NTDEE como «integración» en inventario §1.4.** Es marco/perfil (`brechas-estandarizacion-ntdee-pisee.md`), no endpoint. Este registro lo ficha como A16 con esa aclaración.
3. **FCM bajo SINIM vs TGR.** Contabilidad agrupa FCM en informes SINIM; Tesorería lo entera por Formulario 10 TGR. No son dos APIs: es obligación + dos artefactos de reporte/entero.
4. **Overview Adquisiciones vs `contracts.md`.** Overview aún marca CM/LP/TD como pendientes de especificación en partes; `contracts.md` ya cubre modalidades. Desalineación de estado documental, no de tercero.
5. **IDs X-86…X-90.** `nodo-integracion-subdere.md` §15 propuso esos IDs para el nodo; `pendientes.md` ya los usa para el estándar de pruebas. Colisión de numeración; del nodo quedaron X-82…X-85.

### 3.4 Pendientes que deberían existir y no están (propuesta — no registrados)

Formato alineado a `pendientes.md`. **No se da de alta aquí.**

| ID propuesto | Pendiente | Documento(s) origen | Dependencia externa | Estado | Prioridad | Opciones | Default propuesto | Criterio de cierre |
|---|---|---|---|---|---|---|---|---|
| *(siguiente X-nn libre)* | Verificar capacidades API FirmaGob (asistida/desatendida, límites, evidencias) | `estandar-firma-electronica.md` §8 | Gobierno Digital | Propuesto | Alta | (a) acta de mesa con matriz de ops; (b) diferir FEA no-acto a stub; (c) solo DocDigital para todo firmable | (a) — sin asumir ops no listadas | Acta Gobierno Digital + actualización del estándar §6–§8 |
| *(siguiente R-nn o X-nn)* | Canal, formato y acuse Previred para nómina municipal | plan RRHH §3.1, §6 | Previred | Propuesto | Alta | (a) M2M si existe; (b) export+carga portal; (c) solo archivo con acuse manual | sin default hasta Previred | Verificación Previred; contrato borde RRHH |
| *(siguiente R-nn o X-nn)* | Canal, formato y acuse informe mensual DIPRES (art. 70 reajustes) | plan RRHH MR-7 | DIPRES | Propuesto | Alta | (a) formato oficial+acuse; (b) solo generación sin acuse en v1; (c) diferir | sin default hasta DIPRES | Spec F1 + evidencia de canal |
| *(siguiente X-nn)* | Ambiente de pruebas del tercero por integración crítica (DocDigital, MP, FirmaGob, SII) frente a sandbox SGM (X-16) | este registro; X-16 | organismo + plataforma | Propuesto | Media | (a) exigir sandbox del tercero en negociación; (b) SGM simula tercero como entregable; (c) híbrido por integración | (c) — DocDigital/MP priorizan negociación; resto simulación SGM si no hay sandbox | Matriz integración×(sandbox tercero \| mock SGM) en bases |

---

## Autoverificación

1. **¿Se afirmó qué ofrece un tercero sin respaldo?** Se revisaron las fichas: capacidades API no verificadas quedan en **Desconocido** / «no asumir». Cobertura DocDigital 80 %, H-2 SEM y read-only MP citan rutas. Si aparece redacción que suene a catálogo comercial de un tercero, corregir contra esta regla.
2. **¿Campos en blanco?** No: ausencias usan `no está en el corpus` o `sin contraparte designada`.
3. **¿Parte 1 legible sola con acciones?** Sí: cifras, bloqueos bases vs go-live, lo que el mercado no resuelve (§1.3), contrapartes, convenios, decisión híbrida citada.
4. **¿Verificado vs supuesto?** **Cero** capacidades de integración verificadas con el organismo titular; **19/21** en Supuesto o Desconocido (las otras 2 son MP y SEM: Verificado de decisión/hallazgo, no de capacidad de tercero). Destinos CPI de las 19: 13 institucional / 3 Ambas / 3 RFI. Los tres hechos verificados del corpus (cobertura DocDigital, hallazgo H-2, decisión read-only MP) no son capacidades de terceros y así se declara en 1.1, sin suavizar.
5. **¿Rutas citadas existen?** Comprobadas al redactar: `integracion-docdigital.md`, `integracion-mercado-publico.md`, `estandar-firma-electronica.md`, `plataforma-core.md`, `seguridad.md`, ADR DocDigital, `brechas-estandarizacion-ntdee-pisee.md`, `nodo-integracion-subdere.md`, `pendientes.md`, planes de módulo, `inventario-repositorio.md`, `registro-normas.md` (N-02, N-06, N-09, N-15, N-17, N-21, N-22).
6. **Ajustes de plan:** cada no verificado tiene Destino CPI; Grupo B es tabla; Parte 1 se cerró tras las fichas; SEM H-2 figura como hallazgo Verificado, no como «descartado».