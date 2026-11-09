import { test, expect } from "@playwright/test";
const key = "trustcircle.demo.v1";
const dialog = (p) => p.getByRole("dialog");
async function close(p) {
  await p.getByRole("button", { name: "Đóng", exact: true }).click();
}
async function login(p, name = "hocsinh", password = "Demo123!") {
  await p.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await p.getByLabel("Tên đăng nhập", { exact: true }).fill(name);
  await p.getByLabel("Mật khẩu demo", { exact: true }).fill(password);
  await p.getByRole("button", { name: "Đăng nhập demo", exact: true }).click();
  await expect(dialog(p)).toHaveCount(0);
}
async function account(p) {
  await p.getByRole("button", { name: "Tài khoản", exact: true }).click();
}
async function logout(p) {
  await account(p);
  await p.getByRole("button", { name: "Đăng xuất", exact: true }).click();
}
async function register(p, name) {
  await p
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await p.getByLabel("Tên đăng nhập", { exact: true }).fill(name);
  await p.getByLabel("Mật khẩu demo", { exact: true }).fill("MyDemo456!");
  await p.getByLabel("Xác nhận mật khẩu", { exact: true }).fill("MyDemo456!");
  await p
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await expect(dialog(p)).toHaveCount(0);
}
async function addContact(p) {
  await p
    .getByRole("button", { name: "Vòng tròn tin cậy", exact: true })
    .click();
  await p.getByRole("button", { name: "Thêm người", exact: true }).click();
  await p.getByLabel("Tên người bạn tin tưởng").fill("Cô Lan");
  await p.getByLabel("Mối quan hệ").selectOption("Giáo viên");
  await p.getByLabel("Cách liên hệ").fill("Phòng giáo viên — dữ liệu mẫu");
  await p.getByLabel("Số điện thoại").fill("0901234567");
  await p.getByRole("button", { name: "Lưu người tin cậy" }).click();
  await expect(p.getByRole("button", { name: "Xem Cô Lan" })).toBeVisible();
}
async function share(p, anonymous = true) {
  await p.getByRole("button", { name: "Mình muốn chia sẻ" }).click();
  await p.getByLabel("Chủ đề", { exact: true }).selectOption("Chuyện ở trường");
  await p
    .getByLabel("Điều bạn muốn nói")
    .fill("Tình huống giả định: mình lo trước bài thuyết trình.");
  await p.getByLabel("Gửi ẩn danh").setChecked(anonymous);
  await p.getByRole("button", { name: "Gửi chia sẻ demo" }).click();
  await expect(
    dialog(p).getByRole("heading", { name: /Hồ sơ TC-/ }),
  ).toBeVisible();
}
async function book(p, date = "2030-01-15", time = "09:00") {
  await p
    .getByRole("button", { name: "Đặt lịch tư vấn", exact: true })
    .last()
    .click();
  await p.getByLabel("Ngày gặp", { exact: true }).fill(date);
  await p.getByLabel("Khung giờ", { exact: true }).selectOption(time);
  await p
    .getByLabel("Nội dung cần hỗ trợ")
    .fill("Nội dung giả định để trình diễn đặt lịch.");
  await p
    .getByRole("button", { name: "Đăng ký lịch hẹn demo", exact: true })
    .click();
}

test("guest SOS, existing resources and no external services", async ({
  page,
}) => {
  const errors = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:3100") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "SOS — Hỗ trợ khẩn cấp" }).click();
  await expect(
    page.getByRole("link", { name: /111 — Bảo vệ trẻ em/ }),
  ).toHaveAttribute("href", "tel:111");
  await expect(dialog(page)).toContainText("Nếu người đầu tiên không thể giúp");
  await expect(dialog(page)).toContainText("chưa gửi tín hiệu SOS");
  await close(page);
  await page.getByRole("button", { name: "Hành trang an toàn" }).click();
  await expect(dialog(page)).toContainText("Nhận diện điều không an toàn");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
  await page.getByRole("button", { name: /Ổn áp/ }).click();
  await expect(page.getByText(/Cảm ơn bạn đã chia sẻ/)).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("registration validation, isolation, persistence, password change and contact CRUD", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("hocsinh");
  await page.getByLabel("Mật khẩu demo", { exact: true }).fill("MyDemo456!");
  await page
    .getByLabel("Xác nhận mật khẩu", { exact: true })
    .fill("Different456!");
  await page
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await expect(dialog(page).getByRole("alert")).toContainText("chưa khớp");
  await page
    .getByLabel("Xác nhận mật khẩu", { exact: true })
    .fill("MyDemo456!");
  await page
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await expect(dialog(page).getByRole("alert")).toContainText("đã tồn tại");
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("Minh Anh");
  await page
    .getByRole("button", { name: "Đăng ký demo", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: /Chào Minh Anh/ }),
  ).toBeVisible();
  await addContact(page);
  await page.getByRole("button", { name: "Xem Cô Lan" }).click();
  await page.getByRole("button", { name: "Chỉnh sửa", exact: true }).click();
  await page.getByLabel("Tên người bạn tin tưởng").fill("Cô Lan Mới");
  await page.getByRole("button", { name: "Lưu người tin cậy" }).click();
  await close(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Chào Minh Anh/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Vòng tròn tin cậy", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Xem Cô Lan Mới" }),
  ).toBeVisible();
  await close(page);
  await account(page);
  await page.getByLabel("Mật khẩu hiện tại").fill("MyDemo456!");
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill("Changed789!");
  await page.getByLabel("Xác nhận mật khẩu mới").fill("Changed789!");
  await page.getByRole("button", { name: "Lưu mật khẩu demo" }).click();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await login(page, "hocsinh");
  await page
    .getByRole("button", { name: "Vòng tròn tin cậy", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Xem Cô Lan Mới" }),
  ).toHaveCount(0);
  await close(page);
  await logout(page);
  await login(page, "Minh Anh", "Changed789!");
  await page
    .getByRole("button", { name: "Vòng tròn tin cậy", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem Cô Lan Mới" }).click();
  await expect(
    page.getByRole("link", { name: "Gọi số liên hệ đã nhập" }),
  ).toHaveAttribute("href", "tel:0901234567");
  await page.getByRole("button", { name: "Xóa người này" }).click();
  await page.getByRole("button", { name: "Xác nhận xóa", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Xem Cô Lan Mới" }),
  ).toHaveCount(0);
  await expect(dialog(page)).toContainText("Chưa có người tin cậy");
});

test("named and anonymous records, canned responses and counselor workflow persist", async ({
  page,
}) => {
  await page.goto("/");
  await login(page);
  await share(page, true);
  const id = (await dialog(page).getByRole("heading").innerText()).replace(
    "Hồ sơ ",
    "",
  );
  await expect(dialog(page)).toContainText("Ẩn danh");
  await page
    .getByRole("button", { name: "Minh họa phản hồi mẫu theo chủ đề" })
    .click();
  await expect(dialog(page)).toContainText("Phản hồi viết sẵn");
  await close(page);
  await share(page, false);
  await expect(dialog(page)).toContainText("hocsinh");
  await close(page);
  await page.getByRole("button", { name: "Bắt đầu trò chuyện" }).click();
  await page
    .getByLabel("Điều bạn muốn nói")
    .fill("Tình huống mẫu: cần người lắng nghe câu hỏi.");
  await page.getByRole("button", { name: "Bắt đầu trao đổi demo" }).click();
  await expect(dialog(page)).toContainText("Chờ tiếp nhận");
  await close(page);
  await page
    .getByRole("button", { name: "Chuyển sang người tư vấn demo" })
    .click();
  await dialog(page).getByRole("button").filter({ hasText: id }).click();
  await page.getByLabel("Mức ưu tiên demo").selectOption("Cần theo dõi");
  await page
    .getByLabel("Phản hồi người tư vấn demo")
    .fill("Đây là lời phản hồi do người tư vấn demo nhập.");
  await page.getByRole("button", { name: "Lưu lời nhắn demo" }).click();
  await page.getByLabel("Trạng thái hồ sơ").selectOption("Đã hoàn thành");
  await close(page);
  await page.getByRole("button", { name: "Chuyển sang học sinh demo" }).click();
  await dialog(page).getByRole("button").filter({ hasText: id }).click();
  await expect(dialog(page)).toContainText("Đã hoàn thành");
  await expect(dialog(page)).toContainText("Đây là lời phản hồi");
  await page.reload();
  await page.getByRole("button", { name: /Hồ sơ của tôi/ }).click();
  await dialog(page).getByRole("button").filter({ hasText: id }).click();
  await expect(dialog(page)).toContainText("Đã hoàn thành");
  const records = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)).cases,
    key,
  );
  const anonymous = records.find((c) => c.record.id === id).record;
  expect(anonymous).not.toHaveProperty("studentName");
  expect(JSON.stringify(anonymous)).not.toContain("hocsinh");
});

test("appointments conflict, counselor confirmation, rescheduling and cancellation", async ({
  page,
}) => {
  await page.goto("/");
  await login(page);
  await book(page);
  await expect(dialog(page)).toContainText("Chờ xác nhận");
  await close(page);
  await book(page);
  await expect(dialog(page).getByRole("alert")).toContainText(
    "đã có lịch demo",
  );
  await close(page);
  await page
    .getByRole("button", { name: "Chuyển sang người tư vấn demo" })
    .click();
  await page.getByRole("button", { name: /Lịch hẹn \(/ }).click();
  await page.getByRole("button", { name: "Xác nhận lịch demo" }).click();
  await expect(dialog(page)).toContainText("Đã xác nhận");
  await page
    .getByRole("button", { name: "Đề nghị đổi lịch", exact: true })
    .click();
  await page.getByLabel("Ngày đề nghị").fill("2030-01-16");
  await page.getByLabel("Giờ đề nghị").selectOption("14:00");
  await page.getByRole("button", { name: "Lưu đề nghị đổi lịch" }).click();
  await expect(dialog(page)).toContainText("Đề nghị đổi lịch");
  await close(page);
  await page.getByRole("button", { name: "Chuyển sang học sinh demo" }).click();
  await close(page);
  await page.getByRole("button", { name: "Lịch của tôi", exact: true }).click();
  await expect(dialog(page)).toContainText("2030-01-16");
  await page
    .getByRole("button", { name: "Đồng ý giờ mới, chờ xác nhận" })
    .click();
  await expect(dialog(page)).toContainText("Chờ xác nhận");
  await page.getByRole("button", { name: "Hủy lịch", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận hủy", exact: true }).click();
  await expect(dialog(page)).toContainText("Đã hủy");
  await close(page);
  await book(page, "2030-01-16", "14:00");
  await expect(dialog(page)).toContainText("Chờ xác nhận");
  await close(page);
  await page
    .getByRole("button", { name: "Chuyển sang người tư vấn demo" })
    .click();
  await page.getByRole("button", { name: /Lịch hẹn \(/ }).click();
  await page.getByRole("button", { name: "Hủy lịch", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận hủy", exact: true }).click();
  const list = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)).appointments,
    key,
  );
  expect(list.every((a) => a.status === "Đã hủy")).toBeTruthy();
});

test("counselor login, reset confirmation and mobile layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await login(page, "tuvan");
  await page
    .getByRole("button", { name: "Quản trị demo", exact: true })
    .click();
  await expect(dialog(page)).toContainText("TC-MAU-001");
  await close(page);
  await account(page);
  await page
    .getByRole("button", { name: "Khôi phục dữ liệu demo ban đầu" })
    .click();
  await page.getByRole("button", { name: "Giữ dữ liệu hiện tại" }).click();
  await expect(page.getByRole("heading", { name: /Chào tuvan/ })).toBeVisible();
  await account(page);
  await page
    .getByRole("button", { name: "Khôi phục dữ liệu demo ban đầu" })
    .click();
  await page
    .getByRole("button", { name: "Xác nhận khôi phục", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBeFalsy();
  await page.getByRole("button", { name: "SOS — Hỗ trợ khẩn cấp" }).click();
  expect(
    await dialog(page).evaluate((e) => e.scrollWidth > e.clientWidth),
  ).toBeFalsy();
});

test("malformed or unavailable storage does not blank the page or erase existing data", async ({
  page,
}) => {
  await page.addInitScript((k) => {
    localStorage.setItem(k, "original invalid demo data");
  }, key);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Chào bạn/ })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Bản cũ được giữ nguyên");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    "original invalid demo data",
  );
  await page.getByRole("button", { name: "SOS — Hỗ trợ khẩn cấp" }).click();
  await expect(dialog(page)).toContainText("SOS");
  await close(page);
});

test("storage write failure remains usable with an explicit warning", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("QuotaExceeded", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Chào bạn/ })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    "chỉ tồn tại trong phiên này",
  );
});
