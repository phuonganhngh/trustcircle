import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Heart,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Plus,
  X,
  Users,
  MessageCircle,
  CalendarDays,
  House,
  BookOpen,
  Bell,
  ChevronDown,
  ChevronRight,
  Leaf,
  LockKeyhole,
  Phone,
  Check,
  Send,
  Clock,
  Sparkles,
  Menu,
  Smile,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
} from "lucide-react";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./style.css";
import { DemoProvider, useDemo } from "./demo-store";
import { DemoToolbar, DemoModal, isDemoModal } from "./demo-ui";
function App() {
  const demo = useDemo();
  const people = demo.people,
    setPeople = demo.setPeople;
  const [page, setPage] = useState("Tổng quan"),
    [modal, setModal] = useState(null),
    [mood, setMood] = useState(null),
    [toast, setToast] = useState(""),
    [sent, setSent] = useState(false),
    [menu, setMenu] = useState(false),
    [anon, setAnon] = useState(true);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement;
    document.querySelector(".modal .close")?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (e) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("keydown", escape);
      document.body.style.overflow = old;
      previous?.focus?.();
    };
  }, [modal]);
  function notice(t) {
    setToast(t);
    setTimeout(() => setToast(""), 4500);
  }
  function open(type) {
    setSent(false);
    setModal(type);
  }
  const navigation = [
    ["Tổng quan", House],
    ["Vòng tròn tin cậy", Users],
    ["Góc chia sẻ", Heart],
    ["Tư vấn trực tuyến", MessageCircle],
    ["Đặt lịch tư vấn", CalendarDays],
  ];
  function navigate(t) {
    setPage(t);
    setMenu(false);
    if (t === "Vòng tròn tin cậy") open("circle");
    if (t === "Góc chia sẻ") open("share");
    if (t === "Tư vấn trực tuyến") open("chat");
    if (t === "Đặt lịch tư vấn") open("booking");
  }
  return (
    <div className="app">
      <aside
        inert={modal ? true : undefined}
        aria-hidden={modal ? true : undefined}
        className={menu ? "sidebar mobile-open" : "sidebar"}
      >
        <a className="brand" href="#" onClick={() => setPage("Tổng quan")}>
          <div className="brand-icon">
            <Heart size={25} />
            <span />
          </div>
          <div>
            trust circle<small>VÒNG TRÒN AN TOÀN</small>
          </div>
        </a>
        <div className="workspace">
          <span className="school-icon">
            <BookOpen size={19} />
          </span>
          <div>
            Không gian học sinh<small>Luôn có người lắng nghe</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">KHÔNG GIAN CỦA BẠN</div>
        <nav>
          {navigation.map(([t, Icon]) => (
            <button
              key={t}
              className={page === t ? "nav-item active" : "nav-item"}
              onClick={() => navigate(t)}
            >
              <Icon size={19} />
              {t}
              {t === "Tư vấn trực tuyến" && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="nav-label resource-label">CÙNG BẠN VỮNG VÀNG</div>
        <button className="nav-item" onClick={() => open("resources")}>
          <BookOpen size={19} />
          Hành trang an toàn
          <ArrowUpRight className="end-icon" size={16} />
        </button>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Heart size={20} />
            </div>
            <strong>Bạn không cần một mình.</strong>
            <p>
              Một lời chia sẻ nhỏ có thể là <br />
              khởi đầu của điều tốt đẹp.
            </p>
            <button onClick={() => open("help")}>
              Mình cần giúp đỡ <ArrowUpRight size={16} />
            </button>
          </div>
          <button className="profile" onClick={() => open("account")}>
            <div className="avatar">
              {demo.account?.username[0].toUpperCase() || "A"}
            </div>
            <div>
              <span className="profile-name">
                {demo.account?.username || "Khách trải nghiệm"}
              </span>
              <small>Tài khoản demo trên thiết bị</small>
            </div>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>
      <div
        className="main-wrap"
        inert={modal ? true : undefined}
        aria-hidden={modal ? true : undefined}
      >
        <header>
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label="Mở menu"
            >
              <Menu />
            </button>
            Không gian của bạn <ChevronRight size={13} />
            <span>{page}</span>
          </div>
          <div className="header-right">
            <span className="private">
              <LockKeyhole size={13} />
              Trải nghiệm mô phỏng
            </span>
            <span className="header-divider" />
            <button
              className="bell"
              aria-label="Thông báo"
              onClick={() => open("notifications")}
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="avatar small"
              aria-label="Tài khoản demo"
              onClick={() => open("account")}
            >
              {demo.account?.username[0].toUpperCase() || "A"}
            </button>
          </div>
        </header>
        <main>
          <div className="demo-banner" role="note">
            <ShieldCheck size={18} />
            <div>
              <strong>BẢN DEMO TRẢI NGHIỆM</strong>
              <span>
                Website mô phỏng, không tiếp nhận hỗ trợ thực tế. Dữ liệu demo
                lưu trên trình duyệt, không bảo đảm riêng tư trên thiết bị dùng
                chung. Không nhập mật khẩu thật hoặc thông tin nhạy cảm.
              </span>
            </div>
          </div>
          <DemoToolbar open={open} />
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span /> MỘT NƠI AN TOÀN, DÀNH CHO BẠN
              </div>
              <h1>
                Chào {demo.account?.username || "bạn"}, hôm nay bạn thế nào?{" "}
                <span className="wave">☀️</span>
              </h1>
              <p>
                Dù là niềm vui hay điều khó nói, ở đây luôn có người lắng nghe
                bạn.
              </p>
            </div>
            <div className="date">
              <CalendarDays size={16} />
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                timeZone: "Asia/Tokyo",
              })}
            </div>
          </div>
          <section className="hero">
            <div className="hero-content">
              <div className="hero-tag">
                <span /> KẾT NỐI ĐỂ ĐƯỢC CHỞ CHE
              </div>
              <h2>
                Một vòng tròn nhỏ. <br />
                Một điểm tựa <em>lớn lao.</em>
              </h2>
              <p>
                Bạn xứng đáng được lắng nghe, thấu hiểu và bảo vệ. <br />
                Hãy để những người bạn tin tưởng đồng hành cùng bạn.
              </p>
              <button
                className="primary"
                onClick={() => {
                  setPage("Vòng tròn tin cậy");
                  open("circle");
                }}
              >
                Khám phá vòng tròn của bạn <ArrowRight size={17} />
              </button>
              <div className="hero-foot">
                <ShieldCheck size={14} />
                Không phán xét. Không đổ lỗi. Luôn bên bạn.
              </div>
            </div>
            <CircleArt />
          </section>
          <section className="mood-card">
            <div className="mood-label">
              <div className="mood-symbol">
                <Leaf size={22} />
              </div>
              <div>
                <h3>Một chút lắng nghe chính mình</h3>
                <p>
                  {mood
                    ? `Cảm ơn bạn đã chia sẻ. ${mood === "Rất buồn" || mood === "Hơi mệt" ? "Bạn có thể tìm người đồng hành ở ngay bên dưới." : "Hãy dành một chút dịu dàng cho bản thân nhé."}`
                    : "Cảm xúc nào giống bạn nhất lúc này?"}
                </p>
              </div>
            </div>
            <div className="moods">
              {[
                ["Rất vui", "😁", "sunny"],
                ["Ổn áp", "🙂", "good"],
                ["Bình thường", "😐", "neutral"],
                ["Hơi mệt", "😔", "tired"],
                ["Rất buồn", "😢", "sad"],
              ].map(([t, e, c]) => (
                <button
                  key={t}
                  className={`mood ${mood === t ? "selected" : ""}`}
                  onClick={() => setMood(t)}
                >
                  <span className={c}>{e}</span>
                  <small>{t}</small>
                </button>
              ))}
            </div>
          </section>
          <div className="section-title">
            <div>
              <h2>Những điểm tựa của bạn</h2>
              <p>Kết nối theo cách khiến bạn cảm thấy thoải mái nhất.</p>
            </div>
            <span className="section-note">
              <ShieldCheck size={15} />
              Bạn luôn có quyền lựa chọn
            </span>
          </div>
          <section className="features">
            <article className="feature peach-card">
              <div className="feature-top">
                <span className="feature-icon">
                  <Heart size={23} />
                </span>
                <span className="little-badge">CỨ THOẢI MÁI LÀ BẠN</span>
              </div>
              <h3>Góc chia sẻ</h3>
              <p>
                Có điều gì đang ở trong lòng? <br />
                Viết ra nhé, chúng mình ở đây để lắng nghe.
              </p>
              <div className="feature-bottom">
                <button onClick={() => open("share")}>
                  Mình muốn chia sẻ <ArrowRight size={17} />
                </button>
                <span>
                  <LockKeyhole size={12} />
                  Ẩn danh demo
                </span>
              </div>
            </article>
            <article className="feature lilac-card">
              <div className="feature-top">
                <span className="feature-icon">
                  <MessageCircle size={23} />
                </span>
                <span className="availability">
                  <i />
                  Không gian lắng nghe
                </span>
              </div>
              <h3>Tư vấn trực tuyến</h3>
              <p>
                Trao đổi mô phỏng cùng thầy cô và <br />
                chuyên viên tâm lý, theo nhịp của bạn.
              </p>
              <div className="feature-bottom">
                <button onClick={() => open("chat")}>
                  Bắt đầu trò chuyện <ArrowRight size={17} />
                </button>
              </div>
            </article>
            <article className="feature green-card">
              <div className="feature-top">
                <span className="feature-icon">
                  <CalendarDays size={23} />
                </span>
                <span className="little-badge">MỘT CUỘC HẸN CHO BẠN</span>
              </div>
              <h3>Gặp gỡ trực tiếp</h3>
              <p>
                Đôi khi, một cuộc gặp là điều bạn cần. <br />
                Chọn thời gian phù hợp để cùng sẻ chia.
              </p>
              <div className="feature-bottom">
                <button onClick={() => open("booking")}>
                  Đặt lịch tư vấn <ArrowRight size={17} />
                </button>
              </div>
            </article>
          </section>
          <div className="bottom-grid">
            <section className="circle-panel" id="circle">
              <div className="panel-heading">
                <div>
                  <h3>
                    Vòng tròn tin cậy của bạn <span>{people.length}/5</span>
                  </h3>
                  <p>Những người bạn có thể tìm đến, bất cứ khi nào cần.</p>
                </div>
                <button className="text-button" onClick={() => open("manage")}>
                  Quản lý <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="people">
                {!people.length && (
                  <button
                    className="secondary"
                    onClick={() => open(demo.account ? "circle" : "login")}
                  >
                    {demo.account
                      ? "Tạo vòng tròn 3–5 người tin cậy"
                      : "Đăng nhập để tạo vòng tròn"}
                  </button>
                )}
                {people.map((p, i) => (
                  <button
                    className="person"
                    key={i}
                    onClick={() => open({ type: "person", person: p })}
                  >
                    <div className={`person-avatar ${p.color}`}>
                      {p.initial}
                      <span>
                        <Heart size={9} fill="currentColor" />
                      </span>
                    </div>
                    <strong>{p.name}</strong>
                    <small>{p.role}</small>
                  </button>
                ))}
                {people.length < 5 && (
                  <button
                    className="person add-person"
                    onClick={() => open("add")}
                  >
                    <div className="add-avatar">
                      <Plus size={24} />
                    </div>
                    <strong>Thêm người</strong>
                    <small>Mở rộng điểm tựa</small>
                  </button>
                )}
              </div>
              <div className="circle-tip">
                <Leaf size={15} />
                <span>
                  3–5 người tin cậy có thể tạo nên một vòng tròn an toàn cho
                  bạn.
                </span>
              </div>
            </section>
            <section className="quote-panel">
              <span className="quote-mark">“</span>
              <div className="quote-leaf">
                <Leaf size={58} />
              </div>
              <h3>
                Nhờ giúp đỡ là một cách <br />
                để bạn trở nên mạnh mẽ.
              </h3>
              <p>
                Bạn không cần phải có tất cả câu trả lời. <br />
                Chỉ cần bắt đầu bằng một lời chia sẻ.
              </p>
              <span className="quote-footer">
                <span />
                MỖI BƯỚC NHỎ ĐỀU CÓ Ý NGHĨA
              </span>
            </section>
          </div>
          <footer>
            <span>
              <ShieldCheck size={14} />
              Một không gian demo của sự tôn trọng và thấu hiểu.
            </span>
            <button onClick={() => open("privacy")}>
              Cam kết bảo vệ bạn <ArrowUpRight size={13} />
            </button>
          </footer>
        </main>
      </div>
      <button
        inert={modal ? true : undefined}
        aria-hidden={modal ? true : undefined}
        className="sos-button"
        onClick={() => open("help")}
        aria-label="SOS — Hỗ trợ khẩn cấp"
      >
        <Phone size={17} />
        SOS · Cần giúp đỡ
      </button>
      {toast && (
        <div className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <section
            className="modal"
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const list = [
                ...e.currentTarget.querySelectorAll(
                  "button:not([disabled]),a[href],input,textarea,select",
                ),
              ].filter((n) => n.getClientRects().length);
              const first = list[0],
                last = list[list.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Trust Circle"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              aria-label="Đóng"
              onClick={() => setModal(null)}
            >
              <X size={21} />
            </button>
            <DemoModalRouter
              modal={modal}
              sent={sent}
              setSent={setSent}
              people={people}
              setPeople={setPeople}
              anon={anon}
              setAnon={setAnon}
              open={open}
              notice={notice}
              close={() => setModal(null)}
            />
          </section>
        </div>
      )}
    </div>
  );
}
function CircleArt() {
  return (
    <div className="circle-art">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <span className="art-spark spark-one">✧</span>
      <span className="art-spark spark-two">✦</span>
      <span className="art-dot dot-one" />
      <span className="art-dot dot-two" />
      <div className="art-label label-one">
        <span />
        Lắng nghe
      </div>
      <div className="art-label label-two">
        <span />
        Thấu hiểu
      </div>
      <div className="art-label label-three">
        <span />
        Đồng hành
      </div>
      <div className="art-face face-one">
        👩🏻<span>Gia đình</span>
      </div>
      <div className="art-face face-two">
        👩🏻‍🏫<span>Thầy cô</span>
      </div>
      <div className="art-face face-three">
        👩🏻‍⚕️<span>Chuyên viên</span>
      </div>
      <div className="art-center">
        <div className="center-heart">
          <Heart size={46} strokeWidth={1.5} />
        </div>
        <strong>BẠN</strong>
        <span>Ở tâm của sự quan tâm</span>
      </div>
      <div className="art-heart">
        <Heart size={18} fill="currentColor" />
      </div>
      <div className="art-leaf">
        <Leaf size={27} />
      </div>
    </div>
  );
}
function DemoModalRouter(props) {
  if (isDemoModal(props.modal)) return <DemoModal {...props} />;
  return <ModalContent {...props} />;
}
function ModalContent({ modal, open }) {
  if (modal === "notifications")
    return (
      <>
        <div className="modal-icon">
          <Bell />
        </div>
        <h2>Một lời nhắc dịu dàng</h2>
        <p className="modal-intro">
          Thông báo trong bản trình diễn, không phải tin nhắn từ nhà trường.
        </p>
        <div className="info-box">
          Bạn có thể xem trạng thái hồ sơ và lịch hẹn mẫu trên trình duyệt này.
          SOS luôn truy cập được mà không cần đăng nhập.
        </div>
        <button className="primary" onClick={() => open("history")}>
          Xem hồ sơ của tôi <ArrowRight size={17} />
        </button>
      </>
    );
  return (
    <>
      <div className="modal-icon">
        <BookOpen />
      </div>
      <h2>Hành trang an toàn</h2>
      <p className="modal-intro">Một vài bước nhỏ giúp bạn tự bảo vệ mình.</p>
      {[
        [
          "Nhận diện điều không an toàn",
          "Nếu ai đó khiến bạn sợ hãi, ép buộc, đe dọa hoặc yêu cầu giữ bí mật khiến bạn khó chịu, hãy tìm một người lớn đáng tin cậy.",
        ],
        [
          "Nói ra theo cách của bạn",
          "Bạn có thể viết ra, nhắn tin hoặc gặp trực tiếp. Nếu người đầu tiên chưa giúp được, hãy tiếp tục tìm một người khác.",
        ],
        [
          "Tìm sự hỗ trợ kịp thời",
          "Đến nơi an toàn, liên hệ người trong vòng tròn. Khi cần hỗ trợ bảo vệ trẻ em tại Việt Nam, gọi 111.",
        ],
      ].map(([h, p]) => (
        <div className="resource" key={h}>
          <h3>{h}</h3>
          <p>{p}</p>
        </div>
      ))}
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <DemoProvider>
    <App />
  </DemoProvider>,
);
