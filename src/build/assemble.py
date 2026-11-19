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
h = h.replace('height:1290px', 'height:1342px', 1).replace('height:1258px', 'height:1310px', 1)
# «Смотреть все анализы» в конце блока анализов
i = h.find('Анализы на НаПоправку')
start = h.rfind('<div style="align-items:start;align-self:stretch;background-color:#FFFFFF;border-radius:16px', 0, i)
# find the end of that card by tag balance
depth = 0; end = None
for m in re.finditer(r'<(/?)div\b[^>]*>', h[start:]):
    depth += -1 if m.group(1) else 1
    if depth == 0: end = start + m.start(); break
allan = ('<button class="allan" type="button" data-act="allan">Смотреть все анализы'
         '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>')
h = h[:end] + allan + h[end:]
h = h.replace('<div style="background-color:#F4F5F6;', '<div class="homefix" style="background-color:#F4F5F6;', 1)
_i = h.find('Сдача<br>анализов'); _k = h.rfind('data-act="search"', 0, _i)
h = h[:_k] + 'data-act="allan" role="button" tabindex="0" aria-label="Сдача анализов"' + h[_k+len('data-act="search"'):]
h = theme(h)

def b64(path, mime='image/png'):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

A = f'{S}/assets'
ASSET = {k: b64(f'{A}/{k}.png') for k in ['woman', 'man', 'child', 'basket', 'pin', 'gift', 'prep', 'passport']}
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
    'const DATA=' + js(p['DATA']) + ';',
    'const IC=' + js(p['IC']) + ';',
    'const WHERE=' + js(theme(p['WHERE'])) + ';',
    'const MAP=' + js('<div class="mapmini">' + p['MAP'] + '</div>') + ';',
    'const PEOPLE=' + js([theme(x) for x in p['PEOPLE']]) + ';',
    'const LOGO=' + js(p['LOGO']) + ';',
    'const ASSET=' + js(ASSET) + ';',
    'const SUCCESS=' + js(SUCCESS) + ';',
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
    '@@FAILSVG@@': FAIL, '@@CONSTS@@': consts, '@@JS@@': open(f'{B}/app.js').read(),
}
out = shell
for k in ['@@CSS@@', '@@HOME@@', '@@SB@@', '@@BACK@@', '@@SEARCHIC@@', '@@CLEARIC@@', '@@TABBAR@@', '@@CHEVW@@',
          '@@BASKET@@', '@@HOMEIND@@', '@@FAILSVG@@', '@@JS@@', '@@CONSTS@@']:
    assert k in out, k
    out = out.replace(k, rep[k])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w').write(out)
print(OUT, len(out), 'places', len(places), 'streetpts', len(streetpts))
