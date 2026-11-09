# TRUST CIRCLE – VÒNG TRÒN AN TOÀN

Vietnamese student support frontend built with React, Vite, Lucide icons and locally bundled fonts.

## Development

Use the existing `/workspace/trustcircle` checkout. Cloud tasks are isolated; do not create a Git worktree unless explicitly requested.

Requirements: Node.js 24, npm 11.

```sh
cd /workspace/trustcircle
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 3000
```

Processes must be restarted in new tasks. Validate startup with `curl -fsS http://localhost:3000/`. Build with `npm run build`. To serve the production build, use `npm run preview -- --port 3000` after stopping the development server.

## Implemented experience

- Responsive dashboard, mood check-in and safety resources.
- Trusted circle of up to five contacts, add/remove and telephone links.
- Sharing form with anonymous option and client validation.
- Counseling message form and appointment request form.
- Privacy explanation and Vietnam child-protection hotline links.

This is a frontend prototype. Contacts and form input stay in memory for the current page session. Closing or refreshing the page clears them. No account authentication, database, counselor delivery, appointment availability or school notifications are connected. Sample counselor profiles and trusted contacts are illustrative. Confirmation messages explicitly identify the demo behavior. Do not enter real sensitive student information.

Production deployment requires authenticated student/staff access, school-approved privacy and safeguarding procedures, access-controlled backend storage, staff intake and risk triage, counselor responses, appointment confirmation and follow-up. These services are not implemented or verified by this prototype.

## Validation performed

Production build passed. Chromium interaction checks passed for mood selection, contact creation and telephone link, anonymous sharing, counseling message and appointment submission. Desktop (1440 px) and mobile (390 px) layouts were inspected; no horizontal overflow or browser runtime errors were detected in the tested flows. Browser checks used a temporary external Playwright installation and did not add testing dependencies to this application.

## Cloud configuration status

The current instance runs the app on port 3000. Saving `install_script` and `start_skill` through the onboarding configuration API returned `INVALID_ARGUMENT`; persistence was not confirmed. The commands above capture the tested setup and startup instructions, but this document does not replace a successfully saved cloud configuration. Publication and fresh-task restoration have not been verified.

## Đăng bản demo lên Netlify

1. Đăng nhập Netlify, chọn **Add new project** → **Import an existing project** → **GitHub**.
2. Chọn repository `phuonganhngh/trustcircle` và nhánh `main`.
3. Netlify đọc `netlify.toml`: Node.js 24, lệnh build `npm run build`, thư mục xuất bản `dist`.
4. Chọn **Deploy**. Khi build hoàn tất, Netlify cung cấp URL công khai.

Thông báo bản demo xuất hiện ngay trên trang chủ. Biểu mẫu không gửi thông tin đến nhà trường. Đây là hướng dẫn triển khai; việc mã nguồn có trên GitHub không có nghĩa là Netlify đã triển khai thành công.
