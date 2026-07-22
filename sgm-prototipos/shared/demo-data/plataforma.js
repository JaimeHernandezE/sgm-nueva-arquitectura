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

/** Notificaciones demo (C6) — bandeja / campanita. */
export const notifications = [
  {
    id: 'n-001',
    module: 'Adquisiciones',
    kind: 'action_required',
    title: 'Firmar CDP — ADQ-2026-00045',
    body: 'Debes firmar el certificado de disponibilidad presupuestaria para continuar la SOLPED.',
    source_event_type: 'BudgetAvailabilityCertificateIssued',
    resource_type: 'ProcurementCase',
    resource_id: 'ADQ-2026-00045',
    deep_link: 'modulos/adquisiciones/procesos-transversales/14-emision-cdp.html?expediente=ADQ-2026-00045',
    cta_label: 'Ir a firmar',
    created_at: '2026-07-22T09:12:00',
    age_label: 'hace 12m',
    read: false,
  },
  {
    id: 'n-002',
    module: 'Adquisiciones',
    kind: 'info',
    title: 'OC aceptada — proveedor ACME',
    body: 'Tu compra fue confirmada. Proveedor ACME SpA; entrega estimada según OC.',
    source_event_type: 'PurchaseOrderAccepted',
    resource_type: 'ProcurementCase',
    resource_id: 'ADQ-2026-00123',
    deep_link: 'modulos/adquisiciones/00-expediente/?expediente=ADQ-2026-00123',
    cta_label: 'Abrir expediente',
    created_at: '2026-07-22T08:01:00',
    age_label: 'hace 1h',
    read: false,
  },
  {
    id: 'n-003',
    module: 'Adquisiciones',
    kind: 'action_required',
    title: 'Modalidad pendiente de aprobación',
    body: 'La decisión de modalidad del expediente ADQ-2026-00089 espera tu visto bueno.',
    source_event_type: 'ProcurementModalityConfirmed',
    resource_type: 'ProcurementCase',
    resource_id: 'ADQ-2026-00089',
    deep_link: 'modulos/adquisiciones/procesos-transversales/22-aprobacion-jefatura.html?expediente=ADQ-2026-00089',
    cta_label: 'Ir a actuar',
    created_at: '2026-07-21T16:40:00',
    age_label: 'ayer',
    read: true,
  },
  {
    id: 'n-004',
    module: 'Adquisiciones',
    kind: 'action_required',
    title: 'Confirmar recepción — OC vinculada',
    body: 'Hay bienes pendientes de recepción conforme.',
    source_event_type: 'PurchaseOrderAccepted',
    resource_type: 'ProcurementCase',
    resource_id: 'ADQ-2026-00142',
    deep_link: 'modulos/adquisiciones/procesos-transversales/41-recepcion-conforme.html?expediente=ADQ-2026-00142',
    cta_label: 'Ir a recepción',
    created_at: '2026-07-21T11:00:00',
    age_label: 'ayer',
    read: false,
  },
  {
    id: 'n-005',
    module: 'Plataforma',
    kind: 'info',
    title: 'Cliente M2M revocado',
    body: 'Se revocó el cliente ac_99. Revisa integraciones si aplica.',
    source_event_type: 'ApiClientRevoked',
    resource_type: 'ApiClient',
    resource_id: 'ac_99',
    deep_link: 'plataforma/subdere/03-clientes-m2m.html',
    cta_label: 'Ver clientes M2M',
    created_at: '2026-07-14T09:02:00',
    age_label: 'hace 8d',
    read: true,
  },
  {
    id: 'n-006',
    module: 'Adquisiciones',
    kind: 'deadline',
    title: 'Plazo de cotización próximo a vencer',
    body: 'Quedan 2 días hábiles para el cierre del período de cotización.',
    source_event_type: 'MpStateChanged',
    resource_type: 'ProcurementCase',
    resource_id: 'ADQ-2026-00201',
    deep_link: 'modulos/adquisiciones/1-compra-agil/31-periodo-cotizacion.html?expediente=ADQ-2026-00201',
    cta_label: 'Ver cotización',
    created_at: '2026-07-20T10:00:00',
    age_label: 'hace 2d',
    read: true,
  },
];

export const notificationPreferences = {
  email_enabled: true,
  email_for_info: true,
  email_for_deadline: true,
  email_digest_daily: false,
  quiet_hours_start: '20:00',
  quiet_hours_end: '08:00',
  quiet_weekends: true,
};

export const tenantNotificationPolicy = {
  mandatory_email_kinds: ['action_required'],
  mandatory_email_event_types: ['PurchaseOrderRejected', 'ProcurementProcessFailed'],
};

/**
 * Espejo demo de getCurrentUser enriquecido (ficha Mis datos).
 * @param {{ id?: string, run?: string }} sessionUser
 */
export function getDemoCurrentUserProfile(sessionUser = {}) {
  const user =
    users.find((u) => u.id === sessionUser.id) ||
    users.find((u) => u.run === sessionUser.run) ||
    users.find((u) => u.display_name === sessionUser.display_name) ||
    users[0];

  const roleByCode = Object.fromEntries(catalogRoles.map((r) => [r.code, r]));
  const assignments = roleAssignments
    .filter((a) => a.user_id === user.id)
    .map((a) => {
      const role = roleByCode[a.role] || { code: a.role, name: a.role, module: '—' };
      return {
        ...a,
        role_code: role.code,
        role_name: role.name,
        role_module: role.module,
        node_label: a.node_label,
        department: a.department,
        unit: a.unit,
        valid_from: a.valid_from,
        valid_until: a.valid_until,
      };
    });

  return { user, assignments };
}

export const modeLabels = {
  hosted_full: 'hosted_full',
  hosted_hybrid: 'hosted_hybrid',
  api_a_la_carte: 'api_a_la_carte',
};
