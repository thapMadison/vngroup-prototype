/* Vương Nhân · tiện ích dùng chung cho 3 ứng dụng.
   Song ngữ, định dạng tiền/ngày, render giữ focus + vị trí cuộn, bẫy focus trong lớp phủ, toast, tải file.
   Dữ liệu chỉ nằm trong bộ nhớ, không dùng localStorage. */
(function (W) {
  'use strict';
  var VN = {};
  VN.lang = 0; // 0 = VI, 1 = EN
  VN.L = function (vi, en) { return VN.lang ? (en == null ? vi : en) : vi; };
  VN.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  VN.today = { d: 24, m: 9, y: 2026, dow: 4, hh: 10, mm: 42 }; // thứ Năm 24/09/2026 10:42

  /* ---------- Số và tiền ---------- */
  VN.num = function (n, dec) {
    dec = dec || 0;
    var neg = n < 0; n = Math.abs(n);
    var s = n.toFixed(dec), parts = s.split('.');
    var int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, VN.lang ? ',' : '.');
    var out = parts[1] ? int + (VN.lang ? '.' : ',') + parts[1] : int;
    return (neg ? '−' : '') + out;
  };
  VN.money = function (n, sign) {
    var s = VN.num(Math.round(n)) + ' ₫';
    if (sign && n > 0) s = '+' + s;
    return s;
  };
  VN.moneyShort = function (n) {
    var a = Math.abs(n), neg = n < 0 ? '−' : '', trim = function (s) { return /[.,]/.test(s) ? s.replace(/0+$/, '').replace(/[.,]$/, '') : s; };
    if (a >= 1e9) return neg + trim(VN.num(a / 1e9, 2)) + (VN.lang ? 'B ₫' : ' tỷ ₫');
    if (a >= 1e6) return neg + trim(VN.num(a / 1e6, 1)) + (VN.lang ? 'M ₫' : ' tr ₫');
    return VN.money(n);
  };
  VN.pct = function (x, dec) { return VN.num(x, dec == null ? 1 : dec) + '%'; };
  VN.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  VN.dm = function (d, m) { return VN.pad(d) + '/' + VN.pad(m); };
  VN.dmy = function (d, m, y) { return VN.pad(d) + '/' + VN.pad(m) + '/' + (y || 2026); };
  var DOW_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var DOW_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  VN.dow = function (i) { return VN.lang ? DOW_EN[i] : DOW_VI[i]; };
  VN.todayLong = function () { return VN.L('Thứ Năm, 24/09/2026', 'Thursday, 24/09/2026'); };
  VN.nowTime = function () { return VN.pad(VN.today.hh) + ':' + VN.pad(VN.today.mm); };
  VN.tickMinute = function () { VN.today.mm++; if (VN.today.mm > 59) { VN.today.mm = 0; VN.today.hh++; } return VN.nowTime(); };
  VN.ago = function (min) {
    if (min < 1) return VN.L('vừa xong', 'just now');
    if (min < 60) return VN.L(min + ' phút trước', min + ' min ago');
    var h = Math.round(min / 60);
    if (h < 24) return VN.L(h + ' giờ trước', h + ' h ago');
    var d = Math.round(h / 24);
    return VN.L(d + ' ngày trước', d + (d > 1 ? ' days ago' : ' day ago'));
  };
  /* Chuẩn hoá để tìm: chữ thường, bỏ dấu, đ thành d, gộp khoảng trắng */
  VN.fold = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim(); };
  VN.parseMoney = function (s) { var n = parseInt(String(s).replace(/[^\d]/g, ''), 10); return isNaN(n) ? 0 : n; };

  /* ---------- Icon ---------- */
  VN.ic = function (n, c) { return W.ic ? W.ic(n, c) : ''; };

  /* ---------- Render giữ focus và vị trí cuộn ---------- */
  /* Chữ ký vị trí của một phần tử: vùng data-scroll gần nhất + đường dẫn chỉ số con + class.
     Dùng để giữ vị trí cuộn của phần tử không có data-scroll (hàng lọc cuộn ngang, menu trái…) qua mỗi lần vẽ lại. */
  function sigOf(el, root) {
    var p = [], n = el;
    while (n && n !== root) { var i = 0, s = n; while ((s = s.previousElementSibling)) i++; p.unshift(i); n = n.parentElement; }
    var sc = el.parentElement && el.parentElement.closest('[data-scroll]');
    return (sc && root.contains(sc) ? sc.getAttribute('data-scroll') : '') + '|' + p.join('.') + '|' + el.className;
  }
  VN.patch = function (root, html) {
    var ae = document.activeElement, aid = ae && ae.id, ss = null, se = null;
    try { if (aid && ae.selectionStart != null) { ss = ae.selectionStart; se = ae.selectionEnd; } } catch (e) {}
    var scrolls = {}, kept = [];
    root.querySelectorAll('[data-scroll]').forEach(function (el) { scrolls[el.getAttribute('data-scroll')] = [el.scrollTop, el.scrollLeft]; });
    root.querySelectorAll('*').forEach(function (el) { if (!el.hasAttribute('data-scroll') && (el.scrollLeft || el.scrollTop)) kept.push([sigOf(el, root), el.scrollTop, el.scrollLeft]); });
    root.innerHTML = html;
    root.querySelectorAll('[data-scroll]').forEach(function (el) {
      var s = scrolls[el.getAttribute('data-scroll')];
      if (s) { el.scrollTop = s[0]; el.scrollLeft = s[1]; }
    });
    var done = [];
    kept.forEach(function (k) {
      var el = root; k[0].split('|')[1].split('.').forEach(function (i) { el = el && el.children[+i]; });
      if (el && el !== root && sigOf(el, root) === k[0]) { el.scrollTop = k[1]; el.scrollLeft = k[2]; done.push(el); }
    });
    /* Màn mới mở: đưa viên lọc đang chọn vào tầm nhìn nếu nó nằm khuất bên phải */
    root.querySelectorAll('.hscroll, .hchips').forEach(function (h) {
      if (done.indexOf(h) >= 0) return;
      var on = h.querySelector('.on, [aria-pressed="true"]'); if (!on) return;
      var hr = h.getBoundingClientRect(), r = on.getBoundingClientRect();
      if (r.right > hr.right - 8 || r.left < hr.left) h.scrollLeft += r.left - hr.left - 16;
    });
    if (aid) {
      var el = document.getElementById(aid);
      if (el) { el.focus({ preventScroll: true }); try { if (ss != null) el.setSelectionRange(ss, se); } catch (e) {} }
    }
  };

  /* ---------- Sự kiện uỷ quyền ---------- */
  VN.bind = function (root, acts, inputs) {
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-act]');
      if (!el || !root.contains(el)) return;
      if (el.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      var fn = acts[el.getAttribute('data-act')];
      if (fn) { e.preventDefault(); VN.lastAct = el.getAttribute('data-act') + '|' + (el.getAttribute('data-id') || ''); fn(el, e); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var el = e.target.closest('[data-act]');
      if (!el || el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') return;
      e.preventDefault(); el.click();
    });
    var onIn = function (e) {
      var el = e.target.closest('[data-in]');
      if (!el || !inputs) return;
      var fn = inputs[el.getAttribute('data-in')];
      if (fn) fn(el, el.type === 'checkbox' ? el.checked : el.value, e);
    };
    root.addEventListener('input', onIn);
    root.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox' || e.target.type === 'radio' || e.target.type === 'date' || e.target.type === 'file') onIn(e); });
  };
  VN.refocus = function (root) {
    if (!VN.lastAct) return;
    var p = VN.lastAct.split('|');
    var sel = '[data-act="' + p[0] + '"]' + (p[1] ? '[data-id="' + p[1].replace(/"/g, '') + '"]' : '');
    var el = root.querySelector(sel);
    if (el) el.focus({ preventScroll: true });
  };

  /* ---------- Bẫy focus trong modal/drawer ---------- */
  var FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  VN.focusFirst = function (layer) {
    if (!layer) return;
    var t = layer.querySelector('[autofocus]') || layer.querySelector('.modal-b ' + FOCUSABLE) || layer.querySelector(FOCUSABLE);
    if (t) t.focus({ preventScroll: true });
  };
  VN.trap = function (e, layer) {
    if (e.key !== 'Tab' || !layer) return;
    var f = Array.prototype.filter.call(layer.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (!layer.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ---------- Toast ---------- */
  VN.toast = function (msg, kind, host) {
    var box = (host || document).querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); (host || document.body).appendChild(box); }
    var t = document.createElement('div');
    t.className = 'toast' + (kind === 'err' ? ' err' : '');
    t.innerHTML = VN.ic(kind === 'err' ? 'warning-circle' : 'check-circle') + '<span>' + msg + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .25s'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 260); }, 3000);
  };

  /* ---------- Tải file ---------- */
  VN.download = function (name, content, mime) {
    var blob = new Blob([content], { type: mime || 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  /* Excel 2003 XML (SpreadsheetML): nhiều sheet, Excel và LibreOffice mở được */
  VN.xls = function (sheets) {
    var x = '<?xml version="1.0" encoding="UTF-8"?>\n<?mso-application progid="Excel.Sheet"?>\n' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#F0EEEC" ss:Pattern="Solid"/></Style>' +
      '<Style ss:ID="n"><NumberFormat ss:Format="#,##0"/></Style><Style ss:ID="t"><Font ss:Bold="1" ss:Size="13"/></Style></Styles>';
    sheets.forEach(function (sh) {
      x += '<Worksheet ss:Name="' + VN.esc(sh.name) + '"><Table>';
      sh.rows.forEach(function (r, i) {
        x += '<Row>';
        r.forEach(function (c) {
          var isNum = typeof c === 'number';
          var st = (sh.head && sh.head.indexOf(i) >= 0) ? ' ss:StyleID="h"' : (sh.title === i ? ' ss:StyleID="t"' : (isNum ? ' ss:StyleID="n"' : ''));
          x += '<Cell' + st + '><Data ss:Type="' + (isNum ? 'Number' : 'String') + '">' + VN.esc(c == null ? '' : c) + '</Data></Cell>';
        });
        x += '</Row>';
      });
      x += '</Table></Worksheet>';
    });
    return x + '</Workbook>';
  };

  /* Sao chép sâu dữ liệu mẫu để "Đặt lại dữ liệu" */
  VN.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  VN.uid = (function () { var i = 1000; return function (p) { return (p || 'x') + (++i); }; })();

  W.VN = VN;
})(window);
