# TRUST CIRCLE – VÒNG TRÒN AN TOÀN

Website **DEMO** mô phỏng quy trình: đăng nhập → tạo vòng tròn tin cậy → chia sẻ → nhận phản hồi mẫu → đặt lịch → theo dõi kết quả. Giữ giao diện React/Vite hiện có, hoạt động như website tĩnh trên Netlify. Không kết nối cơ sở dữ liệu, AI, OAuth hoặc dịch vụ tư vấn bên ngoài. Font được đóng gói cùng website.

## Trải nghiệm nhanh

| Vai trò | Tên đăng nhập | Mật khẩu demo |
| --- | --- | --- |
| Học sinh mẫu | `hocsinh` | `Demo123!` |
| Người tư vấn mẫu | `tuvan` | `Demo123!` |

Có thể đăng ký tài khoản mới bằng tên giả định. Tên đăng nhập không trùng (không phân biệt chữ hoa/thường), mật khẩu demo tối thiểu 8 ký tự và xác nhận phải khớp.

1. Đăng nhập `hocsinh`, hoặc đăng ký tài khoản mới.
2. Mở **Vòng tròn tin cậy** để thêm, chỉnh sửa hoặc xóa tối đa 5 người. Gợi ý chọn 3–5 người, có ít nhất một người ngoài gia đình. Nhấn một người trên vòng tròn để xem thẻ liên hệ.
3. Tại **Góc chia sẻ** hoặc **Tư vấn trực tuyến**, chọn chủ đề, nhập tình huống giả định và chọn ẩn danh hoặc gửi bằng tên đăng nhập. Hồ sơ được cấp mã demo. Xem lại trong **Hồ sơ của tôi**.
4. Trong hồ sơ, chọn **Minh họa phản hồi mẫu theo chủ đề**, hoặc **Chuyển sang người tư vấn demo** để tiếp nhận, phân loại mức ưu tiên, nhập lời phản hồi và cập nhật trạng thái: Chờ tiếp nhận / Đang tư vấn / Đã hoàn thành. Có sẵn hồ sơ `TC-MAU-001` để trình diễn.
5. Chọn **Đặt lịch tư vấn**, người tư vấn giả định, ngày, giờ và nội dung. Lịch bắt đầu ở trạng thái **Chờ xác nhận**. Khu vực người tư vấn có thể xác nhận, đề nghị đổi ngày/giờ hoặc hủy. Học sinh xem trong **Lịch của tôi**, đồng ý giờ mới hoặc hủy yêu cầu. Khung giờ đang có lịch chưa hủy của cùng người tư vấn không thể đặt trùng.
6. **Tài khoản** cho phép đổi mật khẩu demo, đăng xuất và tải bản sao dữ liệu trình duyệt. **Khôi phục dữ liệu demo ban đầu** cần xác nhận; chỉ xóa dữ liệu demo của ứng dụng, không xóa các mục lưu trữ khác.
7. Nút **SOS** luôn dùng được khi chưa đăng nhập: hướng dẫn tìm nơi an toàn, người lớn tin cậy khác nếu người đầu không giúp được, cùng liên kết gọi 111 và 115 tại Việt Nam. Website không gửi tín hiệu cầu cứu thay người dùng.

## Giới hạn bắt buộc của demo

- Chỉ nhập dữ liệu giả định. Không dùng mật khẩu thật, danh tính nhạy cảm, số liên hệ thật hoặc câu chuyện thật của học sinh.
- Tài khoản, trạng thái đăng nhập, vòng tròn, hồ sơ và lịch hẹn lưu trong `localStorage` tại khóa `trustcircle.demo.v1`. Tải lại trang hoặc đăng xuất không xóa tiến trình. Các tài khoản có mã riêng và danh sách dữ liệu riêng trong giao diện học sinh.
- Đây **không phải xác thực hoặc lưu trữ an toàn**. Mật khẩu được băm SHA-256 để tránh lưu nguyên văn, nhưng cơ chế này không đủ bảo vệ mật khẩu thật. Ai có quyền truy cập cùng trình duyệt có thể xem/sửa dữ liệu hoặc chuyển vai trò demo. Không có bảo đảm riêng tư giữa người dùng chung thiết bị.
- Hồ sơ ẩn danh không chứa trường tên đăng nhập và không tự chèn tên vào nội dung. Bao dữ liệu nội bộ vẫn liên kết mã tài khoản để hiển thị lịch sử. Không tuyên bố ẩn danh bảo mật.
- Các phản hồi là nội dung viết sẵn theo chủ đề hoặc do người trình diễn nhập trong vai tư vấn. Không có AI hoặc người tư vấn thật tiếp nhận. Xác nhận lịch demo không phải xác nhận của nhà trường.
- Dữ liệu không đồng bộ giữa thiết bị hoặc trình duyệt. Xóa dữ liệu trình duyệt sẽ mất dữ liệu demo. Khi `localStorage` bị chặn hoặc đầy, giao diện báo rõ thay đổi chỉ còn trong phiên.
- Nếu không đọc được dữ liệu cũ, ứng dụng giữ nguyên bản đã lưu, hiển thị cảnh báo và không tự ghi đè. Có thể sao lưu trước khi chủ động khôi phục. Phiên bản trước chỉ dùng bộ nhớ nên không có dữ liệu bền vững để nhập lại.

## Phát triển và kiểm thử

Yêu cầu: Node.js 24 và npm 11. Dùng checkout hiện có tại `/workspace/trustcircle`; mỗi cloud task đã được cô lập, không tạo Git worktree trừ khi được yêu cầu.

```sh
cd /workspace/trustcircle
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 3000
```

```sh
npm run build
npm test
```

`npm test` khởi động Vite ở cổng 3100 và chạy Playwright Chromium. Nếu máy chưa có Chromium, chạy `npx playwright install chromium`. Nếu có sẵn, có thể đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE` thành đường dẫn trình duyệt; bộ kiểm thử tự nhận `/usr/bin/chromium` trên cloud hiện tại. Các bài kiểm thử dùng dữ liệu giả định trong browser context riêng, không xóa dữ liệu trình duyệt người dùng.

Bộ kiểm thử bao gồm đăng ký/đăng nhập, trùng tên và xác nhận mật khẩu, cá nhân hóa, giữ dữ liệu sau tải lại/đăng xuất, đổi mật khẩu, tách dữ liệu tài khoản, CRUD người tin cậy, hồ sơ có tên/ẩn danh, phản hồi mẫu, vai trò người tư vấn, trạng thái/ưu tiên hồ sơ, lịch hẹn/trùng giờ/đổi/hủy, SOS khách, giao diện di động, tài nguyên cũ, không gọi dịch vụ bên ngoài, lỗi dữ liệu lưu và lỗi hết dung lượng. Các máy mới cần khởi động lại tiến trình server.

## Triển khai Netlify

1. Đăng nhập Netlify → **Add new project** → **Import an existing project** → **GitHub**.
2. Chọn `phuonganhngh/trustcircle`, nhánh `main`.
3. Cấu hình có sẵn trong `netlify.toml`: Node 24, build `npm run build`, publish `dist`.
4. Chọn **Deploy**. Nếu dự án đã kết nối với nhánh `main` và bật tự triển khai, commit mới sẽ kích hoạt build mới.

Hoặc chạy `npm run build` rồi tải thư mục `dist` (chứa trực tiếp `index.html` và `assets`) lên Netlify Drop. Không cần biến môi trường, khóa API hoặc backend.

Mã nguồn trên GitHub không chứng minh Netlify đã triển khai thành công. Việc kiểm tra website công khai cần URL dự án và kết quả build của Netlify. Lỗi lưu cấu hình cloud onboarding đã gặp trước đây độc lập với việc build/triển khai website tĩnh này.
