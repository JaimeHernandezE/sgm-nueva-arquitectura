# Principios de Arquitectura No Negociables

Estos principios deben quedar definidos en las bases de cualquier licitación de desarrollo del nuevo stack SGM, y no pueden delegarse al proveedor adjudicado — evitan recrear lock-in con un nuevo vendor de la misma forma en que ocurrió con Odoo.

## 1. REST API-first

El backend expone una API REST documentada como contrato de primera clase. El frontend base (el que construya el adjudicatario) debe consumir esa misma API pública, sin privilegios especiales — esta es la disciplina que mantiene viable, a futuro, un marketplace o frontend de terceros sobre el mismo backend.

## 2. Hosting en infraestructura SUBDERE

El sistema se aloja en infraestructura propia de SUBDERE, no en la nube del proveedor. Multitenancy por municipio, con separación de datos clara entre instancias.

## 3. Stack abierto

Sin dependencias de licenciamiento propietario que reintroduzcan lock-in. Componentes con comunidad activa y posibilidad real de cambio de proveedor de mantención sin reescritura completa.

## 4. Cumplimiento normativo desde el diseño

- **DS N°4/2020** — cumplimiento en el diseño de flujos y trazabilidad documental.
- **Ley 21.719** (protección de datos personales) — aplicable especialmente a datos de RRHH, proveedores y ciudadanos en módulos futuros (Rentas, JPV).
- **Ley 19.886** (compras públicas) — tratamiento diferenciado por modalidad de compra (ver `modulos/adquisiciones/`), no un flujo genérico.
- **Ley 19.799** (firma electrónica) — relevante para integración con FirmaGob/FirmaDigital.

## 5. Propiedad del código de Estado

El código fuente es propiedad de SUBDERE, con cláusulas de portabilidad explícitas en el contrato de licitación — no debe quedar dependencia irrestricta de un proveedor único para mantención o evolución futura.

## 6. Separación de almacenamiento de objetos

Los archivos/documentos (evidencias, resoluciones, comprobantes) se almacenan separados de la base de datos transaccional, con su propio ciclo de vida y política de retención.

## Rol de un eventual apoyo externo de arquitectura

Si SUBDERE no cuenta con la capacidad interna suficiente para definir estos principios en detalle técnico, la vía correcta es un contrato de asesoría acotado en el que un especialista ayuda a definir la arquitectura, mientras la propiedad de la decisión permanece en SUBDERE. Esto es distinto de delegar estas decisiones al proveedor que construye el sistema.
