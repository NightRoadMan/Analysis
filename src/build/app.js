(function(){
'use strict';
const $=s=>document.querySelector(s);
const SC={ev:()=>{}}; // режим «Сценарии»: хуки событий, заполняется ниже
const $$=s=>[...document.querySelectorAll(s)];
const items={}; DATA.items.forEach(i=>items[i.id]=i);
const UNIQ=(()=>{const seen=new Set();return DATA.items.filter(i=>{const k=i.name.toLowerCase();if(seen.has(k))return false;seen.add(k);return true})})(); // «Все» без повторов между категориями
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
let ONE=null;          // «Записаться на 1 анализ» (ТЗ 2.6, 2.12.3): {id,L} — оформление мимо корзины
const curLab=()=>ONE?ONE.L:LAB;
let PATIENT=0;
const PATIENTS=[
  {n:'Смирнова Ксения Алексеевна',d:'06.08.1989 (37 лет)',img:ASSET.woman},
  {n:'Смирнов Дмитрий Андреевич',d:'14.03.1987 (39 лет)',img:ASSET.man},
  {n:'Смирнов Миша Дмитриевич',d:'21.05.2017 (9 лет)',img:ASSET.child},
];
const BALANCE=2190;
const FX='<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const PTS_PER=50; // баллы за каждый анализ (баннер в детальке, корзина)
const fmt0=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
let PAY={method:'card',consent:true,usePts:true,brkOpen:true};
// вид кнопки в списках задан макетами: поиск и корзина — мини, категории и популярные — «В корзину»
const PDATA=[
  {f:'Смирнова',i:'Ксения',o:'Алексеевна',b:'06.08.1989',g:'f'},
  {f:'Смирнов',i:'Дмитрий',o:'Андреевич',b:'14.03.1987',g:'m'},
  {f:'Смирнов',i:'Миша',o:'Дмитриевич',b:'21.05.2017',g:'m'},
];
let PF=null; // поля экрана «Данные пациента»
const CONTACT={phone:'+7 911 167 45 67',email:'analysis@napopravku.ru'};

/* ---------- navigation ---------- */
const stack=[]; let cur=null;
const VITRINA=new Set(['s-cat','s-ctg','s-detail']); // экраны, где плавает мини-корзина
const TABS={'s-home':'home','s-orders':'orders'}; // экраны с таббаром: главная и «Мои записи»
function show(id){CUR_ID=id;
  $$('.scr').forEach(s=>s.hidden=s.id!==id);
  const tb=TABS[id]; $('#tabbar').hidden=!tb; if(tb)$$('#tabbar .tbi').forEach(b=>{const on=b.dataset.tab===tb;b.classList.toggle('on',on);b.setAttribute('aria-current',on?'page':'false')});
  updateFooters(id);
}
function render(view){
  if(ONE&&!['pat','co','res','ok','fail'].includes(view.s)) ONE=null; // запись на 1 анализ живёт только в оформлении
  if(view.s==='home') show('s-home');
  else if(view.s==='clinic'){CL.src=view.src;CL.ctx=view.ctx||null;CL.tab=view.tab||'info';show('s-clinic');renderClinic();}
  else if(view.s==='orders'){show('s-orders');renderOrders();}
  else if(view.s==='order'){show('s-order');renderOrder();}
  else if(view.s==='gs'){renderGS(view.q||'');show('s-gs');}
  else if(view.s==='an'){renderAn();show('s-an');}
  else if(view.s==='cat'){renderCat();show('s-cat');}
  else if(view.s==='ctg'){renderCtg();show('s-ctg');}
  else if(view.s==='detail'){renderDetail(view.id);show('s-detail');}
  else if(view.s==='cart'){renderCart();show('s-cart');}
  else if(view.s==='map'){show('s-map');renderMap(true);}
  else if(view.s==='pat'){renderPat();show('s-pat');}
  else if(view.s==='co'){renderCO();show('s-co');}
  else if(view.s==='res'){renderRes();show('s-res');}
  else if(view.s==='ok'){renderOK(view);show('s-ok');}
  else if(view.s==='fail'){show('s-fail');}
}
let CUR_ID='s-home', NOANIM=true;
/* iOS push/pop: новый экран въезжает справа, старый уходит на 30% влево; назад наоборот */
const CHROME=['#tabbar','#f-cart','#f-detail','#f-page','#f-clinic'];
const visScr=()=>{const e=document.getElementById(CUR_ID);return e&&!e.hidden?e:document.querySelector('.scr:not([hidden])')};
const visChrome=()=>CHROME.map(q=>$(q)).filter(e=>!e.hidden);
function snap(){const el=visScr();return el?{el,top:el.scrollTop,chrome:visChrome()}:null}
function slide(prev,dir){
  const next=visScr();
  if(NOANIM||!prev||!next||prev.el===next||!next.animate||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.getAnimations().forEach(a=>{if(a.id==='nav')a.finish()});
  const nextChrome=visChrome(), push=dir>0;
  const prevChrome=prev.chrome.filter(e=>!nextChrome.includes(e));
  prev.el.hidden=false; prev.el.scrollTop=prev.top; prevChrome.forEach(e=>e.hidden=false);
  const zp=push?1:3, zn=push?3:1;
  const set=(e,z)=>{e.style.zIndex=z};
  set(prev.el,zp); prevChrome.forEach(e=>set(e,zp+1)); set(next,zn); nextChrome.forEach(e=>set(e,zn+1));
  const o={duration:420,easing:'cubic-bezier(.32,.72,0,1)',id:'nav'};
  const IN=push?[{transform:'translateX(100%)'},{transform:'translateX(0)'}]:[{transform:'translateX(-30%)'},{transform:'translateX(0)'}];
  const OUT=push?[{transform:'translateX(0)'},{transform:'translateX(-30%)'}]:[{transform:'translateX(0)'},{transform:'translateX(100%)'}];
  const top=push?next:prev.el; top.style.boxShadow='-10px 0 30px rgba(0,0,0,.14)';
  const shade=document.createElement('div'); shade.className='navshade'; shade.style.zIndex=2; $('#ph').appendChild(shade);
  shade.animate(push?[{opacity:0},{opacity:1}]:[{opacity:1},{opacity:0}],o);
  [next,...nextChrome].forEach(e=>e.animate(IN,o));
  const anims=[prev.el,...prevChrome].map(e=>e.animate(OUT,o));
  anims[0].finished.catch(()=>{}).then(()=>{
    prev.el.hidden=prev.el.id!==CUR_ID;
    prevChrome.forEach(e=>e.hidden=true); updateFooters(CUR_ID);
    [prev.el,next,...prev.chrome,...nextChrome].forEach(e=>{e.style.zIndex='';e.style.boxShadow=''});
    shade.remove();
  });
}
function go(view,push=true,anim=push){
  const prev=snap();
  if(push&&cur){cur.scroll=prev?prev.top:0;stack.push(cur);}
  cur=view; closeSheet(); render(view);
  const el=document.querySelector('.scr:not([hidden])'); if(el){el.scrollTop=view.scroll&&!push?view.scroll:0;CUR_ID=el.id}
  if(anim) slide(prev,1);
  SC.ev('scr:'+view.s);
}
function back(){
  const prev=snap();
  const v=stack.pop(); if(!v){go({s:'home'},false);return}
  cur=v; closeSheet(); render(v); const el=document.querySelector('.scr:not([hidden])'); if(el){el.scrollTop=v.scroll||0;CUR_ID=el.id}
  slide(prev,-1);
  SC.ev('scr:'+v.s);
}
function resetTo(view,dir){const prev=snap();stack.length=0;cur=null;go(view,false,false);if(dir)slide(prev,dir)}
function curScr(){return CUR_ID}

/* ---------- cart core ---------- */
const inCart=id=>cart.has(id);
function addCart(id){if(!cart.has(id)){cart.set(id,{on:true});if(LAB&&!labHas(LAB,id))cart.get(id).on=false}}
function delCart(id){cart.delete(id)}
function toggleCart(id){inCart(id)?delCart(id):addCart(id)}
function refresh(){
  $$('[data-cart]').forEach(b=>{b.outerHTML=b.dataset.k?rowBtn(b.dataset.cart,b.dataset.k):btnHTML(b.dataset.cart,b.dataset.up)});
  if(cur&&cur.s==='detail'){setDetailAdd(cur.id);updWhere();}
  if(cur&&cur.s==='clinic') clRefreshList();
  updateFooters(curScr());
}
function btnHTML(id,up){
  const u=up?` data-up="1"`:'';
  return inCart(id)
    ? `<button class="btn in" data-cart="${id}"${u}>${ic('check',20)}В корзине</button>`
    : `<button class="btn" data-cart="${id}"${u}>${ic('basketW',24)}Добавить в корзину</button>`;
}
function updateFooters(id){
  const n=cart.size;
  $('#f-cart').hidden=!(n>0&&(id==='s-cat'||id==='s-an'||id==='s-ctg')&&$('#dim').hidden);
  $('#f-cart-n').textContent=anW(n);
  $('#f-detail').hidden=id!=='s-detail';
  const c=$('#d-cnt'); c.hidden=!n; c.textContent=n;
  $('#f-page').hidden=!['s-cart','s-pat','s-co','s-res','s-ok','s-fail'].includes(id);
  if(!$('#f-page').hidden) renderPageFooter(id);
  if(id==='s-clinic') renderClinicFooter(); else $('#f-clinic').hidden=true;
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
/* строка списка: mini — круглая кнопка (поиск, корзина; Figma 562:46676), full — «В корзину» (категории, популярные, допродажа; Figma 562:61332) */
function rowBtn(id,mode){
  const on=inCart(id);
  return mode==='full'
    ? `<button class="cbtn2${on?' in':''}" data-cart="${id}" data-k="full">${on?ic('check',16):ic('basketW',16)}${on?'В корзине':'В корзину'}</button>`
    : `<button class="cbtn${on?' in':''}" data-cart="${id}" data-k="mini" aria-label="${on?'В корзине':'В корзину'}">${on?ic('check',24):ic('basketW',28)}</button>`;
}
function rowHTML(i,mode,tags){
  return `<article class="srow tap" data-open="${i.id}">
    <div class="sl"><div class="cn">${esc(i.name)}</div><div class="cc">${clinicWord(i.clinics)}</div>${tags?`<div class="tags">${tagsHTML(i)}</div>`:''}<span class="pr"><i>от</i><b>${fmt(i.price)}</b></span></div>${rowBtn(i.id,mode||'mini')}
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


/* ---------- «Анализы»: главная витрины (Figma 466:134038) ---------- */
const CATSUB={vitamins:'Дефициты и избытки',biochemistry:'Печень, почки, обмен веществ',hormones:'Щитовидная железа, половые',hematology:'Исследования крови',infections:'ПЦР и антитела',allergy:'Панели аллергенов: пыльца, еда, животные',tumor_markers:'Оценка рисков',general:'Моча, кал'};
const TILES=['vitamins','biochemistry','hematology','infections','hormones','allergy','tumor_markers','general']; // сетка 2×4 по макету
const POPULAR_OLD=(()=>{
  const out=[],have=new Set(),add=i=>{if(i&&!have.has(i.name)){have.add(i.name);out.push(i)}};
  [/^Глюкоза$/,/АЛТ/,/^Ферритин/,/Гомоцистеин/].forEach(re=>add(UNIQ.find(i=>re.test(i.name))));
  return out;
})();
const FAQ=[
  ['Как подготовиться к сдаче анализов?','Подготовка зависит от анализа: для большинства исследований крови нужно прийти натощак, утром с 8 до 11, после 8–12 часов без еды. Накануне исключите алкоголь, жирную пищу и интенсивные тренировки. Точные правила для каждого анализа указаны в его карточке и в корзине в блоке «Подготовка».'],
  ['Когда будут готовы результаты?','Срок указан в карточке каждого анализа: чаще всего это 1–3 рабочих дня. Когда результаты будут готовы, пришлём уведомление и письмо на почту.'],
  ['Можно ли сдать все анализы из корзины в одном месте?','Да. На карте видно, в каких лабораториях есть все анализы из корзины. Если какой-то анализ в выбранной лаборатории не делают, мы покажем это до оплаты.'],
  ['Как оплатить анализы в приложении?','Оформите заказ в корзине и оплатите картой или Sber Pay. Часть суммы можно списать баллами. После оплаты заказ действует 14 дней.'],
  ['Где посмотреть результаты анализов?','Результаты появятся в разделе «Мои записи» и в медкарте. Копию пришлём на почту, которую вы указали при оформлении.'],
];
const studyW=n=>`${n}${nb}${plural(n,'исследование','исследования','исследований')}`;
function tileHTML(cid){
  const c=cats[cid], imgs=(CATIMG[cid]||[]).map((u,k)=>`<i class="aimg a${k+1}" style="background-image:url(${u})"></i>`).join('');
  return `<button class="atile t-${cid}" data-cat="${cid}" aria-label="${c.title}"><span class="atx"><b>${c.title}</b><span>${CATSUB[cid]||''}</span></span>${imgs}</button>`;
}
const POP8=['25-ОН витамин D','Ферритин','Пролактин','Тестостерон','Железо сыворотки','Сифилис RPR','Опухолевый маркёр HE4','Хеликобактер пилори'].map(n=>DATA.items.find(i=>i.name===n||i.name.startsWith(n))).filter(Boolean);
const PLUS='<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6v12M6 12h12" stroke="#F3AA00" stroke-width="2" stroke-linecap="round"/></svg>';
function renderAn(){
  $('#an-total').textContent=studyW(UNIQ.length);
  renderAnBody();
}
function renderAnBody(){
  $('#an-body').innerHTML=`<div class="secs" style="padding-bottom:0">
    <div class="sec agrid-w"><div class="agrid">${TILES.map(tileHTML).join('')}</div></div>
    <div class="sec slist apop"><div class="sh">Популярные анализы</div><div class="rows3">${POP8.map(i=>rowHTML(i,'full')).join('')}</div></div>
    <div class="sec afaq"><button class="sh" data-act="soon">Частые вопросы <span style="color:var(--accent);display:flex">${SV.chevR}</span></button>
      <div class="faq">${FAQ.map(([q,a],k)=>`<div class="fq" data-fq="${k}"><button class="fqh" data-act="fq" aria-expanded="false"><span>${q}</span><i>${PLUS}</i></button><div class="fqa">${a}</div></div>`).join('')}</div></div>
  </div>`;
  anBar();
}
function anBar(){
  const s=$('#s-an'), h=$('#an-hero'), b=$('#an-bar'); if(!h||s.hidden) return;
  b.classList.toggle('sc',s.scrollTop>=h.offsetHeight-4);
}
$('#s-an').addEventListener('scroll',anBar,{passive:true});

/* ---------- search (Figma 562:46676): без чипсов, «Отмена» — назад ---------- */
function renderCat(){
  const q=cur.q||'', qq=q.trim();
  const cq=$('#cq'); if(cq.value!==q) cq.value=q; $('#cq-wrap').classList.toggle('has',!!q);
  const list=qq?search(q,UNIQ):POP8;
  const title=qq?`Анализы <em>${list.length}</em>`:'Рекомендации';
  $('#cat-body').innerHTML=`<div class="sec slist"><div class="sh">${title}</div><div class="rows3">${
    list.length?list.map(i=>rowHTML(i,'mini')).join(''):`<div class="empty"><b>Ничего не нашли</b><span>Проверьте написание или попробуйте другое название.</span></div>`
  }</div></div>`;
}
/* ---------- category (Figma 562:61332): плитка витрины → категория, чипсы с количеством ---------- */
function renderCtg(keep){
  const cid=cur.c&&cats[cur.c]?cur.c:TILES[0]; cur.c=cid;
  const cc=$('#ctg-chips');
  if(keep&&cc.children.length) [...cc.children].forEach(c=>c.classList.toggle('on',c.dataset.chip===cid)); // лента чипсов остаётся на месте
  else{cc.innerHTML=TILES.map(id=>`<button class="chip${id===cid?' on':''}" data-chip="${id}">${esc(cats[id].title)}<i>${cats[id].items.length}</i></button>`).join('');
    requestAnimationFrame(()=>{const on=cc.querySelector('.on'); if(on) cc.scrollTo({left:on.offsetLeft-16})});}
  const list=cats[cid].items.map(id=>items[id]).sort((a,b)=>b.clinics-a.clinics);
  $('#ctg-body').innerHTML=`<div class="sec slist"><div class="sh">${esc(cats[cid].title)}</div><div class="rows3">${list.map(i=>rowHTML(i,'full',true)).join('')}</div></div>`;
}

/* ---------- upsell sheet ---------- */
function cartRecs(ids){ // как в макете 575:72760: популярные, без того, что уже в корзине
  const r=POP8.filter(i=>!cart.has(i.id)).slice(0,7); return r.length>=5?r:r.concat(related(ids,7-r.length)).slice(0,7);
}
function related(ids,n){
  const have=new Set([...cart.keys(),...ids]); const out=[];
  ids.forEach(id=>{const c=cats[items[id].cat]; c.items.forEach(x=>{if(!have.has(x)&&out.length<n*3){out.push(items[x]);have.add(x)}})});
  const fill=['Ферритин','Гомоцистеин','Группа крови и резус-фактор'];
  out.sort((a,b)=>rnd(a.id+ids.join())-rnd(b.id+ids.join()));
  return out.slice(0,n);
}
function openUpsell(id){ // только при добавлении с детальки анализа (Figma 564:63433)
  SC.ev('upsell');
  const i=items[id];
  openSheet(`<div class="sbody">
    <div class="csec upok" style="border-radius:0 0 24px 24px;padding-top:0">
      <div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div>
      <div class="upill">${SUCCESS}</div>
      <h2>Добавили в корзину</h2>
      <div class="upitem"><div class="tx"><b>${esc(i.name)}</b><span>${clinicWord(i.clinics)}</span></div><span class="pr"><i>от</i><b>${fmt(i.price)}</b></span></div>
    </div>
    <div class="csec slist" style="padding-bottom:4px"><div class="sh">Вместе с этим сдают</div><div class="rows3">${related([id],4).map(x=>rowHTML(x,'full')).join('')}</div></div>
  </div>
  <div class="sfoot"><button class="big in wide" data-act="close">Продолжить покупки</button><button class="gocart" data-act="cart" id="up-go"><span class="t"><b>Перейти в корзину</b><span>${anW(cart.size)}</span></span>${CHEVW}</button>${hi()}</div>`);
}
/* ---------- часы забора (Figma 571:66491) ---------- */
const HOURS=[['Понедельник','07:30—19:00'],['Вторник','07:00—19:30'],['Среда','07:30—19:00'],['Четверг','08:00—20:00'],['Пятница','07:30—17:00'],['Суббота','08:00—14:00'],['Воскресенье','Выходной']];
const today=()=>(new Date().getDay()+6)%7;
const hoursToday=()=>{const h=HOURS[today()][1];return h.includes('—')?'Забор до '+h.split('—')[1]:'Сегодня выходной'};
function openHours(){
  const td=today();
  openSheet(`<div class="sbody"><div class="csec" style="border-radius:0 0 24px 24px;padding-top:0;gap:8px">
    <div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div>
    <div class="sh" style="font-size:22px;line-height:28px">Часы забора биоматериала</div>
    <div class="hrs">${HOURS.map(([d,h],k)=>`<div class="hr${k===td?' on':''}"><span>${d}</span><b>${h}</b></div>`).join('')}</div>
  </div></div>
  <div class="sfoot"><button class="big wide" data-act="close">Понятно</button>${hi()}</div>`);
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
    <button class="coinb" data-act="coininfo"><span>Получи</span><span class="c50">+50${SV.coinY}</span><span>за каждый анализ</span><span class="ii">${SV.infoC}</span><i class="gift" style="background-image:url(${ASSET.gift})"></i></button>
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
  $$('#b-where .lhrs b').forEach(b=>b.textContent=hoursToday());
  setDetailAdd(id); updWhere(); window.__detailSticky&&window.__detailSticky();
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
function labHas(L,id){return L.cov>=1||(L.always&&L.always.has(id))||rnd(L.id+'|'+id)<L.cov}
function labPrice(L,id){if(L.px){const p=pxOf(L,id);if(p!=null)return p} return L.w?r10(items[id].price*L.f):r10(items[id].price*L.f*(.92+rnd(id+L.id)*.16))}
/* филиалы из карточек «Где сдать» на детальке: выбор филиала прямо оттуда (ТЗ 2.6) */
function wlab(k){const w=WLABS[k];return {id:'w'+k,w:1,x:MC[0],y:MC[1],brand:BRANDS.find(b=>b.k===w.brand)||BRANDS[0],n:w.n,a:w.a,metro:w.metro,mc:w.mc,md:w.md,rate:'4,5',rev:36,cov:w.brand==='gem'?.55:1,f:w.base/CLINIC_BASE,pts:true,hours:['7:30—19:00','8:00—14:00']}}
const PIN_W='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>';
function updWhere(){ // вариант A: «В корзине» у выбранного филиала, «Сдать здесь» у остальных, пока анализ в корзине
  const id=cur&&cur.id; if(!id) return;
  const inC=inCart(id), labW=LAB&&String(LAB.id).startsWith('w');
  document.querySelectorAll('#b-where [data-clinic-add]').forEach(b=>{
    const wid='w'+b.dataset.wk, sel=!!(inC&&LAB&&LAB.id===wid), here=inC&&!sel;
    const ico=b.firstElementChild, tx=b.lastElementChild, book=b.nextElementSibling;
    if(ico&&!b.dataset.ico) b.dataset.ico=ico.innerHTML;
    if(ico) ico.innerHTML=sel?ic('check',24):here?PIN_W:b.dataset.ico;
    if(tx) tx.textContent=sel?'В корзине':here?'Сдать здесь':'Добавить в корзину';
    b.classList.toggle('inc',sel); b.classList.toggle('here',here);
    b.setAttribute('role','button'); b.setAttribute('aria-label',sel?'В корзине, убрать из корзины':here?'Сдать здесь':'Добавить в корзину');
    if(book) book.hidden=inC;
    // под ценой: разница с выбранным филиалом
    const cp=b.closest('[data-clinic-add]').parentElement.previousElementSibling;
    let dl=cp&&cp.nextElementSibling&&cp.nextElementSibling.classList.contains('wdelta')?cp.nextElementSibling:null;
    const showD=LAB&&LAB.id!==wid&&(inC||cart.size>0);
    if(showD&&cp&&cp.classList.contains('cp')){
      const d=labPrice(wlab(+b.dataset.wk),id)-labPrice(LAB,id);
      if(!dl){dl=document.createElement('small');dl.className='wdelta';cp.after(dl)}
      dl.className='wdelta'+(d<0?' cheap':'');
      dl.textContent=d?`На ${fmt(Math.abs(d))} ${d<0?'дешевле':'дороже'}, чем в ${LAB.n}`:`Как в ${LAB.n}`;
    } else if(dl) dl.remove();
  });
}
/* ТЗ 2.6 в виде БШ: «Этот анализ уже добавлен для {филиал}. Заменить на {новый}?» */
function replaceSheet(id,W,after){
  const inC=inCart(id), miss=[...cart.keys()].filter(x=>x!==id&&!labHas(W,x));
  const lead=inC?'Этот анализ уже добавлен':`Анализы в корзине (${cart.size}) уже добавлены`;
  window.__rep=()=>{closeSheet();after();toast(`Филиал заменён на ${W.n}`);SC.ev('rep')};
  openSheet(`<div class="sbody"><div class="csec" style="border-radius:0 0 24px 24px;padding-top:0;gap:12px">
    <div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div>
    <div class="sh" style="font-size:22px;line-height:28px">Заменить филиал?</div>
    <p class="rpl">${lead} для <b>${esc(LAB.n)}</b>. Заменить на <b>${esc(W.n)}</b>?</p>
    ${miss.length?`<div class="warn">${SV.alert}<div>${miss.length>1?'Анализы не доступны':'Анализ не доступен'} для сдачи в ${esc(W.n)}:<p>${esc(miss.map(x=>shortName(items[x].name)).join(', '))}</p></div></div>`:''}
  </div></div>
  <div class="sfoot"><button class="big wide" data-act="rep-yes">Да, заменить</button><button class="lnk" data-act="close">Нет</button>${hi()}</div>`);
}
function labFor(L,ids){
  const avail=ids.filter(id=>labHas(L,id)), miss=ids.filter(id=>!labHas(L,id));
  return {k:avail.length,N:ids.length,full:!miss.length,miss,avail,p:avail.reduce((a,id)=>a+labPrice(L,id),0)+(avail.some(id=>isBlood(items[id]))?380:0)};
}
const shortName=n=>{let s=n.split(/[(,:]/)[0].trim();return s};
const fullCount=ids=>LABS.filter(L=>ids.every(id=>labHas(L,id))).length;

/* ---------- cart screen ---------- */
const checkedIds=()=>[...cart.entries()].filter(([id,v])=>v.on).map(([id])=>id);
function cartTotals(){
  if(ONE){const id=ONE.id,sum=labPrice(ONE.L,id),blood=isBlood(items[id])?380:0;return {ids:[id],sum,blood,total:sum+blood}}
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
    // пустая корзина (Figma 439:111882): популярные — те же 8 анализов, строки с круглой кнопкой
    b.innerHTML=`<div class="csec"><div class="ebig"><div style="width:74px;height:74px;background:url(${ASSET.basket}) center/contain no-repeat"></div><h2>В корзине пока что пусто</h2><p>Добавьте анализы — покажем, в каких клиниках вашего города их можно сдать</p><button class="big" data-act="allan">Перейти к анализам</button></div></div>
    <div class="csec slist"><div class="sh">Популярные анализы</div><div class="rows3">${POP8.map(i=>rowHTML(i,'mini')).join('')}</div></div>`;
    return;
  }
  const ids=[...cart.keys()], allOn=ids.every(id=>cart.get(id).on||(LAB&&!labHas(LAB,id)));
  const elig=ids.filter(id=>!LAB||labHas(LAB,id)), onN=elig.filter(id=>cart.get(id).on).length, ckCls=onN&&onN===elig.length?' on':(onN?' mid':'');
  const t=cartTotals(), P=PATIENTS[PATIENT];
  const place=LAB?`<div class="csec"><div class="tapl" data-clplace="${LAB.id}">${labHead(LAB,'<button class="sbtn" data-act="tomap">Изменить</button>')}</div><div class="infobar"><span style="color:var(--ink)">${SV.info}</span>Срок сдачи 14 дней после оплаты</div></div>`
    :`<button class="csec pickrow" data-act="tomap" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.pin})"></span><span class="tx"><b>Выбрать клинику</b><span>Доступно в ${fullCount(checkedIds().length?checkedIds():ids)} ${plural(fullCount(ids),'клинике','клиниках','клиниках')}</span></span><span>${SV.chevR}</span></button>`;
  const row=id=>{const i=items[id],v=cart.get(id),miss=LAB&&!labHas(LAB,id);
    return `<div class="citem${(!v.on||miss)?' off':''}"><button class="cb${v.on&&!miss?' on':''}" data-ck="${id}" ${miss?'disabled':''} aria-label="Отметить"><i>${SV.tick}</i></button>
      <div class="b"><div class="n tap" data-open="${id}">${esc(i.name)}</div>${miss?`<div class="miss">Нет в этой лаборатории</div>`:`<span class="pr">${LAB?'':'<i>от</i>'}<b>${fmt(LAB?labPrice(LAB,id):i.price)}</b></span>`}<div class="m">Готовность за ${esc(i.days||'1 день')}</div></div>
      <div class="rc"><button class="sbtn sq" data-rm="${id}" aria-label="Удалить">${SV.trash}</button></div></div>`};
  const missN=LAB?ids.filter(id=>!labHas(LAB,id)).length:0;
  // один островок: «Выбрать всё», анализы, забор, итого и баллы (Figma 439:109975)
  b.innerHTML=`${place}
  <div class="csec cbox">
    <div class="ckrow"><button class="lrow" data-act="ckall" style="width:auto"><span class="cb${ckCls}" role="checkbox" aria-checked="${ckCls===' on'?'true':ckCls?'mixed':'false'}"><i>${SV.tick}</i></span><span style="font-size:14px;font-weight:600">Выбрать всё</span></button><button class="sbtn" data-act="clear-cart">Очистить</button></div>
    ${missN?`<div class="warn" style="margin-top:12px">${SV.alert}<div>${missN===1?'Один анализ нельзя сдать':'Не все анализы можно сдать'} в этой лаборатории<p>Сдайте ${anW(ids.length-missN)} здесь или выберите другую лабораторию.</p></div></div>`:''}
    <div class="clist">${ids.map(row).join('')}
    ${t.blood?`<div class="draw"><div class="n">Взятие крови из вены</div><span class="pr">${LAB?'':'<i>от</i>'}<b>${fmt(380)}</b></span></div>`:''}</div>
    <div class="tot"><span>Итого</span><span class="pr">${LAB?'':'<i>от</i>'}<b style="font-size:18px">${fmt(t.total)}</b></span></div>
    <div class="ptsrow"><div class="tx"><b>Начислим баллы</b><span>после сдачи в лаборатории-партнёре</span></div><span class="ptp lg">+${fmt0(t.ids.length*PTS_PER)}${SV.coinY}</span></div>
  </div>
  <button class="csec pickrow" data-act="prep" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.prep})"></span><span class="tx"><b>Подготовка к анализам</b><span>Чтобы результаты были точными</span></span><span>${SV.chevR}</span></button>
  <div class="csec slist"><div class="sh" style="font-size:22px;line-height:28px">Часто добавляют к этим анализам</div><div class="rows3">${cartRecs(ids).map(i=>rowHTML(i,'mini')).join('')}</div></div>`;
}
function renderPageFooter(id){
  const f=$('#f-page');
  if(id==='s-cart'){
    if(!cart.size){f.hidden=true;return}
    const t=cartTotals();
    f.innerHTML=`<button class="big wide two" data-act="${LAB?'checkout':'pickfirst'}" ${t.ids.length?'':'disabled'}><span class="t">Перейти к оформлению</span>${CHEVW}</button>${hi()}`;
  } else if(id==='s-pat'){
    f.innerHTML=`<button class="big wide two" data-act="patnext"><span class="t">Продолжить</span>${CHEVW}</button>${hi()}`;
  } else if(id==='s-co'){
    const t=cartTotals(), pts=ptsOff(t.total), pay=t.total-(PAY.usePts?pts:0);
    const bal=String(BALANCE).replace(/\B(?=(\d{3})+(?!\d))/g,nb);
    f.innerHTML=`<div class="pts-row${pts?'':' dis'}"><button class="sw${PAY.usePts&&pts?' on':''}" data-act="pts" role="switch" aria-checked="${!!(PAY.usePts&&pts)}" aria-label="Списать баллы" ${pts?'':'disabled'}></button><div class="tx"><b>Списать ${fmt(PTS_FIX)} баллами</b><span>${pts?`У вас ${SV.coinY} ${bal} баллов`:BALANCE<PTS_FIX?`Нужно ${PTS_FIX} баллов, у вас ${SV.coinY} ${bal}`:`Доступно для заказа дороже ${fmt(PTS_FIX)}`}</span></div></div>
      <button class="big wide paybtn" data-act="pay" ${PAY.consent?'':'disabled'}><span>Оплатить ${fmt(pay)}</span><span class="sep"></span><span class="bn">${SV.coinY}+${fmt0(t.ids.length*PTS_PER)}</span></button>${hi()}`;
  } else if(id==='s-res'){
    f.innerHTML=`<button class="big wide" data-act="resok">Даю согласие</button><button class="lnk" data-act="resskip">Пропустить</button>${hi()}`;
  } else if(id==='s-ok'){
    f.innerHTML=`<button class="big wide" data-act="home">Хорошо</button>${hi()}`;
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
  </div><div class="sfoot"><button class="lnk" data-act="pdf" style="height:44px">Отправить как PDF</button><button class="big wide" data-act="close">Отлично</button>${hi()}</div>`);
}

/* ---------- patient data (Figma 518:32601) ---------- */
function patFill(k){const d=k!=null&&k>=0?PDATA[k]:{f:'',i:'',o:'',b:'',g:'m'};PF={...d,k,phone:CONTACT.phone,email:CONTACT.email,err:{}};}
function fld(k,label,req,opts){
  const v=PF[k]||'', e=PF.err[k];
  return `<label class="fld${v?' has':''}${e?' err':''}"><span class="fl">${label}${req?'<i>*</i>':''}</span><input data-f="${k}" value="${esc(v)}" placeholder="${label}" ${opts||''} autocomplete="off"><button class="fx" type="button" data-act="fclear" data-fk="${k}" aria-label="Очистить">${CLEARIC}</button></label>${e?`<div class="ferr">${e}</div>`:''}`;
}
function renderPat(){
  if(!PF) patFill(null); // пустая форма, предзаполнение — по чипсе
  const chips=PATIENTS.map((p,k)=>`<button class="pchip${k===PF.k?' on':''}" data-pk="${k}">${esc(p.n)}</button>`).join('')+`<button class="pchip${PF.k===-1?' on':''}" data-pk="-1">+ Новый пациент</button>`;
  $('#pat-body').innerHTML=`
  <div class="csec pform"><div class="sh" style="font-size:22px;line-height:28px">Кто будет сдавать</div>
    <p class="pdesc">Указывайте данные, как в документе того, кто сдаёт. В лаборатории попросят его паспорт или другой документ</p>
    <div class="pchips hscroll">${chips}</div>
    ${fld('f','Фамилия',1)}${fld('i','Имя',1)}${fld('o','Отчество',0)}${fld('b','Дата рождения',1,'inputmode="numeric" maxlength="10"')}
    <div class="glab">Пол</div><div class="gseg" role="radiogroup" aria-label="Пол"><button data-g="m" role="radio" aria-checked="${PF.g==='m'}" class="${PF.g==='m'?'on':''}">Мужчина</button><button data-g="f" role="radio" aria-checked="${PF.g==='f'}" class="${PF.g==='f'?'on':''}">Женщина</button></div>
    <div class="sh" style="font-size:22px;line-height:28px;margin-top:16px">Контакты</div>
    ${fld('phone','Номер телефона',1,'inputmode="tel"')}${fld('email','Эл. почта',1,'inputmode="email"')}
    <div class="pinfo">${SV.infoC}Пришлём результаты анализов на эту почту</div>
  </div>`;
}
function patValid(){
  const e={}; const need={f:'Укажите фамилию',i:'Укажите имя',b:'Укажите дату рождения',phone:'Укажите номер телефона',email:'Укажите почту'};
  Object.entries(need).forEach(([k,m])=>{if(!(PF[k]||'').trim())e[k]=m});
  if(!e.b&&!/^\d{2}\.\d{2}\.\d{4}$/.test(PF.b.trim()))e.b='Дата в формате ДД.ММ.ГГГГ';
  if(!e.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(PF.email.trim()))e.email='Проверьте адрес почты';
  if(!PF.g)e.g=1;
  PF.err=e; return !Object.keys(e).length;
}

/* ---------- checkout ---------- */
const PTS_FIX=500; // списать можно только ровно 500 баллов: это и минимум, и максимум
const ptsOff=total=>BALANCE>=PTS_FIX&&total>PTS_FIX?PTS_FIX:0;
function renderCO(){
  const t=cartTotals();
  const pm=[['sber','Sber Pay',`<svg width="44" height="22" viewBox="0 0 44 22"><rect x=".75" y=".75" width="42.5" height="20.5" rx="10.25" fill="none" stroke="#21A038" stroke-width="1.5"/><circle cx="11" cy="11" r="6" fill="none" stroke="#21A038" stroke-width="1.6"/><path d="m8.5 11 1.8 1.8 3.4-3.6" fill="none" stroke="#21A038" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="20" y="15" font-family="Montserrat,sans-serif" font-size="11" font-weight="700" fill="#21A038">Pay</text></svg>`],
    ['card','Банковская карта',`<svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="2" width="28" height="19" rx="3" fill="#D7D9DE"/><rect x="1" y="6" width="28" height="3.5" fill="#B5B9C2"/><rect x="4" y="13" width="9" height="3" rx="1" fill="#fff"/><circle cx="27" cy="20" r="6" fill="#6ABF68"/><path d="M27 17v6M24 20h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`],
    ['foreign','Карта банка другой страны',`<svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="2" width="28" height="19" rx="3" fill="#D7D9DE"/><rect x="1" y="6" width="28" height="3.5" fill="#B5B9C2"/><rect x="4" y="13" width="9" height="3" rx="1" fill="#fff"/><circle cx="27" cy="20" r="6" fill="#4F9FE8"/><path d="M21.5 20h11M27 14.5c2 2 2 9 0 11M27 14.5c-2 2-2 9 0 11" stroke="#fff" stroke-width="1.1" fill="none"/></svg>`]];
  $('#co-body').innerHTML=`
  <div class="csec"><button class="ttl${PAY.brkOpen?' open':''}" data-act="brk"><span>Итого</span><span class="v">${fmt(t.total)}${SV.chevUp}</span></button>
    ${PAY.brkOpen?`<div class="brk">${t.ids.map(id=>`<div><span>${esc(shortName(items[id].name))}</span><b>${fmt(labPrice(curLab(),id))}</b></div>`).join('')}${t.blood?`<div><span>Взятие крови из вены</span><b>${fmt(380)}</b></div>`:''}${PAY.usePts&&ptsOff(t.total)?`<div class="ptsl"><span>Оплата баллами</span><b>−${fmt(ptsOff(t.total))}</b></div>`:''}</div>`:''}
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
    PAID={lab:curLab(),total,ids:t.ids.slice(),until:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}),untilD:d,pts:PAY.usePts?ptsOff(t.total):0};
    PAID.order=addOrder(PAID); // заказ сразу в «Моих записях» со статусом «Оформляем заказ»
    if(!ONE) t.ids.forEach(id=>cart.delete(id));
    resetTo({s:'res'});
  },1300);
}
function renderRes(){ // Figma 557:39952: согласие на получение результатов, между оплатой и успехом
  $('#res-body').innerHTML=`<div class="csec resc">
    <h2>Результаты анализов<br>в НаПоправку</h2>
    <p class="pdesc">Чтобы результаты приходили в НаПоправку, нужно ваше согласие.</p>
    <div class="rlist">
      <div><i style="background-image:url(${ASSET.res1})"></i><span>Результаты появятся в «Моих записях»</span></div>
      <div><i style="background-image:url(${ASSET.res2})"></i><span>Видно, какие анализы уже готовы</span></div>
      <div><i style="background-image:url(${ASSET.res3})"></i><span>Открыть их можно в приложении на телефоне</span></div>
    </div>
    <div class="rnote"><p>Нажимая «Даю согласие», вы принимаете <u>согласие на получение результатов в НаПоправку</u>.</p><p>Без согласия результаты можно будет получить только в лаборатории.</p></div>
  </div>`;
}
function renderOK(){
  const P=PAID; if(!P){return}
  const L=P.lab;
  $('#ok-body').innerHTML=`<div class="okbox"><div style="width:171px;height:120px;display:flex;align-items:center;justify-content:center">${SUCCESS}</div><h1>Заказ оплачен<br>${fmt(P.total)}</h1><div class="s">Вам будет начислено ${SV.coinY} ${fmt0(P.ids.length*PTS_PER)}</div></div>
  <div style="display:flex;flex-direction:column;gap:8px">
  <button class="csec pickrow" data-act="prep-paid" style="flex-direction:row"><span class="illu" style="background-image:url(${ASSET.prep})"></span><span class="tx"><b>Подготовка к анализам</b><span>Чтобы результаты были точными</span></span><span>${SV.chevR}</span></button>
  <div class="csec" style="gap:24px">
    <div class="irow">${SV.cal}<div class="tx"><b>Сдать анализы нужно до ${P.until}</b><span class="k">Заказ действителен 14 дней</span></div></div>
    <div class="irow">${SV.pinO}<div class="tx"><b>${esc(L.n)}</b><span>${esc(L.a)}</span><span class="mt"><u style="background:${L.mc}"></u>${esc(L.metro)}, ${L.md}</span></div></div>
    <div class="irow">${SV.clock}<div class="tx"><b>Часы приёма биоматериала</b><span class="k">С понедельника по пятницу</span><span>${L.hours[0]}</span><span class="k">С субботы по воскресенье</span><span>${L.hours[1]}</span></div></div>
    <div class="pass"><span style="display:flex;gap:8px;align-items:center">${SV.infoC}Не забудьте взять с собой паспорт</span><span class="im" style="background-image:url(${ASSET.passport})"></span></div>
  </div>
  </div>`;
}

/* ---------- sheet & dialog & toast ---------- */
function openSheet(html){const s=$('#sheet');s.innerHTML=html;$('#dim').hidden=false;updateFooters(curScr());}
function closeSheet(){if(!$('#dim').hidden){$('#dim').hidden=true;updateFooters(curScr());if(cur&&cur.s==='cat')renderCat();if(cur&&cur.s==='ctg')renderCtg(true);if(cur&&cur.s==='an')renderAnBody();}}
function dialog(title,text,acts){
  const d=$('#dlg'); d.innerHTML=`<div class="box" role="alertdialog" aria-modal="true"><h3>${title}</h3>${text?`<p>${text}</p>`:''}<div class="acts">${acts.map((a,k)=>`<button class="big${k?' in':''}" data-dlg="${k}">${a[0]}</button>`).join('')}</div></div>`;
  d.hidden=false; d.onclick=e=>{const b=e.target.closest('[data-dlg]'); if(b){d.hidden=true;acts[+b.dataset.dlg][1]()} else if(e.target===d) d.hidden=true;};
}
let tt; function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800)}

/* =================== MAP =================== */
const PEEK=104;
const MV={s:0.9,x:0,y:0,sheet:'peek',sel:null,card:false,place:null,brands:new Set(),pts:false,full:false,q:'',searching:false,inited:false};
const vp=$('#m-vp'), world=$('#m-world'), layer=$('#m-layer');
const vpW=()=>vp.clientWidth, vpH=()=>vp.clientHeight;
const HDR=98;
function sheetH(){const H=vpH(),hh=($('#s-map .mhdr')||{}).offsetHeight||HDR;return MV.card?0:(MV.sheet==='peek'?PEEK:MV.sheet==='half'?Math.round(H*0.5):H-hh)}
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
  return LABS.filter(L=>(!MV.brands.size||MV.brands.has(L.brand.k))&&(!MV.pts||L.pts)&&(!MV.full||labFor(L,ids).full)&&labFor(L,ids).k>0);
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
  el.innerHTML=head+(arr.length?arr.map(o=>lcardHTML(o.L,ids,o.d!=null?distTxt(o.d)+' от места':'')).join(''):`<div class="empty"><b>Здесь нет лабораторий</b><span>Сдвиньте или отдалите карту${MV.brands.size||MV.pts||MV.full?', или сбросьте фильтры':''}.</span></div>`);
}
function chipsHTML(){
  const bn=MV.brands.size?(MV.brands.size===1?BRANDS.find(b=>MV.brands.has(b.k)).n:`Сети: ${MV.brands.size}`):'Лаборатория';
  const pl=MV.place&&!MV.place.me?MV.place.n:'Район или метро';
  const okI='<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.25" stroke="#F3AA00" stroke-width="1.5"/><path d="m5.4 8.1 1.8 1.8 3.4-3.6" stroke="#F3AA00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // чипсы-фильтры (Figma 518:32466): выбранный — жёлтая обводка и крестик сброса
  const X=k=>`<span class="fx" data-act="${k}" role="button" aria-label="Сбросить фильтр">${FX}</span>`;
  const plOn=MV.place&&!MV.place.me, brOn=MV.brands.size>0;
  return `<button data-act="f-pts" class="${MV.pts?'on':''}" aria-pressed="${MV.pts}">${SV.coin}Оплата баллами${MV.pts?X('f-pts'):''}</button><button data-act="f-full" class="${MV.full?'on':''}" aria-pressed="${MV.full}">${okI}Всё в наличии${MV.full?X('f-full'):''}</button><button data-act="f-place" class="${plOn?'on':''}">${SV.pin}${esc(pl.length>18?pl.slice(0,17)+'…':pl)}${plOn?X('f-place-x'):SV.chevD}</button><button data-act="f-brand" class="${brOn?'on':''}">${SV.clinic}${esc(bn)}${brOn?X('f-brand-x'):SV.chevD}</button>`;
}
function renderMSheet(){
  const s=$('#m-sheet'), ids=mapIds();
  const isFull=MV.sheet==='full'&&!(MV.card&&MV.sel); s.classList.toggle('card',!!(MV.card&&MV.sel)); s.classList.toggle('full',isFull); $('#s-map').classList.toggle('mfull',isFull);
  if(MV.card&&MV.sel){
    const L=LABS.find(x=>x.id===MV.sel), r=labFor(L,ids);
    s.style.height='auto';
    s.innerHTML=`<div class="chev-ctl" data-act="mclose" style="color:var(--ink)">${SV.grabDown}</div><div class="mcardwrap">
      <div class="tapl" data-clplace="${L.id}" role="button" tabindex="0" aria-label="Открыть страницу лаборатории">${labHead(L)}</div>
      <div class="lcard" style="margin:0;padding:0;border:0;gap:12px;background:none"><div class="pr2"><b>${fmt(r.p)}</b><span class="mcnt${r.full?'':' p'}">за ${r.full?r.N:`${r.k} из ${r.N}`}${SV.flask(r.full?'var(--light)':'var(--warn-fg)')}</span></div>
      ${r.full?'':`<div class="warn">${SV.alert}<div>${r.miss.length>1?'Анализы недоступны для сдачи:':'Анализ недоступен для сдачи:'}<p>${esc(r.miss.map(id=>shortName(items[id].name)).join(', '))}</p></div></div>`}</div>
      <button class="big" data-act="mpick">Выбрать</button></div>${hi()}`;
    $('#m-ctrls').style.bottom=(s.offsetHeight+12)+'px'; $('#m-toggle').hidden=true;
    return;
  }
  const H=sheetH();
  s.style.height=H+'px';
  s.innerHTML=`<div class="grabber" id="m-grab" data-act="mgrab" role="button" aria-label="Список лабораторий"><i></i></div>
    <div class="mtop"><div class="qf" id="m-qf">${chipsHTML()}</div></div>
    ${MV.searching?`<div class="mlist" id="m-sugg" style="background:var(--base)"></div>`:(MV.sheet==='peek'?'':`<div class="mlist" id="m-list"></div>`)}`;
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
  if(card){MV.card=true;renderMSheet();SC.ev('pin');if(!labFor(L,mapIds()).full)SC.ev('pin-partial');}
  centerOn(L.x,L.y,Math.max(MV.s,0.8));
}
function zoomAt(f,cx,cy){
  const s0=MV.s, s1=Math.min(1.7,Math.max(0.36,s0*f)); if(s1===s0) return;
  cx=cx??vpW()/2; cy=cy??(HDR+visibleH())/2;
  const wx=(cx-MV.x)/s0, wy=(cy-MV.y)/s0; MV.s=s1; MV.x=cx-wx*s1; MV.y=cy-wy*s1; clampView(); applyView(); if(s1>s0)SC.ev('zoom');
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
    const opts=[['peek',PEEK],['half',H*.5],['full',H-HDR]];opts.sort((a,b)=>Math.abs(a[1]-h)-Math.abs(b[1]-h));sd=null;MV.searching=false;setSheet(opts[0][0]);});
})();

/* ---------- запись на 1 анализ: сразу к данным пациента, корзина не меняется ---------- */
function startOne(id,L){ONE={id,L};PF=null;go({s:'pat'});SC.ev('one');toast(`Запись на 1 анализ в ${L.n}`)}

/*@@MODULES@@*/

/* таббар: «Главная» и «Мои записи» работают, остальные вкладки — заглушки */
$('#tabbar').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;const t=b.dataset.tab;
  if(t==='home'){if(CUR_ID!=='s-home')resetTo({s:'home'})}
  else if(t==='orders'){if(CUR_ID!=='s-orders'){MO.tab='rec';resetTo({s:'orders'})}SC.ev('tab:orders')}
  else toast('В этом прототипе раздел не подключён')});
$('#tabbar').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset.tab){e.preventDefault();e.target.click()}});

/* ---------- events ---------- */
$('#ph').addEventListener('click',e=>{
  const t=e.target.closest('[data-mk],[data-cl],[data-lab],[data-place],[data-me],[data-brand],[data-cart],[data-open],[data-cat],[data-chip],[data-q],[data-jump],[data-rm],[data-ck],[data-pat],[data-pm],[data-pk],[data-g],[data-act],[data-clinic-add]');
  if(!t) return;
  if(t.closest('#dlg')) return;
  const d=t.dataset;
  if(d.mk){selectLab(d.mk);return}
  if(d.cl){const [x,y]=d.cl.split(',').map(Number);centerOn(x,y,0.8);return}
  if(d.lab){selectLab(d.lab);return}
  if(d.place!==undefined){pickPlace(PLACES[+d.place]);return}
  if(d.me){const L=LABS[0];pickPlace({n:'Рядом со мной',x:L.x+60,y:L.y+90,me:true});return}
  if(d.brand){MV.brands.has(d.brand)?MV.brands.delete(d.brand):MV.brands.add(d.brand);t.querySelector('.cb').classList.toggle('on');return}
  if(d.cart){e.stopPropagation();const id=d.cart;const was=inCart(id);toggleCart(id);refresh();if(!was)SC.ev('add@'+curScr());
    if(!$('#dim').hidden&&$('#up-go')){$('#up-go .t span').textContent=anW(cart.size);toast(was?'Убрали из корзины':'Добавили в корзину')}
    else{toast(was?'Убрали из корзины':'Добавили в корзину'); if(curScr()==='s-cart'){renderCart();updateFooters('s-cart')}}
    return}
  if(d.clinicAdd!==undefined){ // вариант A (ТЗ 2.6): один филиал на корзину
    const id=t.dataset.cartId, W=wlab(+t.dataset.wk); W.always=new Set([id]);
    const setLab=()=>{LAB=W;[...cart.keys()].forEach(x=>{cart.get(x).on=labHas(W,x)})};
    const nm=shortName(items[id].name);
    if(inCart(id)&&LAB&&LAB.id===W.id){delCart(id);if(!cart.size)LAB=null;refresh();toast(`${nm} убран из корзины`);SC.ev('wrm');return}
    if(inCart(id)){
      if(!LAB){setLab();refresh();toast(`Сдаёте в ${W.n}`);SC.ev('here');return}
      replaceSheet(id,W,()=>{setLab();refresh()});return}
    const add=()=>{setLab();addCart(id);cart.get(id).on=true;refresh();openUpsell(id)};
    if(LAB&&LAB.id!==W.id&&cart.size) replaceSheet(id,W,add); else add();
    return}
  if(d.rm){delCart(d.rm);renderCart();updateFooters('s-cart');toast('Убрали из корзины');return}
  if(d.ck){const v=cart.get(d.ck);v.on=!v.on;renderCart();updateFooters('s-cart');return}
  if(d.pat!==undefined){PATIENT=+d.pat;closeSheet();renderCart();return}
  if(d.pm){PAY.method=d.pm;renderCO();SC.ev('pm:'+d.pm);return}
  if(d.pk!==undefined){PATIENT=+d.pk;patFill(PATIENT);renderPat();if(PATIENT>=0)SC.ev('patfill');return}
  if(d.g){PF.g=d.g;delete PF.err.g;renderPat();return}
  if(d.open){if(!$('#dim').hidden)closeSheet();go({s:'detail',id:d.open});return}
  if(d.cat){go({s:'ctg',c:d.cat});return}
  if(d.chip){const sc=$('#s-ctg'),y=sc.scrollTop;cur.c=d.chip;renderCtg(true);sc.scrollTop=y;SC.ev('chip');return}
  if(d.q){cur.q=d.q;renderGS(d.q);return}
  if(d.jump){window.__chipLock&&window.__chipLock();t.parentNode.scrollTo({left:t.offsetLeft-16,behavior:'smooth'});$$('#d-chips .chip').forEach(c=>c.classList.toggle('on',c===t));$('#'+d.jump).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}
  const a=d.act;
  switch(a){
    case 'back': if(curScr()==='s-res'){resetTo({s:'ok'});break} back(); break;
    case 'resok': if(PAID){PAID.res=true;if(PAID.order)PAID.order.consent=true} resetTo({s:'ok'}); toast('Результаты придут в «Мои записи»'); break;
    case 'resskip': if(PAID&&PAID.order)PAID.order.consent=false; resetTo({s:'ok'}); break;
    case 'hours': openHours(); break;
    case 'search': go({s:'gs',q:''}); setTimeout(()=>$('#q').focus(),50); break;
    case 'catsearch': go({s:'cat',c:'all',q:''}); setTimeout(()=>$('#cq').focus(),50); break;
    case 'allan': go({s:'an',q:''}); break;
    case 'allcat': go({s:'cat',c:'all',q:''}); break;
    case 'clear': cur.q='';renderGS('');$('#q').focus(); break;
    case 'cclear': cur.q='';renderCat();$('#cq').focus(); break;
    case 'morecats': {const rows=$('#cat-rows');rows.innerHTML+=DATA.cats.slice(5).map(c=>`<button class="row" data-cat="${c.id}"><span>${c.title}</span><span style="color:var(--light)">${SV.chevR}</span></button>`).join('');t.remove();break;}
    case 'showall': $('#d-desc').classList.add('full');t.hidden=true; break;
    case 'dadd': if(!inCart(cur.id)){addCart(cur.id);refresh();openUpsell(cur.id)} else go({s:'cart'}); break;
    case 'drm': delCart(cur.id);refresh();toast('Убрали из корзины'); break;
    case 'cart': closeSheet(); go({s:'cart'}); break;
    case 'close': closeSheet(); break;
    case 'rep-yes': window.__rep&&window.__rep(); break;
    case 'tomap': if(!cart.size){toast('Добавьте анализы в корзину');break} if(!checkedIds().length){toast('Отметьте анализы, которые будете сдавать');break} go({s:'map'}); break;
    case 'map': if(!inCart(cur.id))addCart(cur.id); refresh(); go({s:'map'}); break;
    case 'patient': openPatient(); break;
    case 'prep': openPrep(); break;
    case 'prep-paid': openPrep(PAID?PAID.ids:[]); break;
    case 'ckall': {const ids=[...cart.keys()].filter(id=>!LAB||labHas(LAB,id));const all=ids.every(id=>cart.get(id).on);ids.forEach(id=>cart.get(id).on=!all);renderCart();updateFooters('s-cart');break;}
    case 'clear-cart': dialog('Очистить корзину?','Уберём все анализы и выбранную лабораторию.',[['Очистить',()=>{cart.clear();LAB=null;renderCart();updateFooters('s-cart');toast('Корзина очищена')}],['Отмена',()=>{}]]); break;
    case 'checkout': if(!cartTotals().ids.length){toast('Отметьте анализы');break} PF=null; go({s:'pat'}); break;
    case 'pickfirst': if(!checkedIds().length){toast('Отметьте анализы, которые будете сдавать');break} toast('Сначала выберите клинику'); go({s:'map'}); break;
    case 'patnext': if(!patValid()){renderPat();toast(PF.err.g&&Object.keys(PF.err).length===1?'Укажите пол':'Заполните обязательные поля');const f=$('#pat-body .err input');if(f)f.focus();break} PAY.brkOpen=true; go({s:'co'}); break;
    case 'fclear': {const k=t.dataset.fk;PF[k]='';delete PF.err[k];renderPat();const i=$(`#pat-body [data-f="${k}"]`);if(i)i.focus();break;}
    case 'fq': {const f=t.closest('.fq');const o=f.classList.toggle('open');t.setAttribute('aria-expanded',String(o));break;}
    case 'brk': PAY.brkOpen=!PAY.brkOpen; renderCO(); break;
    case 'consent': PAY.consent=!PAY.consent; renderCO(); renderPageFooter('s-co'); break;
    case 'pts': PAY.usePts=!PAY.usePts; renderCO(); renderPageFooter('s-co'); break;
    case 'pay': if(!PAY.consent){toast('Нужно согласие на обработку данных');break} pay(); break;
    case 'retry': back(); break;
    case 'closefail': stack.pop(); back(); break;
    case 'support': e.preventDefault(); toast('Откроем чат поддержки'); break;
    case 'records': MO.tab='rec'; resetTo({s:'orders'},1); break;
    case 'home': resetTo({s:'home'},-1); break;
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
    case 'f-place': MV.q=''; MV.searching=true; MV.sheet='full'; renderMSheet(); break;
    case 'f-place-x': MV.place=null; MV.q=''; MV.searching=false; renderMSheet(); renderMarkers(); break;
    case 'f-brand-x': MV.brands.clear(); renderMSheet(); renderMarkers(); break;
    case 'wf': {const on=t.classList.toggle('on'); t.setAttribute('aria-pressed',String(on)); const x=t.querySelector('.fx'); if(on&&!x) t.insertAdjacentHTML('beforeend',`<span class="fx">${FX}</span>`); else if(!on&&x) x.remove(); break;}
    case 'f-pts': MV.pts=!MV.pts; renderMSheet(); renderMarkers(); break;
    case 'f-full': MV.full=!MV.full; renderMSheet(); renderMarkers(); break;
    case 'mpick': {
      const L=LABS.find(x=>x.id===MV.sel), r=labFor(L,mapIds());
      const done=()=>{LAB=L; [...cart.keys()].forEach(id=>{if(!labHas(L,id))cart.get(id).on=false;}); back(); toast(`Выбрали ${L.n}`); SC.ev('labpick')};
      if(r.full) done();
      else dialog(`Сдать ${anW(r.k)} здесь?`,`В «${esc(L.n)}» нет: ${esc(r.miss.map(id=>shortName(items[id].name)).join(', '))}. Их можно сдать в другой лаборатории позже.`,[[`Сдать ${r.k} из ${r.N} здесь`,done],['Найти филиал со всеми анализами',()=>{MV.card=false;const best=sortedLabs(filtered().filter(x=>labFor(x,mapIds()).full),mapIds()).sort((a,b)=>Math.hypot(a.L.x-L.x,a.L.y-L.y)-Math.hypot(b.L.x-L.x,b.L.y-L.y))[0];if(best)selectLab(best.L.id);}]]);
      break;}
    case 'soon': toast('В этом прототипе раздел не подключён'); break;
    case 'sort': toast('Сортировка: сначала популярные'); break;
    case 'pdf': toast('Подготовим PDF и откроем «Поделиться»'); break;
    case 'coininfo': toast(`Начислим ${PTS_PER} баллов за каждый анализ после сдачи`); break;
    default: if(a&&a.startsWith('cat:')) go({s:'ctg',c:a.slice(4)});
  }
});
$('#dim').addEventListener('click',e=>{if(e.target.id==='dim') closeSheet()});
$('#q').addEventListener('input',e=>{cur.q=e.target.value;renderGS(e.target.value)});
$('#pat-body').addEventListener('input',e=>{const k=e.target.dataset.f;if(!k)return;let v=e.target.value;
  if(k==='b'){const dg=v.replace(/\D/g,'').slice(0,8);v=dg.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{2})(\d)/,'$1.$2');if(v!==e.target.value)e.target.value=v;}
  PF[k]=v;const l=e.target.closest('.fld');l.classList.toggle('has',!!v);if(PF.err[k]){delete PF.err[k];l.classList.remove('err');const n=l.nextElementSibling;if(n&&n.classList.contains('ferr'))n.remove();}});
$('#cq').addEventListener('input',e=>{cur.q=e.target.value;renderCat();const i=$('#cq');i.focus();if(cur.q.trim().length>1)SC.ev('q')});
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

/* start: #analyses, #cat-<id> (категория), #all/#find (поиск по анализам), #search (общий поиск), #cart, #map, #lab, #pat, #res, #ok,
   #clinic (клиника с анализом), #clinic-lab (лаборатория), #free (поликлиника ОМС), #orders (Мои записи), #order (детали заказа) */
const start=(location.hash||'').slice(1);
cur={s:'home'}; show('s-home');
const demo=()=>['Пролактин','Билирубин общий','Глюкоза','Ферритин'].forEach(n=>{const i=DATA.items.find(x=>x.name===n||x.name.startsWith(n));if(i)addCart(i.id)});
const m=start.match(/^cat-(\w+)$/);
if(m&&cats[m[1]]){go({s:'an',q:''});go({s:'ctg',c:m[1]});}
else if(start==='all'||start==='find'){go({s:'an',q:''});go({s:'cat',q:''});}
else if(start==='analyses') go({s:'an',q:''});
else if(start==='pat'){demo();LAB=LABS[0];go({s:'cart'});go({s:'pat'});}
else if(start==='res'){demo();LAB=LABS[0];const t=cartTotals();const d=new Date();d.setDate(d.getDate()+14);PAID={lab:LAB,total:t.total-ptsOff(t.total),ids:t.ids.slice(),until:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};t.ids.forEach(id=>cart.delete(id));go({s:'res'});}
else if(start==='ok'){demo();LAB=LABS[0];const t=cartTotals();const d=new Date();d.setDate(d.getDate()+14);PAID={lab:LAB,total:t.total-ptsOff(t.total),ids:t.ids.slice(),until:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};go({s:'ok'});}
else if(start==='search') go({s:'gs',q:''});
else if(start==='cart'){demo();go({s:'cart'});}
else if(start==='map'){demo();go({s:'cart'});go({s:'map'});}
else if(start==='lab'){demo();LAB=LABS[0];go({s:'cart'});}
else if(/^clinic(-lab)?$/.test(start)||start==='free'){ // деталька клиники с анализом (Рэмси), лаборатории (Инвитро) или поликлиника ОМС
  const fe=(POP8.find(i=>/^Ферритин/.test(i.name))||POP8[0]).id, wk=WLABS.findIndex(w=>w.brand===(start==='clinic'?'rem':'inv'));
  go({s:'an',q:''});go({s:'detail',id:fe});go(start==='free'?clView('poly',null):clView('w'+wk,fe));}
else if(start==='orders') resetTo({s:'orders'});
else if(start==='order'){resetTo({s:'orders'});go({s:'order',i:0});}
NOANIM=false;
/* =================== РЕЖИМ «СЦЕНАРИИ ДЛЯ ПОКАЗА» (по CJM 439:109448, стрелки 604:13254) =================== */
(function(){
  const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
  const ferr=()=>(POP8.find(i=>/^Ферритин/.test(i.name))||POP8[0]).id;
  function fresh(){cart.clear();LAB=null;ONE=null;ORDERS.length=0;ORDERS.push(ORD_DEMO);ORD_DEMO.st='wait';MO.tab='rec';MO.more={};PAID=null;PF=null;PATIENT=0;PAY.method='card';PAY.usePts=true;PAY.consent=true;PAY.brkOpen=true;MV.card=false;MV.sel=null;MV.searching=false;MV.place=null;MV.q='';$('#dlg').hidden=true;closeSheet();}
  function nav(views){const was=NOANIM;NOANIM=true;stack.length=0;cur=null;views.forEach((v,k)=>go(v,k>0,false));NOANIM=was;}
  const demo4=()=>['Пролактин','Билирубин общий','Глюкоза','Ферритин'].forEach(n=>{const i=DATA.items.find(x=>x.name===n||x.name.startsWith(n));if(i)addCart(i.id)});
  const REM=()=>WLABS.findIndex(w=>w.brand==='rem'), INV=()=>WLABS.findIndex(w=>w.brand==='inv');
  const wW=k=>{const W=wlab(k);W.always=new Set([ferr()]);return W};
  const scrollTo=(sel,scr)=>setTimeout(()=>{const e=$(sel),s=$(scr);if(e&&s)s.scrollTop+=e.getBoundingClientRect().top-s.getBoundingClientRect().top-(scr==='#s-detail'?380:140)},60);
  const pay0=()=>{const t=cartTotals();const d=new Date();d.setDate(d.getDate()+14);PAID={lab:LAB,total:t.total-ptsOff(t.total),ids:t.ids.slice(),until:d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};t.ids.forEach(id=>cart.delete(id));};
  const A={s:'an',q:''}, CART={s:'cart'};
  const S=[
   {id:'catalog',t:'Каталог: с главной до корзины',d:'Плитка на главной, каталог, добавление и плашка мини-корзины',steps:[
    {t:'Тап по плитке «Анализы» на главной',ev:'scr:an',hl:'#s-home [data-act=allan]',pre:()=>{fresh();nav([{s:'home'}])}},
    {t:'Пролистать каталог',ev:'scroll-an',hint:'Прокрутите экран вниз',pre:()=>{fresh();nav([A])}},
    {t:'Добавить анализ из «Популярных»',ev:'add@s-an',hl:'#an-body [data-cart]',pre:()=>{fresh();nav([A]);scrollTo('#an-body [data-cart]','#s-an')}},
    {t:'Плашка мини-корзины: «Перейти в корзину»',ev:'scr:cart',hl:'#f-cart .gocart',pre:()=>{fresh();addCart(POP8[0].id);nav([A]);scrollTo('#an-body [data-cart]','#s-an')}}]},
   {id:'search',t:'Поиск по анализам',d:'Поиск без чипсов, добавление из выдачи, «Отмена» возвращает назад',steps:[
    {t:'Тап в поиск в каталоге',ev:'scr:cat',hl:'#s-an [data-act=catsearch]',pre:()=>{fresh();nav([A])}},
    {t:'Ввести запрос, например «ферритин»',ev:'q',hl:'#cq-wrap',pre:()=>{fresh();nav([A,{s:'cat',c:'all',q:''}]);setTimeout(()=>$('#cq').focus(),80)}},
    {t:'Добавить анализ в корзину из выдачи',ev:'add@s-cat',hl:'#cat-body [data-cart]',pre:()=>{fresh();nav([A,{s:'cat',c:'all',q:'ферр'}]);$('#cq').value='ферр';renderCat()}},
    {t:'Перейти в корзину',ev:'scr:cart',hl:'#f-cart .gocart',pre:()=>{fresh();addCart(ferr());nav([A,{s:'cat',c:'all',q:'ферр'}]);$('#cq').value='ферр';renderCat()}}]},
   {id:'detail',t:'Категория и деталька анализа',d:'Категорийные экраны, поп-ап допродажи, выбор филиала (вариант A)',steps:[
    {t:'Открыть категорию плиткой',ev:'scr:ctg',hl:'#an-body [data-cat]',pre:()=>{fresh();nav([A])}},
    {t:'Переключить категорию чипсой',ev:'chip',hl:'#ctg-chips .chip:not(.on)',pre:()=>{fresh();nav([A,{s:'ctg',c:'vitamins'}])}},
    {t:'Открыть детальку анализа',ev:'scr:detail',hl:'#ctg-body [data-open]',pre:()=>{fresh();nav([A,{s:'ctg',c:'vitamins'}])}},
    {t:'Добавить с детальки: поп-ап допродажи',ev:'upsell',hl:'#d-add',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()}])}},
    {t:'«Где сдать»: «Сдать здесь» у филиала',ev:'here',hl:'#b-where [data-clinic-add].here',pre:()=>{fresh();addCart(ferr());nav([A,{s:'detail',id:ferr()}]);scrollTo('#b-where [data-clinic-add]','#s-detail')}},
    {t:'Сменить филиал: БШ «Заменить филиал?»',ev:'rep',hl:'#b-where [data-clinic-add].here',pre:()=>{fresh();addCart(ferr());LAB=wW(1);nav([A,{s:'detail',id:ferr()}]);scrollTo('#b-where [data-clinic-add]','#s-detail')}},
    {t:'«В корзине» убирает анализ из корзины',ev:'wrm',hl:'#b-where [data-clinic-add].inc',pre:()=>{fresh();addCart(ferr());LAB=wW(1);nav([A,{s:'detail',id:ferr()}]);scrollTo('#b-where [data-clinic-add].inc','#s-detail')}}]},
   {id:'map',t:'Выбор клиники на карте',d:'Карта без поиска, пины с ценой, филиал без части анализов',steps:[
    {t:'Корзина: «Выбрать клинику»',ev:'scr:map',hl:'#cart-body [data-act=tomap]',pre:()=>{fresh();demo4();nav([CART])}},
    {t:'Приблизить карту',ev:'zoom',hl:'#s-map [data-act=zin]',pre:()=>{fresh();demo4();nav([CART,{s:'map'}])}},
    {t:'Тап по пину лаборатории',ev:'pin',hl:'#m-layer [data-mk]',pre:()=>{fresh();demo4();nav([CART,{s:'map'}])}},
    {t:'Пин, где есть не все анализы',ev:'pin-partial',hl:'#m-layer .mk.p[data-mk]',hint:'Светлые пины: «N из M анализов»',pre:()=>{fresh();demo4();nav([CART,{s:'map'}]);setTimeout(()=>{const L=LABS.find(x=>!labFor(x,mapIds()).full);if(L)centerOn(L.x,L.y,MV.s)},120)}},
    {t:'«Выбрать» филиал и вернуться в корзину',ev:'labpick',hl:'[data-act=mpick]',pre:()=>{fresh();demo4();nav([CART,{s:'map'}]);setTimeout(()=>selectLab(LABS[0].id),120)}}]},
   {id:'checkout',t:'Оформление и оплата',d:'Данные пациента, 500 баллов, согласие на результаты, успех',steps:[
    {t:'«Перейти к оформлению» из корзины',ev:'scr:pat',hl:'#f-page [data-act=checkout]',pre:()=>{fresh();demo4();LAB=LABS[0];nav([CART])}},
    {t:'Подставить данные чипсой пациента',ev:'patfill',hl:'#pat-body [data-pk="0"]',pre:()=>{fresh();demo4();LAB=LABS[0];nav([CART,{s:'pat'}])}},
    {t:'«Продолжить» к оплате',ev:'scr:co',hl:'#f-page [data-act=patnext]',pre:()=>{fresh();demo4();LAB=LABS[0];PATIENT=0;patFill(0);nav([CART,{s:'pat'}])}},
    {t:'Списать 500 баллов и оплатить',ev:'scr:res',hl:'#f-page [data-act=pay]',pre:()=>{fresh();demo4();LAB=LABS[0];PATIENT=0;patFill(0);nav([CART,{s:'pat'},{s:'co'}])}},
    {t:'Согласие на результаты: «Даю согласие» или «Пропустить»',ev:'scr:ok',hl:'#f-page [data-act=resok]',pre:()=>{fresh();demo4();LAB=LABS[0];pay0();nav([{s:'res'}])}}]},
   {id:'clinic',t:'Деталька клиники и лаборатории',d:'Из «Где сдать» в карточку клиники: цены, корзина, отзывы, запись на 1 анализ',steps:[
    {t:'Тап по названию клиники в «Где сдать»',ev:'clinic-ctx',hl:'#b-where [data-wcl]:not([data-wcl=free])',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()}]);scrollTo('#b-where [data-wcl]','#s-detail')}},
    {t:'«Добавить в корзину» в нижней панели',ev:'cl-add',hl:'#f-clinic [data-cla=add]',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()},clView('w'+REM(),ferr())])}},
    {t:'Вкладка «Отзывы»: сначала про этот анализ',ev:'cltab:reviews',hl:'#cl-tabs [data-cltab=reviews]',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()},clView('w'+REM(),ferr())])}},
    {t:'Лаборатория: «Записаться» на 1 анализ',ev:'scr:pat',hl:'#cl-list [data-cla=one]',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()},clView('w'+INV(),ferr())])}},
    {t:'Поликлиника по ОМС из «Где сдать»',ev:'clinic',hl:'#b-where [data-wcl=free]',pre:()=>{fresh();nav([A,{s:'detail',id:ferr()}]);scrollTo('#b-where [data-wcl=free]','#s-detail')}}]},
   {id:'orders',t:'Мои записи: заказ анализов',d:'Вкладка таббара, карточка заказа, детали, поддержка, «Записаться еще раз»',steps:[
    {t:'Таб «Мои записи»',ev:'tab:orders',hl:'#tabbar [data-tab=orders]',pre:()=>{fresh();nav([{s:'home'}])}},
    {t:'Раскрыть список анализов «Ещё 1 анализ»',ev:'mo-more',hl:'#mo-body [data-momore]',pre:()=>{fresh();nav([{s:'orders'}])}},
    {t:'Открыть детали заказа',ev:'mo-detail',hl:'#mo-body .mo-chev',pre:()=>{fresh();nav([{s:'orders'}])}},
    {t:'Сменить статус над телефоном, например «Часть результатов готова»',ev:'mo-st',hint:'Список «Статус заказа» над телефоном',pre:()=>{fresh();nav([{s:'orders'},{s:'order',i:0}])}},
    {t:'«Обратиться в поддержку»',ev:'mo-support',hl:'#mo-dbody [data-act=mo-support]',pre:()=>{fresh();nav([{s:'orders'},{s:'order',i:0}]);scrollTo('#mo-dbody [data-act=mo-support]','#s-order')}},
    {t:'«Записаться еще раз»: набор заказа в корзине',ev:'mo-repeat',hl:'#mo-dbody [data-morepeat]',pre:()=>{fresh();nav([{s:'orders'},{s:'order',i:0}]);scrollTo('#mo-dbody [data-morepeat]','#s-order')}}]},
   {id:'fail',t:'Платёж не прошёл',d:'Ошибка оплаты и повторная попытка',steps:[
    {t:'Выбрать «Карта банка другой страны»',ev:'pm:foreign',hl:'#co-body [data-pm=foreign]',pre:()=>{fresh();demo4();LAB=LABS[0];PATIENT=0;patFill(0);nav([CART,{s:'pat'},{s:'co'}])}},
    {t:'Оплатить',ev:'scr:fail',hl:'#f-page [data-act=pay]',pre:()=>{fresh();demo4();LAB=LABS[0];PATIENT=0;patFill(0);PAY.method='foreign';nav([CART,{s:'pat'},{s:'co'}])}},
    {t:'«Попробовать ещё раз»',ev:'scr:co',hl:'#f-page [data-act=retry]',pre:()=>{fresh();demo4();LAB=LABS[0];PATIENT=0;patFill(0);PAY.method='foreign';nav([CART,{s:'pat'},{s:'co'},{s:'fail'}])}}]}
  ];
  let st={}; try{st=JSON.parse(LS('vitrina-sc')||'{}')||{}}catch(e){st={}}
  S.forEach(s=>{if(!Array.isArray(st[s.id])||st[s.id].length!==s.steps.length)st[s.id]=s.steps.map(()=>false)});
  let active=LS('vitrina-sc-active')||null; if(!S.some(s=>s.id===active))active=null;
  let mode=LS('vitrina-mode')==='sc'?'sc':'free';
  const save=()=>{LS('vitrina-sc',JSON.stringify(st));LS('vitrina-sc-active',active||'')};
  const P=$('#scp'), body=$('#scp-body');
  const nextIdx=s=>{const a=st[s.id];let k=a.lastIndexOf(true)+1;if(k>=a.length)k=a.indexOf(false);return k};
  const CK='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.2 2.9 2.9 6.1-6.3"/></svg>';
  const GO='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 10.5 8 6 12.5"/></svg>';
  function draw(){
    body.innerHTML=S.map((s,si)=>{const a=st[s.id],n=a.filter(Boolean).length,on=s.id===active,nx=on?nextIdx(s):-1;
      return `<section class="scc${on?' on':''}${n===a.length?' done':''}">
        <button class="sch" data-sc-open="${s.id}" aria-expanded="${on}"><span class="scn">${si+1}</span><span class="sct"><b>${s.t}</b><span>${s.d}</span></span><span class="scq">${n}/${a.length}</span></button>
        ${on?`<ol class="scs">${s.steps.map((p,k)=>`<li class="${a[k]?'ok':''}${k===nx?' nx':''}"><button class="scb" data-sc-ck="${k}" role="checkbox" aria-checked="${a[k]}" aria-label="Шаг ${k+1} пройден">${CK}</button><button class="scl" data-sc-go="${k}"><span>${p.t}${k===nx&&p.hint?`<i>${p.hint}</i>`:''}</span>${GO}</button></li>`).join('')}</ol>
        <div class="scf">${n===a.length?`<span class="scok">${CK}Сценарий пройден</span>`:''}<button data-sc-go="0" class="scbtn">${n?'Пройти заново':'Начать'}</button>${n===a.length&&S[si+1]?`<button class="scbtn pri" data-sc-open="${S[si+1].id}" data-sc-start="1">Следующий сценарий</button>`:''}</div>`:''}
      </section>`}).join('');
  }
  function hl(){
    $$('.sc-hl').forEach(e=>e.classList.remove('sc-hl'));
    if(mode!=='sc'||!active) return;
    const s=S.find(x=>x.id===active), k=nextIdx(s); if(k<0) return; const p=s.steps[k];
    if(!$('#dlg').hidden){const b=$('#dlg [data-dlg="0"]'); if(b) b.classList.add('sc-hl'); return}
    if(!p.hl) return;
    if(!$('#dim').hidden&&!$('#sheet').contains($(p.hl))) return;
    const R=$('#ph').getBoundingClientRect(), vis=x=>{const r=x.getBoundingClientRect();return r.width&&r.top>=R.top+90&&r.bottom<=R.bottom-60&&r.left>=R.left+4&&r.right<=R.right-4};
    const all=[...document.querySelectorAll(p.hl)].filter(x=>x.offsetParent&&$('#ph').contains(x)); const e=all.find(vis)||all[0]; if(e) e.classList.add('sc-hl');
  }
  function jump(k){
    const s=S.find(x=>x.id===active); if(!s) return;
    st[s.id]=st[s.id].map((v,i)=>i<k); save();
    muted=true; try{s.steps[k].pre()}finally{setTimeout(()=>{muted=false},250)} draw(); setTimeout(hl,150);
    if(matchMedia('(max-width:440px)').matches){P.classList.add('min');$('#scp-tg').setAttribute('aria-expanded','false')}
  }
  let muted=false;
  SC.ev=name=>{
    if(muted||mode!=='sc'||!active) return;
    const s=S.find(x=>x.id===active), a=st[s.id]; const from=Math.max(0,a.lastIndexOf(true)+1);
    let hit=-1; for(let k=from;k<a.length;k++) if(s.steps[k].ev===name){hit=k;break}
    if(hit<0){ const n=nextIdx(s); if(n>=0&&s.steps[n].ev===name) hit=n; }
    if(hit<0) return; a[hit]=true; save(); draw(); setTimeout(hl,60);
  };
  function setMode(m){
    mode=m; LS('vitrina-mode',m);
    $$('[data-mode-set]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeSet===m)));
    P.hidden=m!=='sc'; document.body.classList.toggle('scmode',m==='sc'); draw(); hl();
  }
  $$('[data-mode-set]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.modeSet)));
  $('#scp-tg').addEventListener('click',()=>{const o=P.classList.toggle('min');$('#scp-tg').setAttribute('aria-expanded',String(!o))});
  $('#scp-reset').addEventListener('click',()=>{S.forEach(s=>st[s.id]=s.steps.map(()=>false));save();draw();hl()});
  body.addEventListener('click',e=>{
    const o=e.target.closest('[data-sc-open]'),c=e.target.closest('[data-sc-ck]'),g=e.target.closest('[data-sc-go]');
    if(o){const id=o.dataset.scOpen; if(o.dataset.scStart){active=id;save();jump(0);return} active=active===id?null:id; save(); draw(); hl(); return}
    if(c){const s=S.find(x=>x.id===active),k=+c.dataset.scCk; st[s.id][k]=!st[s.id][k]; save(); draw(); hl(); return}
    if(g){jump(+g.dataset.scGo); return}
  });
  $('#s-an').addEventListener('scroll',e=>{if(e.target.scrollTop>280)SC.ev('scroll-an')},{passive:true});
  document.addEventListener('click',()=>setTimeout(hl,80),true);
  setInterval(()=>{if(mode==='sc'&&active&&!document.querySelector('.sc-hl'))hl()},400);
  setMode(mode);
})();
})();
