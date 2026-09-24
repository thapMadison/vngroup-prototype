# Bản đọc tham chiếu — Vương Nhân
**Ngày:** 24/09/2026 · **Mức bám:** làm nền, được biến tấu (Cổng 1) · **Nguồn:**
- **[C]** Admin Portal Concept v1, 23/09/2026 — https://claude.ai/artifact/JpXtRhARPd5y8dy2EDVQ5C (bundle đã giải nén; số dòng theo `template.html` sau khi bỏ `@font-face`)
- **[F]** `requirement/finance-flow.md`
- **[E]** `requirement/Vuong_Nhan_Ballpark_Estimation_22_Sep_2026.md`
- **[W]** https://vngroup.info/ — Công ty CP Đầu tư Vương Nhân (VN-GROUP), slogan "Hội tụ nguồn lực, phát triển cộng đồng"
- **Logo:** `site/assets/vngroup-logo.png` (3367×1800, lấy từ bundle [C]; cầu xanh lá + chữ "VN GROUP" cam gradient)

## 1. Đã chốt (luật, vì mức bám "làm nền" vẫn giữ màu, chữ, bo góc)
| Mục | Giá trị | Nguồn |
|---|---|---|
| Font | Be Vietnam Pro (thân) · JetBrains Mono (mã đơn, mã giao dịch, số ký hiệu) | [C] dòng 14, 539–546 |
| Bo góc | control 8 · card 12 · badge 999 · frame 14 | [C] dòng 550 |
| Chiều cao | control 36 · nút quyết định 40 · dòng bảng 50 | [C] dòng 551 |
| Khoảng cách | bước 4: 4 · 8 · 12 · 16 · 24 · 32; trong nhóm 8–12, giữa nhóm 24–32 | [C] dòng 549 |
| Cam | chỉ cho nút chính (tối đa 1/màn), liên kết, mục menu đang chọn | [C] dòng 523, 573 |
| Xanh lá | lấy từ logo, **chỉ** cho hoàn tất / thành công | [C] dòng 529 |
| Danger | chữ đỏ, đặt xa nút chính, luôn mở hộp xác nhận kèm lý do | [C] dòng 575 |
| Trạng thái | Vàng = chờ khách hành động · Đỏ = cần quản trị viên can thiệp · Xanh dương = đang chạy · Xanh lá = xong · Slate = đã sắp xếp · Neutral = kết thúc không thành | [C] dòng 559, 617 |
| Đặt tên | Menu là danh từ · Nút là động từ + đối tượng · Một khái niệm một từ · Trạng thái bắt đầu bằng Chờ/Đang/Đã · EN theo cách dùng quen, không dịch từng chữ · Không viết tắt NCC/KTV/TK | [C] dòng 69–74 |
| IA Admin | 7 nhóm, 18 mục, mỗi nhóm ≤ 3 mục, mục không có quyền bị ẩn | [C] dòng 612–614 |
| 5 mẫu trang | Tổng quan · Danh sách · Chi tiết · Hàng chờ duyệt · Cấu hình | [C] dòng 727–733 |
| Thao tác | 2 thao tác hay dùng nằm ngoài; ít dùng/nguy hiểm vào "Thao tác khác ▾"; thao tác không dùng được vẫn hiện kèm lý do; mọi can thiệp cần lý do và ghi Nhật ký | [C] dòng 325 |
| Song ngữ | công tắc VI/EN trên thanh trên cùng; tiền EN đổi dấu chấm thành phẩy | [C] dòng 126, 673 |

## 2. Token trích được
Hex đổi từ oklch bằng công thức OKLab → sRGB. Tương phản đo trên nền trắng.

| Token | oklch | Hex | Vai trò | Tương phản | Chắc chắn? |
|---|---|---|---|---|---|
| `page` | — | `#ECEBE9` | nền trang trình bày concept (không phải nền app) | — | chắc |
| `canvas` | 0.985 0.002 60 | `#FBFAF9` | nền vùng nội dung app | — | chắc |
| `surface` | — | `#FFFFFF` | thẻ, sidebar, topbar | — | chắc |
| `border` | 0.92 0.005 60 | `#E7E4E1` | viền thẻ, đường kẻ chính | — | chắc |
| `line-soft` | 0.95 0.004 60 | `#F0EEEC` | kẻ dòng bảng | — | chắc |
| `control-border` | 0.88 0.006 60 | — | viền nút phụ, ô nhập | — | chắc |
| `text-subtle` | 0.6 0.01 60 | `#857F7A` | nhãn nhóm menu, placeholder, mốc chưa tới | **3,95:1 ❌ AA** | chắc |
| `text-muted` | 0.5 0.01 60 | `#68625E` | chữ phụ | 6,00:1 ✅ | chắc |
| `text-2` | 0.42 0.01 60 | `#514C48` | chữ cấp hai trong bảng | 8,48:1 ✅ | chắc |
| `text` | 0.24 0.012 60 | `#241E1A` | chữ chính | 16,46:1 ✅ | chắc |
| `primary` | 0.58 0.19 38 | `#D24100` | nút chính (chữ trắng) | trắng trên cam 4,67:1 ✅ | chắc |
| `primary-hover` | 0.52 0.18 38 | `#B93200` | hover nút chính | 5,97:1 ✅ | chắc |
| `primary-soft` | 0.96 0.03 50 | `#FFEDE0` | nền mục menu đang chọn | — | chắc |
| `link` | 0.52 0.17 38 | `#B53700` | liên kết | 5,98:1 ✅ | chắc |
| `nav-active` | 0.5 0.17 38 | `#AE3100` | chữ mục menu đang chọn | 5,69:1 trên primary-soft ✅ | chắc |
| TONE `info` | bg 0.95 0.03 245 / fg 0.43 0.12 245 | `#DFF1FF` / `#00548C` | đang chạy | 6,86:1 ✅ | chắc |
| TONE `slate` | bg 0.95 0.012 260 / fg 0.45 0.04 260 | `#EAEFF7` / `#48566C` | đã sắp xếp, có thể rút | 6,44:1 ✅ | chắc |
| TONE `warning` | bg 0.95 0.06 90 / fg 0.47 0.1 75 | `#FEEEC1` / `#7B5100` | chờ khách | 6,03:1 ✅ | chắc |
| TONE `danger` | bg 0.95 0.035 22 / fg 0.5 0.19 22 | `#FFE6E4` / `#B7162D` | cần can thiệp | 5,59:1 ✅ | chắc |
| TONE `success` | bg 0.95 0.045 148 / fg 0.45 0.13 148 | `#DBF7DE` / `#016826` | hoàn tất | 6,10:1 ✅ | chắc |
| TONE `neutral` | bg 0.95 0.003 60 / fg 0.48 0.01 60 | `#F0EEEC` / `#625C58` | đã huỷ, đã hoàn | 5,69:1 ✅ | chắc |
| `scheduled` | bg 0.97 0.035 90 / fg 0.45 0.1 75 | `#FEF5DB` / `#754B00` | khối "đã lên lịch" | 6,98:1 ✅ | chắc |
| Bóng khung | `0 1px 2px rgba(40,30,20,.06), 0 16px 44px rgba(40,30,20,.10)` | | khung màn hình | | chắc |
| Bóng menu | `0 10px 30px rgba(40,30,20,.12–.14)` | | dropdown | | chắc |
| Bóng drawer | `-12px 0 40px rgba(30,24,18,.18)`, scrim `rgba(30,24,18,.28)` | | drawer 440px | | chắc |

**Thang chữ:** Page 24/600 · Section 15/600 · Body 13,5/400 · Label 11,5/600 hoa, tracking .05em · Mono 12/500 · nhóm menu 11/600 hoa, tracking .07em. [C] dòng 541–546.

**Icon:** concept **không** dùng bộ icon nào (chuông, tìm kiếm vẽ bằng `div`; mũi tên là ký tự ▾ › ←). → bỏ ngỏ.

## 3. Đặc điểm nhận diện
1. **Trung tính ấm** (hue 60) chiếm gần hết giao diện; màu chỉ xuất hiện ở trạng thái và ở **một** nút cam.
2. **Badge pill có chấm tròn 6px** cùng màu chữ, nền nhạt cùng sắc.
3. **Đường liền nối các mốc** (timeline đơn, chuỗi kế thừa tham số): chấm đặc = đã xong, vòng xanh = đang ở đây, vòng xám = chưa tới.
4. **Tab gạch chân cam 2px + số lượng trong pill xám**; bảng tiêu đề chữ hoa 11,5px, dòng 50px, mã đơn mono.
5. **Sidebar trắng 232px**, nhóm menu chữ hoa nhạt, badge số việc chờ (Khiếu nại đỏ, còn lại xám), logo + tag "ADMIN".

## 4. Bỏ ngỏ — đưa lên Cổng 2
1. **App di động** (Khách hàng, Nhà cung cấp): concept không có gì. Cần chọn cách hiểu cho giao diện di động trên cùng token.
2. **Nền tối:** concept chỉ có nền sáng.
3. **Bộ icon:** concept không dùng icon.
4. **Biểu đồ:** concept chưa có (finance-flow cần biểu đồ cột GMV + Hoa hồng).
5. **`text-subtle` 3,95:1 không đạt AA** — giữ, hay đổi sang oklch(0.55 0.01 60) `#76706C` = 4,88:1.

## 5. Mâu thuẫn
| # | Chỗ | [C] nói | [F]/[E] nói | Xử |
|---|---|---|---|---|
| 1 | Tiền nhà cung cấp nhận | VN-240931 450.000 ₫: hoa hồng 15% 67.500 ₫, **nhà cung cấp nhận 382.500 ₫** (không trừ thuế) | [F] VN-240918 450.000 ₫: hoa hồng 67.500 ₫, **thuế 9.000 ₫** (2%), nhận **373.500 ₫** | Đưa lên Cổng 2 |
| 2 | File đầu ra | — | [F] đặt tên `Admin Prototype - Tai chinh.dc.html`, khổ cố định 1440×900 | Skill này xuất HTML thường, chạy mọi trình duyệt; Admin thiết kế cho 1440×900, vẫn co giãn ≥ 1280. Không hỏi (người dùng đã chỉ định skill) |
| 3 | Khuyến mãi | IA 18 mục không có | [E] mục 3 phạm vi có nhắc "khuyến mãi" nhưng không có dòng chức năng nào; [F] ghi ngoài phạm vi | Không làm. Ghi vào danh sách ngoài phạm vi |
| 4 | Menu "Tài chính" | 3 mục: Giao dịch & đối soát · Rút tiền · Hoàn tiền & tạm giữ | [F] giống hệt | Không mâu thuẫn |
