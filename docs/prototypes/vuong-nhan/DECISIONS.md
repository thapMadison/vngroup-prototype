# Nhật ký quyết định — Vương Nhân · Prototype MVP (Admin + App Khách hàng + App Nhà cung cấp)

> Mỗi cổng một khối. **Đáp án ghi nguyên văn** lời người dùng. Cổng bị bỏ qua thì vẫn ghi: ai cho phép bỏ qua, và nguyên văn câu cho phép.

**Yêu cầu gốc (24/09/2026, nguyên văn):**
> tôi cần dựng prototype cho dự án này:
> - bố cục & design system tham khảo: https://claude.ai/artifact/JpXtRhARPd5y8dy2EDVQ5C
> - website của client: https://vngroup.info/
> - requirement và list chức năng mà tôi assume: Vuong_Nhan_Ballpark_Estimation_22_Sep_2026.md
> - hình dung về flow tài chính cho dự án này: finance-flow.md
>
> sử dụng skill /sketch-to-site để dựng prototype.
> thiết kế cần chuyên nghiệp, dễ hiểu, dễ sử dụng và thể hiện đầy đủ tính năng như estimation.

## 🛑 Cổng 1 · Định hình dự án — 24/09/2026
| Câu hỏi | Đáp án (nguyên văn) | Ghi chú |
|---|---|---|
| Loại sản phẩm | *Không hỏi, suy từ estimation* | Web app / công cụ vận hành (Trang quản trị) + 2 app di động Flutter (Khách hàng, Nhà cung cấp). Nguồn: estimation mục 2, 3 |
| Người dùng chính + thiết bị | *Không hỏi, suy từ estimation* | Admin: vận hành, CSKH, kế toán, lãnh đạo dùng máy tính cả ngày. App: khách hàng và chủ đơn vị/kỹ thuật viên dùng điện thoại |
| Phạm vi | "Cả 3 ứng dụng (Khuyến nghị)" | Trang quản trị 18 mục + App Khách hàng + App Nhà cung cấp, chung một bộ dữ liệu |
| Độ sâu tương tác | "Tài chính sâu, còn lại luồng chính (Khuyến nghị)" | Tài chính theo finance-flow.md (6 kịch bản, 4 vai trò). Module khác: danh sách → chi tiết → thao tác → hộp thoại lý do → toast, có đổi state |
| Tham chiếu + mức bám | "Làm nền, được biến tấu" | Giữ bảng màu, chữ, bo góc của Admin Portal Concept. Bố cục và chuyển động được đề xuất. Cổng 2 hỏi **cách hiểu** |
| Ngôn ngữ | "Song ngữ VI/EN toàn bộ (Khuyến nghị)" | Công tắc VI/EN trên cả 3 ứng dụng |

## 🛑 Cổng 2 · Phong cách — 24/09/2026
Màu, chữ, bo góc khoá theo concept (mức bám "làm nền"), nên cổng này hỏi **cách hiểu**. Tự sửa không hỏi (sàn AA không thương lượng): `text-subtle` oklch(0.6 0.01 60) 3,95:1 → oklch(0.55 0.01 60) `#76706C` 4,88:1. Đã báo người dùng trước khi hỏi.

| Câu hỏi | Lựa chọn đưa ra | Đáp án (nguyên văn) |
|---|---|---|
| Cách hiểu phong cách | 1. Ấm, chuyên nghiệp, gọn (Khuyến nghị) · 2. Thân thiện, cộng đồng · 3. Chính xác, dày dữ liệu | "Thân thiện, cộng đồng" |
| Nền | Sáng cho cả 3 (Khuyến nghị) · Admin sáng, app theo hệ thống · Cả 3 có sáng + tối | "Sáng cho cả 3 (Khuyến nghị)" |
| Nhịp | Chuẩn công cụ vận hành (Khuyến nghị) · Tĩnh hơn · Sống động hơn | "Chuẩn công cụ vận hành (Khuyến nghị)" |
| Mâu thuẫn tiền nhà cung cấp nhận (REFERENCE-READ §5 #1) | Theo finance-flow.md (Khuyến nghị) · Theo concept | "Theo finance-flow.md (Khuyến nghị)" |

**Hệ quả:** Admin giữ mật độ D8 của concept. App di động mềm hơn: thẻ bo 16, ảnh người thật làm chủ (placeholder trung thực tới khi có ảnh), thân chữ 16, hướng dẫn từng bước bằng lời. Thuế khấu trừ 2% gắn nhãn "Giả định, chờ xác nhận".

## 🛑 Cổng 3 · Hướng — 24/09/2026
File: `directions/index.html` (so sánh) · ảnh chụp 1440 và 390 ở `_qa/dir-*.png` · preflight 0 lỗi · 0 tràn ngang · 0 lỗi console.

| Hướng | Trục khác biệt | Chọn? |
|---|---|---|
| A · an toàn · Hàng xóm tin cậy | Nền sáng ấm · theo việc · sidebar 232 + tab 4 · grotesk sạch · Admin dày | |
| B · cân bằng · Hành trình của đơn | Nền kem · theo luồng thời gian (mốc nối đường liền) · sidebar + tab có nút Đặt · tiêu đề 28/700 · mật độ vừa | |
| C · táo bạo · Hội tụ cộng đồng | Khối màu đặc · theo người và nơi chốn · rail icon 72 + tab 4 · số và lời chào 800 | |
**Đáp án (nguyên văn):** "Trộn"
**Trộn (nguyên văn từng câu):**
| Phần | Đáp án |
|---|---|
| Admin: điều hướng + Tổng quan | "B + khối "cần chú ý" của C (Khuyến nghị)" |
| App Khách hàng | "C + hành trình đơn của B" |
| App Nhà cung cấp | "C" |
| Nền chung | "Sáng ấm của concept" |

**Người dùng bổ sung giữa lượt (24/09, nguyên văn):** "tôi có add thêm 2 tài liệu cho các flow cần làm kỹ: order-lifecycle.md, provider-management.md" → đọc ở B5, đưa vào sơ đồ trang.

### Mâu thuẫn từ 2 tài liệu mới — hỏi trước B5 (24/09/2026)
| Mâu thuẫn | Lựa chọn đưa ra | Đáp án (nguyên văn) |
|---|---|---|
| Dữ liệu mẫu lệch (mã #DH-… vs VN-…, tên A-B-C, ngày hết hạn sai so với 24/09/2026, An Tâm Pest vừa chờ duyệt vừa nhận đơn, Sạch Xanh tạm dừng ngành Điện lạnh) | Chuẩn hoá về một bộ chung (Khuyến nghị) · Giữ nguyên văn từng tài liệu | "Chuẩn hoá về một bộ chung (Khuyến nghị)" |
| Huỷ đơn đang thực hiện: "Tiền sẽ được hoàn về ví khách hàng" trong khi khách trả sau nghiệm thu và MVP không có ví | Nói đúng hệ quả theo trạng thái (Khuyến nghị) · Giữ nguyên văn | "Nói đúng hệ quả theo trạng thái (Khuyến nghị)" |
| P3 Hàng chờ duyệt: 3 nút cam/màn, trái mẫu concept | Mẫu Hàng chờ duyệt của concept (Khuyến nghị) · Thẻ dọc, nút viền · Giữ nguyên văn | "Mẫu Hàng chờ duyệt của concept (Khuyến nghị)" |
| Menu: mục con mới cho Đơn hàng, Nhà cung cấp | Mục con lồng dưới mục cha (Khuyến nghị) · Tab trong trang, menu giữ nguyên · Thêm mục phẳng | "Tab trong trang, menu giữ nguyên" |

**Tự xử không hỏi (có căn cứ):** màu trạng thái "tím nhạt / cam / xám" trong tài liệu mới map về TONE của concept (finance-flow: "Không tạo màu hay kiểu component mới"); phân quyền = mô-đun không có quyền thì ẩn khỏi sidebar (finance-flow, concept) còn thao tác không có quyền trong màn nhìn thấy được thì khoá + tooltip (order-lifecycle, concept "thao tác không dùng được vẫn hiện kèm lý do"); Lãnh đạo được xem Đơn hàng (order-lifecycle mở rộng finance-flow).

## 🛑 Cổng 4 · Design system + sơ đồ trang — 24/09/2026
Trình: tóm tắt DESIGN.md (màu, chữ, hình khối, cách tổ chức, cấm riêng, kỹ thuật HTML/CSS/JS thuần không Tailwind) + sơ đồ 4 file (hub, admin 18 mục, app Khách hàng mục 1-36, app Nhà cung cấp mục 38-70) + ma trận phân quyền.
**Đáp án (nguyên văn):** "Duyệt"
**Sửa theo yêu cầu:** không

### B7 · Tự kiểm: lỗi tìm thấy và đã tự sửa (24/09/2026)
Không hỏi vì đều là sàn không thương lượng hoặc luật đã khoá ở DESIGN.md. Chi tiết và bằng chứng ở `_qa/QA.md` §6.
- Admin tràn ngang ở 768/390 px (bề rộng tối thiểu 1280): thêm màn thông báo cho khổ dưới 1024 px, có nút "Vẫn xem, cuộn ngang" và liên kết sang 2 app. Căn cứ: DESIGN.md §6 "Admin thiết kế cho 1440×900, chạy tốt từ 1280".
- Nút Demo đè nội dung: ở Admin chuyển xuống cuối menu trái; ở 2 app khổ 390 chuyển lên giữa thanh trạng thái giả.
- Thiếu trạng thái đang tải và lỗi tải: thêm Mạng (Bình thường · Chậm · Mất kết nối) vào bảng Demo của cả 3 app; thêm vòng quay khi thanh toán.
- Vùng chạm dưới 44 px trên di động (VI/EN, viên lọc, chip): nâng lên 44 px.
- Chữ hiển thị: dấu gạch dài làm ô trống đổi thành "Không có"; ★ đổi thành icon; khung ảnh "IMG" đổi thành "Ảnh bạn gửi, 720×520"; bảng Demo ghi "số minh hoạ".

## 🛑 Cổng 5 · Nghiệm thu — 24/09/2026
**Số kiểm lúc trình:** preflight 0 lỗi · 0 cảnh báo · quét chữ 176 màn/trạng thái, 0 lỗi · 3 khổ 1440/768/390 cho 4 trang, 0 tràn ngang, 0 lỗi console (47 ảnh) · hồi quy 393 bước, 0 lỗi · UX 12 điểm: index 12/12 · admin 12/12 · khách 12/12 · nhà cung cấp 12/12 · soát gu web app 7/7.
**Đáp án (nguyên văn):** "update những phần này rồi chạy nghiệm thu:
1. Danh mục dịch vụ: thêm CRUD
2. Tham số vận hành: bị lỗi scroll nên không xem đầy đủ thông tin được
3. Quản trị viên:
- Tài khoản: có thể chỉnh sửa thông tin Tài khoản cần thiết. Có thể enable/disable account
- Vai trò & quyền: Có thể CRUD
4. Thêm phần Profile cho account."
**Hiểu là:** Sửa theo danh sách (4 mục), xong chạy lại toàn bộ bộ kiểm rồi trình lại Cổng 5.

**Tự quyết khi làm (có căn cứ, không hỏi):**
- Quyền trở thành dữ liệu của vai trò và là nguồn thật của menu. Nếu không, CRUD vai trò chỉ sửa một bảng trang trí; ma trận tĩnh cũ còn lệch với menu thật, ví dụ Kế toán thấy Đơn hàng nhưng ma trận ghi là không có quyền.
- Mục danh mục còn nhà cung cấp hoặc đơn chưa hoàn tất thì không xoá được; hệ thống đề nghị tắt thay vì xoá. Căn cứ: đơn đang chạy tham chiếu tới dịch vụ.
- Email tài khoản không sửa được vì là tên đăng nhập. Người dùng không tự vô hiệu hoá, không tự đổi vai trò; hệ thống luôn giữ ít nhất 1 Super admin đang hoạt động.
- Lỗi cuộn ở Tham số vận hành có cùng nguyên nhân với Đơn hàng và Giao dịch, nên sửa gốc cho cả trang quản trị.

## 🛑 Cổng 5 · Nghiệm thu, lần 2 — 24/09/2026
**Số kiểm lúc trình:**
- preflight: 0 lỗi, 0 cảnh báo.
- Quét chữ: 202 màn/trạng thái, 0 lỗi.
- Quét khối bị cắt: 38 trạng thái trang, 0 khối bị cắt.
- 3 khổ 1440/768/390 cho 4 trang: 0 tràn ngang, 0 lỗi console.
- Hồi quy: 502 bước, 0 lỗi, trong đó 38 bước là CRUD mới.
- UX 12 điểm: index 12/12, admin 12/12, khách 12/12, nhà cung cấp 12/12.
**Đáp án (nguyên văn):** "Chạy laws-of-ux-review (Khuyến nghị)"
**Kết quả review (24/09/2026, `_qa/UX-REVIEW.md`):**
- Điểm từng trang: index 39/40 (58,5/60) · admin 55/58 (56,9/60) · khách 58/60 · nhà cung cấp 57/58 (59/60). Cả 4 trang hạng A.
- Không có lỗi nghiêm trọng. Có 5 cảnh báo: Miller ở index và admin; Postel ở admin; Working Memory ở app khách; Doherty ở app nhà cung cấp. Có 2 gợi ý: Parkinson ở admin và app khách.
- Action plan 7 việc.
**Đáp án sau review (nguyên văn):** "Sửa 7 việc trong action plan (Khuyến nghị)"
**Đã làm:** sửa cả 7 việc (chi tiết và bằng chứng ở `_qa/UX-REVIEW.md` mục "Sau khi sửa"). Chạy lại toàn bộ: 528 bước, 0 lỗi console; quét chữ 206 trạng thái, 0 lỗi; 3 khổ màn hình, 0 tràn ngang; preflight 0 lỗi, 0 cảnh báo. Điểm sau khi sửa: index 40/40 · admin 58/58 · khách 60/60 · nhà cung cấp 58/58.
**Kết luận Cổng 5:** lựa chọn của người dùng ghi rõ "sửa cả 7 việc, chạy lại toàn bộ bộ kiểm, rồi bàn giao". Bộ kiểm đã qua hết, nên chuyển sang bàn giao.

## Cổng được bỏ qua
| Cổng | Người dùng nói (nguyên văn) | Lúc |
|---|---|---|

## Lặp lại sau nghiệm thu
| Ngày | Yêu cầu | Đã làm |
|---|---|---|
| 24/09/2026 | Danh mục dịch vụ: CRUD | Thêm ở mọi cấp, sửa, sắp thứ tự, xoá có kiểm ràng buộc (đang dùng thì đề nghị tắt), CRUD thuộc tính động. Lựa chọn nhập mỗi dòng một cái |
| 24/09/2026 | Tham số vận hành lỗi cuộn | Sửa gốc `.content>*{flex-shrink:0}`; cùng lỗi ở Đơn hàng, Giao dịch |
| 24/09/2026 | Tài khoản: sửa, bật/tắt | Ngăn kéo sửa thông tin + vô hiệu hoá hai bước + kích hoạt lại + các chặn an toàn |
| 24/09/2026 | Vai trò & quyền: CRUD | Tạo, sao chép, sửa, nhân bản, xoá; quyền theo mục menu và 24 thao tác, áp dụng ngay vào menu |
| 24/09/2026 | Profile cho account | Menu tài khoản trên thanh trên; Hồ sơ của tôi 4 tab: Thông tin, Bảo mật, Thông báo, Hoạt động |
| 24/09/2026 | Sửa theo soát UX 30 luật | Tìm kiếm bỏ dấu ở 5 danh sách · check-in GPS có trạng thái chờ · tóm tắt ở bước 4 khi đặt · menu Admin gập nhóm · trang giới thiệu chia nhóm kịch bản, thêm kịch bản 14-16 · giới hạn độ dài ghi chú, có bộ đếm |
| 24/09/2026 | "status bar scroll nhưng bị nhảy về đầu" (hàng lọc cuộn ngang ở màn Yêu cầu, App Nhà cung cấp) | Nguyên nhân: app vẽ lại mỗi giây cho đồng hồ đếm ngược, và `VN.patch` chỉ giữ vị trí cuộn của phần tử có `data-scroll`. Sửa gốc: `VN.patch` giữ vị trí cuộn của mọi phần tử đang cuộn dở và đưa viên đang chọn vào tầm nhìn khi mở màn; lượt vẽ lại theo nhịp giây hoãn khi đang cuộn hay đang chạm (đồng hồ vẫn đếm). Sửa luôn cùng lỗi ở chip trang chủ app khách và menu trái Admin |
| 24/09/2026 | "dùng skill /evolve-site để update những điểm sau: - không cho hủy đơn đổi lịch khi việc đang được thực hiện - nên cho nhà cung cấp xem giấy tờ" | Làm theo `evolve-site`, 3 cổng ghi nguyên văn ở `FEATURE-DECISIONS.md`. App Khách hàng: khi thợ đang làm việc, Huỷ đơn và Đổi lịch khoá (mờ 45%), dưới nút có lý do và lối "Cần dừng việc? Gọi tổng đài"; chặn cả khi gọi thẳng hàm. App Nhà cung cấp: dòng giấy tờ bấm được, màn mới Chi tiết giấy tờ (bản chụp, hạn, ngày nộp, ngày duyệt, tải bản mới có trạng thái đang tải lên), thông báo hết hạn mở thẳng giấy tờ; kỹ thuật viên bị chặn |
| 24/09/2026 | Cổng 3 của `evolve-site` đợt 1: "Chốt tích hợp (Khuyến nghị)"; sửa lỗi có sẵn: "Nút đỏ bị khoá trông như bấm được, Đồng bộ gen_textscan.py, Esc lùi màn trong 2 app" | Nút đỏ bị khoá mờ 45%. Esc lùi màn trong 2 app, không lùi khi đang gõ hay ở màn không có nút lùi. `gen_textscan.py` tái tạo đúng từng byte file bước admin và khách |
| 24/09/2026 | "Hiện tại ở app Khách hàng đang là chức năng đánh giá Kỹ thuật viên -> chức năng này nên là đánh giá dịch vụ của nhà cung cấp. Phần `Thợ được tin chọn ở phường bạn` đang hiển thị có thể làm người dùng hiểu là thợ 5\*, 4.9\* ... chứ không phải là nhà cung cấp. ... Nếu chỉnh sửa thì dùng skill /evolve-site chỉnh sửa tính năng này." | `evolve-site` đợt 2, Cấp 1 không cờ (`FEATURE-DECISIONS.md`). Thẻ trang chủ lấy nhà cung cấp làm chủ thể: "Nhà cung cấp tin cậy ở phường bạn", tên đơn vị, điểm kèm số đánh giá, không có tên kỹ thuật viên. Màn đánh giá thành "Đánh giá dịch vụ" của đơn vị, câu nhắc nêu hồ sơ đơn vị. Chi tiết đơn tách dòng đơn vị (icon cửa hàng) khỏi dòng kỹ thuật viên (không còn sao). DESIGN.md §8 thêm luật điểm sao chỉ gắn với nhà cung cấp |
| 24/09/2026 | Cổng 3 của `evolve-site` đợt 2: "Chốt tích hợp (Khuyến nghị)"; sửa lỗi có sẵn: "Đồng bộ điểm Sạch Xanh Home, Nâng nút sao lên 44 px" | App Khách hàng lấy điểm Sạch Xanh Home 4,8 theo `data.js`. Nút sao ở màn đánh giá thành 44 × 44 px, nhãn tiêu chí nằm trên hàng sao vì cùng hàng thì nhãn không đủ chỗ |
| 24/09/2026 | "dùng /evolve-site update thêm tính năng mới được mô tả trong 3 file: Admin - Cash payment flow.md, Customer App - Cash payment flow.md, Provider App - Cash payment flow.md" | Làm theo `evolve-site` đợt 3 (Cấp 2, cờ Y, L, D, Q, C), quyết định ghi nguyên văn ở `FEATURE-DECISIONS.md`. Người dùng chốt dựng như yêu cầu trong MVP (dù estimation §4 #2 loại trừ) và công nợ tiền mặt tính y như đơn trả qua app: hoa hồng 15% + thuế 2% (đơn 450.000 ₫ nợ 76.500 ₫); không thu được thì không nợ, đơn sang Chờ khách thanh toán. Trang quản trị: lọc Tiền mặt ở Giao dịch thu; tab Đối soát có 2 tab con (Tiền mặt từ nhà cung cấp, Cổng thanh toán và lô chi); ghi nhận chuyển khoản 2 bước; bút toán điều chỉnh chờ duyệt bước hai; kịch bản 17; việc cần xử lý; Ctrl K. App Khách hàng: đặt 5 bước có bước chọn phương thức; chi tiết đơn và biên nhận tiền mặt; kịch bản 07. App Nhà cung cấp: bước thu tiền mặt của kỹ thuật viên; công nợ trong số dư, thẻ công nợ ở Đối soát, dòng thu nhập, rút tiền trừ công nợ; kịch bản 08, 09 |
| 24/09/2026 | Cổng 3 của `evolve-site` đợt 3: "Chốt tích hợp (Khuyến nghị)"; sửa lỗi có sẵn: "Xoá 509 thư mục cdp-* cũ" | Xoá 509 hồ sơ Edge tạm trong TEMP (14,12 GB). `run.mjs` nay tự xoá hồ sơ sau mỗi lần chạy và nhận `CDP_PORT`. Lỗi focus khi mở, đóng lớp phủ để lại theo lựa chọn |
