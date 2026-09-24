/* Trang quản trị · Danh mục, Giá & hoa hồng, Khu vực, Kiểm duyệt, Thông báo & banner, Quản trị viên, Tham số vận hành, Nhật ký. */
(function (W) {
  'use strict';
  var VN = W.VN, D = W.VNDATA, A = W.ADMIN, L = VN.L, ic = VN.ic, esc = VN.esc;
  var ACT = A.ACT, M = A.M;
  function cfg() {
    if (A.S.d.CFG) return A.S.d.CFG;
    A.S.d.CFG = {
      tree: [
        { id: 'ac', vi: 'Điện lạnh', en: 'Air conditioning', on: true, kids: [
          { id: 'ac1', vi: 'Máy lạnh', en: 'Air conditioners', on: true, kids: [
            { id: 'ac11', vi: 'Vệ sinh máy lạnh', en: 'AC cleaning', on: true, price: 'fixed', kids: [{ id: 'ac111', vi: 'Vệ sinh cơ bản', en: 'Basic cleaning', on: true }, { id: 'ac112', vi: 'Vệ sinh chuyên sâu, bơm hoá chất', en: 'Deep cleaning with chemicals', on: true }] },
            { id: 'ac12', vi: 'Sửa máy lạnh', en: 'AC repair', on: true, price: 'fixed', kids: [{ id: 'ac121', vi: 'Kiểm tra, chẩn đoán', en: 'Inspection', on: true }, { id: 'ac122', vi: 'Nạp gas', en: 'Regas', on: true }] },
            { id: 'ac13', vi: 'Lắp đặt máy lạnh', en: 'AC installation', on: false, price: 'fixed', kids: [{ id: 'ac131', vi: 'Lắp mới 1-1,5 HP', en: 'New install 1-1.5 HP', on: false }] }] },
          { id: 'ac2', vi: 'Tủ lạnh', en: 'Fridges', on: true, kids: [{ id: 'ac21', vi: 'Sửa tủ lạnh', en: 'Fridge repair', on: true, price: 'fixed', kids: [{ id: 'ac211', vi: 'Nạp gas tủ lạnh', en: 'Fridge regas', on: true }] }] }] },
        { id: 'clean', vi: 'Dọn dẹp', en: 'Cleaning', on: true, kids: [{ id: 'cl1', vi: 'Dọn nhà', en: 'Home cleaning', on: true, kids: [{ id: 'cl11', vi: 'Dọn nhà theo giờ', en: 'Hourly cleaning', on: true, price: 'hourly', kids: [{ id: 'cl111', vi: 'Gói 2 giờ', en: '2-hour package', on: true }, { id: 'cl112', vi: 'Gói 3 giờ', en: '3-hour package', on: true }] }] }] },
        { id: 'plumb', vi: 'Điện nước', en: 'Plumbing & electrical', on: true, kids: [] },
        { id: 'appl', vi: 'Đồ gia dụng', en: 'Appliances', on: true, kids: [] },
        { id: 'sofa', vi: 'Giặt sofa, nệm', en: 'Sofa & mattress', on: true, kids: [{ id: 'sf1', vi: 'Sofa', en: 'Sofas', on: true, kids: [{ id: 'sf11', vi: 'Vệ sinh sofa', en: 'Sofa cleaning', on: true, price: 'volume', kids: [{ id: 'sf111', vi: 'Sofa vải', en: 'Fabric sofa', on: true }, { id: 'sf112', vi: 'Sofa da', en: 'Leather sofa', on: true }] }] }] },
        { id: 'pest', vi: 'Diệt côn trùng', en: 'Pest control', on: true, kids: [] }
      ],
      attrs: { ac: [
        { vi: 'Loại máy', en: 'Unit type', type: 'one', req: true, opts: ['Treo tường', 'Âm trần', 'Tủ đứng'] },
        { vi: 'Công suất', en: 'Capacity', type: 'one', req: true, opts: ['1-1,5 HP', '2-2,5 HP', 'Trên 3 HP'] },
        { vi: 'Số máy', en: 'Number of units', type: 'num', req: true, unit: 'máy' },
        { vi: 'Tình trạng hiện tại', en: 'Current condition', type: 'text', req: false }], clean: [{ vi: 'Diện tích', en: 'Area', type: 'num', req: true, unit: 'm²' }, { vi: 'Có thú cưng', en: 'Has pets', type: 'bool', req: false }] },
      prices: [
        ['ac', ['Vệ sinh cơ bản (mỗi máy)', 'Basic cleaning (per unit)'], 150000, 300000, 'fixed'], ['ac', ['Vệ sinh chuyên sâu (mỗi máy)', 'Deep cleaning (per unit)'], 300000, 550000, 'fixed'], ['ac', ['Nạp gas', 'Regas'], 250000, 700000, 'fixed'],
        ['clean', ['Dọn nhà theo giờ (mỗi giờ)', 'Hourly cleaning (per hour)'], 80000, 180000, 'hourly'], ['sofa', ['Vệ sinh sofa (mỗi chỗ ngồi)', 'Sofa cleaning (per seat)'], 150000, 400000, 'volume'], ['pest', ['Diệt côn trùng căn hộ', 'Pest control, apartment'], 350000, 1200000, 'fixed']
      ],
      regions: [
        { id: 'hcm', vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City', on: true, cur: 'VND', tax: '2%', tz: 'GMT+7', lang: 'VI, EN', wards: 168, prov: 214, since: '01/03/2026' },
        { id: 'hn', vi: 'Hà Nội', en: 'Hanoi', on: false, cur: 'VND', tax: '2%', tz: 'GMT+7', lang: 'VI, EN', wards: 126, prov: 0 },
        { id: 'dn', vi: 'Đà Nẵng', en: 'Da Nang', on: false, cur: 'VND', tax: '2%', tz: 'GMT+7', lang: 'VI, EN', wards: 0, prov: 0 }
      ],
      mod: [
        { id: 'MD-311', kind: 'review', who: 'Trần Thu Hà', target: 'Điện lạnh Phúc An', text: ['Anh Tài làm kỹ, đúng giờ, vệ sinh sạch sẽ sau khi làm. Rất hài lòng.', 'Tài was careful, on time and cleaned up afterwards. Very satisfied.'], stars: 5, flag: null },
        { id: 'MD-309', kind: 'review', who: 'Hồ Minh Khang', target: 'An Tâm Pest', text: ['Làm ăn như l*a đảo, đừng ai gọi bọn này', 'Scammers, do not call these people'], stars: 1, flag: ['Chứa từ khoá cấm', 'Contains a banned keyword'] },
        { id: 'MD-307', kind: 'photo', who: 'Võ Thanh Trúc', target: 'VN-240921', text: ['Ảnh khiếu nại: vết ố trên sofa', 'Dispute photo: sofa stain'], flag: ['Có thể chứa khuôn mặt người', 'May contain a face'] },
        { id: 'MD-305', kind: 'profile', who: 'Dọn nhà Bảo Ngọc', target: L('Giới thiệu đơn vị', 'Unit bio'), text: ['Nhận dọn nhà giá rẻ nhất Sài Gòn, liên hệ zalo 09xx để được giảm 30%', 'Cheapest cleaning in Saigon, contact off-platform for 30% off'], flag: ['Mời giao dịch ngoài nền tảng', 'Off-platform solicitation'] }
      ],
      keywords: ['lừa đảo', 'l*a đảo', 'zalo riêng', 'chuyển khoản ngoài', 'giao dịch ngoài app'],
      campaigns: [
        { id: 'TB-0921', t: ['Ưu đãi vệ sinh máy lạnh mùa nóng', 'Hot-season AC cleaning'], seg: ['Khách hàng · TP.HCM', 'Customers · HCMC'], ch: 'Push', reach: 12480, st: 'sent', at: '21/09 09:00' },
        { id: 'TB-0923', t: ['Nhắc gia hạn chứng chỉ trước 30/09', 'Renew certificates before 30/09'], seg: ['Nhà cung cấp · có giấy tờ sắp hết hạn', 'Providers · expiring documents'], ch: 'SMS', reach: 18, st: 'sent', at: '23/09 08:30' },
        { id: 'TB-0925', t: ['Bảo trì hệ thống 02:00-03:00', 'Maintenance 02:00-03:00'], seg: ['Tất cả người dùng', 'All users'], ch: L('Trong app', 'In-app'), reach: 19120, st: 'scheduled', at: '26/09 20:00' }
      ],
      banners: [{ t: ['Vệ sinh máy lạnh từ 150.000 ₫', 'AC cleaning from 150,000 ₫'], on: true }, { t: ['Thợ được hàng xóm tin chọn', 'Providers your neighbours trust'], on: true }, { t: ['Diệt côn trùng mùa mưa', 'Rainy-season pest control'], on: false }],
      admins: [
        { id: 'u1', name: 'Nguyễn Hải', email: 'hai.nguyen@vngroup.info', phone: '0903 118 204', title: 'Trưởng nhóm vận hành hệ thống', role: 'sa', reg: 'all', last: '24/09 07:58', tfa: true, st: 'active' },
        { id: 'u2', name: 'Lê Minh Anh', email: 'minhanh.le@vngroup.info', phone: '0938 552 017', title: 'Kế toán trưởng', role: 'acc', reg: 'hcm', last: '24/09 08:02', tfa: true, st: 'active' },
        { id: 'u3', name: 'Phạm Thu Trang', email: 'thutrang.pham@vngroup.info', phone: '0912 406 381', title: 'Kế toán viên', role: 'acc', reg: 'hcm', last: '24/09 08:15', tfa: true, st: 'active' },
        { id: 'u4', name: 'Trần Ngọc Hân', email: 'ngochan.tran@vngroup.info', phone: '0977 230 945', title: 'Trưởng nhóm CSKH', role: 'cs', reg: 'hcm', last: '24/09 07:45', tfa: true, st: 'active' },
        { id: 'u5', name: 'Võ Quốc Bảo', email: 'quocbao.vo@vngroup.info', phone: '0908 771 560', title: 'Giám đốc điều hành', role: 'lead', reg: 'all', last: '23/09 18:30', tfa: true, st: 'active' },
        { id: 'u6', name: 'Đinh Công Minh', email: 'congminh.dinh@vngroup.info', phone: '0935 614 882', title: 'Điều phối viên', role: 'ops', reg: 'hcm', last: '24/09 06:59', tfa: false, st: 'active' },
        { id: 'u7', name: 'Hồ Thị Mai', email: 'thimai.ho@vngroup.info', phone: '0981 305 247', title: 'Chuyên viên danh mục', role: 'cat', reg: 'hcm', last: '12/08 16:20', tfa: true, st: 'disabled', since: '15/08/2026', why: 'Nghỉ việc' }
      ],
      use: { ac: [38, 21], ac1: [38, 21], ac11: [31, 14], ac111: [31, 11], ac112: [12, 3], ac12: [22, 7], ac121: [22, 4], ac122: [18, 3], ac2: [9, 2], ac21: [9, 2], ac211: [9, 2], clean: [26, 9], cl1: [26, 9], cl11: [26, 9], cl111: [26, 5], cl112: [19, 4], plumb: [17, 0], sofa: [11, 3], sf1: [11, 3], sf11: [11, 3], sf111: [11, 2], sf112: [6, 1], pest: [6, 2] },
      params: [
        [['Thời hạn', 'Deadlines'], [
          ['resp', ['Thời gian chờ nhà cung cấp phản hồi', 'Provider response window'], 15, ['phút', 'min'], 'g', ['Số phút mỗi nhà cung cấp có để xác nhận hoặc từ chối yêu cầu.', 'Minutes each provider has to confirm or decline.']],
          ['choose', ['Thời hạn khách chọn nhà cung cấp', 'Customer selection window'], 30, ['phút', 'min'], 'g', ['Sau thời hạn, yêu cầu hết hạn nếu khách chưa chọn.', 'After this, the request expires if the customer has not chosen.']],
          ['auto', ['Tự động nghiệm thu sau', 'Auto sign-off after'], 24, ['giờ', 'h'], 'r', ['Nếu khách không phản hồi bảng chốt, đơn tự nghiệm thu.', 'If the customer does not respond, the order is signed off automatically.']],
          ['warranty', ['Thời gian bảo hành', 'Warranty period'], 7, ['ngày', 'days'], 'here', ['Số ngày tiền được giữ sau nghiệm thu. Khách chỉ mở khiếu nại được trong thời gian này.', 'Days funds are held after sign-off. Customers can only open disputes during this period.'], { v: 10, at: '01/10/2026 00:00', by: 'Nguyễn Hải' }],
          ['payDue', ['Hạn thanh toán sau nghiệm thu', 'Payment due after sign-off'], 24, ['giờ', 'h'], 'g', ['Quá hạn thì đơn vào danh sách đôn đốc.', 'Overdue orders enter the follow-up list.']]]],
        [['Yêu cầu dịch vụ', 'Service requests'], [
          ['maxProv', ['Số nhà cung cấp tối đa mỗi yêu cầu', 'Max providers per request'], 5, ['', ''], 'g', ['Khách chọn tối đa bấy nhiêu đơn vị khi gửi yêu cầu.', 'The customer can pick up to this many providers.']],
          ['resend', ['Số lần gửi lại tối đa', 'Max resends'], 2, ['', ''], 'g', ['Khi không ai nhận, khách được gửi lại tối đa bấy nhiêu lần.', 'How many times a customer can resend if nobody accepts.']]]],
        [['Thực hiện công việc', 'Job execution'], [
          ['radius', ['Bán kính check-in', 'Check-in radius'], 200, ['m', 'm'], 'here', ['Kỹ thuật viên chỉ check-in được khi cách địa chỉ không quá bán kính này.', 'Technicians can only check in within this radius.']],
          ['overrun', ['Ngưỡng vượt ước tính cần khách duyệt', 'Overrun approval threshold'], 20, ['%', '%'], 'r', ['Chi phí vượt ước tính quá ngưỡng này phải được khách duyệt.', 'Costs above estimate beyond this need customer approval.']]]],
        [['Tài chính', 'Finance'], [
          ['refundT', ['Ngưỡng hoàn tiền cần duyệt hai bước', 'Two-step refund threshold'], 500000, ['₫', '₫'], 'g', ['Giả định, chờ xác nhận.', 'Assumption, pending confirmation.']],
          ['minPayout', ['Số tiền rút tối thiểu', 'Minimum payout'], 200000, ['₫', '₫'], 'g', ['Nhà cung cấp chỉ tạo yêu cầu rút từ mức này.', 'Providers can only request payouts from this amount.']]]]
      ],
      phist: { warranty: [['5 → 7', '15/08/2026', 'Nguyễn Hải', 'Đồng bộ với chính sách bảo hành của hãng'], ['Tạo ghi đè: 5', '02/07/2026', 'Trần Mai', 'Thiết bị điện lạnh cần thời gian kiểm tra lâu hơn']] }
    };
    return A.S.d.CFG;
  }
  var LV = { g: ['Toàn cục', 'Global'], r: ['Khu vực', 'Region'], here: ['Ngành', 'Category'], c: ['Ngành', 'Category'], p: ['Nhà cung cấp', 'Provider'] };
  function page(title, sub, acts) { return '<div class="page-h"><div><h1>' + title + '</h1>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div><div class="acts">' + (acts || '') + '</div></div>'; }
  function shell(title, sub, body, foot, wide) { return '<div class="scrim" data-act="closeModal"></div><aside class="drawer' + (wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="dw-h"><div class="modal-h"><div><h2 id="dw-h">' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><button type="button" class="xbtn" data-act="closeModal" aria-label="' + L('Đóng', 'Close') + '">' + ic('x') + '</button></div><div class="modal-b">' + body + '</div><div class="modal-f">' + foot + '</div></aside>'; }

  /* ---------- Danh mục dịch vụ ---------- */
  function findNode(id, list, depth, parent) { list = list || cfg().tree; depth = depth || 1; for (var i = 0; i < list.length; i++) { if (list[i].id === id) return { n: list[i], d: depth, parent: parent }; var r = list[i].kids && findNode(id, list[i].kids, depth + 1, list[i]); if (r) return r; } return null; }
  var LVL = [['Ngành', 'Category'], ['Danh mục', 'Group'], ['Dịch vụ', 'Service'], ['Gói', 'Package']];
  var PH = [['Ví dụ: Sửa khoá', 'e.g. Locksmith'], ['Ví dụ: Máy giặt', 'e.g. Washing machines'], ['Ví dụ: Vệ sinh máy giặt', 'e.g. Washer cleaning'], ['Ví dụ: Máy cửa trên', 'e.g. Top loader']];
  function lvl(d) { return L(LVL[d - 1][0], LVL[d - 1][1]); }
  function lvlLow(d) { return L(LVL[d - 1][0].toLowerCase(), LVL[d - 1][1].toLowerCase()); }
  function useOf(id) { return cfg().use[id] || [0, 0]; }
  function descendants(n) { var r = []; (n.kids || []).forEach(function (k) { r.push(k); r = r.concat(descendants(k)); }); return r; }
  function pathOf(id) { var f = findNode(id), out = []; while (f) { out.unshift(L(f.n.vi, f.n.en)); f = f.parent ? findNode(f.parent.id) : null; } return out.join(' › '); }
  var ulS = 'margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px;font-size:13.5px;color:var(--text-2)';
  A.P.catalog = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), sel = A.ui('catSel', 'ac'), f = sel ? findNode(sel) : null, open = A.ui('catOpen', { ac: 1, ac1: 1, ac11: 1 });
      if (!f && c.tree.length) { sel = A.S.ui.catSel = c.tree[0].id; f = findNode(sel); }
      function tree(list, d) { return list.map(function (n) { var has = n.kids && n.kids.length; return '<button type="button" class="l' + d + (n.id === sel ? ' on' : '') + (n.on ? '' : ' off') + '" data-act="catPick" data-id="' + n.id + '" aria-expanded="' + (has ? !!open[n.id] : 'false') + '">' + (has ? ic(open[n.id] ? 'caret-down' : 'caret-right') : '<span style="width:1em;display:inline-block"></span>') + '<span style="flex:1">' + esc(L(n.vi, n.en)) + '</span>' + (n.on ? '' : '<span class="badge t-neutral" style="height:20px;font-size:11px">' + L('Tắt', 'Off') + '</span>') + '</button>' + (has && open[n.id] ? tree(n.kids, d + 1) : ''); }).join(''); }
      var h = page(L('Danh mục dịch vụ', 'Service catalog'), L('Cây 4 cấp: Ngành → Danh mục → Dịch vụ → Gói. Tên song ngữ hiển thị theo ngôn ngữ người dùng.', '4 levels: Category → Group → Service → Package. Bilingual names follow the user language.'), A.btn(L('Lưu thay đổi', 'Save changes'), 'catSave', { cls: 'primary', dis: A.S.ui.catDirty ? '' : L('Chưa có thay đổi', 'No changes yet') }));
      var treeCard = '<section class="card"><div class="card-h" style="padding-bottom:6px"><h2>' + L('Cây danh mục', 'Catalog tree') + '</h2>' + A.btn(L('Thêm ngành', 'Add category'), 'catAddOpen', { cls: 'sm', icon: 'plus', x: 'root' }) + '</div><div class="tree">' + (c.tree.length ? tree(c.tree, 1) : '') + '</div></section>';
      if (!f) return h + '<div class="grid2" style="grid-template-columns:320px minmax(0,1fr)">' + treeCard + '<div class="stack"><section class="card">' + A.empty(L('Chưa có ngành nào', 'No categories yet'), L('Thêm ngành đầu tiên để bắt đầu dựng danh mục.', 'Add the first category to get started.'), A.btn(L('Thêm ngành', 'Add category'), 'catAddOpen', { icon: 'plus', x: 'root' }), 'tree-structure') + '</section></div></div>';
      var n = f.n, attrs = f.d === 1 ? (c.attrs[n.id] || []) : null, u = useOf(n.id), sib = f.parent ? f.parent.kids : c.tree, idx = sib.indexOf(n);
      var mv = function (dir, icn, lab, stop, tip) { return '<button type="button" class="iconbtn" data-act="catMove" data-x="' + dir + '" aria-label="' + lab + '"' + (stop ? ' aria-disabled="true" data-tip="' + tip + '"' : '') + '>' + ic(icn) + '</button>'; };
      var right = '<section class="card"><div class="card-h"><div style="min-width:0"><h2>' + lvl(f.d) + ': ' + esc(L(n.vi, n.en)) + '</h2><div class="muted" style="font-size:12.5px;margin-top:4px">' + (f.parent ? esc(pathOf(f.parent.id)) + ' · ' : '') + L(u[0] + ' nhà cung cấp · ' + u[1] + ' đơn chưa hoàn tất', u[0] + ' providers · ' + u[1] + ' open orders') + '</div></div><label class="chk" style="align-items:center;flex:none">' + L('Đang bật', 'Enabled') + ' <button type="button" class="switch" role="switch" aria-checked="' + n.on + '" data-act="catToggle" aria-label="' + L('Bật tắt', 'Toggle') + '"></button></label></div><div class="card-b" style="display:flex;flex-direction:column;gap:14px"><div class="grid2e" style="gap:12px"><div class="field"><label for="ct-vi">' + L('Tên tiếng Việt', 'Vietnamese name') + '</label><input id="ct-vi" class="inp" value="' + esc(n.vi) + '" data-in="catName" data-k="vi"></div><div class="field"><label for="ct-en">' + L('Tên tiếng Anh', 'English name') + '</label><input id="ct-en" class="inp" value="' + esc(n.en) + '" data-in="catName" data-k="en"></div></div>' +
        (n.price ? '<div class="field"><span class="flabel">' + L('Cách tính giá', 'Pricing model') + '</span><div class="seg">' + [['fixed', L('Gói cố định', 'Fixed package')], ['hourly', L('Theo giờ', 'Hourly')], ['volume', L('Theo khối lượng', 'By volume')]].map(function (x) { return '<button type="button" class="' + (n.price === x[0] ? 'on' : '') + '" data-act="catPrice" data-id="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div>' : '') +
        '<div class="field"><span class="flabel">' + L('Ảnh đại diện', 'Image') + '</span><div class="photo" style="height:110px;max-width:260px"><span>' + L('Ảnh: ' + n.vi + ', 1200×800', 'Image: ' + n.en + ', 1200×800') + '</span></div></div>' +
        '<div class="cat-acts"><span class="flabel" style="margin-right:4px">' + L('Thứ tự', 'Order') + '</span>' + mv('-1', 'arrow-up', L('Chuyển lên', 'Move up'), idx === 0, L('Đã ở đầu nhóm', 'Already first')) + mv('1', 'arrow-down', L('Chuyển xuống', 'Move down'), idx === sib.length - 1, L('Đã ở cuối nhóm', 'Already last')) +
        '<span style="flex:1"></span>' + A.btn(L('Xoá ', 'Delete ') + lvlLow(f.d), 'catDelOpen', { cls: 'danger', icon: 'trash' }) + (f.d < 4 ? A.btn(L('Thêm ', 'Add ') + lvlLow(f.d + 1), 'catAddOpen', { icon: 'plus', x: n.id }) : '') + '</div></div></section>';
      if (attrs) right += '<section class="card"><div class="card-h"><h2>' + L('Thuộc tính động của ngành', 'Dynamic attributes') + '</h2>' + A.btn(L('Thêm thuộc tính', 'Add attribute'), 'attrOpen', { cls: 'sm', icon: 'plus' }) + '</div><div class="card-b" style="padding-top:12px">' + (attrs.length ? '<table class="tbl"><thead><tr><th>' + L('Thuộc tính', 'Attribute') + '</th><th>' + L('Kiểu', 'Type') + '</th><th>' + L('Bắt buộc', 'Required') + '</th><th>' + L('Đơn vị / lựa chọn', 'Unit / options') + '</th><th><span class="sr">' + L('Thao tác', 'Actions') + '</span></th></tr></thead><tbody>' + attrs.map(function (a, i) { var nm = esc(L(a.vi, a.en)); return '<tr><td>' + nm + '</td><td>' + ({ one: L('Chọn một', 'Single choice'), many: L('Chọn nhiều', 'Multiple choice'), num: L('Số', 'Number'), text: L('Văn bản', 'Text'), bool: L('Đúng/sai', 'Yes/no') }[a.type]) + '</td><td>' + (a.req ? ic('check', '') : '<span class="subtle">' + L('Không', 'No') + '</span>') + '</td><td class="muted">' + (a.opts ? esc(a.opts.join(' · ')) : esc(a.unit || '') || L('Không có', 'None')) + '</td><td class="num nw"><button type="button" class="iconbtn" data-act="attrOpen" data-id="' + i + '" aria-label="' + L('Sửa ', 'Edit ') + nm + '" data-tip="' + L('Sửa', 'Edit') + '">' + ic('pencil-simple') + '</button> <button type="button" class="iconbtn" data-act="attrDelOpen" data-id="' + i + '" aria-label="' + L('Xoá ', 'Delete ') + nm + '" data-tip="' + L('Xoá', 'Delete') + '" data-tip-pos="left">' + ic('trash') + '</button></td></tr>'; }).join('') + '</tbody></table>' : A.empty(L('Chưa có thuộc tính', 'No attributes yet'), L('Thêm thuộc tính để form yêu cầu hỏi đúng thông tin.', 'Add attributes so the request form asks the right questions.'), '', 'list-checks')) + '</div></section>' +
        (attrs.length ? '<section class="card"><div class="card-h"><h2>' + L('Xem trước form khách thấy', 'Customer form preview') + '</h2><span class="muted" style="font-size:12px">' + L('Sinh tự động từ thuộc tính', 'Generated from attributes') + '</span></div><div class="card-b"><div style="max-width:360px;display:flex;flex-direction:column;gap:12px;padding:16px;border:1px dashed var(--control);border-radius:14px">' + attrs.map(function (a) {
          var lab = '<span style="font-size:13px;font-weight:500">' + esc(L(a.vi, a.en)) + (a.req ? ' <span style="color:var(--danger)">*</span>' : '') + '</span>';
          if (a.type === 'one' || a.type === 'many') return '<div style="display:flex;flex-direction:column;gap:6px">' + lab + '<div style="display:flex;gap:6px;flex-wrap:wrap">' + a.opts.map(function (o, i) { return '<span class="badge plain ' + (i ? 't-neutral' : 't-info') + '">' + esc(o) + '</span>'; }).join('') + '</div></div>';
          if (a.type === 'num') return '<div style="display:flex;flex-direction:column;gap:6px">' + lab + '<div style="display:flex;align-items:center;gap:8px"><span class="iconbtn" style="width:32px;height:32px">' + ic('minus') + '</span><b>2</b><span class="iconbtn" style="width:32px;height:32px">' + ic('plus') + '</span><span class="muted">' + esc(a.unit || '') + '</span></div></div>';
          if (a.type === 'bool') return '<div style="display:flex;justify-content:space-between;align-items:center">' + lab + '<span class="switch" aria-hidden="true"></span></div>';
          return '<div style="display:flex;flex-direction:column;gap:6px">' + lab + '<div class="inp" style="display:flex;align-items:center;color:var(--subtle)">' + L('Nhập mô tả', 'Describe') + '</div></div>';
        }).join('') + '</div></div></section>' : '');
      return h + '<div class="grid2" style="grid-template-columns:320px minmax(0,1fr)">' + treeCard + '<div class="stack">' + right + '</div></div>';
    }
  };
  ACT.catPick = function (el) { var id = el.dataset.id, o = A.ui('catOpen', {}); if (A.S.ui.catSel === id) o[id] = !o[id]; else o[id] = 1; A.S.ui.catSel = id; A.render(); };
  ACT.catToggle = function () { var n = findNode(A.ui('catSel', 'ac')).n; n.on = !n.on; A.S.ui.catDirty = true; A.render(); };
  ACT.catPrice = function (el) { findNode(A.ui('catSel')).n.price = el.dataset.id; A.S.ui.catDirty = true; A.render(); };
  ACT.catMove = function (el) { var f = findNode(A.ui('catSel')), sib = f.parent ? f.parent.kids : cfg().tree, i = sib.indexOf(f.n), j = i + (+el.dataset.x); if (j < 0 || j >= sib.length) return; sib.splice(i, 1); sib.splice(j, 0, f.n); A.S.ui.catDirty = true; A.render(); };
  A.IN.catName = function (el, v) { findNode(A.ui('catSel', 'ac')).n[el.dataset.k] = v; if (!A.S.ui.catDirty) { A.S.ui.catDirty = true; A.render(); } };
  ACT.catSave = function () { A.S.ui.catDirty = false; A.log(L('Cập nhật danh mục dịch vụ', 'Updated catalog'), L(findNode(A.ui('catSel', 'ac')).n.vi, findNode(A.ui('catSel', 'ac')).n.en)); A.render(); A.toast(L('Đã lưu danh mục. App cập nhật ở lần mở tiếp theo', 'Catalog saved. Apps update on next open')); };

  /* Thêm mục mới ở mọi cấp */
  ACT.catAddOpen = function (el) { var x = el.dataset.x; A.openModal('catAdd', { parent: x === 'root' ? null : x, vi: '', en: '', price: 'fixed', on: false }); };
  M.catAdd = function (m) {
    var par = m.parent ? findNode(m.parent) : null, d = par ? par.d + 1 : 1, sib = par ? (par.n.kids || []) : cfg().tree;
    var dup = !!m.vi.trim() && sib.some(function (x) { return x.vi.trim().toLowerCase() === m.vi.trim().toLowerCase(); });
    var ok = m.vi.trim() && m.en.trim() && !dup;
    var body = (par ? '<div class="note neutral">' + ic('tree-structure') + '<span>' + L('Thuộc: ', 'Under: ') + '<b>' + esc(pathOf(m.parent)) + '</b></span></div>' : '') +
      '<div class="field"><label for="ca-vi">' + L('Tên tiếng Việt', 'Vietnamese name') + ' <span class="req">*</span></label><input id="ca-vi" class="inp' + (dup ? ' bad' : '') + '" data-in="mset" data-k="vi" value="' + esc(m.vi) + '" placeholder="' + PH[d - 1][0] + '">' + (dup ? '<span class="err">' + L('Đã có mục cùng tên ở cấp này', 'An item with this name already exists here') + '</span>' : '') + '</div>' +
      '<div class="field"><label for="ca-en">' + L('Tên tiếng Anh', 'English name') + ' <span class="req">*</span></label><input id="ca-en" class="inp" data-in="mset" data-k="en" value="' + esc(m.en) + '" placeholder="' + PH[d - 1][1] + '"></div>' +
      (d === 3 ? '<div class="field"><span class="flabel">' + L('Cách tính giá', 'Pricing model') + '</span><div class="seg">' + [['fixed', L('Gói cố định', 'Fixed package')], ['hourly', L('Theo giờ', 'Hourly')], ['volume', L('Theo khối lượng', 'By volume')]].map(function (x) { return '<button type="button" class="' + (m.price === x[0] ? 'on' : '') + '" data-act="mpick" data-id="price" data-x="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div><span class="hint">' + L('Khung giá đặt ở trang Giá & hoa hồng.', 'Set price ranges on the Pricing page.') + '</span></div>' : '') +
      '<div class="field"><label class="chk"><input type="checkbox" data-in="mset" data-k="on"' + (m.on ? ' checked' : '') + '>' + L('Bật ngay sau khi lưu', 'Enable right after saving') + '</label><span class="hint">' + L('Để tắt nếu chưa có khung giá và nhà cung cấp đăng ký. Khách chỉ thấy mục đang bật.', 'Leave off until price ranges and providers are ready. Customers only see enabled items.') + '</span></div>';
    return shell(L('Thêm ', 'Add ') + lvlLow(d), d === 1 ? L('Ngành là cấp cao nhất, hiện trên trang chủ app khách hàng.', 'Categories are the top level, shown on the customer app home.') : '', body, '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Thêm ', 'Add ') + lvlLow(d), 'catAddGo', { cls: 'primary', dis: ok ? '' : dup ? L('Tên bị trùng', 'Duplicate name') : L('Nhập đủ tên tiếng Việt và tiếng Anh', 'Enter both names') }) + '</div>');
  };
  var catSeq = 0;
  ACT.catAddGo = function () {
    var m = A.S.modal, c = cfg(), par = m.parent ? findNode(m.parent) : null, d = par ? par.d + 1 : 1;
    var node = { id: 'n' + (++catSeq) + Date.now().toString(36), vi: m.vi.trim(), en: m.en.trim(), on: !!m.on };
    if (d < 4) node.kids = [];
    if (d === 3) node.price = m.price || 'fixed';
    if (par) { par.n.kids = par.n.kids || []; par.n.kids.push(node); A.ui('catOpen', {})[par.n.id] = 1; } else c.tree.push(node);
    A.S.ui.catSel = node.id; A.S.modal = null;
    A.log(L('Thêm ' + LVL[d - 1][0].toLowerCase() + ' vào danh mục', 'Added catalog ' + LVL[d - 1][1].toLowerCase()), node.vi);
    A.render();
    A.toast(L('Đã thêm ' + LVL[d - 1][0].toLowerCase() + ' "' + node.vi + '"' + (node.on ? '' : '. Đang tắt nên khách chưa thấy'), 'Added ' + LVL[d - 1][1].toLowerCase() + ' "' + node.en + '"' + (node.on ? '' : '. Off, so customers do not see it yet')));
  };

  /* Xoá: chỉ khi không còn nhà cung cấp hay đơn nào dùng; ngược lại đề nghị tắt */
  ACT.catDelOpen = function () { A.openModal('catDel', { id: A.ui('catSel'), note: '' }); };
  M.catDel = function (m) {
    var f = findNode(m.id); if (!f) return '';
    var n = f.n, u = useOf(n.id), ds = descendants(n), name = esc(L(n.vi, n.en)), body, foot, title;
    if (u[0] || u[1]) {
      title = L('Không xoá được ', 'Cannot delete ') + lvlLow(f.d) + ' "' + name + '"';
      body = '<div class="note warn">' + ic('warning') + '<span>' + L('Mục này đang được dùng. Xoá sẽ làm hỏng đơn đang chạy và hồ sơ nhà cung cấp.', 'This item is in use. Deleting it would break open orders and provider profiles.') + '</span></div><div class="lbl">' + L('Đang dùng', 'In use') + '</div><ul style="' + ulS + '"><li>' + L(u[0] + ' nhà cung cấp đăng ký', u[0] + ' registered providers') + '</li><li>' + L(u[1] + ' đơn chưa hoàn tất', u[1] + ' open orders') + '</li>' + (ds.length ? '<li>' + L(ds.length + ' mục con bên trong', ds.length + ' items inside') + '</li>' : '') + '</ul><div class="note info">' + ic('info') + '<span>' + L('Nên tắt thay vì xoá: khách không đặt mới được, đơn đang chạy vẫn tiếp tục, lịch sử giữ nguyên.', 'Disable it instead: customers cannot book it, open orders continue and history is kept.') + '</span></div>';
      foot = '<span></span><div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + A.btn(L('Tắt ', 'Disable ') + lvlLow(f.d), 'catOffGo', { cls: 'primary', dis: n.on ? '' : L('Mục này đã tắt', 'Already disabled') }) + '</div>';
    } else {
      title = L('Xoá ', 'Delete ') + lvlLow(f.d) + ' "' + name + '"?';
      body = '<div class="note danger">' + ic('warning-circle') + '<span>' + L('Xoá vĩnh viễn, không hoàn tác được. Không có nhà cung cấp hay đơn nào đang dùng mục này.', 'Permanent and cannot be undone. No providers or orders use this item.') + '</span></div>' +
        (ds.length ? '<div class="lbl">' + L('Xoá luôn ' + ds.length + ' mục bên trong', 'Also deletes ' + ds.length + ' items inside') + '</div><ul style="' + ulS + '">' + ds.slice(0, 6).map(function (k) { return '<li>' + esc(L(k.vi, k.en)) + '</li>'; }).join('') + (ds.length > 6 ? '<li>' + L('và ' + (ds.length - 6) + ' mục khác', 'and ' + (ds.length - 6) + ' more') + '</li>' : '') + '</ul>' : '') +
        '<div class="field"><label for="cd-n">' + L('Lý do xoá', 'Reason') + ' <span class="req">*</span></label><textarea id="cd-n" class="txa" maxlength="500" data-in="mset" data-k="note">' + esc(m.note) + '</textarea><span class="hint">' + L('Ghi vào Nhật ký.', 'Recorded in the audit log.') + '</span></div>';
      foot = '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Xoá ', 'Delete ') + lvlLow(f.d), 'catDelGo', { cls: 'danger-solid', dis: m.note.trim() ? '' : L('Nhập lý do xoá', 'Enter a reason') }) + '</div>';
    }
    return shell(title, esc(pathOf(m.id)), body, foot);
  };
  ACT.catDelGo = function () {
    var m = A.S.modal, f = findNode(m.id), c = cfg(), sib = f.parent ? f.parent.kids : c.tree, lv = f.d;
    sib.splice(sib.indexOf(f.n), 1);
    A.S.ui.catSel = f.parent ? f.parent.id : (c.tree[0] ? c.tree[0].id : '');
    A.log(L('Xoá ' + LVL[lv - 1][0].toLowerCase() + ' khỏi danh mục', 'Deleted catalog ' + LVL[lv - 1][1].toLowerCase()), f.n.vi + ' · ' + m.note.trim());
    A.S.modal = null; A.render();
    A.toast(L('Đã xoá ' + LVL[lv - 1][0].toLowerCase() + ' "' + f.n.vi + '"', 'Deleted ' + LVL[lv - 1][1].toLowerCase() + ' "' + f.n.en + '"'));
  };
  ACT.catOffGo = function () {
    var f = findNode(A.S.modal.id); f.n.on = false;
    A.log(L('Tắt mục trong danh mục', 'Disabled catalog item'), f.n.vi);
    A.S.modal = null; A.render();
    A.toast(L('Đã tắt "' + f.n.vi + '". Khách không đặt mới được, đơn đang chạy vẫn tiếp tục', '"' + f.n.en + '" disabled. No new bookings; open orders continue'));
  };

  /* Thuộc tính động: thêm, sửa, xoá */
  ACT.attrOpen = function (el) {
    var i = el.dataset.id != null && el.dataset.id !== '' ? +el.dataset.id : null, a = i != null ? (cfg().attrs[A.ui('catSel', 'ac')] || [])[i] : null;
    A.openModal('attr', a ? { i: i, vi: a.vi, en: a.en, type: a.type, req: a.req, unit: a.unit || '', opts: a.opts ? a.opts.join('\n') : '' } : { i: null, vi: '', en: '', type: 'one', req: true, unit: '', opts: '' });
  };
  M.attr = function (m) {
    var ok = m.vi.trim() && m.en.trim() && ((m.type !== 'one' && m.type !== 'many') || m.opts.trim()), edit = m.i != null;
    return shell(edit ? L('Sửa thuộc tính', 'Edit attribute') : L('Thêm thuộc tính', 'Add attribute'), L('Ngành ', 'Category ') + A.catName(A.ui('catSel', 'ac')), '<div class="grid2e" style="gap:12px"><div class="field"><label for="at-vi">' + L('Tên tiếng Việt', 'Vietnamese name') + ' <span class="req">*</span></label><input id="at-vi" class="inp" data-in="mset" data-k="vi" value="' + esc(m.vi) + '"></div><div class="field"><label for="at-en">' + L('Tên tiếng Anh', 'English name') + ' <span class="req">*</span></label><input id="at-en" class="inp" data-in="mset" data-k="en" value="' + esc(m.en) + '"></div></div>' +
      '<div class="field"><label for="at-t">' + L('Kiểu dữ liệu', 'Data type') + '</label><select id="at-t" class="sel" data-in="mset" data-k="type">' + [['one', L('Chọn một', 'Single choice')], ['many', L('Chọn nhiều', 'Multiple choice')], ['num', L('Số', 'Number')], ['text', L('Văn bản', 'Text')], ['bool', L('Đúng/sai', 'Yes/no')]].map(function (x) { return '<option value="' + x[0] + '"' + (m.type === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select>' + (edit ? '<span class="hint">' + L('Đổi kiểu chỉ áp dụng cho yêu cầu mới. Đơn cũ giữ giá trị đã nhập.', 'Type changes apply to new requests only. Past orders keep their values.') + '</span>' : '') + '</div>' +
      (m.type === 'one' || m.type === 'many' ? '<div class="field"><label for="at-o">' + L('Các lựa chọn', 'Options') + ' <span class="req">*</span></label><textarea id="at-o" class="txa" rows="4" maxlength="600" data-in="mset" data-k="opts" placeholder="' + L('Treo tường&#10;Âm trần&#10;Tủ đứng', 'Wall-mounted&#10;Ceiling&#10;Floor-standing') + '">' + esc(m.opts) + '</textarea><span class="hint">' + L('Mỗi dòng một lựa chọn. Dấu phẩy được giữ nguyên, ví dụ 1-1,5 HP.', 'One option per line. Commas are kept, e.g. 1-1,5 HP.') + '</span></div>' : m.type === 'num' ? '<div class="field"><label for="at-u">' + L('Đơn vị', 'Unit') + '</label><input id="at-u" class="inp" data-in="mset" data-k="unit" value="' + esc(m.unit) + '" placeholder="m², máy, giờ"></div>' : '') +
      '<label class="chk"><input type="checkbox" data-in="mset" data-k="req"' + (m.req ? ' checked' : '') + '>' + L('Bắt buộc nhập', 'Required') + '</label>',
      '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(edit ? L('Lưu thuộc tính', 'Save attribute') : L('Thêm thuộc tính', 'Add attribute'), 'attrGo', { cls: 'primary', dis: ok ? '' : L('Nhập đủ tên và lựa chọn', 'Enter names and options') }) + '</div>');
  };
  ACT.attrGo = function () {
    var m = A.S.modal, c = cfg(), k = A.ui('catSel', 'ac'), edit = m.i != null;
    var a = { vi: m.vi.trim(), en: m.en.trim(), type: m.type, req: !!m.req, unit: m.type === 'num' ? m.unit : '', opts: (m.type === 'one' || m.type === 'many') && m.opts ? m.opts.split(/\n|;/).map(function (x) { return x.trim(); }).filter(Boolean) : null };
    c.attrs[k] = c.attrs[k] || [];
    if (edit) c.attrs[k][m.i] = a; else c.attrs[k].push(a);
    A.log(edit ? L('Sửa thuộc tính ngành', 'Edited attribute') : L('Thêm thuộc tính ngành', 'Added attribute'), A.catName(k) + ' · ' + a.vi);
    A.S.modal = null; A.render();
    A.toast(edit ? L('Đã lưu thuộc tính "' + a.vi + '"', 'Attribute "' + a.en + '" saved') : L('Đã thêm thuộc tính "' + a.vi + '". Form yêu cầu cập nhật ngay', 'Attribute "' + a.en + '" added. Request form updated'));
  };
  ACT.attrDelOpen = function (el) { A.openModal('attrDel', { i: +el.dataset.id }); };
  M.attrDel = function (m) {
    var a = (cfg().attrs[A.ui('catSel', 'ac')] || [])[m.i]; if (!a) return '';
    return shell(L('Xoá thuộc tính "' + a.vi + '"?', 'Delete attribute "' + a.en + '"?'), L('Ngành ', 'Category ') + A.catName(A.ui('catSel', 'ac')), '<ul style="' + ulS + '"><li>' + L('Form yêu cầu mới sẽ không hỏi thông tin này nữa.', 'New request forms stop asking for this.') + '</li><li>' + L('Đơn cũ vẫn giữ giá trị khách đã nhập.', 'Past orders keep the values customers entered.') + '</li></ul>',
      '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Xoá thuộc tính', 'Delete attribute'), 'attrDelGo', { cls: 'danger-solid' }) + '</div>');
  };
  ACT.attrDelGo = function () {
    var k = A.ui('catSel', 'ac'), a = cfg().attrs[k].splice(A.S.modal.i, 1)[0];
    A.log(L('Xoá thuộc tính ngành', 'Deleted attribute'), A.catName(k) + ' · ' + a.vi);
    A.S.modal = null; A.render(); A.toast(L('Đã xoá thuộc tính "' + a.vi + '"', 'Attribute "' + a.en + '" deleted'));
  };

  /* ---------- Giá & hoa hồng ---------- */
  A.P.pricing = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), cat = A.ui('prCat', 'ac');
      var h = page(L('Giá & hoa hồng', 'Pricing & commission'), L('Giá trị có hiệu lực theo thời gian. Đơn đã tạo giữ nguyên tham số lúc tạo.', 'Values are time-bound. Existing orders keep their original parameters.'));
      h += '<div class="scope"><span class="lbl3">' + L('Phạm vi', 'Scope') + '</span><span class="lv">' + L('Khu vực:', 'Region:') + ' <b style="font-weight:500">' + L('TP. Hồ Chí Minh', 'Ho Chi Minh City') + '</b></span><span class="arr">›</span><span class="lv on">' + L('Ngành:', 'Category:') + '<label class="sr" for="pr-c">' + L('Ngành', 'Category') + '</label><select id="pr-c" class="sel" data-in="uiset" data-k="prCat">' + D.CATS.map(function (x) { return '<option value="' + x.id + '"' + (cat === x.id ? ' selected' : '') + '>' + L(x.vi, x.en) + '</option>'; }).join('') + '</select></span></div>';
      var rows = c.prices.filter(function (p) { return p[0] === cat; });
      h += '<div class="pgroup"><div class="pgroup-h">' + L('Giá sàn và giá trần', 'Price floor and ceiling') + '</div>' + (rows.length ? rows.map(function (p, i) { return '<button type="button" class="prow" data-act="priceOpen" data-id="' + c.prices.indexOf(p) + '"><span>' + L(p[1][0], p[1][1]) + '<span class="muted" style="display:block;font-size:12px">' + ({ fixed: L('Gói cố định', 'Fixed'), hourly: L('Theo giờ', 'Hourly'), volume: L('Theo khối lượng', 'By volume') }[p[4]]) + '</span></span><span class="v">' + VN.money(p[2]) + '</span><span class="v">' + VN.money(p[3]) + '</span>' + ic('caret-right', 'subtle') + '</button>'; }).join('') : '<div class="card-b">' + A.empty(L('Chưa có dịch vụ định giá', 'No priced services'), '') + '</div>') + '</div>';
      h += '<div class="pgroup"><div class="pgroup-h">' + L('Hoa hồng, phụ thu, thuế', 'Commission, surcharges, tax') + '</div>' +
        [[L('Hoa hồng nền tảng', 'Platform commission'), L('Cố định 15%', 'Flat 15%'), L('Kế thừa · Khu vực', 'Inherited · Region')], [L('Hoa hồng bậc thang (từ 01/11)', 'Tiered commission (from 01/11)'), L('Dưới 500.000 ₫: 15% · đến 2 triệu: 13% · trên: 10%', 'Under 500k: 15% · to 2M: 13% · above: 10%'), L('Đã lên lịch', 'Scheduled')], [L('Phụ thu ngoài giờ (tối đa)', 'After-hours surcharge (max)'), '20%', L('Kế thừa · Toàn cục', 'Inherited · Global')], [L('Phụ thu ngày lễ (tối đa)', 'Holiday surcharge (max)'), '30%', L('Kế thừa · Toàn cục', 'Inherited · Global')], [L('Thuế khấu trừ', 'Tax withheld'), '2% <span class="assume">' + L('Giả định', 'Assumed') + '</span>', L('Kế thừa · Toàn cục', 'Inherited · Global')]]
          .map(function (r) { return '<div class="prow" style="cursor:default"><span>' + r[0] + '</span><span class="v" style="font-weight:500">' + r[1] + '</span><span><span class="badge ' + (r[2].indexOf('lịch') >= 0 || r[2].indexOf('Scheduled') >= 0 ? 't-warn' : 'plain t-neutral') + '">' + r[2] + '</span></span><span></span></div>'; }).join('') + '</div>';
      return h;
    }
  };
  ACT.priceOpen = function (el) { var p = cfg().prices[+el.dataset.id]; A.openModal('price', { i: +el.dataset.id, lo: String(p[2]), hi: String(p[3]), when: 'now', date: '2026-10-01', reason: '', note: '' }); };
  M.price = function (m) {
    var p = cfg().prices[m.i], lo = VN.parseMoney(m.lo), hi = VN.parseMoney(m.hi), err = lo >= hi ? L('Giá sàn phải nhỏ hơn giá trần (' + VN.money(hi) + ').', 'Floor must be below ceiling (' + VN.money(hi) + ').') : '';
    return shell(L(p[1][0], p[1][1]), L('Ngành ', 'Category ') + A.catName(p[0]) + ' · TP. HCM',
      '<div class="grid2e" style="gap:12px"><div class="field"><label for="pr-lo">' + L('Giá sàn', 'Floor') + '</label><div class="inp-wrap"><input id="pr-lo" class="inp' + (err ? ' bad' : '') + '" inputmode="numeric" data-in="mset" data-k="lo" value="' + esc(m.lo) + '"><span class="suffix">₫</span></div>' + (err ? '<span class="err">' + err + '</span>' : '<span class="hint">' + L('Hiện tại: ', 'Current: ') + VN.money(p[2]) + '</span>') + '</div><div class="field"><label for="pr-hi">' + L('Giá trần', 'Ceiling') + '</label><div class="inp-wrap"><input id="pr-hi" class="inp" inputmode="numeric" data-in="mset" data-k="hi" value="' + esc(m.hi) + '"><span class="suffix">₫</span></div><span class="hint">' + L('Hiện tại: ', 'Current: ') + VN.money(p[3]) + '</span></div></div>' +
      '<div class="field"><span class="flabel">' + L('Hiệu lực', 'Effective') + '</span><div class="seg"><button type="button" class="' + (m.when === 'now' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="now">' + L('Ngay', 'Now') + '</button><button type="button" class="' + (m.when === 'later' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="later">' + L('Lên lịch', 'Schedule') + '</button></div>' + (m.when === 'later' ? '<label class="sr" for="pr-d">' + L('Ngày hiệu lực', 'Date') + '</label><input id="pr-d" type="date" class="inp" style="max-width:200px;margin-top:8px" min="2026-09-25" value="' + m.date + '" data-in="mset" data-k="date">' : '') + '</div>' +
      A.reasonField([['Điều chỉnh theo giá thị trường', 'Market adjustment'], ['Theo đề xuất của nhà cung cấp', 'Provider proposal'], ['Khác', 'Other']], m.reason === '2' ? 'noteReq' : '') +
      '<div class="note info">' + ic('info') + '<span>' + L('Bảng giá của nhà cung cấp nằm ngoài khoảng mới sẽ bị đánh dấu "cần cập nhật" và mất điều kiện "Bảng giá hợp lệ".', 'Provider prices outside the new range are flagged and lose the "Valid price list" condition.') + '</span></div>',
      '<div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Lưu giá trị', 'Save values'), 'priceGo', { cls: 'primary', dis: err || (m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '') }) + '</div>');
  };
  ACT.priceGo = function () { var m = A.S.modal, p = cfg().prices[m.i]; if (m.when === 'now') { p[2] = VN.parseMoney(m.lo); p[3] = VN.parseMoney(m.hi); } A.log(L('Sửa giá sàn, giá trần', 'Edited price range'), L(p[1][0], p[1][1])); A.S.modal = null; A.render(); A.toast(m.when === 'now' ? L('Đã lưu. Áp dụng cho đơn tạo từ bây giờ', 'Saved. Applies to new orders from now') : L('Đã lên lịch áp dụng từ ', 'Scheduled from ') + m.date.split('-').reverse().join('/')); };

  /* ---------- Khu vực ---------- */
  A.P.regions = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg();
      return page(L('Khu vực', 'Regions'), L('MVP vận hành tại một khu vực. Kiến trúc sẵn sàng thêm khu vực, tiền tệ, ngôn ngữ.', 'MVP runs in one region. The architecture is ready for more.')) +
        '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Khu vực', 'Region') + '</th><th>' + L('Trạng thái', 'Status') + '</th><th>' + L('Tiền tệ', 'Currency') + '</th><th>' + L('Thuế khấu trừ', 'Tax') + '</th><th>' + L('Múi giờ', 'Time zone') + '</th><th>' + L('Ngôn ngữ', 'Languages') + '</th><th class="num">' + L('Phường, xã', 'Wards') + '</th><th class="num">' + L('Nhà cung cấp', 'Providers') + '</th></tr></thead><tbody>' +
        c.regions.map(function (r, i) { return '<tr class="click" tabindex="0" data-act="regionOpen" data-id="' + i + '"><td><b style="font-weight:500">' + L(r.vi, r.en) + '</b></td><td>' + (r.on ? '<span class="badge t-ok">' + L('Đang vận hành', 'Live') + '</span>' : '<span class="badge t-neutral">' + L('Chưa mở', 'Not launched') + '</span>') + '</td><td>' + r.cur + '</td><td>' + r.tax + '</td><td>' + r.tz + '</td><td>' + r.lang + '</td><td class="num">' + (r.wards || L('Không có', 'None')) + '</td><td class="num">' + r.prov + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
  };
  ACT.regionOpen = function (el) { A.openModal('region', { i: +el.dataset.id, reason: '', note: '' }); };
  M.region = function (m) {
    var r = cfg().regions[m.i];
    return shell(L(r.vi, r.en), r.on ? L('Đang vận hành từ ', 'Live since ') + r.since : L('Chưa mở', 'Not launched'),
      '<div class="kv" style="grid-template-columns:1fr 1fr">' + [[L('Tiền tệ', 'Currency'), r.cur], [L('Thuế khấu trừ', 'Tax withheld'), r.tax], [L('Múi giờ', 'Time zone'), r.tz], [L('Ngôn ngữ', 'Languages'), r.lang], [L('Dữ liệu địa giới', 'Boundaries'), r.wards ? r.wards + L(' phường, xã', ' wards') : L('Chưa nhập', 'Not imported')], [L('Nhà cung cấp đủ điều kiện', 'Ready providers'), r.prov]].map(function (x) { return '<div><span>' + x[0] + '</span><b>' + x[1] + '</b></div>'; }).join('') + '</div>' +
      '<div class="card" style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b>' + L('Nhập địa giới', 'Import boundaries') + '</b><div class="muted" style="font-size:12.5px">' + L('File GeoJSON hoặc CSV, theo địa giới sau 01/07/2025', 'GeoJSON or CSV, post-07/2025 boundaries') + '</div></div>' + A.btn(L('Chọn file', 'Choose file'), 'geoImport', { icon: 'upload-simple', x: String(m.i) }) + '</div>' +
      (!r.on ? '<div class="note warn">' + ic('warning') + '<span>' + (r.prov ? '' : L('Chưa có nhà cung cấp nào đủ điều kiện. Nếu bật, khách sẽ thấy khu vực nhưng không gửi được yêu cầu.', 'No ready providers. If enabled, customers see the region but cannot place requests.')) + (r.wards ? '' : L(' Chưa có dữ liệu địa giới.', ' No boundary data yet.')) + '</span></div>' + A.reasonField([['Mở thử nghiệm nội bộ', 'Internal pilot'], ['Ra mắt chính thức', 'Official launch'], ['Khác', 'Other']], m.reason === '2' ? 'noteReq' : '') : ''),
      '<div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + (!r.on ? A.btn(L('Bật khu vực', 'Enable region'), 'regionGo', { cls: 'primary', dis: !r.wards ? L('Nhập địa giới trước', 'Import boundaries first') : m.reason === '' ? L('Chọn lý do trước', 'Select a reason first') : '' }) : '') + '</div>');
  };
  ACT.geoImport = function (el) { var r = cfg().regions[+el.dataset.x]; if (!r.wards) r.wards = r.id === 'dn' ? 94 : 126; A.render(); A.toast(L('Đã nhập ' + r.wards + ' phường, xã cho ' + r.vi, 'Imported ' + r.wards + ' wards for ' + r.en)); };
  ACT.regionGo = function () { var r = cfg().regions[A.S.modal.i]; r.on = true; r.since = '24/09/2026'; A.log(L('Bật khu vực', 'Enabled region'), r.vi); A.S.modal = null; A.render(); A.toast(L('Đã bật khu vực ', 'Enabled region ') + L(r.vi, r.en)); };

  /* ---------- Kiểm duyệt ---------- */
  A.P.moderation = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), tab = A.S.p.tab || 'queue';
      var h = page(L('Kiểm duyệt', 'Moderation'), L('Đánh giá, ảnh và hồ sơ được kiểm trước khi hiển thị công khai.', 'Reviews, photos and profiles are checked before going public.'));
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'queue') + '" class="' + (tab === 'queue' ? 'on' : '') + '" data-act="tab" data-id="queue">' + L('Hàng chờ', 'Queue') + '<span class="n">' + c.mod.length + '</span></button><button type="button" role="tab" aria-selected="' + (tab === 'kw') + '" class="' + (tab === 'kw' ? 'on' : '') + '" data-act="tab" data-id="kw">' + L('Từ khoá cấm', 'Banned keywords') + '<span class="n">' + c.keywords.length + '</span></button></div>';
      if (tab === 'kw') return h + '<section class="card"><div class="card-b" style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;gap:8px;flex-wrap:wrap">' + c.keywords.map(function (k, i) { return '<span class="badge plain t-neutral" style="height:30px;font-size:13px">' + esc(k) + ' <button type="button" class="link" style="color:var(--muted);display:inline-flex" data-act="kwDel" data-id="' + i + '" aria-label="' + L('Xoá ', 'Remove ') + esc(k) + '">' + ic('x') + '</button></span>'; }).join('') + '</div><div style="display:flex;gap:8px;max-width:420px"><label class="sr" for="kw-new">' + L('Từ khoá mới', 'New keyword') + '</label><input id="kw-new" class="inp" data-in="uiset" data-k="kwNew" value="' + esc(A.ui('kwNew', '')) + '" placeholder="' + L('Thêm từ khoá', 'Add a keyword') + '">' + A.btn(L('Thêm', 'Add'), 'kwAdd', { cls: 'primary', dis: (A.ui('kwNew', '') || '').trim() ? '' : L('Nhập từ khoá', 'Enter a keyword') }) + '</div></div></section>';
      if (!c.mod.length) return h + '<div class="card">' + A.empty(L('Hàng chờ đã trống', 'Queue is empty'), L('Nội dung mới cần kiểm duyệt sẽ hiện ở đây.', 'New content will appear here.')) + '</div>';
      var key = 'sel-mod', sel = A.ui(key, c.mod[0].id); if (!c.mod.some(function (x) { return x.id === sel; })) { sel = c.mod[0].id; A.S.ui[key] = sel; }
      var cur = c.mod.filter(function (x) { return x.id === sel; })[0], KN = { review: L('Đánh giá', 'Review'), photo: L('Ảnh', 'Photo'), profile: L('Hồ sơ', 'Profile') };
      var dis = A.denyTip('moderate');
      return h + '<div class="queue" style="min-height:420px"><div class="q-list">' + c.mod.map(function (x) { return '<button type="button" class="q-item' + (x.id === sel ? ' on' : '') + '" data-act="qsel" data-id="' + x.id + '" data-x="' + key + '"><span class="r1"><b>' + KN[x.kind] + ' · ' + esc(x.who) + '</b>' + (x.flag ? '<span class="badge t-danger" style="height:20px;font-size:11px">' + L('Gắn cờ', 'Flagged') + '</span>' : '') + '</span><small>' + esc(L(x.text[0], x.text[1])).slice(0, 60) + '…</small></button>'; }).join('') + '</div><div class="q-detail"><div class="q-body"><div style="display:flex;justify-content:space-between"><h2 style="margin:0;font-size:17px;font-weight:600">' + KN[cur.kind] + ' · ' + esc(cur.who) + '</h2><span class="muted">' + L('về ', 'about ') + esc(cur.target) + '</span></div>' +
        (cur.stars ? '<div style="display:flex;gap:2px;color:var(--star);font-size:18px">' + [1, 2, 3, 4, 5].map(function (i) { return ic(i <= cur.stars ? 'star-fill' : 'star'); }).join('') + '</div>' : '') + (cur.kind === 'photo' ? '<div class="photo" style="aspect-ratio:16/9;max-width:420px"><span>' + L('Ảnh khách gửi, 1200×675', 'Customer photo, 1200×675') + '</span></div>' : '') +
        '<blockquote style="margin:0;padding:14px 16px;border-left:3px solid var(--border);background:var(--fill);border-radius:0 10px 10px 0;font-size:14px;line-height:1.6">' + esc(L(cur.text[0], cur.text[1])) + '</blockquote>' + (cur.flag ? '<div class="note danger">' + ic('flag') + '<span>' + L('Hệ thống gắn cờ: ', 'Flagged: ') + L(cur.flag[0], cur.flag[1]) + '</span></div>' : '<div class="note ok">' + ic('check-circle') + '<span>' + L('Không phát hiện vi phạm tự động.', 'No automatic violations found.') + '</span></div>') +
        '</div><div class="q-bar">' + A.btn(L('Ẩn nội dung', 'Hide'), 'modDo', { cls: 'danger', id: cur.id, x: 'hide', dis: dis }) + '<div class="r">' + A.btn(L('Cho hiển thị', 'Approve'), 'modDo', { cls: 'primary', id: cur.id, x: 'show', dis: dis, tipPos: 'left' }) + '</div></div></div></div>';
    }
  };
  ACT.modDo = function (el) { var c = cfg(), i = c.mod.map(function (x) { return x.id; }).indexOf(el.dataset.id), x = c.mod[i]; c.mod.splice(i, 1); A.log(el.dataset.x === 'hide' ? L('Ẩn nội dung', 'Hid content') : L('Duyệt nội dung', 'Approved content'), x.id); A.render(); A.toast(el.dataset.x === 'hide' ? L('Đã ẩn ' + x.id + ' và báo người đăng', 'Hid ' + x.id + ', author notified') : L('Đã cho hiển thị ', 'Approved ') + x.id); };
  ACT.kwAdd = function () { var v = (A.ui('kwNew', '') || '').trim(); if (!v) return; cfg().keywords.push(v); A.S.ui.kwNew = ''; A.render(); A.toast(L('Đã thêm từ khoá "', 'Added keyword "') + esc(v) + '"'); };
  ACT.kwDel = function (el) { var k = cfg().keywords.splice(+el.dataset.id, 1)[0]; A.render(); A.toast(L('Đã xoá từ khoá "', 'Removed keyword "') + esc(k) + '"'); };

  /* ---------- Thông báo & banner ---------- */
  A.P.broadcast = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), tab = A.S.p.tab || 'msg';
      var h = page(L('Thông báo & banner', 'Messages & banners'), L('Gửi theo phân khúc, mẫu song ngữ theo ngôn ngữ người nhận.', 'Segmented sends with bilingual templates.'), tab === 'msg' ? A.btn(L('Soạn thông báo', 'New message'), 'bcOpen', { cls: 'primary', icon: 'plus', dis: A.denyTip('broadcast') }) : '');
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'msg') + '" class="' + (tab === 'msg' ? 'on' : '') + '" data-act="tab" data-id="msg">' + L('Thông báo', 'Messages') + '<span class="n">' + c.campaigns.length + '</span></button><button type="button" role="tab" aria-selected="' + (tab === 'banner') + '" class="' + (tab === 'banner' ? 'on' : '') + '" data-act="tab" data-id="banner">' + L('Banner trang chủ', 'Home banners') + '<span class="n">' + c.banners.length + '</span></button></div>';
      if (tab === 'banner') return h + '<div class="card" style="overflow:hidden">' + c.banners.map(function (b, i) { return '<div style="display:grid;grid-template-columns:200px minmax(0,1fr) auto;gap:16px;align-items:center;padding:14px 18px;border-top:' + (i ? '1px solid var(--line)' : '0') + '"><div class="photo" style="height:74px"><span>' + L('Banner 1080×540', 'Banner 1080×540') + '</span></div><div><b style="font-weight:500">' + L(b.t[0], b.t[1]) + '</b><div class="muted" style="font-size:12.5px">' + L('Vị trí ' + (i + 1) + ' · TP. HCM', 'Slot ' + (i + 1) + ' · HCMC') + '</div></div><label class="chk" style="align-items:center">' + L('Hiển thị', 'Visible') + '<button type="button" class="switch" role="switch" aria-checked="' + b.on + '" data-act="bnToggle" data-id="' + i + '" aria-label="' + L('Hiển thị banner', 'Show banner') + '"' + (A.can('broadcast') ? '' : ' aria-disabled="true" data-tip="' + esc(A.denyTip('broadcast')) + '"') + '></button></label></div>'; }).join('') + '</div>';
      return h + '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Mã', 'ID') + '</th><th>' + L('Tiêu đề', 'Title') + '</th><th>' + L('Phân khúc', 'Segment') + '</th><th>' + L('Kênh', 'Channel') + '</th><th class="num">' + L('Người nhận', 'Recipients') + '</th><th>' + L('Trạng thái', 'Status') + '</th><th>' + L('Thời điểm', 'Time') + '</th></tr></thead><tbody>' +
        c.campaigns.map(function (x) { return '<tr class="' + (x.fresh ? 'flash' : '') + '"><td class="id">' + x.id + '</td><td>' + L(x.t[0], x.t[1]) + '</td><td>' + L(x.seg[0], x.seg[1]) + '</td><td>' + x.ch + '</td><td class="num">' + VN.num(x.reach) + '</td><td>' + (x.st === 'sent' ? '<span class="badge t-ok">' + L('Đã gửi', 'Sent') + '</span>' : '<span class="badge t-slate">' + L('Đã lên lịch', 'Scheduled') + '</span>') + '</td><td class="muted nw">' + x.at + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
  };
  ACT.bnToggle = function (el) { var b = cfg().banners[+el.dataset.id]; b.on = !b.on; A.render(); A.toast((b.on ? L('Đã bật banner "', 'Banner on: "') : L('Đã tắt banner "', 'Banner off: "')) + L(b.t[0], b.t[1]) + '"'); };
  ACT.bcOpen = function () { A.openModal('bc', { seg: 'cust', ch: 'push', vi: '', en: '', when: 'now' }); };
  M.bc = function (m) {
    var reach = { cust: 12480, prov: 214, tech: 612, all: 19120 }[m.seg], ok = m.vi.trim() && m.en.trim();
    return shell(L('Soạn thông báo', 'New message'), L('Người nhận thấy bản theo ngôn ngữ của họ.', 'Recipients see their own language.'),
      '<div class="grid2e" style="gap:12px"><div class="field"><label for="bc-s">' + L('Phân khúc', 'Segment') + '</label><select id="bc-s" class="sel" data-in="mset" data-k="seg">' + [['cust', L('Khách hàng · TP. HCM', 'Customers · HCMC')], ['prov', L('Chủ đơn vị · TP. HCM', 'Provider owners · HCMC')], ['tech', L('Kỹ thuật viên · TP. HCM', 'Technicians · HCMC')], ['all', L('Tất cả người dùng', 'All users')]].map(function (x) { return '<option value="' + x[0] + '"' + (m.seg === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></div><div class="field"><label for="bc-c">' + L('Kênh', 'Channel') + '</label><select id="bc-c" class="sel" data-in="mset" data-k="ch">' + [['push', 'Push'], ['sms', 'SMS'], ['inapp', L('Trong app', 'In-app')]].map(function (x) { return '<option value="' + x[0] + '"' + (m.ch === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="bc-vi">' + L('Nội dung tiếng Việt', 'Vietnamese text') + ' <span class="req">*</span></label><textarea id="bc-vi" class="txa" data-in="mset" data-k="vi" maxlength="160">' + esc(m.vi) + '</textarea><span class="hint">' + m.vi.length + '/160</span></div>' +
      '<div class="field"><label for="bc-en">' + L('Nội dung tiếng Anh', 'English text') + ' <span class="req">*</span></label><textarea id="bc-en" class="txa" data-in="mset" data-k="en" maxlength="160">' + esc(m.en) + '</textarea></div>' +
      '<div class="field"><span class="flabel">' + L('Thời điểm gửi', 'Send time') + '</span><div class="seg"><button type="button" class="' + (m.when === 'now' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="now">' + L('Gửi ngay', 'Now') + '</button><button type="button" class="' + (m.when === 'later' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="later">' + L('Hẹn 20:00 hôm nay', 'Today 20:00') + '</button></div></div>' +
      '<div class="card" style="padding:12px 14px;background:var(--fill);display:flex;gap:10px;align-items:flex-start"><span class="av sq" style="width:32px;height:32px">VN</span><div><b style="font-size:13px">VN Group</b><div style="font-size:13px">' + esc(L(m.vi || 'Xem trước nội dung thông báo', m.en || 'Message preview')) + '</div></div></div><span class="muted" style="font-size:12.5px">' + L('Ước tính người nhận: ', 'Estimated recipients: ') + VN.num(reach) + '</span>',
      '<div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(m.when === 'now' ? L('Gửi thông báo', 'Send') : L('Lên lịch', 'Schedule'), 'bcGo', { cls: 'primary', dis: ok ? '' : L('Nhập đủ 2 bản ngôn ngữ', 'Fill both languages') }) + '</div>');
  };
  ACT.bcGo = function () { var m = A.S.modal, c = cfg(), reach = { cust: 12480, prov: 214, tech: 612, all: 19120 }[m.seg]; c.campaigns.forEach(function (x) { x.fresh = false; }); c.campaigns.unshift({ id: 'TB-0924', t: [m.vi.slice(0, 48), m.en.slice(0, 48)], seg: { cust: ['Khách hàng · TP.HCM', 'Customers · HCMC'], prov: ['Chủ đơn vị · TP.HCM', 'Owners · HCMC'], tech: ['Kỹ thuật viên · TP.HCM', 'Technicians · HCMC'], all: ['Tất cả người dùng', 'All users'] }[m.seg], ch: { push: 'Push', sms: 'SMS', inapp: L('Trong app', 'In-app') }[m.ch], reach: reach, st: m.when === 'now' ? 'sent' : 'scheduled', at: m.when === 'now' ? '24/09 ' + VN.nowTime() : '24/09 20:00', fresh: true }); A.log(L('Gửi thông báo', 'Sent message'), 'TB-0924'); A.S.modal = null; A.render(); A.toast(m.when === 'now' ? L('Đã gửi tới ' + VN.num(reach) + ' người nhận', 'Sent to ' + VN.num(reach) + ' recipients') : L('Đã lên lịch lúc 20:00', 'Scheduled for 20:00')); };

  /* ---------- Quản trị viên: tài khoản + vai trò & quyền ---------- */
  var REG = { all: ['Tất cả khu vực', 'All regions'], hcm: ['TP. Hồ Chí Minh', 'Ho Chi Minh City'] }, REGS = { all: ['Tất cả', 'All'], hcm: ['TP. HCM', 'HCMC'] };
  var DIS_REASONS = [['Nghỉ việc', 'Left the company'], ['Tạm nghỉ dài hạn', 'Extended leave'], ['Nghi ngờ lộ mật khẩu', 'Suspected compromised password'], ['Lý do khác', 'Other']];
  A.acctOf = function (email) { return cfg().admins.filter(function (a) { return a.email === email; })[0]; };
  A.myAcct = function () { return A.acctOf(A.ROLES[A.S.role].email); };
  function acct(id) { return cfg().admins.filter(function (a) { return a.id === id; })[0]; }
  function roleUse(id) { return cfg().admins.filter(function (a) { return a.role === id; }).length; }
  function activeSA() { return cfg().admins.filter(function (a) { return a.role === 'sa' && a.st === 'active'; }).length; }
  function fmtPhone(p) { var d = (p || '').replace(/\D/g, ''); return d.length === 10 ? d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7) : p.trim(); }
  function phoneOk(p) { return !p.trim() || /^0\d{9}$/.test(p.replace(/[\s.\-]/g, '')); }
  function stBadge(a) { return a.st === 'disabled' ? '<span class="badge t-neutral">' + L('Đã vô hiệu hoá', 'Disabled') + '</span>' : a.st === 'invited' ? '<span class="badge t-slate">' + L('Chờ chấp nhận lời mời', 'Invite pending') + '</span>' : '<span class="badge t-ok">' + L('Đang hoạt động', 'Active') + '</span>'; }
  function groups() { return A.NAV.map(function (g) { return { name: g[0] ? L(g[0][0], g[0][1]) : L('Tổng quan & Báo cáo', 'Overview & reports'), pages: g[1].map(function (it) { return it[0]; }) }; }); }
  function allPages() { var o = {}; groups().forEach(function (g) { g.pages.forEach(function (p) { o[p] = true; }); }); return o; }
  function allActs() { var o = {}; Object.keys(A.ACTS).forEach(function (k) { o[k] = true; }); return o; }
  function actsOf(p) { return Object.keys(A.ACTS).filter(function (k) { return A.ACTS[k][0] === p; }); }
  function pageLevel(r, p) { if (r.sys) return 'full'; if (!r.pages[p]) return 'off'; var a = actsOf(p); if (!a.length) return 'full'; var n = a.filter(function (k) { return r.acts[k]; }).length; return n === a.length ? 'full' : n ? 'custom' : 'view'; }
  function groupLevel(r, g) { var lv = g.pages.map(function (p) { return pageLevel(r, p); }); return lv.every(function (x) { return x === 'full'; }) ? 2 : lv.every(function (x) { return x === 'off'; }) ? 0 : 1; }
  function roleCounts(r) { var P = Object.keys(allPages()), K = Object.keys(A.ACTS); return { p: P.filter(function (p) { return r.sys || r.pages[p]; }).length, pt: P.length, a: K.filter(function (k) { return r.sys || (r.acts[k] && r.pages[A.ACTS[k][0]]); }).length, at: K.length }; }
  function dot(v) { var t = v === 2 ? L('Toàn quyền', 'Full access') : v === 1 ? L('Một phần', 'Partial') : L('Không có quyền', 'No access'); return '<span role="img" aria-label="' + t + '" title="' + t + '" style="display:inline-block;width:12px;height:12px;border-radius:6px;' + (v === 2 ? 'background:var(--ink)' : v === 1 ? 'border:1.5px solid var(--ink)' : 'background:var(--fill-2)') + '"></span>'; }
  A.roleCounts = roleCounts;

  A.P.admins = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), tab = A.S.p.tab || 'acc', me = A.myAcct();
      var h = page(L('Quản trị viên', 'Admins & roles'), L('Phân quyền theo chức năng và theo khu vực. Mục không có quyền bị ẩn khỏi menu.', 'Permissions by function and region. Items without access are hidden.'), tab === 'acc' ? A.btn(L('Mời quản trị viên', 'Invite admin'), 'invOpen', { cls: 'primary', icon: 'user-plus' }) : A.btn(L('Tạo vai trò', 'Create role'), 'roleOpen', { cls: 'primary', icon: 'plus' }));
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'acc') + '" class="' + (tab === 'acc' ? 'on' : '') + '" data-act="tab" data-id="acc">' + L('Tài khoản', 'Accounts') + '<span class="n">' + c.admins.length + '</span></button><button type="button" role="tab" aria-selected="' + (tab === 'roles') + '" class="' + (tab === 'roles' ? 'on' : '') + '" data-act="tab" data-id="roles">' + L('Vai trò & quyền', 'Roles & permissions') + '<span class="n">' + A.S.rb.length + '</span></button></div>';
      if (tab === 'roles') {
        var G = groups();
        return h + '<section class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Vai trò', 'Role') + '</th>' + G.map(function (g) { return '<th style="text-align:center;white-space:normal;line-height:1.3">' + g.name + '</th>'; }).join('') + '<th class="num">' + L('Tài khoản', 'Accounts') + '</th><th><span class="sr">' + L('Thao tác', 'Actions') + '</span></th></tr></thead><tbody>' +
          A.S.rb.map(function (r) { return '<tr class="' + (r.flash ? 'flash' : '') + '"><td style="min-width:230px;white-space:normal"><b style="font-weight:600">' + esc(L(r.vi, r.en)) + '</b>' + (r.sys ? ' <span class="badge plain t-neutral" style="height:20px;font-size:11px">' + L('Hệ thống', 'System') + '</span>' : '') + '<div class="muted" style="font-size:12px;margin-top:2px">' + esc(L(r.desc[0], r.desc[1]) || '') + '</div></td>' + G.map(function (g) { return '<td style="text-align:center">' + dot(groupLevel(r, g)) + '</td>'; }).join('') + '<td class="num">' + roleUse(r.id) + '</td><td class="num nw">' + A.btn(r.sys ? L('Xem', 'View') : L('Sửa', 'Edit'), 'roleOpen', { cls: 'sm', id: r.id }) + ' ' + A.btn(L('Nhân bản', 'Duplicate'), 'roleOpen', { cls: 'sm ghost', id: r.id, x: 'copy' }) + '</td></tr>'; }).join('') +
          '</tbody></table><div style="display:flex;gap:20px;font-size:12.5px;color:var(--muted);padding:12px 18px;border-top:1px solid var(--line)"><span style="display:flex;align-items:center;gap:6px">' + dot(2) + L('Toàn quyền', 'Full access') + '</span><span style="display:flex;align-items:center;gap:6px">' + dot(1) + L('Một phần hoặc chỉ xem', 'Partial or view only') + '</span><span style="display:flex;align-items:center;gap:6px">' + dot(0) + L('Không có quyền', 'No access') + '</span></div></section>';
      }
      var q = VN.fold(A.ui('admQ', '')), fr = A.ui('admR', ''), fs = A.ui('admS', '');
      var rows = c.admins.filter(function (a) { return (!q || VN.fold(a.name + ' ' + a.email + ' ' + (a.phone || '').replace(/\D/g, '')).indexOf(q) >= 0) && (!fr || a.role === fr) && (!fs || a.st === fs); });
      h += '<div class="filters"><div class="search-box">' + ic('magnifying-glass') + '<label class="sr" for="adm-q">' + L('Tìm theo tên hoặc email', 'Search name or email') + '</label><input id="adm-q" class="inp" data-in="uiset" data-k="admQ" value="' + esc(A.ui('admQ', '')) + '" placeholder="' + L('Tìm theo tên hoặc email', 'Search name or email') + '"></div>' +
        A.selUi('admR', [['', L('Tất cả vai trò', 'All roles')]].concat(A.S.rb.map(function (r) { return [r.id, L(r.vi, r.en)]; })), L('Vai trò', 'Role')) +
        A.selUi('admS', [['', L('Mọi trạng thái', 'All statuses')], ['active', L('Đang hoạt động', 'Active')], ['invited', L('Chờ chấp nhận lời mời', 'Invite pending')], ['disabled', L('Đã vô hiệu hoá', 'Disabled')]], L('Trạng thái', 'Status')) + '</div>';
      return h + '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Họ tên', 'Name') + '</th><th>Email</th><th>' + L('Vai trò', 'Role') + '</th><th>' + L('Khu vực', 'Region') + '</th><th>' + L('Đăng nhập gần nhất', 'Last sign-in') + '</th><th>' + L('Xác thực 2 lớp', '2FA') + '</th><th>' + L('Trạng thái', 'Status') + '</th><th><span class="sr">' + L('Thao tác', 'Actions') + '</span></th></tr></thead><tbody>' +
        (rows.length ? rows.map(function (a) { return '<tr class="' + (a.flash ? 'flash' : '') + (a.st === 'disabled' ? ' dim' : '') + '"><td><b style="font-weight:500">' + esc(a.name) + '</b>' + (me && me.id === a.id ? ' <span class="badge plain t-info" style="height:20px;font-size:11px">' + L('Bạn', 'You') + '</span>' : '') + (a.title ? '<div class="muted" style="font-size:12px">' + esc(a.title) + '</div>' : '') + '</td><td class="muted">' + esc(a.email) + '</td><td>' + A.roleLabel(a.role) + '</td><td class="nw">' + L(REGS[a.reg][0], REGS[a.reg][1]) + '</td><td class="muted">' + (a.last || L('Chưa đăng nhập', 'Never')) + '</td><td>' + (a.tfa ? '<span class="badge t-ok">' + L('Đã bật', 'On') + '</span>' : '<span class="badge t-warn">' + L('Chưa bật', 'Off') + '</span>') + '</td><td>' + stBadge(a) + '</td><td class="num">' + A.btn(L('Sửa', 'Edit'), 'admOpen', { cls: 'sm', id: a.id }) + '</td></tr>'; }).join('')
          : '<tr><td colspan="8">' + A.empty(L('Không có tài khoản khớp bộ lọc', 'No accounts match'), L('Thử bỏ bớt bộ lọc.', 'Try removing a filter.'), A.btn(L('Xoá bộ lọc', 'Clear filters'), 'admClear')) + '</td></tr>') + '</tbody></table></div>';
    }
  };
  ACT.admClear = function () { ['admQ', 'admR', 'admS'].forEach(function (k) { A.S.ui[k] = ''; }); A.render(); };

  /* Mời */
  ACT.invOpen = function () { A.openModal('inv', { email: '', role: 'cs', reg: 'hcm' }); };
  M.inv = function (m) {
    var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.email.trim()), dup = ok && !!A.acctOf(m.email.trim().toLowerCase());
    return shell(L('Mời quản trị viên', 'Invite admin'), L('Lời mời hết hạn sau 48 giờ.', 'Invites expire after 48 hours.'), '<div class="field"><label for="iv-e">Email <span class="req">*</span></label><input id="iv-e" class="inp" type="email" data-in="mset" data-k="email" value="' + esc(m.email) + '" placeholder="ten@vngroup.info">' + (m.email && !ok ? '<span class="err">' + L('Email chưa đúng định dạng', 'Invalid email') + '</span>' : dup ? '<span class="err">' + L('Email này đã có tài khoản', 'This email already has an account') + '</span>' : '') + '</div><div class="field"><label for="iv-r">' + L('Vai trò', 'Role') + '</label><select id="iv-r" class="sel" data-in="mset" data-k="role">' + A.S.rb.map(function (r) { return '<option value="' + r.id + '"' + (m.role === r.id ? ' selected' : '') + '>' + esc(L(r.vi, r.en)) + '</option>'; }).join('') + '</select></div><div class="field"><label for="iv-g">' + L('Khu vực', 'Region') + '</label><select id="iv-g" class="sel" data-in="mset" data-k="reg">' + Object.keys(REG).map(function (k) { return '<option value="' + k + '"' + (m.reg === k ? ' selected' : '') + '>' + L(REG[k][0], REG[k][1]) + '</option>'; }).join('') + '</select></div>',
      '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Gửi lời mời', 'Send invite'), 'invGo', { cls: 'primary', dis: ok && !dup ? '' : L('Nhập email hợp lệ, chưa có tài khoản', 'Enter a valid, unused email') }) + '</div>');
  };
  ACT.invGo = function () { var m = A.S.modal, e = m.email.trim().toLowerCase(); cfg().admins.forEach(function (a) { a.flash = false; }); cfg().admins.push({ id: 'u' + Date.now().toString(36), name: e.split('@')[0], email: e, phone: '', title: '', role: m.role, reg: m.reg, last: '', tfa: false, st: 'invited', flash: true }); A.log(L('Mời quản trị viên', 'Invited admin'), e); A.S.modal = null; A.render(); A.toast(L('Đã gửi lời mời tới ', 'Invite sent to ') + esc(e)); };

  /* Sửa tài khoản, bật tắt */
  ACT.admOpen = function (el) { var a = acct(el.dataset.id); A.openModal('adm', { id: a.id, name: a.name, phone: a.phone || '', title: a.title || '', role: a.role, reg: a.reg, step: '', reason: '', note: '' }); };
  M.adm = function (m) {
    var a = acct(m.id), me = A.myAcct(), self = !!me && me.id === a.id, lastSA = a.role === 'sa' && a.st === 'active' && activeSA() <= 1;
    if (m.step === 'disable') {
      var pend = a.role === 'acc' ? 2 : a.role === 'cs' ? 3 : 0, okD = m.reason !== '' && (m.reason !== '3' || m.note.trim());
      return shell(L('Vô hiệu hoá ', 'Disable ') + esc(a.name) + '?', esc(a.email), '<div class="note warn">' + ic('warning') + '<span>' + L('Người này bị đăng xuất khỏi mọi thiết bị ngay và không đăng nhập được cho tới khi kích hoạt lại.', 'They are signed out everywhere at once and cannot sign in until re-enabled.') + '</span></div><div class="lbl">' + L('Điều gì xảy ra', 'What happens') + '</div><ul style="' + ulS + '"><li>' + L('Kết thúc 2 phiên đăng nhập đang mở', 'Ends 2 open sessions') + '</li>' + (pend ? '<li>' + L(pend + ' việc đang chờ người này duyệt chuyển về hàng chờ chung', pend + ' items awaiting their approval go back to the shared queue') + '</li>' : '') + '<li>' + L('Tên vẫn hiện trong Nhật ký và các thao tác cũ', 'Their name stays on the audit log and past actions') + '</li><li>' + L('Kích hoạt lại được bất cứ lúc nào', 'Can be re-enabled at any time') + '</li></ul>' + A.reasonField(DIS_REASONS, m.reason === '3' ? 'noteReq' : ''),
        A.btn(L('Quay lại', 'Back'), 'admStep', { x: '' }) + '<div class="r">' + A.btn(L('Vô hiệu hoá', 'Disable'), 'admDisable', { cls: 'danger-solid', dis: okD ? '' : L('Chọn lý do', 'Choose a reason') }) + '</div>', true);
    }
    var pOk = phoneOk(m.phone), dirty = m.name.trim() !== a.name || fmtPhone(m.phone) !== (a.phone || '') || m.title.trim() !== (a.title || '') || m.role !== a.role || m.reg !== a.reg, ok = m.name.trim() && pOk && dirty;
    var cnt = roleCounts(A.role(m.role));
    var body = '<div class="lbl">' + L('Thông tin', 'Details') + '</div>' +
      '<div class="field"><label for="ad-n">' + L('Họ tên', 'Full name') + ' <span class="req">*</span></label><input id="ad-n" class="inp' + (m.name.trim() ? '' : ' bad') + '" data-in="mset" data-k="name" value="' + esc(m.name) + '">' + (m.name.trim() ? '' : '<span class="err">' + L('Không được để trống', 'Required') + '</span>') + '</div>' +
      '<div class="field"><label for="ad-e">Email</label><input id="ad-e" class="inp" value="' + esc(a.email) + '" disabled><span class="hint">' + L('Email là tên đăng nhập nên không đổi được. Cần email khác thì mời tài khoản mới.', 'Email is the sign-in name and cannot change. Invite a new account for a different email.') + '</span></div>' +
      '<div class="grid2e" style="gap:12px"><div class="field"><label for="ad-p">' + L('Số điện thoại', 'Phone') + '</label><input id="ad-p" class="inp' + (pOk ? '' : ' bad') + '" inputmode="tel" data-in="mset" data-k="phone" value="' + esc(m.phone) + '" placeholder="0903 118 204">' + (pOk ? '' : '<span class="err">' + L('Cần 10 số, bắt đầu bằng 0', 'Needs 10 digits starting with 0') + '</span>') + '</div><div class="field"><label for="ad-t">' + L('Chức danh', 'Job title') + '</label><input id="ad-t" class="inp" data-in="mset" data-k="title" value="' + esc(m.title) + '"></div></div>' +
      '<div class="lbl">' + L('Phân quyền', 'Access') + '</div>' +
      '<div class="field"><label for="ad-r">' + L('Vai trò', 'Role') + '</label><select id="ad-r" class="sel" data-in="mset" data-k="role"' + (self || lastSA ? ' disabled' : '') + '>' + A.S.rb.map(function (r) { return '<option value="' + r.id + '"' + (m.role === r.id ? ' selected' : '') + '>' + esc(L(r.vi, r.en)) + '</option>'; }).join('') + '</select><span class="hint">' + (self ? L('Bạn không tự đổi vai trò của mình được.', 'You cannot change your own role.') : lastSA ? L('Đây là Super admin cuối cùng đang hoạt động nên giữ nguyên vai trò.', 'This is the last active Super admin, so the role stays.') : L('Vai trò này thấy ' + cnt.p + '/' + cnt.pt + ' mục menu và làm được ' + cnt.a + '/' + cnt.at + ' thao tác.', 'This role sees ' + cnt.p + '/' + cnt.pt + ' menu items and can do ' + cnt.a + '/' + cnt.at + ' actions.')) + '</span></div>' +
      '<div class="field"><label for="ad-g">' + L('Khu vực', 'Region') + '</label><select id="ad-g" class="sel" data-in="mset" data-k="reg">' + Object.keys(REG).map(function (k) { return '<option value="' + k + '"' + (m.reg === k ? ' selected' : '') + '>' + L(REG[k][0], REG[k][1]) + '</option>'; }).join('') + '<option disabled>' + L('Hà Nội (chưa mở)', 'Hanoi (not launched)') + '</option></select></div>' +
      '<div class="lbl">' + L('Bảo mật', 'Security') + '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;font-size:13.5px"><span>' + L('Xác thực 2 lớp', 'Two-factor authentication') + '</span>' + (a.tfa ? '<span class="badge t-ok">' + L('Đã bật', 'On') + '</span>' : '<span class="badge t-warn">' + L('Chưa bật', 'Off') + '</span>') + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' + (a.st === 'invited' ? A.btn(L('Gửi lại lời mời', 'Resend invite'), 'admMail', { cls: 'sm', icon: 'paper-plane-tilt', x: 'invite' }) : A.btn(L('Đặt lại xác thực 2 lớp', 'Reset 2FA'), 'admMail', { cls: 'sm', icon: 'key', x: '2fa', dis: a.tfa ? '' : L('Người dùng chưa bật xác thực 2 lớp', 'Two-factor is not on yet') }) + A.btn(L('Gửi link đặt lại mật khẩu', 'Send password reset link'), 'admMail', { cls: 'sm', icon: 'envelope-simple', x: 'pw' })) + '</div>' +
      '<div class="lbl">' + L('Trạng thái tài khoản', 'Account status') + '</div>' +
      (a.st === 'disabled' ? '<div class="note neutral">' + ic('lock-simple') + '<span>' + L('Đã vô hiệu hoá', 'Disabled') + (a.since ? L(' từ ', ' since ') + a.since : '') + (a.why ? '. ' + L('Lý do: ', 'Reason: ') + esc(a.why) : '') + '</span></div><div>' + A.btn(L('Kích hoạt lại tài khoản', 'Re-enable account'), 'admEnable', { icon: 'lock-simple-open' }) + '</div>'
        : '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' + stBadge(a) + A.btn(L('Vô hiệu hoá tài khoản', 'Disable account'), 'admStep', { cls: 'danger-outline', x: 'disable', tipPos: 'left', dis: self ? L('Bạn không tự vô hiệu hoá tài khoản của mình được', 'You cannot disable your own account') : lastSA ? L('Cần ít nhất một Super admin đang hoạt động', 'At least one active Super admin is required') : '' }) + '</div>');
    return shell(esc(a.name), esc(a.email), body, A.btn(L('Huỷ', 'Cancel'), 'closeModal') + '<div class="r">' + A.btn(L('Lưu thay đổi', 'Save changes'), 'admSave', { cls: 'primary', dis: ok ? '' : !dirty ? L('Chưa có thay đổi', 'No changes yet') : L('Kiểm tra lại họ tên và số điện thoại', 'Check the name and phone') }) + '</div>', true);
  };
  ACT.admStep = function (el) { var m = A.S.modal; m.step = el.dataset.x || ''; m.reason = ''; m.note = ''; A.render(); };
  ACT.admSave = function () {
    var m = A.S.modal, a = acct(m.id), roleChanged = a.role !== m.role;
    a.name = m.name.trim(); a.phone = fmtPhone(m.phone); a.title = m.title.trim(); a.role = m.role; a.reg = m.reg;
    A.log(L('Sửa tài khoản quản trị', 'Edited admin account'), a.email);
    A.S.modal = null; A.render();
    A.toast(L('Đã lưu tài khoản ' + a.name + (roleChanged ? '. Quyền mới áp dụng ngay' : ''), 'Saved ' + a.name + (roleChanged ? '. New permissions apply now' : '')));
  };
  ACT.admDisable = function () {
    var m = A.S.modal, a = acct(m.id), why = L.apply(null, DIS_REASONS[+m.reason]);
    a.st = 'disabled'; a.since = '24/09/2026'; a.why = why + (m.note.trim() ? ': ' + m.note.trim() : '');
    A.log(L('Vô hiệu hoá tài khoản quản trị', 'Disabled admin account'), a.email);
    A.S.modal = null; A.render();
    A.toast(L('Đã vô hiệu hoá ' + a.name + '. Đã đăng xuất khỏi mọi thiết bị', a.name + ' disabled and signed out everywhere'));
  };
  ACT.admEnable = function () {
    var a = acct(A.S.modal.id); a.st = 'active'; a.since = null; a.why = null;
    A.log(L('Kích hoạt lại tài khoản quản trị', 'Re-enabled admin account'), a.email);
    A.render(); A.toast(L('Đã kích hoạt lại ' + a.name + '. Lần đăng nhập tới cần xác thực 2 lớp', a.name + ' re-enabled. Next sign-in needs two-factor'));
  };
  ACT.admMail = function (el) {
    var a = acct(A.S.modal.id), k = el.dataset.x;
    A.log(k === 'invite' ? L('Gửi lại lời mời', 'Resent invite') : k === '2fa' ? L('Đặt lại xác thực 2 lớp', 'Reset 2FA') : L('Gửi link đặt lại mật khẩu', 'Sent password reset'), a.email);
    if (k === '2fa') { a.tfa = false; A.render(); }
    A.toast(k === 'invite' ? L('Đã gửi lại lời mời tới ', 'Invite resent to ') + esc(a.email) : k === '2fa' ? L('Đã đặt lại. ' + a.name + ' phải cài lại ứng dụng xác thực ở lần đăng nhập tới', 'Reset. ' + a.name + ' must set up the authenticator at next sign-in') : L('Đã gửi link đặt lại mật khẩu tới ', 'Reset link sent to ') + esc(a.email));
  };

  /* Vai trò: tạo, xem, sửa, nhân bản, xoá */
  ACT.roleOpen = function (el) {
    var id = el && el.dataset ? el.dataset.id : '', copy = !!el && !!el.dataset && el.dataset.x === 'copy', r = id ? A.role(id) : null;
    if (r && !copy) A.openModal('role', { id: r.id, vi: r.vi, en: r.en, desc: L(r.desc[0], r.desc[1]) || '', pages: r.sys ? allPages() : VN.clone(r.pages), acts: r.sys ? allActs() : VN.clone(r.acts), del: false });
    else if (r) A.openModal('role', { id: null, from: r.id, vi: 'Bản sao của ' + r.vi, en: 'Copy of ' + r.en, desc: L(r.desc[0], r.desc[1]) || '', pages: r.sys ? allPages() : VN.clone(r.pages), acts: r.sys ? allActs() : VN.clone(r.acts) });
    else A.openModal('role', { id: null, from: '', vi: '', en: '', desc: '', pages: { dashboard: true }, acts: {} });
  };
  M.role = function (m) {
    var r = m.id ? A.role(m.id) : null, sys = !!(r && r.sys), used = m.id ? roleUse(m.id) : 0, G = groups();
    if (m.del) return shell(L('Xoá vai trò ', 'Delete role ') + esc(L(r.vi, r.en)) + '?', '', '<div class="note danger">' + ic('warning-circle') + '<span>' + L('Xoá vĩnh viễn, không hoàn tác được. Không tài khoản nào đang dùng vai trò này.', 'Permanent and cannot be undone. No account uses this role.') + '</span></div>', A.btn(L('Quay lại', 'Back'), 'roleDelStep', { x: '0' }) + '<div class="r">' + A.btn(L('Xoá vai trò', 'Delete role'), 'roleDel', { cls: 'danger-solid' }) + '</div>', true);
    var dup = !!m.vi.trim() && A.S.rb.some(function (x) { return x.id !== m.id && x.vi.trim().toLowerCase() === m.vi.trim().toLowerCase(); });
    var tmp = { sys: sys, pages: m.pages, acts: m.acts }, cnt = roleCounts(tmp), ok = m.vi.trim() && m.en.trim() && !dup && cnt.p > 0;
    var dis = sys ? ' disabled' : '';
    var body = (sys ? '<div class="note info">' + ic('shield-check') + '<span>' + L('Vai trò hệ thống luôn có toàn quyền, không sửa hay xoá được.', 'System roles always have full access and cannot be edited or deleted.') + '</span></div>' : '') +
      '<div class="grid2e" style="gap:12px"><div class="field"><label for="rl-vi">' + L('Tên vai trò (tiếng Việt)', 'Role name (Vietnamese)') + ' <span class="req">*</span></label><input id="rl-vi" class="inp' + (dup ? ' bad' : '') + '" data-in="mset" data-k="vi" value="' + esc(m.vi) + '"' + dis + '>' + (dup ? '<span class="err">' + L('Đã có vai trò cùng tên', 'A role with this name exists') + '</span>' : '') + '</div><div class="field"><label for="rl-en">' + L('Tên vai trò (tiếng Anh)', 'Role name (English)') + ' <span class="req">*</span></label><input id="rl-en" class="inp" data-in="mset" data-k="en" value="' + esc(m.en) + '"' + dis + '></div></div>' +
      '<div class="field"><label for="rl-d">' + L('Mô tả', 'Description') + '</label><input id="rl-d" class="inp" data-in="mset" data-k="desc" value="' + esc(m.desc) + '"' + dis + ' placeholder="' + L('Vai trò này làm gì, ví dụ: đối soát ngân hàng', 'What this role does, e.g. bank reconciliation') + '"></div>' +
      (!m.id ? '<div class="field"><label for="rl-f">' + L('Sao chép quyền từ', 'Copy permissions from') + '</label><select id="rl-f" class="sel" data-in="roleFrom"><option value="">' + L('Không, bắt đầu từ đầu', 'None, start blank') + '</option>' + A.S.rb.map(function (x) { return '<option value="' + x.id + '"' + (m.from === x.id ? ' selected' : '') + '>' + esc(L(x.vi, x.en)) + '</option>'; }).join('') + '</select></div>' : '') +
      '<div class="perm-sum"><span class="lbl">' + L('Quyền', 'Permissions') + '</span><span class="muted" style="font-size:12.5px">' + L('Thấy ' + cnt.p + '/' + cnt.pt + ' mục menu · ' + cnt.a + '/' + cnt.at + ' thao tác', 'Sees ' + cnt.p + '/' + cnt.pt + ' menu items · ' + cnt.a + '/' + cnt.at + ' actions') + '</span></div>' +
      G.map(function (g) {
        return '<div class="perm-g"><div class="perm-gh">' + g.name + '</div>' + g.pages.map(function (p) {
          var lv = pageLevel(tmp, p), acts = actsOf(p), lab = A.navLabel(p), on = acts.filter(function (k) { return sys || m.acts[k]; }).length;
          var opts = acts.length ? [['off', L('Ẩn', 'Hidden')], ['view', L('Chỉ xem', 'View only')], ['full', L('Toàn quyền', 'Full')]] : [['off', L('Ẩn', 'Hidden')], ['full', L('Truy cập', 'Access')]];
          return '<div class="perm-r"><div class="perm-p"><span>' + lab + '</span>' + (lv === 'custom' ? '<span class="badge t-info" style="height:20px;font-size:11px">' + L('Tuỳ chỉnh ', 'Custom ') + on + '/' + acts.length + '</span>' : '') + '<div class="seg sm" role="group" aria-label="' + L('Quyền với ', 'Access to ') + lab + '">' + opts.map(function (o) { var sel = lv === o[0]; return '<button type="button" class="' + (sel ? 'on' : '') + '" data-act="permLv" data-id="' + p + '" data-x="' + o[0] + '" aria-pressed="' + sel + '"' + (sys ? ' aria-disabled="true"' : '') + '>' + o[1] + '</button>'; }).join('') + '</div></div>' +
            (acts.length && lv !== 'off' ? '<div class="perm-a">' + acts.map(function (k) { return '<label class="chk"><input type="checkbox" data-in="permAct" data-k="' + k + '"' + (sys || m.acts[k] ? ' checked' : '') + dis + '>' + L(A.ACTS[k][1], A.ACTS[k][2]) + '</label>'; }).join('') + '</div>' : '') + '</div>';
        }).join('') + '</div>';
      }).join('');
    var foot = sys ? '<span></span><div class="r">' + A.btn(L('Đóng', 'Close'), 'closeModal') + '</div>'
      : (m.id ? A.btn(L('Xoá vai trò', 'Delete role'), 'roleDelStep', { cls: 'danger', icon: 'trash', x: '1', tipPos: 'right', dis: used ? L('Còn ' + used + ' tài khoản dùng vai trò này. Chuyển họ sang vai trò khác trước.', used + ' accounts use this role. Move them to another role first.') : '' }) : '<span></span>') +
        '<div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(m.id ? L('Lưu vai trò', 'Save role') : L('Tạo vai trò', 'Create role'), 'roleSave', { cls: 'primary', dis: ok ? '' : !cnt.p ? L('Cho phép ít nhất một mục menu', 'Allow at least one menu item') : L('Nhập đủ tên tiếng Việt và tiếng Anh, không trùng', 'Enter unique Vietnamese and English names') }) + '</div>';
    return shell(m.id ? (sys ? L('Vai trò ', 'Role ') : L('Sửa vai trò ', 'Edit role ')) + esc(L(r.vi, r.en)) : L('Tạo vai trò', 'Create role'), m.id ? L(used + ' tài khoản đang dùng. Thay đổi áp dụng ngay khi lưu.', used + ' accounts use this role. Changes apply as soon as you save.') : L('Vai trò mới chưa gán cho ai. Gán ở tab Tài khoản.', 'New roles are not assigned yet. Assign them under Accounts.'), body, foot, true);
  };
  ACT.permLv = function (el) {
    var m = A.S.modal, p = el.dataset.id, v = el.dataset.x, acts = actsOf(p);
    if (v === 'off') { delete m.pages[p]; acts.forEach(function (k) { delete m.acts[k]; }); }
    else { m.pages[p] = true; acts.forEach(function (k) { if (v === 'full') m.acts[k] = true; else delete m.acts[k]; }); }
    A.render();
  };
  A.IN.permAct = function (el, v) { var m = A.S.modal; if (v) m.acts[el.dataset.k] = true; else delete m.acts[el.dataset.k]; A.render(); };
  A.IN.roleFrom = function (el, v) { var m = A.S.modal, r = v ? A.role(v) : null; m.from = v; m.pages = r ? (r.sys ? allPages() : VN.clone(r.pages)) : { dashboard: true }; m.acts = r ? (r.sys ? allActs() : VN.clone(r.acts)) : {}; A.render(); };
  ACT.roleSave = function () {
    var m = A.S.modal, r = m.id ? A.role(m.id) : null, isNew = !r;
    A.S.rb.forEach(function (x) { x.flash = false; });
    if (isNew) { r = { id: 'r' + Date.now().toString(36), sys: false, desc: [m.desc.trim(), m.desc.trim()] }; A.S.rb.push(r); }
    else r.desc[VN.lang ? 1 : 0] = m.desc.trim();
    r.vi = m.vi.trim(); r.en = m.en.trim(); r.pages = VN.clone(m.pages); r.acts = VN.clone(m.acts); r.flash = true;
    A.log(isNew ? L('Tạo vai trò', 'Created role') : L('Sửa quyền vai trò', 'Edited role permissions'), r.vi);
    var users = roleUse(r.id), persona = Object.keys(A.ROLES).filter(function (k) { return k !== A.S.role && A.personaRole(k) === r.id; })[0];
    A.S.modal = null; A.render();
    A.toast(isNew ? L('Đã tạo vai trò "' + r.vi + '". Gán cho tài khoản ở tab Tài khoản', 'Role "' + r.en + '" created. Assign it under Accounts') : L('Đã lưu vai trò "' + r.vi + '", áp dụng ngay cho ' + users + ' tài khoản' + (persona ? '. Đổi sang vai này ở bảng Demo để xem menu mới' : ''), 'Role "' + r.en + '" saved for ' + users + ' accounts' + (persona ? '. Switch to it in the Demo panel to see the new menu' : '')));
  };
  ACT.roleDelStep = function (el) { A.S.modal.del = el.dataset.x !== '0'; A.render(); };
  ACT.roleDel = function () {
    var id = A.S.modal.id, r = A.role(id);
    A.S.rb = A.S.rb.filter(function (x) { return x.id !== id; });
    A.log(L('Xoá vai trò', 'Deleted role'), r.vi);
    A.S.modal = null; A.render(); A.toast(L('Đã xoá vai trò "' + r.vi + '"', 'Role "' + r.en + '" deleted'));
  };

  /* ---------- Hồ sơ của tôi ---------- */
  var NOTI = [['payNew', 'Yêu cầu rút tiền mới', 'New payout requests', 'payouts'], ['refundWait', 'Hoàn tiền chờ bạn duyệt', 'Refunds awaiting your approval', 'refunds'], ['recon', 'Lệch đối soát ngân hàng', 'Bank reconciliation mismatches', 'transactions'], ['dispute', 'Khiếu nại mới', 'New disputes', 'disputes'], ['provApp', 'Hồ sơ nhà cung cấp chờ duyệt', 'Provider applications to review', 'providers'], ['orderAlert', 'Đơn cần chú ý', 'Orders needing attention', 'orders'], ['mod', 'Nội dung bị báo cáo', 'Reported content', 'moderation'], ['report', 'Báo cáo tuần', 'Weekly report', 'reports']];
  function pfAcct() {
    var a = A.myAcct();
    if (!a.noti) { a.noti = {}; NOTI.forEach(function (n) { a.noti[n[0]] = { app: true, mail: n[0] === 'report' || n[0] === 'recon' }; }); }
    if (!a.sessions) a.sessions = [{ dev: 'Edge · Windows 11', ip: '113.161.24.8', loc: 'TP. Hồ Chí Minh', at: '', cur: true }, { dev: 'Safari · iPhone', ip: '171.244.8.21', loc: 'TP. Hồ Chí Minh', at: '23/09 21:14' }, { dev: 'Chrome · macOS', ip: '14.241.120.5', loc: 'Hà Nội', at: '19/09 09:02' }];
    if (!a.pwAt) a.pwAt = '12/07/2026';
    return a;
  }
  function pfDraft(a) { var d = A.S.ui.pf; if (!d || d.id !== a.id) d = A.S.ui.pf = { id: a.id, name: a.name, phone: a.phone || '', title: a.title || '', lang: VN.lang ? 'en' : 'vi' }; return d; }
  A.P.profile = {
    crumb: function () { return null; },
    render: function () {
      var a = pfAcct(), tab = A.S.p.tab || 'info', d = pfDraft(a), r = A.role(a.role), cnt = roleCounts(r);
      var pOk = phoneOk(d.phone), dirty = d.name.trim() !== a.name || fmtPhone(d.phone) !== (a.phone || '') || d.title.trim() !== (a.title || '') || (d.lang === 'en') !== !!VN.lang;
      var h = page(L('Hồ sơ của tôi', 'My profile'), L('Tài khoản quản trị của bạn. Email và vai trò do Super admin quản lý.', 'Your admin account. Email and role are managed by a Super admin.'), tab === 'info' ? A.btn(L('Lưu thay đổi', 'Save changes'), 'pfSave', { cls: 'primary', dis: !dirty ? L('Chưa có thay đổi', 'No changes yet') : d.name.trim() && pOk ? '' : L('Kiểm tra lại họ tên và số điện thoại', 'Check the name and phone') }) : '');
      h += '<div class="tabs" role="tablist">' + [['info', L('Thông tin', 'Details')], ['security', L('Bảo mật', 'Security')], ['noti', L('Thông báo', 'Notifications')], ['activity', L('Hoạt động', 'Activity')]].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (tab === t[0]) + '" class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-id="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
      if (tab === 'security') {
        var others = a.sessions.filter(function (s) { return !s.cur; }).length, sa = !!r.sys;
        return h + '<div class="grid2e"><section class="card"><div class="card-h"><h2>' + L('Mật khẩu', 'Password') + '</h2>' + A.btn(L('Đổi mật khẩu', 'Change password'), 'pwOpen', { cls: 'sm', icon: 'key' }) + '</div><div class="card-b"><p class="muted" style="margin:0;font-size:13.5px">' + L('Đổi lần cuối ngày ', 'Last changed ') + a.pwAt + '. ' + L('Nên đổi mỗi 90 ngày.', 'We suggest changing it every 90 days.') + '</p></div></section>' +
          '<section class="card"><div class="card-h"><h2>' + L('Xác thực 2 lớp', 'Two-factor authentication') + '</h2><label class="chk" style="align-items:center">' + (a.tfa ? L('Đang bật', 'On') : L('Đang tắt', 'Off')) + ' <button type="button" class="switch" role="switch" aria-checked="' + !!a.tfa + '" data-act="pf2fa" aria-label="' + L('Xác thực 2 lớp', 'Two-factor authentication') + '"' + (sa && a.tfa ? ' aria-disabled="true" data-tip="' + L('Bắt buộc với vai trò Super admin', 'Required for Super admins') + '" data-tip-pos="left"' : '') + '></button></label></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px"><p class="muted" style="margin:0;font-size:13.5px">' + L('Mã 6 số từ ứng dụng xác thực trên điện thoại, hỏi mỗi lần đăng nhập ở thiết bị mới.', 'A 6-digit code from your authenticator app, asked on every new device.') + '</p>' + (a.tfa ? '' : '<div class="note warn">' + ic('warning') + '<span>' + L('Tài khoản của bạn đang kém an toàn. Nên bật lại xác thực 2 lớp.', 'Your account is less secure. Turn two-factor back on.') + '</span></div>') + '</div></section></div>' +
          '<section class="card" style="overflow:hidden"><div class="card-h"><h2>' + L('Phiên đăng nhập', 'Sessions') + '</h2>' + A.btn(L('Đăng xuất mọi phiên khác', 'Sign out all other sessions'), 'pfOut', { cls: 'sm', x: 'all', dis: others ? '' : L('Không còn phiên nào khác', 'No other sessions') }) + '</div><table class="tbl"><thead><tr><th>' + L('Thiết bị', 'Device') + '</th><th>IP</th><th>' + L('Vị trí', 'Location') + '</th><th>' + L('Hoạt động gần nhất', 'Last active') + '</th><th><span class="sr">' + L('Thao tác', 'Actions') + '</span></th></tr></thead><tbody>' +
          a.sessions.map(function (s, i) { return '<tr><td>' + ic(/iPhone/.test(s.dev) ? 'device-mobile' : 'globe') + ' ' + esc(s.dev) + (s.cur ? ' <span class="badge plain t-info" style="height:20px;font-size:11px">' + L('Phiên này', 'This session') + '</span>' : '') + '</td><td class="mono" style="font-size:12px">' + s.ip + '</td><td>' + esc(s.loc) + '</td><td class="muted">' + (s.cur ? L('Đang hoạt động', 'Active now') : s.at) + '</td><td class="num">' + (s.cur ? '' : A.btn(L('Đăng xuất', 'Sign out'), 'pfOut', { cls: 'sm danger', x: String(i) })) + '</td></tr>'; }).join('') + '</tbody></table></section>';
      }
      if (tab === 'noti') {
        var list = NOTI.filter(function (n) { return A.sees(n[3]); });
        return h + '<section class="card" style="overflow:hidden"><div class="card-h"><h2>' + L('Nhận thông báo khi', 'Notify me when') + '</h2><span class="muted" style="font-size:12.5px">' + L('Chỉ hiện sự kiện của các mục bạn có quyền xem', 'Only events from areas you can access') + '</span></div><table class="tbl"><thead><tr><th>' + L('Sự kiện', 'Event') + '</th><th style="text-align:center">' + L('Trong Trang quản trị', 'In the portal') + '</th><th style="text-align:center">Email</th></tr></thead><tbody>' +
          (list.length ? list.map(function (n) { var v = a.noti[n[0]]; return '<tr><td>' + L(n[1], n[2]) + '</td>' + ['app', 'mail'].map(function (ch) { return '<td style="text-align:center"><button type="button" class="switch" role="switch" aria-checked="' + !!v[ch] + '" data-act="pfNoti" data-id="' + n[0] + '" data-x="' + ch + '" aria-label="' + L(n[1], n[2]) + ' · ' + (ch === 'app' ? L('trong Trang quản trị', 'in the portal') : 'email') + '"></button></td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="3">' + A.empty(L('Chưa có sự kiện nào cho vai trò của bạn', 'No events for your role'), '') + '</td></tr>') + '</tbody></table></section>';
      }
      if (tab === 'activity') {
        var mine = A.S.audit.filter(function (x) { return x[1] === a.name; }).map(function (x) { return [x[0], x[3], x[4]]; }).concat(SEED_AUDIT.filter(function (x) { return x[1] === a.name; }).map(function (x) { return [x[0], L(x[3][0], x[3][1]), x[4]]; }));
        return h + '<section class="card" style="overflow:hidden"><div class="card-h"><h2>' + L('Thao tác gần đây của bạn', 'Your recent actions') + '</h2>' + (A.sees('audit') ? A.btn(L('Mở Nhật ký', 'Open audit log'), 'nav', { cls: 'sm', id: 'audit' }) : '') + '</div><table class="tbl"><thead><tr><th>' + L('Thời gian', 'Time') + '</th><th>' + L('Thao tác', 'Action') + '</th><th>' + L('Đối tượng', 'Target') + '</th></tr></thead><tbody>' +
          (mine.length ? mine.map(function (x) { return '<tr><td class="muted nw">' + x[0] + '</td><td>' + x[1] + '</td><td class="mono" style="font-size:12px">' + esc(x[2]) + '</td></tr>'; }).join('') : '<tr><td colspan="3">' + A.empty(L('Chưa có thao tác nào', 'No actions yet'), L('Thao tác bạn làm trên Trang quản trị sẽ hiện ở đây.', 'What you do in the portal shows up here.'), '', 'clock-counter-clockwise') + '</td></tr>') + '</tbody></table></section>';
      }
      var vis = [];
      groups().forEach(function (g) { g.pages.forEach(function (p) { if (A.sees(p)) vis.push(A.navLabel(p)); }); });
      return h + '<div class="grid2"><section class="card"><div class="card-h"><h2>' + L('Thông tin cá nhân', 'Personal details') + '</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:14px">' +
        '<div class="field"><label for="pf-n">' + L('Họ tên', 'Full name') + ' <span class="req">*</span></label><input id="pf-n" class="inp' + (d.name.trim() ? '' : ' bad') + '" data-in="pfSet" data-k="name" value="' + esc(d.name) + '">' + (d.name.trim() ? '' : '<span class="err">' + L('Không được để trống', 'Required') + '</span>') + '</div>' +
        '<div class="grid2e" style="gap:12px"><div class="field"><label for="pf-p">' + L('Số điện thoại', 'Phone') + '</label><input id="pf-p" class="inp' + (pOk ? '' : ' bad') + '" inputmode="tel" data-in="pfSet" data-k="phone" value="' + esc(d.phone) + '">' + (pOk ? '<span class="hint">' + L('Dùng để nhận mã khôi phục tài khoản.', 'Used for account recovery codes.') + '</span>' : '<span class="err">' + L('Cần 10 số, bắt đầu bằng 0', 'Needs 10 digits starting with 0') + '</span>') + '</div><div class="field"><label for="pf-t">' + L('Chức danh', 'Job title') + '</label><input id="pf-t" class="inp" data-in="pfSet" data-k="title" value="' + esc(d.title) + '"></div></div>' +
        '<div class="field"><label for="pf-e">Email</label><input id="pf-e" class="inp" value="' + esc(a.email) + '" disabled><span class="hint">' + L('Email là tên đăng nhập. Cần đổi thì liên hệ Super admin.', 'Email is your sign-in name. Contact a Super admin to change it.') + '</span></div>' +
        '<div class="field"><span class="flabel">' + L('Ngôn ngữ giao diện', 'Interface language') + '</span><div class="seg" role="group" aria-label="' + L('Ngôn ngữ giao diện', 'Interface language') + '">' + [['vi', 'Tiếng Việt'], ['en', 'English']].map(function (x) { return '<button type="button" class="' + (d.lang === x[0] ? 'on' : '') + '" data-act="pfLang" data-id="' + x[0] + '" aria-pressed="' + (d.lang === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="field"><span class="flabel">' + L('Múi giờ', 'Time zone') + '</span><span style="font-size:13.5px">GMT+7 · ' + L('Giờ Việt Nam', 'Vietnam time') + '</span></div></div></section>' +
        '<div class="stack"><section class="card"><div class="card-b" style="display:flex;gap:14px;align-items:center"><span class="av" style="width:56px;height:56px;border-radius:28px;font-size:18px">' + A.ini() + '</span><div style="min-width:0"><b style="font-size:16px;font-weight:600">' + esc(a.name) + '</b><div class="muted" style="font-size:13px">' + esc(a.title || '') + '</div><div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><span class="badge t-info">' + A.roleLabel(a.role) + '</span><span class="badge plain t-neutral">' + L(REG[a.reg][0], REG[a.reg][1]) + '</span></div></div></div></section>' +
        '<section class="card"><div class="card-h"><h2>' + L('Quyền của bạn', 'Your access') + '</h2><span class="muted" style="font-size:12.5px">' + L(cnt.p + '/' + cnt.pt + ' mục · ' + cnt.a + '/' + cnt.at + ' thao tác', cnt.p + '/' + cnt.pt + ' items · ' + cnt.a + '/' + cnt.at + ' actions') + '</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;gap:6px;flex-wrap:wrap">' + vis.map(function (v) { return '<span class="badge plain t-neutral">' + v + '</span>'; }).join('') + '</div><p class="muted" style="margin:0;font-size:12.5px">' + L('Cần thêm quyền thì liên hệ Super admin.', 'Need more access? Contact a Super admin.') + '</p></div></section></div></div>';
    }
  };
  A.IN.pfSet = function (el, v) { A.S.ui.pf[el.dataset.k] = v; A.render(); };
  ACT.pfLang = function (el) { A.S.ui.pf.lang = el.dataset.id; A.render(); };
  ACT.pfSave = function () {
    var a = A.myAcct(), d = A.S.ui.pf, langChanged = (d.lang === 'en') !== !!VN.lang;
    a.name = d.name.trim(); a.phone = fmtPhone(d.phone); a.title = d.title.trim();
    if (langChanged) VN.lang = d.lang === 'en' ? 1 : 0;
    A.log(L('Cập nhật hồ sơ cá nhân', 'Updated own profile'), a.email);
    A.S.ui.pf = null; A.render(); A.toast(L('Đã lưu hồ sơ', 'Profile saved'));
  };
  ACT.pf2fa = function () {
    var a = A.myAcct(); a.tfa = !a.tfa;
    A.log(a.tfa ? L('Bật xác thực 2 lớp', 'Turned on 2FA') : L('Tắt xác thực 2 lớp', 'Turned off 2FA'), a.email);
    A.render(); A.toast(a.tfa ? L('Đã bật xác thực 2 lớp', 'Two-factor turned on') : L('Đã tắt xác thực 2 lớp', 'Two-factor turned off'), a.tfa ? '' : 'err');
  };
  ACT.pfOut = function (el) {
    var a = A.myAcct(), x = el.dataset.x, n;
    if (x === 'all') { n = a.sessions.length - 1; a.sessions = a.sessions.filter(function (s) { return s.cur; }); }
    else { n = 1; a.sessions.splice(+x, 1); }
    A.log(L('Đăng xuất phiên khác', 'Signed out other sessions'), a.email);
    A.render(); A.toast(L('Đã đăng xuất ' + n + ' phiên', 'Signed out ' + n + (n > 1 ? ' sessions' : ' session')));
  };
  ACT.pfNoti = function (el) { var v = A.myAcct().noti[el.dataset.id]; v[el.dataset.x] = !v[el.dataset.x]; A.render(); A.toast(L('Đã lưu cài đặt thông báo', 'Notification settings saved')); };
  ACT.pwOpen = function () { A.openModal('pwd', { cur: '', nw: '', cf: '' }); };
  M.pwd = function (m) {
    var rules = [[m.nw.length >= 10, L('Ít nhất 10 ký tự', 'At least 10 characters')], [/[A-ZÀ-Ỹ]/.test(m.nw), L('Có chữ in hoa', 'An uppercase letter')], [/\d/.test(m.nw), L('Có chữ số', 'A number')], [!!m.nw && m.nw !== m.cur, L('Khác mật khẩu hiện tại', 'Different from the current password')]];
    var allOk = rules.every(function (r) { return r[0]; }), match = !!m.cf && m.cf === m.nw, ok = m.cur && allOk && match;
    return shell(L('Đổi mật khẩu', 'Change password'), L('Đổi xong, các phiên đăng nhập khác sẽ bị đăng xuất.', 'Other sessions are signed out after the change.'),
      '<div class="field"><label for="pw-c">' + L('Mật khẩu hiện tại', 'Current password') + ' <span class="req">*</span></label><input id="pw-c" class="inp" type="password" autocomplete="current-password" data-in="mset" data-k="cur" value="' + esc(m.cur) + '"></div>' +
      '<div class="field"><label for="pw-n">' + L('Mật khẩu mới', 'New password') + ' <span class="req">*</span></label><input id="pw-n" class="inp" type="password" autocomplete="new-password" data-in="mset" data-k="nw" value="' + esc(m.nw) + '"><ul class="pw-rules">' + rules.map(function (r) { return '<li class="' + (r[0] ? 'ok' : '') + '">' + ic(r[0] ? 'check-circle-fill' : 'x-circle') + r[1] + '</li>'; }).join('') + '</ul></div>' +
      '<div class="field"><label for="pw-f">' + L('Nhập lại mật khẩu mới', 'Confirm new password') + ' <span class="req">*</span></label><input id="pw-f" class="inp' + (m.cf && !match ? ' bad' : '') + '" type="password" autocomplete="new-password" data-in="mset" data-k="cf" value="' + esc(m.cf) + '">' + (m.cf && !match ? '<span class="err">' + L('Chưa khớp với mật khẩu mới', 'Does not match the new password') + '</span>' : '') + '</div>',
      '<span></span><div class="r">' + A.btn(L('Huỷ', 'Cancel'), 'closeModal') + A.btn(L('Đổi mật khẩu', 'Change password'), 'pwGo', { cls: 'primary', dis: ok ? '' : L('Điền đủ và đạt mọi điều kiện', 'Fill in all fields and meet every rule') }) + '</div>');
  };
  ACT.pwGo = function () {
    var a = A.myAcct(), n = a.sessions.length - 1; a.pwAt = '24/09/2026'; a.sessions = a.sessions.filter(function (s) { return s.cur; });
    A.log(L('Đổi mật khẩu', 'Changed password'), a.email);
    A.S.modal = null; A.render(); A.toast(L('Đã đổi mật khẩu' + (n ? '. Đã đăng xuất ' + n + ' phiên khác' : ''), 'Password changed' + (n ? '. Signed out ' + n + ' other sessions' : '')));
  };

  /* ---------- Tham số vận hành (concept 3c) ---------- */
  A.P.parameters = {
    crumb: function () { return null; },
    render: function () {
      var c = cfg(), cat = A.ui('pmCat', 'ac');
      var h = page(L('Tham số vận hành', 'Parameters'), L('Giá trị cấp dưới kế thừa từ cấp trên, trừ khi được ghi đè.', 'Lower levels inherit from higher levels unless overridden.'));
      h += '<div class="scope"><span class="lbl3">' + L('Phạm vi', 'Scope') + '</span><span class="lv">' + L('Toàn cục', 'Global') + '</span><span class="arr">›</span><span class="lv">' + L('Khu vực:', 'Region:') + ' <b style="font-weight:500">' + L('TP. Hồ Chí Minh', 'Ho Chi Minh City') + '</b></span><span class="arr">›</span><span class="lv on">' + L('Ngành:', 'Category:') + '<label class="sr" for="pm-c">' + L('Ngành', 'Category') + '</label><select id="pm-c" class="sel" data-in="uiset" data-k="pmCat">' + D.CATS.map(function (x) { return '<option value="' + x.id + '"' + (cat === x.id ? ' selected' : '') + '>' + L(x.vi, x.en) + '</option>'; }).join('') + '</select></span><span class="arr">›</span><span class="lv">' + L('Nhà cung cấp:', 'Provider:') + ' <b style="font-weight:500">' + L('Tất cả', 'All') + '</b></span></div>';
      c.params.forEach(function (g) {
        h += '<div class="pgroup"><div class="pgroup-h">' + L(g[0][0], g[0][1]) + '</div>' + g[1].map(function (p) {
          var here = p[4] === 'here' && cat === 'ac', v = here ? p[2] : (p[0] === 'warranty' ? 3 : p[0] === 'radius' ? 200 : p[2]), src = here ? L('Ghi đè tại đây', 'Overridden here') : L('Kế thừa · ', 'Inherited · ') + L(LV[p[4] === 'here' ? 'g' : p[4]][0], LV[p[4] === 'here' ? 'g' : p[4]][1]);
          return '<button type="button" class="prow' + (A.S.modal && A.S.modal.kind === 'param' && A.S.modal.id === p[0] ? ' on' : '') + '" data-act="paramOpen" data-id="' + p[0] + '"><span><span style="display:block;font-weight:500">' + L(p[1][0], p[1][1]) + '</span>' + (p[6] && here ? '<span class="sched">' + L('Đã lên lịch: ' + p[6].v + ' ' + p[3][0] + ' từ ' + p[6].at.slice(0, 5), 'Scheduled: ' + p[6].v + ' ' + p[3][1] + ' from ' + p[6].at.slice(0, 5)) + '</span>' : '') + '</span><span class="v">' + (p[3][0] === '₫' ? VN.money(v) : VN.num(v) + ' ' + L(p[3][0], p[3][1])) + '</span><span><span class="badge ' + (here ? 't-info' : 'plain t-neutral') + '">' + src + '</span></span>' + ic('caret-right', 'subtle') + '</button>';
        }).join('') + '</div>';
      });
      return h;
    }
  };
  function param(id) { var r = null; cfg().params.forEach(function (g) { g[1].forEach(function (p) { if (p[0] === id) r = p; }); }); return r; }
  ACT.paramOpen = function (el) { A.openModal('param', { id: el.dataset.id, edit: false, v: '', when: 'now', date: '2026-10-01', note: '' }); };
  M.param = function (m) {
    var p = param(m.id), cat = A.ui('pmCat', 'ac'), here = p[4] === 'here' && cat === 'ac', unit = L(p[3][0], p[3][1]), fmt = function (v) { return p[3][0] === '₫' ? VN.money(v) : VN.num(v) + ' ' + unit; };
    var chain = [[L('Toàn cục', 'Global'), L('Toàn hệ thống', 'All regions'), p[0] === 'warranty' ? fmt(3) : fmt(p[2]), p[4] === 'g' || (p[4] === 'here' && !here) ? 'active' : 'set'], [L('Khu vực', 'Region'), L('TP. Hồ Chí Minh', 'Ho Chi Minh City'), p[4] === 'r' ? fmt(p[2]) : L('kế thừa', 'inherited'), p[4] === 'r' ? 'active' : 'inh'], [L('Ngành', 'Category'), A.catName(cat), here ? fmt(p[2]) : L('kế thừa', 'inherited'), here ? 'active' : 'inh'], [L('Nhà cung cấp', 'Provider'), L('Chưa chọn', 'Not selected'), L('Không có', 'None'), 'none']];
    var hist = (cfg().phist[p[0]] || []);
    var body = '<div class="lbl">' + L('Giá trị theo cấp', 'Value by level') + '</div><div class="tl">' + chain.map(function (c, i) { return '<div class="tl-i ' + (c[3] === 'active' ? 'now' : c[3] === 'set' ? '' : 'todo') + '"><div class="rail"><span class="dot"></span><span class="bar"></span></div><span class="t" style="font-weight:400"><small>' + c[0] + '</small><span style="font-weight:500">' + c[1] + '</span></span><span class="tm" style="text-align:right;color:' + (c[3] === 'active' ? 'var(--text)' : 'var(--subtle)') + ';font-weight:' + (c[3] === 'active' ? 600 : 400) + '">' + c[2] + (c[3] === 'active' ? '<br><span style="font-size:11.5px;font-weight:600;color:var(--info)">' + L('Đang áp dụng', 'In effect') + '</span>' : '') + '</span></div>'; }).join('') + '</div>';
    if (p[6] && here) body += '<div style="display:flex;flex-direction:column;gap:6px;padding:14px;border-radius:10px;background:var(--sched-bg)"><div style="display:flex;justify-content:space-between"><span style="font-size:12.5px;font-weight:600;color:var(--warn)">' + L('Đã lên lịch thay đổi', 'Scheduled change') + '</span><button type="button" class="link" data-act="paramUnsched" data-id="' + p[0] + '">' + L('Huỷ lịch', 'Cancel') + '</button></div><b>' + p[2] + ' → ' + p[6].v + ' ' + unit + '</b><span class="muted" style="font-size:12.5px">' + L('Hiệu lực từ ', 'Effective ') + p[6].at + ' · ' + esc(p[6].by) + '</span></div>';
    if (m.edit) body += '<div class="field"><label for="pm-v">' + L('Giá trị mới', 'New value') + ' <span class="req">*</span></label><div class="inp-wrap"><input id="pm-v" class="inp" inputmode="numeric" data-in="mset" data-k="v" value="' + esc(m.v) + '"><span class="suffix">' + unit + '</span></div><span class="hint">' + L('Kế thừa: ', 'Inherited: ') + chain[0][2] + ' (' + L('Toàn cục', 'Global') + ')</span></div><div class="field"><span class="flabel">' + L('Hiệu lực', 'Effective') + '</span><div class="seg"><button type="button" class="' + (m.when === 'now' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="now">' + L('Ngay', 'Now') + '</button><button type="button" class="' + (m.when === 'later' ? 'on' : '') + '" data-act="mpick" data-id="when" data-x="later">' + L('Lên lịch', 'Schedule') + '</button></div>' + (m.when === 'later' ? '<input type="date" class="inp" style="max-width:200px;margin-top:8px" aria-label="' + L('Ngày hiệu lực', 'Effective date') + '" min="2026-09-25" value="' + m.date + '" data-in="mset" data-k="date">' : '') + '</div><div class="field"><label for="pm-n">' + L('Lý do', 'Reason') + ' <span class="req">*</span></label><textarea id="pm-n" class="txa" maxlength="500" data-in="mset" data-k="note">' + esc(m.note) + '</textarea></div>';
    body += '<div class="lbl">' + L('Lịch sử thay đổi', 'Change history') + '</div>' + (hist.length ? hist.map(function (x) { return '<div style="display:flex;flex-direction:column;gap:3px;padding:10px 0;border-top:1px solid var(--line)"><div style="display:flex;justify-content:space-between;font-size:13px"><b style="font-weight:600">' + esc(x[0]) + ' ' + unit + '</b><span class="muted">' + x[1] + '</span></div><span class="muted" style="font-size:12.5px">' + esc(x[2]) + ' · "' + esc(x[3]) + '"</span></div>'; }).join('') : '<p class="muted" style="margin:0;font-size:13px">' + L('Chưa có thay đổi.', 'No changes yet.') + '</p>');
    var ok = VN.parseMoney(m.v) > 0 && m.note.trim();
    var foot = m.edit ? A.btn(L('Huỷ sửa', 'Cancel edit'), 'paramEdit', { x: '0' }) + '<div class="r">' + A.btn(L('Lưu giá trị', 'Save value'), 'paramSave', { cls: 'primary', dis: ok ? '' : L('Nhập giá trị và lý do', 'Enter value and reason') }) + '</div>' : (here ? A.btn(L('Bỏ ghi đè', 'Remove override'), 'paramRemove', { cls: 'danger', id: p[0] }) : '<span></span>') + '<div class="r">' + A.btn(L('Sửa giá trị', 'Edit value'), 'paramEdit', { cls: 'primary', x: '1' }) + '</div>';
    return shell(L(p[1][0], p[1][1]), L(p[5][0], p[5][1]), body, foot);
  };
  ACT.paramEdit = function (el) { var m = A.S.modal; m.edit = el.dataset.x === '1'; if (m.edit && !m.v) m.v = String(param(m.id)[2]); A.render(); };
  ACT.paramSave = function () {
    var m = A.S.modal, p = param(m.id), v = VN.parseMoney(m.v), c = cfg();
    c.phist[p[0]] = [[(m.when === 'now' ? p[2] + ' → ' + v : L('Lên lịch ', 'Scheduled ') + p[2] + ' → ' + v), '24/09/2026', A.me(), m.note.trim()]].concat(c.phist[p[0]] || []);
    if (m.when === 'now') { p[2] = v; p[6] = null; if (p[4] !== 'here' && A.ui('pmCat', 'ac') === 'ac') p[4] = 'here'; } else p[6] = { v: v, at: m.date.split('-').reverse().join('/') + ' 00:00', by: A.me() };
    A.log(L('Sửa tham số vận hành', 'Edited parameter'), L(p[1][0], p[1][1]));
    m.edit = false; m.note = ''; A.render(); A.toast(m.when === 'now' ? L('Đã lưu. Áp dụng cho đơn tạo từ bây giờ', 'Saved. Applies to new orders from now') : L('Đã lên lịch thay đổi', 'Change scheduled'));
  };
  ACT.paramUnsched = function (el) { var p = param(el.dataset.id); p[6] = null; A.render(); A.toast(L('Đã huỷ thay đổi đã lên lịch', 'Scheduled change cancelled')); };
  ACT.paramRemove = function (el) { var p = param(el.dataset.id); p[4] = 'g'; if (p[0] === 'warranty') p[2] = 3; p[6] = null; A.log(L('Bỏ ghi đè tham số', 'Removed override'), L(p[1][0], p[1][1])); A.S.modal = null; A.render(); A.toast(L('Đã bỏ ghi đè. Ngành Điện lạnh dùng lại giá trị Toàn cục', 'Override removed. Air conditioning now inherits Global')); };

  /* ---------- Nhật ký ---------- */
  var SEED_AUDIT = [
    ['10:31', 'Lê Minh Anh', 'acc', ['Duyệt rút tiền', 'Approved payout'], 'RT-24090', '113.161.24.8'], ['10:05', 'Trần Ngọc Hân', 'cs', ['Ghi chú đôn đốc', 'Follow-up note'], 'VN-240919', '113.161.24.19'],
    ['09:47', 'Nguyễn Hải', 'sa', ['Sửa tham số: Thời gian bảo hành (lên lịch)', 'Parameter: warranty (scheduled)'], 'Điện lạnh', '14.241.120.5'], ['09:05', 'Lê Minh Anh', 'acc', ['Gửi duyệt hoàn tiền', 'Submitted refund'], 'HT-0923', '113.161.24.8'],
    ['08:40', 'Phạm Thu Trang', 'acc', ['Gửi duyệt hoàn tiền', 'Submitted refund'], 'HT-0924', '113.161.24.11'], ['23/09 18:40', 'Trần Ngọc Hân', 'cs', ['Khoá tài khoản nhà cung cấp', 'Locked provider'], 'Thợ Tâm', '113.161.24.19'],
    ['23/09 14:02', 'Lê Minh Anh', 'acc', ['Duyệt rút tiền', 'Approved payout'], 'RT-24081', '113.161.24.8']
  ];
  A.P.audit = {
    crumb: function () { return null; },
    render: function () {
      var tab = A.S.p.tab || 'act', who = A.ui('auWho', '');
      var rows = A.S.audit.map(function (a) { return [a[0], a[1], a[2], [a[3], a[3]], a[4], '113.161.24.8', true]; }).concat(SEED_AUDIT);
      rows = rows.filter(function (r) { return !who || r[1] === who; });
      var h = page(L('Nhật ký', 'Audit log'), L('Mọi thao tác quản trị đều được ghi, không sửa, không xoá.', 'Every admin action is recorded, append-only.'), A.can('export') ? A.btn(L('Xuất Excel', 'Export to Excel'), 'auExport', { icon: 'download-simple' }) : '');
      h += '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (tab === 'act') + '" class="' + (tab === 'act' ? 'on' : '') + '" data-act="tab" data-id="act">' + L('Thao tác', 'Actions') + '<span class="n">' + rows.length + '</span></button><button type="button" role="tab" aria-selected="' + (tab === 'login') + '" class="' + (tab === 'login' ? 'on' : '') + '" data-act="tab" data-id="login">' + L('Lịch sử đăng nhập', 'Sign-in history') + '</button></div>';
      if (tab === 'login') return h + '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Thời gian', 'Time') + '</th><th>' + L('Người dùng', 'User') + '</th><th>' + L('Thiết bị', 'Device') + '</th><th>IP</th><th>' + L('Kết quả', 'Result') + '</th></tr></thead><tbody>' + [['08:15', 'Phạm Thu Trang', 'Chrome · Windows', '113.161.24.11', 1], ['08:02', 'Lê Minh Anh', 'Edge · Windows', '113.161.24.8', 1], ['07:58', 'Nguyễn Hải', 'Safari · macOS', '14.241.120.5', 1], ['07:51', 'Nguyễn Hải', 'Safari · macOS', '14.241.120.5', 0], ['07:45', 'Trần Ngọc Hân', 'Chrome · Windows', '113.161.24.19', 1]].map(function (r) { return '<tr><td class="muted">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td class="mono" style="font-size:12px">' + r[3] + '</td><td>' + (r[4] ? '<span class="badge t-ok">' + L('Thành công', 'Succeeded') + '</span>' : '<span class="badge t-danger">' + L('Sai mã xác thực 2 lớp', 'Wrong 2FA code') + '</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>';
      h += '<div class="filters">' + A.selUi('auWho', [['', L('Tất cả người thực hiện', 'All users')]].concat(['Nguyễn Hải', 'Lê Minh Anh', 'Phạm Thu Trang', 'Trần Ngọc Hân', 'Võ Quốc Bảo'].map(function (n) { return [n, n]; })), L('Người thực hiện', 'User')) + '</div>';
      return h + '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>' + L('Thời gian', 'Time') + '</th><th>' + L('Người thực hiện', 'User') + '</th><th>' + L('Vai trò', 'Role') + '</th><th>' + L('Thao tác', 'Action') + '</th><th>' + L('Đối tượng', 'Target') + '</th><th>IP</th></tr></thead><tbody>' +
        (rows.length ? rows.map(function (r) { return '<tr class="' + (r[6] ? 'flash' : '') + '"><td class="muted nw">' + r[0] + '</td><td>' + esc(r[1]) + '</td><td>' + A.roleLabel(r[2]) + '</td><td>' + L(r[3][0], r[3][1]) + '</td><td class="mono" style="font-size:12px">' + esc(r[4]) + '</td><td class="mono muted" style="font-size:12px">' + r[5] + '</td></tr>'; }).join('') : '<tr><td colspan="6">' + A.empty(L('Không có thao tác', 'No actions'), '') + '</td></tr>') + '</tbody></table></div>';
    }
  };
  ACT.auExport = function () { A.toast(L('Đã tạo file VuongNhan_NhatKy_20260924.xls', 'Created VuongNhan_NhatKy_20260924.xls')); VN.download('VuongNhan_NhatKy_20260924.xls', VN.xls([{ name: L('Nhật ký', 'Audit'), rows: [[L('Thời gian', 'Time'), L('Người', 'User'), L('Thao tác', 'Action'), L('Đối tượng', 'Target')]].concat(A.S.audit.map(function (a) { return [a[0], a[1], a[3], a[4]]; })).concat(SEED_AUDIT.map(function (a) { return [a[0], a[1], L(a[3][0], a[3][1]), a[4]]; })), head: [0] }]), 'application/vnd.ms-excel'); };
})(window);
