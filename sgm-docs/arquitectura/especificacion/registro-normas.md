# Registro de normas citadas — registro único

Registro centralizado de normas citadas en el corpus `sgm-docs`. Prefijo **N-nn**. En documentos origen, las citas remiten aquí con la forma `**[NORMA N-nn]**` o enlace markdown al ancla (`[Ley 19.886](./registro-normas.md#n-09)`).

**Propósito:** una sola forma canónica por norma, índice inverso de apariciones y estado de verificación declarado por el propio corpus. No sustituye los §4 «Marco normativo → implicancias de diseño» de cada plan de módulo (allí vive la regla → diseño); este documento es el **índice transversal**.

**No confundir con:**

| Artefacto | Qué es |
|---|---|
| Este registro (`N-nn`) | Catálogo documental de citas legales del corpus |
| `NormativeParameter` | Entidad de runtime (umbrales/valores con vigencia); puede citar una `N-nn` en `legal_reference` |
| [`pendientes.md`](../decisiones/pendientes.md) (`X-nn`) | Decisiones abiertas; varias piden verificación normativa (p. ej. X-37, R-3) |

**Semilla:** lista canónica de [`inventario-repositorio.md`](../../../inventario-repositorio.md) §1.3 (36 ítems). Las apariciones se actualizan al citar; el barrido inicial es best-effort sobre `sgm-docs/`.

---

## 1. Convenciones

| Campo | Significado |
|---|---|
| **ID** | `N-nn` estable. Alta = siguiente número libre. |
| **Forma canónica** | Grafía única para citas nuevas y para `legal_reference` normativo. |
| **Tipo** | Ley · DS/Decreto · Resolución · Dictamen · Oficio · Directiva/marco |
| **Verificación** | `Verificada en fuente` \| `No verificada` \| `Pendiente de verificación` — solo según lo que el corpus declara; no implica trabajo jurídico nuevo. |
| **Apariciones** | Rutas relativas a `sgm-docs/` (y § cuando aporta). No es exhaustivo histórico; se completa al tocar archivos. |
| **Notas** | Artículo/regla **solo** si el corpus ya lo enuncia (p. ej. planes §4). |

### Alta y cita (obligatorio al editar el corpus)

1. Antes de citar Ley / DS / Decreto / Resolución / Dictamen / Oficio / Directiva / NICSP / NTDEE / PISEE / LOCM: consultar esta tabla.
2. Si la norma **existe**: usar la forma canónica + ID; **añadir** la aparición (ruta §) si falta.
3. Si **no existe**: alta de fila con el siguiente `N-nn`; verificación por defecto `No verificada` salvo evidencia explícita en el texto o en fuente primaria citada.
4. No duplicar grafías (`Resolución N° 3` vs `3/2020` → una sola fila).
5. No inventar artículos ausentes del corpus o de fuente verificada.
6. En validadores `blocking`, `legal_reference` normativo preferirá la forma canónica de este registro (opcionalmente el ID).

**Regla de presentación en fichas / prosa:**

- Primera mención en un documento: `Ley 19.886 (**[NORMA N-09]**)` o enlace al ancla.
- Mencciones siguientes en el mismo documento: forma canónica basta.
- `integridad:*` no entra en este registro.

---

## 2. Tabla de normas

| ID | Forma canónica | Tipo | Verificación | Apariciones (ruta) | Notas / artículo si el corpus lo dice |
|---|---|---|---|---|---|
| N-01 | Ley 15.076 | Ley | No verificada | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4 | Componentes remuneratorios (cementerios / honorarios médicos en cuadro SUBDERE) |
| N-02 | Ley 18.695 (LOCM) | Ley | Verificada en fuente (arts. citados en Nota-sobre-rentas) | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4; `arquitectura/decisiones/Nota-sobre-rentas.md`; planes Contabilidad, Tesorería, RRHH; `musts-arquitectura.md`; `estandar-pruebas.md`; `alcance-minimo-modulos-adyacentes.md`; `2026-07-patrones-transversales-corpus.md`; `especificacion/integraciones-terceros.md` | art. 65 a)/c), 67, 81, 82 a), 29 c)/d), 21 b)/c), 63 j) según planes §4 / Nota-sobre-rentas. Alias documental: **N-36** |
| N-03 | Ley 18.883 | Ley | No verificada | `modulos/rrhh/plan-de-trabajo-rrhh.md` §4; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4; `alcance-minimo-modulos-adyacentes.md` | art. 2 — cupo contrata ≤ 20 % remuneraciones planta |
| N-04 | Ley 19.070 | Ley | No verificada | `modulos/rrhh/plan-de-trabajo-rrhh.md`; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4 | Estatuto docente; componentes remuneratorios |
| N-05 | Ley 19.378 | Ley | No verificada | `modulos/rrhh/plan-de-trabajo-rrhh.md`; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4 | Estatuto atención primaria; componentes remuneratorios |
| N-06 | Ley 19.799 | Ley | No verificada | `estandar-firma-electronica.md`; `seguridad.md`; `principios-no-negociables.md`; Adq `1-solped.md`, `2-modalidad-compra.md`, `5-pago.md`; LP `3-resolucion-compra.md`; `especificacion/integraciones-terceros.md` | Documentos electrónicos y firma electrónica |
| N-07 | Ley 19.880 | Ley | No verificada | `brechas-estandarizacion-ntdee-pisee.md`; `plataforma/notificaciones/matriz-evento-canal.md` | Procedimiento administrativo |
| N-08 | Ley 19.883 | Ley | No verificada | `modulos/rrhh/plan-de-trabajo-rrhh.md` | Citada en plan RRHH |
| N-09 | Ley 19.886 | Ley | No verificada | Adq overview / modalidades / SOLPED / pago / wireframes; `pendientes.md` (X-36, X-37); `musts-arquitectura.md`; `plantilla-maestra-sgm.md`; `principios-no-negociables.md`; `decisiones-macro-stack.md`; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §2 D-6 / §4 (art. 3 a — exclusión personal/honorarios); y otros; `especificacion/integraciones-terceros.md` | Compras públicas; causales TD (X-36); primera opción CM; exclusión ST 21 hacia RRHH (Pres v0.16+) |
| N-10 | Ley 19.925 | Ley | No verificada | `arquitectura/decisiones/Nota-sobre-rentas.md` | Citada en Nota-sobre-rentas |
| N-11 | Ley 19.983 | Ley | No verificada | planes Contabilidad, Tesorería, RRHH; `alcance-minimo-modulos-adyacentes.md`; `estandar-pruebas.md`; `2026-07-patrones-transversales-corpus.md` | Citada en marcos de gasto / control |
| N-12 | Ley 20.237 | Ley | No verificada | `modulos/contabilidad/plan-de-trabajo-contabilidad.md` | Citada en plan Contabilidad |
| N-13 | Ley 20.422 | Ley | No verificada | `arquitectura/licitacion/principios-no-negociables.md` | Accesibilidad web (contexto principios) |
| N-14 | Ley 20.742 | Ley | No verificada | `modulos/rrhh/plan-de-trabajo-rrhh.md` | Citada en plan RRHH |
| N-15 | Ley 21.180 | Ley | No verificada | `estandar-firma-electronica.md`; `seguridad.md`; `nodo-integracion-subdere.md`; `especificacion/integraciones-terceros.md` | Transformación digital del Estado |
| N-16 | Ley 21.634 | Ley | No verificada | `2-modalidad-compra.md`; Adq compra-ágil overview; `pendientes.md` (X-18, X-37); `decisiones-macro-stack.md`; `2026-07-eliminacion-odoo.md` | Reforma compras; umbrales post-ley (X-37) |
| N-17 | Ley 21.719 | Ley | No verificada | `seguridad.md`; `pendientes.md` (X-01, X-30); `principios-no-negociables.md`; `plataforma-core.md`; `estandares-api.md`; `estandar-pruebas.md`; `entregable-licitacion.md`; `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md`; `analitica.md`; plan RRHH; `sandbox-desarrolladores.md`; `especificacion/integraciones-terceros.md` | Protección de datos personales |
| N-18 | DS N° 1/2015 | DS/Decreto | No verificada | `principios-no-negociables.md`; `pendientes.md` (X-20) | Accesibilidad — X-20 |
| N-19 | DS N° 4/2020 | DS/Decreto | No verificada | `seguridad.md`; `principios-no-negociables.md` | Citado en marco de seguridad / principios |
| N-20 | DS N° 7/2023 | DS/Decreto | No verificada | `seguridad.md`; `principios-no-negociables.md`; `pendientes.md` (X-21) | Obligaciones → controles en bases (X-21) |
| N-21 | DS N° 10/2023 | DS/Decreto | No verificada | `seguridad.md`; `principios-no-negociables.md`; `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md`; `especificacion/integraciones-terceros.md` | Relacionado NTDEE / estandarización |
| N-22 | DS N° 12/2023 | DS/Decreto | No verificada | `seguridad.md`; `principios-no-negociables.md`; `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md`; `especificacion/integraciones-terceros.md` | Relacionado PISEE / interoperabilidad |
| N-23 | Decreto 854/2004 | DS/Decreto | No verificada | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4 | Clasificador presupuestario (mod. N-25) |
| N-24 | DS N° 661/2024 | DS/Decreto | No verificada | `2-modalidad-compra.md` §2.1; CM `3-resolucion-compra-convenio-marco v2.md`; wireframe `31-evaluacion-umbral.md` | Reglamento Ley 19.886; art. 90 Gran Compra (corpus) |
| N-25 | Decreto 1227/2024 | DS/Decreto | No verificada | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4 | Modifica clasificador (información presupuestaria 2026) |
| N-26 | Resolución CGR N° 3/2020 | Resolución | No verificada | `modulos/contabilidad/plan-de-trabajo-contabilidad.md` §4; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` (v0.9, Anexo A); `alcance-minimo-modulos-adyacentes.md` | NICSP-CGR Sector Municipal; vigente desde 1-I-2021; supersede Oficio 36.640/2007 en relato del corpus |
| N-27 | Dictamen CGR N° 60.449/2008 | Dictamen | Verificada en fuente | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` §4; `modulos/rrhh/plan-de-trabajo-rrhh.md`; `2026-07-patrones-transversales-corpus.md` | SECPLA / modificaciones presupuestarias (corpus §4 Presupuestos) |
| N-28 | Dictamen CGR N° 11.365/2006 | Dictamen | Pendiente de verificación | `modulos/rrhh/plan-de-trabajo-rrhh.md` §4 (R-3) | Calificación anual — no usar como validador antes de R-3 |
| N-29 | Oficio CGR N° 3.899/2018 | Oficio | Pendiente de verificación | `modulos/contabilidad/plan-de-trabajo-contabilidad.md` §4 (C-6) | EE.FF.; vigencia post N-26 dudosa en corpus |
| N-30 | Oficio CGR N° 36.640/2007 | Oficio | No verificada | `modulos/contabilidad/plan-de-trabajo-contabilidad.md`; `modulos/presupuestos/plan-de-trabajo_presupuestos.md` | Corpus: superado por N-26 |
| N-31 | Oficio N° 32.228 | Oficio | No verificada | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` | Año omitido en varias citas del corpus |
| N-32 | Directiva N° 15 ChileCompra | Directiva/marco | No verificada | CM `3-resolucion-compra-convenio-marco v2.md` §3.1/§3.3; wireframe `33-intencion-gran-compra.md`; `modelo-datos/entidades-adquisiciones.md` | Plazo 10 días corridos intención Gran Compra |
| N-33 | NICSP | Directiva/marco | No verificada | `modulos/contabilidad/plan-de-trabajo-contabilidad.md`; `modulos/presupuestos/plan-de-trabajo_presupuestos.md`; `alcance-minimo-modulos-adyacentes.md`; `plan-general.md` | Marco contable; anclado a N-26 en Sector Municipal |
| N-34 | NTDEE | Directiva/marco | No verificada | `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md`; `seguridad.md`; `integracion-docdigital.md`; `principios-no-negociables.md`; `pendientes.md`; `matriz-evento-canal.md` | Norma técnica de documentos electrónicos |
| N-35 | PISEE | Directiva/marco | No verificada | `brechas-estandarizacion-ntdee-pisee.md`; `nodo-integracion-subdere.md`; `seguridad.md`; `principios-no-negociables.md`; `pendientes.md`; `glosario-siglas.md`; `2026-07-eliminacion-odoo.md` | Plataforma de interoperabilidad |
| N-36 | LOCM (acrónimo) | Directiva/marco | Verificada en fuente (vía N-02) | Mismas que N-02 | **Alias de N-02.** Preferir N-02 en altas nuevas; conservar N-36 solo por compatibilidad con el conteo §1.3 del inventario |

**Total:** 36 ítems (N-01…N-36).

### Anclas

Para enlaces markdown: `#n-01` … `#n-36` (minúsculas, guion). Ejemplo: [`N-09`](#n-09).

<a id="n-01"></a><a id="n-02"></a><a id="n-03"></a><a id="n-04"></a><a id="n-05"></a><a id="n-06"></a><a id="n-07"></a><a id="n-08"></a><a id="n-09"></a><a id="n-10"></a><a id="n-11"></a><a id="n-12"></a><a id="n-13"></a><a id="n-14"></a><a id="n-15"></a><a id="n-16"></a><a id="n-17"></a><a id="n-18"></a><a id="n-19"></a><a id="n-20"></a><a id="n-21"></a><a id="n-22"></a><a id="n-23"></a><a id="n-24"></a><a id="n-25"></a><a id="n-26"></a><a id="n-27"></a><a id="n-28"></a><a id="n-29"></a><a id="n-30"></a><a id="n-31"></a><a id="n-32"></a><a id="n-33"></a><a id="n-34"></a><a id="n-35"></a><a id="n-36"></a>

---

## 3. Verificadas según el corpus (resumen)

| ID | Hecho que el corpus declara verificado | Archivo ancla |
|---|---|---|
| N-27 | Dictamen CGR N° 60.449/2008 (y corrección de cita del levantamiento) | `modulos/presupuestos/plan-de-trabajo_presupuestos.md` |
| N-02 / N-36 | art. 65 c) LOCM (y hechos conexos en Nota-sobre-rentas; art. 24 DL 3.063 no tiene fila propia aún) | `arquitectura/decisiones/Nota-sobre-rentas.md` |

El resto de filas **no** declara verificación en fuente primaria en el texto leído al sembrar este registro. Normas citadas fuera de esta tabla (p. ej. DL 1.263, DL 3.063) deben **darse de alta** al tocarse de nuevo.

---

## 4. Mantenimiento

- Dueño documental: arquitectura / especificación (misma familia que [`catalogo-roles.md`](./catalogo-roles.md)).
- Regla Cursor: [`.cursor/rules/sgm-docs-normas.mdc`](../../../.cursor/rules/sgm-docs-normas.mdc).
- No reescribir masivamente citas históricas; al editar un archivo que cite normas, alinear forma canónica e ID y actualizar apariciones.
