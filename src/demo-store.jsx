import React, { createContext, useContext, useState, useEffect } from "react";
export const STORAGE_KEY = "trustcircle.demo.v1";
const Context = createContext(null);
export const counselNames = [
  "Cô Thu Hà — Chuyên viên tâm lý",
  "Cô Minh Anh — Giáo viên chủ nhiệm",
];
export const topics = [
  "Chuyện ở trường",
  "Gia đình",
  "Bạn bè và các mối quan hệ",
  "Cảm xúc của mình",
  "Một tình huống không an toàn",
];
export const statuses = ["Chờ tiếp nhận", "Đang tư vấn", "Đã hoàn thành"];
export const times = ["09:00", "10:00", "14:00", "15:00"];
export const uid = () => crypto.randomUUID();
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const passwordHash = async (password) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    ),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
export const defaultPeople = () => [
  {
    id: uid(),
    name: "Mẹ (mẫu)",
    role: "Gia đình",
    initial: "M",
    color: "peach",
    contact: "Gặp trực tiếp tại nhà",
  },
  {
    id: uid(),
    name: "Cô Minh Anh",
    role: "Giáo viên",
    initial: "MA",
    color: "lavender",
    contact: "Phòng giáo viên (minh họa)",
  },
  {
    id: uid(),
    name: "Cô Thu Hà",
    role: "Chuyên viên tâm lý",
    initial: "TH",
    color: "mint",
    contact: "Phòng tư vấn (minh họa)",
  },
];
export function seed() {
  const hash =
    "588c55f3ce2b8569b153c5abbf13f9f74308b88a20017cc699b835cc93195d16";
  return {
    version: 1,
    accounts: [
      {
        id: "student-demo",
        username: "hocsinh",
        hash,
        role: "student",
        people: defaultPeople(),
      },
      {
        id: "counselor-demo",
        username: "tuvan",
        hash,
        role: "counselor",
        people: defaultPeople(),
      },
    ],
    session: null,
    cases: [
      {
        ownerId: "student-demo",
        record: {
          id: "TC-MAU-001",
          anonymous: true,
          topic: "Chuyện ở trường",
          kind: "share",
          content: "Tình huống mẫu: mình lo lắng trước bài thuyết trình.",
          status: "Chờ tiếp nhận",
          priority: "Thông thường",
          createdAt: new Date().toISOString(),
          messages: [],
        },
      },
    ],
    appointments: [],
  };
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: seed(), error: "" };
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Array.isArray(data.accounts) ||
      !Array.isArray(data.cases) ||
      !Array.isArray(data.appointments) ||
      data.accounts.some(
        (x) =>
          !x.id ||
          typeof x.username !== "string" ||
          typeof x.hash !== "string" ||
          !Array.isArray(x.people) ||
          x.people.some(
            (p) =>
              !p.id || typeof p.name !== "string" || typeof p.role !== "string",
          ),
      ) ||
      data.cases.some(
        (x) =>
          !x.record ||
          typeof x.record.id !== "string" ||
          typeof x.record.content !== "string" ||
          !Array.isArray(x.record.messages) ||
          x.record.messages.some((m) => typeof m.body !== "string"),
      ) ||
      data.appointments.some(
        (a) =>
          !a.id ||
          typeof a.date !== "string" ||
          typeof a.time !== "string" ||
          !Array.isArray(a.history),
      )
    )
      throw Error();
    return { data, error: "" };
  } catch {
    return {
      data: seed(),
      error:
        "Không đọc được dữ liệu demo đã lưu. Bản cũ được giữ nguyên; phiên này chỉ dùng bộ nhớ. Bạn có thể tải bản sao trước khi khôi phục.",
    };
  }
}
export function DemoProvider({ children }) {
  const [initial] = useState(load),
    [data, setData] = useState(initial.data),
    [storageError, setStorageError] = useState(initial.error),
    [blocked, setBlocked] = useState(Boolean(initial.error));
  useEffect(() => {
    if (blocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError("");
    } catch {
      setStorageError(
        "Trình duyệt không cho lưu hoặc đã hết dung lượng. Thay đổi chỉ tồn tại trong phiên này; đừng đóng trang nếu cần giữ dữ liệu.",
      );
    }
  }, [data, blocked]);
  useEffect(() => {
    const fn = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const next = load();
        if (!next.error) {
          setData(next.data);
        } else {
          setStorageError(next.error);
          setBlocked(true);
        }
      }
    };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);
  const account =
    data.accounts.find((x) => x.id === data.session?.accountId) || null;
  const role = account ? data.session?.role || account.role : "guest";
  const update = (fn) => setData((d) => fn(d));
  const setPeople = (next) =>
    update((d) => ({
      ...d,
      accounts: d.accounts.map((a) =>
        a.id === account?.id
          ? { ...a, people: typeof next === "function" ? next(a.people) : next }
          : a,
      ),
    }));
  const login = (id) =>
    update((d) => ({
      ...d,
      session: {
        accountId: id,
        role: d.accounts.find((a) => a.id === id).role,
      },
    }));
  const logout = () => update((d) => ({ ...d, session: null }));
  const switchRole = () =>
    update((d) => ({
      ...d,
      session: {
        ...d.session,
        role: role === "counselor" ? "student" : "counselor",
      },
    }));
  const ownCases = data.cases.filter((c) => c.ownerId === account?.id);
  const ownAppointments = data.appointments.filter(
    (a) => a.ownerId === account?.id,
  );
  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setBlocked(false);
      setData(seed());
      setStorageError("");
    } catch {
      setStorageError(
        "Không thể khôi phục dữ liệu vì trình duyệt chặn lưu trữ.",
      );
    }
  };
  return (
    <Context.Provider
      value={{
        data,
        update,
        account,
        role,
        people: account?.people || [],
        setPeople,
        login,
        logout,
        switchRole,
        ownCases,
        ownAppointments,
        reset,
        storageError,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useDemo = () => useContext(Context);
export function sampleReply(topic) {
  return (
    {
      "Chuyện ở trường":
        "Bạn có thể chia nhiệm vụ thành từng bước nhỏ, nghỉ ngơi và nhờ một thầy cô đáng tin cậy cùng lập kế hoạch.",
      "Gia đình":
        "Hãy chọn lúc phù hợp để nói điều bạn cần với người lớn tin cậy. Nếu không an toàn trong gia đình, hãy tìm người hỗ trợ ngoài gia đình.",
      "Bạn bè và các mối quan hệ":
        "Bạn có quyền nói không với điều khiến mình khó chịu. Hãy tìm thầy cô hoặc người lớn tin cậy để cùng giải quyết.",
      "Cảm xúc của mình":
        "Hãy thử dừng lại, hít thở chậm và gọi tên cảm xúc. Nếu khó khăn kéo dài, hãy tìm chuyên viên hoặc người lớn tin cậy.",
      "Một tình huống không an toàn":
        "Ưu tiên đến nơi an toàn có người lớn. Liên hệ người đáng tin cậy hoặc gọi 111 để tìm hỗ trợ bảo vệ trẻ em; đừng chờ phản hồi trên demo.",
    }[topic] ||
    "Hãy tìm một người lớn đáng tin cậy để chia sẻ và cùng chọn bước tiếp theo."
  );
}
