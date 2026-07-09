# Sandbox de desarrolladores SGM

> Documento operativo — arquitectura / ecosistema
> Estado: borrador (julio 2026). Cierra el detalle de **[P-16]**.
> Marco estratégico: [`entregable-licitacion.md`](./entregable-licitacion.md) §5.
> Formato de fixtures: [`estandares-api.md`](./estandares-api.md) Parte II §14.

---

## 1. Propósito

El sandbox es el **entorno público de integración** del SGM. Permite a municipios en modo à la carte, integradores y empresas del ecosistema desarrollar y demostrar consumidores **sin convenio de producción**, con la garantía de que el contrato es el mismo que en producción.

**Paridad obligatoria:** mismos endpoints, esquemas y códigos de error que OpenAPI publicada. No existen rutas ni campos exclusivos del sandbox.

---

## 2. URL y disponibilidad

| Atributo | Valor de referencia |
|---|---|
| URL base API | `https://sandbox.api.sgm.example/v1` |
| Portal desarrollador | `https://developers.sgm.example` |
| Disponibilidad objetivo | ≥ 95% mensual (menor que producción; publicado en portal) |
| Ventana de mantenimiento | Domingos 02:00–06:00 CLT, anunciada con 48 h |

**[P-03]** Hasta resolver multitenancy, el tenant demo viaja en el token JWT (`tenant_id` claim).

---

## 3. Acceso y credenciales

### 3.1 Plano M2M (integradores)

1. Registro self-service en el portal desarrollador (sin convenio previo).
2. Emisión automática de `ApiClient` de sandbox vía `POST /api-clients` del core (scope `sandbox`).
3. Scopes iniciales: `adquisiciones.read`, `adquisiciones.write` (subset del módulo piloto).
4. Rotación y revocación self-service.

### 3.2 Plano personas (pruebas UI)

- Usuarios demo con RUN ficticios (formato válido pero no real).
- Clave Única: stub del sandbox que acepta credenciales publicadas en el portal (solo entorno demo).

### 3.3 Puente a producción

Procedimiento formal documentado en convenio tipo (**[P-15]**): solicitud, revisión de scopes, emisión de credenciales productivas. El sandbox no es un atajo a producción.

---

## 4. Tenants y datos

| Tenant ID | Uso |
|---|---|
| `municipio-demo-norte` | Fixtures CA y CM (`ADQ-2026-00123`, `ADQ-2026-00089`) |
| `municipio-demo-sur` | Fixtures LP y TD (`ADQ-2026-00045`, `ADQ-2026-00012`) |

**Política de datos:**

- 100% sintéticos (Ley 21.719). Prohibido cargar datos reales de municipios.
- **Reset:** `nightly` — todos los tenants demo vuelven al estado sembrado por fixtures.
- Namespaces opcionales por desarrollador (futuro): sub-tenant efímero con TTL 24 h.

---

## 5. Stubs de dependencias externas

| Dependencia | Comportamiento en sandbox |
|---|---|
| Mercado Público | Stub `readMpProcess` con estados predecibles por `mp_process_id` documentado en fixtures |
| FirmaGob | Firma siempre exitosa salvo header `X-Sandbox-Signature: reject` |
| Presupuestos | Saldo configurable por fixture; escenario `BUDGET_UNAVAILABLE` en `escenarios-transaccionales.yaml` |
| Contabilidad | Acepta devengados; latencia simulada ≤ 200 ms |
| Tesorería | Ejecuta pagos demo; sin transferencia real |
| SII / UTM | Valor UTM fijo del mes de referencia en catálogo de fixtures |

Los módulos consumen las mismas interfaces que en producción; solo cambia el proveedor detrás del contrato.

---

## 6. Portal de desarrollador

Contenido mínimo exigible en recepción:

1. OpenAPI navegable (Adquisiciones + core subset).
2. Guía «Primeros 15 minutos»: token → `GET /procurement-cases/ADQ-2026-00123` → interpretar timeline.
3. Catálogo de fixtures con enlaces a `modulos/adquisiciones/fixtures/catalogo.md`.
4. Referencia a errores estructurados (`estandares-api.md` Parte I §3).
5. Política de rate limits: 300 req/min por `ApiClient` sandbox.

---

## 7. Fixtures y recepción

Los fixtures en `modulos/<módulo>/fixtures/` son **casos de prueba oficiales**:

- **Terceros:** tutorial ejecutable.
- **SUBDERE:** la contraparte técnica reproduce cada operación canónica del fixture contra el ambiente de recepción del adjudicatario y verifica `{b}` conforme a OpenAPI (`estandares-api.md` Parte II §14.3). Cumple o no cumple.

Piloto Adquisiciones: cuatro expedientes demo + `escenarios-transaccionales.yaml`.

---

## 8. Entornos relacionados

| Entorno | Relación con sandbox |
|---|---|
| **Staging** | No público; recepción SUBDERE; datos alta fidelidad; sin reset nightly |
| **Producción** | Credenciales vía convenio P-15; datos reales |

---

## 9. Referencias

- [`entregable-licitacion.md`](./entregable-licitacion.md)
- [`estandares-api.md`](./estandares-api.md)
- [`plataforma-core.md`](./plataforma-core.md)
- [`plataforma/contracts.md`](../plataforma/contracts.md)
- [`modulos/adquisiciones/fixtures/catalogo.md`](../modulos/adquisiciones/fixtures/catalogo.md)
