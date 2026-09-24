# Soát UX theo 30 luật · Vương Nhân prototype · 24/09/2026

Chấm theo `laws-of-ux-review`: mỗi luật 2 (đạt) · 1 (một phần) · 0 (vi phạm) · — (không áp dụng). Luật không áp dụng bị bỏ khỏi mẫu số. Cột "quy về 60" nhân tỉ lệ để so được các trang với nhau. Mọi điểm đều đọc từ mã thật, dòng code dẫn ở từng mục.

| Trang | Điểm | Quy về 60 | Hạng | Chưa đạt |
|---|---|---|---|---|
| `index.html` Trang giới thiệu | 39/40 (10 luật không áp dụng) | 58,5 | A | Miller |
| `admin.html` Trang quản trị | 55/58 (1 luật không áp dụng) | 56,9 | A | Miller · Postel · Parkinson |
| `customer.html` App Khách hàng | 58/60 | 58 | A | Working Memory · Parkinson |
| `provider.html` App Nhà cung cấp | 57/58 (1 luật không áp dụng) | 59 | A | Doherty |

Không có lỗi nghiêm trọng (điểm 0). Có 5 cảnh báo và 2 gợi ý, liệt kê dưới đây.

---

# UX Audit: Trang giới thiệu (`index.html`)

**Score: 39/40** (quy về 58,5/60) | **Grade: A**

## Critical Issues (0)

## Warnings (1)

### Miller's Law — Score: 1/2
**Problem:** Cột Trang quản trị liệt kê liền 13 kịch bản (01-13), không chia nhóm (`index.html:102-118`), trong khi bảng Demo bên trong Admin đã chia 3 nhóm Tài chính · Đơn hàng · Nhà cung cấp (`admin-shell.js:290`). 13 mục một mạch vượt ngưỡng 7±2. Các tính năng mới (CRUD danh mục, vai trò, hồ sơ) cũng chưa có lối vào từ trang này.
**Fix:**
```html
<!-- Before (index.html:102-101) -->
<div class="col"><h3>…Trang quản trị</h3>
  <a href="admin.html?scenario=1">…</a>

<!-- After: nhóm con giống bảng Demo, thêm lối vào tính năng mới -->
<div class="col"><h3>…Trang quản trị</h3>
  <div class="scn-g">Tài chính</div>
  <a href="admin.html?scenario=1">…</a> … <a href="admin.html?scenario=6">…</a>
  <div class="scn-g">Đơn hàng</div>
  <a href="admin.html?scenario=7">…</a> … <a href="admin.html?scenario=9">…</a>
  <div class="scn-g">Nhà cung cấp</div>
  <a href="admin.html?scenario=10">…</a> … <a href="admin.html?scenario=13">…</a>
  <div class="scn-g">Hệ thống</div>
  <a href="admin.html?role=sa&page=admins">Vai trò và quyền áp dụng ngay vào menu</a>
  <a href="admin.html?role=sa&page=catalog">Danh mục: thêm, xoá có kiểm ràng buộc</a>
</div>
```

## Suggestions (0)

## Compliant (19)
Aesthetic-Usability (`index.html:29-30`) · Prägnanz · Von Restorff (CTA trắng duy nhất trên nền cam, `index.html:26`, `:80`) · Similarity (3 thẻ app cùng cấu trúc, `:91-93`) · Proximity · Common Region (`:29`, `:45`) · Cognitive Load · Hick's (đầu trang 2 điều khiển, `:71`) · Chunking (các section có h2, `:96`, `:135`, `:159`) · Choice Overload · Fitts's (CTA 52 px, VI/EN 44 px trên điện thoại, `:26`, `:64`) · Serial Position · Working Memory (mỗi kịch bản là liên kết thẳng tới đúng màn) · Jakob's · Occam's · Pareto · Selective Attention · Mental Model · Paradox of the Active User (vào thẳng kịch bản, ghi chú để cuối)

## N/A (10)
Uniform Connectedness · Cognitive Bias · Doherty (trang tĩnh) · Flow · Goal-Gradient · Peak-End · Zeigarnik · Postel's (không có ô nhập) · Tesler's · Parkinson's

---

# UX Audit: Trang quản trị (`admin.html`)

**Score: 55/58** (quy về 56,9/60) | **Grade: A**

## Critical Issues (0)

## Warnings (2)

### Postel's Law — Score: 1/2
**Problem:** Tìm nhanh Ctrl K bỏ dấu và chữ đ khi so (`admin-shell.js:272-267`). Nhưng 5 ô tìm trong danh sách chỉ đổi chữ thường: không bỏ dấu, không cắt khoảng trắng thừa, không bỏ dấu cách trong số điện thoại. Gõ "tran thu ha" hoặc "0903418552" sẽ không ra đơn của Trần Thu Hà. Các chỗ: `admin-ops.js:21`, `admin-fin2.js:70`, `admin-users.js:35`, `admin-users.js:204`, `admin-config.js:351`.
**Fix:**
```js
// core.js: thêm một hàm chuẩn hoá dùng chung
VN.fold = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim(); };

// Before (admin-ops.js:21, 24)
var q = (A.ui('ordQ', '') || '').toLowerCase();
… (o.id + ' ' + o.cust + ' ' + o.phone).toLowerCase().indexOf(q) >= 0

// After: làm tương tự cho 4 ô tìm còn lại
var q = VN.fold(A.ui('ordQ', ''));
… VN.fold(o.id + ' ' + o.cust + ' ' + o.phone + ' ' + o.phone.replace(/\D/g, '')).indexOf(q) >= 0
```

### Miller's Law — Score: 1/2
**Problem:** Vai Super admin thấy cùng lúc 18 mục menu (`admin-shell.js:74`, vẽ ở `:187`). Các mục đã chia 7 nhóm có tiêu đề, nên đạt luật Hick. Nhưng 18 mục vẫn vượt 7±2, và không gập được nhóm ít dùng. Các vai khác thấy 3-12 mục.
**Fix:**
```js
// Before (admin-shell.js:192): tiêu đề nhóm là chữ tĩnh
h += '<div class="nav-g">' + (g[0] ? '<b>' + L(g[0][0], g[0][1]) + '</b>' : '');

// After: nhóm gập được, nhớ trạng thái; nhóm chứa trang hiện tại luôn mở
var k = 'nav-' + i, hasCur = items.some(function (it) { return it[0] === cur; }), shut = A.S.ui[k] && !hasCur;
h += '<div class="nav-g">' + (g[0] ? '<button type="button" class="nav-gh" data-act="navGroup" data-id="' + k + '" aria-expanded="' + !shut + '">' + L(g[0][0], g[0][1]) + ic(shut ? 'caret-right' : 'caret-down') + '</button>' : '');
if (shut) { h += '</div>'; return; }
// ACT.navGroup = function (el) { A.S.ui[el.dataset.id] = !A.S.ui[el.dataset.id]; A.render(); };
```

## Suggestions (1)

### Parkinson's Law — Score: 1/2
**Improve:** Có 15 ô nhập nhiều dòng, chỉ 2 ô có `maxlength` (`admin-config.js`, ô thông báo 160 ký tự). Ô "Ghi chú" trong mọi hộp thoại có lý do không giới hạn (`admin-shell.js:168`). Ghi chú vào Nhật ký nên ngắn và đúng trọng tâm.
**Code:**
```js
// admin-shell.js:173, trong A.reasonField
'<textarea id="f-note" class="txa" maxlength="300" data-in="mset" data-k="note">' + esc(m.note) + '</textarea>' +
'<span class="hint" style="text-align:right">' + (m.note || '').length + '/300</span>'
```

## Compliant (26)
Aesthetic-Usability · Prägnanz · Von Restorff (mỗi màn một nút cam, `admin-fin1.js:262`, `admin-fin2.js:492`) · Similarity (badge TONE thống nhất) · Proximity · Common Region · Uniform Connectedness (dòng chảy đơn 7 chặng, dòng thời gian đơn) · Cognitive Load (thao tác phụ gom vào "Thao tác khác", `admin-fin2.js:248`) · Hick's (menu chia nhóm; lọc theo vai trò, `admin-shell.js:61`) · Chunking · Choice Overload (vai trò mới sao chép quyền từ vai có sẵn, `admin-config.js:432`) · Fitts's (desktop dùng chuột; màn hẹp có vùng chạm 44 px, `admin.css:20`) · Doherty (khung chờ và lỗi tải, `admin-shell.js:105`, `:234`, `:238`) · Flow (chỉ việc không hoàn tác được mới cần hai bước) · Goal-Gradient (lô chi 3 bước, `admin-fin2.js:566`) · Serial Position · Peak-End (vùng rỗng có hướng dẫn và nút, như "Không còn hồ sơ chờ duyệt") · Zeigarnik (số đếm trên menu, việc cần xử lý) · Working Memory (breadcrumb; mã đơn và nhà cung cấp là liên kết; bảng trước → sau trong hộp thoại) · Jakob's (Ctrl K, `admin-shell.js:404`) · Tesler's · Occam's · Pareto (việc cần xử lý theo vai) · Selective Attention · Mental Model (xuất Excel 3 sheet, bảng sắp xếp được) · Paradox of the Active User (thao tác bị khoá luôn kèm lý do trong tooltip)

## N/A (1)
Cognitive Bias (công cụ nội bộ, không cần bằng chứng xã hội)

---

# UX Audit: App Khách hàng (`customer.html`)

**Score: 58/60** | **Grade: A**

## Critical Issues (0)

## Warnings (1)

### Working Memory — Score: 1/2
**Problem:** Bước 4 "Gửi tới ai?" (`customer.js:191-186`) chỉ hiện danh sách nhà cung cấp và giá ước tính. Dịch vụ, số máy, địa chỉ và khung giờ chọn ở bước 1-3 không được nhắc lại, nên khách phải tự nhớ trước khi bấm gửi.
**Fix:**
```js
// After: chèn ngay dưới tiêu đề của book4 (customer.js:193)
var ad = a.S.addrs.filter(function (x) { return x.id === b.addr; })[0];
h += '<div class="acard" style="margin:0 16px 12px"><div class="row"><div class="grow"><b>' + L(SVC[b.svc].vi, SVC[b.svc].en) + ' · ' + b.qty + L(' máy', ' units') + '</b>' +
  '<small class="sm-muted">' + esc(ad ? ad.line : '') + '</small>' +
  '<small class="sm-muted">' + b.slots.map(fmtSlot).join(' · ') + '</small></div>' +
  '<button type="button" class="link" data-act="bedit">' + L('Sửa', 'Edit') + '</button></div></div>';
// ACT.bedit = function () { a.backTo('book1'); };
```

## Suggestions (1)

### Parkinson's Law — Score: 1/2
**Improve:** Ô ghi chú khi đặt đã giới hạn 500 ký tự. Ô đánh giá (`customer.js:301`) và ô mô tả khiếu nại (`customer.js:309`) thì chưa có giới hạn hay bộ đếm.
**Code:**
```js
'<textarea id="rvt" class="txa" maxlength="500" data-in="rvtext" …>' + … + '</textarea><span class="hint">' + (o.rvText || '').length + '/500</span>'
```

## Compliant (28)
Aesthetic-Usability · Prägnanz · Von Restorff (nút cam 52 px ở chân màn, `app.css:72`) · Similarity · Proximity · Common Region · Uniform Connectedness (hành trình đơn có đường nối, `app.css:176`) · Cognitive Load (đặt dịch vụ chia 4 bước) · Hick's (4 tab, 6 ngành) · Miller's · Chunking · Choice Overload (chọn sẵn 3 nhà cung cấp, `customer.js:151`) · Cognitive Bias ("Đã làm cho 28 nhà ở P. Xuân Hòa", điểm đánh giá) · Fitts's (vùng chạm ≥ 44 px, `app.css:25`, `:67`) · Doherty (phản hồi trực tiếp khi chờ, vòng quay khi thanh toán, khung chờ) · Flow · Goal-Gradient ("Bước 1/4", `customer.js:156`) · Serial Position · Peak-End (biên nhận có bước tiếp; lỗi thanh toán có "Thanh toán lại") · Zeigarnik (chấm đỏ trên tab, "Cần bạn duyệt thêm 1 giờ") · Jakob's · Postel's (số điện thoại nhận dấu cách `customer.js:77`, OTP lọc chữ số `:371`, tìm kiếm bỏ dấu `:58`) · Tesler's · Occam's · Pareto · Selective Attention · Mental Model · Paradox of the Active User ("Xem dịch vụ trước, đăng nhập sau")

## N/A (0)

---

# UX Audit: App Nhà cung cấp (`provider.html`)

**Score: 57/58** (quy về 59/60) | **Grade: A**

## Critical Issues (0)

## Warnings (1)

### Doherty Threshold — Score: 1/2
**Problem:** Check-in GPS trả kết quả ngay lập tức (`provider.js:304`). Ngoài đời, lấy vị trí mất 1-5 giây. Nếu không có trạng thái "đang xác định vị trí", kỹ thuật viên dễ bấm lại nhiều lần hoặc tưởng app treo. Các thao tác khác đã có phản hồi: khung chờ, lỗi mạng, toast.
**Fix:**
```js
// Before (provider.js:304)
ACT.checkin = function (el) { var id = el.dataset.id; if (a.S.far) { … } a.S.jobs[id].step = 'arrived'; … };

// After: bấm là nút đổi ngay sang vòng quay "Đang xác định vị trí…", 0,9 giây sau mới có kết quả
ACT.checkin = function (el) {
  var id = el.dataset.id; if (a.S.locating) return;
  a.S.locating = id; a.render();
  setTimeout(function () { a.S.locating = null; /* nhánh far / arrived giữ nguyên */ }, 900);
};
// Nút check-in khi a.S.locating: ic('circle-notch', 'spin') + L('Đang xác định vị trí…', 'Locating…'), aria-busy="true"
```

## Suggestions (0)

## Compliant (28)
Aesthetic-Usability · Prägnanz · Von Restorff (Điều phối chỉ một thẻ cam, `provider.js:80`) · Similarity · Proximity · Common Region (số dư 3 lớp trong một thẻ, `provider.js:109`) · Uniform Connectedness (các bước của việc có đường nối, `provider.js:183`) · Cognitive Load · Hick's · Miller's · Chunking · Choice Overload (lý do từ chối chọn sẵn, `provider.js:246`) · Fitts's · Flow · Goal-Gradient (đăng ký 3 bước, `provider.js:237`) · Serial Position · Peak-End (việc xong nói rõ tiền đang ở ngăn nào) · Zeigarnik (sẵn sàng 2/5) · Working Memory (khối việc luôn hiện địa chỉ, khách, giờ) · Jakob's · Postel's (giá qua `parseMoney`, `provider.js:249`; số điện thoại lọc chữ số) · Tesler's (gợi ý sẵn người đang rảnh, `provider.js:46`) · Occam's · Pareto · Selective Attention · Mental Model · Paradox of the Active User · Parkinson's (đếm ngược thời gian phản hồi yêu cầu, `provider.js:52`)

## N/A (1)
Cognitive Bias

---

## Action Plan (do in this order)

1. **Postel, Admin:** thêm `VN.fold` và dùng cho 5 ô tìm trong danh sách → `core.js`, `admin-ops.js:21`, `admin-fin2.js:70`, `admin-users.js:35`, `admin-users.js:204`, `admin-config.js:351`
2. **Doherty, App Nhà cung cấp:** thêm trạng thái "Đang xác định vị trí…" khi check-in → `provider.js:304`
3. **Working Memory, App Khách hàng:** thêm thẻ tóm tắt ở bước 4, có nút Sửa → `customer.js:193`
4. **Miller, Admin:** cho gập nhóm menu, nhóm chứa trang hiện tại luôn mở → `admin-shell.js:192`
5. **Miller, Trang giới thiệu:** chia 13 kịch bản Admin thành 3 nhóm; thêm nhóm Hệ thống trỏ tới vai trò, danh mục → `index.html:102-118`
6. **Parkinson, Admin:** giới hạn ghi chú lý do 300 ký tự, có bộ đếm → `admin-shell.js:173`
7. **Parkinson, App Khách hàng:** giới hạn ô đánh giá và ô khiếu nại 500 ký tự, có bộ đếm → `customer.js:301`, `customer.js:309`

Làm xong 7 việc trên, cả 4 trang lên 60/60 theo cách chấm này.

---

## Sau khi sửa (24/09/2026)

Người dùng chọn "Sửa 7 việc trong action plan". Cả 7 việc có bước kiểm riêng trong `_qa/steps-review-*.json` (20 bước, 0 lỗi); ảnh chụp ở `_qa/review/`.

| # | Luật · trang | Đã sửa | Bằng chứng | Kiểm được |
|---|---|---|---|---|
| 1 | Postel · Admin | `VN.fold` dùng chung cho 5 ô tìm: bỏ dấu, đ thành d, gộp khoảng trắng, so cả số điện thoại liền số | `core.js:55`, `admin-ops.js:21`, `admin-fin2.js:70`, `admin-users.js:35`, `admin-users.js:204`, `admin-config.js:351` | "  tran thu ha " ra VN-240931; "dien lanh phuc an" ra Điện lạnh Phúc An; "0938552017" ra Lê Minh Anh |
| 2 | Doherty · App Nhà cung cấp | Check-in hiện "Đang xác định vị trí…" 0,9 giây, chặn bấm lặp, rồi mới có kết quả | `provider.js:304`, `provider.js:211` | Chân màn hiện vòng quay, sau đó chuyển sang "arrived" |
| 3 | Working Memory · App Khách hàng | Bước 4 có thẻ tóm tắt dịch vụ, số máy, địa chỉ, khung giờ, kèm nút Sửa quay về bước 1 | `customer.js:183`, `customer.js:442` | Thẻ hiện "Vệ sinh máy lạnh · 2 máy · 128 Nguyễn Đình Chiểu… · 24/09 13:00-15:00…"; bấm Sửa về book1 |
| 4 | Miller · Admin | Nhóm menu gập được, trạng thái được nhớ. Vai nào thấy hơn 12 mục thì mặc định chỉ mở nhóm đầu và nhóm chứa màn hiện tại. Nhóm đang gập vẫn hiện tổng số việc, màu đỏ nếu có khiếu nại hay đơn cần chú ý | `admin-shell.js:192`, `admin-shell.js:352`, `admin.css:30` | Super admin mặc định thấy 2 mục và 6 nhóm (Vận hành 9, Người dùng 3, Tài chính 8); Kế toán vẫn mở đủ 7 mục |
| 5 | Miller · Trang giới thiệu | 13 kịch bản Admin chia 3 nhóm; thêm nhóm Hệ thống với kịch bản 14-16 (vai trò, danh mục, hồ sơ), cũng có trong bảng Demo | `index.html:103`, `index.html:120`, `admin-shell.js:308` | Kịch bản 14 mở Quản trị viên › Vai trò; kịch bản 16 mở Hồ sơ của tôi |
| 6 | Parkinson · Admin | Ghi chú lý do giới hạn 300 ký tự, có bộ đếm; các ô nhiều dòng khác giới hạn 500, riêng ô lựa chọn thuộc tính 600 | `admin-shell.js:173` | Bộ đếm hiện 30/300 |
| 7 | Parkinson · App Khách hàng | Ô đánh giá và ô khiếu nại giới hạn 500 ký tự, bộ đếm cập nhật khi gõ mà không vẽ lại màn | `customer.js:301`, `customer.js:309`, `customer.js:441` | Bộ đếm hiện 16/500 và 28/500 |

**Điểm sau khi sửa** (chấm lại 7 luật trên, các luật khác giữ nguyên):

| Trang | Trước | Sau | Quy về 60 |
|---|---|---|---|
| `index.html` | 39/40 | 40/40 | 60 |
| `admin.html` | 55/58 | 58/58 | 60 |
| `customer.html` | 58/60 | 60/60 | 60 |
| `provider.html` | 57/58 | 58/58 | 60 |

Lưu ý khi đọc điểm: 60/60 nghĩa là mọi luật áp dụng được đều đạt theo bằng chứng trong mã. Điểm này không thay cho thử nghiệm với người dùng thật (kế toán, CSKH, kỹ thuật viên).
