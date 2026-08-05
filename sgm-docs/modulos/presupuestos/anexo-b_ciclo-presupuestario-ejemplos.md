# Anexo B — Ciclo presupuestario completo: dos ejemplos trabajados

**Documento complementario de** [`plan-de-trabajo_presupuestos.md`](plan-de-trabajo_presupuestos.md) v0.16
**Propósito:** ilustrar el modelo de D-5 y D-6 sobre dos casos de distinta complejidad, y exponer los vacíos que los ejemplos revelan.
**Estado:** borrador. Los montos y el municipio son ficticios; los códigos de cuenta y la mecánica no.

---

## B.0 Municipio de referencia y convenciones

Los cinco municipios en convenio usan convenciones distintas (§5.3). Para que los ejemplos sean legibles hay que fijar una, y **decir cuál**:

- **Área de gestión:** catálogo nacional, seis valores. No negociable.
- **Código de programa:** área en el primer dígito más secuencia, sin colisiones entre áreas. Es la convención de Villarrica y Quilaco.
- **Profundidad:** variable por rama, según D-5.

Árbol de gestión 2026, extracto de las dos ramas usadas:

```
Área 1 · GESTIÓN INTERNA
└── Programa 11 · DIRECCIÓN DE TRÁNSITO Y TRANSPORTE PÚBLICO     ← hoja, profundidad 2
    Programa 12 · DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS
    Programa 13 · JUZGADO DE POLICÍA LOCAL

Área 4 · PROGRAMAS SOCIALES
└── Programa 41 · ADULTO MAYOR
    └── Subprograma 1 · ENVEJECIMIENTO ACTIVO
        └── Proyecto 3 · COCINA PARA LA EDAD DORADA
            ├── Actividad 1 · TALLERES MENSUALES DE COCINA        ← hoja, profundidad 5
            ├── Actividad 2 · FERIA GASTRONÓMICA DEL ADULTO MAYOR ← hoja, profundidad 5
            └── Actividad 3 · CEREMONIA DE CIERRE                 ← hoja, profundidad 5
```

Dos ramas del mismo municipio, con profundidad 2 y 5. Es exactamente lo que D-5 permite y lo que cinco columnas fijas obligarían a rellenar con placeholders.

**`materialized_path`:** `1.11` para Tránsito; `4.41.1.3.1` para los talleres.

---

# CASO A — Insumos de oficina, Dirección de Tránsito

El caso simple: una unidad de Gestión Interna, una cuenta, un nodo de profundidad 2.

## A.1 Formulación — agosto a septiembre 2025

### Paso 1 · Convocatoria (`BudgetCall`)

La DAF abre la formulación el 1 de agosto de 2025, con plazo al 5 de septiembre. La convocatoria no es un correo: es una entidad con plazo, instrucciones y destinatarios, y su ausencia es una de las brechas detectadas en §3.3.

Junto con la convocatoria, cada unidad recibe **su serie histórica** (requisito de 26.2.4, sin cobertura en Odoo — P-11):

| Cuenta | 2023 ejecutado | 2024 ejecutado | 2025 ene–jun |
|---|---|---|---|
| `215-22-04-001` Materiales de Oficina | $3.780.000 | $4.215.000 | $2.410.000 |

Proyección lineal 2025: ~$4.820.000.

### Paso 2 · Ficha de la unidad (`BudgetSheet`)

Tránsito completa su ficha. **La unidad declara necesidad, no clasificación.** Pide $5.200.000, con la justificación de que el proceso de permisos de circulación 2026 suma dos puntos de atención.

Distribución mensual — deliberadamente **no lineal**, que es el punto de tener distribución mensual:

| Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 200 | 900 | 1.400 | 300 | 300 | 300 | 300 | 400 | 300 | 300 | 250 | 250 |

*(miles de pesos; el peak de febrero–marzo es el proceso de permisos de circulación)*

### Paso 3 · Clasificación

La DAF traduce la necesidad a imputación:

| | |
|---|---|
| **Cuenta** | `215-22-04-001-000-000` · Materiales de Oficina |
| **Nodo de gestión** | `1.11` · Gestión Interna › Dirección de Tránsito |
| **Monto** | $5.200.000 |

Esto produce **una** `BudgetLine`.

> **Vacío detectado.** D-6 establece que la autoridad de imputación reside en el CDP, para la ejecución. **No dice quién clasifica en la formulación.** En Odoo lo hace la unidad al llenar la ficha; el mismo argumento de competencia funcional sugiere que debería hacerlo la DAF, o que la unidad propone y la DAF valida. El plan no lo resuelve. Ver §B.3, hallazgo 5.

### Paso 4 · Consolidación, Concejo y decreto

- Validador de equilibrio ingresos/egresos, bloqueante antes de enviar al Concejo.
- Acto de Alcaldía, distinto de la consolidación técnica (brecha de §3.3).
- Presentación al Concejo en la primera semana de octubre; pronunciamiento antes del 15 de diciembre. **El Concejo aprueba el presupuesto entero** (art. 65 a); el atributo `requires_council_agreement` por cuenta (§4.1) gobierna las *modificaciones*, no la aprobación inicial.
- Decreto alcaldicio, tramitado en DocDigital (D-4). Folio oficial externo.
- `ExerciseOpening` al 1 de enero: la línea queda ejecutable.

## A.2 Estado inicial de la línea

| Concepto | Monto |
|---|---|
| Presupuesto inicial | $5.200.000 |
| Presupuesto vigente | $5.200.000 |
| Obligado | $0 |
| Devengado | $0 |
| Pagado | $0 |
| **Disponible** | **$5.200.000** |

## A.3 Ejecución durante 2026

### Marzo · Primera compra

**SOLPED.** La jefa de Tránsito solicita resmas, tóner y artículos de escritorio por $1.850.000.

Los campos de imputación de la SOLPED son **opcionales y no vinculantes** (D-6). Ella los conoce y los usa:

```
propuesta_cuenta        : 215-22-04-001-000-000
propuesta_nodo_gestion  : 1.11
propósito (texto libre) : "Reposición de insumos para el proceso de
                           permisos de circulación 2026"
```

El sistema valida la **forma** —nodo hoja vigente, cuenta `DETALLE` del ejercicio— y nada más. No evalúa el criterio.

**CDP.** La DAF confirma la imputación propuesta y emite el certificado. El CDP es el acto que constituye la imputación: la reserva ocurre contra la línea `22-04-001 × 1.11`.

| Concepto | Monto |
|---|---|
| Vigente | $5.200.000 |
| **Obligado** | **$1.850.000** |
| Disponible | $3.350.000 |

**Compra ágil → orden de compra → recepción conforme → devengo.** La recepción conforme dispara el devengo presupuestario. El monto real es $1.812.400, menor que el CDP.

| Concepto | Monto |
|---|---|
| Obligado | $1.812.400 |
| **Devengado** | **$1.812.400** |
| Disponible | $3.387.600 |

El saldo no usado del CDP —$37.600— se libera. La regla de tolerancia entre CDP, obligación y devengo es **P-7**, aún abierto; el default propuesto es obligación ≤ saldo de CDP, con exceso bloqueante.

**Devengo dual.** El mismo hecho produce dos efectos: el presupuestario, propiedad de Presupuestos, y el patrimonial, propiedad de Contabilidad. La contracuenta del asiento **no se calcula: se consulta** en la tabla de correspondencia por (ejercicio, área, cuenta) descrita en §5.4. La atomicidad entre ambos efectos es el problema canónico C-1.

**Pago.** Tesorería cierra la cadena. Presupuestos consume el evento sin poseer el proceso — patrón de etapa observada.

### Julio · Un caso de divergencia

Tránsito solicita tóner para la impresora del Juzgado de Policía Local, e imputa por costumbre a su propio nodo `1.11`.

La DAF corrige: el gasto corresponde al nodo `1.13` · Juzgado de Policía Local.

```
propuesto  : 22-04-001 × 1.11
resuelto   : 22-04-001 × 1.13
```

**La divergencia se conserva** (D-6). No es un error a corregir y olvidar: es la señal que alimenta la pre-sugerencia de imputación de P-23. Si Tránsito propone mal el mismo caso cinco veces, el sistema puede sugerir `1.13` la sexta.

### Septiembre · Modificación presupuestaria

La línea se agota. Se requieren $1.500.000 adicionales, que se reasignan desde `22-04-010` Materiales para Mantenimiento, subejecutada.

La ruta depende del atributo por cuenta (§4.1):

- Si **ninguna** de las dos cuentas está marcada en el Manual de Imputaciones → decreto alcaldicio, sin Concejo.
- Si **alguna** lo está → acuerdo del Concejo previo, con posibilidad de rechazo (a diferencia del presupuesto anual, proceso 27 sí tiene `Fin Rechazo`).

En cualquier caso el decreto se tramita en DocDigital y el `presupuesto_vigente` cambia; el `presupuesto_inicial` **no**. Ambos se reportan por separado al BEP durante todo el ejercicio (§6.1).

| Concepto | Monto |
|---|---|
| Inicial | $5.200.000 |
| **Vigente** | **$6.700.000** |

### Diciembre · Cierre

- Saldo **no devengado**: se pierde. No se arrastra.
- Devengado **no pagado**: pasa a **Deuda Flotante** en la apertura del ejercicio siguiente.
- El BEP exige informar `deuda_exigible`, de modo que `ExerciseOpening` no es opcional (§6.1).

---

# CASO B — Cocina para la Edad Dorada, DIDECO

El caso complejo: cinco niveles, cinco cuentas, financiamiento externo y una pregunta de modelado que el plan no tenía resuelta.

## B.1 La pregunta previa: ¿diez actividades son diez nodos?

DIDECO declara diez actividades a lo largo del año. **No son diez nodos del árbol.**

> **El nivel `ACTIVITY` es una categoría de imputación, no una ocurrencia en el tiempo.**
> Si el mismo taller se repite ocho veces, es **un** nodo con ocho ejecuciones.
> Si son actividades distintas con presupuesto propio, son nodos distintos.

Desagregando las diez:

| Lo que DIDECO declara | Modelado |
|---|---|
| 8 talleres mensuales de cocina, marzo a octubre | **1 nodo**, 8 ejecuciones |
| 1 feria gastronómica, noviembre | 1 nodo |
| 1 ceremonia de cierre, diciembre | 1 nodo |

Resultado: **tres nodos hoja**, no diez.

Confundirlos infla el árbol, obliga a mantener nodos que solo existen una vez, y hace que la comparación interanual sea imposible porque los nodos cambian de nombre cada año. Es el mismo problema que Las Cabras tiene hoy con `VINCULOS ACOMPAÑAMIENTO 19` y `CONVENIO HABITABILIDAD 2024`, donde el ejercicio está embebido en el nombre del nodo (P-24).

## B.2 Formulación

### La ficha produce una matriz, no una línea

DIDECO presenta **una** ficha. La ficha genera **doce** `BudgetLine`, una por cada par cuenta × nodo con monto:

| Cuenta | Talleres `4.41.1.3.1` | Feria `4.41.1.3.2` | Cierre `4.41.1.3.3` | Total |
|---|---:|---:|---:|---:|
| `215-21-03-001-001` Honorarios suma alzada | 3.200.000 | — | — | 3.200.000 |
| `215-22-01-001` Alimentos y bebidas · Para personas | 2.400.000 | 1.800.000 | 600.000 | 4.800.000 |
| `215-22-04-999` Materiales de uso o consumo · Otros | 800.000 | 400.000 | — | 1.200.000 |
| `215-22-08-999` Servicios generales · Otros | — | 900.000 | 300.000 | 1.200.000 |
| `215-29-04-001` Mobiliario | 1.500.000 | — | — | 1.500.000 |
| **Total** | **7.900.000** | **3.100.000** | **900.000** | **11.900.000** |

> **La ficha no es la línea.** Una ficha es el instrumento de formulación de una unidad; la línea es la unidad de imputación y de control. Diez fichas pueden producir cero líneas nuevas si todas imputan a cuentas y nodos existentes, y una ficha puede producir docenas.

Nota sobre `215-29-04-001` Mobiliario: la compra de mesones y menaje es **activo no financiero**, no gasto corriente. En Villarrica la tabla de contracuentas tiene una columna específica `Cta_Devengado_activo_fijo` (§5.4) — el asiento contable de esta línea es distinto al de las demás, y eso es dato de configuración, no lógica.

### El financiamiento externo va por el otro eje

El programa recibe $6.000.000 vía convenio con SENAMA. Ese ingreso se imputa a una cuenta `115`, y **las cuentas de ingreso no llevan nodo de gestión** — 0 de 840 filas en los cinco municipios (§5.3).

¿Cómo se traza entonces que ese ingreso financia este programa? **Por la apertura local del sexto nivel de la cuenta**, que es precisamente para lo que los municipios la usan:

```
115-05-03-XXX-XXX-014   "Convenio SENAMA — Adulto Mayor 2026"
```

Es exactamente el patrón observado en Quilaco, cuyo plan de cuentas tiene `FONDO MINERO`, `FONDOS FET` y hasta iniciativas nominadas como `REPARACIONES ESCUELA G-1085` y `VEREDAS LONCORUCA` abiertas en el nivel 5 de cuentas de ingreso.

> **Consecuencia de diseño.** La trazabilidad ingreso ↔ gasto de un convenio **no se resuelve en el eje de gestión**, sino en el eje de la cuenta. Cualquier reporte de rendición de convenio tiene que cruzar los dos ejes: la cuenta de ingreso con apertura local nominada, contra el conjunto de nodos de gestión del programa. No hay un identificador único de convenio que una ambos lados. Ver §B.3, hallazgo 3.

### Límite de personal

Los honorarios de la monitora ($3.200.000, cuenta `21-03-001-001`) entran en la base de cálculo del **20%** del art. 2 de la Ley 18.883, según el cuadro de Componentes Remuneratorios (P-10). El validador es bloqueante en formulación; el momento de evaluación en ejecución está abierto.

## B.3 Ejecución

### Mayo · Una SOLPED, dos cuentas, un nodo

DIDECO solicita insumos para el taller de mayo: ingredientes ($240.000) y delantales desechables ($50.000).

Son **dos cuentas distintas** —`22-01-001` y `22-04-999`— sobre **un solo nodo** `4.41.1.3.1`.

Esto fija el nivel al que vive cada eje dentro de la solicitud:

> **La cuenta es de la línea; el nodo de gestión es de la solicitud.**
>
> La cuenta responde a *qué se compra*, y eso varía ítem por ítem: ingredientes y delantales no clasifican igual.
> El nodo responde a *para qué se pide*, y eso es único por solicitud: ambos ítems son para el mismo taller.

| Nivel | Campo | Cardinalidad |
|---|---|---|
| `PurchaseRequest` | `management_node_id` | **uno** por solicitud |
| `PurchaseRequestLine` | `budget_account_id` | **uno por línea** |

**Consecuencia sobre el CDP.** El certificado tiene una línea por cuenta distinta, todas contra el mismo nodo: aquí dos líneas. No es un monto único contra una sola `BudgetLine`, pero tampoco un producto cartesiano de cuentas y nodos.

**Consecuencia sobre el flujo.** Una SOLPED **no puede servir a dos programas**. Si DIDECO necesita insumos para el taller y para la feria en la misma compra, son dos solicitudes. Es una restricción deliberada: mantiene el expediente legible y hace que la imputación del nodo sea una sola decisión de la DAF, no una por línea.

> **A verificar (P-28).** El caso que tensiona la regla es la **compra centralizada**: bodega municipal adquiere resmas para todo el municipio y las distribuye. Ahí el nodo sería el de abastecimiento, no el de cada dirección receptora, y la distribución posterior no queda trazada presupuestariamente. Es coherente con que Villarrica tenga `BODEGA MUNICIPAL` como subprograma propio, pero hay que confirmarlo con los municipios antes de cerrar la regla.

### Julio · Honorarios: otra puerta de entrada, por exclusión legal

El pago mensual de la monitora **no pasa por Adquisiciones**, y no por convención interna: el **art. 3 letra a) de la Ley 19.886** excluye de su aplicación las contrataciones de personal de la Administración del Estado regidas por estatutos especiales y **los contratos a honorarios celebrados con personas naturales**, cualquiera sea la fuente legal en que se sustenten.

> **Ninguna solicitud de personal pasa por Adquisiciones.** Honorarios, contrata, planta, cometidos, trabajos extraordinarios: todo el subtítulo 21 entra a la cadena de compromiso por RRHH.

Es el contrato bidireccional **R-1** del plan, y este ejemplo muestra por qué es bloqueante: si la línea de honorarios está agotada, la contratación no puede cursarse.

*Fundamento verificado en fuente secundaria; corresponde confirmarlo en el texto consolidado de LeyChile antes de usarlo como `legal_reference`, según el criterio metodológico de §4.2 del plan.*

### Octubre · La reasignación que el plan no cubre

La feria de noviembre va a costar más de lo previsto. DIDECO propone mover $500.000 desde `Talleres` hacia `Feria`, **dentro de la misma cuenta** `22-01-001`.

Efecto sobre cada eje:

| | Antes | Después |
|---|---|---|
| Cuenta `22-01-001`, monto total | $4.800.000 | $4.800.000 — **sin cambio** |
| Área 4 en el BEP | igual | igual — **sin cambio** |
| Nodo `4.41.1.3.1` Talleres | $2.400.000 | $1.900.000 |
| Nodo `4.41.1.3.2` Feria | $1.800.000 | $2.300.000 |

**Ni el clasificador ni el reporte externo registran nada.** El atributo `requires_council_agreement` (§4.1) está definido *por cuenta*, y aquí ninguna cuenta cambia de monto.

Pero el art. 82 exige que el Concejo apruebe presupuestos **por programa**, y lo que cambió es precisamente la distribución programática.

> **Vacío normativo.** ¿Una reasignación entre nodos de gestión con la misma cuenta es una modificación presupuestaria? El criterio del Manual de Imputaciones no responde, porque está construido sobre cuentas. Ver §B.4, hallazgo 4.

### Diciembre · Cierre del proyecto

- La ceremonia se ejecuta con $780.000 de $900.000. Se pierden $120.000.
- Dos talleres se suspendieron; el saldo de honorarios no devengado se pierde.
- El mobiliario se recepcionó en abril y se pagó en mayo: cerrado.
- **El nodo `4.41.1.3` Cocina para la Edad Dorada continúa en 2027** si el programa se repite. `superseded_by` enlaza la versión 2026 con la 2027 (P-24). Lo que **no** debe ocurrir es que nazca un nodo llamado `COCINA EDAD DORADA 2027`.

---

## B.4 Lo que los dos ejemplos revelan

### 1. La ficha no es la línea

Tránsito: una ficha → una línea. DIDECO: una ficha → doce líneas. El modelo debe tratarlas como entidades distintas con cardinalidad N:M, no como vistas de lo mismo. `BudgetSheet` es formulación; `BudgetLine` es control.

### 2. `ACTIVITY` es categoría, no ocurrencia

Ocho talleres son un nodo con ocho ejecuciones, no ocho nodos. Sin esta regla explícita en la especificación, los municipios inflarán el árbol y perderán comparabilidad interanual. **Debe incorporarse como invariante en P-21.**

### 3. La trazabilidad de convenios cruza los dos ejes y no tiene identificador común

El ingreso del convenio se traza por apertura local de la cuenta `115`; el gasto se traza por el nodo de gestión. No hay una entidad que una ambos lados. Cualquier rendición a la entidad convenante exige reconstruir la relación a mano. **Candidato a pendiente nuevo.**

### 4. Reasignar entre nodos con la misma cuenta es un vacío

No cambia el clasificador, no cambia el BEP, no lo captura el atributo `requires_council_agreement` — pero sí cambia la distribución programática que el Concejo aprobó. El criterio de §4.1 está construido enteramente sobre cuentas y no tiene nada que decir sobre el eje de gestión. **Candidato a pendiente nuevo, con consulta a Contraloría por vía GP-4.**

### 5. D-6 no cubre la formulación

D-6 resuelve quién imputa en la **ejecución**: la DAF, en el CDP. No dice quién clasifica la **ficha**. El mismo argumento de competencia funcional aplica, pero la conclusión no es obvia: en formulación la unidad sí conoce el destino del gasto, y obligar a la DAF a clasificar 40 fichas en tres semanas es un cuello de botella peor que el de la ejecución. **Debe resolverse antes de las fichas de MP-1 en F3.**

### 6. La profundidad asimétrica no es un caso borde

Ambas ramas son del mismo municipio, del mismo ejercicio: `1.11` con dos niveles y `4.41.1.3.1` con cinco. Cualquier pantalla, reporte o contrato que asuma profundidad fija falla en uno de los dos. Es el argumento de D-5 en su forma más concreta.

### 7. La cadena de compromiso tiene más de una puerta de entrada, y la separación es legal

Adquisiciones para bienes y servicios; **RRHH para todo el subtítulo 21**. No es una división de conveniencia: el art. 3 letra a) de la Ley 19.886 excluye expresamente las contrataciones de personal y los contratos a honorarios de su ámbito de aplicación.

`CommitmentChain` no puede asumir origen único, y el contrato R-1 no es un caso secundario del contrato con Adquisiciones sino uno paralelo, con la misma criticidad y un fundamento normativo propio.

### 8. Los dos ejes viven en niveles distintos de la solicitud

La cuenta es de la línea, el nodo es de la solicitud. Es la consecuencia práctica más inmediata de D-5 y D-6 sobre el contrato con Adquisiciones, y determina la forma del CDP: una línea por cuenta distinta, todas contra el mismo nodo.

---

## B.5 Resumen del ciclo en una vista

```
FORMULACIÓN (ago–sep 2025)
  BudgetCall ──► BudgetSheet por unidad ──► clasificación ──► BudgetLine
                 (+ serie histórica)         (cuenta × nodo)   (N por ficha)

GOBERNANZA (oct–dic 2025)
  Consolidación ──► Acto de Alcaldía ──► Concejo (≤15 dic) ──► Decreto (DocDigital)
       │                                        │
       └─ validador I/E bloqueante              └─ silencio art. 82: rige lo propuesto

APERTURA (1 ene 2026)
  ExerciseOpening ──► disponibilidad + ingresos por percibir + Deuda Flotante

EJECUCIÓN (todo 2026)
  SOLPED ──► CDP ──► preobligación ──► obligación ──► devengo ──► pago
  (Adq)      (DAF     └── imputación resuelta aquí ──┘    │        (Tesorería)
   o RRHH     clasifica)                                  └─► asiento (Contabilidad)

  MODIFICACIÓN ──► ¿requires_council_agreement? ──► Concejo o decreto
                   (atributo por cuenta; el eje de gestión es un vacío)

CIERRE (31 dic 2026)
  no devengado ──► se pierde
  devengado no pagado ──► Deuda Flotante 2027
  nodos de gestión ──► arrastre con superseded_by
```