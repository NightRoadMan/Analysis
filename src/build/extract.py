import re,json,base64,urllib.parse
W='/tmp/claude-0/-home-user/44f7993c-950c-5f89-9fd6-a8e8052f82ee/scratchpad/'
src=open(W+'w/prototype-v3.html').read()
L=src.split('\n')
P={}
def const(name):
    return json.loads(re.search(r'const '+name+r' = (.*?);\n',src).group(1))
P['DATA']=const('DATA'); P['IC']=const('IC'); P['WHERE']=const('WHERE'); P['MAP']=const('MAP'); P['PEOPLE']=const('PEOPLE')
P['LOGO']=dict(re.findall(r"(inv|kdl|gem|rem):'(data:image/webp;base64,[^']+)'",re.search(r'const LOGO=\{[^\n]*',src).group(0)))
P['HOME']=L[229]
P['TABBAR']=L[278]
sb=re.search(r'<div class="sb">.*?</div>\n',src).group(0).strip()
P['SB']=sb
P['BACK']=re.search(r'<button class="gb" data-act="back" aria-label="Назад">.*?</button>',src).group(0)
P['SEG']=L[237].strip()
P['SEARCHIC']=re.search(r'<span class="ic" style="width:24px;height:24px"><svg viewBox="0 0 17 17".*?</svg></span>',src).group(0)
P['CLEARIC']=re.search(r'<span class="ic" style="width:16px;height:16px"><svg viewBox="0 0 10 10".*?</svg></span>',src).group(0)
P['CHEVW']=re.search(r'<button class="gocart" data-act="cart"><span class="t"><b>Перейти в корзину</b><span id="f-cart-n"></span></span>(<span class="ic".*?</span>)</button>',src).group(1)
P['BASKET']=re.search(r'<button class="dcart" data-act="cart" aria-label="Корзина">(<span class="ic".*?</svg></span>)',src).group(1)
# map svg
m=re.search(r'\.mapw\{[^\n]*',src).group(0)
P['MAPSVG']=urllib.parse.unquote(re.search(r'url\("data:image/svg\+xml,([^"]*)"\)',m).group(1))
json.dump(P,open(W+'build/parts.json','w'),ensure_ascii=False)
for k,v in P.items(): print(k, len(json.dumps(v,ensure_ascii=False)))
