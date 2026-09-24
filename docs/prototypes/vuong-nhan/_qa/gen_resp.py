import json
# Kiểm tràn: trang, và mọi phần tử tràn khỏi khung nhìn mà không nằm trong vùng cuộn ngang có chủ ý.
CHK = ("(function(){var W=document.documentElement.clientWidth,r=[];"
       "if(document.documentElement.scrollWidth>W)r.push('PAGE-OVERFLOW '+document.documentElement.scrollWidth+'>'+W);"
       "function inScroller(e){for(var p=e.parentElement;p&&p!==document.body;p=p.parentElement){var x=getComputedStyle(p).overflowX;if(x==='auto'||x==='scroll'||x==='hidden')return true}return false}"
       "var n=0;document.querySelectorAll('body *').forEach(function(e){if(n>4)return;var b=e.getBoundingClientRect();if(b.width&&b.right>W+1&&!inScroller(e)&&getComputedStyle(e).position!=='fixed'){n++;r.push('OUT '+e.tagName+'.'+String(e.className).slice(0,24)+' '+Math.round(b.right))}});"
       "var d=document.getElementById('dev');if(d){d.querySelectorAll('*').forEach(function(e){if(!e.closest('.sbar')&&e.scrollWidth>e.clientWidth+1&&['auto','scroll'].indexOf(getComputedStyle(e).overflowX)<0&&getComputedStyle(e).overflowX!=='hidden'&&e.clientWidth>0&&n<8){n++;r.push('APP-OVF '+e.tagName+'.'+String(e.className).slice(0,24))}})}"
       "return r.join(' || ')||'ok'})()")
SIZES = [(1440, 900, '0'), (768, 1024, '0'), (390, 844, '1')]
pages = {
  'index': [('top', "scrollTo(0,0)"), ('apps', "document.querySelector('.apps, #apps, .app').scrollIntoView()"), ('scn', "document.querySelector('.scn').scrollIntoView()"), ('cov', "document.querySelector('table').scrollIntoView()")],
  'admin': [('dash', "ADMIN.go('dashboard',{})"), ('orders', "ADMIN.go('orders',{})"), ('order', "ADMIN.go('order',{id:'VN-240931'})"), ('payouts', "ADMIN.go('payouts',{})")],
  'customer': [('home', "CUST.root('home')"), ('order', "CUST.root('orders');CUST.push('order',{id:'VN-240931'})"), ('book', "CUST.ACT.bookStart({dataset:{id:'acclean'}});CUST.push('book2')")],
  'provider': [('req', "PROV.S.role='owner';PROV.root('requests')"), ('fin', "PROV.S.role='owner';PROV.root('finance')"), ('job', "PROV.S.role='tech';PROV.root('today');PROV.push('job',{id:'VN-240931'})")],
}
for p, sc in pages.items():
    for w, h, m in SIZES:
        steps = [{"name": f"{w}-{n}", "js": js + ";scrollTo(0,0)" if p != 'index' else js, "wait": 350, "check": CHK, "shot": f"{p}-{w}-{n}", "jpeg": True} for n, js in sc]
        json.dump({"steps": steps}, open(f'steps-resp-{p}-{w}.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('ok')
for w in (768, 390):
    f = f'steps-resp-admin-{w}.json'; d = json.load(open(f, encoding='utf-8'))
    d['steps'].append({"name": f"{w}-wide", "js": "document.querySelector('[data-act=wide]').click();ADMIN.go('dashboard',{})", "wait": 350, "check": "document.body.classList.contains('wide')+' '+document.documentElement.scrollWidth", "shot": f"admin-{w}-wide", "jpeg": True})
    json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False)
