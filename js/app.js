const CAT={
 np_c:{g:'News',type:'Color',unit:'per issue',items:[['Full Page',450,''],['Half Page',250,''],['Quarter Page',150,''],['Business Card',75,'']]},
 np_bw:{g:'News',type:'Black & White',unit:'per issue',items:[['Full Page',350,''],['Half Page',200,''],['Quarter Page',100,'']]},
 tv:{g:'TV',unit:'each',items:[['30 Seconds',250,'20 repetitions per day'],['60 Seconds',500,'20 repetitions per day'],['90 Seconds',700,'20 repetitions per day'],['Pop-up (24 hours)',300,'']]},
 dg:{g:'Digital',unit:'each',items:[['Deshbani & DTV Facebook & Instagram Photocard Ad',250,''],['Website & E-Paper Ad',150,'']]}
};
const TIERS=[[40,'Newspaper + Broadcast + Digital Media'],[20,'Broadcast + Digital Media'],[10,'Newspaper + Digital Media'],[10,'Newspaper + Broadcast']];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const $=id=>document.getElementById(id);
const fmt=n=>'$'+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FIELDS=['biz','contact','tel','email','addr','city','notes'];
const QLABEL={News:'Ads per issue',TV:'Quantity',Digital:'Quantity'};

const DISP={dg_0:'Deshbani & DTV Facebook & Instagram Photocard Advertisements',dg_1:'Website & E-Paper Advertisements',tv_3:'Pop-ups'};
const p0=n=>'$'+n.toLocaleString('en-US');
for(const [k,c] of Object.entries(CAT)){
 $(k).innerHTML=c.items.map((it,i)=>{
  const nm=DISP[k+'_'+i]||it[0];
  const pre=(k==='tv'&&i===3)?'<div style="height:12px"></div>':'';
  const note=(k==='tv'&&i===2)?'<div class="note">(Repetitions 20 times per day)</div>':((k==='tv'&&i===3)?'<div class="note">(24 hours)</div>':'');
  return pre+`<label class="ro"><input type="checkbox" id="${k}_${i}"><span class="rt">${esc(nm)}: <b>${p0(it[1])}</b></span><span class="q">${QLABEL[c.g]}<input type="number" id="${k}_${i}_q" min="1" max="99" value="1"><span class="lt" id="${k}_${i}_t"></span></span></label>`+note;
 }).join('');
}
$('months').innerHTML=MONTHS.map((m,i)=>`<label class="opt"><input type="checkbox" class="mo" value="${i}"><span class="nm">${m}</span></label>`).join('');
$('tiers').innerHTML='<b>Package discounts</b>'+TIERS.map((t,i)=>`<div id="tier${i}"><span>${t[1]}</span><span>${t[0]}% off</span></div>`).join('');

function state(){
 const s={};FIELDS.forEach(f=>s[f]=$(f).value.trim());
 s.ct=document.querySelector('[name=ct]:checked').value;
 s.months=[...document.querySelectorAll('.mo')].filter(x=>x.checked).map(x=>+x.value);
 s.sel={};
 for(const [k,c] of Object.entries(CAT))c.items.forEach((_,i)=>{s.sel[k+'_'+i]={on:$(k+'_'+i).checked,q:Math.max(1,Math.min(99,Math.floor(+$(k+'_'+i+'_q').value)||1))}});
 return s;
}
function save(){try{sessionStorage.setItem('deshbani_order2',JSON.stringify(state()))}catch(e){}}
function restore(){
 try{const s=JSON.parse(sessionStorage.getItem('deshbani_order2')||'null');if(!s)return;
  FIELDS.forEach(f=>{if(s[f]!==undefined)$(f).value=s[f]});
  const a=document.querySelector(`[name=ct][value="${s.ct}"]`);if(a)a.checked=true;
  document.querySelectorAll('.mo').forEach(x=>x.checked=(s.months||[]).includes(+x.value));
  for(const k in (s.sel||{})){if($(k)){$(k).checked=s.sel[k].on;$(k+'_q').value=s.sel[k].q}}
 }catch(e){}
}

function build(s){
 const issues=s.ct==='every'?12:s.months.length;
 const lines=[];let hasN=false,hasT=false,hasD=false;
 for(const [k,c] of Object.entries(CAT))c.items.forEach((it,i)=>{
  const v=s.sel[k+'_'+i];if(!v.on)return;
  let l;
  if(c.g==='News'){hasN=true;l={id:k+'_'+i,d:`Newspaper – ${c.type} – ${it[0]}`,sub:`${issues} issue(s) × ${v.q} ad(s) × ${fmt(it[1])}`,amt:it[1]*v.q*issues}}
  else if(c.g==='TV'){hasT=true;l={id:k+'_'+i,d:`DTV – ${it[0]}`,sub:`${v.q} × ${fmt(it[1])}`,amt:it[1]*v.q}}
  else{hasD=true;l={id:k+'_'+i,d:`Digital – ${it[0]}`,sub:`${v.q} × ${fmt(it[1])}`,amt:it[1]*v.q}}
  lines.push(l);
 });
 const subtotal=lines.reduce((a,l)=>a+l.amt,0);
 let tier=-1;
 if(hasN&&hasT&&hasD)tier=0;else if(hasT&&hasD)tier=1;else if(hasN&&hasD)tier=2;else if(hasN&&hasT)tier=3;
 const pct=tier>=0?TIERS[tier][0]:0,label=tier>=0?TIERS[tier][1]:'';
 const discount=subtotal*pct/100;
 return {lines,subtotal,pct,label,tier,discount,total:subtotal-discount,issues,hasN};
}
function runText(s){return s.ct==='every'?'Every issue (12 issues total)':s.months.map(i=>MONTHS[i]).join(', ')}
function ref(){try{let r=sessionStorage.getItem('deshbani_ref');if(!r){const d=new Date();r='ORD-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+(Math.floor(Math.random()*900)+100);sessionStorage.setItem('deshbani_ref',r)}return r}catch(e){return 'ORD-'+Date.now().toString().slice(-6)}}
function today(){return new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}

function render(){
 document.querySelectorAll('.opt,.ro').forEach(o=>{const i=o.querySelector('input');if(i)o.classList.toggle('sel',i.checked)});
 $('months').classList.toggle('hide',document.querySelector('[name=ct]:checked').value!=='specific');
 const s=state(),b=build(s);
 for(const [k,c] of Object.entries(CAT))c.items.forEach((_,i)=>{$(k+'_'+i+'_t').textContent=''});
 for(const l of b.lines){const t=$(l.id+'_t');if(t)t.textContent=fmt(l.amt)}
 $('lines').innerHTML=b.lines.length?b.lines.map(l=>`<div class="sl"><span class="d">${esc(l.d)}<small>${esc(l.sub)}</small></span><span class="a">${fmt(l.amt)}</span></div>`).join(''):'<div class="empty">Tick an ad to see your price.</div>';
 $('tots').innerHTML=b.lines.length?`<div class="row" style="margin-top:6px"><span>Subtotal</span><span>${fmt(b.subtotal)}</span></div>
 ${b.pct?`<div class="row disc"><span>Package discount ${b.pct}%<small>${esc(b.label)}</small></span><span>−${fmt(b.discount)}</span></div>`:''}
 <div class="row tot"><span>Total</span><span>${fmt(b.total)}</span></div>
 ${b.pct?`<div class="save">You save ${fmt(b.discount)}!</div>`:''}`:'';
 TIERS.forEach((_,i)=>$('tier'+i).classList.toggle('on',i===b.tier));
 $('mt').textContent=fmt(b.total);
 save();
 return {s,b};
}
document.addEventListener('input',render);document.addEventListener('change',render);

function validate(s){
 let n=0;for(const k in s.sel)if(s.sel[k].on)n++;
 const m=[];
 if(!s.biz)m.push('your business name');
 if(!s.contact)m.push('your contact name');
 if(!s.tel&&!s.email)m.push('a phone number or e-mail');
 if(!n)m.push('at least one ad');
 if(s.ct==='specific'&&!s.months.length)m.push('at least one newspaper month');
 return m;
}
function check(){
 const {s,b}=render(),m=validate(s),e=$('err');
 if(m.length){e.style.display='block';e.textContent='Please add: '+m.join(', ')+'.';return null}
 e.style.display='none';return {s,b};
}
function orderText(s,b){
 const L=['Advertising order – '+ref(),today(),'',
  'Business: '+s.biz,'Contact: '+s.contact,s.tel&&'Phone: '+s.tel,s.email&&'E-mail: '+s.email,(s.addr||s.city)&&'Address: '+[s.addr,s.city].filter(Boolean).join(', '),'',
  b.hasN?'Newspaper run: '+runText(s):null,'',
  ...b.lines.map(l=>'- '+l.d+' ('+l.sub+') = '+fmt(l.amt)),'',
  'Subtotal: '+fmt(b.subtotal),b.pct?'Package discount '+b.pct+'% ('+b.label+'): -'+fmt(b.discount):null,'TOTAL: '+fmt(b.total),
  s.notes?'':null,s.notes?'Notes: '+s.notes:null];
 return L.filter(x=>x!==null&&x!==false&&x!==undefined).join('\n');
}
function toast(t){const x=$('toast');x.textContent=t;x.style.display='block';setTimeout(()=>x.style.display='none',2200)}

$('mail').onclick=()=>{const r=check();if(!r)return;location.href='mailto:deshbani21@gmail.com?subject='+encodeURIComponent('Advertising order '+ref()+' – '+r.s.biz)+'&body='+encodeURIComponent(orderText(r.s,r.b))};
$('copy').onclick=()=>{const r=check();if(!r)return;const t=orderText(r.s,r.b);
 (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Order copied')).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Order copied')}catch(e){toast('Copy not available')}a.remove()})};
$('see').onclick=()=>$('sum').scrollIntoView({behavior:'smooth'});

restore();render();
