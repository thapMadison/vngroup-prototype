# Tự kiểm B7 · Vương Nhân prototype · 24/09/2026 (chạy lại sau lượt sửa ở Cổng 5 và sau soát UX 30 luật)

Chạy lại được: mọi bộ bước nằm trong `_qa/steps-*.json`, chạy bằng
`node --experimental-websocket _qa/run.mjs site/<trang>.html _qa/steps-<bộ>.json <thư-mục-ảnh> <rộng> <cao> [mobile]` (Edge headless qua CDP).

## 1. Kiểm cơ giới

| Kiểm | Kết quả |
|---|---|
| `preflight.py site --kind app` | 4 file · **0 lỗi · 0 cảnh báo** |
| Quét chữ hiển thị thật trong DOM (gạch dài, ★ ✓, viết tắt NCC/KTV/TK, emoji, tràn ngang), cả VI và EN | 206 màn/trạng thái (admin 96 · khách 68 · nhà cung cấp 42) · **0 lỗi** |
| Quét khối bị cắt trong trang quản trị (khối con của vùng cuộn bị co, không cuộn được) | 38 trạng thái trang · **0 khối bị cắt** |

## 2. Hiển thị 3 khổ

Ảnh ở `_qa/resp/<trang>-<khổ>-<màn>.jpg` (47 ảnh). Phép kiểm: trang không tràn ngang, không phần tử nào lọt khỏi khung nhìn, không vùng nào trong khung điện thoại tràn, 0 lỗi console (kể cả lúc tải trang).

| Trang | 1440 | 768 | 390 | Màn đã chụp |
|---|---|---|---|---|
| `index.html` | ✅ | ✅ | ✅ | đầu trang, 3 app, kịch bản, bảng đối chiếu |
| `admin.html` | ✅ | ✅ màn thông báo | ✅ màn thông báo | tổng quan, đơn hàng, chi tiết đơn, rút tiền |
| `customer.html` | ✅ | ✅ | ✅ toàn màn | trang chủ, chi tiết đơn, đặt bước 2, đơn của tôi |
| `provider.html` | ✅ | ✅ | ✅ toàn màn | yêu cầu, tài chính, việc của kỹ thuật viên |

Trang quản trị thiết kế cho 1440 × 900, chạy từ 1280 (DESIGN.md §6). Dưới 1024 px trang hiện thông báo "Trang quản trị dùng trên máy tính" kèm nút **Vẫn xem, cuộn ngang** và liên kết sang 2 app di động (`admin-shell.js:261`). Chỉ khi người xem bấm nút đó, trang mới rộng 1280 px và cuộn ngang.

## 3. Hồi quy theo kịch bản

| Bộ | Số bước | Lỗi console |
|---|---|---|
| Admin, 13 kịch bản (`steps-admin-scn`) | 50 | 0 |
| Admin, đủ 18 trang (`steps-admin-pages`) | 25 | 0 |
| App Khách hàng (`steps-cust`) | 38 | 0 |
| App Nhà cung cấp (`steps-prov`) | 32 | 0 |
| Mạng chậm, mất kết nối, thử lại, đang thanh toán (`steps-net-*`) | 18 | 0 |
| CRUD danh mục, tài khoản, vai trò, hồ sơ (`steps-crud-admin`) | 38 | 0 |
| Sửa theo soát UX 30 luật (`steps-review-*`) | 20 | 0 |
| Quét chữ | 211 | 0 |
| Quét khối bị cắt | 40 | 0 |
| 3 khổ màn hình | 56 | 0 |
| **Tổng** | **528** | **0** |

Bộ thêm sau bảng này, cũng phải chạy lại sau mỗi thay đổi: `steps-scroll-prov`, `steps-scroll-admin` (§10) · `steps-lock-cust` (khổ 390 và 1440), `steps-docs-prov` (khổ 390 và 1440) (§11). `steps-scan-prov` nay có 54 bước (thêm 12 bước giấy tờ).

Số tiền được kiểm tự động và cộng khớp:
- Kịch bản 1, duyệt rồi tạo lô chi: đã chi 782.450.000 ₫; còn phải trả 240.110.000 ₫.
- Kịch bản 3, sau khi hoàn 900.000 ₫: GMV 1.231.100.000 ₫; tạm tính 34.365.000 ₫; cầu nối tiền ✓ Khớp.
- Kịch bản 4, điều chỉnh đối soát 80.000 ₫: đã chi 782.370.000 ₫; còn phải trả 239.443.000 ₫.

## 4. UX 12 điểm (`laws-of-ux-checklist`)

Điểm không áp dụng tính ✅ theo luật của checklist. Vùng chạm 44 px chỉ xét trên di động.

### `index.html`: 12/12
| # | Điểm | | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Nút trắng 52 px duy nhất trên nền cam `index.html:26`, `index.html:82` |
| 2 | ≤ 7 lựa chọn | ✅ | Đầu trang chỉ có logo + VI/EN `index.html:73`; 3 thẻ app `index.html:92` |
| 3 | Gần nhau thì liên quan | ✅ | Mỗi thẻ gom ảnh, tên, mô tả, liên kết `index.html:93` |
| 4 | Phản hồi ≤ 400 ms | ✅ | Trang tĩnh; đổi ngôn ngữ tức thì `index.html:201` |
| 5 | Theo quy ước | ✅ | Logo trái, ngôn ngữ phải `index.html:73` |
| 6 | Hover/focus | ✅ | `index.html:27`, `index.html:30`, `index.html:49`, `tokens.css:58` |
| 7 | Tiến độ nhiều bước | ✅ | Không áp dụng |
| 8 | Vùng chạm ≥ 44 px | ✅ | CTA 52 px `index.html:26`; VI/EN 44 px trên điện thoại `index.html:66` |
| 9 | Trạng thái rỗng | ✅ | Không áp dụng (nội dung tĩnh) |
| 10 | Chia cụm | ✅ | Kịch bản chia 3 cột theo app `index.html:101`; bảng đối chiếu có dòng nhóm `index.html:57` |
| 11 | Thứ bậc | ✅ | h1 44 px > h2 26 px > h3 16 px `index.html:22`, `index.html:42`, `index.html:46` |
| 12 | Giấu phức tạp | ✅ | 3 lối vào trước, chi tiết đối chiếu và ghi chú để cuối trang |

### `admin.html`: 12/12
| # | Điểm | | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Một nút cam mỗi màn: Xuất Excel `admin-fin1.js:262`, Tạo lô chi `admin-fin2.js:492`; thao tác nguy hiểm là chữ đỏ |
| 2 | ≤ 7 lựa chọn | ✅ | Menu chia 7 nhóm có tiêu đề, mỗi nhóm ≤ 4 mục `admin-shell.js:74`; lọc theo vai trò `admin-shell.js:61` (Lãnh đạo 3 mục, CSKH 12 mục). Riêng Super admin thấy 18 mục cùng lúc: xem ghi chú ở §6 |
| 3 | Gần nhau thì liên quan | ✅ | Chi tiết đơn 3 cột: thông tin, ảnh, can thiệp `admin-ops.js:144` |
| 4 | Phản hồi ≤ 400 ms | ✅ | Thao tác cập nhật ngay kèm toast; có khung chờ `admin-shell.js:105`, `admin-shell.js:245`; có lỗi tải `admin-shell.js:241` |
| 5 | Theo quy ước | ✅ | Menu trái, thanh trên, Ctrl K `admin-shell.js:404`, bảng sắp xếp được `admin-shell.js:154` |
| 6 | Hover/focus | ✅ | `tokens.css:58`, `tokens.css:66`, `admin.css:41` |
| 7 | Tiến độ nhiều bước | ✅ | Lô chi 3 bước `admin-fin2.js:566`; duyệt hai bước cho hoàn tiền ≥ 500.000 ₫; vô hiệu hoá tài khoản hai bước `admin-config.js:376` |
| 8 | Vùng chạm ≥ 44 px | ✅ | Desktop dùng chuột; trên di động chỉ hiện màn thông báo, nút và liên kết 44 px `admin.css:20`, `tokens.css:269` |
| 9 | Trạng thái rỗng | ✅ | Hơn 30 chỗ dùng `A.empty` kèm hướng dẫn, ví dụ `admin-ops.js:41` |
| 10 | Chia cụm | ✅ | Nhóm menu có tiêu đề `admin.css:30`; thẻ KPI `admin.css:102`; ma trận quyền chia theo nhóm menu `admin-config.js:432` |
| 11 | Thứ bậc | ✅ | Tiêu đề trang, KPI, bảng `admin.css:75` |
| 12 | Giấu phức tạp | ✅ | Hoàn, giữ, điều chỉnh nằm trong "Thao tác khác" `admin-fin2.js:248`; kỳ mặc định "Tháng này" `admin-fin1.js:10`; vai trò mới mặc định thấy Tổng quan, có thể sao chép quyền từ vai có sẵn `admin-config.js:432` |

### `customer.html`: 12/12
| # | Điểm | | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Nút 52 px rộng hết màn ở chân màn `app.css:72`, ví dụ `customer.js:283` |
| 2 | ≤ 7 lựa chọn | ✅ | 4 tab `customer.js:482`; 6 ngành dịch vụ |
| 3 | Gần nhau thì liên quan | ✅ | Thẻ đơn gom trạng thái, tên, kỹ thuật viên, hành trình `customer.js:243` |
| 4 | Phản hồi ≤ 400 ms | ✅ | Phản hồi trực tiếp khi chờ nhà cung cấp `customer.js:198`; vòng quay khi thanh toán `customer.js:432`; khung chờ `app-core.js:12`, `app-core.js:78` |
| 5 | Theo quy ước | ✅ | Tab dưới, nút lùi trái, bottom sheet |
| 6 | Hover/focus | ✅ | `app.css:73`, `tokens.css:58` |
| 7 | Tiến độ nhiều bước | ✅ | Đặt dịch vụ "Bước 1/4" `customer.js:156` qua `app-core.js:39`; hành trình đơn `app.css:176` |
| 8 | Vùng chạm ≥ 44 px | ✅ | Nút 52 px `app.css:72`; viên lọc 44 px `app.css:67`; tab cao hết thanh `app.css:35` |
| 9 | Trạng thái rỗng | ✅ | `customer.js:121`; tab đơn rỗng có nút "Đặt dịch vụ" |
| 10 | Chia cụm | ✅ | Mục có tiêu đề `app.css:42` |
| 11 | Thứ bậc | ✅ | `app.css:28`, `app.css:23` |
| 12 | Giấu phức tạp | ✅ | Bộ lọc trong sheet `customer.js:360`; địa chỉ mặc định và sắp "Gần nhất" |

### `provider.html`: 12/12
| # | Điểm | | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Điều phối chỉ một thẻ cam `provider.js:80`; khối thao tác của việc đặt trên cùng `provider.js:192` |
| 2 | ≤ 7 lựa chọn | ✅ | 4 tab theo vai trò `provider.js:352` |
| 3 | Gần nhau thì liên quan | ✅ | Số dư 3 lớp trong một thẻ `provider.js:109` |
| 4 | Phản hồi ≤ 400 ms | ✅ | Đếm ngược trực tiếp `provider.js:52`; khung chờ và lỗi mạng `app-core.js:54` |
| 5 | Theo quy ước | ✅ | Cùng khung app với App Khách hàng |
| 6 | Hover/focus | ✅ | `app.css:73`, `tokens.css:58` |
| 7 | Tiến độ nhiều bước | ✅ | Đăng ký 3 bước `provider.js:237`; các bước của việc `provider.js:183` |
| 8 | Vùng chạm ≥ 44 px | ✅ | `app.css:72`, `app.css:67`, `app.css:35` |
| 9 | Trạng thái rỗng | ✅ | `provider.js:64` |
| 10 | Chia cụm | ✅ | Yêu cầu tách theo trạng thái; tài chính chia tab thu nhập, lịch sử rút, đối soát |
| 11 | Thứ bậc | ✅ | `app.css:28`, `app.css:23` |
| 12 | Giấu phức tạp | ✅ | Gợi ý sẵn người đang rảnh `provider.js:46`; lý do từ chối chọn sẵn |

## 5. Soát gu web app (`qa-gate.md` §4)

| Mục | | Bằng chứng |
|---|---|---|
| Mỗi màn một hành động chính | ✅ | Đã rà ảnh chụp của cả 4 trang; bản dựng trước bị 2 nút cam ở Điều phối, đã sửa |
| Bảng: số căn phải, tabular-nums, lọc/sắp, dòng rỗng có hướng dẫn | ✅ | `tokens.css:54`, `tokens.css:45`, `admin-shell.js:154`, `admin-shell.js:150` |
| Phím tắt | ✅ | Ctrl K (hiện ở ô tìm kiếm), Esc đóng lớp phủ, mũi tên + Enter trong bảng tìm nhanh `admin-shell.js:404` |
| Đang tải / rỗng / lỗi ở mọi vùng dữ liệu | ✅ | Bảng Demo → Mạng: Bình thường · Chậm · Mất kết nối (cả 3 app); lỗi nghiệp vụ riêng: thanh toán lỗi, check-in xa 640 m, lô chi Sạch Xanh thất bại |
| Không trang trí nền, bento, marquee | ✅ | Không có |
| Phân quyền: không thấy màn kể cả khi mở thẳng URL | ✅ | `admin-shell.js:239` chặn cả `?page=`; quyền đọc từ dữ liệu vai trò, sửa vai trò là menu đổi ngay `admin-shell.js:61` |
| Số tự đặt gắn nhãn minh hoạ | ✅ | `index.html:178`; bảng Demo của cả 3 app; sheet "Ghi chú" trong file Excel `admin-fin1.js:343` |

## 6. Đã tự sửa trong B7

1. Nút Demo của Admin đè lên dòng thời gian của đơn. Đã chuyển thành thanh nằm cuối menu trái, kèm dòng mô tả "Vai trò, kịch bản".
2. Admin tràn ngang ở 768 và 390 px. Đã thêm màn thông báo cho khổ dưới 1024 px.
3. Nút Demo của 2 app ở khổ 390 đè lên nội dung và lên nút chính "Rút tiền". Đã dời lên giữa thanh trạng thái giả; vùng chạm 44 px.
4. Thiếu trạng thái đang tải và lỗi tải. Đã thêm lựa chọn Mạng trong bảng Demo của cả 3 app, cùng vòng quay "Đang chờ ngân hàng xác nhận" khi thanh toán.
5. Vùng chạm trên di động dưới 44 px: VI/EN (30 px), viên lọc (36 px), chip (40 px). Đã nâng lên 44 px.
6. Khung ảnh trong tin nhắn chỉ ghi "IMG". Đã đổi thành "Ảnh bạn gửi, 720×520".
7. Đã thay các dấu gạch dài dùng làm ô trống bằng "Không có", và thay ★ bằng icon ngôi sao.

**Ghi chú mở:** với vai Super admin, menu hiện 18 mục cùng lúc. Tất cả chia 7 nhóm có tiêu đề nên vẫn đạt điểm 2. Tuy vậy, đây là chỗ đáng chấm kỹ ở `laws-of-ux-review`, theo luật Hick và Working Memory.

## 7. Còn chờ

**Cần ảnh thật** (hiện là khung giữ chỗ ghi rõ nội dung và cỡ ảnh):
- Ảnh dịch vụ theo ngành và dịch vụ con: 1200×800 ở Danh mục, 780×400 ở trang dịch vụ (`admin-config.js:107`, `customer.js:133`).
- Ảnh kỹ thuật viên đang làm việc, 740×330 (`customer.js:101`), và ảnh đội nhà cung cấp, 780×420 (`customer.js:141`).
- Banner 1080×540 (`admin-config.js:299`).

Ảnh do người dùng tải lên thì giữ nguyên khung giữ chỗ, vì bản thật sẽ lấy từ dữ liệu: ảnh hiện trạng trước/sau, ảnh khách gửi, bản chụp giấy tờ, ảnh trong tin nhắn.

**Tham số tự đặt, chờ khách xác nhận:**
- Phí rút 5.500 ₫, rút tối thiểu 200.000 ₫, tối đa 2 lần/tuần.
- Bán kính check-in 200 m.
- Mã OTP demo 246810.

Các tham số lấy từ tài liệu: hoa hồng 15%, thuế 2%, hoàn tiền từ 500.000 ₫ duyệt hai bước, bảo hành 7 ngày.

**Số liệu:** mọi số là số minh hoạ. Tổng tháng 9 cộng khớp `finance-flow.md`.

## 8. Lượt sửa sau Cổng 5 (24/09/2026)

Theo danh sách của người dùng. Mọi luồng có bước kiểm trong `_qa/steps-crud-admin.json`, ảnh chụp ở `_qa/crud/`.

| Yêu cầu | Đã làm | Bằng chứng |
|---|---|---|
| Danh mục dịch vụ: thêm CRUD | Thêm mục ở mọi cấp (ngành, danh mục, dịch vụ, gói). Chặn tên trùng. Sửa tên, bật/tắt, cách tính giá và thứ tự. Xoá có kiểm ràng buộc: mục còn nhà cung cấp hay đơn chưa xong thì không xoá được và được đề nghị tắt; mục trống thì xoá kèm lý do và ghi Nhật ký. Thuộc tính động thêm, sửa, xoá; lựa chọn nhập mỗi dòng một cái để giữ dấu phẩy thập phân như "1-1,5 HP" | `admin-config.js:129`, `admin-config.js:156` |
| Tham số vận hành bị lỗi cuộn | Nguyên nhân: các khối trong vùng cuộn bị co lại cho vừa khung, nên nội dung bị cắt mà không cuộn được. Lỗi này có cả ở danh sách Đơn hàng (457/1045 px) và Giao dịch (595/845 px). Sửa gốc bằng một dòng CSS; 38 trạng thái trang đã quét lại, không còn khối bị cắt | `admin.css:69` |
| Tài khoản: sửa thông tin, bật/tắt | Sửa họ tên, số điện thoại (nhận cả dấu cách, dấu chấm), chức danh, vai trò, khu vực. Email khoá vì là tên đăng nhập. Vô hiệu hoá hai bước có lý do và nêu hệ quả; kích hoạt lại. Không tự vô hiệu hoá hay tự đổi vai trò; luôn giữ ít nhất một Super admin. Tài khoản bị vô hiệu hoá không thấy gì khi đăng nhập | `admin-config.js:374` |
| Vai trò & quyền: CRUD | Tạo (trống hoặc sao chép từ vai có sẵn), sửa, nhân bản, xoá (chặn khi còn tài khoản dùng). Quyền theo từng mục menu (Ẩn · Chỉ xem · Toàn quyền) và từng thao tác (24 thao tác). Quyền là nguồn thật của menu: bỏ quyền Hoàn tiền của Kế toán thì menu Kế toán mất mục đó ngay | `admin-config.js:432`, `admin-shell.js:61` |
| Thêm Profile cho account | Menu tài khoản ở góc phải thanh trên. Hồ sơ của tôi có 4 tab: Thông tin (sửa họ tên, điện thoại, chức danh, ngôn ngữ), Bảo mật (đổi mật khẩu có kiểm điều kiện, xác thực 2 lớp bắt buộc với Super admin, phiên đăng nhập), Thông báo (chỉ sự kiện của mục mình có quyền), Hoạt động | `admin-config.js:493`, `admin-config.js:552` |

Sửa thêm khi kiểm: nút Demo của Admin nằm trong luồng cuối menu trái, không còn che mục cuối của Super admin; thanh chọn trong form không còn bị kéo giãn hết bề ngang (`tokens.css:160`); ô bị khoá có nền xám.

## 9. Soát UX 30 luật và lượt sửa theo kết quả (24/09/2026)

Báo cáo đầy đủ ở `_qa/UX-REVIEW.md`. Trước khi sửa, cả 4 trang hạng A, không có lỗi nghiêm trọng; có 5 cảnh báo và 2 gợi ý. Đã sửa cả 7 việc theo lựa chọn của người dùng. Sau khi sửa, mọi luật áp dụng được đều đạt: index 40/40 · admin 58/58 · khách 60/60 · nhà cung cấp 58/58.

Lỗi tự gây ra rồi tự bắt được trong lượt này: khi chèn nhóm kịch bản Hệ thống, dòng kịch bản 13 thiếu dấu phẩy nên thành phần tử rỗng. Bộ kiểm riêng phát hiện ngay; đã sửa và chạy lại toàn bộ.

## 10. Lỗi người dùng báo sau bàn giao (24/09/2026)

"status bar scroll nhưng bị nhảy về đầu": hàng lọc cuộn ngang ở màn Yêu cầu (App Nhà cung cấp) tự nhảy về đầu.
- **Nguyên nhân:** app vẽ lại mỗi giây cho đồng hồ đếm ngược, còn `VN.patch` chỉ giữ vị trí cuộn của phần tử có `data-scroll`. Bộ kiểm cũ không bắt được vì không có bước nào cuộn ngang rồi chờ qua nhịp vẽ lại.
- **Sửa:**
  - `VN.patch` (`core.js`) giữ vị trí cuộn của mọi phần tử đang cuộn dở, theo vùng cuộn và vị trí trong cây DOM.
  - Khi mở màn mới, viên lọc đang chọn tự hiện nếu đang khuất.
  - `app-core.js` hoãn lượt vẽ lại khi người dùng đang cuộn hoặc chạm, qua sự kiện `wheel`, `touchmove`, `pointerdown`. Không dùng sự kiện `scroll` vì preflight cấm.
- **Kiểm:** `_qa/steps-scroll-prov.json` và `_qa/steps-scroll-admin.json`.
  - Hàng lọc giữ 200 px sau 3 giây, trong khi đồng hồ vẫn đếm 250 → 247.
  - Viên "Được chọn" hiện đủ khi mở lại màn.
  - Menu trái Admin giữ 300 px sau khi bấm mục.
  - Chạy lại toàn bộ: 536 bước, 0 lỗi; preflight 0 lỗi, 0 cảnh báo.

## 11. Đợt `evolve-site` 1: khoá huỷ/đổi lịch khi đang làm · nhà cung cấp xem giấy tờ (24/09/2026)

Quyết định 3 cổng ở `FEATURE-DECISIONS.md`. Mốc trước khi sửa ở `_qa/truoc/`, kết quả sau khi sửa ở `_qa/sau/`.

**So với mốc** (cùng 13 bộ của 2 app, so từng giá trị `check`):

| | Trước | Sau |
|---|---|---|
| preflight | 0 lỗi · 0 cảnh báo | 0 lỗi · 0 cảnh báo |
| Số bước (13 bộ cũ) | 223 | 235 (`scan-prov` thêm 12) |
| Lỗi console · tràn ngang · lỗi chữ | 0 · 0 · 0 | 0 · 0 · 0 |
| Bước cũ bị mất · `check` cũ đổi giá trị | | 0 · 0 |

**Bộ mới** (mỗi bước trả `PASS` hoặc `FAIL`):
- `steps-lock-cust.json`, 17 bước, khổ 390 và 1440: đều PASS. Nội dung kiểm:
  - khi Đang làm việc, 2 nút khoá, độ mờ 0,45, có dòng lý do và nút Gọi tổng đài cao ≥ 44 px;
  - bấm nút khoá không mở sheet;
  - gọi thẳng `sheetCancel`, `cancelGo`, `reschedGo` bị chặn, đơn và lịch không đổi, có toast lỗi;
  - Gọi tổng đài ra đúng số;
  - bản EN đúng chữ; đơn theo giờ VN-240938 cũng khoá;
  - khi thợ đang di chuyển vẫn huỷ được, sheet huỷ có câu mới;
  - tua nhanh sang Đang làm việc trong lúc sheet huỷ đang mở thì xác nhận huỷ bị chặn;
  - khi đã phân công vẫn đổi lịch được; câu hỏi thường gặp có quy tắc mới;
  - nút đỏ "Xác nhận huỷ" khi chưa chọn lý do mờ đi;
  - Esc đóng sheet trước rồi mới lùi màn; đang gõ thì Esc không lùi; màn biên nhận (không có nút lùi) thì Esc giữ nguyên.
- `steps-docs-prov.json`, 21 bước, khổ 390 và 1440: đều PASS. Nội dung kiểm:
  - 4 dòng giấy tờ là nút có mũi tên, badge tính từ ngày; không còn nút tải trong danh sách;
  - màn Chi tiết giấy tờ đủ thông tin, đúng 1 nút cam;
  - đang tải lên có `aria-busy`, xong thì Chờ duyệt, nút khoá kèm lý do; bấm nút khoá không tải lại;
  - lùi về Hồ sơ đơn vị thấy badge mới;
  - giấy tờ còn hiệu lực có nút phụ; giấy tờ sắp hết hạn có lời nhắc theo ngày;
  - chỉ số không tồn tại cho ra trạng thái rỗng;
  - thông báo mở đúng giấy tờ, lùi về Thông báo;
  - kỹ thuật viên không có lối vào, mở thẳng thì bị chặn, gọi thẳng `docUp` không đổi dữ liệu;
  - bản EN đúng chữ; mất mạng hiện trạng thái lỗi, mạng chậm hiện khung chờ;
  - Esc lùi từ Chi tiết giấy tờ về Hồ sơ đơn vị; nút đỏ "Từ chối" khi chưa chọn lý do mờ đi, Esc đóng sheet mà giữ màn.
- Khổ 768 của 2 app và 3 khổ của `index.html` (đã đổi chữ bảng đối chiếu): 0 lỗi console, 0 tràn ngang.

**Bẻ thử** (`python _qa/break_test.py`: chép site sang thư mục tạm rồi phá từng chốt, mỗi chốt 1 chỗ, tổng 7 chỗ):
- Các chốt đã phá: bỏ khoá nút Huỷ đơn · bỏ chặn `cancelGo` · bỏ dòng CSS khoá nút phụ · bỏ chặn vai ở màn giấy tờ · bỏ chặn vai ở `docUp` · bỏ kiểu khoá nút đỏ · bỏ Esc lùi màn.
- Kết quả: `steps-lock-cust` báo 8 FAIL, `steps-docs-prov` báo 4 FAIL. Trên bản thật, cả hai bộ im lặng.

**UX 12 điểm trên phần mới:** chân màn Chi tiết đơn 12/12 · màn Chi tiết giấy tờ và danh sách giấy tờ 12/12. Bằng chứng chính:
- Một hành động còn dùng được ở chân màn: `customer.js:262`. Một nút cam ở màn giấy tờ: `provider.js:183`.
- Lý do đặt ngay dưới nút: `app.css:84`.
- Phản hồi: toast ở `customer.js:422` và `customer.js:424`; đang tải lên ở `provider.js:331`.
- Khoá theo quy ước: `app.css:78`. Vùng chạm: `app.css:79`, `app.css:52`.
- Trạng thái rỗng và bị chặn: `provider.js:165`, `provider.js:167`.

**Lỗi có sẵn tìm thấy trong đợt, đã sửa theo lựa chọn ở Cổng 3:**
- Nút đỏ bị khoá trông như bấm được: thêm `.abtn.dz[aria-disabled]` mờ 45% (`app.css:81`). Có tác dụng ở Xác nhận huỷ, Xoá tài khoản, Từ chối yêu cầu.
- Esc chỉ đóng sheet: nay Esc đóng sheet, rồi bảng Demo, rồi lùi màn bằng nút lùi của màn. Không lùi khi đang gõ hoặc ở màn không có nút lùi (`app-core.js:112-119`).
- `gen_textscan.py` lệch với file bước: đã đưa 23 bước quét lớp phủ của admin và 2 bước tóm tắt đặt dịch vụ vào bộ sinh. Chạy lại bộ sinh cho ra file admin và khách giống từng byte bản cũ; file nhà cung cấp giữ đủ 54 bước.

**Còn lại, chưa sửa:** bản preflight trong dự án chưa có `--save`/`--compare`; so mốc bằng cách đối chiếu 2 bản chữ.
