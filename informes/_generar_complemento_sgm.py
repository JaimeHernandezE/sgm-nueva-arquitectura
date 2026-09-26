# -*- coding: utf-8 -*-
"""Genera el complemento del informe SGM en .docx (público no técnico)."""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, Cm


OUT = Path(__file__).resolve().parent / (
    "Complemento-informe-SGM-estado-alternativas-licitacion.docx"
)


def set_run_font(run, size=11, bold=False, italic=False):
    run.font.name = "Calibri"
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic


def add_para(doc, text, *, bold=False, italic=False, size=11, space_after=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold, italic=italic)
    return p


def add_h1(doc, text):
    p = doc.add_heading(text, level=1)
    for run in p.runs:
        set_run_font(run, size=14, bold=True)
    return p


def add_h2(doc, text):
    p = doc.add_heading(text, level=2)
    for run in p.runs:
        set_run_font(run, size=12, bold=True)
    return p


def add_bullet(doc, body, *, label=None):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if label:
        r1 = p.add_run(label)
        set_run_font(r1, bold=True)
        r2 = p.add_run(" " + body)
        set_run_font(r2)
    else:
        r = p.add_run(body)
        set_run_font(r)
    return p


def add_number(doc, text):
    p = doc.add_paragraph(style="List Number")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text)
    set_run_font(r)
    return p


def add_alt(doc, title, body):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    r1 = p.add_run(title + " ")
    set_run_font(r1, bold=True)
    r2 = p.add_run(body)
    set_run_font(r2)
    return p


def main():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(6)
    r = title.add_run(
        "Complemento al informe sobre el Sistema de Gestión Municipal (SGM)"
    )
    set_run_font(r, size=16, bold=True)

    subt = doc.add_paragraph()
    subt.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subt.paragraph_format.space_after = Pt(18)
    r = subt.add_run(
        "Estado del desarrollo, brechas, alternativas evaluadas y justificación "
        "de una nueva licitación"
    )
    set_run_font(r, size=12, italic=True)

    add_para(
        doc,
        "Documento de apoyo a la decisión. Está escrito para un público no técnico: "
        "dirección, jefatura e interlocutores institucionales. Justifica el cambio "
        "de base tecnológica por razones estructurales —qué permite o no permite "
        "Odoo como plataforma de un estándar municipal— y, a la vez, deja claro "
        "que lo realizado sobre Odoo no es una pérdida: es el insumo que hace "
        "posible especificar y licitar bien. Las cifras y citas bastan por sí "
        "solas: no se requiere acceso a otra documentación para comprenderlas.",
        italic=True,
        space_after=16,
    )

    # ----- A -----
    add_h1(
        doc,
        "A) Estado actual del SGM, lo desarrollado, lo pendiente y las brechas detectadas",
    )

    add_para(
        doc,
        "El SGM se construyó a partir de dos insumos principales: el Levantamiento de "
        "Procesos Municipales y Diseño de Plataforma de Servicios de Gestión y "
        "Administración Municipal 2024, y su Anexo 2, con 42 procesos repartidos en "
        "seis módulos iniciales —Adquisiciones, Presupuestos, Contabilidad, Tesorería, "
        "Recursos Humanos y Remuneraciones—. Siguiendo una recomendación de ese "
        "primer informe, se optó por desarrollar el sistema sobre Odoo, bajo la idea "
        "de que un ecosistema con módulos estándar de finanzas y personal permitiría "
        "menos desarrollo a medida y mayor rapidez.",
    )

    add_para(
        doc,
        "Tras la licitación, el proyecto se ejecutó durante 2025 en tres etapas: "
        "definición y planificación; dos ciclos de desarrollo con jornadas de "
        "retroalimentación de cinco municipalidades —Quilaco, Cochamó, Villarrica, "
        "María Pinto y Las Cabras—; y un piloto con capacitación del módulo de "
        "Adquisiciones.",
    )

    add_h2(doc, "Resultados obtenidos")

    add_para(
        doc,
        "El resultado fue un prototipo con gran parte de los procesos reflejados en "
        "formularios detallados. Eso permitió reconocer flujos y actores, y recibir "
        "mejoras a partir de la experiencia de las municipalidades participantes, "
        "en comparación con los sistemas que usan hoy. También dejó una base en "
        "código de propiedad de SUBDERE, a partir de la cual se pueden reconocer las "
        "relaciones entre procesos y datos. En 2026 ese contraste se profundizó "
        "revisando el código real del prototipo frente al levantamiento de procesos, "
        "no solo frente a listados de base de datos. Ese trabajo —piloto, "
        "retroalimentación municipal y contraste técnico— es precisamente lo que "
        "permite hoy saber qué reutilizar y qué no conviene volver a construir "
        "sobre la misma base.",
    )

    add_h2(doc, "Pendientes y brechas")
    add_h2(doc, "1. Formularios de registro, no un sistema integrado")

    add_para(
        doc,
        "El prototipo es, en su mayor parte, una serie de formularios de registro. "
        "No llega a comportarse como un sistema de gestión municipal que integre "
        "procesos de punta a punta —donde aprobar un paso actualiza, de forma "
        "coherente, presupuesto, contabilidad, pago u otros efectos que la norma exige.",
    )

    add_para(
        doc,
        "Una auditoría de calidad del módulo de Adquisiciones (julio 2026) documentó "
        "67 puntos de mejora, de distinta gravedad. No eran solo errores puntuales: "
        "hubo hallazgos de diseño. En particular, los puntos 66 y 67 identificaron "
        "que «Modalidad de Compra» y «Resolución de Compra» estaban modelados como "
        "un solo formulario genérico para las cuatro modalidades legales —Compra Ágil, "
        "Convenio Marco, Licitación y Trato Directo—, cuando en la práctica cada una "
        "exige campos, controles y aprobaciones propios. La misma auditoría dejó una "
        "regla de lectura que se aplicó al resto: que exista el casillero en la "
        "pantalla no significa que la conexión con el otro sistema funcione.",
    )

    add_para(
        doc,
        "El contraste módulo a módulo contra el código del prototipo refuerza ese diagnóstico:",
    )

    add_bullet(
        doc,
        "Existe un motor real de fichas por área, equilibrio entre ingresos y gastos, "
        "y la cadena de compromiso del gasto (certificado de disponibilidad, "
        "preobligación, obligación y egreso). No están resueltos, entre otros, el "
        "silencio del artículo 82 de la Ley 18.695 (Ley Orgánica Constitucional de "
        "Municipalidades), los límites del 42 % (artículo 67 de esa misma ley) y del "
        "20 % (Ley 18.883), las series históricas, Salud y Educación como entidades "
        "presupuestarias distintas, ni el acuerdo del Concejo a nivel de subtítulo e ítem.",
        label="Presupuestos.",
    )
    add_bullet(
        doc,
        "El núcleo de caja diaria, arqueo y decreto de pago es el más avanzado del "
        "prototipo, incluido un canal de recepción desde la plataforma de Servicios "
        "Municipales (SEM) de SUBDERE. Faltan el Estado Diario como documento, la "
        "anulación acotada al cierre de la jornada de caja, la conciliación bancaria "
        "auxiliar diaria, el certificado de saldos bancarios —sin el cual Contabilidad "
        "no puede cerrar— y garantías o pagos a terceros con efecto contable y plazos "
        "legales. En varios de estos casos hay pantalla o trámite, pero el sistema no "
        "cambia el estado real del negocio.",
        label="Tesorería.",
    )
    add_bullet(
        doc,
        "Hay diez procesos levantados. Un caso ilustrativo es el factoring o cesión "
        "de facturas: el flujo está descrito y una persona puede seguirlo, pero el "
        "decreto de pago no tiene forma de quedar suspendido ni de interrumpir el pago "
        "cuando corresponde. Misma lógica: hay trámite, no hay efecto de sistema.",
        label="Contabilidad.",
    )
    add_bullet(
        doc,
        "Existen liquidación de remuneraciones, escala municipal y puente hacia la "
        "contabilidad. Faltan la consulta de disponibilidad presupuestaria al contratar, "
        "el control de cupo, los validadores del 42 % y del 20 %, y una integración "
        "real con SIAPER (solo hay campos y asistentes en pantalla). Además coexisten "
        "dos catálogos distintos para el mismo concepto de «calidad jurídica».",
        label="Recursos Humanos y Remuneraciones.",
    )

    add_h2(doc, "2. Conexión con otros sistemas: incompleta y difícil de escalar")

    add_para(
        doc,
        "El prototipo llegó a conectarse de forma limitada con Clave Única (para que "
        "los funcionarios inicien sesión) y con SEM (para registrar cobros originados "
        "fuera de Tesorería). La conexión con SEM, sin embargo, no fue solo incompleta "
        "en alcance: el canal productivo creaba órdenes de ingreso y pagos sin pedir "
        "contraseña ni credencial. Es un problema de diseño de seguridad —una puerta "
        "abierta sobre dinero municipal—, no solo de «falta de integración».",
    )

    add_para(
        doc,
        "El problema mayor es de arquitectura. Cada municipio tiende a requerir "
        "configuración y llaves de acceso propias hacia sistemas externos. El costo "
        "de mantención crece de forma lineal con cada municipio que se suma —no "
        "«exponencial», pero sí insostenible a escala nacional, del orden de 345 "
        "municipios—. Durante el proyecto Odoo, informática de SUBDERE recomendó "
        "credenciales de Clave Única por municipio; esa postura no se reevaluó para "
        "un servicio nacional. En un modelo donde SUBDERE hospeda el sistema completo, "
        "las llaves institucionales pueden centralizarse: el municipio no debería "
        "gestionarlas una a una.",
    )

    add_para(
        doc,
        "El inventario de relaciones con instituciones del Estado identifica 21 "
        "conexiones relevantes (DocDigital, SIAPER, Mercado Público, FirmaGob, Clave "
        "Única, Servicio de Impuestos Internos, Contraloría, Previred, DIPRES, "
        "Tesorería General de la República, SINIM, entre otras). De ellas, solo Clave "
        "Única tiene el mecanismo confirmado por escrito por el organismo titular "
        "(Gobierno Digital, Mesa de Ayuda, 27 de enero de 2026). Las otras veinte "
        "avanzan sobre supuestos de diseño. DocDigital tiene cobertura municipal del "
        "orden del 80 % verificada, pero no está confirmado que exista una conexión "
        "automática entre sistemas. Mercado Público, en el diseño objetivo, se "
        "consulta en solo lectura; SGM no escribe en esa plataforma por un canal "
        "automático.",
    )

    add_h2(
        doc,
        "3. Odoo no permite que otros sistemas usen SGM en igualdad de condiciones "
        "sin una capa construida y mantenida a mano",
    )

    add_para(
        doc,
        "Uno de los objetivos centrales de SGM es la independencia de módulos: que "
        "un municipio pueda conservar parte de sus sistemas actuales y adoptar solo "
        "aquellos módulos de SGM que le aporten más eficiencia. Eso exige una "
        "«puerta de servicio» estable —una interfaz pública documentada, a menudo "
        "llamada API— para exportar y consumir datos de forma estandarizada. Sin "
        "esa puerta, la modularidad queda en el discurso.",
    )

    add_para(
        doc,
        "Odoo no ofrece esa puerta de servicio de forma nativa. Expone su forma "
        "interna de guardar datos, no un contrato de servicio pensado para terceros. "
        "Ya constaba antes del desarrollo, en el propio levantamiento:",
    )

    quote = doc.add_paragraph()
    quote.paragraph_format.left_indent = Cm(1)
    quote.paragraph_format.space_after = Pt(4)
    quote.paragraph_format.line_spacing = 1.15
    rq = quote.add_run(
        "«Ofrece APIs abiertas que facilitan la integración con otros sistemas, "
        "tanto internos como externos. No es una API Rest, sino que a partir de "
        "librerías (disponibles para varios lenguajes de programación) desarrollados "
        "por Odoo.»"
    )
    set_run_font(rq, italic=True)

    cite = doc.add_paragraph()
    cite.paragraph_format.left_indent = Cm(1)
    cite.paragraph_format.space_after = Pt(10)
    rc = cite.add_run(
        "— Informe 4, Levantamiento de procesos y diseño de servicio SGM, julio 2024, p. 58."
    )
    set_run_font(rc, size=10, italic=True)

    add_para(
        doc,
        "Dar igualdad de acceso —que un municipio o una empresa externa pueda usar "
        "SGM con las mismas reglas que SUBDERE, sin puertas traseras— obliga a "
        "construir una capa traductora encima de Odoo. Esa capa es deuda permanente:",
    )

    add_number(
        doc,
        "Se rompe con cada actualización de Odoo o de un complemento. Mantenerla "
        "al día no es un costo de proyecto: es un costo indefinido.",
    )
    add_number(
        doc,
        "Si queda incompleta, el dato se bifurca: lo que la capa no cubre se "
        "consume por otra vía y aparecen dos versiones de la misma información.",
    )
    add_number(
        doc,
        "Si cambia, los terceros quedan obsoletos sin aviso. Un acuerdo que se "
        "mueve cuando se mueve la implementación interna no es un acuerdo: es un "
        "reflejo. Ningún sistema externo puede depender de él con seguridad.",
    )
    add_number(
        doc,
        "Y la brecha degrada la integridad del dato municipal. Cuando la capa no "
        "alcanza, el consumidor usa el acceso directo al modelo interno, y las "
        "validaciones del sistema no se aplican por igual.",
    )

    add_para(
        doc,
        "Formulado como criterio de Estado: un estándar público no puede tener por "
        "contrato la forma interna de guardar datos de un producto privado.",
    )

    add_para(
        doc,
        "Se suma otra brecha entre módulos. Hoy, al aprobar una compra en el "
        "prototipo, presupuesto e inventario suelen actualizarse «de una sola vez» "
        "dentro de Odoo. Si los módulos deben ser independientes —para que un "
        "municipio pueda adoptar solo algunos—, hay que definir cómo no queda uno "
        "a medias cuando el otro falla. Ese mecanismo aún no está cerrado.",
    )

    # ----- B -----
    add_h1(doc, "B) Alternativas evaluadas y criterios de comparación")

    add_para(
        doc,
        "La decisión arquitectónica de julio de 2026 —revisada en agosto de 2026— "
        "evaluó tres caminos:",
    )

    add_alt(
        doc,
        "Alternativa A — Continuar corrigiendo Odoo y preparar una migración a la vez.",
        "Se descartó porque los hallazgos centrales son de diseño, no de volumen "
        "de errores: corregir formularios o ampliar el equipo no cambia el "
        "problema de fondo. Odoo no ofrece una puerta de servicio estable para "
        "terceros; seguir invirtiendo en esa base posterga el mismo límite "
        "estructural que la auditoría y el levantamiento ya dejaron en evidencia. "
        "La falta de personal, por sí sola, no es argumento para el cambio de "
        "plataforma: un cambio de stack no resuelve por sí mismo la necesidad "
        "de roles para especificar, recibir y gobernar el sistema.",
    )

    add_alt(
        doc,
        "Alternativa B — Mantener Odoo y construir encima una capa traductora "
        "propia (una API REST).",
        "Fue la opción que más lejos llegó en la discusión. Se descartó por la "
        "deuda permanente descrita en la sección A: esa capa se rompe con cada "
        "versión; si queda incompleta el dato se duplica; si cambia, los terceros "
        "quedan obsoletos; y la brecha empuja al acceso directo, debilitando las "
        "validaciones. Un estándar del Estado no puede depender de que alguien "
        "mantenga sincronizada, para siempre, una traducción del modelo interno "
        "de un producto privado.",
    )

    add_alt(
        doc,
        "Alternativa C — Licitar un sistema nuevo especificado por SUBDERE.",
        "Adoptada. Es la única que permite que las reglas de intercambio entre "
        "sistemas sean un documento de diseño versionado —propiedad del Estado—, "
        "y no un reflejo de cómo un proveedor guardó los datos por dentro. "
        "Importa subrayar el sentido de la decisión: no se licita porque «falló "
        "el personal» ni porque el piloto no aportó valor, sino porque la "
        "plataforma elegida no puede sostener, sin deuda permanente, el "
        "objetivo de modularidad e igualdad de acceso. Lo hecho en Odoo pasa "
        "a ser especificación y requisito del sistema nuevo (sección D).",
    )

    add_h2(doc, "Criterios utilizados")

    add_para(doc, "Los criterios de comparación fueron:")

    add_number(
        doc,
        "Igualdad de acceso: un municipio o una empresa externa usa SGM con las "
        "mismas reglas que SUBDERE, sin privilegios ocultos.",
    )
    add_number(
        doc,
        "El contrato de intercambio es un artefacto de diseño, no un reflejo de la "
        "estructura interna del software.",
    )
    add_number(
        doc,
        "Distinguir hallazgos de diseño estructural de un mero volumen de errores.",
    )
    add_number(
        doc,
        "Naturaleza del costo en el tiempo: deuda permanente de mantención versus "
        "costo acotado de un proyecto de especificación y desarrollo.",
    )
    add_number(
        doc,
        "Integridad del dato municipal si la capa de acceso queda incompleta.",
    )
    add_number(
        doc,
        "Independencia real de módulos (que un municipio grande pueda adoptar solo "
        "algunos y conectar el resto a sus sistemas propios).",
    )

    add_para(
        doc,
        "En un plano distinto —ya decidida la salida de Odoo— se evaluaron después "
        "familias tecnológicas para el reemplazo, según disponibilidad de "
        "profesionales en Chile, madurez para sistemas financieros y capacidad de "
        "documentar contratos de servicio. Hay dos caminos defendibles en el "
        "mercado local. Las bases no deben exigir una marca de software "
        "determinada —riesgo de impugnación por restricción de competencia bajo "
        "la Ley 19.886—, sino lo que el sistema debe cumplir, de forma verificable.",
    )

    # ----- C -----
    add_h1(
        doc,
        "C) Justificación de una nueva licitación: técnica, económica, plazos, "
        "riesgos y continuidad",
    )

    add_h2(doc, "Justificación técnica")

    add_para(
        doc,
        "El hallazgo determinante no se resuelve solo con más presupuesto: Odoo "
        "no admite, sin deuda permanente, el principio de que SUBDERE y cualquier "
        "tercero usen la misma puerta de servicio pública y documentada. El "
        "Informe 4 (julio 2024, p. 58) ya lo advertía antes del desarrollo. Los "
        "otros hallazgos —diseño genérico de modalidades de compra e "
        "integraciones declaradas pero no funcionales— refuerzan esa conclusión; "
        "no la sustituyen. El cambio de plataforma aborda ese límite "
        "estructural; no sustituye la necesidad de roles para especificar, "
        "recibir y gobernar el sistema nuevo.",
    )

    add_para(
        doc,
        "La respuesta correcta es fijar en las bases, como condiciones no negociables "
        "definidas por SUBDERE y no delegables al adjudicatario, entre otras:",
    )

    add_bullet(
        doc,
        "una puerta de servicio pública y documentada, con la especificación como "
        "fuente de verdad frente al código;",
    )
    add_bullet(
        doc,
        "el motor del sistema alojado en infraestructura de SUBDERE (con modos "
        "para municipios que solo consumen módulos, o que guardan archivos en su "
        "propia nube);",
    )
    add_bullet(
        doc,
        "componentes abiertos, sin encierro por licenciamiento propietario;",
    )
    add_bullet(
        doc,
        "cumplimiento normativo desde el diseño (entre otros, decretos de "
        "transformación digital, ciberseguridad y documentos electrónicos, y las "
        "leyes de protección de datos, compras públicas y firma electrónica);",
    )
    add_bullet(
        doc,
        "propiedad estatal del código y cláusulas de portabilidad;",
    )
    add_bullet(
        doc,
        "documentos y evidencias fuera de la base de datos de operación diaria;",
    )
    add_bullet(
        doc,
        "reglas de negocio bloqueantes aplicadas en el servidor, no solo en la pantalla;",
    )
    add_bullet(
        doc,
        "trazabilidad de cada compra como un expediente con folio único, de la "
        "solicitud al pago.",
    )

    add_h2(doc, "Justificación económica")

    add_para(
        doc,
        "La documentación técnica no contiene un presupuesto monetario de la nueva "
        "licitación (ni en UF ni en pesos). Lo que sí permite afirmar es el contraste "
        "de naturaleza de costos: mantener una capa traductora sobre Odoo es un "
        "gasto indefinido; especificar y licitar un sistema con puerta de servicio "
        "propia es un costo de proyecto, acotado en el tiempo. En ese contraste, "
        "el trabajo ya hecho sobre Odoo —levantamiento validado con municipios, "
        "piloto, auditoría y modelo de datos extraído del código— reduce el riesgo "
        "de la licitación: no se parte de cero; se parte de requisitos ya "
        "contrastados con la operación real.",
    )

    add_para(
        doc,
        "Además, si las bases reducen conexiones críticas —DocDigital, Mercado "
        "Público, FirmaGob, Servicio de Impuestos Internos, bancos— a «generar un "
        "archivo para que alguien lo cargue a mano», se compra la situación actual "
        "con una interfaz nueva: el trabajo manual que SGM debía eliminar se "
        "reintroduce.",
    )

    add_para(
        doc,
        "El instrumento para obtener precios y plazos de mercado es una consulta "
        "formal al mercado (RFI) vía Mercado Público, al amparo de la reforma a la "
        "Ley 19.886 (Ley 21.634): convocatoria pública, registro de lo conversado, "
        "sin reuniones informales que expongan el proceso a impugnaciones. SUBDERE "
        "debe llegar a esa consulta con un borrador de estándares ya escrito —qué "
        "debe cumplir el sistema y cómo se verifica—, no con página en blanco.",
    )

    add_h2(doc, "Plazos")

    add_para(
        doc,
        "La ventana documentada para licitación y desarrollo, durante la cual los "
        "cinco municipios piloto siguen operando sobre la base Odoo descartada, es "
        "de 18 a 24 meses. Aún no hay un cronograma fechado de construcción del "
        "sistema nuevo. Antes de publicar bases deben resolverse, como mínimo: la "
        "consolidación de la especificación entre módulos; la verificación de "
        "conexiones con DocDigital y SIAPER; la forma de no dejar efectos a medias "
        "entre módulos; y el alcance de inventario y activo fijo en la primera versión.",
    )

    add_h2(doc, "Riesgos")

    add_para(doc, "Los principales riesgos de conjunto son:")

    add_bullet(
        doc,
        "depender de respuestas de terceros (Gobierno Digital, Contraloría/SIAPER, "
        "ChileCompra, formatos de Contraloría y DIPRES);",
    )
    add_bullet(
        doc,
        "desalineación si se especifica módulo a módulo sin un gobierno transversal;",
    )
    add_bullet(
        doc,
        "subestimar la coordinación entre módulos cuando un mismo hecho de negocio "
        "debe producir varios efectos;",
    )
    add_bullet(
        doc,
        "dejar implícito el soporte a los municipios piloto durante la transición.",
    )

    add_h2(doc, "Continuidad del servicio para los municipios")

    add_para(
        doc,
        "Los cinco municipios piloto no quedan sin sistema: continúan sobre la base "
        "Odoo durante la transición. Lo que sí está pendiente de decisión de "
        "jefatura es el nivel de soporte en esos 18 a 24 meses: soporte pleno hasta "
        "el corte; soporte correctivo mínimo; o ausencia de compromiso formal. El "
        "objetivo original de «cinco pilotos con cinco módulos funcionando en Odoo "
        "hacia fin de 2026» queda sin vigencia en esa forma.",
    )

    # ----- D -----
    add_h1(
        doc,
        "D) Qué se reutiliza y cómo se resguarda la inversión ya realizada",
    )

    add_para(
        doc,
        "El cambio de stack no implica desechar la inversión. Lo realizado sobre "
        "Odoo se reutiliza como especificación y requisito —qué debe hacer el "
        "sistema—, no como la arquitectura de la plataforma. En ese sentido, el "
        "prototipo y la auditoría no son un fracaso a borrar: son la evidencia "
        "que permite licitar con mayor precisión:",
    )

    add_number(
        doc,
        "Los diagramas de proceso y el levantamiento de los 42 procesos en seis "
        "módulos, independientes de la herramienta de implementación.",
    )
    add_number(
        doc,
        "La ficha de auditoría de Adquisiciones (67 puntos): cada hallazgo se "
        "traduce de «error a corregir en Odoo» a «requisito que el sistema nuevo "
        "debe cumplir».",
    )
    add_number(
        doc,
        "El modelo de datos y las relaciones extraídos del código del prototipo, "
        "luego rediseñados: expediente de compra unificado, modalidades de compra "
        "separadas, cadena de compromiso presupuestario, liquidación de "
        "remuneraciones, caja como sesión con estados, entre otros.",
    )
    add_number(
        doc,
        "Las capacidades del prototipo que sí operan —equilibrio presupuestario, "
        "decreto de pago con asiento, escala remuneratoria, recepción desde SEM "
        "como semántica de ingreso externo— como requisitos candidatos, siempre "
        "contrastados con la norma y el levantamiento.",
    )
    add_number(
        doc,
        "El método de especificación ya aplicado en Adquisiciones: fichas de "
        "proceso, entidades, contratos de intercambio entre módulos y bocetos de "
        "pantalla; más parámetros normativos configurables con vigencia temporal.",
    )
    add_number(
        doc,
        "Lecciones de seguridad convertidas en exigencias de recepción: no dejar "
        "secretos en registros de sistema; cero canales de escritura sobre dinero "
        "municipal sin autenticación —incluida la lección del canal SEM—.",
    )
    add_number(
        doc,
        "Lecciones del contrato anterior: el proveedor del desarrollo original "
        "lanzó después un ERP municipal propio construido sobre el conocimiento de "
        "dominio adquirido durante el contrato con SUBDERE, en ausencia de "
        "cláusulas robustas de propiedad intelectual. Con independencia de acciones "
        "jurídicas aún por evaluar, ello fundamenta exigir propiedad estatal del "
        "código, portabilidad y una especificación pública lo bastante completa "
        "como para diluir ventajas informativas en la próxima licitación.",
    )

    add_para(
        doc,
        "No se reutiliza la forma interna de Odoo como contrato hacia terceros; el "
        "formulario único de modalidad y resolución de compra; las firmas como "
        "simples marcas en pantalla; ni el patrón de canal externo sin autenticación.",
    )

    add_para(
        doc,
        "La inversión se resguarda porque el activo que sobrevive al cambio de "
        "plataforma es el conocimiento de dominio ya financiado por el Estado, "
        "documentado y custodiado por SUBDERE. La vara de calidad es que dos "
        "equipos independientes puedan construir sistemas funcionalmente "
        "equivalentes solo con esa especificación. Así, lo gastado en "
        "levantamiento, piloto, auditoría y contraste con código no se pierde: se "
        "convierte en el insumo de las bases y en el estándar contra el cual se "
        "recibe al adjudicatario.",
        space_after=12,
    )

    doc.save(OUT)
    print(f"Escrito: {OUT}")


if __name__ == "__main__":
    main()
