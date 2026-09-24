import re, glob, os
base = os.path.join(os.path.dirname(__file__), '..', 'site', 'assets')
NONE = "L('Không có', 'None')"
for f in glob.glob(os.path.join(glob.escape(base), '*.js')):
    if f.endswith('icons.js'):
        continue
    s = open(f, encoding='utf-8').read(); o = s
    s = s.replace("['—', '—', 'neutral']", "['Không rõ', 'Unknown', 'neutral']")
    s = s.replace("'<span class=\"subtle\">—</span>'", "'<span class=\"subtle\">' + " + NONE + " + '</span>'")
    s = s.replace("<span class=\"subtle\">—</span>", "<span class=\"subtle\">' + " + NONE + " + '</span>")
    s = s.replace("'<span class=\"s\">—</span>'", "'<span class=\"s\">' + " + NONE + " + '</span>'")
    s = re.sub(r"(?<![\w'])'—'", NONE, s)
    # sao đánh giá: dùng icon
    s = s.replace("' · ★ ' + VN.num(m.rating, 1)", "' · ' + ic('star-fill', 'star') + ' ' + VN.num(m.rating, 1)")
    s = s.replace("['★ ' + VN.num(m.rating, 1), L('đánh giá', 'rating')]", "[VN.num(m.rating, 1), L('đánh giá', 'rating')]")
    s = s.replace("k[0].replace('★', '')", "k[0]")
    s = s.replace("'★ 4,9 · '", "ic('star-fill', 'star') + ' 4,9 · '")
    s = s.replace("<span class=\"sm-muted\">★ 5 · 18/09</span>", "<span class=\"sm-muted\">' + ic('star-fill', 'star') + ' 5 · 18/09</span>")
    if s != o:
        open(f, 'w', encoding='utf-8').write(s)
    left = [(m.start(), s[max(0, m.start() - 60):m.end() + 20].replace('\n', ' ')) for m in re.finditer('[—★]', s)]
    for p, c in left:
        print(os.path.basename(f), 'LEFT:', c)
print('done')
