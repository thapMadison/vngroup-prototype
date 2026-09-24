/* Trang quản trị · Yêu cầu dịch vụ, Đơn hàng (O1-O3), Khiếu nại. */
(function (W) {
  'use strict';
  var VN = W.VN, D = W.VNDATA, A = W.ADMIN, L = VN.L, ic = VN.ic, esc = VN.esc, R = Math.round;
  var ACT = A.ACT, M = A.M;
  function st(o) { return D.ORDER_STATUS[o.status] || ['Không rõ', 'Unknown', 'neutral']; }
  function mask(ph) { return (ph || '').replace(/^(\d{3})\d? ?\d{3} ?(\d{3})$/, '$1 ••• $2').replace(/(\d{4}) (\d{3}) (\d{3})/, '$1 ••• $3'); }
  A.mask = mask;

  /* ---------- Đơn hàng: danh sách (O1) và cần chú ý (O3) ---------- */
  A.P.orders = {
    crumb: function () { return [[L('Đơn hàng', 'Orders')], [A.S.p.tab === 'attention' ? L('Đơn cần chú ý', 'Needs attention') : L('Quản lý đơn hàng', 'Order management')]]; },
    render: function () {
      var tab = A.S.p.tab || 'list', att = A.attentionCount();
      var h = '<div class="page-h"><div><h1>' + L('Đơn hàng', 'Orders') + '</h1><div class="sub">' + L('Theo dõi vòng đời đơn từ lúc gửi yêu cầu tới khi hoàn tất', 'Track every order from request to completion') + '</div></div><div class="acts">' + (A.can('export') ? A.btn(L('Xuất Excel', 'Export to Excel'), 'ordExport', { icon: 'download-simple' }) : '') + '</div></div>';
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'list') + '" class="' + (tab === 'list' ? 'on' : '') + '" data-act="tab" data-id="list">' + L('Quản lý đơn hàng', 'Order management') + '<span class="n">1.284</span></button><button type="button" role="tab" aria-selected="' + (tab === 'attention') + '" class="' + (tab === 'attention' ? 'on' : '') + '" data-act="tab" data-id="attention">' + L('Cần chú ý', 'Needs attention') + '<span class="n red">' + att + '</span></button></div>';
      return h + (tab === 'attention' ? attention() : list());
    }
  };
  function list() {
    var d = A.S.d, q = VN.fold(A.ui('ordQ', '')), fs = A.ui('ord-status', ''), fc = A.ui('ordCat', ''), from = A.ui('ordFrom', ''), to = A.ui('ordTo', '');
    var rows = d.ORDERS.filter(function (o) {
      var dd = o.sched ? '2026-' + o.sched[0].slice(3, 5) + '-' + o.sched[0].slice(0, 2) : '';
      return (!q || VN.fold(o.id + ' ' + o.cust + ' ' + o.phone + ' ' + String(o.phone || '').replace(/\D/g, '')).indexOf(q) >= 0) && (!fs || o.status === fs) && (!fc || o.cat === fc) && (!from || dd >= from) && (!to || dd <= to) && o.status !== 'closedReq' && o.status !== 'closedUnpaid';
    });
    rows = A.applySort(rows, { upd: function (o) { return -o.upd; }, id: function (o) { return o.id; } });
    if (!A.ui('sort-orders', {}).k) rows.sort(function (a, b) { return a.upd - b.upd; });
    var focus = A.S.role === 'acc';
    var h = '<div class="kpis"><div class="card kpi mini"><span class="k">' + L('Tổng đơn hôm nay', 'Orders today') + '</span><span class="v">47</span></div><div class="card kpi mini"><span class="k">' + L('Đang thực hiện', 'In progress') + '</span><span class="v">12</span></div><div class="card kpi mini"><span class="k">' + L('Chờ thanh toán', 'Awaiting payment') + '</span><span class="v">8</span></div><div class="card kpi mini"><span class="k">' + L('Cần chú ý', 'Needs attention') + '</span><span class="v red">' + A.attentionCount() + ' <span class="badge t-danger" style="vertical-align:4px">' + L('Xem', 'View') + '</span></span></div></div>';
    if (focus) h += '<div class="note info">' + ic('info') + '<span>' + L('Bạn đang xem với vai trò Kế toán: chỉ xem, các dòng chờ thanh toán và quá hạn được làm nổi.', 'Viewing as Accountant: read-only, payment-related rows highlighted.') + '</span></div>';
    h += '<div class="filters"><div class="search-box">' + ic('magnifying-glass') + '<label class="sr" for="ord-q">' + L('Tìm theo mã đơn', 'Search by order ID') + '</label><input id="ord-q" class="inp" data-in="uiset" data-k="ordQ" value="' + esc(A.ui('ordQ', '')) + '" placeholder="' + L('Tìm theo mã đơn, tên, số điện thoại', 'Order ID, name, phone') + '"></div>' +
      A.selUi('ord-status', [['', L('Tất cả trạng thái', 'All statuses')]].concat(Object.keys(D.ORDER_STATUS).map(function (k) { return [k, L(D.ORDER_STATUS[k][0], D.ORDER_STATUS[k][1])]; })), L('Trạng thái', 'Status')) +
      A.selUi('ordCat', [['', L('Tất cả ngành', 'All categories')]].concat(D.CATS.map(function (c) { return [c.id, L(c.vi, c.en)]; })), L('Ngành', 'Category')) +
      '<label class="sr" for="ord-reg">' + L('Khu vực', 'Region') + '</label><select id="ord-reg" class="sel"><option>' + L('TP. Hồ Chí Minh', 'Ho Chi Minh City') + '</option></select>' +
      '<label class="sr" for="ord-from">' + L('Từ ngày', 'From') + '</label><input id="ord-from" type="date" class="inp" style="width:145px" value="' + A.ui('ordFrom', '') + '" data-in="uiset" data-k="ordFrom" max="2026-09-24"><span class="muted">-</span><label class="sr" for="ord-to">' + L('Đến ngày', 'To') + '</label><input id="ord-to" type="date" class="inp" style="width:145px" value="' + A.ui('ordTo', '') + '" data-in="uiset" data-k="ordTo" max="2026-09-24">' +
      ((q || fs || fc || from || to) ? '<button type="button" class="btn ghost sm" data-act="ordClear">' + L('Xoá bộ lọc', 'Clear filters') + '</button>' : '') + '</div>';
    h += '<div class="card" style="overflow:hidden"><div style="overflow-x:auto"><table class="tbl"><thead><tr>' + A.sortable('id', L('Mã đơn', 'Order ID')) + '<th>' + L('Khách hàng', 'Customer') + '</th><th>' + L('Nhà cung cấp', 'Provider') + '</th><th>' + L('Dịch vụ', 'Service') + '</th><th>' + L('Trạng thái', 'Status') + '</th>' + A.sortable('upd', L('Cập nhật lúc', 'Updated')) + '<th class="num">' + L('Hành động', 'Actions') + '</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (o) {
        var hl = focus && (o.status === 'payment' || o.status === 'overdue'), warn = o.status === 'overdue' || o.status === 'nobody';
        return '<tr class="click' + (hl ? ' sel' : '') + '" tabindex="0" data-act="goOrder" data-id="' + o.id + '"><td class="id">' + o.id + '</td><td class="ell">' + esc(o.cust) + '</td><td class="ell">' + (o.prov ? esc(A.provName(o.prov)) + (o.provMore ? ' <span class="muted">+' + o.provMore + '</span>' : '') : '<span class="subtle">' + L('Không có', 'None') + '</span>') + '</td><td class="ell">' + L(o.svc[0], o.svc[1]) + '</td><td>' + A.badge(st(o)) + '</td><td class="muted nw">' + VN.ago(o.upd) + '</td><td class="num nw"><button type="button" class="btn sm" data-act="goOrder" data-id="' + o.id + '">' + L('Xem', 'View') + '</button>' + (warn ? ' <button type="button" class="btn sm" style="color:var(--danger)" data-act="toAttention" data-id="' + o.id + '" aria-label="' + L('Mở đơn cần chú ý', 'Open needs-attention') + '" data-tip="' + esc(L('Mở màn Đơn cần chú ý', 'Open Needs attention')) + '" data-tip-pos="left">' + ic('warning') + '</button>' : '') + '</td></tr>';
      }).join('') : '<tr><td colspan="7">' + A.empty(L('Không có đơn khớp bộ lọc', 'No orders match'), L('Thử bỏ bớt bộ lọc, hoặc tìm theo mã như VN-240931.', 'Remove a filter, or search an ID like VN-240931.'), A.btn(L('Xoá bộ lọc', 'Clear filters'), 'ordClear')) + '</td></tr>') +
      '</tbody></table></div>' + A.foot(rows.length, rows.length === d.ORDERS.length ? 1284 : rows.length, ['đơn', 'orders']) + '</div>';
    return h;
  }
  ACT.ordClear = function () { ['ordQ', 'ord-status', 'ordCat', 'ordFrom', 'ordTo'].forEach(function (k) { A.S.ui[k] = ''; }); A.render(); };
  ACT.toAttention = function (el) { var o = A.order(el.dataset.id); A.go('orders', { tab: 'attention', sub: o.status === 'nobody' ? 'nobody' : 'overdue' }); };
  ACT.ordExport = function () {
    var rows = [[L('Mã đơn', 'Order ID'), L('Khách hàng', 'Customer'), L('Nhà cung cấp', 'Provider'), L('Dịch vụ', 'Service'), L('Trạng thái', 'Status'), L('Giá trị', 'Amount')]].concat(A.S.d.ORDERS.map(function (o) { return [o.id, o.cust, A.provName(o.prov), L(o.svc[0], o.svc[1]), L(st(o)[0], st(o)[1]), o.amount]; }));
    VN.download('VuongNhan_DonHang_20260924.xls', VN.xls([{ name: L('Đơn hàng', 'Orders'), rows: rows, head: [0] }]), 'application/vnd.ms-excel');
    A.toast(L('Đã tạo file VuongNhan_DonHang_20260924.xls', 'Created VuongNhan_DonHang_20260924.xls'));
  };

  function attention() {
    var sub = A.S.p.sub || 'nobody', d = A.S.d;
    var nob = d.ORDERS.filter(function (o) { return o.status === 'nobody'; }), od = d.ORDERS.filter(function (o) { return o.status === 'overdue'; });
    var h = '<div class="tabs sub"><button type="button" class="' + (sub === 'nobody' ? 'on' : '') + '" data-act="subtab" data-id="nobody">' + L('Không có nhà cung cấp nhận', 'No provider accepted') + '<span class="n">' + nob.length + '</span></button><button type="button" class="' + (sub === 'overdue' ? 'on' : '') + '" data-act="subtab" data-id="overdue">' + L('Quá hạn thanh toán', 'Payment overdue') + '<span class="n">' + od.length + '</span></button></div>';
    var closeDis = A.denyTip('orderCancel', 'intervene');
    if (sub === 'nobody') {
      if (!nob.length) return h + '<div class="card">' + A.empty(L('Không còn yêu cầu nào bị bỏ lỡ', 'No unaccepted requests left'), L('Báo cáo theo ngành và khung giờ ở Tổng quan cho biết nơi đang thiếu nhà cung cấp.', 'The heatmap on Overview shows where providers are missing.')) + '</div>';
      return h + nob.map(function (o) {
        return '<section class="card" style="padding:18px 20px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="margin:0;font-size:16px;font-weight:600"><span class="mono">' + o.id + '</span> · ' + L(o.svc[0], o.svc[1]) + '</h2><div class="muted" style="margin-top:3px">' + L(o.pkg[0], o.pkg[1]) + '</div></div>' + A.badge(st(o), 'lg') + '</div>' +
          '<div class="kv"><div><span>' + L('Khách', 'Customer') + '</span><b>' + esc(o.cust) + ' · ' + mask(o.phone) + '</b></div><div><span>' + L('Khu vực', 'Area') + '</span><b>' + esc(o.addr) + ', TP. HCM</b></div><div><span>' + L('Gửi yêu cầu', 'Sent') + '</span><b>' + o.sent + '</b></div><div><span>' + L('Hết hạn chờ', 'Response deadline') + '</span><b>' + o.expired + ' <span class="muted">(' + L('đã qua', 'passed') + ')</span></b></div></div>' +
          '<div class="card" style="padding:12px 14px;background:var(--fill);display:flex;flex-direction:column;gap:6px">' + o.asked.map(function (a) { return '<span>' + L('Nhà cung cấp đã nhận yêu cầu: ', 'Provider asked: ') + '<b style="font-weight:600">' + esc(A.provName(a[0])) + '</b> · <span class="badge t-neutral">' + L('Từ chối', 'Declined') + '</span> ' + L('lý do: "', 'reason: "') + L(a[2][0], a[2][1]) + '"</span>'; }).join('') + '<span class="muted" style="font-size:13px">' + L('Nhà cung cấp khác trong khu vực: ' + o.eligibleOther + ' đơn vị đủ điều kiện', 'Other providers in area: ' + o.eligibleOther + ' eligible') + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;gap:8px">' + A.btn(L('Liên hệ khách hàng', 'Contact customer'), 'noteOpen', { id: o.id, icon: 'phone', dis: A.denyTip('dunNote') }) + A.btn(L('Đóng yêu cầu', 'Close request'), 'closeReqOpen', { cls: 'danger-outline', id: o.id, dis: closeDis, tipPos: 'left' }) + '</div></section>';
      }).join('');
    }
    if (!od.length) return h + '<div class="card">' + A.empty(L('Không còn đơn quá hạn thanh toán', 'No overdue orders'), L('Các đơn đã được thanh toán hoặc đã đóng.', 'Orders were paid or closed.')) + '</div>';
    return h + '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã đơn', 'Order ID') + '</th><th>' + L('Khách hàng', 'Customer') + '</th><th>' + L('Số điện thoại', 'Phone') + '</th><th>' + L('Quá hạn', 'Overdue') + '</th><th class="num">' + L('Số tiền', 'Amount') + '</th><th>' + L('Đôn đốc', 'Follow-up') + '</th><th class="num">' + L('Hành động', 'Actions') + '</th></tr></thead><tbody>' +
      od.map(function (o) { return '<tr><td>' + A.ordLink(o.id) + '</td><td>' + esc(o.cust) + '</td><td class="mono" style="font-size:12.5px">' + mask(o.phone) + '</td><td><span class="badge ' + (o.overdueDays > 3 ? 't-warn' : 't-neutral') + '">' + L(o.overdueDays + ' ngày', o.overdueDays + ' days') + '</span></td><td class="num">' + VN.money(o.amount) + '</td><td>' + A.badge(D.DUN[o.dun || 'none']) + '</td><td class="num nw">' + A.btn(L('Ghi chú', 'Note'), 'noteOpen', { cls: 'sm', id: o.id, dis: A.denyTip('dunNote'), tipPos: 'left' }) + ' ' + A.btn(L('Đóng đơn', 'Close order'), 'closeUnpaidOpen', { cls: 'sm danger-outline', id: o.id, dis: closeDis, tipPos: 'left' }) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  ACT.closeReqOpen = function (el) { A.openModal('closeReq', { id: el.dataset.id, step: 1 }); };
  M.closeReq = function (m) {
    var o = A.order(m.id);
    return A.modalShell(L('Đóng yêu cầu ', 'Close request ') + o.id + '?', esc(o.cust) + ' · ' + L(o.svc[0], o.svc[1]),
      '<div class="note neutral">' + ic('info') + '<span>' + L('Khách sẽ nhận thông báo: "Chưa có nhà cung cấp phù hợp trong khu vực. Bạn có thể đổi khung giờ và gửi lại." Yêu cầu chuyển sang trạng thái đã đóng, không tính phí.', 'The customer is told: "No suitable provider nearby. You can change the time and resend." The request is closed, no charge.') + '</span></div>',
      A.btn(L('Đóng yêu cầu', 'Close request'), 'closeReqGo', { cls: 'danger-solid' }));
  };
  ACT.closeReqGo = function () {
    var o = A.order(A.S.modal.id); o.status = 'closedReq'; A.log(L('Đóng yêu cầu không có nhà cung cấp nhận', 'Closed unaccepted request'), o.id);
    A.S.modal = null; A.render(); A.toast(L('Đã đóng yêu cầu ' + o.id + ', thông báo đã gửi tới khách', 'Closed ' + o.id + ', customer notified'));
  };
  ACT.closeUnpaidOpen = function (el) { A.openModal('closeUnpaid', { id: el.dataset.id, step: 1, reason: '', note: '' }); };
  M.closeUnpaid = function (m) {
    var o = A.order(m.id), p = A.prov(o.prov), share = A.split(o).share;
    if (m.step === 1) return A.modalShell(L('Đóng đơn quá hạn thanh toán?', 'Close overdue order?'), '<span class="mono">' + o.id + '</span> · ' + esc(o.cust) + ' · ' + VN.money(o.amount),
      '<div class="note danger">' + ic('warning-circle') + '<span>' + L('<b>Nhà cung cấp sẽ không nhận được tiền cho đơn này.</b> Hành động không hoàn tác được.', '<b>The provider will not be paid for this order.</b> This cannot be undone.') + '</span></div>' +
      A.reasonField([['Không liên lạc được khách quá 7 ngày', 'Customer unreachable over 7 days'], ['Khách từ chối thanh toán, đã báo cơ quan chức năng', 'Customer refused, reported'], ['Khác', 'Other']], m.reason === '2' ? 'noteReq' : '') +
      A.impact(L('Tác động lên số dư ', 'Balance impact · ') + (p ? p.name : ''), [[L('Chờ khách thanh toán', 'Awaiting payment'), p.bal.awaiting, Math.max(0, p.bal.awaiting - share)]]),
      A.btn(L('Tiếp tục', 'Continue'), 'closeUnpaidNext', { cls: 'danger-solid', dis: m.reason === '' || (m.reason === '2' && !m.note) ? L('Chọn lý do trước', 'Select a reason first') : '' }));
    return A.modalShell(L('Xác nhận lần cuối', 'Final confirmation'), L('Bước 2/2', 'Step 2/2'), '<p style="margin:0;font-size:14px;line-height:1.6">' + L('Đóng đơn <b class="mono">' + o.id + '</b>? Nhà cung cấp <b>' + esc(p.name) + '</b> sẽ không nhận ' + VN.money(share) + '.', 'Close <b class="mono">' + o.id + '</b>? <b>' + esc(p.name) + '</b> will not receive ' + VN.money(share) + '.') + '</p>', A.btn(L('Đóng đơn', 'Close order'), 'closeUnpaidGo', { cls: 'danger-solid' }));
  };
  ACT.closeUnpaidNext = function () { A.S.modal.step = 2; A.render(); };
  ACT.closeUnpaidGo = function () {
    var o = A.order(A.S.modal.id), p = A.prov(o.prov), share = A.split(o).share;
    o.status = 'closedUnpaid'; o.money = 'none'; if (p) { p.bal.awaiting = Math.max(0, p.bal.awaiting - share); A.book(p.id, 'adjust', [L('Đóng đơn quá hạn ', 'Closed overdue ') + o.id, 'Closed overdue ' + o.id], ['awaiting', ''], -share, o.id); }
    A.log(L('Đóng đơn quá hạn thanh toán', 'Closed overdue order'), o.id);
    A.S.modal = null; A.render(); A.toast(L('Đã đóng đơn ', 'Closed order ') + o.id);
  };
  ACT.noteOpen = function (el) { A.openModal('note', { id: el.dataset.id, note: '' }); };
  M.note = function (m) {
    var o = A.order(m.id), notes = A.S.notes[o.id] || [];
    return '<div class="scrim" data-act="closeModal"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="nt-h"><div class="modal-h"><div><h2 id="nt-h">' + L('Ghi chú nội bộ', 'Internal note') + ' · <span class="mono">' + o.id + '</span></h2><p>' + L('Chỉ quản trị viên thấy. Không gửi cho khách hay nhà cung cấp.', 'Visible to admins only. Not sent to customer or provider.') + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="modal-b"><div class="kv" style="grid-template-columns:1fr 1fr"><div><span>' + L('Khách', 'Customer') + '</span><b>' + esc(o.cust) + '</b></div><div><span>' + L('Số điện thoại', 'Phone') + '</span><b class="mono">' + o.phone + '</b></div></div>' +
      '<div class="field"><label for="nt-t">' + L('Nội dung', 'Note') + ' <span class="req">*</span></label><textarea id="nt-t" class="txa" maxlength="500" data-in="mset" data-k="note" placeholder="' + L('Ví dụ: đã gọi, khách hẹn gửi lại yêu cầu tối nay', 'e.g. called, customer will resend tonight') + '">' + esc(m.note) + '</textarea></div>' +
      (notes.length ? '<div class="tl">' + notes.map(function (n) { return '<div class="tl-i"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + esc(n[2]) + '<small>' + esc(n[0]) + '</small></span><span class="tm">' + n[1] + '</span></div>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="modal-f"><div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + A.btn(L('Lưu ghi chú', 'Save note'), 'noteSave', { cls: 'primary', dis: m.note.trim() ? '' : L('Nhập nội dung', 'Enter a note') }) + '</div></div></aside>';
  };
  ACT.noteSave = function () {
    var m = A.S.modal; A.S.notes[m.id] = [[A.me(), '24/09 ' + VN.nowTime(), m.note.trim()]].concat(A.S.notes[m.id] || []);
    A.log(L('Thêm ghi chú nội bộ', 'Added internal note'), m.id); A.S.modal = null; A.render(); A.toast(L('Đã lưu ghi chú cho ', 'Note saved for ') + m.id);
  };

  /* ---------- Chi tiết đơn (O2) ---------- */
  A.P.order = {
    nav: 'orders',
    crumb: function () { return [[L('Đơn hàng', 'Orders'), 'orders'], [L('Quản lý đơn hàng', 'Order management'), 'orders', 'list'], ['<span class="mono">' + esc(A.S.p.id) + '</span>']]; },
    render: function () {
      var o = A.order(A.S.p.id);
      if (!o) return '<div class="card">' + A.empty(L('Không tìm thấy đơn', 'Order not found'), '') + '</div>';
      var s = A.split(o), p = A.prov(o.prov), tab = A.ui('odTab', 'tl');
      var h = '<div class="page-h"><div><h1>' + L(o.svc[0], o.svc[1]) + '<span class="mono">' + o.id + '</span>' + A.badge(st(o)) + '</h1><div class="sub">' + L('Cập nhật ', 'Updated ') + VN.ago(o.upd) + (A.sees('transactions') && o.money !== 'none' ? ' · <button type="button" class="link" data-act="goOrder" data-id="' + o.id + '" data-x="money">' + L('Tiền của đơn', 'Order money') + ' →</button>' : '') + '</div></div></div>';
      h += '<div class="audit-note">' + L('Mọi thao tác can thiệp đều cần lý do và được ghi vào Nhật ký.', 'Every intervention requires a reason and is recorded in the Audit log.') + '</div>';
      // Cột trái
      var info = [[L('Dịch vụ', 'Service'), L(o.pkg[0], o.pkg[1])], [L('Khách', 'Customer'), esc(o.cust) + ' · <span class="mono">' + mask(o.phone) + '</span>'], [L('Địa chỉ', 'Address'), esc(o.addr) + ', TP. Hồ Chí Minh'], [L('Lịch hẹn', 'Scheduled'), o.sched ? o.sched[0] + ' · ' + o.sched[1] : L('Không có', 'None')],
        [L('Nhà cung cấp', 'Provider'), p ? A.provLink(p.id, 'provider') : L('Không có', 'None')], [L('Kỹ thuật viên', 'Technician'), esc(o.tech || L('Chưa phân công', 'Unassigned'))], [L('Giá', 'Price'), VN.money(o.amount) + ' <span class="muted">' + L('(gói cố định)', '(fixed package)') + '</span>'], [L('Hoa hồng 15%', 'Commission 15%'), VN.money(s.comm)]];
      var left = '<section class="card" aria-labelledby="oi-h"><div class="card-h"><h2 id="oi-h">' + L('Thông tin đơn', 'Order details') + '</h2></div><div class="card-b"><div class="kv">' + info.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') + '</div>' + (o.note ? '<div class="note neutral" style="margin-top:14px">' + ic('chat-circle-text') + '<span>' + L('Ghi chú của khách: ', 'Customer note: ') + L(o.note[0], o.note[1]) + '</span></div>' : '') + '</div></section>';
      left += '<section class="card"><div style="padding:0 20px"><div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'tl') + '" class="' + (tab === 'tl' ? 'on' : '') + '" data-act="odTab" data-id="tl">' + L('Dòng thời gian', 'Timeline') + '</button><button type="button" role="tab" aria-selected="' + (tab === 'chat') + '" class="' + (tab === 'chat' ? 'on' : '') + '" data-act="odTab" data-id="chat">' + ic('lock-simple') + L('Tin nhắn', 'Messages') + '<span class="n">' + (o.chat ? o.chat.length : 0) + '</span></button></div></div><div class="card-b">' + (tab === 'tl' ? timeline(o) : chat(o)) + '</div></section>';
      // Cột giữa: ảnh
      var mid = '<section class="card" aria-labelledby="ph-h"><div class="card-h"><h2 id="ph-h">' + L('Ảnh hiện trạng', 'Site photos') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:12px">' +
        '<div><div class="lbl" style="margin-bottom:6px">' + L('Trước khi làm', 'Before') + '</div><div class="photo" style="aspect-ratio:4/3"><span>' + L('Ảnh: dàn lạnh bám bụi, 800×600', 'Photo: dusty indoor unit, 800×600') + '</span></div><div class="muted" style="font-size:11.5px;margin-top:4px">10:15 · ' + L('cách địa chỉ 18 m', '18 m from address') + '</div></div>' +
        '<div><div class="lbl" style="margin-bottom:6px">' + L('Sau khi làm', 'After') + '</div>' + (o.status === 'done' ? '<div class="photo" style="aspect-ratio:4/3"><span>' + L('Ảnh: dàn lạnh sau vệ sinh, 800×600', 'Photo: indoor unit after cleaning, 800×600') + '</span></div>' : '<div class="photo empty-ph" style="aspect-ratio:4/3">' + L('Chưa có', 'Not yet') + '</div>') + '</div>' +
        (o.cust ? '<div><div class="lbl" style="margin-bottom:6px">' + L('Ảnh khách gửi', 'Customer photos') + '</div><div class="photo" style="aspect-ratio:16/9"><span>' + L('Ảnh: nước chảy từ máy, 800×450', 'Photo: water leaking, 800×450') + '</span></div></div>' : '') + '</div></section>';
      // Cột phải: trạng thái + can thiệp
      var cancelDis = !A.can('orderCancel') ? A.denyTip('orderCancel', 'intervene') : (o.status === 'cancelled' || o.status === 'done') ? L('Không huỷ được đơn đã ' + (o.status === 'done' ? 'hoàn tất' : 'huỷ'), 'Cannot cancel a ' + (o.status === 'done' ? 'completed' : 'cancelled') + ' order') : '';
      var right = '<section class="card" aria-labelledby="cs-h"><div class="card-h"><h2 id="cs-h">' + L('Trạng thái hiện tại', 'Current status') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">' + A.badge(st(o), 'lg') +
        (o.status === 'progress' ? '<div class="row-kv"><span>' + L('Thời gian bắt đầu', 'Started') + '</span><b>' + o.started + '</b></div><div class="row-kv"><span>' + L('Dự kiến xong', 'Expected finish') + '</span><b>' + o.eta + '</b></div>' : '') +
        (o.cancelBy ? '<div class="row-kv"><span>' + L('Lý do huỷ', 'Cancel reason') + '</span><b style="white-space:normal;text-align:right">' + L(o.cancelBy[0], o.cancelBy[1]) + '</b></div>' : '') +
        (o.money !== 'none' ? '<div class="row-kv"><span>' + L('Tiền', 'Money') + '</span>' + A.moneyBadge(o) + '</div>' : '') + '</div></section>' +
        '<section class="card" aria-labelledby="iv-h"><div class="card-h"><h2 id="iv-h">' + L('Can thiệp', 'Intervene') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:8px">' +
        A.btn(L('Đổi trạng thái thủ công', 'Change status manually'), 'mstatusOpen', { cls: 'lg', id: o.id, icon: 'lightning', dis: !A.can('orderStatus') ? A.denyTip('orderStatus', 'intervene') : o.status === 'cancelled' ? L('Đơn đã huỷ', 'Order cancelled') : '' }) +
        A.btn(L('Ghi chú nội bộ', 'Internal note'), 'noteOpen', { cls: 'lg', id: o.id, icon: 'note-pencil', dis: A.denyTip('orderNote', 'intervene') }) +
        '<div style="height:1px;background:var(--line);margin:6px 0"></div>' + A.btn(L('Huỷ đơn', 'Cancel order'), 'cancelOpen', { cls: 'lg danger-outline', id: o.id, dis: cancelDis }) + '</div></section>' +
        ((A.S.notes[o.id] || []).length ? '<section class="card"><div class="card-h"><h2>' + L('Ghi chú nội bộ', 'Internal notes') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:8px">' + A.S.notes[o.id].map(function (n) { return '<div style="font-size:13px"><b style="font-weight:500">' + esc(n[0]) + '</b> <span class="muted">' + n[1] + '</span><div>' + esc(n[2]) + '</div></div>'; }).join('') + '</div></section>' : '');
      return h + '<div class="grid3c"><div class="stack">' + left + '</div><div class="stack">' + mid + '</div><div class="stack">' + right + '</div></div>';
    }
  };
  function timeline(o) {
    var ev = (o.ev || []).map(function (e) { return ['done', L(e[1][0], e[1][1]), e[0]]; });
    if (!o.ev) {
      ev.push(['done', L('Khách gửi yêu cầu', 'Request sent'), o.sched ? o.sched[0] : '']);
      if (o.prov) ev.push(['done', L('Khách chọn ', 'Customer chose ') + esc(A.provName(o.prov)), '']);
      if (o.accepted) ev.push(['done', L('Khách nghiệm thu', 'Signed off'), o.accepted]);
      if (o.paidAt) ev.push(['done', L('Khách thanh toán', 'Paid'), o.paidAt]);
    }
    (o.manual || []).forEach(function (m) { ev.push([m[3] || 'manual', ic('lightning', 'zap') + m[1], m[0], m[2]]); });
    if (o.status === 'progress' || o.status === 'moving') ev.push(['now', L(o.now ? o.now[0] : 'Đang thực hiện', o.now ? o.now[1] : 'In progress') + '…', '']);
    else if (o.status !== 'cancelled' && o.status !== 'done' && o.status !== 'closedReq' && o.status !== 'closedUnpaid') ev.push(['now', L(st(o)[0], st(o)[1]), '']);
    if (o.status === 'progress' || o.status === 'moving' || o.status === 'assigned' || o.status === 'unassigned') { ev.push(['todo', L('Nghiệm thu', 'Sign-off'), '']); ev.push(['todo', L('Thanh toán', 'Payment'), '']); }
    return '<div class="tl">' + ev.map(function (e) { return '<div class="tl-i ' + e[0] + '"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + e[1] + (e[3] ? '<small>' + esc(e[3]) + '</small>' : '') + '</span><span class="tm">' + e[2] + '</span></div>'; }).join('') + '</div>';
  }
  function chat(o) {
    if (!o.chat) return A.empty(L('Chưa có tin nhắn', 'No messages'), L('Chat chỉ mở trong thời gian đơn đang hoạt động.', 'Chat is open only while the order is active.'));
    return '<div class="chatlog">' + o.chat.map(function (c) { return '<div class="msg' + (c[0] === 't' ? ' me' : '') + '">' + L(c[1], c[2]) + '<small>' + (c[0] === 't' ? L('Kỹ thuật viên ', 'Technician ') + esc(o.tech) : esc(o.cust)) + ' · ' + c[3] + '</small></div>'; }).join('') + '</div><div class="readonly" style="margin-top:14px">' + ic('lock-simple') + L('Quản trị viên chỉ xem, không thể nhắn tin', 'Admins can read only, not send messages') + '</div>';
  }
  ACT.odTab = function (el) { A.S.ui.odTab = el.dataset.id; A.render(); };
  var CANCEL_REASONS = [['Khách yêu cầu', 'Customer request'], ['Nhà cung cấp không liên lạc được', 'Provider unreachable'], ['Sự cố kỹ thuật', 'Technical issue'], ['Lý do khác', 'Other reason']];
  ACT.cancelOpen = function (el) { A.openModal('cancel', { id: el.dataset.id, reason: '', note: '', step: 1 }); };
  M.cancel = function (m) {
    var o = A.order(m.id), paid = !!o.paidAt;
    var body = m.step === 1 ? '<div class="field"><span class="flabel">' + L('Lý do huỷ', 'Cancel reason') + ' <span class="req">*</span></span><div class="radios">' + CANCEL_REASONS.map(function (r, i) { return '<label class="radio-card"><input type="radio" name="cr" value="' + i + '"' + (String(m.reason) === String(i) ? ' checked' : '') + ' data-in="mset" data-k="reason">' + L(r[0], r[1]) + '</label>'; }).join('') + '</div></div>' +
      '<div class="field"><label for="cn-t">' + L('Ghi chú', 'Note') + (m.reason === '3' ? ' <span class="req">*</span>' : '') + '</label><textarea id="cn-t" class="txa" maxlength="500" data-in="mset" data-k="note" placeholder="' + L('Bắt buộc khi chọn "Lý do khác"', 'Required for "Other reason"') + '">' + esc(m.note) + '</textarea>' + (m.reason === '3' && !m.note ? '<span class="err">' + L('Nhập ghi chú cho "Lý do khác"', 'Add a note for "Other reason"') + '</span>' : '') + '</div>' +
      '<div class="note warn">' + ic('warning') + '<span><b>' + L('Hành động này không thể hoàn tác.', 'This cannot be undone.') + '</b> ' + (paid ? L('Khách đã thanh toán ' + VN.money(o.amount) + ': sau khi huỷ, tạo yêu cầu hoàn tiền ở Tài chính (duyệt hai bước nếu từ 500.000 ₫).', 'The customer paid ' + VN.money(o.amount) + ': after cancelling, create a refund in Finance (two-step if 500,000 ₫ or more).') : L('Khách chưa thanh toán nên không phát sinh hoàn tiền. Nhà cung cấp không nhận tiền cho đơn này. Khách và nhà cung cấp nhận thông báo kèm lý do.', 'The customer has not paid, so there is no refund. The provider is not paid for this order. Both sides are notified with the reason.')) + '</span></div>'
      : '<p style="margin:0;font-size:14px;line-height:1.6">' + L('Huỷ đơn <b class="mono">' + o.id + '</b> với lý do "<b>' + CANCEL_REASONS[+m.reason][0] + '</b>"?', 'Cancel <b class="mono">' + o.id + '</b> for "<b>' + CANCEL_REASONS[+m.reason][1] + '</b>"?') + '</p><div class="note danger">' + ic('warning-circle') + '<span>' + L('Bước 2/2: xác nhận lần cuối. Kỹ thuật viên ' + esc(o.tech || '') + ' sẽ nhận lệnh dừng việc ngay.', 'Step 2/2: final confirmation. Technician ' + esc(o.tech || '') + ' is told to stop immediately.') + '</span></div>';
    var ok = m.reason !== '' && (m.reason !== '3' || m.note.trim());
    return '<div class="scrim" data-act="closeModal"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cx-h"><div class="modal-h"><div><h2 id="cx-h">' + L('Huỷ đơn ', 'Cancel order ') + '<span class="mono">' + o.id + '</span></h2><p>' + esc(o.cust) + ' · ' + L(o.svc[0], o.svc[1]) + ' · ' + A.badge(st(o)) + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div><div class="modal-b">' + body + '</div>' +
      '<div class="modal-f">' + (m.step === 2 ? A.btn(L('Quay lại', 'Back'), 'mstep', { x: '1' }) : '') + '<div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + (m.step === 1 ? A.btn(L('Tiếp tục', 'Continue'), 'mstep', { cls: 'danger-solid', x: '2', dis: ok ? '' : L('Chọn lý do huỷ', 'Choose a reason') }) : A.btn(L('Xác nhận huỷ đơn', 'Confirm cancellation'), 'cancelGo', { cls: 'danger-solid' })) + '</div></div></aside>';
  };
  ACT.mstep = function (el) { A.S.modal.step = +el.dataset.x; A.render(); };
  ACT.cancelGo = function () {
    var m = A.S.modal, o = A.order(m.id), r = CANCEL_REASONS[+m.reason];
    o.status = 'cancelled'; o.cancelBy = [L('Quản trị viên huỷ: ', 'Cancelled by admin: ') + r[0] + (m.note ? ' (' + m.note + ')' : ''), 'Cancelled by admin: ' + r[1]]; o.upd = 0;
    o.manual = (o.manual || []).concat([[VN.nowTime(), L('Quản trị viên huỷ đơn (' + r[0] + ')', 'Admin cancelled the order (' + r[1] + ')'), A.me() + (m.note ? ' · ' + m.note : ''), 'red']]);
    A.log(L('Huỷ đơn', 'Cancelled order'), o.id);
    A.S.modal = null; A.render(); A.toast(L('Đã huỷ đơn ', 'Cancelled order ') + o.id);
  };
  var FLOW = ['assigned', 'moving', 'progress', 'signoff', 'payment', 'done'];
  ACT.mstatusOpen = function (el) { A.openModal('mstatus', { id: el.dataset.id, to: '', note: '', ok: false }); };
  M.mstatus = function (m) {
    var o = A.order(m.id);
    var ok = m.to && m.note.trim() && m.ok;
    return A.modalShell(L('Đổi trạng thái thủ công', 'Change status manually'), '<span class="mono">' + o.id + '</span> · ' + L('hiện tại: ', 'current: ') + L(st(o)[0], st(o)[1]),
      '<div class="field"><label for="ms-to">' + L('Trạng thái mới', 'New status') + ' <span class="req">*</span></label><select id="ms-to" class="sel" data-in="mset" data-k="to"><option value="">' + L('Chọn trạng thái', 'Select a status') + '</option>' + FLOW.filter(function (k) { return k !== o.status; }).map(function (k) { return '<option value="' + k + '"' + (m.to === k ? ' selected' : '') + '>' + L(D.ORDER_STATUS[k][0], D.ORDER_STATUS[k][1]) + '</option>'; }).join('') + '</select><span class="hint">' + L('Chỉ Super admin. Không tự động tính tiền; tiền đi theo luồng Tài chính.', 'Super admin only. Money is not recalculated; it follows the Finance flow.') + '</span></div>' +
      '<div class="field"><label for="ms-n">' + L('Lý do', 'Reason') + ' <span class="req">*</span></label><textarea id="ms-n" class="txa" maxlength="500" data-in="mset" data-k="note" placeholder="' + L('Ví dụ: kỹ thuật viên mất sóng, xác nhận qua điện thoại đã xong việc', 'e.g. technician offline, confirmed by phone the job is done') + '">' + esc(m.note) + '</textarea></div>' +
      '<label class="chk"><input type="checkbox" data-in="mset" data-k="ok"' + (m.ok ? ' checked' : '') + '>' + L('Tôi xác nhận hành động này và chịu trách nhiệm về thay đổi', 'I confirm this action and take responsibility for the change') + '</label>',
      A.btn(L('Đổi trạng thái', 'Change status'), 'mstatusGo', { cls: 'primary', dis: ok ? '' : L('Chọn trạng thái, nhập lý do và tích xác nhận', 'Pick a status, enter a reason and tick the confirmation') }));
  };
  ACT.mstatusGo = function () {
    var m = A.S.modal, o = A.order(m.id), from = st(o);
    o.status = m.to; o.upd = 0;
    o.manual = (o.manual || []).concat([[VN.nowTime(), L('Đổi trạng thái thủ công: ' + from[0] + ' → ' + D.ORDER_STATUS[m.to][0], 'Manual status change: ' + from[1] + ' → ' + D.ORDER_STATUS[m.to][1]), A.me() + ' · ' + m.note]]);
    A.log(L('Đổi trạng thái thủ công', 'Manual status change'), o.id);
    A.S.modal = null; A.render(); A.toast(L('Đã đổi trạng thái ' + o.id + ' sang ' + D.ORDER_STATUS[m.to][0], o.id + ' set to ' + D.ORDER_STATUS[m.to][1]));
  };

  /* ---------- Yêu cầu dịch vụ (#81) ---------- */
  A.P.requests = {
    crumb: function () { return null; },
    render: function () {
      var tab = A.S.p.tab || 'all', rq = A.S.d.REQUESTS;
      var cnt = function (s) { return rq.filter(function (r) { return r.st === s; }).length; };
      var tabs = [['all', L('Tất cả', 'All'), rq.length], ['waiting', L('Đang chờ phản hồi', 'Awaiting responses'), cnt('waiting')], ['choosing', L('Chờ khách chọn', 'Awaiting choice'), cnt('choosing')], ['closed', L('Đã chốt đơn', 'Order placed'), cnt('closed')], ['expired', L('Hết hạn', 'Expired'), cnt('expired')], ['cancelled', L('Đã huỷ', 'Cancelled'), cnt('cancelled')]];
      var rows = rq.filter(function (r) { return tab === 'all' || r.st === tab; });
      var h = '<div class="page-h"><div><h1>' + L('Yêu cầu dịch vụ', 'Service requests') + '</h1><div class="sub">' + L('Yêu cầu khách gửi tới nhiều nhà cung cấp, trước khi chốt thành đơn', 'Requests sent to several providers before becoming an order') + '</div></div></div>';
      h += '<div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" aria-selected="' + (tab === t[0]) + '" class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-id="' + t[0] + '">' + t[1] + '<span class="n">' + t[2] + '</span></button>'; }).join('') + '</div>';
      h += '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã yêu cầu', 'Request') + '</th><th>' + L('Khách hàng', 'Customer') + '</th><th>' + L('Dịch vụ', 'Service') + '</th><th>' + L('Gửi lúc', 'Sent') + '</th><th>' + L('Phản hồi', 'Responses') + '</th><th>' + L('Trạng thái', 'Status') + '</th><th class="num">' + L('Còn lại', 'Time left') + '</th></tr></thead><tbody>' +
        (rows.length ? rows.map(function (r) { var ok = r.asked.filter(function (a) { return a[1] === 'confirmed' || a[1] === 'chosen'; }).length; return '<tr class="click" tabindex="0" data-act="reqOpen" data-id="' + r.id + '"><td class="id">' + r.id + '</td><td>' + esc(r.cust) + '</td><td>' + L(r.svc[0], r.svc[1]) + '</td><td class="muted nw">' + r.sent + '</td><td>' + L(ok + '/' + r.asked.length + ' xác nhận', ok + '/' + r.asked.length + ' confirmed') + '</td><td>' + A.badge(D.REQ_STATUS[r.st]) + '</td><td class="num">' + (r.left ? '<span class="badge ' + (r.left < 10 ? 't-warn' : 't-info') + '">' + r.left + L(' phút', ' min') + '</span>' : '<span class="subtle">' + L('Không có', 'None') + '</span>') + '</td></tr>'; }).join('') : '<tr><td colspan="7">' + A.empty(L('Không có yêu cầu', 'No requests'), '') + '</td></tr>') +
        '</tbody></table>' + A.foot(rows.length, tab === 'all' ? 3412 : rows.length, ['yêu cầu', 'requests']) + '</div>';
      if (A.S.p.id && !A.S.modal) setTimeout(function () { if (!A.S.modal) { var id = A.S.p.id; A.S.p = { tab: A.S.p.tab }; A.openModal('req', { id: id === 'YC-58140' || id === 'YC-58227' ? id : id }); } }, 0);
      return h;
    }
  };
  ACT.reqOpen = function (el) { A.openModal('req', { id: el.dataset.id }); };
  M.req = function (m) {
    var r = A.S.d.REQUESTS.filter(function (x) { return x.id === m.id; })[0];
    if (!r) { var o = A.order(m.id); r = { id: m.id, cust: o.cust, svc: o.svc, sent: o.sent || '', st: o.status === 'nobody' ? 'expired' : 'waiting', asked: o.asked || [[o.prov, 'waiting']] }; }
    var AS = { waiting: [L('Đang chờ', 'Waiting'), 'info'], confirmed: [L('Đã xác nhận', 'Confirmed'), 'ok'], chosen: [L('Được khách chọn', 'Chosen'), 'ok'], declined: [L('Từ chối', 'Declined'), 'neutral'], expired: [L('Hết hạn, không phản hồi', 'Expired, no reply'), 'neutral'] };
    return '<div class="scrim" data-act="closeModal"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="rq-h"><div class="modal-h"><div><h2 id="rq-h"><span class="mono">' + r.id + '</span> · ' + L(r.svc[0], r.svc[1]) + '</h2><p>' + esc(r.cust) + ' · ' + L('gửi ', 'sent ') + r.sent + ' · ' + A.badge(D.REQ_STATUS[r.st]) + '</p></div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="modal-b"><div class="lbl">' + L('Phản hồi của từng nhà cung cấp', 'Responses by provider') + '</div><div class="tl">' + r.asked.map(function (a) { var s = AS[a[1]]; return '<div class="tl-i ' + (a[1] === 'waiting' ? 'now' : a[1] === 'declined' || a[1] === 'expired' ? 'todo' : '') + '"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + esc(A.provName(a[0])) + '<small><span class="badge t-' + s[1] + '">' + s[0] + '</span>' + (a[2] && typeof a[2] === 'string' ? ' ' + L('khung giờ ', 'slot ') + a[2] : a[2] ? ' "' + L(a[2][0], a[2][1]) + '"' : '') + '</small></span><span class="tm"></span></div>'; }).join('') + '</div>' +
      (r.order ? '<div class="note ok">' + ic('check-circle') + '<span>' + L('Đã chốt thành đơn ', 'Became order ') + '<button type="button" class="link mono" data-act="goOrder" data-id="' + r.order + '">' + r.order + '</button></span></div>' : '') +
      (r.cancel ? '<div class="note neutral">' + ic('info') + '<span>' + L(r.cancel[0], r.cancel[1]) + '</span></div>' : '') +
      (r.st === 'expired' ? '<div class="note danger">' + ic('warning-circle') + '<span>' + L('Không nhà cung cấp nào xác nhận trong thời hạn. Xem ở Đơn hàng > Cần chú ý.', 'No provider confirmed in time. See Orders > Needs attention.') + '</span></div>' : '') + '</div>' +
      '<div class="modal-f"><div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + '</div></div></aside>';
  };

  /* ---------- Khiếu nại (#88) ---------- */
  var VERDICTS = [['reject', ['Bác khiếu nại, trả tiền cho nhà cung cấp', 'Reject, release funds to provider']], ['redo', ['Yêu cầu làm lại (tạo đơn bảo hành 0 ₫)', 'Redo (create a 0 ₫ warranty order)']], ['partial', ['Hoàn một phần cho khách', 'Partial refund to customer']], ['full', ['Hoàn toàn bộ cho khách', 'Full refund to customer']]];
  A.P.disputes = {
    crumb: function () { return null; },
    render: function () {
      var list = A.S.d.DISPUTES.filter(function (d) { return d.st === 'open'; }), key = 'sel-disputes', sel = A.ui(key, list[0] && list[0].id);
      if (!list.some(function (x) { return x.id === sel; })) { sel = list[0] && list[0].id; A.S.ui[key] = sel; }
      var h = '<div class="page-h"><div><h1>' + L('Khiếu nại', 'Disputes') + '</h1><div class="sub">' + L('Mở trong thời hạn bảo hành. Tiền của nhà cung cấp được tạm giữ tới khi có phán quyết.', 'Opened during warranty. Provider funds are held until a ruling.') + '</div></div></div>';
      if (!list.length) return h + '<div class="card">' + A.empty(L('Không còn khiếu nại chờ phân xử', 'No disputes awaiting ruling'), L('Khiếu nại mới sẽ xuất hiện ở đây.', 'New disputes will appear here.')) + '</div>';
      var cur = list.filter(function (x) { return x.id === sel; })[0];
      return h + '<div class="queue"><div class="q-list">' + list.map(function (d) { var o = A.order(d.order) || {}; return '<button type="button" class="q-item' + (d.id === sel ? ' on' : '') + '" data-act="qsel" data-id="' + d.id + '" data-x="' + key + '"><span class="r1"><b class="mono" style="font-size:13px">' + d.id + '</b><small>' + VN.ago(d.age) + '</small></span><b style="font-weight:500">' + L(d.reason[0], d.reason[1]) + '</b><small>' + esc(o.cust || d.cust) + ' · ' + esc(A.provName(o.prov || d.prov)) + '</small></button>'; }).join('') + '</div><div class="q-detail">' + disputeDetail(cur) + '</div></div>';
    }
  };
  function disputeDetail(d) {
    var o = A.order(d.order) || { id: d.order, cust: d.cust, prov: d.prov, svc: d.svc, amount: d.amount, money: 'hold', cat: A.prov(d.prov).cats[0] };
    var v = A.ui('verdict-' + d.id, '');
    var ev = [['done', L('Kỹ thuật viên check-in GPS, cách 12 m', 'Technician GPS check-in, 12 m away'), '22/09 14:02'], ['done', L('Ảnh trước khi làm · 3 ảnh', 'Before photos · 3'), '22/09 14:05'], ['done', L('Ảnh sau khi làm · 3 ảnh', 'After photos · 3'), '22/09 16:15'], ['done', L('Khách nghiệm thu bảng chốt', 'Customer signed the sheet'), '22/09 16:22'], ['done', L('Khách thanh toán', 'Customer paid'), '22/09 16:30'], ['red', L('Khách mở khiếu nại, tiền tạm giữ', 'Dispute opened, funds held'), d.opened]];
    var body = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="margin:0;font-size:18px;font-weight:600"><span class="mono">' + d.id + '</span> · ' + L(d.reason[0], d.reason[1]) + '</h2><div class="muted" style="margin-top:4px">' + L('Đơn ', 'Order ') + A.ordLink(o.id) + ' · ' + L(o.svc[0], o.svc[1]) + ' · ' + VN.money(o.amount) + ' · ' + esc(o.cust) + ' / ' + esc(A.provName(o.prov)) + '</div></div><span class="badge lg t-danger">' + L('Đang tạm giữ', 'On hold') + '</span></div>' +
      '<div class="note neutral">' + ic('chat-circle-text') + '<span>' + L('Khách đề nghị: ', 'Customer asks: ') + '<b>' + L(d.ask[0], d.ask[1]) + '</b> · ' + L('mở ', 'opened ') + d.opened + '</span></div>' +
      '<div><div class="lbl" style="margin-bottom:8px">' + L('Bằng chứng', 'Evidence') + '</div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px"><div class="photo" style="aspect-ratio:4/3"><span>' + L('Trước · kỹ thuật viên', 'Before · technician') + '</span></div><div class="photo" style="aspect-ratio:4/3"><span>' + L('Sau · kỹ thuật viên', 'After · technician') + '</span></div><div class="photo" style="aspect-ratio:4/3"><span>' + L('Ảnh khách gửi · 23/09', 'Customer photo · 23/09') + '</span></div></div></div>' +
      '<div class="grid2e" style="gap:16px"><div><div class="lbl" style="margin-bottom:8px">' + L('Dòng thời gian, dấu thời gian và vị trí', 'Timeline, timestamps and location') + '</div><div class="tl">' + ev.map(function (e) { return '<div class="tl-i ' + e[0] + '"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t">' + e[1] + '</span><span class="tm">' + e[2] + '</span></div>'; }).join('') + '</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px"><div><div class="lbl" style="margin-bottom:8px">' + L('Bảng chốt khối lượng', 'Sign-off sheet') + '</div><div class="card" style="padding:12px 14px;display:flex;flex-direction:column;gap:4px">' + (o.lines || [[[L(o.svc[0], o.svc[1]), ''], o.amount]]).map(function (l) { return '<div class="row-kv"><span>' + L(l[0][0], l[0][1]) + '</span><b>' + VN.money(l[1]) + '</b></div>'; }).join('') + '<div class="muted" style="font-size:12px">' + L('Khách ký 22/09 16:22', 'Signed 22/09 16:22') + '</div></div></div>' +
      '<div><div class="lbl" style="margin-bottom:8px">' + L('Tin nhắn trong đơn', 'Order messages') + '</div><div class="chatlog"><div class="msg">' + L('Em ơi sofa còn vết ố ở tay vịn.', 'The armrest still has stains.') + '<small>' + esc(o.cust) + ' · 22/09 16:40</small></div><div class="msg me">' + L('Vết ố lâu năm, em đã báo trước là không sạch hẳn được ạ.', 'Old stains, I warned they may not fully come out.') + '<small>' + L('Kỹ thuật viên', 'Technician') + ' · 22/09 16:52</small></div></div></div></div></div>' +
      '<div class="field"><span class="flabel">' + L('Phán quyết', 'Ruling') + '</span><div class="radios" style="display:grid;grid-template-columns:1fr 1fr">' + VERDICTS.map(function (x) { return '<label class="radio-card"><input type="radio" name="vd-' + d.id + '" value="' + x[0] + '"' + (v === x[0] ? ' checked' : '') + ' data-in="uiset" data-k="verdict-' + d.id + '">' + L(x[1][0], x[1][1]) + '</label>'; }).join('') + '</div></div>';
    var dis = !A.can('disputeRule') ? A.denyTip('disputeRule') : !v ? L('Chọn một phán quyết', 'Choose a ruling') : '';
    return '<div class="q-body">' + body + '</div><div class="q-bar"><span class="muted" style="font-size:12.5px">' + L('Phán quyết ghi vào Nhật ký xử lý và thông báo cho hai bên', 'Rulings are logged and both sides notified') + '</span><div class="r">' + A.btn(L('Ra phán quyết', 'Issue ruling'), 'ruleOpen', { cls: 'primary', id: d.id, dis: dis, tipPos: 'left' }) + '</div></div>';
  }
  ACT.ruleOpen = function (el) { var d = A.S.d.DISPUTES.filter(function (x) { return x.id === el.dataset.id; })[0]; var o = A.order(d.order); A.openModal('rule', { id: d.id, v: A.ui('verdict-' + d.id), reason: '', note: '', amount: String(o ? R(o.amount / 2) : 0) }); };
  M.rule = function (m) {
    var d = A.S.d.DISPUTES.filter(function (x) { return x.id === m.id; })[0], o = A.order(d.order), vd = VERDICTS.filter(function (x) { return x[0] === m.v; })[0];
    var amt = m.v === 'full' ? (o ? o.amount : d.amount) : VN.parseMoney(m.amount), big = (m.v === 'partial' || m.v === 'full') && amt >= D.REFUND_THRESHOLD;
    var body = '<div class="note info">' + ic('scales') + '<span><b>' + L(vd[1][0], vd[1][1]) + '</b></span></div>';
    if (m.v === 'partial') body += '<div class="field"><label for="ru-a">' + L('Số tiền hoàn', 'Refund amount') + '</label><div class="inp-wrap"><input id="ru-a" class="inp" inputmode="numeric" data-in="mset" data-k="amount" value="' + esc(m.amount) + '"><span class="suffix">₫</span></div><span class="hint">' + L('Tối đa ', 'Max ') + VN.money(o ? o.amount : d.amount) + '</span></div>';
    body += A.reasonField([['Bằng chứng ảnh trước/sau cho thấy làm đúng', 'Before/after photos show correct work'], ['Bằng chứng ảnh cho thấy chưa đạt', 'Photos show work below standard'], ['Hai bên đã thoả thuận', 'Both sides agreed'], ['Khác', 'Other']], m.reason === '3' ? 'noteReq' : '');
    if (big) body += '<div class="note warn">' + ic('info') + '<span>' + L('Số tiền từ 500.000 ₫: tạo yêu cầu hoàn tiền chờ duyệt bước hai ở Tài chính.', '500,000 ₫ or more: creates a refund awaiting second approval in Finance.') + '</span></div>';
    if (m.v === 'redo') body += '<div class="note neutral">' + ic('info') + '<span>' + L('MVP: quản trị viên tạo đơn bảo hành mới 0 ₫ cho cùng nhà cung cấp. Tiền vẫn tạm giữ tới khi làm lại xong.', 'MVP: admin creates a new 0 ₫ warranty order for the same provider. Funds stay on hold until redone.') + '</span></div>';
    return A.modalShell(L('Ra phán quyết ', 'Issue ruling ') + d.id, L('Đơn ', 'Order ') + d.order, body, A.btn(L('Xác nhận phán quyết', 'Confirm ruling'), 'ruleGo', { cls: 'primary', dis: m.reason === '' || (m.reason === '3' && !m.note) ? L('Chọn lý do trước', 'Select a reason first') : (m.v === 'partial' && (!amt || amt > (o ? o.amount : d.amount))) ? L('Số tiền không hợp lệ', 'Invalid amount') : '' }));
  };
  ACT.ruleGo = function () {
    var m = A.S.modal, d = A.S.d.DISPUTES.filter(function (x) { return x.id === m.id; })[0], o = A.order(d.order);
    if (!o) { o = { id: d.order, cust: d.cust, prov: d.prov, svc: d.svc, amount: d.amount, money: 'hold', cat: A.prov(d.prov).cats[0], status: 'dispute', dispute: d.id, paidAt: '22/09', payMethod: 'card', warrantyEnd: '26/09' }; A.S.d.ORDERS.push(o); var p0 = A.prov(o.prov); p0.bal.hold += A.split(o).share; p0.bal.warranty = Math.max(0, p0.bal.warranty - A.split(o).share); }
    d.st = 'resolved'; d.ruling = m.v;
    var msg;
    if (m.v === 'reject') {
      var p = A.prov(o.prov), s = A.split(o); p.bal.hold -= s.share; p.bal.warranty += s.share; o.money = 'warranty'; o.status = 'done';
      A.moneyEv(o, L('Phán quyết ' + d.id + ': bác khiếu nại, trả tiền cho nhà cung cấp', 'Ruling ' + d.id + ': rejected, funds released'));
      A.book(o.prov, 'hold', [L('Trả lại tạm giữ theo phán quyết ', 'Released per ruling ') + d.id, 'Released per ruling ' + d.id], ['hold', 'warranty'], s.share, d.id);
      msg = L('Đã bác khiếu nại ' + d.id + ', tiền trả lại nhà cung cấp', d.id + ' rejected, funds released');
    } else if (m.v === 'redo') {
      var nid = 'VN-2409' + (40 + A.S.d.ORDERS.length);
      A.S.d.ORDERS.push({ id: nid, cust: o.cust, phone: o.phone || '', addr: o.addr || '', prov: o.prov, tech: o.tech, cat: o.cat, svc: o.svc, pkg: [L('Làm lại theo phán quyết ', 'Redo per ruling ') + d.id, 'Redo per ruling ' + d.id], amount: 0, status: 'unassigned', money: 'none', upd: 0, sched: ['25/09', '09:00-11:00'] });
      msg = L('Đã tạo đơn bảo hành ' + nid + ' (0 ₫). Tiền vẫn tạm giữ', 'Warranty order ' + nid + ' created (0 ₫). Funds stay on hold');
    } else {
      var amt = m.v === 'full' ? o.amount : VN.parseMoney(m.amount);
      var rec = { id: 'HT-09' + (25 + A.S.d.REFUNDS.length), order: o.id, kind: m.v === 'full' ? 'full' : 'partial', amount: amt, reason: [L('Phán quyết khiếu nại ', 'Dispute ruling ') + d.id, 'Dispute ruling ' + d.id], st: 'pending', by: A.me(), at: '24/09 ' + VN.nowTime(), fresh: true };
      A.S.d.REFUNDS.unshift(rec);
      if (amt >= D.REFUND_THRESHOLD) { d.st = 'open'; d.pendingRefund = rec.id; msg = L('Đã tạo ' + rec.id + ' (' + VN.money(amt) + '), chờ Kế toán hoặc Super admin duyệt bước hai', rec.id + ' created (' + VN.money(amt) + '), awaiting second approval'); d.st = 'resolved'; }
      else { A.doRefund(rec); msg = L('Đã hoàn ' + VN.money(amt) + ' cho khách theo phán quyết ' + d.id, 'Refunded ' + VN.money(amt) + ' per ruling ' + d.id); }
    }
    A.log(L('Ra phán quyết khiếu nại', 'Issued dispute ruling'), d.id);
    A.S.modal = null; A.render(); A.toast(msg);
  };
})(window);
