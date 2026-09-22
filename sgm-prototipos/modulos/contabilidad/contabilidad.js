"use strict";
const TODAY = '2026-09-21';
const KEY = 'sgm-conta-proto-v5';
let NOW = TODAY;
const R = {
  sol:'Unidad administradora del servicio', pre:'Presupuesto / SECPLAN', daf:'DAF', 
  ext:'Módulo Adquisiciones · Tesorería · SII (externo)', con:'Contabilidad', tes:'Tesorería', alc:'Alcaldía',
  rev:'Revisor', emi:'Unidad emisora de ingresos', adm:'Administrador contable'
};
/* Adquisiciones vive en el mismo sitio: enlaces internos y datos demo compartidos */
const ADQ = '../adquisiciones/';
let ADQ_DATA = { expedientes: [], presets: {} };
const adqPath = path => !path ? 'index.html' : path.endsWith('/') ? path + 'index.html' : /\.html(\?|$)/.test(path) ? path : path + '.html';
/* Si index.html entrega siteUrl() del shell, los enlaces siguen la misma convención del sitio
   (con o sin .html según app-shell.js); si no, se usan rutas relativas con .html. */
const adqUrl = (path, folio) => { const q = folio ? '?expediente=' + encodeURIComponent(folio) : ''; return ADQ_DATA.siteUrl ? ADQ_DATA.siteUrl('modulos/adquisiciones/' + adqPath(path) + q) : ADQ + adqPath(path) + q; };
const extLink = (label, url) => `<a class="ext" href="${url}">${label} →</a>`;
const adqInfo = folio => ADQ_DATA.expedientes.find(e => e.id === folio) || null;
function adqLink(folio, label){
  const e = adqInfo(folio);
  if(e && e.fullDetail) return extLink(label || ('Abrir ' + folio + ' en Adquisiciones'), adqUrl('00-expediente/', folio));
  if(e) return extLink(label || ('Ver ' + folio + ' en el listado de Adquisiciones'), adqUrl('01-listado-expedientes.html'));
  return extLink(label || 'Ver un expediente de ejemplo en Adquisiciones', adqUrl('00-expediente/', 'ADQ-2026-00123'));
}
function stepBefore(a, b){ const pa=String(a).split('.').map(Number), pb=String(b).split('.').map(Number); return pa[0]<pb[0] || (pa[0]===pb[0] && (pa[1]||0)<(pb[1]||0)); }
const FOLIO_PRES = {'ADQ-2026-00123':'22.04.001','ADQ-2026-00012':'22.04.010','ADQ-2026-00089':'29.04','ADQ-2026-00142':'29.06.001'};
function adqPrefill(folio){
  const e = adqInfo(folio) || adqInfo('ADQ-2026-00123') || {};
  const pr = (ADQ_DATA.presets||{})[e.id] || {};
  const info = pr.recepcion?.ocInfo || '';
  const oc = (info.split('·')[0]||'').trim();
  const prov = (info.match(/Proveedor:\s*([^·]+)/)||[])[1]?.trim() || '';
  return { pres: FOLIO_PRES[e.id] || '22.04.001', folio: e.id || folio, glosa: e.title || '', modalidad: e.modality || 'Compra Ágil', unidad: e.department || '', monto: e.awardedAmount ?? e.requestedAmount ?? 0, oc: /^\d/.test(oc) ? oc : '', proveedor: prov, factura: '', step: e.currentStep ? e.currentStep.id + ' ' + e.currentStep.name : '' };
}
const RSHORT = {sol:'Unidad', pre:'Presupuesto', daf:'DAF', ext:'Adq./Tes. (ext.)', con:'Contabilidad', tes:'Tesorería', alc:'Alcaldía', rev:'Revisor', emi:'Unidad emisora', adm:'Admin. contable'};

const fmt = n => '$' + Math.round(n||0).toLocaleString('es-CL');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fdate = d => d ? d.split('-').reverse().join('-') : '';
const pad = (n,w=4) => String(n).padStart(w,'0');

/* ---------- Supuestos (vacíos de los diagramas resueltos para el prototipo) ---------- */
const SUP = {
  S1:{t:'Ingreso percibido', src:'Ingreso devengado e Ingreso Percibido (página 2 vacía)', p:'Tesorería registra el pago de una orden con CID confirmado, indicando medio de pago. El sistema genera el Comprobante de Ingreso Percibido (CIP): Debe Banco / Haber Cuenta por cobrar; suma al percibido presupuestario y crea el movimiento en el libro banco.'},
  S2:{t:'Pago y egreso pagado', src:'Los flujos de obligaciones terminan en "Decreto de pago"', p:'En compras, el decreto (5.3) y el pago (5.4, Tesorería) los orquesta Adquisiciones; Contabilidad recibe el evento de pago completado y registra el egreso pagado: Debe Cuenta por pagar / Haber Banco (la "cuenta contra egreso pagado" configurada). En servicios sin OC, Tesorería paga dentro de este prototipo con el mismo asiento.'},
  S3:{t:'Matriz de asientos', src:'02- Registro Egreso devengado (único ejemplo: 2152205006 Telefonía celular)', p:'Devengo de gasto: Debe cuenta de gasto o de activo (la "contra egreso devengado") / Haber Cuenta por pagar 215.xx. El ejemplo del diagrama usa 11103 Bancos como contra devengado; aquí se reinterpreta como cuenta de gasto y debe validarse con un contador municipal. Los códigos patrimoniales son ilustrativos.'},
  S4:{t:'Sin saldo en servicios sin OC', src:'Obligaciones sin OC ("Solicitar Modificación o Suplemento" sin continuación)', p:'Presupuesto solicita la modificación o suplemento; al registrarse aprobada aumenta el vigente y se reintenta la imputación. En compras, el caso equivalente lo resuelve Adquisiciones en 1.4 (solicitar financiamiento a DAF).', res:{t:'Compras: Adquisiciones 1.4', url:'procesos-transversales/16-solicitar-financiamiento', folio:'ADQ-2026-00142'}},
  S5:{t:'Preobligación y compromiso', src:'Registro de preobligación (registra la "preobligación (compromiso cierto)" después de la adjudicación)', p:'Resuelto por Adquisiciones: la preobligación se genera en 1.6 (tras el CDP) y el compromiso cierto en 3.4, al aceptarse la OC. Contabilidad no registra ninguno de los dos; solo recibe el devengado.', res:{t:'Adquisiciones 1.6 y 3.4', url:'procesos-transversales/15-preobligacion', folio:'ADQ-2026-00123'}},
  S6:{t:'OC rechazada por el proveedor', src:'Registro de obligaciones ("Notificar a Unidad / Re-evaluar" sin continuación)', p:'Resuelto por Adquisiciones en 3.5 (rechazo de la OC) y 3.6 (proceso desierto o fallido).', res:{t:'Adquisiciones 3.5', url:'1-compra-agil/35-rechazo-oc', folio:'ADQ-2026-00123'}},
  S7:{t:'Recepción con observaciones', src:'Recepción conforme e inventario (conexiones ambiguas desde "Acta de observaciones")', p:'Resuelto por Adquisiciones en 4.5, "Recepción no conforme" (devolución, reposición o incumplimiento). Nada rechazado se devenga.', res:{t:'Adquisiciones 4.5 (sin pantalla aún)', url:'00-expediente/', folio:'ADQ-2026-00123'}},
  S8:{t:'Rechazo de DTE', src:'Registro de obligaciones y Obligaciones sin OC', p:'Sin OC: el reclamo se registra en el SII dentro de 8 días corridos (Ley 19.983) y el expediente termina como rechazado. Con OC, Adquisiciones define que el circuito de la factura pertenece a Tesorería y que el cruce de 3 vías (5.1) bloquea el devengado si la factura no calza.'},
  S9:{t:'Compromiso en obligaciones sin OC', src:'Obligaciones sin OC', p:'En servicios básicos y arriendos, el compromiso se registra en el mismo acto de imputación (no hay CDP ni OC previos) y el devengado se registra luego con el CED.'},
  S10:{t:'Condición del factoring', src:'Factoring 2 (rombo "X / Decidir" sin etiquetas)', p:'La condición es "¿la factura fue cedida y notificada en el registro de cesiones del SII?". Si no, sigue el pago regular; si sí, se suspende el pago y se rehace el decreto a nombre del cesionario.'},
  S11:{t:'Reglas de conciliación', src:'Conciliación bancaria (dos "Revisar y Autorizar")', p:'Primero revisa un Revisor y luego autoriza DAF. El cruce es por monto y sentido; las diferencias se presentan como partidas conciliatorias estándar (cheques girados no cobrados, depósitos en tránsito, cargos y abonos bancarios no contabilizados).'},
  S12:{t:'CID con aprobación manual', src:'Ingreso devengado (la rama "NO" no dice si genera comprobante)', p:'Si la generación automática está desactivada, Contabilidad revisa la orden y al aprobarla el sistema genera el CID con el mismo correlativo.'},
  S13:{t:'Alta de activo fijo', src:'Recepción conforme e inventario · Adquisiciones 4.3 (registerInventoryEntry, sin dueño definido: X-44)', p:'Adquisiciones marca el bien como inventariable; Contabilidad (MC-3) da el alta del activo al registrar el devengado. Subtítulo 29 = activo; subtítulo 22 = gasto del período.'}
};

/* ---------- Etapas ---------- */
function presOf(cod){ return S.pres.find(p => p.cod === cod); }
function presIngOf(cod){ return S.presIng.find(p => p.cod === cod); }
function saldo(p){ return p.vig - p.preob - p.comp; }
function cxpOf(pres){ return S.cuentas.find(c => c.pres === pres); }
function ctaName(cod){ const all=[...S.cuentas,...S.ctaDeb,...S.bancos,...S.ctaIng]; const c=all.find(x=>x.cod===cod); return c?c.nombre:cod; }
function nextSeq(k){ return ++S.seq[k]; }
function hist(x, txt, rol){ x.hist.unshift({f:NOW, rol, txt}); }
function cur(x){ return x.stages[x.idx]; }
function advance(x){ x.idx++; if (x.idx >= x.stages.length) x.idx = x.stages.length; }

function asiento(glosa, ref, lineas, estado){
  const a = {n:'A-'+pad(nextSeq('as'),5), fecha:NOW, glosa, ref, lineas, estado: estado||'Contabilizado'};
  S.asientos.unshift(a); return a;
}
function movBanco(tipo, monto, medio, glosa, ref){
  S.movs.unshift({id:'MB-'+nextSeq('mov'), fecha:NOW, cta:'111.02', tipo, monto, medio, glosa, ref});
}

function registrarDevengoCED(x){
  const c = cxpOf(x.pres);
  if (!c || !c.dev) {
    const e = new Error('La cuenta ' + (c?c.cod:x.pres) + ' no tiene configurada cuenta de egreso devengado.');
    e.config = c ? c.cod : null; throw e;
  }
  const benef = x.proveedor ? x.proveedor.nombre : '';
  const a = asiento('Egreso devengado — ' + x.glosa, x.id, [
    {cta:c.dev, debe:x.monto, haber:0, aux:''},
    {cta:c.cod, debe:0, haber:x.monto, aux:benef}
  ], 'Borrador');
  x.docs.ced = {n:'CED-2026-'+pad(nextSeq('ced')), estado:'Borrador', asiento:a.n};
}

const STG = {
  /* ===== Obligaciones que llegan desde Adquisiciones ===== */
  ced:{label:'Crear egreso devengado (CED)', rol:'con', src:'02- Registro Egreso devengado · contrato recordAccrual de Adquisiciones (4.4 / 5.2)', sup:['S3'],
    desc:'Contabilidad crea el comprobante de egreso devengado a partir de la solicitud (de Adquisiciones o del expediente sin OC). El sistema exige que la cuenta tenga configurada su cuenta de egreso devengado.',
    info:x=>{ const c=cxpOf(x.pres); return `<div class="small muted">Cuenta afectada: <span class="mono">${esc(c?.cod)}</span> ${esc(c?.nombre)} · contra egreso devengado: <span class="mono">${esc(c?.dev||'— sin configurar —')}</span></div>`; },
    actions:x=>[{label:'Crear egreso devengado', run:()=>{ registrarDevengoCED(x); return x.docs.ced.n+' creado en estado Borrador.'; }}]},
  ced_conf:{label:'Revisar, cuadrar y confirmar el CED', rol:'con', src:'02- Registro Egreso devengado',
    desc:'Se revisa el asiento (debe, haber, beneficiario), se valida la factura y la recepción, y se cambia el estado a CONFIRMADO.',
    info:x=>{ const a=S.asientos.find(a=>a.n===x.docs.ced?.asiento); return a?asientoHTML(a):''; },
    fields:x=>[{id:'c1',label:'Asiento cuadrado (debe = haber) y beneficiario correcto',type:'check'},{id:'c2',label:x.tipo==='oc'?'Cruce de 3 vías conforme en Adquisiciones (OC + recepción + factura)':'Factura y V°B° del servicio validados',type:'check'}],
    actions:x=>[{label:'Cambiar estado a CONFIRMADO', run:v=>{ if(!v.c1||!v.c2) throw new Error('Marca las dos verificaciones antes de confirmar.'); const a=S.asientos.find(a=>a.n===x.docs.ced.asiento); a.estado='Contabilizado'; x.docs.ced.estado='Confirmado'; presOf(x.pres).dev+=x.monto; if(x.tipo==='oc'){ x.docs.ced.ref=a.n; return x.docs.ced.n+' confirmado. Se responde a Adquisiciones con accounting_entry_ref = '+a.n+' (evento AccrualRecorded).'; } return x.docs.ced.n+' confirmado. Devengado registrado.'; }}]},
  nicsp:{label:'Alta de activo fijo', rol:'con', src:'Adquisiciones 4.3 (bien inventariable) → Contabilidad MC-3', sup:['S13'],
    desc:'Adquisiciones marcó el bien como inventariable. Contabilidad da el alta del activo en el mismo hecho del devengado.',
    fields:x=>[{id:'trat',label:'Tratamiento contable',type:'select',opts:['Activo — alta en inventario','Gasto del período'],def:'Activo — alta en inventario'}],
    actions:x=>[{label:'Registrar alta', run:v=>{ const act=(v.trat||'').startsWith('Activo'); x.docs.nicsp={trat:act?'Activo':'Gasto'}; if(act){ const code='INV-2026-'+pad(nextSeq('inv')); S.inventario.unshift({code, desc:x.glosa, valor:x.monto, fecha:NOW, ref:x.id, cta:cxpOf(x.pres)?.dev||''}); x.docs.nicsp.inv=code; return 'Alta en inventario '+code+'.'; } return 'Clasificado como gasto del período.'; }}]},
  adq_pago:{label:'Decreto y pago en Adquisiciones / Tesorería', rol:'ext', src:'Adquisiciones 5.3 (decreto, DocDigital) y 5.4 (executePayment, Tesorería)', sup:['S2','S10'],
    desc:'Adquisiciones genera el decreto de pago y Tesorería ejecuta el pago. Contabilidad espera el evento de pago completado. Si la factura aparece cedida en el Registro del SII, Contabilidad debe ordenar la suspensión antes del pago (factoring).',
    info:x=>`<div class="small">${adqLink(x.adq?.folio)}</div>`,
    actions:x=>[{label:'Simular: pago completado (PaymentCompleted)', run:()=>{ x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.proveedor.nombre, estado:'Firmado (DocDigital)'}; x.docs.pagoEvt={medio:'Transferencia'}; return 'Adquisiciones emitió '+x.docs.dp.n+' y Tesorería pagó. Llega el evento de pago completado.'; }}]},
  pag_reg:{label:'Registrar egreso pagado', rol:'con', src:'Contrato Tesorería → Contabilidad (pago que genera el egreso pagado)', sup:['S2'],
    desc:'Con el pago informado por Tesorería, Contabilidad registra el egreso pagado y el movimiento del libro banco.',
    actions:x=>[{label:'Registrar egreso pagado', run:()=>pagar(x, x.docs.pagoEvt?.medio||'Transferencia', x.proveedor.nombre)}]},
  dp:{label:'Elaborar decreto de pago', rol:'con', src:'Registro de obligaciones · Factoring', sup:['S10'],
    desc:'Se elabora el decreto de pago a favor del proveedor. Si la factura fue cedida, usa "Registrar cesión".',
    actions:x=>[{label:'Elaborar decreto de pago', run:()=>{ x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.proveedor.nombre, estado:'Elaborado'}; return 'Decreto '+x.docs.dp.n+' elaborado.'; }}]},
  dp_firma:{label:'Firmar decreto de pago', rol:'alc', src:'Factoring 2 · Registro de obligaciones',
    desc:'Alcaldía firma el decreto de pago.',
    actions:x=>[{label:'Firmar decreto', run:()=>{ x.docs.dp.estado='Firmado'; return 'Decreto '+x.docs.dp.n+' firmado.'; }}]},
  pago:{label:'Pagar', rol:'tes', src:'Supuesto (flujo no dibujado)', sup:['S2'],
    desc:'Tesorería paga al beneficiario del decreto. Se registra el egreso pagado y el movimiento en el libro banco.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Transferencia','Cheque'],def:'Transferencia'}],
    actions:x=>[{label:'Registrar pago', run:v=>pagar(x, v.medio||'Transferencia', x.proveedor.nombre)}]},

  /* ===== Factoring ===== */
  f_susp:{label:'Ordenar suspensión del pago', rol:'con', src:'Factoring 2 · plan Contabilidad MC-7 (orden de suspensión a Tesorería)', sup:['S10'],
    desc:'La factura aparece cedida en el Registro del SII. Contabilidad ordena a Tesorería suspender el pago al proveedor original.',
    actions:x=>[{label:'Enviar orden de suspensión a Tesorería', run:()=>{ if(x.docs.dp) x.docs.dp.estado='Suspendido'; return 'Orden de suspensión enviada. Pago al proveedor original suspendido.'; }}]},
  f_dec:{label:'Elaborar decreto alcaldicio de cesión', rol:'daf', src:'Factoring 2',
    desc:'DAF elabora el decreto que toma conocimiento de la cesión del crédito al cesionario.',
    actions:x=>[{label:'Elaborar decreto de cesión', run:()=>{ x.docs.cesion.decreto='D.A. '+nextSeq('dec')+'/2026'; return 'Decreto de cesión elaborado.'; }}]},
  f_firma:{label:'Firmar decreto de cesión', rol:'alc', src:'Factoring 2',
    desc:'Alcaldía firma el decreto de cesión.',
    actions:x=>[{label:'Firmar', run:()=>{ x.docs.cesion.firmado=true; return 'Decreto de cesión firmado.'; }}]},
  f_rehacer:{label:'Rehacer decreto de pago al cesionario', rol:'daf', src:'Factoring 2',
    desc:'Se anula el decreto de pago original (si existía) y se elabora uno nuevo a nombre del cesionario.',
    actions:x=>[{label:'Elaborar nuevo decreto', run:()=>{ if(x.docs.dp) x.docs.dpAnulado=x.docs.dp.n; x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.docs.cesion.cesionario, estado:'Elaborado'}; return 'Decreto '+x.docs.dp.n+' a nombre de '+x.docs.cesion.cesionario+'.'; }}]},
  f_firma_dp:{label:'Firmar decreto de pago al cesionario', rol:'alc', src:'Factoring 2',
    desc:'Alcaldía firma el nuevo decreto de pago.',
    actions:x=>[{label:'Firmar decreto', run:()=>{ x.docs.dp.estado='Firmado'; return 'Decreto '+x.docs.dp.n+' firmado.'; }}]},
  f_pago:{label:'Pagar al cesionario y actualizar factura', rol:'tes', src:'Factoring 2', sup:['S2'],
    desc:'Tesorería paga al cesionario y marca la factura como cedida y pagada.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Transferencia','Cheque'],def:'Transferencia'}],
    actions:x=>[{label:'Registrar pago', run:v=>pagar(x, v.medio||'Transferencia', x.docs.cesion.cesionario)}]},

  /* ===== Gasto sin OC ===== */
  s_analisis:{label:'Análisis técnico del cobro', rol:'sol', src:'Obligaciones sin OC', sup:['S8'],
    desc:'La unidad administradora del contrato o servicio revisa que el cobro y el servicio sean correctos (consumo, período, tarifa).',
    actions:x=>[{label:'Cobro y servicio correctos', run:()=>'Cobro validado.'},
                {label:'Rechazar DTE en el SII', alt:true, jump:true, run:()=>{ x.estado='Rechazado'; x.idx=x.stages.length; x.docs.dte.estado='Rechazado'; return 'DTE rechazado en el SII. Expediente cerrado.'; }}]},
  s_vb:{label:'V°B° / acta de conformidad del servicio', rol:'sol', src:'Obligaciones sin OC',
    desc:'La unidad emite el visto bueno o acta de conformidad.',
    actions:x=>[{label:'Emitir V°B°', run:()=>{ x.docs.acta={fecha:NOW}; return 'V°B° emitido.'; }}]},
  s_imput:{label:'Imputación y verificación de saldo', rol:'pre', src:'Obligaciones sin OC', sup:['S9','S4'],
    desc:'Presupuesto imputa el gasto a la cuenta correspondiente y verifica que haya saldo. En el mismo acto se registra el compromiso.',
    info:x=>{ const p=presOf(x.pres); const s=saldo(p); return `<div class="alert ${s>=x.monto?'ok':'crit'}">Saldo disponible en ${p.cod} ${esc(p.nombre)}: <b class="mono">${fmt(s)}</b> · requerido <b class="mono">${fmt(x.monto)}</b></div>`; },
    actions:x=>{
      const p=presOf(x.pres), ok=saldo(p)>=x.monto;
      if (x.modPend) return [{label:'Registrar suplemento aprobado por el Concejo', stay:true, run:()=>{ p.vig+=x.modPend; const m=x.modPend; x.modPend=0; x.estado='En curso'; hist(x,'Suplemento presupuestario +'+fmt(m),'pre'); return 'Suplemento registrado. Ya puedes imputar.'; }}];
      const a=[{label:'Imputar y comprometer', disabled:!ok, run:()=>{ if(saldo(p)<x.monto) throw new Error('Saldo insuficiente.'); p.comp+=x.monto; x.docs.imput={cta:p.cod, fecha:NOW}; return 'Imputado a '+p.cod+' y comprometido.'; }}];
      if(!ok) a.push({label:'Solicitar modificación o suplemento', alt:true, stay:true, run:()=>{ x.modPend=x.monto-saldo(p); x.estado='En espera'; return 'Solicitud por '+fmt(x.modPend)+' enviada.'; }});
      return a;
    }},
  s_exped:{label:'Validar y enviar expediente', rol:'pre', src:'Obligaciones sin OC',
    desc:'Se arma el expediente (factura + V°B° + imputación) y se envía a Contabilidad.',
    actions:x=>[{label:'Enviar a Contabilidad', run:()=>'Expediente enviado a Contabilidad.'}]},

  /* ===== Ingresos ===== */
  i_borr:{label:'Orden de ingreso en borrador', rol:'emi', src:'Ingreso devengado', sup:['S12'],
    desc:'La unidad emisora revisa la orden (contribuyente, ítems, vencimiento) y la confirma.',
    actions:x=>[{label:'Confirmar orden', run:()=>{
                  x.docs.orden.estado='Confirmada';
                  if (S.cfg.autoCID){ generarCID(x); advance(x); return 'Orden confirmada. El sistema generó '+x.docs.cid.n+' automáticamente.'; }
                  return 'Orden confirmada. Queda en revisión manual de Contabilidad.'; }},
                {label:'Anular borrador', alt:true, jump:true, run:()=>{ x.estado='Anulado'; x.idx=x.stages.length; x.docs.orden.estado='Anulada'; return 'Orden anulada.'; }}]},
  i_cid:{label:'Revisión manual y aprobación', rol:'con', src:'Ingreso devengado', sup:['S12'],
    desc:'La generación automática del comprobante está desactivada. Contabilidad revisa y aprueba la orden.',
    actions:x=>[{label:'Aprobar y generar CID', run:()=>{ generarCID(x); return x.docs.cid.n+' generado y confirmado.'; }}]},
  i_perc:{label:'Recepcionar pago (ingreso percibido)', rol:'tes', src:'Supuesto (página vacía en el diagrama)', sup:['S1'],
    desc:'Tesorería registra el pago del contribuyente. Se genera el comprobante de ingreso percibido.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Transferencia','Tarjeta (Transbank)','Efectivo','Cheque'],def:'Tarjeta (Transbank)'}],
    actions:x=>[{label:'Registrar pago recibido', run:v=>{
      const medio=v.medio||'Transferencia';
      const lines=[{cta:'111.02', debe:x.monto, haber:0, aux:''}];
      x.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.cxc, debe:0, haber:it.monto, aux:x.contrib.nombre}); pi.perc+=it.monto; });
      const a=asiento('Ingreso percibido — '+x.glosa, x.id, lines);
      x.docs.cip={n:'CIP-2026-'+pad(nextSeq('cip')), medio, asiento:a.n};
      movBanco('abono', x.monto, medio.startsWith('Tarjeta')?'Tarjeta':medio, 'Ingreso '+x.docs.cip.n+' · '+x.contrib.nombre, x.id);
      x.estado='Percibido';
      return x.docs.cip.n+' registrado. Ingreso percibido.'; }}]}
};

function pagar(x, medio, benef){
  const c=cxpOf(x.pres);
  const a=asiento('Egreso pagado — '+x.glosa, x.id, [{cta:c.cod, debe:x.monto, haber:0, aux:benef},{cta:c.pag||'111.02', debe:0, haber:x.monto, aux:''}]);
  x.docs.pago={fecha:NOW, medio, benef, asiento:a.n, n:(medio==='Cheque'?'CH-':'TR-')+nextSeq('mov')};
  if(x.docs.dp) x.docs.dp.estado='Pagado';
  presOf(x.pres).pag+=x.monto;
  movBanco('cargo', x.monto, medio, 'Pago '+(x.docs.dp?.n||'')+' · '+benef, x.id);
  x.estado='Pagado';
  return 'Pago registrado a '+benef+' por '+fmt(x.monto)+'.';
}
function generarCID(x){
  const lines=[];
  x.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.cxc, debe:it.monto, haber:0, aux:x.contrib.nombre}); });
  x.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.ing, debe:0, haber:it.monto, aux:''}); pi.dev+=it.monto; });
  const a=asiento('Ingreso devengado — '+x.glosa, x.id, lines);
  x.docs.cid={n:'CID-2026-'+pad(nextSeq('cid')), estado:'Confirmado', asiento:a.n, modo:S.cfg.autoCID?'Automático':'Manual'};
}

const FLOWS = {
  oc:['ced','ced_conf','nicsp','adq_pago','pag_reg'],
  sinoc:['s_analisis','s_vb','s_imput','s_exped','ced','ced_conf','dp','dp_firma','pago'],
  ing:['i_borr','i_cid','i_perc'],
  factoring:['f_susp','f_dec','f_firma','f_rehacer','f_firma_dp','f_pago']
};
const FLOWNAME = {oc:'Desde Adquisiciones', sinoc:'Gasto sin OC', ing:'Ingreso'};

function runAction(x, i, vals){
  const st=STG[cur(x)], acts=st.actions(x), a=acts[i];
  if(!a || a.disabled) throw new Error('Acción no disponible.');
  const rol=st.rol, label=st.label;
  const msg=a.run(vals||{});
  hist(x, label+': '+msg, rol);
  if(!a.stay && !a.jump){ if(x.estado==='Devuelto'||x.estado==='En espera') x.estado='En curso'; advance(x); }
  if(x.idx>=x.stages.length && !['Pagado','Percibido','Rechazado','Anulado'].includes(x.estado)) x.estado='Cerrado';
  return msg;
}
function registrarCesion(x, cesionario){
  x.docs.cesion={cesionario, fecha:NOW};
  const done=x.stages.slice(0,x.idx);
  x.stages=[...done, ...FLOWS.factoring];
  hist(x,'Factura cedida a '+cesionario+' (factoring). Se suspende el pago regular.','daf');
}
/* ---------- Datos de ejemplo ---------- */
let S;
function blank(){
  const P=(cod,nombre,vig,comp,dev,pag)=>({cod,nombre,vig,preob:0,comp,dev,pag});
  return {
    role:'con', view:'guia', sel:null, err:null, supHl:null, cfgHl:null, returnTo:null, draft:null, diarioTab:'Todos',
    cfg:{autoCID:true},
    seq:{exp:140, cdp:88, oc:311, ced:512, dp:497, cid:1203, cip:1180, as:2210, dec:75, inv:640, mov:900},
    pres:[
      P('22.02.002','Vestuario, accesorios y prendas diversas',12000000,7100000,6400000,6400000),
      P('22.04.001','Materiales de oficina',18000000,11200000,10050000,9600000),
      P('22.04.010','Materiales para mantenimiento y reparaciones',14000000,8300000,5100000,5100000),
      P('22.05.001','Electricidad',42000000,29300000,29300000,28100000),
      P('22.05.002','Agua',7800000,5100000,5100000,4700000),
      P('22.05.006','Telefonía celular',9600000,6900000,6300000,6300000),
      P('22.08.001','Servicios de aseo',310000000,212000000,196000000,190500000),
      P('22.09.002','Arriendo de edificios',19800000,14850000,13200000,13200000),
      P('29.04','Mobiliario y otros',8000000,2900000,2900000,2900000),
      P('29.06.001','Equipos computacionales',12000000,3100000,3100000,3100000)
    ],
    presIng:[
      {cod:'03.01.001',nombre:'Patentes municipales',vig:820000000,dev:512000000,perc:468000000,cxc:'115.03.01.001',ing:'451.03.01.001'},
      {cod:'03.01.002',nombre:'Derechos de aseo',vig:96000000,dev:61000000,perc:49000000,cxc:'115.03.01.002',ing:'451.03.01.002'},
      {cod:'03.01.003',nombre:'Otros derechos (BNUP, publicidad)',vig:54000000,dev:38000000,perc:35200000,cxc:'115.03.01.003',ing:'451.03.01.003'}
    ],
    cuentas:[
      {cod:'215.22.02.002',nombre:'C x P Vestuario',pres:'22.02.002',dev:'531.22.02',pag:'111.02'},
      {cod:'215.22.04.001',nombre:'C x P Materiales de oficina',pres:'22.04.001',dev:'531.22.04',pag:'111.02'},
      {cod:'215.22.04.010',nombre:'C x P Materiales para mantenimiento',pres:'22.04.010',dev:'531.22.04',pag:'111.02'},
      {cod:'215.22.05.001',nombre:'C x P Electricidad',pres:'22.05.001',dev:'531.22.05',pag:'111.02'},
      {cod:'215.22.05.002',nombre:'C x P Agua',pres:'22.05.002',dev:'531.22.05',pag:'111.02'},
      {cod:'215.22.05.006',nombre:'C x P Telefonía celular',pres:'22.05.006',dev:'531.22.05',pag:'111.02'},
      {cod:'215.22.08.001',nombre:'C x P Servicios de aseo',pres:'22.08.001',dev:'',pag:'111.02'},
      {cod:'215.22.09.002',nombre:'C x P Arriendo de edificios',pres:'22.09.002',dev:'531.22.09',pag:'111.02'},
      {cod:'215.29.04',nombre:'C x P Mobiliario y otros',pres:'29.04',dev:'141.04',pag:'111.02'},
      {cod:'215.29.06.001',nombre:'C x P Equipos computacionales',pres:'29.06.001',dev:'141.06',pag:'111.02'}
    ],
    ctaDeb:[
      {cod:'531.22.02',nombre:'Gasto en vestuario'},{cod:'531.22.04',nombre:'Gasto en materiales de uso o consumo'},
      {cod:'531.22.05',nombre:'Gasto en servicios básicos'},{cod:'531.22.08',nombre:'Gasto en servicios generales'},
      {cod:'531.22.09',nombre:'Gasto en arriendos'},{cod:'531.26.01',nombre:'Gastos y comisiones bancarias'},
      {cod:'141.04',nombre:'Mobiliario y otros (activo)'},{cod:'141.06',nombre:'Equipos computacionales (activo)'},
      {cod:'111.03',nombre:'Bancos del sistema financiero (ejemplo del diagrama)'}
    ],
    bancos:[{cod:'111.02',nombre:'Banco Estado cta. cte. 1234567'},{cod:'111.03',nombre:'Bancos del sistema financiero'}],
    ctaIng:[
      {cod:'115.03.01.001',nombre:'C x C Patentes municipales'},{cod:'451.03.01.001',nombre:'Ingresos por patentes'},
      {cod:'115.03.01.002',nombre:'C x C Derechos de aseo'},{cod:'451.03.01.002',nombre:'Ingresos por derechos de aseo'},
      {cod:'115.03.01.003',nombre:'C x C Otros derechos'},{cod:'451.03.01.003',nombre:'Ingresos por otros derechos'}
    ],
    proveedores:[
      {rut:'76.184.230-5',nombre:'Comercial Libra SpA'},{rut:'76.123.456-7',nombre:'Comercial Sur SpA'},{rut:'96.870.110-3',nombre:'TecnoAndes Ltda.'},
      {rut:'77.402.915-K',nombre:'Aseos Integrales del Sur S.A.'},{rut:'76.009.771-2',nombre:'Mobiliario Nativa SpA'},
      {rut:'96.911.340-6',nombre:'Red Móvil Austral S.A.'},{rut:'96.800.572-3',nombre:'Distribuidora Eléctrica Central S.A.'},
      {rut:'96.713.150-1',nombre:'Aguas del Valle S.A.'},{rut:'78.115.330-1',nombre:'Textiles Cordillera Ltda.'},
      {rut:'76.330.118-4',nombre:'Inmobiliaria Los Aromos SpA'}
    ],
    cesionarios:['Factor Capital Andino S.A.','Fondo Pyme Financiero SpA'],
    contribuyentes:[
      {rut:'76.543.210-8',nombre:'Almacén El Roble Ltda.',email:'contacto@elroble.cl'},
      {rut:'15.482.337-2',nombre:'María Fernanda Soto',email:'mfsoto@correo.cl'},
      {rut:'77.210.884-4',nombre:'Minimarket Doña Rosa SpA',email:'donarosa@correo.cl'},
      {rut:'76.998.120-1',nombre:'Productora Eventos Sur SpA',email:'hola@eventossur.cl'}
    ],
    conceptos:[
      {n:'Patente comercial (semestral)',pres:'03.01.001'},{n:'Derecho de aseo comercial',pres:'03.01.002'},
      {n:'Permiso de ocupación de BNUP',pres:'03.01.003'},{n:'Derechos de publicidad',pres:'03.01.003'}
    ],
    deptos:['Depto. de Patentes','Depto. de Rentas','Dirección de Obras','Dirección de Tránsito'],
    unidades:['DIDECO','DAF','Oficina de Partes','Secretaría Municipal','Dirección de Obras','Juzgado de Policía Local','SECPLAN'],
    exps:[], asientos:[], movs:[], inventario:[],
    conc:null
  };
}
function newExp(tipo, o){
  const x={id:(tipo==='ing'?'OI-2026-':'EXP-2026-')+pad(nextSeq('exp')), tipo, stages:[...FLOWS[tipo]], idx:0, estado:'En curso', docs:{}, hist:[], creado:NOW, ...o};
  if(tipo==='oc' && !(o.adq&&o.adq.inventariable)) x.stages=x.stages.filter(s=>s!=='nicsp');
  S.exps.unshift(x);
  if(tipo==='oc') hist(x, 'Solicitud de devengado recibida desde Adquisiciones ('+o.adq.folio+'): recepción conforme y cruce de 3 vías completados.', 'ext');
  else hist(x, 'Expediente creado.', STG[x.stages[0]].rol);
  return x;
}
function defaults(x){ const st=STG[cur(x)]; const f=st.fields?st.fields(x):[]; const v={}; f.forEach(d=>v[d.id]= d.type==='check'?true:(d.def??(d.opts?d.opts[0]:''))); return v; }
function runTo(x, stage){ let g=0; while(x.idx<x.stages.length && cur(x)!==stage && g++<40) runAction(x,0,defaults(x)); }
function seed(){
  /* [Demo] Cada expediente es un caso del guion (ver CASES y la vista "Guía de demo").
     Quedan detenidos justo donde empieza lo que se quiere mostrar; nada extra viene ejecutado. */
  S=blank();
  const pv=n=>S.proveedores.find(p=>p.nombre.startsWith(n));
  const at=(d,f)=>{NOW=d; f(); NOW=TODAY;};
  let x;
  const A=(folio,real,modalidad,oc,factura,inv)=>({folio,real,modalidad,oc,factura,inventariable:!!inv});
  const oc=(caso,glosa,unidad,pres,monto,prov,adq)=>newExp('oc',{caso,glosa,unidad,pres,monto,proveedor:pv(prov),adq,docs:{oc:{n:adq.oc,monto},dte:{folio:adq.factura,monto},crc:{n:'Recepción conforme '+adq.folio}}});
  const so=(caso,glosa,unidad,pres,monto,prov,folio,fecha)=>newExp('sinoc',{caso,glosa,unidad,pres,monto,proveedor:pv(prov),docs:{dte:{folio,monto,fecha}}});
  const C=r=>S.contribuyentes.find(c=>c.rut===r);
  const oi=(caso,glosa,depto,venc,rut,concepto,pres,monto)=>{ const y=newExp('ing',{caso,glosa,depto,venc,contrib:C(rut),items:[{c:concepto,pres,monto}],monto}); y.docs.orden={estado:'Borrador'}; return y; };
  // Compromisos que Adquisiciones ya registró (3.4, OC aceptada) para las compras de los casos: sin esto el devengado superaría al comprometido.
  [['22.04.001',1180000],['22.08.001',24500000],['29.06.001',5940000],['22.04.010',2950000],['29.04',3980000],['22.04.001',980000]].forEach(([c,m])=>{ S.pres.find(p=>p.cod===c).comp+=m; });
  // C5 · referencia: ciclo completo ya ejecutado
  at('2026-08-20',()=>{ x=oc('C5','Equipamiento ergonómico Tesorería','Finanzas','29.04',3980000,'Mobiliario Nativa',A('ADQ-2026-00231',true,'Convenio Marco','2417-88-CM26','30871',1)); runTo(x,null); });
  // C4 · devengado listo, espera el pago de Adquisiciones (en Adquisiciones está en 5.4)
  at('2026-09-03',()=>{ x=oc('C4','Señalética peatonal — reposición','Dirección de Obras','22.04.010',2950000,'Comercial Libra',A('ADQ-2026-00202',true,'Convenio Marco','2417-91-CM26','41220')); runTo(x,'adq_pago'); });
  // C6 · factoring: devengado listo, antes del pago
  at('2026-09-04',()=>{ x=oc('C6','Tóner impresoras DAF','DAF','22.04.001',980000,'Comercial Libra',A('ADQ-2026-00253',false,'Compra Ágil','4021-47-SE26','41388')); runTo(x,'adq_pago'); });
  // C2 · bloqueo: cuenta sin configurar
  at('2026-09-08',()=>{ oc('C2','Servicio de aseo dependencias municipales — agosto','DAF','22.08.001',24500000,'Aseos Integrales',A('ADQ-2026-00250',false,'Licitación Pública','2417-12-LR26','99812')); });
  // C3 · bien inventariable
  at('2026-09-11',()=>{ oc('C3','Notebooks Oficina de Partes (6 unidades)','Oficina de Partes','29.06.001',5940000,'TecnoAndes',A('ADQ-2026-00252',false,'Convenio Marco','2417-97-CM26','55102',1)); });
  // C7 · sin OC camino feliz (recién llegada la factura)
  at('2026-09-05',()=>{ so('C7','Agua potable edificio consistorial — agosto','DAF','22.05.002',612400,'Aguas del Valle','8841203','2026-09-05'); });
  // C8 · sin OC bloqueado por saldo (análisis y V°B° hechos)
  at('2026-09-10',()=>{ x=so('C8','Consumo eléctrico alumbrado público — agosto','DAF','22.05.001',14380000,'Distribuidora','51902774','2026-09-10'); runTo(x,'s_imput'); });
  // C9 · sin OC con cobro duplicado
  at('2026-09-16',()=>{ so('C9','Arriendo oficina DIDECO — septiembre (cobro duplicado)','DIDECO','22.09.002',1650000,'Inmobiliaria','1187','2026-09-16'); });
  // C10 y C11 · órdenes de ingreso en borrador
  at('2026-09-19',()=>{ oi('C10','Patente comercial 2° semestre','Depto. de Patentes','2026-10-31','76.543.210-8','Patente comercial (semestral)','03.01.001',68000); });
  at('2026-09-19',()=>{ oi('C11','Derecho de aseo comercial 2° semestre','Depto. de Rentas','2026-10-31','77.210.884-4','Derecho de aseo comercial','03.01.002',92500); });
  S.exps.sort((a,b)=>b.id.localeCompare(a.id));
  S.conc=seedConc();
}
function seedConc(){
  const L=(id,f,tipo,monto,medio,glosa)=>({id,fecha:'2026-08-'+f,tipo,monto,medio,glosa,m:null});
  const B=(id,f,monto,desc)=>({id,fecha:'2026-08-'+f,monto,desc,medio:/CHEQUE/.test(desc)?'Cheque':/TRANSBANK/.test(desc)&&monto>0?'Tarjeta':/COMISION/.test(desc)?'Cargo bancario':'Transferencia',m:null});
  return {periodo:'Agosto 2026', cta:'111.02', idx:0, estado:'En curso', ini:148320500, cartola:false, obsRev:0,
    stages:['recopilar','cheques','tarjetas','comparar','conciliar','revisar','autorizar','archivar'], hist:[],
    libro:[L('L1','04','cargo',4800000,'Transferencia','Pago DP-2026-0441 · Aseos Integrales del Sur'),L('L2','06','abono',2315400,'Tarjeta','Recaudación Transbank 05-08'),
      L('L3','08','cargo',612000,'Cheque','Cheque 118832 · Aguas del Valle'),L('L4','12','abono',18450000,'Transferencia','Fondo Común Municipal — anticipo'),
      L('L5','14','cargo',1284000,'Transferencia','Pago DP-2026-0452 · Red Móvil Austral'),L('L6','19','abono',1908700,'Tarjeta','Recaudación Transbank 18-08'),
      L('L7','22','cargo',356900,'Cheque','Cheque 118841 · Comercial Libra'),L('L8','27','cargo',12740000,'Transferencia','Honorarios agosto (nómina)'),
      L('L9','29','abono',845000,'Efectivo','Depósito caja municipal 29-08'),L('L10','31','cargo',3842110,'Transferencia','Pago DP-2026-0470 · Distribuidora Eléctrica Central')],
    banco:[B('B1','04',-4800000,'TRASPASO A TERCEROS 77402915'),B('B2','07',2315400,'ABONO TRANSBANK'),B('B3','11',-612000,'CHEQUE 118832'),
      B('B4','12',18450000,'TRANSF. TESORERIA GENERAL'),B('B5','14',-1284000,'TRASPASO A TERCEROS 96911340'),B('B6','20',1908700,'ABONO TRANSBANK'),
      B('B7','27',-12740000,'PAGO MASIVO NOMINA'),B('B8','30',120000,'DEPOSITO NO IDENTIFICADO'),B('B9','31',-3842110,'TRASPASO A TERCEROS 96800572'),
      B('B10','31',-18500,'COMISION MANTENCION CTA CTE'),B('B11','31',-41230,'COMISION TRANSBANK')]};
}

/* ---------- Conciliación ---------- */
function signed(l){ return l.tipo==='abono'?l.monto:-l.monto; }
function matchBy(c, medio){
  let n=0;
  c.libro.filter(l=>!l.m && (!medio||l.medio===medio)).forEach(l=>{
    const b=c.banco.find(b=>!b.m && b.monto===signed(l) && (!medio||b.medio===medio));
    if(b){ l.m=b.id; b.m=l.id; n++; }
  });
  return n;
}
function concReport(c){
  const sl=c.ini+c.libro.reduce((s,l)=>s+signed(l),0), sb=c.ini+c.banco.reduce((s,b)=>s+b.monto,0);
  const chq=c.libro.filter(l=>!l.m&&l.tipo==='cargo'), dep=c.libro.filter(l=>!l.m&&l.tipo==='abono');
  const cb=c.banco.filter(b=>!b.m&&b.monto<0), ab=c.banco.filter(b=>!b.m&&b.monto>0);
  const sum=a=>a.reduce((s,x)=>s+Math.abs(x.monto),0);
  return {sl,sb,chq,dep,cb,ab, bancoAj: sb - sum(chq) + sum(dep), libroAj: sl - sum(cb) + sum(ab)};
}
const CST = {
  recopilar:{label:'Recopilar antecedentes del banco', rol:'tes', desc:'Se obtiene la cartola bancaria del período.',
    actions:c=>[{label:'Cargar cartola de agosto', run:()=>{ c.cartola=true; return 'Cartola cargada: '+c.banco.length+' movimientos.'; }}]},
  cheques:{label:'Cotejar cheques', rol:'tes', desc:'Se cruzan los cheques girados del libro banco con los cobrados en la cartola.',
    actions:c=>[{label:'Cotejar cheques', run:()=>matchBy(c,'Cheque')+' cheque(s) cruzado(s).'}]},
  tarjetas:{label:'Cotejar pagos con tarjeta', rol:'tes', desc:'Se cruzan las recaudaciones con tarjeta con los abonos del operador.',
    actions:c=>[{label:'Cotejar tarjetas', run:()=>matchBy(c,'Tarjeta')+' abono(s) con tarjeta cruzado(s).'}]},
  comparar:{label:'Comparar libro banco con cartola', rol:'tes', desc:'Se cruza el resto de los movimientos por monto y sentido.',
    actions:c=>[{label:'Comparar movimientos', run:()=>matchBy(c,null)+' movimiento(s) cruzado(s).'}]},
  conciliar:{label:'Conciliar', rol:'tes', sup:['S11'], desc:'Se preparan las partidas conciliatorias. Los cargos bancarios no contabilizados pueden registrarse ahora.',
    actions:c=>{ const r=concReport(c); const a=[];
      if(r.cb.some(b=>b.medio==='Cargo bancario')) a.push({label:'Contabilizar comisiones bancarias', stay:true, run:()=>{
        const cs=c.banco.filter(b=>!b.m&&b.medio==='Cargo bancario'); const t=cs.reduce((s,b)=>s-b.monto,0);
        const as=asiento('Comisiones bancarias agosto','Conciliación '+c.periodo,[{cta:'531.26.01',debe:t,haber:0,aux:''},{cta:'111.02',debe:0,haber:t,aux:''}]);
        cs.forEach(b=>{ const id='L'+(c.libro.length+1); c.libro.push({id,fecha:b.fecha,tipo:'cargo',monto:-b.monto,medio:'Cargo bancario',glosa:b.desc+' ('+as.n+')',m:b.id}); b.m=id; });
        return 'Comisiones por '+fmt(t)+' contabilizadas ('+as.n+').'; }});
      a.unshift({label:'Generar conciliación', run:()=>{ c.informe=true; return 'Conciliación preparada.'; }});
      return a; }},
  revisar:{label:'Revisar', rol:'rev', sup:['S11'], desc:'El revisor verifica la conciliación y sus partidas.',
    actions:c=>[{label:'Visar', run:()=>'Conciliación visada.'},{label:'Devolver con observaciones', alt:true, jump:true, run:()=>{ c.obsRev++; c.idx=c.stages.indexOf('conciliar'); return 'Devuelta a Tesorería con observaciones.'; }}]},
  autorizar:{label:'Revisar y autorizar', rol:'daf', desc:'DAF autoriza la conciliación.',
    actions:c=>[{label:'Autorizar', run:()=>'Conciliación autorizada.'}]},
  archivar:{label:'Archivar', rol:'daf', desc:'Se archiva la conciliación del período.',
    actions:c=>[{label:'Archivar', run:()=>{ c.estado='Archivada'; return 'Conciliación archivada.'; }}]}
};
function runConc(i){
  const c=S.conc, st=CST[c.stages[c.idx]], a=st.actions(c)[i];
  const msg=a.run(); c.hist.unshift({f:TODAY, rol:st.rol, txt:st.label+': '+msg});
  if(!a.stay&&!a.jump) c.idx++;
  return msg;
}
/* ---------- Persistencia ---------- */
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){ try{ const t=localStorage.getItem(KEY); if(t){ S=JSON.parse(t); return true; } }catch(e){} return false; }

/* ---------- Utilidades de vista ---------- */
const $ = id => document.getElementById(id);
function toast(m){ const t=$('toast'); t.textContent=m; t.hidden=false; clearTimeout(toast.h); toast.h=setTimeout(()=>t.hidden=true,3200); }
function roleChip(r){ return `<span class="role ${r===S.role?'me':''}" title="${esc(R[r])}">${esc(RSHORT[r])}</span>`; }
function supChips(list){ return (list||[]).map(s=>`<button class="sup" data-a="sup" data-v="${s}" title="${esc(SUP[s].t)}">${s}</button>`).join(' '); }
function estadoPill(e){ const m={'En curso':'acc','Pagado':'ok','Percibido':'ok','Cerrado':'ok','Archivada':'ok','Devuelto':'warn','En espera':'warn','Rechazado':'crit','Anulado':'crit'}; return `<span class="pill ${m[e]||''}">${esc(e)}</span>`; }
function isOpen(x){ return x.idx<x.stages.length && !['Rechazado','Anulado','Pagado','Percibido','Cerrado'].includes(x.estado); }
function tasksFor(r){ const t=S.exps.filter(x=>isOpen(x) && STG[cur(x)].rol===r); return t; }
function concTaskFor(r){ const c=S.conc; return c && c.estado!=='Archivada' && CST[c.stages[c.idx]].rol===r; }
function countFor(r){ return tasksFor(r).length + (concTaskFor(r)?1:0); }
function asientoHTML(a){
  const td=a.lineas.reduce((s,l)=>s+l.debe,0), th=a.lineas.reduce((s,l)=>s+l.haber,0);
  return `<div class="asiento"><div class="ah"><span><b class="mono">${a.n}</b> · ${fdate(a.fecha)} · ${esc(a.glosa)}</span><span class="pill ${a.estado==='Borrador'?'warn':'ok'}">${a.estado}</span></div>
  <div class="tbl-wrap"><table><tr><th>Cuenta</th><th>Beneficiario</th><th class="num">Debe</th><th class="num">Haber</th></tr>
  ${a.lineas.map(l=>`<tr><td><span class="mono">${esc(l.cta)}</span> <span class="muted small">${esc(ctaName(l.cta))}</span></td><td class="small">${esc(l.aux)}</td><td class="num">${l.debe?fmt(l.debe):''}</td><td class="num">${l.haber?fmt(l.haber):''}</td></tr>`).join('')}
  <tfoot><tr><td colspan="2">${td===th?'<span class="pill ok">Cuadrado</span>':'<span class="pill crit">Descuadrado</span>'}</td><td class="num">${fmt(td)}</td><td class="num">${fmt(th)}</td></tr></tfoot></table></div></div>`;
}
function fieldHTML(f){
  const id='f_'+f.id;
  if(f.type==='select') return `<div class="field"><label for="${id}">${esc(f.label)}</label><select id="${id}">${f.opts.map(o=>`<option ${o===f.def?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
  if(f.type==='check') return `<label class="check"><input type="checkbox" id="${id}"> <span>${esc(f.label)}</span></label>`;
  return `<div class="field"><label for="${id}">${esc(f.label)}</label><input type="${f.type==='number'?'number':'text'}" id="${id}" value="${esc(f.def)}"></div>`;
}
function readFields(fs){ const v={}; (fs||[]).forEach(f=>{ const el=$('f_'+f.id); if(!el) return; v[f.id]= f.type==='check'?el.checked : f.type==='number'?Number(el.value):el.value; }); return v; }

/* ---------- Navegación ---------- */
const NAV = [
  ['Trabajo',[['guia','Guía de demo'],['bandeja','Mi bandeja'],['flujos','Mapa de flujos']]],
  ['Gasto',[['oc','Desde Adquisiciones'],['sinoc','Servicios sin OC']]],
  ['Ingreso',[['ing','Órdenes de ingreso']]],
  ['Tesorería',[['tes','Pagos y cobros'],['conc','Conciliación bancaria']]],
  ['Contabilidad',[['pres','Ejecución presupuestaria'],['diario','Libro diario'],['inv','Inventario']]],
  ['Sistema',[['cfg','Configuración de cuentas'],['sup','Supuestos del prototipo']]]
];
function renderNav(){
  const counts={guia:CASES.length, bandeja:countFor(S.role), oc:S.exps.filter(x=>x.tipo==='oc'&&isOpen(x)).length, sinoc:S.exps.filter(x=>x.tipo==='sinoc'&&isOpen(x)).length, ing:S.exps.filter(x=>x.tipo==='ing'&&isOpen(x)).length, sup:Object.keys(SUP).length};
  const active = S.view==='exp' ? (S.exps.find(x=>x.id===S.sel)||{}).tipo : S.view.replace('new-','');
  const nav=$('contabilidad-nav');
  if(nav) nav.innerHTML = '<div class="app-sidebar__nav-title">Contabilidad</div>' + NAV.map(([g,items])=>`<div class="conta-nav-grp">${g}</div>`+items.map(([k,l])=>`<a href="#${k}" data-a="nav" data-v="${k}" class="${active===k?'is-active':''}"><span>${l}</span>${counts[k]!=null?`<span class="cnt">${counts[k]}</span>`:''}</a>`).join('')).join('');
  $('roleSel').innerHTML = Object.keys(R).map(r=>`<option value="${r}" ${r===S.role?'selected':''}>${R[r]} (${countFor(r)})</option>`).join('');
}

/* ---------- Vistas ---------- */
function vBandeja(){
  const g=S.pres.reduce((a,p)=>({vig:a.vig+p.vig,comp:a.comp+p.comp,dev:a.dev+p.dev,pag:a.pag+p.pag}),{vig:0,comp:0,dev:0,pag:0});
  const i=S.presIng.reduce((a,p)=>({vig:a.vig+p.vig,dev:a.dev+p.dev,perc:a.perc+p.perc}),{vig:0,dev:0,perc:0});
  const t=tasksFor(S.role);
  const pct=(a,b)=>b?Math.round(a/b*100):0;
  const others=Object.keys(R).filter(r=>r!==S.role&&countFor(r)>0);
  return `<div class="pagehead"><div><h1>Mi bandeja</h1><p>Tareas pendientes para <b>${esc(R[S.role])}</b>. Cambia de rol arriba para recorrer cada flujo como lo haría cada unidad municipal.</p></div></div>
  <div class="kpis">
    <div class="kpi"><div class="l">Gasto comprometido</div><div class="v">${fmt(g.comp)}</div><div class="s">${pct(g.comp,g.vig)}% de ${fmt(g.vig)} vigente</div><div class="bar"><i style="width:${pct(g.pag,g.vig)}%;background:var(--ok)"></i><i style="width:${pct(g.dev-g.pag,g.vig)}%;background:var(--accent)"></i><i style="width:${pct(g.comp-g.dev,g.vig)}%;background:var(--warn)"></i></div></div>
    <div class="kpi"><div class="l">Gasto devengado</div><div class="v">${fmt(g.dev)}</div><div class="s">Pagado ${fmt(g.pag)}</div></div>
    <div class="kpi"><div class="l">Ingreso devengado</div><div class="v">${fmt(i.dev)}</div><div class="s">Percibido ${fmt(i.perc)} (${pct(i.perc,i.dev)}%)</div></div>
    <div class="kpi"><div class="l">Pendientes de todos los roles</div><div class="v">${Object.keys(R).reduce((s,r)=>s+countFor(r),0)}</div><div class="s">${S.exps.filter(isOpen).length} expedientes abiertos</div></div>
  </div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Pendientes para ${esc(RSHORT[S.role])}</h2><span class="cnt">${countFor(S.role)}</span></div>
  ${t.length||concTaskFor(S.role)?`<div class="tbl-wrap"><table><tr><th>Expediente</th><th>Flujo</th><th>Etapa</th><th class="num">Monto</th><th>Estado</th></tr>
    ${t.map(x=>`<tr class="click" data-a="open" data-v="${x.id}"><td><span class="mono">${x.id}</span><div class="small muted">${esc(x.glosa)}</div></td><td class="small">${FLOWNAME[x.tipo]}</td><td>${esc(STG[cur(x)].label)}</td><td class="num">${fmt(x.monto)}</td><td>${estadoPill(x.estado)}</td></tr>`).join('')}
    ${concTaskFor(S.role)?`<tr class="click" data-a="nav" data-v="conc"><td><span class="mono">CONC-08</span><div class="small muted">Conciliación bancaria ${esc(S.conc.periodo)}</div></td><td class="small">Conciliación</td><td>${esc(CST[S.conc.stages[S.conc.idx]].label)}</td><td class="num">—</td><td>${estadoPill(S.conc.estado)}</td></tr>`:''}
  </table></div>`:`<div class="empty">No hay tareas para este rol.${others.length?' Hay pendientes en: '+others.map(r=>`<button class="btn sm" data-a="role" data-v="${r}">${RSHORT[r]} (${countFor(r)})</button>`).join(' '):''}</div>`}
  </div>
  <div class="panel"><div class="ph"><h2>Pendientes por rol</h2></div><div class="pb row">${Object.keys(R).map(r=>`<button class="btn sm" data-a="role" data-v="${r}" ${r===S.role?'disabled':''}>${RSHORT[r]} <span class="cnt">${countFor(r)}</span></button>`).join('')}</div></div>
  <div class="alert sup">Las marcas <span class="sup">S1</span>… indican decisiones que los diagramas no resolvían y que el prototipo completa con un supuesto. Revísalas en <a href="#" data-a="nav" data-v="sup">Supuestos del prototipo</a>.</div>
  </div>`;
}
function listTable(list){
  if(!list.length) return '<div class="empty">Sin expedientes.</div>';
  return `<div class="tbl-wrap"><table><tr><th>Expediente</th><th>${list[0].tipo==='ing'?'Contribuyente':'Proveedor'}</th><th>Etapa actual</th><th class="num">Monto</th><th>Estado</th></tr>
  ${list.map(x=>`<tr class="click" data-a="open" data-v="${x.id}"><td><span class="mono">${x.id}</span> ${casePill(x)}<div class="small muted">${esc(x.glosa)}</div></td>
  <td class="small">${esc(x.tipo==='ing'?x.contrib?.nombre:(x.proveedor?.nombre||'—'))}</td>
  <td>${isOpen(x)?esc(STG[cur(x)].label)+' '+roleChip(STG[cur(x)].rol):'<span class="muted">Finalizado</span>'}</td>
  <td class="num">${fmt(x.monto)}</td><td>${estadoPill(x.estado)}</td></tr>`).join('')}</table></div>`;
}
function vList(tipo){
  const L=S.exps.filter(x=>x.tipo===tipo);
  const meta={
    oc:['Obligaciones desde Adquisiciones','La compra (SOLPED, CDP, preobligación, modalidad, OC, recepción conforme y cruce de 3 vías) vive en el módulo Adquisiciones. Aquí llegan sus solicitudes de devengado; Contabilidad registra el devengado patrimonial, el alta de activos y, tras el pago de Tesorería, el egreso pagado.','Simular solicitud de devengado','new-oc'],
    sinoc:['Servicios sin orden de compra','Servicios básicos, arriendos y otros cobros periódicos que llegan directamente como factura.','Registrar factura recibida','new-sinoc'],
    ing:['Órdenes de ingreso','Derechos, patentes y permisos: la orden genera el ingreso devengado y, al pagarse, el percibido.','Nueva orden de ingreso','new-ing']
  }[tipo];
  return `<div class="pagehead"><div><h1>${meta[0]}</h1><p>${meta[1]}</p></div><button class="btn pri" data-a="nav" data-v="${meta[3]}">${meta[2]}</button></div>
  <div class="panel">${listTable(L)}</div>${tipo==='oc'?transitoHTML():''}`;
}
function transito(){
  const inConta=new Set(S.exps.filter(x=>x.adq).map(x=>x.adq.folio));
  return ADQ_DATA.expedientes.filter(e=>e.status==='in_progress' && e.currentStep && stepBefore(e.currentStep.id,'4.4') && !inConta.has(e.id))
    .map(e=>[e.id,e.title,e.modality,e.currentStep.id+' '+e.currentStep.name,e.awardedAmount??e.requestedAmount]);
}
function transitoHTML(){
  const T=transito(); if(!T.length) return '';
  return `<div class="panel" style="margin-top:16px"><div class="ph"><h2>Todavía en Adquisiciones</h2><span class="small muted">Llegarán aquí cuando pidan el devengado</span></div>
  <div class="tbl-wrap"><table><tr><th>Expediente</th><th>Modalidad</th><th>Paso actual en Adquisiciones</th><th class="num">Monto</th><th></th></tr>
  ${T.map(t=>`<tr><td><span class="mono">${t[0]}</span><div class="small muted">${esc(t[1])}</div></td><td class="small">${esc(t[2])}</td><td class="small">${esc(t[3])}</td><td class="num">${fmt(t[4])}</td><td>${adqLink(t[0],'Abrir')}</td></tr>`).join('')}</table></div>
  <div class="pb small muted">Leído de los datos demo del módulo Adquisiciones (<span class="mono">shared/expedientes-demo.js</span>): expedientes en curso antes del paso 4.4. En la integración real no se listan: llegan por el contrato de devengado.</div></div>`;
}
function adqBanner(){
  const o=S.draft?.origen; if(!o) return '';
  const lbl={'4.4':'4.4 Solicitud de devengado (al confirmar la recepción)','5.2':'5.2 Registro del devengado (después del cruce de 3 vías)','5.1':'5.1 Cruce de 3 vías'}[o]||o;
  return `<div class="alert sup" style="margin-bottom:12px">Llegaste desde <b>Adquisiciones · ${esc(lbl)}</b> con el expediente <span class="mono">${esc(S.draft.adq.folio)}</span>. Los datos vienen de ese expediente; revísalos y pulsa "Recibir solicitud". Contabilidad acepta una sola solicitud por expediente.</div>`;
}
function adqArrival(x){
  const f=S.fromAdq; if(!f || !x.adq || x.adq.folio!==f.folio) return '';
  const msg=f.existed?`Este expediente ya había recibido la solicitud de devengado de <span class="mono">${esc(f.folio)}</span>. No se crea otra: Contabilidad acepta una sola por expediente de compra.`:`Solicitud de devengado recibida desde Adquisiciones${f.origen?' (paso '+esc(f.origen)+')':''}. Contabilidad ya puede registrar el devengado.`;
  return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>${msg}</span>${adqLink(f.folio,'Volver a Adquisiciones')}</div></div>`;
}
function vNew(tipo){
  const d=S.draft||(S.draft={});
  if(tipo==='oc'){
    const p=d.adq||(d.adq=adqPrefill('ADQ-2026-00123'));
    const unidades=S.unidades.includes(p.unidad)||!p.unidad?S.unidades:[p.unidad,...S.unidades];
    if(p.proveedor && !S.proveedores.some(x=>x.nombre===p.proveedor)) S.proveedores.push({rut:'77.'+pad(S.proveedores.length,3)+'.'+pad(Math.abs([...p.proveedor].reduce((h,c)=>h*31+c.charCodeAt(0)|0,7))%1000,3)+'-'+(S.proveedores.length%10), nombre:p.proveedor});
    const provSel=(S.proveedores.find(x=>x.nombre===p.proveedor)||S.proveedores.find(x=>x.rut==='76.123.456-7')).rut;
    return `${adqBanner()}<div class="pagehead"><div><h1>${d.origen?'Solicitud de devengado desde Adquisiciones':'Simular solicitud de devengado'}</h1><p>Representa lo que Adquisiciones envía a Contabilidad después de la recepción conforme y el cruce de 3 vías (contrato <span class="mono">recordAccrual</span>). Precargado con el expediente ${adqLink(p.folio,p.folio)} de Adquisiciones${p.step?' (paso actual allá: '+esc(p.step)+')':''}.</p></div></div>
    <div class="panel"><div class="pb stack"><div class="fields">
    <div class="field"><label for="n_folio">Expediente de Adquisiciones</label><input type="text" id="n_folio" value="${esc(p.folio)}"></div>
    <div class="field"><label for="n_mod">Modalidad</label><select id="n_mod">${['Compra Ágil','Convenio Marco','Licitación Pública','Trato Directo'].map(m=>`<option ${m===p.modalidad?'selected':''}>${m}</option>`).join('')}</select></div>
    <div class="field" style="grid-column:1/-1"><label for="n_glosa">Glosa</label><input type="text" id="n_glosa" value="${esc(p.glosa)}"></div>
    <div class="field"><label for="n_unidad">Unidad</label><select id="n_unidad">${unidades.map(u=>`<option ${u===p.unidad?'selected':''}>${esc(u)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_prov">Proveedor</label><select id="n_prov">${S.proveedores.map(x=>`<option value="${x.rut}" ${x.rut===provSel?'selected':''}>${x.rut} · ${esc(x.nombre)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_pres">Compromiso (cuenta presupuestaria)</label><select id="n_pres">${S.pres.map(x=>`<option value="${x.cod}" ${x.cod===p.pres?'selected':''}>${x.cod} · ${esc(x.nombre)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_monto">Monto aceptado ($)</label><input type="number" id="n_monto" value="${Number(p.monto)||0}"></div>
    <div class="field"><label for="n_oc">Orden de compra</label><input type="text" id="n_oc" value="${esc(p.oc)}"></div>
    <div class="field"><label for="n_fact">Folio factura</label><input type="text" id="n_fact" value="${esc(p.factura||'40187')}"></div>
    <label class="check" style="align-self:end"><input type="checkbox" id="n_inv"> <span>Bien inventariable (4.3)</span></label>
    </div><div class="row"><button class="btn pri" data-a="create" data-v="oc">Recibir solicitud</button><button class="btn" data-a="nav" data-v="oc">Cancelar</button></div></div></div>`;
  }
  if(tipo==='sinoc') return `<div class="pagehead"><div><h1>Registrar factura recibida (sin OC)</h1><p>El proveedor emite el DTE en el SII y llega a la bandeja de la unidad administradora.</p></div></div>
    <div class="panel"><div class="pb stack"><div class="fields">
    <div class="field"><label for="n_prov">Proveedor</label><select id="n_prov">${S.proveedores.map(p=>`<option value="${p.rut}">${p.rut} · ${esc(p.nombre)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_folio">Folio DTE</label><input type="text" id="n_folio" value="7730512"></div>
    <div class="field" style="grid-column:1/-1"><label for="n_glosa">Glosa</label><input type="text" id="n_glosa" value="Telefonía fija edificio consistorial — agosto"></div>
    <div class="field"><label for="n_unidad">Unidad administradora</label><select id="n_unidad">${S.unidades.map(u=>`<option>${u}</option>`).join('')}</select></div>
    <div class="field"><label for="n_pres">Cuenta presupuestaria</label><select id="n_pres">${S.pres.map(p=>`<option value="${p.cod}" ${p.cod==='22.05.006'?'selected':''}>${p.cod} · ${esc(p.nombre)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_monto">Monto ($)</label><input type="number" id="n_monto" value="389900"></div>
    </div><div class="row"><button class="btn pri" data-a="create" data-v="sinoc">Registrar factura</button><button class="btn" data-a="nav" data-v="sinoc">Cancelar</button></div></div></div>`;
  // ingreso
  if(!d.items) Object.assign(d,{items:[{c:S.conceptos[0].n,monto:68000}], contrib:S.contribuyentes[0].rut});
  return `<div class="pagehead"><div><h1>Nueva orden de ingreso</h1><p>La unidad emisora crea la orden y la deja en borrador. Al confirmarla se genera el comprobante de ingreso devengado.</p></div></div>
    <div class="panel"><div class="pb stack"><div class="fields">
    <div class="field"><label for="n_depto">Departamento</label><select id="n_depto">${S.deptos.map(u=>`<option>${u}</option>`).join('')}</select></div>
    <div class="field"><label for="n_venc">Fecha de vencimiento</label><input type="date" id="n_venc" value="2026-10-31"></div>
    <div class="field"><label for="n_contrib">Contribuyente (RUT, nombre o correo)</label><input type="search" id="n_contrib" list="dl_contrib" value="${esc(S.contribuyentes.find(c=>c.rut===d.contrib)?.nombre||'')}"><datalist id="dl_contrib">${S.contribuyentes.map(c=>`<option value="${esc(c.nombre)}">${c.rut} · ${esc(c.email)}</option>`).join('')}</datalist></div>
    <div class="field" style="grid-column:1/-1"><label for="n_glosa">Glosa</label><input type="text" id="n_glosa" value="Patente comercial 2° semestre"></div>
    </div>
    <h3>Ítems de ingreso</h3>
    ${d.items.map((it,k)=>`<div class="items-row"><div class="field"><label for="it_c_${k}">Concepto</label><select id="it_c_${k}" data-item="${k}">${S.conceptos.map(c=>`<option ${c.n===it.c?'selected':''}>${esc(c.n)}</option>`).join('')}</select></div>
      <div class="field"><label for="it_m_${k}">Monto ($)</label><input type="number" id="it_m_${k}" value="${it.monto}"></div>
      <button class="btn sm" data-a="delitem" data-v="${k}" ${d.items.length<2?'disabled':''}>Quitar</button></div>`).join('')}
    <div class="row"><button class="btn sm" data-a="additem">Agregar ítem</button></div>
    <div class="row"><button class="btn pri" data-a="create" data-v="ing">Guardar orden (borrador)</button><button class="btn" data-a="nav" data-v="ing">Cancelar</button></div></div></div>`;
}
function syncItems(){ const d=S.draft; if(!d||!d.items) return; d.items.forEach((it,k)=>{ const c=$('it_c_'+k), m=$('it_m_'+k); if(c) it.c=c.value; if(m) it.monto=Number(m.value)||0; }); }
function createFromForm(tipo){
  const v=id=>$(id)?.value;
  let x;
  if(tipo==='oc'){ const m=Number(v('n_monto')); if(!(m>0)) throw new Error('Ingresa un monto mayor que cero.');
    const folio=(v('n_folio')||'').trim(); if(!folio) throw new Error('Indica el expediente de Adquisiciones.');
    const dup=S.exps.find(e=>e.adq&&e.adq.folio===folio); if(dup) throw new Error('Ya existe una solicitud de devengado para '+folio+' ('+dup.id+'). Contabilidad acepta una sola por expediente.');
    S.fromAdq=S.draft?.origen?{folio, origen:S.draft.origen}:null;
    const adq={folio, modalidad:v('n_mod'), oc:v('n_oc'), factura:v('n_fact'), inventariable:$('n_inv').checked};
    x=newExp('oc',{caso:(CASES.find(c=>c.folio===folio)||{}).id,glosa:v('n_glosa'),unidad:v('n_unidad'),pres:v('n_pres'),monto:m,proveedor:S.proveedores.find(p=>p.rut===v('n_prov')),adq,docs:{oc:{n:adq.oc,monto:m},dte:{folio:adq.factura,monto:m},crc:{n:'Recepción conforme '+folio}}}); }
  else if(tipo==='sinoc'){ const m=Number(v('n_monto')); if(!(m>0)) throw new Error('Ingresa un monto mayor que cero.');
    x=newExp('sinoc',{glosa:v('n_glosa'),unidad:v('n_unidad'),pres:v('n_pres'),monto:m,proveedor:S.proveedores.find(p=>p.rut===v('n_prov')),docs:{dte:{folio:v('n_folio'),monto:m,fecha:TODAY}}}); }
  else { syncItems(); const q=(v('n_contrib')||'').toLowerCase();
    const c=S.contribuyentes.find(c=>c.nombre.toLowerCase()===q||c.rut===q||c.email===q)||S.contribuyentes.find(c=>(c.nombre+' '+c.rut+' '+c.email).toLowerCase().includes(q));
    if(!q||!c) throw new Error('Selecciona un contribuyente de la lista.');
    const items=S.draft.items.map(it=>({c:it.c, pres:S.conceptos.find(k=>k.n===it.c).pres, monto:it.monto}));
    const m=items.reduce((s,i)=>s+i.monto,0); if(!(m>0)) throw new Error('El monto total debe ser mayor que cero.');
    x=newExp('ing',{glosa:v('n_glosa'),depto:v('n_depto'),venc:v('n_venc'),contrib:c,items,monto:m}); x.docs.orden={estado:'Borrador'}; }
  S.draft=null; return x;
}

function docsHTML(x){
  const D=[]; const d=x.docs;
  const card=(t,n,extra,st)=>`<div class="doc"><div class="dt"><span>${t}</span>${st?`<span>${esc(st)}</span>`:''}</div><div class="dn">${esc(n)}</div>${extra?`<div class="small muted">${extra}</div>`:''}</div>`;
  if(x.tipo==='ing'){
    D.push(card('Orden de ingreso',x.id,`${esc(x.depto)} · vence ${fdate(x.venc)}<br>${esc(x.contrib.rut)} · ${esc(x.contrib.nombre)}<br>${x.items.map(i=>esc(i.c)+': '+fmt(i.monto)).join('<br>')}`,d.orden?.estado));
    if(d.cid) D.push(card('Comprobante de ingreso devengado',d.cid.n,'Generación '+d.cid.modo.toLowerCase()+' · asiento '+d.cid.asiento,d.cid.estado));
    if(d.cip) D.push(card('Comprobante de ingreso percibido',d.cip.n,esc(d.cip.medio)+' · asiento '+d.cip.asiento));
  } else {
    if(x.adq) D.push(`<div class="doc"><div class="dt"><span>Expediente de Adquisiciones</span><span>${esc(x.adq.modalidad)}</span></div><div class="dn">${esc(x.adq.folio)}</div><div class="small muted">OC ${esc(x.adq.oc)} · factura ${esc(x.adq.factura)} · recepción conforme y cruce de 3 vías completados${x.adq.inventariable?' · bien inventariable':''}${adqInfo(x.adq.folio)?'':' · <i>folio simulado</i>'}</div><div class="small" style="margin-top:4px">${adqLink(x.adq.folio)}</div></div>`);
    if(d.cdp) D.push(card('CDP',d.cdp.n,fmt(d.cdp.monto)+' · '+fdate(d.cdp.fecha)));
    if(d.adj) D.push(card('Adjudicación',d.decAdj?.n||'Decreto pendiente',esc(d.adj.modalidad)+' · '+esc(d.adj.proveedor)));
    if(d.comp) D.push(card('Compromiso',x.pres,fmt(d.comp.monto)));
    if(d.imput) D.push(card('Imputación y compromiso',d.imput.cta,fmt(x.monto)));
    if(d.oc && !x.adq) D.push(card('Orden de compra',d.oc.n,fmt(d.oc.monto),d.oc.estado));
    if(d.ocAnuladas) D.push(card('OC rechazadas',d.ocAnuladas+' anulada(s)',''));
    if(d.recep) D.push(card('Recepción física',fdate(d.recep.fecha),d.recep.obs?d.recep.obs+' acta(s) de observaciones previas':'Sin observaciones'));
    if(d.acta) D.push(card(x.tipo==='oc'?'Acta de recepción conforme':'V°B° del servicio',fdate(d.acta.fecha),'Firmado por '+esc(x.unidad)));
    if(d.dte && !x.adq) D.push(card('Factura (DTE)','Folio '+d.dte.folio,fmt(d.dte.monto)+(x.proveedor?' · '+esc(x.proveedor.nombre):''),d.dte.estado));
    if(d.crc && !x.adq) D.push(card('CRC',d.crc.n,fdate(d.crc.fecha)));
    if(d.nicsp) D.push(card('Clasificación NICSP',d.nicsp.trat,d.nicsp.inv?'Inventario '+d.nicsp.inv:''));
    if(d.ced) D.push(card('Egreso devengado',d.ced.n,'Asiento '+d.ced.asiento+(d.ced.ref?' · respondido a Adquisiciones':''),d.ced.estado));
    if(d.cesion) D.push(card('Cesión (factoring)',d.cesion.cesionario,(d.cesion.decreto?'Decreto '+d.cesion.decreto:'Decreto de cesión pendiente')+(d.dpAnulado?' · anula '+d.dpAnulado:'')));
    if(d.dp) D.push(card('Decreto de pago',d.dp.n,'Beneficiario: '+esc(d.dp.benef),d.dp.estado));
    if(d.pago) D.push(card('Pago',d.pago.n,esc(d.pago.medio)+' · '+esc(d.pago.benef)+' · asiento '+d.pago.asiento));
  }
  return D.join('')||'<div class="muted small">Aún no hay documentos.</div>';
}
function vExp(){
  const x=S.exps.find(e=>e.id===S.sel); if(!x) return '<div class="empty">Expediente no encontrado.</div>';
  const open=isOpen(x), st=open?STG[cur(x)]:null;
  let card='';
  if(open){
    const mine=st.rol===S.role;
    const fs=st.fields?st.fields(x):[];
    const acts=st.actions(x);
    const err=S.err&&S.err.id===x.id?S.err:null;
    const canCede = ['oc','sinoc'].includes(x.tipo) && ['dp','dp_firma','pago','adq_pago'].includes(cur(x)) && !x.docs.cesion;
    card=`<div class="stagecard"><div class="sh"><div><div class="small muted">Etapa ${x.idx+1} de ${x.stages.length}</div><h2>${esc(st.label)}</h2></div><div class="row">${roleChip(st.rol)} ${supChips(st.sup)}</div></div>
    <div class="sb"><p>${esc(st.desc)}</p>${st.info?st.info(x):''}
    ${err?`<div class="alert crit"><b>No se pudo completar.</b> ${esc(err.msg)} ${err.config?`<div style="margin-top:8px"><button class="btn sm" data-a="gocfg" data-v="${esc(err.config)}">Ir a configuración de cuentas</button></div>`:''}</div>`:''}
    ${mine?`${fs.length?`<div class="fields">${fs.map(fieldHTML).join('')}</div>`:''}
      <div class="row">${acts.map((a,i)=>`<button class="btn ${a.alt?'alt':'pri'}" data-a="act" data-v="${i}" ${a.disabled?'disabled':''}>${esc(a.label)}</button>`).join('')}</div>`
    :`<div class="alert warn">Esta etapa corresponde a <b>${esc(R[st.rol])}</b>. <button class="btn sm" data-a="role" data-v="${st.rol}">Actuar como ${esc(RSHORT[st.rol])}</button></div>`}
    ${canCede?`<div class="doc"><div class="dt"><span>¿La factura fue cedida? (factoring)</span>${supChips(['S10'])}</div><div class="row" style="margin-top:6px"><select id="f_ces" aria-label="Cesionario">${S.cesionarios.map(c=>`<option>${esc(c)}</option>`).join('')}</select><button class="btn sm" data-a="cede">Registrar cesión</button></div></div>`:''}
    <div class="lane-src">Fuente: ${esc(st.src)}</div></div></div>`;
  } else {
    card=`<div class="alert ${['Rechazado','Anulado'].includes(x.estado)?'crit':'ok'}">Expediente finalizado: <b>${esc(x.estado)}</b>.</div>`;
  }
  const steps=`<ol class="steps">${x.stages.map((s,i)=>{ const cls=i<x.idx?'done':(i===x.idx&&open?'cur':'pend'); const auto=s==='i_cid'&&x.docs.cid&&x.docs.cid.modo==='Automático'; return `<li class="${cls}${S.hl===s?' hl':''}"><span class="dot">${i<x.idx?'✓':i+1}</span><span class="sl">${esc(STG[s].label)}${auto?' <span class="muted small">(automático)</span>':''}</span>${roleChip(STG[s].rol)}</li>`; }).join('')}</ol>`;
  const as=S.asientos.filter(a=>a.ref===x.id);
  return `<div class="pagehead"><div><button class="btn sm" data-a="nav" data-v="${x.tipo}">← ${FLOWNAME[x.tipo]}</button>
    <h1 style="margin-top:10px">${esc(x.glosa)} ${casePill(x)}</h1>
    <div class="xhead"><span class="mono">${x.id}</span>${estadoPill(x.estado)}<span class="mono">${fmt(x.monto)}</span>
    ${x.tipo==='ing'?`<span>${esc(x.contrib.nombre)}</span>`:`<span>${esc(x.unidad)}</span><span class="mono">${esc(x.pres)}</span><span>${esc(presOf(x.pres)?.nombre)}</span>${x.proveedor?`<span>${esc(x.proveedor.nombre)}</span>`:''}`}</div></div></div>
  ${adqArrival(x)}${mapBanner(x)}<div class="xgrid"><div class="stack">${card}
    <div class="panel"><div class="ph"><h2>Recorrido del flujo</h2><span class="small muted">${FLOWNAME[x.tipo]}${x.docs.cesion?' · con factoring':''}</span></div><div class="pb">${x.adq?`<div class="doc" style="margin-bottom:10px"><div class="dt"><span>Antes, en Adquisiciones</span><span>✓ completado</span></div><div class="small" style="margin-top:4px">SOLPED → CDP → preobligación → modalidad → OC aceptada (compromiso) → recepción conforme → cruce de 3 vías · ${adqLink(x.adq.folio)}</div></div>`:''}${steps}</div></div>
    ${as.length?`<div class="panel"><div class="ph"><h2>Asientos contables</h2>${supChips(['S3'])}</div><div class="pb stack">${as.map(asientoHTML).join('')}</div></div>`:''}
  </div>
  <div class="stack"><div class="panel"><div class="ph"><h2>Documentos</h2></div><div class="pb stack">${docsHTML(x)}</div></div>
  <div class="panel"><div class="ph"><h2>Historial</h2></div><div class="pb"><ul class="hist">${x.hist.map(h=>`<li><span class="mono small muted">${fdate(h.f)}</span> ${h.rol?roleChip(h.rol):''}<div>${esc(h.txt)}</div></li>`).join('')}</ul></div></div></div></div>`;
}
function vTes(){
  const porPagar=S.exps.filter(x=>isOpen(x)&&['dp','dp_firma','pago','adq_pago','pag_reg','f_susp','f_dec','f_firma','f_rehacer','f_firma_dp','f_pago'].includes(cur(x)));
  const porCobrar=S.exps.filter(x=>x.tipo==='ing'&&isOpen(x));
  const mv=S.movs;
  const saldo=mv.reduce((s,m)=>s+(m.tipo==='abono'?m.monto:-m.monto),0);
  return `<div class="pagehead"><div><h1>Pagos y cobros</h1><p>Decretos por firmar y pagar, órdenes de ingreso por cobrar y movimientos del libro banco de septiembre.</p></div>${supChips(['S1','S2'])}</div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Obligaciones en etapa de pago</h2><span class="cnt">${porPagar.length}</span></div>${porPagar.length?listTable(porPagar):'<div class="empty">No hay obligaciones en etapa de pago.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Ingresos por percibir</h2><span class="cnt">${porCobrar.length}</span></div>${porCobrar.length?listTable(porCobrar):'<div class="empty">No hay órdenes por cobrar.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Libro banco — ${esc(ctaName('111.02'))}</h2><span class="small muted">Movimientos del mes: <b class="mono">${fmt(saldo)}</b></span></div>
  ${mv.length?`<div class="tbl-wrap"><table><tr><th>Fecha</th><th>Glosa</th><th>Medio</th><th class="num">Abono</th><th class="num">Cargo</th></tr>${mv.map(m=>`<tr ${S.exps.some(e=>e.id===m.ref)?`class="click" data-a="open" data-v="${m.ref}"`:''}><td class="mono small">${fdate(m.fecha)}</td><td>${esc(m.glosa)}</td><td class="small">${esc(m.medio)}</td><td class="num">${m.tipo==='abono'?fmt(m.monto):''}</td><td class="num">${m.tipo==='cargo'?fmt(m.monto):''}</td></tr>`).join('')}</table></div>`:'<div class="empty">Sin movimientos.</div>'}</div>
  </div>`;
}
function vConc(){
  const c=S.conc, done=c.estado==='Archivada', st=done?null:CST[c.stages[c.idx]];
  const mine=st&&st.rol===S.role;
  const r=concReport(c);
  const mark=o=>o.m?'<span class="pill ok">Cruzado</span>':'<span class="pill warn">Pendiente</span>';
  const card=done?`<div class="alert ok">Conciliación de ${esc(c.periodo)} archivada.</div>`:
   `<div class="stagecard"><div class="sh"><div><div class="small muted">Paso ${c.idx+1} de ${c.stages.length}</div><h2>${esc(st.label)}</h2></div><div class="row">${roleChip(st.rol)} ${supChips(st.sup)}</div></div>
   <div class="sb"><p>${esc(st.desc)}</p>${c.obsRev&&c.stages[c.idx]==='conciliar'?'<div class="alert warn">El revisor devolvió la conciliación con observaciones.</div>':''}
   ${mine?`<div class="row">${st.actions(c).map((a,i)=>`<button class="btn ${a.alt?'alt':'pri'}" data-a="cact" data-v="${i}">${esc(a.label)}</button>`).join('')}</div>`:`<div class="alert warn">Este paso corresponde a <b>${esc(R[st.rol])}</b>. <button class="btn sm" data-a="role" data-v="${st.rol}">Actuar como ${esc(RSHORT[st.rol])}</button></div>`}
   <div class="lane-src">Fuente: Conciliación bancaria (Contabilidad_Diagramas_SGM)</div></div></div>`;
  const sum=a=>a.reduce((s,x)=>s+Math.abs(x.monto),0);
  const rep=c.informe?`<div class="panel"><div class="ph"><h2>Conciliación al 31-08-2026</h2>${r.bancoAj===r.libroAj?'<span class="pill ok">Cuadra</span>':'<span class="pill crit">No cuadra</span>'}</div><div class="pb two">
    <div class="tbl-wrap"><table><tr><td>Saldo según cartola</td><td class="num">${fmt(r.sb)}</td></tr><tr><td>(−) Cheques girados no cobrados <span class="small muted">${r.chq.length}</span></td><td class="num">${fmt(sum(r.chq))}</td></tr><tr><td>(+) Depósitos en tránsito <span class="small muted">${r.dep.length}</span></td><td class="num">${fmt(sum(r.dep))}</td></tr><tfoot><tr><td>Saldo banco ajustado</td><td class="num">${fmt(r.bancoAj)}</td></tr></tfoot></table></div>
    <div class="tbl-wrap"><table><tr><td>Saldo según libro banco</td><td class="num">${fmt(r.sl)}</td></tr><tr><td>(−) Cargos bancarios no contabilizados <span class="small muted">${r.cb.length}</span></td><td class="num">${fmt(sum(r.cb))}</td></tr><tr><td>(+) Abonos no identificados <span class="small muted">${r.ab.length}</span></td><td class="num">${fmt(sum(r.ab))}</td></tr><tfoot><tr><td>Saldo libro ajustado</td><td class="num">${fmt(r.libroAj)}</td></tr></tfoot></table></div></div></div>`:'';
  return `<div class="pagehead"><div><h1>Conciliación bancaria · ${esc(c.periodo)}</h1><p>${esc(ctaName(c.cta))}. Saldo inicial ${fmt(c.ini)}.</p></div></div>
  <div class="stack">${S.fromMap==='conc'?`<div class="alert sup">Desde el mapa${S.hl?': <b>'+esc(CST[S.hl].label)+'</b> ('+esc(CNODE[S.hl])+')':''}. <button class="btn sm" data-a="backmap">← Volver al mapa</button></div>`:''}${card}
  <div class="panel"><div class="ph"><h2>Pasos</h2></div><div class="pb"><ol class="steps">${c.stages.map((s,i)=>`<li class="${i<c.idx||done?'done':i===c.idx?'cur':'pend'}${S.hl===s?' hl':''}"><span class="dot">${i<c.idx||done?'✓':i+1}</span><span class="sl">${esc(CST[s].label)}</span>${roleChip(CST[s].rol)}</li>`).join('')}</ol></div></div>
  ${rep}
  <div class="two">
    <div class="panel"><div class="ph"><h2>Libro banco</h2><span class="small muted">${c.libro.filter(l=>l.m).length}/${c.libro.length} cruzados</span></div><div class="tbl-wrap"><table><tr><th>Fecha</th><th>Glosa</th><th class="num">Monto</th><th></th></tr>${c.libro.map(l=>`<tr><td class="mono small">${fdate(l.fecha).slice(0,5)}</td><td class="small">${esc(l.glosa)}<div class="muted">${esc(l.medio)}</div></td><td class="num">${fmt(signed(l))}</td><td>${mark(l)}</td></tr>`).join('')}</table></div></div>
    <div class="panel"><div class="ph"><h2>Cartola bancaria</h2><span class="small muted">${c.cartola?c.banco.filter(b=>b.m).length+'/'+c.banco.length+' cruzados':'No cargada'}</span></div>${c.cartola?`<div class="tbl-wrap"><table><tr><th>Fecha</th><th>Descripción</th><th class="num">Monto</th><th></th></tr>${c.banco.map(b=>`<tr><td class="mono small">${fdate(b.fecha).slice(0,5)}</td><td class="small mono">${esc(b.desc)}</td><td class="num">${fmt(b.monto)}</td><td>${mark(b)}</td></tr>`).join('')}</table></div>`:'<div class="empty">Carga la cartola en el primer paso.</div>'}</div>
  </div>
  ${c.hist.length?`<div class="panel"><div class="ph"><h2>Historial</h2></div><div class="pb"><ul class="hist">${c.hist.map(h=>`<li>${roleChip(h.rol)} ${esc(h.txt)}</li>`).join('')}</ul></div></div>`:''}
  </div>`;
}
function vPres(){
  const T=S.pres.reduce((a,p)=>{['vig','preob','comp','dev','pag'].forEach(k=>a[k]+=p[k]);return a;},{vig:0,preob:0,comp:0,dev:0,pag:0});
  const TI=S.presIng.reduce((a,p)=>{['vig','dev','perc'].forEach(k=>a[k]+=p[k]);return a;},{vig:0,dev:0,perc:0});
  const bar=(p)=>{ const w=v=>Math.max(0,Math.min(100,v/p.vig*100)).toFixed(1); return `<div class="bar" style="width:120px"><i style="width:${w(p.pag)}%;background:var(--ok)"></i><i style="width:${w(p.dev-p.pag)}%;background:var(--accent)"></i><i style="width:${w(p.comp-p.dev)}%;background:var(--warn)"></i><i style="width:${w(p.preob)}%;background:var(--sup)"></i></div>`; };
  return `<div class="pagehead"><div><h1>Ejecución presupuestaria 2026</h1><p>Se actualiza con cada CDP, compromiso, devengado, pago y percibido registrado en los flujos.</p></div>${supChips(['S5','S9'])}</div>
  <div class="stack"><div class="panel"><div class="ph"><h2>Gastos</h2><span class="small muted"><span style="color:var(--ok)">■</span> pagado <span style="color:var(--accent)">■</span> devengado <span style="color:var(--warn)">■</span> comprometido <span style="color:var(--sup)">■</span> preobligado</span></div>
  <div class="tbl-wrap"><table><tr><th>Cuenta</th><th class="num">Vigente</th><th class="num">Preobligado</th><th class="num">Comprometido</th><th class="num">Devengado</th><th class="num">Pagado</th><th class="num">Disponible</th><th></th></tr>
  ${S.pres.map(p=>`<tr><td><span class="mono">${p.cod}</span><div class="small muted">${esc(p.nombre)}</div></td><td class="num">${fmt(p.vig)}</td><td class="num">${fmt(p.preob)}</td><td class="num">${fmt(p.comp)}</td><td class="num">${fmt(p.dev)}</td><td class="num">${fmt(p.pag)}</td><td class="num" style="${saldo(p)<2000000?'color:var(--crit)':''}">${fmt(saldo(p))}</td><td>${bar(p)}</td></tr>`).join('')}
  <tfoot><tr><td>Total</td><td class="num">${fmt(T.vig)}</td><td class="num">${fmt(T.preob)}</td><td class="num">${fmt(T.comp)}</td><td class="num">${fmt(T.dev)}</td><td class="num">${fmt(T.pag)}</td><td class="num">${fmt(T.vig-T.preob-T.comp)}</td><td></td></tr></tfoot></table></div></div>
  <div class="panel"><div class="ph"><h2>Ingresos</h2></div><div class="tbl-wrap"><table><tr><th>Cuenta</th><th class="num">Estimado</th><th class="num">Devengado</th><th class="num">Percibido</th><th class="num">Por percibir</th></tr>
  ${S.presIng.map(p=>`<tr><td><span class="mono">${p.cod}</span><div class="small muted">${esc(p.nombre)}</div></td><td class="num">${fmt(p.vig)}</td><td class="num">${fmt(p.dev)}</td><td class="num">${fmt(p.perc)}</td><td class="num">${fmt(p.dev-p.perc)}</td></tr>`).join('')}
  <tfoot><tr><td>Total</td><td class="num">${fmt(TI.vig)}</td><td class="num">${fmt(TI.dev)}</td><td class="num">${fmt(TI.perc)}</td><td class="num">${fmt(TI.dev-TI.perc)}</td></tr></tfoot></table></div></div>
  <div class="alert sup small">Preobligado y comprometido de las compras los generan Adquisiciones (1.6 y 3.4) y Presupuestos; aquí se muestran como lectura. El devengado y el pagado sí se mueven con este prototipo (efecto presupuestario del "devengo dual", pendiente C-1 del plan de Contabilidad). Los montos anteriores a septiembre son saldos de ejemplo.</div></div>`;
}
function vDiario(){
  const tabs=['Todos','Contabilizado','Borrador'];
  const L=S.asientos.filter(a=>S.diarioTab==='Todos'||a.estado===S.diarioTab);
  const td=L.filter(a=>a.estado==='Contabilizado').reduce((s,a)=>s+a.lineas.reduce((t,l)=>t+l.debe,0),0);
  return `<div class="pagehead"><div><h1>Libro diario</h1><p>Asientos generados automáticamente por los flujos. Total debe contabilizado en la vista: <b class="mono">${fmt(td)}</b>.</p></div>${supChips(['S3'])}</div>
  <div class="tabs">${tabs.map(t=>`<button data-a="dtab" data-v="${t}" class="${S.diarioTab===t?'on':''}">${t}</button>`).join('')}</div>
  <div class="stack">${L.length?L.map(a=>`<div>${asientoHTML(a)}${S.exps.some(e=>e.id===a.ref)?`<div class="small" style="margin-top:4px"><a href="#" data-a="open" data-v="${a.ref}">Ver expediente ${a.ref}</a></div>`:''}</div>`).join(''):'<div class="empty">Sin asientos.</div>'}</div>`;
}
function vInv(){
  return `<div class="pagehead"><div><h1>Inventario</h1><p>Bienes dados de alta al clasificarse como activo en la recepción conforme.</p></div>${supChips(['S13'])}</div>
  <div class="panel">${S.inventario.length?`<div class="tbl-wrap"><table><tr><th>Código</th><th>Descripción</th><th>Cuenta</th><th>Alta</th><th class="num">Valor</th></tr>${S.inventario.map(b=>`<tr class="click" data-a="open" data-v="${b.ref}"><td class="mono">${b.code}</td><td>${esc(b.desc)}</td><td class="small"><span class="mono">${esc(b.cta)}</span> ${esc(ctaName(b.cta))}</td><td class="mono small">${fdate(b.fecha)}</td><td class="num">${fmt(b.valor)}</td></tr>`).join('')}</table></div>`:'<div class="empty">Sin bienes registrados.</div>'}</div>`;
}
function vCfg(){
  const opts=(list,sel)=>`<option value="" ${!sel?'selected':''}>— sin configurar —</option>`+list.map(c=>`<option value="${c.cod}" ${c.cod===sel?'selected':''}>${c.cod} · ${esc(c.nombre)}</option>`).join('');
  return `<div class="pagehead"><div><h1>Configuración de cuentas</h1><p>Cuentas relacionadas de cada cuenta por pagar: con qué cuenta se registra el egreso devengado y con cuál el egreso pagado. Sin esta configuración no se puede crear el egreso devengado.</p></div>${supChips(['S3'])}</div>
  ${S.returnTo?`<div class="alert warn" style="margin-bottom:12px">Configura la cuenta marcada y vuelve al expediente para reintentar. <button class="btn sm" data-a="open" data-v="${S.returnTo}">Volver a ${S.returnTo}</button></div>`:''}
  <div class="stack"><div class="panel"><div class="ph"><h2>Cuentas relacionadas (egresos)</h2>${roleChip('adm')}</div><div class="tbl-wrap"><table><tr><th>Cuenta por pagar</th><th>Imputación</th><th>Contra egreso devengado</th><th>Contra egreso pagado</th></tr>
  ${S.cuentas.map((c,i)=>`<tr style="${S.cfgHl===c.cod?'outline:2px solid var(--crit);outline-offset:-2px':''}"><td><span class="mono">${c.cod}</span><div class="small muted">${esc(c.nombre)}</div></td><td class="mono small">${c.pres}</td>
  <td><select data-cfg="dev" data-i="${i}" aria-label="Contra egreso devengado ${esc(c.cod)}">${opts(S.ctaDeb,c.dev)}</select></td><td><select data-cfg="pag" data-i="${i}" aria-label="Contra egreso pagado ${esc(c.cod)}">${opts(S.bancos,c.pag)}</select></td></tr>`).join('')}</table></div></div>
  <div class="panel"><div class="ph"><h2>Ingresos</h2></div><div class="pb stack">
    <label class="check"><input type="checkbox" id="cfg_auto" data-cfg="auto" ${S.cfg.autoCID?'checked':''}> <span><b>Generar automáticamente el comprobante de ingreso devengado al confirmar una orden.</b><br><span class="muted small">Si se desactiva, las órdenes confirmadas pasan a revisión manual de Contabilidad.</span> ${supChips(['S12'])}</span></label>
    <div class="tbl-wrap"><table><tr><th>Cuenta presupuestaria</th><th>Cuenta por cobrar</th><th>Cuenta de ingreso</th></tr>${S.presIng.map(p=>`<tr><td><span class="mono">${p.cod}</span> ${esc(p.nombre)}</td><td class="mono small">${p.cxc}</td><td class="mono small">${p.ing}</td></tr>`).join('')}</table></div>
  </div></div>
  <div class="panel"><div class="ph"><h2>Datos del prototipo</h2></div><div class="pb row"><span class="muted small">Los cambios se guardan solo en este navegador.</span><button class="btn alt" data-a="reset">Restablecer datos de ejemplo</button></div></div>
  <div class="alert sup small">Los códigos patrimoniales (531…, 141…, 451…) son ilustrativos y deben reemplazarse por el plan de cuentas vigente de la CGR.</div></div>`;
}
function vSup(){
  return `<div class="pagehead"><div><h1>Supuestos del prototipo</h1><p>Decisiones que los diagramas no resolvían. El prototipo las completa con la práctica habitual para poder recorrer los flujos de punta a punta; cada una debe validarse con Contabilidad municipal antes de la especificación técnica.</p></div></div>
  <div class="suplist">${Object.entries(SUP).map(([k,s])=>`<div class="supitem ${S.supHl===k?'hl':''}" id="sup_${k}"><div class="id">${k}</div><div><h3>${esc(s.t)} ${s.res?'<span class="pill ok">Resuelto en Adquisiciones</span>':''}</h3><p>${esc(s.p)}</p><p class="small muted">Origen: ${esc(s.src)}</p>${s.res?`<p class="small">${extLink('Ver '+esc(s.res.t), adqUrl(s.res.url, s.res.folio))}</p>`:''}</div></div>`).join('')}</div>`;
}

/* ---------- Mapa de flujos ---------- */
const NODE = {
  req:'Generar Requerimiento de Compra / Memorándum',
  cdp:'Evaluar Disponibilidad Presupuestaria · ¿Existe Saldo Disponible? · Emitir Certificado de Disponibilidad (CDP) · Devolver a Unidad o Solicitar Modificación',
  compra:'Gestionar Proceso de Compra (Licitación / Trato Directo)',
  adj:'Aprobar Decreto de Adjudicación',
  compromiso:'Registro Contable de Preobligación (Compromiso Cierto)',
  oc:'Emisión de Orden de Compra (Mercado Público) · Emisión y Envío de OC',
  oc_acept:'¿OC Aceptada por Proveedor? · Notificar a Unidad Solicitante / Re-evaluar',
  recep:'Recepción Física de Bienes · ¿Cotejo con OC / Correcto? · Generar Acta de Observaciones y Rechazo · Recepción y Visación de Productos/Servicios',
  vb:'Solicitar V°B° Técnico · Firma de V°B° Técnico · Firma de Acta de Recepción Conforme',
  dte_crc:'Verificación DTE y Emisión CRC (Mercado Público) · ¿DTE Acorde a OC? · Generar Rechazo de DTE · Registrar Reclamo o Rechazo DTE',
  nicsp:'Clasificación NICSP y Codificación (el alta la marca Adquisiciones 4.3; la registra Contabilidad MC-3)',
  match:'Match 3 Vías (OC + CRC + DTE) · Integración de Expediente (OC + DTE + CRC + Acta)',
  ced:'1. Seleccionar Registro de Compra · 2. Clic en "Crear Egreso Devengado" · ¿Cuenta tiene cuenta de devengo? · ALERTA / ERROR · 3. Generación CED (Borrador)',
  ced_conf:'4. Revisar y Cuadrar Asiento (Debe / Haber / Beneficiario) · 5. Validar Factura y Recepción · 6. Estado CONFIRMADO · Registro Contable del Devengado',
  adq_pago:'Emisión de Decreto de Pago · Pago (dibujados en Contabilidad; en la nueva arquitectura los orquesta Adquisiciones 5.3–5.4)',
  pag_reg:'(no dibujado) Egreso pagado — contrato Tesorería → Contabilidad',
  dp:'Emisión de Decreto de Pago · Elaborar Decreto de Pago',
  dp_firma:'Firmar Decreto de Pago Regular',
  pago:'Pago Regular · Actualizar factura regular (pago no dibujado en obligaciones: S2)',
  f_susp:'Seleccionar factura · Revisar · Decidir (X) · Intermedio Suspender Pago · Suspender Pago (MC-7: orden de Contabilidad a Tesorería)',
  f_dec:'Elaborar Decreto Alcaldicio de Cesión',
  f_firma:'Firmar Decreto de Cesión',
  f_rehacer:'Elaborar / Rehacer Decreto de Pago',
  f_firma_dp:'Firmar Decreto de Pago',
  f_pago:'Pagar · Actualizar factura',
  s_analisis:'Emisión de Documento Tributario (DTE) · Recepción y Análisis Técnico del Cobro · ¿Cobro y Servicio Correctos? · Generar Rechazo de DTE en Portal SII',
  s_vb:'Emisión de V°B° / Acta de Conformidad de Servicio',
  s_imput:'Imputación y Verificación de Saldo Presupuestario · ¿Presupuesto Disponible? · Solicitar Modificación o Suplemento',
  s_exped:'Validación y Envío de Expediente · Recepción de Expediente (DTE + V°B° + Imputación)',
  i_borr:'Crear Nueva Orden de Ingreso · Seleccionar Depto. y Fechas · Buscar Contribuyente · Agregar Ítem y Monto · Guardar Orden [Borrador] · Ejecutar Acción [Confirmar]',
  i_cid:'¿Auto-generar Comprobante Activo? · Generar Comprobante Contable (CID) · Revisión Manual y Aprobación · Comprobante Confirmado',
  i_perc:'Recepcionar Pago / Registrar Ingreso Percibido (página "Ingreso Percibido" vacía: S1)'
};
const CNODE = {recopilar:'Recopilar antecedentes banco', cheques:'Cotejar cheques', tarjetas:'Cotejar información pagos con tarjeta', comparar:'Comparar Libro Banco con Cartola Bancaria', conciliar:'Conciliar', revisar:'Revisar y Autorizar (Revisor)', autorizar:'Revisar y Autorizar (DAF)', archivar:'Archivar'};

const L = (label, a, v) => `<a href="#" data-a="${a}" data-v="${esc(v)}">${label}</a>`;
function flowDefs(){ return [
  {key:'oc', title:'Obligaciones que llegan desde Adquisiciones', stages:FLOWS.oc, tipo:'oc',
   src:['Contabilidad_Diagramas_SGM › 02- Registro Egreso devengado','registro_obligaciones.drawio (solo "Registro Contable del Devengado")','proceso_inventario_Recepcion_Conforme.drawio (solo "Clasificación NICSP")'],
   how:[
     `Todo lo anterior al devengado (SOLPED, CDP, preobligación, modalidad, OC, recepción, cruce de 3 vías) está en el ${extLink('módulo Adquisiciones',adqUrl('index.html'))}. La tabla "Qué quedó en Adquisiciones" más abajo enlaza cada nodo de tus diagramas a su pantalla.`,
     `Desde Adquisiciones: abre ${extLink('5.1 Cruce de 3 vías de ADQ-2026-00123',adqUrl('procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123'))}, completa el match y pulsa "Registrar devengado en Contabilidad (5.2)". Llegas aquí con la solicitud precargada; si la envías dos veces, Contabilidad abre la existente en vez de crear otra.`,
     `O simúlala desde aquí: ${L('Simular solicitud de devengado','nav','new-oc')} viene precargado con ${adqLink('ADQ-2026-00123','ADQ-2026-00123')} (Insumos de oficina, $1.180.000).`,
     `Error de configuración (diagrama 02): ${L('Servicio de aseo','openg','Servicio de aseo')} como Contabilidad → "Crear egreso devengado" → alerta → "Ir a configuración de cuentas" → elige la cuenta → vuelve y reintenta.`,
     `Bien inventariable: ${L('Notebooks Oficina de Partes','openg','Notebooks')} → crea y confirma el CED → etapa "Alta de activo fijo" → aparece en ${L('Inventario','nav','inv')}.`,
     `Pago: ${L('Señalética peatonal','openg','Señalética')} (${adqLink('ADQ-2026-00202','ADQ-2026-00202')}, en 5.4 en Adquisiciones) → "Simular: pago completado" → Contabilidad registra el egreso pagado.`,
     `Efectos: ${L('Libro diario','nav','diario')}, ${L('Libro banco','nav','tes')} y ${L('Ejecución presupuestaria','nav','pres')} (devengado y pagado).`]},
  {key:'sinoc', title:'Gasto sin orden de compra (servicios básicos, arriendos)', stages:FLOWS.sinoc, tipo:'sinoc',
   src:['Registro_obligaciones_sin_oc.drawio'],
   how:[
     `Registra una factura: ${L('Registrar factura recibida','nav','new-sinoc')}. Queda en Análisis técnico del cobro.`,
     `Rama NO (cobro incorrecto): ${L('Arriendo oficina DIDECO','openg','Arriendo oficina')} → "Rechazar DTE en el SII" → el expediente termina como Rechazado.`,
     `Sin saldo (S4): ${L('Consumo eléctrico alumbrado público','openg','Consumo eléctrico')} como Presupuesto → "Solicitar modificación o suplemento" → "Registrar suplemento" → "Imputar y comprometer" (caso C8 de la Guía de demo).`,
     `Camino completo: ${L('Agua potable','openg','Agua potable')} desde el análisis técnico hasta el pago (caso C7).`]},
  {key:'ing', title:'Ingreso devengado y percibido', stages:FLOWS.ing, tipo:'ing',
   src:['Ingreso devengado e Ingreso Percibido › Ingreso Devengado','Ingreso devengado e Ingreso Percibido › Ingreso Percibido (vacía)'],
   how:[
     `El ejemplo del diagrama ($68.000): ${L('Patente comercial — Almacén El Roble','openg','Patente comercial')} como Unidad emisora → "Confirmar orden" → el CID se genera solo (ver Documentos y asiento).`,
     `Crea otra: ${L('Nueva orden de ingreso','nav','new-ing')} (departamento, fechas, contribuyente por RUT/nombre/correo, ítems).`,
     `Rama NO (revisión manual): desactiva la generación automática en ${L('Configuración de cuentas','nav','cfg')}, confirma una orden y quedará en Revisión manual de Contabilidad.`,
     `Percibido (S1): después de confirmar la ${L('Patente comercial','openg','Patente comercial')}, como Tesorería → "Registrar pago recibido" → CIP, abono en libro banco y percibido presupuestario.`]},
  {key:'factoring', title:'Factoring (cesión de facturas)', stages:FLOWS.factoring, tipo:'factoring',
   src:['Contabilidad_Diagramas_SGM › Factoring 2'],
   how:[
     `Abre ${L('Tóner impresoras DAF','openg','Tóner')} (caso C6, esperando el pago en Adquisiciones/Tesorería). En el recuadro "¿La factura fue cedida?" elige el cesionario y pulsa "Registrar cesión".`,
     `El recorrido se reemplaza por los 6 pasos de este carril: Contabilidad ordena la suspensión a Tesorería, DAF y Alcaldía tramitan el decreto de cesión y el nuevo decreto de pago, Tesorería paga al cesionario.`,
     `En Documentos verás la cesión, el decreto original anulado y el nuevo a nombre del cesionario.`,
     `Rama "no cedida" = pago regular: ${L('Agua potable','openg','Agua potable')} (sin OC) → decreto → Alcaldía firma → Tesorería paga.`,
     `Adquisiciones aún no modela la cesión: su 5.3 y 5.4 asumen que el beneficiario es el proveedor. Es un borde a acordar (plan de Contabilidad, MC-7).`]},
  {key:'conc', title:'Conciliación bancaria', stages:S.conc.stages, tipo:'conc',
   src:['Contabilidad_Diagramas_SGM › Conciliación Bancaria'],
   how:[
     `Abre la ${L('conciliación de agosto','nav','conc')} como Tesorería y avanza paso a paso: cada cotejo marca movimientos como "Cruzado".`,
     `En "Conciliar" contabiliza las comisiones bancarias y genera el informe (cuadra banco vs. libro).`,
     `Luego visa el Revisor (puede devolver) y autoriza y archiva DAF.`]}
]; }
function stageRol(f,s){ return f.key==='conc'?CST[s].rol:STG[s].rol; }
function stageLabel(f,s){ return f.key==='conc'?CST[s].label:STG[s].label; }
function stageCount(f,s){ if(f.key==='conc') return S.conc.estado!=='Archivada'&&S.conc.stages[S.conc.idx]===s?1:0; return S.exps.filter(x=>isOpen(x)&&cur(x)===s).length; }
function swimlane(f){
  const roles=[...new Set(f.stages.map(s=>stageRol(f,s)))];
  const n=f.stages.length;
  return `<div class="tbl-wrap"><div class="lane" style="grid-template-columns:120px repeat(${n}, 136px);grid-template-rows:repeat(${roles.length}, auto)">
  ${roles.map((r,i)=>`<div class="lane-r" style="grid-row:${i+1}">${esc(RSHORT[r])}</div><div class="lane-bg" style="grid-row:${i+1};grid-column:2 / span ${n}"></div>`).join('')}
  ${f.stages.map((s,j)=>{ const c=stageCount(f,s); const r=roles.indexOf(stageRol(f,s)); const sp=(f.key==='conc'?CST[s].sup:STG[s].sup)||[];
     return `<button class="lane-s ${c?'live':''}" style="grid-row:${r+1};grid-column:${j+2}" data-a="goto" data-v="${f.key}:${s}" title="${esc(f.key==='conc'?CNODE[s]:NODE[s])}"><span class="mono small">${j+1}</span> ${esc(stageLabel(f,s))}${c?`<span class="cnt">${c}</span>`:''}${sp.length?`<span class="sup-dot">${sp.join(' ')}</span>`:''}</button>`; }).join('')}
  </div></div>`;
}
function vFlujos(){
  const cov=[
    ['Registro de preobligacion.drawio','Flujo de Preobligaciones','adq','Adquisiciones 1.1–1.6 y 3.x','adqmap'],
    ['proceso_inventario_Recepcion_Conforme.drawio','Proceso Inventario Municipal','mix','Adquisiciones 4.1–4.5 y 5.1 · alta de activo en Contabilidad','adqmap'],
    ['registro_obligaciones.drawio','Registro Obligaciones','mix','Adquisiciones 3.3–5.4 · devengado en Contabilidad','oc'],
    ['Registro_obligaciones_sin_oc.drawio','Obligaciones sin OC','ok','Gasto sin OC, 9 etapas','sinoc'],
    ['Contabilidad_Diagramas_SGM','02- Registro Egreso devengado','ok','Etapas CED + Configuración de cuentas','oc'],
    ['Contabilidad_Diagramas_SGM','Factoring 2','ok','Factoring, 6 etapas','factoring'],
    ['Contabilidad_Diagramas_SGM','Conciliación Bancaria','ok','Conciliación, 8 pasos','conc'],
    ['Ingreso devengado e Ingreso Percibido','Ingreso Devengado','ok','Ingreso, etapas 1–2','ing'],
    ['Ingreso devengado e Ingreso Percibido','Ingreso Percibido','sup','Ingreso, etapa 3 (página vacía → S1)','ing'],
    ['Contabilidad_Diagramas_SGM','Inventario (dar de baja)','part','Solo alta de activos; la baja con decreto no está incluida','inv'],
    ['Contabilidad_Diagramas_SGM','02 - Egreso Devengado (esbozo)','ok','Cubierto por "02- Registro Egreso devengado"','oc'],
    ['Contabilidad_Diagramas_SGM','04 - Registro de Obligaciones (esbozo)','mix','Cubierto por registro_obligaciones.drawio','oc'],
    ['Contabilidad_Diagramas_SGM','06 - Cierre Mensual · 07 - Cierre Anual','no','Fuera del alcance acordado (esbozos)',null]
  ];
  const pill={adq:'<span class="pill acc">En Adquisiciones</span>',mix:'<span class="pill acc">Adquisiciones + Contabilidad</span>',ok:'<span class="pill ok">Implementado</span>',sup:'<span class="pill" style="background:var(--sup-soft);color:var(--sup)">Con supuesto</span>',part:'<span class="pill warn">Parcial</span>',no:'<span class="pill crit">No incluido</span>'};
  const F=flowDefs();
  return `<div class="pagehead"><div><h1>Mapa de flujos</h1><p>Todos los flujos de Contabilidad, dibujados por carril (rol) como en los diagramas. La parte de compras vive en el prototipo de Adquisiciones: ver "Qué quedó en Adquisiciones". Cada etapa es un enlace: cambia al rol correcto y abre un expediente detenido en esa etapa, o uno que ya pasó por ella. El número sobre una etapa indica cuántos expedientes hay ahí ahora.</p></div></div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Cobertura de los 13 diagramas de la carpeta Flujos</h2><div class="row small">${F.map(f=>`<a href="#fl_${f.key}" data-a="jump" data-v="fl_${f.key}">${esc(f.title.split(' (')[0])}</a>`).join(' · ')} · <a href="#fl_adq" data-a="jump" data-v="fl_adq">Qué quedó en Adquisiciones</a></div></div>
  <div class="tbl-wrap"><table><tr><th>Archivo</th><th>Diagrama</th><th>Estado</th><th>Dónde está en el prototipo</th><th></th></tr>
  ${cov.map(c=>`<tr><td class="small mono">${esc(c[0])}</td><td>${esc(c[1])}</td><td>${pill[c[2]]}</td><td class="small">${esc(c[3])}</td><td style="white-space:nowrap">${c[4]?(c[4]==='inv'?L('Ver','nav','inv'):c[4]==='adqmap'?L('Ver mapeo','jump','fl_adq'):L('Ver flujo','jump','fl_'+c[4])):''}</td></tr>`).join('')}</table></div></div>
  ${F.map(f=>`<section class="panel" id="fl_${f.key}"><div class="ph"><h2>${esc(f.title)}</h2><span class="small muted">${f.stages.length} etapas</span></div><div class="pb stack">
    <div class="small muted">Diagramas fuente: ${f.src.map(s=>`<span class="mono">${esc(s)}</span>`).join(' · ')}</div>
    ${swimlane(f)}${f.stages.length>7?'<div class="small muted">Desliza el diagrama hacia la derecha para ver todas las etapas.</div>':''}
    <details class="how" open><summary><b>Cómo comprobarlo</b></summary><ol>${f.how.map(h=>`<li>${h}</li>`).join('')}</ol></details>
    <details class="how"><summary><b>Etapa por etapa: nodo del diagrama que representa</b></summary><div class="tbl-wrap"><table><tr><th>#</th><th>Etapa del prototipo</th><th>Rol</th><th>Nodos del diagrama</th><th></th></tr>
    ${f.stages.map((s,j)=>`<tr><td class="mono">${j+1}</td><td>${esc(stageLabel(f,s))}</td><td>${roleChip(stageRol(f,s))}</td><td class="small">${esc(f.key==='conc'?CNODE[s]:NODE[s])} ${supChips((f.key==='conc'?CST[s].sup:STG[s].sup))}</td><td>${L('Ver','goto',f.key+':'+s)}</td></tr>`).join('')}</table></div></details>
  </div></section>`).join('')}
  ${adqMapHTML()}
  <div class="panel" id="fl_cfg"><div class="ph"><h2>Subproceso: configuración de cuentas</h2>${roleChip('adm')}</div><div class="pb small">Nodo "SUBPROCESO: Configuración de Cuentas" del diagrama 02: ${L('Configuración de cuentas','nav','cfg')} → columna "Contra egreso devengado" / "Contra egreso pagado". La cuenta 215.22.08.001 viene sin configurar a propósito para reproducir la alerta.</div></div>
  </div>`;
}
const ADQMAP=[
  ['Generar Requerimiento de Compra / Memorándum','1.1 Creación de solicitud (SOLPED)','procesos-transversales/11-creacion-solped','ADQ-2026-00123',''],
  ['(no dibujado)','1.2 Visto bueno de jefatura','procesos-transversales/12-visto-bueno-jefatura','ADQ-2026-00123','Firma FEA vía FirmaGob'],
  ['Evaluar Disponibilidad Presupuestaria · ¿Existe Saldo Disponible?','1.3 Clasificación y verificación presupuestaria','procesos-transversales/13-verificacion-disponibilidad','ADQ-2026-00123',''],
  ['Devolver a Unidad o Solicitar Modificación','1.4 Solicitar financiamiento a DAF','procesos-transversales/16-solicitar-financiamiento','ADQ-2026-00142','Resuelve S4 para compras'],
  ['Emitir Certificado de Disponibilidad (CDP)','1.5 Emisión de CDP firmado','procesos-transversales/14-emision-cdp','ADQ-2026-00123',''],
  ['Registro Contable de Preobligación (Compromiso Cierto)','1.6 Preobligación · 3.4 compromiso cierto','procesos-transversales/15-preobligacion','ADQ-2026-00123','Resuelve S5: no es registro contable'],
  ['Gestionar Proceso de Compra (Licitación / Trato Directo)','2.1–2.3 Modalidad y vínculo MP · etapa 3 por modalidad','procesos-transversales/21-ratificacion-modalidad','ADQ-2026-00123','4 modalidades'],
  ['Aprobar Decreto de Adjudicación','3.10 Resolución de adjudicación (Licitación)','3-licitacion-publica/310-resolucion-adjudicacion','ADQ-2026-00045',''],
  ['Emisión de Orden de Compra (Mercado Público)','3.3 Emisión de la OC','1-compra-agil/33-emision-oc','ADQ-2026-00123',''],
  ['¿OC Aceptada por Proveedor? · Notificar / Re-evaluar','3.4 Aceptación · 3.5 Rechazo de la OC','1-compra-agil/35-rechazo-oc','ADQ-2026-00123','Resuelve S6'],
  ['Recepción Física · ¿Cotejo con OC? · Recepción y Visación','4.1 Registro de la recepción','procesos-transversales/41-recepcion-conforme','ADQ-2026-00123',''],
  ['V°B° Técnico · Firma de Acta de Recepción Conforme','4.2 Verificación de conformidad (doble conformidad)','00-expediente/','ADQ-2026-00123','Sin pantalla aún'],
  ['Generar Acta de Observaciones y Rechazo','4.5 Recepción no conforme','00-expediente/','ADQ-2026-00123','Sin pantalla aún · resuelve S7'],
  ['Clasificación NICSP y Codificación','4.3 Alta en inventario / activo fijo (marca)','00-expediente/','ADQ-2026-00123','El alta contable queda en Contabilidad (etapa "Alta de activo fijo")'],
  ['Verificación DTE · ¿DTE Acorde a OC? · Rechazo DTE','5.1 (factura desde SII) · circuito DTE de Tesorería','procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123',''],
  ['Match 3 Vías (OC + CRC + DTE) · Integración de Expediente','5.1 Cruce de 3 vías','procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123',''],
  ['Registro Contable del Devengado (Obligación)','4.4 / 5.2 → contrato con Contabilidad','','','Lo hace este prototipo (CED)'],
  ['Emisión de Decreto de Pago','5.3 Decreto de pago (DocDigital)','00-expediente/','ADQ-2026-00202','Sin pantalla aún'],
  ['(pago)','5.4 Ejecución del pago (Tesorería)','00-expediente/','ADQ-2026-00202','Sin pantalla aún · Contabilidad registra el egreso pagado']
];
function adqMapHTML(){
  return `<section class="panel" id="fl_adq"><div class="ph"><h2>Qué quedó en Adquisiciones</h2>${extLink('Abrir el módulo',adqUrl('index.html'))}</div><div class="pb stack">
  <p class="small" style="margin:0">Cada nodo de tus diagramas de compra, con el sub-paso del prototipo de Adquisiciones que lo cubre. Los enlaces abren la pantalla de ese sub-paso dentro de este mismo sitio; usa el menú lateral para volver a Contabilidad.</p>
  <div class="tbl-wrap"><table><tr><th>Nodo del diagrama</th><th>Sub-paso en Adquisiciones</th><th>Nota</th><th></th></tr>
  ${ADQMAP.map(r=>`<tr><td class="small">${esc(r[0])}</td><td>${esc(r[1])}</td><td class="small muted">${esc(r[4])}</td><td>${r[2]?extLink(r[2].startsWith('00-')?'Expediente':'Pantalla',adqUrl(r[2],r[3])):L('Ver','jump','fl_oc')}</td></tr>`).join('')}</table></div>
  <div class="alert warn small"><b>Para alinear con el equipo de Adquisiciones:</b>
  <ol style="margin:6px 0 0;padding-left:18px">
  <li>El devengado aparece dos veces: 4.4 (<span class="mono">recordAccrual</span> al confirmar la recepción) y 5.2 (<span class="mono">registerAccrual</span> después del cruce de 3 vías). Contabilidad debería recibir una sola solicitud; hay que definir cuál.</li>
  <li>4.3 declara <span class="mono">registerInventoryEntry</span> sin dueño (X-44); el plan de Contabilidad propone el alta de activos en el devengado (MC-3).</li>
  <li>5.3 y 5.4 asumen que se paga al proveedor. Con factoring (MC-7) el beneficiario puede ser un cesionario y Contabilidad debe poder suspender el decreto en curso.</li>
  </ol></div></div></section>`;
}
function findExample(key, s){
  const tipos = key==='factoring'?['oc','sinoc']:[key];
  const E=S.exps.filter(x=>tipos.includes(x.tipo));
  let x=E.find(x=>isOpen(x)&&cur(x)===s); if(x) return {x, how:'now'};
  x=E.find(x=>x.stages.includes(s)&&x.stages.indexOf(s)<x.idx); if(x) return {x, how:'past'};
  if(key==='factoring'){ for(const t of tipos){ x=E.find(x=>x.tipo===t&&isOpen(x)&&['dp','dp_firma','pago','adq_pago'].includes(cur(x))&&!x.docs.cesion); if(x) return {x, how:'cede'}; } }
  const target=FLOWS[key]?FLOWS[key].indexOf(s):-1;
  x=E.find(x=>isOpen(x)&&x.idx<target); if(x) return {x, how:'before'};
  return null;
}
function gotoStage(v){
  const [key,s]=v.split(':');
  S.fromMap=key; S.err=null;
  if(key==='conc'){ S.hlHow=null; const st=S.conc.stages[S.conc.idx]; S.role=CST[s===st?s:st]?.rol||S.role; S.hl=s; go('conc'); return; }
  const r=findExample(key,s);
  if(!r){ toast('No hay expedientes que pasen por esta etapa. Crea uno nuevo desde la lista.'); return; }
  S.hl=s; S.hlHow=r.how;
  if(isOpen(r.x)) S.role=STG[cur(r.x)].rol;
  go('exp', r.x.id);
  setTimeout(()=>{ const el=document.querySelector('.steps li.hl'); if(el) el.scrollIntoView({block:'center'}); },40);
}
function openByGlosa(g){
  const x=S.exps.find(e=>e.glosa.startsWith(g)); if(!x){ toast('Expediente no encontrado.'); return; }
  S.fromMap=x.tipo; S.hl=null; S.err=null; if(isOpen(x)) S.role=STG[cur(x)].rol; go('exp', x.id);
}
function mapBanner(x){
  if(S.hl && !STG[S.hl]) S.hl=null;
  if(S.hl && S.hlHow==='cede' && !x.stages.includes(S.hl)) return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>Desde el mapa: <b>${esc(STG[S.hl].label)}</b> (carril Factoring)</span><button class="btn sm" data-a="backmap">← Volver al mapa</button></div><div class="small" style="margin-top:6px">Aún no hay facturas cedidas. Este expediente está en etapa de pago: registra la cesión en el recuadro "¿La factura fue cedida?" y su recorrido pasará a los 6 pasos del factoring.</div><div class="small" style="margin-top:4px">Nodos del diagrama: ${esc(NODE[S.hl])}</div></div>`;
  if(!S.hl || !x.stages.includes(S.hl)) return S.fromMap?`<div class="row" style="margin-bottom:10px"><button class="btn sm" data-a="backmap">← Volver al mapa de flujos</button></div>`:'';
  const i=x.stages.indexOf(S.hl);
  const st = i===x.idx&&isOpen(x)?'<span class="pill acc">Etapa actual: puedes ejecutarla abajo</span>' : i<x.idx?'<span class="pill ok">Ya completada: revisa Documentos, Asientos e Historial</span>' : '<span class="pill warn">Aún no llega: avanza las etapas anteriores</span>';
  const extra = S.hlHow==='cede'?'<div class="small" style="margin-top:6px">Aún no hay facturas cedidas: registra la cesión en el recuadro "¿La factura fue cedida?" para activar este carril.</div>':'';
  return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>Desde el mapa: <b>${esc(STG[S.hl].label)}</b> (etapa ${i+1}) ${st}</span><button class="btn sm" data-a="backmap">← Volver al mapa</button></div><div class="small" style="margin-top:6px">Nodos del diagrama: ${esc(NODE[S.hl])}</div>${extra}</div>`;
}

/* ---------- Guía de demo ---------- */
const CASES = [
  {id:'C1', grupo:'Gasto que llega desde Adquisiciones', tipo:'feliz', titulo:'De la compra al pago, pasando por Adquisiciones', folio:'ADQ-2026-00123',
   dato:'ADQ-2026-00123 · Insumos de oficina — reposición anual · Compra Ágil · Comercial Sur SpA · $1.180.000 (expediente real del prototipo de Adquisiciones)',
   demuestra:'La integración: Adquisiciones pide el devengado después del cruce de 3 vías y Contabilidad lo registra hasta el pago.',
   pasos:[['ext',()=>`En Adquisiciones, abre ${extLink('5.1 Cruce de 3 vías de ADQ-2026-00123',adqUrl('procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123'))}. Pulsa "Ejecutar match", cierra el aviso de validaciones y pulsa "Registrar devengado en Contabilidad (5.2)".`],
          ['ext','Llegas a Contabilidad con la solicitud precargada (monto, OC, proveedor, cuenta 22.04.001). Pulsa "Recibir solicitud".'],
          ['con','"Crear egreso devengado": nace el CED en borrador con su asiento.'],
          ['con','Marca las dos verificaciones y pulsa "Cambiar estado a CONFIRMADO".'],
          ['ext','"Simular: pago completado" (representa el decreto 5.3 y el pago 5.4 que orquesta Adquisiciones).'],
          ['con','"Registrar egreso pagado".'],
          ['ext','Prueba de duplicado: vuelve a pulsar el botón 5.2 en Adquisiciones. Contabilidad abre el mismo expediente y avisa que no crea otro.']],
   resultado:'Estado Pagado. Devengado y pagado +$1.180.000 en 22.04.001, dos asientos en el Libro diario y un cargo en el Libro banco.'},
  {id:'C2', grupo:'Gasto que llega desde Adquisiciones', tipo:'bloqueo', titulo:'Cuenta contable sin configurar', glosa:'Servicio de aseo',
   dato:'ADQ-2026-00250 (folio simulado) · Servicio de aseo dependencias municipales — agosto · $24.500.000 · cuenta 215.22.08.001',
   demuestra:'La regla del diagrama 02: no se puede crear el devengado si la cuenta no tiene su cuenta de egreso devengado.',
   pasos:[['con','Pulsa "Crear egreso devengado". Aparece el error en rojo: la cuenta 215.22.08.001 no tiene cuenta de egreso devengado.'],
          ['adm','Pulsa "Ir a configuración de cuentas". La fila está marcada en rojo: en "Contra egreso devengado" elige 531.22.08 · Gasto en servicios generales.'],
          ['con','Pulsa "Volver a EXP-…" y reintenta "Crear egreso devengado": ahora funciona. Sigue con "Cambiar estado a CONFIRMADO".']],
   destrabar:'Configurar la cuenta relacionada en Configuración de cuentas y reintentar.',
   resultado:'CED creado y confirmado. El error queda registrado en el Historial del expediente.'},
  {id:'C3', grupo:'Gasto que llega desde Adquisiciones', tipo:'feliz', titulo:'Bien inventariable: alta de activo fijo', glosa:'Notebooks',
   dato:'ADQ-2026-00252 (folio simulado) · Notebooks Oficina de Partes (6 unidades) · $5.940.000 · subtítulo 29',
   demuestra:'Adquisiciones marca el bien como inventariable y Contabilidad da el alta del activo junto con el devengado.',
   pasos:[['con','"Crear egreso devengado".'],['con','Marca las verificaciones y "Cambiar estado a CONFIRMADO".'],
          ['con','Etapa "Alta de activo fijo": deja "Activo — alta en inventario" y pulsa "Registrar alta".'],
          ['con',()=>`Abre ${L('Inventario','nav','inv')}: aparece el bien con código INV-2026-… y cuenta 141.06.`]],
   resultado:'Bien en Inventario y expediente esperando el pago (se puede seguir como en C4).'},
  {id:'C4', grupo:'Gasto que llega desde Adquisiciones', tipo:'feliz', titulo:'Pago informado por Adquisiciones y Tesorería', glosa:'Señalética',
   dato:'ADQ-2026-00202 · Señalética peatonal — reposición · $2.950.000 (en Adquisiciones está en 5.4 Ejecución del pago)',
   demuestra:'Contabilidad no paga: recibe el evento de pago y registra el egreso pagado.',
   pasos:[['ext','"Simular: pago completado (PaymentCompleted)".'],['con','"Registrar egreso pagado".']],
   resultado:'Estado Pagado, cargo en el Libro banco y pagado +$2.950.000 en 22.04.010.'},
  {id:'C5', grupo:'Gasto que llega desde Adquisiciones', tipo:'ref', titulo:'Expediente terminado (para mostrar el resultado)', glosa:'Equipamiento ergonómico',
   dato:'ADQ-2026-00231 · Equipamiento ergonómico Tesorería · $3.980.000 · ya pagado',
   demuestra:'Cómo se ve un expediente cerrado: recorrido completo, documentos, asientos e historial.',
   pasos:[['con','Solo mirar: Recorrido del flujo (todo en verde), Documentos (CED, alta INV, decreto, pago), Asientos contables e Historial con fechas y roles.']],
   resultado:'Nada que ejecutar.'},
  {id:'C6', grupo:'Factoring', tipo:'bloqueo', titulo:'Factura cedida: suspender y pagar al cesionario', glosa:'Tóner',
   dato:'ADQ-2026-00253 (folio simulado) · Tóner impresoras DAF · $980.000 · proveedor Comercial Libra SpA',
   demuestra:'El carril de factoring: el pago al proveedor se bloquea y se rehace a nombre del factor.',
   pasos:[['con','En el recuadro "¿La factura fue cedida?" elige Factor Capital Andino S.A. y pulsa "Registrar cesión". El recorrido cambia a 6 pasos.'],
          ['con','"Enviar orden de suspensión a Tesorería".'],['daf','"Elaborar decreto de cesión".'],['alc','"Firmar".'],
          ['daf','"Elaborar nuevo decreto" (a nombre del cesionario).'],['alc','"Firmar decreto".'],['tes','"Registrar pago".']],
   destrabar:'El pago regular queda bloqueado hasta completar decreto de cesión y nuevo decreto de pago.',
   resultado:'Estado Pagado a Factor Capital Andino S.A.; Documentos muestra la cesión y el decreto a nombre del cesionario.'},
  {id:'C7', grupo:'Gasto sin orden de compra', tipo:'feliz', titulo:'Servicio básico de punta a punta', glosa:'Agua potable',
   dato:'Aguas del Valle S.A. · factura 8841203 · Agua potable edificio consistorial — agosto · $612.400 · cuenta 22.05.002',
   demuestra:'Todo el flujo sin OC con cinco roles distintos.',
   pasos:[['sol','"Cobro y servicio correctos".'],['sol','"Emitir V°B°".'],['pre','"Imputar y comprometer" (saldo en verde).'],['pre','"Enviar a Contabilidad".'],
          ['con','"Crear egreso devengado".'],['con','Verificaciones y "Cambiar estado a CONFIRMADO".'],['con','"Elaborar decreto de pago".'],['alc','"Firmar decreto".'],['tes','"Registrar pago".']],
   resultado:'Estado Pagado; comprometido, devengado y pagado +$612.400 en 22.05.002.'},
  {id:'C8', grupo:'Gasto sin orden de compra', tipo:'bloqueo', titulo:'Sin saldo presupuestario', glosa:'Consumo eléctrico',
   dato:'Distribuidora Eléctrica Central S.A. · factura 51902774 · Alumbrado público agosto · $14.380.000 · saldo disponible 22.05.001: $12.700.000',
   demuestra:'El control presupuestario en línea: no se imputa sin saldo.',
   pasos:[['pre','El recuadro rojo muestra saldo $12.700.000 contra $14.380.000 requerido; "Imputar y comprometer" está deshabilitado. Pulsa "Solicitar modificación o suplemento" (queda En espera).'],
          ['pre','"Registrar suplemento aprobado por el Concejo": el vigente sube $1.680.000.'],
          ['pre','"Imputar y comprometer" ya funciona. Sigue como C7 desde "Enviar a Contabilidad".']],
   destrabar:'Suplemento o modificación presupuestaria aprobada por el Concejo.',
   resultado:'Vigente de 22.05.001 +$1.680.000 en Ejecución presupuestaria y expediente desbloqueado.'},
  {id:'C9', grupo:'Gasto sin orden de compra', tipo:'bloqueo', titulo:'Factura rechazada (cobro duplicado)', glosa:'Arriendo oficina',
   dato:'Inmobiliaria Los Aromos SpA · factura 1187 · Arriendo oficina DIDECO — septiembre · $1.650.000',
   demuestra:'La rama NO del análisis técnico: el DTE se rechaza y el expediente se cierra.',
   pasos:[['sol','"Rechazar DTE en el SII".']],
   destrabar:'No se destraba en este expediente: el proveedor debe emitir un DTE nuevo, que entra como factura nueva en Servicios sin OC.',
   resultado:'Estado Rechazado. No toca presupuesto ni contabilidad.'},
  {id:'C10', grupo:'Ingresos', tipo:'feliz', titulo:'Patente: devengado automático y pago', glosa:'Patente comercial',
   dato:'Almacén El Roble Ltda. · Patente comercial 2° semestre · $68.000 (el ejemplo del diagrama)',
   demuestra:'El motor de reglas genera el CID al confirmar la orden y Tesorería registra el percibido.',
   pasos:[['emi','"Confirmar orden": el CID se genera solo (ver Documentos y asiento).'],['tes','Medio "Tarjeta (Transbank)" y "Registrar pago recibido".']],
   resultado:'Estado Percibido; ingreso devengado y percibido +$68.000 en 03.01.001 y abono en el Libro banco.'},
  {id:'C11', grupo:'Ingresos', tipo:'bloqueo', titulo:'Ingreso con revisión manual', glosa:'Derecho de aseo comercial',
   dato:'Minimarket Doña Rosa SpA · Derecho de aseo comercial 2° semestre · $92.500',
   demuestra:'La rama NO del diagrama: sin generación automática la orden espera aprobación de Contabilidad.',
   pasos:[['adm',()=>`En ${L('Configuración de cuentas','nav','cfg')} desmarca "Generar automáticamente el comprobante…".`],
          ['emi','"Confirmar orden": queda en "Revisión manual y aprobación".'],['con','"Aprobar y generar CID".'],
          ['adm','Vuelve a Configuración de cuentas y marca otra vez la casilla (si no, C10 también quedará manual).']],
   destrabar:'La aprobación de Contabilidad.',
   resultado:'CID generado en modo Manual; la orden queda lista para cobrar.'},
  {id:'C12', grupo:'Tesorería', tipo:'feliz', titulo:'Conciliación bancaria de agosto', conc:true,
   dato:'Banco Estado cta. cte. · 10 movimientos en el libro banco y 11 en la cartola',
   demuestra:'Cotejos automáticos, partidas conciliatorias y la doble revisión (Revisor y DAF).',
   pasos:[['tes','"Cargar cartola de agosto", luego "Cotejar cheques", "Cotejar tarjetas" y "Comparar movimientos".'],
          ['tes','En "Conciliar": "Contabilizar comisiones bancarias" y después "Generar conciliación" (el informe cuadra).'],
          ['rev','"Visar". Para mostrar el bloqueo usa "Devolver con observaciones": vuelve a Tesorería, que genera la conciliación de nuevo.'],
          ['daf','"Autorizar" y luego "Archivar".']],
   resultado:'Conciliación archivada; asiento de comisiones en el Libro diario.'}
];
const CTIPO={feliz:['ok','Camino feliz'],bloqueo:['warn','Con bloqueo'],ref:['acc','Referencia']};
function caseExp(c){ return c.folio ? S.exps.find(x=>x.adq&&x.adq.folio===c.folio) : S.exps.find(x=>x.caso===c.id); }
function casePill(x){ return x.caso?`<span class="pill" style="background:var(--sup-soft);color:var(--sup)">Caso ${x.caso}</span>`:''; }
function caseStatus(c){
  if(c.conc){ const k=S.conc; if(k.estado==='Archivada') return '<span class="pill ok">Completado</span>'; return k.idx===0?'<span class="pill">Sin empezar</span>':`<span class="pill acc">En curso · ${esc(CST[k.stages[k.idx]].label)}</span>`; }
  const x=caseExp(c);
  if(!x) return '<span class="pill">Aún no llega desde Adquisiciones</span>';
  if(!isOpen(x)) return `<span class="pill ${['Rechazado','Anulado'].includes(x.estado)?'crit':'ok'}">Completado · ${esc(x.estado)}</span>`;
  return `<span class="pill acc">${esc(STG[cur(x)].label)} · ${esc(RSHORT[STG[cur(x)].rol])}</span>`;
}
function openCase(id){
  const c=CASES.find(k=>k.id===id); if(!c) return;
  S.err=null; S.hl=null; S.fromMap=null; S.fromAdq=null;
  if(c.conc){ const k=S.conc; if(k.estado!=='Archivada') S.role=CST[k.stages[k.idx]].rol; go('conc'); return; }
  const x=caseExp(c);
  if(!x){ location.href=adqUrl('procesos-transversales/51-cruce-tres-vias',c.folio); return; }
  if(isOpen(x)) S.role=STG[cur(x)].rol;
  go('exp', x.id);
}
function vGuia(){
  const txt=t=>typeof t==='function'?t():esc(t);
  const grupos=[...new Set(CASES.map(c=>c.grupo))];
  const done=CASES.filter(c=>c.conc?S.conc.estado==='Archivada':(caseExp(c)&&!isOpen(caseExp(c)))).length;
  return `<div class="pagehead"><div><h1>Guía de demo</h1><p>12 casos preparados para mostrar cada flujo. Cada uno parte detenido justo donde empieza lo que hay que mostrar. ${done} de 12 terminados en este navegador.</p></div><button class="btn alt" data-a="reset">Reiniciar datos de demo</button></div>
  <div class="stack">
  <div class="alert sup"><b>Cómo moverse.</b> Cada paso lo ejecuta un rol (la etiqueta gris). "Abrir caso" cambia solo al rol correcto. Si una etapa es de otro rol, el expediente muestra un recuadro amarillo con el botón "Actuar como …"; también puedes usar el selector "Actuando como" de arriba. Los datos quedan guardados en este navegador: "Reiniciar datos de demo" devuelve todos los casos a su punto de partida.</div>
  ${grupos.map(g=>`<div class="panel"><div class="ph"><h2>${esc(g)}</h2></div><div class="pb stack">${CASES.filter(c=>c.grupo===g).map(c=>`<div class="doc" style="background:var(--surface)" id="case_${c.id}">
    <div class="row" style="justify-content:space-between"><div class="row"><span class="mono" style="font-weight:600">${c.id}</span><b>${esc(c.titulo)}</b><span class="pill ${CTIPO[c.tipo][0]}">${CTIPO[c.tipo][1]}</span></div><div class="row">${caseStatus(c)}<button class="btn sm pri" data-a="case" data-v="${c.id}">Abrir caso</button></div></div>
    <div class="small muted" style="margin-top:6px">${esc(c.dato)}</div>
    <p style="margin:8px 0 4px">${esc(c.demuestra)}</p>
    <ol class="small" style="margin:6px 0;padding-left:20px;display:flex;flex-direction:column;gap:4px">${c.pasos.map(([r,t])=>`<li>${roleChip(r)} ${txt(t)}</li>`).join('')}</ol>
    ${c.destrabar?`<div class="small"><b>Cómo se destraba:</b> ${esc(c.destrabar)}</div>`:''}
    <div class="small"><b>Resultado esperado:</b> ${esc(c.resultado)}</div></div>`).join('')}</div></div>`).join('')}
  </div>`;
}

/* ---------- Render y eventos ---------- */
function render(){
  renderNav();
  const v=S.view;
  const html = v==='guia'?vGuia(): v==='bandeja'?vBandeja(): ['oc','sinoc','ing'].includes(v)?vList(v): v.startsWith('new-')?vNew(v.slice(4)): v==='exp'?vExp(): v==='tes'?vTes(): v==='conc'?vConc(): v==='pres'?vPres(): v==='diario'?vDiario(): v==='inv'?vInv(): v==='cfg'?vCfg(): v==='flujos'?vFlujos(): vSup();
  $('main').innerHTML=html;
}
const VIEWS=['guia','bandeja','flujos','oc','sinoc','ing','tes','conc','pres','diario','inv','cfg','sup','new-oc','new-sinoc','new-ing'];
function setHash(){ const h='#'+(S.view==='exp'?'exp='+S.sel:S.view); if(location.hash!==h){ try{ history.pushState(null,'',h); }catch(e){ location.hash=h; } } }
function go(view, sel){ S.view=view; if(sel!==undefined) S.sel=sel; if(view!=='cfg'){ S.cfgHl=null; } render(); setHash(); window.scrollTo({top:0}); save(); }
function applyHash(){
  const [k,val]=decodeURIComponent(location.hash.slice(1)).split('=');
  if(k==='exp' && S.exps.some(x=>x.id===val)){ if(S.view==='exp'&&S.sel===val) return false; S.view='exp'; S.sel=val; S.hl=null; return true; }
  if(VIEWS.includes(k) && k!==S.view){ if(!k.startsWith('new-')) S.draft=null; S.hl=null; S.fromMap=null; S.fromAdq=null; S.returnTo=null; S.view=k; return true; }
  return false;
}
function handleAdqDeepLink(){
  const q=new URLSearchParams(location.search), folio=q.get('expediente'); if(!folio) return false;
  const origen=q.get('origen')||'';
  try{ history.replaceState(null,'',location.pathname+location.hash); }catch(e){}
  const ex=S.exps.find(x=>x.adq&&x.adq.folio===folio);
  S.err=null; S.hl=null; S.fromMap=null;
  if(ex){ S.fromAdq={folio, origen, existed:true}; if(isOpen(ex)) S.role=STG[cur(ex)].rol; S.view='exp'; S.sel=ex.id; }
  else { S.fromAdq=null; S.draft={adq:adqPrefill(folio), origen}; S.view='new-oc'; }
  return true;
}
window.contaBoot=function(data){
  ADQ_DATA={ expedientes:(data&&data.expedientes)||[], presets:(data&&data.presets)||{}, siteUrl:(data&&data.siteUrl)||null };
  if(!load()) seed();
  S.err=null;
  if(!handleAdqDeepLink()) applyHash();
  render(); setHash(); save();
  window.addEventListener('hashchange', ()=>{ if(applyHash()){ render(); save(); } });
  window.addEventListener('popstate', ()=>{ if(applyHash()){ render(); save(); } });
};

document.addEventListener('click', e=>{
  const b=e.target.closest('[data-a]'); if(!b) return;
  const a=b.dataset.a, v=b.dataset.v;
  if(b.tagName==='A') e.preventDefault();
  try{
    if(a==='nav'){ if(!v.startsWith('new-')||!S.draft?.origen) S.draft=null; S.err=null; S.returnTo=null; S.hl=null; S.fromMap=null; S.fromAdq=null; go(v); }
    else if(a==='goto'){ gotoStage(v); }
    else if(a==='openg'){ openByGlosa(v); }
    else if(a==='jump'){ if(S.view!=='flujos'){ S.hl=null; go('flujos'); } setTimeout(()=>{ const el=$(v); if(el) el.scrollIntoView({block:'start'}); },30); }
    else if(a==='backmap'){ const k=S.fromMap; S.hl=null; S.fromMap=null; go('flujos'); setTimeout(()=>{ const el=$('fl_'+k); if(el) el.scrollIntoView({block:'start'}); },30); }
    else if(a==='open'){ S.err=null; S.hl=null; S.fromAdq=null; go('exp', v); }
    else if(a==='role'){ S.role=v; render(); save(); }
    else if(a==='sup'){ S.supHl=v; go('sup'); setTimeout(()=>{ const el=$('sup_'+v); if(el) el.scrollIntoView({block:'center'}); },30); }
    else if(a==='act'){
      const x=S.exps.find(e=>e.id===S.sel), st=STG[cur(x)];
      const vals=readFields(st.fields?st.fields(x):[]);
      try{ const msg=runAction(x, Number(v), vals); S.err=null; toast(msg); }
      catch(err){ S.err={id:x.id, msg:err.message, config:err.config||null}; hist(x,'Error: '+err.message, st.rol); }
      render(); save();
    }
    else if(a==='cede'){ const x=S.exps.find(e=>e.id===S.sel); registrarCesion(x, $('f_ces').value); toast('Cesión registrada. El pago regular queda suspendido.'); render(); save(); }
    else if(a==='gocfg'){ S.cfgHl=v; S.returnTo=S.sel; S.view='cfg'; render(); save(); }
    else if(a==='cact'){ toast(runConc(Number(v))); render(); save(); }
    else if(a==='dtab'){ S.diarioTab=v; render(); }
    else if(a==='create'){ const x=createFromForm(v); toast(x.id+' creado.'); go('exp', x.id); }
    else if(a==='additem'){ syncItems(); S.draft.items.push({c:S.conceptos[1].n, monto:25000}); render(); }
    else if(a==='delitem'){ syncItems(); S.draft.items.splice(Number(v),1); render(); }
    else if(a==='reset'){ seed(); S.view='guia'; render(); setHash(); save(); window.scrollTo({top:0}); toast('Datos de demo restablecidos: todos los casos vuelven a su punto de partida.'); }
    else if(a==='case'){ openCase(v); }
  }catch(err){ toast(err.message); }
});
document.addEventListener('change', e=>{
  const t=e.target;
  if(t.id==='roleSel'){ S.role=t.value; render(); save(); return; }
  if(t.dataset.cfg==='auto'){ S.cfg.autoCID=t.checked; toast(t.checked?'Generación automática activada.':'Las órdenes confirmadas pasarán a revisión manual.'); save(); return; }
  if(t.dataset.cfg){ const c=S.cuentas[Number(t.dataset.i)]; c[t.dataset.cfg]=t.value; if(S.cfgHl===c.cod && c.dev){ toast('Configuración guardada. Vuelve al expediente para reintentar.'); } save(); }
});

/* Arranque: lo llama index.html con window.contaBoot({expedientes, presets}) después de initAppShell */
