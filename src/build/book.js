/* =================== ЗАПИСЬ В КЛАССИЧЕСКУЮ КЛИНИКУ (Figma «Виды записей» 855:48381) ===================
   Способ записи — свойство клиники. В прототипе его выбирают переключателем над телефоном;
   «Как в макете»: в корзине один анализ → онлайн-запись по расписанию (923:56948), несколько → «Позвонить» (855:50903);
   с детальки «Записаться на 1 анализ» → онлайн-запись (923:62734). */
let BK=null; // {L, ids, one, mode, day, time, usePts, c1, c2, k, fio, b, phone}
const BK_MODES=[['auto','Как в макете'],['call','Позвонить'],['callback','Обратный звонок'],['rtz','Онлайн-запись по расписанию']];
let BK_OVR='auto';
function bkMode(n,one){return BK_OVR!=='auto'?BK_OVR:(one||n===1)?'rtz':'call'}
const BK_PH='+7 (812) 622-45-56';
const IC_PEN='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14.5 5.5 4 4M4 20l1-4.5L15.8 4.7a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2L8.5 19 4 20Z"/></svg>';
const IC_BOLT='<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9.2 1 3 9h4.3l-1 6L13 6.8H8.6L9.2 1Z"/></svg>';
const IC_PH16='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.2 3.3 9.4 7c.4.7.3 1.5-.3 2l-1.2 1.1a11.5 11.5 0 0 0 6 6l1.1-1.2c.5-.6 1.3-.7 2-.3l3.7 2.2c.7.4.9 1.3.5 2l-1.1 1.7c-.6.9-1.6 1.4-2.6 1.2C10.3 20.6 3.4 13.7 2.3 6.5c-.2-1 .3-2 1.2-2.6L5.2 2.8c.7-.4 1.6-.2 2 .5Z"/></svg>';
const IC_ARR=d=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d?'M5 12h14m-5-5 5 5-5 5':'M19 12H5m5-5-5 5 5 5'}"/></svg>`;
const IC_SVC='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2.5v4a3 3 0 0 0 6 0v-4M8 9.5v2.5a4.5 4.5 0 0 0 9 0v-1.5"/><circle cx="17" cy="9" r="1.5"/></svg>';
const BKMON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const WDF=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const dKey=d=>d.getFullYear()*10000+d.getMonth()*100+d.getDate();
const TODAY=(()=>{const d=new Date();d.setHours(0,0,0,0);return d})();
function slotsFor(d){ // доступность и время — детерминированный мок
  if(d<TODAY) return [];
  const s=(d.getDate()*7+d.getMonth()*3)%5; if(d.getDay()===0&&s<3) return [];
  if(s===4&&dKey(d)!==dKey(TODAY)) return [];
  return [['11:00','13:00','13:30','14:00','15:30','16:00','16:30'],['9:30','10:00','12:30','15:00','17:30'],['8:30','11:30','14:30','16:00','18:00','18:30']][s%3];
}

function bkStart(L,ids,one){
  const mode=bkMode(ids.length,one);
  BK={L,ids:ids.slice(),one:!!one,mode,day:null,time:null,usePts:true,c1:true,c2:true,k:0,...bkPat(0),wk:0};
  if(mode==='call'){callClinic(L);return}
  go({s:mode==='callback'?'bk':'slot'}); SC.ev('bk-'+mode);
}
function bkPat(k){const d=PDATA[k];return {k,fio:[d.f,d.i,d.o].filter(Boolean).join(' '),b:d.b,phone:'+7 (999) 999 99 99'}}
function bkTotal(){const t=BK.ids.reduce((s,id)=>s+labPrice(BK.L,id),0);const bl=!BK.one&&BK.ids.some(id=>isBlood(items[id]))?bloodOf(BK.L):0;return t+bl}
function bkOff(){return BK.usePts&&BK.mode==='rtz'?ptsOff(bkTotal()):0}
function bkPts(){return BK.ids.length*PTS_PER} // 50 за анализ (ТЗ 2.8)
function bkWhat(){return BK.ids.length===1?shortName(items[BK.ids[0]].name):'Корзина анализов'}
function bkHead(withPrice){
  const tot=bkTotal(), off=withPrice?bkOff():0;
  return `<div class="bk-cl"><b>${esc(BK.L.n)}</b><span>${esc(BK.L.a)}</span></div>
  <div class="bk-what"><div><b>${esc(bkWhat())}</b>${off?`<div class="bk-pr"><span class="g">${fmt(tot-off)}</span><s>${fmt(tot)}</s></div><div class="bk-off">с учетом −${fmt0(off)} ${SV.coinY} баллов</div>`:`<div class="bk-pr">${fmt(tot)}</div>`}</div></div>`;
}
function bkPatHTML(){
  const chips=PATIENTS.map((p,k)=>`<button class="pchip${k===BK.k?' on':''}" data-bkp="${k}">${esc(p.n)}</button>`).join('');
  const f=(k,l,o)=>`<label class="fld${BK[k]?' has':''}"><span class="fl">${l}</span><input data-bkf="${k}" value="${esc(BK[k]||'')}" placeholder="${l}" ${o||''} autocomplete="off"><button class="fx" type="button" data-act="bk-fx" data-fk="${k}" aria-label="Очистить">${CLEARIC}</button></label>`;
  return `<div class="sh" style="font-size:22px;line-height:28px">Данные пациента</div><div class="pchips hscroll">${chips}</div>
  ${f('fio','ФИО пациента полностью')}${f('b','Дата рождения','inputmode="numeric" maxlength="10"')}${f('phone','Номер телефона','inputmode="tel"')}`;
}
const prepRow=()=>`<button class="bk-prep pickrow" data-act="bk-prep"><span class="illu" style="background-image:url(${ASSET.prep})"></span><span class="tx"><b>Подготовка к анализам</b></span><span>${SV.chevR}</span></button>`;

/* 855:56203 — обратный звонок */
function renderBK(){
  $('#bk-body').innerHTML=`<div class="csec bk-top">${bkHead(false)}</div>
  <div class="csec bk-form">
    <div class="bk-note g">${IC_PH16}<span>Предварительная запись — клиника перезвонит</span></div>
    ${bkPatHTML()}
    <button class="big wide paybtn" data-act="bk-send"><span>Записаться</span><span class="sep"></span><span class="bn">${SV.coinY}+${fmt0(bkPts())}</span></button>
    <p class="bk-legal">Нажимая кнопку «Записаться», я даю <a href="#" data-act="noop">согласие</a> на обработку персональных данных</p>
  </div>`;
}
/* 923:61259 / 923:64461 — выбор даты и времени */
function renderSlot(){
  const w0=new Date(TODAY); w0.setDate(w0.getDate()-((w0.getDay()+6)%7)+BK.wk*14);
  const days=[...Array(14)].map((_,i)=>{const d=new Date(w0);d.setDate(d.getDate()+i);return d});
  if(!BK.day||!days.some(d=>dKey(d)===BK.day)){const f=days.find(d=>slotsFor(d).length);BK.day=f?dKey(f):null;}
  const sel=days.find(d=>dKey(d)===BK.day), last=days[13];
  const rng=`${w0.getDate()} ${BKMON[w0.getMonth()]} – ${last.getDate()} ${BKMON[last.getMonth()]}`;
  const isT=sel&&dKey(sel)===dKey(TODAY);
  $('#slot-body').innerHTML=`<div class="csec bk-top">${bkHead(false)}${prepRow()}</div>
  <div class="csec bk-cal">
    <div class="sh" style="font-size:22px;line-height:28px">Выберите дату</div>
    <div class="cal-nav"><button data-act="bk-wk" data-d="-1" ${BK.wk>0?'':'disabled'} aria-label="Раньше">${IC_ARR(0)}</button><b>${rng}</b><button data-act="bk-wk" data-d="1" aria-label="Позже">${IC_ARR(1)}</button></div>
    <div class="cal-grid">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<i>${x}</i>`).join('')}${days.map(d=>{const ok=slotsFor(d).length,k=dKey(d);return `<button class="cd${ok?' ok':''}${k===BK.day?' on':''}" data-day="${k}" ${ok?'':'disabled'}>${d.getDate()}</button>`}).join('')}</div>
    ${sel?`<div class="sh" style="font-size:22px;line-height:28px;margin-top:16px">Выберите время ${isT?'на сегодня, ':'на '}${sel.getDate()} ${BKMON[sel.getMonth()]}</div>
    <div class="cal-times">${slotsFor(sel).map(t=>`<button class="ct" data-time="${t}">${t}</button>`).join('')}</div>`:''}
    <div class="bk-instant">${IC_BOLT}<span>Мгновенное подтверждение записи</span></div>
  </div>`;
}
const bkDate=()=>{const y=Math.floor(BK.day/10000),m=Math.floor(BK.day/100)%100,dd=BK.day%100;return new Date(y,m,dd)};
/* 923:61210 / 923:64383 — форма онлайн-записи */
function renderBKF(){
  const d=bkDate(), bal=String(BALANCE).replace(/\B(?=(\d{3})+(?!\d))/g,nb), pts=ptsOff(bkTotal());
  $('#bkf-body').innerHTML=`<div class="csec bk-top">${bkHead(true)}<div class="bk-when">${WDF[d.getDay()]}, ${d.getDate()} ${BKMON[d.getMonth()]}, ${BK.time}</div>
    <div class="bk-note y">${IC_BOLT}<span>Мгновенное подтверждение записи</span></div>${prepRow()}</div>
  <div class="csec bk-form">
    ${bkPatHTML()}
    <div class="pts-row${pts?'':' dis'}" style="width:auto;max-width:none"><button class="sw${BK.usePts&&pts?' on':''}" data-act="bk-pts" role="switch" aria-checked="${!!(BK.usePts&&pts)}" aria-label="Списать баллы" ${pts?'':'disabled'}></button><div class="tx"><b>Списать ${fmt(PTS_FIX)} баллами</b><span>У вас ${SV.coinY} ${bal} баллов</span></div></div>
    <button class="big wide paybtn" data-act="bk-book" ${BK.c1&&BK.c2?'':'disabled'}><span>Записаться</span><span class="sep"></span><span class="bn">${SV.coinY}+${fmt0(bkPts())}</span></button>
    <button class="consent" data-act="bk-c1"><span class="cb y${BK.c1?' on':''}"><i>${SV.tick}</i></span><span>Даю <u>согласие</u> на обработку моих персональных данных</span></button>
    <button class="consent" data-act="bk-c2"><span class="cb y${BK.c2?' on':''}"><i>${SV.tick}</i></span><span>Даю <u>согласие</u> на получение звонков по моей записи</span></button>
  </div>`;
}
/* 855:56522 «Заявка отправлена в клинику» / 923:61560 «Вы успешно записаны» */
function renderBKOK(){
  const B=BK.done||BK;
  if(B.mode==='callback'){
    $('#bkok-body').className='bkok sent';
    $('#bkok-body').innerHTML=`<div class="bk-ill" style="background-image:url(${ASSET.callback})"></div>
    <h1>Заявка отправлена в клинику</h1>
    <div class="bk-li">${SV.clock}<span>Клиника перезвонит вам в течение 2-3 часов в рабочее время</span></div>
    <div class="bk-li">${IC_PH16}<span>С номера ${BK_PH}</span></div>
    <div class="bk-got">За запись вам начислено: <b>${SV.coinY}${fmt0(B.pts)} ${plural(B.pts,'балл','балла','баллов')}</b></div>`;
    return;
  }
  const d=bkDate();
  $('#bkok-body').className='bkok booked';
  $('#bkok-body').innerHTML=`<div class="bk-wave" style="background-image:url(${ASSET.wave})"><h1>Вы успешно записаны</h1></div>
  <div class="bk-card">
    <div class="bk-tagrow"><span class="bk-tag">${d.getDate()} ${BKMON[d.getMonth()]}, ${B.time}</span>${SV.chevR}</div>
    <button class="bk-cal2" data-act="bk-ical">${SV.cal}<span>Добавить в календарь</span></button>
    <b class="bk-cn">${esc(B.L.n)}</b>
    <div class="bk-ad">${esc(B.L.a)}<span class="mt"><u style="background:${B.L.mc}"></u>${esc(B.L.metro)} (${esc(B.L.md)})</span></div>
    <div class="bk-ph">${IC_PH16}<span>${BK_PH}</span><button data-act="bk-call">позвонить</button></div>
    <div class="bk-svc">${IC_SVC}<div><b>${esc(bkWhat())}</b> <span class="g">${fmt(B.sum)}</span>${B.off?`<div class="bk-off">с учетом −${fmt0(B.off)} ${SV.coinY} баллов</div>`:''}</div></div>
  </div>
  <p class="bk-will">Начислим ${SV.coinY}<b>${fmt0(B.pts)} ${plural(B.pts,'балл','балла','баллов')}</b> в течение 24 часов после назначенного времени приёма</p>`;
}
function bkFinish(){ // записанные анализы уходят из корзины
  const tot=bkTotal(), off=bkOff();
  BK.done={mode:BK.mode,L:BK.L,time:BK.time,sum:tot-off,off,pts:bkPts()};
  if(!BK.one){BK.ids.forEach(id=>cart.delete(id));if(!cart.size)LAB=null;}
  resetTo({s:'bkok'});
}

/* шторка «Позвонить»: «Да» → «Очистить корзину?» (923:57415) */
function callYes(){
  openSheet(`<div class="chev-ctl" data-act="close" style="color:var(--ink)">${SV.grabDown}</div><div class="sbody"></div><div class="sfoot callq">
    <div class="sh" style="font-size:22px;line-height:28px">Очистить корзину?</div>
    <p class="callq-p">Вы записались по телефону, оформлять эти анализы в приложении не нужно.</p>
    <button class="big wide" data-act="call-clear">Да, очистить</button>
    <button class="lnk" data-act="call-keep" style="height:44px">Нет, оставить анализы</button>${hi()}</div>`);
}
/* верхний снек (компонент Snack, 923:59613 / 923:59206) */
let snt; function snack(m){const s=$('#snack');s.querySelector('span').textContent=m;s.classList.add('on');clearTimeout(snt);snt=setTimeout(()=>s.classList.remove('on'),3000)}

function bkAct(a,t){
  switch(a){
    case 'bk-edit': back(); return true;
    case 'bk-prep': openPrep(BK.ids); return true;
    case 'bk-send': BK.done=null; bkFinish(); SC.ev('bk-sent'); return true;
    case 'bk-book': if(!(BK.c1&&BK.c2)) return true; bkFinish(); SC.ev('bk-booked'); return true;
    case 'bk-pts': BK.usePts=!BK.usePts; renderBKF(); return true;
    case 'bk-c1': BK.c1=!BK.c1; renderBKF(); return true;
    case 'bk-c2': BK.c2=!BK.c2; renderBKF(); return true;
    case 'bk-wk': BK.wk=Math.max(0,BK.wk+ +t.dataset.d); BK.day=null; renderSlot(); return true;
    case 'bk-fx': {const k=t.dataset.fk;BK[k]='';const sc=cur.s==='bk'?renderBK:renderBKF;sc();const i=document.querySelector(`[data-bkf="${k}"]`);if(i)i.focus();return true}
    case 'bk-ical': toast('Добавили в календарь'); return true;
    case 'bk-call': toast(`Звоним в ${BK.done?BK.done.L.n:BK.L.n}…`); return true;
    case 'bk-orders': resetTo({s:'orders'}); return true;
    case 'call-clear': closeSheet(); cart.clear(); LAB=null; resetTo({s:'home'}); go({s:'an',q:''},true,false); snack('Корзина очищена'); SC.ev('call-ans'); return true;
    case 'call-keep': closeSheet(); resetTo({s:'home'}); go({s:'an',q:''},true,false); snack('Анализы остались в корзине'); SC.ev('call-ans'); return true;
  }
  return false;
}
function bkClick(e){
  const d=e.target.closest('[data-bkp],[data-day],[data-time]'); if(!d||!BK) return false;
  if(d.dataset.bkp!==undefined){Object.assign(BK,bkPat(+d.dataset.bkp));(cur.s==='bk'?renderBK:renderBKF)();return true}
  if(d.dataset.day){BK.day=+d.dataset.day;renderSlot();return true}
  if(d.dataset.time){BK.time=d.dataset.time;go({s:'bkf'});SC.ev('bk-time');return true}
  return false;
}
['#bk-body','#bkf-body'].forEach(q=>$(q).addEventListener('input',e=>{const k=e.target.dataset.bkf;if(!k||!BK)return;let v=e.target.value;
  if(k==='b'){const dg=v.replace(/\D/g,'').slice(0,8);v=dg.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{2})(\d)/,'$1.$2');if(v!==e.target.value)e.target.value=v;}
  BK[k]=v;e.target.closest('.fld').classList.toggle('has',!!v);}));
/* переключатель способа записи над телефоном */
$('#bk-mode').innerHTML=BK_MODES.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
$('#bk-mode').addEventListener('change',e=>{BK_OVR=e.target.value;if(cur&&cur.s==='cart'){renderCart();updateFooters('s-cart')}});
function bkSel(){const w=$('#bk-ctl');if(!w)return;const on=(CUR_ID==='s-cart'&&isClinic(LAB))||CUR_ID==='s-detail'||(CUR_ID==='s-clinic'&&typeof clLab==='function'&&!!clLab()&&isClinic(clLab()));w.hidden=!on;}
