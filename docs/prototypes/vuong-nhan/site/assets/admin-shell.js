/* Trang quản trị · khung, state, phân quyền, điều hướng, thanh Demo, lớp phủ. */
(function (W) {
  'use strict';
  var VN = W.VN, D = W.VNDATA, L = VN.L, ic = VN.ic, esc = VN.esc;
  var A = W.ADMIN = { P: {}, M: {}, ACT: {}, IN: {}, mounts: [], SETUP: {} };

  /* ---------- Vai trò và quyền ---------- */
  A.ROLES = {
    lead: { vi: 'Lãnh đạo', en: 'Executive', name: 'Võ Quốc Bảo', ini: 'QB', email: 'quocbao.vo@vngroup.info' },
    acc: { vi: 'Kế toán', en: 'Accountant', name: 'Lê Minh Anh', ini: 'MA', email: 'minhanh.le@vngroup.info' },
    cs: { vi: 'CSKH & phân xử', en: 'Support & disputes', name: 'Trần Ngọc Hân', ini: 'TH', email: 'ngochan.tran@vngroup.info' },
    sa: { vi: 'Super admin', en: 'Super admin', name: 'Nguyễn Hải', ini: 'NH', email: 'hai.nguyen@vngroup.info' }
  };
  var VIS = {
    dashboard: 'lead acc cs sa', reports: 'lead acc cs sa', requests: 'cs sa', orders: 'lead acc cs sa', disputes: 'cs sa',
    providers: 'acc cs sa', customers: 'cs sa', transactions: 'acc cs sa', payouts: 'acc cs sa', refunds: 'acc cs sa',
    catalog: 'sa', pricing: 'sa', regions: 'sa', moderation: 'cs sa', broadcast: 'cs sa', admins: 'sa', parameters: 'sa', audit: 'sa'
  };
  var CAN = {
    export: 'lead acc sa', payApprove: 'acc sa', payBatch: 'acc sa', adjCreate: 'acc sa', adjApprove: 'acc sa',
    refundCreate: 'acc sa', refundApprove: 'acc sa', hold: 'acc cs sa', dunNote: 'acc cs sa', release: 'acc cs sa',
    orderCancel: 'cs sa', orderStatus: 'sa', orderNote: 'sa', provApprove: 'cs sa', provPause: 'cs sa', provLock: 'cs sa', provUnlock: 'sa',
    bankVerify: 'acc sa', docRemind: 'cs sa', disputeRule: 'cs sa', custLock: 'cs sa', moderate: 'cs sa', broadcast: 'cs sa', config: 'sa', ledgerView: 'acc cs sa', cashRecon: 'acc sa'
  };
  /* Thao tác được phân quyền, nhóm theo trang để hiện trong ma trận. */
  A.ACTS = {
    export: ['reports', 'Xuất Excel', 'Export to Excel'],
    orderCancel: ['orders', 'Huỷ đơn', 'Cancel orders'], orderStatus: ['orders', 'Đổi trạng thái thủ công', 'Change status manually'], orderNote: ['orders', 'Ghi chú nội bộ', 'Internal notes'], dunNote: ['orders', 'Ghi chú đôn đốc thanh toán', 'Payment follow-up notes'],
    disputeRule: ['disputes', 'Phân xử khiếu nại', 'Rule on disputes'],
    provApprove: ['providers', 'Duyệt hồ sơ đăng ký', 'Approve applications'], provPause: ['providers', 'Tạm dừng nhận đơn', 'Pause providers'], provLock: ['providers', 'Khoá tài khoản', 'Lock accounts'], provUnlock: ['providers', 'Mở khoá tài khoản', 'Unlock accounts'], bankVerify: ['providers', 'Xác minh tài khoản ngân hàng', 'Verify bank accounts'], docRemind: ['providers', 'Nhắc bổ sung giấy tờ', 'Send document reminders'],
    custLock: ['customers', 'Khoá tài khoản khách', 'Lock customer accounts'],
    ledgerView: ['transactions', 'Xem sổ cái nhà cung cấp', 'View provider ledgers'], adjCreate: ['transactions', 'Tạo điều chỉnh sổ cái', 'Create ledger adjustments'], adjApprove: ['transactions', 'Duyệt điều chỉnh sổ cái', 'Approve ledger adjustments'], cashRecon: ['transactions', 'Ghi nhận chuyển khoản tiền mặt', 'Record cash transfers'],
    payApprove: ['payouts', 'Duyệt rút tiền', 'Approve payouts'], payBatch: ['payouts', 'Tạo lô chi', 'Create payout batches'],
    refundCreate: ['refunds', 'Tạo hoàn tiền', 'Create refunds'], refundApprove: ['refunds', 'Duyệt hoàn tiền bước 2', 'Approve refunds (step 2)'], hold: ['refunds', 'Tạm giữ tiền', 'Hold funds'], release: ['refunds', 'Giải phóng tạm giữ', 'Release holds'],
    moderate: ['moderation', 'Duyệt, gỡ nội dung', 'Approve or remove content'], broadcast: ['broadcast', 'Gửi thông báo', 'Send messages']
  };
  A.rbInit = function () {
    var base = [
      ['sa', 'Super admin', 'Super admin', ['Toàn quyền hệ thống, cấu hình và phân quyền.', 'Full system access, configuration and permissions.'], true],
      ['acc', 'Kế toán', 'Accountant', ['Đối soát, duyệt rút tiền, hoàn tiền và báo cáo tài chính.', 'Reconciliation, payouts, refunds and finance reports.']],
      ['cs', 'CSKH & phân xử', 'Support & disputes', ['Hỗ trợ khách và nhà cung cấp, phân xử khiếu nại, kiểm duyệt nội dung.', 'Customer and provider support, disputes, moderation.']],
      ['lead', 'Lãnh đạo', 'Executive', ['Xem tổng quan, báo cáo và đơn hàng; xuất Excel.', 'Overview, reports and orders; Excel export.']],
      ['ops', 'Vận hành', 'Operations', ['Theo dõi yêu cầu và đơn hàng, can thiệp khi đơn gặp sự cố.', 'Monitor requests and orders, step in when something goes wrong.']],
      ['cat', 'Danh mục & giá', 'Catalog & pricing', ['Quản lý danh mục dịch vụ, khung giá và khu vực.', 'Manage the service catalog, price ranges and regions.']]
    ];
    var extra = { ops: ['dashboard reports requests orders disputes providers', 'orderCancel orderNote dunNote docRemind'], cat: ['catalog pricing regions', ''] };
    return base.map(function (b) {
      var r = { id: b[0], vi: b[1], en: b[2], desc: b[3], sys: !!b[4], pages: {}, acts: {} }, x = extra[b[0]];
      if (x) { x[0].split(' ').forEach(function (p) { r.pages[p] = true; }); x[1].split(' ').filter(Boolean).forEach(function (a) { r.acts[a] = true; }); }
      else {
        Object.keys(VIS).forEach(function (p) { if (VIS[p].split(' ').indexOf(b[0]) >= 0) r.pages[p] = true; });
        Object.keys(CAN).forEach(function (a) { if (CAN[a].split(' ').indexOf(b[0]) >= 0) r.acts[a] = true; });
      }
      return r;
    });
  };
  A.role = function (id) { id = id || A.myRole(); return A.S.rb.filter(function (r) { return r.id === id; })[0]; };
  A.myRole = function () { var a = A.myAcct ? A.myAcct() : null; return a ? a.role : A.S.role; };
  A.roleLabel = function (id) { var r = A.role(id); return r ? L(r.vi, r.en) : L('Không rõ', 'Unknown'); };
  A.personaRole = function (k) { var a = A.acctOf ? A.acctOf(A.ROLES[k].email) : null; return a ? a.role : k; };
  A.sees = function (page) { if (page === 'profile') return true; var r = A.role(); return !!(r && (r.sys || r.pages[page])); };
  A.can = function (act) { var r = A.role(); return !!(r && (r.sys || r.acts[act])); };
  A.disabled = function () { var a = A.myAcct ? A.myAcct() : null; return !!(a && a.st === 'disabled'); };
  A.denyTip = function (act, kind) {
    if (A.can(act)) return '';
    if (kind === 'approve') return L('Vai trò của bạn không có quyền duyệt', 'Your role cannot approve');
    if (kind === 'intervene') return L('Không có quyền can thiệp', 'No permission to intervene');
    return L('Vai trò của bạn không có quyền thực hiện thao tác này', 'Your role cannot perform this action');
  };
  A.me = function () { var a = A.myAcct ? A.myAcct() : null; return a ? a.name : A.ROLES[A.S.role].name; };
  A.ini = function () { var n = A.me(); if (n === A.ROLES[A.S.role].name) return A.ROLES[A.S.role].ini; var w = n.trim().split(/\s+/); return ((w.length > 1 ? w[w.length - 2][0] : '') + w[w.length - 1][0]).toUpperCase(); };

  /* ---------- Điều hướng ---------- */
  A.NAV = [
    [null, [['dashboard', ['Tổng quan', 'Overview'], 'squares-four'], ['reports', ['Báo cáo', 'Reports'], 'chart-bar']]],
    [['Vận hành', 'Operations'], [['requests', ['Yêu cầu dịch vụ', 'Service requests'], 'clipboard-text'], ['orders', ['Đơn hàng', 'Orders'], 'receipt'], ['disputes', ['Khiếu nại', 'Disputes'], 'scales']]],
    [['Người dùng', 'Users'], [['providers', ['Nhà cung cấp', 'Providers'], 'storefront'], ['customers', ['Khách hàng', 'Customers'], 'users']]],
    [['Tài chính', 'Finance'], [['transactions', ['Giao dịch & đối soát', 'Transactions'], 'wallet'], ['payouts', ['Rút tiền', 'Payouts'], 'hand-coins'], ['refunds', ['Hoàn tiền & tạm giữ', 'Refunds & holds'], 'arrow-counter-clockwise']]],
    [['Dịch vụ & giá', 'Catalog & pricing'], [['catalog', ['Danh mục dịch vụ', 'Service catalog'], 'tree-structure'], ['pricing', ['Giá & hoa hồng', 'Pricing & commission'], 'tag'], ['regions', ['Khu vực', 'Regions'], 'map-trifold']]],
    [['Nội dung', 'Content'], [['moderation', ['Kiểm duyệt', 'Moderation'], 'eye'], ['broadcast', ['Thông báo & banner', 'Messages & banners'], 'megaphone']]],
    [['Hệ thống', 'System'], [['admins', ['Quản trị viên', 'Admins & roles'], 'shield'], ['parameters', ['Tham số vận hành', 'Parameters'], 'sliders-horizontal'], ['audit', ['Nhật ký', 'Audit log'], 'file-text']]]
  ];
  A.navLabel = function (k) { for (var i = 0; i < A.NAV.length; i++) for (var j = 0; j < A.NAV[i][1].length; j++) if (A.NAV[i][1][j][0] === k) return L.apply(null, A.NAV[i][1][j][1]); return k; };
  A.badges = function () {
    var d = A.S.d, b = {};
    b.disputes = d.DISPUTES.filter(function (x) { return x.st === 'open'; }).length;
    b.orders = A.attentionCount();
    b.providers = d.PROVIDERS.filter(function (p) { return p.status === 'pending'; }).length;
    b.payouts = d.PAYOUTS.filter(function (p) { return p.st === 'pending'; }).length;
    return b;
  };
  A.attentionCount = function () {
    return A.S.d.ORDERS.filter(function (o) { return o.status === 'nobody' || o.status === 'overdue'; }).length;
  };

  A.go = function (page, p, noHist) {
    if (!noHist && A.S.page) A.S.hist.push({ page: A.S.page, p: A.S.p });
    if (A.S.hist.length > 30) A.S.hist.shift();
    A.S.page = page; A.S.p = p || {}; A.S.menu = null; A.S.modal = null; A.S.palette = null;
    A.S.scrollReset = true;
    A.load();
    A.render();
  };
  /* Mạng mô phỏng (bảng Demo): Chậm thì mỗi trang hiện khung chờ 0,9 giây; Mất kết nối thì hiện trạng thái lỗi. */
  A.load = function (ms) {
    if (A.S.net !== 'slow' && !ms) return;
    A.S.loading = true; clearTimeout(A._lt);
    A._lt = setTimeout(function () { A.S.loading = false; A.render(); }, ms || 900);
  };
  A.back = function () {
    var h = A.S.hist.pop();
    if (h) { A.S.page = h.page; A.S.p = h.p; A.S.menu = null; A.S.scrollReset = true; A.render(); }
    else A.go('dashboard', {}, true);
  };

  /* ---------- State ---------- */
  A.fresh = function () {
    return {
      lang: VN.lang, role: 'acc', page: 'reports', p: {}, hist: [],
      d: VN.clone({ PROVIDERS: D.PROVIDERS, ORDERS: D.ORDERS, TXNS: D.TXNS, PAYOUTS: D.PAYOUTS, REFUNDS: D.REFUNDS, ADJUSTS: D.ADJUSTS, DISPUTES: D.DISPUTES, REQUESTS: D.REQUESTS, CUSTOMERS: D.CUSTOMERS, RECON: D.RECON, DUN_NOTES: D.DUN_NOTES, CASH: D.CASH }),
      adj: [], // biến động tiền trong ngày hôm nay: {kind, amt, prov, cat}
      ui: {}, modal: null, menu: null, demo: false, palette: null, audit: [], notes: {}, rb: A.rbInit()
    };
  };
  A.S = A.fresh();
  A.ui = function (k, def) { if (A.S.ui[k] === undefined) A.S.ui[k] = def; return A.S.ui[k]; };
  A.log = function (what, target) { A.S.audit.unshift([VN.nowTime(), A.me(), A.myRole(), what, target]); };

  /* ---------- Tiện ích dựng HTML ---------- */
  A.btn = function (label, act, o) {
    o = o || {};
    var dis = o.dis;
    return '<button type="button" class="btn ' + (o.cls || '') + '" data-act="' + act + '"' + (o.id != null ? ' data-id="' + esc(o.id) + '"' : '') +
      (o.x ? ' data-x="' + esc(o.x) + '"' : '') + (dis ? ' aria-disabled="true" data-tip="' + esc(dis) + '"' + (o.tipPos ? ' data-tip-pos="' + o.tipPos + '"' : '') : '') + '>' +
      (o.icon ? ic(o.icon) : '') + label + (o.caret ? ic('caret-down') : '') + '</button>';
  };
  A.badge = function (def, cls) { return '<span class="badge ' + (cls || '') + ' t-' + def[2] + '">' + L(def[0], def[1]) + '</span>'; };
  A.prov = function (id) { return A.S.d.PROVIDERS.filter(function (p) { return p.id === id; })[0]; };
  A.provName = function (x) { if (!x) return L('Không có', 'None'); var p = A.prov(x); return p ? p.name : x; };
  A.order = function (id) { return A.S.d.ORDERS.filter(function (o) { return o.id === id; })[0]; };
  A.cat = function (id) { return D.CATS.filter(function (c) { return c.id === id; })[0]; };
  A.catName = function (id) { var c = A.cat(id); return c ? L(c.vi, c.en) : ''; };
  A.ordLink = function (id, page) { return '<button type="button" class="link mono" data-act="goOrder" data-id="' + id + '"' + (page ? ' data-x="' + page + '"' : '') + '>' + id + '</button>'; };
  A.provLink = function (id, target) {
    var p = A.prov(id); if (!p) return esc(id || L('Không có', 'None'));
    var t = target || 'ledger';
    if ((t === 'ledger' && !A.can('ledgerView')) || (t === 'provider' && !A.sees('providers'))) return esc(p.name);
    return '<button type="button" class="link" data-act="goProv" data-id="' + id + '" data-x="' + t + '">' + esc(p.name) + '</button>';
  };
  A.empty = function (title, text, action, icon) {
    return '<div class="empty">' + ic(icon || 'magnifying-glass') + '<b>' + title + '</b><p>' + text + '</p>' + (action || '') + '</div>';
  };
  A.moneyTip = function (n) { return '<span class="kpi-v" data-tip="' + esc(VN.money(n)) + '" tabindex="0">' + VN.moneyShort(n) + '</span>'; };
  A.sortable = function (key, label, cls) {
    var s = A.ui('sort-' + A.S.page, {}), on = s.k === key;
    return '<th class="' + (cls || '') + '" aria-sort="' + (on ? (s.dir > 0 ? 'ascending' : 'descending') : 'none') + '"><button data-act="sort" data-id="' + key + '">' + label + (on ? ic(s.dir > 0 ? 'caret-up' : 'caret-down') : ic('caret-down', 'subtle')) + '</button></th>';
  };
  A.applySort = function (rows, getters) {
    var s = A.ui('sort-' + A.S.page, {});
    if (!s.k || !getters[s.k]) return rows;
    var g = getters[s.k];
    return rows.slice().sort(function (a, b) { var x = g(a), y = g(b); return (x > y ? 1 : x < y ? -1 : 0) * s.dir; });
  };
  A.foot = function (shown, total, unit) {
    return '<div class="tbl-foot"><span>' + L('Hiển thị ' + (shown ? '1-' + shown : '0') + ' trên ' + VN.num(total) + ' ' + unit[0], 'Showing ' + (shown ? '1-' + shown : '0') + ' of ' + VN.num(total) + ' ' + unit[1]) + '</span>' +
      '<div class="pager"><span class="on">1</span><span>2</span><span>3</span><span>…</span><span>' + Math.max(4, Math.ceil(total / (shown || 10))) + '</span></div></div>';
  };
  A.reasonField = function (list, key) {
    var m = A.S.modal;
    return '<div class="field"><label for="f-reason">' + L('Lý do', 'Reason') + ' <span class="req">*</span></label>' +
      '<select id="f-reason" class="sel" data-in="mset" data-k="reason"><option value="">' + L('Chọn lý do', 'Select a reason') + '</option>' +
      list.map(function (r, i) { return '<option value="' + i + '"' + (String(m.reason) === String(i) ? ' selected' : '') + '>' + L(r[0], r[1]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-note">' + L('Ghi chú', 'Note') + (key === 'noteReq' ? ' <span class="req">*</span>' : '') + '</label><textarea id="f-note" class="txa" maxlength="300" data-in="mset" data-k="note" placeholder="' + L('Thông tin thêm cho người duyệt và nhật ký', 'Extra context for the approver and audit log') + '">' + esc(m.note || '') + '</textarea><span class="hint" style="text-align:right">' + (m.note || '').length + '/300</span></div>';
  };
  A.impact = function (title, rows) {
    return '<div class="impact"><div class="impact-h"><span>' + title + '</span><span>' + L('Trước → Sau', 'Before → After') + '</span></div><table>' +
      rows.map(function (r) {
        var d = r[2] - r[1];
        return '<tr><td>' + r[0] + '</td><td class="num">' + VN.money(r[1]) + '</td><td class="arrow">→</td><td class="num chg ' + (d > 0 ? 'up' : d < 0 ? 'dn' : '') + '">' + VN.money(r[2]) + '</td></tr>';
      }).join('') + '</table></div>';
  };

  /* ---------- Khung ---------- */
  function sidebar() {
    var b = A.badges(), cur = (A.P[A.S.page] && A.P[A.S.page].nav) || A.S.page;
    var h = '<aside class="side"><div class="side-logo"><span class="lg"><img src="assets/vngroup-logo.png" alt="VN Group"></span><span class="tag">ADMIN</span></div><nav aria-label="' + L('Menu quản trị', 'Admin menu') + '">';
    var total = 0; A.NAV.forEach(function (g) { g[1].forEach(function (it) { if (!A.disabled() && A.sees(it[0])) total++; }); });
    A.NAV.forEach(function (g, gi) {
      var items = A.disabled() ? [] : g[1].filter(function (it) { return A.sees(it[0]); });
      if (!items.length) return;
      var k = 'nav-' + gi, st = A.S.ui[k], hasCur = items.some(function (it) { return it[0] === cur; });
      var shut = !!g[0] && !hasCur && (st ? st === 'shut' : total > 12);
      if (g[0]) {
        var sum = 0, red = false; items.forEach(function (it) { if (b[it[0]]) { sum += b[it[0]]; if (it[0] === 'disputes' || it[0] === 'orders') red = true; } });
        h += '<div class="nav-g"><button type="button" class="nav-gh" data-act="navGroup" data-id="' + k + '" aria-expanded="' + !shut + '"' + (hasCur ? ' aria-disabled="true" data-tip="' + L('Nhóm đang mở vì chứa màn hiện tại', 'Open because it holds the current screen') + '" data-tip-pos="right"' : '') + '><span>' + L(g[0][0], g[0][1]) + '</span>' + (shut && sum ? '<span class="cnt' + (red ? ' red' : '') + '">' + sum + '</span>' : '') + ic(shut ? 'caret-right' : 'caret-down') + '</button>';
      } else h += '<div class="nav-g">';
      if (shut) { h += '</div>'; return; }
      items.forEach(function (it) {
        var n = b[it[0]];
        h += '<button type="button" class="nav-i' + (cur === it[0] ? ' on' : '') + '" data-act="nav" data-id="' + it[0] + '"' + (cur === it[0] ? ' aria-current="page"' : '') + '>' + ic(it[2]) + '<span>' + L(it[1][0], it[1][1]) + '</span>' +
          (n ? '<span class="cnt' + (it[0] === 'disputes' || it[0] === 'orders' ? ' red' : '') + '">' + n + '</span>' : '') + '</button>';
      });
      h += '</div>';
    });
    return h + '</nav><div class="side-foot"><button type="button" class="demo-fab" data-act="demo" aria-expanded="' + !!A.S.demo + '" aria-label="' + L('Mở bảng Demo', 'Open demo panel') + '">' + ic('sliders-horizontal') + '<span>Demo<small>' + L('Vai trò, kịch bản', 'Roles, scenarios') + '</small></span></button></div></aside>';
  }
  function topbar() {
    return '<header class="topbar"><button type="button" class="gsearch" data-act="palette">' + ic('magnifying-glass') + '<span>' + L('Tìm đơn, khách hàng, nhà cung cấp…', 'Search orders, customers, providers…') + '</span><span class="kbd">Ctrl K</span></button>' +
      '<div class="tb-r"><div style="position:relative"><button type="button" class="chipbox" data-act="menu" data-id="region"><span class="lbl2">' + L('Khu vực', 'Region') + '</span><b style="font-weight:500">' + L('TP. Hồ Chí Minh', 'Ho Chi Minh City') + '</b>' + ic('caret-down') + '</button>' +
      (A.S.menu === 'region' ? '<div class="menu" style="right:0;top:42px"><button data-act="closeMenu">' + L('TP. Hồ Chí Minh', 'Ho Chi Minh City') + '<small>' + L('Đang vận hành · VND · GMT+7', 'Live · VND · GMT+7') + '</small></button><button aria-disabled="true">' + L('Hà Nội', 'Hanoi') + '<small>' + L('Chưa mở. Bật tại Khu vực', 'Not launched. Enable in Regions') + '</small></button><button aria-disabled="true">' + L('Đà Nẵng', 'Da Nang') + '<small>' + L('Chưa mở', 'Not launched') + '</small></button></div>' : '') + '</div>' +
      '<div class="seg" role="group" aria-label="' + L('Ngôn ngữ', 'Language') + '"><button type="button" class="' + (VN.lang ? '' : 'on') + '" data-act="lang" data-id="0" aria-pressed="' + !VN.lang + '">VI</button><button type="button" class="' + (VN.lang ? 'on' : '') + '" data-act="lang" data-id="1" aria-pressed="' + !!VN.lang + '">EN</button></div>' +
      '<div style="position:relative"><button type="button" class="iconbtn" data-act="menu" data-id="bell" aria-label="' + L('Thông báo', 'Notifications') + '">' + ic('bell') + '<span class="dot"></span></button>' +
      (A.S.menu === 'bell' ? bellMenu() : '') + '</div>' +
      '<div style="position:relative"><button type="button" class="me" data-act="menu" data-id="me" aria-haspopup="menu" aria-expanded="' + (A.S.menu === 'me') + '"><span class="av">' + A.ini() + '</span><span class="me-t"><b>' + esc(A.me()) + '</b><span>' + A.roleLabel() + '</span></span>' + ic('caret-down', 'subtle') + '</button>' +
      (A.S.menu === 'me' ? '<div class="menu" role="menu" style="right:0;top:48px;width:240px"><button type="button" role="menuitem" data-act="nav" data-id="profile">' + ic('user-circle') + L('Hồ sơ của tôi', 'My profile') + '</button><button type="button" role="menuitem" data-act="nav" data-id="profile" data-x="security">' + ic('lock-simple') + L('Bảo mật và đăng nhập', 'Security and sign-in') + '</button><button type="button" role="menuitem" aria-disabled="true" data-tip="' + L('Prototype không có màn đăng nhập', 'The prototype has no sign-in screen') + '" data-tip-pos="left">' + ic('sign-out') + L('Đăng xuất', 'Sign out') + '</button></div>' : '') + '</div></div></header>';
  }
  function bellMenu() {
    var b = A.badges(), items = [];
    if (A.sees('payouts')) items.push(['payouts', L(b.payouts + ' yêu cầu rút tiền đang chờ duyệt', b.payouts + ' payout requests awaiting approval'), '08:12']);
    if (A.sees('disputes')) items.push(['disputes', L('Khiếu nại mới KN-1042 cho đơn VN-240921', 'New dispute KN-1042 on VN-240921'), '23/09']);
    if (A.sees('providers')) items.push(['providers', L('Sạch Xanh Home vừa đổi tài khoản ngân hàng', 'Sạch Xanh Home changed bank account'), '22/09']);
    items.push(['orders', L(A.attentionCount() + ' đơn cần chú ý', A.attentionCount() + ' orders need attention'), '10:30']);
    return '<div class="menu" style="right:0;top:42px;width:340px">' + items.map(function (i) { return '<button data-act="nav" data-id="' + i[0] + '">' + i[1] + '<small>' + i[2] + '</small></button>'; }).join('') + '</div>';
  }
  function crumb() {
    var pg = A.P[A.S.page], parts = pg && pg.crumb ? pg.crumb() : null;
    if (!parts || !parts.length) return '';
    var h = '<div class="crumb">' + (A.S.hist.length ? '<button type="button" data-act="back" aria-label="' + L('Quay lại', 'Back') + '">' + ic('arrow-left') + '</button><span class="sep">·</span>' : '');
    parts.forEach(function (p, i) {
      if (i) h += '<span class="sep">/</span>';
      h += p[1] ? '<button type="button" data-act="nav" data-id="' + p[1] + '"' + (p[2] ? ' data-x="' + p[2] + '"' : '') + '>' + p[0] + '</button>' : '<span>' + p[0] + '</span>';
    });
    return h + '</div>';
  }
  function page() {
    var pg = A.P[A.S.page];
    var navKey = (pg && pg.nav) || A.S.page;
    if (A.disabled()) return '<div class="content"><div class="card oos">' + A.empty(L('Tài khoản đã bị vô hiệu hoá', 'Your account is disabled'), L('Bạn không thể xem hay thao tác gì trên Trang quản trị. Liên hệ Super admin nếu đây là nhầm lẫn.', 'You cannot view or change anything in the admin portal. Contact a Super admin if this is a mistake.'), '', 'lock-simple') + '</div></div>';
    if (!A.sees(navKey)) return '<div class="content">' + crumb() + '<div class="card oos">' + A.empty(L('Bạn không có quyền xem màn này', 'You do not have access to this screen'), L('Vai trò ' + A.roleLabel() + ' không được cấp quyền. Liên hệ Super admin nếu cần.', 'The ' + A.roleLabel() + ' role has no access. Contact a Super admin if needed.'), A.btn(L('Về Tổng quan', 'Go to Overview'), 'nav', { id: 'dashboard' })) + '</div></div>';
    if (!pg) return '<div class="content"><div class="card oos">' + A.empty(L('Ngoài phạm vi prototype này', 'Outside this prototype'), '') + '</div></div>';
    if (A.S.net === 'off') return '<div class="content">' + crumb() + '<div class="card oos">' + A.empty(L('Không tải được dữ liệu', 'Could not load data'), L('Mất kết nối tới máy chủ. Thao tác chưa lưu vẫn được giữ; thử lại khi có mạng.', 'Lost connection to the server. Unsaved work is kept; retry once you are back online.'), A.btn(L('Thử lại', 'Retry'), 'netRetry', { icon: 'arrows-clockwise' }), 'warning-circle') + '</div></div>';
    if (A.S.loading) return '<div class="content" aria-busy="true">' + crumb() + skel() + '</div>';
    return '<div class="content" data-scroll="c-' + A.S.page + '-' + (A.S.p.id || '') + '">' + crumb() + pg.render() + '</div>';
  }
  function skel() {
    var h = '<div class="sk-page" role="status"><span class="sr-only">' + L('Đang tải dữ liệu', 'Loading data') + '</span><div class="sk-h"><i class="sk" style="width:240px;height:26px"></i><i class="sk" style="width:340px"></i></div><div class="sk-kpis">';
    for (var i = 0; i < 4; i++) h += '<div class="card sk-card"><i class="sk" style="width:50%"></i><i class="sk" style="width:68%;height:24px"></i><i class="sk" style="width:82%"></i></div>';
    h += '</div><div class="card sk-tbl">';
    for (var j = 0; j < 7; j++) h += '<div class="sk-r"><i class="sk" style="width:11%"></i><i class="sk" style="width:24%"></i><i class="sk" style="width:17%"></i><i class="sk" style="width:12%;margin-left:auto"></i></div>';
    return h + '</div></div>';
  }
  function overlays() {
    var h = '';
    if (A.S.modal && A.M[A.S.modal.kind]) h += A.M[A.S.modal.kind](A.S.modal);
    if (A.S.palette) h += palette();
    if (A.S.demo) h += demoPanel();
    return h;
  }

  /* Màn hẹp hơn 1024 px: nói rõ trang quản trị dành cho máy tính, cho phép xem tiếp. */
  function narrow() {
    var q = VN.lang ? '?lang=en' : '';
    return '<div class="nar"><img src="assets/vngroup-logo.png" alt="VN Group" class="nar-lg">' +
      '<div class="seg" role="group" aria-label="' + L('Ngôn ngữ', 'Language') + '"><button type="button" class="' + (VN.lang ? '' : 'on') + '" data-act="lang" data-id="0" aria-pressed="' + !VN.lang + '">VI</button><button type="button" class="' + (VN.lang ? 'on' : '') + '" data-act="lang" data-id="1" aria-pressed="' + !!VN.lang + '">EN</button></div>' +
      '<span class="nar-ic">' + ic('squares-four') + '</span><h1>' + L('Trang quản trị dùng trên máy tính', 'The admin portal is built for desktop') + '</h1>' +
      '<p>' + L('Màn này thiết kế cho khổ 1440 × 900 và chạy tốt từ 1280 px, vì bảng số liệu, hàng chờ duyệt và thanh quyết định cần đủ chỗ. Màn hình hiện tại hẹp hơn 1024 px.', 'This portal is designed for 1440 × 900 and works from 1280 px, because data tables, approval queues and decision bars need the room. Your screen is narrower than 1024 px.') + '</p>' +
      '<button type="button" class="btn primary lg" data-act="wide">' + L('Vẫn xem, cuộn ngang', 'View anyway, scroll sideways') + '</button>' +
      '<div class="nar-links"><span>' + L('Hai app di động xem vừa màn này:', 'The two mobile apps fit this screen:') + '</span><a href="customer.html' + q + '">' + L('App Khách hàng', 'Customer app') + '</a><a href="provider.html' + q + '">' + L('App Nhà cung cấp', 'Provider app') + '</a><a href="index.html' + q + '">' + L('Trang giới thiệu', 'Overview page') + '</a></div></div>';
  }

  /* ---------- Tìm nhanh ---------- */
  function palette() {
    var q = (A.S.palette.q || '').toLowerCase().trim(), res = [];
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); };
    var nq = norm(q);
    if (nq) {
      A.S.d.ORDERS.forEach(function (o) { if (norm(o.id + ' ' + o.cust + ' ' + o.phone).indexOf(nq) >= 0) res.push(['order', o.id, o.id + ' · ' + o.cust, L(o.svc[0], o.svc[1])]); });
      if (A.sees('providers')) A.S.d.PROVIDERS.forEach(function (p) { if (norm(p.name + ' ' + p.phone).indexOf(nq) >= 0) res.push(['provider', p.id, p.name, L('Nhà cung cấp', 'Provider')]); });
      A.NAV.forEach(function (g) { g[1].forEach(function (it) { if (A.sees(it[0]) && norm(it[1][0] + ' ' + it[1][1]).indexOf(nq) >= 0) res.push(['page', it[0], L(it[1][0], it[1][1]), L('Mở màn', 'Open screen')]); }); });
      if (A.sees('transactions') && norm('tien mat cho doi soat cash awaiting reconciliation').indexOf(nq) >= 0) res.push(['page', 'transactions', L('Tiền mặt chờ đối soát', 'Cash awaiting reconciliation'), L('Giao dịch & đối soát · Đối soát', 'Transactions · Reconciliation'), { tab: 'recon', rs: 'cash' }]);
    }
    res = res.slice(0, 8);
    A.S.palette.res = res;
    return '<div class="scrim" data-act="closePalette"></div><div class="palette" role="dialog" aria-modal="true" aria-label="' + L('Tìm nhanh', 'Quick search') + '"><div class="search-box">' + ic('magnifying-glass') +
      '<input id="pal-q" class="inp" autocomplete="off" data-in="palq" value="' + esc(A.S.palette.q || '') + '" placeholder="' + L('Gõ mã đơn, tên khách, tên nhà cung cấp, tên màn…', 'Type an order ID, customer, provider or screen…') + '" aria-label="' + L('Từ khoá', 'Keyword') + '"></div>' +
      '<div class="res">' + (nq ? (res.length ? res.map(function (r, i) { return '<button type="button" class="' + (i === (A.S.palette.hl || 0) ? 'hl' : '') + '" data-act="palGo" data-id="' + i + '">' + ic(r[0] === 'order' ? 'receipt' : r[0] === 'provider' ? 'storefront' : 'arrow-right') + '<span>' + esc(r[2]) + '</span><small>' + esc(r[3]) + '</small></button>'; }).join('') : A.empty(L('Không tìm thấy', 'No results'), L('Thử mã đơn như VN-240918 hoặc tên như Phúc An.', 'Try an order ID like VN-240918 or a name like Phúc An.'))) :
        '<div class="empty" style="padding:22px"><p>' + L('Gợi ý: VN-240918 · Phúc An · Rút tiền · tìm không dấu vẫn ra', 'Try: VN-240918 · Phúc An · Payouts · accent-insensitive') + '</p></div>') + '</div></div>';
  }

  /* ---------- Thanh Demo ---------- */
  A.SCENARIOS = [
    ['Tài chính', 'Finance'],
    [1, ['Rút tiền và lô chi', 'Payouts and payout batch'], ['Kế toán duyệt Phúc An, Sạch Xanh → tạo lô chi → Sạch Xanh thất bại', 'Accountant approves → batch → Sạch Xanh fails'], 'acc', 'payouts', {}],
    [2, ['Hoàn tiền bị chặn', 'Refund blocked'], ['VN-240902 đã chi cho nhà cung cấp 14/09', 'VN-240902 already paid out on 14/09'], 'acc', 'ordermoney', { id: 'VN-240902' }],
    [3, ['Hoàn tiền cần duyệt hai bước', 'Two-step refund'], ['Hoàn 900.000 ₫ cho VN-240921 → đổi Super admin duyệt', 'Refund 900,000 ₫ on VN-240921 → approve as Super admin'], 'acc', 'refunds', { tab: 'hold' }],
    [4, ['Điều chỉnh sổ cái từ đối soát', 'Ledger adjustment from reconciliation'], ['Dòng lệch 80.000 ₫ → tạo điều chỉnh → duyệt', 'Mismatch 80,000 ₫ → create adjustment → approve'], 'acc', 'transactions', { tab: 'recon', rs: 'gateway' }],
    [5, ['Phân quyền và đôn đốc', 'Permissions and follow-up'], ['CSKH: đổi trạng thái đôn đốc, thêm ghi chú', 'Support: update follow-up status, add note'], 'cs', 'transactions', { tab: 'unpaid' }],
    [6, ['Lãnh đạo xem báo cáo', 'Executive reviews reports'], ['Đổi kỳ, so với kỳ trước, lọc ngành, xuất Excel', 'Change period, compare, filter, export'], 'lead', 'reports', {}],
    ['Đơn hàng', 'Orders'],
    [7, ['Huỷ đơn đang thực hiện', 'Cancel an order in progress'], ['CSKH huỷ VN-240931 kèm lý do', 'Support cancels VN-240931 with a reason'], 'cs', 'order', { id: 'VN-240931' }],
    [8, ['Đổi trạng thái thủ công', 'Manual status change'], ['Super admin, mốc có tia sét trên timeline', 'Super admin, marked with a bolt on the timeline'], 'sa', 'order', { id: 'VN-240931' }],
    [9, ['Đơn cần chú ý', 'Orders needing attention'], ['Đóng yêu cầu không ai nhận, đóng đơn quá hạn', 'Close unaccepted request, close overdue order'], 'cs', 'orders', { tab: 'attention' }],
    ['Nhà cung cấp', 'Providers'],
    [10, ['Tạm dừng theo ngành', 'Pause by category'], ['Phúc An → tạm dừng Điện lạnh → mở lại', 'Phúc An → pause Air conditioning → resume'], 'cs', 'provider', { id: 'phucan' }],
    [11, ['Khoá tài khoản 2 bước', 'Two-step account lock'], ['Nhập lý do → xác nhận → nút bị khoá', 'Reason → confirm → actions locked'], 'cs', 'provider', { id: 'hoabinh' }],
    [12, ['Duyệt hồ sơ', 'Approve profiles'], ['Duyệt Gia Khang, yêu cầu Nhà Sạch Pro bổ sung', 'Approve Gia Khang, ask Nhà Sạch Pro for documents'], 'cs', 'providers', { tab: 'queue' }],
    [13, ['Giấy tờ và xác minh ngân hàng', 'Documents and bank checks'], ['Tạm dừng ngay chứng chỉ hết hạn, xác minh tài khoản', 'Pause on expired document, verify account'], 'sa', 'providers', { tab: 'docs' }],
    ['Hệ thống', 'System'],
    [14, ['Vai trò và quyền', 'Roles and permissions'], ['Bỏ quyền Hoàn tiền của Kế toán → đổi sang vai Kế toán, menu mất mục đó', 'Remove Refunds from Accountant → switch to Accountant, the menu item is gone'], 'sa', 'admins', { tab: 'roles' }],
    [15, ['Danh mục dịch vụ', 'Service catalog'], ['Thêm dịch vụ; xoá mục đang dùng bị chặn, đề nghị tắt', 'Add a service; deleting an item in use is blocked, disable instead'], 'sa', 'catalog', {}],
    [16, ['Hồ sơ và bảo mật', 'Profile and security'], ['Sửa hồ sơ, đổi mật khẩu, đăng xuất phiên khác', 'Edit profile, change password, sign out other sessions'], 'acc', 'profile', {}],
    ['Thanh toán tiền mặt', 'Cash payments'],
    [17, ['Đối soát tiền mặt', 'Cash reconciliation'], ['VN-240931 thu tiền mặt → ghi nhận chuyển khoản 76.500 ₫', 'VN-240931 paid in cash → record the 76,500 ₫ transfer'], 'acc', 'transactions', { tab: 'recon', rs: 'cash' }, 'cash31'],
  ];
  function demoPanel() {
    var h = '<div class="demo-panel" role="dialog" aria-label="Demo"><div><h3>' + L('Xem với vai trò', 'View as') + '</h3><div class="roles" style="margin-top:8px">';
    Object.keys(A.ROLES).forEach(function (k) { var r = A.ROLES[k], a = A.acctOf ? A.acctOf(r.email) : null; h += '<button type="button" class="' + (A.S.role === k ? 'on' : '') + '" data-act="role" data-id="' + k + '">' + A.roleLabel(A.personaRole(k)) + '<small>' + esc(a ? a.name : r.name) + (a && a.st === 'disabled' ? ' · ' + L('đã vô hiệu hoá', 'disabled') : '') + '</small></button>'; });
    h += '</div></div><div><h3>' + L('Mạng (mô phỏng)', 'Network (simulated)') + '</h3><div class="seg" role="group" aria-label="' + L('Mạng', 'Network') + '" style="margin-top:8px">' + [['ok', 'Bình thường', 'Normal'], ['slow', 'Chậm', 'Slow'], ['off', 'Mất kết nối', 'Offline']].map(function (n) { var on = (A.S.net || 'ok') === n[0]; return '<button type="button" class="' + (on ? 'on' : '') + '" data-act="net" data-id="' + n[0] + '" aria-pressed="' + on + '">' + L(n[1], n[2]) + '</button>'; }).join('') + '</div><p class="subtle" style="margin:6px 0 0;font-size:12px;line-height:1.45">' + L('Chậm: mỗi trang hiện khung chờ 0,9 giây. Mất kết nối: xem trạng thái lỗi và nút Thử lại.', 'Slow: each page shows a 0.9 s skeleton. Offline: see the error state and Retry.') + '</p></div><div><h3>' + L('Kịch bản', 'Scenarios') + '</h3><div class="scn" style="margin-top:6px">';
    A.SCENARIOS.forEach(function (s) {
      if (!s[1] || typeof s[0] !== 'number') { h += '<div class="scn-g">' + L(s[0], s[1]) + '</div>'; return; }
      h += '<button type="button" data-act="scenario" data-id="' + s[0] + '"><b>' + VN.pad(s[0]) + '</b><span>' + L(s[1][0], s[1][1]) + '<small>' + L(s[2][0], s[2][1]) + ' · ' + A.roleLabel(A.personaRole(s[3])) + '</small></span></button>';
    });
    return h + '</div></div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><button type="button" class="btn sm danger" data-act="reset">' + ic('arrows-clockwise') + L('Đặt lại dữ liệu', 'Reset data') + '</button><span class="subtle" style="font-size:11.5px">' + L('Không thuộc sản phẩm · số minh hoạ', 'Not part of the product · illustrative data') + '</span></div></div>';
  }

  /* ---------- Render ---------- */
  A.render = function () {
    var app = document.getElementById('app'), ov = document.getElementById('ov');
    var hadModal = !!document.querySelector('#ov .modal, #ov .drawer, #ov .palette');
    A.mounts = [];
    document.documentElement.lang = VN.lang ? 'en' : 'vi';
    VN.patch(app, sidebar() + '<div class="main">' + topbar() + page() + '</div>');
    VN.patch(ov, overlays());
    var nar = document.getElementById('narrow'); if (nar) VN.patch(nar, narrow());
    if (A.S.scrollReset) { var c = app.querySelector('.content'); if (c) c.scrollTop = 0; A.S.scrollReset = false; }
    A.mounts.forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
    var layer = document.querySelector('#ov .modal, #ov .drawer, #ov .palette');
    if (layer && !hadModal) VN.focusFirst(layer);
    if (!layer && hadModal) VN.refocus(app);
  };
  A.toast = function (m, k) { VN.toast(m, k); };
  A.closeModal = function () { A.S.modal = null; A.render(); };
  A.openModal = function (kind, o) { A.S.modal = Object.assign({}, o || {}, { kind: kind }); A.S.menu = null; A.render(); };

  /* ---------- Hành động chung ---------- */
  var ACT = A.ACT;
  ACT.nav = function (el) { A.S.demo = false; var id = el.dataset.id, x = el.dataset.x; A.go(id, x ? { tab: x } : {}); };
  ACT.back = function () { A.back(); };
  ACT.lang = function (el) { VN.lang = +el.dataset.id; A.render(); };
  ACT.menu = function (el) { var id = el.dataset.id; A.S.menu = A.S.menu === id ? null : id; A.render(); };
  ACT.closeMenu = function () { A.S.menu = null; A.render(); };
  ACT.net = function (el) { A.S.net = el.dataset.id; A.S.loading = false; A.load(); A.render(); };
  ACT.netRetry = function () { A.S.net = 'ok'; A.load(700); A.render(); setTimeout(function () { A.toast(L('Đã kết nối lại', 'Back online')); }, 720); };
  ACT.wide = function () { document.body.classList.add('wide'); A.render(); };
  ACT.navGroup = function (el) { var k = el.dataset.id; A.S.ui[k] = el.getAttribute('aria-expanded') === 'true' ? 'shut' : 'open'; A.render(); };
  ACT.demo = function () { A.S.demo = !A.S.demo; A.render(); };
  ACT.role = function (el) {
    A.S.role = el.dataset.id; A.S.modal = null;
    A.toast(L('Đang xem với vai trò ', 'Viewing as ') + A.roleLabel() + ' · ' + A.me());
    A.render();
  };
  ACT.reset = function () { var lang = VN.lang; A.S = A.fresh(); VN.lang = lang; A.render(); A.toast(L('Đã đặt lại dữ liệu mẫu', 'Sample data reset')); };
  ACT.scenario = function (el) {
    var s = A.SCENARIOS.filter(function (x) { return x[0] === +el.dataset.id; })[0];
    A.S.role = s[3]; A.S.demo = false; A.S.hist = [];
    Object.keys(A.S.ui).forEach(function (k) { if (k.indexOf('sel-') === 0) delete A.S.ui[k]; });
    if (s[6] && A.SETUP[s[6]]) A.SETUP[s[6]]();
    A.go(s[4], VN.clone(s[5]), true);
    A.toast(L('Kịch bản ', 'Scenario ') + s[0] + ': ' + L(s[1][0], s[1][1]) + ' · ' + A.roleLabel());
  };
  ACT.palette = function () { A.S.palette = { q: '', hl: 0 }; A.render(); };
  ACT.closePalette = function () { A.S.palette = null; A.render(); };
  ACT.palGo = function (el) {
    var r = A.S.palette.res[+el.dataset.id]; A.S.palette = null;
    if (r[0] === 'order') A.goOrder(r[1]); else if (r[0] === 'provider') A.go('provider', { id: r[1] }); else A.go(r[1], r[4] ? VN.clone(r[4]) : undefined);
  };
  A.IN.palq = function (el, v) { A.S.palette.q = v; A.S.palette.hl = 0; A.render(); };
  ACT.closeModal = function () { A.closeModal(); };
  ACT.sort = function (el) {
    var s = A.ui('sort-' + A.S.page, {});
    if (s.k === el.dataset.id) s.dir = -s.dir; else { s.k = el.dataset.id; s.dir = -1; }
    A.render();
  };
  ACT.tab = function (el) { A.S.p = Object.assign({}, A.S.p, { tab: el.dataset.id }); A.S.scrollReset = true; A.render(); };
  ACT.subtab = function (el) { A.S.p = Object.assign({}, A.S.p, { sub: el.dataset.id }); A.render(); };
  ACT.goOrder = function (el) { A.goOrder(el.dataset.id, el.dataset.x); };
  A.goOrder = function (id, pg) {
    var o = A.order(id);
    if (pg === 'money' || (!A.sees('orders') && A.sees('transactions'))) { A.go('ordermoney', { id: id }); return; }
    if (o && o.req && A.sees('requests')) { A.go('requests', { id: id }); return; }
    A.go('order', { id: id });
  };
  ACT.goProv = function (el) { A.go(el.dataset.x === 'provider' ? 'provider' : 'ledger', { id: el.dataset.id }); };
  /* Ô nhập trong modal */
  A.IN.mset = function (el, v) {
    var k = el.dataset.k; A.S.modal[k] = v;
    if (el.dataset.rerender !== 'no') A.render();
  };
  A.IN.uiset = function (el, v) { A.S.ui[el.dataset.k] = v; A.render(); };

  /* ---------- Khởi động ---------- */
  A.start = function () {
    var app = document.getElementById('app'), ov = document.getElementById('ov');
    VN.bind(app, ACT, A.IN); VN.bind(ov, ACT, A.IN);
    var nar = document.getElementById('narrow'); if (nar) VN.bind(nar, ACT, A.IN);
    document.addEventListener('keydown', function (e) {
      var layer = document.querySelector('#ov .modal, #ov .drawer, #ov .palette');
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); ACT.palette(); return; }
      if (e.key === 'Escape') {
        if (A.S.palette) { A.S.palette = null; A.render(); return; }
        if (A.S.modal) { A.closeModal(); return; }
        if (A.S.menu) { A.S.menu = null; A.render(); return; }
        if (A.S.demo) { A.S.demo = false; A.render(); return; }
      }
      if (A.S.palette && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
        var n = (A.S.palette.res || []).length; if (!n) return;
        if (e.key === 'Enter') { e.preventDefault(); ACT.palGo({ dataset: { id: A.S.palette.hl || 0 } }); return; }
        e.preventDefault(); A.S.palette.hl = ((A.S.palette.hl || 0) + (e.key === 'ArrowDown' ? 1 : n - 1)) % n; A.render(); return;
      }
      if (layer) VN.trap(e, layer);
    });
    document.addEventListener('click', function (e) {
      if (A.S.menu && !e.target.closest('.menu') && !e.target.closest('[data-act="menu"]')) { A.S.menu = null; A.render(); }
    }, true);
    var q = new URLSearchParams(location.search);
    if (q.get('role') && A.ROLES[q.get('role')]) A.S.role = q.get('role');
    if (q.get('lang') === 'en') VN.lang = 1;
    if (q.get('scenario')) { A.render(); ACT.scenario({ dataset: { id: q.get('scenario') } }); return; }
    if (q.get('page')) { A.S.page = q.get('page'); if (q.get('id')) A.S.p = { id: q.get('id') }; if (q.get('tab')) A.S.p.tab = q.get('tab'); }
    A.render();
  };
})(window);
