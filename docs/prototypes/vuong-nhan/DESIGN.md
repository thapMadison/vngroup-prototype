# Design System: Vương Nhân · Prototype MVP

> Trình ở **Cổng 4** ngày 24/09/2026. Sửa sau ngày duyệt thì ghi vào `DECISIONS.md` và cập nhật bảng *Lịch sử* cuối file.
> Nguồn token: Admin Portal Concept v1 (xem `REFERENCE-READ.md`). Tên mô tả + giá trị + vai trò.

## 0. Bản đọc thiết kế
**Đọc là:** nền tảng marketplace dịch vụ tại nhà của Vương Nhân (VN Group) gồm Trang quản trị web cho vận hành, CSKH, kế toán, lãnh đạo dùng máy tính cả ngày, và 2 app di động cho khách hàng và nhà cung cấp (chủ đơn vị, kỹ thuật viên). Giọng nghiệp vụ rõ ràng, gần gũi, song ngữ VI/EN. Nghiêng về họ *Công cụ vận hành* (Admin) và *Mềm mại · Thân thiện* (app).
**Cách hiểu phong cách:** Thân thiện, cộng đồng · **Hướng:** trộn (Admin = B + khối "cần chú ý" của C · App Khách hàng = C + hành trình đơn của B · App Nhà cung cấp = C) · **Mức bám:** làm nền, được biến tấu
**Dial:** Admin V4 · M3 · D8 — App V6 · M4 · D5 · **Nền:** sáng (một nền cho cả 3 ứng dụng)

## 1. Không khí
Admin là một bàn làm việc ấm và ngăn nắp: trung tính màu giấy, chữ nâu than, màu chỉ xuất hiện khi có trạng thái cần để ý và ở đúng một nút cam. Hai app mang giọng thương hiệu: khối cam đặc ở đầu trang, lời chào nét đậm, người thợ là nhân vật chính của hành trình đơn, còn điểm sao và đánh giá luôn thuộc về nhà cung cấp. Một đơn hàng luôn được kể bằng cùng một hình: các mốc nối bằng đường liền.

## 2. Màu và vai trò
| Tên | Giá trị (oklch → hex) | Vai trò |
|---|---|---|
| Giấy ấm | oklch(0.985 0.002 60) `#FBFAF9` | Nền vùng nội dung Admin và nền app |
| Nền trình bày | `#ECEBE9` | Nền quanh khung Admin/điện thoại trên trang demo |
| Mặt thẻ | `#FFFFFF` | Thẻ, sidebar, topbar, drawer, modal |
| Viền | oklch(0.92 0.005 60) `#E7E4E1` | Viền thẻ, đường kẻ chính |
| Kẻ dòng | oklch(0.95 0.004 60) `#F0EEEC` | Kẻ dòng bảng, phân cách trong thẻ |
| Viền ô nhập | oklch(0.88 0.006 60) | Nút phụ, ô nhập |
| Nền phụ | oklch(0.97 0.003 60) | Ô tìm kiếm, nền nhóm, hover |
| Chữ chính · nâu than | oklch(0.24 0.012 60) `#241E1A` | Tiêu đề, chữ thân |
| Chữ cấp hai | oklch(0.42 0.01 60) `#514C48` | Chữ phụ trong bảng |
| Chữ mờ | oklch(0.5 0.01 60) `#68625E` | Mô tả, metadata |
| Chữ nhạt | oklch(0.55 0.01 60) `#76706C` | Nhãn nhóm menu, placeholder, mốc chưa tới (đã nâng từ 0.6 để đạt AA) |
| **Cam thương hiệu** | oklch(0.58 0.19 38) `#D24100` | Nút chính (tối đa 1/màn), đầu app, mục đang chọn |
| Cam hover | oklch(0.52 0.18 38) `#B93200` | Hover nút chính |
| Cam nhạt | oklch(0.96 0.03 50) `#FFEDE0` | Nền mục menu đang chọn, avatar, khối "gần bạn" |
| Liên kết | oklch(0.52 0.17 38) `#B53700` | Liên kết, nút chữ |
| TONE info | nền `#DFF1FF` · chữ `#00548C` | Đang chạy bình thường (đang di chuyển, đang thực hiện, đang bảo hành) |
| TONE slate | nền `#EAEFF7` · chữ `#48566C` | Đã sắp xếp, có thể rút |
| TONE warning | nền `#FEEEC1` · chữ `#7B5100` | Chờ ai đó hành động (chờ thanh toán, chờ duyệt, sắp hết hạn, tạm dừng) |
| TONE danger | nền `#FFE6E4` · chữ `#B7162D` | Cần can thiệp (khiếu nại, tạm giữ, quá hạn, đã khoá, chi thất bại) |
| TONE success | nền `#DBF7DE` · chữ `#016826` | Đã xong (hoàn tất, đã chi, đang hoạt động, đã xác minh). Xanh lá lấy từ logo |
| TONE neutral | nền `#F0EEEC` · chữ `#625C58` | Kết thúc không thành (đã huỷ, đã hoàn tiền, không có nhà cung cấp nhận) |
| Biểu đồ 1 · xanh dương | `#2a78d6` | GMV, phần nhà cung cấp |
| Biểu đồ 2 · tím | `#4a3aa7` | Hoa hồng |
| Biểu đồ 3 · hồng tím | `#e87ba4` | Thuế khấu trừ (luôn kèm nhãn trực tiếp, 2,69:1) |
| Sọc chéo 135° | cùng màu, nền nhạt | Khoản tạm tính / còn phải trả |
| Heatmap | `#cde2fb` → `#184f95` (6 bậc xanh dương) | Tỷ lệ yêu cầu không ai nhận |

**Tương phản đã đo (trên trắng):** chữ chính 16,5:1 · chữ mờ 6,0:1 · chữ nhạt 4,9:1 · chữ trắng trên cam 4,67:1 · mọi cặp TONE ≥ 5,6:1 · bảng màu biểu đồ qua validator dataviz (5/5 phép kiểm).

## 3. Chữ
| Vai | Font | Trọng lượng | Cỡ | Ghi chú |
|---|---|---|---|---|
| Admin · tiêu đề trang | Be Vietnam Pro | 600 | 24px | tracking -0.01em |
| Admin · tiêu đề khối | Be Vietnam Pro | 600 | 15px | |
| Admin · thân | Be Vietnam Pro | 400 | 13,5px | line-height 1.5 |
| Admin · nhãn cột / nhóm | Be Vietnam Pro | 600 | 11,5px / 11px | chữ hoa, tracking .05/.07em |
| Admin · số KPI | Be Vietnam Pro | 600-700 | 24-28px | tabular-nums |
| App · lời chào, tiêu đề màn | Be Vietnam Pro | 800 | 28-30px | tracking -0.02em |
| App · tiêu đề khối | Be Vietnam Pro | 600 | 17px | |
| App · thân | Be Vietnam Pro | 400 | 15-16px | |
| Mã đơn, mã giao dịch, đồng hồ | JetBrains Mono | 500-600 | 12-13px (đồng hồ 30px) | |

**Đã kiểm dấu tiếng Việt:** `preflight.py --font` → Be Vietnam Pro `VI` · JetBrains Mono `VI`.

## 4. Hình khối
- **Bo góc:** Admin: ô nhập, nút 8 · thẻ 12 · khung 14. App: ô nhập 12-14 · thẻ 16-20 · khung điện thoại 48. Badge, chip, pill 999.
- **Bóng:** nhuốm nâu `rgba(40,30,20,…)`, khuếch tán. Thẻ Admin không bóng (chỉ viền 1px). Menu thả `0 10px 30px /.12`. Drawer `-12px 0 40px /.18`, lớp phủ `rgba(30,24,18,.28)`.
- **Icon:** Phosphor Regular (tab đang chọn dùng Fill), nhúng sprite SVG, cỡ 16-18 Admin, 20-24 app.
- **Khoảng cách:** bước 4: 4 · 8 · 12 · 16 · 24 · 32. Trong nhóm 8-12, giữa nhóm 24-32.
- **Chiều cao:** control 36 · nút quyết định 40 (app 46-52) · dòng bảng 50 · vùng chạm app ≥ 44.

## 5. Component
- **Nút:** chính = nền cam chữ trắng, tối đa 1/màn, góc phải hoặc đáy (app). Phụ = trắng viền. Chữ = link cam. Nguy hiểm = chữ đỏ, đặt xa nút chính, luôn mở hộp xác nhận có lý do. Không có quyền = khoá + tooltip lý do. Nút phụ và nút đỏ bị khoá trong app mờ 45% (`.abtn.sec2[aria-disabled]`, `.abtn.dz[aria-disabled]`, cùng quy ước với chip và nút Admin), và vì điện thoại không có tooltip nên luôn kèm dòng lý do `note-line` ngay dưới nút.
- **Phím Esc trong app:** đóng sheet trước, rồi đóng bảng Demo, sau đó mới lùi màn bằng nút lùi của màn. Không lùi khi đang gõ trong ô nhập, và không lùi ở màn không có nút lùi (`noBack`).
- **Hộp thoại thao tác tiền / can thiệp:** ô **Lý do** bắt buộc (danh sách + ghi chú); khối **"Tác động lên số dư"** trước → sau; nút xác nhận chỉ bật khi đủ dữ liệu. Thao tác không hoàn tác: 2 bước.
- **Tab có số lượng:** gạch chân cam 2px + số trong pill xám.
- **Bảng:** tiêu đề chữ hoa 11,5px, dòng 50px, cột số căn phải, sắp xếp cột, tìm + tối đa 3 bộ lọc, trạng thái rỗng có hướng dẫn, phân trang "Hiển thị 1-8 trên 1.284".
- **Timeline:** chấm đặc = đã xong, vòng xanh = đang ở đây (nhấp nháy nhẹ), vòng xám = chưa tới; đường liền nối mốc; mốc can thiệp thủ công có icon tia sét.
- **Drawer 440px** (xem, sửa nhanh) · **Modal** (xác nhận) · **Menu "Thao tác khác ▾"** (ít dùng, nguy hiểm cuối, chữ đỏ).
- **Toast** góc phải trên, tự đóng 3 giây, `role="status"`.
- **Đang tải / rỗng / lỗi:** skeleton đúng hình (không spinner tròn) · rỗng có câu hướng dẫn + nút · lỗi đặt cạnh chỗ lỗi (mẫu "Giá sàn phải nhỏ hơn giá trần").
- **Đặc trưng dự án:** thanh 5 điều kiện sẵn sàng nhận đơn · số dư 3 lớp nối bằng đường liền · cây cầu tiền có dấu "✓ Khớp" · đếm ngược thời hạn phản hồi (vàng khi < 5 phút) · khối cam đầu app · thẻ nhà cung cấp "đã làm cho N nhà ở phường bạn" (ảnh đội, điểm sao kèm số đánh giá) · trục giờ đội kỹ thuật viên.

## 6. Bố cục
- **Admin:** thiết kế cho 1440×900, chạy tốt từ 1280. Sidebar 232 + topbar 60. 5 mẫu trang của concept: Tổng quan · Danh sách · Chi tiết (2/3 + 1/3) · Hàng chờ duyệt (danh sách trái, hồ sơ phải, thanh quyết định đáy) · Cấu hình (phạm vi, bảng nhóm, drawer).
- **App:** khung điện thoại 390×844 ở giữa trang trên desktop, bên cạnh là bảng Demo (kịch bản, vai trò, ngôn ngữ). Dưới 500px: bỏ khung, app chiếm toàn màn.
- **Hub `index.html`:** chọn ứng dụng + danh sách kịch bản demo của cả 3.

## 7. Chuyển động
Admin ≤ 200ms, chỉ để phản hồi: drawer trượt 180ms, modal mờ dần 150ms, toast trượt xuống, số cập nhật đổi màu nền nhạt 600ms. App: đẩy màn 220ms `translateX`, bottom sheet 240ms, đếm ngược chạy thật, chấm "đang ở đây" nhấp nháy. Easing `cubic-bezier(.2,0,0,1)`. `prefers-reduced-motion`: tắt hết, giữ trạng thái cuối.

## 8. Cấm riêng của dự án
- Không viết tắt trên giao diện: NCC, KTV, TK, ĐHXL.
- App Khách hàng: điểm sao chỉ gắn với nhà cung cấp và luôn kèm số đánh giá; không đặt sao cạnh tên hay ảnh kỹ thuật viên. Khách đánh giá dịch vụ của nhà cung cấp theo từng đơn. Điểm riêng của từng kỹ thuật viên chỉ hiện trong App Nhà cung cấp (#51).
- Không quá 1 nút cam mỗi màn. Không tạo màu, kiểu badge mới ngoài TONE (không tím, không cam cho badge).
- Không dùng "ví" cho tiền của khách (MVP không có ví); không hứa hoàn tiền khi khách chưa thanh toán.
- Không sửa, không xoá bút toán. Không hoàn tiền sau khi đã chi cho nhà cung cấp.
- Không gạch dài trong chữ hiển thị; khoảng giờ viết `08:00-10:00`. Không emoji, không ký tự ★ (dùng icon).
- Địa chỉ theo địa giới sau 01/07/2025: phường + TP. Hồ Chí Minh, không còn "Quận". Bình Dương cũ = TP. Hồ Chí Minh.
- Tên người Việt đa dạng, không chuỗi A-B-C, không "Nguyễn Văn A". Số điện thoại che giữa `090 ••• 4521`.
- Số tự đặt là số minh hoạ; giả định nghiệp vụ gắn nhãn "Giả định, chờ xác nhận".

## 9. Bộ dữ liệu chung (hôm nay thứ Năm 24/09/2026, TP. Hồ Chí Minh)
| Nhóm | Dữ liệu |
|---|---|
| Vai trò Admin | Lãnh đạo · Võ Quốc Bảo · Kế toán · Lê Minh Anh · CSKH & phân xử · Trần Ngọc Hân · Super admin · Nguyễn Hải |
| Nhà cung cấp | Điện lạnh Phúc An (hoạt động 5/5, chủ Trần Văn Phúc, Vietcombank •••• 6789) · Kỹ thuật Hoà Bình (hoạt động 5/5) · Sạch Xanh Home (Tạm dừng · Giặt sofa, nệm, 4/5, vừa đổi tài khoản ngân hàng) · An Tâm Pest (hoạt động 5/5, tỷ lệ huỷ cao) · Thợ Tâm (kỹ thuật viên tự do, Đã khoá, 3/5) |
| Chờ duyệt hồ sơ | Diệt khuẩn Gia Khang (thay An Tâm Pest trong tài liệu) · Nhà Sạch Pro (tự do, P. Thủ Dầu Một, thiếu chứng chỉ) · Điện nước Minh Khoa |
| Kỹ thuật viên Phúc An | Lê Văn Tài · Trần Quốc Huy · Phạm Minh Đức · Võ Hoàng Nam (nghỉ phép) |
| Đơn trong kịch bản | VN-240931 Trần Thu Hà · Vệ sinh máy lạnh 2 máy · Phúc An · Lê Văn Tài · Đang thực hiện (thay #DH-20240924-001) · VN-240918 Đặng Quốc Việt · 450.000 ₫ · bảo hành tới 29/09 · VN-240921 Võ Thanh Trúc · Vệ sinh sofa · Sạch Xanh · 900.000 ₫ · khiếu nại, tạm giữ · VN-240902 · Phúc An · đã chi 14/09 · VN-240925 Phạm Gia Bảo · Thợ Tâm · 520.000 ₫ · chờ thanh toán · VN-240919 Huỳnh Thị Kim Dung · quá hạn 2 ngày · VN-240915 Tạ Quang Vinh · quá hạn 3 ngày · VN-240912 Mai Thanh Tùng · quá hạn 9 ngày · YC-58140 Lương Thị Hồng Nhung · Diệt côn trùng · không có nhà cung cấp nhận (An Tâm Pest từ chối "Hết nhân lực") |
| Tài chính tháng 9 | theo finance-flow.md: khách trả 1.250.000.000 ₫ · hoàn 18.000.000 ₫ · GMV 1.232.000.000 ₫ · hoa hồng 184.800.000 ₫ (thực thu 150.300.000 / tạm tính 34.500.000) · thuế 24.640.000 ₫ · nhà cung cấp 1.022.560.000 ₫ (đã chi 780.000.000 / còn 242.560.000) |
| Rút tiền chờ duyệt | 8 yêu cầu, tổng 14.620.000 ₫ (Phúc An 2.450.000 · Sạch Xanh 1.800.000 sai số tài khoản · …) |
| App Khách hàng | Trần Thu Hà · 0903 ••• 552 · 128 Nguyễn Đình Chiểu, P. Xuân Hòa |
| App Nhà cung cấp | Chủ đơn vị Trần Văn Phúc (Phúc An) · Kỹ thuật viên Lê Văn Tài |

## 10. Sơ đồ trang
### 10.1 Hub · `site/index.html`
| Section | Hành động chính | Dữ liệu |
|---|---|---|
| Giới thiệu ngắn + 3 thẻ ứng dụng (Admin · App Khách hàng · App Nhà cung cấp) | Mở ứng dụng | ảnh chụp từng app |
| Danh sách kịch bản demo theo ứng dụng, bấm là nhảy thẳng tới điểm bắt đầu | Mở kịch bản | 20 kịch bản |
| Ghi chú: số minh hoạ, giả định chờ xác nhận, ngoài phạm vi | — | — |

### 10.2 Trang quản trị · `site/admin.html` (18 mục menu, giữ nguyên IA concept)
| Mục menu (estimation) | Màn · mẫu trang | Hành động chính | Độ sâu |
|---|---|---|---|
| **Tổng quan** (#71) | Dòng chảy đơn 7 chặng · 4 KPI tài chính · Tiền đi đâu · Việc cần xử lý (theo quyền) · Yêu cầu không ai nhận theo ngành × giờ · Nhà cung cấp cần chú ý | Mở việc cần xử lý | sâu |
| **Báo cáo** (#72-73) | R của finance-flow: bộ chọn kỳ + so với kỳ trước · 4 thẻ · cây cầu tiền ✓ Khớp · biểu đồ cột ngày/tuần/tháng · bảng Theo ngành / Theo nhà cung cấp | Xuất Excel (hộp thoại 3 sheet) | sâu |
| Yêu cầu dịch vụ (#81) | Danh sách: tab Đang chờ phản hồi · Chờ khách chọn · Đã chốt · Hết hạn · Đã huỷ; drawer: nhà cung cấp nào xác nhận/từ chối/hết hạn | Xem | luồng chính |
| **Đơn hàng** (#82) | Tab **Quản lý đơn hàng** (O1: 4 KPI, lọc, bảng 7 cột) · tab **Cần chú ý 4** (O3: Không có nhà cung cấp nhận · Quá hạn thanh toán) · **Chi tiết đơn** (O2: 3 cột, timeline, tin nhắn chỉ xem, ảnh, thẻ can thiệp: Huỷ đơn drawer · Đổi trạng thái thủ công modal · Ghi chú nội bộ) | Can thiệp theo quyền | sâu |
| Khiếu nại (#88) | Hàng chờ duyệt: danh sách trái · màn phân xử phải (ảnh trước/sau, ảnh khách, dấu thời gian và vị trí, timeline, tin nhắn, bảng chốt) · 4 phán quyết kèm lý do, nối sang Tạm giữ tiền | Ra phán quyết | luồng chính |
| **Nhà cung cấp** (#74, 76-77) | Tab **Danh sách** (P1) · **Hàng chờ duyệt 3** (P3, mẫu Hàng chờ duyệt) · **Giấy tờ & ngân hàng** (P4: sắp hết hạn · xác minh tài khoản) · **Chi tiết** (P2: tab Hồ sơ, Giấy tờ, Kỹ thuật viên, Lịch sử; thẻ Trạng thái, 5 điều kiện, Tài chính nhanh → Số dư & sổ cái) | Duyệt / tạm dừng / khoá theo quyền | sâu |
| Khách hàng (#74) | Danh sách + drawer chi tiết: đơn gần đây, khiếu nại, lịch sử hoạt động; khoá/mở kèm lý do | Khoá tài khoản | luồng chính |
| **Giao dịch & đối soát** (#85) | A: 5 tab Giao dịch thu · Số dư nhà cung cấp · Chờ khách thanh toán (drawer đôn đốc) · Điều chỉnh sổ cái (duyệt 2 bước) · Đối soát (xuất file, nhập sao kê tuỳ chọn) · **Tiền của đơn** (B) · **Số dư & sổ cái** (C) | Tạo điều chỉnh / Xuất file | sâu |
| **Rút tiền** (#86) | D: tab Chờ duyệt · Chờ chi · Đã chi · Từ chối · Chi thất bại; tạo lô chi 3 bước | Duyệt rút tiền | sâu |
| **Hoàn tiền & tạm giữ** (#87) | E: Đang tạm giữ · Chờ duyệt hoàn tiền · Đã hoàn; ngưỡng 500.000 ₫ gửi duyệt; chặn hoàn khi đã chi | Hoàn tiền cho khách | sâu |
| Danh mục dịch vụ (#78-79) | Cấu hình: cây 4 cấp Ngành → Danh mục → Dịch vụ → Gói; panel phải: tên VI/EN, bật/tắt, cách tính giá, thứ tự, thêm mục con, xoá (đang dùng thì đề nghị tắt); thuộc tính động thêm, sửa, xoá | Lưu thay đổi | CRUD đầy đủ (sửa sau Cổng 5) |
| Giá & hoa hồng (#83) | Cấu hình: phạm vi Khu vực › Ngành; giá sàn, giá trần, hoa hồng (cố định/bậc thang), phụ thu, thuế; hiệu lực theo thời gian; lỗi "Giá sàn phải nhỏ hơn giá trần" | Lưu giá trị | luồng chính |
| Khu vực (#80) | Danh sách khu vực (TP. Hồ Chí Minh bật; Hà Nội, Đà Nẵng tắt) · tiền tệ, thuế, múi giờ, ngôn ngữ · nhập địa giới GeoJSON | Bật khu vực | luồng chính |
| Kiểm duyệt (#89) | Hàng chờ: đánh giá, ảnh, hồ sơ; từ khoá cấm | Hiển thị / ẩn | luồng chính |
| Thông báo & banner (#90) | Danh sách chiến dịch · soạn thông báo theo phân khúc, mẫu VI/EN, hẹn giờ · banner trang chủ | Gửi thông báo | luồng chính |
| Quản trị viên (#75) | Tài khoản: lọc, sửa, vô hiệu hoá hai bước, kích hoạt lại · Vai trò & quyền: tạo, sao chép, sửa, nhân bản, xoá; quyền theo mục menu và 24 thao tác | Mời quản trị viên · Tạo vai trò | CRUD đầy đủ (sửa sau Cổng 5) |
| Tham số vận hành (#92) | Concept 3c: phạm vi, nhóm tham số, drawer chuỗi kế thừa, thay đổi đã lên lịch, lịch sử; form sửa (giá trị, hiệu lực, lý do) | Sửa giá trị | luồng chính |
| Nhật ký (#94) | Bảng thao tác quản trị (lọc người, mô-đun, thời gian) · tab lịch sử đăng nhập | Xuất Excel | luồng chính |

**Thanh Demo** (nút tròn viền nét đứt góc dưới trái): vai trò · 13 kịch bản Admin (6 của finance-flow + 3 đơn hàng + 4 nhà cung cấp) · đặt lại dữ liệu. Dữ liệu chỉ trong state.

**Phân quyền** (ẩn mô-đun không có quyền; thao tác không có quyền thì khoá + tooltip). Bảng dưới là **giá trị khởi tạo**: từ lượt sửa sau Cổng 5, quyền là dữ liệu của vai trò, sửa ở Quản trị viên › Vai trò & quyền và áp dụng ngay vào menu. Hồ sơ của tôi mở từ menu tài khoản trên thanh trên, mọi vai trò đều thấy:
| Mô-đun | Lãnh đạo | Kế toán | CSKH & phân xử | Super admin |
|---|---|---|---|---|
| Tổng quan, Báo cáo | xem, xuất Excel | xem, xuất Excel | xem (ẩn Xuất Excel) | toàn quyền |
| Đơn hàng | xem | xem | xem, huỷ đơn, ghi chú | toàn quyền (+ đổi trạng thái thủ công) |
| Yêu cầu dịch vụ, Khiếu nại, Khách hàng, Kiểm duyệt, Thông báo | ẩn | ẩn | toàn quyền | toàn quyền |
| Nhà cung cấp | ẩn | xem, xác minh tài khoản ngân hàng | duyệt hồ sơ, tạm dừng, khoá | toàn quyền (+ mở khoá) |
| Tài chính (3 mục) | ẩn | toàn quyền, duyệt 2 bước | xem, tạm giữ, ghi chú đôn đốc | toàn quyền, duyệt bước hai |
| Danh mục, Giá, Khu vực, Quản trị viên, Tham số, Nhật ký | ẩn | ẩn | ẩn | toàn quyền |

### 10.3 App Khách hàng · `site/customer.html` (mục 1-36)
| Màn | Hành động chính | Estimation |
|---|---|---|
| Giới thiệu 3 trang + xin quyền vị trí, thông báo · chế độ xem khi chưa đăng nhập | Bắt đầu | #3 |
| Đăng nhập SĐT → OTP (đếm ngược gửi lại, sai mã) | Tiếp tục | #1 |
| Trang chủ (khối cam, chip ngành, đơn đang chạy, nhà cung cấp tin cậy ở phường bạn, đặt lại) | Tìm dịch vụ | #8, #34 |
| Danh mục 4 cấp · Tìm kiếm + lọc (bottom sheet) + sắp xếp | Chọn dịch vụ | #9-10 |
| Chi tiết dịch vụ · Hồ sơ và bảng giá nhà cung cấp | Đặt dịch vụ | #11-12 |
| Đặt dịch vụ 4 bước: cấu hình (thuộc tính động) → địa chỉ + 2-3 khung giờ → ghi chú + ảnh → chọn tối đa 5 nhà cung cấp | Gửi yêu cầu | #14-17 |
| Chờ phản hồi realtime (đếm ngược, từng đơn vị xác nhận/từ chối) → So sánh và chọn · ngoài luồng: không ai nhận, hết hạn (gửi lại, đổi giờ, huỷ) | Chọn nhà cung cấp | #19-21 |
| Đơn của tôi (tab trạng thái) → Chi tiết đơn = hành trình 7 mốc (B) · Nhắn tin · Đồng hồ + duyệt vượt ngưỡng · Huỷ / đổi lịch (hiện hệ quả trước; khoá khi thợ đang làm việc, dưới nút có lý do và lối Gọi tổng đài để CSKH huỷ hộ) | Nghiệm thu | #22-27 |
| Nghiệm thu (bảng chốt khối lượng, ảnh trước/sau) → Hoá đơn → Thanh toán (thẻ, ví điện tử, QR; màn cổng giả lập; thất bại → thanh toán lại) → Biên nhận | Thanh toán | #28-31 |
| Đánh giá dịch vụ của nhà cung cấp, đa tiêu chí · Mở khiếu nại kèm bằng chứng · Lịch sử giao dịch | Gửi đánh giá | #31-33 |
| Thông báo · Trợ giúp · Tài khoản (hồ sơ, phiên đăng nhập, sổ địa chỉ + ghim bản đồ, ngôn ngữ và khu vực, xoá tài khoản) | — | #4-7, #35-36 |

### 10.4 App Nhà cung cấp · `site/provider.html` (mục 38-70)
| Vai | Màn | Hành động chính | Estimation |
|---|---|---|---|
| Chủ đơn vị | Yêu cầu mới (đếm ngược) → chi tiết → Xác nhận (chọn khung giờ) / Từ chối (lý do) · Chờ khách chọn · Được chọn | Xác nhận yêu cầu | #52-53 |
| Chủ đơn vị | Điều phối: đơn chưa phân công + gợi ý người, trục giờ đội | Phân công | #55 |
| Chủ đơn vị | Đội: mời kỹ thuật viên, kỹ năng, chứng chỉ, lịch ca, hiệu suất | Mời kỹ thuật viên | #48-51 |
| Chủ đơn vị | Dịch vụ & bảng giá (lỗi vượt trần/sàn), khu vực phục vụ (bán kính), giờ làm việc + phụ thu | Lưu bảng giá | #44-47 |
| Chủ đơn vị | Tài chính: số dư 3 lớp · thu nhập theo đơn · rút tiền (ngưỡng, phí) · đối soát xuất file | Rút tiền | #64-67 |
| Chủ đơn vị | Hồ sơ đơn vị: đăng ký, giấy tờ, trạng thái duyệt, tài khoản ngân hàng, 5 điều kiện sẵn sàng · đánh giá và chỉ số | Hoàn thiện hồ sơ | #38-43, #69 |
| Chủ đơn vị | Chi tiết giấy tờ (chạm dòng giấy tờ hoặc thông báo hết hạn): bản chụp A4, hạn, ngành áp dụng, ngày nộp, ngày duyệt, lời nhắc theo tình trạng · tải bản mới (đang tải lên → chờ duyệt). Kỹ thuật viên mở thẳng màn này thì bị chặn | Tải bản mới | #39 |
| Kỹ thuật viên | Hôm nay (trục giờ) · bật sẵn sàng · lịch tuần | Bắt đầu việc | #56 |
| Kỹ thuật viên | Việc: Lên đường → Đã đến (check-in GPS, bán kính) → Ảnh trước → Bắt đầu (đồng hồ) → Kết thúc: khối lượng + ảnh sau → gửi bảng chốt · Báo sự cố / khách vắng mặt / dừng giữa chừng · Nhắn tin | Bước kế tiếp | #58-63 |
| Cả hai | Chuyển vai trò/đơn vị · thông báo · trợ giúp · ngôn ngữ | — | #68, #70 |

**Kỹ thuật:** HTML + CSS thuần (CSS variables) + JavaScript thuần, không Tailwind, không framework; font Google Fonts; icon sprite nhúng sẵn. Chạy bằng cách mở file, không cần máy chủ; đăng được thành Artifact.

## Lịch sử
| Ngày | Đổi gì | Vì sao |
|---|---|---|
| 24/09/2026 | Tạo | Cổng 1-3, 2 tài liệu mới |
| 24/09/2026 | §5 thêm kiểu khoá cho nút phụ trong app; §10.3 khoá huỷ, đổi lịch khi thợ đang làm; §10.4 thêm màn Chi tiết giấy tờ | `evolve-site` đợt 1, xem `FEATURE-DECISIONS.md` |
| 24/09/2026 | §5 thêm kiểu khoá cho nút đỏ trong app và quy tắc phím Esc | Người dùng chọn sửa 2 lỗi có sẵn tìm thấy ở Cổng 3 của `evolve-site` đợt 1 |
| 24/09/2026 | §1, §5: thẻ người thợ ở trang chủ thành thẻ nhà cung cấp · §8 thêm luật điểm sao chỉ gắn với nhà cung cấp · §10.3 | `evolve-site` đợt 2, xem `FEATURE-DECISIONS.md` |
