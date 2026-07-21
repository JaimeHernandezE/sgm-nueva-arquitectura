/** Demo data for sub-paso 1.0 — Inventario + catálogo CM (sin backend). */

export const inventoryDemoItems = [
  {
    id: 'inv-papel',
    name: 'Resma papel carta',
    keywords: ['papel', 'resma', 'oficina', 'carta'],
    warehouse: 'Bodega Central',
    availableQuantity: 120,
    unit: 'Un',
  },
  {
    id: 'inv-toner',
    name: 'Toner láser negro HP 85A',
    keywords: ['toner', 'impresora', 'hp', 'consumible'],
    warehouse: 'Bodega Informática',
    availableQuantity: 18,
    unit: 'Un',
  },
  {
    id: 'inv-guantes',
    name: 'Guantes de seguridad talla M',
    keywords: ['guantes', 'seguridad', 'epp'],
    warehouse: 'Bodega Obras',
    availableQuantity: 45,
    unit: 'Par',
  },
];

export const cmCatalogDemoItems = [
  {
    id: 'cm-papel',
    name: 'Resma papel carta 500 hojas',
    keywords: ['papel', 'resma', 'oficina', 'carta'],
    agreementId: 'CM-2024-OFICINA',
    agreementLabel: 'Convenio Marco — Artículos de oficina',
    catalogPrice: 4200,
    providerCount: 3,
    itemCode: 'CM-OF-PAP-001',
  },
  {
    id: 'cm-notebook',
    name: 'Notebook 14" i5 16GB',
    keywords: ['notebook', 'laptop', 'computador', 'pc'],
    agreementId: 'CM-2025-TI',
    agreementLabel: 'Convenio Marco — Equipamiento TI',
    catalogPrice: 589990,
    providerCount: 5,
    itemCode: 'CM-TI-NB-014',
  },
  {
    id: 'cm-silla',
    name: 'Silla ergonómica oficina',
    keywords: ['silla', 'ergonómica', 'mobiliario'],
    agreementId: 'CM-2024-MOB',
    agreementLabel: 'Convenio Marco — Mobiliario',
    catalogPrice: 189990,
    providerCount: 4,
    itemCode: 'CM-MOB-SIL-02',
  },
  {
    id: 'cm-pintura',
    name: 'Pintura demarcación vial amarilla',
    keywords: ['pintura', 'demarcación', 'vial', 'tránsito'],
    agreementId: 'CM-2023-VIAL',
    agreementLabel: 'Convenio Marco — Señalética y vial',
    catalogPrice: 28500,
    providerCount: 2,
    itemCode: 'CM-VIAL-PIN-01',
  },
];

function matchesKeywords(item, q) {
  if (!q) return false;
  const hay = [item.name, ...(item.keywords || [])].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

/** Simula checkStockAvailability (asesora). */
export function searchInventory(q) {
  return inventoryDemoItems.filter((item) => matchesKeywords(item, q));
}

/** Simula checkCatalogAvailability (catálogo CM espejado). */
export function searchCmCatalog(q) {
  return cmCatalogDemoItems.filter((item) => matchesKeywords(item, q));
}

export function formatClp(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n);
}
