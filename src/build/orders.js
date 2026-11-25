/* =================== «МОИ ЗАПИСИ» С ЗАКАЗОМ АНАЛИЗОВ (Figma 676:27687, ТЗ 2.10) ===================
   Вкладка таббара. Одна карточка на заказ лаборатории-партнёра, детали заказа, 11 статусов из макета (правки 25.11).
   Оплаченный в прототипе заказ появляется сверху со статусом «Оформляем заказ». */
const MON=d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
const dPlus=n=>{const d=new Date();d.setDate(d.getDate()+n);return d};
const MOS=[ // статусы из макета, порядок как в секции 676:27687
  ['new','Оформляем заказ'],['wait','Ожидает сдачи'],['today','Ожидает сдачи: сдать сегодня'],['work','Анализы в работе'],['part','Часть результатов готова'],['done','Результаты готовы'],
  ['nores','Анализы готовы без результатов (нет согласия)'],['cancelling','Отменяем заказ'],['cancelled','Заказ отменён'],['rejected','Лаборатория не приняла заказ']];
const MOI={
  load:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.25"/><path d="M8 5v3.3l2.1 1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.3 2.9 2.9 6.1-6.4"/></svg>',
  checkC:'<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="m5 8.2 2 2 4-4.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ban:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.25"/><path d="m3.6 3.6 8.8 8.8"/></svg>',
  chevR:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m10 7 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevD:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  map:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z"/><path d="M9 4v14M15 6v5"/><circle cx="17" cy="15.5" r="2.2"/><path d="M17 17.7v2"/></svg>',
  clk20:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7.25"/><path d="M10 6v4.2l2.6 1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev16:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m8 5.5 4.5 4.5L8 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  help:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.25"/><path d="M6.3 6.3a1.8 1.8 0 1 1 2.5 1.6c-.5.2-.8.6-.8 1.1v.3M8 11.2v.1" stroke-linecap="round"/></svg>',
  info:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.25"/><path d="M8 7.2v4M8 4.8v.2" stroke-linecap="round"/></svg>',
  copy:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="5.5" y="5" width="7.5" height="9.5" rx="2"/><path d="M3.5 11V3.5a2 2 0 0 1 2-2H10"/></svg>',
  dl:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/></svg>',
  pdf:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 2.5h8.5L19 7v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1-1.5Z" fill="#fff" stroke="#E4E5E8"/><path d="M14.5 2.5V7H19" fill="none" stroke="#E4E5E8"/><rect x="2" y="10" width="15" height="8" rx="2" fill="#FF7777"/><text x="9.5" y="16.2" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5.6" font-weight="700" fill="#fff">PDF</text></svg>',
  route:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F3AA00" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h7.5a3 3 0 0 1 0 6h-7a3 3 0 0 0 0 6H16"/></svg>',
  phone:'<svg width="16" height="16" viewBox="0 0 16 16" fill="#6ABF68"><path d="M4.3 1.8 6 4.6c.3.5.2 1-.2 1.4l-.9.8a8 8 0 0 0 4.3 4.3l.8-.9c.4-.4 1-.5 1.4-.2l2.8 1.7c.5.3.6.9.3 1.4l-.8 1.2c-.4.6-1.1.9-1.8.8C6.9 14.5 1.5 9.1 1 3.9c-.1-.7.2-1.4.8-1.8l1.2-.8c.5-.3 1.1-.2 1.3.5Z"/></svg>',
  share:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8"/></svg>',
};
const moIds=['general-01','biochemistry-01','hormones-01','vitamins-01','biochemistry-06','biochemistry-08']; // Figma: 4 анализа и «Ещё 2 анализа»
const ORD_DEMO={no:'90897620044',lab:KUSH,ids:moIds,full:5085,pts:500,total:4585,card:'4417',created:'29 октября 2026, 09:12',patient:'Смирнова Ксения Алексеевна',st:'wait',consent:true};
const ORDERS=[ORD_DEMO];
function addOrder(P){ // из оплаты в прототипе (pay)
  const now=new Date(), t=now.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+', '+now.toTimeString().slice(0,5);
  const pt=PF&&PF.f?[PF.f,PF.i,PF.o].filter(Boolean).join(' '):'Смирнова Ксения Алексеевна';
  const o={no:String(90897620100+ORDERS.length),lab:P.lab,ids:P.ids.slice(),full:P.total+(P.pts||0),pts:P.pts||0,total:P.total,card:'4417',created:t,patient:pt,st:'new',consent:!!P.res,until:P.untilD};
  ORDERS.unshift(o); return o;
}
const MO={tab:'rec',more:{},f:'all'}; // f — чипсы «Все / Записи / Анализы» (676:36719)
const moLast=o=>o.until||dPlus(5);
const moLeft=o=>Math.max(1,Math.round((moLast(o)-new Date())/864e5));
/* без согласия на результаты (ТЗ 2.10.2) готовность не показываем: «в работе», потом «Заказ выполнен» без файлов */
const moSt=o=>o.consent===false&&o.st==='part'?'work':o.consent===false&&o.st==='done'?'nores':o.st;
const moReady=o=>{const s=moSt(o);return s==='done'?o.ids.length:s==='part'?Math.min(2,o.ids.length-1):s==='partial'?o.ids.length-1:0};
const moCancelled=s=>s==='cancelled'||s==='rejected';
const moPrice1=(o,id)=>labPrice(o.lab,id);
const moHrs=o=>(o.lab.hours&&o.lab.hours[0]||'—19:30').split('—')[1];
const moYear=d=>`${MON(d)} ${d.getFullYear()}, 16:00`;
function moChip(o){
  const s=moSt(o), n=o.ids.length;
  const m={new:['c-gray',MOI.load,'Оформляем заказ'],wait:['c-blue',MOI.clock,'Ожидает сдачи'],today:['c-blue',MOI.clock,'Ожидает сдачи'],work:['c-blue',MOI.clock,'Анализы в работе'],
    part:['c-green',MOI.check,`Часть результатов готова (${moReady(o)}/${n})`],done:['c-greenf',MOI.check,'Результаты готовы'],nores:['c-greenf',MOI.check,'Заказ выполнен'],
    partial:['c-greenf',MOI.check,`Заказ выполнен частично (${n-1}/${n})`],cancelling:['c-orange',MOI.load,'Отменяем заказ'],cancelled:['c-red',MOI.ban,'Заказ отменён'],rejected:['c-red',MOI.ban,'Лаборатория не приняла заказ']}[s];
  return `<span class="mo-chip ${m[0]}">${m[1]}${m[2]}</span>`;
}
const moRefund=o=>moSt(o)==='partial'?moPrice1(o,o.ids[o.ids.length-1]):o.total;
const moRefundTx=o=>`<p class="mo-sub sm">Вернули ${fmt(moRefund(o))} на карту •• ${o.card}<br>Деньги придут в течение 10 рабочих дней. Чек вернём на email.</p>`;
function moPrice(o){
  return `<div class="mo-price"><span class="paid">${fmt(o.total)}</span>${o.pts?`<s>${fmt(o.full)}</s><span class="pp">${SV.coinY}−${o.pts} баллов</span>`:''}</div>`;
}
const moTitle=o=>`<div class="mo-tp"><b>Заказ анализов</b>${moPrice(o)}</div>`;
const moPlq=(cls,icn,t,s)=>`<div class="mo-plq ${cls}">${icn}<div><b>${t}</b>${s?`<span>${s}</span>`:''}</div></div>`;
const COIN_O='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F3AA00" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><path d="M9.6 15.6V8.4l4.8 7.2V8.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const moPts=o=>moCancelled(moSt(o))?(o.pts?`<div class="mo-plq p-green">${MOI.checkC}<div><b>${o.pts} ${SV.coinY} баллов возвращены на ваш баланс</b></div></div>`:'')
  :(o.pts?`<div class="mo-plq p-yellow">${COIN_O}<div><b>Оплачено частично ${SV.coinY} баллами</b></div></div>`:'');
const moWaitPlq=o=>moPlq('p-blue',MOI.clock,`Осталось ${moLeft(o)} ${plural(moLeft(o),'день','дня','дней')} для сдачи`,`Последний день — ${MON(moLast(o))}`);
const moTodayPlq=o=>moPlq('p-green',MOI.info,'Сдать можно сегодня',`Забор до ${moHrs(o)}`);
const moCancelReq=o=>moPlq('p-orange',MOI.clock,'Отправили запрос в лабораторию',`Как только лаборатория подтвердит отмену, вернём ${fmt(o.total)} на карту •• ${o.card}.`);
function moLab(o,k){
  const L=o.lab;
  return `<div class="mo-lab"><button class="mo-ln" data-moclinic="${k}">${esc(L.n)}</button>
    <div class="mo-pl"><div><span class="ad">${esc(String(L.a).replace(/^г\. Санкт-Петербург, /,''))}</span><span class="mt"><u style="background:${L.mc}"></u>${esc(L.metro)} <em>${String(L.md).replace(',','.')}</em></span></div><button class="mo-ic" data-act="mo-map" aria-label="Показать на карте">${MOI.map}</button></div>
    <button class="mo-hrs" data-act="hours">${MOI.clk20}<b>Забор до ${moHrs(o)}</b>${MOI.chev16}</button></div>`;
}
const moPrep=k=>`<button class="mo-prep" data-moprep="${k}"><span class="im" style="background-image:url(${ASSET.prep})"></span><b>Подготовка к анализам</b>${MOI.chev16}</button>`;
const moMeta=o=>`<div class="mo-meta"><div><b>Пациент:</b> ${esc(o.patient)}</div><div><b>Запись:</b> от ${esc(o.created)}</div><div><b>ID записи:</b> ${o.no} <button class="mo-cp" data-act="mo-copy" aria-label="Скопировать">${MOI.copy}</button></div></div>`;
/* информер баллов (Coin-banner): 50 за каждый выполненный анализ, при отмене — 0 */
function moCoin(o){
  const s=moSt(o), cnc=moCancelled(s)||s==='cancelling';
  const n=cnc?0:(s==='partial'?o.ids.length-1:o.ids.length)*PTS_PER;
  return `<div class="mo-coin"><span>${cnc?'Баллы не начислены, так как запись отменена.':'За эту запись вам начислены баллы.'}</span><b>${fmt0(n)}${SV.coinY}</b></div>`;
}
const moName=id=>({'general-01':'Клинический анализ крови с лейкоформулой и СОЭ','hormones-01':'Тиреотропный гормон (ТТГ)'})[id]||items[id].name.split(' (')[0];
function moCard(o,k){
  const s=moSt(o);
  const sub=s==='new'?'<p class="mo-sub sm">Оплата прошла. Дождитесь подтверждения лаборатории перед визитом</p>'
    :(moCancelled(s)||s==='partial')?moRefundTx(o):'';
  const plq=[moPts(o), s==='wait'?moWaitPlq(o):s==='today'?moTodayPlq(o):s==='cancelling'?moCancelReq(o):''].join('');
  const open=MO.more[k], shown=open?o.ids:o.ids.slice(0,4), rest=o.ids.length-4; // Figma: 4 анализа и «Ещё N»
  const coin=['new','wait','today'].includes(s)?'':moCoin(o);
  return `<article class="mo-card" data-ordopen="${k}">
    <div class="mo-top">${moChip(o)}<span class="mo-chev">${MOI.chevR}</span></div>${sub}
    ${moTitle(o)}
    ${plq?`<div class="mo-plqs">${plq}</div>`:''}
    <div><ul class="mo-ul">${shown.map(id=>`<li>${esc(moName(id))}</li>`).join('')}</ul>
    ${rest>0?`<button class="mo-more${open?' on':''}" data-momore="${k}">${MOI.chevD}${open?'Свернуть':`Ещё ${anW(rest)}`}</button>`:''}</div>
    ${moPrep(k)}
    <div class="mo-line"></div>
    ${moLab(o,k)}
    <div class="mo-line"></div>
    ${coin}
    <button class="big" data-morepeat="${k}">Записаться еще раз</button>
    ${moMeta(o)}
  </article>`;
}
/* записи к врачу — как в макете 676:36719 */
const DOC_CL=`<div class="mo-lab"><div class="mo-ln static">СМ-Клиника на Симферопольском бульваре</div><div class="mo-pl"><div><span class="ad">ул. Новослободская, д 3</span><span class="mt"><u style="background:#4F9FE8"></u>Новослободская <em>250м</em></span></div><span class="mo-ic">${MOI.map}</span></div>
    <div class="mo-ph"><span>+7 (999) 999 99 99</span><button class="mo-lnk" data-act="mo-call">позвонить</button></div></div>`;
const DOC_META=`<div class="mo-meta"><div><b>Пациент:</b> Смирнова Ксения Алексеевна</div><div><b>Запись:</b> от 29 октября 2023, 09:12</div><div><b>ID записи:</b> 90897620044 <span class="mo-cp">${MOI.copy}</span></div></div>`;
const DOC_ACTS=b=>`<div class="mo-acts"><button data-act="soon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-ink)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5Z"/><path d="M13.5 3v5.5H19M12 12v6M9 15h6"/></svg>Добавить документ${b?`<i class="mo-n">${b}</i>`:''}</button><button data-act="soon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-ink)" stroke-width="1.7" stroke-linejoin="round"><path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/><path d="M8.5 10.5h7" stroke-linecap="round"/></svg>Оставить отзыв</button></div>`;
const DOC_AGAIN=`<button class="big two mo-again" data-act="soon"><span class="t">Записаться еще раз</span><span class="r">${SV.coinY}+100</span></button>`;
function moDoctorCards(){
  const doc=`<div class="mo-doc"><span class="ava" style="background-image:url(${CLIMG.doc})"></span><b>Рождественская Марина Владимировна</b></div>`;
  return `<article class="mo-card"><div class="mo-top"><span class="mo-chip c-greenf">${MOI.check}31 октября 2023, 09:00</span><span class="mo-chev">${MOI.chevR}</span></div>
    <div class="mo-tp"><b>Консультация врача</b><div class="mo-price"><span class="paid ink">2500 ₽</span></div></div>${doc}
    <div class="mo-line"></div>${DOC_CL}<div class="mo-line"></div>${DOC_ACTS(0)}${DOC_AGAIN}${DOC_META}</article>
  <article class="mo-card"><div class="mo-top"><span class="mo-chip c-red">${MOI.ban}31 октября 2023, 09:00 (отменена)</span><span class="mo-chev">${MOI.chevR}</span></div>
    <div class="mo-tp"><b>МРТ головного мозга</b><div class="mo-price"><span class="paid ink">2500 ₽</span></div></div>
    <div class="mo-line"></div>${DOC_CL}<div class="mo-line"></div>${DOC_AGAIN}${DOC_META}</article>
  <article class="mo-card"><div class="mo-top"><span class="mo-chip c-gray">${MOI.help}Неизвестен</span><span class="mo-chev">${MOI.chevR}</span></div>
    <p class="mo-sub sm ic">${MOI.info}<span>После подтверждения записи по телефону, можете спокойно ехать на приём</span></p>
    <div class="mo-tp"><b>Консультация врача</b><div class="mo-price"><span class="paid ink">2500 ₽</span></div></div>${doc}
    <div class="mo-line"></div>${DOC_CL}<div class="mo-line"></div>${DOC_ACTS(2)}${DOC_AGAIN}${DOC_META}</article>`;
}
function renderOrders(){
  $$('#s-orders [data-motab]').forEach(b=>{const on=b.dataset.motab===MO.tab;b.setAttribute('aria-selected',String(on));b.classList.toggle('on',on)});
  const nDoc=3, ch=[['all','Все',ORDERS.length+nDoc],['doc','Записи',nDoc],['an','Анализы',ORDERS.length]];
  $('#mo-body').innerHTML=MO.tab==='rec'?`<div class="chips mo-chips">${ch.map(([k,t,n])=>`<button class="chip${MO.f===k?' on':''}" data-mof="${k}" aria-pressed="${MO.f===k}">${t} <i>${n}</i></button>`).join('')}</div>`
    +(MO.f!=='doc'?ORDERS.map(moCard).join(''):'')+(MO.f!=='an'?moDoctorCards():'')
    :`<div class="empty" style="margin:0 16px"><b>Заявки к врачам</b><span>Здесь заявки, которые клиника ещё не подтвердила. Заказы анализов сюда не попадают: они сразу во вкладке «Записи».</span></div>`;
  moSel();
}
/* детали заказа (Figma 676:38380 … 719:22046) */
function moTopPlaque(o){
  const s=moSt(o), rd=moReady(o), n=o.ids.length;
  if(s==='new') return `<div class="mo-plq p-gray">${MOI.clock}<div><b>Оформляем заказ</b></div></div><p class="mo-sub sm">Оплата прошла. Дождитесь подтверждения лаборатории перед визитом</p>`;
  if(s==='wait') return moWaitPlq(o);
  if(s==='today') return moTodayPlq(o);
  if(s==='work') return moPlq('p-blue',MOI.clock,'Анализы в работе','');
  if(s==='part') return moPlq('p-green',MOI.check,`Часть результатов готова (${rd}/${n})`,'');
  if(s==='done') return moPlq('p-green',MOI.check,'Результаты готовы','');
  if(s==='nores') return moPlq('p-green',MOI.check,'Заказ выполнен',''); // в макете 719:22046 «Результаты готовы» — вопрос к макету
  if(s==='cancelling') return moPlq('p-orange',MOI.clock,'Отменяем заказ','')+`<p class="mo-sub sm"><b>Отправили запрос в лабораторию</b><br>Как только лаборатория подтвердит отмену, вернём ${fmt(o.total)} на карту •• ${o.card}.</p>`;
  if(s==='cancelled') return moPlq('p-red',MOI.ban,`${moYear(new Date())} (отменена)`,'')+moRefundTx(o);
  if(s==='rejected') return moPlq('p-red',MOI.ban,`${moYear(new Date())} (Лаборатория не приняла заказ)`,'')+moRefundTx(o);
  return '';
}
function moRow(o,id,k){
  const s=moSt(o), n=o.ids.length;
  const cnc=moCancelled(s)||(s==='partial'&&k===n-1), ready=!cnc&&k<moReady(o), nr=s==='nores';
  const ico=ready?`<span class="ico pdf">${MOI.pdf}</span>`:cnc?`<span class="ico off">${MOI.ban}</span>`:nr?`<span class="ico ok">${MOI.check}</span>`:`<span class="ico">${MOI.clock}</span>`;
  return `<div class="mo-ar">${ico}<div class="tx"><b>${esc(moName(id))}</b>${ready?'<span>Результат готов</span>':cnc?'<span class="x">Отменён</span>':''}</div>${ready?`<button class="mo-dl" data-act="mo-dl" aria-label="Скачать результат">${MOI.dl}</button>`:''}</div>`;
}
function renderOrder(){
  const k=cur.i, o=ORDERS[k], s=moSt(o);
  const map=o.lab===KUSH?`<div class="mo-map" style="background-image:url(${CLIMG['m-invitro']})"></div>`:`<div class="mo-map gen"><div class="mapw" style="transform:translate(-${Math.max(0,o.lab.x*.8-170)}px,-${Math.max(0,o.lab.y*.8-48)}px) scale(.8)"></div><i class="cl-mpin"></i></div>`;
  const nores=s==='nores'?`<div class="mo-plq p-gray info">${MOI.info}<div><b>Результаты не пришли в приложение НаПоправку</b><span>При заказе вы не дали согласие на их передачу. Результаты в лаборатории ${esc(o.lab.brand.k==='inv'?'Инвитро':o.lab.brand.n)}.</span><button class="mo-howres" data-act="mo-howres">Как получить результаты${MOI.chev16}</button></div></div>`:'';
  const canCancel=['new','wait','today','work'].includes(s); // Figma: «Отменить запись» до готовности результатов
  $('#mo-dbody').innerHTML=`<div class="mo-d">
    ${moTopPlaque(o)}
    ${moTitle(o)}
    ${moPts(o)}${nores}
    <div class="mo-ars">${o.ids.map((id,j)=>moRow(o,id,j)).join('')}</div>
    ${moPrep(k)}
    ${moLab(o,k)}
    ${moCoin(o)}
    <div class="mo-mapw">${map}<button class="mo-route" data-act="mo-route">${MOI.route}Построить маршрут</button></div>
    <div class="mo-btns"><button class="big" data-morepeat="${k}">Записаться еще раз</button><button class="big in" data-act="mo-support">Обратиться в поддержку</button>${canCancel?'<button class="mo-cancel" data-act="mo-cancel">Отменить запись</button>':''}</div>
    ${canCancel?'':'<div class="mo-line"></div>'}
    ${moMeta(o)}
  </div>`;
  moSel();
}
/* переключатель статуса заказа над телефоном — только на экранах «Моих записей» */
function moSel(){
  const w=$('#ord-ctl'); if(!w) return;
  const on=['s-orders','s-order'].includes(CUR_ID||'');
  w.hidden=!on; if(!on) return;
  const o=ORDERS[cur&&cur.s==='order'?cur.i:0];
  $('#ord-st').value=o.st; $('#ord-lbl').textContent=cur&&cur.s==='order'?'Статус заказа':'Статус верхнего заказа';
}
$('#ord-st').innerHTML=MOS.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
$('#ord-st').addEventListener('change',e=>{const o=ORDERS[cur&&cur.s==='order'?cur.i:0];o.st=e.target.value;if(['part','done'].includes(o.st))o.consent=o.consent!==false?true:o.consent;if(o.st==='nores')o.consent=false;if(cur.s==='order')renderOrder();else renderOrders();SC.ev('mo-st')});
function moRepeat(o){ // ТЗ 2.10.1: корзина с набором заказа, весь набор отмечен, остальное — без галочек
  [...cart.values()].forEach(v=>v.on=false);
  o.ids.forEach(id=>{if(!cart.has(id))cart.set(id,{on:true});cart.get(id).on=true});
  LAB=o.lab; go({s:'cart'}); toast(`Добавили в корзину ${anW(o.ids.length)} из заказа`); SC.ev('mo-repeat');
}
function moSupport(){
  const T=['Подготовка к анализам','Где и когда сдать','Оплата и возврат','Результаты анализов','Другой вопрос'];
  openSheet(`<div class="sbody"><div class="csec" style="border-radius:0 0 24px 24px;padding-top:0;gap:8px">
    <div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div>
    <div class="sh" style="font-size:22px;line-height:28px">Поддержка</div><p class="pdesc" style="margin:0">Выберите тему — откроем чат с поддержкой и прикрепим заказ.</p>
    <div class="rows">${T.map(t=>`<button class="row" data-motopic="${esc(t)}"><span>${t}</span><span style="color:var(--light)">${SV.chevR}</span></button>`).join('')}</div>
  </div></div><div class="sfoot"><button class="lnk" data-act="close">Закрыть</button>${hi()}</div>`);
}
$('#ph').addEventListener('click',e=>{
  if(e.target.closest('#dlg')) return;
  const t=e.target.closest('[data-mof],[data-motab],[data-momore],[data-morepeat],[data-moprep],[data-moclinic],[data-motopic],[data-ordopen],[data-act^="mo-"]'); if(!t) return;
  const d=t.dataset;
  if(d.motab){MO.tab=d.motab;renderOrders();return}
  if(d.mof){MO.f=d.mof;renderOrders();SC.ev('mo-f');return}
  if(d.momore!==undefined){MO.more[d.momore]=!MO.more[d.momore];renderOrders();SC.ev('mo-more');return}
  if(d.morepeat!==undefined){moRepeat(ORDERS[+d.morepeat]);return}
  if(d.moprep!==undefined){openPrep(ORDERS[+d.moprep].ids);return}
  if(d.moclinic!==undefined){const L=ORDERS[+d.moclinic].lab;openClinic(L.id,null);return}
  if(d.motopic){closeSheet();toast(`Откроем чат поддержки: «${d.motopic}»`);return}
  const a=d.act;
  if(a==='mo-support'){moSupport();SC.ev('mo-support');return}
  if(a==='mo-cancel'){const o=ORDERS[cur.i];dialog('Отменить запись?',`Отправим запрос в лабораторию. Когда она подтвердит отмену, вернём ${fmt(o.total)} на карту •• ${o.card}${o.pts?`, а ${o.pts} баллов — на баланс`:''}.`,[['Отменить запись',()=>{o.st='cancelling';renderOrder();toast('Отправили запрос на отмену');SC.ev('mo-cancel')}],['Не отменять',()=>{}]]);return}
  if(a==='mo-howres'){toast('Результаты выдадут в лаборатории по паспорту или пришлют на почту из личного кабинета лаборатории');return}
  if(a==='mo-map'||a==='mo-route'){toast('Откроем маршрут в картах');return}
  if(a==='mo-call'){toast('Позвоним в лабораторию');return}
  if(a==='mo-copy'){toast('ID записи скопирован');return}
  if(a==='mo-dl'){toast('Откроем PDF с результатом');return}
  if(d.ordopen!==undefined){if(e.target.closest('button,[data-act],a'))return;go({s:'order',i:+d.ordopen});SC.ev('mo-detail');return}
});
