/** Etapa 3 específica de Trato Directo. */
export default {
  version: 1,
  module: 'adquisiciones',
  modality: 'trato-directo',
  description: 'Etapa 3 específica de Trato Directo (OC aceptada → compromiso cierto).',
  expedienteShell: 'modulos/adquisiciones/00-expediente/index.html',
  contract: 'sgm-docs/modulos/adquisiciones/contracts.md',
  steps: [
    {
      stepId: '3.1',
      stageName: 'Resolución de Compra',
      stepName: 'Emisión de OC y aceptación del proveedor',
      processFicha: 'sgm-docs/modulos/adquisiciones/4. trato-directo/3-resolucion-compra.md',
      prototypeHtml: 'modulos/adquisiciones/4-trato-directo/31-emision-aceptacion-oc.html',
      formPath: '../4-trato-directo/31-emision-aceptacion-oc.html',
      operations: [],
      origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
    },
    {
      stepId: '3.2',
      stageName: 'Resolución de Compra',
      stepName: 'Registrar Compromiso Cierto',
      processFicha: 'sgm-docs/modulos/adquisiciones/4. trato-directo/3-resolucion-compra.md',
      prototypeHtml: 'modulos/adquisiciones/4-trato-directo/32-compromiso-cierto.html',
      formPath: '../4-trato-directo/32-compromiso-cierto.html',
      operations: ['commitBudget'],
      origin: { kind: 'module', label: 'Presupuestos', mode: 'dependencia' },
    },
  ],
};
