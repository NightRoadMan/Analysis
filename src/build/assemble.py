import json, re, base64, sys, os, urllib.parse
B = os.path.dirname(os.path.abspath(__file__))
S = os.path.dirname(B)
p = json.load(open(f'{B}/parts.json'))
OUT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else f'{S}/out/prototype-v3.html'

BG = {'#FFFFFF': 'var(--base)', '#FFF': 'var(--base)', '#F4F5F6': 'var(--tint)', '#EAEBED': 'var(--border)',
      '#E6F4F6': 'var(--brand-tint)', '#F4F5F699': 'var(--glass)', '#F4F5F600': 'var(--canvas0)'}
FG = {'#070707': 'var(--ink)', '#0D0D0D': 'var(--ink)', '#5D5E63': 'var(--soft)', '#929297': 'var(--light)',
      '#31858C': 'var(--brand-ink)'}
BD = {'#EAEBED': 'var(--border)'}

def fix_decl(d):
    if ':' not in d: return d
    k, v = d.split(':', 1)
    kk = k.strip().lower()
    def sub(mp):
        return re.sub(r'#[0-9A-Fa-f]{3,8}\b', lambda m: mp.get(m.group(0).upper(), m.group(0)), v)
    if kk in ('background', 'background-color'): return k + ':' + sub(BG)
    if kk == 'color': return k + ':' + sub(FG)
    if kk.startswith('border') or kk.startswith('outline'): return k + ':' + sub(BD)
    return d

def fix_style(s):
    # keep data: URIs intact (they contain ';')
    parts = re.split(r';(?![^()]*\))', s)
    return ';'.join(fix_decl(x) for x in parts)

def theme(html):
    html = re.sub(r'style="([^"]*)"', lambda m: 'style="' + fix_style(m.group(1)) + '"', html)
    html = re.sub(r"style='([^']*)'", lambda m: "style='" + fix_style(m.group(1)) + "'", html)
    return html

# ---- HOME ----
h = p['HOME'].strip()
h = re.sub(r'^<section[^>]*>', '', h); h = re.sub(r'</section>\s*$', '', h)
# Блок «Анализы на НаПоправку» убран с главной: вход в витрину через плитку «Сдача анализов»
i = h.find('Анализы на НаПоправку')
start = h.rfind('<div style="align-items:start;align-self:stretch;background-color:#FFFFFF;border-radius:16px', 0, i)
depth = 0; end = None
for m in re.finditer(r'<(/?)div\b[^>]*>', h[start:]):
    depth += -1 if m.group(1) else 1
    if depth == 0: end = start + m.end(); break
card = h[start:end]
# иллюстрации категорий из этого блока (прозрачные webp 300×300) переиспользуем на странице «Анализы»
CATIMG = {}
_lbl = {'vitamins': 'Витамины', 'biochemistry': 'Био', 'hormones': 'Гормоны', 'hematology': 'Гемато',
        'infections': 'Инфекции', 'allergy': 'Аллерго', 'tumor_markers': 'Онкомаркеры', 'general': 'Общеклини'}
_pos = []
for m in re.finditer(r'data:image/webp;base64,[A-Za-z0-9+/=]+', card):
    pre = card[:m.start()]; pre = re.sub(r'<[^>]+>', ' ', pre[:pre.rfind('<')]); pre = ' '.join(pre.replace('\u00ad', '').split())
    _pos.append((pre, m.group(0)))
for pre, uri in _pos:
    last = pre.split()[-1]
    for cid, lb in _lbl.items():
        if lb in last: CATIMG.setdefault(cid, []).append(uri)
h = h[:start] + h[end:]
DH = 220 + 8  # высота карточки + gap
h = h.replace('height:1290px', f'height:{1290-DH+14}px', 1).replace('height:1258px', f'height:{1258-DH+14}px', 1)  # +14: точки карусели
h = h.replace('<div style="background-color:#F4F5F6;', '<div class="homefix" style="background-color:#F4F5F6;', 1)
_i = h.find('Сдача<br>анализов'); _k = h.rfind('data-act="search"', 0, _i)
h = h[:_k] + 'data-act="allan" role="button" tabindex="0" aria-label="Сдача анализов"' + h[_k+len('data-act="search"'):]
# Figma 439:109476: «Сдача анализов» открывает второй ряд плиток и помечена «новое»
_i = h.find('Сдача<br>анализов')
_ts = h.rfind('<div style="align-items:start;background-color:#F4F5F6;border-radius:12px', 0, _i)
_d = 0
for _m in re.finditer(r'<(/?)div\b[^>]*>', h[_ts:]):
    _d += -1 if _m.group(1) else 1
    if _d == 0: _te = _ts + _m.end(); break
tile = h[_ts:_te]
tile = tile.replace('<div style="align-items:start;', '<div class="newt" style="align-items:start;', 1)
tile = tile[:-len('</div>')] + '<span class="newb">новое</span></div>'
h = h[:_ts] + h[_te:]
_row2 = '<div style="align-items:center;box-sizing:border-box;display:flex;gap:8px">'
_r = h.find(_row2, _ts)
assert _r > 0
h = h[:_r + len(_row2)] + tile + h[_r + len(_row2):]
# Figma 439:109476: в «Записи в клиники» 6 плиток — лишние 4 убираем
for _lb in ['Справки,<br>больничные', '>Психологи<', 'Онлайн-<br>консультации', 'Вызов <br>врача']:
    _i = h.find(_lb); assert _i > 0, _lb
    _ts = h.rfind('<div style="align-items:start;background-color:#F4F5F6;border-radius:12px', 0, _i)
    _d = 0
    for _m in re.finditer(r'<(/?)div\b[^>]*>', h[_ts:]):
        _d += -1 if _m.group(1) else 1
        if _d == 0: _te = _ts + _m.end(); break
    assert _te > _i, _lb
    h = h[:_ts] + h[_te:]
# Figma 439:109476: под «Рекомендациями» индикатор страниц карусели (3 точки, активная оранжевая)
_i = h.find('>Рекомендации<'); assert _i > 0
_rs = list(re.finditer(r'<div style="[^"]*background-color:#FFFFFF[^"]*"', h[:_i]))[-1].start()
_d = 0
for _m in re.finditer(r'<(/?)div\b[^>]*>', h[_rs:]):
    _d += -1 if _m.group(1) else 1
    if _d == 0: _re = _rs + _m.start(); break
h = h[:_re] + '<div class="hdots"><i class="on"></i><i></i><i></i></div>' + h[_re:]
# бейдж «онлайн» у «Консилиума врачей» поверх картинки
h = h.replace('right:0.25px;top:-2px"', 'right:0.25px;top:-2px;z-index:3"', 1)
h = theme(h)


# ---- карточки лаб в детальке (Figma 439:111091): «Забор до …» → БШ часов, «Записаться на 1 анализ»
CLOCK = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4.2l2.6 1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHR = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m8 5.5 4.5 4.5L8 14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
WHERE = re.sub(r"(<div style='[^']*' class=\"cp\")", lambda m: f'<button class="lhrs" type="button" data-act="hours"><span class="ci">{CLOCK}</span><b class="hz">Забор до 19:30</b>{CHR}</button>' + m.group(1), p['WHERE'])
assert WHERE.count('class="lhrs"') == 10, WHERE.count('class="lhrs"')
WHERE = WHERE.replace('Записаться сейчас', 'Записаться на 1 анализ')
# данные филиалов из карточек — для выбора филиала с детальки (ТЗ 2.6)
WLABS = []
for chunk, base in zip(WHERE.split('class="cp" data-base=')[:-1], re.findall(r'class="cp" data-base="(\d+)"', WHERE)):
    txt = re.findall(r'>([^<>]{2,})<', chunk)
    ai = max(i for i, t in enumerate(txt) if t.startswith('г. Санкт-Петербург'))
    mt = re.findall(r'background-color:(#[0-9A-Fa-f]{6});border-radius:100px[^>]*></div></div><div[^>]*>([^<]+), (\d+ м)<', chunk)
    c, st, d = mt[0]
    nm = txt[ai - 1]
    br = 'inv' if nm.startswith('Invitro') else 'kdl' if nm.startswith('KDL') else 'gem' if nm.startswith('Гемотест') else 'rem'
    WLABS.append({'base': int(base), 'n': nm, 'a': txt[ai], 'metro': st, 'mc': c, 'md': d, 'brand': br})
_i = [0]
def _wk(m):
    _i[0] += 1
    return m.group(0) + f' data-wk="{_i[0] - 1}"'
WHERE = re.sub(r'data-clinic-add=""', _wk, WHERE)
assert _i[0] == len(WLABS) == 10, (_i[0], len(WLABS))
# чипсы-фильтры «Где сдать» переключаются как на карте (Figma 518:32466)
WHERE, _n = re.subn(r'(<div style="align-items:center;background-color:#FFFFFF;border-radius:16px;[^"]*outline:1px solid #EAEBED;[^"]*") data-act="soon"', r'\1 class="wfc" data-act="wf" role="button" aria-pressed="false"', WHERE)
assert _n >= 2, _n
# чипсы «Где сдать» как в макете 439:111092: сортировка иконкой, «Оплата баллами», «Район или метро»
def _elem(h, start):
    depth, i = 0, start
    while True:
        o, c = h.find('<div', i), h.find('</div>', i)
        if o != -1 and o < c: depth += 1; i = o + 4
        else:
            depth -= 1; i = c + 6
            if depth == 0: return h[start:i]
_pos = [m.start() for m in re.finditer(r'<div style="[^"]*" class="wfc"', WHERE)][:3]
_ch = [_elem(WHERE, s) for s in _pos]
assert 'Популярные' in _ch[0] and 'Район' in _ch[1] and 'Оплата' in _ch[2], [re.findall(r'>([^<>]{2,})<', c) for c in _ch]
_sort = re.sub(r"<div style='[^']*'>Популярные</div>", '', _ch[0]).replace('class="wfc" data-act="wf" role="button" aria-pressed="false"', 'data-act="sort" role="button" aria-label="Сортировка"')
WHERE = WHERE[:_pos[0]] + _sort + _ch[2] + _ch[1] + WHERE[_pos[2] + len(_ch[2]):]


# ---- таббар: вкладки кликабельные, активная подсвечивается (Главная / Мои записи)
TB = p['TABBAR']
_row = TB.find('" data-act="soon"><div style="box-sizing:border-box;flex-shrink:0;height:54px;position:relative;width:72px">')
assert _row > 0
TB = TB[:_row] + '" class="tbrow">' + TB[_row + len('" data-act="soon">'):]
TB = TB.replace('<div style="background-color:#EDEDED;border-radius:100px;bottom:0px;box-sizing:border-box;left:0px;position:absolute;right:0px;top:0px"></div>', '', 1)
TB = TB.replace('#F3AA00', '#070707')
_rs = TB.find('class="tbrow">') + len('class="tbrow">')
_tabs, _i = [], _rs
for _k in range(5):
    _e = _elem(TB, _i); _tabs.append(_e); _i += len(_e)
_keys = [('home', 'Главная'), ('orders', 'Мои записи'), ('tm', 'Онлайн-консультации'), ('tracker', 'Трекер здоровья'), ('profile', 'Профиль')]
_new = ''.join(e.replace('<div ', f'<div class="tbi" data-tab="{k}" role="button" tabindex="0" aria-label="{n}" ', 1).replace('>', '><i class="tbon"></i>', 1) for e, (k, n) in zip(_tabs, _keys))
TB = TB[:_rs] + _new + TB[_i:]
p['TABBAR'] = TB

# ---- «Где сдать»: шапка карточки открывает детальку клиники, «Записаться на 1 анализ» работает (ТЗ 2.6)
_cards = list(re.finditer(r'(border-radius:32px;box-sizing:border-box;display:flex;flex-direction:column;gap:16px;outline:1px solid #EAEBED;outline-offset:-1px;overflow:clip;padding:24px;width:343px"><div style="align-items:start;box-sizing:border-box;display:flex;gap:16px")', WHERE))
assert len(_cards) == 10, len(_cards)
for _k, _m in reversed(list(enumerate(_cards))):
    WHERE = WHERE[:_m.end()] + f' class="wcl" data-wcl="{_k}" role="button" tabindex="0"' + WHERE[_m.end():]
_n = WHERE.count('data-act="soon"><div style=\'align-content:center;box-sizing:border-box;color:#31858C;flex-shrink:0;font-family:"Montserrat", system-ui, sans-serif;font-feature-settings:"liga" 0;font-size:16px;font-weight:600;line-height:16px;text-align:center;width:max-content\'>Записаться на 1 анализ')
WHERE = WHERE.replace('data-act="soon"><div style=\'align-content:center;box-sizing:border-box;color:#31858C;flex-shrink:0;font-family:"Montserrat", system-ui, sans-serif;font-feature-settings:"liga" 0;font-size:16px;font-weight:600;line-height:16px;text-align:center;width:max-content\'>Записаться на 1 анализ', 'data-act="one1"><div style=\'align-content:center;box-sizing:border-box;color:#31858C;flex-shrink:0;font-family:"Montserrat", system-ui, sans-serif;font-feature-settings:"liga" 0;font-size:16px;font-weight:600;line-height:16px;text-align:center;width:max-content\'>Записаться на 1 анализ')
assert _n == 10, _n
# Рэмси: реальный филиал на пл. Конституции, как на детальке клиники (Figma 619:20514)
_ri = WHERE.find('Рэмси Диагностика на Московском')
_rc = WHERE.rfind('<div style="align-items:start;background-color:#FFFFFF;border-radius:32px', 0, _ri)
_rcard = _elem(WHERE, _rc)
_rnew = _rcard.replace('Рэмси Диагностика на Московском', 'Рэмси Диагностика на Конституции')
_rnew = re.sub(r'г\. Санкт-Петербург, [^<]+', 'г. Санкт-Петербург, пл. Конституции, д. 7', _rnew, count=1)
_PH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7.2 3.3 9.4 7c.4.7.3 1.5-.3 2l-1.2 1.1a11.5 11.5 0 0 0 6 6l1.1-1.2c.5-.6 1.3-.7 2-.3l3.7 2.2c.7.4.9 1.3.5 2l-1.1 1.7c-.6.9-1.6 1.4-2.6 1.2C10.3 20.6 3.4 13.7 2.3 6.5c-.2-1 .3-2 1.2-2.6L5.2 2.8c.7-.4 1.6-.2 2 .5Z"/></svg>'
_rnew = re.sub(r'(<button class="lhrs" type="button" data-act="hours"><span class="ci">.*?</span><b class="hz">[^<]*</b>)(.*?</button>)', lambda m: m.group(1) + '<i class="ldot"></i><b>Расписание</b>' + m.group(2) + f'<button class="lhrs" type="button" data-act="wcall"><span class="ci">{_PH}</span><b>+7 (812) 622-45-56</b><i class="ldot"></i><b>Позвонить</b>{CHR}</button>', _rnew, count=1, flags=re.S)
assert 'Расписание' in _rnew
_rnew = _rnew.replace('Обводный канал, 500 м', 'Московская, 1 км').replace('Лиговский проспект, 900 м', 'Парк Победы, 1,6 км').replace('#702785', '#0078C9')
WHERE = WHERE[:_rc] + _rnew + WHERE[_rc + len(_rcard):]
# бесплатная клиника в конце списка (ТЗ 2.5: бесплатные карточки в конце, без кнопок)
_fc = _rnew.replace('Рэмси Диагностика на Конституции', 'Городская поликлиника № 51').replace('пл. Конституции, д. 7', 'пр. Космонавтов, д. 33–35').replace('Московская, 1 км', 'Московская, 1,8 км')
_fc = re.sub(r'<div[^>]*>Парк Победы, 1,6 км</div>', '', _fc)
_fc = _fc.replace('data-wcl="9"', 'data-wcl="free"')
_b = _fc.find('<div style="align-items:start;align-self:stretch;box-sizing:border-box;display:flex;flex-direction:column;gap:8px"><div style="align-items:center;align-self:stretch;background-color:#61B7C6')
assert _b > 0
_fc = _fc[:_b] + _fc[_b + len(_elem(_fc, _b)):]
_fc = re.sub(r'<div style=\'[^\']*\' class="cp" data-base="\d+">[^<]*</div>', '<div class="cpfree">Бесплатно по ОМС</div>', _fc)
_fc = re.sub(r'<button class="lhrs".*?</button>', '', _fc, flags=re.S)
_fc = re.sub(r'background-image:url\(data:[^)]*\)(, url\(data:[^)]*\))?', 'background-image:url(@@FREELOGO@@)', _fc, count=1)
_fc = _fc.replace('data-clinic-add=""', '')
# поликлиника ОМС убрана из «Где сдать» (Артем, 26.11: «Такого не нужно вообще нигде»)
for _w in WLABS:
    if _w['brand'] == 'rem':
        _w.update({'n': 'Рэмси Диагностика на Конституции', 'a': 'г. Санкт-Петербург, пл. Конституции, д. 7', 'metro': 'Московская', 'mc': '#0078C9', 'md': '1 км'})


# ---- мок-данные приведены к макетам (Figma 562:61332, 562:46676, 466:134038): число клиник и цены
FIGMA_MOCK = {  # имя (начало) -> (клиник, цена или None)
    '25-ОН витамин D': (96, None), 'Витамин В12 (цианокобаламин)': (88, None), 'Витамин B9 (Фолиевая кислота)': (81, None),
    'Витамин В6': (74, None), 'Витамин А (ретинол)': (63, None),
    'Ферритин': (84, None), 'Пролактин': (71, None), 'Тестостерон': (63, None), 'Железо сыворотки': (58, 396),
    'Сифилис RPR': (47, None), 'Опухолевый маркёр HE4': (39, None), 'Хеликобактер пилори': (22, None), 'Глюкоза': (84, 369),
}
DATA = json.loads(json.dumps(p['DATA']))
for it in DATA['items']:
    hit = next((v for k, v in FIGMA_MOCK.items() if it['name'] == k or it['name'].startswith(k)), None)
    if hit:
        it['clinics'] = hit[0]
        if hit[1]: it['price'] = hit[1]
    elif it['cat'] == 'vitamins':  # остальные витамины ниже, чтобы порядок совпадал с макетом
        it['clinics'] = round(it['clinics'] * 0.7)
# один и тот же анализ в разных категориях — одна цена и одно число клиник
_first = {}
for it in DATA['items']:
    f = _first.setdefault(it['name'], it)
    it['price'], it['clinics'] = f['price'], f['clinics']

def b64(path, mime='image/png'):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

A = f'{S}/assets'
ASSET = {k: b64(f'{A}/{k}.png') for k in ['woman', 'man', 'child', 'basket', 'pin', 'gift', 'prep', 'passport', 'res1', 'res2', 'res3', 'callback', 'wave']}
CLIMG = {k: b64(f'{A}/clinic/{k}.jpg', 'image/jpeg') for k in ['h-ramsay', 'm-ramsay', 'h-invitro', 'm-invitro', 'h-poly', 'm-poly', 'a1', 'a2', 'a3', 'thumb', 'doc']}
FREELOGO = 'data:image/svg+xml,' + urllib.parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' fill='#E6F4F6'/><path d='M16 34V16h16v18M21 34v-5h6v5M24 19v6M21 22h6' fill='none' stroke='#31858C' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'/></svg>", safe="/:=' ")
WHERE = WHERE.replace('@@FREELOGO@@', FREELOGO)
SUCCESS = open(f'{A}/success.svg').read().strip()
FAIL = open(f'{A}/failed.svg').read().strip()

# ---- places from map labels ----
svg = p['MAPSVG']
ABBR = {'пр.': 'проспект', 'ул.': 'улица', 'бул.': 'бульвар'}
def nice(lbl):
    ws = lbl.split()
    out = [w.lower() if w.lower() in ABBR else w[:1].upper() + w[1:].lower() for w in ws]
    return ' '.join(out), ' '.join(ABBR.get(w, w) for w in out)
METRO = {'Комендантский проспект': '#8E479C', 'Старая Деревня': '#8E479C', 'Пионерская': '#0078C9', 'Чёрная речка': '#0078C9'}
POI = ['Лукойл', 'Тайга', 'Гипер Лента', 'МазаПарк', 'Табриз', 'Основа Дети', 'Серафимовское кладбище']
places, seen, streetpts = [], set(), []
for m in re.finditer(r'<text x="([\d.]+)" y="([\d.]+)"[^>]*>(.*?)</text>', svg, re.S):
    x, y, t = float(m.group(1)), float(m.group(2)), m.group(3).strip()
    if t == 'М': continue
    if t in METRO:
        places.append({'t': 'metro', 'n': t, 'x': x, 'y': y - 26, 'c': METRO[t]})
    elif t in POI:
        places.append({'t': 'poi', 'n': t, 'x': x, 'y': y})
    else:
        n, full = nice(t)
        core = [w for w in n.split() if w.lower() not in ABBR][0]
        loc = core[:-2] + 'ой' if core.endswith('ая') else (core[:-2] + 'ом' if core.endswith(('ый', 'ий')) else core)
        streetpts.append({'t': 'street', 'n': n, 'full': full, 'loc': loc, 'x': x, 'y': y})
        if n not in seen:
            seen.add(n); places.append({'t': 'street', 'n': n, 'full': full, 'loc': n, 'x': x, 'y': y})
order = {'metro': 0, 'street': 1, 'poi': 2}
places.sort(key=lambda q: (order[q['t']], q['n']))
for k, q in enumerate(places): q['i'] = k

def js(v):
    return json.dumps(v, ensure_ascii=False).replace('</', '<\\/')

consts = '\n'.join([
    'const DATA=' + js(DATA) + ';',
    'const IC=' + js(p['IC']) + ';',
    'const WHERE=' + js(theme(WHERE)) + ';',
    'const WLABS=' + json.dumps(WLABS, ensure_ascii=False) + ';',
    'const MAP=' + js('<div class="mapmini">' + p['MAP'] + '</div>') + ';',
    'const PEOPLE=' + js([theme(x) for x in p['PEOPLE']]) + ';',
    'const LOGO=' + js(p['LOGO']) + ';',
    'const ASSET=' + js(ASSET) + ';',
    'const CATIMG=' + js(CATIMG) + ';',
    'const SUCCESS=' + js(SUCCESS) + ';',
    'const CLIMG=' + js(CLIMG) + ';',
    'const CHEVW=' + js(p['CHEVW']) + ';',
    'const SEARCHIC=' + js(p['SEARCHIC']) + ';',
    'const CLEARIC=' + js(p['CLEARIC']) + ';',
    'const PLACES=' + js(places) + ';',
    'const STREETPTS=' + js(streetpts) + ';',
])

css = open(f'{B}/app.css').read()
mapuri = 'url("data:image/svg+xml,' + urllib.parse.quote(svg, safe=" =:/,.-'") + '")'
css = css.replace('/*@@MAPBG@@*/', mapuri)

shell = open(f'{B}/shell.html').read()
rep = {
    '@@CSS@@': css, '@@HOME@@': h, '@@SB@@': theme(p['SB']), '@@BACK@@': theme(p['BACK']),
    '@@SEARCHIC@@': p['SEARCHIC'], '@@CLEARIC@@': p['CLEARIC'], '@@TABBAR@@': theme(p['TABBAR']).replace('#F4F5F6 0%, #F4F5F600 82%', 'var(--fgrad) 0%, var(--fgrad0) 82%').replace('background-color:#EDEDED','background-color:var(--tab-on)').replace('inset 0 1px 0 #FFFFFF, inset 0 -1.5px 0 #FFFFFF','inset 0 1px 0 var(--tab-hl), inset 0 -1.5px 0 var(--tab-hl)').replace('#E6E6E6 0px 40px 30px -40px inset','var(--tab-hl2) 0px 40px 30px -40px inset'),
    '@@CHEVW@@': p['CHEVW'], '@@BASKET@@': p['BASKET'], '@@HOMEIND@@': p['IC']['homeind'],
    '@@FAILSVG@@': FAIL, '@@CONSTS@@': consts, '@@JS@@': open(f'{B}/app.js').read().replace('/*@@MODULES@@*/', open(f'{B}/clinic.js').read() + '\n' + open(f'{B}/orders.js').read() + '\n' + open(f'{B}/book.js').read()),
}
out = shell
for k in ['@@CSS@@', '@@HOME@@', '@@SB@@', '@@BACK@@', '@@SEARCHIC@@', '@@CLEARIC@@', '@@TABBAR@@', '@@CHEVW@@',
          '@@BASKET@@', '@@HOMEIND@@', '@@FAILSVG@@', '@@JS@@', '@@CONSTS@@']:
    assert k in out, k
    out = out.replace(k, rep[k])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w').write(out)
print(OUT, len(out), 'places', len(places), 'streetpts', len(streetpts))
