# Bẻ thử các chốt của đợt evolve-site 1 (QA.md §11).
# Chép site sang thư mục tạm, phá từng chốt, đếm số chỗ đã phá (phải bằng số phép bẻ), rồi chạy 2 bộ kiểm trên bản bị phá.
# Chạy từ docs/prototypes/vuong-nhan:  python _qa/break_test.py
# Kết quả đúng: mỗi bộ có ít nhất 1 bước FAIL. Chạy 2 bộ trên site thật thì phải 0 FAIL.
import json, os, shutil, subprocess, sys, tempfile
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'site')
DST = os.path.join(tempfile.gettempdir(), 'vn-broken-site')
OUT = os.path.join(tempfile.gettempdir(), 'vn-broken-out')
shutil.rmtree(DST, ignore_errors=True)
shutil.rmtree(OUT, ignore_errors=True)
shutil.copytree(SRC, DST)
BREAKS = [
    ('assets/customer.js', "a.btn(L('Huỷ đơn', 'Cancel'), 'sheetCancel', { cls: 'sec2', id: o.id, dis: lockWhy() })", "a.btn(L('Huỷ đơn', 'Cancel'), 'sheetCancel', { cls: 'sec2', id: o.id })", 'bỏ khoá nút Huỷ đơn'),
    ('assets/customer.js', "ACT.cancelGo = function (el) { if (locked(el.dataset.id)) return;", "ACT.cancelGo = function (el) {", 'bỏ chặn cancelGo'),
    ('assets/app.css', '.abtn.sec2[aria-disabled="true"]{opacity:.45;cursor:not-allowed}', '', 'bỏ kiểu khoá nút phụ'),
    ('assets/provider.js', "if (a.S.role !== 'owner') return { tabs: false, hdr: hdr,", "if (false) return { tabs: false, hdr: hdr,", 'bỏ chặn vai ở màn giấy tờ'),
    ('assets/provider.js', "if (!d || a.S.role !== 'owner' || d[2] === 'review'", "if (!d || d[2] === 'review'", 'bỏ chặn vai ở docUp'),
    ('assets/app.css', '.abtn.dz[aria-disabled="true"]{opacity:.45;cursor:not-allowed}', '', 'bỏ kiểu khoá nút đỏ'),
    ('assets/app-core.js', "if (bb) { e.preventDefault(); bb.click(); return; }", '', 'bỏ Esc lùi màn'),
]
total = 0
for f, old, new, label in BREAKS:
    p = os.path.join(DST, f)
    s = open(p, encoding='utf-8').read()
    n = s.count(old)
    open(p, 'w', encoding='utf-8', newline='').write(s.replace(old, new))
    total += n
    print(f'{label}: {n} chỗ')
print('Tổng chỗ đã phá:', total, '/', len(BREAKS))
if total != len(BREAKS):
    sys.exit('Có phép bẻ không thay được gì: mã đã đổi, cập nhật BREAKS trước khi đọc kết quả')
bad = False
for page, steps in (('customer.html', 'steps-lock-cust.json'), ('provider.html', 'steps-docs-prov.json')):
    out = os.path.join(OUT, steps[:-5])
    os.makedirs(out, exist_ok=True)
    r = subprocess.run(['node', '--experimental-websocket', os.path.join(HERE, 'run.mjs'), os.path.join(DST, page), os.path.join(HERE, steps), out, '390', '844', '1'], capture_output=True, text=True, encoding='utf-8')
    d = json.loads(r.stdout)
    fails = [s['step'] for s in d if isinstance(s.get('check'), str) and s['check'].startswith('FAIL')]
    print(f'{steps}: {len(fails)} FAIL', fails)
    bad = bad or not fails
sys.exit('Bộ kiểm không kêu khi tính năng bị phá' if bad else 0)
