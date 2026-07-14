# Especificaciones de seguridad — SGM

> Documento normativo — arquitectura / seguridad
> Estado: borrador. Complementa `principios-no-negociables.md`, `estandares-api.md` y `musts-arquitectura.md`.
> Principio rector: mismo estándar que el resto de la arquitectura — **propiedades verificables, no declaraciones de intención**. La seguridad se demuestra en recepción y se audita en operación.
> Pendientes registrados en [`pendientes.md`](./pendientes.md).

---

## 1. Marco normativo aplicable

| Norma | Alcance en SGM |
|---|---|
| **Ley 21.719** | Protección de datos personales: RRHH/Remuneraciones, proveedores personas naturales, ciudadanos en módulos futuros. Define roles de responsable y encargado de tratamiento según modo de consumo (ver `decisiones-macro-stack.md` §2). |
| **DS N°7/2023** | Ciberseguridad: incidentes, coordinación con CSIRT de Gobierno, estándares mínimos para plataformas del Estado. |
| **DS N°4/2020 (Ley 21.180)** | Normas técnicas de autenticación e interoperabilidad. |
| **DS N°10/2023 (NTDEE)** | Documentos y expedientes electrónicos: metadatos, estructura, formatos, actuaciones, retención, enlaces persistentes. Diagnóstico y propuestas en [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md). |
| **DS N°12/2023 (NTI / PISEE)** | Interoperabilidad OAE↔OAE vía nodo, Catálogo y Portal PISEE; traza PISEE distinta de auditoría interna. Diagnóstico y propuestas en [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md). |
| **Ley 19.799** | Firma electrónica (FirmaGob/FEA en actos administrativos). |

**[PENDIENTE P-21]** Mapeo detallado de obligaciones DS N°7/2023 → controles exigibles en bases (candidato a asesoría jurídico-técnica).

## 2. Identidad y autenticación

Dos planos, ya definidos en `estandares-api.md` §8; aquí se agregan las exigencias de seguridad:

### 2.1 Plano personas (Clave Única)
1. La sesión emitida tras el login con Clave Única viaja a la API como token firmado, de vida corta, con renovación explícita. **[PENDIENTE P-22]** Duración de sesión y política de renovación (referencia: prácticas de otros servicios del Estado).
2. Cierre de sesión efectivo del lado del servidor (revocación, no solo borrado del token en el cliente).

### 2.2 Plano sistemas (M2M)
1. OAuth2 client credentials (o equivalente) con **scopes por módulo y por municipio**; principio de mínimo privilegio por defecto — un consumidor de reportería obtiene lectura de los módulos pertinentes, nunca acceso total.
2. Credenciales de cliente con rotación exigible y revocación inmediata disponible.
3. **Identidad del funcionario originante en escrituras M2M (regla de trazabilidad administrativa):** cuando un sistema municipal escribe vía API, el contrato exige que el payload incluya la identidad del funcionario que originó la acción (RUN o identificador institucional). La autenticación es de máquina; la responsabilidad administrativa del acto es de una persona, y debe quedar registrada para efectos de auditoría y Contraloría. **[PENDIENTE P-23]** Formato exacto del campo y mecanismo de verificación (¿se valida contra nómina del municipio o se registra declarativamente?).

## 3. Autorización: modelo de roles y permisos (RBAC)

Hoy las fichas de proceso usan Rol = Usuario / Aprobador, pero no existe un modelo canónico. Exigencias:

1. **Modelo RBAC explícito y documentado:** roles definidos por módulo, permisos como operaciones del contrato (la unidad de permiso es la operación de API, no la pantalla — consecuencia directa del API-first).
2. **Asignación por municipio y unidad:** un rol se otorga en el contexto de un tenant y una unidad municipal; ninguna asignación es global salvo los roles de administración de plataforma (SUBDERE).
3. **Administración delegada:** cada municipio administra los roles de sus funcionarios dentro de su tenant; SUBDERE administra la plataforma. Las acciones de administración de roles son a su vez operaciones auditadas del contrato.
4. **[PENDIENTE P-24]** Catálogo inicial de roles por módulo, derivable de las columnas Unidad municipal/Rol de las fichas de flujo — mismo método que el mapa de bordes.

## 4. Segregación de funciones (SoD)

En compras públicas la segregación no es buena práctica: es control interno exigible. Reglas verificables:

1. **Quien solicita no aprueba; quien aprueba no recepciona; quien recepciona no paga.** Las incompatibilidades entre roles se declaran en el modelo RBAC y **el motor las hace cumplir** (validación bloqueante del lado del servidor), no dependen de disciplina administrativa.
2. Excepciones para municipios pequeños con dotaciones mínimas (donde una persona cumple varios roles): deben ser configurables, explícitas, registradas y visibles en auditoría — jamás silenciosas. **[PENDIENTE P-25]** Definir la matriz de incompatibilidades y el régimen de excepciones con contraparte DAF/jurídica; validar contra normativa de control interno aplicable (Contraloría).
3. Los intentos de operación que violen segregación se registran (quién intentó qué), no solo se rechazan.

## 5. Auditoría

1. **Registro de auditoría inmutable** (append-only) para: toda transición de estado de flujo (ya exigida en `musts-arquitectura.md` §10.3), toda operación de escritura, toda acción de administración de roles y accesos, y todo acceso a datos personales protegidos por Ley 21.719.
2. Cada registro: quién (persona o sistema + funcionario originante), qué operación, sobre qué entidad, cuándo, desde dónde (IP/consumidor), resultado.
3. El registro de auditoría es consultable vía API con scope propio y restringido — la auditoría también respeta el mandato API.
4. Retención: **[PENDIENTE P-26]** definir plazos por tipo de registro según normativa archivística y de Contraloría.

## 6. Protección de datos (Ley 21.719)

1. **Catálogo de datos personales por módulo:** qué entidades y campos contienen datos personales, con su finalidad legal declarada — extensión natural de `entidades-core.md` (campo adicional de clasificación). **[PENDIENTE P-27]** Ejecutar el catastro sobre las 14 entidades existentes; crítico antes de especificar RRHH/Remuneraciones, el módulo más sensible.
2. **Minimización en los contratos:** las entidades expuestas en `contracts.md` cruzan el borde con el subconjunto mínimo de campos; los datos personales no viajan en payloads que no los requieren para su finalidad.
3. Derechos ARCO-P: los flujos de acceso, rectificación y supresión sobre datos personales deben estar especificados como operaciones, no improvisarse.
4. Roles de responsable y encargado de tratamiento definidos por modo de consumo (**[PENDIENTE P-01]**, ver [`pendientes.md`](./pendientes.md)).

## 7. Cifrado y gestión de secretos

1. **En tránsito:** TLS en todo el perímetro y también entre servicios internos (módulos, capa de lectura, servicio de notificaciones). Versiones mínimas y suites definidas por referencia a estándar vigente, no congeladas en las bases.
2. **En reposo:** cifrado de base de datos y del almacenamiento de objetos (C10; backends `platform`, `tenant_owned` y `external_dms` — principio no negociable §6).
3. **Gestión de secretos:** tres familias en gestor dedicado; prohibido en código fuente, variables de entorno planas en repositorio, o logs:
   - **`ApiClient`:** credenciales de sistemas que **consumen** el SGM (M2M municipal, ecosistema).
   - **`IntegrationCredential`:** secretos del SGM hacia terceros (MP, FirmaGob, SII, APIs de DMS).
   - **Credenciales de bucket municipal** (`tenant_owned`): access keys del object storage del tenant, referenciadas desde `TenantStorageConfig`.
   **Lección directa del sistema anterior: se encontraron secretos JWT en logs.** La ausencia de secretos en logs es ítem explícito de la revisión de recepción. Los módulos funcionales **no** almacenan ninguna de estas familias.
4. Rotación de llaves y secretos: procedimiento documentado y demostrado, no declarado.

## 8. Seguridad de la API en operación

1. **Rate limiting por consumidor** (token/cliente), con límites diferenciados por plano (persona vs. sistema) y por tipo de operación. Protege la plataforma de consumidores defectuosos o maliciosos del ecosistema — condición de viabilidad del modelo abierto.
2. **Validación de entrada estricta en el borde:** todo payload se valida contra el esquema OpenAPI antes de tocar lógica de negocio; los errores usan el esquema estructurado de `estandares-api.md` §3 sin filtrar información interna (stack traces, rutas, versiones).
3. Cabeceras de seguridad estándar en el frontend base; protección CSRF donde aplique.
4. Webhooks salientes hacia terceros: firmados (el receptor puede verificar que el evento proviene de SGM) y sin datos personales más allá de lo mínimo — el receptor consulta el detalle vía API con sus propios scopes.

## 9. Ciclo de vida de usuarios municipales

Flujo real que ningún documento especifica aún y que en municipios es fuente clásica de riesgo (funcionarios que rotan, suplencias, alejamientos):

1. Alta, modificación de roles y baja de funcionarios como flujos especificados del sistema (con ficha de proceso propia), no gestiones manuales de base de datos.
2. **Baja oportuna:** la desvinculación revoca accesos de inmediato; cuentas huérfanas detectables por reporte (última actividad, cuentas sin uso en N días).
3. Suplencias y subrogancias: asignación temporal de roles con fecha de término obligatoria y reversión automática. **[PENDIENTE P-28]** Levantar el proceso real de subrogancias con los pilotos — es práctica municipal cotidiana y el diseño debe reflejarla.
4. Revisión periódica de accesos por municipio (recertificación): reporte provisto por el sistema.

## 10. Continuidad: respaldos y recuperación

1. **RPO y RTO explícitos en las bases**, con valores diferenciados por criticidad (transaccional vs. capa de lectura). **[PENDIENTE P-29]** Calibrar valores; referencia inicial: RPO ≤ 1 hora, RTO ≤ 8 horas hábiles para la transaccional.
2. Respaldos cifrados, con **prueba de restauración periódica demostrada** — un respaldo que nunca se restauró no es un respaldo.
3. Plan de recuperación documentado y ensayado como parte de la recepción.

## 11. Gestión de incidentes

1. Procedimiento de respuesta a incidentes alineado con DS N°7/2023, incluyendo la notificación al CSIRT de Gobierno en los plazos que la norma exige.
2. Clasificación de severidad y tiempos de respuesta comprometidos por el proveedor de mantención (conecta con el régimen de SLOs de `musts-arquitectura.md` §6).
3. Si el incidente compromete datos personales: evaluación de notificación a la Agencia de Protección de Datos y a los afectados según Ley 21.719. **[PENDIENTE P-30]** Procedimiento específico con jurídica.

## 12. Verificación en recepción

Mismo principio que las pruebas de carga — cumple o no cumple:

1. **Pruebas de penetración** ejecutadas por un tercero independiente del adjudicatario, sobre el ambiente de recepción, con alcance que incluya la API (ambos planos de autenticación), el frontend base y la infraestructura. Los hallazgos críticos y altos se corrigen antes de la recepción.
2. **Revisión de configuración:** secretos fuera de logs y código, TLS interno, rate limiting activo, RBAC y segregación operando con casos de prueba.
3. **Análisis de dependencias:** inventario de componentes (SBOM) y ausencia de vulnerabilidades conocidas críticas sin mitigar en el momento de la entrega.
4. Repetición periódica en operación: **[PENDIENTE P-31]** frecuencia de pentest y auditorías (anual como referencia) y quién la financia (candidato: contrato de mantención).

## 13. Resumen: qué va a las bases

1. Dos planos de autenticación con las exigencias de §2, incluida la identidad del funcionario originante en escrituras M2M.
2. Modelo RBAC documentado con permisos a nivel de operación de API y administración delegada por municipio.
3. Segregación de funciones implementada en el motor, con régimen de excepciones explícito y auditado.
4. Registro de auditoría inmutable, consultable vía API con scope restringido.
5. Catálogo de datos personales, minimización en contratos y flujos ARCO-P especificados.
6. Cifrado en tránsito (incluido interno) y reposo; gestión de secretos dedicada; cero secretos en logs (verificado en recepción).
7. Rate limiting por consumidor y validación estricta en el borde; webhooks firmados.
8. Ciclo de vida de usuarios como flujos del sistema, con bajas inmediatas y subrogancias con vencimiento.
9. RPO/RTO explícitos con restauración demostrada.
10. Gestión de incidentes alineada con DS N°7/2023.
11. Pentest independiente, revisión de configuración y SBOM como condición de recepción.

## 14. Pendientes abiertos

Los pendientes de este documento están registrados en [`pendientes.md`](./pendientes.md): P-21, P-22, P-23, P-24, P-25, P-26, P-27, P-28, P-29, P-30, P-31.
