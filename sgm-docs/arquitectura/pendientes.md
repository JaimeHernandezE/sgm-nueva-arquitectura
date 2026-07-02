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
| P-16 | Especificación del ambiente sandbox (alcance, datos sintéticos, disponibilidad pública) | decisiones-macro-stack §10 | ninguna | Abierto |
| P-17 | Revisión jurídica del contrato original con el proveedor Odoo | decisiones-macro-stack §8.4, §10 | jurídica | Abierto |
| P-18 | Encuadre jurídico de la consulta al mercado (RFI / diálogo competitivo, Ley 21.634) | decisiones-macro-stack §9.1, §10 | jurídica | Abierto |
| P-19 | Borrador mínimo de estándares que gatilla la primera consulta al mercado | decisiones-macro-stack §10 | ninguna | Abierto |
| P-20 | Especificación de accesibilidad del frontend base (DS N°1/2015) | principios-no-negociables §4 | ninguna | Abierto |
| P-21 | Mapeo de obligaciones DS N°7/2023 → controles exigibles en bases | seguridad §1, §14 | jurídica | Abierto |
| P-22 | Duración de sesión y política de renovación (plano personas, Clave Única) | seguridad §2.1, §14 | ninguna | Abierto |
| P-23 | Formato y verificación de la identidad del funcionario originante en escrituras M2M | seguridad §2.2, §14 | ninguna | Abierto |
| P-24 | Catálogo inicial de roles por módulo (derivable de fichas de flujo) | seguridad §3, §14 | ninguna | Abierto |
| P-25 | Matriz de incompatibilidades SoD y régimen de excepciones para dotaciones pequeñas | seguridad §4, §14 | DAF / jurídica | Abierto |
| P-26 | Plazos de retención de auditoría por tipo de registro | seguridad §5, §14 | Contraloría / archivística | Abierto |
| P-27 | Catastro de datos personales sobre las entidades existentes | seguridad §6, §14 | ninguna | Abierto |
| P-28 | Proceso real de subrogancias (levantar con pilotos) | seguridad §7, §14 | pilotos | Abierto |
| P-29 | Calibración de RPO/RTO | seguridad §9, §14 | ninguna | Abierto |
| P-30 | Procedimiento de notificación de incidentes con datos personales (Ley 21.719) | seguridad §10, §14 | jurídica | Abierto |
| P-31 | Frecuencia y financiamiento de pentest en operación | seguridad §12, §14 | ninguna | Abierto |
