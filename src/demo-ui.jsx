import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Plus,
  Heart,
  Phone,
  MessageCircle,
  CalendarDays,
  LogIn,
  ArrowRight,
} from "lucide-react";
import {
  useDemo,
  uid,
  passwordHash,
  today,
  counselNames,
  topics,
  times,
  statuses,
  sampleReply,
  STORAGE_KEY,
} from "./demo-store";
import "./demo.css";
const supported = [
  "login",
  "register",
  "account",
  "manage",
  "circle",
  "add",
  "edit",
  "person",
  "share",
  "chat",
  "history",
  "case",
  "booking",
  "appointments",
  "admin",
  "reset",
  "privacy",
  "help",
];
export const isDemoModal = (modal) =>
  supported.includes(typeof modal === "string" ? modal : modal.type);
export function DemoToolbar({ open }) {
  const d = useDemo();
  return (
    <>
      <div className="demo-tools">
        <span className="demo-mode">CHẾ ĐỘ DEMO</span>
        <div className="demo-tool-links">
          {d.account ? (
            <>
              <span>
                Xin chào, <strong>{d.account.username}</strong> ·{" "}
                {d.role === "counselor" ? "Người tư vấn" : "Học sinh"}
              </span>
              <button onClick={() => open("account")}>Tài khoản</button>
              <button onClick={() => open("history")}>
                Hồ sơ của tôi ({d.ownCases.length})
              </button>
              <button onClick={() => open("appointments")}>Lịch của tôi</button>
              <button
                onClick={() => {
                  d.switchRole();
                  open(d.role === "counselor" ? "history" : "admin");
                }}
              >
                Chuyển sang{" "}
                {d.role === "counselor" ? "học sinh" : "người tư vấn"} demo
              </button>
              {d.role === "counselor" && (
                <button onClick={() => open("admin")}>Quản trị demo</button>
              )}
            </>
          ) : (
            <>
              <span>Trải nghiệm với dữ liệu giả định trên thiết bị này.</span>
              <button onClick={() => open("login")}>Đăng nhập</button>
              <button onClick={() => open("register")}>Đăng ký demo</button>
            </>
          )}
        </div>
      </div>
      {d.storageError && (
        <div className="demo-error" role="alert">
          {d.storageError}
          <button onClick={() => open("account")}>Sao lưu / khôi phục</button>
        </div>
      )}
    </>
  );
}
export function DemoModal({ modal, open, close, notice }) {
  const type = typeof modal === "string" ? modal : modal.type;
  const d = useDemo();
  if (type === "help") return <SOS />;
  if (type === "privacy") return <Privacy />;
  if (["login", "register"].includes(type))
    return (
      <Auth
        key={type}
        register={type === "register"}
        {...{ open, close, notice }}
      />
    );
  if (!d.account)
    return (
      <>
        <h2>Đăng nhập để lưu tiến trình demo</h2>
        <p className="modal-intro">
          Mỗi tài khoản có dữ liệu trình diễn riêng trong trình duyệt này. Đây
          không phải cơ chế bảo mật giữa người dùng chung thiết bị.
        </p>
        <button className="primary" onClick={() => open("login")}>
          <LogIn size={17} />
          Đăng nhập demo
        </button>
        <button className="secondary" onClick={() => open("register")}>
          Tạo tài khoản demo mới
        </button>
        <button className="secondary" onClick={() => open("help")}>
          Mở SOS không cần đăng nhập
        </button>
      </>
    );
  const props = { ...{ open, close, notice }, d };
  if (type === "account") return <Account {...props} />;
  if (type === "reset")
    return (
      <>
        <h2>Khôi phục dữ liệu demo ban đầu?</h2>
        <p className="modal-intro">
          Thao tác này xóa tất cả tài khoản tự tạo, vòng tròn, hồ sơ và lịch hẹn
          của demo trên trình duyệt này. Các dữ liệu khác của trình duyệt không
          bị xóa.
        </p>
        <button
          className="danger-button"
          onClick={() => {
            d.reset();
            notice("Đã khôi phục dữ liệu demo ban đầu");
            close();
          }}
        >
          Xác nhận khôi phục
        </button>
        <button className="secondary" onClick={close}>
          Giữ dữ liệu hiện tại
        </button>
      </>
    );
  if (["manage", "circle"].includes(type)) return <Circle {...props} />;
  if (type === "add" || type === "edit")
    return (
      <ContactForm
        key={modal.person?.id || "new"}
        person={modal.person}
        {...props}
      />
    );
  if (type === "person")
    return (
      <Contact
        person={d.people.find((p) => p.id === modal.person.id) || modal.person}
        {...props}
      />
    );
  if (type === "share" || type === "chat")
    return <NewCase key={type} kind={type} {...props} />;
  if (type === "history") return <History {...props} />;
  if (type === "case") return <CaseDetail id={modal.id} {...props} />;
  if (type === "booking") return <Booking {...props} />;
  if (type === "appointments") return <Appointments {...props} />;
  if (type === "admin") return <Admin {...props} />;
  return null;
}
function Warning() {
  return (
    <div className="info-box">
      Chỉ nhập dữ liệu giả định. Dữ liệu lưu bằng localStorage, không phải lưu
      trữ an toàn; người dùng chung thiết bị có thể xem. Không dùng mật khẩu
      thật, danh tính nhạy cảm hoặc câu chuyện thật. Không có giáo viên, AI hay
      dịch vụ bên ngoài tiếp nhận.
    </div>
  );
}
function Auth({ register, open, close, notice }) {
  const d = useDemo(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget),
      username = f.get("username").trim(),
      password = f.get("password");
    try {
      if (register) {
        if (!/^[\p{L}\p{N}][\p{L}\p{N} _.-]{2,29}$/u.test(username))
          throw Error(
            "Tên đăng nhập cần 3–30 ký tự, gồm chữ, số, khoảng trắng hoặc dấu . _ -",
          );
        if (password.length < 8)
          throw Error("Mật khẩu demo cần ít nhất 8 ký tự.");
        if (password !== f.get("confirm"))
          throw Error("Mật khẩu xác nhận chưa khớp.");
        if (
          d.data.accounts.some(
            (a) =>
              a.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
          )
        )
          throw Error("Tên đăng nhập đã tồn tại trên trình duyệt này.");
        const id = uid(),
          hash = await passwordHash(password);
        d.update((data) => ({
          ...data,
          accounts: [
            ...data.accounts,
            { id, username, hash, role: "student", people: [] },
          ],
          session: { accountId: id, role: "student" },
        }));
        notice("Đã tạo và đăng nhập tài khoản demo");
        close();
      } else {
        const hash = await passwordHash(password),
          account = d.data.accounts.find(
            (a) =>
              a.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
              a.hash === hash,
          );
        if (!account)
          throw Error("Tên đăng nhập hoặc mật khẩu demo chưa đúng.");
        d.login(account.id);
        notice("Đã đăng nhập demo");
        close();
      }
    } catch (err) {
      setError(err.message || "Không thể thực hiện. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="modal-icon">
        <LogIn />
      </div>
      <h2>
        {register ? "Tạo tài khoản demo" : "Chào bạn, cùng trải nghiệm nhé"}
      </h2>
      <Warning />
      <form onSubmit={submit}>
        <label>
          Tên đăng nhập
          <input
            name="username"
            autoComplete="off"
            required
            minLength={3}
            maxLength={30}
          />
        </label>
        <label>
          Mật khẩu demo
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={register ? 8 : 1}
            maxLength={128}
          />
        </label>
        {register && (
          <label>
            Xác nhận mật khẩu
            <input
              type="password"
              name="confirm"
              autoComplete="new-password"
              required
              maxLength={128}
            />
          </label>
        )}
        {error && (
          <p className="demo-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" disabled={busy}>
          {busy ? "Đang xử lý…" : register ? "Đăng ký demo" : "Đăng nhập demo"}
          <ArrowRight size={16} />
        </button>
      </form>
      <button
        className="secondary"
        onClick={() => open(register ? "login" : "register")}
      >
        {register ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
      </button>
      <div className="sample-logins">
        <strong>Tài khoản mẫu</strong>
        <p>
          Học sinh: <code>hocsinh</code> · Người tư vấn: <code>tuvan</code>
        </p>
        <p>
          Mật khẩu chung: <code>Demo123!</code>
        </p>
      </div>
    </>
  );
}
function Account({ d, open, close, notice }) {
  const [error, setError] = useState("");
  async function change(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      if ((await passwordHash(f.get("old"))) !== d.account.hash)
        throw Error("Mật khẩu hiện tại chưa đúng.");
      if (f.get("new") !== f.get("confirm"))
        throw Error("Mật khẩu xác nhận chưa khớp.");
      if (f.get("new").length < 8)
        throw Error("Mật khẩu mới cần ít nhất 8 ký tự.");
      const hash = await passwordHash(f.get("new"));
      d.update((data) => ({
        ...data,
        accounts: data.accounts.map((a) =>
          a.id === d.account.id ? { ...a, hash } : a,
        ),
      }));
      e.target.reset();
      notice("Đã đổi mật khẩu demo");
    } catch (err) {
      setError(err.message);
    }
  }
  function backup() {
    try {
      const blob = new Blob(
          [localStorage.getItem(STORAGE_KEY) || JSON.stringify(d.data)],
          { type: "application/json" },
        ),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "trustcircle-demo-backup.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Không thể tạo bản sao trong trình duyệt này.");
    }
  }
  return (
    <>
      <h2>Tài khoản demo</h2>
      <p className="modal-intro">
        <strong>{d.account.username}</strong>
        <br />
        Mã tài khoản: {d.account.id}
        <br />
        Vai trò trình diễn:{" "}
        {d.role === "counselor" ? "Người tư vấn" : "Học sinh"}
      </p>
      <Warning />
      <button
        className="primary"
        onClick={() => {
          d.logout();
          notice("Đã đăng xuất");
          close();
        }}
      >
        Đăng xuất
      </button>
      <form onSubmit={change}>
        <h3>Đổi mật khẩu demo</h3>
        <label>
          Mật khẩu hiện tại
          <input
            name="old"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <label>
          Mật khẩu mới
          <input
            name="new"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
          />
        </label>
        <label>
          Xác nhận mật khẩu mới
          <input
            name="confirm"
            type="password"
            required
            maxLength={128}
            autoComplete="new-password"
          />
        </label>
        {error && (
          <p className="demo-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary">Lưu mật khẩu demo</button>
      </form>
      <button className="secondary" onClick={backup}>
        Tải bản sao dữ liệu demo của trình duyệt
      </button>
      <button className="secondary danger-text" onClick={() => open("reset")}>
        Khôi phục dữ liệu demo ban đầu
      </button>
    </>
  );
}
function Circle({ d, open }) {
  return (
    <>
      <h2>Vòng tròn tin cậy của bạn</h2>
      <p className="modal-intro">
        Chọn 3–5 người biết lắng nghe và tôn trọng bạn. Hãy có ít nhất một người
        hỗ trợ ngoài gia đình.
      </p>
      <div className="trust-wheel">
        <div className="wheel-center">
          <Heart />
          <strong>{d.account.username}</strong>
          <small>Ở tâm sự quan tâm</small>
        </div>
        {Array.from({ length: 5 }, (_, i) => {
          const p = d.people[i],
            angle = ((i * 72 - 90) * Math.PI) / 180;
          return (
            <button
              key={p?.id || i}
              className={`wheel-person ${p?.color || ""}`}
              style={{
                left: `${50 + 36 * Math.cos(angle)}%`,
                top: `${50 + 36 * Math.sin(angle)}%`,
              }}
              onClick={() => open(p ? { type: "person", person: p } : "add")}
              aria-label={p ? `Xem ${p.name}` : "Thêm người tin cậy"}
            >
              {p ? (
                <>
                  <span>{p.initial}</span>
                  <strong>{p.name}</strong>
                  <small>{p.role}</small>
                </>
              ) : (
                <>
                  <Plus />
                  <small>Thêm người</small>
                </>
              )}
            </button>
          );
        })}
      </div>
      {!d.people.length && (
        <p className="empty-state">
          Chưa có người tin cậy. Chọn dấu + để bắt đầu.
        </p>
      )}
      {!d.people.some((p) => !["Gia đình", "Người thân"].includes(p.role)) && (
        <div className="info-box">
          Gợi ý: thêm một giáo viên, chuyên viên tâm lý hoặc người lớn đáng tin
          ngoài gia đình.
        </div>
      )}
      <div className="record-actions">
        <span>{d.people.length}/5 người tin cậy</span>
        {d.people.length < 5 && (
          <button className="primary" onClick={() => open("add")}>
            Thêm người <Plus size={16} />
          </button>
        )}
      </div>
    </>
  );
}
function ContactForm({ person, d, open, notice }) {
  const [error, setError] = useState("");
  return (
    <>
      <h2>{person ? "Chỉnh sửa người tin cậy" : "Thêm người tin cậy"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.target);
          if (!person && d.people.length >= 5) {
            setError("Vòng tròn tối đa 5 người.");
            return;
          }
          const name = f.get("name").trim(),
            contact = f.get("contact").trim();
          if (!name || !contact) {
            setError("Vui lòng nhập tên và cách liên hệ.");
            return;
          }
          const p = {
            ...person,
            id: person?.id || uid(),
            name,
            role: f.get("role"),
            contact,
            phone: f.get("phone").trim(),
            initial: name
              .split(/\s+/)
              .map((x) => x[0])
              .slice(-2)
              .join("")
              .toUpperCase(),
            color: person?.color || "mint",
          };
          d.setPeople((list) =>
            person ? list.map((x) => (x.id === p.id ? p : x)) : [...list, p],
          );
          notice("Đã lưu người tin cậy demo");
          open("circle");
        }}
      >
        <label>
          Tên người bạn tin tưởng
          <input
            name="name"
            defaultValue={person?.name || ""}
            required
            maxLength={60}
          />
        </label>
        <label>
          Mối quan hệ
          <select
            aria-label="Mối quan hệ"
            name="role"
            defaultValue={person?.role || "Gia đình"}
          >
            {[
              "Gia đình",
              "Giáo viên",
              "Chuyên viên tâm lý",
              "Người thân",
              "Người lớn tin cậy khác",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Cách liên hệ
          <input
            name="contact"
            defaultValue={person?.contact || ""}
            required
            maxLength={160}
            placeholder="Ví dụ minh họa: gặp tại phòng giáo viên"
          />
        </label>
        <label>
          Số điện thoại (không bắt buộc)
          <input
            name="phone"
            type="tel"
            defaultValue={person?.phone || ""}
            pattern="[+0-9 ().-]{8,20}"
          />
        </label>
        <Warning />
        {error && (
          <p className="demo-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary">Lưu người tin cậy</button>
      </form>
    </>
  );
}
function Contact({ person, d, open, notice }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className={`person-avatar ${person.color}`}>{person.initial}</div>
      <h2>{person.name}</h2>
      <p className="modal-intro">
        {person.role}
        <br />
        {person.contact || person.phone || "Chưa có cách liên hệ"}
      </p>
      <div className="info-box">
        Hãy nói rõ: “Mình cần giúp đỡ với một tình huống khiến mình không an
        toàn.” Nếu người này chưa thể giúp, hãy tìm người lớn tin cậy khác hoặc
        gọi 111. Không chờ phản hồi trên website demo.
      </div>
      {person.phone && (
        <a
          className="primary"
          href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}
        >
          <Phone size={16} />
          Gọi số liên hệ đã nhập
        </a>
      )}
      <div className="record-actions">
        <button
          className="secondary"
          onClick={() => open({ type: "edit", person })}
        >
          Chỉnh sửa
        </button>
        <button
          className="secondary danger-text"
          onClick={() => setConfirm(true)}
        >
          Xóa người này
        </button>
      </div>
      {confirm && (
        <div className="info-box">
          Xóa {person.name} khỏi vòng tròn?
          <div className="record-actions">
            <button
              className="danger-button"
              onClick={() => {
                d.setPeople((p) => p.filter((x) => x.id !== person.id));
                notice("Đã xóa người tin cậy");
                open("circle");
              }}
            >
              Xác nhận xóa
            </button>
            <button onClick={() => setConfirm(false)}>Giữ lại</button>
          </div>
        </div>
      )}
    </>
  );
}
function NewCase({ kind, d, open, notice }) {
  const [anonymous, setAnonymous] = useState(true),
    [error, setError] = useState("");
  return (
    <>
      <div className="modal-icon">
        <MessageCircle />
      </div>
      <h2>
        {kind === "chat"
          ? "Tư vấn trực tuyến mô phỏng"
          : "Mình đang lắng nghe bạn"}
      </h2>
      <p className="modal-intro">
        Phản hồi được viết sẵn hoặc nhập trong vai người tư vấn demo; không có
        AI và không phải tư vấn tâm lý trực tiếp.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.target),
            content = f.get("content").trim();
          if (content.length < 10) {
            setError("Nội dung cần ít nhất 10 ký tự, không chỉ khoảng trắng.");
            return;
          }
          const id = `TC-${uid().slice(0, 8).toUpperCase()}`,
            record = {
              id,
              anonymous,
              ...(!anonymous ? { studentName: d.account.username } : {}),
              topic: f.get("topic"),
              kind,
              content,
              status: "Chờ tiếp nhận",
              priority: "Thông thường",
              createdAt: new Date().toISOString(),
              messages: [],
            };
          d.update((data) => ({
            ...data,
            cases: [{ ownerId: d.account.id, record }, ...data.cases],
          }));
          notice(`Đã lưu hồ sơ demo ${id}`);
          open({ type: "case", id });
        }}
      >
        <label>
          Chủ đề
          <select aria-label="Chủ đề" name="topic">
            {topics.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Điều bạn muốn nói
          <textarea
            name="content"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Nhập một tình huống giả định để trình diễn…"
          />
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Gửi ẩn danh
        </label>
        <p className="form-note">
          {anonymous
            ? "Hồ sơ hiển thị “Ẩn danh”, không gắn tên đăng nhập. Đây không phải ẩn danh an toàn trên thiết bị dùng chung."
            : `Hồ sơ sẽ hiển thị tên: ${d.account.username}`}
        </p>
        <Warning />
        {error && (
          <p className="demo-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary">
          {kind === "chat" ? "Bắt đầu trao đổi demo" : "Gửi chia sẻ demo"}
        </button>
      </form>
      <button className="secondary" onClick={() => open("history")}>
        Xem hồ sơ đã gửi ({d.ownCases.length})
      </button>
    </>
  );
}
function Badge({ children }) {
  return <span className="status-badge">{children}</span>;
}
function History({ d, open }) {
  return (
    <>
      <h2>Hồ sơ chia sẻ của tôi</h2>
      <p className="modal-intro">
        Chỉ là danh sách mô phỏng trên trình duyệt này. Các thay đổi của người
        tư vấn demo xuất hiện ở đây.
      </p>
      {!d.ownCases.length && (
        <p className="empty-state">Bạn chưa gửi hồ sơ demo nào.</p>
      )}
      {d.ownCases.map(({ record: r }) => (
        <button
          className="record-card clickable"
          key={r.id}
          onClick={() => open({ type: "case", id: r.id })}
        >
          <div className="record-actions">
            <strong>{r.id}</strong>
            <Badge>{r.status}</Badge>
          </div>
          <h3>{r.topic}</h3>
          <p>{r.content.slice(0, 140)}</p>
          <small>
            {r.anonymous ? "Ẩn danh" : r.studentName} · {r.messages.length} phản
            hồi / lời nhắn
          </small>
        </button>
      ))}
      <button className="primary" onClick={() => open("share")}>
        Tạo chia sẻ demo
      </button>
    </>
  );
}
function CaseDetail({ id, d, notice, open }) {
  const [error, setError] = useState("");
  const envelope = d.data.cases.find(
    (c) =>
      c.record.id === id &&
      (c.ownerId === d.account.id || d.role === "counselor"),
  );
  if (!envelope)
    return (
      <>
        <h2>Không có hồ sơ phù hợp</h2>
        <button className="secondary" onClick={() => open("history")}>
          Về hồ sơ của tôi
        </button>
      </>
    );
  const r = envelope.record,
    isCounselor = d.role === "counselor";
  function patch(fn) {
    d.update((data) => ({
      ...data,
      cases: data.cases.map((c) =>
        c.record.id === id ? { ...c, record: fn(c.record) } : c,
      ),
    }));
  }
  function reply(e) {
    e.preventDefault();
    const f = new FormData(e.target),
      body = f.get("message").trim();
    if (body.length < 5) {
      setError("Lời nhắn cần ít nhất 5 ký tự.");
      return;
    }
    patch((record) => ({
      ...record,
      status: "Đang tư vấn",
      messages: [
        ...record.messages,
        {
          id: uid(),
          role: isCounselor ? "counselor" : "student",
          body,
          at: new Date().toISOString(),
        },
      ],
    }));
    setError("");
    e.target.reset();
    notice("Đã lưu lời nhắn mô phỏng");
  }
  return (
    <>
      <h2>Hồ sơ {r.id}</h2>
      <div className="record-actions">
        <Badge>{r.status}</Badge>
        <Badge>{r.priority}</Badge>
      </div>
      <p className="modal-intro">
        {r.anonymous ? "Ẩn danh" : r.studentName} · {r.topic}
        <br />
        {new Date(r.createdAt).toLocaleString("vi-VN")}
      </p>
      <div className="chat-bubble">{r.content}</div>
      <div className="info-box">
        PHẢN HỒI MÔ PHỎNG · Không phải tư vấn tâm lý trực tiếp. Không có tin
        nhắn nào gửi đến giáo viên thật.
      </div>
      {r.messages.map((m) => (
        <div key={m.id} className={`demo-message ${m.role}`}>
          <strong>
            {m.role === "counselor" ? "Người tư vấn demo" : "Học sinh"}
            {m.sample ? " · Phản hồi viết sẵn" : ""}
          </strong>
          <p>{m.body}</p>
        </div>
      ))}
      {isCounselor && (
        <div className="form-grid">
          <label>
            Trạng thái hồ sơ
            <select
              aria-label="Trạng thái hồ sơ"
              value={r.status}
              onChange={(e) => {
                const value = e.target.value;
                patch((x) => ({ ...x, status: value }));
                notice("Đã cập nhật trạng thái hồ sơ");
              }}
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Mức ưu tiên demo
            <select
              aria-label="Mức ưu tiên demo"
              value={r.priority}
              onChange={(e) => {
                const value = e.target.value;
                patch((x) => ({ ...x, priority: value }));
                notice("Đã phân loại hồ sơ demo");
              }}
            >
              {["Thông thường", "Cần theo dõi", "Nguy cơ cao"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <button
        className="secondary"
        disabled={r.status === "Đã hoàn thành"}
        onClick={() => {
          patch((x) => ({
            ...x,
            status: "Đang tư vấn",
            messages: [
              ...x.messages,
              {
                id: uid(),
                role: "counselor",
                sample: true,
                body: sampleReply(x.topic),
                at: new Date().toISOString(),
              },
            ],
          }));
          notice("Đã thêm phản hồi viết sẵn theo chủ đề");
        }}
      >
        Minh họa phản hồi mẫu theo chủ đề
      </button>
      {r.status !== "Đã hoàn thành" ? (
        <form onSubmit={reply}>
          <label>
            {isCounselor ? "Phản hồi người tư vấn demo" : "Lời nhắn tiếp theo"}
            <textarea
              name="message"
              rows={3}
              required
              minLength={5}
              maxLength={3000}
            />
          </label>
          {error && (
            <p className="demo-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary">Lưu lời nhắn demo</button>
        </form>
      ) : (
        <p className="info-box">
          Hồ sơ đã hoàn thành trong mô phỏng. Người tư vấn demo có thể mở lại
          bằng cách đổi trạng thái.
        </p>
      )}
      <button
        className="secondary"
        onClick={() => open(isCounselor ? "admin" : "history")}
      >
        Quay lại danh sách
      </button>
    </>
  );
}
function Booking({ d, open, notice }) {
  const [error, setError] = useState("");
  return (
    <>
      <div className="modal-icon">
        <CalendarDays />
      </div>
      <h2>Đăng ký tư vấn trực tiếp demo</h2>
      <p className="modal-intro">
        Nhân vật giả định. Khung giờ được kiểm tra trong dữ liệu demo của trình
        duyệt này, không phải lịch của nhà trường.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.target),
            date = f.get("date"),
            time = f.get("time"),
            counselor = f.get("counselor");
          if (
            date < today() ||
            (date === today() && new Date(`${date}T${time}:00`) <= new Date())
          ) {
            setError("Vui lòng chọn thời điểm trong tương lai.");
            return;
          }
          if (conflict(d.data.appointments, { date, time, counselor })) {
            setError(
              "Người tư vấn đã có lịch demo trong khung giờ này. Hãy chọn giờ hoặc người khác.",
            );
            return;
          }
          const id = `LH-${uid().slice(0, 8).toUpperCase()}`;
          d.update((data) => ({
            ...data,
            appointments: [
              {
                id,
                ownerId: d.account.id,
                studentName: d.account.username,
                date,
                time,
                counselor,
                note: f.get("note").trim(),
                status: "Chờ xác nhận",
                history: [],
                createdAt: new Date().toISOString(),
              },
              ...data.appointments,
            ],
          }));
          notice(`Đã tạo lịch hẹn demo ${id}`);
          open("appointments");
        }}
      >
        <label>
          Người tư vấn
          <select aria-label="Người tư vấn" name="counselor">
            {counselNames.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="form-grid">
          <label>
            Ngày gặp
            <input name="date" type="date" required min={today()} />
          </label>
          <label>
            Khung giờ
            <select aria-label="Khung giờ" name="time">
              {times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Nội dung cần hỗ trợ (giả định)
          <textarea
            name="note"
            rows={3}
            required
            minLength={5}
            maxLength={1000}
          />
        </label>
        <Warning />
        {error && (
          <p className="demo-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary">Đăng ký lịch hẹn demo</button>
      </form>
      <button className="secondary" onClick={() => open("appointments")}>
        Xem lịch của tôi
      </button>
    </>
  );
}
function conflict(list, a) {
  return list.some(
    (b) =>
      b.id !== a.id &&
      b.status !== "Đã hủy" &&
      b.counselor === a.counselor &&
      b.date === a.date &&
      b.time === a.time,
  );
}
function Appointments({ d, open, notice, admin = false }) {
  const list = admin ? d.data.appointments : d.ownAppointments;
  return (
    <>
      <h2>{admin ? "Yêu cầu đặt lịch demo" : "Lịch tư vấn của tôi"}</h2>
      <p className="modal-intro">
        Mọi xác nhận, đổi lịch và hủy chỉ có tác dụng trong mô phỏng này.
      </p>
      {!list.length && <p className="empty-state">Chưa có yêu cầu đặt lịch.</p>}
      {list.map((a) => (
        <Appointment
          key={a.id}
          appointment={a}
          d={d}
          admin={admin}
          notice={notice}
        />
      ))}
      {!admin && (
        <button className="primary" onClick={() => open("booking")}>
          Đặt lịch demo mới
        </button>
      )}
    </>
  );
}
function Appointment({ appointment: a, d, admin, notice }) {
  const [reschedule, setReschedule] = useState(false),
    [error, setError] = useState(""),
    [cancel, setCancel] = useState(false);
  function patch(changes) {
    d.update((data) => ({
      ...data,
      appointments: data.appointments.map((x) =>
        x.id === a.id
          ? {
              ...x,
              ...changes,
              history: [
                ...x.history,
                {
                  status: changes.status,
                  date: changes.date || x.date,
                  time: changes.time || x.time,
                  at: new Date().toISOString(),
                },
              ],
            }
          : x,
      ),
    }));
    notice("Đã cập nhật lịch hẹn demo");
  }
  return (
    <article className="record-card">
      <div className="record-actions">
        <strong>{a.id}</strong>
        <Badge>{a.status}</Badge>
      </div>
      <h3>{a.counselor}</h3>
      <p>
        {a.date} · {a.time}
        {admin && ` · Học sinh: ${a.studentName}`}
      </p>
      <p>{a.note}</p>
      {a.history.length > 0 && (
        <details>
          <summary>Lịch sử cập nhật ({a.history.length})</summary>
          {a.history.map((h, i) => (
            <p key={i}>
              {h.status} · {h.date} {h.time}
            </p>
          ))}
        </details>
      )}
      {a.status !== "Đã hủy" && (
        <div className="record-actions">
          {admin && (
            <>
              <button
                className="secondary"
                onClick={() => {
                  if (conflict(d.data.appointments, a)) {
                    setError("Khung giờ đã có lịch khác.");
                    return;
                  }
                  if (new Date(`${a.date}T${a.time}:00`) <= new Date()) {
                    setError("Khung giờ đã qua. Vui lòng đề nghị đổi lịch.");
                    return;
                  }
                  patch({ status: "Đã xác nhận" });
                  setError("");
                }}
              >
                Xác nhận lịch demo
              </button>
              <button
                className="secondary"
                onClick={() => setReschedule(!reschedule)}
              >
                Đề nghị đổi lịch
              </button>
            </>
          )}
          {!admin && a.status === "Đề nghị đổi lịch" && (
            <button
              className="secondary"
              onClick={() => {
                patch({ status: "Chờ xác nhận" });
                setError("");
              }}
            >
              Đồng ý giờ mới, chờ xác nhận
            </button>
          )}
          <button
            className="secondary danger-text"
            onClick={() => setCancel(true)}
          >
            Hủy lịch
          </button>
        </div>
      )}
      {cancel && (
        <div className="info-box">
          Bạn muốn hủy lịch hẹn demo này?
          <div className="record-actions">
            <button
              className="danger-button"
              onClick={() => {
                patch({ status: "Đã hủy" });
                setCancel(false);
                setReschedule(false);
              }}
            >
              Xác nhận hủy
            </button>
            <button onClick={() => setCancel(false)}>Giữ lịch</button>
          </div>
        </div>
      )}
      {reschedule && a.status !== "Đã hủy" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.target),
              next = { ...a, date: f.get("date"), time: f.get("time") };
            if (new Date(`${next.date}T${next.time}:00`) <= new Date()) {
              setError("Chọn thời điểm trong tương lai.");
              return;
            }
            if (conflict(d.data.appointments, next)) {
              setError("Khung giờ đã có lịch demo khác.");
              return;
            }
            patch({
              date: next.date,
              time: next.time,
              status: "Đề nghị đổi lịch",
            });
            setError("");
            setReschedule(false);
          }}
        >
          <div className="form-grid">
            <label>
              Ngày đề nghị
              <input
                name="date"
                type="date"
                defaultValue={a.date}
                min={today()}
                required
              />
            </label>
            <label>
              Giờ đề nghị
              <select
                aria-label="Giờ đề nghị"
                name="time"
                defaultValue={a.time}
              >
                {times.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="primary">Lưu đề nghị đổi lịch</button>
        </form>
      )}
      {error && (
        <p className="demo-error" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
function Admin({ d, open, notice }) {
  const [tab, setTab] = useState("cases"),
    [filter, setFilter] = useState("Tất cả");
  if (d.role !== "counselor")
    return (
      <>
        <h2>Khu vực người tư vấn demo</h2>
        <p className="modal-intro">
          Chuyển vai trò chỉ để trình diễn, không phải phân quyền an toàn.
        </p>
        <button
          className="primary"
          onClick={() => {
            d.switchRole();
            notice("Đã chuyển sang người tư vấn demo");
          }}
        >
          Chuyển vai trò người tư vấn demo
        </button>
      </>
    );
  return (
    <>
      <span className="demo-mode">CHẾ ĐỘ DEMO · NGƯỜI TƯ VẤN</span>
      <h2>Tiếp nhận và đồng hành</h2>
      <p className="modal-intro">
        Dữ liệu giả định trên cùng trình duyệt. Đây không phải tài khoản nhân
        viên thật.
      </p>
      <div className="demo-tabs">
        <button
          className={tab === "cases" ? "selected" : ""}
          onClick={() => setTab("cases")}
        >
          Hồ sơ ({d.data.cases.length})
        </button>
        <button
          className={tab === "appointments" ? "selected" : ""}
          onClick={() => setTab("appointments")}
        >
          Lịch hẹn ({d.data.appointments.length})
        </button>
      </div>
      {tab === "appointments" ? (
        <Appointments d={d} open={open} notice={notice} admin />
      ) : (
        <>
          <label>
            Lọc trạng thái
            <select
              aria-label="Lọc trạng thái"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {["Tất cả", ...statuses].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {!d.data.cases.filter(
            (c) => filter === "Tất cả" || c.record.status === filter,
          ).length && (
            <p className="empty-state">Không có hồ sơ trong trạng thái này.</p>
          )}
          {d.data.cases
            .filter((c) => filter === "Tất cả" || c.record.status === filter)
            .map(({ record: r }) => (
              <button
                key={r.id}
                className="record-card clickable"
                onClick={() => open({ type: "case", id: r.id })}
              >
                <div className="record-actions">
                  <strong>{r.id}</strong>
                  <Badge>{r.status}</Badge>
                </div>
                <h3>{r.topic}</h3>
                <p>{r.content.slice(0, 120)}</p>
                <small>
                  {r.anonymous ? "Ẩn danh" : r.studentName} · {r.priority}
                </small>
              </button>
            ))}
        </>
      )}
    </>
  );
}
function Privacy() {
  return (
    <>
      <div className="modal-icon">
        <ShieldCheck />
      </div>
      <h2>Hiểu rõ giới hạn của bản demo</h2>
      <Warning />
      <div className="resource">
        <h3>Dữ liệu nằm ở đâu?</h3>
        <p>
          Tài khoản giả lập, mật khẩu băm, vòng tròn, hồ sơ và lịch hẹn lưu trên
          trình duyệt hiện tại bằng localStorage. Chúng không tự đồng bộ sang
          thiết bị khác. Người dùng chung thiết bị có thể truy cập hoặc sửa dữ
          liệu; đăng nhập ở đây không bảo đảm quyền riêng tư hay xác thực an
          toàn.
        </p>
      </div>
      <div className="resource">
        <h3>Chia sẻ ẩn danh trong mô phỏng</h3>
        <p>
          Hồ sơ ẩn danh không hiển thị tên đăng nhập và không tự chèn danh tính
          vào nội dung. Liên kết nội bộ với tài khoản vẫn tồn tại để hiển thị
          lịch sử của bạn. Đây không phải cơ chế ẩn danh bảo mật.
        </p>
      </div>
      <div className="resource">
        <h3>Không phải dịch vụ tư vấn thực tế</h3>
        <p>
          Không có AI, máy chủ tư vấn, giáo viên thật hoặc dịch vụ bên thứ ba
          nhận nội dung. SOS chỉ hướng dẫn, không gửi tín hiệu cầu cứu. Khi có
          nguy hiểm, liên hệ ngay người lớn tin cậy hoặc 111.
        </p>
      </div>
    </>
  );
}
function SOS() {
  return (
    <>
      <div className="modal-icon peach">
        <Phone />
      </div>
      <h2>SOS — Tìm sự giúp đỡ ngay</h2>
      <p className="modal-intro">
        Nếu bị đe dọa, cưỡng ép hoặc cảm thấy nguy hiểm, hãy ưu tiên sự an toàn
        của bạn.
      </p>
      <ol className="sos-steps">
        <li>
          Di chuyển đến nơi an toàn, có người lớn hoặc đông người nếu có thể.
          Tránh đối đầu nếu điều đó khiến bạn nguy hiểm hơn.
        </li>
        <li>
          Nói rõ với người lớn đáng tin cậy: “Mình đang không an toàn và cần
          giúp đỡ ngay.”
        </li>
        <li>
          Nếu người đầu tiên không thể giúp, tiếp tục tìm giáo viên khác, chuyên
          viên, người thân hoặc người lớn tin cậy ngoài gia đình.
        </li>
        <li>
          Liên hệ Tổng đài quốc gia bảo vệ trẻ em 111 tại Việt Nam. Nếu cần cấp
          cứu y tế, gọi 115.
        </li>
      </ol>
      <a className="emergency" href="tel:111">
        <Phone />
        <div>
          <strong>111 — Bảo vệ trẻ em</strong>
          <small>Miễn phí · 24/7 tại Việt Nam</small>
        </div>
      </a>
      <a className="emergency" href="tel:115">
        <Phone />
        <div>
          <strong>115 — Cấp cứu y tế</strong>
          <small>Khi cần trợ giúp y tế khẩn cấp</small>
        </div>
      </a>
      <div className="info-box">
        Website chưa gửi tín hiệu SOS, chưa gọi điện và chưa liên hệ cơ quan hỗ
        trợ thay bạn. Nút gọi chỉ mở ứng dụng điện thoại trên thiết bị có hỗ
        trợ.
      </div>
    </>
  );
}
