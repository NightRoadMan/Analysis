(function(){
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const items={}; DATA.items.forEach(i=>items[i.id]=i);
const cats={}; DATA.cats.forEach(c=>cats[c.id]=c);
const nb=' ';
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,nb)+nb+'₽';
const r10=n=>Math.round(n/10)*10;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ic=(k,w,h)=>`<span class="ic" style="width:${w}px;height:${h||w}px">${IC[k]}</span>`;
const plural=(n,a,b,c)=>{const m10=n%10,m100=n%100;return m10==1&&m100!=11?a:(m10>=2&&m10<=4&&(m100<10||m100>=20)?b:c)};
const anW=n=>`${n}${nb}${plural(n,'анализ','анализа','анализов')}`;
const maxPrice=i=>r10(i.price*2.4);
const clinicWord=n=>`В ${n} ${plural(n,'клинике','клиниках','клиниках')}`;
const isBlood=i=>/кров/i.test(i.bio);
function hash(str){let h=2166136261;for(let k=0;k<str.length;k++){h^=str.charCodeAt(k);h=Math.imul(h,16777619)>>>0}return h}
const rnd=(str)=>hash(str)/4294967296;
const SV={
  chevR:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m10 7 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevD:'<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4.5 6.5h7L8 10Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
  chevUp:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m5 12.5 5-5 5 5" stroke="#F3AA00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  grabDown:'<svg width="48" height="20" viewBox="0 0 48 20"><path d="M15 8l9 4 9-4" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tick:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m3 7.2 2.6 2.6L11 4.4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4M6.6 6.5v4.5M9.4 6.5v4.5"/></svg>',
  info:'<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1.5 14.5 13H1.5Z" fill="currentColor"/><path d="M8 6v3.2" stroke="var(--info-bg)" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11.1" r=".9" fill="var(--info-bg)"/></svg>',
  alert:'<svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0;margin-top:1px"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="M8 4.5v4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11.2" r="1" fill="#FFF"/></svg>',
  infoC:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2v3.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="5" r=".9" fill="currentColor"/></svg>',
  clinic:'<svg viewBox="0 0 16 16" fill="none" stroke="#F3AA00" stroke-width="1.5" stroke-linejoin="round"><rect x="2.5" y="2" width="11" height="12.5" rx="2"/><path d="M8 5v4M6 7h4M6.5 14.5v-2.5h3v2.5"/></svg>',
  pin:'<svg viewBox="0 0 16 16" fill="none" stroke="#F3AA00" stroke-width="1.5"><path d="M8 14.5s4.75-4.2 4.75-8A4.75 4.75 0 0 0 3.25 6.5c0 3.8 4.75 8 4.75 8Z"/><circle cx="8" cy="6.5" r="1.75"/></svg>',
  coin:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.25" stroke="#F3AA00" stroke-width="1.5"/><path d="M6 10.5v-5l3 5v-5" stroke="#F3AA00" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(.5 0)"/></svg>',
  coinY:'<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#FFC63D"/><circle cx="12" cy="12" r="8" fill="#F3AA00"/><path d="M9.2 16.2V7.8h1.7v3.4h2.2V7.8h1.7v8.4h-1.7v-3.4h-2.2v3.4Z" fill="#FFF3C4"/></svg>',
  search:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m12 12 4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  metro:c=>`<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="${c}"/><path d="M3.8 11.2 5.6 4.8 8 9l2.4-4.2 1.8 6.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  street:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 1.5 3 14.5M11 1.5l2 13M8 2.5v2M8 7v2M8 11.5v2"/></svg>',
  place:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5s4.75-4.2 4.75-8A4.75 4.75 0 0 0 3.25 6.5c0 3.8 4.75 8 4.75 8Z"/><circle cx="8" cy="6.5" r="1.75"/></svg>',
  lab:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M6 1.5h4M6.5 1.5v4.2L2.8 12.6A1.3 1.3 0 0 0 4 14.5h8a1.3 1.3 0 0 0 1.2-1.9L9.5 5.7V1.5"/></svg>',
  star:'<svg width="14" height="14" viewBox="0 0 14 14"><path d="m7 1.2 1.8 3.7 4 .6-2.9 2.8.7 4L7 10.4l-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#F3AA00"/></svg>',
  clock:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4.3l2.8 1.7" stroke-linecap="round"/></svg>',
  cal:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="4" width="14" height="13" rx="2.5"/><path d="M3 8h14M7 2.5v3M13 2.5v3"/></svg>',
  pinO:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 18s6-5.3 6-10.2A6 6 0 0 0 4 7.8C4 12.7 10 18 10 18Z"/><circle cx="10" cy="8" r="2.2"/></svg>',
  pill:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.2" y="7" width="15.6" height="6.4" rx="3.2" transform="rotate(-45 10 10.2)"/><path d="m7.4 7.6 5 5"/></svg>',
  tube:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 2.5h6M8 2.5v11a2 2 0 0 0 4 0v-11M8 9h4"/></svg>',
  calX:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="4" width="14" height="13" rx="2.5"/><path d="M3 8h14M7 2.5v3M13 2.5v3M8 11l4 3.5M12 11l-4 3.5"/></svg>',
  glass:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4.5 3h11l-1.4 13.2a1.5 1.5 0 0 1-1.5 1.3H7.4a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M5.3 9h9.4"/></svg>',
  fork:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 2.5v5a2 2 0 0 0 4 0v-5M8 2.5v15M14 17.5V2.5c-1.7.8-2.5 3-2.5 5.5V11H14M3 3l14 14"/></svg>',
  infoP:'<svg class="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v4.5" stroke-linecap="round"/><circle cx="10" cy="6.4" r=".6" fill="currentColor"/></svg>',
  flask:c=>`<span class="ic" style="width:16px;height:16px;color:${c}">${IC.flask.replace(/fill="#[0-9A-Fa-f]{3,8}"/g,'fill="currentColor"')}</span>`,
};
const hi=()=>`<div class="hi">${IC.homeind}</div>`;

/* ---------- theme ---------- */
const root=document.documentElement;
function curTheme(){return root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function syncSeg(){const t=curTheme();$$('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeSet===t)))}
$$('[data-theme-set]').forEach(b=>b.addEventListener('click',()=>{root.dataset.theme=b.dataset.themeSet;try{localStorage.setItem('vitrina-theme',b.dataset.themeSet)}catch(e){}syncSeg()}));
syncSeg();

/* ---------- state ---------- */
const cart=new Map(); // id -> {on:bool}
let LAB=null;          // выбранная лаборатория
let PATIENT=0;
const PATIENTS=[
  {n:'Смирнова Ксения Алексеевна',d:'06.08.1989 (37 лет)',img:ASSET.woman},
  {n:'Смирнов Дмитрий Андреевич',d:'14.03.1987 (39 лет)',img:ASSET.man},
  {n:'Смирнов Миша Дмитриевич',d:'21.05.2017 (9 лет)',img:ASSET.child},
];
const BALANCE=2190;
let PAY={method:'card',consent:true,usePts:true,brkOpen:false};

/* ---------- navigation ---------- */
const stack=[]; let cur=null;
const VITRINA=new Set(['s-cat','s-detail']); // экраны, где плавает мини-корзина
function show(id){
  $$('.scr').forEach(s=>s.hidden=s.id!==id);
  $('#tabbar').hidden=id!=='s-home';
  updateFooters(id);
}
function render(view){
  if(view.s==='home') show('s-home');
  else if(view.s==='gs'){renderGS(view.q||'');show('s-gs');}
  else if(view.s==='cat'){renderCat();show('s-cat');}
  else if(view.s==='detail'){renderDetail(view.id);show('s-detail');}
  else if(view.s==='cart'){renderCart();show('s-cart');}
  else if(view.s==='map'){show('s-map');renderMap(true);}
  else if(view.s==='co'){renderCO();show('s-co');}
  else if(view.s==='ok'){renderOK(view);show('s-ok');}
  else if(view.s==='fail'){show('s-fail');}
}
function go(view,push=true){
  if(push&&cur){cur.scroll=(document.querySelector('.scr:not([hidden])')||{}).scrollTop||0;stack.push(cur);}
  cur=view; closeSheet(); render(view);
  const el=document.querySelector('.scr:not([hidden])'); if(el) el.scrollTop=view.scroll&&!push?view.scroll:0;
}
function back(){
  const v=stack.pop(); if(!v){go({s:'home'},false);return}
  cur=v; closeSheet(); render(v); const el=document.querySelector('.scr:not([hidden])'); if(el) el.scrollTop=v.scroll||0;
}
function resetTo(view){stack.length=0;cur=null;go(view,false)}
function curScr(){const e=document.querySelector('.scr:not([hidden])');return e?e.id:''}

/* ---------- cart core ---------- */
const inCart=id=>cart.has(id);
function addCart(id){if(!cart.has(id)){cart.set(id,{on:true});if(LAB&&!labHas(LAB,id))cart.get(id).on=false}}
function delCart(id){cart.delete(id)}
function toggleCart(id){inCart(id)?delCart(id):addCart(id)}
function refresh(){
  $$('[data-cart]').forEach(b=>{b.outerHTML=btnHTML(b.dataset.cart,b.dataset.up)});
  if(cur&&cur.s==='detail') setDetailAdd(cur.id);
  updateFooters(curScr());
}
function btnHTML(id,up){
  const u=up?` data-up="1"`:'';
  return inCart(id)
    ? `<button class="btn in" data-cart="${id}"${u}>${ic('check',16)}В корзине</button>`
    : `<button class="btn" data-cart="${id}"${u}>${ic('basketW',24)}Добавить в корзину</button>`;
}
function updateFooters(id){
  const n=cart.size;
  $('#f-cart').hidden=!(n>0&&id==='s-cat'&&$('#dim').hidden);
  $('#f-cart-n').textContent=anW(n);
  $('#f-detail').hidden=id!=='s-detail';
  const c=$('#d-cnt'); c.hidden=!n; c.textContent=n;
  $('#f-page').hidden=!['s-cart','s-co','s-ok','s-fail'].includes(id);
  if(!$('#f-page').hidden) renderPageFooter(id);
}

/* ---------- analysis card (catalog) ---------- */
function tagsHTML(i){
  let t=`<span class="tag">${ic('flask',16)}<span>${esc(i.bio)}</span></span>`;
  if(i.days) t+=`<span class="tag ck">${ic('clock',16)}<span>${esc(i.days)}</span></span>`;
  if(i.fast) t+=`<span class="tag" style="padding-inline:6px"><span>Натощак</span></span>`;
  return t;
}
const priceHTML=(i,lg)=>`<div class="prs"><span class="pr"><i>от</i><b>${fmt(i.price)}</b></span><span class="pr"><i>до</i><b>${fmt(maxPrice(i))}</b></span></div>`;
function cardHTML(i){
  return `<article class="card tap" data-open="${i.id}">
    <div class="ctop"><div class="cn">${esc(i.name)}</div><div class="cc">${clinicWord(i.clinics)}</div><div class="tags">${tagsHTML(i)}</div></div>
    ${priceHTML(i)}
    ${btnHTML(i.id,1)}
  </article>`;
}
function miniAddRow(i){ // «Вместе с этим сдают», «Часто добавляют», «Популярные»
  return `<div class="mrow2"><div class="n tap" data-open="${i.id}">${esc(i.name)}</div>${i.price?priceHTML(i):''}${btnHTML(i.id)}</div>`;
}

/* ---------- search ---------- */
const norm=s=>s.toLowerCase().replace(/ё/g,'е');
const STOP=new Set(['анализ','анализы','анализа','на','и','в','с','для','сдать','крови?']);
function search(q,pool){
  const toks=norm(q).split(/[^a-zа-я0-9]+/i).filter(t=>t&&!STOP.has(t)&&t.length>1);
  if(!toks.length) return [];
  const seen=new Set(),res=[];
  (pool||DATA.items).forEach(i=>{
    const key=norm(i.name); if(seen.has(key)) return;
    const hay=norm(i.name+' '+i.bio+' '+cats[i.cat].title+' '+i.desc);
    const ok=toks.every(t=>hay.includes(t.length>=5?t.slice(0,Math.max(4,t.length-2)):t));
    if(ok){seen.add(key);res.push(i);}
  });
  const nm=toks[0];
  res.sort((a,b)=>(norm(b.name).includes(nm)?1:0)-(norm(a.name).includes(nm)?1:0));
  return res;
}
const byName=n=>DATA.items.find(i=>i.name===n);

/* ---------- general search («Запись и анализы») ---------- */
function gsRow(i){ // без корзины: только переход на детальку
  return `<button class="row" data-open="${i.id}"><span class="l"><span>${esc(i.name)}</span><span class="p">от ${fmt(i.price)} до ${fmt(maxPrice(i))}</span></span><span style="color:var(--light)">${SV.chevR}</span></button>`;
}
function renderGS(q){
  const inp=$('#q'); if(inp.value!==q) inp.value=q; $('#q-wrap').classList.toggle('has',!!q);
  const body=$('#gs-body');
  if(q.trim()){
    const res=search(q);
    body.innerHTML=`<div class="secs"><div class="sec pb0"><div class="sh">Анализы <em>${res.length}</em></div><div class="rows">${
      res.length?res.slice(0,40).map(gsRow).join(''):
      `<div class="empty"><b>Ничего не нашли</b><span>Проверьте написание или откройте каталог анализов.</span><button class="more" style="align-self:center" data-act="allan">Все анализы</button></div>`
    }</div></div></div>`;
    return;
  }
  const catRow=c=>`<button class="row" data-cat="${c.id}"><span>${c.title}</span><span style="color:var(--light)">${SV.chevR}</span></button>`;
  const first=DATA.cats.slice(0,5), rest=DATA.cats.slice(5);
  const glu=byName('Глюкоза'), alt=byName('АлАТ (АЛТ, Аланинаминотрансфераза)')||DATA.items[21], hom=DATA.items.find(i=>/Гомоцистеин/.test(i.name));
  const soon=t=>`<button class="row" data-act="soon"><span>${t}</span><span style="color:var(--light)">${SV.chevR}</span></button>`;
  body.innerHTML=`<div class="secs">
   <div class="sec pb0"><div class="sh">История поиска</div><div class="rows">
     <button class="row" data-cat="vitamins"><span>Витамины</span><span style="color:var(--light)">${SV.chevR}</span></button>
     <button class="row" data-cat="biochemistry"><span>Биохимия</span><span style="color:var(--light)">${SV.chevR}</span></button>
     ${hom?gsRow(hom):''}
     <button class="row" data-q="ПЦР"><span>ПЦР-тест на коронавирус</span><span style="color:var(--light)">${SV.chevR}</span></button>
   </div></div>
   <div class="sec pb0"><div class="sh">История просмотра</div><div class="rows">
     ${glu?gsRow(glu):''}${alt?gsRow(alt):''}
     <div data-act="soon" class="tap">${PEOPLE[0]}</div><div data-act="soon" class="tap">${PEOPLE[1]}</div><div data-act="soon" class="tap">${PEOPLE[2]}</div>
   </div></div>
   <div class="sec pb0"><div class="sh">Анализы на НаПоправку</div><div class="rows" id="cat-rows">${first.map(catRow).join('')}</div>
     <button class="more" data-act="morecats">${SV.chevD}Ещё ${rest.length} ${plural(rest.length,'категория','категории','категорий')}</button></div>
   <div class="sec pb0"><div class="sh">Может быть полезно</div><div class="rows">${soon('УЗИ брюшной полости')}${soon('Консультация кардиолога')}${soon('МРТ головного мозга')}</div></div>
   <div class="sec pb0"><div class="sh">Популярные</div><div class="rows">${soon('Осмотр офтальмолога')}${soon('ЭКГ сердца')}${soon('Рентген грудной клетки')}${soon('Консультация дерматолога')}${soon('Биохимический анализ крови')}</div></div>
  </div>`;
}

/* ---------- catalog ---------- */
function renderCat(){
  const v=cur, cid=v.c||'all', q=v.q||'';
  $('#cat-title').textContent=cid==='all'?'Анализы':cats[cid].title;
  const chip=(id,t,n)=>`<button class="chip${id===cid?' on':''}" data-chip="${id}">${t}<i>${n}</i></button>`;
  const qq=q.trim(), cnt=pool=>qq?search(qq,pool).length:pool.length;
  $('#chips').innerHTML=chip('all','Все',cnt(DATA.items))+DATA.cats.map(x=>chip(x.id,x.title,cnt(x.items.map(id=>items[id])))).join('');
  const cq=$('#cq'); if(cq.value!==q) cq.value=q; $('#cq-wrap').classList.toggle('has',!!q);
  requestAnimationFrame(()=>{const on=$('#chips .on'); if(on) on.scrollIntoView({inline:'center',block:'nearest'})});
  let list=cid==='all'?DATA.items.slice():cats[cid].items.map(id=>items[id]);
  if(cid==='all'&&!q.trim()){ // «Все»: сначала популярные (по числу клиник)
    list.sort((a,b)=>b.clinics-a.clinics);
  }
  if(q.trim()) list=search(q,list);
  $('#cat-body').innerHTML=`<div class="found">${q.trim()?'Найдено':'Всего'} ${anW(list.length)}</div><div class="list">${
    list.length?list.map(cardHTML).join(''):`<div class="card"><div class="empty"><b>Ничего не нашли</b><span>${cid==='all'?'Проверьте написание.':'В этой категории нет такого анализа.'}</span>${cid!=='all'?'<button class="more" style="align-self:center" data-chip="all">Искать во всех анализах</button>':''}</div></div>`
  }</div>`;
}

/* ---------- upsell sheet ---------- */
function related(ids,n){
  const have=new Set([...cart.keys(),...ids]); const out=[];
  ids.forEach(id=>{const c=cats[items[id].cat]; c.items.forEach(x=>{if(!have.has(x)&&out.length<n*3){out.push(items[x]);have.add(x)}})});
  const fill=['Ферритин','Гомоцистеин','Группа крови и резус-фактор'];
  out.sort((a,b)=>rnd(a.id+ids.join())-rnd(b.id+ids.join()));
  return out.slice(0,n);
}
function openUpsell(id){
  const i=items[id];
  openSheet(`<div class="sbody">
    <div class="csec" style="border-radius:0 0 24px 24px;padding-top:0">
      <div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div>
      <div class="okh">${ic('okc',24)}Добавили в корзину</div>
      <div class="ctop"><div class="cn">${esc(i.name)}</div><div class="cc">${clinicWord(i.clinics)}</div></div>
      ${priceHTML(i)}
    </div>
    <div class="csec"><div class="sh" style="font-size:22px;line-height:28px">Вместе с этим сдают</div><div>${related([id],3).map(miniAddRow).join('')}</div></div>
  </div>
  <div class="sfoot"><button class="big in wide" data-act="close">Продолжить покупки</button><button class="gocart" data-act="cart" id="up-go"><span class="t"><b>Перейти в корзину</b><span>${anW(cart.size)}</span></span>${CHEVW}</button>${hi()}</div>`);
}

/* ---------- detail ---------- */
const CLINIC_BASE=3750;
function setDetailAdd(id){
  const i=items[id], b=$('#d-add'), inC=inCart(id), n=cart.size;
  b.innerHTML=`<b>Добавить в корзину</b><span>от ${fmt(i.price)}</span>`;
  $('#d-row').hidden=inC; $('#d-inc').hidden=!inC;
  $('#d-inc-n').textContent=anW(n);
  const t=$('#d-top-add'); if(t){t.className='big'+(inC?' in':''); t.dataset.act=inC?'cart':'dadd'; t.innerHTML=inC?`${ic('check',24)}В корзине`:'Добавить в корзину';}
}
function renderDetail(id){
  const i=items[id], c=cats[i.cat];
  $('#d-title').textContent=i.name;
  const blood=isBlood(i);
  const others=c.items.filter(x=>x!==id).map(x=>items[x]);
  const pair=others[0];
  const note=i.note||(pair?`Часто сдают вместе с анализом «${pair.name}».`:'');
  const fac=i.price/CLINIC_BASE;
  const sym=i.symptoms||[], con=i.conditions||[], ctl=i.control||[];
  $('#d-body').innerHTML=`
  <div class="dtop">
    <div style="display:flex;flex-direction:column;gap:24px">
      <div style="display:flex;flex-direction:column;gap:8px">
        <span class="tag ck dtag">${ic('clock',16)}<span>Срок выполнения ${esc(i.days)}</span></span>
        <div class="dn">${esc(i.name)}</div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${priceHTML(i)}
          ${blood?`<div class="fee"><span class="l">Забор крови</span><span class="d"></span><i>от</i><b>${fmt(350)}</b></div>`:''}
        </div>
      </div>
      <div class="kv"><div><div class="k">Метод исследования</div><div class="v">${esc(i.method)}</div></div><div class="sep"></div><div><div class="k">Биоматериал</div><div class="v">${esc(i.biomat||i.bio)}</div></div></div>
    </div>
    <button class="big" id="d-top-add" data-act="dadd"></button>
  </div>
  <div class="dmid">
    <div class="a">
      <div style="display:flex;flex-direction:column;gap:8px"><div class="desc" id="d-desc">${esc(i.desc)}</div><button class="showall" data-act="showall"><span>Показать полностью</span>${ic('chevS',16)}</button></div>
      <div data-act="map" class="tap" id="d-map">${MAP}</div>
    </div>
  </div>
  <div class="dchips" id="d-chips"><div class="in">
    <button class="chip on" data-jump="b-prep">Подготовка</button><button class="chip" data-jump="b-ind">Показания и противопоказания</button><button class="chip" data-jump="b-where">Где сдать</button>
  </div></div>
  <section class="blk" id="b-prep"><div class="bh">Подготовка</div>
    <div class="prep"><div class="top"><b>${esc(i.prep.title)}</b>${i.prep.sub?`<span>${esc(i.prep.sub)}</span>`:''}</div>
    ${i.prep.list.length?`<ul>${i.prep.list.map(x=>`<li>${ic('tick',16)}<span>${esc(x)}</span></li>`).join('')}</ul>`:''}</div>
  </section>
  <section class="blk" id="b-ind"><div class="bh">Показания к сдаче анализа</div>
    <div class="ind">
      ${sym.length?`<div class="g"><div class="gh">Если вы замечаете</div><div class="pills">${sym.map(s=>`<span class="pill">${esc(s)}</span>`).join('')}</div></div>`:''}
      ${con.length?`<div class="g"><div class="gh">Если у вас есть или врач подозревает</div><ul class="bul">${con.map(s=>`<li>${ic('dot',12)}<span>${esc(s)}</span></li>`).join('')}</ul></div>`:''}
      ${ctl.length?`<div class="g"><div class="gh">Для контроля</div><ul class="bul">${ctl.map(s=>`<li>${ic('dot',12)}<span>${esc(s)}</span></li>`).join('')}</ul></div>`:''}
      <div class="contra"><div class="h">${ic('okc',24)}Противопоказаний нет</div>${note?`<div class="sep"></div><p>${esc(note)}</p>`:''}</div>
    </div>
  </section>
  <div id="b-where" style="scroll-margin-top:calc(var(--smt,230px) - 8px)">${WHERE}</div>
  <p class="src">${i.src==='generic'?'Описание и подготовка: каталог СберЗдоровья и типовые правила для этого биоматериала.':'Описание, подготовка и показания: каталог СберЗдоровья.'} Цены и клиники — демонстрационные.</p>`;
  $$('#b-where .cp').forEach(el=>{el.textContent=fmt(r10(+el.dataset.base*fac))});
  $$('#d-map .pp').forEach(el=>{el.textContent=el.dataset.pre+fmt(r10(+el.dataset.base*fac))});
  $$('#b-where [data-clinic-add]').forEach(b=>b.dataset.cartId=id);
  setDetailAdd(id); window.__detailSticky&&window.__detailSticky();
  const desc=$('#d-desc'); requestAnimationFrame(()=>{ if(desc.scrollHeight<=desc.clientHeight+2) desc.nextElementSibling.hidden=true; });
}

/* ---------- labs (map + cart) ---------- */
const BRANDS=[{k:'inv',n:'Invitro',f:1.08},{k:'kdl',n:'KDL',f:.98},{k:'gem',n:'Гемотест',f:.94},{k:'rem',n:'Рэмси Диагностика',f:1.02}];
const MW=1500,MH=1700,MC=[750,850];
function nearestMetro(x,y){return PLACES.filter(p=>p.t==='metro').map(m=>({m,d:Math.hypot(m.x-x,m.y-y)*1.6})).sort((a,b)=>a.d-b.d)[0]}
const distTxt=d=>d<1000?`${Math.max(100,Math.round(d/50)*50)} м`:`${(d/1000).toFixed(1).replace('.',',')} км`;
const LABS=(function(){
  const r=(()=>{let s=20261119;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}})();
  const pts=[MC.slice()]; let g=0;
  while(pts.length<44&&g++<8000){const x=70+r()*(MW-140),y=150+r()*(MH-220); if(pts.every(p=>Math.abs(p[0]-x)>110||Math.abs(p[1]-y)>70)) pts.push([Math.round(x),Math.round(y)]);}
  const streets=STREETPTS;
  return pts.map(([x,y],idx)=>{
    const br=idx===0?BRANDS[0]:BRANDS[Math.floor(r()*BRANDS.length)];
    const st=streets.map(s=>({s,d:Math.hypot(s.x-x,s.y-y)})).sort((a,b)=>a.d-b.d)[Math.floor(r()*2)].s;
    const me=nearestMetro(x,y);
    return {id:'lab'+idx,x,y,brand:br,n:`${br.n} на ${st.loc}`,a:`г. Санкт-Петербург, ${st.full}, д. ${1+Math.floor(r()*120)}`,
      metro:me.m.n,mc:me.m.c,md:distTxt(me.d),rate:(4+r()*0.9).toFixed(1).replace('.',','),rev:8+Math.floor(r()*140),
      cov:idx===0?1:(r()<.45?1:.55+r()*.4), f:br.f*(.86+r()*.32), pts:r()<.65, hours:r()<.5?['7:30—12:00','8:00—12:00']:['7:00—19:00','8:00—14:00']};
  });
})();
function labHas(L,id){return L.cov>=1||rnd(L.id+'|'+id)<L.cov}
function labPrice(L,id){return r10(items[id].price*L.f*(.92+rnd(id+L.id)*.16))}
function labFor(L,ids){
  const avail=ids.filter(id=>labHas(L,id)), miss=ids.filter(id=>!labHas(L,id));
  return {k:avail.length,N:ids.length,full:!miss.length,miss,avail,p:avail.reduce((a,id)=>a+labPrice(L,id),0)+(avail.some(id=>isBlood(items[id]))?380:0)};
}
const shortName=n=>{let s=n.split(/[(,:]/)[0].trim();return s};
const fullCount=ids=>LABS.filter(L=>ids.every(id=>labHas(L,id))).length;

/* ---------- cart screen ---------- */
const checkedIds=()=>[...cart.entries()].filter(([id,v])=>v.on).map(([id])=>id);
function cartTotals(){
  const ids=checkedIds().filter(id=>!LAB||labHas(LAB,id));
  const sum=ids.reduce((a,id)=>a+(LAB?labPrice(LAB,id):items[id].price),0);
  const blood=ids.some(id=>isBlood(items[id]))?380:0;
  return {ids,sum,blood,total:sum+blood};
}
function labHead(L,act){
  return `<div class="lab"><div class="logo" style="background-image:url(${LOGO[L.brand.k]})"><span class="of">${IC.official||''}</span></div>
    <div class="tx"><b>${esc(L.n)}</b><span class="ad">${esc(L.a)}</span><span class="mt"><u style="background:${L.mc}"></u>${esc(L.metro)}, ${L.md}</span></div>${act||''}</div>`;
}
function renderCart(){
  const b=$('#cart-body');
  if(!cart.size){
    const pop=['Глюкоза','АлАТ','АсАТ','Билирубин общий'].map(n=>DATA.items.find(i=>i.name===n||i.name.startsWith(n+' ')||i.name.startsWith(n+' ('))).filter(Boolean);
    const pop2=pop.length>=3?pop:DATA.items.slice().sort((a,b)=>b.clinics-a.clinics).slice(0,4);
    b.innerHTML=`<div class="csec"><div class="ebig"><div style="width:74px;height:74px;background:url(${ASSET.basket}) center/contain no-repeat"></div><h2>В корзине пока что пусто</h2><p>Добавьте анализы — покажем, в каких клиниках вашего города их можно сдать</p><button class="big" data-act="allan">Перейти к анализам</button></div></div>
    <div class="csec"><div class="sh" style="font-size:22px;line-height:28px">Популярные анализы</div><div>${pop2.map(miniAddRow).join('')}</div></div>`;
    return;
  }
  const ids=[...cart.keys()], allOn=ids.every(id=>cart.get(id).on||(LAB&&!labHas(LAB,id)));
  const elig=ids.filter(id=>!LAB||labHas(LAB,id)), onN=elig.filter(id=>cart.get(id).on).length, ckCls=onN&&onN===elig.length?' on':(onN?' mid':'');
  const t=cartTotals(), P=PATIENTS[PATIENT];
  const place=LAB?`<div class="csec">${labHead(LAB,'<button class="sbtn" data-act="tomap">Изменить</button>')}<div class="infobar"><span style="color:var(--ink)">${SV.info}</span>Срок сдачи 14 дней после оплаты</div></div>`
    :`<button class="csec pickrow" data-act="tomap" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.pin})"></span><span class="tx"><b>Выбрать клинику</b><span>Доступно в ${fullCount(checkedIds().length?checkedIds():ids)} ${plural(fullCount(ids),'клинике','клиниках','клиниках')}</span></span><span>${SV.chevR}</span></button>`;
  const row=id=>{const i=items[id],v=cart.get(id),miss=LAB&&!labHas(LAB,id);
    return `<div class="citem${(!v.on||miss)?' off':''}"><button class="cb${v.on&&!miss?' on':''}" data-ck="${id}" ${miss?'disabled':''} aria-label="Отметить"><i>${SV.tick}</i></button>
      <div class="b"><div class="n tap" data-open="${id}">${esc(i.name)}</div>${miss?`<div class="miss">Нет в этой лаборатории</div>`:`<span class="pr">${LAB?'':'<i>от</i>'}<b>${fmt(LAB?labPrice(LAB,id):i.price)}</b></span>`}<div class="m">Готовность за ${esc(i.days||'1 день')}</div></div>
      <button class="sbtn sq" data-rm="${id}" aria-label="Удалить">${SV.trash}</button></div>`};
  const missN=LAB?ids.filter(id=>!labHas(LAB,id)).length:0;
  b.innerHTML=`${place}
  <div class="csec"><div class="lrow"><span class="illu" style="background-image:url(${P.img})"></span><span class="tx"><b>${esc(P.n)}</b><span>${P.d}</span></span><button class="sbtn" data-act="patient" style="align-self:flex-start">Изменить</button></div></div>
  <div class="csec" style="flex-direction:row;align-items:center;justify-content:space-between"><button class="lrow" data-act="ckall" style="width:auto"><span class="cb${ckCls}" role="checkbox" aria-checked="${ckCls===' on'?'true':ckCls?'mixed':'false'}"><i>${SV.tick}</i></span><span style="font-size:14px;font-weight:600">Выбрать всё</span></button><button class="sbtn" data-act="clear-cart">Очистить</button></div>
  <div class="csec" style="gap:0">${missN?`<div class="warn" style="margin-bottom:12px">${SV.alert}<div>${missN===1?'Один анализ нельзя сдать':'Не все анализы можно сдать'} в этой лаборатории<p>Сдайте ${anW(ids.length-missN)} здесь или выберите другую лабораторию.</p></div></div>`:''}${ids.map(row).join('')}
    ${t.blood?`<div class="draw"><div class="n">Взятие крови из вены</div><span class="pr">${LAB?'':'<i>от</i>'}<b>${fmt(380)}</b></span></div>`:''}</div>
  <div class="csec" style="padding-block:16px"><div class="tot"><span>Итого</span><span class="pr">${LAB?'':'<i>от</i>'}<b style="font-size:18px">${fmt(t.total)}</b></span></div></div>
  ${LAB?`<div class="csec" style="padding:12px 16px"><div class="bonus">Вернём <span class="pts">+100 ${SV.coinY}</span> за сдачу анализов<span class="gift" style="background-image:url(${ASSET.gift})"></span></div></div>`:''}
  <button class="csec pickrow" data-act="prep" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.prep})"></span><span class="tx"><b>Подготовка к анализам</b><span>Чтобы результаты были точными</span></span><span>${SV.chevR}</span></button>
  <div class="csec" style="margin-top:16px"><div class="sh" style="font-size:22px;line-height:28px">Часто добавляют к этим анализам</div><div>${related(ids,3).map(miniAddRow).join('')}</div></div>`;
}
function renderPageFooter(id){
  const f=$('#f-page');
  if(id==='s-cart'){
    if(!cart.size){f.hidden=true;return}
    const t=cartTotals();
    if(LAB) f.innerHTML=`<button class="big wide" data-act="checkout" ${t.ids.length?'':'disabled'}>Перейти к оформлению</button>${hi()}`;
    else f.innerHTML=`<button class="big wide two" data-act="tomap" ${t.ids.length?'':'disabled'}><span class="t">Выбрать клинику</span>${CHEVW}</button><div class="note">Для итоговой цены выберите клинику, где будете сдавать анализы.</div>${hi()}`;
  } else if(id==='s-co'){
    const t=cartTotals(), pts=ptsOff(t.total), pay=t.total-(PAY.usePts?pts:0);
    f.innerHTML=`<div class="pts-row"><button class="sw${PAY.usePts?' on':''}" data-act="pts" role="switch" aria-checked="${PAY.usePts}" aria-label="Списать баллы"></button><div class="tx"><b>Списать ${fmt(pts)} баллами</b><span>У вас ${SV.coinY} ${String(BALANCE).replace(/\B(?=(\d{3})+(?!\d))/g,nb)} баллов</span></div></div>
      <button class="big wide paybtn" data-act="pay" ${PAY.consent?'':'disabled'}><span>Оплатить ${fmt(pay)}</span><span class="sep"></span><span class="bn">${SV.coinY}+100</span></button>${hi()}`;
  } else if(id==='s-ok'){
    f.innerHTML=`<button class="big in wide" data-act="records">Перейти к моим записям</button><button class="big wide" data-act="home">Хорошо</button>${hi()}`;
  } else if(id==='s-fail'){
    f.innerHTML=`<button class="big wide" data-act="retry">Попробовать ещё раз</button><button class="lnk" data-act="closefail">Закрыть</button>${hi()}`;
  }
}

/* ---------- prep instruction ---------- */
function openPrep(ids){
  ids=ids&&ids.length?ids:[...cart.keys()];
  const L=ids.map(id=>items[id]);
  const names=a=>a.map(i=>shortName(i.name)).slice(0,4).join(', ')+(a.length>4?` и ещё ${a.length-4}`:'');
  const g=[];
  const meds=L.filter(i=>/препарат|варфарин|витамин|врач/i.test((i.prep.list||[]).join(' ')+i.prep.title));
  if(meds.length) g.push([SV.pill,'Отмена препаратов','Сообщите врачу о препаратах, которые принимаете. Отменять их можно только по согласованию с ним. Препараты железа, биотин и витамины обычно не принимают за 1–3 дня до исследования.',meds]);
  const kal=L.filter(i=>/кал/i.test(i.bio));
  if(kal.length) g.push([SV.tube,'Кал','Собирается в специальный стерильный контейнер. Не допускать попадания мочи. Для некоторых анализов (на скрытую кровь) нужна специальная диета за 3 дня.',kal]);
  const uri=L.filter(i=>/моч|соскоб/i.test(i.bio));
  if(uri.length) g.push([SV.calX,'Не сдавать во время менструации','',uri]);
  const fast=L.filter(i=>i.fast||/натощак/i.test(i.prep.title));
  if(fast.length){g.push([SV.glass,'Вода','Можно пить чистую негазированную воду до исследования',fast]);g.push([SV.fork,'Натощак','8–14 часов голодания',fast]);}
  const none=L.filter(i=>/без подготовки|не требуется/i.test(i.prep.title));
  if(none.length) g.push([SV.infoP,'Специальной подготовки не требуется','',none]);
  const titles=new Set(L.map(i=>i.prep.title)); const conflict=titles.size>1;
  openSheet(`<div class="sbody">
    <div class="csec" style="border-radius:0 0 24px 24px;padding-top:0"><div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div><div class="sh" style="font-size:22px;line-height:28px">Подготовка к анализам</div>
    <div style="font-size:12px;font-weight:500;line-height:18px;color:var(--soft)">Для ${anW(L.length)} в корзине</div></div>
    ${g.map(([icn,t,p,a])=>`<div class="pcard">${icn}<div class="tx"><b>${t}</b>${p?`<p>${p}</p>`:''}<span class="for">${names(a)}</span></div></div>`).join('')}
    ${conflict?`<div class="csec"><div class="warn">${SV.alert}<div style="font-weight:500">Есть анализы с разными требованиями к подготовке, которые могут противоречить друг другу. Проконсультируйтесь с врачом</div></div></div>`:''}
  </div><div class="sfoot"><button class="big wide" data-act="close">Отлично</button>${hi()}</div>`);
}

/* ---------- patient ---------- */
function openPatient(){
  openSheet(`<div class="sbody"><div class="csec" style="border-radius:0 0 24px 24px;padding-top:0"><div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div><div class="sh" style="font-size:22px;line-height:28px">Кто сдаёт анализы</div>
    <div>${PATIENTS.map((p,k)=>`<button class="pat" data-pat="${k}"><span class="illu" style="background-image:url(${p.img})"></span><span class="tx"><b>${esc(p.n)}</b><span>${p.d}</span></span><span class="radio${k===PATIENT?' on':''}"></span></button>`).join('')}</div>
    <button class="more" data-act="soon">+ Добавить пациента</button></div></div><div class="sfoot">${hi()}</div>`);
}

/* ---------- checkout ---------- */
const ptsOff=total=>Math.min(500,BALANCE,Math.floor(total*0.2/10)*10);
function renderCO(){
  const t=cartTotals();
  const pm=[['sber','Sber Pay',`<svg width="44" height="22" viewBox="0 0 44 22"><rect x=".75" y=".75" width="42.5" height="20.5" rx="10.25" fill="none" stroke="#21A038" stroke-width="1.5"/><circle cx="11" cy="11" r="6" fill="none" stroke="#21A038" stroke-width="1.6"/><path d="m8.5 11 1.8 1.8 3.4-3.6" fill="none" stroke="#21A038" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="20" y="15" font-family="Montserrat,sans-serif" font-size="11" font-weight="700" fill="#21A038">Pay</text></svg>`],
    ['card','Банковская карта',`<svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="2" width="28" height="19" rx="3" fill="#D7D9DE"/><rect x="1" y="6" width="28" height="3.5" fill="#B5B9C2"/><rect x="4" y="13" width="9" height="3" rx="1" fill="#fff"/><circle cx="27" cy="20" r="6" fill="#6ABF68"/><path d="M27 17v6M24 20h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`],
    ['foreign','Карта банка другой страны',`<svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="2" width="28" height="19" rx="3" fill="#D7D9DE"/><rect x="1" y="6" width="28" height="3.5" fill="#B5B9C2"/><rect x="4" y="13" width="9" height="3" rx="1" fill="#fff"/><circle cx="27" cy="20" r="6" fill="#4F9FE8"/><path d="M21.5 20h11M27 14.5c2 2 2 9 0 11M27 14.5c-2 2-2 9 0 11" stroke="#fff" stroke-width="1.1" fill="none"/></svg>`]];
  $('#co-body').innerHTML=`
  <div class="csec">${LAB?labHead(LAB):''}</div>
  <div class="csec"><button class="ttl${PAY.brkOpen?' open':''}" data-act="brk"><span>Итого</span><span class="v">${fmt(t.total)}${SV.chevUp}</span></button>
    ${PAY.brkOpen?`<div class="brk">${t.ids.map(id=>`<div><span>${esc(shortName(items[id].name))}</span><b>${fmt(labPrice(LAB,id))}</b></div>`).join('')}${t.blood?`<div><span>Взятие крови из вены</span><b>${fmt(380)}</b></div>`:''}${PAY.usePts?`<div><span>Баллами</span><b>−${fmt(ptsOff(t.total))}</b></div>`:''}</div>`:''}
  </div>
  <div class="csec"><div class="sh" style="font-size:22px;line-height:28px">Способы оплаты</div>
    <div>${pm.map(([k,n,svg])=>`<button class="pay" data-pm="${k}"><span class="pi">${svg}</span><span class="pn">${n}</span><span class="radio${PAY.method===k?' on':''}"></span></button>`).join('')}</div>
    <button class="consent" data-act="consent"><span class="cb y${PAY.consent?' on':''}"><i>${SV.tick}</i></span><span>Даю <u>согласие</u> на обработку моих персональных данных</span></button>
  </div>`;
}
let PAID=null;
function pay(){
  const t=cartTotals(); const total=t.total-(PAY.usePts?ptsOff(t.total):0);
  $('#loader').hidden=false;
  setTimeout(()=>{
    $('#loader').hidden=true;
    if(PAY.method==='foreign'){go({s:'fail'});return}
    const d=new Date(); d.setDate(d.getDate()+14);
    PAID={lab:LAB,total,ids:t.ids.slice(),until:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};
    t.ids.forEach(id=>cart.delete(id));
    resetTo({s:'ok'});
  },1300);
}
function renderOK(){
  const P=PAID; if(!P){return}
  const L=P.lab;
  $('#ok-body').innerHTML=`<div class="okbox"><div style="width:171px;height:120px;display:flex;align-items:center;justify-content:center">${SUCCESS}</div><h1>Заказ оплачен<br>${fmt(P.total)}</h1><div class="s">Вам будет начислено ${SV.coinY} 100</div></div>
  <div style="display:flex;flex-direction:column;gap:8px">
  <button class="csec pickrow" data-act="prep-paid" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.prep})"></span><span class="tx"><b>Подготовка к анализам</b><span>Чтобы результаты были точными</span></span><span>${SV.chevR}</span></button>
  <div class="csec" style="gap:24px">
    <div class="irow">${SV.pinO}<div class="tx"><b>${esc(L.n)}</b><span>${esc(L.a)}</span><span class="mt"><u style="background:${L.mc}"></u>${esc(L.metro)}, ${L.md}</span></div></div>
    <div class="irow">${SV.clock}<div class="tx"><b>Часы приёма биоматериала</b><span class="k">С понедельника по пятницу</span><span>${L.hours[0]}</span><span class="k">С субботы по воскресенье</span><span>${L.hours[1]}</span></div></div>
    <div class="irow">${SV.cal}<div class="tx"><b>Сдать анализы нужно до ${P.until}</b><span class="k">Заказ действителен 14 дней</span></div></div>
    <div class="pass"><span style="display:flex;gap:8px;align-items:center">${SV.infoC}Не забудьте взять с собой паспорт</span><span class="im" style="background-image:url(${ASSET.passport})"></span></div>
  </div></div>`;
}

/* ---------- sheet & dialog & toast ---------- */
function openSheet(html){const s=$('#sheet');s.innerHTML=html;$('#dim').hidden=false;updateFooters(curScr());}
function closeSheet(){if(!$('#dim').hidden){$('#dim').hidden=true;updateFooters(curScr());if(cur&&cur.s==='cat')renderCat();}}
function dialog(title,text,acts){
  const d=$('#dlg'); d.innerHTML=`<div class="box" role="alertdialog" aria-modal="true"><h3>${title}</h3>${text?`<p>${text}</p>`:''}<div class="acts">${acts.map((a,k)=>`<button class="big${k?' in':''}" data-dlg="${k}">${a[0]}</button>`).join('')}</div></div>`;
  d.hidden=false; d.onclick=e=>{const b=e.target.closest('[data-dlg]'); if(b){d.hidden=true;acts[+b.dataset.dlg][1]()} else if(e.target===d) d.hidden=true;};
}
let tt; function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800)}

/* =================== MAP =================== */
const MV={s:0.9,x:0,y:0,sheet:'peek',sel:null,card:false,place:null,brands:new Set(),pts:false,q:'',searching:false,inited:false};
const vp=$('#m-vp'), world=$('#m-world'), layer=$('#m-layer');
const vpW=()=>vp.clientWidth, vpH=()=>vp.clientHeight;
const HDR=98;
function sheetH(){const H=vpH();return MV.card?0:(MV.sheet==='peek'?150:MV.sheet==='half'?Math.round(H*0.5):H-HDR+4)}
function visibleH(){return vpH()-(MV.card?300:sheetH())}
function clampView(){
  const W=vpW(),H=vpH(),s=MV.s;
  MV.x=Math.min(60,Math.max(W-MW*s-60,MV.x));
  MV.y=Math.min(HDR+40,Math.max(H-MH*s-200,MV.y));
}
function centerOn(wx,wy,s){
  if(s) MV.s=s;
  const top=HDR, bot=vpH()-(MV.card?300:Math.min(sheetH(),vpH()*0.5));
  MV.x=vpW()/2-wx*MV.s; MV.y=(top+bot)/2-wy*MV.s+20; clampView(); applyView();
}
function applyView(){world.style.transform=`translate(${MV.x}px,${MV.y}px) scale(${MV.s})`;renderMarkers();if(MV.sheet==='half'&&!MV.card&&!MV.searching)renderMList();}
const mapIds=()=>{const ids=checkedIds(); return ids.length?ids:[...cart.keys()]};
function filtered(){
  const ids=mapIds();
  return LABS.filter(L=>(!MV.brands.size||MV.brands.has(L.brand.k))&&(!MV.pts||L.pts)&&labFor(L,ids).k>0);
}
const toScr=(L)=>[MV.x+L.x*MV.s, MV.y+L.y*MV.s];
function inView(L){const [sx,sy]=toScr(L);return sx>-10&&sx<vpW()+10&&sy>HDR-10&&sy<visibleH()+10}
function renderMarkers(){
  const ids=mapIds(), labs=filtered();
  let html='';
  if(MV.s<0.62){ // кластеры
    const cell=150/MV.s*0.9, groups=new Map();
    labs.forEach(L=>{const k=Math.floor(L.x/cell)+':'+Math.floor(L.y/cell);(groups.get(k)||groups.set(k,[]).get(k)).push(L)});
    groups.forEach(g=>{
      const cx=g.reduce((a,L)=>a+L.x,0)/g.length, cy=g.reduce((a,L)=>a+L.y,0)/g.length;
      const min=Math.min(...g.map(L=>labFor(L,ids).p)); const anyFull=g.some(L=>labFor(L,ids).full);
      const sx=MV.x+cx*MV.s, sy=MV.y+cy*MV.s;
      if(g.length===1){html+=mk(g[0],ids);return}
      html+=`<div class="mk cl${anyFull?'':' p'}" data-cl="${cx},${cy}" style="left:${sx}px;top:${sy}px" role="button" tabindex="0" aria-label="${g.length} лабораторий, от ${fmt(min)}"><div class="b"><u>${g.length}</u><b>от ${fmt(min)}</b></div></div>`;
    });
  } else labs.forEach(L=>{html+=mk(L,ids)});
  if(MV.place){const sx=MV.x+MV.place.x*MV.s, sy=MV.y+MV.place.y*MV.s; html+=`<div class="ppin${MV.place.me?' me':''}" style="left:${sx}px;top:${sy}px"></div>`}
  layer.innerHTML=html;
}
function mk(L,ids){
  const r=labFor(L,ids), [sx,sy]=toScr(L);
  if(sx<-80||sx>vpW()+80||sy<-40||sy>vpH()+60) return '';
  const cls=L.id===MV.sel?'a':(r.full?'d':'p');
  return `<div class="mk ${cls}" data-mk="${L.id}" role="button" tabindex="0" aria-label="${esc(L.n)}, ${fmt(r.p)}, ${r.k} из ${r.N}" style="left:${sx}px;top:${sy}px"><div class="b"><b>${fmt(r.p)}</b><span>${r.k} из ${anW(r.N)}</span></div><i></i></div>`;
}
const lcardHTML=(L,ids,dist)=>{const r=labFor(L,ids);
  return `<button class="lcard${L.id===MV.sel?' sel':''}" data-lab="${L.id}">
    <div class="lab"><div class="logo" style="background-image:url(${LOGO[L.brand.k]})"><span class="of">${IC.official||''}</span></div><div class="tx"><b>${esc(L.n)}</b><span class="ad">${esc(L.a)}</span>${L.rev>50?`<span class="rate">${SV.star}${L.rate}<em>· ${L.rev} ${plural(L.rev,'отзыв','отзыва','отзывов')}</em></span>`:''}<span class="mt"><u style="background:${L.mc}"></u>${esc(L.metro)}, ${L.md}</span>${dist?`<span class="mt" style="color:var(--brand-ink)">${SV.place}${dist}</span>`:''}</div></div>
    <div class="pr2"><b>${fmt(r.p)}</b>${r.full?'':`<span class="mcnt p">за ${r.k} из ${r.N}${SV.flask('var(--warn-fg)')}</span>`}</div>
    ${r.full?'':`<div class="warn">${SV.alert}<div>Нет: <span style="font-weight:500">${esc(r.miss.map(id=>shortName(items[id].name)).join(', '))}</span></div></div>`}
  </button>`};
function sortedLabs(list,ids){
  if(MV.place) return list.map(L=>({L,d:Math.hypot(L.x-MV.place.x,L.y-MV.place.y)*1.6})).sort((a,b)=>a.d-b.d);
  return list.map(L=>({L,d:null})).sort((a,b)=>{const ra=labFor(a.L,ids),rb=labFor(b.L,ids);return (rb.full-ra.full)||(ra.p-rb.p)});
}
function renderMList(){
  const el=$('#m-list'); if(!el) return;
  const ids=mapIds(); let list=filtered();
  const area=MV.sheet==='half';
  if(area) list=list.filter(inView);
  const arr=sortedLabs(list,ids);
  const head='';
  el.innerHTML=head+(arr.length?arr.map(o=>lcardHTML(o.L,ids,o.d!=null?distTxt(o.d)+' от места':'')).join(''):`<div class="empty"><b>Здесь нет лабораторий</b><span>Сдвиньте или отдалите карту${MV.brands.size||MV.pts?', или сбросьте фильтры':''}.</span></div>`);
}
function chipsHTML(){
  const bn=MV.brands.size?(MV.brands.size===1?BRANDS.find(b=>MV.brands.has(b.k)).n:`Сети: ${MV.brands.size}`):'Лаборатория';
  const pl=MV.place&&!MV.place.me?MV.place.n:'Район или метро';
  return `<button data-act="f-brand" class="${MV.brands.size?'on':''}">${SV.clinic}${esc(bn)}${SV.chevD}</button><button data-act="f-place" class="${MV.place&&!MV.place.me?'on':''}">${SV.pin}${esc(pl.length>18?pl.slice(0,17)+'…':pl)}${SV.chevD}</button><button data-act="f-pts" class="${MV.pts?'on':''}">${SV.coin}Оплата баллами</button>`;
}
function renderMSheet(){
  const s=$('#m-sheet'), ids=mapIds();
  if(MV.card&&MV.sel){
    const L=LABS.find(x=>x.id===MV.sel), r=labFor(L,ids);
    s.style.height='auto';
    s.innerHTML=`<div class="chev-ctl" data-act="mclose" style="color:var(--ink)">${SV.grabDown}</div><div class="mcardwrap">
      ${labHead(L)}
      <div class="lcard" style="margin:0;padding:0;border:0;gap:12px;background:none"><div class="pr2"><b>${fmt(r.p)}</b><span class="mcnt${r.full?'':' p'}">за ${r.full?r.N:`${r.k} из ${r.N}`}${SV.flask(r.full?'var(--light)':'var(--warn-fg)')}</span></div>
      ${r.full?'':`<div class="warn">${SV.alert}<div>${r.miss.length>1?'Анализы недоступны для сдачи:':'Анализ недоступен для сдачи:'}<p>${esc(r.miss.map(id=>shortName(items[id].name)).join(', '))}</p></div></div>`}</div>
      <button class="big" data-act="mpick">Выбрать</button></div>${hi()}`;
    $('#m-ctrls').style.bottom=(s.offsetHeight+12)+'px'; $('#m-toggle').hidden=true;
    return;
  }
  const H=sheetH();
  s.style.height=H+'px';
  s.innerHTML=`<div class="grabber" id="m-grab" data-act="mgrab" role="button" aria-label="Список лабораторий"><i></i></div>
    <div class="mtop"><label class="inp" id="mq-wrap">${SEARCHIC}<input id="mq" type="text" placeholder="Адрес или метро" autocomplete="off" value="${esc(MV.q)}"><button class="clr" data-act="mqclear" aria-label="Очистить">${CLEARIC}</button></label>
    <div class="qf" id="m-qf">${chipsHTML()}</div></div>
    ${MV.searching?`<div class="mlist" id="m-sugg" style="background:var(--base)"></div>`:(MV.sheet==='peek'?'':`<div class="mlist" id="m-list"></div>`)}`;
  $('#mq-wrap').classList.toggle('has',!!MV.q);
  if(MV.searching) renderSugg(); else renderMList();
  const ctl=$('#m-ctrls'); ctl.style.bottom=(H+12)+'px'; ctl.hidden=MV.sheet==='full';
  const tg=$('#m-toggle'); tg.hidden=true; tg.style.bottom=(MV.sheet==='full'?28:H+16)+'px';
  tg.innerHTML=MV.sheet==='full'?`${SV.place}Карта`:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01"/></svg>Списком`;
  tg.dataset.act=MV.sheet==='full'?'mmap':'mlist';
}
function setSheet(st){MV.sheet=st;MV.card=false;renderMSheet();renderMarkers();}
function renderMap(fresh){
  if(fresh){
    MV.card=false;MV.searching=false;
    if(!MV.inited){MV.inited=true;MV.sel=LAB?LAB.id:'lab0';MV.s=0.9;}
    if(LAB) MV.sel=LAB.id;
    MV.sheet='peek';
    requestAnimationFrame(()=>{const L=LABS.find(x=>x.id===MV.sel)||LABS[0];centerOn(L.x,L.y);renderMSheet();});
  }
  renderMSheet(); applyView();
}
function selectLab(id,card=true){
  MV.sel=id; MV.searching=false; const L=LABS.find(x=>x.id===id);
  if(card){MV.card=true;renderMSheet();}
  centerOn(L.x,L.y,Math.max(MV.s,0.8));
}
function zoomAt(f,cx,cy){
  const s0=MV.s, s1=Math.min(1.7,Math.max(0.36,s0*f)); if(s1===s0) return;
  cx=cx??vpW()/2; cy=cy??(HDR+visibleH())/2;
  const wx=(cx-MV.x)/s0, wy=(cy-MV.y)/s0; MV.s=s1; MV.x=cx-wx*s1; MV.y=cy-wy*s1; clampView(); applyView();
}
/* place search */
function renderSugg(){
  const el=$('#m-sugg'); if(!el) return;
  const q=norm(MV.q.trim());
  const hl=t=>{if(!q) return esc(t);const i=norm(t).indexOf(q);return i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))};
  const row=(icn,t,sub,attr)=>`<button class="sg" ${attr}><span class="si">${icn}</span><span class="tx"><b>${hl(t)}</b>${sub?`<span>${sub}</span>`:''}</span></button>`;
  const pl=PLACES.filter(p=>!q||norm(p.n).includes(q)||norm(p.full||'').includes(q));
  const labs=q?LABS.filter(L=>norm(L.n+' '+L.a).includes(q)).slice(0,6):[];
  const kind={metro:'Метро',street:'Улица',poi:'Место'};
  let h='';
  if(!q) h+=`<div class="sghd">Быстрый выбор</div><div class="sugg">${row(`<span style="color:#2F80ED">${SV.place}</span>`,'Рядом со мной','Покажем ближайшие лаборатории','data-me="1"')}</div><div class="sghd">Метро</div>`;
  const metros=pl.filter(p=>p.t==='metro'), others=pl.filter(p=>p.t!=='metro');
  h+=`<div class="sugg">${metros.map(p=>row(SV.metro(p.c),p.n,kind.metro,`data-place="${p.i}"`)).join('')}</div>`;
  if(others.length) h+=`${q?'':'<div class="sghd">Улицы и места</div>'}<div class="sugg">${others.slice(0,q?12:8).map(p=>row(`<span style="color:var(--soft)">${p.t==='street'?SV.street:SV.place}</span>`,p.full||p.n,kind[p.t],`data-place="${p.i}"`)).join('')}</div>`;
  if(labs.length) h+=`<div class="sghd">Лаборатории</div><div class="sugg">${labs.map(L=>row(`<span style="color:var(--soft)">${SV.lab}</span>`,L.n,esc(L.a),`data-lab="${L.id}"`)).join('')}</div>`;
  if(q&&!pl.length&&!labs.length) h+=`<div class="empty"><b>Ничего не нашли</b><span>Попробуйте название станции метро или улицы</span></div>`;
  el.innerHTML=h;
}
function pickPlace(p){
  MV.place=p; MV.q=p.me?'':(p.full||p.n); MV.searching=false; MV.sheet='half'; MV.card=false;
  $('#mq')&&$('#mq').blur();
  renderMSheet(); centerOn(p.x,p.y,Math.max(MV.s,0.85));
  const near=sortedLabs(filtered(),mapIds())[0]; if(near) {MV.sel=near.L.id; renderMarkers(); renderMList();}
}
function openBrandSheet(){
  openSheet(`<div class="sbody"><div class="csec" style="border-radius:0 0 24px 24px;padding-top:0"><div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div><div class="sh" style="font-size:22px;line-height:28px">Лаборатория</div>
  <div>${BRANDS.map(b=>`<button class="pat" data-brand="${b.k}"><span class="logo" style="background-image:url(${LOGO[b.k]});width:40px;height:40px"></span><span class="tx"><b>${b.n}</b><span>${LABS.filter(L=>L.brand.k===b.k).length} ${plural(LABS.filter(L=>L.brand.k===b.k).length,'филиал','филиала','филиалов')} на карте</span></span><span class="cb${MV.brands.has(b.k)?' on':''}"><i>${SV.tick}</i></span></button>`).join('')}</div></div></div>
  <div class="sfoot"><button class="big wide" data-act="brand-ok">Показать</button><button class="lnk" data-act="brand-reset" style="height:36px">Сбросить</button>${hi()}</div>`);
}
/* map gestures: pan, wheel, pinch */
(function(){
  const pts=new Map(); let start=null, moved=false;
  vp.addEventListener('pointerdown',e=>{
    if(e.target.closest('.mk')) return;
    vp.setPointerCapture(e.pointerId); pts.set(e.pointerId,[e.clientX,e.clientY]);
    start={x:MV.x,y:MV.y,s:MV.s,p:[...pts.values()].map(a=>a.slice())}; moved=false;
  });
  vp.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId)||!start) return; pts.set(e.pointerId,[e.clientX,e.clientY]);
    const P=[...pts.values()];
    if(P.length===1&&start.p.length===1){const dx=P[0][0]-start.p[0][0],dy=P[0][1]-start.p[0][1]; if(!moved&&Math.hypot(dx,dy)>5){moved=true;vp.classList.add('drag')} if(moved){MV.x=start.x+dx;MV.y=start.y+dy;clampView();applyView();}}
    else if(P.length>=2&&start.p.length>=2){
      const d0=Math.hypot(start.p[0][0]-start.p[1][0],start.p[0][1]-start.p[1][1]), d1=Math.hypot(P[0][0]-P[1][0],P[0][1]-P[1][1]);
      const r=vp.getBoundingClientRect(), cx=(P[0][0]+P[1][0])/2-r.left, cy=(P[0][1]+P[1][1])/2-r.top;
      const s1=Math.min(1.7,Math.max(0.36,start.s*d1/d0)); const wx=(cx-start.x)/start.s, wy=(cy-start.y)/start.s;
      MV.s=s1; MV.x=cx-wx*s1; MV.y=cy-wy*s1; clampView(); applyView(); moved=true;
    }
  });
  const end=e=>{pts.delete(e.pointerId); if(pts.size<2&&start&&start.p.length>=2){start=null;pts.clear()} if(!pts.size){vp.classList.remove('drag'); if(!moved&&start&&!e.target.closest('.mk')){ if(MV.card){MV.card=false;renderMSheet();renderMarkers();} else if(MV.searching){MV.searching=false;renderMSheet();} } start=null;}};
  vp.addEventListener('pointerup',end); vp.addEventListener('pointercancel',end);
  vp.addEventListener('wheel',e=>{e.preventDefault();const r=vp.getBoundingClientRect();zoomAt(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top)},{passive:false});
  // sheet drag between peek / half / full
  let sd=null;
  $('#m-sheet').addEventListener('pointerdown',e=>{if(!e.target.closest('#m-grab')||MV.card)return;sd={y:e.clientY,h:$('#m-sheet').offsetHeight,moved:false};$('#m-sheet').setPointerCapture(e.pointerId);$('#m-sheet').classList.add('nodrag')});
  $('#m-sheet').addEventListener('pointermove',e=>{if(!sd)return;const dy=e.clientY-sd.y;if(Math.abs(dy)>4)sd.moved=true;$('#m-sheet').style.height=Math.max(120,Math.min(vpH()-HDR+4,sd.h-dy))+'px'});
  $('#m-sheet').addEventListener('pointerup',e=>{if(!sd)return;const s=$('#m-sheet');s.classList.remove('nodrag');const h=s.offsetHeight,H=vpH();
    if(!sd.moved){sd=null;setSheet(MV.sheet==='peek'?'half':MV.sheet==='half'?'full':'peek');return}
    const opts=[['peek',150],['half',H*.5],['full',H-HDR]];opts.sort((a,b)=>Math.abs(a[1]-h)-Math.abs(b[1]-h));sd=null;MV.searching=false;setSheet(opts[0][0]);});
})();

/* ---------- events ---------- */
$('#ph').addEventListener('click',e=>{
  const t=e.target.closest('[data-mk],[data-cl],[data-lab],[data-place],[data-me],[data-brand],[data-cart],[data-open],[data-cat],[data-chip],[data-q],[data-jump],[data-rm],[data-ck],[data-pat],[data-pm],[data-act],[data-clinic-add]');
  if(!t) return;
  if(t.closest('#dlg')) return;
  const d=t.dataset;
  if(d.mk){selectLab(d.mk);return}
  if(d.cl){const [x,y]=d.cl.split(',').map(Number);centerOn(x,y,0.8);return}
  if(d.lab){selectLab(d.lab);return}
  if(d.place!==undefined){pickPlace(PLACES[+d.place]);return}
  if(d.me){const L=LABS[0];pickPlace({n:'Рядом со мной',x:L.x+60,y:L.y+90,me:true});return}
  if(d.brand){MV.brands.has(d.brand)?MV.brands.delete(d.brand):MV.brands.add(d.brand);t.querySelector('.cb').classList.toggle('on');return}
  if(d.cart){e.stopPropagation();const id=d.cart;const was=inCart(id);toggleCart(id);refresh();
    if(!was&&d.up&&curScr()==='s-cat'&&$('#dim').hidden){openUpsell(id);}
    else if(!$('#dim').hidden&&$('#up-go')){$('#up-go .t span').textContent=anW(cart.size);toast(was?'Убрали из корзины':'Добавили в корзину')}
    else{toast(was?'Убрали из корзины':'Добавили в корзину'); if(curScr()==='s-cart'){renderCart();updateFooters('s-cart')}}
    return}
  if(d.clinicAdd!==undefined){const id=t.dataset.cartId;if(!inCart(id))addCart(id);refresh();toast('Добавили в корзину');return}
  if(d.rm){delCart(d.rm);renderCart();updateFooters('s-cart');toast('Убрали из корзины');return}
  if(d.ck){const v=cart.get(d.ck);v.on=!v.on;renderCart();updateFooters('s-cart');return}
  if(d.pat!==undefined){PATIENT=+d.pat;closeSheet();renderCart();return}
  if(d.pm){PAY.method=d.pm;renderCO();return}
  if(d.open){go({s:'detail',id:d.open});return}
  if(d.cat){go({s:'cat',c:d.cat,q:''});return}
  if(d.chip){cur.c=d.chip;if(d.chip!=='all'||!cur.q)cur.q=cur.q||'';renderCat();$('#s-cat').scrollTop=0;return}
  if(d.q){cur.q=d.q;renderGS(d.q);return}
  if(d.jump){window.__chipLock&&window.__chipLock();t.parentNode.scrollTo({left:t.offsetLeft-16,behavior:'smooth'});$$('#d-chips .chip').forEach(c=>c.classList.toggle('on',c===t));$('#'+d.jump).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}
  const a=d.act;
  switch(a){
    case 'back': back(); break;
    case 'search': go({s:'gs',q:''}); setTimeout(()=>$('#q').focus(),50); break;
    case 'catsearch': go({s:'cat',c:'all',q:''}); setTimeout(()=>$('#cq').focus(),50); break;
    case 'allan': go({s:'cat',c:'all',q:''}); break;
    case 'clear': cur.q='';renderGS('');$('#q').focus(); break;
    case 'cclear': cur.q='';renderCat();$('#cq').focus(); break;
    case 'morecats': {const rows=$('#cat-rows');rows.innerHTML+=DATA.cats.slice(5).map(c=>`<button class="row" data-cat="${c.id}"><span>${c.title}</span><span style="color:var(--light)">${SV.chevR}</span></button>`).join('');t.remove();break;}
    case 'showall': $('#d-desc').classList.add('full');t.hidden=true; break;
    case 'dadd': if(!inCart(cur.id)){addCart(cur.id);refresh();toast('Добавили в корзину')} else go({s:'cart'}); break;
    case 'drm': delCart(cur.id);refresh();toast('Убрали из корзины'); break;
    case 'cart': closeSheet(); go({s:'cart'}); break;
    case 'close': closeSheet(); break;
    case 'tomap': if(!cart.size){toast('Добавьте анализы в корзину');break} if(!checkedIds().length){toast('Отметьте анализы, которые будете сдавать');break} go({s:'map'}); break;
    case 'map': if(!inCart(cur.id))addCart(cur.id); refresh(); go({s:'map'}); break;
    case 'patient': openPatient(); break;
    case 'prep': openPrep(); break;
    case 'prep-paid': openPrep(PAID?PAID.ids:[]); break;
    case 'ckall': {const ids=[...cart.keys()].filter(id=>!LAB||labHas(LAB,id));const all=ids.every(id=>cart.get(id).on);ids.forEach(id=>cart.get(id).on=!all);renderCart();updateFooters('s-cart');break;}
    case 'clear-cart': dialog('Очистить корзину?','Уберём все анализы и выбранную лабораторию.',[['Очистить',()=>{cart.clear();LAB=null;renderCart();updateFooters('s-cart');toast('Корзина очищена')}],['Отмена',()=>{}]]); break;
    case 'checkout': if(!cartTotals().ids.length){toast('Отметьте анализы');break} PAY.brkOpen=false; go({s:'co'}); break;
    case 'brk': PAY.brkOpen=!PAY.brkOpen; renderCO(); break;
    case 'consent': PAY.consent=!PAY.consent; renderCO(); renderPageFooter('s-co'); break;
    case 'pts': PAY.usePts=!PAY.usePts; renderCO(); renderPageFooter('s-co'); break;
    case 'pay': if(!PAY.consent){toast('Нужно согласие на обработку данных');break} pay(); break;
    case 'retry': back(); break;
    case 'closefail': stack.pop(); back(); break;
    case 'support': e.preventDefault(); toast('Откроем чат поддержки'); break;
    case 'records': toast('Раздел «Мои записи» в прототипе не подключён'); break;
    case 'home': resetTo({s:'home'}); break;
    /* map */
    case 'zin': zoomAt(1.3); break;
    case 'zout': zoomAt(1/1.3); break;
    case 'me': {const L=LABS[0];pickPlace({n:'Рядом со мной',x:L.x+60,y:L.y+90,me:true});break;}
    case 'mlist': setSheet(MV.sheet==='peek'?'half':'full'); break;
    case 'mfull': setSheet('full'); break;
    case 'mmap': setSheet('half'); break;
    case 'mclose': MV.card=false; renderMSheet(); renderMarkers(); break;
    case 'mqclear': MV.q='';MV.place=null;MV.searching=true;renderMSheet();renderMarkers();$('#mq').focus(); break;
    case 'f-brand': openBrandSheet(); break;
    case 'brand-ok': closeSheet(); renderMSheet(); renderMarkers(); break;
    case 'brand-reset': MV.brands.clear(); closeSheet(); renderMSheet(); renderMarkers(); break;
    case 'f-place': if(MV.place&&!MV.place.me){MV.place=null;MV.q='';renderMSheet();renderMarkers();break} MV.searching=true; MV.sheet='full'; renderMSheet(); setTimeout(()=>$('#mq')&&$('#mq').focus(),30); break;
    case 'f-pts': MV.pts=!MV.pts; renderMSheet(); renderMarkers(); break;
    case 'mpick': {
      const L=LABS.find(x=>x.id===MV.sel), r=labFor(L,mapIds());
      const done=()=>{LAB=L; [...cart.keys()].forEach(id=>{if(!labHas(L,id))cart.get(id).on=false;}); back(); toast(`Выбрали ${L.n}`)};
      if(r.full) done();
      else dialog(`Сдать ${anW(r.k)} здесь?`,`В «${esc(L.n)}» нет: ${esc(r.miss.map(id=>shortName(items[id].name)).join(', '))}. Их можно сдать в другой лаборатории позже.`,[[`Сдать ${r.k} из ${r.N} здесь`,done],['Найти филиал со всеми анализами',()=>{MV.card=false;const best=sortedLabs(filtered().filter(x=>labFor(x,mapIds()).full),mapIds()).sort((a,b)=>Math.hypot(a.L.x-L.x,a.L.y-L.y)-Math.hypot(b.L.x-L.x,b.L.y-L.y))[0];if(best)selectLab(best.L.id);}]]);
      break;}
    case 'soon': toast('В этом прототипе раздел не подключён'); break;
    default: if(a&&a.startsWith('cat:')) go({s:'cat',c:a.slice(4),q:''});
  }
});
$('#dim').addEventListener('click',e=>{if(e.target.id==='dim') closeSheet()});
$('#q').addEventListener('input',e=>{cur.q=e.target.value;renderGS(e.target.value)});
$('#cq').addEventListener('input',e=>{cur.q=e.target.value;if(cur.q.trim())cur.c='all';renderCat();const i=$('#cq');i.focus()});
$('#m-sheet').addEventListener('input',e=>{if(e.target.id!=='mq')return;MV.q=e.target.value;$('#mq-wrap').classList.toggle('has',!!MV.q);if(!MV.searching){MV.searching=true;MV.sheet='full';const v=MV.q;renderMSheet();const i=$('#mq');i.focus();i.setSelectionRange(v.length,v.length);}else renderSugg();});
$('#m-sheet').addEventListener('focusin',e=>{if(e.target.id==='mq'&&!MV.searching){MV.searching=true;MV.sheet='full';renderMSheet();const i=$('#mq');i.focus();}});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.dataset&&(e.target.dataset.mk||e.target.dataset.cl||e.target.dataset.cat)){e.target.click();return}
  if(e.key==='Escape'){if(!$('#dlg').hidden)$('#dlg').hidden=true;else if(!$('#dim').hidden)closeSheet();else if(MV.card){MV.card=false;renderMSheet();}}
});
window.addEventListener('resize',()=>{if(curScr()==='s-map'){renderMSheet();applyView()}});

/* sticky chips in detail */
(function(){
  const s=$('#s-detail'); let lock=0;
  function upd(){
    const h=s.querySelector('.hdr'), c=$('#d-chips'); if(!h||!c||s.hidden) return;
    const hb=h.offsetHeight; c.style.top=hb+'px'; s.style.setProperty('--smt',(hb+c.offsetHeight+8)+'px');
    const stuck=c.getBoundingClientRect().top-s.getBoundingClientRect().top<=hb+.5;
    s.classList.toggle('stuck',stuck);
    if(Date.now()<lock) return;
    const lim=hb+c.offsetHeight+40; let on='b-prep';
    ['b-prep','b-ind','b-where'].forEach(id=>{const e=$('#'+id); if(e&&e.getBoundingClientRect().top-s.getBoundingClientRect().top<=lim) on=id});
    if(stuck) c.querySelectorAll('.chip').forEach(x=>{const was=x.classList.contains('on');x.classList.toggle('on',x.dataset.jump===on);if(!was&&x.dataset.jump===on){c.querySelector('.in').scrollTo({left:x.offsetLeft-16,behavior:'smooth'})}});
  }
  s.addEventListener('scroll',upd,{passive:true});
  window.__detailSticky=()=>{s.classList.remove('stuck');requestAnimationFrame(upd)};
  window.__chipLock=()=>{lock=Date.now()+700};
})();

/* start: #cat-<id>, #all, #search, #cart, #demo (корзина с анализами) */
const start=(location.hash||'').slice(1);
cur={s:'home'}; show('s-home');
const demo=()=>['Пролактин','Билирубин общий','Глюкоза','Ферритин'].forEach(n=>{const i=DATA.items.find(x=>x.name===n||x.name.startsWith(n));if(i)addCart(i.id)});
const m=start.match(/^cat-(\w+)$/);
if(m&&cats[m[1]]) go({s:'cat',c:m[1],q:''});
else if(start==='all') go({s:'cat',c:'all',q:''});
else if(start==='search') go({s:'gs',q:''});
else if(start==='cart'){demo();go({s:'cart'});}
else if(start==='map'){demo();go({s:'cart'});go({s:'map'});}
else if(start==='lab'){demo();LAB=LABS[0];go({s:'cart'});}
})();
