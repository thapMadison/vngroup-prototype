/* Khung dùng chung cho App Khách hàng và App Nhà cung cấp: ngăn xếp màn, tab dưới, bottom sheet, toast, bảng Demo. */
(function (W) {
  'use strict';
  var VN = W.VN, L = VN.L, ic = VN.ic, esc = VN.esc;

  W.VNAPP = function (cfg) {
    var a = { S: cfg.state(), ACT: {}, IN: {}, SC: cfg.screens, dir: '' };
    var dev = document.getElementById('dev'), demo = document.getElementById('demo');
    a.L = L;
    a.top = function () { return a.S.stack[a.S.stack.length - 1]; };
    /* Mạng mô phỏng: Chậm thì mỗi màn mở ra hiện khung chờ 0,9 giây. */
    a.load = function (ms) {
      if (a.S.net !== 'slow' && !ms) return;
      a.loading = true; clearTimeout(a._lt);
      a._lt = setTimeout(function () { a.loading = false; a.render(); }, ms || 900);
    };
    a.push = function (n, p) { a.S.stack.push({ n: n, p: p || {} }); a.S.sheet = null; a.dir = 'enter'; a.load(); a.render(); };
    a.replace = function (n, p) { a.S.stack[a.S.stack.length - 1] = { n: n, p: p || {} }; a.S.sheet = null; a.dir = 'enter'; a.load(); a.render(); };
    a.back = function () { if (a.S.stack.length > 1) { a.S.stack.pop(); a.S.sheet = null; a.dir = 'back'; a.render(); } };
    a.root = function (n, p) { a.S.stack = [{ n: n, p: p || {} }]; a.S.sheet = null; a.dir = ''; a.load(); a.render(); };
    a.backTo = function (n) { while (a.S.stack.length > 1 && a.top().n !== n) a.S.stack.pop(); a.dir = 'back'; a.S.sheet = null; a.render(); };
    a.sheet = function (n, d) { a.S.sheet = Object.assign({}, d || {}, { n: n }); a.render(); };
    a.closeSheet = function () { a.S.sheet = null; a.render(); };
    a.toast = function (msg, kind) {
      var box = dev.querySelector('.a-toasts'); if (!box) return;
      var t = document.createElement('div'); t.className = 'a-toast' + (kind ? ' ' + kind : '');
      t.innerHTML = ic(kind === 'err' ? 'warning-circle' : kind === 'info' ? 'bell-ringing' : 'check-circle') + '<span>' + msg + '</span>';
      box.appendChild(t);
      setTimeout(function () { t.style.transition = 'opacity .25s'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 260); }, 3200);
    };

    /* Dựng thanh tiêu đề chuẩn: nút lùi, tiêu đề, nút phải */
    a.hdr = function (title, right, opt) {
      opt = opt || {};
      var canBack = a.S.stack.length > 1 && !opt.noBack;
      return '<div class="ah">' + (canBack ? '<button type="button" class="back-btn" data-act="back" aria-label="' + L('Quay lại', 'Back') + '">' + ic('caret-left') + '</button>' : '<span class="sp"></span>') +
        '<h1>' + title + '</h1>' + (right || '<span class="sp"></span>') + '</div>';
    };
    a.stepper = function (i, n, lbl) {
      var s = '<div class="step-lbl"><span>' + L('Bước ', 'Step ') + '<b>' + i + '</b>/' + n + '</span><span>' + lbl + '</span></div><div class="stepper">';
      for (var k = 1; k <= n; k++) s += '<i class="' + (k <= i ? 'd' : '') + '"></i>';
      return s + '</div>';
    };
    a.btn = function (label, act, o) {
      o = o || {};
      return '<button type="button" class="abtn ' + (o.cls || '') + '" data-act="' + act + '"' + (o.id != null ? ' data-id="' + esc(o.id) + '"' : '') + (o.x != null ? ' data-x="' + esc(o.x) + '"' : '') +
        (o.dis ? ' aria-disabled="true" data-tip="' + esc(o.dis) + '"' : '') + '>' + (o.icon ? ic(o.icon) : '') + label + '</button>';
    };

    a.render = function () {
      VN.lang = a.S.lang;
      document.documentElement.lang = a.S.lang ? 'en' : 'vi';
      var top = a.top(), sc = a.SC[top.n] ? a.SC[top.n](top.p, a) : { body: '<p style="padding:20px">' + top.n + '</p>' };
      if (a.S.net === 'off') sc = { hdr: sc.hdr, tabs: sc.tabs, body: '<div class="empty" style="padding-top:72px">' + ic('warning-circle') + '<b>' + L('Không có kết nối mạng', 'No internet connection') + '</b><p>' + L('Kiểm tra Wi-Fi hoặc 4G rồi thử lại. Thao tác chưa gửi vẫn được giữ trên máy.', 'Check Wi-Fi or mobile data, then retry. Unsent actions stay on this phone.') + '</p><button type="button" class="abtn sec2 sm" data-act="netRetry">' + ic('arrows-clockwise') + L('Thử lại', 'Retry') + '</button></div>' };
      else if (a.loading) sc = { hdr: sc.hdr, tabs: sc.tabs, body: skel() };
      var hadSheet = !!dev.querySelector('.sheet');
      var h = (sc.heroBg ? '<div class="hero-bg"></div>' : '') + '<div class="sbar' + (sc.light ? ' light' : '') + '"><span>' + VN.nowTime() + '</span><span class="r">5G <span class="batt"></span></span></div>';
      h += '<div class="view ' + a.dir + '">' + (sc.hdr || '') + '<div class="scr" data-scroll="' + top.n + '-' + a.S.stack.length + '-' + (top.p.id || '') + '">' + (sc.body || '') + '</div>' + (sc.foot ? '<div class="foot">' + sc.foot + '</div>' : '') + '</div>';
      if (sc.tabs !== false && cfg.tabs) {
        var tabs = cfg.tabs(a);
        if (tabs) h += '<nav class="tabbar" aria-label="' + L('Điều hướng chính', 'Main navigation') + '">' + tabs.map(function (t) {
          var on = a.S.tab === t[0];
          return '<button type="button" class="tab' + (on ? ' on' : '') + '" data-act="tab" data-id="' + t[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(on && t[3] ? t[3] : t[2]) + (t[4] ? '<span class="pip">' + t[4] + '</span>' : '') + L(t[1][0], t[1][1]) + '</button>';
        }).join('') + '</nav>';
      }
      if (a.S.sheet && cfg.sheets[a.S.sheet.n]) h += '<div class="a-scrim" data-act="sheetClose"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-title">' + cfg.sheets[a.S.sheet.n](a.S.sheet, a) + '</div>';
      h += '<div class="a-toasts" role="status" aria-live="polite"></div>';
      var keep = Array.prototype.slice.call(dev.querySelectorAll('.a-toast'));
      VN.patch(dev, h);
      var tb = dev.querySelector('.a-toasts'); keep.forEach(function (t) { tb.appendChild(t); });
      a.dir = '';
      var sh = dev.querySelector('.sheet');
      if (sh && !hadSheet) VN.focusFirst(sh);
      if (demo && cfg.demo) VN.patch(demo, cfg.demo(a));
      if (cfg.after) cfg.after(a);
    };

    function skel() {
      var h = '<div class="a-skel" role="status"><span class="sr-only">' + L('Đang tải', 'Loading') + '</span><i class="sk" style="width:55%;height:22px"></i><div class="a-skc"><i class="sk" style="width:40%"></i><i class="sk" style="width:72%;height:22px"></i><i class="sk" style="width:90%"></i></div>';
      for (var i = 0; i < 4; i++) h += '<div class="a-skr"><i class="sk av"></i><div><i class="sk" style="width:70%"></i><i class="sk" style="width:44%"></i></div></div>';
      return h + '</div>';
    }
    a.netCtl = function () {
      return '<div><h3>' + L('Mạng (mô phỏng)', 'Network (simulated)') + '</h3><div class="seg" role="group" aria-label="' + L('Mạng', 'Network') + '" style="margin-top:8px">' + [['ok', 'Bình thường', 'Normal'], ['slow', 'Chậm', 'Slow'], ['off', 'Mất kết nối', 'Offline']].map(function (n) { var on = (a.S.net || 'ok') === n[0]; return '<button type="button" class="' + (on ? 'on' : '') + '" data-act="net" data-id="' + n[0] + '" aria-pressed="' + on + '">' + L(n[1], n[2]) + '</button>'; }).join('') + '</div></div>';
    };

    /* Hành động chung */
    var ACT = a.ACT;
    ACT.back = function () { a.back(); };
    ACT.go = function (el) { a.push(el.dataset.id, el.dataset.x ? JSON.parse(el.dataset.x) : {}); };
    ACT.tab = function (el) { a.S.tab = el.dataset.id; a.root(cfg.tabRoot ? cfg.tabRoot(el.dataset.id, a) : el.dataset.id); };
    ACT.sheetClose = function () { a.closeSheet(); };
    ACT.lang = function (el) { a.S.lang = +el.dataset.id; a.render(); };
    ACT.net = function (el) { a.S.net = el.dataset.id; a.loading = false; a.load(); a.render(); };
    ACT.netRetry = function () { a.S.net = 'ok'; a.load(700); a.render(); setTimeout(function () { a.toast(L('Đã kết nối lại', 'Back online')); }, 720); };
    ACT.demoToggle = function () { demo.classList.toggle('open'); };
    ACT.reset = function () { var l = a.S.lang; a.S = cfg.state(); a.S.lang = l; a.render(); a.toast(L('Đã đặt lại dữ liệu mẫu', 'Sample data reset')); };
    a.IN.set = function (el, v) { var k = el.dataset.k, o = el.dataset.o ? a.S[el.dataset.o] : (a.S.sheet && el.closest('.sheet') ? a.S.sheet : a.S.form); o[k] = v; if (el.dataset.rr !== 'no') a.render(); };

    a.start = function () {
      VN.bind(dev, ACT, a.IN); if (demo) VN.bind(demo, ACT, a.IN);
      /* Không vẽ lại theo nhịp giây khi người dùng đang cuộn hoặc đang giữ ngón tay trên màn: tránh giật và mất quán tính cuộn */
      a.busyUntil = 0; a.pressed = false;
      var hold = function (ms) { a.busyUntil = Math.max(a.busyUntil, Date.now() + ms); };
      dev.addEventListener('wheel', function () { hold(1200); }, { passive: true });
      dev.addEventListener('touchmove', function () { hold(1200); }, { passive: true });
      dev.addEventListener('pointerdown', function () { a.pressed = true; });
      window.addEventListener('pointerup', function () { a.pressed = false; hold(1500); });
      window.addEventListener('pointercancel', function () { a.pressed = false; });
      document.addEventListener('keydown', function (e) {
        var sh = dev.querySelector('.sheet');
        if (e.key === 'Escape') {
          if (a.S.sheet) { a.closeSheet(); return; }
          if (demo && demo.classList.contains('open')) { demo.classList.remove('open'); return; }
          /* Không có lớp phủ: Esc lùi màn như nút lùi. Bỏ qua khi đang gõ; màn không có nút lùi (noBack) thì giữ nguyên */
          var t = e.target, typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
          var bb = !typing && dev.querySelector('.view .back-btn');
          if (bb) { e.preventDefault(); bb.click(); return; }
        }
        if (sh) VN.trap(e, sh);
      });
      var q = new URLSearchParams(location.search);
      if (q.get('lang') === 'en') a.S.lang = 1;
      if (cfg.boot) cfg.boot(a, q);
      a.render();
      if (cfg.tick) setInterval(function () { if (cfg.tick(a)) a.pending = true; if (!a.pending || a.pressed || Date.now() < a.busyUntil) return; var f = document.activeElement; if (!f || !/INPUT|TEXTAREA|SELECT/.test(f.tagName)) { a.pending = false; a.render(); } }, 1000);
      if (q.get('scenario') && cfg.scenario) cfg.scenario(a, q.get('scenario'));
    };
    return a;
  };
})(window);
