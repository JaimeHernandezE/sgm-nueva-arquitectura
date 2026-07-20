# Contrato API-first: punto de partida

> Documento de trabajo — arquitectura / contratos
> Estado: borrador metodológico. Define cómo se empieza a construir el contrato API-first del nuevo SGM, usando Compra Ágil (Adquisiciones) como piloto.
> Pendientes registrados en [`pendientes.md`](../decisiones/pendientes.md).

---

## 1. El mandato API (regla formal)

Regla única, sin excepciones, que debe ir textual en las bases:

> **Cada módulo expone un contrato de entrada/salida versionado. Ningún módulo accede a datos o funcionalidad de otro módulo salvo a través de ese contrato.**

Prohibiciones derivadas:
- Sin queries directas entre módulos.
- Sin tablas compartidas entre módulos.
- Sin llamadas internas no publicadas: si el frontend base o un módulo hermano necesita algo, existe en el contrato o no existe.

**Verificabilidad en recepción (criterio de aceptación):** cada módulo debe pasar sus pruebas de integración consumiendo únicamente los contratos publicados de los demás módulos, con las bases de datos del resto inaccesibles. Cumple o no cumple; no hay "está integrado" difuso.

## 2. Dependencias como interfaces, no como llamadas

Un módulo no depende de otro módulo: depende de un **contrato de proveedor** que otro sistema puede satisfacer. Ejemplo canónico:

> Adquisiciones no llama a "Presupuestos de SGM". Adquisiciones declara: *"requiero un proveedor de disponibilidad presupuestaria que responda este contrato"*. Ese proveedor puede ser el módulo Presupuestos de SGM (municipio en hosting completo) o un adaptador contra el sistema presupuestario propio del municipio (modo à la carte, arquetipo Lo Barnechea/Oracle).

Esto es lo que hace viable el consumo de módulos individuales. Sin esta inversión, "solo Adquisiciones vía API" es un monolito con marketing.

### Integraciones transversales y documentos (core obligatorio)

Distinto de los proveedores de **negocio** intercambiables (Presupuestos, Contabilidad…), las integraciones con **terceros transversales** y el **almacenamiento de archivos** se resuelven siempre en el core (`plataforma/contracts.md`, `plataforma-core.md` §7–§7bis):

- **C7/C9:** Mercado Público, FirmaGob, SII — el módulo declara la operación que necesita; el core implementa el adaptador y custodia secretos por tenant.
- **C10:** documentos — el módulo guarda `DocumentRef` opaco; subida/descarga vía `storeDocument` / `getDownloadUrl`. Prohibido BLOB en BD del módulo o clientes S3/DMS en código de módulo.

En fichas de proceso, la contraparte de estos bordes es `Core (<proveedor>)` o `Core (documentos)`, no el tercero ni el módulo como implementador.

## 3. Estructura del contrato por módulo (`contracts.md`)

Cada módulo en `sgm-docs/modulos/<modulo>/` incorpora un archivo `contracts.md` con cuatro secciones fijas:

### 3.1 Entidades que expone
Entidades del dominio visibles fuera del borde del módulo, con esquema (campos, tipos, obligatoriedad, validaciones). Nomenclatura técnica en inglés (convención ya adoptada: `PurchaseRequest`, `BudgetCommitment`, etc.). Toda entidad que cruza el borde del módulo es candidata a payload de API.

### 3.2 Operaciones que ofrece
Endpoints con verbo, ruta, payload de entrada, respuesta, códigos de error posibles y reglas de negocio que valida (con clasificación bloqueante/asesora y ancla normativa cuando aplique).

### 3.3 Dependencias que requiere
Contratos de proveedor que el módulo necesita del exterior, expresados como interfaces: qué operación, con qué entrada, qué respuesta espera, y qué hace el módulo si el proveedor no responde o rechaza.

### 3.4 Eventos que emite
Hechos de dominio que otros módulos o sistemas pueden querer observar (p. ej. `PurchaseOrderIssued`, `GoodsReceiptConfirmed`), con esquema del evento. **[PENDIENTE P-05]** Definir mecanismo de entrega (webhooks, cola, polling) — decisión de arquitectura, no de contrato funcional; por ahora solo se cataloga qué eventos existen.

## 4. Estándares transversales del contrato

Los estándares transversales (OpenAPI como fuente de verdad, versionamiento y deprecación, esquema de errores, paginación, idempotencia, multitenancy en el contrato) se especifican una sola vez en [`estandares-api.md`](./estandares-api.md). Los `contracts.md` de cada módulo los referencian; ningún documento los duplica.

## 5. Autenticación y autorización

Dos planos distintos, ambos exigibles en las bases:

| Plano | Mecanismo | Uso |
|---|---|---|
| Personas | Clave Única | Usuarios municipales operando vía frontend |
| Sistemas | OAuth2 client credentials (o equivalente) | Sistemas municipales consumiendo módulos M2M, con **scopes por módulo y por municipio** |

**[PENDIENTE P-02]** El plano M2M no existe en el diseño actual; especificarlo es prerequisito del modo à la carte.

## 6. Piloto: Compra Ágil

Método para el primer `contracts.md`, aprovechando el macroproceso ya documentado (SOLPED → Pago, **17 sub-pasos**, 15 entidades):

1. Recorrer los 17 sub-pasos identificando **qué cruza el borde de Adquisiciones**. Primeros cruces conocidos:
   - Disponibilidad presupuestaria → contrato de proveedor hacia Presupuestos.
   - Devengado / recepción conforme → contrato hacia Contabilidad.
   - Firma de documentos → operaciones del **core** (`requestSignature`, `confirmSignature` vía C9 / `plataforma/contracts.md`), no adaptador en Adquisiciones.
   - Mercado Público → **solo lectura** vía **core C7**; deep links como navegación; evento `MpStateChanged`.
   - Adjuntos (resoluciones, CDP escaneado, recepción) → **`DocumentRef`** del core C10 (`storeDocument` antes de la operación de negocio).
   - UTM / referencia de precios → **core C9** (`getUtmValue`, `getPriceReference`).
2. Para cada entidad expuesta que cruza el borde: derivar su esquema de payload desde la ficha de flujo ya existente.
3. Catalogar eventos emitidos por sub-paso.
4. Redactar el `contracts.md` de Adquisiciones y someterlo a la prueba de calidad de Etapa 1: **dos equipos independientes deberían poder construir consumidores equivalentes solo desde el contrato.**
5. Replicar el método en las otras 3 modalidades de compra y luego en los demás módulos.

## 7. Convergencia con el trabajo ya hecho

El modelo entidad-relación y las fichas de flujo de Compra Ágil son la materia prima directa de los contratos: la especificación funcional y la arquitectónica convergen si se escriben con la lente de bordes de módulo. Los 67 ítems de QA aportan además el catálogo de reglas de validación (bloqueantes/asesoras) que las operaciones del contrato deben declarar.

## 8. Próximos pasos concretos

1. ~~Crear `sgm-docs/arquitectura/especificacion/estandares-api.md`~~ — **hecho**, ver [`estandares-api.md`](./estandares-api.md).
2. Crear `sgm-docs/modulos/adquisiciones/contracts.md` con la plantilla de la sección 3. *(Hecho — piloto Compra Ágil.)*
3. Ejecutar el recorrido de los 17 sub-pasos de Compra Ágil (sesión de trabajo dedicada). *(Hecho — bordes §3.5 en fichas.)*
4. Resolver los pendientes estructurales antes del primer contrato definitivo: multitenancy en el contrato (**P-03**), plano M2M (**P-02**), política de deprecación (**P-04**).
