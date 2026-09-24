/* Dùng chung cho 3 hướng: sidebar, topbar, biểu đồ cột. Số liệu tháng 09/2026 cộng khớp finance-flow.md. */
var NAV = [
  [null, [['dashboard','Tổng quan','squares-four'],['reports','Báo cáo','chart-bar']]],
  ['Vận hành', [['requests','Yêu cầu dịch vụ','clipboard-text'],['orders','Đơn hàng','receipt'],['disputes','Khiếu nại','scales',5,'red']]],
  ['Người dùng', [['providers','Nhà cung cấp','storefront',12],['customers','Khách hàng','users']]],
  ['Tài chính', [['transactions','Giao dịch & đối soát','wallet'],['payouts','Rút tiền','hand-coins',8],['refunds','Hoàn tiền & tạm giữ','arrow-counter-clockwise']]],
  ['Dịch vụ & giá', [['catalog','Danh mục dịch vụ','tree-structure'],['pricing','Giá & hoa hồng','tag'],['regions','Khu vực','map-trifold']]],
  ['Nội dung', [['moderation','Kiểm duyệt','eye'],['broadcast','Thông báo & banner','megaphone']]],
  ['Hệ thống', [['admins','Quản trị viên','shield'],['parameters','Tham số vận hành','sliders-horizontal'],['audit','Nhật ký','file-text']]]
];

function sideHTML(active){
  var h = '<aside class="side"><div class="side-logo"><span class="lg"><img src="../site/assets/vngroup-logo.png" alt="VN Group"></span><span>ADMIN</span></div><nav aria-label="Menu quản trị">';
  NAV.forEach(function(g){
    h += '<div class="nav-g">' + (g[0] ? '<b>' + g[0] + '</b>' : '');
    g[1].forEach(function(it){
      h += '<button class="nav-i' + (it[0] === active ? ' on' : '') + '">' + ic(it[2]) + '<span>' + it[1] + '</span>' +
        (it[3] ? '<span class="cnt' + (it[4] ? ' ' + it[4] : '') + '">' + it[3] + '</span>' : '') + '</button>';
    });
    h += '</div>';
  });
  return h + '</nav></aside>';
}

function topbarHTML(){
  return '<div class="topbar"><div class="search">' + ic('magnifying-glass') + '<span>Tìm đơn, khách hàng, nhà cung cấp…</span><span class="kbd">Ctrl K</span></div>' +
    '<div class="tb-r"><div class="chipbox"><span class="lbl">Khu vực</span><b style="font-weight:500">TP. Hồ Chí Minh</b>' + ic('caret-down') + '</div>' +
    '<div class="seg" role="group" aria-label="Ngôn ngữ"><button class="on">VI</button><button>EN</button></div>' +
    '<button class="iconbtn" aria-label="Thông báo">' + ic('bell') + '<span class="dot"></span></button>' +
    '<div class="me"><span class="av">MA</span><div class="me-t"><b>Lê Minh Anh</b><span>Kế toán</span></div></div></div></div>';
}

/* GMV và Hoa hồng thực thu theo ngày, 01–24/09/2026, đơn vị nghìn đồng */
var DAYS = [];
for (var d = 1; d <= 24; d++) DAYS.push(d);
var GMV = [42300,25000,42700,41400,60300,62000,43500,44200,48800,48000,44700,62700,67700,48600,46500,51000,53100,49100,64900,71800,54100,50100,52300,57200];
var HH  = [5800,5700,5500,5400,5500,5600,5800,5800,3300,5500,5400,8000,8500,6000,5900,6400,6200,5900,8500,9300,6600,6100,6600,7000];

function vnd(k){ return (k * 1000).toLocaleString('vi-VN') + ' ₫'; }
function tr(k){ return (k / 1000).toLocaleString('vi-VN', {maximumFractionDigits:1}) + ' tr'; }

/* Biểu đồ cột nhóm, một trục ₫. Rê chuột vào cột nào cũng hiện số của cả ngày. */
function barChart(el, h){
  var W = el.clientWidth || 640, H = h || 220, padL = 44, padB = 24, padT = 8;
  var max = 80000, n = DAYS.length, cw = (W - padL) / n, bw = Math.max(4, Math.min(12, (cw - 6) / 2));
  var y = function(v){ return padT + (H - padT - padB) * (1 - v / max); };
  var s = '<svg width="' + W + '" height="' + H + '" role="img" aria-label="GMV và hoa hồng thực thu theo ngày, tháng 9/2026">';
  [0, 20000, 40000, 60000, 80000].forEach(function(t){
    s += '<line x1="' + padL + '" x2="' + W + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="' + (t ? '#ECEAE7' : '#C9C5C0') + '" stroke-width="1"/>' +
      '<text x="' + (padL - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" font-size="11" fill="#76706C">' + (t / 1000) + ' tr</text>';
  });
  DAYS.forEach(function(day, i){
    var x = padL + i * cw + (cw - bw * 2 - 2) / 2;
    s += '<g class="bar-g" data-i="' + i + '"><rect x="' + (padL + i * cw) + '" y="' + padT + '" width="' + cw + '" height="' + (H - padT - padB) + '" fill="transparent"/>' +
      '<path d="' + roundTop(x, y(GMV[i]), bw, y(0) - y(GMV[i])) + '" fill="var(--series-1)"/>' +
      '<path d="' + roundTop(x + bw + 2, y(HH[i]), bw, y(0) - y(HH[i])) + '" fill="var(--series-2)"/></g>';
    if (day % 3 === 1) s += '<text x="' + (padL + i * cw + cw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="11" fill="#76706C">' + day + '/9</text>';
  });
  el.innerHTML = s + '</svg><div class="tip" hidden></div>';
  var tip = el.querySelector('.tip');
  el.querySelectorAll('.bar-g').forEach(function(g){
    g.addEventListener('mouseenter', function(){
      var i = +g.dataset.i;
      tip.innerHTML = '<b>' + DAYS[i] + '/09/2026</b><span><i style="background:var(--series-1)"></i>GMV ' + vnd(GMV[i]) + '</span><span><i style="background:var(--series-2)"></i>Hoa hồng thực thu ' + vnd(HH[i]) + '</span>';
      tip.hidden = false;
      var x = padL + i * cw + cw / 2;
      tip.style.left = Math.min(Math.max(x - 110, 0), W - 220) + 'px';
      g.querySelectorAll('path').forEach(function(p){ p.style.opacity = 1; });
    });
    g.addEventListener('mouseleave', function(){ tip.hidden = true; });
  });
}
function roundTop(x, y, w, h){
  var r = Math.min(4, w / 2, h);
  return 'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z';
}
