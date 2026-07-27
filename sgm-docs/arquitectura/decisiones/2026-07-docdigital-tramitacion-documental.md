# 2026-07 — DocDigital como servicio transversal de tramitación documental

**Estado:** Aceptada (condicionada a verificación del mecanismo de integración — **[PENDIENTE P-72]**, bloqueante)
**Fecha:** Julio 2026
**Especificación de contrato funcional:** [`../especificacion/integracion-docdigital.md`](../especificacion/integracion-docdigital.md)

## Contexto

DocDigital es la plataforma oficial del Estado de Chile para la tramitación digital de documentos: permite cargar, visar, firmar, enumerar y distribuir oficios, resoluciones, decretos, memorandos y convenios con validez legal, integrando Clave Única para autenticación y FirmaGob para firma electrónica avanzada. Al año 2026, el **80 % de los municipios del país** está habilitado para usarla (fuente: Ministerio de Hacienda).

En la especificación SGM, decretos alcaldicios y resoluciones aparecen en múltiples módulos como paso obligatorio, pero **no existía decisión escrita sobre cómo se tramitan ni quién los enumera**. DocDigital ya figuraba solo como canal de notificación formal (C6) y, opcionalmente, como backend DMS (`external_dms`); ninguno de esos roles cubre la tramitación del acto.

El proceso **25 del levantamiento Magenta («Alcaldía: Firmar»)** es el proceso transversal de firma al que varios procesos remiten con *«Ver proceso Firmar Documentos en Alcaldía»*. DocDigital es su contraparte de sistema.

## Decisión

> **SGM origina los actos administrativos; DocDigital los tramita.**
>
> Los decretos alcaldicios y resoluciones que SGM produce como consecuencia de sus procesos se originan en SGM con todo su contenido sustantivo, y se envían a DocDigital para visación, firma electrónica avanzada, **enumeración** y distribución. El acto firmado, con su folio asignado por DocDigital, retorna a SGM como respaldo de la transición de estado correspondiente.
>
> **SGM no genera folios propios para actos administrativos tramitados en DocDigital.** El identificador oficial del acto es el que asigna la plataforma. SGM conserva un identificador interno de trazabilidad, que no sustituye al folio.

Esta decisión es **canónica**: los demás documentos la referencian; no la repiten.

### Condición bloqueante

Toda la especificación de integración queda **condicionada** a verificar si DocDigital expone una interfaz máquina-a-máquina que permita originar documentos desde un sistema externo y recibir de vuelta el acto firmado con su folio (**[PENDIENTE P-72]**). La evidencia disponible describe una plataforma web con autenticación por Clave Única; **no está verificado** que permita integración programática. Si no la tiene, el diseño cambia a exportación e importación asistida con folio ingresado manualmente.

Hasta cerrar P-72: se describe el **contrato funcional** (qué se envía, qué se recibe, qué estados existen), **sin** endpoints ni protocolo.

## Consecuencias

1. **Propiedad del identificador.** Toda entidad de SGM que hoy declare un correlativo propio de decreto o resolución como identificador oficial pasa a referenciar el folio externo (`ExternalFolio`). El correlativo interno se conserva solo como trazabilidad. En el as-is de Odoo esto contradice al menos `approval_resolution` (Char con secuencia interna) en Presupuestos y los decretos de `tesoreria_gov_cl`: es **cambio respecto del as-is**, no continuidad.

2. **Transición de estado dependiente de evento externo.** Las máquinas de estado cuyo avance requiere un acto firmado incorporan un estado intermedio explícito de espera (`pending_signature`) del que solo se sale con el retorno del acto firmado. Mismo patrón que Mercado Público en Adquisiciones, en sentido inverso: aquí SGM origina y la plataforma externa devuelve.

3. **Firma electrónica avanzada.** FirmaGob y Clave Única llegan incluidos en DocDigital para actos tramitados por esa vía. Donde la documentación declare la FEA como capacidad a construir, se reclasifica como **integración a cablear**, manteniendo la exigencia de verificación funcional de extremo a extremo antes de darla por disponible.

4. **Cobertura parcial.** El ~20 % de municipios sin DocDigital obliga a una vía alternativa documentada, con el mismo tratamiento que el modo de contingencia ya especificado para operaciones con plazo legal (**[PENDIENTE P-73]**).

5. **Tres roles distintos de DocDigital en SGM (no colapsar):**
   - **Tramitación de actos** (esta decisión; servicio C11).
   - **Canal de notificación formal** (C6 — sin cambio de semántica).
   - **Repositorio DMS opcional** (`external_dms` en C10), si el municipio lo usa como gestor documental.

## Inventario de actos (ancla)

La tabla canónica vive en [`integracion-docdigital.md`](../especificacion/integracion-docdigital.md) §3. Todo acto administrativo del corpus debe estar marcado allí como tramitado en DocDigital o explícitamente excluido con razón.

## Pendientes derivados

Registrados en [`pendientes.md`](./pendientes.md): **P-72** (bloqueante), **P-73**, **P-74**, **P-75**, **P-76**.

## Fuentes

- [¿Qué es DocDigital? — Gobierno Digital](https://gobdigitalcl.freshdesk.com/support/solutions/articles/72000637652--qu%C3%A9-es-docdigital-)
- [DocDigital 3 — Gobierno Digital](https://digital.gob.cl/media/noticias/la-herramienta-permite-autoridades-funcionarias-y-funcionarios-mantener-una-comunicacion-mas-agil-y-eficiente-en-favor-de-la-modernizacion-de-la-funcion-publica/)
- [Ministerio de Hacienda — 80 % de los municipios ya cuentan con DocDigital](https://www.hacienda.cl/noticias-y-eventos/noticias/80-de-los-municipios-del-pais-ya-cuentan-con-docdigital)
- Manuales de usuario: `manualesdocdigital.s3-us-west-2.amazonaws.com` (Creador, Administrador)
