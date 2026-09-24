# Nhật ký phát triển tính năng — Vương Nhân · Prototype MVP

> Mỗi lần thêm hoặc sửa một tính năng bằng skill `evolve-site`, ghi lại một khối tương ứng.
> **Đáp án của người dùng ghi nguyên văn**. Các quyết định trước đó (5 cổng của `sketch-to-site`, lặp lại sau nghiệm thu) nằm ở `DECISIONS.md`.
> Cấp 0, và Cấp 1 không cờ: một dòng ở bảng *Nhật ký thay đổi nhỏ*. Cấp 1 có cờ, Cấp 2, Cấp 3: một khối đầy đủ.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 24/09/2026 | Cấp 1 · cờ: không · vì sửa 4 thành phần có sẵn trong 3 màn của App Khách hàng; không đổi dữ liệu, quyền hay quy tắc; làm prototype khớp lại estimation | `customer.js` (dòng 12, 103-104, 248-249, 261, 302-307) · `index.html` (alt ảnh) · `assets/shots/customer.jpg` · `DESIGN.md` · `_qa/steps-rating-cust.json` (mới) | Đợt 2, xem khối bên dưới | #8 "Nhà cung cấp nổi bật" · #12 hồ sơ Nhà cung cấp có đánh giá · #32 đánh giá đa tiêu chí · #69 đánh giá của đơn vị · #51 điểm từng kỹ thuật viên là chỉ số nội bộ | `0` lỗi mới | "Nghiệm thu đợt chuyển đánh giá sang nhà cung cấp thế nào?" → "Chốt tích hợp (Khuyến nghị)" · "Có sửa luôn các lỗi có sẵn tìm thấy trong đợt này không?" → "Đồng bộ điểm Sạch Xanh Home, Nâng nút sao lên 44 px" |

### Đợt 2: Đánh giá thuộc về nhà cung cấp (App Khách hàng)

**Yêu cầu (nguyên văn), kèm ảnh chụp trang chủ App Khách hàng ở khối "Thợ được tin chọn ở phường bạn":**
> Hiện tại ở app Khách hàng đang là chức năng đánh giá Kỹ thuật viên -> chức năng này nên là đánh giá dịch vụ của nhà cung cấp.
> Phần `Thợ được tin chọn ở phường bạn` đang hiển thị có thể làm người dùng hiểu là thợ 5\*, 4.9\* ... chứ không phải là nhà cung cấp.
> Bạn thấy chỗ này như nào? Có cần chỉnh sửa không?
> Nếu chỉnh sửa thì dùng skill /evolve-site chỉnh sửa tính năng này.

**Hiện trạng đo được (mốc `_qa/truoc/dot2/`, bộ `steps-rating-cust` báo 13/14 FAIL trên bản cũ):**
- Trang chủ: thẻ lấy tên và ảnh kỹ thuật viên làm tiêu đề, đặt điểm của nhà cung cấp (4,9) ngay cạnh tên người. Estimation #8 ghi "Nhà cung cấp nổi bật".
- Màn đánh giá: tiêu đề "Đánh giá", dòng phụ "Lê Văn Tài · Điện lạnh Phúc An" (tên người đứng trước).
- Chi tiết đơn: dưới tên kỹ thuật viên là "Điện lạnh Phúc An · sao 4,9"; ở khổ 390 dòng này bị cắt (161 > 130 px).
- Nút ở đơn đang bảo hành chỉ ghi "Đánh giá".
- Trang quản trị (hàng chờ kiểm duyệt ghi đánh giá "về Điện lạnh Phúc An") và App Nhà cung cấp (#69 điểm đơn vị, #51 điểm từng kỹ thuật viên) đã đúng mô hình, không sửa.

**Cổng:** Cổng 1 và 2 không đi (Cấp 1, không cờ). Cổng 3: xem bảng trên.

**Đã làm:**
- Trang chủ: khối đổi tên "Nhà cung cấp tin cậy ở phường bạn" (EN giữ "Providers your neighbours trust"). Thẻ lấy tên đơn vị làm tiêu đề, ảnh là "đội đang làm việc", dòng phụ "5 năm hoạt động · 1.284 việc", điểm "4,9 (312)" có nhãn đọc màn hình. Tên câu được đo trong trình duyệt để vừa một dòng (294/330 px).
- Màn đánh giá: tiêu đề "Đánh giá dịch vụ"; dòng phụ "Vệ sinh máy lạnh · Điện lạnh Phúc An"; câu nhắc "Đánh giá hiển thị trên hồ sơ Điện lạnh Phúc An sau khi được kiểm duyệt." Bốn tiêu chí giữ nguyên vì "Thái độ phục vụ" xuống dòng ở khổ 1440.
- Chi tiết đơn: thêm dòng tên đơn vị có icon cửa hàng dưới tên dịch vụ (cùng mẫu thẻ ở Đơn của tôi); dòng kỹ thuật viên chỉ còn tên và vai "Kỹ thuật viên", không còn sao. Đơn đã huỷ cũng thấy tên đơn vị.
- Nút ở đơn đang bảo hành: "Đánh giá dịch vụ".
- `index.html`: alt ảnh App Khách hàng; chụp lại `assets/shots/customer.jpg`.

**Cổng 3 (nguyên văn):**
- "Nghiệm thu đợt chuyển đánh giá sang nhà cung cấp thế nào?" → "Chốt tích hợp (Khuyến nghị)"
- "Có sửa luôn các lỗi có sẵn tìm thấy trong đợt này không?" → "Đồng bộ điểm Sạch Xanh Home, Nâng nút sao lên 44 px"

**Sửa lỗi có sẵn theo lựa chọn ở Cổng 3:**

| Lỗi | Đã làm | Bằng chứng |
|---|---|---|
| Sạch Xanh Home 4,9 trên App Khách hàng, 4,8 trên Trang quản trị | App Khách hàng lấy 4,8 theo `data.js`. Số đánh giá 188 vốn đã khớp | `customer.js:12` · bước `rating-matches-shared-data` (điểm mong đợi đọc từ `data.js` lúc sinh bước) |
| Nút sao ở màn đánh giá 34 × 40 px, dưới 44 px | Nút 44 × 44 px. Nhãn tiêu chí chuyển lên trên hàng sao: đo trong trình duyệt, nếu giữ cùng hàng thì nhãn chỉ còn 54-84 px mà "Chất lượng" cần 86 px, "Punctuality" cần 89 px. Hàng 5 sao rộng 236 px, vừa cả máy 360 px | `customer.js:305` · bước `star-targets-44-vi`, `star-targets-44-en`, `star-rate-click` |

---

## Đợt 1: Khoá huỷ/đổi lịch khi đang làm · Nhà cung cấp xem giấy tờ — Ngày: 24/09/2026

**Yêu cầu (nguyên văn):**
> dùng skill /evolve-site để update những điểm sau:
> - không cho hủy đơn đổi lịch khi việc đang được thực hiện
> - nên cho nhà cung cấp xem giấy tờ

Kèm 2 ảnh chụp: màn Chi tiết đơn VN-240938 (App Khách hàng, đang làm việc, chân màn có Đổi lịch và Huỷ đơn) và khối Giấy tờ ở màn Hồ sơ đơn vị (App Nhà cung cấp, khoanh đỏ).

### Bối cảnh & Mục tiêu
| | Tính năng 1 · Khoá huỷ và đổi lịch | Tính năng 2 · Xem giấy tờ |
|---|---|---|
| **Phạm vi tác động** | Cấp 1 (Cục bộ): chân màn Chi tiết đơn | Cấp 2 (Lớp phủ) hoặc Cấp 3 (màn mới), chốt ở Cổng 2 |
| **Màn hình liên quan** | `site/customer.html` · `customer.js` `SC.order`, `SH.cancel`, `SH.resched` | `site/provider.html` · `provider.js` `SC.profile`, `SC.notifs` |
| **Nguồn yêu cầu** | Estimation #27 "Khách huỷ đơn kèm lý do, đổi lịch hẹn theo quy tắc; hiển thị hệ quả trước khi xác nhận". Yêu cầu này đặt thêm một quy tắc, không trái #27. Lối thay thế đã có: #82 (quản trị viên huỷ, đổi lịch) và #63 (nhà cung cấp dừng giữa chừng, chốt theo khối lượng đã làm) | Estimation #39 "Tải lên giấy phép kinh doanh, chứng chỉ nghề, bảo hiểm; khai báo ngày hết hạn từng loại; nhắc gia hạn". Xem lại giấy tờ đã nộp là phần tự nhiên của #39. Trang quản trị đã có nút [Xem] cho cùng giấy tờ (`provider-management.md` dòng 37-40) |
| **Hiện trạng đo được** | Đổi lịch đã có `aria-disabled` khi đang làm (`customer.js:260`) nhưng nhìn như nút thường, vì `.abtn.sec2` (`app.css:76`) đè nền của `.abtn[aria-disabled]` (`app.css:75`). Huỷ đơn vẫn mở sheet huỷ, kèm câu "bạn thanh toán phần đã làm theo bảng chốt" | 4 dòng giấy tờ là `div`, không bấm được; chỉ dòng hết hạn có nút cam "Tải bản mới". Thông báo "Chứng chỉ an toàn môi chất lạnh đã hết hạn" cũng không bấm được (`provider.js:175`) |

**Mốc trước khi sửa:** `_qa/truoc/`
- preflight: 4 file, 0 lỗi, 0 cảnh báo (`_qa/truoc/preflight.txt`). Bản preflight của dự án chưa có `--save`/`--compare`, nên so mốc bằng cách đối chiếu 2 bản chữ.
- 13 bộ kiểm của 2 app, 223 bước, 0 lỗi console, 0 tràn ngang: `cust` 38 · `prov` 32 · `scan-cust` 69 · `scan-prov` 43 · `net-cust` 7 · `net-prov` 5 · `review-cust` 5 · `review-prov` 3 · `scroll-prov` 5 · `resp-customer-1440/390` 4+4 · `resp-provider-1440/390` 4+4.
- Ảnh các màn sẽ đụng, khổ 1440 và 390: `_qa/truoc/shots-1440/`, `_qa/truoc/shots-390/` (chi tiết đơn VN-240938, VN-240931, sheet huỷ đang mở, hồ sơ đơn vị, thông báo).
- Lỗi có sẵn liên quan: kiểu khoá của nút phụ `.abtn.sec2` bị đè (xem trên). Đưa lên Cổng 2 vì tính năng 1 cần nó.

---

### 🛑 Cổng 1 · Vị trí & Lối vào
| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Tính năng 1 · Lối thoát khi khách cần dừng việc | Gọi tổng đài hỗ trợ (Khuyến nghị) · Nhắn thợ để dừng giữa chừng · Chỉ khoá, không chỉ thêm lối | "Gọi tổng đài hỗ trợ (Khuyến nghị)" |
| Tính năng 2 · Lối vào chính | Chạm cả dòng (Khuyến nghị) · Nút Xem trên từng dòng | "Chạm cả dòng (Khuyến nghị)" |
| Tính năng 2 · Lối vào nhanh | Chạm thông báo mở thẳng giấy tờ (Khuyến nghị) · Không cần lối nhanh | "Chạm thông báo mở thẳng giấy tờ (Khuyến nghị)" |

**Hệ quả:** hai nút ở chân màn khoá khi đang làm, dưới nút có dòng lý do và liên kết Gọi tổng đài (CSKH huỷ hộ ở Trang quản trị, như kịch bản 7). Mỗi dòng giấy tờ thành một nút có mũi tên; nút "Tải bản mới" chuyển vào chỗ xem giấy tờ. Thông báo hết hạn mở thẳng giấy tờ đó.

**Suy ra, không hỏi (có căn cứ):**
- Khoá áp cho trạng thái **Đang làm việc** (`progress`), đúng chữ "khi việc đang được thực hiện" và badge "Đang thực hiện" trong ảnh. Khi thợ đang di chuyển (`moving`) hay đã phân công (`assigned`), khách vẫn huỷ và đổi lịch được như cũ.
- Màn Hồ sơ đơn vị hiện chỉ có trong tab Tài khoản của **chủ đơn vị** (`provider.js:142`); kỹ thuật viên không thấy. Xem giấy tờ giữ nguyên phạm vi đó. Chứng chỉ riêng của kỹ thuật viên (#49) là việc khác, không làm ở đợt này.

---

### 🛑 Cổng 2 · Phương án hiển thị
**Tính năng 2 · chỗ xem giấy tờ**
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| A | Màn mới "Chi tiết giấy tờ" (đẩy màn, có nút lùi) | Bản chụp A4 dọc đủ cao để đọc; chạm thông báo mở màn là quy ước quen (Jakob); nút Tải bản mới ở chân màn, trong tầm ngón cái (Fitts). Nhược: rời danh sách, phải lùi để xem giấy tờ khác | ✅ |
| B | Bottom sheet, giống sheet sửa giá | Vẫn thấy danh sách phía sau; đóng bằng X, nền mờ, Esc. Nhược: bản chụp phải nhỏ (4:3); mở từ thông báo thì sheet nổi trên màn Thông báo | |

**Đáp án (nguyên văn):** "Màn mới Chi tiết giấy tờ (Khuyến nghị)"

**Tính năng 1 · chân màn:** đã chốt ở Cổng 1 (khoá 2 nút, dòng lý do, liên kết Gọi tổng đài). Dựng bằng mẫu `note-line` có sẵn (`customer.js:173`, `provider.js:75`) và nút `.abtn.ghost`.

**Token / component mới:** một dòng CSS, không thêm màu: `.abtn.sec2[aria-disabled="true"]{opacity:.45;cursor:not-allowed}`, theo quy ước khoá đã có của `.chip` (`app.css:105`) và `.btn` (`tokens.css:81`). Câu hỏi: "Nút phụ bị khoá hiện trông y như nút bấm được (lỗi có sẵn ở app.css:76). Có thêm kiểu khoá cho nó không?"
**Người dùng duyệt (nguyên văn):** "Thêm 1 dòng CSS, không thêm màu (Khuyến nghị)"

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp
**Các file đã sửa / tạo mới:**
- `site/assets/customer.js`:
  - `lockWhy` (dòng 59); chân màn khi Đang làm việc (dòng 262);
  - câu trong sheet huỷ; câu hỏi thường gặp (dòng 353);
  - `callSupport` và chốt chặn `locked` (dòng 422-432).
- `site/assets/app.css`: 1 dòng kiểu khoá nút phụ (dòng 78), đã duyệt ở Cổng 2.
- `site/assets/provider.js`:
  - thêm trường vào `docs` (ngày nộp, ngày duyệt, ngành áp dụng) và cờ `uploading`;
  - hàm phụ `daysTo`, `docBadge`, `expNote` và màn mới `SC.doc` (dòng 148-187);
  - khối Giấy tờ (dòng 191-192); thông báo (dòng 217); `docUp` (dòng 331).
- `site/index.html`: chữ bảng đối chiếu #22-36 và #38-51.
- `DESIGN.md`: §5, §10.3, §10.4, Lịch sử. `DECISIONS.md`: bảng "Lặp lại sau nghiệm thu". `_qa/QA.md`: §3 (dòng chỉ bộ mới), §11.
- QA: tạo mới `_qa/steps-lock-cust.json`, `_qa/steps-docs-prov.json`, `_qa/break_test.py`; nối thêm 12 bước vào `_qa/steps-scan-prov.json`; thêm các bước tương ứng vào `_qa/gen_textscan.py`.

**Kết quả tự kiểm hồi quy:**
- So với mốc: **0 lỗi mới**. 13 bộ cũ từ 223 → 235 bước; 0 bước cũ bị mất, 0 giá trị `check` cũ bị đổi.
- Lỗi console: 0 · tràn ngang: 0 · lỗi chữ: 0 · preflight: 0 lỗi, 0 cảnh báo.
- Responsive: 390, 768, 1440 cho 2 app; 390, 768, 1440 cho `index.html`. Đạt.
- Thoát:
  - Sheet huỷ và đổi lịch giữ nguyên nút X, nền mờ, Esc.
  - Màn Chi tiết giấy tờ có nút lùi, cùng quy ước với mọi màn đẩy trong app. Esc chưa lùi màn (`app-core.js:112`).
- 5 trạng thái của màn Chi tiết giấy tờ: bình thường · hover/focus · đang tải lên và khung chờ khi mạng chậm · rỗng (không tìm thấy) · lỗi (mất mạng; vai không được xem). Đủ.
- UX 12 điểm: chân màn Chi tiết đơn 12/12 · màn Chi tiết giấy tờ và danh sách 12/12.
- Phân quyền hai chiều:
  - Kỹ thuật viên: không có lối vào; mở thẳng màn thì bị chặn; gọi thẳng `docUp` không đổi dữ liệu.
  - Chủ đơn vị: vào được từ cả 2 lối đã chốt.
  - Khách: huỷ và đổi lịch bị chặn ở cả giao diện lẫn hàm.
- Bộ kiểm mới: `steps-lock-cust` 12 bước và `steps-docs-prov` 18 bước, mỗi bộ chạy ở 390 và 1440, đều PASS. Bẻ thử 5/5 chỗ: bộ khách báo 6 FAIL, bộ nhà cung cấp báo 2 FAIL.
- Lỗi có sẵn không đụng (chi tiết ở `_qa/QA.md` §11): `.abtn.dz` bị khoá vẫn trông như bấm được · `gen_textscan.py` lệch với file bước · Esc không lùi màn · preflight thiếu so mốc.

**Quyết định nghiệm thu (nguyên văn):**
- "Nghiệm thu đợt này thế nào?" → "Chốt tích hợp (Khuyến nghị)"
- "Có sửa luôn các lỗi có sẵn tìm thấy trong đợt này không?" → "Nút đỏ bị khoá trông như bấm được, Đồng bộ gen_textscan.py, Esc lùi màn trong 2 app"

### Sửa lỗi có sẵn theo lựa chọn ở Cổng 3 (24/09/2026)
| Lỗi | Đã làm | Bằng chứng |
|---|---|---|
| Nút đỏ bị khoá trông như bấm được | Thêm `.abtn.dz[aria-disabled="true"]{opacity:.45;cursor:not-allowed}`, cùng quy ước với nút phụ. Có tác dụng ở 3 chỗ: Xác nhận huỷ và Xoá tài khoản (app khách), Từ chối yêu cầu (app nhà cung cấp) | `app.css:81` · bước `dz-disabled-faded`, `dz-decline-faded` |
| Esc chỉ đóng sheet | Esc đóng sheet trước, rồi đóng bảng Demo, sau đó mới lùi màn bằng chính nút lùi của màn. Không lùi khi đang gõ trong ô nhập, và không lùi ở màn không có nút lùi (đang chờ phản hồi, không ai nhận, thanh toán lỗi, biên nhận) | `app-core.js:112-119` · bước `esc-*` ở cả 2 bộ |
| `gen_textscan.py` lệch với file bước | Đưa 23 bước quét lớp phủ của admin và 2 bước tóm tắt đặt dịch vụ vào bộ sinh. Chạy lại bộ sinh cho ra `steps-scan-admin.json`, `steps-scan-cust.json` giống từng byte bản cũ; `steps-scan-prov.json` giữ đủ 54 bước | `gen_textscan.py:17-35`, `gen_textscan.py:44-46` |

Bẻ thử sau khi sửa: 7/7 chỗ; bộ khách báo 8 FAIL, bộ nhà cung cấp báo 4 FAIL, trong đó có các bước Esc và nút đỏ.
