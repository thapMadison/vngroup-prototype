/* Trang quản trị · bộ máy số liệu tài chính, Tổng quan (T), Báo cáo (R). */
(function (W) {
  'use strict';
  var VN = W.VN, D = W.VNDATA, A = W.ADMIN, L = VN.L, ic = VN.ic, esc = VN.esc;
  var F = A.F = {}, DAYS = D.FIN.days, LAST = DAYS.length - 1, R = Math.round;

  /* ---------- Kỳ báo cáo ---------- */
  function idx(m, d) { for (var i = 0; i < DAYS.length; i++) if (DAYS[i].m === m && DAYS[i].d === d) return i; return -1; }
  function fromISO(s) { var p = s.split('-'); return { m: +p[1], d: +p[2] }; }
  F.PERIODS = [['today', 'Hôm nay', 'Today'], ['7d', '7 ngày', '7 days'], ['month', 'Tháng này', 'This month'], ['quarter', 'Quý này', 'This quarter'], ['year', 'Năm nay', 'This year'], ['all', 'Từ trước đến nay', 'All time'], ['custom', 'Tuỳ chọn', 'Custom']];
  F.range = function (k) {
    var r;
    if (k === 'today') r = { i0: LAST, i1: LAST, p0: LAST - 1, p1: LAST - 1, lbl: ['24/09/2026', '24/09/2026'], plbl: ['23/09', '23/09'] };
    else if (k === '7d') r = { i0: idx(9, 18), i1: LAST, p0: idx(9, 11), p1: idx(9, 17), lbl: ['18-24/09/2026', '18-24/09/2026'], plbl: ['11-17/09', '11-17/09'] };
    else if (k === 'month') r = { i0: idx(9, 1), i1: LAST, p0: idx(8, 1), p1: idx(8, 24), lbl: ['01-24/09/2026', '01-24/09/2026'], plbl: ['01-24/08', '01-24/08'] };
    else if (k === 'quarter') r = { i0: idx(7, 1), i1: LAST, p0: idx(4, 1), p1: idx(6, 25), lbl: ['Quý 3: 01/07-24/09/2026', 'Q3: 01/07-24/09/2026'], plbl: ['01/04-25/06', '01/04-25/06'] };
    else if (k === 'year' || k === 'all') r = { i0: 0, i1: LAST, p0: -1, p1: -1, lbl: k === 'year' ? ['Năm 2026 (hoạt động từ 01/03)', '2026 (live since 01/03)'] : ['01/03/2026-24/09/2026', '01/03/2026-24/09/2026'], plbl: null };
    else {
      var c = A.ui('custom', { from: '2026-09-01', to: '2026-09-24' }), a = fromISO(c.from), b = fromISO(c.to);
      var i0 = Math.max(0, idx(a.m, a.d)), i1 = idx(b.m, b.d); if (i1 < 0) i1 = LAST; if (i0 > i1) { var t = i0; i0 = i1; i1 = t; }
      var len = i1 - i0 + 1, p1 = i0 - 1, p0 = p1 - len + 1;
      r = { i0: i0, i1: i1, p0: p0 >= 0 ? p0 : -1, p1: p0 >= 0 ? p1 : -1, lbl: [dmyOf(i0) + '-' + dmyOf(i1), dmyOf(i0) + '-' + dmyOf(i1)], plbl: p0 >= 0 ? [dmyOf(p0) + '-' + dmyOf(p1), dmyOf(p0) + '-' + dmyOf(p1)] : null };
    }
    r.k = k; r.len = r.i1 - r.i0 + 1;
    r.gran = r.len <= 31 ? 'day' : r.len <= 120 ? 'week' : 'month';
    return r;
  };
  function dmyOf(i) { return VN.dm(DAYS[i].d, DAYS[i].m); }
  F.dmyOf = dmyOf;
  function sum(i0, i1) {
    var s = { gmv: 0, ref: 0, hh: 0, out: 0 };
    if (i0 < 0) return s;
    for (var i = i0; i <= i1; i++) { s.gmv += DAYS[i].gmv; s.ref += DAYS[i].ref; s.hh += DAYS[i].hh; s.out += DAYS[i].out; }
    return s;
  }
  F.share = function (f) {
    f = f || {};
    var p = f.prov ? A.prov(f.prov) : null;
    if (p && f.cat) return p.repShare * (p.catSplit[f.cat] || 0);
    if (p) return p.repShare;
    if (f.cat) return A.cat(f.cat).share;
    return 1;
  };
  function match(a, f) { return (!f.cat || a.cat === f.cat) && (!f.prov || a.prov === f.prov); }
  F.adjSum = function (f) {
    var s = { ref: 0, out: 0, owe: 0, gmvToday: 0 };
    A.S.adj.forEach(function (a) { if (!match(a, f || {})) return; s.ref += a.ref || 0; s.out += a.out || 0; s.owe += a.owe || 0; });
    return s;
  };
  /* Số liệu một kỳ. Mọi số đã làm tròn đồng và cây cầu cộng khớp tuyệt đối. */
  F.metrics = function (k, f, prev) {
    f = f || {};
    var r = typeof k === 'object' ? k : F.range(k), sh = F.share(f);
    var i0 = prev ? r.p0 : r.i0, i1 = prev ? r.p1 : r.i1;
    if (prev && i0 < 0) return null;
    var s = sum(i0, i1), today = !prev && i1 === LAST, a = today ? F.adjSum(f) : { ref: 0, out: 0, owe: 0 };
    var owe = R(D.FIN.outstanding * sh + F.adjSum(f).owe);
    var paid = R((s.gmv + s.ref) * sh), ref = R(s.ref * sh) + a.ref, G = paid - ref;
    var T = R(G * 0.02), C = R(G * 0.15), P = G - C - T, Re = Math.min(R(s.hh * sh), C), Pr = C - Re;
    var Due = Math.max(0, Math.min(P, owe)), Pd = P - Due, Out = R(s.out * sh) + a.out;
    return { paid: paid, ref: ref, gmv: G, comm: C, realized: Re, prov: Pr, tax: T, share: P, paidTo: Pd, due: Due, paidOut: Out, owe: owe };
  };
  F.series = function (r, f) {
    var sh = F.share(f), out = [], cur = null, key;
    for (var i = r.i0; i <= r.i1; i++) {
      var d = DAYS[i];
      if (r.gran === 'day') key = i;
      else if (r.gran === 'week') key = Math.floor((i - (DAYS[i].dow + 6) % 7));
      else key = d.m;
      if (!cur || cur.key !== key) {
        cur = { key: key, gmv: 0, hh: 0, lbl: r.gran === 'day' ? VN.dm(d.d, d.m) : r.gran === 'week' ? L('Tuần ', 'Week of ') + VN.dm(d.d, d.m) : L('Tháng ' + d.m, 'Month ' + d.m), short: r.gran === 'month' ? 'T' + d.m : VN.dm(d.d, d.m) };
        out.push(cur);
      }
      cur.gmv += (d.gmv) * sh; cur.hh += d.hh * sh;
      if (i === LAST) cur.gmv -= F.adjSum(f).ref;
    }
    return out;
  };

  /* ---------- Biểu đồ cột nhóm (một trục ₫) ---------- */
  F.bars = function (el, data) {
    var W0 = el.clientWidth || 600, H = 230, pl = 52, pb = 26, pt = 10, n = data.length;
    var max = 0; data.forEach(function (x) { max = Math.max(max, x.gmv); });
    var step = niceStep(max / 4); max = step * 4;
    var cw = (W0 - pl) / n, bw = Math.max(2, Math.min(14, (cw - 6) / 2)), y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var s = '<svg width="' + W0 + '" height="' + H + '" role="img" aria-label="' + esc(L('Biểu đồ GMV và hoa hồng thực thu', 'GMV and realised commission chart')) + '">';
    for (var t = 0; t <= 4; t++) {
      var v = step * t;
      s += '<line x1="' + pl + '" x2="' + W0 + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (t ? '#ECEAE7' : '#C9C5C0') + '"/>' +
        '<text x="' + (pl - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="11" fill="#76706C">' + esc(axisLbl(v)) + '</text>';
    }
    var every = Math.ceil(n / 9);
    data.forEach(function (x, i) {
      var bx = pl + i * cw + (cw - bw * 2 - 2) / 2;
      s += '<g class="bg" data-i="' + i + '"><rect x="' + (pl + i * cw) + '" y="' + pt + '" width="' + cw + '" height="' + (H - pt - pb) + '" fill="transparent"/>' +
        '<path d="' + top(bx, y(x.gmv), bw, y(0) - y(x.gmv)) + '" fill="var(--series-1)"/><path d="' + top(bx + bw + 2, y(x.hh), bw, y(0) - y(x.hh)) + '" fill="var(--series-2)"/></g>';
      if (i % every === 0) s += '<text x="' + (pl + i * cw + cw / 2) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="11" fill="#76706C">' + esc(x.short) + '</text>';
    });
    el.innerHTML = s + '</svg><div class="tip" hidden></div>';
    var tip = el.querySelector('.tip');
    el.querySelectorAll('.bg').forEach(function (g) {
      g.addEventListener('mouseenter', function () {
        var x = data[+g.dataset.i];
        tip.innerHTML = '<b>' + esc(x.lbl) + '</b><span><i style="background:var(--series-1)"></i>GMV<b>' + VN.money(x.gmv) + '</b></span><span><i style="background:var(--series-2)"></i>' + L('Hoa hồng thực thu', 'Realised commission') + '<b>' + VN.money(x.hh) + '</b></span>';
        tip.hidden = false;
        tip.style.left = Math.min(Math.max(pl + (+g.dataset.i) * cw + cw / 2 - 115, 0), W0 - 230) + 'px';
        g.style.opacity = 1;
      });
      g.addEventListener('mouseleave', function () { tip.hidden = true; });
    });
  };
  function niceStep(v) { var p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1)))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
  function axisLbl(v) { if (v >= 1e9) return VN.num(v / 1e9, 1).replace(/[.,]0$/, '') + (VN.lang ? 'B' : ' tỷ'); if (v >= 1e6) return VN.num(v / 1e6) + (VN.lang ? 'M' : ' tr'); return VN.num(v); }
  function top(x, y, w, h) { var r = Math.min(4, w / 2, h); if (h <= 0) return ''; return 'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z'; }

  /* ---------- Thành phần tài chính dùng lại ---------- */
  F.ASSUME = [
    ['Hoa hồng chỉ tính là "Thực thu" khi đơn hết bảo hành; trước đó là "Tạm tính".', 'Commission is "realised" only after warranty ends; before that it is "provisional".'],
    ['Kỳ báo cáo theo năm dương lịch; "Năm nay" tính từ 01/01/2026.', 'Calendar-year reporting; "This year" starts 01/01/2026.'],
    ['Thuế khấu trừ 2% trên giá trị đơn.', '2% tax withheld on order value.'],
    ['Hoàn tiền từ 500.000 ₫ trở lên cần duyệt hai bước.', 'Refunds of 500,000 ₫ or more need two-step approval.']
  ];
  F.assumeTip = function (which) {
    var list = which ? which.map(function (i) { return F.ASSUME[i]; }) : F.ASSUME;
    return L('Giả định, chờ xác nhận: ', 'Assumption, pending confirmation: ') + list.map(function (a, i) { return (i + 1) + '. ' + L(a[0], a[1]); }).join(' ');
  };
  F.kpiCards = function (k, f, cmp) {
    var m = F.metrics(k, f), all = F.metrics('all', f), pv = cmp ? F.metrics(k, f, true) : null;
    function delta(cur, old) {
      if (!cmp) return '';
      if (!pv) return '<span class="s">' + L('Chưa có dữ liệu kỳ trước', 'No prior-period data') + '</span>';
      if (!old) return '<span class="s">' + L('Không có', 'None') + '</span>';
      var d = (cur - old) / old * 100;
      return '<span class="d ' + (d >= 0 ? 'up' : 'dn') + '">' + (d >= 0 ? '▲ ' : '▼ ') + VN.pct(Math.abs(d)) + ' <span class="s" style="font-weight:400">' + L('so với ', 'vs ') + L(F.range(k).plbl[0], F.range(k).plbl[1]) + '</span></span>';
    }
    function card(title, v, sub, dl, tip) {
      return '<div class="card kpi"><span class="k">' + title + (tip ? ' <button type="button" class="info-dot" data-tip="' + esc(tip) + '" aria-label="' + L('Giải thích', 'Explain') + '">' + ic('info') + '</button>' : '') + '</span>' +
        '<span class="v"><span data-tip="' + esc(VN.money(v)) + '" tabindex="0">' + VN.moneyShort(v) + '</span></span>' + (dl || '') + sub + '</div>';
    }
    return '<div class="kpis">' +
      card(L('Hoa hồng thực thu', 'Realised commission'), m.realized, '<span class="s">' + L('Tạm tính thêm: ', 'Provisional: ') + '<span class="nw">' + VN.money(m.prov) + '</span> ' + L('(đơn còn bảo hành)', '(orders in warranty)') + '</span><span class="s">' + L('Từ trước đến nay: ', 'All time: ') + '<span class="nw">' + VN.moneyShort(all.realized) + '</span></span>', delta(m.realized, pv && pv.realized), F.assumeTip([0])) +
      card(L('Tổng giao dịch (GMV)', 'Gross merchandise value'), m.gmv, '<span class="s">' + L('Đã trừ hoàn tiền ', 'Net of refunds ') + '<span class="nw">' + VN.money(m.ref) + '</span></span><span class="s">' + L('Từ trước đến nay: ', 'All time: ') + '<span class="nw">' + VN.moneyShort(all.gmv) + '</span></span>', delta(m.gmv, pv && pv.gmv)) +
      card(L('Đã chi cho nhà cung cấp', 'Paid out to providers'), m.paidOut, '<span class="s">' + L('Theo ngày chi', 'By payout date') + '</span><span class="s">' + L('Từ trước đến nay: ', 'All time: ') + '<span class="nw">' + VN.moneyShort(all.paidOut) + '</span></span>', delta(m.paidOut, pv && pv.paidOut)) +
      card(L('Còn phải trả nhà cung cấp', 'Owed to providers'), m.owe, '<span class="s">' + L('Tính tại thời điểm xem, không phụ thuộc kỳ', 'As of now, independent of period') + '</span>', cmp ? '<span class="s">' + L('Không so sánh (số tại thời điểm)', 'Not compared (point in time)') + '</span>' : '') +
      '</div>';
  };
  F.bridge = function (m) {
    var chk = m.realized + m.prov + m.tax + m.paidTo + m.due === m.gmv && m.paid - m.ref === m.gmv;
    function row(cls, op, label, v, tip) { return '<tr class="' + cls + '"><td>' + (op ? '<span class="op">' + op + '</span>' : '') + label + (tip ? ' <button type="button" class="info-dot" data-tip="' + esc(tip) + '">' + ic('info') + '</button>' : '') + '</td><td class="num">' + VN.money(v) + '</td></tr>'; }
    return '<table class="tbl bridge"><tbody>' +
      row('lv1', '', L('Khách đã trả', 'Paid by customers'), m.paid) +
      row('lv1', '−', L('Đã hoàn', 'Refunded'), m.ref) +
      row('lv1 strong', '=', 'GMV', m.gmv) +
      row('lv2 strong', '', L('Hoa hồng nền tảng 15%', 'Platform commission 15%'), m.comm) +
      row('lv3', '', L('Thực thu', 'Realised'), m.realized, F.assumeTip([0])) +
      row('lv3', '', L('Tạm tính (đơn còn bảo hành)', 'Provisional (in warranty)'), m.prov) +
      row('lv2 strong', '', L('Thuế khấu trừ 2%', 'Tax withheld 2%'), m.tax, F.assumeTip([2])) +
      row('lv2 strong', '', L('Phần nhà cung cấp', 'Provider share'), m.share) +
      row('lv3', '', L('Đã chi', 'Paid out'), m.paidTo) +
      row('lv3', '', L('Còn phải trả', 'Still owed'), m.due) +
      '</tbody></table><div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:1px solid var(--line)">' +
      (chk ? '<span class="match">' + ic('check-circle') + L('Khớp: các dòng con cộng đúng bằng dòng cha', 'Balanced: children sum to parents') + '</span>' : '<span class="match" style="color:var(--danger)">' + ic('warning-circle') + L('Lệch', 'Mismatch') + '</span>') +
      '<span class="assume">' + L('Giả định, chờ xác nhận', 'Assumption, pending') + '</span></div>';
  };

  /* ---------- Tổng quan (T) ---------- */
  A.P.dashboard = {
    crumb: function () { return null; },
    render: function () {
      var k = A.ui('dashPeriod', 'month'), b = A.badges(), d = A.S.d;
      var m = F.metrics(k, {});
      var h = '<div class="page-h"><div><h1>' + L('Tổng quan', 'Overview') + '</h1><div class="sub">' + VN.todayLong() + ' · ' + L('cập nhật lúc ', 'updated at ') + VN.nowTime() + '</div></div><div class="acts">' +
        '<div class="seg" role="group" aria-label="' + L('Kỳ', 'Period') + '">' + F.PERIODS.slice(0, 4).map(function (p) { return '<button type="button" class="' + (k === p[0] ? 'on' : '') + '" data-act="dashPeriod" data-id="' + p[0] + '" aria-pressed="' + (k === p[0]) + '">' + L(p[1], p[2]) + '</button>'; }).join('') + '</div>' +
        (A.can('export') ? A.btn(L('Xuất Excel', 'Export to Excel'), 'exportOpen', { icon: 'download-simple', x: 'dash' }) : '') + '</div></div>';
      h += F.kpiCards(k, {}, false);

      // Dòng chảy đơn
      var st = [[38, L('Yêu cầu mới', 'New requests'), d.ORDERS.filter(function (o) { return o.status === 'nobody'; }).length ? ['warn', L('1 chưa ai nhận', '1 with no taker')] : null, 'req'],
        [12, L('Chờ khách chọn', 'Awaiting choice'), null, 'req'], [46, L('Đã phân công', 'Assigned'), null, 'assigned'], [19, L('Đang thực hiện', 'In progress'), null, 'progress'],
        [8, L('Chờ nghiệm thu', 'Awaiting sign-off'), null, 'signoff'], [27, L('Chờ thanh toán', 'Awaiting payment'), overdueFlag(), 'payment'],
        [412, L('Đang bảo hành', 'In warranty'), holdFlag(), 'done']];
      h += '<section class="card" style="padding:18px 22px 22px" aria-labelledby="flow-h"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px"><h2 id="flow-h" style="margin:0;font-size:15px;font-weight:600">' + L('Dòng chảy đơn lúc này', 'Order flow right now') + '</h2><span class="muted" style="font-size:12.5px">' + L('Bấm một chặng để mở danh sách đơn ở chặng đó', 'Click a stage to open its orders') + '</span></div><div class="stages">' +
        st.map(function (s) { return '<button type="button" class="stg" data-act="stage" data-id="' + s[3] + '"><span class="dt"></span><span class="n">' + VN.num(s[0]) + '</span><span class="l">' + s[1] + '</span>' + (s[2] ? '<span class="badge t-' + s[2][0] + '">' + s[2][1] + '</span>' : '') + '</button>'; }).join('') + '</div></section>';

      // Tiền đi đâu + Việc cần xử lý
      var tot = m.gmv || 1, seg = [[m.realized, 'background:var(--series-2)', L('Hoa hồng thực thu', 'Realised commission')], [m.prov, '', L('Hoa hồng tạm tính', 'Provisional commission'), 'hatch-2'], [m.tax, 'background:var(--series-3)', L('Thuế khấu trừ 2%', 'Tax withheld 2%')], [m.paidTo, 'background:var(--series-1)', L('Nhà cung cấp đã nhận', 'Paid to providers')], [m.due, '', L('Còn phải trả nhà cung cấp', 'Still owed to providers'), 'hatch-1']];
      h += '<div class="grid2"><section class="card" style="padding:18px 22px 16px;display:flex;flex-direction:column;gap:14px" aria-labelledby="money-h"><div style="display:flex;justify-content:space-between;align-items:baseline"><h2 id="money-h" style="margin:0;font-size:15px;font-weight:600">' + L('Tiền đi đâu', 'Where the money goes') + ' · ' + L(F.range(k).lbl[0], F.range(k).lbl[1]) + '</h2>' + (A.sees('reports') ? '<button type="button" class="link" data-act="nav" data-id="reports">' + L('Xem báo cáo', 'Open report') + ' →</button>' : '') + '</div>' +
        '<div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;font-size:13px;color:var(--text-2)">' + L('Khách đã trả', 'Paid by customers') + ' <b style="color:var(--text)">' + VN.money(m.paid) + '</b> ' + L('trừ đã hoàn', 'less refunds') + ' <b style="color:var(--text)">' + VN.money(m.ref) + '</b> = GMV <b style="font-size:20px;color:var(--text)">' + VN.money(m.gmv) + '</b></div>' +
        '<div class="money-stack" role="img" aria-label="' + L('Cơ cấu GMV', 'GMV breakdown') + '">' + seg.map(function (s) { return '<i class="' + (s[3] || '') + '" style="width:' + (s[0] / tot * 100) + '%;' + s[1] + '" title="' + esc(s[2] + ': ' + VN.money(s[0])) + '"></i>'; }).join('') + '</div>' +
        '<table class="tbl" style="font-size:13px">' + seg.map(function (s) { return '<tr><td style="height:34px;width:22px;padding:0"><span class="sw ' + (s[3] || '') + '" style="' + s[1] + '"></span></td><td style="height:34px;padding-left:4px">' + s[2] + '</td><td class="num" style="height:34px">' + VN.money(s[0]) + '</td><td class="num muted" style="height:34px;width:60px">' + VN.pct(s[0] / tot * 100) + '</td></tr>'; }).join('') + '</table>' +
        '<div style="display:flex;justify-content:space-between"><span class="match">' + ic('check-circle') + L('Khớp', 'Balanced') + '</span><span class="assume" data-tip="' + esc(F.assumeTip([0, 2])) + '" tabindex="0">' + L('Giả định, chờ xác nhận', 'Assumption, pending') + '</span></div></section>';
      h += '<section class="card" aria-labelledby="todo-h"><div class="card-h"><h2 id="todo-h">' + L('Việc cần xử lý', 'Needs action') + '</h2><span class="muted" style="font-size:12px">' + L('Theo quyền của bạn', 'Based on your role') + '</span></div><div style="padding:8px 0 6px">' + tasks(b) + '</div></section></div>';

      // Heatmap + Nhà cung cấp cần chú ý
      h += '<div class="grid2"><section class="card" aria-labelledby="hm-h"><div class="card-h" style="padding-bottom:8px"><h2 id="hm-h">' + L('Yêu cầu không ai nhận, theo ngành và khung giờ', 'Unaccepted requests by category and time') + '</h2><span class="muted" style="font-size:12.5px">' + L('% trên tổng yêu cầu · 30 ngày', '% of requests · 30 days') + '</span></div><div style="padding:4px 20px 18px">' + heat() + '</div></section>';
      h += '<section class="card" aria-labelledby="watch-h"><div class="card-h" style="padding-bottom:8px"><h2 id="watch-h">' + L('Nhà cung cấp cần chú ý', 'Providers to watch') + '</h2>' + (A.sees('providers') ? '<button type="button" class="link" data-act="nav" data-id="providers">' + L('Tất cả', 'All') + '</button>' : '') + '</div><div style="padding:4px 0 6px">' + watch() + '</div></section></div>';
      return h;
    }
  };
  function overdueFlag() { var n = A.S.d.ORDERS.filter(function (o) { return o.status === 'overdue'; }).length; return n ? ['danger', L(n + ' quá hạn', n + ' overdue')] : null; }
  function holdFlag() { var n = A.S.d.ORDERS.filter(function (o) { return o.money === 'hold'; }).length; return n ? ['danger', L(n + ' đang tạm giữ', n + ' on hold')] : null; }
  function tasks(b) {
    var d = A.S.d, list = [];
    var pendRef = d.REFUNDS.filter(function (r) { return r.st === 'pending'; }).length;
    var holds = d.ORDERS.filter(function (o) { return o.money === 'hold'; }).length;
    var overdue = d.ORDERS.filter(function (o) { return o.status === 'overdue'; }).length;
    var bankQ = d.PROVIDERS.filter(function (p) { return p.bank && p.bank.state === 'pending'; }).length;
    if (A.sees('disputes')) list.push(['disputes', {}, 't-danger', 'scales', L('Khiếu nại chờ phân xử', 'Disputes awaiting ruling'), L('Cũ nhất: mở 21/09 17:48', 'Oldest: opened 21/09 17:48'), b.disputes]);
    if (A.sees('payouts')) list.push(['payouts', {}, 't-slate', 'hand-coins', L('Rút tiền chờ duyệt', 'Payouts awaiting approval'), L('Tổng ', 'Total ') + VN.money(d.PAYOUTS.filter(function (p) { return p.st === 'pending'; }).reduce(function (a, p) { return a + p.amount; }, 0)), b.payouts]);
    if (A.sees('refunds')) list.push(['refunds', { tab: 'pending' }, 't-slate', 'arrow-counter-clockwise', L('Hoàn tiền chờ duyệt', 'Refunds awaiting approval'), L('Từ 500.000 ₫, duyệt hai bước', '500,000 ₫ or more, two-step'), pendRef]);
    if (A.sees('refunds')) list.push(['refunds', { tab: 'hold' }, 't-danger', 'lock-simple', L('Khoản đang tạm giữ', 'Funds on hold'), L('Do khiếu nại đang mở', 'Due to open disputes'), holds]);
    if (A.sees('transactions')) list.push(['transactions', { tab: 'unpaid' }, 't-warn', 'clock', L('Đơn quá hạn thanh toán', 'Orders overdue for payment'), L('Lâu nhất: 9 ngày', 'Longest: 9 days'), overdue]);
    if (A.sees('providers') && A.can('provApprove')) list.push(['providers', { tab: 'queue' }, 't-warn', 'identification-card', L('Hồ sơ nhà cung cấp chờ duyệt', 'Provider profiles to review'), L('Cũ nhất: nộp 3 ngày trước', 'Oldest: 3 days ago'), b.providers]);
    if (A.sees('providers') && A.can('bankVerify')) list.push(['providers', { tab: 'docs', sub: 'bank' }, 't-warn', 'bank', L('Tài khoản ngân hàng chờ xác minh', 'Bank accounts to verify'), L('Có 1 tài khoản vừa đổi', 'One account recently changed'), bankQ]);
    list = list.filter(function (x) { return x[6] > 0; });
    if (!list.length) return A.empty(L('Không có việc cần bạn xử lý', 'Nothing needs your action'), L('Vai trò của bạn chỉ xem số liệu. Việc cần duyệt sẽ hiện ở đây khi có quyền.', 'Your role is view-only. Approvals appear here when you have permission.'));
    return list.map(function (t) { return '<button type="button" class="task" data-act="goTask" data-id="' + t[0] + '" data-x="' + esc(JSON.stringify(t[1])) + '"><span class="ico ' + t[2] + '">' + ic(t[3]) + '</span><div><b>' + t[4] + '</b><small>' + t[5] + '</small></div><span class="num">' + t[6] + '</span>' + ic('caret-right', 'subtle') + '</button>'; }).join('');
  }
  var HM = { rows: ['ac', 'clean', 'plumb', 'appl', 'sofa', 'pest'], cols: ['07-09', '09-11', '11-13', '13-15', '15-17', '17-19', '19-21'],
    v: [[2, 1, 1, 3, 4, 9, 18], [1, 0, 2, 2, 3, 6, 12], [3, 2, 2, 4, 5, 11, 24], [2, 1, 2, 2, 4, 7, 15], [0, 1, 1, 2, 2, 5, 9], [4, 3, 5, 6, 8, 14, 27]],
    n: [[48, 62, 40, 55, 58, 71, 39], [80, 96, 72, 64, 70, 52, 25], [31, 40, 28, 30, 36, 44, 29], [22, 30, 25, 21, 27, 30, 20], [12, 18, 15, 14, 16, 11, 7], [10, 12, 9, 11, 13, 14, 11]] };
  function heat() {
    var bin = function (v) { return v <= 2 ? 1 : v <= 5 ? 2 : v <= 9 ? 3 : v <= 14 ? 4 : v <= 19 ? 5 : 6; };
    var h = '<div class="hm" role="table" aria-label="' + L('Tỷ lệ yêu cầu không ai nhận', 'Unaccepted request rate') + '"><span></span>' + HM.cols.map(function (c) { return '<span class="ch" role="columnheader">' + c + '</span>'; }).join('');
    HM.rows.forEach(function (r, i) {
      h += '<span class="rh" role="rowheader">' + A.catName(r) + '</span>';
      HM.v[i].forEach(function (v, j) {
        var tip = A.catName(r) + ', ' + HM.cols[j] + ': ' + R(HM.n[i][j] * v / 100) + L(' trên ', ' of ') + HM.n[i][j] + L(' yêu cầu không ai nhận', ' requests unaccepted');
        h += '<span class="c s' + bin(v) + '" role="cell" tabindex="0" data-tip="' + esc(tip) + '">' + v + '%</span>';
      });
    });
    return h + '</div><div class="hm-l">' + L('Ít', 'Low') + '<i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i><i class="s5"></i><i class="s6"></i>' + L('Nhiều · rê chuột vào ô để xem số yêu cầu', 'High · hover a cell for counts') + '</div>';
  }
  function watch() {
    var items = [];
    A.S.d.PROVIDERS.forEach(function (p) {
      if (p.status === 'pending') return;
      if (p.flags.indexOf('bankFix') >= 0) items.push([p, 'danger', L('Chi thất bại, cần cập nhật tài khoản ngân hàng', 'Payout failed, bank account needs update')]);
      else if (p.flags.indexOf('bankChanged') >= 0) items.push([p, 'warn', L('Tài khoản ngân hàng vừa đổi 2 ngày trước', 'Bank account changed 2 days ago')]);
      if (p.flags.indexOf('cancelHigh') >= 0) items.push([p, 'danger', L('Tỷ lệ huỷ tuần này ' + p.cancelRate + '%', 'Cancel rate this week ' + p.cancelRate + '%')]);
      if (p.status === 'locked') items.push([p, 'danger', L('Đã khoá: ', 'Locked: ') + L(p.lockReason || '', 'under review')]);
      p.docs.forEach(function (dc) { if (dc.st === 'expired' && !dc.paused) items.push([p, 'danger', L(dc.t[0] + ' đã hết hạn ' + VN.dmy(dc.exp[0], dc.exp[1], dc.exp[2]), dc.t[1] + ' expired ' + VN.dmy(dc.exp[0], dc.exp[1], dc.exp[2]))]); });
    });
    return items.slice(0, 5).map(function (x) {
      return '<button type="button" class="watch" data-act="goProv" data-id="' + x[0].id + '" data-x="provider"' + (A.sees('providers') ? '' : ' aria-disabled="true" data-tip="' + esc(L('Vai trò của bạn không xem được hồ sơ nhà cung cấp', 'Your role cannot open provider profiles')) + '"') + '><span class="av sq">' + x[0].ini + '</span><div><b>' + esc(x[0].name) + '</b><span class="badge t-' + x[1] + '">' + x[2] + '</span></div>' + ic('caret-right', 'subtle') + '</button>';
    }).join('');
  }
  A.ACT.dashPeriod = function (el) { A.S.ui.dashPeriod = el.dataset.id; A.render(); };
  A.ACT.goTask = function (el) { A.go(el.dataset.id, JSON.parse(el.dataset.x || '{}')); };
  A.ACT.stage = function (el) {
    if (!A.sees('orders')) return;
    A.S.ui['ord-status'] = el.dataset.id === 'req' ? 'req' : el.dataset.id; A.go('orders', { tab: 'list' });
  };

  /* ---------- Báo cáo tài chính (R) ---------- */
  A.P.reports = {
    crumb: function () { return null; },
    render: function () {
      var k = A.ui('repPeriod', 'month'), cmp = A.ui('repCmp', false), f = { cat: A.ui('repCat', ''), prov: A.ui('repProv', '') };
      var r = F.range(k), m = F.metrics(k, f), sh = F.share(f);
      var h = '<div class="page-h"><div><h1>' + L('Báo cáo tài chính', 'Financial report') + '</h1><div class="sub">' + L('Khu vực TP. Hồ Chí Minh · Kỳ ', 'Ho Chi Minh City · Period ') + L(r.lbl[0], r.lbl[1]) + '</div></div><div class="acts">' +
        (A.can('export') ? A.btn(L('Xuất Excel', 'Export to Excel'), 'exportOpen', { cls: 'primary', icon: 'download-simple', x: 'rep' }) : '') + '</div></div>';
      // Bộ chọn kỳ
      h += '<div class="card" style="padding:14px 16px;display:flex;flex-direction:column;gap:12px"><div class="filters">' +
        '<div class="seg" role="group" aria-label="' + L('Kỳ báo cáo', 'Reporting period') + '">' + F.PERIODS.map(function (p) { return '<button type="button" class="' + (k === p[0] ? 'on' : '') + '" data-act="repPeriod" data-id="' + p[0] + '" aria-pressed="' + (k === p[0]) + '">' + L(p[1], p[2]) + '</button>'; }).join('') + '</div>' +
        (k === 'custom' ? '<label class="sr" for="c-from">' + L('Từ ngày', 'From') + '</label><input id="c-from" type="date" class="inp" style="width:150px" min="2026-03-01" max="2026-09-24" value="' + A.ui('custom').from + '" data-in="custom" data-k="from"><span class="muted">' + L('đến', 'to') + '</span><label class="sr" for="c-to">' + L('Đến ngày', 'To') + '</label><input id="c-to" type="date" class="inp" style="width:150px" min="2026-03-01" max="2026-09-24" value="' + A.ui('custom').to + '" data-in="custom" data-k="to">' : '') +
        '<span style="flex:1"></span><label class="chk" style="align-items:center"><button type="button" class="switch" role="switch" aria-checked="' + cmp + '" data-act="repCmp" aria-label="' + L('So với kỳ trước', 'Compare with previous period') + '"></button>' + L('So với kỳ trước', 'Compare with previous') + '</label></div>' +
        '<div class="filters"><label class="sr" for="f-cat">' + L('Ngành', 'Category') + '</label><select id="f-cat" class="sel" data-in="uiset" data-k="repCat"><option value="">' + L('Tất cả ngành', 'All categories') + '</option>' + D.CATS.map(function (c) { return '<option value="' + c.id + '"' + (f.cat === c.id ? ' selected' : '') + '>' + L(c.vi, c.en) + '</option>'; }).join('') + '</select>' +
        '<label class="sr" for="f-prov">' + L('Nhà cung cấp', 'Provider') + '</label><select id="f-prov" class="sel" data-in="uiset" data-k="repProv"><option value="">' + L('Tất cả nhà cung cấp', 'All providers') + '</option>' + A.S.d.PROVIDERS.filter(function (p) { return p.repShare; }).map(function (p) { return '<option value="' + p.id + '"' + (f.prov === p.id ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select>' +
        ((f.cat || f.prov) ? '<button type="button" class="btn ghost sm" data-act="repClear">' + L('Xoá bộ lọc', 'Clear filters') + '</button>' : '') +
        '<span style="flex:1"></span><span class="muted" style="font-size:12px">' + L('GMV theo ngày thanh toán · Hoa hồng thực thu theo ngày hết bảo hành · Đã chi theo ngày chi', 'GMV by payment date · Realised commission by warranty end · Payouts by payout date') + '</span> <button type="button" class="info-dot" data-tip="' + esc(F.assumeTip()) + '" data-tip-pos="left" aria-label="' + L('Giả định', 'Assumptions') + '">' + ic('info') + '</button></div></div>';
      if (sh === 0) return h + '<div class="card">' + A.empty(L('Không có dữ liệu cho bộ lọc này', 'No data for these filters'), L('Nhà cung cấp đã chọn không hoạt động trong ngành đã chọn. Đổi ngành hoặc xoá bộ lọc.', 'The selected provider does not serve the selected category. Change or clear filters.'), A.btn(L('Xoá bộ lọc', 'Clear filters'), 'repClear')) + '</div>';
      h += F.kpiCards(k, f, cmp);
      h += '<div class="grid2e" style="grid-template-columns:minmax(0,.95fr) minmax(0,1.3fr)"><section class="card" aria-labelledby="br-h"><div class="card-h" style="padding-bottom:10px"><h2 id="br-h">' + L('Cây cầu tiền', 'Money bridge') + '</h2><span class="muted" style="font-size:12px">' + L(r.lbl[0], r.lbl[1]) + '</span></div>' + F.bridge(m) + '</section>' +
        '<section class="card" aria-labelledby="ch-h"><div class="card-h"><h2 id="ch-h">' + L('GMV và hoa hồng thực thu theo ', 'GMV and realised commission by ') + L({ day: 'ngày', week: 'tuần', month: 'tháng' }[r.gran], r.gran) + '</h2><div class="legend"><span><i style="background:var(--series-1)"></i>GMV</span><span><i style="background:var(--series-2)"></i>' + L('Hoa hồng thực thu', 'Realised commission') + '</span></div></div><div class="chart" id="rep-chart" style="margin:14px 18px 16px"></div></section></div>';
      A.mounts.push(function () { var el = document.getElementById('rep-chart'); if (el) F.bars(el, F.series(r, f)); });
      // Bảng chi tiết
      var tab = A.ui('repTab', 'cat');
      h += '<section class="card" aria-labelledby="dt-h"><div class="card-h" style="padding-bottom:0"><h2 id="dt-h">' + L('Chi tiết', 'Breakdown') + '</h2></div><div style="padding:0 20px"><div class="tabs" role="tablist">' +
        '<button type="button" role="tab" aria-selected="' + (tab === 'cat') + '" class="' + (tab === 'cat' ? 'on' : '') + '" data-act="repTab" data-id="cat">' + L('Theo ngành', 'By category') + '</button><button type="button" role="tab" aria-selected="' + (tab === 'prov') + '" class="' + (tab === 'prov' ? 'on' : '') + '" data-act="repTab" data-id="prov">' + L('Theo nhà cung cấp', 'By provider') + '</button></div></div>' + breakdown(k, f, tab) + '</section>';
      return h;
    }
  };
  F.rows = function (k, f, tab) {
    var rows = [];
    if (tab === 'cat') {
      D.CATS.forEach(function (c) { if (f.cat && f.cat !== c.id) return; var s = F.share({ cat: c.id, prov: f.prov }); if (s > 0) rows.push([L(c.vi, c.en), F.metrics(k, { cat: c.id, prov: f.prov }), null]); });
    } else {
      var named = 0;
      A.S.d.PROVIDERS.forEach(function (p) { if (!p.repShare || (f.prov && f.prov !== p.id)) return; var s = F.share({ cat: f.cat, prov: p.id }); if (s > 0) { rows.push([p.name, F.metrics(k, { cat: f.cat, prov: p.id }), p.id]); } named += f.cat ? p.repShare * (p.catSplit[f.cat] || 0) : p.repShare; });
      if (!f.prov) {
        var tot = F.metrics(k, f), sum = {}; ['gmv', 'realized', 'prov', 'paidTo', 'due'].forEach(function (x) { sum[x] = tot[x] - rows.reduce(function (a, r) { return a + r[1][x]; }, 0); });
        rows.push([L('Nhà cung cấp khác (' + D.OTHER_PROVIDERS + ')', 'Other providers (' + D.OTHER_PROVIDERS + ')'), sum, null]);
      }
    }
    return rows;
  };
  function breakdown(k, f, tab) {
    var rows = F.rows(k, f, tab), cols = ['gmv', 'realized', 'prov', 'paidTo', 'due'];
    var tot = {}; cols.forEach(function (c) { tot[c] = rows.reduce(function (a, r) { return a + r[1][c]; }, 0); });
    return '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>' + (tab === 'cat' ? L('Ngành', 'Category') : L('Nhà cung cấp', 'Provider')) + '</th><th class="num">GMV</th><th class="num">' + L('Hoa hồng thực thu', 'Realised commission') + '</th><th class="num">' + L('Hoa hồng tạm tính', 'Provisional commission') + '</th><th class="num">' + L('Đã chi', 'Paid out') + '</th><th class="num">' + L('Còn phải trả', 'Still owed') + '</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + (r[2] ? A.provLink(r[2]) : esc(r[0])) + '</td>' + cols.map(function (c) { return '<td class="num">' + VN.money(r[1][c]) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody><tfoot><tr><td>' + L('Tổng', 'Total') + '</td>' + cols.map(function (c) { return '<td class="num">' + VN.money(tot[c]) + '</td>'; }).join('') + '</tr></tfoot></table></div>';
  }
  A.ACT.repPeriod = function (el) { A.S.ui.repPeriod = el.dataset.id; A.render(); };
  A.ACT.repCmp = function () { A.S.ui.repCmp = !A.S.ui.repCmp; A.render(); };
  A.ACT.repTab = function (el) { A.S.ui.repTab = el.dataset.id; A.render(); };
  A.ACT.repClear = function () { A.S.ui.repCat = ''; A.S.ui.repProv = ''; A.render(); };
  A.IN.custom = function (el, v) { if (!v) return; var c = A.ui('custom', {}); c[el.dataset.k] = v; A.render(); };

  /* ---------- Xuất Excel ---------- */
  A.ACT.exportOpen = function (el) { A.openModal('export', { src: el.dataset.x || 'rep' }); };
  A.M.export = function (m) {
    var k = m.src === 'dash' ? A.ui('dashPeriod', 'month') : A.ui('repPeriod', 'month'), f = m.src === 'dash' ? {} : { cat: A.ui('repCat', ''), prov: A.ui('repProv', '') }, r = F.range(k);
    var flt = [f.cat ? A.catName(f.cat) : L('Tất cả ngành', 'All categories'), f.prov ? A.provName(f.prov) : L('Tất cả nhà cung cấp', 'All providers')].join(' · ');
    var sheets = [[L('Tổng hợp', 'Summary'), L('4 chỉ số của kỳ kèm cột "Từ trước đến nay", cây cầu tiền, ghi chú: kỳ, bộ lọc, người xuất, thời điểm xuất, quy tắc ngày, các giả định', '4 metrics with an all-time column, money bridge, notes: period, filters, exported by, time, date rules, assumptions')],
      [L('Chi tiết đơn', 'Order detail'), L('Mã đơn, ngày thanh toán, ngày hết bảo hành, ngành, nhà cung cấp, giá trị, đã hoàn, hoa hồng, trạng thái hoa hồng, thuế, phần nhà cung cấp, trạng thái tiền', 'Order ID, paid date, warranty end, category, provider, value, refunded, commission, commission status, tax, provider share, money status')],
      [L('Chi trả', 'Payouts'), L('Mã lô, ngày chi, nhà cung cấp, số tiền, kết quả', 'Batch ID, payout date, provider, amount, result')]];
    return '<div class="scrim" data-act="closeModal"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mx-h"><div class="modal-h"><div><h2 id="mx-h">' + L('Xuất Excel', 'Export to Excel') + '</h2><p>' + L('Đúng kỳ và bộ lọc đang chọn. Tổng các cột chi tiết bằng sheet Tổng hợp.', 'Uses the current period and filters. Detail columns sum to the Summary sheet.') + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="modal-b"><div class="kv" style="grid-template-columns:1fr 1fr"><div><span>' + L('Kỳ', 'Period') + '</span><b>' + L(r.lbl[0], r.lbl[1]) + '</b></div><div><span>' + L('Bộ lọc', 'Filters') + '</span><b>' + flt + '</b></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' + sheets.map(function (s, i) { return '<div style="display:flex;gap:12px;padding:12px;border:1px solid var(--border);border-radius:10px">' + ic('file-xls', '') + '<div><b style="font-weight:600">' + (i + 1) + '. ' + s[0] + '</b><div class="muted" style="font-size:12.5px;line-height:1.5">' + s[1] + '</div></div></div>'; }).join('') + '</div>' +
      '<div class="note warn">' + ic('info') + '<span>' + F.assumeTip() + '</span></div></div>' +
      '<div class="modal-f"><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Tạo file', 'Create file'), 'exportGo', { cls: 'primary', x: m.src }) + '</div></div></div>';
  };
  A.ACT.exportGo = function (el) {
    var src = el.dataset.x, k = src === 'dash' ? A.ui('dashPeriod', 'month') : A.ui('repPeriod', 'month'), f = src === 'dash' ? {} : { cat: A.ui('repCat', ''), prov: A.ui('repProv', '') };
    var name = 'VuongNhan_BaoCao_' + k + '_' + '20260924.xls';
    VN.download(name, F.workbook(k, f), 'application/vnd.ms-excel');
    A.log(L('Xuất Excel báo cáo tài chính', 'Exported financial report'), name);
    A.S.modal = null; A.render();
    A.toast(L('Đã tạo file ', 'File created: ') + name);
  };
  /* Workbook: tổng các dòng chi tiết bằng đúng Tổng hợp */
  F.workbook = function (k, f) {
    var r = F.range(k), m = F.metrics(k, f), all = F.metrics('all', f), sh = F.share(f);
    var S1 = [[L('Báo cáo tài chính Vương Nhân', 'Vương Nhân financial report')], [], [L('Chỉ số', 'Metric'), L('Kỳ ', 'Period ') + L(r.lbl[0], r.lbl[1]), L('Từ trước đến nay', 'All time')],
      [L('Hoa hồng thực thu', 'Realised commission'), m.realized, all.realized], [L('Tổng giao dịch (GMV)', 'GMV'), m.gmv, all.gmv], [L('Đã chi cho nhà cung cấp', 'Paid out to providers'), m.paidOut, all.paidOut], [L('Còn phải trả nhà cung cấp', 'Owed to providers'), m.owe, all.owe], [],
      [L('Cây cầu tiền', 'Money bridge')], [L('Khách đã trả', 'Paid by customers'), m.paid], [L('Đã hoàn', 'Refunded'), m.ref], ['GMV', m.gmv], [L('Hoa hồng thực thu', 'Realised commission'), m.realized], [L('Hoa hồng tạm tính', 'Provisional commission'), m.prov], [L('Thuế khấu trừ 2%', 'Tax withheld 2%'), m.tax], [L('Phần nhà cung cấp: đã chi', 'Provider share: paid'), m.paidTo], [L('Phần nhà cung cấp: còn phải trả', 'Provider share: owed'), m.due], [],
      [L('Ghi chú', 'Notes')], [L('Kỳ', 'Period'), L(r.lbl[0], r.lbl[1])], [L('Bộ lọc', 'Filters'), (f.cat ? A.catName(f.cat) : L('Tất cả ngành', 'All categories')) + ' · ' + (f.prov ? A.provName(f.prov) : L('Tất cả nhà cung cấp', 'All providers'))],
      [L('Người xuất', 'Exported by'), A.me() + ' (' + A.roleLabel() + ')'], [L('Thời điểm xuất', 'Exported at'), '24/09/2026 ' + VN.nowTime()],
      [L('Quy tắc ngày', 'Date rules'), L('GMV theo ngày thanh toán; hoa hồng thực thu theo ngày hết bảo hành; đã chi theo ngày chi', 'GMV by payment date; realised commission by warranty end; payouts by payout date')]]
      .concat(F.ASSUME.map(function (a, i) { return [L('Giả định ' + (i + 1) + ' (chờ xác nhận)', 'Assumption ' + (i + 1) + ' (pending)'), L(a[0], a[1])]; }))
      .concat([[L('Số liệu', 'Data'), L('Số minh hoạ cho prototype', 'Illustrative prototype data')]]);
    // Chi tiết đơn: sinh đơn tổng hợp theo ngày, dòng cuối điều chỉnh để tổng khớp
    var S2 = [[L('Mã đơn', 'Order ID'), L('Ngày thanh toán', 'Paid date'), L('Ngày hết bảo hành', 'Warranty end'), L('Ngành', 'Category'), L('Nhà cung cấp', 'Provider'), L('Giá trị', 'Value'), L('Đã hoàn', 'Refunded'), L('Hoa hồng', 'Commission'), L('Trạng thái hoa hồng', 'Commission status'), L('Thuế', 'Tax'), L('Phần nhà cung cấp', 'Provider share'), L('Trạng thái tiền', 'Money status')]];
    var catPool = [], provPool = [];
    D.CATS.forEach(function (c) { if (!f.cat || f.cat === c.id) catPool.push(c); });
    var named = A.S.d.PROVIDERS.filter(function (p) { return p.repShare && (!f.prov || f.prov === p.id) && (!f.cat || p.catSplit[f.cat]); });
    var n = 0, acc = { v: 0, ref: 0, c: 0, t: 0, p: 0 }, seq = 100000;
    var target = { v: m.paid, ref: m.ref, c: m.comm, t: m.tax, p: m.share };
    var rows = [];
    for (var i = r.i0; i <= r.i1; i++) {
      var day = DAYS[i], dv = Math.round((day.gmv + day.ref) * sh / 1000) * 1000, cnt = Math.max(1, Math.round(dv / 465000));
      var base = Math.floor(dv / cnt / 1000) * 1000, todayD = new Date(2026, 8, 24);
      for (var j = 0; j < cnt; j++) {
        var cat = catPool[(i + j) % catPool.length], pv = named.length && (j % 6 === 0) ? named[j % named.length].name : (f.prov ? A.provName(f.prov) : L('Nhà cung cấp khác', 'Other provider'));
        var wd = new Date(2026, day.m - 1, day.d + (cat.warranty || 7));
        rows.push({ id: 'VN-' + (seq++), d: VN.dmy(day.d, day.m), we: VN.dmy(wd.getDate(), wd.getMonth() + 1), cat: L(cat.vi, cat.en), pv: pv, v: j === cnt - 1 ? dv - base * (cnt - 1) : base, done: wd <= todayD });
      }
      n += cnt;
    }
    // phân bổ hoàn tiền, hoa hồng, thuế, phần nhà cung cấp rồi chốt dòng cuối cho khớp
    var totV = rows.reduce(function (a, x) { return a + x.v; }, 0) || 1;
    rows.forEach(function (x, idx) {
      x.ref = Math.round(target.ref * x.v / totV); x.net = x.v - x.ref;
      x.c = Math.round(x.net * 0.15); x.t = Math.round(x.net * 0.02); x.p = x.net - x.c - x.t;
    });
    var last = rows[rows.length - 1];
    if (last) {
      last.v += target.v - totV;
      last.ref += target.ref - rows.reduce(function (a, x) { return a + x.ref; }, 0);
      last.net = last.v - last.ref;
      last.c += target.c - rows.reduce(function (a, x) { return a + x.c; }, 0);
      last.t += target.t - rows.reduce(function (a, x) { return a + x.t; }, 0);
      last.p = last.net - last.c - last.t;
    }
    rows.forEach(function (x) { S2.push([x.id, x.d, x.we, x.cat, x.pv, x.v, x.ref, x.c, x.done ? L('Thực thu', 'Realised') : L('Tạm tính', 'Provisional'), x.t, x.p, x.done ? L('Có thể rút hoặc đã chi', 'Available or paid out') : L('Đang bảo hành', 'In warranty')]); });
    S2.push([L('Tổng', 'Total'), '', '', '', '', target.v, target.ref, target.c, '', target.t, target.p, '']);
    // Chi trả
    var S3 = [[L('Mã lô', 'Batch ID'), L('Ngày chi', 'Payout date'), L('Nhà cung cấp', 'Provider'), L('Số tiền', 'Amount'), L('Kết quả', 'Result')]], outSum = 0;
    for (var q = r.i0; q <= r.i1; q++) {
      var o = Math.round(DAYS[q].out * sh);
      if (!o) continue;
      var parts = 4, base = Math.round(o / parts / 1000) * 1000;
      for (var z = 0; z < parts; z++) { var amt = z === parts - 1 ? o - base * (parts - 1) : base; S3.push(['L-' + VN.pad(DAYS[q].m) + VN.pad(DAYS[q].d), dmyOf(q) + '/2026', z === 0 && named[0] ? named[0].name : L('Nhóm nhà cung cấp ' + (z + 1), 'Provider group ' + (z + 1)), amt, L('Thành công', 'Succeeded')]); outSum += amt; }
    }
    A.S.adj.forEach(function (a) { if (a.out && (!f.prov || a.prov === f.prov) && (!f.cat || a.cat === f.cat) && r.i1 === LAST) { S3.push([a.batch || L('Điều chỉnh', 'Adjustment'), '24/09/2026', A.provName(a.prov), a.out, a.out > 0 ? L('Thành công', 'Succeeded') : L('Điều chỉnh giảm', 'Adjusted down')]); outSum += a.out; } });
    S3.push([L('Tổng', 'Total'), '', '', outSum, '']);
    return VN.xls([{ name: L('Tổng hợp', 'Summary'), rows: S1, head: [2], title: 0 }, { name: L('Chi tiết đơn', 'Order detail'), rows: S2, head: [0] }, { name: L('Chi trả', 'Payouts'), rows: S3, head: [0] }]);
  };
})(window);
