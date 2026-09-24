"use strict";
const TODAY = '2026-09-23';
/* v6: flujos actualizados de Contabilidad (carpeta Flujos/Atualizados, 23-09-2026). Subir la versión al cambiar los datos semilla. */
const KEY = 'sgm-conta-proto-v6';
let NOW = TODAY;
const R = {
  sol:'Unidad administradora / solicitante', pre:'Presupuesto / SECPLAN', daf:'DAF (analista, Jefatura de Contabilidad, Director)',
  ext:'Adquisiciones · Mercado Público · SII (externo)', con:'Contabilidad (analista contable)', tes:'Tesorería (Tesorero)', caja:'Caja municipal (cajero)', alc:'Alcaldía',
  rev:'Control interno / Jurídica', emi:'Unidad emisora de ingresos', adm:'Administrador contable'
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
const FOLIO_PRES = {'ADQ-2026-00123':'22.04.001','ADQ-2026-00012':'22.04.010','ADQ-2026-00089':'29.04','ADQ-2026-00142':'29.06.001','ADQ-2026-00045':'22.06.002'};
function adqPrefill(folio){
  const e = adqInfo(folio) || adqInfo('ADQ-2026-00123') || {};
  const pr = (ADQ_DATA.presets||{})[e.id] || {};
  const info = pr.recepcion?.ocInfo || '';
  const oc = (info.split('·')[0]||'').trim();
  const prov = (info.match(/Proveedor:\s*([^·]+)/)||[])[1]?.trim() || '';
  return { pres: FOLIO_PRES[e.id] || '22.04.001', folio: e.id || folio, glosa: e.title || '', modalidad: e.modality || 'Compra Ágil', unidad: e.department || '', monto: e.awardedAmount ?? e.requestedAmount ?? 0, oc: /^\d/.test(oc) ? oc : '', proveedor: prov, factura: '', step: e.currentStep ? e.currentStep.id + ' ' + e.currentStep.name : '' };
}
const RSHORT = {sol:'Unidad', pre:'Presupuesto', daf:'DAF', ext:'Adquisiciones (ext.)', con:'Contabilidad', tes:'Tesorería', caja:'Caja', alc:'Alcaldía', rev:'Control / Jurídica', emi:'Unidad emisora', adm:'Admin. contable'};

const fmt = n => '$' + Math.round(n||0).toLocaleString('es-CL');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fdate = d => d ? d.split('-').reverse().join('-') : '';
const pad = (n,w=4) => String(n).padStart(w,'0');

/* ---------- Supuestos (vacíos de los diagramas resueltos para el prototipo) ---------- */
const SUP = {
  S1:{t:'Caja, rendición diaria y depósito', src:'Ingreso Percibido (diagrama y Word "Detalle Flujos - Ingreso Devengado e Ingreso Percibido", 23-09)', p:'El diagrama y el Word ya describen el percibido: caja → timbre y comprobante → arqueo diario → depósito al día hábil siguiente → asiento en Contabilidad (Debe Banco / Haber Ingresos por percibir). El prototipo agrega: los pagos del día forman una rendición de caja que avanza en bloque; el depósito cubre efectivo y cheques; los pagos con tarjeta o transferencia llegan al banco por su propia liquidación (Transbank o abono directo) y se incluyen en el mismo asiento.'},
  S2:{t:'Pago y egreso pagado', src:'Los flujos de obligaciones terminan en "Decreto de pago"', p:'En compras, el decreto (5.3) y el pago (5.4, Tesorería) los orquesta Adquisiciones; Contabilidad recibe el evento de pago completado y registra el egreso pagado: Debe Cuenta por pagar / Haber Banco (la "cuenta contra egreso pagado" configurada). En servicios sin OC y en factoring, Tesorería paga dentro de este prototipo con el mismo asiento y marca la factura como pagada ("Actualizar factura" del diagrama de factoring).'},
  S3:{t:'Matriz de asientos', src:'02- Registro Egreso devengado (único ejemplo: 2152205006 Telefonía celular)', p:'Devengo de gasto: Debe cuenta de gasto o de activo (la "contra egreso devengado") / Haber Cuenta por pagar 215.xx. El ejemplo del diagrama usa 11103 Bancos como contra devengado; aquí se reinterpreta como cuenta de gasto y debe validarse con un contador municipal. Los códigos patrimoniales son ilustrativos.'},
  S4:{t:'Sin saldo en servicios sin OC', src:'Obligaciones sin OC ("Solicitar Modificación o Suplemento" sin continuación)', p:'Presupuesto solicita la modificación o suplemento; al registrarse aprobada aumenta el vigente y se reintenta la imputación. En compras, el caso equivalente lo resuelve Adquisiciones en 1.4 (solicitar financiamiento a DAF).', res:{t:'Compras: Adquisiciones 1.4', url:'procesos-transversales/16-solicitar-financiamiento', folio:'ADQ-2026-00142'}},
  S5:{t:'Preobligación = compromiso cierto (según el Word)', src:'Registro Preobligacion (pestaña 1) y Word "Obligación (con y sin OC) + Preobligación"', p:'Decisión del 23-09: se sigue el Word. El CDP reserva los fondos (columna "Preobligado" = reserva del CDP). Con el decreto de adjudicación tramitado, Contabilidad registra la preobligación como compromiso cierto (pasa de "Preobligado" a "Comprometido") y recién entonces Adquisiciones emite la OC. Esto cambia el modelo actual de Adquisiciones (preobligación en 1.6 y compromiso en 3.4, al aceptarse la OC): queda como propuesta para acordar con el equipo de Adquisiciones.'},
  S6:{t:'OC rechazada por el proveedor', src:'Registro Obligaciones ("Notificar a Unidad Solicitante / Re-evaluar" sin continuación)', p:'El Word dice "renegociar las condiciones o anular la compra". Lo resuelve Adquisiciones en 3.5 (rechazo de la OC) y 3.6 (proceso desierto o fallido).', res:{t:'Adquisiciones 3.5', url:'1-compra-agil/35-rechazo-oc', folio:'ADQ-2026-00123'}},
  S7:{t:'Recepción con observaciones', src:'Proceso Inventario Municipal (Word "Inventario / Recepción Conforme")', p:'El Word aclara las ramas: si el cotejo con la OC falla, Bodega emite el acta de observaciones y se registra el reclamo o rechazo del DTE en MP/SII, lo que detiene el pago; lo mismo si la recepción no quedó registrada en MP. En el prototipo lo cubre Adquisiciones en 4.5, "Recepción no conforme". Nada rechazado se devenga.', res:{t:'Adquisiciones 4.5 (sin pantalla aún)', url:'00-expediente/', folio:'ADQ-2026-00123'}},
  S8:{t:'Rechazo de DTE', src:'Registro Obligaciones y Obligacion sin OC', p:'Sin OC: el reclamo se registra en el SII dentro de 8 días corridos (Ley 19.983) y el expediente termina como rechazado; el proveedor debe emitir un DTE nuevo. Con OC, el cruce de 3 vías (5.1) bloquea el devengado si la factura no calza.'},
  S9:{t:'Compromiso en obligaciones sin OC', src:'Obligacion sin OC', p:'En servicios básicos y arriendos, el compromiso se registra en el mismo acto de imputación (no hay CDP ni OC previos) y el devengado se registra luego con el CED.'},
  S10:{t:'Factoring: casos A y B', src:'Factoring (rombo "¿Cesión de factura?") y Word "Factoring y Conciliación Bancaria"', p:'La condición ya está en el diagrama. El Word distingue dos casos según la etapa de la factura. Caso A, sin decreto de pago: se registra la cesión en la ficha de la factura y se cambia el receptor del pago al RUT del factoring (no hay nada que suspender). Caso B, con decreto de pago generado o en trámite: alerta y suspensión inmediata en Tesorería. En ambos casos siguen el decreto alcaldicio de cesión, la visación de Control interno o Jurídica, la firma y el decreto de pago a nombre del factoring. En compras, el decreto 5.3 vive en Adquisiciones: si la factura ya está en etapa de pago, el prototipo la trata como caso B.'},
  S11:{t:'Conciliación bancaria', src:'Conciliación Bancaria (diagrama) y Word "Factoring y Conciliación Bancaria"', p:'La hace el encargado de conciliaciones de DAF-Contabilidad. Aprueba primero la Jefatura de Contabilidad / Director DAF y después revisa Control interno como contraparte independiente; luego se archiva y el saldo validado alimenta los informes a la CGR y al SINIM. Se concilia cada cuenta corriente; en el prototipo se recorre la cuenta General y las demás (Salud, Educación, FNDR, Fondos de terceros) aparecen con estado de ejemplo. Los cargos bancarios se registran con comprobante de traspaso y los abonos no identificados van a una cuenta de pasivo transitoria (214.09, código ilustrativo) hasta identificar al contribuyente.'},
  S12:{t:'CID con aprobación manual', src:'Ingreso Devengado (rama "NO")', p:'El Word lo confirma: si la generación automática está desactivada, la orden pasa a la bandeja de Contabilidad (DAF), que revisa la imputación y aprueba; al aprobar se genera el CID y queda Confirmado [Devengado realizado].'},
  S13:{t:'Alta de activo fijo', src:'Proceso Inventario Municipal (Word "Inventario / Recepción Conforme") · Adquisiciones 4.3 (registerInventoryEntry, X-44)', p:'Según los flujos actualizados, la clasificación NICSP y el código de inventario los asigna DAF / Bodega en la recepción, antes del cruce de 3 vías (Adquisiciones 4.3). Contabilidad ya no tiene una etapa propia de clasificación: el bien llega marcado como inventariable con su código, y al confirmar el CED queda registrado el activo (cuenta 141.xx configurada como contra egreso devengado). Subtítulo 29 = activo; subtítulo 22 = gasto del período.'},
  S14:{t:'Diferencia en el arqueo', src:'Ingreso Percibido ("Cuadratura Diario de Caja (Arqueo)" sin rama de error)', p:'Si el efectivo contado no coincide con lo registrado en la caja, el prototipo no deja cerrar la rendición: el Tesorero debe revisar con el cajero y volver a contar. El tratamiento contable de un faltante o sobrante no está en los flujos y debe definirse con Tesorería.'},
  S15:{t:'Condiciones del cierre mensual', src:'06 - Cierre Mensual (diagrama) y Word "Cierre Mensual y Anual"', p:'El Word describe el cierre en el sistema (Borrador → Enviado a revisión → Cerrado, reapertura con razón obligatoria). El prototipo agrega las condiciones para cerrar, tomadas del plan de Contabilidad (MC-5, cierre con control de conciliación): conciliaciones bancarias del período archivadas y sin comprobantes en borrador con fecha del período. Con el período cerrado no se pueden registrar asientos con fecha dentro de él hasta reabrirlo.'},
  S16:{t:'Asientos de cierre anual', src:'07 - Cierre Anual (diagrama) y Word "Cierre Mensual y Anual"', p:'El Word nombra los tres asientos automáticos (traspaso de ingresos, traspaso de gastos, resultado contra patrimonio neto) pero no sus cuentas. El prototipo usa la ejecución de ejemplo del ejercicio 2025 y códigos ilustrativos (611 Resumen de resultados, 311 Resultado del ejercicio) que deben reemplazarse por el plan de cuentas CGR.'},
  S17:{t:'Baja de bienes', src:'Inventario (diagrama: "¿Dar de baja?" → decreto → firma Alcaldía → registrar)', p:'El diagrama no dice qué asiento produce la baja. El prototipo rebaja el activo por su valor libro contra una cuenta de gasto por baja de bienes (código ilustrativo) al registrar la baja después de la firma del decreto.'},
  S18:{t:'Egreso devengado creado desde Adquisiciones', src:'02- Registro Egreso devengado (diagrama) y Word "Egreso Devengado" (video)', p:'Decisión del 23-09: se sigue el video. El usuario de Adquisiciones pulsa "Crear egreso devengado" en la resolución de compra; en la nueva arquitectura, la resolución de compra corresponde al expediente con el cruce de 3 vías conforme (5.1). Si la cuenta no tiene sus contracuentas, el sistema lo impide y Contabilidad debe configurarlas; luego Adquisiciones reintenta. El CED nace en Borrador y lo confirma Contabilidad. El diagrama dibuja el cruce de 3 vías en el carril de Contabilidad, pero la pantalla sigue siendo 5.1 de Adquisiciones: tema a acordar.'}
};

/* ---------- Etapas ---------- */
function presOf(cod){ return S.pres.find(p => p.cod === cod); }
function presIngOf(cod){ return S.presIng.find(p => p.cod === cod); }
function saldo(p){ return p.vig - p.preob - p.comp; }
function cxpOf(pres){ return S.cuentas.find(c => c.pres === pres); }
function ctaName(cod){ const all=[...S.cuentas,...S.ctaDeb,...S.bancos,...S.ctaIng,...(S.ctaOtras||[])]; const c=all.find(x=>x.cod===cod); return c?c.nombre:cod; }
function nextSeq(k){ if(S.seq[k]==null) S.seq[k]=0; return ++S.seq[k]; }
function hist(x, txt, rol){ x.hist.unshift({f:NOW, rol, txt}); }
function cur(x){ return x.stages[x.idx]; }
function advance(x){ x.idx++; if (x.idx >= x.stages.length) x.idx = x.stages.length; }
function hhmm(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }

/* Período cerrado: ningún asiento con fecha dentro de un cierre en estado Cerrado (S15) */
function periodoCerrado(f){ return S.exps.find(x=>x.tipo==='cierre' && x.docs.cierre && x.docs.cierre.estado==='Cerrado' && x.desde<=f && f<=x.hasta); }
function checkPeriodo(f){ const c=periodoCerrado(f); if(c) throw new Error('El período '+c.periodo+' está cerrado ('+c.id+'). Para registrar con fecha '+fdate(f)+', Contabilidad debe reabrir el cierre indicando la razón.'); }
function asiento(glosa, ref, lineas, estado, opt){
  opt=opt||{};
  const f=opt.fecha||NOW;
  if(!opt.cierre) checkPeriodo(f);
  const a = {n:'A-'+pad(nextSeq('as'),5), fecha:f, glosa, ref, lineas, estado: estado||'Contabilizado', tipo:opt.tipo||''};
  S.asientos.unshift(a); return a;
}
function movBanco(tipo, monto, medio, glosa, ref, fecha){
  S.movs.unshift({id:'MB-'+nextSeq('mov'), fecha:fecha||NOW, cta:'111.02', tipo, monto, medio, glosa, ref});
}

function registrarDevengoCED(x){
  const c = cxpOf(x.pres);
  if (!c || !c.dev) {
    const e = new Error('La cuenta ' + (c?c.cod:x.pres) + ' no tiene configurada cuenta de egreso devengado.' + (x.tipo==='oc'?' Adquisiciones no puede crear el egreso devengado hasta que Contabilidad configure sus cuentas relacionadas.':''));
    e.config = c ? c.cod : null; throw e;
  }
  const benef = x.proveedor ? x.proveedor.nombre : '';
  const a = asiento('Egreso devengado — ' + x.glosa, x.id, [
    {cta:c.dev, debe:x.monto, haber:0, aux:''},
    {cta:c.cod, debe:0, haber:x.monto, aux:benef}
  ], 'Borrador');
  x.docs.ced = {n:'CED-2026-'+pad(nextSeq('ced')), estado:'Borrador', asiento:a.n, por:x.tipo==='oc'?'Adquisiciones':'Contabilidad'};
}
const cedInfo = x=>{ const c=cxpOf(x.pres); return `<div class="small muted">Cuenta afectada: <span class="mono">${esc(c?.cod)}</span> ${esc(c?.nombre)} · contra egreso devengado: <span class="mono">${esc(c?.dev||'— sin configurar —')}</span> · contra egreso pagado: <span class="mono">${esc(c?.pag||'— sin configurar —')}</span></div>`; };

/* ---------- Rendición de caja (ingreso percibido, S1) ---------- */
function rendOf(x){ return S.rends.find(r=>r.id===x.docs.recibo?.rend); }
function rendAbierta(){ let r=S.rends.find(r=>r.estado==='Abierta'&&r.fecha===NOW); if(!r){ r={id:'RC-2026-'+pad(nextSeq('rc')), fecha:NOW, caja:'Caja 1 · Edificio consistorial', pagos:[], estado:'Abierta'}; S.rends.unshift(r); } return r; }
function rendTot(r, medio){ return r.pagos.filter(p=>!medio||p.medio.startsWith(medio)).reduce((s,p)=>s+p.monto,0); }
function habilSig(f){ const d=new Date(f+'T12:00:00'); do{ d.setDate(d.getDate()+1); }while([0,6].includes(d.getDay())); return d.toISOString().slice(0,10); }
function rendHTML(r){
  if(!r) return '';
  const M=['Efectivo','Cheque','Tarjeta','Transferencia'];
  return `<div class="doc"><div class="dt"><span>Rendición de caja ${esc(r.id)} · ${fdate(r.fecha)}</span><span>${esc(r.estado)}</span></div>
  <div class="tbl-wrap"><table><tr><th>Comprobante</th><th>Contribuyente</th><th>Medio</th><th class="num">Monto</th></tr>${r.pagos.map(p=>`<tr><td class="mono small">${esc(p.n)}</td><td class="small">${esc(p.contrib)}</td><td class="small">${esc(p.medio)}</td><td class="num">${fmt(p.monto)}</td></tr>`).join('')}
  <tfoot><tr><td colspan="3">${M.map(m=>rendTot(r,m)?m+' '+fmt(rendTot(r,m)):'').filter(Boolean).join(' · ')}</td><td class="num">${fmt(rendTot(r))}</td></tr></tfoot></table></div>
  ${r.dep?`<div class="small muted">Depósito ${esc(r.dep.n)} del ${fdate(r.dep.fecha)} por ${fmt(r.dep.monto)} (efectivo y cheques).</div>`:''}</div>`;
}
/* Arqueo, depósito y contabilización actúan sobre toda la rendición: avanzan también las otras órdenes de la misma rendición */
function enBloque(x, stage, txt, rol, fin){
  const r=rendOf(x); let n=0;
  S.exps.filter(o=>o!==x && o.docs.recibo && o.docs.recibo.rend===r.id && isOpen(o) && cur(o)===stage).forEach(o=>{ hist(o, STG[stage].label+': '+txt, rol); advance(o); if(fin) o.estado=fin; n++; });
  return n;
}

/* ---------- Cierres contables (S15, S16) ---------- */
function concDelPeriodo(x){
  // Conciliaciones que corresponden al período del cierre (la cuenta General se recorre en el prototipo; las demás son datos de ejemplo)
  return S.concCuentas.filter(c=>c.mes===x.hasta.slice(0,7)).map(c=>({...c, estado:c.general?S.conc.estado:c.estado}));
}
function cierreBloqueos(x){
  const b=[];
  if(x.tipoCierre==='Mensual'){
    const cs=concDelPeriodo(x);
    if(!cs.length) b.push('No hay conciliaciones bancarias de '+x.periodo+'.');
    else { const p=cs.filter(c=>c.estado!=='Archivada'); if(p.length) b.push('Falta archivar la conciliación bancaria de '+p.map(c=>c.nombre).join(', ')+' ('+x.periodo+').'); }
  }
  const bor=S.asientos.filter(a=>a.estado==='Borrador' && a.tipo!=='Cierre' && a.fecha>=x.desde && a.fecha<=x.hasta);
  if(bor.length) b.push('Hay '+bor.length+' comprobante(s) en borrador con fecha del período ('+bor.map(a=>a.n).join(', ')+').');
  return b;
}
function cierreInfo(x){
  const c=x.docs.cierre, b=cierreBloqueos(x);
  const as=S.asientos.filter(a=>a.fecha>=x.desde && a.fecha<=x.hasta && a.tipo!=='Cierre');
  return `<div class="doc"><div class="dt"><span>Cierre ${esc(x.tipoCierre.toLowerCase())} · ${esc(x.periodo)}</span><span>${esc(c.estado)}</span></div>
    <div class="small">Rango: ${fdate(x.desde)} al ${fdate(x.hasta)} · ${as.length} asiento(s) en el período ${as.length?L('Ver asientos','verasientos',x.id):''}</div>
    <div class="small">Respaldos: ${c.adjuntos.length?c.adjuntos.map(a=>esc(a.n)).join(' · '):'<i>ninguno</i>'}</div></div>
    ${x.tipoCierre==='Mensual'?`<div class="small">Conciliaciones del período: ${concDelPeriodo(x).map(k=>esc(k.nombre)+' '+(k.estado==='Archivada'?'<span class="pill ok">Archivada</span>':'<span class="pill warn">'+esc(k.estado)+'</span>')).join(' · ')||'<i>ninguna</i>'}</div>`:''}
    ${b.length?`<div class="alert warn"><b>Condiciones pendientes para cerrar</b> ${supChips(['S15'])}<ul style="margin:4px 0 0;padding-left:18px">${b.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`:'<div class="alert ok small">Se cumplen las condiciones para cerrar el período.</div>'}`;
}
function reabrir(x, razon){
  if(!(razon||'').trim()) throw new Error('La razón de reapertura es obligatoria (queda para auditoría).');
  const c=x.docs.cierre; c.estado='Reabierto'; (c.reaperturas||(c.reaperturas=[])).push({fecha:NOW, hora:hhmm(), razon:razon.trim()});
  x.idx=x.stages.indexOf('ci_prep'); x.estado='Reabierto';
  hist(x, 'Cierre reabierto. Razón: '+razon.trim(), 'con');
  return 'Cierre reabierto. El período vuelve a aceptar registros.';
}
function asientosCierreAnual(x){
  const E=S.ej2025, f=x.hasta, o={cierre:true, fecha:f, tipo:'Cierre'};
  const ti=E.ing.reduce((s,l)=>s+l.m,0), tg=E.gas.reduce((s,l)=>s+l.m,0), res=ti-tg;
  const a1=asiento('Cierre '+x.periodo+' — traspaso de ingresos', x.id, [...E.ing.map(l=>({cta:l.cta,debe:l.m,haber:0,aux:''})), {cta:'611',debe:0,haber:ti,aux:''}], 'Borrador', o);
  const a2=asiento('Cierre '+x.periodo+' — traspaso de gastos', x.id, [{cta:'611',debe:tg,haber:0,aux:''}, ...E.gas.map(l=>({cta:l.cta,debe:0,haber:l.m,aux:''}))], 'Borrador', o);
  const a3=asiento('Cierre '+x.periodo+' — resultado del ejercicio a patrimonio neto', x.id, res>=0?[{cta:'611',debe:res,haber:0,aux:''},{cta:'311',debe:0,haber:res,aux:''}]:[{cta:'311',debe:-res,haber:0,aux:''},{cta:'611',debe:0,haber:-res,aux:''}], 'Borrador', o);
  return {ns:[a1.n,a2.n,a3.n], ti, tg, res};
}

const STG = {
  /* ===== Compras: preobligación (compromiso cierto) tras la adjudicación · S5 ===== */
  pb_reg:{label:'Registrar preobligación (compromiso cierto)', rol:'con', src:'Registro Preobligacion › "Registro Contable de Preobligación (Compromiso Cierto)" · contrato registerPreObligation (hoy invocado en 1.6 por createBudgetPreCommitment)', sup:['S5'],
    desc:'Con el decreto de adjudicación tramitado, Contabilidad registra en el ERP la preobligación: la reserva preventiva del CDP se transforma en un compromiso cierto con el proveedor adjudicado. Recién entonces Adquisiciones puede emitir la OC.',
    info:x=>{ const p=presOf(x.pres); return `<div class="alert ${p.preob>=x.monto?'ok':'crit'}">Reserva del CDP (preobligado) en ${esc(p.cod)} ${esc(p.nombre)}: <b class="mono">${fmt(p.preob)}</b> · monto adjudicado <b class="mono">${fmt(x.monto)}</b></div>`; },
    fields:x=>[{id:'c1',label:'Decreto de adjudicación tramitado (firmado y publicado en Mercado Público)',type:'check'}],
    actions:x=>[{label:'Registrar preobligación', run:v=>{
      if(!v.c1) throw new Error('Confirma que el decreto de adjudicación está tramitado.');
      const p=presOf(x.pres); if(p.preob<x.monto) throw new Error('La reserva del CDP ('+fmt(p.preob)+') no alcanza para el monto adjudicado ('+fmt(x.monto)+').');
      p.preob-=x.monto; p.comp+=x.monto; x.docs.comp={n:'PRE-2026-'+pad(nextSeq('pre')), monto:x.monto, fecha:NOW};
      return 'Preobligación '+x.docs.comp.n+' registrada: '+fmt(x.monto)+' pasan de reserva del CDP a compromiso cierto en '+p.cod+'.'; }}]},
  pb_oc:{label:'Emisión de la OC en Mercado Público', rol:'ext', src:'Registro Preobligacion › "Emisión de Orden de Compra (Mercado Público)" · Adquisiciones 3.3 / 3.14', sup:['S5'],
    desc:'Con la preobligación registrada, Adquisiciones emite y envía la OC al proveedor adjudicado. Fin del proceso de compromiso.',
    info:x=>`<div class="small">${adqLink(x.adq?.folio)}</div>`,
    actions:x=>[{label:'Simular: OC emitida en Mercado Público', run:()=>{ x.docs.oc={n:x.adq.oc||('OC '+x.adq.folio), monto:x.monto, estado:'Emitida'}; return 'OC emitida y enviada al proveedor. Fin del proceso de compromiso.'; }}]},

  /* ===== Compras: devengado creado desde Adquisiciones · S18 ===== */
  ced:{label:'Crear egreso devengado desde la resolución de compra', rol:'ext', src:'02- Registro Egreso devengado (pasos 1–3 y alerta) · Word "Egreso Devengado": Adquisiciones › Resolución de Compra', sup:['S18','S3'],
    desc:'El usuario de Adquisiciones selecciona la resolución de compra (expediente con cruce de 3 vías conforme) y pulsa "Crear egreso devengado". El sistema revisa que la cuenta tenga configuradas sus contracuentas; si falta alguna, lo impide y Contabilidad debe configurarla antes de reintentar.',
    info:cedInfo,
    actions:x=>[{label:'Crear egreso devengado', run:()=>{ registrarDevengoCED(x); return x.docs.ced.n+' creado en Borrador. Queda para verificación y confirmación de Contabilidad.'; }}]},
  ced_s:{label:'Recibir expediente y crear egreso devengado (CED)', rol:'con', src:'Obligacion sin OC › "Recepción de Expediente (DTE + V°B° + Imputación)" · "Registro Contable de Obligación (Devengado)" · 02- Registro Egreso devengado', sup:['S3'],
    desc:'Contabilidad recibe el expediente (DTE + V°B° + imputación) y crea el comprobante de egreso devengado. El sistema exige que la cuenta tenga configurada su cuenta de egreso devengado.',
    info:cedInfo,
    actions:x=>[{label:'Crear egreso devengado', run:()=>{ registrarDevengoCED(x); return x.docs.ced.n+' creado en estado Borrador.'; }}]},
  ced_conf:{label:'Verificar recepción y factura, y confirmar el CED', rol:'con', src:'02- Registro Egreso devengado (pasos 4–6) · Word "Egreso Devengado" pasos 5 y 6', sup:['S13'],
    desc:'El CED queda en Borrador hasta que Contabilidad verifica la recepción conforme y la factura. Se revisa el asiento (debe, haber, beneficiario) y se cambia el estado a CONFIRMADO.',
    info:x=>{ const a=S.asientos.find(a=>a.n===x.docs.ced?.asiento); return (a?asientoHTML(a):'')+(x.adq?.inventariable?`<div class="small muted">Bien inventariable: clasificado por DAF / Bodega (Adquisiciones 4.3) con el código <span class="mono">${esc(x.adq.inv)}</span>. Al confirmar se registra el activo.</div>`:''); },
    fields:x=>[{id:'c1',label:'Asiento cuadrado (debe = haber) y beneficiario correcto',type:'check'},{id:'c2',label:x.tipo==='oc'?'Recepción conforme y factura verificadas (cruce de 3 vías conforme)':'Factura y V°B° del servicio validados',type:'check'}],
    actions:x=>[{label:'Cambiar estado a CONFIRMADO', run:v=>{
      if(!v.c1||!v.c2) throw new Error('Marca las dos verificaciones antes de confirmar.');
      checkPeriodo(NOW);
      const a=S.asientos.find(a=>a.n===x.docs.ced.asiento); a.estado='Contabilizado'; a.fecha=NOW; x.docs.ced.estado='Confirmado'; presOf(x.pres).dev+=x.monto;
      let extra='';
      if(x.adq?.inventariable){ const code=x.adq.inv||('INV-2026-'+pad(nextSeq('inv'))); S.inventario.unshift({code, desc:x.glosa, valor:x.monto, dep:0, fecha:NOW, ref:x.id, cta:cxpOf(x.pres)?.dev||'', estado:'Vigente'}); x.docs.nicsp={trat:'Activo', inv:code}; extra=' Activo '+code+' registrado en Inventario.'; }
      if(x.tipo==='oc'){ x.docs.ced.ref=a.n; return x.docs.ced.n+' confirmado. Se responde a Adquisiciones con accounting_entry_ref '+a.n+'.'+extra; }
      return x.docs.ced.n+' confirmado. Devengado registrado.'+extra; }}]},
  adq_pago:{label:'Decreto y pago en Adquisiciones / Tesorería', rol:'ext', src:'Registro Obligaciones › "Emisión de Decreto de Pago" · Adquisiciones 5.3 (decreto, DocDigital) y 5.4 (executePayment, Tesorería)', sup:['S2','S10'],
    desc:'Adquisiciones genera el decreto de pago y Tesorería ejecuta el pago. Contabilidad espera el evento de pago completado. Si la factura aparece cedida en el Registro del SII, se registra la cesión (factoring, caso B).',
    info:x=>`<div class="small">${adqLink(x.adq?.folio)}</div>`,
    actions:x=>[{label:'Simular: pago completado (PaymentCompleted)', run:()=>{ x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.proveedor.nombre, estado:'Firmado (DocDigital)'}; x.docs.pagoEvt={medio:'Transferencia'}; return 'Adquisiciones emitió '+x.docs.dp.n+' y Tesorería pagó. Llega el evento de pago completado.'; }}]},
  pag_reg:{label:'Registrar egreso pagado', rol:'con', src:'Contrato Tesorería → Contabilidad (pago que genera el egreso pagado)', sup:['S2'],
    desc:'Con el pago informado por Tesorería, Contabilidad registra el egreso pagado y el movimiento del libro banco.',
    actions:x=>[{label:'Registrar egreso pagado', run:()=>pagar(x, x.docs.pagoEvt?.medio||'Transferencia', x.proveedor.nombre)}]},
  dp:{label:'Elaborar decreto de pago', rol:'con', src:'Obligacion sin OC › "Emisión y Firma de Decreto de Pago" · Factoring › "Elaborar Decreto de Pago" (rama No)', sup:['S10'],
    desc:'Se elabora el decreto de pago a favor del proveedor. Si la factura fue cedida, usa el recuadro de cesión (caso A: todavía no hay decreto).',
    actions:x=>[{label:'Elaborar decreto de pago', run:()=>{ x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.proveedor.nombre, estado:'Elaborado'}; return 'Decreto '+x.docs.dp.n+' elaborado.'; }}]},
  dp_firma:{label:'Firmar decreto de pago', rol:'alc', src:'Factoring › "Firmar Decreto de Pago Regular" · Obligacion sin OC › "Emisión y Firma de Decreto de Pago"',
    desc:'Alcaldía firma el decreto de pago.',
    actions:x=>[{label:'Firmar decreto', run:()=>{ x.docs.dp.estado='Firmado'; return 'Decreto '+x.docs.dp.n+' firmado.'; }}]},
  pago:{label:'Pagar y actualizar factura', rol:'tes', src:'Factoring › "Pago Regular" · "Actualizar factura regular"', sup:['S2'],
    desc:'Tesorería paga al beneficiario del decreto y marca la factura como pagada. Se registra el egreso pagado y el movimiento en el libro banco.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Transferencia','Cheque'],def:'Transferencia'}],
    actions:x=>[{label:'Registrar pago', run:v=>pagar(x, v.medio||'Transferencia', x.proveedor.nombre)}]},

  /* ===== Factoring · casos A y B (S10) ===== */
  f_reg:{label:'Registrar la cesión en la ficha de la factura', rol:'daf', src:'Factoring › "Seleccionar factura" · "Revisar" · "¿Cesión de factura?" · Word paso 2 (casos A y B)', sup:['S10'],
    desc:'El analista contable de DAF detectó la cesión en el Registro del SII y busca la factura por folio y RUT del proveedor para ver en qué etapa está.',
    info:x=>{ const c=x.docs.cesion; return `<div class="alert ${c.caso==='A'?'ok':'warn'}"><b>Caso ${c.caso}.</b> ${c.caso==='A'?'La factura todavía no tiene decreto de pago: se registra la cesión en su ficha y se cambia el receptor del pago al RUT del factoring. No hay pago que suspender.':'La factura ya tiene decreto de pago generado o en trámite: se marca la alerta y se notifica de urgencia a Tesorería para suspender el pago al proveedor original.'}<div class="small" style="margin-top:4px">Cedente: ${esc(x.proveedor?.nombre)} · Cesionario: ${esc(c.cesionario)} · Factura ${esc(x.docs.dte?.folio||x.adq?.factura||'')}</div></div>`; },
    actions:x=>[{label:x.docs.cesion.caso==='A'?'Cambiar receptor del pago al factoring':'Marcar alerta y notificar a Tesorería', run:()=>{ const c=x.docs.cesion; c.registrada=true;
      if(c.caso==='A'){ c.receptor=c.cesionario; return 'Cesión registrada en la ficha de la factura. Receptor del pago: '+c.cesionario+'.'; }
      c.alerta=true; if(x.docs.dp) x.docs.dp.estado='Alerta de cesión'; return 'Alerta de cesión marcada y notificada a Tesorería.'; }}]},
  f_susp:{label:'Suspender el pago al proveedor original', rol:'tes', src:'Factoring › "Intermedio Suspender Pago" · "Suspender Pago" (Tesorería)', sup:['S10'],
    desc:'Tesorería busca el ordenamiento de pago e interrumpe de inmediato cualquier firma de cheque, nómina de transferencia o pago por caja programado para el proveedor original.',
    actions:x=>[{label:'Suspender pago', run:()=>{ if(x.docs.dp) x.docs.dp.estado='Suspendido'; x.docs.cesion.suspendido=true; return 'Pago al proveedor original suspendido.'; }}]},
  f_dec:{label:'Elaborar borrador de decreto alcaldicio de cesión', rol:'daf', src:'Factoring › "Elaborar Decreto Alcaldicio de Cesión"',
    desc:'El analista contable redacta el decreto que reconoce la cesión del crédito: monto, folio, RUT del cedente (proveedor) y RUT del cesionario (factoring).',
    actions:x=>[{label:'Elaborar borrador', run:()=>{ const c=x.docs.cesion; if(!c.decreto) c.decreto='D.A. '+nextSeq('dec')+'/2026'; c.decEstado='Borrador'; return 'Borrador del decreto de cesión '+c.decreto+' '+(c.obs?'corregido':'elaborado')+'.'; }}]},
  f_vis:{label:'Visación jurídica y de control interno', rol:'rev', src:'Word "Factoring" paso 5 (actor no dibujado en el diagrama)', sup:['S10'],
    desc:'Control interno o Asesoría Jurídica revisa el expediente (factura, notificación del SII, recepción conforme y borrador del decreto) y visa que cumple los requisitos legales.',
    fields:x=>[{id:'c1',label:'Notificación de cesión válida en el Registro del SII',type:'check'},{id:'c2',label:'Decreto con monto, folio y RUT de cedente y cesionario correctos',type:'check'}],
    actions:x=>[{label:'Visar', run:v=>{ if(!v.c1||!v.c2) throw new Error('Marca las dos verificaciones para visar.'); x.docs.cesion.decEstado='Visado'; return 'Decreto de cesión visado.'; }},
                {label:'Devolver con observaciones', alt:true, jump:true, run:()=>{ const c=x.docs.cesion; c.obs=(c.obs||0)+1; c.decEstado='Con observaciones'; x.idx=x.stages.indexOf('f_dec'); return 'Devuelto a DAF para corregir el decreto.'; }}]},
  f_firma:{label:'Firmar decreto de cesión', rol:'alc', src:'Factoring › "Firmar Decreto de Cesión" · "Actualizar factura"',
    desc:'El Alcalde o Administrador municipal firma el decreto de cesión y el Secretario municipal lo autentica. La factura queda actualizada como cedida.',
    actions:x=>[{label:'Firmar', run:()=>{ const c=x.docs.cesion; c.decEstado='Firmado'; c.firmado=true; if(x.docs.dte) x.docs.dte.estado='Cedida'; return 'Decreto de cesión firmado y autenticado. Factura actualizada como cedida.'; }}]},
  f_rehacer:{label:'Emitir decreto de pago a nombre del factoring', rol:'con', src:'Factoring › "Elaborar / Rehacer Decreto de Pago"',
    desc:'Contabilidad emite el decreto de pago imputando la obligación al RUT del factoring, con todos los antecedentes. Si existía un decreto a nombre del proveedor original (caso B), queda anulado.',
    actions:x=>[{label:x.docs.dp?'Anular el decreto original y emitir el nuevo':'Emitir decreto de pago', run:()=>{ if(x.docs.dp) x.docs.dpAnulado=x.docs.dp.n; x.docs.dp={n:'DP-2026-'+pad(nextSeq('dp')), benef:x.docs.cesion.cesionario, estado:'Elaborado'}; return 'Decreto '+x.docs.dp.n+' a nombre de '+x.docs.cesion.cesionario+(x.docs.dpAnulado?' (anula '+x.docs.dpAnulado+')':'')+'.'; }}]},
  f_firma_dp:{label:'Firmar decreto de pago al factoring', rol:'alc', src:'Factoring › "Firmar Decreto de Pago"',
    desc:'Alcaldía firma el decreto de pago definitivo a nombre de la empresa de factoring.',
    actions:x=>[{label:'Firmar decreto', run:()=>{ x.docs.dp.estado='Firmado'; return 'Decreto '+x.docs.dp.n+' firmado.'; }}]},
  f_pago:{label:'Pagar al factoring y enviar comprobante', rol:'tes', src:'Factoring › "Pagar" · Word paso 8', sup:['S2'],
    desc:'Tesorería transfiere a la cuenta del factoring, registra el comprobante de egreso y envía el comprobante de transferencia al cesionario.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Transferencia','Cheque'],def:'Transferencia'}],
    actions:x=>[{label:'Registrar pago', run:v=>{ const m=pagar(x, v.medio||'Transferencia', x.docs.cesion.cesionario); x.docs.cesion.comprobanteEnviado=true; return m+' Comprobante enviado al cesionario.'; }}]},

  /* ===== Gasto sin OC ===== */
  s_analisis:{label:'Recepción y análisis técnico del cobro', rol:'sol', src:'Obligacion sin OC › "Recepción y Análisis Técnico del Cobro" · "¿Cobro y Servicio Correctos?"', sup:['S8'],
    desc:'La unidad administradora del contrato o servicio contrasta lo facturado con el consumo real, las lecturas de medidores o el contrato vigente.',
    actions:x=>[{label:'Cobro y servicio correctos', run:()=>'Cobro validado.'},
                {label:'Rechazar DTE en el SII y notificar', alt:true, jump:true, run:()=>{ x.estado='Rechazado'; x.idx=x.stages.length; x.docs.dte.estado='Rechazado'; return 'DTE rechazado en el SII y proveedor notificado. Expediente cerrado.'; }}]},
  s_vb:{label:'V°B° / acta de conformidad del servicio', rol:'sol', src:'Obligacion sin OC › "Emisión de V°B° / Acta de Conformidad de Servicio"',
    desc:'La unidad emite el visto bueno o acta de conformidad: el municipio reconoce la deuda.',
    actions:x=>[{label:'Emitir V°B°', run:()=>{ x.docs.acta={fecha:NOW}; return 'V°B° emitido.'; }}]},
  s_imput:{label:'Imputación y verificación de saldo', rol:'pre', src:'Obligacion sin OC › "Imputación y Verificación de Saldo Presupuestario" · "¿Presupuesto Disponible?"', sup:['S9','S4'],
    desc:'Presupuesto imputa el gasto a la cuenta correspondiente y verifica que haya saldo. En el mismo acto se registra el compromiso.',
    info:x=>{ const p=presOf(x.pres); const s=saldo(p); return `<div class="alert ${s>=x.monto?'ok':'crit'}">Saldo disponible en ${p.cod} ${esc(p.nombre)}: <b class="mono">${fmt(s)}</b> · requerido <b class="mono">${fmt(x.monto)}</b></div>`; },
    actions:x=>{
      const p=presOf(x.pres), ok=saldo(p)>=x.monto;
      if (x.modPend) return [{label:'Registrar suplemento aprobado por el Concejo', stay:true, run:()=>{ p.vig+=x.modPend; const m=x.modPend; x.modPend=0; x.estado='En curso'; hist(x,'Suplemento presupuestario +'+fmt(m),'pre'); return 'Suplemento registrado. Ya puedes imputar.'; }}];
      const a=[{label:'Imputar y comprometer', disabled:!ok, run:()=>{ if(saldo(p)<x.monto) throw new Error('Saldo insuficiente.'); p.comp+=x.monto; x.docs.imput={cta:p.cod, fecha:NOW}; return 'Imputado a '+p.cod+' y comprometido.'; }}];
      if(!ok) a.push({label:'Solicitar modificación o suplemento', alt:true, stay:true, run:()=>{ x.modPend=x.monto-saldo(p); x.estado='En espera'; return 'Solicitud por '+fmt(x.modPend)+' enviada.'; }});
      return a;
    }},
  s_exped:{label:'Validar y enviar expediente', rol:'pre', src:'Obligacion sin OC › "Validación y Envío de Expediente"',
    desc:'Presupuesto valida que el expediente tenga todos los visados (factura + V°B° + imputación) y lo envía a Contabilidad.',
    actions:x=>[{label:'Enviar a Contabilidad', run:()=>'Expediente enviado a Contabilidad.'}]},

  /* ===== Ingresos ===== */
  i_borr:{label:'Orden de ingreso en borrador', rol:'emi', src:'Ingreso Devengado › "Guardar Orden [Borrador]" · "Ejecutar Acción [Confirmar]"', sup:['S12'],
    desc:'La unidad emisora revisa el resumen de la orden (contribuyente, ítems, fechas) y la confirma, formalizando su emisión.',
    actions:x=>[{label:'Confirmar orden', run:()=>{
                  x.docs.orden.estado='Confirmada';
                  if (S.cfg.autoCID){ generarCID(x); advance(x); return 'Orden confirmada. El sistema generó '+x.docs.cid.n+' automáticamente.'; }
                  return 'Orden confirmada. Pasa a la bandeja de Contabilidad para revisión manual.'; }},
                {label:'Anular borrador', alt:true, jump:true, run:()=>{ x.estado='Anulado'; x.idx=x.stages.length; x.docs.orden.estado='Anulada'; return 'Orden anulada.'; }}]},
  i_cid:{label:'Revisión manual y aprobación', rol:'con', src:'Ingreso Devengado › "¿Auto-generar Comprobante Activo?" (NO) · "Revisión Manual y Aprobación"', sup:['S12'],
    desc:'La generación automática del comprobante está desactivada. Contabilidad verifica la imputación presupuestaria y las cuentas, y aprueba la orden.',
    actions:x=>[{label:'Aprobar y generar CID', run:()=>{ generarCID(x); return x.docs.cid.n+' generado y confirmado.'; }}]},
  i_caja:{label:'Recepcionar pago y timbrar la orden', rol:'caja', src:'Ingreso Percibido › "Recepcionar Pago / Registrar Ingreso" · "Emitir Comprobante / Timbrar Orden"', sup:['S1'],
    desc:'El contribuyente paga. El cajero busca la orden por RUT o folio, recibe el pago, timbra la orden y entrega el comprobante de ingreso. El pago queda en la rendición de caja del día.',
    fields:x=>[{id:'medio',label:'Medio de pago',type:'select',opts:['Efectivo','Tarjeta (POS Transbank)','Cheque','Transferencia'],def:'Efectivo'}],
    actions:x=>[{label:'Registrar pago y timbrar', run:v=>{ const r=rendAbierta(), medio=v.medio||'Efectivo';
      x.docs.recibo={n:'RI-2026-'+pad(nextSeq('ri')), medio, fecha:NOW, rend:r.id}; x.docs.orden.estado='Pagada (timbrada)';
      r.pagos.push({exp:x.id, n:x.docs.recibo.n, medio, monto:x.monto, contrib:x.contrib.nombre});
      return 'Pago recibido ('+medio+'). Comprobante '+x.docs.recibo.n+' entregado; queda en la rendición '+r.id+'.'; }}]},
  i_arqueo:{label:'Cierre de caja y arqueo diario', rol:'tes', src:'Ingreso Percibido › "Cuadratura Diario de Caja (Arqueo)"', sup:['S1','S14'],
    desc:'Al final de la jornada el cajero cierra su terminal y rinde efectivo, vouchers y cheques; el Tesorero hace el arqueo contra lo registrado. Se cierra la rendición completa del día.',
    info:x=>rendHTML(rendOf(x)),
    fields:x=>[{id:'contado',label:'Efectivo contado en el arqueo ($)',type:'number',def:rendTot(rendOf(x),'Efectivo')}],
    actions:x=>[{label:'Cerrar caja y aprobar arqueo', run:v=>{ const r=rendOf(x), esp=rendTot(r,'Efectivo'), c=Number(v.contado);
      if(c!==esp){ throw new Error('El arqueo no cuadra: se contaron '+fmt(c)+' en efectivo y la caja registra '+fmt(esp)+' (diferencia '+fmt(c-esp)+'). Revisa con el cajero y vuelve a contar.'); }
      r.estado='Arqueada'; r.arqueo={fecha:NOW, efectivo:c};
      const n=enBloque(x,'i_arqueo','Rendición '+r.id+' arqueada y cerrada.','tes');
      return 'Arqueo cuadrado. Rendición '+r.id+' cerrada con '+r.pagos.length+' pago(s)'+(n?'; avanzan también '+n+' orden(es) más':'')+'.'; }}]},
  i_dep:{label:'Depositar fondos en la cuenta bancaria', rol:'tes', src:'Ingreso Percibido › "Depositar Fondos en Cuenta Bancaria"', sup:['S1'],
    desc:'Al día hábil siguiente el Tesorero deposita el efectivo y los cheques de la rendición en la cuenta corriente municipal. Los pagos con tarjeta y transferencia no se depositan: llegan al banco por su liquidación.',
    info:x=>rendHTML(rendOf(x)),
    actions:x=>[{label:'Registrar depósito', run:()=>{ const r=rendOf(x), m=rendTot(r,'Efectivo')+rendTot(r,'Cheque');
      r.estado='Depositada'; r.dep={n:'DEP-2026-'+pad(nextSeq('depo')), fecha:habilSig(r.fecha), monto:m};
      const n=enBloque(x,'i_dep','Depósito '+r.dep.n+' registrado.','tes');
      return 'Depósito '+r.dep.n+' por '+fmt(m)+' (efectivo y cheques) en Banco Estado'+(n?'; avanzan también '+n+' orden(es) más':'')+'.'; }}]},
  i_perc:{label:'Validar depósito y contabilizar el percibido', rol:'con', src:'Ingreso Percibido › "Asiento Contable Percibido (Saldar Deuda)" · Word: lo ejecuta el analista contable de DAF', sup:['S1'],
    desc:'El analista contable valida el comprobante de depósito contra la rendición de caja y genera el asiento del ingreso percibido: Debe Banco / Haber Ingresos por percibir. Las órdenes de la rendición quedan cerradas.',
    info:x=>rendHTML(rendOf(x)),
    fields:x=>[{id:'c1',label:'El comprobante de depósito coincide con la rendición de caja',type:'check'}],
    actions:x=>[{label:'Contabilizar ingreso percibido', run:v=>{
      if(!v.c1) throw new Error('Valida el depósito contra la rendición antes de contabilizar.');
      const r=rendOf(x), exps=S.exps.filter(o=>o.docs.recibo&&o.docs.recibo.rend===r.id);
      const lines=[{cta:'111.02', debe:rendTot(r), haber:0, aux:''}];
      exps.forEach(o=>o.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.cxc, debe:0, haber:it.monto, aux:o.contrib.nombre}); }));
      const a=asiento('Ingreso percibido — rendición '+r.id, x.id, lines);
      exps.forEach(o=>o.items.forEach(it=>{ presIngOf(it.pres).perc+=it.monto; }));
      const cip='CIP-2026-'+pad(nextSeq('cip'));
      exps.forEach(o=>{ o.docs.cip={n:cip, medio:o.docs.recibo.medio, asiento:a.n}; o.docs.orden.estado='Pagada'; });
      if(r.dep&&r.dep.monto) movBanco('abono', r.dep.monto, 'Depósito', 'Depósito '+r.dep.n+' · rendición '+r.id, x.id);
      const tj=rendTot(r,'Tarjeta'); if(tj) movBanco('abono', tj, 'Tarjeta', 'Liquidación Transbank · rendición '+r.id, x.id);
      r.pagos.filter(p=>p.medio==='Transferencia').forEach(p=>movBanco('abono', p.monto, 'Transferencia', 'Transferencia '+p.contrib+' · '+p.n, p.exp));
      r.estado='Contabilizada'; r.cip=cip; r.asiento=a.n;
      const n=enBloque(x,'i_perc',cip+' contabilizado (asiento '+a.n+').','con','Percibido');
      x.estado='Percibido';
      return cip+' contabilizado: '+fmt(rendTot(r))+' percibidos ('+(n+1)+' orden(es)).'; }}]},

  /* ===== Cierres contables (S15, S16) ===== */
  ca_coord:{label:'Coordinar las tareas previas del cierre del ejercicio', rol:'daf', src:'07 - Cierre Anual › "Elaborar" (DAF) · Word "Cierre Anual": qué contempla la actividad', sup:['S16'],
    desc:'La DAF coordina con sus unidades los actos de conciliación y regularización previos a liquidar el ejercicio.',
    fields:x=>[{id:'t1',label:'Tesorería: conciliación bancaria y arqueo al 31-12, cheques girados y no cobrados, especies valoradas',type:'check'},
               {id:'t2',label:'Presupuesto: grado de ejecución, saldos por percibir y compromisos que pasan al ejercicio siguiente',type:'check'},
               {id:'t3',label:'Adquisiciones / Inventario: existencias, altas y bajas de activo fijo, depreciación anual',type:'check'},
               {id:'t4',label:'Rentas y Patentes: deudas por cobrar y provisión de incobrables',type:'check'},
               {id:'t5',label:'Contabilidad: insumos para los estados financieros',type:'check'}],
    actions:x=>[{label:'Registrar tareas previas completas', run:v=>{ if(!['t1','t2','t3','t4','t5'].every(k=>v[k])) throw new Error('Faltan tareas previas de alguna unidad de la DAF.'); x.docs.cierre.previas=true; return 'Tareas previas de Tesorería, Presupuesto, Inventario, Rentas y Contabilidad completas.'; }}]},
  ci_prep:{label:'Preparar el cierre y enviar a revisión', rol:'con', src:'06 - Cierre Mensual › "Revisar imputaciones presupuestarias" · Word: Nuevo → Archivo → Ver asientos → Enviar a revisión', sup:['S15'],
    desc:'Contabilidad revisa que los devengos de ingresos y gastos estén bien imputados, adjunta los respaldos (conciliaciones, certificados) y revisa los asientos del período con "Ver asientos".',
    info:x=>cierreInfo(x),
    fields:x=>[{id:'c1',label:'Imputaciones presupuestarias de ingresos y gastos del período revisadas',type:'check'},{id:'adj',label:'Respaldo para adjuntar',type:'select',opts:['Conciliaciones bancarias del período','Certificados de saldos bancarios','Informe de ejecución presupuestaria','Certificados de disponibilidad presupuestaria'],def:'Conciliaciones bancarias del período'}],
    actions:x=>[{label:'Enviar a revisión', run:v=>{ if(!v.c1) throw new Error('Marca la revisión de imputaciones presupuestarias.'); if(!x.docs.cierre.adjuntos.length) throw new Error('Adjunta al menos un respaldo antes de enviar a revisión.'); x.docs.cierre.estado='Enviado a revisión'; if(x.estado==='Reabierto') x.estado='En curso'; return 'Cierre '+x.periodo+' enviado a revisión.'; }},
                {label:'Adjuntar respaldo', sec:true, stay:true, run:v=>{ x.docs.cierre.adjuntos.push({n:v.adj, fecha:NOW}); return 'Respaldo adjuntado: '+v.adj+'.'; }}]},
  ci_cerrar:{label:'Cerrar período', rol:'con', src:'Word "Cierre Mensual y Anual": "Cerrar Periodo" (estado Cerrado, historial con fecha, hora y usuario)', sup:['S15'],
    desc:'Se verifican las condiciones y se cierra el período: el estado pasa a Cerrado y queda en el historial. Desde ese momento no se aceptan asientos con fecha dentro del período.',
    info:x=>cierreInfo(x),
    actions:x=>[{label:'Cerrar período', run:()=>{ const b=cierreBloqueos(x); if(b.length) throw new Error('No se puede cerrar '+x.periodo+'. '+b.join(' ')); x.docs.cierre.estado='Cerrado'; x.docs.cierre.cerrado={fecha:NOW, hora:hhmm()}; if(x.tipoCierre==='Anual') x.docs.cierre.saldos=true; return 'Período '+x.periodo+' cerrado ('+fdate(NOW)+' '+x.docs.cierre.cerrado.hora+', Contabilidad).'+(x.tipoCierre==='Anual'?' Se compilaron los saldos del ejercicio.':''); }},
                {label:'Devolver a borrador', alt:true, jump:true, run:()=>{ x.idx=x.stages.indexOf('ci_prep'); x.docs.cierre.estado='Borrador'; return 'Cierre devuelto a borrador.'; }}]},
  ci_cgr:{label:'Informar a la CGR (SICOGEN II)', rol:'con', src:'06 - Cierre Mensual › "Informar CGR"',
    desc:'Con el mes cerrado, la información financiera y presupuestaria se consolida y se envía a la Contraloría por SICOGEN II. Si hay que corregir, se reabre el cierre con una razón obligatoria.',
    fields:x=>[{id:'razon',label:'Razón de reapertura (solo si vas a reabrir)',type:'text',def:''}],
    actions:x=>[{label:'Generar y enviar informe a la CGR', run:()=>{ x.docs.cierre.cgr={fecha:NOW, n:'SICOGEN-'+x.hasta.slice(0,7)}; return 'Informe de '+x.periodo+' enviado a la CGR (SICOGEN II).'; }},
                {label:'Reabrir cierre', alt:true, jump:true, run:v=>reabrir(x, v.razon)}]},
  ca_asientos:{label:'Generar asientos de cierre', rol:'con', src:'Word "Cierre Anual" paso 4 (Generar Asientos de Cierre)', sup:['S16'],
    desc:'El sistema genera tres asientos en Borrador: traspaso de ingresos, traspaso de gastos y resultado del ejercicio contra patrimonio neto.',
    actions:x=>[{label:'Generar asientos de cierre', run:()=>{ const r=asientosCierreAnual(x); x.docs.cierre.asientos=r.ns; x.docs.cierre.resultado=r.res; return 'Asientos '+r.ns.join(', ')+' generados en Borrador. Resultado del ejercicio: '+fmt(r.res)+'.'; }}]},
  ca_conf:{label:'Revisar y confirmar asientos de cierre', rol:'daf', src:'Word "Cierre Anual" paso 5 (Borrador para auditoría técnica y confirmación posterior)', sup:['S16'],
    desc:'La Jefatura de Contabilidad audita los asientos de cierre y los confirma.',
    info:x=>(x.docs.cierre.asientos||[]).map(n=>{ const a=S.asientos.find(a=>a.n===n); return a?asientoHTML(a):''; }).join(''),
    fields:x=>[{id:'c1',label:'Asientos de cierre revisados y cuadrados',type:'check'}],
    actions:x=>[{label:'Confirmar asientos de cierre', run:v=>{ if(!v.c1) throw new Error('Marca la revisión de los asientos.'); (x.docs.cierre.asientos||[]).forEach(n=>{ const a=S.asientos.find(a=>a.n===n); if(a) a.estado='Contabilizado'; }); return 'Asientos de cierre contabilizados.'; }}]},
  ca_eeff:{label:'Estados financieros e informe a la CGR y SUBDERE', rol:'daf', src:'Word "Cierre Anual": Contabilidad / DAF (estados financieros e informe consolidado)',
    desc:'Se elaboran los estados financieros y el informe de gestión financiera, que se envían a la CGR (SICOGEN) y a la SUBDERE y se publican para la cuenta pública del Alcalde.',
    fields:x=>[{id:'e1',label:'Balance de 8 columnas',type:'check'},{id:'e2',label:'Estado de situación financiera',type:'check'},{id:'e3',label:'Estado de resultados',type:'check'},{id:'e4',label:'Estado de flujos de efectivo',type:'check'}],
    actions:x=>[{label:'Enviar a la CGR y SUBDERE', run:v=>{ if(!['e1','e2','e3','e4'].every(k=>v[k])) throw new Error('Faltan estados financieros.'); x.docs.cierre.eeff={fecha:NOW}; return 'Estados financieros '+x.periodo+' enviados a la CGR y SUBDERE.'; }}]},

  /* ===== Inventario: baja de bienes (S17) ===== */
  b_eval:{label:'Revisar el bien: ¿dar de baja?', rol:'con', src:'Inventario › "Mantener actualizado" · "¿Dar de baja?"', sup:['S17'],
    desc:'Contabilidad mantiene actualizado el inventario. Si el bien debe darse de baja, se tramita un decreto; si no, se actualiza su ficha.',
    info:x=>{ const b=S.inventario.find(b=>b.code===x.bien); return b?`<div class="doc"><div class="dt"><span>Bien ${esc(b.code)}</span><span>${esc(b.estado)}</span></div><div class="dn">${esc(b.desc)}</div><div class="small muted">Alta ${fdate(b.fecha)} · cuenta ${esc(b.cta)} · valor ${fmt(b.valor)} · depreciación acumulada ${fmt(b.dep)} · valor libro ${fmt(b.valor-b.dep)}</div></div>`:''; },
    fields:x=>[{id:'motivo',label:'Motivo',type:'select',opts:['Obsolescencia','Deterioro irreparable','Pérdida o robo','Remate o enajenación'],def:'Obsolescencia'}],
    actions:x=>[{label:'Sí: dar de baja', run:v=>{ x.docs.baja={motivo:v.motivo||'Obsolescencia'}; return 'Se tramitará la baja por '+x.docs.baja.motivo.toLowerCase()+'.'; }},
                {label:'No: mantener y actualizar la ficha', alt:true, jump:true, run:()=>{ const b=S.inventario.find(b=>b.code===x.bien); if(b) b.revisado=NOW; x.idx=x.stages.length; x.estado='Cerrado'; return 'Ficha del bien actualizada. Se mantiene en inventario.'; }}]},
  b_dec:{label:'Elaborar decreto de baja', rol:'con', src:'Inventario › "Elaborar Decreto"',
    desc:'Contabilidad elabora el decreto alcaldicio que autoriza la baja del bien.',
    actions:x=>[{label:'Elaborar decreto', run:()=>{ x.docs.baja.decreto='D.A. '+nextSeq('dec')+'/2026'; return 'Decreto de baja '+x.docs.baja.decreto+' elaborado.'; }}]},
  b_firma:{label:'Firmar decreto de baja', rol:'alc', src:'Inventario › "Firmar" (Alcaldía)',
    desc:'Alcaldía firma el decreto de baja.',
    actions:x=>[{label:'Firmar', run:()=>{ x.docs.baja.firmado=true; return 'Decreto de baja firmado.'; }}]},
  b_reg:{label:'Registrar la baja y actualizar el inventario', rol:'con', src:'Inventario › "Registrar y Actualizar"', sup:['S17'],
    desc:'Con el decreto firmado, Contabilidad rebaja el bien del inventario y registra el asiento de baja por su valor libro.',
    actions:x=>[{label:'Registrar baja', run:()=>{ const b=S.inventario.find(b=>b.code===x.bien); const vl=b.valor-b.dep;
      const lines=[{cta:'531.29',debe:vl,haber:0,aux:''}]; if(b.dep) lines.push({cta:'141.99',debe:b.dep,haber:0,aux:''}); lines.push({cta:b.cta,debe:0,haber:b.valor,aux:''});
      const a=asiento('Baja de bien '+b.code+' — '+b.desc, x.id, lines); b.estado='De baja'; b.baja={fecha:NOW, decreto:x.docs.baja.decreto, asiento:a.n}; x.docs.baja.asiento=a.n;
      return 'Bien '+b.code+' dado de baja (asiento '+a.n+').'; }}]}
};

function pagar(x, medio, benef){
  const c=cxpOf(x.pres);
  const a=asiento('Egreso pagado — '+x.glosa, x.id, [{cta:c.cod, debe:x.monto, haber:0, aux:benef},{cta:c.pag||'111.02', debe:0, haber:x.monto, aux:''}]);
  x.docs.pago={fecha:NOW, medio, benef, asiento:a.n, n:(medio==='Cheque'?'CH-':'TR-')+nextSeq('mov')};
  if(x.docs.dp) x.docs.dp.estado='Pagado';
  if(x.docs.dte) x.docs.dte.estado='Pagada';
  presOf(x.pres).pag+=x.monto;
  movBanco('cargo', x.monto, medio, 'Pago '+(x.docs.dp?.n||'')+' · '+benef, x.id);
  x.estado='Pagado';
  return 'Pago registrado a '+benef+' por '+fmt(x.monto)+'.';
}
function generarCID(x){
  const lines=[];
  x.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.cxc, debe:it.monto, haber:0, aux:x.contrib.nombre}); });
  x.items.forEach(it=>{ const pi=presIngOf(it.pres); lines.push({cta:pi.ing, debe:0, haber:it.monto, aux:''}); });
  const a=asiento('Ingreso devengado — '+x.glosa, x.id, lines);
  x.items.forEach(it=>{ presIngOf(it.pres).dev+=it.monto; });
  x.docs.cid={n:'CID-2026-'+pad(nextSeq('cid')), estado:'Confirmado', asiento:a.n, modo:S.cfg.autoCID?'Automático':'Manual'};
}

const FLOWS = {
  preob:['pb_reg','pb_oc'],
  oc:['ced','ced_conf','adq_pago','pag_reg'],
  sinoc:['s_analisis','s_vb','s_imput','s_exped','ced_s','ced_conf','dp','dp_firma','pago'],
  ing:['i_borr','i_cid','i_caja','i_arqueo','i_dep','i_perc'],
  factoring:['f_reg','f_susp','f_dec','f_vis','f_firma','f_rehacer','f_firma_dp','f_pago'],
  factoringA:['f_reg','f_dec','f_vis','f_firma','f_rehacer','f_firma_dp','f_pago'],
  cm:['ci_prep','ci_cerrar','ci_cgr'],
  ca:['ca_coord','ci_prep','ci_cerrar','ca_asientos','ca_conf','ca_eeff'],
  baja:['b_eval','b_dec','b_firma','b_reg']
};
const FLOWNAME = {preob:'Preobligación', oc:'Devengado desde Adquisiciones', sinoc:'Gasto sin OC', ing:'Ingreso', cierre:'Cierre contable', baja:'Baja de inventario'};
const LISTVIEW = {preob:'preob', oc:'oc', sinoc:'sinoc', ing:'ing', cierre:'cierres', baja:'inv'};

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
  const caso = (x.docs.dp || x.tipo==='oc') ? 'B' : 'A';
  if(x.tipo==='oc' && !x.docs.dp) x.docs.dp={n:'Decreto 5.3 ('+x.adq.folio+')', benef:x.proveedor.nombre, estado:'En trámite en Adquisiciones'};
  x.docs.cesion={cesionario, fecha:NOW, caso};
  const done=x.stages.slice(0,x.idx);
  x.stages=[...done, ...(caso==='A'?FLOWS.factoringA:FLOWS.factoring)];
  hist(x,'Cesión detectada en el Registro del SII: factura cedida a '+cesionario+' (caso '+caso+').','daf');
}

/* ---------- Datos de ejemplo ---------- */
let S;
function blank(){
  const P=(cod,nombre,vig,comp,dev,pag)=>({cod,nombre,vig,preob:0,comp,dev,pag});
  return {
    role:'con', view:'guia', sel:null, err:null, supHl:null, cfgHl:null, returnTo:null, draft:null, diarioTab:'Todos', diarioFiltro:null,
    cfg:{autoCID:true},
    seq:{exp:140, cdp:88, oc:311, ced:512, dp:497, cid:1203, cip:1180, as:2210, dec:75, inv:640, mov:900, pre:36, ri:4410, rc:257, depo:118, ct:41, cie:14},
    pres:[
      P('22.02.002','Vestuario, accesorios y prendas diversas',12000000,7100000,6400000,6400000),
      P('22.04.001','Materiales de oficina',18000000,11200000,10050000,9600000),
      P('22.04.010','Materiales para mantenimiento y reparaciones',14000000,8300000,5100000,5100000),
      P('22.05.001','Electricidad',42000000,29300000,29300000,28100000),
      P('22.05.002','Agua',7800000,5100000,5100000,4700000),
      P('22.05.006','Telefonía celular',9600000,6900000,6300000,6300000),
      P('22.06.002','Mantenimiento y reparación de vehículos',260000000,41000000,38000000,36500000),
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
      {cod:'215.22.06.002',nombre:'C x P Mantenimiento de vehículos',pres:'22.06.002',dev:'531.22.06',pag:'111.02'},
      {cod:'215.22.08.001',nombre:'C x P Servicios de aseo',pres:'22.08.001',dev:'',pag:'111.02'},
      {cod:'215.22.09.002',nombre:'C x P Arriendo de edificios',pres:'22.09.002',dev:'531.22.09',pag:'111.02'},
      {cod:'215.29.04',nombre:'C x P Mobiliario y otros',pres:'29.04',dev:'141.04',pag:'111.02'},
      {cod:'215.29.06.001',nombre:'C x P Equipos computacionales',pres:'29.06.001',dev:'141.06',pag:'111.02'}
    ],
    ctaDeb:[
      {cod:'531.22.02',nombre:'Gasto en vestuario'},{cod:'531.22.04',nombre:'Gasto en materiales de uso o consumo'},
      {cod:'531.22.05',nombre:'Gasto en servicios básicos'},{cod:'531.22.06',nombre:'Gasto en mantenimiento y reparaciones'},{cod:'531.22.08',nombre:'Gasto en servicios generales'},
      {cod:'531.22.09',nombre:'Gasto en arriendos'},{cod:'531.26.01',nombre:'Gastos y comisiones bancarias'},
      {cod:'141.04',nombre:'Mobiliario y otros (activo)'},{cod:'141.06',nombre:'Equipos computacionales (activo)'},
      {cod:'111.03',nombre:'Bancos del sistema financiero (ejemplo del diagrama)'}
    ],
    bancos:[{cod:'111.02',nombre:'Banco Estado cta. cte. 1234567 (cuenta General)'},{cod:'111.03',nombre:'Bancos del sistema financiero'}],
    ctaIng:[
      {cod:'115.03.01.001',nombre:'C x C Patentes municipales'},{cod:'451.03.01.001',nombre:'Ingresos por patentes'},
      {cod:'115.03.01.002',nombre:'C x C Derechos de aseo'},{cod:'451.03.01.002',nombre:'Ingresos por derechos de aseo'},
      {cod:'115.03.01.003',nombre:'C x C Otros derechos'},{cod:'451.03.01.003',nombre:'Ingresos por otros derechos'}
    ],
    // Cuentas usadas por conciliación, cierres y bajas (códigos ilustrativos: S11, S16, S17)
    ctaOtras:[
      {cod:'214.09',nombre:'Depósitos por identificar (pasivo transitorio)'},{cod:'531.21',nombre:'Gastos en personal'},
      {cod:'531.29',nombre:'Pérdida por baja de bienes'},{cod:'141.99',nombre:'Depreciación acumulada'},
      {cod:'611',nombre:'Resumen de resultados'},{cod:'311',nombre:'Resultado del ejercicio (patrimonio neto)'}
    ],
    proveedores:[
      {rut:'76.184.230-5',nombre:'Comercial Libra SpA'},{rut:'76.123.456-7',nombre:'Comercial Sur SpA'},{rut:'96.870.110-3',nombre:'TecnoAndes Ltda.'},
      {rut:'77.402.915-K',nombre:'Aseos Integrales del Sur S.A.'},{rut:'76.009.771-2',nombre:'Mobiliario Nativa SpA'},
      {rut:'96.911.340-6',nombre:'Red Móvil Austral S.A.'},{rut:'96.800.572-3',nombre:'Distribuidora Eléctrica Central S.A.'},
      {rut:'96.713.150-1',nombre:'Aguas del Valle S.A.'},{rut:'78.115.330-1',nombre:'Textiles Cordillera Ltda.'},
      {rut:'76.330.118-4',nombre:'Inmobiliaria Los Aromos SpA'},{rut:'76.451.902-3',nombre:'Servicios Automotrices Ruta 5 SpA'}
    ],
    cesionarios:['Factor Capital Andino S.A.','Fondo Pyme Financiero SpA'],
    contribuyentes:[
      {rut:'76.543.210-8',nombre:'Almacén El Roble Ltda.',email:'contacto@elroble.cl',dir:'Av. Central 1240'},
      {rut:'15.482.337-2',nombre:'María Fernanda Soto',email:'mfsoto@correo.cl',dir:'Los Pinos 88'},
      {rut:'77.210.884-4',nombre:'Minimarket Doña Rosa SpA',email:'donarosa@correo.cl',dir:'Pasaje Norte 17'},
      {rut:'76.998.120-1',nombre:'Productora Eventos Sur SpA',email:'hola@eventossur.cl',dir:'Camino Real 402'}
    ],
    // utm: el monto se calcula en UTM con el valor de ejemplo de Configuración (Word: cálculo con reajustes UTM/UF)
    conceptos:[
      {n:'Patente comercial (semestral)',pres:'03.01.001'},{n:'Derecho de aseo comercial',pres:'03.01.002'},
      {n:'Permiso de ocupación de BNUP (por mes)',pres:'03.01.003',utm:2},{n:'Derechos de publicidad',pres:'03.01.003'}
    ],
    deptos:['Depto. de Patentes','Depto. de Rentas','Dirección de Obras','Dirección de Tránsito','Juzgado de Policía Local'],
    unidades:['DIDECO','DAF','Oficina de Partes','Secretaría Municipal','Dirección de Obras','Juzgado de Policía Local','SECPLAN'],
    exps:[], asientos:[], movs:[], inventario:[], rends:[],
    // Otras cuentas corrientes (S11): se muestran con estado de ejemplo; la General se recorre en la conciliación
    concCuentas:[
      {mes:'2026-08', general:true, cta:'111.02', nombre:'General (Banco Estado)'},
      {mes:'2026-08', cta:'111.02.2', nombre:'Salud (Banco Estado)', estado:'Archivada'},
      {mes:'2026-08', cta:'111.02.3', nombre:'Educación (Banco Estado)', estado:'Archivada'},
      {mes:'2026-08', cta:'111.02.4', nombre:'FNDR (Banco Estado)', estado:'Archivada'},
      {mes:'2026-08', cta:'111.02.5', nombre:'Fondos de terceros (Banco Estado)', estado:'Archivada'}
    ],
    utm:69000,
    // Ejecución de ejemplo del ejercicio 2025 para los asientos de cierre anual (S16)
    ej2025:{ing:[{cta:'451.03.01.001',m:790400000},{cta:'451.03.01.002',m:88300000},{cta:'451.03.01.003',m:49100000}],
            gas:[{cta:'531.21',m:402700000},{cta:'531.22.02',m:11300000},{cta:'531.22.04',m:36420000},{cta:'531.22.05',m:71850000},{cta:'531.22.08',m:288600000},{cta:'531.22.09',m:18900000}]},
    conc:null
  };
}
function newExp(tipo, o){
  const pref={ing:'OI-2026-', cierre:'CIE-', baja:'BAJ-2026-', preob:'PRE-EXP-2026-'}[tipo]||'EXP-2026-';
  const stages = tipo==='cierre' ? [...FLOWS[o.tipoCierre==='Anual'?'ca':'cm']] : [...FLOWS[tipo]];
  const x={id:pref+pad(nextSeq(tipo==='cierre'?'cie':'exp')), tipo, stages, idx:0, estado:'En curso', docs:{}, hist:[], creado:NOW, ...o};
  S.exps.unshift(x);
  if(tipo==='oc') hist(x, 'Resolución de compra de Adquisiciones ('+o.adq.folio+'): recepción conforme y cruce de 3 vías completados.', 'ext');
  else if(tipo==='preob') hist(x, 'Decreto de adjudicación recibido desde Adquisiciones ('+o.adq.folio+').', 'ext');
  else hist(x, tipo==='cierre'?'Cierre '+o.tipoCierre.toLowerCase()+' '+o.periodo+' creado en Borrador.':'Expediente creado.', STG[x.stages[0]].rol);
  return x;
}
function defaults(x){ const st=STG[cur(x)]; const f=st.fields?st.fields(x):[]; const v={}; f.forEach(d=>v[d.id]= d.type==='check'?true:(d.def??(d.opts?d.opts[0]:''))); return v; }
function runTo(x, stage){ let g=0; while(x.idx<x.stages.length && cur(x)!==stage && g++<40) runAction(x,0,defaults(x)); }
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function nuevoCierre(tipo, mes, anio){
  anio=Number(anio);
  let desde, hasta, periodo;
  if(tipo==='Anual'){ desde=anio+'-01-01'; hasta=anio+'-12-31'; periodo='Ejercicio '+anio; }
  else { const m=Number(mes); const last=new Date(anio, m, 0).getDate(); desde=anio+'-'+pad(m,2)+'-01'; hasta=anio+'-'+pad(m,2)+'-'+pad(last,2); periodo=MESES[m-1]+' '+anio; }
  const dup=S.exps.find(x=>x.tipo==='cierre'&&x.tipoCierre===tipo&&x.desde===desde);
  if(dup) throw new Error('Ya existe el cierre '+tipo.toLowerCase()+' de '+periodo+' ('+dup.id+').');
  const x=newExp('cierre',{tipoCierre:tipo, periodo, desde, hasta, glosa:'Cierre '+tipo.toLowerCase()+' '+periodo, monto:0});
  x.docs.cierre={estado:'Borrador', adjuntos:[]};
  return x;
}
function nuevaBaja(code){
  const b=S.inventario.find(b=>b.code===code); if(!b) throw new Error('Bien no encontrado.');
  const ab=S.exps.find(x=>x.tipo==='baja'&&x.bien===code&&isOpen(x)); if(ab) return ab;
  return newExp('baja',{bien:code, glosa:'Revisión de '+b.code+' — '+b.desc, monto:b.valor-b.dep, unidad:b.unidad||'Contabilidad'});
}
function seed(){
  /* [Demo] Cada expediente es un caso del guion (ver CASES y la vista "Guía de demo").
     Quedan detenidos justo donde empieza lo que se quiere mostrar; nada extra viene ejecutado. */
  S=blank();
  const pv=n=>S.proveedores.find(p=>p.nombre.startsWith(n));
  const at=(d,f)=>{NOW=d; f(); NOW=TODAY;};
  let x;
  const A=(folio,real,modalidad,oc,factura,inv)=>({folio,real,modalidad,oc,factura,inventariable:!!inv,inv:inv||''});
  const oc=(caso,glosa,unidad,pres,monto,prov,adq)=>newExp('oc',{caso,glosa,unidad,pres,monto,proveedor:pv(prov),adq,docs:{oc:{n:adq.oc,monto},dte:{folio:adq.factura,monto},crc:{n:'Recepción conforme '+adq.folio}}});
  const so=(caso,glosa,unidad,pres,monto,prov,folio,fecha)=>newExp('sinoc',{caso,glosa,unidad,pres,monto,proveedor:pv(prov),docs:{dte:{folio,monto,fecha}}});
  const C=r=>S.contribuyentes.find(c=>c.rut===r);
  const oi=(caso,glosa,depto,venc,rut,concepto,pres,monto)=>{ const y=newExp('ing',{caso,glosa,depto,venc,emision:NOW,periodo:'2° semestre 2026',contrib:C(rut),items:[{c:concepto,pres,monto}],monto}); y.docs.orden={estado:'Borrador'}; return y; };
  // Compromisos (preobligación = compromiso cierto, S5) ya registrados para las compras de los casos: sin esto el devengado superaría al comprometido.
  [['22.04.001',1180000],['22.08.001',24500000],['29.06.001',5940000],['22.04.010',2950000],['29.04',3980000],['22.04.001',980000]].forEach(([c,m])=>{ S.pres.find(p=>p.cod===c).comp+=m; });
  // C13 · reserva del CDP de ADQ-2026-00045 (mantención de flota), ajustada al monto adjudicado en 3.10
  S.pres.find(p=>p.cod==='22.06.002').preob=178500000;
  // Inventario existente (para la baja, C18)
  S.inventario.push(
    {code:'INV-2019-0214', desc:'Impresora multifuncional Oficina de Partes', valor:1450000, dep:1160000, fecha:'2019-06-14', ref:null, cta:'141.06', estado:'Vigente', unidad:'Oficina de Partes'},
    {code:'INV-2020-0102', desc:'Escritorios modulares DIDECO (4 unidades)', valor:1960000, dep:1176000, fecha:'2020-03-02', ref:null, cta:'141.04', estado:'Vigente', unidad:'DIDECO'});
  // C5 · referencia: ciclo completo ya ejecutado (con alta de activo asignada por Bodega)
  at('2026-08-20',()=>{ x=oc('C5','Equipamiento ergonómico Tesorería','Finanzas','29.04',3980000,'Mobiliario Nativa',A('ADQ-2026-00231',true,'Convenio Marco','2417-88-CM26','30871','INV-2026-0631')); runTo(x,null); });
  // C4 · devengado listo, espera el pago de Adquisiciones (en Adquisiciones está en 5.4)
  at('2026-09-03',()=>{ x=oc('C4','Señalética peatonal — reposición','Dirección de Obras','22.04.010',2950000,'Comercial Libra',A('ADQ-2026-00202',true,'Convenio Marco','2417-91-CM26','41220')); runTo(x,'adq_pago'); });
  // C6 · factoring caso B: devengado listo, decreto 5.3 en trámite en Adquisiciones
  at('2026-09-04',()=>{ x=oc('C6','Tóner impresoras DAF','DAF','22.04.001',980000,'Comercial Libra',A('ADQ-2026-00253',false,'Compra Ágil','4021-47-SE26','41388')); runTo(x,'adq_pago'); });
  // C2 · bloqueo: Adquisiciones intenta crear el CED y la cuenta no está configurada
  at('2026-09-08',()=>{ oc('C2','Servicio de aseo dependencias municipales — agosto','DAF','22.08.001',24500000,'Aseos Integrales',A('ADQ-2026-00250',false,'Licitación Pública','2417-12-LR26','99812')); });
  // C3 · bien inventariable: Adquisiciones ya creó el CED; Bodega asignó el código en 4.3
  at('2026-09-11',()=>{ x=oc('C3','Notebooks Oficina de Partes (6 unidades)','Oficina de Partes','29.06.001',5940000,'TecnoAndes',A('ADQ-2026-00252',false,'Convenio Marco','2417-97-CM26','55102','INV-2026-0658')); runTo(x,'ced_conf'); });
  // C7 · sin OC camino feliz (recién llegada la factura)
  at('2026-09-05',()=>{ so('C7','Agua potable edificio consistorial — agosto','DAF','22.05.002',612400,'Aguas del Valle','8841203','2026-09-05'); });
  // C8 · sin OC bloqueado por saldo (análisis y V°B° hechos)
  at('2026-09-10',()=>{ x=so('C8','Consumo eléctrico alumbrado público — agosto','DAF','22.05.001',14380000,'Distribuidora','51902774','2026-09-10'); runTo(x,'s_imput'); });
  // C9 · sin OC con cobro duplicado
  at('2026-09-16',()=>{ so('C9','Arriendo oficina DIDECO — septiembre (cobro duplicado)','DIDECO','22.09.002',1650000,'Inmobiliaria','1187','2026-09-16'); });
  // C14 · factoring caso A: devengado confirmado, todavía sin decreto de pago
  at('2026-09-12',()=>{ x=so('C14','Arriendo bodega municipal — septiembre','DAF','22.09.002',1320000,'Inmobiliaria','1179','2026-09-02'); runTo(x,'dp'); });
  // C10 y C11 · órdenes de ingreso en borrador
  at('2026-09-19',()=>{ oi('C10','Patente comercial 2° semestre','Depto. de Patentes','2026-10-31','76.543.210-8','Patente comercial (semestral)','03.01.001',68000); });
  at('2026-09-19',()=>{ oi('C11','Derecho de aseo comercial 2° semestre','Depto. de Rentas','2026-10-31','77.210.884-4','Derecho de aseo comercial','03.01.002',92500); });
  // C15 · rendición de caja del día con tres pagos ya timbrados (efectivo, cheque y tarjeta)
  at('2026-09-18',()=>{
    [['Permiso BNUP — feria de Fiestas Patrias','Dirección de Obras','76.998.120-1','Permiso de ocupación de BNUP (por mes)',138000,'Efectivo'],
     ['Derecho de aseo comercial — local Los Pinos','Depto. de Rentas','15.482.337-2','Derecho de aseo comercial',54500,'Cheque'],
     ['Derechos de publicidad — letrero luminoso','Depto. de Rentas','77.210.884-4','Derechos de publicidad',92500,'Tarjeta (POS Transbank)']]
    .forEach(([g,d,rut,c,m,medio])=>{ const k=S.conceptos.find(k=>k.n===c); const y=oi('C15',g,d,'2026-09-30',rut,c,k.pres,m); runAction(y,0,{}); NOW=TODAY; runAction(y,0,{medio}); NOW='2026-09-18'; });
  });
  // C18 · baja de inventario
  at('2026-09-22',()=>{ const y=nuevaBaja('INV-2019-0214'); y.caso='C18'; });
  // C16 · cierre mensual de agosto (en borrador) · C17 · cierre anual 2025 (en borrador)
  at('2026-09-22',()=>{ const y=nuevoCierre('Mensual',8,2026); y.caso='C16'; });
  at('2026-09-22',()=>{ const y=nuevoCierre('Anual',12,2025); y.caso='C17'; });
  S.exps.sort((a,b)=>b.id.localeCompare(a.id));
  S.conc=seedConc();
}
function seedConc(){
  const L=(id,f,tipo,monto,medio,glosa)=>({id,fecha:'2026-08-'+f,tipo,monto,medio,glosa,m:null});
  const B=(id,f,monto,desc)=>({id,fecha:'2026-08-'+f,monto,desc,medio:/CHEQUE/.test(desc)?'Cheque':/TRANSBANK/.test(desc)&&monto>0?'Tarjeta':/COMISION/.test(desc)?'Cargo bancario':/NO IDENTIFICADO/.test(desc)?'No identificado':'Transferencia',m:null});
  return {periodo:'Agosto 2026', mes:'2026-08', cta:'111.02', idx:0, estado:'En curso', ini:148320500, cartola:false, obsRev:0,
    stages:['recopilar','cheques','tarjetas','comparar','conciliar','autorizar','revisar','archivar'], hist:[],
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

/* ---------- Conciliación (S11) ---------- */
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
const devolverConc = (c, quien) => ({label:'Devolver con observaciones', alt:true, jump:true, run:()=>{ c.obsRev++; c.obsDe=quien; c.idx=c.stages.indexOf('conciliar'); return 'Devuelta al encargado de conciliaciones con observaciones.'; }});
const CST = {
  recopilar:{label:'Recopilar antecedentes del banco', rol:'con', desc:'El encargado de conciliaciones (DAF-Contabilidad) descarga la cartola y el certificado de saldos desde la banca empresas y extrae el libro banco del ERP para la cuenta.',
    actions:c=>[{label:'Cargar cartola, certificado de saldos y libro banco', run:()=>{ c.cartola=true; return 'Cartola cargada: '+c.banco.length+' movimientos; certificado de saldos y libro banco ('+c.libro.length+' movimientos) listos.'; }}]},
  cheques:{label:'Cotejar cheques', rol:'con', desc:'Se revisan los cheques girados (del mes y pendientes de meses anteriores) contra los cobrados en la cartola.',
    actions:c=>[{label:'Cotejar cheques', run:()=>matchBy(c,'Cheque')+' cheque(s) cruzado(s).'}]},
  tarjetas:{label:'Cotejar recaudaciones (POS / tarjetas)', rol:'con', desc:'Se cruzan las liquidaciones del operador (Transbank) y las recaudaciones de caja con los abonos de la cartola.',
    actions:c=>[{label:'Cotejar tarjetas', run:()=>matchBy(c,'Tarjeta')+' abono(s) con tarjeta cruzado(s).'}]},
  comparar:{label:'Comparar libro banco con cartola', rol:'con', desc:'Se cruza el resto de los movimientos por monto y sentido.',
    actions:c=>[{label:'Comparar movimientos', run:()=>matchBy(c,null)+' movimiento(s) cruzado(s).'}]},
  conciliar:{label:'Identificar partidas y conciliar', rol:'con', sup:['S11'], desc:'Se clasifican las diferencias: cheques girados no cobrados, depósitos en tránsito, cargos bancarios no contabilizados y abonos no identificados. Los cargos se registran con comprobante de traspaso y los abonos no identificados en una cuenta de pasivo transitoria. Luego se genera el cuadro de conciliación.',
    actions:c=>{ const r=concReport(c); const a=[{label:'Generar cuadro de conciliación', run:()=>{ c.informe=true; return 'Cuadro de conciliación generado y firmado por el encargado.'; }}];
      if(r.cb.some(b=>b.medio==='Cargo bancario')) a.push({label:'Registrar comprobante de traspaso (comisiones)', alt:true, stay:true, run:()=>{
        const cs=c.banco.filter(b=>!b.m&&b.medio==='Cargo bancario'); const t=cs.reduce((s,b)=>s-b.monto,0);
        const ct='CT-2026-'+pad(nextSeq('ct'));
        const as=asiento('Comprobante de traspaso '+ct+' — comisiones bancarias '+c.periodo.toLowerCase(),'Conciliación '+c.periodo,[{cta:'531.26.01',debe:t,haber:0,aux:''},{cta:'111.02',debe:0,haber:t,aux:''}],null,{fecha:'2026-08-31',tipo:'Traspaso'});
        cs.forEach(b=>{ const id='L'+(c.libro.length+1); c.libro.push({id,fecha:b.fecha,tipo:'cargo',monto:-b.monto,medio:'Cargo bancario',glosa:b.desc+' ('+ct+')',m:b.id}); b.m=id; });
        return 'Comprobante de traspaso '+ct+' por '+fmt(t)+' registrado ('+as.n+').'; }});
      if(r.ab.some(b=>b.medio==='No identificado')) a.push({label:'Registrar abono no identificado en cuenta transitoria', alt:true, stay:true, run:()=>{
        const bs=c.banco.filter(b=>!b.m&&b.medio==='No identificado'); const t=bs.reduce((s,b)=>s+b.monto,0);
        const as=asiento('Abono no identificado '+c.periodo.toLowerCase()+' — a la espera de identificar al contribuyente','Conciliación '+c.periodo,[{cta:'111.02',debe:t,haber:0,aux:''},{cta:'214.09',debe:0,haber:t,aux:''}],null,{fecha:'2026-08-31'});
        bs.forEach(b=>{ const id='L'+(c.libro.length+1); c.libro.push({id,fecha:b.fecha,tipo:'abono',monto:b.monto,medio:'No identificado',glosa:b.desc+' → 214.09 ('+as.n+')',m:b.id}); b.m=id; });
        return 'Abono no identificado por '+fmt(t)+' registrado en 214.09 ('+as.n+').'; }});
      return a; }},
  autorizar:{label:'Revisar y autorizar (Jefatura de Contabilidad / Director DAF)', rol:'daf', sup:['S11'], desc:'La Jefatura de Contabilidad y el Director DAF revisan la consistencia de las diferencias, aprueban los ajustes y firman la conciliación.',
    actions:c=>[{label:'Autorizar y firmar', run:()=>'Conciliación autorizada y firmada por DAF.'}, devolverConc(c,'daf')]},
  revisar:{label:'Revisión independiente (Control interno)', rol:'rev', sup:['S11'], desc:'Control interno actúa como contraparte técnica independiente: revisa y visa el informe antes de su archivo e informe externo.',
    actions:c=>[{label:'Visar', run:()=>'Conciliación visada por Control interno.'}, devolverConc(c,'rev')]},
  archivar:{label:'Archivar', rol:'daf', desc:'Se archiva la conciliación. El saldo validado queda disponible para los informes mensuales a la CGR y al SINIM, y para el cierre mensual.',
    actions:c=>[{label:'Archivar', run:()=>{ c.estado='Archivada'; return 'Conciliación archivada. Saldo validado disponible para los informes CGR / SINIM y el cierre de '+c.periodo+'.'; }}]}
};
function runConc(i){
  const c=S.conc, st=CST[c.stages[c.idx]], a=st.actions(c)[i];
  const msg=a.run(); c.hist.unshift({f:NOW, rol:st.rol, txt:st.label+': '+msg});
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
function estadoPill(e){ const m={'En curso':'acc','Pagado':'ok','Percibido':'ok','Cerrado':'ok','Archivada':'ok','Devuelto':'warn','En espera':'warn','Reabierto':'warn','Rechazado':'crit','Anulado':'crit'}; return `<span class="pill ${m[e]||''}">${esc(e)}</span>`; }
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
  ['Gasto',[['preob','Preobligaciones'],['oc','Devengado desde Adquisiciones'],['sinoc','Servicios sin OC']]],
  ['Ingreso',[['ing','Órdenes de ingreso'],['caja','Caja y rendiciones']]],
  ['Tesorería',[['tes','Pagos y cobros'],['conc','Conciliación bancaria']]],
  ['Contabilidad',[['pres','Ejecución presupuestaria'],['diario','Libro diario'],['inv','Inventario y bajas'],['cierres','Cierres contables']]],
  ['Sistema',[['cfg','Configuración'],['sup','Supuestos del prototipo']]]
];
function renderNav(){
  const open=t=>S.exps.filter(x=>x.tipo===t&&isOpen(x)).length;
  const counts={guia:CASES.length, bandeja:countFor(S.role), preob:open('preob'), oc:open('oc'), sinoc:open('sinoc'), ing:open('ing'), caja:S.rends.filter(r=>r.estado!=='Contabilizada').length, cierres:open('cierre'), inv:open('baja'), sup:Object.keys(SUP).length};
  const active = S.view==='exp' ? LISTVIEW[(S.exps.find(x=>x.id===S.sel)||{}).tipo] : S.view.replace('new-','').replace(/^cierre$/,'cierres');
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
function colB(x){ return x.tipo==='ing'?x.contrib?.nombre : x.tipo==='cierre'?x.periodo : x.tipo==='baja'?x.bien : (x.proveedor?.nombre||'—'); }
function listTable(list){
  if(!list.length) return '<div class="empty">Sin expedientes.</div>';
  const t=list[0].tipo, h=t==='ing'?'Contribuyente':t==='cierre'?'Período':t==='baja'?'Bien':'Proveedor';
  return `<div class="tbl-wrap"><table><tr><th>Expediente</th><th>${h}</th><th>Etapa actual</th><th class="num">${t==='cierre'?'':'Monto'}</th><th>Estado</th></tr>
  ${list.map(x=>`<tr class="click" data-a="open" data-v="${x.id}"><td><span class="mono">${x.id}</span> ${casePill(x)}<div class="small muted">${esc(x.glosa)}</div></td>
  <td class="small">${esc(colB(x))}</td>
  <td>${isOpen(x)?esc(STG[cur(x)].label)+' '+roleChip(STG[cur(x)].rol):'<span class="muted">Finalizado</span>'}</td>
  <td class="num">${x.tipo==='cierre'?(x.docs.cierre?estadoPill(x.docs.cierre.estado):''):fmt(x.monto)}</td><td>${estadoPill(x.estado)}</td></tr>`).join('')}</table></div>`;
}
function vList(tipo){
  const L=S.exps.filter(x=>x.tipo===tipo);
  const meta={
    preob:['Preobligaciones (compromiso cierto)','Según los flujos actualizados, con el decreto de adjudicación tramitado Contabilidad registra la preobligación: la reserva del CDP pasa a compromiso cierto y recién entonces Adquisiciones emite la OC.','Simular adjudicación recibida','new-preob'],
    oc:['Devengado desde Adquisiciones','La compra (SOLPED, CDP, modalidad, OC, recepción conforme y cruce de 3 vías) vive en el módulo Adquisiciones. Desde la resolución de compra, Adquisiciones crea el egreso devengado (CED) en borrador; Contabilidad lo verifica y confirma y, tras el pago de Tesorería, registra el egreso pagado.','Simular creación desde Adquisiciones','new-oc'],
    sinoc:['Servicios sin orden de compra','Servicios básicos, arriendos y otros cobros periódicos que llegan directamente como factura.','Registrar factura recibida','new-sinoc'],
    ing:['Órdenes de ingreso','Derechos, patentes y permisos: la orden genera el ingreso devengado; el pago en caja, el arqueo, el depósito y la contabilización generan el percibido.','Nueva orden de ingreso','new-ing'],
    cierre:['Cierres contables','Cierres mensuales y anuales (Contabilidad › Cierres contables): Borrador → Enviado a revisión → Cerrado, con reapertura justificada. El cierre anual genera los asientos de cierre.','Nuevo cierre','new-cierre']
  }[tipo];
  return `<div class="pagehead"><div><h1>${meta[0]}</h1><p>${meta[1]}</p></div><button class="btn pri" data-a="nav" data-v="${meta[3]}">${meta[2]}</button></div>
  <div class="panel">${listTable(L)}</div>${tipo==='oc'?transitoHTML():''}${tipo==='cierre'?`<div class="alert sup small" style="margin-top:12px">Condiciones para cerrar un mes ${supChips(['S15'])}: conciliaciones bancarias del período archivadas y sin comprobantes en borrador con fecha del período. Un período cerrado no acepta asientos con fecha dentro de él hasta reabrirlo con una razón.</div>`:''}`;
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
  const lbl={'3.10':'3.10 Resolución de adjudicación','4.4':'4.4 Solicitud de devengado (al confirmar la recepción)','5.2':'5.2 Registro del devengado (después del cruce de 3 vías)','5.1':'5.1 Cruce de 3 vías'}[o]||o;
  const que=o==='3.10'?'Revisa los datos del decreto de adjudicación y pulsa "Recibir adjudicación".':'Estás actuando como Adquisiciones: revisa los datos de la resolución de compra y pulsa "Crear egreso devengado".';
  return `<div class="alert sup" style="margin-bottom:12px">Llegaste desde <b>Adquisiciones · ${esc(lbl)}</b> con el expediente <span class="mono">${esc(S.draft.adq.folio)}</span>. Los datos vienen de ese expediente. ${que} Contabilidad acepta uno solo por expediente.</div>`;
}
function adqArrival(x){
  const f=S.fromAdq; if(!f || !x.adq || x.adq.folio!==f.folio) return '';
  const que=x.tipo==='preob'?'la adjudicación':'el egreso devengado';
  const msg=f.existed?`El expediente <span class="mono">${esc(f.folio)}</span> ya había llegado a Contabilidad. No se crea otro: se acepta ${que} una sola vez por expediente de compra.`:(x.tipo==='preob'?`Adjudicación recibida desde Adquisiciones (paso ${esc(f.origen)}). Contabilidad ya puede registrar la preobligación.`:`Egreso devengado creado desde Adquisiciones${f.origen?' (paso '+esc(f.origen)+')':''}.`);
  return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>${msg}</span>${adqLink(f.folio,'Volver a Adquisiciones')}</div></div>`;
}
function provOptions(p){
  if(p.proveedor && !S.proveedores.some(x=>x.nombre===p.proveedor)) S.proveedores.push({rut:'77.'+pad(S.proveedores.length,3)+'.'+pad(Math.abs([...p.proveedor].reduce((h,c)=>h*31+c.charCodeAt(0)|0,7))%1000,3)+'-'+(S.proveedores.length%10), nombre:p.proveedor});
  const sel=(S.proveedores.find(x=>x.nombre===p.proveedor)||S.proveedores.find(x=>x.rut==='76.123.456-7')).rut;
  return S.proveedores.map(x=>`<option value="${x.rut}" ${x.rut===sel?'selected':''}>${x.rut} · ${esc(x.nombre)}</option>`).join('');
}
function vNew(tipo){
  const d=S.draft||(S.draft={});
  if(tipo==='oc' || tipo==='preob'){
    const p=d.adq||(d.adq=adqPrefill(tipo==='preob'?'ADQ-2026-00045':'ADQ-2026-00123'));
    const unidades=S.unidades.includes(p.unidad)||!p.unidad?S.unidades:[p.unidad,...S.unidades];
    const common=`<div class="field"><label for="n_folio">Expediente de Adquisiciones</label><input type="text" id="n_folio" value="${esc(p.folio)}"></div>
    <div class="field"><label for="n_mod">Modalidad</label><select id="n_mod">${['Compra Ágil','Convenio Marco','Licitación Pública','Trato Directo'].map(m=>`<option ${m===p.modalidad?'selected':''}>${m}</option>`).join('')}</select></div>
    <div class="field" style="grid-column:1/-1"><label for="n_glosa">Glosa</label><input type="text" id="n_glosa" value="${esc(p.glosa)}"></div>
    <div class="field"><label for="n_unidad">Unidad</label><select id="n_unidad">${unidades.map(u=>`<option ${u===p.unidad?'selected':''}>${esc(u)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_prov">Proveedor ${tipo==='preob'?'adjudicado':''}</label><select id="n_prov">${provOptions(p)}</select></div>
    <div class="field"><label for="n_pres">Cuenta presupuestaria</label><select id="n_pres">${S.pres.map(x=>`<option value="${x.cod}" ${x.cod===p.pres?'selected':''}>${x.cod} · ${esc(x.nombre)}</option>`).join('')}</select></div>
    <div class="field"><label for="n_monto">Monto ${tipo==='preob'?'adjudicado':'aceptado'} ($)</label><input type="number" id="n_monto" value="${Number(p.monto)||0}"></div>`;
    if(tipo==='preob') return `${adqBanner()}<div class="pagehead"><div><h1>${d.origen?'Adjudicación recibida desde Adquisiciones':'Simular adjudicación recibida'}</h1><p>Representa el decreto de adjudicación tramitado que Adquisiciones envía a Contabilidad para registrar la preobligación (compromiso cierto) antes de emitir la OC. Precargado con ${adqLink(p.folio,p.folio)}${p.step?' (paso actual allá: '+esc(p.step)+')':''}.</p></div>${supChips(['S5'])}</div>
    <div class="panel"><div class="pb stack"><div class="fields">${common}
    <div class="field"><label for="n_dec">Decreto de adjudicación</label><input type="text" id="n_dec" value="D.A. 1184/2026"></div>
    </div><div class="row"><button class="btn pri" data-a="create" data-v="preob">Recibir adjudicación</button><button class="btn" data-a="nav" data-v="preob">Cancelar</button></div></div></div>`;
    return `${adqBanner()}<div class="pagehead"><div><h1>${d.origen?'Crear egreso devengado desde Adquisiciones':'Simular creación desde Adquisiciones'}</h1><p>Representa la resolución de compra de Adquisiciones con la recepción conforme y el cruce de 3 vías completados. Según el video de Egreso Devengado, <b>el usuario de Adquisiciones</b> pulsa "Crear egreso devengado"; el comprobante nace en borrador y Contabilidad lo confirma. Precargado con ${adqLink(p.folio,p.folio)}${p.step?' (paso actual allá: '+esc(p.step)+')':''}.</p></div>${supChips(['S18'])}</div>
    <div class="panel"><div class="pb stack"><div class="fields">${common}
    <div class="field"><label for="n_oc">Orden de compra</label><input type="text" id="n_oc" value="${esc(p.oc)}"></div>
    <div class="field"><label for="n_fact">Folio factura</label><input type="text" id="n_fact" value="${esc(p.factura||'40187')}"></div>
    <label class="check" style="align-self:end"><input type="checkbox" id="n_inv"> <span>Bien inventariable (clasificado por Bodega en 4.3)</span></label>
    <div class="field"><label for="n_invc">Código de inventario asignado por Bodega</label><input type="text" id="n_invc" value="INV-2026-0662"></div>
    </div><div class="row"><span class="role">Adquisiciones (ext.)</span><button class="btn pri" data-a="create" data-v="oc">Crear egreso devengado</button><button class="btn" data-a="nav" data-v="oc">Cancelar</button></div></div></div>`;
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
  if(tipo==='cierre') return `<div class="pagehead"><div><h1>Nuevo cierre contable</h1><p>Contabilidad › Cierres contables › Nuevo. Elige el tipo de cierre y el período: el sistema asigna el rango de fechas.</p></div>${supChips(['S15'])}</div>
    <div class="panel"><div class="pb stack"><div class="fields">
    <div class="field"><label for="n_tipo">Tipo de cierre</label><select id="n_tipo"><option>Mensual</option><option>Anual</option></select></div>
    <div class="field"><label for="n_mes">Mes (solo mensual)</label><select id="n_mes">${MESES.map((m,i)=>`<option value="${i+1}" ${i===8?'selected':''}>${m}</option>`).join('')}</select></div>
    <div class="field"><label for="n_anio">Año</label><input type="number" id="n_anio" value="2026"></div>
    </div><div class="small muted">Mensual: del 1 al último día del mes. Anual: todo el ejercicio (01-01 al 31-12).</div>
    <div class="row"><button class="btn pri" data-a="create" data-v="cierre">Crear cierre en borrador</button><button class="btn" data-a="nav" data-v="cierres">Cancelar</button></div></div></div>`;
  // ingreso
  if(!d.items) Object.assign(d,{items:[{c:S.conceptos[0].n,monto:68000}], contrib:S.contribuyentes[0].rut});
  const itemMonto=(it,k)=>{ const k2=S.conceptos.find(c=>c.n===it.c); return k2&&k2.utm?`<div class="field"><label for="it_m_${k}">Monto ($)</label><input type="number" id="it_m_${k}" value="${Math.round(k2.utm*S.utm)}" readonly><span class="small muted">${String(k2.utm).replace('.',',')} UTM × ${fmt(S.utm)}</span></div>`:`<div class="field"><label for="it_m_${k}">Monto ($)</label><input type="number" id="it_m_${k}" value="${it.monto}"></div>`; };
  return `<div class="pagehead"><div><h1>Nueva orden de ingreso</h1><p>La unidad emisora crea la orden y la deja en borrador. Al confirmarla, el motor de reglas genera el comprobante de ingreso devengado (o la deja para revisión manual).</p></div></div>
    <div class="panel"><div class="pb stack"><div class="fields">
    <div class="field"><label for="n_depto">Departamento emisor</label><select id="n_depto">${S.deptos.map(u=>`<option>${u}</option>`).join('')}</select></div>
    <div class="field"><label for="n_emi">Fecha de emisión</label><input type="date" id="n_emi" value="${TODAY}"></div>
    <div class="field"><label for="n_venc">Fecha de vencimiento</label><input type="date" id="n_venc" value="2026-10-31"></div>
    <div class="field"><label for="n_per">Período tributario o de cobertura</label><input type="text" id="n_per" value="2° semestre 2026"></div>
    <div class="field"><label for="n_contrib">Contribuyente (RUT, nombre o correo)</label><input type="search" id="n_contrib" list="dl_contrib" value="${esc(S.contribuyentes.find(c=>c.rut===d.contrib)?.nombre||'')}"><datalist id="dl_contrib">${S.contribuyentes.map(c=>`<option value="${esc(c.nombre)}">${c.rut} · ${esc(c.email)}</option>`).join('')}</datalist></div>
    <div class="field" style="grid-column:1/-1"><label for="n_glosa">Glosa</label><input type="text" id="n_glosa" value="Patente comercial 2° semestre"></div>
    </div>
    <details class="how"><summary><b>¿No aparece el contribuyente? Crear su ficha</b></summary><div class="fields" style="margin-top:8px">
      <div class="field"><label for="c_rut">RUT</label><input type="text" id="c_rut" value=""></div>
      <div class="field"><label for="c_nom">Nombre o razón social</label><input type="text" id="c_nom" value=""></div>
      <div class="field"><label for="c_dir">Dirección</label><input type="text" id="c_dir" value=""></div>
      <div class="field"><label for="c_mail">Correo</label><input type="text" id="c_mail" value=""></div>
    </div><div class="row" style="margin-top:8px"><button class="btn sm" data-a="newcontrib">Crear ficha y usarla</button></div></details>
    <h3>Ítems de ingreso</h3>
    ${d.items.map((it,k)=>`<div class="items-row"><div class="field"><label for="it_c_${k}">Concepto</label><select id="it_c_${k}" data-item="${k}">${S.conceptos.map(c=>`<option ${c.n===it.c?'selected':''}>${esc(c.n)}</option>`).join('')}</select></div>
      ${itemMonto(it,k)}
      <button class="btn sm" data-a="delitem" data-v="${k}" ${d.items.length<2?'disabled':''}>Quitar</button></div>`).join('')}
    <div class="row"><button class="btn sm" data-a="additem">Agregar ítem</button></div>
    <div class="row"><button class="btn pri" data-a="create" data-v="ing">Guardar orden (borrador)</button><button class="btn" data-a="nav" data-v="ing">Cancelar</button></div></div></div>`;
}
function syncItems(){ const d=S.draft; if(!d||!d.items) return; d.items.forEach((it,k)=>{ const c=$('it_c_'+k), m=$('it_m_'+k); if(c) it.c=c.value; const k2=S.conceptos.find(x=>x.n===it.c); if(k2&&k2.utm) it.monto=Math.round(k2.utm*S.utm); else if(m) it.monto=Number(m.value)||0; }); }
function createFromForm(tipo){
  const v=id=>$(id)?.value;
  let x;
  if(tipo==='oc' || tipo==='preob'){ const m=Number(v('n_monto')); if(!(m>0)) throw new Error('Ingresa un monto mayor que cero.');
    const folio=(v('n_folio')||'').trim(); if(!folio) throw new Error('Indica el expediente de Adquisiciones.');
    const dup=S.exps.find(e=>e.tipo===tipo&&e.adq&&e.adq.folio===folio); if(dup) throw new Error('El expediente '+folio+' ya llegó a Contabilidad ('+dup.id+'). Se acepta uno solo por expediente.');
    S.fromAdq=S.draft?.origen?{folio, origen:S.draft.origen}:null;
    const base={caso:(CASES.find(c=>c.folio===folio&&(c.tipoExp||'oc')===tipo)||{}).id, glosa:v('n_glosa'), unidad:v('n_unidad'), pres:v('n_pres'), monto:m, proveedor:S.proveedores.find(p=>p.rut===v('n_prov'))};
    if(tipo==='preob'){ x=newExp('preob',{...base, adq:{folio, modalidad:v('n_mod'), decreto:v('n_dec')}, docs:{adj:{decreto:v('n_dec'), monto:m}}}); }
    else {
      const inv=$('n_inv').checked;
      const adq={folio, modalidad:v('n_mod'), oc:v('n_oc'), factura:v('n_fact'), inventariable:inv, inv:inv?(v('n_invc')||'').trim():''};
      x=newExp('oc',{...base, adq, docs:{oc:{n:adq.oc,monto:m},dte:{folio:adq.factura,monto:m},crc:{n:'Recepción conforme '+folio}}});
      // Adquisiciones pulsa "Crear egreso devengado": si la cuenta no está configurada, el expediente queda detenido con la alerta (S18)
      try{ const msg=runAction(x,0,{}); S.createdMsg=msg; }
      catch(err){ S.err={id:x.id, msg:err.message, config:err.config||null}; hist(x,'Error: '+err.message,'ext'); }
    }
  }
  else if(tipo==='sinoc'){ const m=Number(v('n_monto')); if(!(m>0)) throw new Error('Ingresa un monto mayor que cero.');
    x=newExp('sinoc',{glosa:v('n_glosa'),unidad:v('n_unidad'),pres:v('n_pres'),monto:m,proveedor:S.proveedores.find(p=>p.rut===v('n_prov')),docs:{dte:{folio:v('n_folio'),monto:m,fecha:TODAY}}}); }
  else if(tipo==='cierre'){ x=nuevoCierre(v('n_tipo'), v('n_mes'), v('n_anio')); }
  else { syncItems(); const q=(v('n_contrib')||'').toLowerCase().trim();
    const c=S.contribuyentes.find(c=>c.nombre.toLowerCase()===q||c.rut===q||c.email===q)||(q&&S.contribuyentes.find(c=>(c.nombre+' '+c.rut+' '+c.email).toLowerCase().includes(q)));
    if(!q||!c) throw new Error('Selecciona un contribuyente de la lista o crea su ficha.');
    const items=S.draft.items.map(it=>({c:it.c, pres:S.conceptos.find(k=>k.n===it.c).pres, monto:it.monto}));
    const m=items.reduce((s,i)=>s+i.monto,0); if(!(m>0)) throw new Error('El monto total debe ser mayor que cero.');
    x=newExp('ing',{glosa:v('n_glosa'),depto:v('n_depto'),emision:v('n_emi')||TODAY,venc:v('n_venc'),periodo:v('n_per'),contrib:c,items,monto:m}); x.docs.orden={estado:'Borrador'}; }
  S.draft=null; return x;
}
function crearContribuyente(){
  const v=id=>($(id)?.value||'').trim();
  const rut=v('c_rut'), nombre=v('c_nom');
  if(!/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/.test(rut)) throw new Error('Ingresa un RUT válido (ej. 12.345.678-9).');
  if(!nombre) throw new Error('Ingresa el nombre o razón social.');
  if(S.contribuyentes.some(c=>c.rut===rut)) throw new Error('Ya existe un contribuyente con ese RUT.');
  syncItems();
  S.contribuyentes.push({rut, nombre, email:v('c_mail'), dir:v('c_dir'), nuevo:true});
  S.draft.contrib=rut;
  return 'Ficha de '+nombre+' creada.';
}

function docsHTML(x){
  const D=[]; const d=x.docs;
  const card=(t,n,extra,st)=>`<div class="doc"><div class="dt"><span>${t}</span>${st?`<span>${esc(st)}</span>`:''}</div><div class="dn">${esc(n)}</div>${extra?`<div class="small muted">${extra}</div>`:''}</div>`;
  if(x.tipo==='ing'){
    D.push(card('Orden de ingreso',x.id,`${esc(x.depto)} · emitida ${fdate(x.emision||x.creado)} · vence ${fdate(x.venc)}${x.periodo?' · '+esc(x.periodo):''}<br>${esc(x.contrib.rut)} · ${esc(x.contrib.nombre)}${x.contrib.nuevo?' <i>(ficha creada)</i>':''}<br>${x.items.map(i=>esc(i.c)+': '+fmt(i.monto)).join('<br>')}`,d.orden?.estado));
    if(d.cid) D.push(card('Comprobante de ingreso devengado',d.cid.n,'Generación '+d.cid.modo.toLowerCase()+' · asiento '+d.cid.asiento,d.cid.estado));
    if(d.recibo) D.push(card('Comprobante de pago (caja)',d.recibo.n,esc(d.recibo.medio)+' · '+fdate(d.recibo.fecha)+' · rendición '+esc(d.recibo.rend)+' '+L('Ver caja','nav','caja')));
    if(d.cip) D.push(card('Comprobante de ingreso percibido',d.cip.n,esc(d.cip.medio)+' · asiento '+d.cip.asiento));
  } else if(x.tipo==='cierre'){
    const c=d.cierre;
    D.push(card('Cierre '+x.tipoCierre.toLowerCase(),x.periodo,fdate(x.desde)+' al '+fdate(x.hasta)+(c.cerrado?'<br>Cerrado el '+fdate(c.cerrado.fecha)+' '+esc(c.cerrado.hora)+' por Contabilidad':''),c.estado));
    if(c.adjuntos.length) D.push(card('Respaldos adjuntos',c.adjuntos.length+' archivo(s)',c.adjuntos.map(a=>esc(a.n)).join('<br>')));
    (c.reaperturas||[]).forEach(r=>D.push(card('Reapertura',fdate(r.fecha)+' '+r.hora,'Razón: '+esc(r.razon))));
    if(c.asientos) D.push(card('Asientos de cierre',c.asientos.join(' · '),'Resultado del ejercicio '+fmt(c.resultado)));
    if(c.cgr) D.push(card('Informe CGR',c.cgr.n,'Enviado el '+fdate(c.cgr.fecha)+' por SICOGEN II'));
    if(c.eeff) D.push(card('Estados financieros',x.periodo,'Enviados a la CGR y SUBDERE el '+fdate(c.eeff.fecha)));
  } else if(x.tipo==='baja'){
    const b=S.inventario.find(b=>b.code===x.bien);
    if(b) D.push(card('Bien de inventario',b.code,esc(b.desc)+'<br>Valor '+fmt(b.valor)+' · depreciación '+fmt(b.dep)+' · valor libro '+fmt(b.valor-b.dep),b.estado));
    if(d.baja) D.push(card('Baja',d.baja.decreto||'Decreto pendiente','Motivo: '+esc(d.baja.motivo)+(d.baja.asiento?' · asiento '+d.baja.asiento:''),d.baja.firmado?'Decreto firmado':''));
  } else {
    if(x.adq) D.push(`<div class="doc"><div class="dt"><span>Expediente de Adquisiciones</span><span>${esc(x.adq.modalidad)}</span></div><div class="dn">${esc(x.adq.folio)}</div><div class="small muted">${x.tipo==='preob'?'Decreto de adjudicación '+esc(x.adq.decreto||''):'OC '+esc(x.adq.oc)+' · factura '+esc(x.adq.factura)+' · recepción conforme y cruce de 3 vías completados'+(x.adq.inventariable?' · bien inventariable '+esc(x.adq.inv):'')}${adqInfo(x.adq.folio)?'':' · <i>folio simulado</i>'}</div><div class="small" style="margin-top:4px">${adqLink(x.adq.folio)}</div></div>`);
    if(d.comp) D.push(card('Preobligación (compromiso cierto)',d.comp.n,fmt(d.comp.monto)+' · '+esc(x.pres)+' · '+fdate(d.comp.fecha)));
    if(d.imput) D.push(card('Imputación y compromiso',d.imput.cta,fmt(x.monto)));
    if(d.oc && (!x.adq || x.tipo==='preob') && d.oc.estado) D.push(card('Orden de compra',d.oc.n,fmt(d.oc.monto),d.oc.estado));
    if(d.acta) D.push(card('V°B° del servicio',fdate(d.acta.fecha),'Firmado por '+esc(x.unidad)));
    if(d.dte && !x.adq) D.push(card('Factura (DTE)','Folio '+d.dte.folio,fmt(d.dte.monto)+(x.proveedor?' · '+esc(x.proveedor.nombre):''),d.dte.estado));
    if(d.nicsp) D.push(card('Activo fijo',d.nicsp.inv,'Clasificado por DAF / Bodega (4.3) · registrado al confirmar el CED'));
    if(d.ced) D.push(card('Egreso devengado',d.ced.n,'Creado por '+esc(d.ced.por||'Contabilidad')+' · asiento '+d.ced.asiento+(d.ced.ref?' · respondido a Adquisiciones':''),d.ced.estado));
    if(d.cesion) D.push(card('Cesión (factoring) · caso '+d.cesion.caso,d.cesion.cesionario,(d.cesion.decreto?'Decreto de cesión '+d.cesion.decreto+(d.cesion.decEstado?' ('+esc(d.cesion.decEstado)+')':''):'Decreto de cesión pendiente')+(d.cesion.receptor?' · receptor del pago cambiado':'')+(d.cesion.suspendido?' · pago original suspendido':'')+(d.dpAnulado?' · anula '+d.dpAnulado:'')+(d.cesion.comprobanteEnviado?' · comprobante enviado al cesionario':'')));
    if(d.dp) D.push(card('Decreto de pago',d.dp.n,'Beneficiario: '+esc(d.dp.benef),d.dp.estado));
    if(d.pago) D.push(card('Pago',d.pago.n,esc(d.pago.medio)+' · '+esc(d.pago.benef)+' · asiento '+d.pago.asiento));
  }
  return D.join('')||'<div class="muted small">Aún no hay documentos.</div>';
}
const CEDE_STAGES=['dp','dp_firma','pago','adq_pago'];
function vExp(){
  const x=S.exps.find(e=>e.id===S.sel); if(!x) return '<div class="empty">Expediente no encontrado.</div>';
  const open=isOpen(x), st=open?STG[cur(x)]:null;
  let card='';
  if(open){
    const mine=st.rol===S.role;
    const fs=st.fields?st.fields(x):[];
    const acts=st.actions(x);
    const err=S.err&&S.err.id===x.id?S.err:null;
    const canCede = ['oc','sinoc'].includes(x.tipo) && CEDE_STAGES.includes(cur(x)) && !x.docs.cesion;
    card=`<div class="stagecard"><div class="sh"><div><div class="small muted">Etapa ${x.idx+1} de ${x.stages.length}</div><h2>${esc(st.label)}</h2></div><div class="row">${roleChip(st.rol)} ${supChips(st.sup)}</div></div>
    <div class="sb"><p>${esc(st.desc)}</p>${st.info?st.info(x):''}
    ${err?`<div class="alert crit"><b>No se pudo completar.</b> ${esc(err.msg)} ${err.config?`<div style="margin-top:8px"><button class="btn sm" data-a="gocfg" data-v="${esc(err.config)}">Ir a configuración de cuentas (Administrador contable)</button></div>`:''}</div>`:''}
    ${mine?`${fs.length?`<div class="fields">${fs.map(fieldHTML).join('')}</div>`:''}
      <div class="row">${acts.map((a,i)=>`<button class="btn ${a.sec?'':a.alt?'alt':'pri'}" data-a="act" data-v="${i}" ${a.disabled?'disabled':''}>${esc(a.label)}</button>`).join('')}</div>`
    :`<div class="alert warn">Esta etapa corresponde a <b>${esc(R[st.rol])}</b>. <button class="btn sm" data-a="role" data-v="${st.rol}">Actuar como ${esc(RSHORT[st.rol])}</button></div>`}
    ${canCede?`<div class="doc"><div class="dt"><span>Detección de cesión en el Registro del SII (analista contable DAF)</span>${supChips(['S10'])}</div><div class="small muted" style="margin:4px 0">${x.tipo==='oc'||x.docs.dp?'La factura ya tiene decreto de pago generado o en trámite: sería el <b>caso B</b> (suspender y rehacer el decreto).':'La factura aún no tiene decreto de pago: sería el <b>caso A</b> (cambiar el receptor del pago, sin suspensión).'}</div><div class="row"><select id="f_ces" aria-label="Cesionario">${S.cesionarios.map(c=>`<option>${esc(c)}</option>`).join('')}</select><button class="btn sm" data-a="cede">Registrar cesión</button></div></div>`:''}
    <div class="lane-src">Fuente: ${esc(st.src)}</div></div></div>`;
  } else {
    card=`<div class="alert ${['Rechazado','Anulado'].includes(x.estado)?'crit':'ok'}">Expediente finalizado: <b>${esc(x.estado)}</b>.</div>`;
    if(x.tipo==='cierre' && x.docs.cierre.estado==='Cerrado') card+=`<div class="stagecard" style="margin-top:12px"><div class="sh"><div><h2>Reabrir cierre (excepcional)</h2></div><div class="row">${roleChip('con')} ${supChips(['S15'])}</div></div><div class="sb"><p>Si hay que corregir registros del período, Contabilidad puede reabrir el cierre indicando obligatoriamente la razón, que queda para auditoría.</p>
      ${S.role==='con'?`<div class="fields"><div class="field" style="grid-column:1/-1"><label for="f_razon">Razón de reapertura</label><input type="text" id="f_razon" value=""></div></div><div class="row"><button class="btn alt" data-a="reabrir">Reabrir cierre</button></div>`:`<div class="alert warn">Corresponde a <b>${esc(R.con)}</b>. <button class="btn sm" data-a="role" data-v="con">Actuar como Contabilidad</button></div>`}
      ${S.err&&S.err.id===x.id?`<div class="alert crit">${esc(S.err.msg)}</div>`:''}</div></div>`;
  }
  const steps=`<ol class="steps">${x.stages.map((s,i)=>{ const cls=i<x.idx?'done':(i===x.idx&&open?'cur':'pend'); const auto=s==='i_cid'&&x.docs.cid&&x.docs.cid.modo==='Automático'; return `<li class="${cls}${S.hl===s?' hl':''}"><span class="dot">${i<x.idx?'✓':i+1}</span><span class="sl">${esc(STG[s].label)}${auto?' <span class="muted small">(automático)</span>':''}</span>${roleChip(STG[s].rol)}</li>`; }).join('')}</ol>`;
  const as=S.asientos.filter(a=>a.ref===x.id || (x.docs.cip && a.n===x.docs.cip.asiento));
  const head = x.tipo==='ing'?`<span>${esc(x.contrib.nombre)}</span>` : x.tipo==='cierre'?`<span>${esc(x.periodo)}</span><span>${fdate(x.desde)} al ${fdate(x.hasta)}</span>${estadoPill(x.docs.cierre.estado)}` : x.tipo==='baja'?`<span class="mono">${esc(x.bien)}</span>` : `<span>${esc(x.unidad)}</span><span class="mono">${esc(x.pres)}</span><span>${esc(presOf(x.pres)?.nombre)}</span>${x.proveedor?`<span>${esc(x.proveedor.nombre)}</span>`:''}`;
  const antes = x.tipo==='oc'?`<div class="doc" style="margin-bottom:10px"><div class="dt"><span>Antes, en Adquisiciones</span><span>✓ completado</span></div><div class="small" style="margin-top:4px">SOLPED → CDP (reserva) → modalidad → adjudicación → preobligación (Contabilidad) → OC → recepción conforme y clasificación NICSP (Bodega) → cruce de 3 vías · ${adqLink(x.adq.folio)}</div></div>`
    : x.tipo==='preob'?`<div class="doc" style="margin-bottom:10px"><div class="dt"><span>Antes, en Adquisiciones</span><span>✓ completado</span></div><div class="small" style="margin-top:4px">SOLPED → CDP (reserva preventiva) → proceso de compra → decreto de adjudicación · ${adqLink(x.adq.folio)}</div></div>`:'';
  return `<div class="pagehead"><div><button class="btn sm" data-a="nav" data-v="${LISTVIEW[x.tipo]||x.tipo}">← ${FLOWNAME[x.tipo]}</button>
    <h1 style="margin-top:10px">${esc(x.glosa)} ${casePill(x)}</h1>
    <div class="xhead"><span class="mono">${x.id}</span>${estadoPill(x.estado)}${x.tipo==='cierre'?'':`<span class="mono">${fmt(x.monto)}</span>`}${head}</div></div></div>
  ${adqArrival(x)}${mapBanner(x)}<div class="xgrid"><div class="stack">${card}
    <div class="panel"><div class="ph"><h2>Recorrido del flujo</h2><span class="small muted">${FLOWNAME[x.tipo]}${x.docs.cesion?' · con factoring (caso '+x.docs.cesion.caso+')':''}</span></div><div class="pb">${antes}${steps}</div></div>
    ${as.length?`<div class="panel"><div class="ph"><h2>Asientos contables</h2>${supChips([x.tipo==='cierre'?'S16':x.tipo==='baja'?'S17':'S3'])}</div><div class="pb stack">${as.map(asientoHTML).join('')}</div></div>`:''}
  </div>
  <div class="stack"><div class="panel"><div class="ph"><h2>Documentos</h2></div><div class="pb stack">${docsHTML(x)}</div></div>
  <div class="panel"><div class="ph"><h2>Historial</h2></div><div class="pb"><ul class="hist">${x.hist.map(h=>`<li><span class="mono small muted">${fdate(h.f)}</span> ${h.rol?roleChip(h.rol):''}<div>${esc(h.txt)}</div></li>`).join('')}</ul></div></div></div></div>`;
}
const PAY_STAGES=['dp','dp_firma','pago','adq_pago','pag_reg','f_reg','f_susp','f_dec','f_vis','f_firma','f_rehacer','f_firma_dp','f_pago'];
function vTes(){
  const porPagar=S.exps.filter(x=>isOpen(x)&&PAY_STAGES.includes(cur(x)));
  const porCobrar=S.exps.filter(x=>x.tipo==='ing'&&isOpen(x));
  const mv=S.movs;
  const saldo=mv.reduce((s,m)=>s+(m.tipo==='abono'?m.monto:-m.monto),0);
  return `<div class="pagehead"><div><h1>Pagos y cobros</h1><p>Decretos por firmar y pagar (incluidas las facturas cedidas), órdenes de ingreso por cobrar y movimientos del libro banco de septiembre.</p></div>${supChips(['S1','S2','S10'])}</div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Obligaciones en etapa de pago</h2><span class="cnt">${porPagar.length}</span></div>${porPagar.length?listTable(porPagar):'<div class="empty">No hay obligaciones en etapa de pago.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Ingresos por percibir</h2><span class="cnt">${porCobrar.length}</span></div>${porCobrar.length?listTable(porCobrar):'<div class="empty">No hay órdenes por cobrar.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Libro banco — ${esc(ctaName('111.02'))}</h2><span class="small muted">Movimientos del mes: <b class="mono">${fmt(saldo)}</b></span></div>
  ${mv.length?`<div class="tbl-wrap"><table><tr><th>Fecha</th><th>Glosa</th><th>Medio</th><th class="num">Abono</th><th class="num">Cargo</th></tr>${mv.map(m=>`<tr ${S.exps.some(e=>e.id===m.ref)?`class="click" data-a="open" data-v="${m.ref}"`:''}><td class="mono small">${fdate(m.fecha)}</td><td>${esc(m.glosa)}</td><td class="small">${esc(m.medio)}</td><td class="num">${m.tipo==='abono'?fmt(m.monto):''}</td><td class="num">${m.tipo==='cargo'?fmt(m.monto):''}</td></tr>`).join('')}</table></div>`:'<div class="empty">Sin movimientos.</div>'}</div>
  </div>`;
}
function vCaja(){
  const R_=S.rends;
  const next=r=>{ const x=S.exps.find(o=>o.docs.recibo&&o.docs.recibo.rend===r.id&&isOpen(o)); return x?`${esc(STG[cur(x)].label)} ${roleChip(STG[cur(x)].rol)} <button class="btn sm" data-a="open" data-v="${x.id}">Abrir</button>`:'<span class="muted small">Sin pendientes</span>'; };
  const porPagar=S.exps.filter(x=>x.tipo==='ing'&&isOpen(x)&&cur(x)==='i_caja');
  return `<div class="pagehead"><div><h1>Caja y rendiciones</h1><p>Pagos recibidos en caja, cierre y arqueo diario, depósito al día hábil siguiente y contabilización del ingreso percibido. Cada rendición agrupa los pagos de un día.</p></div>${supChips(['S1','S14'])}</div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Órdenes listas para pagar en caja</h2><span class="cnt">${porPagar.length}</span></div>${porPagar.length?listTable(porPagar):'<div class="empty">No hay órdenes confirmadas esperando pago.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Rendiciones de caja</h2></div>${R_.length?`<div class="tbl-wrap"><table><tr><th>Rendición</th><th>Fecha</th><th>Pagos</th><th class="num">Efectivo</th><th class="num">Cheques</th><th class="num">Tarjeta / transf.</th><th>Estado</th><th>Siguiente paso</th></tr>
  ${R_.map(r=>`<tr><td class="mono">${esc(r.id)}<div class="small muted">${esc(r.caja)}</div></td><td class="mono small">${fdate(r.fecha)}</td><td class="num">${r.pagos.length}</td><td class="num">${fmt(rendTot(r,'Efectivo'))}</td><td class="num">${fmt(rendTot(r,'Cheque'))}</td><td class="num">${fmt(rendTot(r,'Tarjeta')+rendTot(r,'Transferencia'))}</td><td>${estadoPill(r.estado==='Contabilizada'?'Cerrado':r.estado)}</td><td>${next(r)}</td></tr>`).join('')}</table></div>`:'<div class="empty">Sin rendiciones.</div>'}</div>
  ${R_.map(r=>`<div class="panel"><div class="ph"><h2>Detalle ${esc(r.id)}</h2>${r.cip?`<span class="small muted">${esc(r.cip)} · asiento ${esc(r.asiento)}</span>`:''}</div><div class="pb">${rendHTML(r)}</div></div>`).join('')}
  </div>`;
}
function vConc(){
  const c=S.conc, done=c.estado==='Archivada', st=done?null:CST[c.stages[c.idx]];
  const mine=st&&st.rol===S.role;
  const r=concReport(c);
  const mark=o=>o.m?'<span class="pill ok">Cruzado</span>':'<span class="pill warn">Pendiente</span>';
  const card=done?`<div class="alert ok">Conciliación de ${esc(c.periodo)} archivada. El saldo validado queda disponible para los informes a la CGR y al SINIM y para el cierre mensual.</div>`:
   `<div class="stagecard"><div class="sh"><div><div class="small muted">Paso ${c.idx+1} de ${c.stages.length}</div><h2>${esc(st.label)}</h2></div><div class="row">${roleChip(st.rol)} ${supChips(st.sup)}</div></div>
   <div class="sb"><p>${esc(st.desc)}</p>${c.obsRev&&c.stages[c.idx]==='conciliar'?`<div class="alert warn">${c.obsDe==='daf'?'La Jefatura de Contabilidad / DAF':'Control interno'} devolvió la conciliación con observaciones.</div>`:''}
   ${mine?`<div class="row">${st.actions(c).map((a,i)=>`<button class="btn ${a.alt?'alt':'pri'}" data-a="cact" data-v="${i}">${esc(a.label)}</button>`).join('')}</div>`:`<div class="alert warn">Este paso corresponde a <b>${esc(R[st.rol])}</b>. <button class="btn sm" data-a="role" data-v="${st.rol}">Actuar como ${esc(RSHORT[st.rol])}</button></div>`}
   <div class="lane-src">Fuente: Conciliación Bancaria (1. Contabilidad_Diagramas_SGM) · Word "Factoring y Conciliación Bancaria"</div></div></div>`;
  const sum=a=>a.reduce((s,x)=>s+Math.abs(x.monto),0);
  const rep=c.informe?`<div class="panel"><div class="ph"><h2>Cuadro de conciliación al 31-08-2026</h2>${r.bancoAj===r.libroAj?'<span class="pill ok">Cuadra</span>':'<span class="pill crit">No cuadra</span>'}</div><div class="pb stack"><div class="two">
    <div class="tbl-wrap"><table><tr><td>Saldo según cartola</td><td class="num">${fmt(r.sb)}</td></tr><tr><td>(+) Depósitos en tránsito <span class="small muted">${r.dep.length}</span></td><td class="num">${fmt(sum(r.dep))}</td></tr><tr><td>(−) Cheques girados no cobrados <span class="small muted">${r.chq.length}</span></td><td class="num">${fmt(sum(r.chq))}</td></tr><tfoot><tr><td>Saldo banco ajustado</td><td class="num">${fmt(r.bancoAj)}</td></tr></tfoot></table></div>
    <div class="tbl-wrap"><table><tr><td>Saldo según libro banco</td><td class="num">${fmt(r.sl)}</td></tr><tr><td>(−) Cargos bancarios no contabilizados <span class="small muted">${r.cb.length}</span></td><td class="num">${fmt(sum(r.cb))}</td></tr><tr><td>(+) Abonos no identificados <span class="small muted">${r.ab.length}</span></td><td class="num">${fmt(sum(r.ab))}</td></tr><tfoot><tr><td>Saldo libro ajustado</td><td class="num">${fmt(r.libroAj)}</td></tr></tfoot></table></div></div>
    <div class="small muted">Fórmula del Word: saldo según cartola + depósitos en tránsito − cheques pendientes ± ajustes = saldo según libro banco.${r.cb.length||r.ab.length?' Aún hay ajustes sin registrar: regístralos en "Identificar partidas y conciliar".':''}</div></div></div>`:'';
  const otras=S.concCuentas.filter(k=>k.mes===c.mes);
  return `<div class="pagehead"><div><h1>Conciliación bancaria · ${esc(c.periodo)}</h1><p>${esc(ctaName(c.cta))}. Saldo inicial ${fmt(c.ini)}.</p></div>${supChips(['S11'])}</div>
  <div class="stack">${S.fromMap==='conc'?`<div class="alert sup">Desde el mapa${S.hl?': <b>'+esc(CST[S.hl].label)+'</b> ('+esc(CNODE[S.hl])+')':''}. <button class="btn sm" data-a="backmap">← Volver al mapa</button></div>`:''}${card}
  <div class="panel"><div class="ph"><h2>Cuentas corrientes del período</h2><span class="small muted">Se concilia cada cuenta; aquí se recorre la General</span></div><div class="tbl-wrap"><table><tr><th>Cuenta</th><th>Estado</th></tr>${otras.map(k=>`<tr><td>${esc(k.nombre)} ${k.general?'':'<span class="small muted">(dato de ejemplo)</span>'}</td><td>${estadoPill(k.general?c.estado:k.estado)}</td></tr>`).join('')}</table></div></div>
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
  return `<div class="pagehead"><div><h1>Ejecución presupuestaria 2026</h1><p>Se actualiza con cada reserva de CDP, preobligación (compromiso cierto), devengado, pago y percibido registrado en los flujos.</p></div>${supChips(['S5','S9'])}</div>
  <div class="stack"><div class="panel"><div class="ph"><h2>Gastos</h2><span class="small muted"><span style="color:var(--ok)">■</span> pagado <span style="color:var(--accent)">■</span> devengado <span style="color:var(--warn)">■</span> comprometido <span style="color:var(--sup)">■</span> reservado por CDP</span></div>
  <div class="tbl-wrap"><table><tr><th>Cuenta</th><th class="num">Vigente</th><th class="num">Reserva CDP</th><th class="num">Comprometido</th><th class="num">Devengado</th><th class="num">Pagado</th><th class="num">Disponible</th><th></th></tr>
  ${S.pres.map(p=>`<tr><td><span class="mono">${p.cod}</span><div class="small muted">${esc(p.nombre)}</div></td><td class="num">${fmt(p.vig)}</td><td class="num">${fmt(p.preob)}</td><td class="num">${fmt(p.comp)}</td><td class="num">${fmt(p.dev)}</td><td class="num">${fmt(p.pag)}</td><td class="num" style="${saldo(p)<2000000?'color:var(--crit)':''}">${fmt(saldo(p))}</td><td>${bar(p)}</td></tr>`).join('')}
  <tfoot><tr><td>Total</td><td class="num">${fmt(T.vig)}</td><td class="num">${fmt(T.preob)}</td><td class="num">${fmt(T.comp)}</td><td class="num">${fmt(T.dev)}</td><td class="num">${fmt(T.pag)}</td><td class="num">${fmt(T.vig-T.preob-T.comp)}</td><td></td></tr></tfoot></table></div></div>
  <div class="panel"><div class="ph"><h2>Ingresos</h2></div><div class="tbl-wrap"><table><tr><th>Cuenta</th><th class="num">Estimado</th><th class="num">Devengado</th><th class="num">Percibido</th><th class="num">Por percibir</th></tr>
  ${S.presIng.map(p=>`<tr><td><span class="mono">${p.cod}</span><div class="small muted">${esc(p.nombre)}</div></td><td class="num">${fmt(p.vig)}</td><td class="num">${fmt(p.dev)}</td><td class="num">${fmt(p.perc)}</td><td class="num">${fmt(p.dev-p.perc)}</td></tr>`).join('')}
  <tfoot><tr><td>Total</td><td class="num">${fmt(TI.vig)}</td><td class="num">${fmt(TI.dev)}</td><td class="num">${fmt(TI.perc)}</td><td class="num">${fmt(TI.dev-TI.perc)}</td></tr></tfoot></table></div></div>
  <div class="alert sup small">La reserva del CDP la registra Adquisiciones (1.5); según el Word, la preobligación (compromiso cierto) la registra Contabilidad después de la adjudicación y antes de la OC (propuesta S5). En servicios sin OC, Presupuesto compromete al imputar. El devengado y el pagado se mueven con este prototipo (efecto presupuestario del "devengo dual", pendiente C-1 del plan de Contabilidad). Los montos anteriores a septiembre son saldos de ejemplo.</div></div>`;
}
function vDiario(){
  const tabs=['Todos','Contabilizado','Borrador'];
  const F=S.diarioFiltro;
  const L_=S.asientos.filter(a=>(S.diarioTab==='Todos'||a.estado===S.diarioTab) && (!F || (a.fecha>=F.desde && a.fecha<=F.hasta && a.tipo!=='Cierre')));
  const td=L_.filter(a=>a.estado==='Contabilizado').reduce((s,a)=>s+a.lineas.reduce((t,l)=>t+l.debe,0),0);
  return `<div class="pagehead"><div><h1>Libro diario</h1><p>Asientos generados automáticamente por los flujos. Total debe contabilizado en la vista: <b class="mono">${fmt(td)}</b>.</p></div>${supChips(['S3'])}</div>
  ${F?`<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>Asientos del período <b>${esc(F.label)}</b> (${fdate(F.desde)} al ${fdate(F.hasta)}), abiertos desde "Ver asientos" del cierre.</span><span class="row"><button class="btn sm" data-a="open" data-v="${esc(F.ref)}">Volver al cierre</button><button class="btn sm" data-a="dfiltro">Quitar filtro</button></span></div></div>`:''}
  <div class="tabs">${tabs.map(t=>`<button data-a="dtab" data-v="${t}" class="${S.diarioTab===t?'on':''}">${t}</button>`).join('')}</div>
  <div class="stack">${L_.length?L_.map(a=>`<div>${asientoHTML(a)}${S.exps.some(e=>e.id===a.ref)?`<div class="small" style="margin-top:4px"><a href="#" data-a="open" data-v="${a.ref}">Ver expediente ${a.ref}</a></div>`:''}</div>`).join(''):'<div class="empty">Sin asientos.</div>'}</div>`;
}
function vInv(){
  const bajas=S.exps.filter(x=>x.tipo==='baja');
  return `<div class="pagehead"><div><h1>Inventario y bajas</h1><p>Bienes de activo fijo. Las altas llegan clasificadas por DAF / Bodega en la recepción (Adquisiciones 4.3) y se registran al confirmar el egreso devengado; las bajas se tramitan con decreto alcaldicio.</p></div>${supChips(['S13','S17'])}</div>
  <div class="stack"><div class="panel">${S.inventario.length?`<div class="tbl-wrap"><table><tr><th>Código</th><th>Descripción</th><th>Cuenta</th><th>Alta</th><th class="num">Valor</th><th class="num">Valor libro</th><th>Estado</th><th></th></tr>${S.inventario.map(b=>`<tr><td class="mono">${b.code}</td><td>${esc(b.desc)}${b.ref?`<div class="small"><a href="#" data-a="open" data-v="${b.ref}">Ver expediente ${b.ref}</a></div>`:''}</td><td class="small"><span class="mono">${esc(b.cta)}</span> ${esc(ctaName(b.cta))}</td><td class="mono small">${fdate(b.fecha)}</td><td class="num">${fmt(b.valor)}</td><td class="num">${fmt(b.valor-(b.dep||0))}</td><td><span class="pill ${b.estado==='De baja'?'crit':'ok'}">${esc(b.estado)}</span></td><td>${b.estado==='Vigente'?`<button class="btn sm" data-a="baja" data-v="${b.code}">Revisar / dar de baja</button>`:''}</td></tr>`).join('')}</table></div>`:'<div class="empty">Sin bienes registrados.</div>'}</div>
  <div class="panel"><div class="ph"><h2>Revisiones y bajas</h2><span class="cnt">${bajas.length}</span></div>${bajas.length?listTable(bajas):'<div class="empty">Sin trámites de baja.</div>'}</div></div>`;
}
function vCierres(){ return vList('cierre'); }
function vCfg(){
  const opts=(list,sel)=>`<option value="" ${!sel?'selected':''}>— sin configurar —</option>`+list.map(c=>`<option value="${c.cod}" ${c.cod===sel?'selected':''}>${c.cod} · ${esc(c.nombre)}</option>`).join('');
  return `<div class="pagehead"><div><h1>Configuración</h1><p>Contabilidad › Configuración › Cuentas contables: cuentas relacionadas de cada cuenta por pagar (con qué cuenta se registra el egreso devengado y con cuál el egreso pagado). Sin esta configuración no se puede crear el egreso devengado.</p></div>${supChips(['S3'])}</div>
  ${S.returnTo?`<div class="alert warn" style="margin-bottom:12px">Configura la cuenta marcada y vuelve al expediente para reintentar. <button class="btn sm" data-a="open" data-v="${S.returnTo}">Volver a ${S.returnTo}</button></div>`:''}
  <div class="stack"><div class="panel"><div class="ph"><h2>Cuentas relacionadas (egresos)</h2>${roleChip('adm')}</div><div class="tbl-wrap"><table><tr><th>Cuenta por pagar</th><th>Imputación</th><th>Contra egreso devengado</th><th>Contra egreso pagado</th></tr>
  ${S.cuentas.map((c,i)=>`<tr style="${S.cfgHl===c.cod?'outline:2px solid var(--crit);outline-offset:-2px':''}"><td><span class="mono">${c.cod}</span><div class="small muted">${esc(c.nombre)}</div></td><td class="mono small">${c.pres}</td>
  <td><select data-cfg="dev" data-i="${i}" aria-label="Contra egreso devengado ${esc(c.cod)}">${opts(S.ctaDeb,c.dev)}</select></td><td><select data-cfg="pag" data-i="${i}" aria-label="Contra egreso pagado ${esc(c.cod)}">${opts(S.bancos,c.pag)}</select></td></tr>`).join('')}</table></div></div>
  <div class="panel"><div class="ph"><h2>Ingresos</h2></div><div class="pb stack">
    <label class="check"><input type="checkbox" id="cfg_auto" data-cfg="auto" ${S.cfg.autoCID?'checked':''}> <span><b>Generar automáticamente el comprobante de ingreso devengado al confirmar una orden.</b><br><span class="muted small">Si se desactiva, las órdenes confirmadas pasan a revisión manual de Contabilidad.</span> ${supChips(['S12'])}</span></label>
    <div class="field" style="max-width:260px"><label for="cfg_utm">Valor UTM del mes (ejemplo)</label><input type="number" id="cfg_utm" data-cfg="utm" value="${S.utm}"></div>
    <div class="tbl-wrap"><table><tr><th>Cuenta presupuestaria</th><th>Cuenta por cobrar</th><th>Cuenta de ingreso</th></tr>${S.presIng.map(p=>`<tr><td><span class="mono">${p.cod}</span> ${esc(p.nombre)}</td><td class="mono small">${p.cxc}</td><td class="mono small">${p.ing}</td></tr>`).join('')}</table></div>
  </div></div>
  <div class="panel"><div class="ph"><h2>Datos del prototipo</h2></div><div class="pb row"><span class="muted small">Los cambios se guardan solo en este navegador.</span><button class="btn alt" data-a="reset">Restablecer datos de ejemplo</button></div></div>
  <div class="alert sup small">Los códigos patrimoniales (531…, 141…, 214…, 451…, 611, 311) y el valor UTM son ilustrativos y deben reemplazarse por el plan de cuentas vigente de la CGR y el valor oficial.</div></div>`;
}
function vSup(){
  return `<div class="pagehead"><div><h1>Supuestos del prototipo</h1><p>Decisiones que los diagramas y los Word de detalle no resolvían, y decisiones tomadas al actualizar los flujos (23-09-2026). Cada una debe validarse con Contabilidad municipal antes de la especificación técnica.</p></div></div>
  <div class="suplist">${Object.entries(SUP).map(([k,s])=>`<div class="supitem ${S.supHl===k?'hl':''}" id="sup_${k}"><div class="id">${k}</div><div><h3>${esc(s.t)} ${s.res?'<span class="pill ok">Resuelto en Adquisiciones</span>':''}</h3><p>${esc(s.p)}</p><p class="small muted">Origen: ${esc(s.src)}</p>${s.res?`<p class="small">${extLink('Ver '+esc(s.res.t), adqUrl(s.res.url, s.res.folio))}</p>`:''}</div></div>`).join('')}</div>`;
}

/* ---------- Mapa de flujos ---------- */
/* Cada etapa del prototipo → nodos de los diagramas de la carpeta Flujos/Atualizados (23-09-2026) */
const NODE = {
  pb_reg:'Registro Preobligacion › Registro Contable de Preobligación (Compromiso Cierto)',
  pb_oc:'Registro Preobligacion › Emisión de Orden de Compra (Mercado Público) · Fin del Proceso de Compromiso',
  ced:'02- Registro Egreso devengado › INICIO Recepción Conforme / Resolución de Compra · Generar y Aprobar Resolución de Compra · 1. Seleccionar Registro de Compra · 2. Clic en "Crear Egreso Devengado" · ¿Cuenta tiene cuenta de devengo? · ALERTA / ERROR · Reintentar · 3. Generación CED (Borrador) · 02 - Egreso Devengado (esbozo: Registrar)',
  ced_s:'Obligacion sin OC › Recepción de Expediente (DTE + V°B° + Imputación) · Registro Contable de Obligación (Devengado) · 02- Registro Egreso devengado › 3. Generación CED (Borrador)',
  ced_conf:'02- Registro Egreso devengado › 4. Revisar y Cuadrar Asiento · 5. Validar Factura y Recepción Interna · 6. Estado CONFIRMADO · FIN · Registro Obligaciones › Registro Contable del Devengado (Obligación) · Proceso Inventario Municipal › Registro Devengado',
  adq_pago:'Registro Obligaciones › Emisión de Decreto de Pago · Proceso Inventario Municipal › Emisión Decreto de Pago (en la nueva arquitectura: Adquisiciones 5.3–5.4)',
  pag_reg:'(no dibujado) Egreso pagado — contrato Tesorería → Contabilidad (S2)',
  dp:'Obligacion sin OC › Emisión y Firma de Decreto de Pago · Factoring › Elaborar Decreto de Pago (rama No)',
  dp_firma:'Factoring › Firmar Decreto de Pago Regular',
  pago:'Factoring › Pago Regular · Actualizar factura regular · Fin',
  f_reg:'Factoring › Inicio · Seleccionar factura · Revisar · ¿Cesión de factura? (Sí)',
  f_susp:'Factoring › Intermedio Suspender Pago (DAF) · Suspender Pago (Tesorería)',
  f_dec:'Factoring › Elaborar Decreto Alcaldicio de Cesión',
  f_vis:'(Word, paso 5) Visación jurídica y de control interno — no dibujado',
  f_firma:'Factoring › Firmar Decreto de Cesión · Actualizar factura',
  f_rehacer:'Factoring › Elaborar / Rehacer Decreto de Pago',
  f_firma_dp:'Factoring › Firmar Decreto de Pago',
  f_pago:'Factoring › Pagar · Fin',
  s_analisis:'Obligacion sin OC › Inicio · Emisión de Documento Tributario (DTE) · Recepción y Análisis Técnico del Cobro · ¿Cobro y Servicio Correctos? · Generar Rechazo de DTE en Portal SII / Notificar',
  s_vb:'Obligacion sin OC › Emisión de V°B° / Acta de Conformidad de Servicio',
  s_imput:'Obligacion sin OC › Imputación y Verificación de Saldo Presupuestario · ¿Presupuesto Disponible? · Solicitar Modificación o Suplemento Presupuestario',
  s_exped:'Obligacion sin OC › Validación y Envío de Expediente',
  i_borr:'Ingreso Devengado › Crear Nueva Orden de Ingreso · Seleccionar Depto. y Fechas · Buscar Contribuyente · Agregar Ítem y Monto · Guardar Orden [Borrador] · Ejecutar Acción [Confirmar] · ¿Auto-generar Comprobante Activo? (SÍ) · Generar Comprobante Contable (CID)',
  i_cid:'Ingreso Devengado › ¿Auto-generar Comprobante Activo? (NO) · Revisión Manual y Aprobación · Comprobante en Estado Confirmado [Devengado Realizado]',
  i_caja:'Ingreso Percibido › Comprobante Confirmado [Devengado Realizado] · Recepcionar Pago / Registrar Ingreso · Emitir Comprobante / Timbrar Orden · Ingreso Devengado › Recepcionar Pago / Registrar Ingreso Percibido',
  i_arqueo:'Ingreso Percibido › Cuadratura Diario de Caja (Arqueo)',
  i_dep:'Ingreso Percibido › Depositar Fondos en Cuenta Bancaria',
  i_perc:'Ingreso Percibido › Asiento Contable Percibido (Saldar Deuda) · Fin',
  ca_coord:'07 - Cierre Anual › Inicio · Elaborar (DAF)',
  ci_prep:'06 - Cierre Mensual › Inicio · Revisar imputaciones presupuestarias (Word: Nuevo, Archivo, Ver asientos, Enviar a revisión)',
  ci_cerrar:'(Word) Cerrar Periodo · Reabrir Cierre con razón',
  ci_cgr:'06 - Cierre Mensual › Informar CGR · Fin',
  ca_asientos:'(Word) Generar Asientos de Cierre: traspaso de ingresos, traspaso de gastos, resultado a patrimonio neto',
  ca_conf:'(Word) Asientos en Borrador para auditoría técnica y confirmación',
  ca_eeff:'07 - Cierre Anual › Fin (Word: estados financieros e informe a CGR / SUBDERE)',
  b_eval:'Inventario › Inicio · Mantener actualizado · ¿Dar de baja? (No → Registrar y Actualizar)',
  b_dec:'Inventario › Elaborar Decreto',
  b_firma:'Inventario › Firmar (Alcaldía)',
  b_reg:'Inventario › Registrar y Actualizar · Fin'
};
const CNODE = {recopilar:'Inicio · Recopilar antecedentes banco', cheques:'Cotejar cheques', tarjetas:'Cotejar información pagos con tarjeta', comparar:'Comparar Libro Banco con Cartola Bancaria', conciliar:'Conciliar', autorizar:'Revisar y Autorizar (DAF)', revisar:'Revisar y Autorizar (Revisor)', archivar:'Archivar · Fin'};

const L = (label, a, v) => `<a href="#" data-a="${a}" data-v="${esc(v)}">${label}</a>`;
const F1='1. Contabilidad_Diagramas_SGM', F2='2. Ingreso devengado e Ingreso Percibido', F3='3. Registro Obligaciones (con y sin OC) + Registro preobligaciones', F4='proceso_inventario_Recepcion_Conforme.drawio';
function flowDefs(){ return [
  {key:'preob', title:'Preobligación (compromiso cierto) tras la adjudicación', stages:FLOWS.preob, tipo:'preob',
   src:[F3+' › Registro Preobligacion'],
   how:[
     `Requerimiento, CDP, proceso de compra y decreto de adjudicación están en el ${extLink('módulo Adquisiciones',adqUrl('index.html'))} (ver "Qué quedó en Adquisiciones").`,
     `Desde Adquisiciones: abre ${extLink('3.10 Resolución de adjudicación de ADQ-2026-00045',adqUrl('3-licitacion-publica/310-resolucion-adjudicacion','ADQ-2026-00045'))}, pulsa "Generar acto y solicitar firma", cierra el aviso y pulsa "Registrar preobligación en Contabilidad". Llegas con el decreto precargado.`,
     `Como Contabilidad, "Registrar preobligación": en ${L('Ejecución presupuestaria','nav','pres')} 22.06.002 pasa $178.500.000 de "Reserva CDP" a "Comprometido". Luego, como Adquisiciones, "Simular: OC emitida".`]},
  {key:'oc', title:'Devengado de compras creado desde Adquisiciones', stages:FLOWS.oc, tipo:'oc',
   src:[F1+' › 02- Registro Egreso devengado', F3+' › Registro Obligaciones (solo "Registro Contable del Devengado")', F4+' (Match 3 vías, Registro Devengado)'],
   how:[
     `Desde Adquisiciones: abre ${extLink('5.1 Cruce de 3 vías de ADQ-2026-00123',adqUrl('procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123'))}, completa el match y pulsa "Crear egreso devengado (5.2)". El CED nace en borrador; si repites el botón, Contabilidad abre el mismo expediente.`,
     `O simúlalo desde aquí: ${L('Simular creación desde Adquisiciones','nav','new-oc')}.`,
     `Error de configuración (diagrama 02): ${L('Servicio de aseo','openg','Servicio de aseo')} como Adquisiciones → "Crear egreso devengado" → alerta → "Ir a configuración de cuentas" (Administrador contable) → elige la cuenta → vuelve y Adquisiciones reintenta.`,
     `Bien inventariable: ${L('Notebooks Oficina de Partes','openg','Notebooks')} → Contabilidad confirma el CED → el activo con el código de Bodega aparece en ${L('Inventario','nav','inv')}.`,
     `Pago: ${L('Señalética peatonal','openg','Señalética')} → "Simular: pago completado" → Contabilidad registra el egreso pagado.`]},
  {key:'sinoc', title:'Gasto sin orden de compra (servicios básicos, arriendos)', stages:FLOWS.sinoc, tipo:'sinoc',
   src:[F3+' › Obligacion sin OC'],
   how:[
     `Registra una factura: ${L('Registrar factura recibida','nav','new-sinoc')}. Queda en el análisis técnico del cobro.`,
     `Rama NO (cobro incorrecto): ${L('Arriendo oficina DIDECO','openg','Arriendo oficina')} → "Rechazar DTE en el SII y notificar" → expediente Rechazado.`,
     `Sin saldo (S4): ${L('Consumo eléctrico alumbrado público','openg','Consumo eléctrico')} como Presupuesto → "Solicitar modificación o suplemento" → "Registrar suplemento" → "Imputar y comprometer".`,
     `Camino completo: ${L('Agua potable','openg','Agua potable')} desde el análisis técnico hasta el pago.`]},
  {key:'factoring', title:'Factoring (cesión de facturas): casos A y B', stages:FLOWS.factoring, tipo:'factoring',
   src:[F1+' › Factoring'],
   how:[
     `Caso B (hay decreto de pago): ${L('Tóner impresoras DAF','openg','Tóner')} está esperando el pago en Adquisiciones. En "Detección de cesión" elige el cesionario y pulsa "Registrar cesión": el recorrido pasa a 8 pasos, con suspensión en Tesorería.`,
     `Caso A (sin decreto de pago): ${L('Arriendo bodega municipal','openg','Arriendo bodega')} está en "Elaborar decreto de pago". Al registrar la cesión se cambia el receptor del pago y no hay suspensión (7 pasos).`,
     `En ambos: decreto de cesión (DAF) → visación de Control interno o Jurídica (puede devolver) → firma de Alcaldía → decreto de pago al factoring (Contabilidad) → firma → pago y comprobante al cesionario (Tesorería).`,
     `Rama "No" = pago regular: ${L('Agua potable','openg','Agua potable')} (sin OC) → decreto → Alcaldía firma → Tesorería paga y actualiza la factura.`]},
  {key:'ing', title:'Ingreso devengado y percibido', stages:FLOWS.ing, tipo:'ing',
   src:[F2+' › Ingreso Devengado', F2+' › Ingreso Percibido'],
   how:[
     `El ejemplo del diagrama ($68.000): ${L('Patente comercial — Almacén El Roble','openg','Patente comercial')} como Unidad emisora → "Confirmar orden" → el CID se genera solo.`,
     `Crea otra: ${L('Nueva orden de ingreso','nav','new-ing')} (fechas de emisión y vencimiento, período, contribuyente o ficha nueva, ítems en pesos o UTM).`,
     `Rama NO (revisión manual): desactiva la generación automática en ${L('Configuración','nav','cfg')}, confirma una orden y quedará en la bandeja de Contabilidad.`,
     `Percibido: como Caja, "Registrar pago y timbrar"; luego en ${L('Caja y rendiciones','nav','caja')} la rendición del día avanza completa: arqueo y depósito (Tesorería) y contabilización (Contabilidad).`]},
  {key:'conc', title:'Conciliación bancaria', stages:S.conc.stages, tipo:'conc',
   src:[F1+' › Conciliación Bancaria'],
   how:[
     `Abre la ${L('conciliación de agosto','nav','conc')} como Contabilidad (encargado de conciliaciones) y avanza: cada cotejo marca movimientos como "Cruzado".`,
     `En "Identificar partidas y conciliar" registra el comprobante de traspaso de las comisiones y el abono no identificado, y genera el cuadro (cuadra banco vs. libro).`,
     `Luego autoriza DAF, revisa Control interno (ambos pueden devolver) y DAF archiva.`]},
  {key:'cm', title:'Cierre mensual', stages:FLOWS.cm, tipo:'cierre',
   src:[F1+' › 06 - Cierre Mensual','Word "Detalle Flujos_Videos - Cierre Mensual y Anual"'],
   how:[
     `Abre ${L('Cierre mensual Agosto 2026','openg','Cierre mensual Agosto')}: adjunta respaldos, revisa asientos y envía a revisión.`,
     `"Cerrar período" está bloqueado mientras la conciliación de agosto no esté archivada (caso C12). Archivada, el período se cierra y se informa a la CGR.`,
     `Reapertura: desde el paso de informe o con el cierre terminado, "Reabrir cierre" exige una razón.`]},
  {key:'ca', title:'Cierre anual', stages:FLOWS.ca, tipo:'cierre',
   src:[F1+' › 07 - Cierre Anual','Word "Detalle Flujos_Videos - Cierre Mensual y Anual"'],
   how:[
     `Abre ${L('Cierre anual Ejercicio 2025','openg','Cierre anual Ejercicio 2025')}: DAF registra las tareas previas de sus unidades; Contabilidad prepara, cierra y genera los 3 asientos de cierre.`,
     `DAF confirma los asientos y envía los estados financieros a la CGR y SUBDERE.`]},
  {key:'baja', title:'Inventario: baja de bienes', stages:FLOWS.baja, tipo:'baja',
   src:[F1+' › Inventario'],
   how:[
     `Abre ${L('la revisión de la impresora INV-2019-0214','openg','Revisión de INV-2019-0214')} o pulsa "Revisar / dar de baja" en ${L('Inventario y bajas','nav','inv')}.`,
     `Rama Sí: decreto → firma de Alcaldía → registrar baja (asiento por valor libro). Rama No: se actualiza la ficha y termina.`]}
]; }
function stageRol(f,s){ return f.key==='conc'?CST[s].rol:STG[s].rol; }
function stageLabel(f,s){ return f.key==='conc'?CST[s].label:STG[s].label; }
function stageCount(f,s){ if(f.key==='conc') return S.conc.estado!=='Archivada'&&S.conc.stages[S.conc.idx]===s?1:0; return S.exps.filter(x=>isOpen(x)&&cur(x)===s&&(f.tipo!=='cierre'||x.tipoCierre===(f.key==='ca'?'Anual':'Mensual'))).length; }
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
    [F1,'02 - Egreso Devengado (esbozo)','ok','Cubierto por "02- Registro Egreso devengado"','oc'],
    [F1,'02- Registro Egreso devengado','ok','Devengado desde Adquisiciones (CED creado por Adquisiciones, confirmado por Contabilidad) + Configuración de cuentas','oc'],
    [F1,'Factoring','ok','Factoring casos A (7 pasos) y B (8 pasos) + pago regular','factoring'],
    [F1,'Conciliación Bancaria','ok','Conciliación, 8 pasos (DAF antes que el Revisor)','conc'],
    [F1,'Inventario','ok','Revisión y baja de bienes, 4 etapas','baja'],
    [F1,'06 - Cierre Mensual','ok','Cierre mensual, 3 etapas (detalle del Word)','cm'],
    [F1,'07 - Cierre Anual','ok','Cierre anual, 6 etapas (detalle del Word)','ca'],
    [F2,'Ingreso Devengado','ok','Ingreso, etapas 1–2','ing'],
    [F2,'Ingreso Percibido','ok','Ingreso, etapas 3–6 (caja, arqueo, depósito, asiento)','ing'],
    [F3,'Registro Preobligacion','mix','Adquisiciones 1.1–3.x · preobligación en Contabilidad (S5)','preob'],
    [F3,'Registro Obligaciones','mix','Adquisiciones 3.3–5.4 · devengado en Contabilidad','oc'],
    [F3,'Obligacion sin OC','ok','Gasto sin OC, 9 etapas','sinoc'],
    [F4,'Proceso Inventario Municipal','mix','Adquisiciones 4.1–5.1 (recepción, NICSP por Bodega, cruce) · devengado y activo en Contabilidad','adqmap']
  ];
  const pill={adq:'<span class="pill acc">En Adquisiciones</span>',mix:'<span class="pill acc">Adquisiciones + Contabilidad</span>',ok:'<span class="pill ok">Implementado</span>',sup:'<span class="pill" style="background:var(--sup-soft);color:var(--sup)">Con supuesto</span>',part:'<span class="pill warn">Parcial</span>',no:'<span class="pill crit">No incluido</span>'};
  const F=flowDefs();
  return `<div class="pagehead"><div><h1>Mapa de flujos</h1><p>Todos los flujos de Contabilidad de la carpeta <b>Flujos/Atualizados</b> (23-09-2026), dibujados por carril (rol). La parte de compras vive en el prototipo de Adquisiciones: ver "Qué quedó en Adquisiciones". Cada etapa es un enlace: cambia al rol correcto y abre un expediente detenido en esa etapa, o uno que ya pasó por ella. El número sobre una etapa indica cuántos expedientes hay ahí ahora.</p></div></div>
  <div class="stack">
  <div class="panel"><div class="ph"><h2>Cobertura de los 13 diagramas de Flujos/Atualizados</h2><div class="row small">${F.map(f=>`<a href="#fl_${f.key}" data-a="jump" data-v="fl_${f.key}">${esc(f.title.split(' (')[0].split(':')[0])}</a>`).join(' · ')} · <a href="#fl_adq" data-a="jump" data-v="fl_adq">Qué quedó en Adquisiciones</a></div></div>
  <div class="tbl-wrap"><table><tr><th>Archivo</th><th>Diagrama</th><th>Estado</th><th>Dónde está en el prototipo</th><th></th></tr>
  ${cov.map(c=>`<tr><td class="small mono">${esc(c[0])}</td><td>${esc(c[1])}</td><td>${pill[c[2]]}</td><td class="small">${esc(c[3])}</td><td style="white-space:nowrap">${c[4]?(c[4]==='adqmap'?L('Ver mapeo','jump','fl_adq'):L('Ver flujo','jump','fl_'+c[4])):''}</td></tr>`).join('')}</table></div>
  <div class="pb small muted">Los 6 Word de detalle (Factoring y Conciliación; Ingreso devengado y percibido; Obligación con y sin OC + Preobligación; Cierre mensual y anual; Egreso devengado; Inventario / Recepción conforme) se usaron para las reglas, roles y pasos de cada etapa. Lo que ni el diagrama ni el Word resuelven está en ${L('Supuestos','nav','sup')}.</div></div>
  ${F.map(f=>`<section class="panel" id="fl_${f.key}"><div class="ph"><h2>${esc(f.title)}</h2><span class="small muted">${f.stages.length} etapas</span></div><div class="pb stack">
    <div class="small muted">Diagramas fuente: ${f.src.map(s=>`<span class="mono">${esc(s)}</span>`).join(' · ')}</div>
    ${swimlane(f)}${f.stages.length>7?'<div class="small muted">Desliza el diagrama hacia la derecha para ver todas las etapas.</div>':''}
    <details class="how" open><summary><b>Cómo comprobarlo</b></summary><ol>${f.how.map(h=>`<li>${h}</li>`).join('')}</ol></details>
    <details class="how"><summary><b>Etapa por etapa: nodo del diagrama que representa</b></summary><div class="tbl-wrap"><table><tr><th>#</th><th>Etapa del prototipo</th><th>Rol</th><th>Nodos del diagrama</th><th></th></tr>
    ${f.stages.map((s,j)=>`<tr><td class="mono">${j+1}</td><td>${esc(stageLabel(f,s))}</td><td>${roleChip(stageRol(f,s))}</td><td class="small">${esc(f.key==='conc'?CNODE[s]:NODE[s])} ${supChips((f.key==='conc'?CST[s].sup:STG[s].sup))}</td><td>${L('Ver','goto',f.key+':'+s)}</td></tr>`).join('')}</table></div></details>
  </div></section>`).join('')}
  ${adqMapHTML()}
  <div class="panel" id="fl_cfg"><div class="ph"><h2>Subproceso: configuración de cuentas</h2>${roleChip('adm')}</div><div class="pb small">Nodo "SUBPROCESO: Configuración de Cuentas" del diagrama 02 (Word: Contabilidad › Configuración › Cuentas Contables › pestaña Cuentas Relacionadas): ${L('Configuración','nav','cfg')} → columnas "Contra egreso devengado" / "Contra egreso pagado". La cuenta 215.22.08.001 viene sin configurar a propósito para reproducir la alerta.</div></div>
  </div>`;
}
const ADQMAP=[
  ['Registro Preobligacion › Generar Requerimiento de Compra / Memorándum','1.1 Creación de solicitud (SOLPED)','procesos-transversales/11-creacion-solped','ADQ-2026-00123',''],
  ['(no dibujado)','1.2 Visto bueno de jefatura','procesos-transversales/12-visto-bueno-jefatura','ADQ-2026-00123','Firma FEA vía FirmaGob'],
  ['Evaluar Disponibilidad Presupuestaria · ¿Existe Saldo Disponible?','1.3 Clasificación y verificación presupuestaria','procesos-transversales/13-verificacion-disponibilidad','ADQ-2026-00123',''],
  ['Devolver a Unidad o Solicitar Modificación','1.4 Solicitar financiamiento a DAF','procesos-transversales/16-solicitar-financiamiento','ADQ-2026-00142','Resuelve S4 para compras'],
  ['Emitir Certificado de Disponibilidad (CDP)','1.5 Emisión de CDP firmado','procesos-transversales/14-emision-cdp','ADQ-2026-00123','El CDP reserva los fondos (reserva preventiva)'],
  ['(Adquisiciones 1.6)','1.6 Preobligación','procesos-transversales/15-preobligacion','ADQ-2026-00123','Según el Word, la preobligación es el compromiso cierto que registra Contabilidad tras la adjudicación (S5): propuesta de cambio'],
  ['Gestionar Proceso de Compra (Licitación / Trato Directo)','2.1–2.3 Modalidad y vínculo MP · etapa 3 por modalidad','procesos-transversales/21-ratificacion-modalidad','ADQ-2026-00123','4 modalidades'],
  ['Aprobar Decreto de Adjudicación','3.10 Resolución de adjudicación (Licitación)','3-licitacion-publica/310-resolucion-adjudicacion','ADQ-2026-00045','Botón nuevo hacia Contabilidad: registrar la preobligación'],
  ['Registro Contable de Preobligación (Compromiso Cierto)','Contabilidad · Preobligaciones (registerPreObligation)','','','Lo hace este prototipo después de 3.10 (S5); hoy el contrato lo llama en 1.6'],
  ['Emisión de Orden de Compra (Mercado Público) · Emisión y Envío de OC','3.3 / 3.14 Emisión de la OC','1-compra-agil/33-emision-oc','ADQ-2026-00123',''],
  ['¿OC Aceptada por Proveedor? · Notificar / Re-evaluar','3.4 Aceptación · 3.5 Rechazo de la OC','1-compra-agil/35-rechazo-oc','ADQ-2026-00123','Resuelve S6'],
  ['Recepción Física de Bienes · ¿Cotejo con OC Correcto? · Recepción y Visación','4.1 Registro de la recepción','procesos-transversales/41-recepcion-conforme','ADQ-2026-00123',''],
  ['Solicitar V°B° Técnico · Firma de V°B° Técnico · Firma de Acta de Recepción Conforme','4.2 Verificación de conformidad (doble conformidad)','00-expediente/','ADQ-2026-00123','Sin pantalla aún'],
  ['Generar Acta de Observaciones y Rechazo · ¿Recepción Conforme Registrada en MP? (NO)','4.5 Recepción no conforme','00-expediente/','ADQ-2026-00123','Sin pantalla aún · S7'],
  ['Clasificación NICSP y Codificación (DAF / Bodega)','4.3 Alta en inventario / activo fijo','00-expediente/','ADQ-2026-00123','Según el Word la hace Bodega; Contabilidad registra el activo al confirmar el CED (S13, X-44)'],
  ['Verificación DTE y Emisión CRC · ¿DTE Acorde a OC? · Registrar Reclamo o Rechazo DTE','5.1 (factura desde SII) · circuito DTE de Tesorería','procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123',''],
  ['Match 3 Vías (OC + CRC + DTE) · Integración de Expediente','5.1 Cruce de 3 vías','procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123','El diagrama lo pone en el carril de Contabilidad (S18)'],
  ['Registro Contable del Devengado · 02- Registro Egreso devengado pasos 1–3','5.2 → botón "Crear egreso devengado"','','','CED creado por Adquisiciones, confirmado por Contabilidad (S18)'],
  ['Emisión de Decreto de Pago','5.3 Decreto de pago (DocDigital)','00-expediente/','ADQ-2026-00202','Sin pantalla aún'],
  ['(pago)','5.4 Ejecución del pago (Tesorería)','00-expediente/','ADQ-2026-00202','Sin pantalla aún · Contabilidad registra el egreso pagado']
];
function adqMapHTML(){
  return `<section class="panel" id="fl_adq"><div class="ph"><h2>Qué quedó en Adquisiciones</h2>${extLink('Abrir el módulo',adqUrl('index.html'))}</div><div class="pb stack">
  <p class="small" style="margin:0">Cada nodo de los diagramas de compra, con el sub-paso del prototipo de Adquisiciones que lo cubre. Los enlaces abren la pantalla de ese sub-paso dentro de este mismo sitio; usa el menú lateral para volver a Contabilidad.</p>
  <div class="tbl-wrap"><table><tr><th>Nodo del diagrama</th><th>Sub-paso</th><th>Nota</th><th></th></tr>
  ${ADQMAP.map(r=>`<tr><td class="small">${esc(r[0])}</td><td>${esc(r[1])}</td><td class="small muted">${esc(r[4])}</td><td>${r[2]?extLink(r[2].startsWith('00-')?'Expediente':'Pantalla',adqUrl(r[2],r[3])):L('Ver','jump',r[1].includes('Preobligaciones')?'fl_preob':'fl_oc')}</td></tr>`).join('')}</table></div>
  <div class="alert warn small"><b>Para alinear con el equipo de Adquisiciones:</b>
  <ol style="margin:6px 0 0;padding-left:18px">
  <li><b>Preobligación (S5).</b> Los flujos actualizados dicen que el CDP reserva y que la preobligación es el compromiso cierto que registra Contabilidad tras el decreto de adjudicación, antes de la OC. Adquisiciones hoy la modela en 1.6 (tras el CDP) y el compromiso en 3.4 (OC aceptada).</li>
  <li><b>Quién crea el CED (S18).</b> Según el video, lo crea Adquisiciones desde la resolución de compra y Contabilidad lo confirma. Esto reemplaza la "solicitud de devengado"; sigue pendiente elegir un solo punto de disparo entre 4.4 (<span class="mono">recordAccrual</span>) y 5.2 (<span class="mono">registerAccrual</span>). El prototipo usa 5.2.</li>
  <li><b>Clasificación NICSP (S13, X-44).</b> La hace DAF / Bodega en 4.3 y llega con el código de inventario; Contabilidad registra el activo al confirmar el CED.</li>
  <li><b>Factoring (S10, MC-7).</b> 5.3 y 5.4 asumen que se paga al proveedor. Con cesión, el beneficiario es el factoring y Tesorería debe poder suspender un decreto en curso (caso B).</li>
  <li><b>Cruce de 3 vías.</b> El diagrama lo pone en el carril de Contabilidad y Tesorería; la pantalla sigue siendo 5.1 de Adquisiciones.</li>
  </ol></div></div></section>`;
}
function findExample(key, s){
  const tipos = key==='factoring'?['oc','sinoc']:key==='cm'||key==='ca'?['cierre']:[key];
  let E=S.exps.filter(x=>tipos.includes(x.tipo));
  if(key==='cm') E=E.filter(x=>x.tipoCierre==='Mensual'); if(key==='ca') E=E.filter(x=>x.tipoCierre==='Anual');
  let x=E.find(x=>isOpen(x)&&cur(x)===s); if(x) return {x, how:'now'};
  x=E.find(x=>x.stages.includes(s)&&x.stages.indexOf(s)<x.idx); if(x) return {x, how:'past'};
  if(key==='factoring'){ for(const t of tipos){ x=E.find(x=>x.tipo===t&&isOpen(x)&&CEDE_STAGES.includes(cur(x))&&!x.docs.cesion); if(x) return {x, how:'cede'}; } }
  const fl=FLOWS[key]||[]; const target=fl.indexOf(s);
  x=E.find(x=>isOpen(x)&&x.stages.indexOf(cur(x))<(x.stages.indexOf(s)>=0?x.stages.indexOf(s):target)); if(x) return {x, how:'before'};
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
  S.fromMap=x.tipo==='cierre'?(x.tipoCierre==='Anual'?'ca':'cm'):x.tipo; S.hl=null; S.err=null; if(isOpen(x)) S.role=STG[cur(x)].rol; go('exp', x.id);
}
function mapBanner(x){
  if(S.hl && !STG[S.hl]) S.hl=null;
  if(S.hl && S.hlHow==='cede' && !x.stages.includes(S.hl)) return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>Desde el mapa: <b>${esc(STG[S.hl].label)}</b> (carril Factoring)</span><button class="btn sm" data-a="backmap">← Volver al mapa</button></div><div class="small" style="margin-top:6px">Aún no hay facturas cedidas en este expediente. Está en etapa de pago: registra la cesión en el recuadro "Detección de cesión" y su recorrido pasará a los pasos del factoring.</div><div class="small" style="margin-top:4px">Nodos del diagrama: ${esc(NODE[S.hl])}</div></div>`;
  if(!S.hl || !x.stages.includes(S.hl)) return S.fromMap?`<div class="row" style="margin-bottom:10px"><button class="btn sm" data-a="backmap">← Volver al mapa de flujos</button></div>`:'';
  const i=x.stages.indexOf(S.hl);
  const st = i===x.idx&&isOpen(x)?'<span class="pill acc">Etapa actual: puedes ejecutarla abajo</span>' : i<x.idx?'<span class="pill ok">Ya completada: revisa Documentos, Asientos e Historial</span>' : '<span class="pill warn">Aún no llega: avanza las etapas anteriores</span>';
  return `<div class="alert sup" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><span>Desde el mapa: <b>${esc(STG[S.hl].label)}</b> (etapa ${i+1}) ${st}</span><button class="btn sm" data-a="backmap">← Volver al mapa</button></div><div class="small" style="margin-top:6px">Nodos del diagrama: ${esc(NODE[S.hl])}</div></div>`;
}

/* ---------- Guía de demo ---------- */
const CASES = [
  {id:'C13', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'feliz', titulo:'Preobligación (compromiso cierto) tras la adjudicación', folio:'ADQ-2026-00045', tipoExp:'preob', adqStart:'3-licitacion-publica/310-resolucion-adjudicacion',
   dato:'ADQ-2026-00045 · Servicio de mantención de flota municipal · Licitación Pública · adjudicado $178.500.000 · cuenta 22.06.002 (expediente real del prototipo de Adquisiciones)',
   demuestra:'La regla del Word: con el decreto de adjudicación tramitado, Contabilidad transforma la reserva del CDP en compromiso cierto y recién entonces se emite la OC.',
   pasos:[['ext',()=>`En Adquisiciones, abre ${extLink('3.10 Resolución de adjudicación de ADQ-2026-00045',adqUrl('3-licitacion-publica/310-resolucion-adjudicacion','ADQ-2026-00045'))}. Pulsa "Generar acto y solicitar firma", cierra el aviso de validaciones y pulsa "Registrar preobligación en Contabilidad".`],
          ['ext','Llegas a Contabilidad con el decreto precargado. Pulsa "Recibir adjudicación".'],
          ['con',()=>`Mira la reserva del CDP en el recuadro verde, marca "Decreto de adjudicación tramitado" y pulsa "Registrar preobligación". Revisa ${L('Ejecución presupuestaria','nav','pres')}: 22.06.002 pasa $178.500.000 de "Reserva CDP" a "Comprometido".`],
          ['ext','"Simular: OC emitida en Mercado Público".']],
   resultado:'Expediente cerrado con la preobligación PRE-2026-… y la OC emitida. En 22.06.002 la reserva del CDP baja a $0 y el comprometido sube $178.500.000.'},
  {id:'C1', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'feliz', titulo:'Adquisiciones crea el egreso devengado y Contabilidad lo confirma', folio:'ADQ-2026-00123', adqStart:'procesos-transversales/51-cruce-tres-vias',
   dato:'ADQ-2026-00123 · Insumos de oficina — reposición anual · Compra Ágil · Comercial Sur SpA · $1.180.000 (expediente real del prototipo de Adquisiciones)',
   demuestra:'El video de Egreso Devengado: el botón "Crear egreso devengado" está en Adquisiciones; el CED nace en borrador y Contabilidad lo verifica y confirma. Después, el pago.',
   pasos:[['ext',()=>`En Adquisiciones, abre ${extLink('5.1 Cruce de 3 vías de ADQ-2026-00123',adqUrl('procesos-transversales/51-cruce-tres-vias','ADQ-2026-00123'))}. Pulsa "Ejecutar match", cierra el aviso de validaciones y pulsa "Crear egreso devengado (5.2)".`],
          ['ext','Llegas a Contabilidad con la resolución de compra precargada (monto, OC, proveedor, cuenta 22.04.001). Pulsa "Crear egreso devengado": nace el CED en borrador.'],
          ['con','Marca las dos verificaciones (asiento y recepción/factura) y pulsa "Cambiar estado a CONFIRMADO".'],
          ['ext','"Simular: pago completado" (representa el decreto 5.3 y el pago 5.4 que orquesta Adquisiciones).'],
          ['con','"Registrar egreso pagado".'],
          ['ext','Prueba de duplicado: vuelve a pulsar el botón 5.2 en Adquisiciones. Contabilidad abre el mismo expediente y avisa que no crea otro.']],
   resultado:'Estado Pagado. Devengado y pagado +$1.180.000 en 22.04.001, dos asientos en el Libro diario y un cargo en el Libro banco.'},
  {id:'C2', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'bloqueo', titulo:'Cuenta contable sin configurar', glosa:'Servicio de aseo',
   dato:'ADQ-2026-00250 (folio simulado) · Servicio de aseo dependencias municipales — agosto · $24.500.000 · cuenta 215.22.08.001',
   demuestra:'La regla del diagrama 02 y del video: Adquisiciones no puede crear el devengado si la cuenta no tiene sus contracuentas; Contabilidad debe configurarlas.',
   pasos:[['ext','Pulsa "Crear egreso devengado". Aparece el error en rojo: la cuenta 215.22.08.001 no tiene cuenta de egreso devengado.'],
          ['adm','Pulsa "Ir a configuración de cuentas". La fila está marcada en rojo: en "Contra egreso devengado" elige 531.22.08 · Gasto en servicios generales.'],
          ['ext','Pulsa "Volver a EXP-…" y reintenta "Crear egreso devengado" como Adquisiciones: ahora funciona.'],
          ['con','Marca las verificaciones y "Cambiar estado a CONFIRMADO".']],
   destrabar:'Configurar la cuenta relacionada (Contabilidad › Configuración › Cuentas contables) y que Adquisiciones reintente.',
   resultado:'CED creado y confirmado. El error queda registrado en el Historial del expediente.'},
  {id:'C3', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'feliz', titulo:'Bien inventariable: activo con código de Bodega', glosa:'Notebooks',
   dato:'ADQ-2026-00252 (folio simulado) · Notebooks Oficina de Partes (6 unidades) · $5.940.000 · subtítulo 29 · código INV-2026-0658 asignado por Bodega',
   demuestra:'Según los flujos actualizados, DAF / Bodega clasifica el bien (NICSP) y le asigna código en la recepción; Contabilidad registra el activo al confirmar el devengado.',
   pasos:[['con','El CED ya está en borrador (lo creó Adquisiciones). Marca las verificaciones y "Cambiar estado a CONFIRMADO".'],
          ['con',()=>`Abre ${L('Inventario y bajas','nav','inv')}: aparece INV-2026-0658 con cuenta 141.06.`]],
   resultado:'Activo en Inventario y expediente esperando el pago (se puede seguir como en C4).'},
  {id:'C4', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'feliz', titulo:'Pago informado por Adquisiciones y Tesorería', glosa:'Señalética',
   dato:'ADQ-2026-00202 · Señalética peatonal — reposición · $2.950.000 (en Adquisiciones está en 5.4 Ejecución del pago)',
   demuestra:'Contabilidad no paga: recibe el evento de pago y registra el egreso pagado.',
   pasos:[['ext','"Simular: pago completado (PaymentCompleted)".'],['con','"Registrar egreso pagado".']],
   resultado:'Estado Pagado, cargo en el Libro banco y pagado +$2.950.000 en 22.04.010.'},
  {id:'C5', grupo:'Compras: preobligación y devengado desde Adquisiciones', tipo:'ref', titulo:'Expediente terminado (para mostrar el resultado)', glosa:'Equipamiento ergonómico',
   dato:'ADQ-2026-00231 · Equipamiento ergonómico Tesorería · $3.980.000 · ya pagado',
   demuestra:'Cómo se ve un expediente cerrado: recorrido completo, documentos, asientos e historial.',
   pasos:[['con','Solo mirar: Recorrido del flujo (todo en verde), Documentos (CED, activo INV-2026-0631, decreto, pago), Asientos contables e Historial con fechas y roles.']],
   resultado:'Nada que ejecutar.'},
  {id:'C6', grupo:'Factoring', tipo:'bloqueo', titulo:'Caso B: factura cedida con decreto de pago en trámite', glosa:'Tóner',
   dato:'ADQ-2026-00253 (folio simulado) · Tóner impresoras DAF · $980.000 · proveedor Comercial Libra SpA · decreto 5.3 en trámite en Adquisiciones',
   demuestra:'El caso B del Word: alerta, suspensión en Tesorería, decreto de cesión visado por Control interno o Jurídica y nuevo decreto a nombre del factoring.',
   pasos:[['daf','En "Detección de cesión en el Registro del SII" elige Factor Capital Andino S.A. y pulsa "Registrar cesión". El recorrido pasa a 8 pasos (caso B).'],
          ['daf','"Marcar alerta y notificar a Tesorería".'],['tes','"Suspender pago".'],['daf','"Elaborar borrador".'],
          ['rev','Marca las dos verificaciones y "Visar". Para mostrar la corrección, usa antes "Devolver con observaciones": vuelve a DAF.'],
          ['alc','"Firmar" (decreto de cesión).'],['con','"Anular el decreto original y emitir el nuevo".'],['alc','"Firmar decreto".'],['tes','"Registrar pago".']],
   destrabar:'El pago al proveedor original queda suspendido hasta que se tramitan el decreto de cesión y el nuevo decreto de pago.',
   resultado:'Estado Pagado a Factor Capital Andino S.A.; Documentos muestra la cesión (caso B), el decreto original anulado y el comprobante enviado al cesionario.'},
  {id:'C14', grupo:'Factoring', tipo:'feliz', titulo:'Caso A: factura cedida antes del decreto de pago', glosa:'Arriendo bodega',
   dato:'Inmobiliaria Los Aromos SpA · factura 1179 · Arriendo bodega municipal — septiembre · $1.320.000 · devengado confirmado, sin decreto de pago',
   demuestra:'El caso A del Word: como aún no hay decreto, basta con cambiar el receptor del pago; no hay suspensión.',
   pasos:[['daf','En "Detección de cesión" elige Fondo Pyme Financiero SpA y pulsa "Registrar cesión". El recorrido pasa a 7 pasos (caso A, sin suspensión).'],
          ['daf','"Cambiar receptor del pago al factoring".'],['daf','"Elaborar borrador".'],['rev','Marca las verificaciones y "Visar".'],
          ['alc','"Firmar".'],['con','"Emitir decreto de pago" (directo a nombre del factoring).'],['alc','"Firmar decreto".'],['tes','"Registrar pago".']],
   resultado:'Estado Pagado a Fondo Pyme Financiero SpA, sin decreto anulado ni suspensión.'},
  {id:'C7', grupo:'Gasto sin orden de compra', tipo:'feliz', titulo:'Servicio básico de punta a punta', glosa:'Agua potable',
   dato:'Aguas del Valle S.A. · factura 8841203 · Agua potable edificio consistorial — agosto · $612.400 · cuenta 22.05.002',
   demuestra:'Todo el flujo sin OC con cinco roles distintos (también es la rama "No" del factoring: pago regular).',
   pasos:[['sol','"Cobro y servicio correctos".'],['sol','"Emitir V°B°".'],['pre','"Imputar y comprometer" (saldo en verde).'],['pre','"Enviar a Contabilidad".'],
          ['con','"Crear egreso devengado".'],['con','Verificaciones y "Cambiar estado a CONFIRMADO".'],['con','"Elaborar decreto de pago".'],['alc','"Firmar decreto".'],['tes','"Registrar pago" (la factura queda Pagada).']],
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
   demuestra:'La rama NO del análisis técnico: el DTE se rechaza en el SII, se notifica al proveedor y el expediente se cierra.',
   pasos:[['sol','"Rechazar DTE en el SII y notificar".']],
   destrabar:'No se destraba en este expediente: el proveedor debe emitir un DTE nuevo, que entra como factura nueva en Servicios sin OC.',
   resultado:'Estado Rechazado. No toca presupuesto ni contabilidad.'},
  {id:'C10', grupo:'Ingresos', tipo:'feliz', titulo:'Patente: devengado automático y pago en caja', glosa:'Patente comercial',
   dato:'Almacén El Roble Ltda. · Patente comercial 2° semestre · $68.000 (el ejemplo del diagrama)',
   demuestra:'El motor de reglas genera el CID al confirmar la orden, y la caja recibe el pago y timbra la orden.',
   pasos:[['emi','"Confirmar orden": el CID se genera solo (ver Documentos y asiento).'],['caja','Medio "Efectivo" y "Registrar pago y timbrar": el pago entra en la rendición de caja del día.'],
          ['tes',()=>`Sigue con el caso C15 (${L('Caja y rendiciones','nav','caja')}): el arqueo, el depósito y la contabilización incluyen esta orden.`]],
   resultado:'Orden pagada y timbrada con comprobante RI-2026-…; queda Percibido cuando se contabiliza la rendición (C15).'},
  {id:'C11', grupo:'Ingresos', tipo:'bloqueo', titulo:'Ingreso con revisión manual', glosa:'Derecho de aseo comercial 2° semestre',
   dato:'Minimarket Doña Rosa SpA · Derecho de aseo comercial 2° semestre · $92.500',
   demuestra:'La rama NO del diagrama: sin generación automática, la orden espera la aprobación de Contabilidad (DAF).',
   pasos:[['adm',()=>`En ${L('Configuración','nav','cfg')} desmarca "Generar automáticamente el comprobante…".`],
          ['emi','"Confirmar orden": queda en "Revisión manual y aprobación".'],['con','"Aprobar y generar CID".'],
          ['adm','Vuelve a Configuración y marca otra vez la casilla (si no, C10 también quedará manual).']],
   destrabar:'La aprobación de Contabilidad.',
   resultado:'CID generado en modo Manual; la orden queda lista para pagar en caja.'},
  {id:'C15', grupo:'Ingresos', tipo:'bloqueo', titulo:'Caja: arqueo, depósito y contabilización del percibido', rend:true,
   dato:'Rendición de caja del día con 3 pagos timbrados: $138.000 en efectivo (2 UTM de ejemplo), $54.500 en cheque y $92.500 con tarjeta',
   demuestra:'El ingreso percibido del diagrama actualizado: arqueo diario, depósito al día hábil siguiente y asiento en Contabilidad. Muestra el bloqueo si el arqueo no cuadra.',
   pasos:[['tes','En "Efectivo contado" escribe 130000 y pulsa "Cerrar caja y aprobar arqueo": el sistema lo impide porque no cuadra. Corrige al monto propuesto y vuelve a pulsar. La rendición completa avanza.'],
          ['tes','"Registrar depósito": efectivo y cheques, con fecha del día hábil siguiente.'],
          ['con',()=>`Marca "El comprobante de depósito coincide…" y pulsa "Contabilizar ingreso percibido". Revisa ${L('Caja y rendiciones','nav','caja')} y ${L('Pagos y cobros','nav','tes')} (libro banco).`]],
   destrabar:'Volver a contar con el cajero hasta que el efectivo coincida con lo registrado.',
   resultado:'Rendición contabilizada con un CIP y un asiento (Debe Banco / Haber C x C); abonos en el libro banco (depósito y liquidación Transbank) y percibido +$285.000 en Ejecución presupuestaria (más $68.000 si la patente de C10 se pagó antes del arqueo).'},
  {id:'C12', grupo:'Tesorería y conciliación', tipo:'feliz', titulo:'Conciliación bancaria de agosto', conc:true,
   dato:'Banco Estado, cuenta General · 10 movimientos en el libro banco y 11 en la cartola · otras 4 cuentas corrientes ya conciliadas (ejemplo)',
   demuestra:'Cotejos automáticos, las 4 categorías de partidas, el comprobante de traspaso, la cuenta de abonos no identificados y la doble revisión (DAF y luego Control interno).',
   pasos:[['con','"Cargar cartola, certificado de saldos y libro banco", luego "Cotejar cheques", "Cotejar tarjetas" y "Comparar movimientos".'],
          ['con','En "Identificar partidas y conciliar": "Registrar comprobante de traspaso (comisiones)", "Registrar abono no identificado en cuenta transitoria" y "Generar cuadro de conciliación" (cuadra).'],
          ['daf','"Autorizar y firmar". Para mostrar el bloqueo usa antes "Devolver con observaciones": vuelve al encargado.'],
          ['rev','"Visar".'],['daf','"Archivar".']],
   resultado:'Conciliación archivada; comprobante de traspaso y abono no identificado (214.09) en el Libro diario. Habilita el cierre de agosto (C16).'},
  {id:'C16', grupo:'Cierres contables', tipo:'bloqueo', titulo:'Cierre mensual de agosto', glosa:'Cierre mensual Agosto 2026',
   dato:'CIE-… · Cierre mensual Agosto 2026 (01-08 al 31-08) en Borrador',
   demuestra:'El cierre del video: Borrador → Enviado a revisión → Cerrado, con historial, informe a la CGR y reapertura justificada. No se puede cerrar sin la conciliación del mes.',
   pasos:[['con','Elige "Conciliaciones bancarias del período" y pulsa "Adjuntar respaldo". Usa "Ver asientos" si quieres revisar el período. Marca la revisión de imputaciones y "Enviar a revisión".'],
          ['con','"Cerrar período": el sistema lo impide mientras la conciliación de la cuenta General de agosto no esté archivada.'],
          ['con','Completa el caso C12 y vuelve: "Cerrar período" ya funciona (estado Cerrado con fecha y hora).'],
          ['con','"Generar y enviar informe a la CGR". Opcional: escribe una razón y "Reabrir cierre" para mostrar la reapertura.']],
   destrabar:'Archivar la conciliación bancaria del período (C12).',
   resultado:'Agosto 2026 cerrado e informado a la CGR (SICOGEN II); el historial registra cierre y reaperturas.'},
  {id:'C17', grupo:'Cierres contables', tipo:'feliz', titulo:'Cierre anual del ejercicio 2025', glosa:'Cierre anual Ejercicio 2025',
   dato:'CIE-… · Cierre anual Ejercicio 2025 (01-01 al 31-12) en Borrador · ingresos devengados $927.800.000 · gastos $829.770.000',
   demuestra:'El cierre anual del Word: tareas previas coordinadas por DAF, cierre del período, 3 asientos de cierre en borrador, confirmación y estados financieros.',
   pasos:[['daf','Marca las 5 tareas previas (Tesorería, Presupuesto, Inventario, Rentas, Contabilidad) y "Registrar tareas previas completas".'],
          ['con','"Adjuntar respaldo", marca la revisión de imputaciones y "Enviar a revisión".'],['con','"Cerrar período".'],
          ['con','"Generar asientos de cierre": traspaso de ingresos, traspaso de gastos y resultado a patrimonio neto, en Borrador.'],
          ['daf','Revisa los asientos, marca la casilla y "Confirmar asientos de cierre".'],['daf','Marca los 4 estados financieros y "Enviar a la CGR y SUBDERE".']],
   resultado:'Ejercicio 2025 cerrado; resultado del ejercicio $98.030.000 traspasado a patrimonio neto (cuenta 311).'},
  {id:'C18', grupo:'Inventario', tipo:'feliz', titulo:'Baja de un bien con decreto', glosa:'Revisión de INV-2019-0214',
   dato:'INV-2019-0214 · Impresora multifuncional Oficina de Partes · valor $1.450.000 · depreciación acumulada $1.160.000 · valor libro $290.000',
   demuestra:'El diagrama Inventario: "¿Dar de baja?" → decreto → firma de Alcaldía → registrar y actualizar.',
   pasos:[['con','Motivo "Obsolescencia" y "Sí: dar de baja". (La rama "No: mantener y actualizar la ficha" termina el trámite sin baja.)'],['con','"Elaborar decreto".'],['alc','"Firmar".'],['con',()=>`"Registrar baja" y revisa ${L('Inventario y bajas','nav','inv')}.`]],
   resultado:'Bien De baja; asiento Debe 531.29 $290.000 + 141.99 $1.160.000 / Haber 141.06 $1.450.000.'}
];
const CTIPO={feliz:['ok','Camino feliz'],bloqueo:['warn','Con bloqueo'],ref:['acc','Referencia']};
function caseExp(c){ return c.folio ? S.exps.find(x=>x.adq&&x.adq.folio===c.folio&&x.tipo===(c.tipoExp||'oc')) : (S.exps.find(x=>x.caso===c.id&&isOpen(x)) || S.exps.find(x=>x.caso===c.id)); }
function casePill(x){ return x.caso?`<span class="pill" style="background:var(--sup-soft);color:var(--sup)">Caso ${x.caso}</span>`:''; }
function caseDone(c){ if(c.conc) return S.conc.estado==='Archivada'; if(c.rend) return !S.exps.some(x=>x.caso===c.id&&isOpen(x)); const x=caseExp(c); return !!x&&!isOpen(x); }
function caseStatus(c){
  if(c.conc){ const k=S.conc; if(k.estado==='Archivada') return '<span class="pill ok">Completado</span>'; return k.idx===0?'<span class="pill">Sin empezar</span>':`<span class="pill acc">En curso · ${esc(CST[k.stages[k.idx]].label)}</span>`; }
  const x=caseExp(c);
  if(!x) return '<span class="pill">Aún no llega desde Adquisiciones</span>';
  if(caseDone(c)) return `<span class="pill ${['Rechazado','Anulado'].includes(x.estado)?'crit':'ok'}">Completado · ${esc(x.estado)}</span>`;
  return `<span class="pill acc">${esc(STG[cur(x)].label)} · ${esc(RSHORT[STG[cur(x)].rol])}</span>`;
}
function openCase(id){
  const c=CASES.find(k=>k.id===id); if(!c) return;
  S.err=null; S.hl=null; S.fromMap=null; S.fromAdq=null;
  if(c.conc){ const k=S.conc; if(k.estado!=='Archivada') S.role=CST[k.stages[k.idx]].rol; go('conc'); return; }
  const x=caseExp(c);
  if(!x){ location.href=adqUrl(c.adqStart||'procesos-transversales/51-cruce-tres-vias',c.folio); return; }
  if(isOpen(x)) S.role=STG[cur(x)].rol;
  go('exp', x.id);
}
function vGuia(){
  const txt=t=>typeof t==='function'?t():esc(t);
  const grupos=[...new Set(CASES.map(c=>c.grupo))];
  const done=CASES.filter(caseDone).length;
  return `<div class="pagehead"><div><h1>Guía de demo</h1><p>${CASES.length} casos preparados para mostrar cada flujo de la carpeta Flujos/Atualizados. Cada uno parte detenido justo donde empieza lo que hay que mostrar. ${done} de ${CASES.length} terminados en este navegador.</p></div><button class="btn alt" data-a="reset">Reiniciar datos de demo</button></div>
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
  const html = v==='guia'?vGuia(): v==='bandeja'?vBandeja(): ['preob','oc','sinoc','ing'].includes(v)?vList(v): v==='cierres'?vCierres(): v.startsWith('new-')?vNew(v.slice(4)): v==='exp'?vExp(): v==='tes'?vTes(): v==='caja'?vCaja(): v==='conc'?vConc(): v==='pres'?vPres(): v==='diario'?vDiario(): v==='inv'?vInv(): v==='cfg'?vCfg(): v==='flujos'?vFlujos(): vSup();
  $('main').innerHTML=html;
}
const VIEWS=['guia','bandeja','flujos','preob','oc','sinoc','ing','caja','tes','conc','pres','diario','inv','cierres','cfg','sup','new-preob','new-oc','new-sinoc','new-ing','new-cierre'];
function setHash(){ const h='#'+(S.view==='exp'?'exp='+S.sel:S.view); if(location.hash!==h){ try{ history.pushState(null,'',h); }catch(e){ location.hash=h; } } }
function go(view, sel){ S.view=view; if(sel!==undefined) S.sel=sel; if(view!=='cfg'){ S.cfgHl=null; } if(view!=='diario') S.diarioFiltro=null; render(); setHash(); window.scrollTo({top:0}); save(); }
function applyHash(){
  const [k,val]=decodeURIComponent(location.hash.slice(1)).split('=');
  if(k==='exp' && S.exps.some(x=>x.id===val)){ if(S.view==='exp'&&S.sel===val) return false; S.view='exp'; S.sel=val; S.hl=null; return true; }
  if(VIEWS.includes(k) && k!==S.view){ if(!k.startsWith('new-')) S.draft=null; S.hl=null; S.fromMap=null; S.fromAdq=null; S.returnTo=null; S.view=k; return true; }
  return false;
}
function handleAdqDeepLink(){
  const q=new URLSearchParams(location.search), folio=q.get('expediente'); if(!folio) return false;
  const origen=q.get('origen')||'';
  const tipo=origen==='3.10'?'preob':'oc';
  try{ history.replaceState(null,'',location.pathname+location.hash); }catch(e){}
  const ex=S.exps.find(x=>x.tipo===tipo&&x.adq&&x.adq.folio===folio);
  S.err=null; S.hl=null; S.fromMap=null;
  if(ex){ S.fromAdq={folio, origen, existed:true}; if(isOpen(ex)) S.role=STG[cur(ex)].rol; S.view='exp'; S.sel=ex.id; }
  else { S.fromAdq=null; S.draft={adq:adqPrefill(folio), origen}; S.role='ext'; S.view='new-'+tipo; }
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
    else if(a==='cede'){ const x=S.exps.find(e=>e.id===S.sel); registrarCesion(x, $('f_ces').value); S.role='daf'; toast('Cesión registrada (caso '+x.docs.cesion.caso+'). '+(x.docs.cesion.caso==='B'?'El pago regular queda en alerta.':'Se cambiará el receptor del pago.')); render(); save(); }
    else if(a==='reabrir'){ const x=S.exps.find(e=>e.id===S.sel); try{ const m=reabrir(x, $('f_razon')?.value); S.err=null; toast(m); }catch(err){ S.err={id:x.id, msg:err.message}; } render(); save(); }
    else if(a==='gocfg'){ S.cfgHl=v; S.returnTo=S.sel; S.role='adm'; S.view='cfg'; render(); save(); }
    else if(a==='cact'){ toast(runConc(Number(v))); render(); save(); }
    else if(a==='dtab'){ S.diarioTab=v; render(); }
    else if(a==='dfiltro'){ S.diarioFiltro=null; render(); save(); }
    else if(a==='verasientos'){ const x=S.exps.find(e=>e.id===v); S.view='diario'; S.diarioTab='Todos'; S.diarioFiltro={desde:x.desde, hasta:x.hasta, label:x.periodo, ref:x.id}; go('diario'); }
    else if(a==='baja'){ const x=nuevaBaja(v); S.role='con'; S.err=null; go('exp', x.id); }
    else if(a==='newcontrib'){ toast(crearContribuyente()); render(); }
    else if(a==='create'){ const x=createFromForm(v); const m=S.createdMsg; S.createdMsg=null; toast(m||(x.id+' creado.')); go('exp', x.id); }
    else if(a==='additem'){ syncItems(); S.draft.items.push({c:S.conceptos[1].n, monto:25000}); render(); }
    else if(a==='delitem'){ syncItems(); S.draft.items.splice(Number(v),1); render(); }
    else if(a==='reset'){ seed(); S.view='guia'; render(); setHash(); save(); window.scrollTo({top:0}); toast('Datos de demo restablecidos: todos los casos vuelven a su punto de partida.'); }
    else if(a==='case'){ openCase(v); }
  }catch(err){ toast(err.message); }
});
document.addEventListener('change', e=>{
  const t=e.target;
  if(t.id==='roleSel'){ S.role=t.value; render(); save(); return; }
  if(t.dataset.item!=null && S.view==='new-ing'){ syncItems(); render(); return; }
  if(t.dataset.cfg==='auto'){ S.cfg.autoCID=t.checked; toast(t.checked?'Generación automática activada.':'Las órdenes confirmadas pasarán a revisión manual.'); save(); return; }
  if(t.dataset.cfg==='utm'){ const n=Number(t.value); if(n>0){ S.utm=n; toast('Valor UTM de ejemplo actualizado.'); save(); } return; }
  if(t.dataset.cfg){ const c=S.cuentas[Number(t.dataset.i)]; c[t.dataset.cfg]=t.value; if(S.cfgHl===c.cod && c.dev){ toast('Configuración guardada. Vuelve al expediente para que Adquisiciones reintente.'); } save(); }
});

/* Arranque: lo llama index.html con window.contaBoot({expedientes, presets, siteUrl}) después de initAppShell */
