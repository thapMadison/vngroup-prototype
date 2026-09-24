# Repository Guidelines

## Project Structure & Module Organization
- `requirement/`: nguồn nghiệp vụ.
  - Estimation có chức năng đánh số #1-109; `docs/prototypes/vuong-nhan/site/index.html` đối chiếu theo các số này.
  - Còn có `finance-flow.md`, `order-lifecycle.md`, `provider-management.md`. Số liệu tháng 9 trong prototype phải cộng khớp `finance-flow.md`.
- `docs/prototypes/vuong-nhan/`: prototype dựng bằng skill `sketch-to-site` (`.claude/skills/`).
  - `DECISIONS.md`: nhật ký các cổng.
  - `DESIGN.md`: design system, sơ đồ trang, ma trận quyền khởi tạo; mục 8 là danh sách cấm.
  - `directions/`: 3 hướng thiết kế.
  - `site/`: bản dựng.
  - `_qa/`: bộ kiểm, báo cáo, ảnh chụp.
- `site/` gồm 4 trang HTML thuần, không có bước build. Cả 4 trang dùng chung:
  - `tokens.css`;
  - `core.js` (`window.VN`: `L()`, `money`, `patch`, `bind`, `fold`, `xls`);
  - `data.js` (`window.VNDATA`: một bộ dữ liệu chung, "hôm nay" là 24/09/2026);
  - `icons.js` (hàm `ic(name)`).
- Trang quản trị:
  - `admin-shell.js` (`window.ADMIN`) giữ state `A.S`, menu, phân quyền (`A.S.rb` → `A.sees`/`A.can`) và kịch bản demo.
  - Các file `admin-*.js` còn lại đăng ký trang vào `A.P[page]` và hộp thoại vào `A.M[kind]`.
  - Thứ tự `<script>` trong `admin.html` chính là thứ tự phụ thuộc.
- Hai app dùng `app-core.js` (`window.VNAPP`: ngăn xếp màn, sheet, nhịp 1 giây). `customer.js` (`CUST`) và `provider.js` (`PROV`) khai báo màn `SC`, sheet `SH`, hành động `ACT`.
- Cơ chế vẽ: dựng lại toàn bộ chuỗi HTML qua `VN.patch`, hàm này giữ focus và vị trí cuộn. Sự kiện đi qua `data-act` (vào `ACT`) và `data-in` (vào `IN`). State chỉ nằm trong bộ nhớ, không dùng `localStorage`.

## Build, Test, and Development Commands
- Mở prototype: `Start-Process "docs\prototypes\vuong-nhan\site\index.html"`.
- Link sâu:
  - `admin.html?scenario=14`
  - `admin.html?role=acc&page=orders&tab=attention&lang=en`
  - `customer.html?scenario=3`
- Các lệnh dưới đây chạy từ `docs/prototypes/vuong-nhan`. Cần Node 20 và Edge ở đường dẫn cố định trong `_qa/run.mjs`.
  - Chạy một bộ kiểm (báo cáo JSON in ra stdout):
    `node --experimental-websocket _qa/run.mjs site/admin.html _qa/steps-admin-scn.json _qa/scn 1440 900`
  - Kiểm khổ di động: thêm `390 844 1` vào cuối lệnh.
  - Sinh lại bước kiểm: `cd _qa && python gen_textscan.py` (quét chữ) và `python gen_resp.py` (kiểm 3 khổ).
  - Kiểm cơ giới, phải ra 0 lỗi: `python ../../../.claude/skills/sketch-to-site/scripts/preflight.py site --kind app`.

## Coding Style & Naming Conventions
- JS thuần kiểu ES5: `var`, `function`, mỗi file là một IIFE. Thụt lề 2 dấu cách, nháy đơn. Không dùng framework hay Tailwind; màu là token `oklch` trong `tokens.css`.
- Mọi chữ hiển thị đi qua `L('vi', 'en')`. Tiền dùng `VN.money`, ra dạng `450.000 ₫`.
- Luật trong `DESIGN.md` §8, được preflight và bộ quét chữ kiểm:
  - Chữ hiển thị không có gạch dài, emoji hay ★ (dùng `ic('star-fill')`). Không viết tắt NCC, KTV, TK.
  - Mỗi màn chỉ một nút cam.
  - Thao tác không được phép vẫn hiện, kèm `aria-disabled` và `data-tip` nêu lý do.
  - Không `addEventListener('scroll')`. Chỉ animate `transform`/`opacity`.
  - Vùng chạm trong app ≥ 44 px.

## Testing Guidelines
- Mỗi bước kiểm có dạng `{name, js, wait, check, shot, jpeg}`; `check` là biểu thức JS, kết quả của nó được ghi vào báo cáo.
- Sau mỗi thay đổi, chạy lại mọi bộ kiểm liệt kê ở `_qa/QA.md` §3. Yêu cầu 0 lỗi console, 0 lỗi chữ, 0 tràn ngang.
- Số tiền trong các kịch bản phải giữ đúng giá trị đã ghi trong `_qa/QA.md` (ví dụ kịch bản 1: đã chi 782.450.000 ₫).

## Agent Instructions
- Quyết định của người dùng ghi nguyên văn vào `DECISIONS.md`. Thay đổi sau nghiệm thu ghi vào bảng "Lặp lại sau nghiệm thu"; bằng chứng kiểm ghi vào `_qa/QA.md`.
- Prototype dùng thương hiệu thật của VN Group. Không đăng ra ngoài khi người dùng chưa đồng ý.
- Đường dẫn có `[Tool]`: trong Python phải dùng `glob.escape`. Script vá mã nên ghi thành file rồi chạy, vì heredoc của bash biến `\n` thành xuống dòng thật.
