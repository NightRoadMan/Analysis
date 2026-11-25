/* =================== ДЕТАЛЬКА КЛИНИКИ / ЛАБОРАТОРИИ (Figma 619:20514, ТЗ 2.12.3, 2.6) ===================
   Вход: шапка карточки «Где сдать» на детальке анализа (с контекстом анализа), карточка филиала на карте,
   лаборатория в «Моих записях» (без контекста). Корзина общая с витриной: выбор филиала как в варианте A. */
const CLSV=(d,c,s,sw)=>`<svg width="${s||24}" height="${s||24}" viewBox="0 0 24 24" fill="none" stroke="${c||'currentColor'}" stroke-width="${sw||1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CLP={
  home:'<path d="M4 10.5 12 4l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>',
  phone:'<path d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2L14 12.5l4 1.5v3a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2"/>',
  compass:'<circle cx="12" cy="12" r="8.5"/><path d="m15 9-2 4-4 2 2-4z"/>',
  pin:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  share:'<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  chevD:'<path d="M6 9l6 6 6-6"/>',
  shield:'<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  medal:'<circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>',
  thumb:'<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/>',
  steth:'<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
  chat:'<path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/>',
  flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>'
};
const CLSTAR=c=>`<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="${c}"/></svg>`;
/* шаблоны сетей: тексты и контакты из Figma 619:20514 и реальных данных (см. память vitrina-ramsay-real-data) */
const CLBRAND={
  inv:{kind:'lab',about:'ИНВИТРО — федеральная сеть медицинских лабораторий. В офисе @@ST@@ можно сдать анализы, подготовиться к беременности, пройти генетическое обследование и оформить медицинскую справку, в том числе в бассейн. Администратор подскажет, как подготовиться к анализу.',
    phone:'+7 (800) 200-87-69',sched:'Пн – пт 7:30–17:00, сб – вс 8:00–14:00',today:'07:30 – 17:00',wd:'07:30 – 17:00',we:'08:00 – 14:00',hero:'h-invitro',map:'m-invitro',rate:'5.0',rcount:'1 оценка',
    ach:[['thumb','Нет отрицательных отзывов']],svc:[['Справка в бассейн',750,'завтра, 07:30'],['Медицинская справка (форма 086/у)',1500,'сегодня, 14:30']],doctors:null,promo:['Скидка 15% на гормоны щитовидной железы','До 15 декабря']},
  kdl:{kind:'lab',about:'KDL — федеральная сеть клинико-диагностических лабораторий. Здесь сдают анализы крови и мочи, ПЦР-тесты, гормоны и чекапы. Результаты приходят на почту и в приложение.',
    phone:'+7 (800) 200-36-30',sched:'Пн – пт 7:00–19:00, сб – вс 8:00–15:00',today:'07:00 – 19:00',wd:'07:00 – 19:00',we:'08:00 – 15:00',hero:null,map:null,rate:'4.6',rcount:'42 отзыва',
    ach:[['medal','Выбор пациентов 2025']],svc:[['Справка для бассейна',690,'сегодня, 16:00']],doctors:null,promo:['Чекап «Женское здоровье» со скидкой 20%','До 31 декабря']},
  gem:{kind:'lab',about:'Гемотест — федеральная сеть медицинских лабораторий. В офисе сдают анализы, делают УЗИ и ЭКГ, оформляют справки. Часы забора биоматериала отличаются от графика офиса.',
    phone:'+7 (800) 550-13-13',sched:'Пн – пт 7:30–19:00, сб – вс 8:00–14:00',today:'07:30 – 19:00',wd:'07:30 – 19:00',we:'08:00 – 14:00',hero:null,map:null,rate:'4.7',rcount:'58 отзывов',
    ach:[['thumb','Нет отрицательных отзывов']],svc:[['ЭКГ с расшифровкой',1100,'сегодня, 18:30']],doctors:null,promo:['Скидка 10% на первый заказ','Постоянно']},
  rem:{kind:'clinic',about:'«Рэмси Диагностика» — сеть экспертных диагностических центров, которую в 2014 году открыл в России Пол Рэмси, основатель Ramsay Health Care. МРТ и КТ на оборудовании GE, УЗИ, приёмы врачей и лабораторные анализы. Центр на площади Конституции — около 1 км от метро Московская, работает ежедневно до полуночи.',
    phone:'+7 (812) 210-51-99',sched:'Ежедневно, с 9:00 до 24:00',today:'09:00 – 24:00',wd:'09:00 – 24:00',we:'09:00 – 24:00',hero:'h-ramsay',map:'m-ramsay',rate:'4.8',rcount:'101 отзыв и 100 оценок',rphoto:'101 отзыв',
    ach:[['medal','Выбор пациентов 2025'],['thumb','Нет отрицательных отзывов']],
    svc:[['МРТ позвоночника (один отдел)',4800,'сегодня, 21:00'],['Консультация гинеколога + УЗИ малого таза',6200,'завтра, 10:30'],['Первичный приём кардиолога',3500,'завтра, 12:00',true],['ФГДС / Гастроскопия желудка',6500,'суббота, 28 ноя, 21:00'],['МРТ головного мозга (+ придаточных пазух носа)',6000,'сегодня, 14:00']],
    doctors:[['Вилков Алексей Юрьевич','Терапевт · Хирург · Акушер-гинеколог'],['Смирнова Ольга Петровна','Эндокринолог · стаж 12 лет']],promo:['МРТ днём по ночной цене','До 30 ноября']}
};
const CLPOLY={kind:'free',name:'Городская поликлиника № 51',addr:'пр. Космонавтов, д. 33–35',metro:'Московская',mc:'#0078C9',md:'1,8 км',rate:'4.0',rcount:'1 300 отзывов',
  ach:[['medal','Бесплатно по ОМС'],['thumb','Поликлиника для взрослых']],
  about:'Городская поликлиника № 51 Московского района — государственная поликлиника для взрослых. Приём бесплатно по полису ОМС, есть и платные услуги. Больше 200 врачей, в том числе травматолог-ортопед, невролог, врач УЗИ и функциональной диагностики.',
  phone:'+7 (812) 241-28-33',sched:'Пн – пт, с 8:00 до 20:00',today:'08:00 – 20:00',wd:'08:00 – 20:00',we:'Уточняйте',hero:'h-poly',map:'m-poly',
  svc:[['Приём участкового терапевта',null],['Приём невролога',1800],['Приём травматолога-ортопеда',null],['УЗИ органов брюшной полости',1600],['ЭКГ',null]],
  an:[['Пролактин',310,'hormones-03'],['Клинический анализ крови',null,'general-01'],['Креатинин',290,'x-creat'],['Общий анализ крови с лейкоцитарной формулой',560,'hematology-02'],['Общий анализ крови без лейкоформулы + СОЭ',null,'general-02']],
  doctors:[['Козлова Марина Андреевна','Терапевт участковый'],['Орлов Дмитрий Сергеевич','Травматолог-ортопед']],promo:null};
/* филиал из «Моих записей» (Figma 676:27687): Инвитро на Кушелевской, цены с zoon и Яндекс Карт */
const KUSH={blood:250,id:'kush',w:1,x:MC[0]+40,y:MC[1]-60,brand:BRANDS[0],n:'Инвитро на Кушелевской дороге',a:'Кушелевская дорога, д. 6, к. 1, стр. 1',metro:'Лесная',mc:'#D6083B',md:'1,3 км',rate:'5,0',rev:1,cov:1,f:1.05,pts:true,hours:['7:30—17:00','8:00—14:00'],
  px:{'Клинический анализ крови':835,'Ферритин':955,'Тиреотропный гормон':570,'25-ОН витамин D':2175,'Глюкоза':290,'Гликированный гемоглобин':975,'Креатинин':310,'Пролактин':750,'Холестерин общий':350}};
const pxOf=(L,id)=>{if(!L.px)return null;const n=items[id].name;const k=Object.keys(L.px).find(x=>n.startsWith(x));return k?L.px[k]:null};
const CLW={}; const clW=k=>CLW[k]||(CLW[k]=wlab(k));
const CLREV=[
  {n:'Софья',d:'12.11.2026',s:4,badge:'После записи',av:'a1',svc:'Пролактин, общий анализ крови',an:['Пролактин','Клинический анализ крови','Общий анализ крови','Ферритин'],t:'Сдавала анализы по направлению эндокринолога. Записалась онлайн, в процедурном приняли без очереди, кровь взяли быстро и почти безболезненно. Результаты пришли на почту на следующий день, с нормами и понятными пометками.',c:3,l:1},
  {n:'Александра М.',d:'10.11.2026',s:4,badge:'Проверен модератором',av:'a2',ref:'place',an:['Гликированный','Холестерин','Креатинин','Глюкоза'],t:'Сдавала чекап: гликированный гемоглобин, холестерин и креатинин. Администратор заранее напомнила прийти натощак и спросила, какие лекарства принимаю. Медсестра очень аккуратная, синяка не осталось.',c:0,l:0},
  {n:'Евгения',d:'28.10.2026',s:4,badge:'После записи',av:'a3',ref:'doc',an:[],t:'Была на приёме у терапевта, всё объяснил, назначил обследование. Записывалась через приложение, перенос времени прошёл без проблем.',c:0,l:2}
];
/* место = лаборатория из корзинной модели (L) + шаблон сети */
function clPlace(src){
  if(src==='poly') return Object.assign({key:'poly',L:null},CLPOLY);
  const L=src==='kush'?KUSH:(typeof src==='string'&&src.startsWith('w')?clW(+src.slice(1)):LABS.find(x=>x.id===src));
  const B=CLBRAND[L.brand.k];
  const kushB=L===KUSH?{rate:'5.0',rcount:'1 оценка'}:L.brand.k==='rem'?{}:{ /* Рэмси — рейтинг из макета 620:22245 */rate:L.rate?String(L.rate).replace(',','.'):B.rate,rcount:L.rev?`${L.rev} ${plural(L.rev,'отзыв','отзыва','отзывов')}`:B.rcount};
  const a=String(L.a).replace(/^г\. Санкт-Петербург, /,'');
  const st=L.n.replace(/^\S+\s+/,''); // «на Кушелевской дороге»
  return Object.assign({key:src,L,name:L.n,addr:a,metro:L.metro,mc:L.mc,md:L.md},B,kushB,{about:B.about.replace('@@ST@@',st)});
}
const CL={src:null,ctx:null,tab:'info',only:false,q:'',more:false};
function clLab(){return CL.src==='poly'?null:clPlace(CL.src).L}
/* креатинина нет в моках каталога: строка только для деталек клиник, как в макете */
items['x-creat']=Object.assign({},items['biochemistry-05'],{id:'x-creat',name:'Креатинин',price:300,fast:true});
/* названия и порядок анализов в «Ценах» — как в макетах; ключи — id моков */
const CLNM={lab:{'biochemistry-08':'Гликированный гемоглобин (HbA1c)','general-01':'Клинический анализ крови: общий анализ, лейкоформула, СОЭ','hormones-01':'ТТГ (тиреотропный гормон)','vitamins-01':'25-OH витамин D общий','biochemistry-06':'Холестерин общий'},
  clinic:{'general-01':'Клинический анализ крови с лейкоформулой и СОЭ','hematology-02':'Общий анализ крови с лейкоцитарной формулой','general-02':'Общий анализ крови без лейкоформулы + СОЭ'}};
CLNM.free=CLNM.clinic;
const clNm=(P,id)=>(CLNM[P.kind]||{})[id]||items[id].name;
const CLORD={lab:['biochemistry-08','x-creat','general-01','biochemistry-05','hormones-01','biochemistry-01','vitamins-01','biochemistry-06'],
  clinic:['s0','s1','s2','general-01','s3','s4','x-creat','hematology-02','general-02']}; // у клиники услуги и анализы вперемешку (620:24746)
function clAnalyses(P){
  if(P.kind==='free') return [];
  const L=P.L, out=[];
  const push=id=>{if(!id||!items[id]||out.includes(id)||!labHas(L,id))return;out.push(id)};
  if(CL.ctx) push(CL.ctx);
  CLORD[P.kind].filter(k=>k[0]!=='s').forEach(push);
  return out;
}
const clPrice=(L,id)=>pxOf(L,id)??labPrice(L,id);
function clTags(i){
  const prep=i.fast?'Натощак':/без подготовки|не требуется/i.test(i.prep.title)?'Без подготовки':'';
  return `<div class="cl-tags"><span class="cl-tag">${ic('flask',16)}<span>${esc(i.bio)}</span></span><span class="cl-tag">${ic('clock',16)}<span>${esc(i.days||'1 день')}</span></span>${prep?`<span class="cl-tag np"><span>${prep}</span></span>`:''}</div>`;
}
/* состояние кнопки анализа в этом филиале — вариант A (решение 23.11) */
function clState(L,id){if(!inCart(id))return 'add';return LAB&&LAB.id===L.id?'in':'here'}
function clRow(P,id){
  const i=items[id], L=P.L, st=clState(L,id);
  const acts=st==='in'?`<button class="btn cl-in" data-cla="rm" data-id="${id}">${ic('check',16)}В корзине</button>`
    :`<button class="btn" data-cla="add" data-id="${id}">${ic('basketW',16)}В корзину</button><button class="btn t" data-cla="one" data-id="${id}">Записаться</button>`;
  const tap=id.startsWith('x-')?'':` tap" data-open="${id}`;
  return `<article class="cl-pc"><div class="n${tap}">${esc(clNm(P,id))}</div><div class="cl-pp"><b>${fmt(clPrice(L,id))}</b></div>${isBlood(i)?clBlood(bloodOf(L)):''}<div class="cl-acts">${acts}</div></article>`;
}
const clBlood=p=>`<div class="cl-bl"><span>Оплачивается отдельно:</span><div><span>Взятие крови</span><i></i><b>от ${fmt(p)}</b></div></div>`;
function clSvc(P,r){
  if(P.kind==='free') return `<article class="cl-pc"><div class="n">${esc(r[0])}</div><div class="cl-pp"><b>${r[1]==null?'Уточняйте по телефону':fmt(r[1])}</b></div></article>`;
  return `<article class="cl-pc"><div class="n">${esc(r[0])}</div><div class="cl-pp"><b>${r[3]?'от ':''}${fmt(r[1])}</b></div><div class="cl-acts"><button class="btn" data-act="cl-svc">Записаться</button><div class="cl-near">Ближайшая запись:<b>${r[2]}</b></div></div></article>`;
}
function clInfo(P){
  const map=P.map?`<div class="cl-mapimg" style="background-image:url(${CLIMG[P.map]})"></div>`:`<div class="cl-mapimg gen"><div class="mapw" style="transform:translate(-430px,-610px) scale(.8)"></div><i class="cl-mpin"></i></div>`;
  return `<div class="cl-pane info">
   <div class="cl-isec"><button class="cl-h3" data-act="cl-about" aria-expanded="${CL.more}">О клинике${CLSV(CL.more?'<path d="M6 15l6-6 6 6"/>':CLP.chevD,'var(--light)',22)}</button><div class="cl-about${CL.more?'':' cl'}">${esc(P.about)}</div></div>
   <div class="cl-hr"></div>
   <div class="cl-ch">Контакты</div>
   <div class="cl-ct">${CLSV(CLP.phone,'#F3AA00')}<div class="b"><div class="h">Телефон</div><div class="s ink">${P.phone}<button class="cl-lnk" data-act="cl-call">позвонить</button></div></div></div>
   <div class="cl-ct">${CLSV(CLP.home,'#F3AA00')}<div class="b"><div class="h">${esc(P.addr)}</div><div class="s">${esc(P.sched)}</div></div></div>
   <div class="cl-ct">${CLSV(CLP.cal,'#F3AA00')}<div class="b"><div class="h"><span>Сегодня</span><span>${P.today}</span></div><div class="s g"><span>Пн – пт</span><span>${P.wd}</span></div><div class="s g"><span>Сб – вс</span><span>${P.we}</span></div></div></div>
   <div class="cl-ct">${CLSV(CLP.compass,'#F3AA00')}<div class="b"><div class="h">Ближайшие станции</div><div class="cl-station"><i style="background:${P.mc}"></i>${esc(P.metro)} (${P.md})</div></div></div>
   <div class="cl-ct" style="border-bottom:0">${CLSV(CLP.pin,'#F3AA00')}<div class="b"><div class="h">На карте</div></div></div>
   ${map}
   <div class="cl-foot">Если вы нашли неактуальную информацию или хотите внести дополнение — <u>сообщите нам!</u></div>
  </div>`;
}
function clPrices(P){
  const nq=norm(CL.q.trim());
  const ids=clAnalyses(P).filter(id=>!nq||norm(items[id].name).includes(nq));
  const svc=(P.svc||[]).filter(r=>!nq||norm(r[0]).includes(nq));
  const fan=(P.an||[]).filter(r=>!nq||norm(r[0]).includes(nq));
  let body='';
  if(P.kind==='free'){const an=fan.filter(r=>r[2]!=='hormones-03'||CL.ctx==='hormones-03').map(r=>{const i=items[r[2]];return `<article class="cl-pc"><div class="n">${esc(i?clNm(P,r[2]):r[0])}</div><div class="cl-pp"><b>${r[1]==null?'Уточняйте по телефону':fmt(r[1])}</b></div>${i&&isBlood(i)?clBlood(1200):''}</article>`}).join('');
    body=CL.only?an:svc.map(r=>clSvc(P,r)).join('')+an;}
  else if(P.kind==='clinic'&&!CL.only){
    const rows=[]; if(CL.ctx&&ids.includes(CL.ctx)) rows.push(clRow(P,CL.ctx));
    CLORD.clinic.forEach(k=>{if(k[0]==='s'){const r=(P.svc||[])[+k.slice(1)];if(r&&svc.includes(r))rows.push(clSvc(P,r))}else if(ids.includes(k)&&k!==CL.ctx)rows.push(clRow(P,k))});
    ids.filter(id=>!CLORD.clinic.includes(id)&&id!==CL.ctx).forEach(id=>rows.push(clRow(P,id)));
    body=rows.join('');
  }
  else body=(CL.only?'':svc.map(r=>clSvc(P,r)).join(''))+ids.map(id=>clRow(P,id)).join('');
  if(!body) body=`<div class="empty"><b>${CL.only?'Анализов не нашли':'Ничего не нашли'}</b><span>${CL.only?`По запросу «${esc(CL.q)}» анализов здесь нет.`:'Попробуйте изменить запрос.'}</span><button class="btn t" data-act="${CL.only?'cl-allsvc':'cl-clearq'}">${CL.only?'Искать во всех услугах':'Сбросить поиск'}</button></div>`;
  return `<div class="cl-pane">
   <label class="inp cl-inp">${SEARCHIC}<input id="cl-q" type="text" placeholder="Поиск по услуге и анализам" value="${esc(CL.q)}" autocomplete="off" aria-label="Поиск по услуге и анализам"></label>
   ${P.kind==='free'?'':`<div class="cl-ptsbar">${SV.coinY}<span>Доступна оплата баллами</span>${SV.infoC}</div>`}
   <div class="cl-frow"><button class="cl-fchip" data-act="cl-only" aria-pressed="${CL.only}">${CLSV(CLP.flask,'#F3AA00',18,2)}Только анализы${CL.only?`<span class="fx">${FX}</span>`:''}</button></div>
   <div class="cl-list" id="cl-list">${body}</div></div>`;
}
function clPromo(P){
  if(!P.promo) return `<div class="cl-pane"><div class="empty"><b>Акций пока нет</b><span>Когда у клиники появятся акции, они будут здесь.</span></div></div>`;
  return `<div class="cl-pane"><div class="cl-promo"><div class="im"><em>${P.promo[1]}</em></div><div class="tx">${esc(P.promo[0])}</div></div><div class="cl-promo"><div class="im y"><em>Постоянно</em></div><div class="tx">Баллы за каждую запись</div></div></div>`;
}
function clDocs(P){
  if(!P.doctors) return `<div class="cl-pane"><div class="empty"><b>Врачей нет</b><span>В лаборатории только сдают анализы. Записаться к врачу можно в клиниках рядом.</span></div></div>`;
  return `<div class="cl-pane">${P.doctors.map((x,k)=>`<div class="cl-doc"><div class="ava" style="background-image:url(${k===0?CLIMG.doc:''})"></div><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div></div>`).join('')}</div>`;
}
function clRv(P,r){
  const st='★'.repeat(r.s)+'<s>'+'★'.repeat(5-r.s)+'</s>';
  const ref=r.ref==='place'?`<div class="cl-ref"><div class="ava" style="background-image:url(${CLIMG.thumb})"></div>${esc(P.name)}</div>`:r.ref==='doc'?`<div class="cl-ref"><div class="ava" style="background-image:url(${CLIMG.doc})"></div><div>Вилков Алексей Юрьевич<div style="font-size:12px;color:var(--brand-ink)">Терапевт | Хирург | Акушер-гинеколог</div></div></div><div class="cl-ref"><div class="ava" style="background-image:url(${CLIMG.thumb})"></div>${esc(P.name)}</div>`:'';
  return `<article class="cl-rv"><span class="cl-rbadge">${CLSV(r.badge==='После записи'?CLP.check:CLP.shield,'var(--brand-ink)',18,2)}${r.badge}</span>
   <div class="cl-rvh"><div class="ava" style="background-image:url(${CLIMG[r.av]})"></div><div><b>${r.n}</b><span>1 отзыв</span></div></div>
   ${r.svc?`<div class="cl-svc">${CLSV(CLP.steth,'#F3AA00',18,2)}Услуга: ${esc(r.svc)}</div>`:''}
   <div class="cl-rmeta"><span class="cl-stars">${st}</span><span>${r.d}</span></div>${ref}<p>${r.t}</p>
   <div class="cl-rfoot"><span>${CLSV(CLP.chat,'var(--brand-ink)',22)}${r.c||''}</span><span>${CLSV(CLP.thumb,'var(--brand-ink)',22)}${r.l||''}</span></div></article>`;
}
function clReviews(P){
  const lab=P.kind==='lab';
  const bars=[['Отлично',134,.3],['Хорошо',15,.6],['Нормально',0,0],['Плохо',12,.35],['Ужасно',0,0]];
  const top=`<div class="cl-rtop"><div class="q">Оцените ${lab?'лабораторию':'клинику'}</div><div class="st">${CLSTAR('var(--brand-tint)').repeat(5)}</div>
   <button class="cl-wr" data-act="soon">Написать отзыв<span class="sep"></span>${SV.coinY}+20</button>
   <div class="cl-how">${CLSV(CLP.shield,'#F3AA00',22)}Как мы проверяем отзывы?</div>
   <div class="cl-rgrid"><div><div style="font-weight:600;font-size:13px;line-height:16px">Рейтинг по отзывам пользователей</div><div class="big">${P.rate}</div><div class="cl-stars" style="font-size:20px">★★★★★</div><div style="font-size:12px;color:var(--light)">${P.rcount}</div><div class="cl-blk"><span>Заблокировано — 10</span><span>Нерелевантно — 0</span></div></div>
   <div class="cl-bar">${bars.map(b=>`<div><span>${b[0]}</span><em>${lab?(b[0]==='Отлично'?1:0):b[1]}</em></div><i><u style="width:${lab?(b[0]==='Отлично'?100:0):b[2]*100}%"></u></i>`).join('')}</div></div>
   <div class="cl-chips"><span class="on">Все</span><span>5 ★</span><span>4 ★</span><span>3 ★</span><span>2 ★</span><span>1 ★</span></div>
   <div style="font-weight:600;font-size:14px">Сортировать:</div><div class="cl-chips" style="margin-top:-8px"><span class="on">По дате</span><span>Сначала с текстом</span></div></div>`;
  if(lab) return `<div class="cl-pane">${top}<div class="empty" style="margin-top:8px"><b>Отзывов с текстом пока нет</b><span>Станьте первым, кто расскажет о лаборатории.</span></div></div>`;
  let list=CLREV.slice();
  if(CL.ctx){const nm=items[CL.ctx].name;const hit=r=>r.an.some(a=>nm.startsWith(a));list=list.filter(hit).concat(list.filter(r=>!hit(r)));} // ТЗ 2.12.3: отзывы о выбранном анализе выше
  return `<div class="cl-pane" style="gap:8px">${top}${list.map(r=>clRv(P,r)).join('')}</div>`;
}
function renderClinic(keep){
  const s=$('#s-clinic'), y=s.scrollTop, P=clPlace(CL.src);
  $('#cl-title').textContent=P.name;
  const hero=P.hero?`<div class="cl-hero" style="background-image:url(${CLIMG[P.hero]})">`:`<div class="cl-hero gen"><span class="lg" style="background-image:url(${LOGO[P.L.brand.k]})"></span>`;
  $('#cl-body').innerHTML=`${hero}<div class="cl-dots"><i></i><i></i><i></i><i></i><i></i></div><div class="cl-rate">${SV.star}<b>${P.rate}</b><span>${P.rphoto||P.rcount}</span></div></div>
   <div class="cl-head"><div class="cl-achs">${P.kind==='free'?'':`<span class="cl-ach pts">${SV.coinY}Оплата баллами${SV.infoC}</span>`}${P.ach.map(a=>`<span class="cl-ach">${CLSV(CLP[a[0]],'#E8A200',16,2)}${a[1]}</span>`).join('')}</div><div class="n">${esc(P.name)}</div></div>
   <div class="cl-tabs" role="tablist" id="cl-tabs">${[['info','Инфо'],['prices','Цены'],['promo','Акции'],['docs','Врачи'],['reviews','Отзывы']].map(t=>`<button class="cl-tab" role="tab" aria-selected="${t[0]===CL.tab}" data-cltab="${t[0]}">${t[1]}</button>`).join('')}</div>
   <div id="cl-pane">${clPane(P)}</div>`;
  const h=s.querySelector('.hdr'); $('#cl-tabs').style.top=h.offsetHeight+'px';
  if(keep) s.scrollTop=y;
  renderClinicFooter();
}
function clPane(P){return CL.tab==='info'?clInfo(P):CL.tab==='prices'?clPrices(P):CL.tab==='promo'?clPromo(P):CL.tab==='docs'?clDocs(P):clReviews(P)}
function clRefreshList(){const P=clPlace(CL.src);const l=$('#cl-list');if(l&&CL.tab==='prices'){const t=document.createElement('div');t.innerHTML=clPrices(P);l.innerHTML=t.querySelector('#cl-list').innerHTML}renderClinicFooter()}
/* нижний блок: с контекстом — анализ, цена, «Добавить в корзину» + квадрат корзины (Figma 620:26979, 651:38646); без контекста — «Записаться +100» */
function renderClinicFooter(){
  const f=$('#f-clinic'); if(curScr()!=='s-clinic'){f.hidden=true;return}
  const P=clPlace(CL.src);
  if(P.kind==='free'){f.hidden=true;$('#cl-body').style.paddingBottom='40px';return}
  f.hidden=false;
  const n=cart.size, badge=n?`<span class="cnt">${n}</span>`:'';
  const sq=`<button class="cl-sq" data-act="cart" aria-label="Корзина">${ic('basketT',24)}${badge}</button>`;
  if(CL.ctx){
    const i=items[CL.ctx], st=clState(P.L,CL.ctx);
    const main=st==='in'?`<button class="cl-fb t" data-cla="rm" data-id="${CL.ctx}">${ic('check',20)}В корзине</button>`
      :st==='here'?`<button class="cl-fb" data-cla="here" data-id="${CL.ctx}">${PIN_W}Сдать здесь</button>`
      :`<button class="cl-fb" data-cla="add" data-id="${CL.ctx}">${ic('basketW',24)}Добавить в корзину</button>`;
    f.className='ftr cl-ftr';
    f.innerHTML=`<div class="r1"><div class="nm"><b>${esc(shortName(i.name))}</b><span>Готовность за ${esc(i.days||'1 день')}</span></div><div class="pr">${fmt(clPrice(P.L,CL.ctx))}</div></div><div class="r2">${main}${sq}</div>${hi()}`;
    $('#cl-body').style.paddingBottom='230px';
  } else {
    f.className='ftr cl-ftr nb';
    f.innerHTML=`<button class="big wide cl-cta" data-act="cl-svc"><span class="m">Записаться</span><span class="r">${SV.coinY}+100</span></button>${hi()}`;
    $('#cl-body').style.paddingBottom='150px';
  }
}
function clView(src,ctx,tab){
  CL.src=src; CL.ctx=ctx||null; CL.q=''; CL.more=false;
  CL.only=!!ctx; CL.tab=tab||(ctx?'prices':'info'); // ТЗ 2.12.3: с анализом — сразу «Цены» с фильтром «Только анализы»
  if(ctx&&src!=='poly'){const L=clPlace(src).L;L.always=L.always||new Set();L.always.add(ctx)}
  return {s:'clinic',src,ctx:CL.ctx,tab:CL.tab};
}
function openClinic(src,ctx,tab){
  go(clView(src,ctx,tab));
  SC.ev('clinic'+(ctx?'-ctx':''));
}
function clSetLab(L){LAB=L;[...cart.keys()].forEach(x=>{cart.get(x).on=labHas(L,x)})}
function clAct(kind,id){
  const P=clPlace(CL.src), L=P.L, nm=shortName(items[id].name);
  if(kind==='rm'){delCart(id);if(!cart.size)LAB=null;clRefreshList();toast(`${nm} убран из корзины`);SC.ev('cl-rm');return}
  if(kind==='here'){if(!LAB){clSetLab(L);clRefreshList();toast(`Сдаёте в ${L.n}`);return} replaceSheet(id,L,()=>{clSetLab(L);clRefreshList()});return}
  if(kind==='one'){startOne(id,L);return}
  const add=()=>{clSetLab(L);addCart(id);cart.get(id).on=true;clRefreshList();toast('Добавили в корзину');SC.ev('cl-add')}; // апсейла с детальки клиники нет (решение 23.11)
  if(LAB&&LAB.id!==L.id&&cart.size) replaceSheet(id,L,add); else add();
}
$('#ph').addEventListener('click',e=>{
  const t=e.target.closest('[data-cla],[data-cltab],[data-wcl],[data-clplace]'); if(!t||t.closest('#dlg')) return;
  const d=t.dataset;
  if(d.clplace){if(e.target.closest('[data-act]'))return;openClinic(d.clplace,null);return}
  if(d.cla){e.stopPropagation();clAct(d.cla,d.id);return}
  if(d.cltab){CL.tab=d.cltab;cur.tab=CL.tab;renderClinic(true);const s=$('#s-clinic'),tb=$('#cl-tabs');const pin=tb.offsetTop-s.querySelector('.hdr').offsetHeight;if(s.scrollTop>pin||d.cltab!=='info')s.scrollTop=pin;SC.ev('cltab:'+d.cltab);return}
  if(d.wcl!==undefined){if(e.target.closest('[data-act],[data-clinic-add]'))return;openClinic(d.wcl==='free'?'poly':'w'+d.wcl,cur.id);return}
});
$('#ph').addEventListener('click',e=>{
  const t=e.target.closest('[data-act]'); if(!t||t.closest('#dlg')) return;
  const a=t.dataset.act;
  if(a==='cl-only'){CL.only=!CL.only;renderClinic(true);SC.ev('cl-only');return}
  if(a==='cl-allsvc'){CL.only=false;renderClinic(true);return}
  if(a==='cl-clearq'){CL.q='';renderClinic(true);return}
  if(a==='cl-about'){CL.more=!CL.more;renderClinic(true);return}
  if(a==='cl-svc'){toast(clPlace(CL.src).kind==='clinic'?'Откроем текущую запись в клинику: время, форма или звонок':'Откроем текущую запись в лабораторию');return}
  if(a==='cl-share'){toast('Поделимся ссылкой на страницу');return}
  if(a==='cl-fav'){t.classList.toggle('on');toast(t.classList.contains('on')?'Добавили в избранное':'Убрали из избранного');return}
  if(a==='cl-call'){toast('Позвоним в '+clPlace(CL.src).name);return}
  if(a==='one1'){e.stopPropagation();const b=t.previousElementSibling;if(!b||b.dataset.wk==null||!cur||!cur.id)return;const W=clW(+b.dataset.wk);W.always=W.always||new Set();W.always.add(cur.id);startOne(cur.id,W);return}
});
$('#ph').addEventListener('input',e=>{if(e.target.id!=='cl-q')return;CL.q=e.target.value;const pos=e.target.selectionStart;clRefreshList();const i=$('#cl-q');i.focus();i.setSelectionRange(pos,pos)});
