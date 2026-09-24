/* Trang quản trị · Giao dịch & đối soát (A), Tiền của đơn (B), Số dư & sổ cái (C), Rút tiền (D), Hoàn tiền & tạm giữ (E). */
(function (W) {
  'use strict';
  var VN = W.VN, D = W.VNDATA, A = W.ADMIN, L = VN.L, ic = VN.ic, esc = VN.esc, R = Math.round;
  var ACT = A.ACT, M = A.M;

  /* ---------- Tiền của một đơn ---------- */
  A.split = function (o) { var g = o.amount, c = R(g * 0.15), t = R(g * 0.02); return { gross: g, comm: c, tax: t, share: g - c - t }; };
  function pocketOf(o) { return { warranty: 'warranty', hold: 'hold', awaiting: 'awaiting', available: 'avail' }[o.money]; }
  function refundable(o) { return o.amount - (o.refunded || 0); }
  function provCat(pid) { var p = A.prov(pid); return p ? p.cats[0] : null; }
  A.moneyBadge = function (o, big) {
    var def = D.MONEY_STATUS[o.money] || D.MONEY_STATUS.none;
    return '<span class="badge ' + (big ? 'lg ' : '') + 't-' + def[2] + '">' + L(def[0], def[1]) + (o.money === 'warranty' && o.warrantyLeft != null ? L(' · còn ' + o.warrantyLeft + ' ngày', ' · ' + o.warrantyLeft + ' days left') : '') + '</span>';
  };

  /* ---------- Sổ cái ---------- */
  function seedLedger() {
    var Lg = {};
    Lg.phucan = [
      ['24/09 08:12', 'payout', ['Yêu cầu rút tiền RT-24091', 'Payout request RT-24091'], ['avail', 'payout'], 2450000, 'RT-24091'],
      ['22/09 09:40', 'order', ['Ghi nhận đơn VN-240918 sau thanh toán', 'Order VN-240918 recorded after payment'], ['', 'warranty'], 373500, 'VN-240918'],
      ['21/09 15:20', 'order', ['Nghiệm thu VN-240919, chờ khách thanh toán', 'VN-240919 signed off, awaiting payment'], ['', 'awaiting'], 315400, 'VN-240919'],
      ['20/09 00:00', 'warranty', ['Hết bảo hành 3 đơn, chuyển sang Có thể rút', '3 orders out of warranty, now available'], ['warranty', 'avail'], 1121000, 'VN-240905'],
      ['14/09 15:40', 'paid', ['Chi trả lô L-0914 (RT-24070)', 'Paid in batch L-0914 (RT-24070)'], ['payout', ''], -3150000, 'L-0914'],
      ['09/09 00:00', 'warranty', ['Hết bảo hành VN-240902', 'VN-240902 warranty ended'], ['warranty', 'avail'], 539500, 'VN-240902'],
      ['02/09 09:51', 'order', ['Ghi nhận đơn VN-240902 sau thanh toán', 'Order VN-240902 recorded after payment'], ['', 'warranty'], 539500, 'VN-240902']
    ];
    Lg.sachxanh = [
      ['24/09 07:45', 'payout', ['Yêu cầu rút tiền RT-24092', 'Payout request RT-24092'], ['avail', 'payout'], 1800000, 'RT-24092'],
      ['23/09 18:20', 'hold', ['Tạm giữ do khiếu nại KN-1042', 'Held for dispute KN-1042'], ['warranty', 'hold'], 747000, 'VN-240921'],
      ['23/09 16:40', 'cash', ['Thu tiền mặt VN-240923, ghi công nợ hoa hồng và thuế', 'Cash collected VN-240923, commission and tax owed'], ['', 'debt'], -110500, 'RT-CM-0041'],
      ['22/09 21:14', 'adjust', ['Nhà cung cấp đổi tài khoản ngân hàng nhận tiền', 'Provider changed payout bank account'], ['', ''], 0, 'TCB •••• 8823'],
      ['22/09 16:30', 'order', ['Ghi nhận đơn VN-240921 sau thanh toán', 'Order VN-240921 recorded after payment'], ['', 'warranty'], 747000, 'VN-240921'],
      ['19/09 00:00', 'warranty', ['Hết bảo hành 4 đơn, chuyển sang Có thể rút', '4 orders out of warranty, now available'], ['warranty', 'avail'], 1320000, 'VN-240901'],
      ['15/09 11:02', 'refund', ['Hoàn một phần VN-240916', 'Partial refund VN-240916'], ['warranty', ''], -232400, 'HT-0918']
    ];
    Lg.hoabinh = [['24/09 07:30', 'payout', ['Yêu cầu rút tiền RT-24093', 'Payout request RT-24093'], ['avail', 'payout'], 3120000, 'RT-24093'], ['23/09 11:30', 'order', ['Chưa thu được tiền mặt VN-240935, chờ khách thanh toán', 'Cash not collected VN-240935, awaiting customer payment'], ['', 'awaiting'], 622500, 'VN-240935'], ['22/09 11:20', 'cash', ['Thu tiền mặt VN-240922, ghi công nợ hoa hồng và thuế', 'Cash collected VN-240922, commission and tax owed'], ['', 'debt'], -374000, 'RT-CM-0040'], ['21/09 15:02', 'order', ['Ghi nhận đơn VN-240914 sau thanh toán', 'Order VN-240914 recorded after payment'], ['', 'warranty'], 954500, 'VN-240914'], ['19/09 10:52', 'order', ['Ghi nhận đơn VN-240913 sau thanh toán', 'Order VN-240913 recorded after payment'], ['', 'warranty'], 996000, 'VN-240913'], ['14/09 15:40', 'paid', ['Chi trả lô L-0914 (RT-24068)', 'Paid in batch L-0914 (RT-24068)'], ['payout', ''], -2780000, 'L-0914'], ['12/09 16:10', 'paid', ['Chi trả lô L-0912 (CT-0912-03)', 'Paid in batch L-0912 (CT-0912-03)'], ['payout', ''], -3200000, 'CT-0912-03']];
    Lg.antam = [['23/09 21:08', 'payout', ['Yêu cầu rút tiền RT-24094', 'Payout request RT-24094'], ['avail', 'payout'], 1250000, 'RT-24094'], ['22/09 16:55', 'order', ['Ghi nhận đơn VN-240920 sau thanh toán', 'Order VN-240920 recorded after payment'], ['', 'warranty'], 622500, 'VN-240920'], ['21/09 10:20', 'adjust', ['Điều chỉnh DC-0921: phí chuyển khoản lỗi', 'Adjustment DC-0921: failed transfer fee'], ['avail', ''], -55000, 'DC-0921'], ['21/09 09:40', 'cash', ['Nhận chuyển khoản trả công nợ tiền mặt VN-240907', 'Cash debt transfer received VN-240907'], ['debt', ''], 153000, 'FT26264093551'], ['20/09 10:30', 'cash', ['Thu tiền mặt VN-240907, ghi công nợ hoa hồng và thuế', 'Cash collected VN-240907, commission and tax owed'], ['', 'debt'], -153000, 'RT-CM-0037']];
    Lg.thotam = [['23/09 18:40', 'adjust', ['Khoá tài khoản, dừng nhận đơn mới', 'Account locked, no new orders'], ['', ''], 0, ''], ['23/09 11:40', 'order', ['Nghiệm thu VN-240925, chờ khách thanh toán', 'VN-240925 signed off, awaiting payment'], ['', 'awaiting'], 431600, 'VN-240925'], ['22/09 15:10', 'cash', ['Nhận chuyển khoản trả công nợ tiền mặt VN-240909', 'Cash debt transfer received VN-240909'], ['debt', ''], 81600, 'FT26265418207'], ['21/09 14:55', 'cash', ['Thu tiền mặt VN-240909, ghi công nợ hoa hồng và thuế', 'Cash collected VN-240909, commission and tax owed'], ['', 'debt'], -81600, 'RT-CM-0038']];
    return Lg;
  }
  A.ledger = function (pid) { if (!A.S.d.LEDGER) A.S.d.LEDGER = seedLedger(); if (!A.S.d.LEDGER[pid]) A.S.d.LEDGER[pid] = []; return A.S.d.LEDGER[pid]; };
  A.book = function (pid, type, txt, pk, amt, ref) { if (!pid) return; A.ledger(pid).unshift(['24/09 ' + VN.nowTime(), type, txt, pk, amt, ref]); };
  A.moneyEv = function (o, txt) { o.mev = o.mev || []; o.mev.push(['24/09 ' + VN.nowTime(), txt, A.me()]); };
  function flash(msg) { A.toast(msg); }

  /* ---------- Giao dịch & đối soát (A) ---------- */
  A.P.transactions = {
    crumb: function () { return null; },
    render: function () {
      var tab = A.S.p.tab || 'txn', d = A.S.d;
      var unpaid = d.ORDERS.filter(function (o) { return o.money === 'awaiting'; });
      var adjPend = d.ADJUSTS.filter(function (a) { return a.st === 'pending'; }).length;
      var tabs = [['txn', L('Giao dịch thu', 'Collections'), VN.num(D.FIN.txCount)], ['bal', L('Số dư nhà cung cấp', 'Provider balances'), 214], ['unpaid', L('Chờ khách thanh toán', 'Awaiting customer payment'), unpaid.length], ['adjust', L('Điều chỉnh sổ cái', 'Ledger adjustments'), adjPend], ['recon', L('Đối soát', 'Reconciliation'), null]];
      var primary = tab === 'adjust' ? A.btn(L('Tạo điều chỉnh', 'Create adjustment'), 'adjOpen', { cls: 'primary', icon: 'plus', dis: A.denyTip('adjCreate') }) :
        tab === 'recon' ? (A.S.p.rs === 'gateway' ? A.btn(L('Xuất file đối soát', 'Export reconciliation'), 'reconExport', { cls: 'primary', icon: 'download-simple', dis: A.can('export') || A.S.role === 'acc' ? '' : A.denyTip('export') }) : '') :
        (tab === 'txn' && A.can('export') ? A.btn(L('Xuất Excel', 'Export to Excel'), 'txnExport', { cls: 'primary', icon: 'download-simple' }) : '');
      var h = '<div class="page-h"><div><h1>' + L('Giao dịch & đối soát', 'Transactions & reconciliation') + '</h1><div class="sub">' + L('Mọi bút toán chỉ thêm, không sửa, không xoá', 'Entries are append-only: no edits, no deletes') + '</div></div><div class="acts">' + primary + '</div></div>';
      h += '<div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" aria-selected="' + (tab === t[0]) + '" class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-id="' + t[0] + '">' + t[1] + (t[2] != null ? '<span class="n' + (t[0] === 'adjust' && t[2] ? ' red' : '') + '">' + t[2] + '</span>' : '') + '</button>'; }).join('') + '</div>';
      return h + ({ txn: txnTab, bal: balTab, unpaid: unpaidTab, adjust: adjTab, recon: reconTab }[tab] || txnTab)();
    }
  };
  function txnRows() {
    return A.S.d.TXNS.map(function (t) {
      var o = A.order(t[1]), ex = D.TXN_EXTRA[t[1]] || [];
      return { id: t[0], order: t[1], cust: o ? o.cust : ex[0], prov: o ? o.prov : ex[1], amount: t[2], method: t[3], st: t[4], time: t[5] };
    });
  }
  /* Phương thức: tiền mặt là viên trung tính có icon, các phương thức khác giữ chữ thường */
  function methodCell(m) { return m === 'cash' ? '<span class="badge plain t-neutral">' + ic('money') + L('Tiền mặt', 'Cash') + '</span>' : L(D.PAY_METHOD[m][0], D.PAY_METHOD[m][1]); }
  function txnTab() {
    var q = VN.fold(A.ui('txnQ', '')), fm = A.ui('txnM', ''), fs = A.ui('txnS', ''), ft = A.ui('txnT', '');
    var rows = txnRows().filter(function (r) {
      return (!q || VN.fold(r.id + ' ' + r.order + ' ' + (r.cust || '')).indexOf(q) >= 0) && (!fm || r.method === fm) && (!fs || r.st === fs) && (!ft || (ft === 'today' ? r.time.indexOf('24/09') === 0 : ['24/09', '23/09', '22/09', '21/09', '20/09', '19/09', '18/09'].indexOf(r.time.slice(0, 5)) >= 0));
    });
    rows = A.applySort(rows, { amount: function (r) { return r.amount; }, time: function (r) { return r.time.slice(3, 5) + r.time.slice(0, 2) + r.time.slice(6); } });
    var h = '<div class="filters"><div class="search-box">' + ic('magnifying-glass') + '<label class="sr" for="txn-q">' + L('Tìm', 'Search') + '</label><input id="txn-q" class="inp" data-in="uiset" data-k="txnQ" value="' + esc(A.ui('txnQ', '')) + '" placeholder="' + L('Mã giao dịch, mã đơn, khách hàng', 'Transaction, order, customer') + '"></div>' +
      sel('txnT', [['', L('Mọi thời gian', 'Any time')], ['today', L('Hôm nay', 'Today')], ['7d', L('7 ngày', '7 days')]], L('Thời gian', 'Time')) +
      sel('txnM', [['', L('Mọi phương thức', 'All methods')]].concat(Object.keys(D.PAY_METHOD).map(function (k) { return [k, L(D.PAY_METHOD[k][0], D.PAY_METHOD[k][1])]; })), L('Phương thức', 'Method')) +
      sel('txnS', [['', L('Mọi trạng thái', 'All statuses')]].concat(Object.keys(D.TXN_STATUS).map(function (k) { return [k, L(D.TXN_STATUS[k][0], D.TXN_STATUS[k][1])]; })), L('Trạng thái', 'Status')) + '</div>';
    h += '<div class="card" style="overflow:hidden"><div style="overflow-x:auto"><table class="tbl"><thead><tr><th>' + L('Mã giao dịch', 'Transaction') + '</th><th>' + L('Mã đơn', 'Order') + '</th><th>' + L('Khách hàng', 'Customer') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th>' + A.sortable('amount', L('Số tiền', 'Amount'), 'num') + '<th>' + L('Phương thức', 'Method') + '</th><th>' + L('Trạng thái', 'Status') + '</th>' + A.sortable('time', L('Thời gian', 'Time')) + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (r) { return '<tr><td class="id">' + r.id + '</td><td>' + A.ordLink(r.order, 'money') + '</td><td class="ell">' + esc(r.cust || '') + '</td><td class="ell">' + A.provLink(r.prov) + '</td><td class="num">' + VN.money(r.amount) + '</td><td>' + methodCell(r.method) + '</td><td>' + A.badge(D.TXN_STATUS[r.st]) + '</td><td class="muted nw">' + r.time + '</td></tr>'; }).join('') :
        '<tr><td colspan="8">' + A.empty(L('Không có giao dịch khớp bộ lọc', 'No transactions match'), L('Thử bỏ bớt bộ lọc hoặc tìm theo mã đơn.', 'Remove a filter or search by order ID.'), A.btn(L('Xoá bộ lọc', 'Clear filters'), 'txnClear')) + '</td></tr>') +
      '</tbody></table></div>' + A.foot(rows.length, rows.length === txnRows().length ? D.FIN.txCount : rows.length, ['giao dịch', 'transactions']) + '</div>';
    return h;
  }
  function sel(k, opts, label) {
    var v = A.ui(k, '');
    return '<label class="sr" for="s-' + k + '">' + label + '</label><select id="s-' + k + '" class="sel" data-in="uiset" data-k="' + k + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (v === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
  }
  A.selUi = sel;
  ACT.txnClear = function () { ['txnQ', 'txnM', 'txnS', 'txnT'].forEach(function (k) { A.S.ui[k] = ''; }); A.render(); };
  ACT.txnExport = function () {
    var rows = [[L('Mã giao dịch', 'Transaction'), L('Mã đơn', 'Order'), L('Khách hàng', 'Customer'), L('Nhà cung cấp', 'Provider'), L('Số tiền', 'Amount'), L('Phương thức', 'Method'), L('Trạng thái', 'Status'), L('Thời gian', 'Time')]].concat(txnRows().map(function (r) { return [r.id, r.order, r.cust || '', A.provName(r.prov), r.amount, L(D.PAY_METHOD[r.method][0], D.PAY_METHOD[r.method][1]), L(D.TXN_STATUS[r.st][0], D.TXN_STATUS[r.st][1]), r.time]; }));
    VN.download('VuongNhan_GiaoDichThu_20260924.xls', VN.xls([{ name: L('Giao dịch thu', 'Collections'), rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    A.toast(L('Đã tạo file VuongNhan_GiaoDichThu_20260924.xls', 'Created VuongNhan_GiaoDichThu_20260924.xls'));
  };

  function balTab() {
    var ps = A.S.d.PROVIDERS.filter(function (p) { return p.status !== 'pending'; });
    ps = A.applySort(ps, { total: function (p) { return tot(p); }, avail: function (p) { return p.bal.avail; } });
    function tot(p) { return p.bal.warranty + p.bal.hold + p.bal.avail + p.bal.payout; }
    return '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Nhà cung cấp', 'Provider') + '</th><th class="num">' + L('Đang bảo hành', 'In warranty') + '</th><th class="num">' + L('Đang tạm giữ', 'On hold') + '</th>' + A.sortable('avail', L('Có thể rút', 'Available'), 'num') + '<th class="num">' + L('Đang rút', 'Payout in progress') + '</th>' + A.sortable('total', L('Tổng', 'Total'), 'num') + '<th>' + L('Cảnh báo', 'Alerts') + '</th></tr></thead><tbody>' +
      ps.map(function (p) {
        return '<tr class="click" tabindex="0" data-act="goProv" data-id="' + p.id + '" data-x="ledger"><td><b style="font-weight:500">' + esc(p.name) + '</b></td><td class="num">' + VN.money(p.bal.warranty) + '</td><td class="num' + (p.bal.hold ? '" style="color:var(--danger)' : '') + '">' + VN.money(p.bal.hold) + '</td><td class="num">' + VN.money(p.bal.avail) + '</td><td class="num">' + VN.money(p.bal.payout) + '</td><td class="num"><b style="font-weight:600">' + VN.money(tot(p)) + '</b></td><td>' + flagBadges(p) + '</td></tr>';
      }).join('') + '</tbody></table>' + A.foot(ps.length, 214, ['nhà cung cấp', 'providers']) + '</div>';
  }
  function flagBadges(p) {
    var b = [];
    if (p.flags.indexOf('bankFix') >= 0) b.push('<span class="badge t-danger">' + L('Cần cập nhật tài khoản ngân hàng', 'Bank account needs update') + '</span>');
    if (p.flags.indexOf('bankChanged') >= 0) b.push('<span class="badge t-warn">' + L('Tài khoản vừa đổi 2 ngày trước', 'Account changed 2 days ago') + '</span>');
    if (p.status === 'locked') b.push('<span class="badge t-danger">' + L('Đã khoá', 'Locked') + '</span>');
    if (p.flags.indexOf('cancelHigh') >= 0) b.push('<span class="badge t-warn">' + L('Tỷ lệ huỷ cao', 'High cancel rate') + '</span>');
    return b.join(' ') || '<span class="subtle">' + L('Không có', 'None') + '</span>';
  }
  A.flagBadges = flagBadges;

  function unpaidTab() {
    var rows = A.S.d.ORDERS.filter(function (o) { return o.money === 'awaiting'; });
    rows = A.applySort(rows, { over: function (o) { return o.overdueDays || 0; }, amount: function (o) { return o.amount; } });
    return '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã đơn', 'Order') + '</th><th>' + L('Khách hàng', 'Customer') + '</th>' + A.sortable('amount', L('Số tiền', 'Amount'), 'num') + '<th>' + L('Ngày nghiệm thu', 'Signed off') + '</th>' + A.sortable('over', L('Số ngày quá hạn', 'Days overdue'), 'num') + '<th>' + L('Trạng thái đôn đốc', 'Follow-up') + '</th><th>' + L('Lần liên hệ gần nhất', 'Last contact') + '</th></tr></thead><tbody>' +
      rows.map(function (o) {
        var notes = A.S.d.DUN_NOTES[o.id] || [], last = notes[0];
        var od = o.overdueDays || 0;
        return '<tr class="click" tabindex="0" data-act="dunOpen" data-id="' + o.id + '"><td class="id">' + o.id + '</td><td>' + esc(o.cust) + '<div class="muted" style="font-size:12px">' + o.phone.replace(/(\d{4}) (\d{3}) (\d{3})/, '$1 ••• $3') + '</div></td><td class="num">' + VN.money(o.amount) + (o.cashFail ? '<div class="muted" style="font-size:12px">' + L('Tiền mặt chưa thu được', 'Cash not collected') + '</div>' : '') + '</td><td class="muted nw">' + o.accepted + '</td><td class="num">' +
          (od ? '<span class="badge ' + (od > 3 ? 't-warn' : 't-neutral') + '">' + L(od + ' ngày', od + ' days') + '</span>' : '<span class="muted">' + L('Chưa quá hạn · còn ' + o.dueIn + ' giờ', 'Not overdue · ' + o.dueIn + ' h left') + '</span>') + '</td><td>' + A.badge(D.DUN[o.dun || 'none']) + (o.promise ? '<div class="muted" style="font-size:12px;margin-top:3px">' + L('Hẹn ', 'Promised ') + o.promise + '</div>' : '') + '</td><td class="muted" style="font-size:12.5px">' + (last ? esc(last[0]) + ' · ' + last[1] : L('Không có', 'None')) + '</td></tr>';
      }).join('') + '</tbody></table>' + A.foot(rows.length, rows.length, ['đơn', 'orders']) + '</div>';
  }
  ACT.dunOpen = function (el) { var o = A.order(el.dataset.id); A.openModal('dun', { id: o.id, dun: o.dun || 'none', promise: o.promise ? '2026-09-' + o.promise.slice(0, 2) : '', note: '' }); };
  M.dun = function (m) {
    var o = A.order(m.id), notes = A.S.d.DUN_NOTES[o.id] || [], dis = A.denyTip('dunNote');
    return '<div class="scrim" data-act="closeModal"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="dun-h"><div class="modal-h"><div><h2 id="dun-h">' + L('Đôn đốc thanh toán', 'Payment follow-up') + ' · <span class="mono">' + o.id + '</span></h2><p>' + esc(o.cust) + ' · ' + o.phone + ' · ' + VN.money(o.amount) + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="modal-b"><div class="field"><span class="flabel">' + L('Trạng thái đôn đốc', 'Follow-up status') + '</span><div class="radios">' + Object.keys(D.DUN).map(function (k) { return '<label class="radio-card"><input type="radio" name="dun" value="' + k + '"' + (m.dun === k ? ' checked' : '') + ' data-in="mset" data-k="dun">' + L(D.DUN[k][0], D.DUN[k][1]) + '</label>'; }).join('') + '</div></div>' +
      (m.dun === 'promised' ? '<div class="field"><label for="dun-date">' + L('Ngày hẹn thanh toán', 'Promised date') + ' <span class="req">*</span></label><input id="dun-date" type="date" class="inp" min="2026-09-24" value="' + esc(m.promise) + '" data-in="mset" data-k="promise"></div>' : '') +
      '<div class="field"><label for="dun-note">' + L('Ghi chú', 'Note') + '</label><textarea id="dun-note" class="txa" maxlength="500" data-in="mset" data-k="note" placeholder="' + L('Ví dụ: khách hẹn chuyển khoản tối nay', 'e.g. customer will transfer tonight') + '">' + esc(m.note || '') + '</textarea></div>' +
      '<div><div class="lbl" style="margin-bottom:8px">' + L('Lịch sử ghi chú', 'Note history') + '</div>' + (notes.length ? '<div class="tl">' + notes.map(function (n) { return '<div class="tl-i"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + L(n[2][0], n[2][1]) + '<small>' + esc(n[0]) + '</small></span><span class="tm">' + n[1] + '</span></div>'; }).join('') + '</div>' : '<p class="muted" style="margin:0;font-size:13px">' + L('Chưa có ghi chú. Ghi chú đầu tiên sẽ hiện ở đây kèm người và giờ.', 'No notes yet. Notes appear here with author and time.') + '</p>') + '</div></div>' +
      '<div class="modal-f"><div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + A.btn(L('Lưu đôn đốc', 'Save follow-up'), 'dunSave', { cls: 'primary', dis: dis || (m.dun === 'promised' && !m.promise ? L('Chọn ngày hẹn', 'Pick a promised date') : '') }) + '</div></div></aside>';
  };
  ACT.dunSave = function () {
    var m = A.S.modal, o = A.order(m.id);
    o.dun = m.dun; o.promise = m.dun === 'promised' && m.promise ? m.promise.slice(8, 10) + '/' + m.promise.slice(5, 7) : null;
    var txt = L(D.DUN[m.dun][0], D.DUN[m.dun][1]) + (o.promise ? L(' ngày ', ' on ') + o.promise : '') + (m.note ? '. ' + m.note : '');
    A.S.d.DUN_NOTES[o.id] = [[A.me(), '24/09 ' + VN.nowTime(), [txt, txt]]].concat(A.S.d.DUN_NOTES[o.id] || []);
    A.log(L('Cập nhật đôn đốc thanh toán', 'Updated payment follow-up'), o.id);
    A.S.modal = null; A.render(); flash(L('Đã lưu đôn đốc cho ', 'Follow-up saved for ') + o.id);
  };

  function adjTab() {
    var sub = A.S.p.sub || 'pending', list = A.S.d.ADJUSTS.filter(function (a) { return a.st === sub; });
    var cnt = function (s) { return A.S.d.ADJUSTS.filter(function (a) { return a.st === s; }).length; };
    var h = '<div class="tabs sub">' + [['pending', L('Chờ duyệt', 'Pending')], ['approved', L('Đã duyệt', 'Approved')], ['rejected', L('Từ chối', 'Rejected')]].map(function (t) { return '<button type="button" class="' + (sub === t[0] ? 'on' : '') + '" data-act="subtab" data-id="' + t[0] + '">' + t[1] + '<span class="n">' + cnt(t[0]) + '</span></button>'; }).join('') + '</div>';
    h += '<div class="note info">' + ic('info') + '<span>' + L('Điều chỉnh luôn cần duyệt hai bước: người tạo không tự duyệt được. Không sửa, không xoá bút toán cũ; mỗi điều chỉnh là một bút toán mới.', 'Adjustments always need two-step approval; the creator cannot approve. Old entries are never edited or deleted; each adjustment is a new entry.') + '</span></div>';
    h += '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã', 'ID') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th><th>' + L('Ngăn', 'Pocket') + '</th><th class="num">' + L('Số tiền', 'Amount') + '</th><th>' + L('Lý do', 'Reason') + '</th><th>' + L('Người tạo', 'Created by') + '</th><th>' + L('Người duyệt', 'Approver') + '</th>' + (sub === 'pending' ? '<th class="num">' + L('Thao tác', 'Actions') + '</th>' : '') + '</tr></thead><tbody>' +
      (list.length ? list.map(function (a) {
        var self = a.by === A.me(), dis = !A.can('adjApprove') ? A.denyTip('adjApprove', 'approve') : self ? L('Bạn là người tạo yêu cầu này', 'You created this request') : '';
        return '<tr class="' + (a.fresh ? 'flash' : '') + '"><td class="id">' + a.id + '</td><td>' + A.provLink(a.prov) + '</td><td>' + L(D.POCKETS[a.pocket][0], D.POCKETS[a.pocket][1]) + '</td><td class="num" style="color:' + (a.dir > 0 ? 'var(--ok)' : 'var(--danger)') + '">' + (a.dir > 0 ? '+' : '−') + VN.money(a.amount) + '</td><td style="max-width:260px">' + L(a.reason[0], a.reason[1]) + (a.link ? '<div class="muted mono" style="font-size:11.5px">' + a.link + '</div>' : '') + (a.rej ? '<div style="font-size:12px;color:var(--danger)">' + L(a.rej[0], a.rej[1]) + '</div>' : '') + '</td><td>' + esc(a.by) + '<div class="muted" style="font-size:12px">' + a.at + '</div></td><td>' + (a.ap ? esc(a.ap) : '<span class="subtle">' + L('Chờ bước hai', 'Awaiting step 2') + '</span>') + '</td>' +
          (sub === 'pending' ? '<td class="num nw">' + A.btn(L('Từ chối', 'Reject'), 'adjReject', { cls: 'danger sm', id: a.id, dis: dis, tipPos: 'left' }) + ' ' + A.btn(L('Duyệt', 'Approve'), 'adjApprove', { cls: 'sm', id: a.id, dis: dis, tipPos: 'left' }) + '</td>' : '') + '</tr>';
      }).join('') : '<tr><td colspan="8">' + A.empty(sub === 'pending' ? L('Không có điều chỉnh chờ duyệt', 'No adjustments pending') : L('Chưa có điều chỉnh', 'No adjustments'), L('Điều chỉnh mới tạo từ tab Đối soát hoặc nút "Tạo điều chỉnh".', 'Create one from Reconciliation or the "Create adjustment" button.')) + '</td></tr>') +
      '</tbody></table></div>';
    return h;
  }
  var ADJ_REASONS = [['Chi thiếu so với lệnh chi', 'Paid less than the payout order'], ['Chi thừa so với lệnh chi', 'Paid more than the payout order'], ['Ghi nhận sai phụ thu', 'Surcharge recorded incorrectly'], ['Phí chuyển khoản lỗi', 'Failed transfer fee'], ['Khác', 'Other']];
  ACT.adjOpen = function (el, e, pre) { A.S.p = Object.assign({}, A.S.p, { tab: 'adjust', sub: 'pending' }); A.openModal('adjust', Object.assign({ prov: 'phucan', pocket: 'avail', dir: '1', amount: '', reason: '', note: '', link: '' }, pre || {})); };
  M.adjust = function (m) {
    var p = A.prov(m.prov), amt = VN.parseMoney(m.amount), dir = +m.dir, before = p.bal[m.pocket] || 0, after = before + dir * amt;
    var err = amt <= 0 ? '' : (after < 0 ? L('Số tiền giảm vượt số dư của ngăn (' + VN.money(before) + ')', 'Decrease exceeds pocket balance (' + VN.money(before) + ')') : '');
    var ok = amt > 0 && !err && m.reason !== '' && (m.reason !== '4' || m.note);
    return '<div class="scrim" data-act="closeModal"></div><aside class="drawer wide" role="dialog" aria-modal="true" aria-labelledby="adj-h"><div class="modal-h"><div><h2 id="adj-h">' + L('Tạo điều chỉnh sổ cái', 'Create ledger adjustment') + '</h2><p>' + L('Tạo một bút toán mới. Cần người khác duyệt bước hai.', 'Creates a new entry. Someone else must approve step two.') + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="modal-b"><div class="grid2e" style="gap:12px"><div class="field"><label for="adj-p">' + L('Nhà cung cấp', 'Provider') + ' <span class="req">*</span></label><select id="adj-p" class="sel" data-in="mset" data-k="prov">' + A.S.d.PROVIDERS.filter(function (x) { return x.status !== 'pending'; }).map(function (x) { return '<option value="' + x.id + '"' + (m.prov === x.id ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="adj-k">' + L('Ngăn', 'Pocket') + ' <span class="req">*</span></label><select id="adj-k" class="sel" data-in="mset" data-k="pocket">' + ['warranty', 'hold', 'avail'].map(function (k) { return '<option value="' + k + '"' + (m.pocket === k ? ' selected' : '') + '>' + L(D.POCKETS[k][0], D.POCKETS[k][1]) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="grid2e" style="gap:12px"><div class="field"><span class="flabel">' + L('Chiều', 'Direction') + '</span><div class="seg" role="radiogroup"><button type="button" role="radio" aria-checked="' + (dir > 0) + '" class="' + (dir > 0 ? 'on' : '') + '" data-act="mpick" data-id="dir" data-x="1">' + L('Tăng', 'Increase') + '</button><button type="button" role="radio" aria-checked="' + (dir < 0) + '" class="' + (dir < 0 ? 'on' : '') + '" data-act="mpick" data-id="dir" data-x="-1">' + L('Giảm', 'Decrease') + '</button></div></div>' +
      '<div class="field"><label for="adj-a">' + L('Số tiền', 'Amount') + ' <span class="req">*</span></label><div class="inp-wrap"><input id="adj-a" class="inp' + (err ? ' bad' : '') + '" inputmode="numeric" data-in="mset" data-k="amount" value="' + esc(m.amount) + '" placeholder="0"><span class="suffix">₫</span></div>' + (err ? '<span class="err">' + err + '</span>' : '') + '</div></div>' +
      A.reasonField(ADJ_REASONS, m.reason === '4' ? 'noteReq' : '') +
      '<div class="field"><label for="adj-l">' + L('Liên kết', 'Link') + '</label><input id="adj-l" class="inp mono" data-in="mset" data-k="link" value="' + esc(m.link) + '" placeholder="' + L('Mã đơn, mã lô chi hoặc mã giao dịch', 'Order, batch or transaction ID') + '"></div>' +
      A.impact(L('Tác động lên số dư sau khi được duyệt', 'Balance impact once approved'), [[p.name + ' · ' + L(D.POCKETS[m.pocket][0], D.POCKETS[m.pocket][1]), before, after]]) + '</div>' +
      '<div class="modal-f"><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Gửi duyệt', 'Submit for approval'), 'adjSave', { cls: 'primary', dis: ok ? '' : L('Nhập số tiền và chọn lý do', 'Enter an amount and a reason') }) + '</div></div></aside>';
  };
  ACT.mpick = function (el) { A.S.modal[el.dataset.id] = el.dataset.x; A.render(); };
  ACT.adjSave = function () {
    var m = A.S.modal, id = 'DC-09' + (24 + A.S.d.ADJUSTS.length);
    A.S.d.ADJUSTS.forEach(function (a) { a.fresh = false; });
    A.S.d.ADJUSTS.unshift({ id: id, prov: m.prov, pocket: m.pocket, dir: +m.dir, amount: VN.parseMoney(m.amount), reason: m.reason === '4' ? [m.note, m.note] : ADJ_REASONS[+m.reason], link: m.link, st: 'pending', by: A.me(), at: '24/09 ' + VN.nowTime(), fresh: true, note: m.note });
    A.log(L('Tạo điều chỉnh sổ cái', 'Created ledger adjustment'), id);
    A.S.modal = null; A.S.p = Object.assign({}, A.S.p, { tab: 'adjust', sub: 'pending' }); A.render();
    flash(L('Đã tạo ' + id + ', chờ người khác duyệt bước hai', id + ' created, awaiting a second approver'));
  };
  ACT.adjApprove = function (el) { A.openModal('adjDecide', { id: el.dataset.id, ok: true, reason: '', note: '' }); };
  ACT.adjReject = function (el) { A.openModal('adjDecide', { id: el.dataset.id, ok: false, reason: '', note: '' }); };
  M.adjDecide = function (m) {
    var a = A.S.d.ADJUSTS.filter(function (x) { return x.id === m.id; })[0], p = A.prov(a.prov), before = p.bal[a.pocket];
    var reasons = m.ok ? [['Đã đối chiếu chứng từ, số tiền đúng', 'Documents checked, amount correct'], ['Khớp sao kê ngân hàng', 'Matches bank statement'], ['Khác', 'Other']] : [['Thiếu chứng từ', 'Missing documents'], ['Số tiền không khớp chứng từ', 'Amount does not match documents'], ['Khác', 'Other']];
    return modalShell(m.ok ? L('Duyệt điều chỉnh ', 'Approve adjustment ') + a.id : L('Từ chối điều chỉnh ', 'Reject adjustment ') + a.id, esc(p.name) + ' · ' + (a.dir > 0 ? '+' : '−') + VN.money(a.amount) + ' · ' + L(a.reason[0], a.reason[1]),
      A.reasonField(reasons) + (m.ok ? A.impact(L('Tác động lên số dư', 'Balance impact'), [[L(D.POCKETS[a.pocket][0], D.POCKETS[a.pocket][1]), before, before + a.dir * a.amount]]) : ''),
      A.btn(m.ok ? L('Duyệt điều chỉnh', 'Approve adjustment') : L('Từ chối', 'Reject'), 'adjDecideGo', { cls: m.ok ? 'primary' : 'danger-solid', dis: m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '' }));
  };
  ACT.adjDecideGo = function () {
    var m = A.S.modal, a = A.S.d.ADJUSTS.filter(function (x) { return x.id === m.id; })[0], p = A.prov(a.prov);
    a.ap = A.me(); a.at2 = '24/09 ' + VN.nowTime();
    if (m.ok) {
      a.st = 'approved'; p.bal[a.pocket] += a.dir * a.amount;
      var paidLink = /^(CT-|L-)/.test(a.link || '');
      A.S.adj.push({ kind: 'adjust', owe: a.dir * a.amount, out: paidLink ? -a.dir * a.amount : 0, prov: a.prov, cat: provCat(a.prov) });
      A.book(a.prov, 'adjust', [L('Điều chỉnh ', 'Adjustment ') + a.id + ': ' + a.reason[0], 'Adjustment ' + a.id + ': ' + a.reason[1]], [a.dir < 0 ? a.pocket : '', a.dir > 0 ? a.pocket : ''], a.dir * a.amount, a.link || a.id);
      flash(L('Đã duyệt ' + a.id + '. Số dư, sổ cái và báo cáo đã cập nhật', a.id + ' approved. Balances, ledger and reports updated'));
    } else { a.st = 'rejected'; var rs = ['Thiếu chứng từ', 'Số tiền không khớp chứng từ', 'Khác']; a.rej = [rs[+m.reason] + (m.note ? ': ' + m.note : ''), rs[+m.reason]]; flash(L('Đã từ chối ', 'Rejected ') + a.id); }
    A.log(m.ok ? L('Duyệt điều chỉnh', 'Approved adjustment') : L('Từ chối điều chỉnh', 'Rejected adjustment'), a.id);
    A.S.modal = null; A.render();
  };

  /* Tab Đối soát có 2 tab con: tiền mặt từ nhà cung cấp (mặc định) và cổng thanh toán, lô chi (nội dung có từ trước).
     Tab con lưu ở A.S.p.rs, không dùng A.S.p.sub vì tab Điều chỉnh sổ cái đã dùng khoá đó. */
  function reconTab() {
    var rs = A.S.p.rs === 'gateway' ? 'gateway' : 'cash', pend = A.cashPending().length;
    var h = '<div class="tabs sub" role="tablist" aria-label="' + L('Loại đối soát', 'Reconciliation type') + '">' + [['cash', L('Tiền mặt từ nhà cung cấp', 'Cash from providers'), pend], ['gateway', L('Cổng thanh toán và lô chi', 'Gateway and payout batches'), null]].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (rs === t[0]) + '" class="' + (rs === t[0] ? 'on' : '') + '" data-act="reconSub" data-id="' + t[0] + '">' + t[1] + (t[2] != null ? '<span class="n">' + t[2] + '</span>' : '') + '</button>'; }).join('') + '</div>';
    return h + (rs === 'cash' ? cashTab() : gatewayTab());
  }
  ACT.reconSub = function (el) { A.S.p = Object.assign({}, A.S.p, { rs: el.dataset.id }); A.render(); };
  function gatewayTab() {
    var loaded = A.ui('reconLoaded', false), per = A.ui('reconPer', '09');
    var h = '<div class="card" style="padding:18px 20px;display:flex;flex-direction:column;gap:14px"><h2 style="margin:0;font-size:15px;font-weight:600">' + L('Xuất file đối soát theo kỳ', 'Export reconciliation file') + '</h2><div class="filters">' + sel('reconPer', [['09', L('Tháng 09/2026 (01-24)', 'September 2026 (1-24)')], ['08', L('Tháng 08/2026', 'August 2026')], ['07', L('Tháng 07/2026', 'July 2026')]], L('Kỳ', 'Period')) +
      '<span class="muted" style="font-size:13px">' + L('File gồm: giao dịch thu, lệnh chi theo lô, hoàn tiền, điều chỉnh. Đối soát với cổng thanh toán làm thủ công bằng file này.', 'Includes collections, payout batches, refunds, adjustments. Gateway reconciliation is manual with this file.') + '</span></div></div>';
    h += '<section class="card" aria-labelledby="imp-h"><div class="card-h"><h2 id="imp-h">' + L('Nhập sao kê cổng thanh toán và tự đối khớp', 'Import gateway statement and auto-match') + ' <span class="assume" style="margin-left:6px">' + L('Tuỳ chọn, chờ xác nhận', 'Optional, pending confirmation') + '</span></h2>' + (loaded ? '' : A.btn(L('Tải sao kê mẫu', 'Load sample statement'), 'reconLoad', { icon: 'upload-simple' })) + '</div>' +
      (loaded ? '<div style="padding:14px 0 0"><table class="tbl"><thead><tr><th>' + L('Lô chi', 'Batch') + '</th><th>' + L('Lệnh chi', 'Payout') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th><th class="num">' + L('Hệ thống ghi', 'System') + '</th><th class="num">' + L('Sao kê ngân hàng', 'Statement') + '</th><th>' + L('Kết quả', 'Result') + '</th><th></th></tr></thead><tbody>' +
        A.S.d.RECON.map(function (r) {
          var diff = r[4] - r[3], done = A.S.d.ADJUSTS.some(function (a) { return a.link === r[1]; });
          return '<tr' + (diff ? ' style="background:oklch(0.985 0.02 22)"' : '') + '><td class="id">' + r[0] + '</td><td class="id">' + r[1] + '</td><td>' + esc(r[2]) + '</td><td class="num">' + VN.money(r[3]) + '</td><td class="num">' + VN.money(r[4]) + '</td><td>' + (diff ? '<span class="badge t-danger">' + L('Lệch ', 'Off by ') + VN.money(Math.abs(diff)) + '</span>' : '<span class="badge t-ok">' + L('Khớp', 'Matched') + '</span>') + '</td><td class="num">' +
            (diff ? (done ? '<span class="muted" style="font-size:12.5px">' + L('Đã tạo điều chỉnh', 'Adjustment created') + '</span>' : '<button type="button" class="link" data-act="reconAdj" data-id="' + r[1] + '"' + (A.can('adjCreate') ? '' : ' aria-disabled="true" data-tip="' + esc(A.denyTip('adjCreate')) + '"') + '>' + L('Tạo điều chỉnh', 'Create adjustment') + ' →</button>') : '') + '</td></tr>';
        }).join('') + '</tbody></table><div class="tbl-foot"><span>' + L('5 dòng · 4 khớp · 1 lệch', '5 rows · 4 matched · 1 mismatch') + '</span></div></div>' :
        '<div class="card-b">' + A.empty(L('Chưa nhập sao kê', 'No statement imported'), L('Bấm "Tải sao kê mẫu" để giả lập file sao kê của cổng thanh toán và xem cách hệ thống tự đối khớp.', 'Click "Load sample statement" to simulate a gateway file and see auto-matching.')) + '</div>') + '</section>';
    return h;
  }
  ACT.reconLoad = function () { A.S.ui.reconLoaded = true; A.render(); flash(L('Đã đọc sao kê mẫu: 5 dòng, 1 dòng lệch', 'Sample statement read: 5 rows, 1 mismatch')); };
  ACT.reconAdj = function (el) {
    var r = A.S.d.RECON.filter(function (x) { return x[1] === el.dataset.id; })[0];
    ACT.adjOpen(null, null, { prov: 'hoabinh', pocket: 'avail', dir: r[4] < r[3] ? '1' : '-1', amount: String(Math.abs(r[4] - r[3])), reason: r[4] < r[3] ? '0' : '1', link: r[1], note: L('Sao kê ngân hàng ' + VN.money(r[4]) + ', hệ thống ghi ' + VN.money(r[3]), 'Statement ' + VN.money(r[4]) + ', system ' + VN.money(r[3])) });
  };
  ACT.reconExport = function () {
    var per = A.ui('reconPer', '09'), rows = [[L('Loại', 'Type'), L('Mã', 'ID'), L('Tham chiếu', 'Reference'), L('Số tiền', 'Amount'), L('Thời gian', 'Time')]];
    txnRows().forEach(function (t) { rows.push([L('Thu', 'Collection'), t.id, t.order, t.amount, t.time]); });
    A.S.d.PAYOUTS.filter(function (p) { return p.st === 'paid'; }).forEach(function (p) { rows.push([L('Chi', 'Payout'), p.id, p.batch, -p.amount, p.paidAt]); });
    A.S.d.REFUNDS.filter(function (x) { return x.st === 'done'; }).forEach(function (x) { rows.push([L('Hoàn', 'Refund'), x.id, x.order, -x.amount, x.at]); });
    var name = 'VuongNhan_DoiSoat_2026' + per + '.xls';
    VN.download(name, VN.xls([{ name: L('Đối soát', 'Reconciliation'), rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    A.log(L('Xuất file đối soát', 'Exported reconciliation'), name); flash(L('Đã tạo file ', 'File created: ') + name);
  };


  /* ---------- Đối soát tiền mặt ----------
     Tiền mặt nằm trong tay nhà cung cấp, nên phần nền tảng lẽ ra giữ lại y như đơn trả qua app (hoa hồng 15% + thuế khấu trừ 2%)
     thành công nợ. Nhà cung cấp chuyển khoản về theo mã tham chiếu; kế toán đối chiếu sao kê rồi ghi nhận 2 bước.
     Kỹ thuật viên báo chưa thu được thì không có công nợ: đơn sang Chờ khách thanh toán như đơn trả qua app chưa thanh toán. */
  A.cashOwe = function (c) { if (c.st === 'fail') return 0; var s = A.split(c); return s.comm + s.tax; };
  A.cashPending = function () { return A.S.d.CASH.filter(function (c) { return c.st === 'pending'; }); };
  A.cashDebt = function (pid) { return A.cashPending().filter(function (c) { return c.prov === pid; }).reduce(function (a, c) { return a + A.cashOwe(c); }, 0); };
  var CASH_ST = { pending: ['Chưa đối soát', 'To reconcile', 'warn'], recon: ['Đã đối soát', 'Reconciled', 'slate'], fail: ['Chưa thu được', 'Uncollected', 'danger'] };
  A.CASH_ST = CASH_ST;
  function cashOf(id) { return A.S.d.CASH.filter(function (c) { return c.order === id; })[0]; }
  function isoOf(dm) { return '2026-' + dm.slice(3, 5) + '-' + dm.slice(0, 2); }
  function cashRows() {
    var q = VN.fold(A.ui('cashQ', '')), t = A.ui('cashT', 'month'), st = A.ui('cashS', '');
    var week = ['24/09', '23/09', '22/09', '21/09', '20/09', '19/09', '18/09'];
    return A.S.d.CASH.filter(function (c) {
      var day = c.done.slice(0, 5);
      return (!q || VN.fold(c.order + ' ' + A.provName(c.prov) + ' ' + c.cust).indexOf(q) >= 0) && (!st || c.st === st) &&
        (t === 'all' || (t === 'month' && day.slice(3) === '09') || (t === '7d' && week.indexOf(day) >= 0) || (t === 'today' && day === '24/09'));
    });
  }
  function cashForm(c) { var k = 'cashF-' + c.order; if (!A.S.ui[k]) A.S.ui[k] = { amt: '', date: '2026-09-24', code: '', bank: '0', note: '', tried: false }; return A.S.ui[k]; }
  function cashErr(c, f) {
    var owe = A.cashOwe(c), e = {};
    if (!String(f.amt).trim()) e.amt = L('Nhập số tiền đã chuyển', 'Enter the amount transferred');
    else if (VN.parseMoney(f.amt) !== owe) e.amt = L('Khác số tiền nợ ' + VN.money(owe) + '. Phần chênh lệch ghi ở tab Bút toán điều chỉnh.', 'Differs from the ' + VN.money(owe) + ' owed. Record the difference under Adjustment entry.');
    if (!f.date) e.date = L('Chọn ngày chuyển khoản', 'Pick the transfer date');
    else if (f.date < isoOf(c.done) || f.date > '2026-09-24') e.date = L('Ngày chuyển khoản phải từ ngày hoàn thành đơn (' + c.done.slice(0, 5) + ') tới hôm nay', 'The transfer date must be between the completion date (' + c.done.slice(0, 5) + ') and today');
    if (!String(f.code).trim()) e.code = L('Nhập mã giao dịch trên sao kê ngân hàng', 'Enter the code shown on the bank statement');
    if (f.bank === '') e.bank = L('Chọn tài khoản nhận tiền', 'Pick the receiving account');
    return e;
  }
  function cashAdjForm(c) { var k = 'cashA-' + c.order; if (!A.S.ui[k]) A.S.ui[k] = { dir: '', amt: '', why: '', file: null, tried: false }; return A.S.ui[k]; }
  function cashAdjErr(c, g) {
    var p = A.prov(c.prov), amt = VN.parseMoney(g.amt), e = {};
    if (g.dir === '') e.dir = L('Chọn tăng hay giảm số dư', 'Choose increase or decrease');
    if (!amt) e.amt = L('Nhập số tiền điều chỉnh', 'Enter the adjustment amount');
    else if (g.dir === '-1' && amt > p.bal.avail) e.amt = L('Số tiền giảm vượt số dư Có thể rút (' + VN.money(p.bal.avail) + ')', 'Decrease exceeds the available balance (' + VN.money(p.bal.avail) + ')');
    if (String(g.why).trim().length < 10) e.why = L('Ghi rõ lý do, ít nhất 10 ký tự', 'Explain the reason, at least 10 characters');
    return e;
  }
  /* Ô nhập có nhãn, dấu bắt buộc và lỗi đặt ngay dưới ô */
  function fld(id, label, input, err, req) {
    return '<div class="field"><label for="' + id + '">' + label + (req === false ? '' : ' <span class="req">*</span>') + '</label>' + input + (err ? '<span class="err" id="' + id + '-e">' + err + '</span>' : '') + '</div>';
  }
  function bad(err, id) { return err ? ' bad" aria-invalid="true" aria-describedby="' + id + '-e' : ''; }
  function kvCard(rows) {
    return '<div style="background:var(--fill);border-radius:10px;padding:12px 14px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:7px 14px;font-size:13px;align-items:baseline">' +
      rows.map(function (r) { return '<span class="muted">' + r[0] + '</span><b style="font-weight:500;text-align:right;overflow-wrap:anywhere">' + r[1] + '</b>'; }).join('') + '</div>';
  }

  function cashTab() {
    var rows = cashRows(), sel = A.ui('cashSel', null);
    if (!rows.some(function (c) { return c.order === sel; })) { var first = rows.filter(function (c) { return c.st === 'pending'; })[0] || rows[0]; sel = first ? first.order : null; A.S.ui.cashSel = sel; }
    var total = A.cashPending().reduce(function (a, c) { return a + A.cashOwe(c); }, 0);
    var th = function (t, cls) { return '<th class="' + (cls || '') + '" style="padding:6px 10px;white-space:normal;line-height:1.3">' + t + '</th>'; };
    var td = function (t, cls) { return '<td class="' + (cls || '') + '" style="padding:0 10px">' + t + '</td>'; };
    var exDis = A.can('export') || A.can('cashRecon') ? '' : A.denyTip('export');
    var left = '<section class="card" style="overflow:hidden;min-width:0" aria-labelledby="cash-h"><div class="card-h" style="flex-direction:column;align-items:flex-start;gap:4px"><h2 id="cash-h">' + L('Đơn hàng tiền mặt chờ đối soát', 'Cash orders awaiting reconciliation') + '</h2>' +
      '<span class="muted" style="font-size:12px;font-style:italic">' + L('Kế toán tự đối chiếu với sao kê ngân hàng. Đối soát tự động: giai đoạn 2.', 'Accountants match bank statements by hand. Automatic matching: phase 2.') + '</span></div>' +
      '<div class="filters" style="padding:12px 16px">' +
      '<div class="search-box" style="flex:1 1 180px;width:auto">' + ic('magnifying-glass') + '<label class="sr" for="cash-q">' + L('Tìm', 'Search') + '</label><input id="cash-q" class="inp" data-in="uiset" data-k="cashQ" value="' + esc(A.ui('cashQ', '')) + '" placeholder="' + L('Tìm nhà cung cấp, mã đơn…', 'Provider, order ID…') + '"></div>' +
      sel_('cashT', [['month', L('Tháng này', 'This month')], ['7d', L('7 ngày', '7 days')], ['today', L('Hôm nay', 'Today')], ['all', L('Mọi thời gian', 'Any time')]], L('Thời gian', 'Time'), 'month') +
      sel_('cashS', [['', L('Tất cả', 'All')], ['pending', L(CASH_ST.pending[0], CASH_ST.pending[1])], ['recon', L(CASH_ST.recon[0], CASH_ST.recon[1])], ['fail', L(CASH_ST.fail[0], CASH_ST.fail[1])]], L('Trạng thái đối soát', 'Reconciliation status'), '') +
      A.btn(L('Xuất Excel', 'Export to Excel'), 'cashExport', { icon: 'download-simple', dis: exDis, tipPos: 'left' }) + '</div>' +
      '<div style="overflow-x:auto"><table class="tbl"><thead><tr>' + th(L('Mã đơn', 'Order')) + th(L('Nhà cung cấp · khách hàng', 'Provider · customer')) + th(L('Giá trị đơn', 'Order value'), 'num') + th(L('Hoa hồng', 'Commission'), 'num') + th(L('Số tiền nhà cung cấp nợ', 'Owed by provider'), 'num') + th(L('Ngày hoàn thành', 'Completed')) + th(L('Trạng thái đối soát', 'Status')) + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (c) {
        var on = c.order === sel;
        return '<tr id="cash-' + c.order + '" class="click' + (on ? ' sel' : '') + (c.fresh ? ' flash' : '') + '" tabindex="0" data-act="cashSel" data-id="' + c.order + '"' + (on ? ' aria-current="true"' : '') + '>' +
          td(c.order, 'id') + td('<span class="nw" style="font-weight:500">' + esc(A.provName(c.prov)) + '</span><div class="muted nw" style="font-size:12px">' + esc(c.cust) + '</div>') + td(VN.money(c.amount), 'num nw') + td(VN.money(A.split(c).comm), 'num nw') +
          td(c.st === 'fail' ? '<span class="muted">' + VN.money(0) + '</span>' : '<b style="font-weight:600">' + VN.money(A.cashOwe(c)) + '</b>', 'num nw') + td(c.done, 'muted nw') + td(A.badge(CASH_ST[c.st]), 'nw') + '</tr>';
      }).join('') : '<tr><td colspan="7">' + A.empty(L('Không có đơn tiền mặt khớp bộ lọc', 'No cash orders match'), L('Bỏ bớt bộ lọc hoặc tìm theo mã đơn.', 'Remove a filter or search by order ID.'), A.btn(L('Xoá bộ lọc', 'Clear filters'), 'cashClear')) + '</td></tr>') +
      '</tbody></table></div><div class="tbl-foot"><b style="color:var(--warn);font-weight:700;font-size:13px">' + L('Tổng số tiền chờ đối soát: ', 'Total awaiting reconciliation: ') + VN.money(total) + '</b><span>' + L(rows.length + ' đơn', rows.length + ' orders') + '</span></div></section>';
    var c = sel ? cashOf(sel) : null, anim = A.S.ui.cashAnim;
    var right = '<section class="card" style="min-width:0' + (anim ? ';animation:slide .15s var(--ease)' : '') + '" aria-labelledby="cp-h">' + (c ? cashPanel(c, A.ui('cashTab', 'rec')) : A.empty(L('Chưa chọn đơn', 'No order selected'), L('Chọn một đơn ở bảng bên trái để xem chi tiết và ghi nhận chuyển khoản.', 'Pick an order on the left to see details and record the transfer.'), '', 'hand-coins')) + '</section>';
    if (anim) A.mounts.push(function () { A.S.ui.cashAnim = false; });
    A.mounts.push(function () {
      var z = document.getElementById('ca-drop'); if (!z) return;
      z.addEventListener('dragover', function (e) { e.preventDefault(); });
      z.addEventListener('drop', function (e) { e.preventDefault(); var f = e.dataTransfer && e.dataTransfer.files[0]; if (f) setFile(f.name, f.size); });
    });
    return '<div style="display:grid;grid-template-columns:minmax(0,1.85fr) minmax(360px,1fr);gap:16px;align-items:start">' + left + right + '</div>';
  }
  function sel_(k, opts, label, def) {
    var v = A.ui(k, def);
    return '<label class="sr" for="s-' + k + '">' + label + '</label><select id="s-' + k + '" class="sel" style="min-width:118px" data-in="uiset" data-k="' + k + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (v === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
  }
  function cashPanel(c, tab) {
    var p = A.prov(c.prov), sp = A.split(c), owe = A.cashOwe(c), debt = A.cashDebt(c.prov);
    var tabs = '<div style="padding:16px 20px 0"><div class="tabs sub" role="tablist" aria-label="' + L('Thao tác đối soát', 'Reconciliation actions') + '">' +
      [['rec', L('Ghi nhận chuyển khoản', 'Record transfer')], ['adj', L('Bút toán điều chỉnh', 'Adjustment entry')]].map(function (t) { var on = tab === t[0]; return '<button type="button" role="tab" aria-selected="' + on + '" class="' + (on ? 'on' : '') + '" data-act="cashTab" data-id="' + t[0] + '"' + (t[0] === 'adj' && !on ? ' style="color:var(--muted);font-weight:400"' : '') + '>' + t[1] + '</button>'; }).join('') + '</div></div>';
    var head = '<div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><h2 id="cp-h" style="margin:0;font-size:18px;font-weight:600">' + esc(p.name) + '</h2>' + A.badge(CASH_ST[c.st]) + '</div>' +
      '<div class="muted" style="font-size:12.5px;margin-top:4px">' + L('Đơn ', 'Order ') + (A.order(c.order) ? A.ordLink(c.order, 'money') : '<span class="mono">' + c.order + '</span>') + ' · ' + esc(c.cust) + ' · ' + L('hoàn thành ', 'completed ') + c.done + '</div></div>';
    var body;
    if (tab === 'adj') {
      var g = cashAdjForm(c), ge = g.tried ? cashAdjErr(c, g) : {};
      body = head + '<p class="muted" style="margin:0;font-size:13px;font-style:italic;line-height:1.5">' + L('Dùng khi số tiền chuyển khoản không khớp với số tiền nợ, hoặc cần điều chỉnh do lỗi nhập liệu đã duyệt.', 'Use when a transfer does not match the amount owed, or to correct an approved data-entry error.') + '</p>' +
        fld('ca-t', L('Loại điều chỉnh', 'Adjustment type'), '<select id="ca-t" class="sel' + bad(ge.dir, 'ca-t') + '" data-in="cashA" data-k="dir"><option value="">' + L('Chọn loại', 'Select a type') + '</option><option value="1"' + (g.dir === '1' ? ' selected' : '') + '>' + L('Tăng số dư', 'Increase balance') + '</option><option value="-1"' + (g.dir === '-1' ? ' selected' : '') + '>' + L('Giảm số dư', 'Decrease balance') + '</option></select>', ge.dir) +
        fld('ca-a', L('Số tiền điều chỉnh', 'Adjustment amount'), '<div class="inp-wrap"><input id="ca-a" class="inp mono' + bad(ge.amt, 'ca-a') + '" inputmode="numeric" data-in="cashA" data-k="amt" value="' + esc(g.amt) + '" placeholder="0"><span class="suffix">₫</span></div>', ge.amt) +
        fld('ca-r', L('Lý do bắt buộc', 'Reason, required'), '<textarea id="ca-r" class="txa' + bad(ge.why, 'ca-r') + '" rows="3" maxlength="300" data-in="cashA" data-k="why" placeholder="' + L('Mô tả lý do điều chỉnh (bắt buộc ghi rõ)…', 'Describe why this adjustment is needed…') + '">' + esc(g.why) + '</textarea>', ge.why) +
        '<div class="field"><span class="flabel">' + L('Tài liệu đính kèm', 'Attachment') + '</span>' + (g.file ? '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:10px">' + ic('paperclip') + '<span style="flex:1;min-width:0;overflow-wrap:anywhere;font-size:13px">' + esc(g.file[0]) + ' <span class="muted">· ' + VN.num(Math.max(1, Math.round(g.file[1] / 1024))) + ' KB</span></span><button type="button" class="xbtn" data-act="cashUnfile" data-id="' + c.order + '" aria-label="' + L('Bỏ tệp', 'Remove file') + '">' + ic('x') + '</button></div>' :
          '<label id="ca-drop" class="photo empty-ph" for="ca-f" tabindex="0" data-act="cashPick" style="min-height:76px;flex-direction:column;gap:6px;cursor:pointer;text-align:center;padding:12px">' + ic('upload-simple') + L('Kéo thả hoặc chọn file (PDF, ảnh)', 'Drag and drop, or choose a file (PDF, image)') + '</label><input id="ca-f" type="file" accept=".pdf,image/*" class="sr" tabindex="-1" data-in="cashFile">') + '</div>' +
        '<div style="display:flex;align-items:center;gap:12px">' + A.btn(L('Lưu bút toán', 'Save entry'), 'cashAdjSave', { id: c.order, dis: A.denyTip('adjCreate') }) + '</div>' +
        '<p class="muted" style="margin:0;font-size:12px">' + L('Bút toán cần người khác duyệt bước hai ở tab Điều chỉnh sổ cái. Không sửa, không xoá bút toán cũ.', 'Entries need a second approver under Ledger adjustments. Old entries are never edited or deleted.') + '</p>';
    } else if (c.st === 'pending') {
      var f = cashForm(c), e = f.tried ? cashErr(c, f) : {};
      body = head + '<div><div style="font-weight:600;color:var(--info);font-size:14.5px">' + L('Số tiền cần chuyển về: ', 'Amount to transfer back: ') + VN.money(owe) + '</div>' +
        '<div class="muted" style="font-size:12.5px;margin-top:3px">' + L('Hoa hồng 15% ', '15% commission ') + VN.money(sp.comm) + ' · ' + L('thuế khấu trừ 2% ', '2% tax withheld ') + VN.money(sp.tax) + ' · ' + L('mã tham chiếu ', 'reference ') + '<span class="mono">' + c.ref + '</span></div></div>' +
        '<div style="border-top:1px solid var(--line)"></div>' +
        kvCard([[L('Tài khoản nhà cung cấp', 'Provider account'), '<span class="mono">' + esc(p.bank.name) + ' •••• ' + p.bank.no + '</span>'],
          [L('Công nợ tiền mặt', 'Cash debt'), '<span class="mono" style="color:var(--danger);display:inline-flex;align-items:center;gap:6px">' + ic('warning-circle') + VN.money(-debt) + '</span>'],
          [L('Có thể rút sau khi trừ nợ', 'Available after debt'), '<span class="mono">' + VN.money(p.bal.avail - debt) + '</span>']]) +
        '<h3 style="margin:2px 0 0;font-size:14px;font-weight:600">' + L('Xác nhận nhà cung cấp đã chuyển khoản', 'Confirm the provider has transferred') + '</h3>' +
        fld('cf-a', L('Số tiền đã chuyển', 'Amount transferred'), '<div class="inp-wrap"><input id="cf-a" class="inp mono' + bad(e.amt, 'cf-a') + '" inputmode="numeric" data-in="cashF" data-k="amt" value="' + esc(f.amt) + '" placeholder="' + VN.num(owe) + '"><span class="suffix">₫</span></div>', e.amt) +
        fld('cf-d', L('Ngày chuyển khoản', 'Transfer date'), '<input id="cf-d" type="date" class="inp' + bad(e.date, 'cf-d') + '" min="' + isoOf(c.done) + '" max="2026-09-24" value="' + esc(f.date) + '" data-in="cashF" data-k="date">', e.date) +
        fld('cf-c', L('Mã giao dịch ngân hàng', 'Bank transaction code'), '<input id="cf-c" class="inp mono' + bad(e.code, 'cf-c') + '" autocomplete="off" data-in="cashF" data-k="code" value="' + esc(f.code) + '" placeholder="FT26267XXXXXX">', e.code) +
        fld('cf-b', L('Ngân hàng thụ hưởng', 'Receiving account'), '<select id="cf-b" class="sel' + bad(e.bank, 'cf-b') + '" data-in="cashF" data-k="bank"><option value="0"' + (f.bank === '0' ? ' selected' : '') + '>Techcombank · 1234 5678 910</option></select><span class="hint">' + L('Tài khoản công ty VN Group', 'VN Group company account') + '</span>', e.bank) +
        fld('cf-n', L('Ghi chú', 'Note'), '<textarea id="cf-n" class="txa" rows="2" style="min-height:58px" maxlength="300" data-in="cashF" data-k="note" placeholder="' + L('Ghi chú thêm nếu có…', 'Anything else worth noting…') + '">' + esc(f.note) + '</textarea>', '', false) +
        '<div style="display:flex;align-items:center;gap:16px">' + A.btn(L('Xác nhận đối soát', 'Confirm reconciliation'), 'cashGo', { cls: 'primary', id: c.order, dis: A.denyTip('cashRecon') }) + '<button type="button" class="link" data-act="cashReset" data-id="' + c.order + '">' + L('Huỷ', 'Cancel') + '</button></div>' +
        '<p class="muted" style="margin:0;font-size:12px;font-style:italic;line-height:1.5">' + L('Sau khi xác nhận, công nợ tiền mặt của ' + p.name + ' giảm từ ' + VN.money(debt) + ' về ' + VN.money(debt - owe) + '. Thao tác được ghi vào Nhật ký và không hoàn tác được.', 'Once confirmed, ' + p.name + '\'s cash debt drops from ' + VN.money(debt) + ' to ' + VN.money(debt - owe) + '. The action is logged and cannot be undone.') + '</p>';
    } else if (c.st === 'recon') {
      var pd = c.paid;
      body = head + (c.fresh ? '<div class="note ok">' + ic('check-circle') + '<span><b>' + L('Đã ghi nhận thành công.', 'Recorded successfully.') + '</b> ' + L('Công nợ tiền mặt của ' + p.name + ': ', p.name + ' cash debt: ') + VN.money(debt) + '</span></div>' : '') +
        kvCard([[L('Số tiền đã chuyển', 'Amount transferred'), '<span class="mono">' + VN.money(pd.amount) + '</span>'], [L('Ngày chuyển khoản', 'Transfer date'), pd.date], [L('Mã giao dịch ngân hàng', 'Bank transaction code'), '<span class="mono">' + esc(pd.bank) + '</span>'],
          [L('Ngân hàng thụ hưởng', 'Receiving account'), L(D.CASH_BANK[0], D.CASH_BANK[1])], [L('Mã tham chiếu', 'Reference'), '<span class="mono">' + c.ref + '</span>'], [L('Ghi nhận bởi', 'Recorded by'), esc(pd.by) + ' · ' + pd.at]].concat(pd.note ? [[L('Ghi chú', 'Note'), esc(pd.note)]] : [])) +
        '<p class="muted" style="margin:0;font-size:12px;line-height:1.5">' + L('Bút toán đã khoá, không sửa, không xoá. Sai lệch phát hiện sau này ghi ở tab Bút toán điều chỉnh.', 'This entry is locked. Differences found later go under Adjustment entry.') + '</p>';
    } else {
      body = head + '<div class="note danger">' + ic('warning-circle') + '<span>' + L('Kỹ thuật viên ' + c.tech + ' báo không thu được tiền mặt lúc ' + c.done + '. ', 'Technician ' + c.tech + ' reported no cash collected at ' + c.done + '. ') + L(c.why[0], c.why[1]) + '.</span></div>' +
        '<div class="note neutral">' + ic('info') + '<span>' + L('Nhà cung cấp không nợ khoản này. Đơn chuyển sang Chờ khách thanh toán và được đôn đốc như đơn trả qua app chưa thanh toán.', 'The provider owes nothing here. The order moves to Awaiting customer payment and is followed up like an unpaid app order.') + '</span></div>' +
        (A.order(c.order) ? '<div>' + A.btn(L('Mở đôn đốc thanh toán', 'Open payment follow-up'), 'dunOpen', { id: c.order, icon: 'phone', dis: A.denyTip('dunNote') }) + '</div>' : '');
    }
    return tabs + '<div class="card-b" style="display:flex;flex-direction:column;gap:14px">' + body + '</div>';
  }
  function focusBad() { var b = document.querySelector('.content .inp.bad, .content .sel.bad, .content .txa.bad'); if (b) b.focus(); }
  function setFile(name, size) { var c = cashOf(A.S.ui.cashSel); if (!c) return; cashAdjForm(c).file = [name, size || 0]; A.render(); }
  ACT.cashSel = function (el) { if (A.S.ui.cashSel !== el.dataset.id) { A.S.ui.cashSel = el.dataset.id; A.S.ui.cashAnim = true; } A.render(); };
  ACT.cashTab = function (el) { A.S.ui.cashTab = el.dataset.id; A.render(); };
  ACT.cashClear = function () { A.S.ui.cashQ = ''; A.S.ui.cashS = ''; A.S.ui.cashT = 'month'; A.render(); };
  ACT.cashReset = function (el) { delete A.S.ui['cashF-' + el.dataset.id]; A.render(); };
  ACT.cashPick = function () { var i = document.getElementById('ca-f'); if (i) i.click(); };
  ACT.cashUnfile = function (el) { var c = cashOf(el.dataset.id); if (c) cashAdjForm(c).file = null; A.render(); };
  /* Ô nhập của form: chỉ vẽ lại khi đang hiện lỗi để lỗi mất ngay khi sửa đúng */
  A.IN.cashF = function (el, v) { var c = cashOf(A.S.ui.cashSel); if (!c) return; var f = cashForm(c); f[el.dataset.k] = v; if (f.tried || el.tagName === 'SELECT') A.render(); };
  A.IN.cashA = function (el, v) { var c = cashOf(A.S.ui.cashSel); if (!c) return; var g = cashAdjForm(c); g[el.dataset.k] = v; if (g.tried || el.tagName === 'SELECT') A.render(); };
  A.IN.cashFile = function (el) { var f = el.files && el.files[0]; if (f) setFile(f.name, f.size); };
  /* Bước 1: kiểm đủ ô bắt buộc. Thiếu thì tô đỏ, không gửi. Đủ thì mở hộp xác nhận (bước 2) */
  ACT.cashGo = function (el) {
    if (!A.can('cashRecon')) { A.toast(A.denyTip('cashRecon'), 'err'); return; }
    var c = cashOf(el.dataset.id); if (!c || c.st !== 'pending') return;
    var f = cashForm(c); f.tried = true;
    if (Object.keys(cashErr(c, f)).length) { A.render(); focusBad(); return; }
    A.openModal('cashConfirm', { id: c.order });
  };
  M.cashConfirm = function (m) {
    var c = cashOf(m.id), p = A.prov(c.prov), f = cashForm(c), owe = A.cashOwe(c), debt = A.cashDebt(c.prov), d = f.date.split('-');
    return modalShell(L('Xác nhận đối soát ', 'Confirm reconciliation ') + c.order, esc(p.name) + ' · ' + VN.money(owe) + ' · <span class="mono">' + esc(f.code.trim()) + '</span>',
      '<div class="kv" tabindex="-1" autofocus style="grid-template-columns:1fr 1fr;outline:0"><div><span>' + L('Ngày chuyển khoản', 'Transfer date') + '</span><b>' + d[2] + '/' + d[1] + '/' + d[0] + '</b></div><div><span>' + L('Mã tham chiếu', 'Reference') + '</span><b class="mono">' + c.ref + '</b></div><div style="grid-column:1/-1"><span>' + L('Ngân hàng thụ hưởng', 'Receiving account') + '</span><b>' + L(D.CASH_BANK[0], D.CASH_BANK[1]) + '</b></div></div>' +
      A.impact(L('Tác động lên số dư · ', 'Balance impact · ') + esc(p.name), [[L('Công nợ tiền mặt', 'Cash debt'), -debt, -(debt - owe)], [L('Có thể rút sau khi trừ nợ', 'Available after debt'), p.bal.avail - debt, p.bal.avail - debt + owe]]) +
      '<div class="note warn">' + ic('warning') + '<span>' + L('<b>Bước 2/2.</b> Thao tác được ghi vào Nhật ký và không hoàn tác được.', '<b>Step 2/2.</b> The action is logged and cannot be undone.') + '</span></div>',
      A.btn(L('Xác nhận đối soát', 'Confirm reconciliation'), 'cashCommit', { cls: 'primary', id: c.order }));
  };
  ACT.cashCommit = function () {
    var m = A.S.modal, c = m && cashOf(m.id);
    if (!c || c.st !== 'pending' || !A.can('cashRecon')) { A.S.modal = null; A.render(); A.toast(A.denyTip('cashRecon') || L('Đơn này đã được đối soát', 'Already reconciled'), 'err'); return; }
    var f = cashForm(c), p = A.prov(c.prov), owe = A.cashOwe(c), d = f.date.split('-');
    A.S.d.CASH.forEach(function (x) { x.fresh = false; });
    c.st = 'recon'; c.fresh = true; c.paid = { amount: owe, date: d[2] + '/' + d[1] + '/' + d[0], bank: f.code.trim(), note: f.note.trim(), by: A.me(), at: '24/09 ' + VN.nowTime() };
    A.S.d.TXNS.forEach(function (t) { if (t[0] === c.txn) t[4] = 'cashRecon'; });
    var o = A.order(c.order); if (o && o.money === 'cashPend') o.money = 'cashRecon';
    A.book(c.prov, 'cash', ['Nhận chuyển khoản trả công nợ tiền mặt ' + c.order, 'Cash debt transfer received ' + c.order], ['debt', ''], owe, c.paid.bank);
    A.log(L('Ghi nhận chuyển khoản tiền mặt', 'Recorded cash transfer'), c.order + ' · ' + c.paid.bank);
    delete A.S.ui['cashF-' + c.order];
    A.S.modal = null; A.S.ui.cashTab = 'rec'; A.render();
    flash(L('Đối soát thành công: ' + c.order + ' · ' + p.name, 'Reconciled: ' + c.order + ' · ' + p.name));
  };
  ACT.cashAdjSave = function (el) {
    if (!A.can('adjCreate')) { A.toast(A.denyTip('adjCreate'), 'err'); return; }
    var c = cashOf(el.dataset.id); if (!c) return;
    var g = cashAdjForm(c); g.tried = true;
    if (Object.keys(cashAdjErr(c, g)).length) { A.render(); focusBad(); return; }
    var id = 'DC-09' + (24 + A.S.d.ADJUSTS.length), why = String(g.why).trim();
    A.S.d.ADJUSTS.forEach(function (a) { a.fresh = false; });
    A.S.d.ADJUSTS.unshift({ id: id, prov: c.prov, pocket: 'avail', dir: +g.dir, amount: VN.parseMoney(g.amt), reason: [why, why], link: c.order, st: 'pending', by: A.me(), at: '24/09 ' + VN.nowTime(), fresh: true, note: g.file ? g.file[0] : '' });
    A.log(L('Tạo bút toán điều chỉnh từ đối soát tiền mặt', 'Created adjustment from cash reconciliation'), id + ' · ' + c.order);
    delete A.S.ui['cashA-' + c.order]; A.render();
    flash(L('Đã ghi bút toán điều chỉnh ' + id + ', chờ duyệt bước hai ở tab Điều chỉnh sổ cái', 'Adjustment ' + id + ' saved, awaiting step-two approval under Ledger adjustments'));
  };
  ACT.cashExport = function () {
    if (!A.can('export') && !A.can('cashRecon')) { A.toast(A.denyTip('export'), 'err'); return; }
    var rows = [[L('Mã đơn', 'Order'), L('Nhà cung cấp', 'Provider'), L('Khách hàng', 'Customer'), L('Giá trị đơn', 'Order value'), L('Hoa hồng', 'Commission'), L('Thuế khấu trừ', 'Tax withheld'), L('Số tiền nhà cung cấp nợ', 'Owed by provider'), L('Ngày hoàn thành', 'Completed'), L('Trạng thái đối soát', 'Status'), L('Mã tham chiếu', 'Reference'), L('Mã giao dịch ngân hàng', 'Bank transaction')]].concat(cashRows().map(function (c) {
      var sp = A.split(c); return [c.order, A.provName(c.prov), c.cust, c.amount, sp.comm, sp.tax, A.cashOwe(c), c.done, L(CASH_ST[c.st][0], CASH_ST[c.st][1]), c.ref, c.paid ? c.paid.bank : ''];
    }));
    var name = 'VuongNhan_DoiSoatTienMat_20260924.xls';
    VN.download(name, VN.xls([{ name: L('Tiền mặt', 'Cash'), rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    A.log(L('Xuất file đối soát tiền mặt', 'Exported cash reconciliation'), name); flash(L('Đã tạo file ', 'File created: ') + name);
  };
  /* Kịch bản 17: VN-240931 (đơn dùng chung của 3 app) hoàn tất bằng tiền mặt lúc 10:42, lên đầu bảng và được chọn sẵn */
  A.SETUP.cash31 = function () {
    var d = A.S.d, o = A.order('VN-240931');
    if (o && !cashOf('VN-240931')) {
      d.CASH.unshift({ order: 'VN-240931', prov: 'phucan', cust: o.cust, tech: o.tech, amount: o.amount, done: '24/09 10:42', st: 'pending', txn: 'GD-88481', ref: 'RT-CM-0042' });
      d.TXNS.unshift(['GD-88481', 'VN-240931', o.amount, 'cash', 'cashPend', '24/09 10:42']);
      o.status = 'done'; o.money = 'cashPend'; o.payMethod = 'cash'; o.accepted = '24/09 10:40'; o.paidAt = '24/09 10:42'; o.txn = 'GD-88481'; o.warrantyEnd = '01/10'; o.upd = 0;
      o.ev = (o.ev || []).concat([['10:38', ['Kỹ thuật viên gửi bảng chốt khối lượng', 'Technician sent the sign-off sheet']], ['10:40', ['Khách nghiệm thu', 'Customer signed off']], ['10:42', ['Kỹ thuật viên xác nhận đã thu 450.000 ₫ tiền mặt · GD-88481', 'Technician confirmed 450,000 ₫ cash collected · GD-88481']]]);
      var sp = A.split(o);
      A.book('phucan', 'cash', ['Thu tiền mặt VN-240931, ghi công nợ hoa hồng và thuế', 'Cash collected VN-240931, commission and tax owed'], ['', 'debt'], -(sp.comm + sp.tax), 'RT-CM-0042');
    }
    A.S.ui.cashSel = 'VN-240931'; A.S.ui.cashTab = 'rec'; A.S.ui.cashQ = ''; A.S.ui.cashS = ''; A.S.ui.cashT = 'month';
  };

  /* ---------- Tiền của đơn (B) ---------- */
  A.P.ordermoney = {
    nav: 'transactions',
    crumb: function () { return [[L('Giao dịch & đối soát', 'Transactions'), 'transactions'], [L('Tiền của đơn', 'Order money')], [A.S.p.id]]; },
    render: function () {
      var o = A.order(A.S.p.id);
      if (!o) return '<div class="card">' + A.empty(L('Không tìm thấy đơn ', 'Order not found: ') + esc(A.S.p.id), L('Đơn này nằm ngoài dữ liệu mẫu của prototype.', 'This order is outside the prototype sample.')) + '</div>';
      var s = A.split(o), p = A.prov(o.prov);
      var holdDis = !A.can('hold') ? A.denyTip('hold') : o.money !== 'warranty' ? L('Chỉ tạm giữ được tiền đang trong thời gian bảo hành', 'Only funds in warranty can be held') : '';
      var h = '<div class="page-h"><div><h1><span>' + L('Tiền của đơn', 'Order money') + '</span><span class="mono" style="font-size:16px;color:var(--text)">' + o.id + '</span>' + A.moneyBadge(o, true) + '</h1><div class="sub">' + L(o.svc[0], o.svc[1]) + ' · ' + esc(o.cust) + ' · ' + (p ? A.provLink(p.id) : L('Không có', 'None')) + (A.sees('orders') ? ' · <button type="button" class="link" data-act="goOrder" data-id="' + o.id + '">' + L('Xem đơn hàng', 'View order') + '</button>' : '') + '</div></div>' +
        '<div class="acts">' + A.btn(L('Tạm giữ tiền', 'Hold funds'), 'holdOpen', { id: o.id, icon: 'lock-simple', dis: holdDis, tipPos: 'left' }) +
        '<div style="position:relative">' + A.btn(L('Thao tác khác', 'More actions'), 'menu', { id: 'more-' + o.id, caret: true }) + (A.S.menu === 'more-' + o.id ? moreMenu(o) : '') + '</div></div></div>';
      h += '<div class="audit-note">' + L('Mọi thao tác tiền cần lý do và được ghi vào Nhật ký. Bút toán không sửa, không xoá.', 'Every money action needs a reason and is logged. Entries are never edited or deleted.') + '</div>';
      h += '<div class="grid2"><div class="stack"><section class="card" aria-labelledby="mt-h"><div class="card-h"><h2 id="mt-h">' + L('Dòng tiền', 'Money timeline') + '</h2></div><div class="card-b">' + moneyTimeline(o, s) + '</div></section>' +
        '<section class="card" aria-labelledby="je-h"><div class="card-h" style="padding-bottom:12px"><h2 id="je-h">' + L('Bút toán', 'Journal entries') + '</h2><span class="muted" style="font-size:12px">' + L('Chỉ thêm, không sửa', 'Append-only') + '</span></div>' + journal(o, s) + '</section></div>' +
        '<div class="stack"><section class="card" aria-labelledby="cost-h"><div class="card-h"><h2 id="cost-h">' + L('Chi phí', 'Charges') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:6px">' +
        (o.lines || [[[L('Giá dịch vụ', 'Service price'), 'Service price'], o.amount]]).map(function (l) { return '<div class="row-kv"><span>' + L(l[0][0], l[0][1]) + '</span><b>' + VN.money(l[1]) + '</b></div>'; }).join('') +
        '<div class="row-kv" style="border-top:1px solid var(--line);padding-top:10px;margin-top:4px;font-weight:600"><span style="color:var(--text)">' + L('Khách trả', 'Customer paid') + '</span><b style="font-weight:600">' + VN.money(o.amount) + '</b></div>' +
        (o.refunded ? '<div class="row-kv"><span>' + L('Đã hoàn cho khách', 'Refunded to customer') + '</span><b style="color:var(--danger)">−' + VN.money(o.refunded) + '</b></div>' : '') +
        '<div class="row-kv"><span>' + L('Hoa hồng nền tảng 15%', 'Platform commission 15%') + '</span><b>' + VN.money(s.comm) + '</b></div><div class="row-kv"><span>' + L('Thuế khấu trừ 2%', 'Tax withheld 2%') + ' <span class="assume">' + L('Giả định', 'Assumed') + '</span></span><b>' + VN.money(s.tax) + '</b></div>' +
        '<div class="row-kv" style="border-top:1px solid var(--line);padding-top:10px;margin-top:4px"><span style="color:var(--text);font-weight:600">' + L('Nhà cung cấp nhận', 'Provider receives') + '</span><b style="font-weight:600">' + VN.money(s.share - R((o.refunded || 0) * 0.83)) + '</b></div></div></section>' +
        '<section class="card" aria-labelledby="par-h"><div class="card-h"><h2 id="par-h">' + L('Tham số áp dụng khi tạo đơn, đã chốt', 'Parameters frozen at order creation') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:6px">' +
        [[L('Hoa hồng', 'Commission'), '15% · ' + A.catName(o.cat) + ' · TP.HCM'], [L('Thuế khấu trừ', 'Tax withheld'), '2%'], [L('Thời gian bảo hành', 'Warranty period'), (A.cat(o.cat).warranty) + L(' ngày', ' days')], [L('Hạn thanh toán sau nghiệm thu', 'Payment due after sign-off'), L('24 giờ', '24 h')], [L('Ngưỡng hoàn tiền cần duyệt', 'Refund approval threshold'), VN.money(D.REFUND_THRESHOLD)], [L('Hiệu lực bảng tham số', 'Parameter set effective'), '01/03/2026']].map(function (r) { return '<div class="row-kv"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') +
        '<span class="muted" style="font-size:12px;margin-top:6px">' + L('Đổi tham số sau này không ảnh hưởng đơn đã tạo.', 'Later parameter changes do not affect this order.') + '</span></div></section></div></div>';
      return h;
    }
  };
  function moreMenu(o) {
    var refDis = !A.can('refundCreate') ? A.denyTip('refundCreate') : (o.payMethod === 'cash' && o.paidAt) ? L('Đơn trả tiền mặt: nền tảng không giữ tiền của khách để hoàn', 'Cash order: the platform holds no customer funds to refund') : (o.money === 'none' || o.money === 'awaiting') ? L('Khách chưa thanh toán nên không có tiền để hoàn', 'Customer has not paid, nothing to refund') : o.money === 'refunded' ? L('Đơn đã hoàn toàn bộ', 'Already fully refunded') : '';
    return '<div class="menu" style="right:0;top:42px;width:280px"><button type="button" data-act="adjFromOrder" data-id="' + o.id + '"' + (A.can('adjCreate') ? '' : ' aria-disabled="true"') + '>' + L('Tạo điều chỉnh', 'Create adjustment') + (A.can('adjCreate') ? '' : '<small>' + A.denyTip('adjCreate') + '</small>') + '</button><hr>' +
      '<button type="button" class="dz" data-act="refundOpen" data-id="' + o.id + '"' + (refDis ? ' aria-disabled="true"' : '') + '>' + L('Hoàn tiền', 'Refund') + (refDis ? '<small>' + refDis + '</small>' : '') + '</button></div>';
  }
  function moneyTimeline(o, s) {
    var ev = [];
    if (o.accepted) ev.push(['done', L('Khách nghiệm thu', 'Customer signed off'), o.accepted]);
    if (o.cashFail) ev.push(['red', L('Kỹ thuật viên báo chưa thu được tiền mặt', 'Technician reported cash not collected'), o.cashFail]);
    if (o.money === 'none') ev.push(['now', L('Chưa phát sinh tiền: đơn chưa nghiệm thu', 'No money yet: not signed off'), '']);
    if (o.money === 'awaiting') ev.push(['now', L('Chờ khách thanh toán ', 'Awaiting payment of ') + VN.money(o.amount), o.overdueDays ? L('quá hạn ' + o.overdueDays + ' ngày', o.overdueDays + ' days overdue') : '']);
    if (o.paidAt && o.payMethod === 'cash') {
      var cc = cashOf(o.id), ow = s.comm + s.tax;
      ev.push(['done', L('Khách trả ', 'Customer paid ') + VN.money(o.amount) + L(' tiền mặt cho kỹ thuật viên · ', ' in cash to the technician · ') + (o.txn || ''), o.paidAt]);
      ev.push(['done', L('Công nợ của nhà cung cấp: hoa hồng ', 'Provider owes: commission ') + VN.money(s.comm) + L(' + thuế ', ' + tax ') + VN.money(s.tax) + ' = ' + VN.money(ow) + (cc && cc.ref ? ' · <span class="nw">' + cc.ref + '</span>' : ''), o.paidAt]);
      if (cc && cc.st === 'recon') ev.push(['done', L('Kế toán ghi nhận chuyển khoản ', 'Transfer recorded ') + esc(cc.paid.bank) + ' · ' + esc(cc.paid.by), cc.paid.at]);
      else ev.push(['now', L('Chờ nhà cung cấp chuyển khoản ', 'Awaiting provider transfer of ') + VN.money(ow), '']);
    } else if (o.paidAt) {
      ev.push(['done', L('Khách thanh toán ', 'Customer paid ') + VN.money(o.amount) + L(' qua ', ' via ') + L(D.PAY_METHOD[o.payMethod][0], D.PAY_METHOD[o.payMethod][1]).toLowerCase() + ' · ' + (o.txn || ''), o.paidAt]);
      ev.push(['done', L('Tách tiền: hoa hồng ', 'Split: commission ') + VN.money(s.comm) + L(' (tạm tính), thuế ', ' (provisional), tax ') + VN.money(s.tax) + L(', nhà cung cấp ', ', provider ') + VN.money(s.share), o.paidAt]);
    }
    (o.mev || []).forEach(function (e) { ev.push(['done', e[1], e[0] + ' · ' + esc(e[2])]); });
    if (o.money === 'warranty') { ev.push(['now', L('Đang bảo hành, tiền của nhà cung cấp được giữ', 'In warranty, provider funds held'), L('đến ', 'until ') + o.warrantyEnd]); ev.push(['todo', L('Có thể rút', 'Available to withdraw'), o.warrantyEnd]); ev.push(['todo', L('Đã chi cho nhà cung cấp', 'Paid out to provider'), '']); }
    if (o.money === 'hold') { ev.push(['red', L('Tạm giữ do khiếu nại ', 'Held for dispute ') + (o.dispute || ''), '23/09 18:20']); ev.push(['todo', L('Chờ phán quyết: trả lại hoặc hoàn tiền', 'Awaiting ruling: release or refund'), '']); }
    if (o.money === 'available') { ev.push(['done', L('Hết bảo hành, có thể rút', 'Warranty ended, available'), o.warrantyEnd]); ev.push(['todo', L('Đã chi cho nhà cung cấp', 'Paid out to provider'), '']); }
    if (o.money === 'paid') { ev.push(['done', L('Hết bảo hành, chuyển sang Có thể rút', 'Warranty ended, available'), o.warrantyEnd]); ev.push(['done', L('Đã chi cho nhà cung cấp trong lô ', 'Paid out in batch ') + o.batch, o.paidOut]); }
    if (o.money === 'refunded') ev.push(['done', L('Đã hoàn toàn bộ cho khách', 'Fully refunded to customer'), '']);
    return '<div class="tl">' + ev.map(function (e) { return '<div class="tl-i ' + e[0] + '"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + e[1] + '</span><span class="tm">' + e[2] + '</span></div>'; }).join('') + '</div>';
  }
  function journal(o, s) {
    var rows = [];
    if (o.paidAt && o.payMethod === 'cash') {
      var cj = cashOf(o.id);
      rows.push(['BT-' + o.id.slice(3) + '-1', o.paidAt, L('Thu tiền mặt qua kỹ thuật viên', 'Cash collected by the technician'), L('Nhà cung cấp giữ tiền mặt', 'Cash held by provider'), o.amount]);
      rows.push(['BT-' + o.id.slice(3) + '-2', o.paidAt, L('Hoa hồng tạm tính', 'Provisional commission'), L('Doanh thu nền tảng', 'Platform revenue'), s.comm]);
      rows.push(['BT-' + o.id.slice(3) + '-3', o.paidAt, L('Thuế khấu trừ', 'Tax withheld'), L('Thuế phải nộp', 'Tax payable'), s.tax]);
      rows.push(['BT-' + o.id.slice(3) + '-4', o.paidAt, L('Công nợ tiền mặt', 'Cash debt'), L('Phải thu nhà cung cấp', 'Receivable from provider'), s.comm + s.tax]);
      if (cj && cj.st === 'recon') rows.push(['BT-' + o.id.slice(3) + '-5', cj.paid.at, L('Nhận chuyển khoản ', 'Transfer received ') + esc(cj.paid.bank), L('Phải thu nhà cung cấp → Tiền gửi ngân hàng', 'Receivable → Bank'), -(s.comm + s.tax)]);
    } else if (o.paidAt) {
      rows.push(['BT-' + o.id.slice(3) + '-1', o.paidAt, L('Thu tiền khách', 'Customer payment'), L('Tiền khách trả', 'Customer funds'), o.amount]);
      rows.push(['BT-' + o.id.slice(3) + '-2', o.paidAt, L('Hoa hồng tạm tính', 'Provisional commission'), L('Doanh thu nền tảng', 'Platform revenue'), s.comm]);
      rows.push(['BT-' + o.id.slice(3) + '-3', o.paidAt, L('Thuế khấu trừ', 'Tax withheld'), L('Thuế phải nộp', 'Tax payable'), s.tax]);
      rows.push(['BT-' + o.id.slice(3) + '-4', o.paidAt, L('Phần nhà cung cấp', 'Provider share'), L('Đang bảo hành', 'In warranty'), s.share]);
    }
    if (o.money === 'hold') rows.push(['BT-' + o.id.slice(3) + '-5', '23/09 18:20', L('Tạm giữ do khiếu nại', 'Held for dispute'), L('Đang bảo hành → Đang tạm giữ', 'Warranty → On hold'), s.share]);
    if (o.money === 'paid') { rows.push(['BT-' + o.id.slice(3) + '-5', o.warrantyEnd + ' 00:00', L('Hết bảo hành', 'Warranty ended'), L('Đang bảo hành → Có thể rút', 'Warranty → Available'), s.share]); rows.push(['BT-' + o.id.slice(3) + '-6', o.paidOut + ' 15:40', L('Chi trả lô ', 'Paid in batch ') + o.batch, L('Có thể rút → Đã chi', 'Available → Paid out'), -s.share]); }
    (o.jr || []).forEach(function (j) { rows.push(j); });
    if (!rows.length) return '<div class="card-b" style="padding-top:0">' + A.empty(L('Chưa có bút toán', 'No entries yet'), L('Bút toán đầu tiên được tạo khi khách thanh toán.', 'The first entry is created when the customer pays.')) + '</div>';
    return '<table class="tbl"><thead><tr><th>' + L('Mã', 'ID') + '</th><th>' + L('Thời gian', 'Time') + '</th><th>' + L('Nội dung', 'Description') + '</th><th>' + L('Tài khoản', 'Account') + '</th><th class="num">' + L('Số tiền', 'Amount') + '</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td class="id">' + r[0] + '</td><td class="muted nw">' + r[1] + '</td><td>' + r[2] + '</td><td class="muted">' + r[3] + '</td><td class="num"' + (r[4] < 0 ? ' style="color:var(--danger)"' : '') + '>' + VN.money(r[4]) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  ACT.adjFromOrder = function (el) { var o = A.order(el.dataset.id); A.S.menu = null; A.go('transactions', { tab: 'adjust', sub: 'pending' }); ACT.adjOpen(null, null, { prov: o.prov, pocket: pocketOf(o) === 'awaiting' ? 'warranty' : (pocketOf(o) || 'avail'), link: o.id }); };

  /* Tạm giữ */
  var HOLD_REASONS = [['Khách mở khiếu nại', 'Customer opened a dispute'], ['Nghi ngờ gian lận', 'Suspected fraud'], ['Yêu cầu của cơ quan chức năng', 'Authority request'], ['Khác', 'Other']];
  ACT.holdOpen = function (el) { A.openModal('hold', { id: el.dataset.id, reason: '', note: '' }); };
  M.hold = function (m) {
    var o = A.order(m.id), p = A.prov(o.prov), s = A.split(o);
    return modalShell(L('Tạm giữ tiền ', 'Hold funds ') + o.id, L('Tiền của nhà cung cấp chuyển từ Đang bảo hành sang Đang tạm giữ, không rút được cho tới khi có phán quyết.', 'Provider funds move from warranty to hold and cannot be withdrawn until a ruling.'),
      A.reasonField(HOLD_REASONS, m.reason === '3' ? 'noteReq' : '') + A.impact(L('Tác động lên số dư ', 'Balance impact · ') + p.name, [[L('Đang bảo hành', 'In warranty'), p.bal.warranty, p.bal.warranty - s.share], [L('Đang tạm giữ', 'On hold'), p.bal.hold, p.bal.hold + s.share]]),
      A.btn(L('Tạm giữ tiền', 'Hold funds'), 'holdGo', { cls: 'primary', dis: m.reason === '' || (m.reason === '3' && !m.note) ? L('Chọn lý do trước', 'Select a reason first') : '' }));
  };
  ACT.holdGo = function () {
    var m = A.S.modal, o = A.order(m.id), p = A.prov(o.prov), s = A.split(o);
    o.money = 'hold'; p.bal.warranty -= s.share; p.bal.hold += s.share;
    A.moneyEv(o, L('Tạm giữ tiền: ', 'Funds held: ') + L(HOLD_REASONS[+m.reason][0], HOLD_REASONS[+m.reason][1]));
    A.book(o.prov, 'hold', [L('Tạm giữ ', 'Hold ') + o.id, 'Hold ' + o.id], ['warranty', 'hold'], s.share, o.id);
    A.log(L('Tạm giữ tiền', 'Held funds'), o.id);
    A.S.modal = null; A.render(); flash(L('Đã tạm giữ ' + VN.money(s.share) + ' của ' + o.id, 'Held ' + VN.money(s.share) + ' on ' + o.id));
  };

  /* Hoàn tiền */
  var REF_REASONS = [['Phán quyết khiếu nại', 'Dispute ruling'], ['Chất lượng không đạt so với bảng chốt', 'Quality below sign-off sheet'], ['Tính sai khối lượng', 'Quantity charged incorrectly'], ['Khách thanh toán trùng', 'Duplicate payment'], ['Khác', 'Other']];
  ACT.refundOpen = function (el) { var o = A.order(el.dataset.id); A.S.menu = null; A.openModal('refund', { id: o.id, rk: 'full', amount: String(refundable(o)), reason: o.money === 'hold' ? '0' : '', note: '' }); };
  M.refund = function (m) {
    var o = A.order(m.id), p = A.prov(o.prov), max = refundable(o), amt = m.rk === 'full' ? max : VN.parseMoney(m.amount);
    var paidOut = o.money === 'paid';
    var err = m.rk === 'partial' && amt > max ? L('Số tiền hoàn không được vượt số còn hoàn được (' + VN.money(max) + ')', 'Refund cannot exceed the refundable amount (' + VN.money(max) + ')') : '';
    var needApprove = amt >= D.REFUND_THRESHOLD, pk = o.money === 'hold' ? 'hold' : 'warranty', provCut = R(amt * 0.83);
    var body = paidOut ? '<div class="note danger">' + ic('warning-circle') + '<span>' + L('<b>Không thể hoàn tiền</b> vì tiền đã chi cho nhà cung cấp ngày ' + o.paidOut + '. Hoàn tiền sau khi chi chưa hỗ trợ trong giai đoạn này.', '<b>Refund not possible</b>: funds were paid out to the provider on ' + o.paidOut + '. Refunds after payout are not supported in this phase.') + '</span></div>' : '';
    body += '<div class="field"><span class="flabel">' + L('Hình thức', 'Type') + '</span><div class="seg" role="radiogroup"><button type="button" role="radio" aria-checked="' + (m.rk === 'full') + '" class="' + (m.rk === 'full' ? 'on' : '') + '" data-act="mpick" data-id="rk" data-x="full"' + (paidOut ? ' aria-disabled="true"' : '') + '>' + L('Toàn bộ', 'Full') + '</button><button type="button" role="radio" aria-checked="' + (m.rk === 'partial') + '" class="' + (m.rk === 'partial' ? 'on' : '') + '" data-act="mpick" data-id="rk" data-x="partial"' + (paidOut ? ' aria-disabled="true"' : '') + '>' + L('Một phần', 'Partial') + '</button></div></div>';
    body += '<div class="field"><label for="rf-a">' + L('Số tiền hoàn', 'Refund amount') + ' <span class="req">*</span></label><div class="inp-wrap"><input id="rf-a" class="inp' + (err ? ' bad' : '') + '" inputmode="numeric" data-in="mset" data-k="amount" value="' + esc(m.rk === 'full' ? VN.num(max) : m.amount) + '"' + (m.rk === 'full' || paidOut ? ' readonly' : '') + '><span class="suffix">₫</span></div>' + (err ? '<span class="err">' + err + '</span>' : '<span class="hint">' + L('Còn hoàn được: ', 'Refundable: ') + VN.money(max) + '</span>') + '</div>';
    body += A.reasonField(REF_REASONS, m.reason === '4' ? 'noteReq' : '');
    if (!paidOut) body += A.impact(L('Tác động lên cả hai phía', 'Impact on both sides'), [[L('Khách nhận lại', 'Customer receives'), 0, amt], [p.name + ' · ' + L(D.POCKETS[pk][0], D.POCKETS[pk][1]), p.bal[pk], p.bal[pk] - provCut], [L('Hoa hồng tạm tính của nền tảng', 'Platform provisional commission'), A.split(o).comm - R((o.refunded || 0) * 0.15), A.split(o).comm - R((o.refunded || 0) * 0.15) - R(amt * 0.15)]]);
    if (needApprove && !paidOut) body += '<div class="note warn">' + ic('info') + '<span>' + L('Từ ' + VN.money(D.REFUND_THRESHOLD) + ' trở lên cần duyệt hai bước. Yêu cầu sẽ chuyển sang tab "Chờ duyệt hoàn tiền"; người duyệt phải khác bạn.', VN.money(D.REFUND_THRESHOLD) + ' or more needs two-step approval. The request moves to "Awaiting approval"; the approver must be someone else.') + ' <span class="assume">' + L('Giả định', 'Assumed') + '</span></span></div>';
    var dis = paidOut ? L('Tiền đã chi cho nhà cung cấp', 'Funds already paid out') : !A.can('refundCreate') ? A.denyTip('refundCreate') : err ? err : !amt ? L('Nhập số tiền', 'Enter an amount') : m.reason === '' || (m.reason === '4' && !m.note) ? L('Chọn lý do trước', 'Select a reason first') : '';
    return modalShell(L('Hoàn tiền ', 'Refund ') + o.id, esc(o.cust) + ' · ' + L('đã trả ', 'paid ') + VN.money(o.amount) + ' · ' + A.moneyBadge(o), body,
      '<span style="margin-right:auto"></span>' + A.btn(needApprove && !paidOut ? L('Gửi duyệt', 'Submit for approval') : L('Hoàn tiền cho khách', 'Refund customer'), 'refundGo', { cls: 'primary', dis: dis }));
  };
  ACT.refundGo = function () {
    var m = A.S.modal, o = A.order(m.id), max = refundable(o), amt = m.rk === 'full' ? max : VN.parseMoney(m.amount);
    var reason = m.reason === '4' ? [m.note, m.note] : REF_REASONS[+m.reason];
    var rec = { id: 'HT-09' + (25 + A.S.d.REFUNDS.length), order: o.id, kind: m.rk, amount: amt, reason: reason, st: 'pending', by: A.me(), at: '24/09 ' + VN.nowTime(), fresh: true };
    A.S.d.REFUNDS.forEach(function (r) { r.fresh = false; });
    A.S.d.REFUNDS.unshift(rec);
    A.S.modal = null;
    if (amt >= D.REFUND_THRESHOLD) {
      A.moneyEv(o, L('Tạo yêu cầu hoàn ', 'Refund request ') + VN.money(amt) + L(', chờ duyệt bước hai', ', awaiting second approval'));
      A.log(L('Gửi duyệt hoàn tiền', 'Submitted refund for approval'), rec.id);
      A.S.ui['sel-refunds-pending'] = rec.id; A.go('refunds', { tab: 'pending' });
      flash(L('Đã gửi duyệt ' + rec.id + ' (' + VN.money(amt) + ')', 'Submitted ' + rec.id + ' (' + VN.money(amt) + ')'));
    } else { doRefund(rec); A.render(); flash(L('Đã hoàn ' + VN.money(amt) + ' cho ', 'Refunded ' + VN.money(amt) + ' to ') + esc(o.cust)); }
  };
  function doRefund(rec) {
    var o = A.order(rec.order), p = A.prov(o.prov), pk = o.money === 'hold' ? 'hold' : 'warranty', cut = R(rec.amount * 0.83);
    rec.st = 'done'; rec.ap = A.me(); rec.at2 = '24/09 ' + VN.nowTime();
    o.refunded = (o.refunded || 0) + rec.amount;
    if (p) { p.bal[pk] -= cut; if (pk === 'hold' && o.refunded < o.amount) { p.bal.hold -= (A.split(o).share - R(o.refunded * 0.83)); p.bal.warranty += (A.split(o).share - R(o.refunded * 0.83)); } }
    o.money = o.refunded >= o.amount ? 'refunded' : (pk === 'hold' ? 'warranty' : o.money);
    if (o.dispute) { var dsp = A.S.d.DISPUTES.filter(function (x) { return x.id === o.dispute; })[0]; if (dsp) dsp.st = 'resolved'; if (o.status === 'dispute') o.status = 'done'; }
    o.jr = (o.jr || []).concat([['BT-' + o.id.slice(3) + '-R' + (o.jr ? o.jr.length + 1 : 1), '24/09 ' + VN.nowTime(), L('Hoàn tiền ', 'Refund ') + rec.id, L('Trả khách · trừ phần nhà cung cấp ', 'To customer · provider share −') + VN.money(cut), -rec.amount]]);
    A.moneyEv(o, L('Hoàn ', 'Refunded ') + VN.money(rec.amount) + L(' cho khách, duyệt bởi ', ' to customer, approved by ') + A.me());
    A.book(o.prov, 'refund', [L('Hoàn tiền ', 'Refund ') + rec.id + ' · ' + o.id, 'Refund ' + rec.id + ' · ' + o.id], [pk, ''], -cut, rec.id);
    A.S.adj.push({ kind: 'refund', ref: rec.amount, owe: -cut, prov: o.prov, cat: o.cat });
    A.log(L('Hoàn tiền', 'Refund executed'), rec.id);
  }
  A.doRefund = doRefund;

  /* ---------- Hoàn tiền & tạm giữ (E) ---------- */
  A.P.refunds = {
    crumb: function () { return null; },
    render: function () {
      var tab = A.S.p.tab || 'hold', d = A.S.d;
      var holds = d.ORDERS.filter(function (o) { return o.money === 'hold'; }), pend = d.REFUNDS.filter(function (r) { return r.st === 'pending'; }), done = d.REFUNDS.filter(function (r) { return r.st === 'done'; });
      var h = '<div class="page-h"><div><h1>' + L('Hoàn tiền & tạm giữ', 'Refunds & holds') + '</h1><div class="sub">' + L('Hoàn tiền chỉ làm được trước khi chi cho nhà cung cấp. Từ ' + VN.money(D.REFUND_THRESHOLD) + ' cần duyệt hai bước.', 'Refunds only before payout. ' + VN.money(D.REFUND_THRESHOLD) + ' or more needs two-step approval.') + '</div></div></div>';
      h += '<div class="tabs" role="tablist">' + [['hold', L('Đang tạm giữ', 'On hold'), holds.length], ['pending', L('Chờ duyệt hoàn tiền', 'Awaiting approval'), pend.length], ['done', L('Đã hoàn', 'Refunded'), 31 + done.length - 3]].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (tab === t[0]) + '" class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-id="' + t[0] + '">' + t[1] + '<span class="n">' + t[2] + '</span></button>'; }).join('') + '</div>';
      if (tab === 'done') return h + refundDone(done);
      var list = tab === 'hold' ? holds : pend, key = 'sel-refunds-' + tab, sel = A.ui(key, list[0] && (list[0].id));
      if (!list.some(function (x) { return x.id === sel; })) { sel = list[0] && list[0].id; A.S.ui[key] = sel; }
      if (!list.length) return h + '<div class="card">' + A.empty(tab === 'hold' ? L('Không có khoản nào đang tạm giữ', 'Nothing on hold') : L('Không có yêu cầu hoàn tiền chờ duyệt', 'No refunds awaiting approval'), L('Khoản mới sẽ hiện ở đây.', 'New items will appear here.')) + '</div>';
      var cur = list.filter(function (x) { return x.id === sel; })[0];
      var items = list.map(function (x) {
        var o = tab === 'hold' ? x : A.order(x.order);
        return '<button type="button" class="q-item' + (x.id === sel ? ' on' : '') + (x.fresh ? ' flash' : '') + '" data-act="qsel" data-id="' + x.id + '" data-x="' + key + '"><span class="r1"><b class="mono" style="font-size:13px">' + (tab === 'hold' ? o.id : x.id) + '</b><span class="amt">' + VN.money(tab === 'hold' ? o.amount : x.amount) + '</span></span><small>' + esc(o.cust) + ' · ' + esc(A.provName(o.prov)) + '</small><small>' + (tab === 'hold' ? L('Khiếu nại ', 'Dispute ') + (o.dispute || '') + ' · 23/09 18:20' : L('Tạo bởi ', 'By ') + esc(x.by) + ' · ' + x.at) + '</small></button>';
      }).join('');
      return h + '<div class="queue"><div class="q-list" role="listbox" aria-label="' + L('Danh sách', 'List') + '">' + items + '</div><div class="q-detail">' + (tab === 'hold' ? holdDetail(cur) : pendDetail(cur)) + '</div></div>';
    }
  };
  ACT.qsel = function (el) { A.S.ui[el.dataset.x] = el.dataset.id; A.render(); };
  function holdDetail(o) {
    var p = A.prov(o.prov), s = A.split(o), dsp = A.S.d.DISPUTES.filter(function (x) { return x.id === o.dispute; })[0];
    var body = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="margin:0;font-size:18px;font-weight:600">' + L(o.svc[0], o.svc[1]) + ' · ' + A.ordLink(o.id, 'money') + '</h2><div class="muted" style="margin-top:4px">' + esc(o.cust) + ' · ' + esc(p.name) + '</div></div>' + A.moneyBadge(o, true) + '</div>' +
      '<div class="kv"><div><span>' + L('Khách đã trả', 'Customer paid') + '</span><b>' + VN.money(o.amount) + '</b></div><div><span>' + L('Phần nhà cung cấp đang tạm giữ', 'Provider share on hold') + '</span><b>' + VN.money(s.share) + '</b></div><div><span>' + L('Thanh toán', 'Paid') + '</span><b>' + o.paidAt + '</b></div><div><span>' + L('Bảo hành đến', 'Warranty until') + '</span><b>' + o.warrantyEnd + '</b></div></div>' +
      (dsp ? '<div class="card" style="padding:14px 16px;display:flex;flex-direction:column;gap:6px;background:var(--fill)"><div style="display:flex;justify-content:space-between"><b>' + L('Khiếu nại ', 'Dispute ') + dsp.id + '</b>' + (A.sees('disputes') ? '<button type="button" class="link" data-act="goDispute" data-id="' + dsp.id + '">' + L('Mở màn phân xử', 'Open ruling') + ' →</button>' : '') + '</div><span>' + L(dsp.reason[0], dsp.reason[1]) + '</span><span class="muted" style="font-size:12.5px">' + L('Khách đề nghị: ', 'Customer asks: ') + L(dsp.ask[0], dsp.ask[1]) + ' · ' + L('mở ', 'opened ') + dsp.opened + '</span></div>' : '') +
      '<div><div class="lbl" style="margin-bottom:8px">' + L('Dòng tiền', 'Money timeline') + '</div>' + moneyTimeline(o, s) + '</div>';
    var dis1 = A.denyTip('release'), dis2 = A.denyTip('refundCreate');
    return '<div class="q-body">' + body + '</div><div class="q-bar"><span class="muted" style="font-size:12.5px">' + L('Quyết định ghi vào Nhật ký và báo cho hai bên', 'Decisions are logged and both sides are notified') + '</span><div class="r">' + A.btn(L('Trả lại cho nhà cung cấp', 'Release to provider'), 'releaseOpen', { cls: 'lg', id: o.id, dis: dis1 }) + A.btn(L('Hoàn tiền cho khách', 'Refund customer'), 'refundOpen', { cls: 'primary', id: o.id, dis: dis2, tipPos: 'left' }) + '</div></div>';
  }
  function pendDetail(r) {
    var o = A.order(r.order), p = A.prov(o.prov), self = r.by === A.me();
    var dis = !A.can('refundApprove') ? A.denyTip('refundApprove', 'approve') : self ? L('Bạn là người tạo yêu cầu này', 'You created this request') : '';
    var pk = o.money === 'hold' ? 'hold' : 'warranty', cut = R(r.amount * 0.83);
    var body = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="margin:0;font-size:18px;font-weight:600"><span class="mono">' + r.id + '</span> · ' + (r.kind === 'full' ? L('Hoàn toàn bộ', 'Full refund') : L('Hoàn một phần', 'Partial refund')) + '</h2><div class="muted" style="margin-top:4px">' + L('Đơn ', 'Order ') + A.ordLink(o.id, 'money') + ' · ' + esc(o.cust) + ' · ' + esc(p.name) + '</div></div><span class="badge lg t-warn">' + L('Chờ duyệt bước hai', 'Awaiting step 2') + '</span></div>' +
      '<div class="kv"><div><span>' + L('Số tiền hoàn', 'Refund amount') + '</span><b style="font-size:16px;font-weight:600">' + VN.money(r.amount) + '</b></div><div><span>' + L('Khách đã trả', 'Customer paid') + '</span><b>' + VN.money(o.amount) + '</b></div><div><span>' + L('Người tạo', 'Created by') + '</span><b>' + esc(r.by) + ' · ' + r.at + '</b></div><div><span>' + L('Lý do', 'Reason') + '</span><b>' + L(r.reason[0], r.reason[1]) + '</b></div></div>' +
      A.impact(L('Tác động khi duyệt', 'Impact on approval'), [[L('Khách nhận lại', 'Customer receives'), 0, r.amount], [p.name + ' · ' + L(D.POCKETS[pk][0], D.POCKETS[pk][1]), p.bal[pk], p.bal[pk] - cut]]) +
      (self ? '<div class="note warn">' + ic('info') + '<span>' + L('Bạn là người tạo yêu cầu này nên không tự duyệt được. Người duyệt: Super admin hoặc một Kế toán khác.', 'You created this request so you cannot approve it. Approver: Super admin or another accountant.') + '</span></div>' : '');
    return '<div class="q-body">' + body + '</div><div class="q-bar">' + A.btn(L('Từ chối', 'Reject'), 'refundReject', { cls: 'danger', id: r.id, dis: dis }) + '<div class="r">' + A.btn(L('Duyệt hoàn tiền', 'Approve refund'), 'refundApprove', { cls: 'primary', id: r.id, dis: dis, tipPos: 'left' }) + '</div></div>';
  }
  function refundDone(list) {
    return '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã', 'ID') + '</th><th>' + L('Đơn', 'Order') + '</th><th>' + L('Hình thức', 'Type') + '</th><th class="num">' + L('Số tiền', 'Amount') + '</th><th>' + L('Lý do', 'Reason') + '</th><th>' + L('Tạo / duyệt', 'Created / approved') + '</th><th>' + L('Thời gian', 'Time') + '</th></tr></thead><tbody>' +
      list.map(function (r) { return '<tr class="' + (r.fresh ? 'flash' : '') + '"><td class="id">' + r.id + '</td><td>' + A.ordLink(r.order, 'money') + '</td><td>' + (r.kind === 'full' ? L('Toàn bộ', 'Full') : L('Một phần', 'Partial')) + '</td><td class="num">' + VN.money(r.amount) + '</td><td style="max-width:280px">' + L(r.reason[0], r.reason[1]) + '</td><td>' + esc(r.by) + ' / ' + esc(r.ap || '') + '</td><td class="muted nw">' + (r.at2 || r.at) + '</td></tr>'; }).join('') + '</tbody></table>' + A.foot(list.length, 31 + list.length - 3, ['lượt hoàn', 'refunds']) + '</div>';
  }
  ACT.refundApprove = function (el) { A.openModal('refundDecide', { id: el.dataset.id, ok: true, reason: '', note: '' }); };
  ACT.refundReject = function (el) { A.openModal('refundDecide', { id: el.dataset.id, ok: false, reason: '', note: '' }); };
  M.refundDecide = function (m) {
    var r = A.S.d.REFUNDS.filter(function (x) { return x.id === m.id; })[0], o = A.order(r.order), p = A.prov(o.prov), pk = o.money === 'hold' ? 'hold' : 'warranty';
    var reasons = m.ok ? [['Đã kiểm tra chứng cứ, đồng ý hoàn', 'Evidence checked, refund agreed'], ['Theo phán quyết khiếu nại', 'Per dispute ruling'], ['Khác', 'Other']] : [['Chứng cứ chưa đủ', 'Insufficient evidence'], ['Số tiền chưa đúng', 'Amount incorrect'], ['Khác', 'Other']];
    return modalShell(m.ok ? L('Duyệt hoàn tiền ', 'Approve refund ') + r.id : L('Từ chối hoàn tiền ', 'Reject refund ') + r.id, VN.money(r.amount) + ' · ' + o.id + ' · ' + esc(o.cust),
      A.reasonField(reasons) + (m.ok ? A.impact(L('Tác động lên số dư', 'Balance impact'), [[L('Khách nhận lại', 'Customer receives'), 0, r.amount], [p.name + ' · ' + L(D.POCKETS[pk][0], D.POCKETS[pk][1]), p.bal[pk], p.bal[pk] - R(r.amount * 0.83)]]) : ''),
      A.btn(m.ok ? L('Duyệt hoàn tiền', 'Approve refund') : L('Từ chối', 'Reject'), 'refundDecideGo', { cls: m.ok ? 'primary' : 'danger-solid', dis: m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '' }));
  };
  ACT.refundDecideGo = function () {
    var m = A.S.modal, r = A.S.d.REFUNDS.filter(function (x) { return x.id === m.id; })[0];
    A.S.modal = null;
    if (m.ok) { doRefund(r); r.fresh = true; A.S.p = { tab: 'done' }; A.render(); flash(L('Đã duyệt ' + r.id + ': hoàn ' + VN.money(r.amount) + '. Số dư, dòng tiền và báo cáo đã cập nhật', r.id + ' approved: refunded ' + VN.money(r.amount) + '. Balances, timeline and reports updated')); }
    else { r.st = 'rejected'; A.log(L('Từ chối hoàn tiền', 'Rejected refund'), r.id); A.render(); flash(L('Đã từ chối ', 'Rejected ') + r.id); }
  };
  ACT.releaseOpen = function (el) { A.openModal('release', { id: el.dataset.id, reason: '', note: '' }); };
  M.release = function (m) {
    var o = A.order(m.id), p = A.prov(o.prov), s = A.split(o);
    return modalShell(L('Trả lại cho nhà cung cấp', 'Release to provider'), o.id + ' · ' + esc(p.name) + ' · ' + VN.money(s.share),
      A.reasonField([['Khiếu nại không có cơ sở', 'Dispute unfounded'], ['Hai bên đã thoả thuận', 'Both sides settled'], ['Nhà cung cấp đã làm lại đạt yêu cầu', 'Provider redid the work satisfactorily'], ['Khác', 'Other']]) +
      A.impact(L('Tác động lên số dư', 'Balance impact'), [[L('Đang tạm giữ', 'On hold'), p.bal.hold, p.bal.hold - s.share], [L('Đang bảo hành (tới ', 'In warranty (until ') + o.warrantyEnd + ')', p.bal.warranty, p.bal.warranty + s.share]]),
      A.btn(L('Trả lại cho nhà cung cấp', 'Release to provider'), 'releaseGo', { cls: 'primary', dis: m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '' }));
  };
  ACT.releaseGo = function () {
    var m = A.S.modal, o = A.order(m.id), p = A.prov(o.prov), s = A.split(o);
    p.bal.hold -= s.share; p.bal.warranty += s.share; o.money = 'warranty'; o.status = 'done';
    var dsp = A.S.d.DISPUTES.filter(function (x) { return x.id === o.dispute; })[0]; if (dsp) dsp.st = 'resolved';
    A.moneyEv(o, L('Trả lại tiền tạm giữ cho nhà cung cấp', 'Held funds released to provider'));
    A.book(o.prov, 'hold', [L('Trả lại tạm giữ ', 'Release hold ') + o.id, 'Release hold ' + o.id], ['hold', 'warranty'], s.share, o.id);
    A.log(L('Trả lại tiền tạm giữ', 'Released held funds'), o.id);
    A.S.modal = null; A.render(); flash(L('Đã trả lại ' + VN.money(s.share) + ' cho ', 'Released ' + VN.money(s.share) + ' to ') + p.name);
  };
  ACT.goDispute = function (el) { A.S.ui['sel-disputes'] = el.dataset.id; A.go('disputes', {}); };

  /* Khung modal xác nhận chung */
  function modalShell(title, sub, body, confirm) {
    return '<div class="scrim" data-act="closeModal"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="md-h"><div class="modal-h"><div><h2 id="md-h">' + title + '</h2><p>' + sub + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div><div class="modal-b">' + body + '</div><div class="modal-f"><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + confirm + '</div></div></div>';
  }
  A.modalShell = modalShell;

  /* ---------- Số dư & sổ cái (C) ---------- */
  A.P.ledger = {
    nav: 'transactions',
    crumb: function () { return [[L('Giao dịch & đối soát', 'Transactions'), 'transactions'], [L('Số dư nhà cung cấp', 'Provider balances'), 'transactions', 'bal'], [A.provName(A.S.p.id)]]; },
    render: function () {
      var p = A.prov(A.S.p.id), f = A.ui('ledF', 'all');
      if (!p) return A.empty(L('Không có', 'None'), '');
      var rows = A.ledger(p.id).filter(function (r) { return f === 'all' || r[1] === f || (f === 'payout' && r[1] === 'paid'); });
      var types = [['all', L('Tất cả', 'All')], ['order', L('Ghi nhận đơn', 'Order recorded')], ['warranty', L('Hết bảo hành', 'Warranty ended')], ['payout', L('Rút tiền', 'Payouts')], ['hold', L('Tạm giữ', 'Holds')], ['refund', L('Hoàn tiền', 'Refunds')], ['adjust', L('Điều chỉnh', 'Adjustments')], ['cash', L('Tiền mặt', 'Cash')]];
      var TL = { order: L('Ghi nhận đơn', 'Order'), warranty: L('Hết bảo hành', 'Warranty'), payout: L('Rút tiền', 'Payout'), paid: L('Chi trả', 'Paid'), hold: L('Tạm giữ', 'Hold'), refund: L('Hoàn tiền', 'Refund'), adjust: L('Điều chỉnh', 'Adjustment'), failed: L('Chi thất bại', 'Payout failed'), cash: L('Tiền mặt', 'Cash') };
      var h = '<div class="page-h"><div><h1>' + esc(p.name) + ' ' + A.flagBadges(p) + '</h1><div class="sub">' + L('Số dư & sổ cái', 'Balances & ledger') + ' · ' + (A.sees('providers') ? '<button type="button" class="link" data-act="goProv" data-id="' + p.id + '" data-x="provider">' + L('Hồ sơ nhà cung cấp', 'Provider profile') + '</button>' : '') + '</div></div><div class="acts">' + A.btn(L('Xuất sao kê', 'Export statement'), 'stmtExport', { cls: 'primary', id: p.id, icon: 'download-simple' }) + '</div></div>';
      h += '<div class="grid2"><section class="card" aria-labelledby="led-h"><div class="card-h" style="padding-bottom:12px"><h2 id="led-h">' + L('Biến động', 'Movements') + '</h2></div><div style="padding:0 20px 12px"><div class="tabs sub">' + types.map(function (t) { return '<button type="button" class="' + (f === t[0] ? 'on' : '') + '" data-act="ledF" data-id="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div></div>' +
        (rows.length ? '<table class="tbl"><thead><tr><th>' + L('Thời gian', 'Time') + '</th><th>' + L('Loại', 'Type') + '</th><th>' + L('Nội dung', 'Description') + '</th><th>' + L('Ngăn', 'Pocket') + '</th><th class="num">' + L('Số tiền', 'Amount') + '</th></tr></thead><tbody>' +
          rows.map(function (r) { var pk = r[3] || ['', '']; var pl = function (k) { return k ? L(D.POCKETS[k][0], D.POCKETS[k][1]) : ''; }; return '<tr><td class="muted nw">' + r[0] + '</td><td>' + (TL[r[1]] || r[1]) + '</td><td>' + L(r[2][0], r[2][1]) + '<div class="muted mono" style="font-size:11.5px">' + (r[5] || '') + '</div></td><td class="muted" style="font-size:12.5px">' + (pk[0] && pk[1] ? pl(pk[0]) + ' → ' + pl(pk[1]) : pl(pk[0] || pk[1]) || (r[1] === 'paid' ? L('Đang rút → Đã chi', 'Payout → Paid') : L('Không có', 'None'))) + '</td><td class="num"' + (r[4] < 0 ? ' style="color:var(--danger)"' : '') + '>' + (r[4] ? VN.money(r[4]) : L('Không có', 'None')) + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="card-b">' + A.empty(L('Không có biến động loại này', 'No movements of this type'), L('Chọn "Tất cả" để xem toàn bộ.', 'Choose "All" to see everything.')) + '</div>') + '</section>';
      var pk = [['awaiting', L('Chờ khách thanh toán', 'Awaiting payment'), L('Chưa tính vào số phải trả', 'Not yet owed')], ['warranty', L('Đang bảo hành', 'In warranty hold'), L('Tự chuyển sang Có thể rút khi hết hạn', 'Moves to Available at warranty end')], ['avail', L('Có thể rút', 'Available'), L('Nhà cung cấp tạo yêu cầu rút', 'Provider can request payout')], ['payout', L('Đang rút', 'Payout in progress'), L('Chờ duyệt hoặc chờ chi', 'Awaiting approval or batch')]];
      h += '<div class="stack"><section class="card" aria-labelledby="pk-h"><div class="card-h"><h2 id="pk-h">' + L('Số dư theo ngăn', 'Balance by pocket') + '</h2></div><div class="card-b"><div class="pockets">' +
        pk.map(function (x) { return '<div class="pk' + (p.bal[x[0]] ? '' : ' zero') + '"><div class="rail"><span></span><i></i></div><span class="nm">' + x[1] + '<small>' + x[2] + '</small></span><span class="am">' + VN.money(p.bal[x[0]] || 0) + '</span></div>'; }).join('') + '</div>' +
        '<div class="pk hold' + (p.bal.hold ? '' : ' zero') + '" style="margin-top:6px;padding-top:12px;border-top:1px dashed var(--border)"><div class="rail"><span></span></div><span class="nm">' + L('Đang tạm giữ', 'On hold') + '<small>' + L('Do khiếu nại, chờ phán quyết', 'For disputes, awaiting ruling') + '</small></span><span class="am" style="color:var(--danger)">' + VN.money(p.bal.hold) + '</span></div>' +
        (A.cashDebt(p.id) ? '<div class="pk hold" style="margin-top:6px"><div class="rail"><span></span></div><span class="nm">' + L('Công nợ tiền mặt', 'Cash debt') + '<small>' + L('Hoa hồng và thuế của đơn tiền mặt, chờ nhà cung cấp chuyển về', 'Commission and tax on cash orders, awaiting transfer') + '</small></span><span class="am" style="color:var(--danger)">' + VN.money(-A.cashDebt(p.id)) + '</span></div>' : '') +
        '<div class="row-kv" style="border-top:1px solid var(--line);margin-top:10px;padding-top:12px;font-weight:600"><span style="color:var(--text)">' + L('Tổng nền tảng đang giữ', 'Total held by platform') + '</span><b style="font-weight:600">' + VN.money(p.bal.warranty + p.bal.hold + p.bal.avail + p.bal.payout) + '</b></div></div></section>' +
        '<section class="card" aria-labelledby="bk-h"><div class="card-h"><h2 id="bk-h">' + L('Tài khoản nhận tiền', 'Payout account') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;align-items:center;gap:10px"><span class="av sq">' + ic('bank') + '</span><div><b style="font-weight:600">' + p.bank.name + ' •••• ' + p.bank.no + '</b><div class="muted" style="font-size:12.5px">' + esc(p.bank.holder || '') + '</div></div></div>' +
        (p.flags.indexOf('bankFix') >= 0 ? '<span class="badge t-danger">' + L('Chi thất bại: cần cập nhật tài khoản', 'Payout failed: update account') + '</span>' : p.bank.state === 'verified' ? '<span class="badge t-ok">' + L('Đã xác minh', 'Verified') + '</span>' : '<span class="badge t-warn">' + L('Chờ xác minh · vừa đổi ' + (p.bank.changed || 0) + ' ngày trước', 'Pending verification · changed ' + (p.bank.changed || 0) + ' days ago') + '</span>') + '</div></section></div></div>';
      return h;
    }
  };
  ACT.ledF = function (el) { A.S.ui.ledF = el.dataset.id; A.render(); };
  ACT.stmtExport = function (el) {
    var p = A.prov(el.dataset.id), rows = [[L('Thời gian', 'Time'), L('Loại', 'Type'), L('Nội dung', 'Description'), L('Số tiền', 'Amount'), L('Tham chiếu', 'Reference')]].concat(A.ledger(p.id).map(function (r) { return [r[0], r[1], L(r[2][0], r[2][1]), r[4], r[5] || '']; }));
    var name = 'SaoKe_' + p.id + '_20260924.xls';
    VN.download(name, VN.xls([{ name: L('Sao kê', 'Statement'), rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    flash(L('Đã tạo file ', 'File created: ') + name);
  };

  /* ---------- Rút tiền (D) ---------- */
  A.P.payouts = {
    crumb: function () { return null; },
    render: function () {
      var tab = A.S.p.tab || 'pending', d = A.S.d;
      var cnt = function (s) { return d.PAYOUTS.filter(function (p) { return p.st === s; }).length; };
      var tabs = [['pending', L('Chờ duyệt', 'Pending'), cnt('pending')], ['approved', L('Chờ chi', 'Ready to pay'), cnt('approved')], ['paid', L('Đã chi', 'Paid'), cnt('paid')], ['rejected', L('Từ chối', 'Rejected'), cnt('rejected')], ['failed', L('Chi thất bại', 'Failed'), cnt('failed')]];
      var h = '<div class="page-h"><div><h1>' + L('Rút tiền', 'Payouts') + '</h1><div class="sub">' + L('Ngưỡng tối thiểu ' + VN.money(D.PAYOUT_RULES.min) + ' · tối đa ' + D.PAYOUT_RULES.perWeek + ' lần/tuần · phí ' + VN.money(D.PAYOUT_RULES.fee) + ', miễn phí ' + D.PAYOUT_RULES.freePerMonth + ' lần đầu mỗi tháng', 'Minimum ' + VN.money(D.PAYOUT_RULES.min) + ' · max ' + D.PAYOUT_RULES.perWeek + '/week · fee ' + VN.money(D.PAYOUT_RULES.fee) + ', first ' + D.PAYOUT_RULES.freePerMonth + ' free each month') + '</div></div>' +
        (tab === 'approved' ? '<div class="acts">' + A.btn(L('Tạo lô chi', 'Create payout batch') + (selIds().length ? ' (' + selIds().length + ')' : ''), 'batchOpen', { cls: 'primary', icon: 'list-checks', dis: !A.can('payBatch') ? A.denyTip('payBatch') : !selIds().length ? L('Chọn ít nhất một dòng', 'Select at least one row') : '' }) + '</div>' : '') + '</div>';
      h += '<div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" aria-selected="' + (tab === t[0]) + '" class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-id="' + t[0] + '">' + t[1] + '<span class="n' + (t[0] === 'failed' && t[2] ? ' red' : '') + '">' + t[2] + '</span></button>'; }).join('') + '</div>';
      var list = d.PAYOUTS.filter(function (p) { return p.st === tab; }), key = 'sel-payouts-' + tab, sel = A.ui(key, list[0] && list[0].id);
      if (!list.some(function (x) { return x.id === sel; })) { sel = list[0] && list[0].id; A.S.ui[key] = sel; }
      if (!list.length) return h + '<div class="card">' + A.empty(L('Không có yêu cầu ở trạng thái này', 'Nothing in this status'), tab === 'pending' ? L('Mọi yêu cầu rút tiền đã được xử lý.', 'All payout requests are handled.') : L('Danh sách sẽ cập nhật khi có thao tác.', 'The list updates as actions happen.')) + '</div>';
      var cur = list.filter(function (x) { return x.id === sel; })[0], chk = A.ui('batchSel', {});
      var items = list.map(function (p) {
        return '<div class="q-item' + (p.id === sel ? ' on' : '') + (p.fresh ? ' flash' : '') + '" style="flex-direction:row;align-items:flex-start;gap:10px">' + (tab === 'approved' ? '<input type="checkbox" class="chk" aria-label="' + L('Chọn ', 'Select ') + p.id + '" data-in="batchPick" data-id="' + p.id + '"' + (chk[p.id] ? ' checked' : '') + ' style="margin-top:3px;width:16px;height:16px;accent-color:var(--primary)">' : '') +
          '<button type="button" data-act="qsel" data-id="' + p.id + '" data-x="' + key + '" style="all:unset;cursor:pointer;flex:1;display:flex;flex-direction:column;gap:4px"><span class="r1"><b>' + esc(pname(p)) + '</b><span class="amt">' + VN.money(p.amount) + '</span></span><small><span class="mono">' + p.id + '</span> · ' + p.at + '</small>' + (p.warn || (A.prov(p.prov) && A.prov(p.prov).flags.indexOf('bankFix') >= 0) ? '<small style="color:var(--warn);font-weight:500">' + ic('warning') + ' ' + warnText(p) + '</small>' : '') + (p.err ? '<small style="color:var(--danger)">' + L(p.err[0], p.err[1]) + '</small>' : '') + '</button></div>';
      }).join('');
      return h + '<div class="queue"><div class="q-list">' + (tab === 'approved' ? '<label class="chk" style="padding:10px 16px;border-bottom:1px solid var(--line);font-size:12.5px;color:var(--muted)"><input type="checkbox" data-in="batchAll"' + (list.every(function (p) { return chk[p.id]; }) ? ' checked' : '') + '>' + L('Chọn tất cả', 'Select all') + '</label>' : '') + items + '</div><div class="q-detail">' + payDetail(cur, tab) + '</div></div>';
    }
  };
  function pname(p) { return p.prov ? A.provName(p.prov) : p.provName; }
  function warnText(p) {
    var pv = A.prov(p.prov);
    if (pv && pv.flags.indexOf('bankFix') >= 0) return L('Chi thất bại trước đó, cần cập nhật tài khoản', 'Previous payout failed, update account');
    if (p.warn === 'bankChanged') return L('Tài khoản vừa đổi 2 ngày trước', 'Account changed 2 days ago');
    if (p.warn === 'cancelHigh') return L('Tỷ lệ huỷ tuần này 12%', 'Cancel rate this week 12%');
    return '';
  }
  function selIds() { var c = A.ui('batchSel', {}); return A.S.d.PAYOUTS.filter(function (p) { return p.st === 'approved' && c[p.id]; }).map(function (p) { return p.id; }); }
  function payDetail(p, tab) {
    var pv = A.prov(p.prov), bank = pv ? pv.bank : { name: 'Vietcombank', no: '3' + p.id.slice(-3), holder: esc(pname(p)).toUpperCase(), state: 'verified' };
    var net = p.amount - p.fee;
    var checks = [[p.amount >= D.PAYOUT_RULES.min, L('Trên ngưỡng tối thiểu ' + VN.money(D.PAYOUT_RULES.min), 'Above minimum ' + VN.money(D.PAYOUT_RULES.min))], [true, L('Lần rút trong tuần: 1/' + D.PAYOUT_RULES.perWeek, 'Payouts this week: 1/' + D.PAYOUT_RULES.perWeek)], [true, L('Số dư có thể rút đủ tại lúc tạo yêu cầu', 'Available balance sufficient at request time')], [bank.state === 'verified', bank.state === 'verified' ? L('Tài khoản ngân hàng đã xác minh', 'Bank account verified') : L('Tài khoản ngân hàng chưa xác minh lại sau khi đổi', 'Bank account not re-verified after change')]];
    var body = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="margin:0;font-size:18px;font-weight:600">' + (pv ? A.provLink(pv.id) : esc(pname(p))) + '</h2><div class="muted" style="margin-top:4px"><span class="mono">' + p.id + '</span> · ' + L('tạo bởi ', 'requested by ') + esc(p.by) + ' · ' + p.at + '</div></div>' + A.badge({ pending: ['Chờ duyệt', 'Pending', 'warn'], approved: ['Chờ chi', 'Ready to pay', 'slate'], paid: ['Đã chi', 'Paid out', 'ok'], rejected: ['Từ chối', 'Rejected', 'neutral'], failed: ['Chi thất bại', 'Payout failed', 'danger'] }[p.st], 'lg') + '</div>' +
      '<div class="kv" style="grid-template-columns:repeat(3,1fr)"><div><span>' + L('Số tiền rút', 'Requested') + '</span><b style="font-size:18px;font-weight:600">' + VN.money(p.amount) + '</b></div><div><span>' + L('Phí rút', 'Fee') + '</span><b>' + (p.fee ? VN.money(p.fee) : L('Miễn phí', 'Free')) + '</b></div><div><span>' + L('Thực chi', 'Net payout') + '</span><b style="font-size:18px;font-weight:600">' + VN.money(net) + '</b></div></div>' +
      '<div class="card" style="padding:14px 16px;display:flex;gap:12px;align-items:center;background:var(--fill)"><span class="av sq">' + ic('bank') + '</span><div style="flex:1"><b>' + bank.name + ' •••• ' + bank.no + '</b><div class="muted" style="font-size:12.5px">' + (bank.holder || '') + '</div></div>' + (bank.state === 'verified' ? '<span class="badge t-ok">' + L('Đã xác minh', 'Verified') + '</span>' : '<span class="badge t-warn">' + L('Chờ xác minh', 'Pending check') + '</span>') + '</div>' +
      (p.warn === 'bankChanged' ? '<div class="note warn">' + ic('warning') + '<span>' + L('<b>Tài khoản vừa đổi 2 ngày trước</b> (22/09 21:14) và chưa được xác minh lại. Nên gọi xác nhận với chủ đơn vị trước khi duyệt.', '<b>Account changed 2 days ago</b> (22/09 21:14) and not re-verified. Call the owner before approving.') + '</span></div>' : '') +
      (p.warn === 'cancelHigh' ? '<div class="note warn">' + ic('warning') + '<span>' + L('Tỷ lệ huỷ tuần này 12%, cao hơn mức trung bình 2,6%.', 'Cancel rate this week 12%, above the 2.6% average.') + '</span></div>' : '') +
      (p.err ? '<div class="note danger">' + ic('warning-circle') + '<span>' + L('Chi thất bại: ', 'Payout failed: ') + L(p.err[0], p.err[1]) + '. ' + L('Tiền đã quay về "Có thể rút".', 'Funds returned to "Available".') + '</span></div>' : '') +
      (p.reason ? '<div class="note neutral">' + ic('info') + '<span>' + L('Lý do từ chối: ', 'Rejection reason: ') + L(p.reason[0], p.reason[1]) + (p.apBy ? ' · ' + esc(p.apBy) : '') + '</span></div>' : '') +
      '<div><div class="lbl" style="margin-bottom:8px">' + L('Kiểm tra tự động', 'Automatic checks') + '</div><div style="display:flex;flex-direction:column;gap:6px">' + checks.map(function (c) { return '<span style="display:flex;gap:8px;align-items:center;font-size:13.5px;color:' + (c[0] ? 'var(--text)' : 'var(--warn)') + '">' + ic(c[0] ? 'check-circle' : 'warning', c[0] ? 'ok-ic' : '') + c[1] + '</span>'; }).join('') + '</div></div>' +
      (p.apBy && p.st !== 'rejected' ? '<div class="muted" style="font-size:12.5px">' + L('Duyệt bởi ', 'Approved by ') + esc(p.apBy) + ' · ' + p.apAt + (p.batch ? ' · ' + L('lô ', 'batch ') + p.batch : '') + (p.paidAt ? ' · ' + L('chi ', 'paid ') + p.paidAt : '') + '</div>' : '');
    var bar = '';
    if (tab === 'pending') {
      var dis = A.denyTip('payApprove', 'approve');
      bar = '<div class="q-bar">' + A.btn(L('Từ chối', 'Reject'), 'payReject', { cls: 'danger', id: p.id, dis: dis }) + '<div class="r">' + A.btn(L('Duyệt rút tiền', 'Approve payout'), 'payApprove', { cls: 'primary', id: p.id, dis: dis, tipPos: 'left' }) + '</div></div>';
    }
    return '<div class="q-body">' + body + '</div>' + bar;
  }
  A.IN.batchPick = function (el, v) { var c = A.ui('batchSel', {}); c[el.dataset.id] = v; A.render(); };
  A.IN.batchAll = function (el, v) { var c = A.ui('batchSel', {}); A.S.d.PAYOUTS.forEach(function (p) { if (p.st === 'approved') c[p.id] = v; }); A.render(); };
  var PAY_OK = [['Đủ điều kiện: số dư, tần suất, tài khoản', 'Eligible: balance, frequency, account'], ['Đã gọi xác nhận với chủ đơn vị', 'Confirmed by phone with the owner'], ['Khác', 'Other']];
  var PAY_NO = [['Tài khoản ngân hàng chưa xác minh', 'Bank account not verified'], ['Vượt số lần rút trong tuần', 'Weekly payout limit exceeded'], ['Nghi ngờ gian lận, cần kiểm tra', 'Suspected fraud, needs review'], ['Khác', 'Other']];
  ACT.payApprove = function (el) { A.openModal('payDecide', { id: el.dataset.id, ok: true, reason: '', note: '' }); };
  ACT.payReject = function (el) { A.openModal('payDecide', { id: el.dataset.id, ok: false, reason: '', note: '' }); };
  M.payDecide = function (m) {
    var p = A.S.d.PAYOUTS.filter(function (x) { return x.id === m.id; })[0], pv = A.prov(p.prov);
    var rows = pv ? (m.ok ? [[L('Đang rút', 'Payout in progress'), pv.bal.payout, pv.bal.payout]] : [[L('Đang rút', 'Payout in progress'), pv.bal.payout, pv.bal.payout - p.amount], [L('Có thể rút', 'Available'), pv.bal.avail, pv.bal.avail + p.amount]]) : [];
    return modalShell(m.ok ? L('Duyệt rút tiền ', 'Approve payout ') + p.id : L('Từ chối rút tiền ', 'Reject payout ') + p.id, esc(pname(p)) + ' · ' + VN.money(p.amount),
      A.reasonField(m.ok ? PAY_OK : PAY_NO, (m.ok ? m.reason === '2' : m.reason === '3') ? 'noteReq' : '') + (rows.length ? A.impact(L('Tác động lên số dư', 'Balance impact'), rows) : '') + (m.ok ? '<p class="muted" style="margin:0;font-size:12.5px">' + L('Sau khi duyệt, yêu cầu chuyển sang "Chờ chi" để đưa vào lô chi.', 'Once approved, the request moves to "Ready to pay" for batching.') + '</p>' : ''),
      A.btn(m.ok ? L('Duyệt rút tiền', 'Approve payout') : L('Từ chối', 'Reject'), 'payDecideGo', { cls: m.ok ? 'primary' : 'danger-solid', dis: m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '' }));
  };
  ACT.payDecideGo = function () {
    var m = A.S.modal, p = A.S.d.PAYOUTS.filter(function (x) { return x.id === m.id; })[0], pv = A.prov(p.prov);
    p.apBy = A.me(); p.apAt = '24/09 ' + VN.nowTime();
    if (m.ok) { p.st = 'approved'; flash(L('Đã duyệt ' + p.id + ' · ' + pname(p) + '. Chuyển sang Chờ chi', p.id + ' approved · ' + pname(p) + '. Moved to Ready to pay')); }
    else {
      p.st = 'rejected'; p.reason = PAY_NO[+m.reason];
      if (pv) { pv.bal.payout -= p.amount; pv.bal.avail += p.amount; A.book(pv.id, 'payout', [L('Từ chối rút tiền ', 'Payout rejected ') + p.id, 'Payout rejected ' + p.id], ['payout', 'avail'], p.amount, p.id); }
      flash(L('Đã từ chối ' + p.id + ', tiền quay về Có thể rút', p.id + ' rejected, funds back to Available'));
    }
    A.log(m.ok ? L('Duyệt rút tiền', 'Approved payout') : L('Từ chối rút tiền', 'Rejected payout'), p.id);
    A.S.modal = null; A.render();
  };

  /* Lô chi 3 bước */
  var ERR_CODES = [['Sai số tài khoản', 'Wrong account number'], ['Sai tên chủ tài khoản', 'Account holder mismatch'], ['Tài khoản bị phong toả', 'Account frozen'], ['Ngân hàng từ chối, lý do khác', 'Bank declined, other']];
  ACT.batchOpen = function () { A.openModal('batch', { step: 1, ids: selIds(), results: null, exported: false }); };
  M.batch = function (m) {
    var list = A.S.d.PAYOUTS.filter(function (p) { return m.ids.indexOf(p.id) >= 0; }), total = list.reduce(function (a, p) { return a + p.amount - p.fee; }, 0);
    var steps = [L('Xác nhận danh sách', 'Confirm list'), L('Xuất file lệnh chi', 'Export payout file'), L('Nhập kết quả', 'Import results')];
    var h = '<div class="steps">' + steps.map(function (s, i) { return '<span class="' + (m.step === i + 1 ? 'on' : m.step > i + 1 ? 'done' : '') + '"><b>' + (m.step > i + 1 ? ic('check') : i + 1) + '</b>' + s + '</span>'; }).join('') + '</div>';
    if (m.step === 1) {
      h += '<table class="tbl"><thead><tr><th>' + L('Yêu cầu', 'Request') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th><th>' + L('Tài khoản', 'Account') + '</th><th class="num">' + L('Thực chi', 'Net') + '</th></tr></thead><tbody>' + list.map(function (p) { var pv = A.prov(p.prov); return '<tr><td class="id">' + p.id + '</td><td>' + esc(pname(p)) + (p.warn === 'bankChanged' ? ' <span class="badge t-warn">' + L('Tài khoản vừa đổi', 'Account changed') + '</span>' : '') + '</td><td class="mono" style="font-size:12px">' + (pv ? pv.bank.name + ' •••• ' + pv.bank.no : 'Vietcombank •••• 3' + p.id.slice(-3)) + '</td><td class="num">' + VN.money(p.amount - p.fee) + '</td></tr>'; }).join('') + '</tbody><tfoot><tr><td colspan="3">' + L('Tổng ' + list.length + ' lệnh chi', 'Total ' + list.length + ' payouts') + '</td><td class="num">' + VN.money(total) + '</td></tr></tfoot></table>';
    } else if (m.step === 2) {
      h += '<div class="note info">' + ic('info') + '<span>' + L('Tải file lệnh chi rồi nộp lên ngân hàng/cổng chi hộ. Kết nối tự động nằm ngoài phạm vi MVP.', 'Download the payout file and upload it to the bank. Automatic disbursement is outside the MVP.') + '</span></div>' +
        '<div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">' + ic('file-xls') + '<div style="flex:1"><b>LenhChi_L-0924.xls</b><div class="muted" style="font-size:12.5px">' + list.length + L(' dòng · tổng ', ' rows · total ') + VN.money(total) + '</div></div>' + A.btn(m.exported ? L('Đã tải', 'Downloaded') : L('Tải file lệnh chi', 'Download payout file'), 'batchExport', { icon: m.exported ? 'check' : 'download-simple' }) + '</div>';
    } else {
      if (!m.results) h += '<div class="card" style="padding:18px;display:flex;flex-direction:column;gap:10px;align-items:flex-start"><b>' + L('Nhập file kết quả từ ngân hàng', 'Import the bank result file') + '</b><span class="muted" style="font-size:13px">' + L('Trong prototype, bấm để giả lập file kết quả: dòng Sạch Xanh Home sẽ thất bại vì sai số tài khoản.', 'In the prototype, click to simulate a result file: Sạch Xanh Home fails with a wrong account number.') + '</span>' + A.btn(L('Tải file kết quả mẫu', 'Load sample result file'), 'batchLoad', { icon: 'upload-simple' }) + '</div>';
      else h += '<table class="tbl"><thead><tr><th>' + L('Yêu cầu', 'Request') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th><th class="num">' + L('Thực chi', 'Net') + '</th><th>' + L('Kết quả', 'Result') + '</th><th>' + L('Mã lỗi', 'Error code') + '</th></tr></thead><tbody>' +
        list.map(function (p) { var r = m.results[p.id]; return '<tr' + (r.ok ? '' : ' style="background:oklch(0.985 0.02 22)"') + '><td class="id">' + p.id + '</td><td>' + esc(pname(p)) + '</td><td class="num">' + VN.money(p.amount - p.fee) + '</td><td>' + (r.ok ? '<span class="badge t-ok">' + L('Thành công', 'Succeeded') + '</span>' : '<span class="badge t-danger">' + L('Thất bại', 'Failed') + '</span>') + '</td><td>' + (r.ok ? '<span class="subtle">' + L('Không có', 'None') + '</span>' : '<label class="sr" for="err-' + p.id + '">' + L('Mã lỗi', 'Error code') + '</label><select id="err-' + p.id + '" class="sel" style="height:32px" data-in="batchErr" data-id="' + p.id + '">' + ERR_CODES.map(function (e, i) { return '<option value="' + i + '"' + (r.err === i ? ' selected' : '') + '>' + L(e[0], e[1]) + '</option>'; }).join('') + '</select>') + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<div class="note warn">' + ic('info') + '<span>' + L('Xác nhận xong: dòng thành công sang "Đã chi"; dòng thất bại sang "Chi thất bại", tiền quay về "Có thể rút" và nhà cung cấp bị gắn cờ "Cần cập nhật tài khoản ngân hàng".', 'On confirm: successes move to "Paid"; failures move to "Failed", funds return to "Available" and the provider is flagged "Bank account needs update".') + '</span></div>';
    }
    var next = m.step === 1 ? A.btn(L('Tiếp tục', 'Continue'), 'batchNext', { cls: 'primary' }) : m.step === 2 ? A.btn(L('Tiếp tục', 'Continue'), 'batchNext', { cls: 'primary', dis: m.exported ? '' : L('Tải file lệnh chi trước', 'Download the payout file first') }) : A.btn(L('Xác nhận kết quả', 'Confirm results'), 'batchDone', { cls: 'primary', dis: m.results ? '' : L('Nhập file kết quả trước', 'Import the result file first') });
    return '<div class="scrim" data-act="closeModal"></div><div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="bt-h"><div class="modal-h"><div><h2 id="bt-h">' + L('Tạo lô chi L-0924', 'Create payout batch L-0924') + '</h2><p>' + list.length + L(' lệnh chi · tổng thực chi ', ' payouts · net total ') + VN.money(total) + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div><div class="modal-b">' + h + '</div><div class="modal-f">' + (m.step > 1 ? A.btn(L('Quay lại', 'Back'), 'batchPrev') : '') + '<div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + next + '</div></div></div>';
  };
  ACT.batchNext = function () { A.S.modal.step++; A.render(); };
  ACT.batchPrev = function () { A.S.modal.step--; A.render(); };
  ACT.batchExport = function () {
    var m = A.S.modal, rows = [[L('Mã yêu cầu', 'Request'), L('Người nhận', 'Beneficiary'), L('Ngân hàng', 'Bank'), L('Số tài khoản', 'Account'), L('Số tiền', 'Amount'), L('Nội dung', 'Memo')]];
    A.S.d.PAYOUTS.filter(function (p) { return m.ids.indexOf(p.id) >= 0; }).forEach(function (p) { var pv = A.prov(p.prov); rows.push([p.id, pname(p), pv ? pv.bank.name : 'Vietcombank', pv ? '••••' + pv.bank.no : '••••3' + p.id.slice(-3), p.amount - p.fee, 'VN GROUP CHI ' + p.id]); });
    VN.download('LenhChi_L-0924.xls', VN.xls([{ name: 'L-0924', rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    m.exported = true; A.render(); flash(L('Đã tạo file LenhChi_L-0924.xls', 'Created LenhChi_L-0924.xls'));
  };
  ACT.batchLoad = function () { var m = A.S.modal; m.results = {}; m.ids.forEach(function (id) { var p = A.S.d.PAYOUTS.filter(function (x) { return x.id === id; })[0]; m.results[id] = p.willFail ? { ok: false, err: 0 } : { ok: true }; }); A.render(); };
  A.IN.batchErr = function (el, v) { A.S.modal.results[el.dataset.id].err = +v; };
  ACT.batchDone = function () {
    var m = A.S.modal, ok = 0, fail = 0, sum = 0;
    A.S.d.PAYOUTS.forEach(function (p) { p.fresh = false; });
    m.ids.forEach(function (id) {
      var p = A.S.d.PAYOUTS.filter(function (x) { return x.id === id; })[0], r = m.results[id], pv = A.prov(p.prov);
      p.batch = 'L-0924'; p.fresh = true;
      if (r.ok) {
        p.st = 'paid'; p.paidAt = '24/09 ' + VN.nowTime(); ok++; sum += p.amount;
        if (pv) { pv.bal.payout -= p.amount; A.book(pv.id, 'paid', [L('Chi trả lô L-0924 (', 'Paid in batch L-0924 (') + p.id + ')', 'Paid in batch L-0924 (' + p.id + ')'], ['payout', ''], -p.amount, 'L-0924'); }
        A.S.adj.push({ kind: 'payout', out: p.amount, owe: -p.amount, prov: p.prov || null, cat: p.prov ? provCat(p.prov) : null, batch: 'L-0924' });
      } else {
        p.st = 'failed'; p.err = ERR_CODES[r.err]; fail++;
        if (pv) { pv.bal.payout -= p.amount; pv.bal.avail += p.amount; if (pv.flags.indexOf('bankFix') < 0) pv.flags.push('bankFix'); A.book(pv.id, 'failed', [L('Chi thất bại (', 'Payout failed (') + ERR_CODES[r.err][0] + '), ' + L('tiền về Có thể rút', 'funds back to Available'), 'Payout failed (' + ERR_CODES[r.err][1] + '), funds back to Available'], ['payout', 'avail'], p.amount, p.id); }
      }
    });
    A.S.ui.batchSel = {};
    A.log(L('Xác nhận kết quả lô chi', 'Confirmed payout batch'), 'L-0924');
    A.S.modal = null; A.S.p = { tab: fail ? 'failed' : 'paid' }; A.render();
    flash(L('Lô L-0924: ' + ok + ' thành công (' + VN.money(sum) + '), ' + fail + ' thất bại', 'Batch L-0924: ' + ok + ' succeeded (' + VN.money(sum) + '), ' + fail + ' failed'));
  };
})(window);
