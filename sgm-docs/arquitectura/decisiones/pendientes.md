# Pendientes de arquitectura — registro único

Registro centralizado de pendientes de los documentos de arquitectura. En cada documento origen, los pendientes inline usan la forma `**[PENDIENTE P-nn]**`.

| ID | Pendiente | Documento(s) origen | Dependencia externa | Estado |
|---|---|---|---|---|
| P-01 | Instrumento jurídico de soberanía del dato por modo de consumo (Ley 21.719) | decisiones-macro-stack §2, §10; seguridad §3 | jurídica | Abierto |
| P-02 | Especificación de autenticación M2M (scopes por módulo y municipio) | estandares-api §8, contrato-api-first §5, decisiones-macro-stack §6, §10 | ninguna | Abierto |
| P-03 | Multitenancy explícita en el contrato API (tenant en ruta, token, o ambos) | estandares-api §6 | ninguna | Abierto |
| P-04 | Plazo mínimo de convivencia entre versiones deprecadas de contratos | estandares-api §2 | ninguna | Abierto |
| P-05 | Mecanismo de entrega de eventos (webhooks, cola, polling) | contrato-api-first §3.4, musts-arquitectura §9.4, modulos/adquisiciones/contracts.md §4 | ninguna | Abierto |
| P-06 | Matriz evento → canal → destinatario por rol | musts-arquitectura §9.3, §12 | ninguna | Abierto |
| P-07 | Perfil de pico con datos reales de pilotos (razón pico/promedio) | musts-arquitectura §1, §12 | pilotos | Abierto |
| P-08 | Frescura requerida de la capa de lectura por caso de uso | musts-arquitectura §4, §12 | ninguna | Abierto |
| P-09 | Clasificación de validaciones del piloto Compra Ágil (síncrona/asíncrona/cacheada) | musts-arquitectura §5, §12 | ninguna | Abierto |
| P-10 | Calibración final de SLOs y régimen de consecuencias contractuales | musts-arquitectura §6, §12 | ninguna | Abierto |
| P-11 | Validación del objetivo de disponibilidad (99,5%) contra estándares de servicios del Estado | musts-arquitectura §6, §12 | ninguna | Abierto |
| P-12 | Regla de versionamiento de procesos en vuelo, por tipo de flujo | musts-arquitectura §10.5, §12 | ninguna | Abierto |
| P-13 | Decisión sobre exigencia de evidencia de mercado laboral local en las bases (formato verificable) | decisiones-macro-stack §10 | ninguna | Abierto |
| P-14 | Nivel de soporte mínimo Odoo en los 5 pilotos durante licitación y desarrollo (18–24 meses) | decisiones-macro-stack §10 | ninguna | Abierto |
| P-15 | Diseño del convenio tipo de acceso al ecosistema para empresas terceras | decisiones-macro-stack §10 | ninguna | Abierto |
| P-16 | Especificación del ambiente sandbox (alcance, datos sintéticos, disponibilidad pública). Marco: [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §5; detalle operativo: [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) | decisiones-macro-stack §10, entregable-licitacion §5 | ninguna | Abierto |
| P-17 | Revisión jurídica del contrato original con el proveedor Odoo | decisiones-macro-stack §8.4, §10 | jurídica | Abierto |
| P-18 | Encuadre jurídico de la consulta al mercado (RFI / diálogo competitivo, Ley 21.634) | decisiones-macro-stack §9.1, §10 | jurídica | Abierto |
| P-19 | Borrador mínimo de estándares que gatilla la primera consulta al mercado | decisiones-macro-stack §10 | ninguna | Abierto |
| P-20 | Especificación de accesibilidad del frontend base (DS N°1/2015) | principios-no-negociables §4 | ninguna | Abierto |
| P-21 | Mapeo de obligaciones DS N°7/2023 → controles exigibles en bases | seguridad §1, §14 | jurídica | Abierto |
| P-22 | Duración de sesión y política de renovación (plano personas, Clave Única) | seguridad §2.1, §14 | ninguna | Abierto |
| P-23 | Formato y verificación de la identidad del funcionario originante en escrituras M2M | seguridad §2.2, §14 | ninguna | Abierto |
| P-24 | Catálogo inicial de roles por módulo (derivable de fichas de flujo) — documento transversal [`arquitectura/especificacion/catalogo-roles.md`](../especificacion/catalogo-roles.md); consola con vistas por usuario y por módulo/proceso | seguridad §3, §14 | ninguna | **Borrador** |
| P-25 | Matriz de incompatibilidades SoD y régimen de excepciones para dotaciones pequeñas | seguridad §4, §14 | DAF / jurídica | Abierto |
| P-26 | Plazos de retención de auditoría por tipo de registro | seguridad §5, §14 | Contraloría / archivística | Abierto |
| P-27 | Catastro de datos personales sobre las entidades existentes | seguridad §6, §14 | ninguna | Abierto |
| P-28 | Proceso real de subrogancias (levantar con pilotos) | seguridad §7, §14 | pilotos | Abierto |
| P-29 | Calibración de RPO/RTO | seguridad §9, §14 | ninguna | Abierto |
| P-30 | Procedimiento de notificación de incidentes con datos personales (Ley 21.719) | seguridad §10, §14 | jurídica | Abierto |
| P-31 | Frecuencia y financiamiento de pentest en operación | seguridad §12, §14 | ninguna | Abierto |
| P-32 | Resiliencia ante servicios externos caídos (Mercado Público, API de precios) — regla única reutilizable, hoy solo códigos de error dispersos. Aplica igual a las vinculaciones MP inmediatas (CA/CM) y diferidas (LP §3.5, TD) | procesos-transversales/2-modalidad-compra.md §2.3, procesos-transversales/1-solped.md §1.1, modelo-datos/entidades-core.md, modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md §3.5 | ninguna | Abierto |
| P-33 | Timers de escalamiento configurables (plazos por sub-paso, sin propiedad de flujo definida hoy) | procesos-transversales/2-modalidad-compra.md §2.3, modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md §3.2, procesos-transversales/4-recepcion-conforme.md §4.1, §4.2, musts-arquitectura §10.4 | ninguna | Abierto |
| P-34 | Procedimiento de reversión de modalidad post-confirmación (anulación de `CaseStep` instanciados, nueva `ModalityDecision`) | procesos-transversales/2-modalidad-compra.md §2.1 | ninguna | Abierto |
| P-35 | Ventana y criterios de la detección de fraccionamiento (regla V6 del gateway de validación de modalidad) | procesos-transversales/2-modalidad-compra.md §2.1 | DM / jurídica | Abierto |
| P-36 | Catálogo estructurado de causales de Trato Directo (artículo y literal, Ley 19.886 y reglamento) | procesos-transversales/2-modalidad-compra.md §2.1 | jurídica | Abierto |
| P-37 | Carga inicial de valores de `NormativeParameter` (tramos de licitación, umbrales de garantías, umbrales de Toma de Razón, comisión evaluadora obligatoria, garantías y contrato obligatorios) verificados contra norma vigente post Ley 21.634 | procesos-transversales/2-modalidad-compra.md §2.1, modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md (cierre de etapa) | jurídica | Abierto |
| P-38 | Existencia y alcance de la aprobación de jefatura sobre la decisión de modalidad (para qué modalidades, si exige firma electrónica, si aplica segregación decisor/aprobador) | procesos-transversales/2-modalidad-compra.md §2.2 | DM | Abierto |
| P-39 | Visto bueno interno pre-OC como control configurable por municipio (la ley no lo exige en Compra Ágil) | modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md §3.2 | DM | Abierto |
| P-40 | Procedimiento de regularización presupuestaria cuando el monto real de la OC excede la preobligación sin saldo disponible | modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md §3.4 | DM / Finanzas | Abierto |
| P-41 | Cancelación de proceso con preobligación ya vencida de saldo anual — coordinación con regla de cierre presupuestario | modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md §3.6 | Finanzas | Abierto |
| P-42 | Configuración del perfil de recepción por municipio (por tipo de bien/rubro, por unidad, por monto) — candidato a parámetro operativo por tenant, distinto de `NormativeParameter` | procesos-transversales/4-recepcion-conforme.md §4.1 | ninguna | Abierto |
| P-43 | Procedimiento de reversión de conformidad de recepción por vicio oculto, con efectos sobre devengado/pago según estado del ciclo | procesos-transversales/4-recepcion-conforme.md §4.2 | DM / Finanzas | Abierto |
| P-44 | **[PRIORIDAD ALTA]** Alcance de Bodega/Inventario y Activo Fijo: no están entre los módulos declarados del SGM — decisión de bases pendiente, escalar a jefatura | procesos-transversales/4-recepcion-conforme.md §4.3 | jefatura / decisión de bases | Abierto |
| P-45 | Circuito DTE (plazos de reclamo, efectos de cesión/factoring, mérito ejecutivo) a confirmar contra norma vigente antes de especificar la etapa de pago | procesos-transversales/4-recepcion-conforme.md §4.4, §4.5 | jurídica / Contabilidad | Abierto |
| P-46 | **[PRIORIDAD ALTA]** Momento del devengado: recepción conforme (por valor aceptado) vs. three-way match con factura — dos definiciones distintas no reconciliadas | procesos-transversales/4-recepcion-conforme.md §4.4, modelo-datos/entidades-core.md (`Accrual`), modulos/adquisiciones/contracts.md §4 | Contabilidad / DM | Abierto |
| P-47 | Frontera Pago/Tesorería: la ficha de Recepción Conforme asume que Pago pertenece a un módulo Tesorería separado, pero el repo ya documenta Pago como etapa 5 propia de Adquisiciones (`procesos-transversales/5-pago.md`) | procesos-transversales/4-recepcion-conforme.md §4.4, procesos-transversales/5-pago.md | DM | Abierto |
| P-48 | Redactar `plataforma/contracts.md` — contrato del core (identidad, roles, tenants, parámetros, auditoría, eventos, integraciones C7/C9, documentos C10) con las cuatro secciones de contrato-api-first §3 | plataforma-core §2, §7–§7bis, entregable-licitacion §9.1, §10 | ninguna | **Borrador mínimo** |
| P-49 | Contenido del catálogo base `OrgStructureTemplate` (departamentos/unidades típicos, variación por tamaño de municipio). **Modelo ya fijado:** dos niveles `department`→`unit`, plantilla clonable y editable por tenant — ver `entidades-plataforma.md` | plataforma-core §4, entidades-plataforma | pilotos / DM | Abierto (contenido); modelo resuelto |
| P-50 | Proceso de incorporación de municipio (convenio, configuración inicial, capacitación) y migración de datos históricos del municipio entrante | plataforma-core §5 | DM / jurídica (conecta P-01) | Abierto |
| P-51 | Mecanismo de autorización en runtime (claims en token vs. consulta al core vs. híbrido); resolver junto con P-02 y P-22 | plataforma-core §8 | ninguna | Abierto |
| P-52 | Wireframes de consolas de administración (plataforma SUBDERE y municipal) según plantilla-maestra §7, con acciones mapeadas al contrato del core | plataforma-core §9, plataforma/overview.md, plataforma/wireframes/ | ninguna | **Wireframes creados**; ops admin stub en contracts §2.11 (cierre HTTP en P-48) |
| P-57 | Catálogo de proveedores externos (`ExternalProvider`), campos de `TenantIntegrationConfig` por proveedor, gobernanza de rotación de credenciales | plataforma-core §7 | ninguna | Abierto |
| P-58 | Contrato documental C10: tipos MIME permitidos, tamaños máximos, clases de retención, migración entre backends | plataforma-core §7bis, plataforma/contracts.md | ninguna | Abierto |
| P-59 | Interfaz de adaptador DMS (`external_dms`) + primer producto certificado o estándar (p. ej. CMIS); stub en sandbox | plataforma-core §7bis | pilotos / DM | Abierto |
| P-53 | Tooling de validación CI del repo para OpenAPI y fixtures (lint, correspondencia contracts.md ↔ spec, examples ↔ fixtures) | estandares-api.md Parte II §13 | ninguna | Abierto |
| P-54 | Definiciones exactas de las medidas financieras del catálogo analítico (embudo solicitado → pagado); `amount_accrued` bloqueada por P-46, `amount_paid` sujeta a P-47 | modulos/adquisiciones/analitica.md §4.2, §9.1 | Contabilidad / DM / Finanzas | Abierto |
| P-55 | Forma del contrato de consulta agregada (operación genérica vs. consultas predefinidas) y calibración de límites por consulta | modulos/adquisiciones/analitica.md §5, §9.2 | ninguna | Abierto |
| P-56 | Visibilidad de agregados analíticos por rol y unidad (municipio completo vs. propia unidad); resolver junto a P-24 | modulos/adquisiciones/analitica.md §7, §9.3 | DM / pilotos | Abierto |
| P-60 | Matriz definitiva SGM ↔ NTDEE; perfil `ExpedienteElectronicoNTDEE`; campos nuevos en `Document`/expediente; checklist art. 35 | brechas-estandarizacion-ntdee-pisee.md §5–§6 (conecta P-58, P-26) | ninguna | Abierto |
| P-61 | Borde C-PISEE: quién opera el nodo, adaptador core, servicios Catálogo iniciales, traza PISEE vs auditoría | brechas-estandarizacion-ntdee-pisee.md §4–§5 (conecta P-57, P-48) | DM / operación | Abierto |
| P-62 | Política de Gestión Documental (artefacto) y soporte en C10 (tipologías, retención, formatos, visación) | brechas-estandarizacion-ntdee-pisee.md §3, §6 (conecta P-58, P-60) | jurídica / DM | Abierto |
| P-63 | Enlaces persistentes (art. 33 NTDEE) y plazo de disponibilidad de expedientes/documentos (art. 32) | brechas-estandarizacion-ntdee-pisee.md §3, §6 (conecta P-26, P-60) | ninguna | Abierto |
| P-64 | Canal de consulta de estado de trámites de Contraloría (Toma de Razón) integrable vía API — no asumir su existencia; hoy `ComptrollerReview` es registro manual | modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md §3.4, §3.11, modelo-datos/entidades-core.md (`ComptrollerReview`) | Contraloría | Abierto |
| P-65 | Criterio jurídico de cuándo una aclaración a las bases (foro de preguntas) exige acto administrativo complementario y extensión de plazo | modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md §3.6 | jurídica | Abierto |
| P-66 | Alcance exacto de las inhabilidades de integrantes de la comisión evaluadora (SoD frente a requirente de la SOLPED y elaborador de bases técnicas) | modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md §3.9, modelo-datos/entidades-core.md (`CommitteeMember`) | jurídica | Abierto |
| P-67 | Mecanismo de firma del contratista en el `Contract` (FEA propia, firma en papel digitalizada, o plataforma externa) | modulos/adquisiciones/3. licitacion-publica/3-resolucion-compra.md §3.13, modelo-datos/entidades-core.md (`Contract`) | DM / jurídica | Abierto |