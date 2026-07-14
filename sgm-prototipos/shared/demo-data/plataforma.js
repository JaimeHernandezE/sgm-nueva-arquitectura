/** Datos demo del core de plataforma (consolas SUBDERE / municipal). */

export const tenants = [
  {
    id: 't-alpha',
    name: 'Mun. Alpha',
    consumption_mode: 'hosted_full',
    status: 'active',
    enabled_modules: ['adquisiciones'],
    schema_name: 'tenant_alpha',
  },
  {
    id: 't-beta',
    name: 'Mun. Beta',
    consumption_mode: 'hosted_hybrid',
    status: 'active',
    enabled_modules: ['adquisiciones', 'presupuestos'],
    schema_name: 'tenant_beta',
  },
  {
    id: 't-gamma',
    name: 'Mun. Gamma',
    consumption_mode: 'api_a_la_carte',
    status: 'suspended',
    enabled_modules: ['adquisiciones'],
    schema_name: 'tenant_gamma',
  },
];

export const normativeParameters = [
  {
    key: 'umbral_compra_agil',
    value: '100 UTM',
    valid_from: '2026-01-01',
    status: 'activo',
    legal_reference: 'Ley 19.886 / reglamentos aplicables',
  },
  {
    key: 'umbral_toma_razon',
    value: '5000 UTM',
    valid_from: '2026-01-01',
    status: 'activo',
    legal_reference: 'Normativa Contraloría',
  },
  {
    key: 'umbral_compra_agil',
    value: '120 UTM',
    valid_from: '—',
    status: 'pending',
    legal_reference: 'Propuesta piloto 2026-H2',
    proposed_by: 'Operador SUBDERE A',
  },
];

export const apiClients = [
  {
    id: 'ac_sandbox',
    name: 'Sandbox Integradores',
    scopes: ['adquisiciones.read'],
    tenant_ids: ['t-alpha'],
    status: 'active',
  },
  {
    id: 'ac_beta_erp',
    name: 'Mun. Beta ERP',
    scopes: ['adquisiciones.read', 'adquisiciones.write'],
    tenant_ids: ['t-beta'],
    status: 'active',
  },
];

export const dmsAdapters = [
  { adapter_id: 'stub_generic', name: 'Stub DMS genérico', api_style: 'rest', version: '0.1' },
];

export const users = [
  {
    id: 'u-ana',
    run: '12.345.678-9',
    display_name: 'Ana Pérez',
    status: 'active',
    last_access: '2026-07-13',
  },
  {
    id: 'u-luis',
    run: '9.876.543-2',
    display_name: 'Luis Soto',
    status: 'suspended',
    last_access: '2026-06-01',
  },
  {
    id: 'u-maria',
    run: '15.111.222-3',
    display_name: 'María López',
    status: 'active',
    last_access: '2026-07-12',
  },
];

export const organizationalUnits = [
  {
    id: 'ou-fin',
    kind: 'department',
    name: 'Finanzas',
    parent_id: null,
    source: 'template',
  },
  {
    id: 'ou-abas',
    kind: 'unit',
    name: 'Abastecimiento',
    parent_id: 'ou-fin',
    source: 'template',
  },
  {
    id: 'ou-presup',
    kind: 'unit',
    name: 'Presupuestos',
    parent_id: 'ou-fin',
    source: 'template',
  },
  {
    id: 'ou-teso',
    kind: 'unit',
    name: 'Tesorería',
    parent_id: 'ou-fin',
    source: 'template',
  },
  {
    id: 'ou-obras',
    kind: 'department',
    name: 'Dirección de Obras Municipales',
    parent_id: null,
    source: 'template',
  },
  {
    id: 'ou-transito',
    kind: 'department',
    name: 'Tránsito',
    parent_id: null,
    source: 'template',
  },
];

export const catalogRoles = [
  {
    code: 'adq.solicitante',
    name: 'Solicitante',
    module: 'adquisiciones',
    process_area: 'adq.solped',
  },
  {
    code: 'adq.aprobador_unidad',
    name: 'Aprobador de unidad',
    module: 'adquisiciones',
    process_area: 'adq.solped',
  },
  {
    code: 'adq.formulador_presupuesto',
    name: 'Formulador DAF / verificación',
    module: 'adquisiciones',
    process_area: 'adq.solped',
  },
  {
    code: 'adq.firmante_cdp',
    name: 'Firmante CDP',
    module: 'adquisiciones',
    process_area: 'adq.solped',
  },
  {
    code: 'adq.gestor_compra',
    name: 'Gestor de compra',
    module: 'adquisiciones',
    process_area: 'adq.modalidad',
  },
  {
    code: 'adq.aprobador_modalidad',
    name: 'Aprobador de modalidad',
    module: 'adquisiciones',
    process_area: 'adq.modalidad',
  },
  {
    code: 'adq.recepcionista',
    name: 'Recepcionista',
    module: 'adquisiciones',
    process_area: 'adq.recepcion',
  },
  {
    code: 'adq.confirmante_recepcion',
    name: 'Confirmante de recepción',
    module: 'adquisiciones',
    process_area: 'adq.recepcion',
  },
  {
    code: 'adq.operador_pago',
    name: 'Operador de pago',
    module: 'adquisiciones',
    process_area: 'adq.pago',
  },
  {
    code: 'adq.lector',
    name: 'Lector de expediente',
    module: 'adquisiciones',
    process_area: 'adq',
  },
  {
    code: 'plat.admin_municipal',
    name: 'Administrador municipal',
    module: 'plataforma',
    process_area: 'plat.municipal',
  },
];

/** Nodos del árbol «Por módulo/proceso» (Adquisiciones). */
export const processTreeAdq = [
  { id: 'adq.solped', label: '1. SOLPED' },
  { id: 'adq.modalidad', label: '2. Modalidad' },
  { id: 'adq.resolucion', label: '3. Resolución / OC' },
  { id: 'adq.recepcion', label: '4. Recepción' },
  { id: 'adq.pago', label: '5. Pago' },
];

export const roleAssignments = [
  {
    user_id: 'u-ana',
    user_name: 'Ana Pérez',
    role: 'adq.aprobador_unidad',
    process_area: 'adq.solped',
    department: 'Finanzas',
    unit: 'Abastecimiento',
    node_label: 'Finanzas › Abastecimiento',
    valid_from: '2026-01-01',
    valid_until: '—',
  },
  {
    user_id: 'u-ana',
    user_name: 'Ana Pérez',
    role: 'adq.gestor_compra',
    process_area: 'adq.modalidad',
    department: 'Finanzas',
    unit: 'Abastecimiento',
    node_label: 'Finanzas › Abastecimiento',
    valid_from: '2026-01-01',
    valid_until: '—',
  },
  {
    user_id: 'u-maria',
    user_name: 'María López',
    role: 'adq.formulador_presupuesto',
    process_area: 'adq.solped',
    department: 'Finanzas',
    unit: 'Presupuestos',
    node_label: 'Finanzas › Presupuestos',
    valid_from: '2026-01-01',
    valid_until: '—',
  },
  {
    user_id: 'u-luis',
    user_name: 'Luis Soto',
    role: 'adq.solicitante',
    process_area: 'adq.solped',
    department: 'Dirección de Obras Municipales',
    unit: '(el departamento)',
    node_label: 'Dirección de Obras Municipales',
    valid_from: '2026-01-01',
    valid_until: '—',
  },
];

export const delegations = [
  {
    titular: 'Ana Pérez',
    subrogante: 'Luis Soto',
    valid_from: '2026-07-01',
    valid_until: '2026-07-15',
  },
];

export const sodExceptions = [
  {
    user_name: 'Ana Pérez',
    rule: 'adq.formulador_presupuesto ≠ adq.firmante_cdp',
    reason: 'Auditoría excepcional Q2',
    valid_until: '2026-12-31',
  },
];

export const tenantParameters = [
  { key: 'perfil_recepcion', value: 'estricto', platform_default: 'estándar' },
  { key: 'visto_bueno_pre_oc', value: 'true', platform_default: 'false' },
  { key: 'timer_escalamiento_horas', value: '48', platform_default: '72' },
];

export const tenantIntegrations = [
  { provider_id: 'mercado_publico', enabled: true, params: 'organismo: 1234' },
  { provider_id: 'firma_gob', enabled: true, params: '(defaults plataforma)' },
  { provider_id: 'sii', enabled: true, params: '—' },
];

export const tenantStorage = {
  storage_backend: 'platform',
  bucket_name: 'sgm-tenant-alpha',
  bucket_region: 'us-east-1',
  bucket_endpoint: '',
  adapter_id: 'stub_generic',
  base_url: '',
  repository_id: '',
};

export const auditRecords = [
  {
    timestamp: '2026-07-14 10:41',
    actor_id: 'u-12',
    action: 'tenant.suspend',
    resource: 'tenant/Gamma',
    payload_summary: 'status → suspended',
  },
  {
    timestamp: '2026-07-14 09:02',
    actor_id: 'u-03',
    action: 'api_client.revoke',
    resource: 'ac_99',
    payload_summary: 'revoked_at set',
  },
];

export const modeLabels = {
  hosted_full: 'hosted_full',
  hosted_hybrid: 'hosted_hybrid',
  api_a_la_carte: 'api_a_la_carte',
};
