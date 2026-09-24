import json
CHK = ("(function(){var t=document.body.innerText,r=[];"
       "var d=t.match(/.{0,40}[\\u2014\\u2013].{0,20}/);if(d)r.push('DASH:'+d[0]);"
       "var g=t.match(/.{0,20}[\\u2605\\u2713\\u2714].{0,10}/);if(g)r.push('GLYPH:'+g[0]);"
       "var a=t.match(/.{0,20}\\b(NCC|KTV|TK|ĐHXL)\\b.{0,10}/);if(a)r.push('ABBR:'+a[0]);"
       "if(/[\\u{1F300}-\\u{1FAFF}]/u.test(t))r.push('EMOJI');"
       "var o=document.documentElement.scrollWidth>document.documentElement.clientWidth;if(o)r.push('OVERFLOW');"
       "return r.join(' || ')})()")
admin_pages = ['dashboard', 'reports', 'requests', 'orders', 'disputes', 'providers', 'customers', 'transactions', 'payouts', 'refunds', 'catalog', 'pricing', 'regions', 'moderation', 'broadcast', 'admins', 'parameters', 'audit']
steps = [{"name": "sa", "js": "ADMIN.S.role='sa';ADMIN.render()"}]
for lang in (0, 1):
    for p in admin_pages:
        steps.append({"name": f"{lang}-{p}", "js": f"VN.lang={lang};ADMIN.go('{p}',{{}})", "check": CHK})
    for p, a in [('order', "{id:'VN-240931'}"), ('ordermoney', "{id:'VN-240921'}"), ('ledger', "{id:'sachxanh'}"), ('provider', "{id:'thotam'}"), ('orders', "{tab:'attention'}"), ('providers', "{tab:'queue'}"), ('providers', "{tab:'docs'}"), ('transactions', "{tab:'unpaid'}"), ('transactions', "{tab:'adjust'}"), ('transactions', "{tab:'recon'}"), ('transactions', "{tab:'bal'}"), ('refunds', "{tab:'pending'}"), ('refunds', "{tab:'done'}"), ('payouts', "{tab:'approved'}"), ('profile', "{}"), ('profile', "{tab:'security'}"), ('profile', "{tab:'noti'}"), ('profile', "{tab:'activity'}"), ('admins', "{tab:'roles'}")]:
        steps.append({"name": f"{lang}-{p}-{a}", "js": f"VN.lang={lang};ADMIN.go('{p}',{a})", "check": CHK})
# Lớp phủ thêm sau Cổng 5 (drawer vai trò và tài khoản, CRUD danh mục, đổi mật khẩu, menu tài khoản, bảng Demo)
admin_overlays = [
    ('role-drawer', "ADMIN.go('admins',{tab:'roles'});ADMIN.ACT.roleOpen({dataset:{id:'acc'}})"),
    ('role-new', "ADMIN.go('admins',{tab:'roles'});ADMIN.ACT.roleOpen({dataset:{}})"),
    ('adm-drawer', "ADMIN.go('admins',{});ADMIN.ACT.admOpen({dataset:{id:'u7'}})"),
    ('adm-disable', "ADMIN.go('admins',{});ADMIN.ACT.admOpen({dataset:{id:'u3'}});ADMIN.ACT.admStep({dataset:{x:'disable'}})"),
    ('cat-add', "ADMIN.go('catalog',{});ADMIN.ACT.catAddOpen({dataset:{x:'ac11'}})"),
    ('cat-del-used', "ADMIN.S.ui.catSel='ac11';ADMIN.go('catalog',{});ADMIN.ACT.catDelOpen()"),
    ('cat-del-free', "ADMIN.S.ui.catSel='ac13';ADMIN.go('catalog',{});ADMIN.ACT.catDelOpen()"),
    ('attr', "ADMIN.S.ui.catSel='ac';ADMIN.go('catalog',{});ADMIN.ACT.attrOpen({dataset:{id:'1'}})"),
    ('pwd', "ADMIN.go('profile',{tab:'security'});ADMIN.ACT.pwOpen()"),
    ('menu-me', "ADMIN.go('dashboard',{});ADMIN.S.menu='me';ADMIN.render()"),
    ('demo-panel', "ADMIN.S.modal=null;ADMIN.S.demo=true;ADMIN.render()"),
]
for lang in (0, 1):
    for n, js in admin_overlays:
        steps.append({"name": f"{lang}-{n}", "js": f"VN.lang={lang};ADMIN.S.modal=null;ADMIN.S.demo=false;{js}", "check": CHK})
steps.append({"name": "close", "js": "ADMIN.S.modal=null;ADMIN.S.menu=null;ADMIN.S.demo=false;ADMIN.render()"})
json.dump({"steps": steps}, open('steps-scan-admin.json', 'w', encoding='utf-8'), ensure_ascii=False)

cust = ['home', 'orders', 'inbox', 'account', 'search', 'notifs', 'addrs', 'addrEdit', 'txns', 'sessions', 'help', 'profile', 'notifset', 'terms']
steps = []
for lang in (0, 1):
    for sc in cust:
        steps.append({"name": f"{lang}-{sc}", "js": f"CUST.S.lang={lang};CUST.root('{sc}')", "check": CHK})
    for sc, p in [('order', "{id:'VN-240931'}"), ('order', "{id:'VN-240938'}"), ('order', "{id:'VN-240928'}"), ('order', "{id:'VN-240812'}"), ('service', "{id:'acclean'}"), ('provider', "{id:'phucan'}"), ('cat', "{id:'ac'}"), ('chat', "{id:'VN-240931'}"), ('signoff', "{id:'VN-240931'}"), ('invoice', "{id:'VN-240931'}"), ('gateway', "{id:'VN-240931'}"), ('payfail', "{id:'VN-240931'}"), ('receipt', "{id:'VN-240931'}"), ('review', "{id:'VN-240931'}"), ('dispute', "{id:'VN-240928'}"), ('login', "{}"), ('otp', "{}"), ('onboard', "{}")]:
        steps.append({"name": f"{lang}-{sc}-{p}", "js": f"CUST.S.lang={lang};CUST.S.book=CUST.S.book||null;CUST.root('home');CUST.push('{sc}',{p})", "check": CHK})
    steps.append({"name": f"{lang}-book", "js": f"CUST.S.lang={lang};CUST.ACT.bookStart({{dataset:{{id:'acclean'}}}});CUST.push('book2');CUST.push('book3');CUST.push('book4')", "check": CHK})
# Bước 4 có khối tóm tắt (thêm sau soát UX 30 luật)
for lang in (0, 1):
    steps.append({"name": f"{lang}-book4sum", "js": f"CUST.S.lang={lang};CUST.root('home');CUST.ACT.bookStart({{dataset:{{id:'acclean'}}}});CUST.S.book.slots=['24 13:00-15:00'];CUST.push('book2');CUST.push('book3');CUST.push('book4')", "check": CHK})
json.dump({"steps": steps}, open('steps-scan-cust.json', 'w', encoding='utf-8'), ensure_ascii=False)

prov = ['requests', 'dispatch', 'finance', 'account', 'profile', 'pricing', 'area', 'hours', 'team', 'quality', 'notifs', 'help', 'withdraw']
steps = []
for lang in (0, 1):
    for sc in prov:
        steps.append({"name": f"{lang}-{sc}", "js": f"PROV.S.lang={lang};PROV.S.role='owner';PROV.root('{sc}')", "check": CHK})
    for sc, p in [('req', "{id:'YC-58213'}"), ('tech', "{id:'tai'}")]:
        steps.append({"name": f"{lang}-{sc}", "js": f"PROV.S.lang={lang};PROV.root('requests');PROV.push('{sc}',{p})", "check": CHK})
    for i in (0, 1, 2, 3, 9):
        steps.append({"name": f"{lang}-doc{i}", "js": f"PROV.S.lang={lang};PROV.S.role='owner';PROV.root('profile');PROV.push('doc',{{i:{i}}})", "check": CHK})
    for sc in ['today', 'week', 'chats']:
        steps.append({"name": f"{lang}-t-{sc}", "js": f"PROV.S.lang={lang};PROV.S.role='tech';PROV.root('{sc}')", "check": CHK})
    steps.append({"name": f"{lang}-t-doc", "js": f"PROV.S.lang={lang};PROV.S.role='tech';PROV.root('today');PROV.push('doc',{{i:3}})", "check": CHK})
    for p in ["{id:'VN-240931'}", "{id:'VN-240934'}"]:
        steps.append({"name": f"{lang}-job{p}", "js": f"PROV.S.lang={lang};PROV.S.role='tech';PROV.root('today');PROV.push('job',{p})", "check": CHK})
    steps.append({"name": f"{lang}-onb", "js": f"PROV.S.lang={lang};PROV.S.role='new';PROV.root('onb')", "check": CHK})
json.dump({"steps": steps}, open('steps-scan-prov.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('ok')
