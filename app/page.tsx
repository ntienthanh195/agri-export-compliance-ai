"use client";

import { FormEvent, useMemo, useState } from "react";

type View =
  | "dashboard"
  | "shipments"
  | "compliance"
  | "regulations"
  | "account";

type Shipment = {
  id: string;
  product: string;
  market: string;
  readiness: number;
  status: "Đang chuẩn bị" | "Cần xử lý" | "Sẵn sàng";
  deadline: string;
};

const initialShipments: Shipment[] = [
  {
    id: "EXP-2507-018",
    product: "Cà phê Robusta",
    market: "Đức",
    readiness: 82,
    status: "Đang chuẩn bị",
    deadline: "04/08/2026",
  },
  {
    id: "EXP-2507-014",
    product: "Thanh long ruột đỏ",
    market: "Hà Lan",
    readiness: 64,
    status: "Cần xử lý",
    deadline: "30/07/2026",
  },
  {
    id: "EXP-2506-009",
    product: "Sầu riêng đông lạnh",
    market: "Pháp",
    readiness: 100,
    status: "Sẵn sàng",
    deadline: "28/07/2026",
  },
];

const regulationCards = [
  {
    code: "EU 2023/1115",
    title: "EUDR — Chống phá rừng",
    scope: "Cà phê",
    note: "Truy xuất vùng trồng và dữ liệu tọa độ địa lý.",
    update: "Cập nhật 18/07/2026",
    tone: "coffee",
  },
  {
    code: "EC 396/2005",
    title: "Giới hạn dư lượng tối đa",
    scope: "Cả 3 nông sản",
    note: "Đối chiếu mức dư lượng thuốc bảo vệ thực vật.",
    update: "Cập nhật 12/07/2026",
    tone: "fruit",
  },
  {
    code: "EU 2016/2031",
    title: "Kiểm dịch thực vật",
    scope: "Sầu riêng · Thanh long",
    note: "Yêu cầu sức khỏe thực vật và kiểm dịch đầu vào.",
    update: "Cập nhật 08/07/2026",
    tone: "plant",
  },
  {
    code: "EU 2017/625",
    title: "Kiểm soát chính thức",
    scope: "Tất cả lô hàng",
    note: "Quy trình kiểm tra và kiểm soát tại cửa khẩu EU.",
    update: "Cập nhật 02/07/2026",
    tone: "control",
  },
];

const navItems: Array<{ id: View; label: string; icon: string }> = [
  { id: "dashboard", label: "Tổng quan", icon: "⌂" },
  { id: "shipments", label: "Lô hàng", icon: "▣" },
  { id: "compliance", label: "Kiểm tra tuân thủ", icon: "✓" },
  { id: "regulations", label: "Thư viện luật EU", icon: "§" },
  { id: "account", label: "Tài khoản", icon: "◉" },
];

function StatusPill({ status }: { status: Shipment["status"] }) {
  const className =
    status === "Sẵn sàng"
      ? "status ready"
      : status === "Cần xử lý"
        ? "status risk"
        : "status progress";
  return <span className={className}>{status}</span>;
}

function Ring({ value }: { value: number }) {
  return (
    <div
      className="ring"
      style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties}
      aria-label={`${value}% hoàn thành`}
    >
      <span>{value}%</span>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [shipments, setShipments] = useState(initialShipments);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [product, setProduct] = useState("Cà phê Robusta");
  const [market, setMarket] = useState("Đức");

  const pageTitle = useMemo(
    () => navItems.find((item) => item.id === view)?.label ?? "Tổng quan",
    [view],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function createShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newShipment: Shipment = {
      id: `EXP-2607-${String(shipments.length + 19).padStart(3, "0")}`,
      product: String(form.get("product")),
      market: String(form.get("market")),
      readiness: 20,
      status: "Đang chuẩn bị",
      deadline: String(form.get("deadline")),
    };
    setShipments((current) => [newShipment, ...current]);
    setShowCreate(false);
    setView("shipments");
    notify("Đã tạo lô hàng mới");
  }

  function runCompliance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultVisible(true);
    window.setTimeout(() => {
      document
        .getElementById("compliance-result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setView("dashboard")}
          aria-label="Về trang tổng quan"
        >
          <span className="brand-mark">A</span>
          <span>
            <strong>AgriExport</strong>
            <small>Compliance AI</small>
          </span>
        </button>

        <div className="workspace">
          <span className="workspace-avatar">MT</span>
          <span>
            <strong>Minh Tâm Export</strong>
            <small>Doanh nghiệp SME</small>
          </span>
          <span className="chevron">⌄</span>
        </div>

        <nav aria-label="Điều hướng chính">
          <p className="nav-label">KHÔNG GIAN LÀM VIỆC</p>
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "nav-item active" : "nav-item"}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "compliance" && <span className="nav-badge">3</span>}
            </button>
          ))}
          <p className="nav-label second">QUẢN LÝ</p>
          <button
            className={view === "account" ? "nav-item active" : "nav-item"}
            onClick={() => setView("account")}
          >
            <span className="nav-icon">◉</span>
            Tài khoản
          </button>
        </nav>

        <div className="sidebar-help">
          <span className="help-icon">?</span>
          <div>
            <strong>Cần hỗ trợ?</strong>
            <small>Hỏi trợ lý tuân thủ AI</small>
          </div>
          <button onClick={() => notify("Trợ lý AI sẽ có trong phiên bản tiếp theo")}>
            ↗
          </button>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">A</span>
            <strong>AgriExport</strong>
          </div>
          <div>
            <p className="eyebrow">AGRIEXPORT / {pageTitle.toUpperCase()}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="top-actions">
            <label className="search">
              <span>⌕</span>
              <input placeholder="Tìm lô hàng, quy định..." />
            </label>
            <button
              className="icon-button notification"
              onClick={() => notify("Bạn có 3 cảnh báo mới")}
              aria-label="Thông báo"
            >
              ♧
              <span>3</span>
            </button>
            <button className="user-button" onClick={() => setView("account")}>
              <span>NT</span>
              <span className="user-copy">
                <strong>Nguyễn Minh Tâm</strong>
                <small>Quản trị viên</small>
              </span>
              <span>⌄</span>
            </button>
          </div>
        </header>

        <div className="content">
          {view === "dashboard" && (
            <Dashboard
              shipments={shipments}
              onCreate={() => setShowCreate(true)}
              onCheck={() => setView("compliance")}
              onViewShipments={() => setView("shipments")}
            />
          )}

          {view === "shipments" && (
            <Shipments
              shipments={shipments}
              onCreate={() => setShowCreate(true)}
              onCheck={() => setView("compliance")}
            />
          )}

          {view === "compliance" && (
            <Compliance
              product={product}
              market={market}
              onProduct={setProduct}
              onMarket={setMarket}
              onSubmit={runCompliance}
              resultVisible={resultVisible}
            />
          )}

          {view === "regulations" && (
            <Regulations onOpen={(name) => notify(`Đang mở ${name}`)} />
          )}

          {view === "account" && <Account onSave={() => notify("Đã lưu thay đổi")} />}
        </div>
      </section>

      {showCreate && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button
              className="modal-close"
              onClick={() => setShowCreate(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <span className="modal-kicker">LÔ HÀNG MỚI</span>
            <h2 id="modal-title">Bắt đầu hồ sơ xuất khẩu</h2>
            <p>Nhập thông tin cơ bản. Hệ thống sẽ tạo checklist phù hợp.</p>
            <form onSubmit={createShipment} className="form-grid">
              <label>
                Tên nông sản
                <select name="product" defaultValue="Cà phê Robusta">
                  <option>Cà phê Robusta</option>
                  <option>Sầu riêng tươi</option>
                  <option>Thanh long ruột đỏ</option>
                </select>
              </label>
              <label>
                Thị trường EU
                <select name="market" defaultValue="Đức">
                  <option>Đức</option>
                  <option>Hà Lan</option>
                  <option>Pháp</option>
                  <option>Bỉ</option>
                </select>
              </label>
              <label className="full-field">
                Ngày dự kiến xuất khẩu
                <input name="deadline" type="date" defaultValue="2026-08-15" required />
              </label>
              <div className="modal-actions full-field">
                <button type="button" className="btn secondary" onClick={() => setShowCreate(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn primary">
                  Tạo lô hàng
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Dashboard({
  shipments,
  onCreate,
  onCheck,
  onViewShipments,
}: {
  shipments: Shipment[];
  onCreate: () => void;
  onCheck: () => void;
  onViewShipments: () => void;
}) {
  return (
    <>
      <section className="welcome">
        <div>
          <span className="welcome-tag">TRỢ LÝ TUÂN THỦ XUẤT KHẨU</span>
          <h2>
            Chào buổi chiều, <em>Minh Tâm.</em>
          </h2>
          <p>
            Ba lô hàng đang được theo dõi. Một hồ sơ cần xử lý trước ngày 30/07.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn secondary light" onClick={onCheck}>
            Kiểm tra nhanh
          </button>
          <button className="btn primary cream" onClick={onCreate}>
            + Tạo lô hàng
          </button>
        </div>
        <div className="welcome-orbit orbit-one" />
        <div className="welcome-orbit orbit-two" />
      </section>

      <section className="stats-grid" aria-label="Chỉ số tổng quan">
        <article className="stat-card">
          <div className="stat-icon green">▣</div>
          <div>
            <span>Lô hàng đang theo dõi</span>
            <strong>{shipments.length}</strong>
            <small><b>+1</b> trong tháng này</small>
          </div>
          <button onClick={onViewShipments}>→</button>
        </article>
        <article className="stat-card">
          <div className="stat-icon amber">!</div>
          <div>
            <span>Hạng mục cần xử lý</span>
            <strong>7</strong>
            <small><b className="warn">3 việc</b> ưu tiên cao</small>
          </div>
          <button onClick={onCheck}>→</button>
        </article>
        <article className="stat-card">
          <div className="stat-icon blue">✓</div>
          <div>
            <span>Mức sẵn sàng trung bình</span>
            <strong>82%</strong>
            <small><b>+8%</b> so với tuần trước</small>
          </div>
          <Ring value={82} />
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel shipments-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">TIẾN ĐỘ GẦN ĐÂY</span>
              <h3>Lô hàng xuất khẩu</h3>
            </div>
            <button onClick={onViewShipments}>Xem tất cả →</button>
          </div>
          <div className="shipment-list">
            {shipments.slice(0, 3).map((shipment) => (
              <button className="shipment-row" key={shipment.id} onClick={onViewShipments}>
                <div className={`product-art ${shipment.product.includes("Cà phê") ? "coffee" : shipment.product.includes("Sầu riêng") ? "durian" : "dragon"}`}>
                  {shipment.product.includes("Cà phê") ? "☕" : shipment.product.includes("Sầu riêng") ? "◆" : "✦"}
                </div>
                <div className="shipment-main">
                  <strong>{shipment.product}</strong>
                  <span>{shipment.id} · Việt Nam → {shipment.market}</span>
                </div>
                <div className="shipment-progress">
                  <span><b>{shipment.readiness}%</b> hoàn thành</span>
                  <div><i style={{ width: `${shipment.readiness}%` }} /></div>
                </div>
                <StatusPill status={shipment.status} />
                <span className="row-arrow">›</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">CẦN CHÚ Ý</span>
              <h3>Cảnh báo & cập nhật</h3>
            </div>
            <span className="live-dot">LIVE</span>
          </div>
          <div className="alert-item urgent">
            <span className="alert-symbol">!</span>
            <div>
              <strong>Thiếu kết quả kiểm nghiệm MRL</strong>
              <p>Lô thanh long EXP-2507-014 cần bổ sung trước 28/07.</p>
              <small>12 phút trước</small>
            </div>
          </div>
          <div className="alert-item update">
            <span className="alert-symbol">↻</span>
            <div>
              <strong>Cập nhật hướng dẫn EUDR</strong>
              <p>Yêu cầu dữ liệu vị trí vùng trồng cà phê đã được cập nhật.</p>
              <small>Hôm qua, 16:40</small>
            </div>
          </div>
          <div className="alert-item success">
            <span className="alert-symbol">✓</span>
            <div>
              <strong>Hồ sơ kiểm dịch đã hợp lệ</strong>
              <p>Lô sầu riêng EXP-2506-009 đã hoàn tất kiểm tra.</p>
              <small>25/07/2026</small>
            </div>
          </div>
        </article>
      </section>

      <section className="quick-check">
        <div>
          <span className="quick-mark">AI</span>
          <div>
            <strong>Bạn sắp xuất một lô hàng mới?</strong>
            <p>Nhận checklist tuân thủ theo nông sản và thị trường EU trong vài phút.</p>
          </div>
        </div>
        <button className="btn primary" onClick={onCheck}>Bắt đầu kiểm tra →</button>
      </section>
    </>
  );
}

function Shipments({
  shipments,
  onCreate,
  onCheck,
}: {
  shipments: Shipment[];
  onCreate: () => void;
  onCheck: () => void;
}) {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <div>
          <span className="section-kicker">QUẢN LÝ HỒ SƠ</span>
          <h2>Tất cả lô hàng</h2>
          <p>Theo dõi tiến độ tuân thủ và chứng từ theo từng lô hàng.</p>
        </div>
        <button className="btn primary" onClick={onCreate}>+ Tạo lô hàng mới</button>
      </div>

      <div className="filter-bar">
        <button className="filter active">Tất cả <span>{shipments.length}</span></button>
        <button className="filter">Đang chuẩn bị <span>2</span></button>
        <button className="filter">Cần xử lý <span>1</span></button>
        <button className="filter">Sẵn sàng <span>1</span></button>
      </div>

      <article className="panel table-panel">
        <div className="table-head">
          <span>Lô hàng</span>
          <span>Thị trường</span>
          <span>Mức sẵn sàng</span>
          <span>Trạng thái</span>
          <span>Ngày dự kiến</span>
          <span />
        </div>
        {shipments.map((shipment) => (
          <div className="table-row" key={shipment.id}>
            <div>
              <strong>{shipment.product}</strong>
              <small>{shipment.id}</small>
            </div>
            <span>EU · {shipment.market}</span>
            <div className="mini-progress">
              <span>{shipment.readiness}%</span>
              <div><i style={{ width: `${shipment.readiness}%` }} /></div>
            </div>
            <StatusPill status={shipment.status} />
            <span>{shipment.deadline}</span>
            <button className="table-action" onClick={onCheck}>Xem hồ sơ →</button>
          </div>
        ))}
      </article>
    </section>
  );
}

function Compliance({
  product,
  market,
  onProduct,
  onMarket,
  onSubmit,
  resultVisible,
}: {
  product: string;
  market: string;
  onProduct: (value: string) => void;
  onMarket: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resultVisible: boolean;
}) {
  return (
    <section className="page-stack">
      <div className="page-intro centered">
        <span className="section-kicker">AI COMPLIANCE CHECK</span>
        <h2>Kiểm tra yêu cầu xuất khẩu</h2>
        <p>Chọn nông sản và thị trường. Hệ thống sẽ tạo checklist tuân thủ mẫu.</p>
      </div>

      <form className="check-form panel" onSubmit={onSubmit}>
        <div className="step-badge">01</div>
        <div className="check-field">
          <label htmlFor="product">Nông sản</label>
          <select id="product" value={product} onChange={(e) => onProduct(e.target.value)}>
            <option>Cà phê Robusta</option>
            <option>Sầu riêng tươi</option>
            <option>Thanh long ruột đỏ</option>
          </select>
          <small>Chọn loại sản phẩm chính của lô hàng</small>
        </div>
        <div className="step-divider">→</div>
        <div className="step-badge">02</div>
        <div className="check-field">
          <label htmlFor="market">Thị trường đích</label>
          <select id="market" value={market} onChange={(e) => onMarket(e.target.value)}>
            <option>Đức</option>
            <option>Hà Lan</option>
            <option>Pháp</option>
            <option>Bỉ</option>
          </select>
          <small>Quốc gia thành viên EU nhập khẩu</small>
        </div>
        <button className="btn primary large" type="submit">Phân tích yêu cầu →</button>
      </form>

      <div className="trust-row">
        <span>✓ Có trích dẫn nguồn luật</span>
        <span>✓ Checklist theo từng mặt hàng</span>
        <span>✓ Dữ liệu minh họa cho prototype</span>
      </div>

      {resultVisible && (
        <section className="result-grid" id="compliance-result">
          <article className="result-summary panel">
            <span className="section-kicker">KẾT QUẢ PHÂN TÍCH</span>
            <h3>{product} → {market}</h3>
            <div className="score-wrap">
              <Ring value={72} />
              <div>
                <strong>Mức sẵn sàng: Khá</strong>
                <p>5/7 hạng mục đã có đủ thông tin cơ bản.</p>
              </div>
            </div>
            <div className="result-callout">
              <span>!</span>
              <p>Hai hạng mục cần bổ sung trước khi gửi hồ sơ cho đối tác nhập khẩu.</p>
            </div>
          </article>

          <article className="checklist panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">CHECKLIST GỢI Ý</span>
                <h3>7 hạng mục tuân thủ</h3>
              </div>
              <span className="status progress">5/7 hoàn thành</span>
            </div>
            {[
              ["Thông tin doanh nghiệp xuất khẩu", true, "Hồ sơ pháp nhân"],
              ["Mã số vùng trồng và cơ sở đóng gói", true, "Truy xuất nguồn gốc"],
              ["Chứng nhận kiểm dịch thực vật", true, "EU 2016/2031"],
              ["Kết quả kiểm nghiệm dư lượng MRL", false, "EC 396/2005"],
              ["Dữ liệu vị trí vùng trồng", false, "EU 2023/1115"],
              ["Hóa đơn và packing list", true, "Chứng từ thương mại"],
              ["Nhãn hàng hóa theo thị trường", true, `Yêu cầu tại ${market}`],
            ].map(([label, done, source]) => (
              <div className="check-row" key={String(label)}>
                <span className={done ? "check done" : "check pending"}>{done ? "✓" : "!"}</span>
                <div>
                  <strong>{label}</strong>
                  <small>{source}</small>
                </div>
                <button type="button">{done ? "Đã có" : "Bổ sung →"}</button>
              </div>
            ))}
          </article>
        </section>
      )}
    </section>
  );
}

function Regulations({ onOpen }: { onOpen: (name: string) => void }) {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <div>
          <span className="section-kicker">LEGAL KNOWLEDGE BASE</span>
          <h2>Thư viện quy định EU</h2>
          <p>Nguồn luật và hướng dẫn được tổ chức theo phạm vi áp dụng.</p>
        </div>
        <label className="library-search">
          <span>⌕</span>
          <input placeholder="Tìm tên quy định, mã luật..." />
        </label>
      </div>

      <div className="library-note">
        <span>i</span>
        <p><strong>Lưu ý về prototype:</strong> Nội dung dưới đây dùng để minh họa cấu trúc sản phẩm. Doanh nghiệp cần kiểm tra lại nguồn chính thức trước khi áp dụng.</p>
      </div>

      <div className="regulation-grid">
        {regulationCards.map((card) => (
          <article className={`regulation-card ${card.tone}`} key={card.code}>
            <div className="regulation-top">
              <span>{card.code}</span>
              <span className="verified">✓ Đã xác minh</span>
            </div>
            <div className="law-symbol">§</div>
            <h3>{card.title}</h3>
            <span className="scope">{card.scope}</span>
            <p>{card.note}</p>
            <div className="regulation-bottom">
              <small>{card.update}</small>
              <button onClick={() => onOpen(card.title)}>Xem chi tiết →</button>
            </div>
          </article>
        ))}
      </div>

      <article className="source-panel panel">
        <div>
          <span className="source-mark">EU</span>
          <div>
            <strong>Nguồn dữ liệu tham chiếu</strong>
            <p>EUR-Lex · European Commission · EU Food Safety · Cơ quan kiểm dịch</p>
          </div>
        </div>
        <button className="btn secondary" onClick={() => onOpen("danh sách nguồn")}>Xem danh sách nguồn</button>
      </article>
    </section>
  );
}

function Account({ onSave }: { onSave: () => void }) {
  return (
    <section className="page-stack account-page">
      <div className="page-intro">
        <div>
          <span className="section-kicker">THÔNG TIN TỔ CHỨC</span>
          <h2>Hồ sơ doanh nghiệp</h2>
          <p>Thông tin này được dùng để điền trước các checklist và biểu mẫu.</p>
        </div>
      </div>
      <div className="account-grid">
        <article className="panel profile-card">
          <span className="profile-avatar">MT</span>
          <h3>Công ty Minh Tâm Export</h3>
          <p>Xuất khẩu nông sản · TP. Hồ Chí Minh</p>
          <span className="verified-company">✓ Hồ sơ đã xác minh</span>
          <div className="profile-stats">
            <div><strong>03</strong><span>Lô hàng</span></div>
            <div><strong>04</strong><span>Thành viên</span></div>
          </div>
        </article>
        <form className="panel account-form" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <h3>Thông tin cơ bản</h3>
          <div className="form-grid">
            <label>
              Tên doanh nghiệp
              <input defaultValue="Công ty TNHH Minh Tâm Export" />
            </label>
            <label>
              Mã số thuế
              <input defaultValue="0312345678" />
            </label>
            <label>
              Email liên hệ
              <input type="email" defaultValue="compliance@minhtam.vn" />
            </label>
            <label>
              Số điện thoại
              <input defaultValue="+84 28 3822 2026" />
            </label>
            <label className="full-field">
              Địa chỉ
              <input defaultValue="Quận 1, TP. Hồ Chí Minh, Việt Nam" />
            </label>
          </div>
          <div className="account-actions">
            <button className="btn primary" type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </section>
  );
}
