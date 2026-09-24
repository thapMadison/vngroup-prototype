/* Vương Nhân · bộ dữ liệu chung (DESIGN.md §9). Hôm nay thứ Năm 24/09/2026, TP. Hồ Chí Minh.
   Số liệu là số minh hoạ. Tổng tháng 9 cộng khớp finance-flow.md. Chuỗi song ngữ viết dạng [vi, en]. */
(function (W) {
  'use strict';

  /* ---------- Danh mục ngành ---------- */
  var CATS = [
    { id: 'ac', vi: 'Điện lạnh', en: 'Air conditioning', icon: 'snowflake', share: 0.34, warranty: 7 },
    { id: 'clean', vi: 'Dọn dẹp', en: 'Cleaning', icon: 'broom', share: 0.24, warranty: 3 },
    { id: 'plumb', vi: 'Điện nước', en: 'Plumbing & electrical', icon: 'drop', share: 0.14, warranty: 3 },
    { id: 'appl', vi: 'Đồ gia dụng', en: 'Appliances', icon: 'washing-machine', share: 0.11, warranty: 7 },
    { id: 'sofa', vi: 'Giặt sofa, nệm', en: 'Sofa & mattress', icon: 'couch', share: 0.09, warranty: 3 },
    { id: 'pest', vi: 'Diệt côn trùng', en: 'Pest control', icon: 'bug', share: 0.08, warranty: 7 }
  ];

  /* ---------- Nhà cung cấp ---------- */
  var PROVIDERS = [
    { id: 'phucan', name: 'Điện lạnh Phúc An', ini: 'PA', type: 'biz', cats: ['ac'], catSplit: { ac: 1 }, status: 'active', ready: [1, 1, 1, 1, 1],
      taxId: '0316 482 915', rep: 'Trần Văn Phúc', phone: '0908 214 387', email: 'phucan.lienhe@gmail.com', addr: '72 Trần Quang Khải, P. Tân Định, TP. Hồ Chí Minh',
      joined: '12/03/2026', bank: { name: 'Vietcombank', no: '6789', holder: 'CONG TY TNHH DIEN LANH PHUC AN', state: 'verified' },
      rating: 4.9, reviews: 312, doneMonth: 23, acceptRate: 94, cancelRate: 1.8, repShare: 0.052,
      bal: { awaiting: 315400, warranty: 2241000, hold: 0, avail: 612500, payout: 2450000 }, flags: [],
      docs: [
        { t: ['Giấy phép kinh doanh', 'Business licence'], exp: [15, 3, 2027], st: 'ok' },
        { t: ['Chứng chỉ nghề điện lạnh', 'HVAC certificate'], exp: [24, 10, 2026], st: 'soon' },
        { t: ['Bảo hiểm nghề nghiệp', 'Professional insurance'], exp: [1, 1, 2027], st: 'ok' },
        { t: ['Chứng chỉ an toàn môi chất lạnh', 'Refrigerant safety certificate'], exp: [10, 9, 2026], st: 'expired' }
      ],
      techs: [
        { n: 'Lê Văn Tài', ini: 'LT', role: ['Kỹ thuật viên', 'Technician'], st: 'busy', skills: ['Điện lạnh', 'Máy giặt'], rating: 4.9, jobs: 86 },
        { n: 'Trần Quốc Huy', ini: 'TH', role: ['Kỹ thuật viên', 'Technician'], st: 'free', skills: ['Điện lạnh'], rating: 4.8, jobs: 64 },
        { n: 'Phạm Minh Đức', ini: 'PĐ', role: ['Trưởng nhóm', 'Team lead'], st: 'moving', skills: ['Điện lạnh', 'Tủ lạnh'], rating: 4.8, jobs: 69 },
        { n: 'Võ Hoàng Nam', ini: 'VN', role: ['Kỹ thuật viên', 'Technician'], st: 'off', skills: ['Điện lạnh'], rating: 4.7, jobs: 41 }
      ],
      hist: [
        [['Mở lại ngành Điện lạnh sau khi bổ sung chứng chỉ', 'Air conditioning resumed after certificate update'], '18/08/2026 09:10', 'Trần Ngọc Hân'],
        [['Tạm dừng ngành Điện lạnh: chứng chỉ nghề hết hạn', 'Air conditioning paused: certificate expired'], '12/08/2026 16:40', 'Trần Ngọc Hân'],
        [['Cập nhật bảo hiểm nghề nghiệp', 'Professional insurance updated'], '02/06/2026 11:25', 'Trần Văn Phúc'],
        [['Duyệt hồ sơ đơn vị', 'Profile approved'], '12/03/2026 14:05', 'Nguyễn Hải']
      ] },
    { id: 'hoabinh', name: 'Kỹ thuật Hoà Bình', ini: 'HB', type: 'biz', cats: ['ac', 'appl'], catSplit: { ac: 0.7, appl: 0.3 }, status: 'active', ready: [1, 1, 1, 1, 1],
      taxId: '0315 907 224', rep: 'Đặng Thành Long', phone: '0937 551 208', email: 'kythuathoabinh@gmail.com', addr: '15 Phan Đăng Lưu, P. Gia Định, TP. Hồ Chí Minh',
      joined: '20/03/2026', bank: { name: 'ACB', no: '2210', holder: 'CONG TY TNHH KY THUAT HOA BINH', state: 'verified' },
      rating: 4.8, reviews: 241, doneMonth: 31, acceptRate: 91, cancelRate: 2.4, repShare: 0.041,
      bal: { awaiting: 805100, warranty: 3405000, hold: 0, avail: 486000, payout: 3120000 }, flags: [],
      docs: [
        { t: ['Giấy phép kinh doanh', 'Business licence'], exp: [30, 6, 2028], st: 'ok' },
        { t: ['Bảo hiểm nghề nghiệp', 'Professional insurance'], exp: [8, 11, 2026], st: 'soon' },
        { t: ['Chứng chỉ nghề điện lạnh', 'HVAC certificate'], exp: [2, 4, 2027], st: 'ok' }
      ],
      techs: [
        { n: 'Đặng Thành Long', ini: 'ĐL', role: ['Chủ đơn vị', 'Owner'], st: 'free', skills: ['Điện lạnh', 'Máy giặt'], rating: 4.8, jobs: 58 },
        { n: 'Lý Văn Sang', ini: 'LS', role: ['Kỹ thuật viên', 'Technician'], st: 'busy', skills: ['Đồ gia dụng'], rating: 4.7, jobs: 47 }
      ],
      hist: [[['Duyệt hồ sơ đơn vị', 'Profile approved'], '20/03/2026 10:30', 'Nguyễn Hải']] },
    { id: 'sachxanh', name: 'Sạch Xanh Home', ini: 'SX', type: 'biz', cats: ['clean', 'sofa'], catSplit: { clean: 0.75, sofa: 0.25 }, status: 'paused', pausedCat: 'sofa', ready: [1, 0, 1, 1, 1],
      taxId: '0317 215 604', rep: 'Ngô Thị Thu', phone: '0976 330 912', email: 'sachxanhhome@gmail.com', addr: '41 Lê Văn Sỹ, P. Nhiêu Lộc, TP. Hồ Chí Minh',
      joined: '05/04/2026', bank: { name: 'Techcombank', no: '8823', holder: 'CONG TY TNHH SACH XANH HOME', state: 'pending', changed: 2 },
      rating: 4.8, reviews: 188, doneMonth: 27, acceptRate: 89, cancelRate: 3.1, repShare: 0.038,
      bal: { awaiting: 298800, warranty: 1460800, hold: 747000, avail: 215000, payout: 1800000 }, flags: ['bankChanged'],
      docs: [
        { t: ['Giấy phép kinh doanh', 'Business licence'], exp: [1, 12, 2027], st: 'ok' },
        { t: ['Chứng chỉ giặt thảm, sofa', 'Upholstery cleaning certificate'], exp: [1, 9, 2026], st: 'expired', paused: true },
        { t: ['Bảo hiểm nghề nghiệp', 'Professional insurance'], exp: [15, 2, 2027], st: 'ok' }
      ],
      techs: [
        { n: 'Ngô Thị Thu', ini: 'NT', role: ['Chủ đơn vị', 'Owner'], st: 'busy', skills: ['Dọn dẹp', 'Giặt sofa'], rating: 4.9, jobs: 74 },
        { n: 'Đinh Thị Hoa', ini: 'ĐH', role: ['Kỹ thuật viên', 'Technician'], st: 'free', skills: ['Dọn dẹp'], rating: 4.8, jobs: 52 }
      ],
      hist: [
        [['Đổi tài khoản ngân hàng nhận tiền', 'Payout bank account changed'], '22/09/2026 21:14', 'Ngô Thị Thu'],
        [['Tạm dừng ngành Giặt sofa, nệm: chứng chỉ hết hạn', 'Sofa & mattress paused: certificate expired'], '02/09/2026 08:30', 'Trần Ngọc Hân'],
        [['Duyệt hồ sơ đơn vị', 'Profile approved'], '05/04/2026 15:40', 'Nguyễn Hải']
      ] },
    { id: 'antam', name: 'An Tâm Pest', ini: 'AT', type: 'biz', cats: ['pest'], catSplit: { pest: 1 }, status: 'active', ready: [1, 1, 1, 1, 1],
      taxId: '0316 004 751', rep: 'Lâm Chí Thanh', phone: '0909 612 045', email: 'antampest@gmail.com', addr: '203 Nguyễn Thị Thập, P. Tân Mỹ, TP. Hồ Chí Minh',
      joined: '28/03/2026', bank: { name: 'BIDV', no: '4417', holder: 'CONG TY TNHH AN TAM PEST', state: 'verified' },
      rating: 4.5, reviews: 96, doneMonth: 14, acceptRate: 72, cancelRate: 12, repShare: 0.021,
      bal: { awaiting: 539500, warranty: 1120500, hold: 0, avail: 390000, payout: 1250000 }, flags: ['cancelHigh'],
      docs: [{ t: ['Giấy phép kinh doanh', 'Business licence'], exp: [9, 1, 2028], st: 'ok' }, { t: ['Chứng chỉ hành nghề diệt côn trùng', 'Pest control licence'], exp: [30, 5, 2027], st: 'ok' }],
      techs: [{ n: 'Lâm Chí Thanh', ini: 'LT', role: ['Chủ đơn vị', 'Owner'], st: 'busy', skills: ['Diệt côn trùng'], rating: 4.5, jobs: 38 }],
      hist: [[['Duyệt hồ sơ đơn vị', 'Profile approved'], '28/03/2026 09:15', 'Nguyễn Hải']] },
    { id: 'thotam', name: 'Thợ Tâm', ini: 'TT', type: 'free', cats: ['plumb'], catSplit: { plumb: 1 }, status: 'locked', ready: [1, 1, 0, 1, 0],
      taxId: '8520 116 347', rep: 'Hồ Văn Tâm', phone: '0918 207 553', email: 'thotam.suachua@gmail.com', addr: '9 Hoàng Hoa Thám, P. Bình Thạnh, TP. Hồ Chí Minh',
      joined: '14/04/2026', bank: { name: 'Sacombank', no: '0935', holder: 'HO VAN TAM', state: 'verified' },
      rating: 4.3, reviews: 57, doneMonth: 9, acceptRate: 80, cancelRate: 6.5, repShare: 0.012,
      bal: { awaiting: 431600, warranty: 697200, hold: 0, avail: 1204000, payout: 0 }, flags: ['locked'],
      lockReason: 'Ba khiếu nại về thái độ trong 7 ngày, đang xác minh',
      docs: [{ t: ['Căn cước công dân', 'Citizen ID'], exp: [3, 5, 2034], st: 'ok' }, { t: ['Chứng chỉ nghề điện dân dụng', 'Electrician certificate'], exp: [30, 9, 2026], st: 'soon' }],
      techs: [{ n: 'Hồ Văn Tâm', ini: 'HT', role: ['Chủ đơn vị', 'Owner'], st: 'locked', skills: ['Điện nước'], rating: 4.3, jobs: 51 }],
      hist: [[['Khoá tài khoản: ba khiếu nại về thái độ trong 7 ngày', 'Account locked: three conduct complaints in 7 days'], '23/09/2026 18:40', 'Trần Ngọc Hân'], [['Duyệt hồ sơ đơn vị', 'Profile approved'], '14/04/2026 11:00', 'Nguyễn Hải']] },
    { id: 'giakhang', name: 'Diệt khuẩn Gia Khang', ini: 'GK', type: 'biz', cats: ['pest'], catSplit: { pest: 1 }, status: 'pending', ready: [0, 0, 1, 1, 0], region: 'TP. Hồ Chí Minh',
      submitted: 120, taxId: '0318 663 920', rep: 'Phan Gia Khang', phone: '0934 118 260', email: 'giakhang.pest@gmail.com', addr: '58 Lũy Bán Bích, P. Tân Phú, TP. Hồ Chí Minh',
      bank: { name: 'Techcombank', no: '5102', state: 'pending' }, bal: {}, flags: [],
      docs: [{ t: ['Giấy phép kinh doanh', 'Business licence'], ok: 1 }, { t: ['Chứng chỉ hành nghề diệt côn trùng', 'Pest control licence'], ok: 1 }, { t: ['Bảo hiểm nghề nghiệp', 'Professional insurance'], ok: 1 }], techs: [], hist: [] },
    { id: 'nhasach', name: 'Nhà Sạch Pro', ini: 'NS', type: 'free', cats: ['clean'], catSplit: { clean: 1 }, status: 'pending', ready: [0, 0, 1, 0, 1], region: 'TP. Hồ Chí Minh (P. Thủ Dầu Một)',
      submitted: 1440, taxId: '8631 402 118', rep: 'Võ Thị Mỹ Duyên', phone: '0963 208 441', email: 'nhasachpro@gmail.com', addr: '12 Yersin, P. Thủ Dầu Một, TP. Hồ Chí Minh',
      bank: { name: 'MB Bank', no: '3341', state: 'pending' }, bal: {}, flags: [],
      docs: [{ t: ['Căn cước công dân', 'Citizen ID'], ok: 1 }, { t: ['Chứng chỉ vệ sinh công nghiệp', 'Cleaning certificate'], ok: 0 }], techs: [], hist: [] },
    { id: 'minhkhoa', name: 'Điện nước Minh Khoa', ini: 'MK', type: 'biz', cats: ['plumb'], catSplit: { plumb: 1 }, status: 'pending', ready: [0, 0, 1, 1, 1], region: 'TP. Hồ Chí Minh',
      submitted: 4320, taxId: '0317 880 435', rep: 'Trương Minh Khoa', phone: '0907 745 390', email: 'dienuocminhkhoa@gmail.com', addr: '77 Âu Cơ, P. Tân Sơn Nhì, TP. Hồ Chí Minh',
      bank: { name: 'Vietcombank', no: '7712', state: 'pending' }, bal: {}, flags: [],
      docs: [{ t: ['Giấy phép kinh doanh', 'Business licence'], ok: 1 }, { t: ['Chứng chỉ nghề điện dân dụng', 'Electrician certificate'], ok: 1 }, { t: ['Bảo hiểm nghề nghiệp', 'Professional insurance'], ok: 1 }], techs: [], hist: [] }
  ];
  var OTHER_PROVIDERS = 209; // số nhà cung cấp khác (không liệt kê)

  /* ---------- Đơn hàng và yêu cầu ---------- */
  // status: req | nobody | unassigned | assigned | moving | progress | signoff | payment | overdue | done | dispute | cancelled
  // money: none | awaiting | warranty | hold | available | payout | paid | refunded
  var ORDERS = [
    { id: 'VN-240931', cust: 'Trần Thu Hà', phone: '0903 418 552', addr: '128 Nguyễn Đình Chiểu, P. Xuân Hòa', prov: 'phucan', tech: 'Lê Văn Tài', cat: 'ac',
      svc: ['Vệ sinh máy lạnh', 'AC cleaning'], pkg: ['Vệ sinh cơ bản · 2 máy treo tường 1-1,5 HP', 'Basic cleaning · 2 wall units 1-1.5 HP'], amount: 450000,
      lines: [[['Vệ sinh cơ bản × 2 máy', 'Basic cleaning × 2 units'], 400000], [['Phí đi lại', 'Travel fee'], 50000]],
      status: 'progress', money: 'none', upd: 10, sched: ['24/09', '10:00-12:00'], started: '10:12', eta: '12:00', pay: null,
      note: ['Máy phòng ngủ bị chảy nước.', 'Bedroom unit is leaking.'],
      ev: [['08:30', ['Khách gửi yêu cầu tới 3 nhà cung cấp', 'Request sent to 3 providers']], ['08:35', ['Điện lạnh Phúc An xác nhận, khung giờ 10:00-12:00', 'Điện lạnh Phúc An confirmed, 10:00-12:00']], ['08:40', ['Khách chọn Điện lạnh Phúc An', 'Customer chose Điện lạnh Phúc An']], ['09:58', ['Kỹ thuật viên Lê Văn Tài lên đường, vị trí cập nhật', 'Technician Lê Văn Tài on the way, location live']], ['10:12', ['Kỹ thuật viên đã đến, check-in GPS cách 18 m', 'Technician arrived, GPS check-in 18 m away']]],
      now: ['Đang thực hiện', 'In progress'],
      chat: [['c', 'Anh ơi máy phòng ngủ chảy nước nhiều, anh kiểm tra giúp em ống thoát nước nhé.', 'The bedroom unit leaks a lot, please check the drain pipe.', '09:05'], ['t', 'Dạ em tới khoảng 10 giờ, em sẽ kiểm tra ống thoát và vệ sinh luôn ạ.', 'I will arrive around 10, I will check the drain and clean it.', '09:07'], ['c', 'Cổng nhỏ bên trái, anh bấm chuông tầng 3 nha.', 'Small gate on the left, ring floor 3.', '10:05']] },
    { id: 'VN-240927', cust: 'Lê Hoàng Yến', phone: '0938 772 410', addr: '26 Hồ Văn Huê, P. Phú Nhuận', prov: 'sachxanh', tech: 'Đinh Thị Hoa', cat: 'clean',
      svc: ['Dọn nhà theo giờ', 'Hourly cleaning'], pkg: ['3 giờ × 120.000 ₫', '3 hours × 120,000 ₫'], amount: 360000, lines: [[['Dọn nhà 3 giờ', 'Cleaning 3 hours'], 360000]],
      status: 'payment', money: 'awaiting', upd: 25, sched: ['24/09', '06:30-09:30'], accepted: '24/09 09:50', dueIn: 23 },
    { id: 'VN-240930', cust: 'Nguyễn Minh Quân', phone: '0907 115 364', addr: '88 Phan Xích Long, P. Cầu Kiệu', prov: 'hoabinh', tech: 'Lý Văn Sang', cat: 'appl',
      svc: ['Sửa máy giặt', 'Washing machine repair'], pkg: ['Kiểm tra và sửa · máy cửa trước', 'Inspect and repair · front loader'], amount: 680000, lines: [[['Công sửa', 'Labour'], 350000], [['Thay bơm xả', 'Drain pump'], 330000]],
      status: 'assigned', money: 'none', upd: 42, sched: ['24/09', '14:00-16:00'] },
    { id: 'YC-58227', req: true, cust: 'Đoàn Minh Trí', phone: '0916 540 227', addr: '19 Trần Não, P. An Khánh', prov: 'hoabinh', provMore: 2, cat: 'plumb',
      svc: ['Sửa điện', 'Electrical repair'], pkg: ['Aptomat nhảy liên tục', 'Breaker keeps tripping'], amount: 250000, status: 'req', money: 'none', upd: 60, sched: ['24/09', '13:00-15:00'], expires: 5 },
    { id: 'VN-240932', cust: 'Tôn Nữ Minh Châu', phone: '0902 887 145', addr: '4 Tú Xương, P. Xuân Hòa', prov: 'phucan', tech: 'Phạm Minh Đức', cat: 'ac',
      svc: ['Vệ sinh máy lạnh', 'AC cleaning'], pkg: ['Vệ sinh cơ bản · 1 máy', 'Basic cleaning · 1 unit'], amount: 250000, lines: [[['Vệ sinh cơ bản × 1 máy', 'Basic cleaning × 1 unit'], 200000], [['Phí đi lại', 'Travel fee'], 50000]],
      status: 'moving', money: 'none', upd: 12, sched: ['24/09', '10:30-12:30'] },
    { id: 'VN-240919', cust: 'Huỳnh Thị Kim Dung', phone: '0912 345 678', addr: '310 Lê Văn Việt, P. Tăng Nhơn Phú', prov: 'phucan', tech: 'Trần Quốc Huy', cat: 'appl',
      svc: ['Sửa tủ lạnh', 'Fridge repair'], pkg: ['Nạp gas tủ lạnh', 'Fridge regas'], amount: 380000, lines: [[['Nạp gas', 'Regas'], 380000]],
      status: 'overdue', money: 'awaiting', upd: 2880, sched: ['21/09', '13:00-15:00'], accepted: '21/09 15:20', overdueDays: 2, dun: 'contacted' },
    { id: 'YC-58140', req: true, cust: 'Lương Thị Hồng Nhung', phone: '0986 203 417', addr: '55 Nguyễn Lương Bằng, P. Tân Mỹ', prov: null, cat: 'pest',
      svc: ['Diệt côn trùng', 'Pest control'], pkg: ['Diệt gián · căn hộ 70 m²', 'Cockroach treatment · 70 m² flat'], amount: 550000, status: 'nobody', money: 'none', upd: 1500,
      sent: '23/09 09:15', expired: '23/09 09:45', asked: [['antam', 'declined', ['Hết nhân lực', 'No staff available']]], eligibleOther: 0 },
    { id: 'VN-240918', cust: 'Đặng Quốc Việt', phone: '0935 610 882', addr: '71 Võ Văn Tần, P. Bàn Cờ', prov: 'phucan', tech: 'Lê Văn Tài', cat: 'ac',
      svc: ['Vệ sinh máy lạnh', 'AC cleaning'], pkg: ['Vệ sinh cơ bản · 2 máy', 'Basic cleaning · 2 units'], amount: 450000, lines: [[['Vệ sinh cơ bản × 2 máy', 'Basic cleaning × 2 units'], 400000], [['Phí đi lại', 'Travel fee'], 50000]],
      status: 'done', money: 'warranty', upd: 2900, sched: ['22/09', '08:00-10:00'], accepted: '22/09 09:32', paidAt: '22/09 09:40', payMethod: 'ewallet', warrantyEnd: '29/09', warrantyLeft: 5, txn: 'GD-88412' },
    { id: 'VN-240921', cust: 'Võ Thanh Trúc', phone: '0908 431 276', addr: '19 Hoa Lan, P. Đức Nhuận', prov: 'sachxanh', tech: 'Ngô Thị Thu', cat: 'sofa',
      svc: ['Vệ sinh sofa', 'Sofa cleaning'], pkg: ['Giặt sofa vải 3 chỗ', 'Fabric sofa, 3 seats'], amount: 900000, lines: [[['Giặt sofa vải 3 chỗ', 'Fabric sofa 3 seats'], 900000]],
      status: 'dispute', money: 'hold', upd: 990, sched: ['22/09', '14:00-16:00'], accepted: '22/09 16:22', paidAt: '22/09 16:30', payMethod: 'card', warrantyEnd: '25/09', dispute: 'KN-1042', txn: 'GD-88431' },
    { id: 'VN-240925', cust: 'Phạm Gia Bảo', phone: '0903 552 190', addr: '240 Xô Viết Nghệ Tĩnh, P. Thạnh Mỹ Tây', prov: 'thotam', tech: 'Hồ Văn Tâm', cat: 'plumb',
      svc: ['Sửa điện nước', 'Plumbing & electrical repair'], pkg: ['Thay vòi, sửa rò rỉ', 'Tap replacement, leak fix'], amount: 520000, lines: [[['Công sửa', 'Labour'], 300000], [['Vòi sen', 'Shower tap'], 220000]],
      status: 'payment', money: 'awaiting', upd: 1380, sched: ['23/09', '10:30-12:30'], accepted: '23/09 11:40', dueIn: 1, dun: 'none' },
    { id: 'VN-240935', cust: 'Bùi Thanh Tùng', phone: '0932 615 847', addr: '45 Nguyễn Gia Trí, P. Thạnh Mỹ Tây', prov: 'hoabinh', tech: 'Lý Văn Sang', cat: 'appl',
      svc: ['Sửa tủ lạnh', 'Fridge repair'], pkg: ['Tủ không đông đá · thay quạt dàn lạnh', 'Freezer not freezing · evaporator fan'], amount: 750000, lines: [[['Công sửa', 'Labour'], 300000], [['Quạt dàn lạnh', 'Evaporator fan'], 450000]],
      status: 'payment', money: 'awaiting', upd: 1392, sched: ['23/09', '09:00-11:00'], accepted: '23/09 11:25', dueIn: 1, dun: 'none', payMethod: 'cash', cashFail: '23/09 11:30' },
    { id: 'VN-240915', cust: 'Tạ Quang Vinh', phone: '0987 654 321', addr: '12 Đường số 7, P. Tân Hưng', prov: 'hoabinh', tech: 'Lý Văn Sang', cat: 'appl',
      svc: ['Vệ sinh máy giặt', 'Washing machine cleaning'], pkg: ['Vệ sinh lồng giặt', 'Drum cleaning'], amount: 220000, lines: [[['Vệ sinh lồng giặt', 'Drum cleaning'], 220000]],
      status: 'overdue', money: 'awaiting', upd: 4320, sched: ['20/09', '09:00-11:00'], accepted: '20/09 10:45', overdueDays: 3, dun: 'promised', promise: '25/09' },
    { id: 'VN-240912', cust: 'Mai Thanh Tùng', phone: '0976 118 023', addr: '6 Lê Trọng Tấn, P. Tây Thạnh', prov: 'antam', tech: 'Lâm Chí Thanh', cat: 'pest',
      svc: ['Diệt mối', 'Termite treatment'], pkg: ['Diệt mối · nhà phố', 'Termite treatment · townhouse'], amount: 650000, lines: [[['Diệt mối nhà phố', 'Townhouse termite treatment'], 650000]],
      status: 'overdue', money: 'awaiting', upd: 13000, sched: ['14/09', '08:00-10:00'], accepted: '14/09 11:05', overdueDays: 9, dun: 'unreachable' },
    { id: 'VN-240914', cust: 'Bùi Ngọc Lan', phone: '0939 204 718', addr: '33 Nguyễn Văn Đậu, P. Bình Lợi Trung', prov: 'hoabinh', tech: 'Đặng Thành Long', cat: 'plumb',
      svc: ['Lắp máy nước nóng', 'Water heater install'], pkg: ['Lắp đặt · máy 20 lít', 'Installation · 20 L unit'], amount: 1150000, lines: [[['Công lắp', 'Labour'], 450000], [['Vật tư', 'Materials'], 700000]],
      status: 'done', money: 'warranty', upd: 4400, sched: ['21/09', '13:00-15:00'], accepted: '21/09 14:50', paidAt: '21/09 15:02', payMethod: 'qr', warrantyEnd: '24/09', warrantyLeft: 0, txn: 'GD-88370' },
    { id: 'VN-240911', cust: 'Hồ Minh Khang', phone: '0901 776 540', addr: '140 Bùi Viện, P. Bến Thành', prov: 'antam', tech: 'Lâm Chí Thanh', cat: 'pest',
      svc: ['Diệt côn trùng', 'Pest control'], pkg: ['Diệt muỗi, kiến', 'Mosquito and ant treatment'], amount: 750000, status: 'cancelled', money: 'none', upd: 4500, sched: ['21/09', '16:00-18:00'], cancelBy: ['Khách huỷ: bận đột xuất', 'Customer cancelled: unexpected commitment'] },
    { id: 'VN-240913', cust: 'Kiều Anh Thư', phone: '0919 208 773', addr: '52 Nguyễn Trãi, P. Chợ Quán', prov: 'hoabinh', tech: 'Lý Văn Sang', cat: 'appl',
      svc: ['Sửa máy giặt', 'Washing machine repair'], pkg: ['Thay bo mạch', 'Control board replacement'], amount: 1200000, lines: [[['Công sửa', 'Labour'], 300000], [['Bo mạch', 'Control board'], 900000]],
      status: 'done', money: 'warranty', upd: 5000, sched: ['19/09', '09:00-11:00'], accepted: '19/09 10:40', paidAt: '19/09 10:52', payMethod: 'card', warrantyEnd: '26/09', warrantyLeft: 2, txn: 'GD-88205' },
    { id: 'VN-240920', cust: 'Châu Gia Huy', phone: '0933 470 158', addr: '7 Phạm Hùng, P. Chánh Hưng', prov: 'antam', tech: 'Lâm Chí Thanh', cat: 'pest',
      svc: ['Diệt côn trùng', 'Pest control'], pkg: ['Diệt gián, kiến · nhà phố', 'Cockroach and ant · townhouse'], amount: 750000, lines: [[['Phun diệt côn trùng', 'Pest spraying'], 750000]],
      status: 'done', money: 'warranty', upd: 3200, sched: ['22/09', '15:00-17:00'], accepted: '22/09 16:40', paidAt: '22/09 16:55', payMethod: 'ewallet', warrantyEnd: '29/09', warrantyLeft: 5, txn: 'GD-88440' },
    { id: 'VN-240902', cust: 'Trịnh Bảo Ngọc', phone: '0908 227 681', addr: '15 Kỳ Đồng, P. Nhiêu Lộc', prov: 'phucan', tech: 'Lê Văn Tài', cat: 'ac',
      svc: ['Vệ sinh máy lạnh', 'AC cleaning'], pkg: ['Vệ sinh cơ bản · 3 máy', 'Basic cleaning · 3 units'], amount: 650000, lines: [[['Vệ sinh cơ bản × 3 máy', 'Basic cleaning × 3 units'], 600000], [['Phí đi lại', 'Travel fee'], 50000]],
      status: 'done', money: 'paid', upd: 30000, sched: ['02/09', '08:00-10:00'], accepted: '02/09 09:45', paidAt: '02/09 09:51', payMethod: 'card', warrantyEnd: '09/09', paidOut: '14/09', batch: 'L-0914', txn: 'GD-86102' },
    { id: 'VN-240936', cust: 'Nguyễn Ngọc Diễm', phone: '0907 330 845', addr: '21 Trần Nhật Duật, P. Tân Định', prov: 'phucan', tech: null, cat: 'ac',
      svc: ['Vệ sinh máy lạnh', 'AC cleaning'], pkg: ['Vệ sinh cơ bản · 3 máy', 'Basic cleaning · 3 units'], amount: 650000, status: 'unassigned', money: 'none', upd: 35, sched: ['24/09', '14:00-16:00'] },
    { id: 'VN-240934', cust: 'Lâm Quốc Bảo', phone: '0913 008 562', addr: '140 Phan Đăng Lưu, P. Gia Định', prov: 'phucan', tech: 'Lê Văn Tài', cat: 'ac',
      svc: ['Sửa máy lạnh', 'AC repair'], pkg: ['Máy không lạnh · kiểm tra, nạp gas', 'Not cooling · inspect, regas'], amount: 350000, status: 'assigned', money: 'none', upd: 95, sched: ['24/09', '13:00-15:00'] }
  ];
  var ORDER_STATUS = {
    req: ['Chờ nhà cung cấp xác nhận', 'Awaiting provider confirmation', 'warn'],
    nobody: ['Không có nhà cung cấp nhận', 'No provider accepted', 'neutral'],
    unassigned: ['Chờ phân công', 'Awaiting assignment', 'slate'],
    assigned: ['Đã phân công', 'Assigned', 'slate'],
    moving: ['Đang di chuyển', 'On the way', 'info'],
    progress: ['Đang thực hiện', 'In progress', 'info'],
    signoff: ['Chờ nghiệm thu', 'Awaiting sign-off', 'warn'],
    payment: ['Chờ thanh toán', 'Awaiting payment', 'warn'],
    overdue: ['Quá hạn thanh toán', 'Payment overdue', 'danger'],
    dispute: ['Đang khiếu nại', 'In dispute', 'danger'],
    done: ['Hoàn tất', 'Completed', 'ok'],
    cancelled: ['Đã huỷ', 'Cancelled', 'neutral']
  };
  var MONEY_STATUS = {
    awaiting: ['Chờ khách thanh toán', 'Awaiting payment', 'warn'],
    warranty: ['Đang bảo hành', 'In warranty hold', 'info'],
    hold: ['Đang tạm giữ', 'On hold (dispute)', 'danger'],
    available: ['Có thể rút', 'Available', 'slate'],
    payout: ['Đang rút', 'Payout in progress', 'info'],
    paid: ['Đã chi', 'Paid out', 'ok'],
    failed: ['Chi thất bại', 'Payout failed', 'danger'],
    refunded: ['Đã hoàn tiền', 'Refunded', 'neutral'],
    cashPend: ['Tiền mặt, chờ đối soát', 'Cash, to reconcile', 'warn'],
    cashRecon: ['Tiền mặt, đã đối soát', 'Cash, reconciled', 'slate'],
    none: ['Chưa phát sinh', 'Not yet charged', 'neutral']
  };
  var PAY_METHOD = { card: ['Thẻ', 'Card'], ewallet: ['Ví điện tử', 'E-wallet'], qr: ['Chuyển khoản QR', 'QR transfer'], cash: ['Tiền mặt', 'Cash'] };

  /* ---------- Tài chính theo ngày: 01/03 - 24/09/2026 (đồng) ---------- */
  var MONTH_GMV = { 3: 348600000, 4: 617300000, 5: 862100000, 6: 1084500000, 7: 1291800000, 8: 1468200000 };
  var MONTH_REF = { 3: 3100000, 4: 6900000, 5: 10200000, 6: 12800000, 7: 15600000, 8: 19400000 };
  var SEP_GMV = [42300, 25000, 42700, 41400, 60300, 62000, 43500, 44200, 48800, 48000, 44700, 62700, 67700, 48600, 46500, 51000, 53100, 49100, 64900, 71800, 54100, 50100, 52300, 57200];
  var SEP_HH = [5800, 5700, 5500, 5400, 5500, 5600, 5800, 5800, 3300, 5500, 5400, 8000, 8500, 6000, 5900, 6400, 6200, 5900, 8500, 9300, 6600, 6100, 6600, 7000];
  var SEP_REF = [0, 0, 1200, 0, 850, 0, 0, 2400, 0, 600, 0, 1450, 0, 0, 3100, 0, 780, 0, 2250, 0, 1570, 900, 2900, 0]; // = 18.000 nghìn
  var SEP_OUT = { 3: 98000, 7: 121000, 10: 112000, 14: 148000, 17: 139000, 21: 162000 }; // = 780.000 nghìn
  var DIM = { 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 24 };
  function weights(m) {
    var w = [], first = new Date(2026, m - 1, 1).getDay();
    for (var d = 1; d <= DIM[m]; d++) {
      var dow = (first + d - 1) % 7, x = 1 + 0.004 * d + 0.07 * Math.sin(d * 1.3 + m);
      if (dow === 0 || dow === 6) x *= 1.3;
      w.push(x);
    }
    return w;
  }
  function spread(total, w, unit) {
    var s = w.reduce(function (a, b) { return a + b; }, 0), out = [], acc = 0;
    for (var i = 0; i < w.length; i++) { var v = Math.round(total * w[i] / s / unit) * unit; out.push(v); acc += v; }
    out[out.length - 1] += total - acc;
    return out;
  }
  var DAYS = []; // {m, d, dow, gmv, ref, hh, out}
  [3, 4, 5, 6, 7, 8].forEach(function (m) {
    var w = weights(m), g = spread(MONTH_GMV[m], w, 100000), r = spread(MONTH_REF[m], w, 50000);
    var hh = spread(Math.round(MONTH_GMV[m] * 0.15), w, 50000), out = spread(Math.round(MONTH_GMV[m] * 0.83), w, 50000);
    var first = new Date(2026, m - 1, 1).getDay();
    for (var i = 0; i < w.length; i++) DAYS.push({ m: m, d: i + 1, dow: (first + i) % 7, gmv: g[i], ref: r[i], hh: hh[i], out: out[i] });
  });
  for (var i = 0; i < 24; i++) DAYS.push({ m: 9, d: i + 1, dow: (2 + i) % 7, gmv: SEP_GMV[i] * 1000, ref: SEP_REF[i] * 1000, hh: SEP_HH[i] * 1000, out: (SEP_OUT[i + 1] || 0) * 1000 });

  var FIN = {
    days: DAYS,
    outstanding: 242560000, // còn phải trả nhà cung cấp tại thời điểm xem
    rate: { comm: 0.15, tax: 0.02, prov: 0.83 },
    txCount: 2730,
    orderCount: 2652
  };

  /* ---------- Giao dịch thu (trang đầu) ---------- */
  var TXNS = [
    ['GD-88471', 'VN-240927', 360000, 'ewallet', 'pending', '24/09 10:31'],
    ['GD-88468', 'VN-240929', 480000, 'card', 'ok', '24/09 09:58'],
    ['GD-88466', 'VN-240926', 1250000, 'qr', 'ok', '24/09 09:12'],
    ['GD-88463', 'VN-240925', 520000, 'card', 'failed', '24/09 08:40'],
    ['GD-88455', 'VN-240924', 300000, 'ewallet', 'ok', '23/09 20:05'],
    ['GD-88450', 'VN-240923', 650000, 'cash', 'cashPend', '23/09 16:40'],
    ['GD-88445', 'VN-240935', 750000, 'cash', 'cashFail', '23/09 11:30'],
    ['GD-88440', 'VN-240920', 750000, 'ewallet', 'ok', '22/09 16:55'],
    ['GD-88431', 'VN-240921', 900000, 'card', 'ok', '22/09 16:30'],
    ['GD-88420', 'VN-240922', 2200000, 'cash', 'cashPend', '22/09 11:20'],
    ['GD-88412', 'VN-240918', 450000, 'ewallet', 'ok', '22/09 09:40'],
    ['GD-88397', 'VN-240917', 640000, 'qr', 'ok', '21/09 18:22'],
    ['GD-88370', 'VN-240914', 1150000, 'qr', 'ok', '21/09 15:02'],
    ['GD-88366', 'VN-240909', 480000, 'cash', 'cashRecon', '21/09 14:55'],
    ['GD-88352', 'VN-240916', 780000, 'card', 'partial', '21/09 11:40'],
    ['GD-88318', 'VN-240910', 420000, 'ewallet', 'ok', '20/09 19:10'],
    ['GD-88301', 'VN-240907', 900000, 'cash', 'cashRecon', '20/09 10:30'],
    ['GD-88205', 'VN-240913', 1200000, 'card', 'ok', '19/09 10:52'],
    ['GD-87960', 'VN-240908', 560000, 'qr', 'ok', '17/09 14:33'],
    ['GD-86102', 'VN-240902', 650000, 'card', 'ok', '02/09 09:51']
  ];
  var TXN_EXTRA = { 'VN-240929': ['Phan Thị Ngọc Ánh', 'phucan'], 'VN-240926': ['Đỗ Hữu Phước', 'hoabinh'], 'VN-240924': ['Quách Minh Nhật', 'sachxanh'], 'VN-240917': ['Hà Thị Thu Trang', 'phucan'], 'VN-240916': ['Vương Tuấn Kiệt', 'sachxanh'], 'VN-240910': ['La Mỹ Linh', 'antam'], 'VN-240908': ['Tống Phước Lộc', 'hoabinh'], 'VN-240923': ['Nguyễn Thị Mai', 'sachxanh'], 'VN-240922': ['Lê Bảo Châu', 'hoabinh'], 'VN-240909': ['Phạm Quốc Dũng', 'thotam'], 'VN-240907': ['Hồ Thị Lan', 'antam'] };
  var TXN_STATUS = { ok: ['Thành công', 'Succeeded', 'ok'], pending: ['Đang xử lý', 'Processing', 'info'], failed: ['Thất bại', 'Failed', 'danger'], partial: ['Đã hoàn một phần', 'Partially refunded', 'neutral'],
    cashPend: ['Chưa đối soát', 'To reconcile', 'warn'], cashRecon: ['Đã đối soát', 'Reconciled', 'slate'], cashFail: ['Chưa thu được', 'Uncollected', 'danger'] };

  /* ---------- Rút tiền ---------- */
  var PAYOUTS = [
    { id: 'RT-24091', prov: 'phucan', amount: 2450000, fee: 5500, at: '24/09 08:12', st: 'pending', by: 'Trần Văn Phúc' },
    { id: 'RT-24092', prov: 'sachxanh', amount: 1800000, fee: 5500, at: '24/09 07:45', st: 'pending', by: 'Ngô Thị Thu', warn: 'bankChanged', willFail: true },
    { id: 'RT-24093', prov: 'hoabinh', amount: 3120000, fee: 5500, at: '24/09 07:30', st: 'pending', by: 'Đặng Thành Long' },
    { id: 'RT-24094', prov: 'antam', amount: 1250000, fee: 5500, at: '23/09 21:08', st: 'pending', by: 'Lâm Chí Thanh', warn: 'cancelHigh' },
    { id: 'RT-24095', provName: 'Điện máy Quang Minh', amount: 2300000, fee: 5500, at: '23/09 19:40', st: 'pending', by: 'Quách Quang Minh' },
    { id: 'RT-24096', provName: 'Dọn nhà Bảo Ngọc', amount: 1150000, fee: 0, at: '23/09 17:22', st: 'pending', by: 'Lưu Bảo Ngọc' },
    { id: 'RT-24097', provName: 'Điện nước Tường Vy', amount: 1600000, fee: 5500, at: '23/09 15:05', st: 'pending', by: 'Nguyễn Tường Vy' },
    { id: 'RT-24098', provName: 'Máy lọc nước An Khang', amount: 950000, fee: 0, at: '23/09 11:30', st: 'pending', by: 'Tô An Khang' },
    { id: 'RT-24081', provName: 'Sửa khoá Tín Phát', amount: 1340000, fee: 5500, at: '23/09 09:10', st: 'approved', by: 'Mạc Tín Phát', apBy: 'Lê Minh Anh', apAt: '23/09 14:02' },
    { id: 'RT-24079', provName: 'Rèm cửa Hạnh Nguyên', amount: 820000, fee: 0, at: '22/09 20:45', st: 'approved', by: 'Châu Hạnh Nguyên', apBy: 'Lê Minh Anh', apAt: '23/09 14:03' },
    { id: 'RT-24070', prov: 'phucan', amount: 3150000, fee: 5500, at: '12/09 09:20', st: 'paid', by: 'Trần Văn Phúc', batch: 'L-0914', paidAt: '14/09 15:40' },
    { id: 'RT-24068', prov: 'hoabinh', amount: 2780000, fee: 5500, at: '11/09 18:02', st: 'paid', by: 'Đặng Thành Long', batch: 'L-0914', paidAt: '14/09 15:40' },
    { id: 'RT-24072', prov: 'thotam', amount: 600000, fee: 5500, at: '13/09 08:15', st: 'rejected', by: 'Hồ Văn Tâm', reason: ['Vượt số lần rút trong tuần (tối đa 2 lần)', 'Weekly payout limit exceeded (max 2)'], apBy: 'Lê Minh Anh' },
    { id: 'RT-24060', provName: 'Máy lọc nước An Khang', amount: 1100000, fee: 5500, at: '08/09 10:00', st: 'failed', by: 'Tô An Khang', batch: 'L-0910', err: ['Sai tên chủ tài khoản', 'Account holder name mismatch'] }
  ];
  var PAYOUT_RULES = { min: 200000, perWeek: 2, fee: 5500, freePerMonth: 2 };

  /* ---------- Hoàn tiền và tạm giữ ---------- */
  var REFUNDS = [
    { id: 'HT-0923', order: 'VN-240913', kind: 'partial', amount: 600000, reason: ['Thay bo mạch không đúng mã, khách tự mua lại', 'Wrong board model, customer bought replacement'], st: 'pending', by: 'Lê Minh Anh', at: '24/09 09:05' },
    { id: 'HT-0924', order: 'VN-240920', kind: 'full', amount: 750000, reason: ['Kỹ thuật viên không phun đủ khu vực đã thoả thuận', 'Technician did not treat the agreed areas'], st: 'pending', by: 'Phạm Thu Trang', at: '24/09 08:40' },
    { id: 'HT-0918', order: 'VN-240916', kind: 'partial', amount: 280000, reason: ['Giặt thiếu 1 nệm so với bảng chốt', 'One mattress missed vs sign-off sheet'], st: 'done', by: 'Lê Minh Anh', ap: 'Lê Minh Anh', at: '21/09 11:40' },
    { id: 'HT-0915', order: 'VN-240906', kind: 'full', amount: 1450000, reason: ['Phán quyết khiếu nại KN-1031: hoàn toàn bộ', 'Dispute ruling KN-1031: full refund'], st: 'done', by: 'Trần Ngọc Hân', ap: 'Nguyễn Hải', at: '15/09 16:20' },
    { id: 'HT-0912', order: 'VN-240903', kind: 'partial', amount: 400000, reason: ['Chênh lệch khối lượng sau đối chiếu ảnh', 'Quantity difference after photo review'], st: 'done', by: 'Phạm Thu Trang', ap: 'Lê Minh Anh', at: '12/09 10:05' }
  ];
  var REFUND_THRESHOLD = 500000;

  /* ---------- Chờ khách thanh toán: trạng thái đôn đốc ---------- */
  var DUN = { none: ['Chưa liên hệ', 'Not contacted', 'neutral'], contacted: ['Đã liên hệ', 'Contacted', 'info'], promised: ['Hẹn thanh toán', 'Promised to pay', 'warn'], unreachable: ['Không liên lạc được', 'Unreachable', 'danger'] };
  var DUN_NOTES = {
    'VN-240919': [['Trần Ngọc Hân', '23/09 10:15', ['Gọi lần 1, khách hẹn chuyển khoản trong ngày.', 'Call 1, customer promised same-day transfer.']]],
    'VN-240915': [['Trần Ngọc Hân', '23/09 16:40', ['Khách hẹn thanh toán ngày 25/09 sau khi nhận lương.', 'Customer will pay on 25/09 after payday.']], ['Trần Ngọc Hân', '22/09 09:30', ['Gửi tin nhắn nhắc thanh toán.', 'Payment reminder sent.']]],
    'VN-240912': [['Trần Ngọc Hân', '22/09 15:05', ['Gọi 3 lần không nghe máy.', 'Called 3 times, no answer.']], ['Trần Ngọc Hân', '17/09 11:20', ['Gọi lần 1, thuê bao tạm khoá.', 'Call 1, number suspended.']]]
  };

  /* ---------- Điều chỉnh sổ cái ---------- */
  var ADJUSTS = [
    { id: 'DC-0921', prov: 'antam', pocket: 'avail', dir: -1, amount: 55000, reason: ['Phí chuyển khoản lỗi do nhà cung cấp nhập sai số tài khoản', 'Transfer fee from wrong account number'], link: 'L-0917', st: 'approved', by: 'Lê Minh Anh', ap: 'Nguyễn Hải', at: '21/09 10:20' },
    { id: 'DC-0919', prov: 'hoabinh', pocket: 'warranty', dir: 1, amount: 120000, reason: ['Ghi thiếu phụ thu ngoài giờ', 'Missing after-hours surcharge'], link: 'VN-240897', st: 'rejected', by: 'Phạm Thu Trang', ap: 'Nguyễn Hải', at: '19/09 15:45', rej: ['Phụ thu đã có trong bảng chốt, không thiếu', 'Surcharge already on sign-off sheet'] }
  ];
  var POCKETS = { awaiting: ['Chờ khách thanh toán', 'Awaiting payment'], warranty: ['Đang bảo hành', 'In warranty hold'], hold: ['Đang tạm giữ', 'On hold'], avail: ['Có thể rút', 'Available'], payout: ['Đang rút', 'Payout in progress'], debt: ['Công nợ tiền mặt', 'Cash debt'] };

  /* ---------- Đối soát: sao kê mẫu ---------- */
  var RECON = [
    ['L-0921', 'RT-24071', 'Điện lạnh Phúc An', 2890000, 2890000],
    ['L-0921', 'RT-24073', 'Sạch Xanh Home', 1640000, 1640000],
    ['L-0912', 'CT-0912-03', 'Kỹ thuật Hoà Bình', 3200000, 3120000],
    ['L-0912', 'RT-24062', 'An Tâm Pest', 980000, 980000],
    ['L-0912', 'RT-24064', 'Điện máy Quang Minh', 2150000, 2150000]
  ];

  /* ---------- Đối soát tiền mặt ----------
     Tiền mặt nằm trong tay nhà cung cấp, nên phần nền tảng lẽ ra giữ lại như đơn trả qua app (hoa hồng 15% + thuế khấu trừ 2%)
     thành công nợ; nhà cung cấp chuyển khoản về theo mã tham chiếu, kế toán đối chiếu sao kê rồi ghi nhận.
     st: pending (chưa đối soát) | recon (đã đối soát) | fail (kỹ thuật viên báo chưa thu được: không có công nợ, đơn sang Chờ khách thanh toán) */
  var CASH = [
    { order: 'VN-240923', prov: 'sachxanh', cust: 'Nguyễn Thị Mai', tech: 'Đinh Thị Hoa', amount: 650000, done: '23/09 16:40', st: 'pending', txn: 'GD-88450', ref: 'RT-CM-0041' },
    { order: 'VN-240935', prov: 'hoabinh', cust: 'Bùi Thanh Tùng', tech: 'Lý Văn Sang', amount: 750000, done: '23/09 11:30', st: 'fail', txn: 'GD-88445', ref: '', why: ['Khách hẹn chuyển khoản sau khi kiểm tra tủ chạy ổn định', 'Customer will transfer once the fridge runs well'] },
    { order: 'VN-240922', prov: 'hoabinh', cust: 'Lê Bảo Châu', tech: 'Đặng Thành Long', amount: 2200000, done: '22/09 11:20', st: 'pending', txn: 'GD-88420', ref: 'RT-CM-0040' },
    { order: 'VN-240909', prov: 'thotam', cust: 'Phạm Quốc Dũng', tech: 'Hồ Văn Tâm', amount: 480000, done: '21/09 14:55', st: 'recon', txn: 'GD-88366', ref: 'RT-CM-0038', paid: { amount: 81600, date: '22/09/2026', bank: 'FT26265418207', note: '', by: 'Lê Minh Anh', at: '22/09 15:10' } },
    { order: 'VN-240907', prov: 'antam', cust: 'Hồ Thị Lan', tech: 'Lâm Chí Thanh', amount: 900000, done: '20/09 10:30', st: 'recon', txn: 'GD-88301', ref: 'RT-CM-0037', paid: { amount: 153000, date: '21/09/2026', bank: 'FT26264093551', note: '', by: 'Lê Minh Anh', at: '21/09 09:40' } }
  ];
  /* Tài khoản nhận tiền của công ty VN Group (số minh hoạ) */
  var CASH_BANK = ['Techcombank · 1234 5678 910 (tài khoản công ty VN Group)', 'Techcombank · 1234 5678 910 (VN Group company account)'];

  /* ---------- Khiếu nại ---------- */
  var DISPUTES = [
    { id: 'KN-1042', order: 'VN-240921', reason: ['Sofa còn vết ố sau khi giặt', 'Stains remain after cleaning'], opened: '23/09 18:20', age: 990, st: 'open', ask: ['Hoàn một phần 50%', 'Refund 50%'] },
    { id: 'KN-1041', order: 'VN-240917', cust: 'Hà Thị Thu Trang', prov: 'phucan', svc: ['Vệ sinh máy lạnh', 'AC cleaning'], amount: 640000, reason: ['Máy vẫn chảy nước sau vệ sinh', 'Unit still leaking after cleaning'], opened: '23/09 14:05', age: 1250, st: 'open', ask: ['Làm lại', 'Redo'] },
    { id: 'KN-1040', order: 'VN-240910', cust: 'La Mỹ Linh', prov: 'antam', svc: ['Diệt côn trùng', 'Pest control'], amount: 420000, reason: ['Gián xuất hiện lại sau 2 ngày', 'Cockroaches back after 2 days'], opened: '22/09 20:30', age: 2290, st: 'open', ask: ['Làm lại', 'Redo'] },
    { id: 'KN-1038', order: 'VN-240908', cust: 'Tống Phước Lộc', prov: 'hoabinh', svc: ['Sửa máy giặt', 'Washing machine repair'], amount: 560000, reason: ['Tính phí vật tư cao hơn báo giá', 'Parts charged above quote'], opened: '22/09 09:12', age: 2970, st: 'open', ask: ['Hoàn phần chênh lệch', 'Refund the difference'] },
    { id: 'KN-1036', order: 'VN-240905', cust: 'Quách Minh Nhật', prov: 'thotam', svc: ['Sửa điện nước', 'Plumbing repair'], amount: 480000, reason: ['Thái độ không đúng mực', 'Unprofessional conduct'], opened: '21/09 17:48', age: 3900, st: 'open', ask: ['Hoàn toàn bộ', 'Full refund'] }
  ];

  /* ---------- Yêu cầu dịch vụ ---------- */
  var REQUESTS = [
    { id: 'YC-58231', cust: 'Phan Thị Ngọc Ánh', cat: 'ac', svc: ['Vệ sinh máy lạnh', 'AC cleaning'], sent: '24/09 10:35', st: 'waiting', left: 11, asked: [['phucan', 'waiting'], ['hoabinh', 'confirmed', '14:00-16:00'], ['Điện lạnh Minh Tâm', 'waiting']] },
    { id: 'YC-58229', cust: 'Đỗ Hữu Phước', cat: 'clean', svc: ['Dọn nhà theo giờ', 'Hourly cleaning'], sent: '24/09 10:18', st: 'choosing', left: 22, asked: [['sachxanh', 'confirmed', '15:00-18:00'], ['Dọn nhà Bảo Ngọc', 'confirmed', '14:00-17:00'], ['Nhà Xinh Care', 'declined', ['Kín lịch', 'Fully booked']]] },
    { id: 'YC-58227', cust: 'Đoàn Minh Trí', cat: 'plumb', svc: ['Sửa điện', 'Electrical repair'], sent: '24/09 09:40', st: 'waiting', left: 5, asked: [['hoabinh', 'waiting'], ['Điện nước Tường Vy', 'waiting'], ['Thợ điện Quang Vinh', 'declined', ['Ngoài khu vực', 'Out of area']]] },
    { id: 'YC-58224', cust: 'Trần Thu Hà', cat: 'ac', svc: ['Vệ sinh máy lạnh', 'AC cleaning'], sent: '24/09 08:30', st: 'closed', order: 'VN-240931', asked: [['phucan', 'chosen', '10:00-12:00'], ['hoabinh', 'confirmed', '13:00-15:00'], ['Điện lạnh Minh Tâm', 'expired']] },
    { id: 'YC-58219', cust: 'Tôn Nữ Minh Châu', cat: 'ac', svc: ['Vệ sinh máy lạnh', 'AC cleaning'], sent: '24/09 07:50', st: 'closed', order: 'VN-240932', asked: [['phucan', 'chosen', '10:30-12:30']] },
    { id: 'YC-58140', cust: 'Lương Thị Hồng Nhung', cat: 'pest', svc: ['Diệt côn trùng', 'Pest control'], sent: '23/09 09:15', st: 'expired', asked: [['antam', 'declined', ['Hết nhân lực', 'No staff available']]] },
    { id: 'YC-58133', cust: 'Hứa Văn Lực', cat: 'appl', svc: ['Sửa tủ lạnh', 'Fridge repair'], sent: '23/09 08:05', st: 'cancelled', asked: [['hoabinh', 'confirmed', '10:00-12:00'], ['Điện máy Quang Minh', 'waiting']], cancel: ['Khách huỷ: đã tự sửa', 'Customer cancelled: fixed it themselves'] }
  ];
  var REQ_STATUS = { waiting: ['Đang chờ phản hồi', 'Awaiting responses', 'info'], choosing: ['Chờ khách chọn', 'Awaiting customer choice', 'warn'], closed: ['Đã chốt đơn', 'Order placed', 'ok'], expired: ['Hết hạn, không ai nhận', 'Expired, no taker', 'danger'], cancelled: ['Khách đã huỷ', 'Cancelled by customer', 'neutral'] };

  /* ---------- Khách hàng ---------- */
  var CUSTOMERS = [
    ['Trần Thu Hà', '0903 418 552', 'P. Xuân Hòa', 14, 6420000, 'active', '12/03/2026'],
    ['Đặng Quốc Việt', '0935 610 882', 'P. Bàn Cờ', 6, 2280000, 'active', '02/04/2026'],
    ['Võ Thanh Trúc', '0908 431 276', 'P. Đức Nhuận', 4, 2950000, 'active', '18/04/2026'],
    ['Phạm Gia Bảo', '0903 552 190', 'P. Thạnh Mỹ Tây', 3, 1440000, 'active', '07/05/2026'],
    ['Mai Thanh Tùng', '0976 118 023', 'P. Tây Thạnh', 2, 1100000, 'active', '21/06/2026'],
    ['Huỳnh Thị Kim Dung', '0912 345 678', 'P. Tăng Nhơn Phú', 5, 2730000, 'active', '30/03/2026'],
    ['Lê Hoàng Yến', '0938 772 410', 'P. Phú Nhuận', 9, 3860000, 'active', '15/03/2026'],
    ['Cù Đình Hậu', '0906 902 517', 'P. Tân Sơn Nhất', 1, 0, 'locked', '11/08/2026']
  ];
  var CUSTOMER_COUNT = 18412;

  W.VNDATA = {
    CATS: CATS, PROVIDERS: PROVIDERS, OTHER_PROVIDERS: OTHER_PROVIDERS, ORDERS: ORDERS, ORDER_STATUS: ORDER_STATUS, MONEY_STATUS: MONEY_STATUS, PAY_METHOD: PAY_METHOD,
    FIN: FIN, TXNS: TXNS, TXN_EXTRA: TXN_EXTRA, TXN_STATUS: TXN_STATUS, PAYOUTS: PAYOUTS, PAYOUT_RULES: PAYOUT_RULES, REFUNDS: REFUNDS, REFUND_THRESHOLD: REFUND_THRESHOLD,
    DUN: DUN, DUN_NOTES: DUN_NOTES, ADJUSTS: ADJUSTS, POCKETS: POCKETS, RECON: RECON, DISPUTES: DISPUTES, REQUESTS: REQUESTS, REQ_STATUS: REQ_STATUS,
    CUSTOMERS: CUSTOMERS, CUSTOMER_COUNT: CUSTOMER_COUNT, CASH: CASH, CASH_BANK: CASH_BANK
  };
})(window);
