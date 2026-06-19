import { useState, useEffect, useRef } from "react";

/* ─── THEME (Luxury Gold - perfect for premium investment platform) ─── */

const T = {
  gold: "#C9A84C", goldLight: "#E8C97A", goldDim: "#8B6F35", goldFaint: "rgba(201,168,76,0.08)",
  bg: "#07090D", card: "#0C1018", panel: "#111620", border: "#1A2133",
  borderGold: "rgba(201,168,76,0.25)", text: "#E2E6F0", dim: "#5A6880", muted: "#8A96A8",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.1)",
  red: "#EF4444",   redBg: "rgba(239,68,68,0.1)",
  blue: "#3B82F6",  blueBg: "rgba(59,130,246,0.1)",
};

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Sora:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;background:${T.bg}}
  body{font-family:'Sora',sans-serif;color:${T.text};overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${T.bg}}::-webkit-scrollbar-thumb{background:${T.goldDim};border-radius:2px}
  input,select,textarea{font-family:'Sora',sans-serif}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(201,168,76,0.15)}50%{box-shadow:0 0 28px rgba(201,168,76,0.4)}}
  .fadeUp{animation:fadeUp 0.45s ease forwards}
  .fadeUp1{animation:fadeUp 0.45s 0.05s ease both}
  .fadeUp2{animation:fadeUp 0.45s 0.12s ease both}
  .fadeUp3{animation:fadeUp 0.45s 0.19s ease both}
  .fadeUp4{animation:fadeUp 0.45s 0.26s ease both}
  .fadeUp5{animation:fadeUp 0.45s 0.33s ease both}
  .pulseDot{animation:pulse 2s infinite}
`;

/* ─── MOCK DATA (rebranded) ──────────────────────────────────────────── */

const MOCK = {
  user: { name: "Marcus Webb", email: "marcus@example.com", balance: 24860.50, deposited: 20000, profit: 4860.50, role: "user", status: "active" },
  admin: { name: "Admin", email: "admin@lunatrade.com", role: "admin" },
  positions: [
    { symbol: "AAPL", qty: 12, avgEntry: 178.20, currentPrice: 194.50, marketValue: 2334, unrealizedPnl: 195.60, unrealizedPnlPct: 9.15, side: "long" },
    { symbol: "NVDA", qty: 5,  avgEntry: 780.00, currentPrice: 875.30, marketValue: 4376.50, unrealizedPnl: 476.50, unrealizedPnlPct: 12.22, side: "long" },
    { symbol: "TSLA", qty: 8,  avgEntry: 245.00, currentPrice: 231.80, marketValue: 1854.40, unrealizedPnl: -105.60, unrealizedPnlPct: -5.38, side: "long" },
    { symbol: "MSFT", qty: 6,  avgEntry: 380.00, currentPrice: 412.70, marketValue: 2476.20, unrealizedPnl: 196.20, unrealizedPnlPct: 8.61, side: "long" },
  ],
  orders: [
    { symbol: "AAPL", side: "buy",  qty: 4, filledAvgPrice: 191.30, status: "filled", filledAt: "2026-05-10T14:32:00Z" },
    { symbol: "NVDA", side: "buy",  qty: 2, filledAvgPrice: 862.00, status: "filled", filledAt: "2026-05-09T10:15:00Z" },
    { symbol: "TSLA", side: "sell", qty: 3, filledAvgPrice: 228.50, status: "filled", filledAt: "2026-05-08T15:48:00Z" },
    { symbol: "MSFT", side: "buy",  qty: 3, filledAvgPrice: 408.20, status: "filled", filledAt: "2026-05-07T09:55:00Z" },
    { symbol: "AMZN", side: "sell", qty: 5, filledAvgPrice: 184.60, status: "filled", filledAt: "2026-05-06T13:20:00Z" },
  ],
  deposits: [
    { id: "d1", user: { name: "Marcus Webb",   email: "marcus@example.com" }, amount: 10000, currency: "BTC",  txHash: "3a1b2c3d4e5f...", status: "confirmed", createdAt: "2026-05-01" },
    { id: "d2", user: { name: "Sarah Chen",    email: "sarah@example.com"  }, amount: 5000,  currency: "USDT", txHash: "7f8e9d0c1b2a...", status: "pending",   createdAt: "2026-05-10" },
    { id: "d3", user: { name: "Theo Okafor",   email: "theo@example.com"   }, amount: 2500,  currency: "BTC",  txHash: "1c2b3a4f5e6d...", status: "pending",   createdAt: "2026-05-11" },
    { id: "d4", user: { name: "Elena Novak",   email: "elena@example.com"  }, amount: 15000, currency: "USDT", txHash: "9e8d7c6b5a4f...", status: "rejected",  createdAt: "2026-04-28" },
  ],
  users: [
    { id: "u1", name: "Marcus Webb",   email: "marcus@example.com", balance: 24860.50, deposited: 20000, profit: 4860.50, status: "active", createdAt: "2026-03-15" },
    { id: "u2", name: "Sarah Chen",    email: "sarah@example.com",  balance: 8420.00,  deposited: 7500,  profit: 920.00,  status: "active", createdAt: "2026-04-02" },
    { id: "u3", name: "Theo Okafor",   email: "theo@example.com",   balance: 3200.00,  deposited: 3000,  profit: 200.00,  status: "active", createdAt: "2026-04-20" },
    { id: "u4", name: "Elena Novak",   email: "elena@example.com",  balance: 0,         deposited: 0,     profit: 0,       status: "suspended", createdAt: "2026-04-10" },
  ],
  stats: { totalUsers: 4, activeUsers: 3, totalDeposited: 30500, totalBalance: 36480.50, totalProfit: 5980.50 },
  portfolioHistory: [18200,18950,19400,19100,20200,21500,21800,22300,22800,23500,24100,24860.50],
  historyLabels: ["May 1","May 2","May 3","May 4","May 5","May 6","May 7","May 8","May 9","May 10","May 11","May 12"],
};

/* ─── HELPERS ────────────────────────────────────────────────────────── */

const fmt = (n, dec = 2) => n?.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtUSD = (n) => "$" + fmt(n);
const pos = (n) => n >= 0;

/* ─── UI PRIMITIVES ──────────────────────────────────────────────────── */

function Badge({ status }) {
  const map = {
    confirmed: [T.green, T.greenBg, "Confirmed"],
    pending:   [T.gold,  T.goldFaint, "Pending"],
    rejected:  [T.red,   T.redBg,  "Rejected"],
    active:    [T.green, T.greenBg, "Active"],
    suspended: [T.red,   T.redBg,  "Suspended"],
    filled:    [T.blue,  T.blueBg, "Filled"],
    long:      [T.green, T.greenBg, "Long"],
    buy:       [T.green, T.greenBg, "Buy"],
    sell:      [T.red,   T.redBg,  "Sell"],
  };
  const [color, bg, label] = map[status] || [T.dim, "transparent", status];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, color, background: bg, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, color, delay = 0 }) {
  return (
    <div className={`fadeUp${delay}`} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "22px 24px", flex: 1, minWidth: 140, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color || T.gold}, transparent)` }} />
      <div style={{ fontSize: 11, color: T.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: color || T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MiniChart({ data, color = T.gold, height = 60 }) {
  const w = 300, h = height, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / (max - min)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const area = `M${pts.split(" ")[0]} L${pts.split(" ").join(" L")} L${w - pad},${h} L${pad},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }} className="fadeUp1">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{ width: 3, height: 22, background: `linear-gradient(${T.gold}, ${T.goldDim})`, borderRadius: 2 }} />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: T.text }}>{title}</h2>
      </div>
      {sub && <div style={{ fontSize: 13, color: T.dim, marginLeft: 15 }}>{sub}</div>}
    </div>
  );
}

function Table({ cols, rows, emptyMsg = "No data" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 32, color: T.dim, fontSize: 13 }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.goldFaint}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "12px 16px", fontSize: 13, color: T.text, whiteSpace: "nowrap" }}>{cell}</td>
                  ))}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, style: s }) {
  return (
    <div style={{ marginBottom: 16, ...s }}>
      {label && <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: T.text, outline: "none", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = T.goldDim}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  );
}

function GoldBtn({ children, onClick, style: s, outline }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: outline ? "transparent" : hov ? T.goldLight : T.gold,
        color: outline ? (hov ? T.gold : T.goldDim) : T.bg,
        border: outline ? `1px solid ${T.goldDim}` : "none",
        borderRadius: 9, padding: "11px 22px", fontSize: 13, fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif",
        letterSpacing: "0.04em", ...s
      }}>
      {children}
    </button>
  );
}

/* ─── PAGES ──────────────────────────────────────────────────────────── */

/* LOGIN */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("marcus@example.com");
  const [pass, setPass] = useState("password123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true); setErr("");
    setTimeout(() => {
      if (email === "admin@lunatrade.com") { onLogin("admin"); }
      else if (email && pass) { onLogin("user"); }
      else { setErr("Invalid credentials."); }
      setLoading(false);
    }, 900);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* BG grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)` }} />

      <div className="fadeUp" style={{ background: T.card, border: `1px solid ${T.borderGold}`, borderRadius: 20, padding: "48px 44px", width: "100%", maxWidth: 420, position: "relative", zIndex: 1, boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        {/* logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", width: 52, height: 52, borderRadius: "50%", border: `2px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>◆</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: T.gold, letterSpacing: "0.06em" }}>LUNA TRADE</div>
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Investment Platform</div>
        </div>

        <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
        {err && <div style={{ fontSize: 12, color: T.red, marginBottom: 12, textAlign: "center" }}>{err}</div>}

        <GoldBtn onClick={handleLogin} style={{ width: "100%", padding: "13px 0", marginBottom: 16, fontSize: 14 }}>
          {loading ? "Signing in…" : "Sign In"}
        </GoldBtn>

        <div style={{ textAlign: "center", fontSize: 12, color: T.dim }}>
          <span style={{ color: T.goldDim, cursor: "pointer" }} onClick={() => { setEmail("admin@lunatrade.com"); setPass("Admin123!"); }}>
            ← Use admin credentials
          </span>
        </div>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.dim, textAlign: "center" }}>
          Protected by JWT authentication · Rate limited API
        </div>
      </div>
    </div>
  );
}

/* SIDEBAR */
function Sidebar({ page, setPage, role, onLogout }) {
  const userNav = [
    { id: "dashboard",  icon: "⬡", label: "Dashboard" },
    { id: "portfolio",  icon: "◈", label: "Portfolio" },
    { id: "deposit",    icon: "↑", label: "Deposit" },
    { id: "bank",       icon: "⊡", label: "Bank Transfer" },
    { id: "history",    icon: "≡", label: "History" },
  ];
  const adminNav = [
    { id: "admin-dashboard", icon: "⬡", label: "Overview" },
    { id: "admin-users",     icon: "◉", label: "Users" },
    { id: "admin-deposits",  icon: "↑", label: "Deposits" },
    { id: "admin-txns",      icon: "≡", label: "Transactions" },
  ];
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <div style={{ width: 220, background: T.card, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 22px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: T.gold, fontWeight: 700, letterSpacing: "0.05em" }}>LUNA TRADE</div>
        <div style={{ fontSize: 10, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Investment</div>
        {role === "admin" && (
          <div style={{ marginTop: 8, fontSize: 10, background: T.goldFaint, color: T.gold, border: `1px solid ${T.borderGold}`, borderRadius: 4, padding: "2px 7px", display: "inline-block", letterSpacing: "0.1em" }}>ADMIN</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 10px" }}>
        {nav.map(item => {
          const active = page === item.id;
          return (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 9, cursor: "pointer", marginBottom: 2, fontSize: 13.5, fontWeight: 400, transition: "all 0.15s",
                background: active ? T.goldFaint : "transparent",
                color: active ? T.gold : T.dim,
                border: active ? `1px solid ${T.borderGold}` : "1px solid transparent",
              }}>
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: T.gold }} />}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "14px 12px", borderTop: `1px solid ${T.border}` }}>
        <div onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, cursor: "pointer", fontSize: 13, color: T.dim, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = T.red}
          onMouseLeave={e => e.currentTarget.style.color = T.dim}>
          ⊗ &nbsp;Sign Out
        </div>
      </div>
    </div>
  );
}

/* DASHBOARD */
function Dashboard() {
  const u = MOCK.user;
  const profitPct = (u.profit / u.deposited * 100).toFixed(2);
  return (
    <div>
      <SectionHeader title="Portfolio Overview" sub={`Welcome back, ${u.name} · Account active`} />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard delay={1} label="Total Balance" value={fmtUSD(u.balance)} sub="Updated now" color={T.gold} />
        <StatCard delay={2} label="Total Deposited" value={fmtUSD(u.deposited)} sub="Across all deposits" />
        <StatCard delay={3} label="Total Profit" value={fmtUSD(u.profit)} sub={`+${profitPct}% return`} color={T.green} />
        <StatCard delay={4} label="Open Positions" value={MOCK.positions.length} sub="Live trading account" color={T.blue} />
      </div>

      {/* Chart */}
      <div className="fadeUp3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: T.dim, marginBottom: 3 }}>Portfolio Value</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: T.text }}>{fmtUSD(u.balance)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: T.green }}>▲ {fmtUSD(u.balance - MOCK.portfolioHistory[0])} this month</div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>May 1 – May 12, 2026</div>
          </div>
        </div>
        <MiniChart data={MOCK.portfolioHistory} height={80} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {MOCK.historyLabels.filter((_, i) => i % 3 === 0).map(l => (
            <span key={l} style={{ fontSize: 10, color: T.dim }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Positions */}
      <div className="fadeUp4" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Open Positions</span>
        </div>
        <Table
          cols={["Symbol", "Qty", "Avg Entry", "Current", "Market Value", "P&L", "P&L %"]}
          rows={MOCK.positions.map(p => [
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 14 }}>{p.symbol}</span>,
            p.qty,
            fmtUSD(p.avgEntry),
            fmtUSD(p.currentPrice),
            fmtUSD(p.marketValue),
            <span style={{ color: pos(p.unrealizedPnl) ? T.green : T.red, fontWeight: 600 }}>{pos(p.unrealizedPnl) ? "+" : ""}{fmtUSD(p.unrealizedPnl)}</span>,
            <span style={{ color: pos(p.unrealizedPnlPct) ? T.green : T.red }}>{pos(p.unrealizedPnlPct) ? "▲" : "▼"} {Math.abs(p.unrealizedPnlPct).toFixed(2)}%</span>,
          ])}
        />
      </div>
    </div>
  );
}

/* PORTFOLIO */
function Portfolio() {
  const [investmentsMoveData, setInvestmentsMoveData] = useState(null);

  // === ALPACA BROKER INTEGRATION STATE ===
  const [alpacaKey, setAlpacaKey] = useState("");
  const [alpacaSecret, setAlpacaSecret] = useState("");
  const [alpacaConnected, setAlpacaConnected] = useState(false);
  const [alpacaAccount, setAlpacaAccount] = useState(null);
  const [alpacaPositions, setAlpacaPositions] = useState([]);

  // Alpaca base URL (use paper for testing)
  const ALPACA_BASE = "https://paper-api.alpaca.markets";

  async function connectAlpaca(useDemo = false) {
    if (!alpacaKey && !useDemo) {
      alert("Please enter your Alpaca Paper API Key and Secret.");
      return;
    }

    const key = useDemo ? "PK2K2K2K2K2K2K2K2K2K2K" : alpacaKey; // demo placeholder
    const secret = useDemo ? "demo-secret-for-testing" : alpacaSecret;

    try {
      // Fetch account info
      const accountRes = await fetch(`${ALPACA_BASE}/v2/account`, {
        headers: {
          "APCA-API-KEY-ID": key,
          "APCA-API-SECRET-KEY": secret,
        },
      });

      if (!accountRes.ok) throw new Error("Invalid Alpaca credentials or network error");

      const accountData = await accountRes.json();

      // Fetch positions
      const posRes = await fetch(`${ALPACA_BASE}/v2/positions`, {
        headers: {
          "APCA-API-KEY-ID": key,
          "APCA-API-SECRET-KEY": secret,
        },
      });
      const positionsData = await posRes.json();

      setAlpacaAccount(accountData);
      setAlpacaPositions(positionsData || []);
      setAlpacaConnected(true);

      // Store keys temporarily in memory (for demo only)
      window.alpacaCredentials = { key, secret };

      alert("Successfully connected to Alpaca Paper account!");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Alpaca. Please check your Paper API keys and try again.\n\nFor real use, move keys to a secure backend.");
    }
  }

  function disconnectAlpaca() {
    setAlpacaConnected(false);
    setAlpacaAccount(null);
    setAlpacaPositions([]);
    setAlpacaKey("");
    setAlpacaSecret("");
    delete window.alpacaCredentials;
  }

  async function refreshAlpacaData() {
    if (!window.alpacaCredentials) {
      alert("Please reconnect to Alpaca.");
      return;
    }

    try {
      const { key, secret } = window.alpacaCredentials;

      const accountRes = await fetch(`${ALPACA_BASE}/v2/account`, {
        headers: { "APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret },
      });
      const accountData = await accountRes.json();

      const posRes = await fetch(`${ALPACA_BASE}/v2/positions`, {
        headers: { "APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret },
      });
      const positionsData = await posRes.json();

      setAlpacaAccount(accountData);
      setAlpacaPositions(positionsData || []);
      alert("Alpaca data refreshed!");
    } catch (err) {
      alert("Failed to refresh Alpaca data.");
    }
  }

  // Investments Move Plaid flow (production pattern)
  const startInvestmentsMove = () => {
    if (!window.Plaid) {
      alert("Plaid Link is loading. Please try again in a moment.");
      return;
    }

    const handler = window.Plaid.create({
      // PRODUCTION: Fetch link_token from your backend with:
      // products: ["investments_auth"]
      // investments_auth: { masked_number_match_enabled: true, stated_account_number_enabled: true, manual_entry_enabled: true }
      token: "link-sandbox-investments-move-demo", // Replace with real link_token from backend

      onSuccess: (public_token, metadata) => {
        console.log("Investments Move Link Success:", public_token, metadata);

        // In PRODUCTION:
        // 1. Exchange public_token → access_token on backend
        // 2. Call /investments/auth/get with access_token
        // 3. Return the full transfer data to frontend

        // Demo data matching real /investments/auth/get response structure
        const demoData = {
          accountHolderName: "Marcus Webb",
          accountNumber: "****7832",
          accountType: "individual",
          dtcNumber: "0141",
          holdings: [
            { symbol: "AAPL", quantity: 125, price: 194.50, marketValue: 24312.50 },
            { symbol: "NVDA", quantity: 45, price: 875.30, marketValue: 39388.50 },
            { symbol: "TSLA", quantity: 80, price: 231.80, marketValue: 18544.00 },
          ],
          source: "broker_direct",
        };

        setInvestmentsMoveData(demoData);
        alert("Broker account successfully connected via Plaid Investments Move!\n\nYou can now review the transfer data and submit the ACATS request.");
      },

      onExit: (err) => {
        if (err) console.error(err);
      },

      product: ["investments_auth"],
    });

    handler.open();
  };

  const submitACATSDemo = () => {
    if (!investmentsMoveData) return;

    alert(`ACATS Transfer Initiated!\n\nAccount: ${investmentsMoveData.accountHolderName}\nBroker: Connected via Plaid\nTotal Value: $${investmentsMoveData.holdings.reduce((sum, h) => sum + h.marketValue, 0).toLocaleString()}\n\nIn production: This data would be sent to your clearing firm to initiate the ACATS transfer.`);
    
    // In real app: Call your backend to submit to clearing firm / partner
    setTimeout(() => {
      alert("Transfer request submitted successfully. Status: Pending (simulated)");
    }, 1500);
  };

    <div>
      <SectionHeader title="Portfolio & Trades" sub="Live trading account · Real-time positions & orders" />

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard delay={1} label="Portfolio Value" value={fmtUSD(24860.50)} color={T.gold} />
        <StatCard delay={2} label="Cash Available" value={fmtUSD(13819.10)} />
        <StatCard delay={3} label="Buying Power" value={fmtUSD(27638.20)} />
        <StatCard delay={4} label="Account Status" value="ACTIVE" color={T.green} />
      </div>

      {/* Positions */}
      <div className="fadeUp3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Open Positions</span>
          <span style={{ fontSize: 11, color: T.dim, background: T.panel, padding: "3px 10px", borderRadius: 5 }}>4 positions</span>
        </div>
        <Table
          cols={["Symbol", "Side", "Qty", "Avg Entry", "Current Price", "Market Value", "Unrealized P&L"]}
          rows={MOCK.positions.map(p => [
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>{p.symbol}</span>,
            <Badge status={p.side} />,
            p.qty,
            fmtUSD(p.avgEntry),
            fmtUSD(p.currentPrice),
            fmtUSD(p.marketValue),
            <span style={{ color: pos(p.unrealizedPnl) ? T.green : T.red, fontWeight: 600 }}>
              {pos(p.unrealizedPnl) ? "+" : ""}{fmtUSD(p.unrealizedPnl)} ({pos(p.unrealizedPnlPct) ? "+" : ""}{p.unrealizedPnlPct.toFixed(2)}%)
            </span>,
          ])}
        />
      </div>

      {/* Orders */}
      <div className="fadeUp4" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Orders</span>
        </div>
        <Table
          cols={["Symbol", "Side", "Qty", "Filled Price", "Status", "Filled At"]}
          rows={MOCK.orders.map(o => [
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>{o.symbol}</span>,
            <Badge status={o.side} />,
            o.qty,
            fmtUSD(o.filledAvgPrice),
            <Badge status={o.status} />,
            new Date(o.filledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          ])}
        />
      </div>

      {/* ========== INVESTMENTS MOVE (ACATS) - Production Ready Integration ========== */}
      <div className="fadeUp5" style={{ background: T.card, border: `1px solid ${T.borderGold}`, borderRadius: 14, padding: 24, marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 3, height: 22, background: `linear-gradient(${T.gold}, ${T.goldDim})`, borderRadius: 2 }} />
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.text }}>Investments Move — ACATS Transfers</h3>
          <span style={{ fontSize: 11, background: T.goldFaint, color: T.gold, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T.borderGold}` }}>PLAID PRODUCTION FEATURE</span>
        </div>

        <p style={{ color: T.dim, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
          Automate brokerage account transfers (ACATS in US, ATON in Canada) using broker-sourced data from Plaid. 
          This replaces manual data entry and dramatically reduces rejections.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <GoldBtn 
            onClick={() => startInvestmentsMove()} 
            style={{ padding: "14px 28px", fontSize: 14 }}
          >
            Start Investments Move (Link to Broker)
          </GoldBtn>
          
          {investmentsMoveData && (
            <GoldBtn 
              onClick={() => submitACATSDemo()} 
              outline 
              style={{ padding: "14px 24px", fontSize: 14 }}
            >
              Submit ACATS Transfer
            </GoldBtn>
          )}
        </div>

        {/* Investments Move Results */}
        {investmentsMoveData && (
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.gold, marginBottom: 12 }}>Transfer Data from Broker (via /investments/auth/get)</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 4 }}>Account Holder</div>
                <div style={{ fontWeight: 600 }}>{investmentsMoveData.accountHolderName}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 4 }}>Account Number</div>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{investmentsMoveData.accountNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 4 }}>Account Type</div>
                <div style={{ fontWeight: 600 }}>{investmentsMoveData.accountType}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 4 }}>DTC / Clearing Number</div>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{investmentsMoveData.dtcNumber}</div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: T.dim, marginBottom: 8 }}>Holdings (Broker-Sourced)</div>
              <Table 
                cols={["Symbol", "Quantity", "Price", "Market Value"]}
                rows={investmentsMoveData.holdings.map(h => [
                  <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>{h.symbol}</span>,
                  h.quantity,
                  fmtUSD(h.price),
                  fmtUSD(h.marketValue)
                ])}
              />
            </div>

            <div style={{ fontSize: 12, color: T.muted, background: T.panel, padding: 12, borderRadius: 8 }}>
              Data source: <strong>Broker (via Plaid Investments Move)</strong> — Ready for ACATS submission. 
              In production, send this payload to your clearing firm or use a partner like DriveWealth / Modern Treasury.
            </div>
          </div>
        )}

        <div style={{ fontSize: 11, color: T.muted, marginTop: 16, lineHeight: 1.5 }}>
          <strong>Production Ready Notes:</strong><br />
          • Use <code>products: ["investments_auth"]</code> in <code>/link/token/create</code><br />
          • Enable fallback flows if needed (masked_number_match_enabled, stated_account_number_enabled, manual_entry_enabled)<br />
          • Call <code>/investments/auth/get</code> after Link success to get the exact data needed for ACATS<br />
          • This is US/CA only. For full production, add backend token exchange + real ACATS submission logic.
        </div>
      </div>
      {/* ========== END INVESTMENTS MOVE SECTION ========== */}
    </div>
  );
}

/* DEPOSIT */
function Deposit() {
  const [currency, setCurrency] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState(1); // 1=form, 2=confirm, 3=done
  const wallets = { BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", USDT: "0x742d35Cc6634C0532925a3b8D4C9C3E5B5C8bA9a" };

  function submit() {
    if (!amount || !txHash) return;
    setStep(2);
  }
  function confirm() { setStep(3); }

  if (step === 3) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
      <div className="fadeUp" style={{ fontSize: 52, marginBottom: 20 }}>✦</div>
      <div className="fadeUp1" style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: T.gold, marginBottom: 10 }}>Deposit Submitted</div>
      <div className="fadeUp2" style={{ fontSize: 14, color: T.dim, maxWidth: 340, lineHeight: 1.6 }}>Your deposit of <strong style={{ color: T.text }}>${fmt(parseFloat(amount))}</strong> in <strong style={{ color: T.text }}>{currency}</strong> is pending admin review. You'll be credited once confirmed.</div>
      <GoldBtn onClick={() => { setStep(1); setAmount(""); setTxHash(""); }} style={{ marginTop: 28 }} outline>Submit Another</GoldBtn>
    </div>
  );

  return (
    <div>
      <SectionHeader title="Deposit Funds" sub="Send crypto to our wallet, then submit your transaction hash for admin confirmation" />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Left: instructions */}
        <div className="fadeUp1" style={{ flex: 1, minWidth: 280 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: T.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Select Currency</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["BTC", "USDT"].map(c => (
                <div key={c} onClick={() => setCurrency(c)}
                  style={{ flex: 1, padding: "14px 0", textAlign: "center", borderRadius: 10, cursor: "pointer", border: `1px solid ${currency === c ? T.gold : T.border}`, background: currency === c ? T.goldFaint : T.bg, color: currency === c ? T.gold : T.dim, fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
                  {c === "BTC" ? "₿" : "₮"} {c}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.borderGold}`, borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 12, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Deposit Wallet Address</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: T.gold, background: T.bg, padding: "12px 14px", borderRadius: 8, border: `1px solid ${T.border}`, wordBreak: "break-all", lineHeight: 1.6 }}>
              {wallets[currency]}
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 10, lineHeight: 1.6 }}>
              Send only <strong style={{ color: T.gold }}>{currency}</strong> to this address. Minimum deposit: <strong style={{ color: T.text }}>$10</strong>. Confirm on-chain, then submit your tx hash below.
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="fadeUp2" style={{ flex: 1, minWidth: 280 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20, color: T.muted }}>Submit Deposit</div>
            {step === 1 && (
              <>
                <Input label="Amount (USD)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                <Input label="Transaction Hash" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="Paste your on-chain tx hash…" />
                <GoldBtn onClick={submit} style={{ width: "100%", padding: "13px 0" }}>Submit Deposit</GoldBtn>
              </>
            )}
            {step === 2 && (
              <div>
                <div style={{ background: T.bg, borderRadius: 10, padding: 18, marginBottom: 18, fontSize: 13, lineHeight: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.dim }}>Currency</span><span style={{ color: T.gold, fontWeight: 600 }}>{currency}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.dim }}>Amount</span><span style={{ fontWeight: 600 }}>${fmt(parseFloat(amount))}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.dim }}>TX Hash</span><span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted }}>{txHash.slice(0, 20)}…</span></div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <GoldBtn onClick={() => setStep(1)} outline style={{ flex: 1 }}>Back</GoldBtn>
                  <GoldBtn onClick={confirm} style={{ flex: 1 }}>Confirm</GoldBtn>
                </div>
              </div>
            )}
          </div>

          {/* Recent Deposits */}
          <div className="fadeUp3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 12, color: T.dim, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Deposits</div>
            {MOCK.deposits.filter(d => d.user.email === "marcus@example.com").map(d => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{fmtUSD(d.amount)}</span>
                  <span style={{ fontSize: 11, color: T.dim, marginLeft: 8 }}>{d.currency}</span>
                </div>
                <Badge status={d.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* BANK TRANSFER */
function BankTransfer() {
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("chase");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // === PLAID INTEGRATION STATE (Real bank linking + Virtual Accounts) ===
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [showVirtualWallet, setShowVirtualWallet] = useState(false);
  const [virtualWallet, setVirtualWallet] = useState(null); // { wallet_id, balance, recipient_id }

  function submit() {
    if (!amount) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); setTimeout(() => { setDone(false); setAmount(""); }, 3000); }, 1400);
  }

  const banks = [
    { id: "chase", label: "Chase Checking •••4821" },
    { id: "bofa",  label: "Bank of America •••2901" },
  ];

  // === REAL PLAID BANK LINKING (Phase 0 from our plan) ===
  const openPlaidLink = () => {
    setPlaidLoading(true);

    if (!window.Plaid) {
      alert("Plaid Link is still loading. Please wait a moment and try again.");
      setPlaidLoading(false);
      return;
    }

    // In PRODUCTION: Fetch a fresh link_token from your backend
    // Example backend call: POST /api/plaid/create-link-token with products: ["auth", "identity"]
    // For now, this uses Plaid's sandbox demo flow (replace with real token from your backend)

    const handler = window.Plaid.create({
      // PRODUCTION: Use a real link_token from your backend (see our earlier PLAN.md)
      // For demo / sandbox testing, you can use Plaid's hosted demo or generate via your Plaid dashboard
      token: "link-sandbox-demo-token", // ← REPLACE with real link_token from backend in production

      onSuccess: (public_token, metadata) => {
        setPlaidLoading(false);
        console.log("Plaid Link Success:", public_token, metadata);

        // In REAL app: Send public_token to backend → exchange for access_token
        // Then call /auth/get and /identity/get to get account details
        // Backend stores access_token securely (never expose to frontend)

        const newAccount = {
          id: Date.now(),
          institution: metadata.institution?.name || "Connected Bank",
          accountName: metadata.accounts?.[0]?.name || "Primary Checking",
          mask: metadata.accounts?.[0]?.mask || "1234",
          type: metadata.accounts?.[0]?.type || "depository",
          linkedAt: new Date().toISOString(),
        };

        setLinkedAccounts((prev) => [...prev, newAccount]);

        // Optional: Auto-offer to create Virtual Wallet after successful link
        setTimeout(() => {
          if (confirm("Bank linked successfully! Would you like to create a Virtual Account for advanced funding & payouts?")) {
            createVirtualWalletDemo(newAccount);
          }
        }, 800);
      },

      onExit: (err, metadata) => {
        setPlaidLoading(false);
        if (err) {
          console.error("Plaid Link error:", err);
          alert("Bank linking cancelled or failed. Please try again.");
        }
      },

      // Recommended for production
      product: ["auth", "identity"], // As per our Phase 0 plan
      country_codes: ["US", "GB", "CA"], // Add your supported countries
      language: "en",
    });

    handler.open();
  };

  // === VIRTUAL ACCOUNTS DEMO (from our earlier detailed plan) ===
  const createVirtualWalletDemo = (linkedAccount = null) => {
    setPlaidLoading(true);

    // In REAL production:
    // 1. Backend calls Plaid /wallet/create with iso_currency_code: "USD" or "GBP"
    // 2. Returns wallet_id, balance, recipient_id, numbers
    // 3. Store wallet_id with the user

    setTimeout(() => {
      const newWallet = {
        wallet_id: "wallet_" + Date.now(),
        balance: 0,
        currency: "USD",
        recipient_id: "rcpt_" + Math.random().toString(36).slice(2, 10),
        linked_to: linkedAccount ? linkedAccount.institution : "Primary Bank",
        created_at: new Date().toISOString(),
      };

      setVirtualWallet(newWallet);
      setShowVirtualWallet(true);
      setPlaidLoading(false);

      alert(`Virtual Account created successfully!\nWallet ID: ${newWallet.wallet_id}\n\nYou can now fund your trading account with real bank transfers via Plaid.`);
    }, 1200);
  };

  const fundViaPlaidDemo = () => {
    if (!virtualWallet) {
      alert("Please create a Virtual Account first.");
      return;
    }
    if (linkedAccounts.length === 0) {
      alert("Please link a bank account with Plaid first.");
      return;
    }

    const fundAmount = prompt("Enter amount to fund (USD):", "500");
    if (!fundAmount) return;

    setPlaidLoading(true);

    // REAL FLOW (from our PLAN.md):
    // Backend: /payment_initiation/payment/create with recipient_id from wallet
    // Then launch Plaid Link Payment Initiation mode or use the linked account
    // Listen for PAYMENT_STATUS_UPDATE + WALLET_TRANSACTION_STATUS_UPDATE webhooks
    // Only credit balance after "SETTLED" status

    setTimeout(() => {
      setVirtualWallet((prev) => ({
        ...prev,
        balance: prev.balance + parseFloat(fundAmount),
      }));

      setPlaidLoading(false);
      alert(`✓ Funding successful!\n\n$${fundAmount} has been added to your Virtual Account (simulated settlement).\nNew balance: $${(virtualWallet.balance + parseFloat(fundAmount)).toFixed(2)}\n\nIn production this would use real Plaid Payment Initiation + webhooks.`);
    }, 1500);
  };

  const payoutDemo = () => {
    if (!virtualWallet || virtualWallet.balance <= 0) {
      alert("No balance in Virtual Account to withdraw.");
      return;
    }

    const payoutAmount = prompt("Enter withdrawal amount (USD):", virtualWallet.balance.toString());
    if (!payoutAmount || parseFloat(payoutAmount) > virtualWallet.balance) return;

    setPlaidLoading(true);

    setTimeout(() => {
      setVirtualWallet((prev) => ({
        ...prev,
        balance: prev.balance - parseFloat(payoutAmount),
      }));
      setPlaidLoading(false);
      alert(`✓ Payout of $${payoutAmount} initiated to your linked bank.\n\nIn production: Uses /wallet/transaction/execute with BACS/ACH details from the linked account + webhook confirmation.`);
    }, 1200);
  };

  return (
    <div>
      <SectionHeader title="Bank Transfer & Plaid Integration" sub="Real bank linking with Plaid + Virtual Accounts for advanced funding & payouts" />

      {/* ========== REAL PLAID BANK LINKING + VIRTUAL ACCOUNTS SECTION ========== */}
      <div className="fadeUp1" style={{ background: T.card, border: `1px solid ${T.borderGold}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 22, background: `linear-gradient(${T.gold}, ${T.goldDim})`, borderRadius: 2 }} />
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.text }}>Connect Bank with Plaid</h3>
          <span style={{ fontSize: 11, background: T.goldFaint, color: T.gold, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T.borderGold}` }}>LIVE INTEGRATION</span>
        </div>

        <p style={{ color: T.dim, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
          Securely link your bank account using Plaid (Auth + Identity). Then create a <strong>Virtual Account</strong> for granular control, real-time settlement tracking, and instant funding/payouts.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <GoldBtn onClick={openPlaidLink} style={{ padding: "14px 28px", fontSize: 14 }} disabled={plaidLoading}>
            {plaidLoading ? "Connecting..." : "🔗 Link Bank Account with Plaid"}
          </GoldBtn>

          {linkedAccounts.length > 0 && (
            <GoldBtn onClick={() => createVirtualWalletDemo(linkedAccounts[0])} outline style={{ padding: "14px 24px", fontSize: 14 }} disabled={plaidLoading}>
              Create Virtual Account
            </GoldBtn>
          )}
        </div>

        {/* Linked Accounts */}
        {linkedAccounts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: T.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Linked Bank Accounts</div>
            {linkedAccounts.map((acc, idx) => (
              <div key={idx} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{acc.institution}</div>
                  <div style={{ fontSize: 12, color: T.dim }}>{acc.accountName} •••{acc.mask}</div>
                </div>
                <Badge status="active" />
              </div>
            ))}
          </div>
        )}

        {/* Virtual Account Panel */}
        {virtualWallet && (
          <div style={{ background: T.panel, border: `1px solid ${T.gold}`, borderRadius: 12, padding: 20, marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: T.gold, fontWeight: 600 }}>VIRTUAL ACCOUNT ACTIVE</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: T.dim }}>{virtualWallet.wallet_id}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.dim }}>Balance</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: T.gold, fontFamily: "'Playfair Display',serif" }}>${virtualWallet.balance.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={fundViaPlaidDemo} style={{ flex: 1 }} disabled={plaidLoading}>
                Fund Trading Account
              </GoldBtn>
              <GoldBtn onClick={payoutDemo} outline style={{ flex: 1 }} disabled={plaidLoading || virtualWallet.balance <= 0}>
                Withdraw to Bank
              </GoldBtn>
            </div>

            <div style={{ fontSize: 11, color: T.dim, marginTop: 12, textAlign: "center" }}>
              Real Plaid flow: Payment Initiation → Settlement Webhook → Balance Update
            </div>
          </div>
        )}

        <div style={{ fontSize: 11, color: T.muted, marginTop: 16, lineHeight: 1.5 }}>
          <strong>Production notes:</strong> Replace the demo token with a real <code>link_token</code> from your backend. Full implementation details are in our earlier Plaid integration plan.
        </div>
      </div>
      {/* ========== END PLAID SECTION ========== */}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div className="fadeUp1" style={{ flex: 2, minWidth: 300 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
              {["deposit", "withdraw", "history"].map(t => (
                <div key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: "14px 0", textAlign: "center", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                    color: tab === t ? T.gold : T.dim,
                    borderBottom: tab === t ? `2px solid ${T.gold}` : "2px solid transparent",
                    background: tab === t ? T.goldFaint : "transparent" }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              {(tab === "deposit" || tab === "withdraw") && (
                <>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.6, marginBottom: 20 }}>
                    {tab === "deposit" ? "Pull funds from your bank into your trading account. ACH settles in 1–3 business days." : "Withdraw funds from your trading account back to your bank. ACH settles in 1–3 business days."}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bank Account</label>
                    <select value={bank} onChange={e => setBank(e.target.value)}
                      style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: T.text, outline: "none" }}>
                      {banks.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                    </select>
                  </div>

                  <Input label="Amount (USD)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />

                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {["100", "500", "1000", "5000"].map(q => (
                      <div key={q} onClick={() => setAmount(q)}
                        style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 7, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 13, color: T.muted, background: T.bg, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.goldDim; e.currentTarget.style.color = T.gold; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}>
                        ${q}
                      </div>
                    ))}
                  </div>

                  {done
                    ? <div style={{ background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 9, padding: "12px 16px", fontSize: 13, color: T.green, textAlign: "center" }}>
                        ✓ {tab === "deposit" ? "Deposit" : "Withdrawal"} of ${fmt(parseFloat(amount))} initiated — settling in 1–3 days
                      </div>
                    : <GoldBtn onClick={submit} style={{ width: "100%", padding: "13px 0", opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Processing…" : tab === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
                      </GoldBtn>
                  }

                  <div style={{ marginTop: 16, fontSize: 12, color: T.blue, cursor: "pointer", textAlign: "center" }}>+ Link a new bank account</div>
                </>
              )}

              {tab === "history" && (
                <Table
                  cols={["Date", "Type", "Amount", "Bank", "Status"]}
                  rows={[
                    ["May 1", "Deposit",  "$10,000", "Chase •••4821", <Badge status="confirmed" />],
                    ["Apr 28", "Deposit", "$5,000",  "BofA •••2901",  <Badge status="confirmed" />],
                    ["Apr 15", "Withdraw","$2,000",  "Chase •••4821", <Badge status="confirmed" />],
                  ]}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div className="fadeUp2" style={{ flex: 1, minWidth: 220 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 12, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>ACH Flow</div>
            {[
              { step: "1", label: "Submit transfer", desc: "Secure bank authorization" },
              { step: "2", label: "ACH processing", desc: "1–3 business days" },
              { step: "3", label: "Confirmation", desc: "Webhook & balance update" },
              { step: "4", label: "Funds available", desc: "Ready for trading" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${T.goldDim}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: T.gold, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* HISTORY */
function History() {
  return (
    <div>
      <SectionHeader title="Transaction History" sub="All credits, debits, deposits & profit entries" />

      <div className="fadeUp1" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <Table
          cols={["Date", "Type", "Amount", "Balance Before", "Balance After", "Description"]}
          rows={[
            ["May 1, 2026",  "Deposit", <span style={{ color: T.green }}>+$10,000</span>, "$14,860.50", "$24,860.50", "BTC deposit confirmed"],
            ["Apr 28, 2026", "Profit",  <span style={{ color: T.green }}>+$1,240.50</span>, "$13,620.00", "$14,860.50", "Profit distribution"],
            ["Apr 15, 2026", "Deposit", <span style={{ color: T.green }}>+$10,000</span>, "$3,620.00",  "$13,620.00", "USDT deposit confirmed"],
            ["Apr 10, 2026", "Credit",  <span style={{ color: T.green }}>+$3,620.00</span>, "$0.00",     "$3,620.00",  "Initial balance credit"],
          ]}
        />
      </div>
    </div>
  );
}

/* ADMIN DASHBOARD */
function AdminDashboard() {
  const s = MOCK.stats;
  return (
    <div>
      <SectionHeader title="Platform Overview" sub="Admin panel · Real-time stats" />

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard delay={1} label="Total Users" value={s.totalUsers} sub={`${s.activeUsers} active`} color={T.gold} />
        <StatCard delay={2} label="Total Deposited" value={fmtUSD(s.totalDeposited)} sub="All confirmed" />
        <StatCard delay={3} label="Total AUM" value={fmtUSD(s.totalBalance)} sub="All balances" color={T.blue} />
        <StatCard delay={4} label="Total Profit" value={fmtUSD(s.totalProfit)} sub="Paid out" color={T.green} />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Pending deposits */}
        <div className="fadeUp3" style={{ flex: 2, minWidth: 300, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Pending Deposits</span>
            <span style={{ fontSize: 11, background: T.goldFaint, color: T.gold, border: `1px solid ${T.borderGold}`, borderRadius: 4, padding: "2px 8px" }}>
              {MOCK.deposits.filter(d => d.status === "pending").length} waiting
            </span>
          </div>
          <Table
            cols={["User", "Amount", "Currency", "Status"]}
            rows={MOCK.deposits.map(d => [
              <span><div style={{ fontWeight: 500 }}>{d.user.name}</div><div style={{ fontSize: 11, color: T.dim }}>{d.user.email}</div></span>,
              fmtUSD(d.amount),
              <span style={{ fontSize: 12, background: T.panel, padding: "3px 8px", borderRadius: 4, color: T.muted }}>{d.currency}</span>,
              <Badge status={d.status} />,
            ])}
          />
        </div>

        {/* Quick stats */}
        <div className="fadeUp4" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: T.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>User Breakdown</div>
            {[
              { label: "Active",    value: 3, color: T.green },
              { label: "Suspended", value: 1, color: T.red },
              { label: "Total",     value: 4, color: T.gold },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.dim }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 12, color: T.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Key Endpoints</div>
            {["/api/admin/stats", "/api/admin/users", "/api/admin/deposits", "/api/admin/transactions"].map(ep => (
              <div key={ep} style={{ fontSize: 11, fontFamily: "monospace", color: T.muted, padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>{ep}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ADMIN USERS */
function AdminUsers() {
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [toast, setToast] = useState("");

  function apply() {
    if (!amount) return;
    setToast(`✓ ${type} of ${fmtUSD(parseFloat(amount))} applied to ${selected.name}`);
    setTimeout(() => setToast(""), 3000);
    setSelected(null); setAmount(""); setDesc("");
  }

  return (
    <div>
      <SectionHeader title="User Management" sub="View, credit, debit, suspend users" />

      {toast && (
        <div style={{ background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 9, padding: "12px 18px", marginBottom: 18, fontSize: 13, color: T.green }}>{toast}</div>
      )}

      <div className="fadeUp1" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: selected ? 20 : 0 }}>
        <Table
          cols={["User", "Balance", "Deposited", "Profit", "Status", "Joined", "Actions"]}
          rows={MOCK.users.map(u => [
            <span><div style={{ fontWeight: 500 }}>{u.name}</div><div style={{ fontSize: 11, color: T.dim }}>{u.email}</div></span>,
            <span style={{ fontWeight: 600, color: T.gold }}>{fmtUSD(u.balance)}</span>,
            fmtUSD(u.deposited),
            <span style={{ color: T.green }}>{fmtUSD(u.profit)}</span>,
            <Badge status={u.status} />,
            u.createdAt,
            <GoldBtn onClick={() => setSelected(u)} outline style={{ padding: "5px 14px", fontSize: 12 }}>Manage</GoldBtn>,
          ])}
        />
      </div>

      {selected && (
        <div className="fadeUp" style={{ background: T.card, border: `1px solid ${T.borderGold}`, borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: T.dim }}>{selected.email} · Balance: <strong style={{ color: T.gold }}>{fmtUSD(selected.balance)}</strong></div>
            </div>
            <div onClick={() => setSelected(null)} style={{ cursor: "pointer", color: T.dim, fontSize: 18 }}>✕</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["credit", "debit", "profit"].map(t => (
              <div key={t} onClick={() => setType(t)}
                style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, border: `1px solid ${type === t ? T.gold : T.border}`, background: type === t ? T.goldFaint : T.bg, color: type === t ? T.gold : T.dim, textTransform: "capitalize", transition: "all 0.15s" }}>
                {t}
              </div>
            ))}
          </div>

          <Input label="Amount (USD)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          <Input label="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Profit distribution Q1" />

          <GoldBtn onClick={apply} style={{ width: "100%", padding: "12px 0" }}>
            Apply {type.charAt(0).toUpperCase() + type.slice(1)}
          </GoldBtn>
        </div>
      )}
    </div>
  );
}

/* ADMIN DEPOSITS */
function AdminDeposits() {
  const [deps, setDeps] = useState(MOCK.deposits);
  const [toast, setToast] = useState("");

  function approve(id) {
    setDeps(d => d.map(x => x.id === id ? { ...x, status: "confirmed" } : x));
    setToast("✓ Deposit approved and balance credited");
    setTimeout(() => setToast(""), 3000);
  }
  function reject(id) {
    setDeps(d => d.map(x => x.id === id ? { ...x, status: "rejected" } : x));
    setToast("✗ Deposit rejected");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      <SectionHeader title="Deposit Review" sub="Approve or reject pending crypto deposits" />

      {toast && (
        <div style={{ background: toast.startsWith("✓") ? T.greenBg : T.redBg, border: `1px solid ${toast.startsWith("✓") ? T.green : T.red}`, borderRadius: 9, padding: "12px 18px", marginBottom: 18, fontSize: 13, color: toast.startsWith("✓") ? T.green : T.red }}>{toast}</div>
      )}

      <div className="fadeUp1" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <Table
          cols={["User", "Amount", "Currency", "TX Hash", "Date", "Status", "Actions"]}
          rows={deps.map(d => [
            <span><div style={{ fontWeight: 500 }}>{d.user.name}</div><div style={{ fontSize: 11, color: T.dim }}>{d.user.email}</div></span>,
            <span style={{ fontWeight: 600 }}>{fmtUSD(d.amount)}</span>,
            d.currency,
            <span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted }}>{d.txHash}</span>,
            d.createdAt,
            <Badge status={d.status} />,
            d.status === "pending"
              ? <div style={{ display: "flex", gap: 6 }}>
                  <GoldBtn onClick={() => approve(d.id)} style={{ padding: "5px 12px", fontSize: 12 }}>Approve</GoldBtn>
                  <GoldBtn onClick={() => reject(d.id)} outline style={{ padding: "5px 12px", fontSize: 12, color: T.red, borderColor: T.red }}>Reject</GoldBtn>
                </div>
              : <span style={{ fontSize: 11, color: T.dim }}>Processed</span>
          ])}
        />
      </div>
    </div>
  );
}

/* ADMIN TRANSACTIONS */
function AdminTransactions() {
  return (
    <div>
      <SectionHeader title="All Transactions" sub="Full audit log" />

      <div className="fadeUp1" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <Table
          cols={["Date", "User", "Type", "Amount", "Before", "After", "Description", "By"]}
          rows={[
            ["May 1",  "Marcus Webb",  <Badge status="confirmed" />, <span style={{ color: T.green }}>+$10,000</span>, "$14,860.50", "$24,860.50", "BTC deposit confirmed", "Admin"],
            ["Apr 28", "Marcus Webb",  "profit",  <span style={{ color: T.green }}>+$1,240.50</span>, "$13,620.00", "$14,860.50", "Profit distribution", "Admin"],
            ["Apr 20", "Sarah Chen",   "deposit", <span style={{ color: T.green }}>+$5,000</span>,    "$3,420.00",  "$8,420.00",  "USDT deposit",        "Admin"],
            ["Apr 15", "Marcus Webb",  "deposit", <span style={{ color: T.green }}>+$10,000</span>,   "$3,620.00",  "$13,620.00", "USDT deposit",        "Admin"],
            ["Apr 10", "Theo Okafor",  "deposit", <span style={{ color: T.green }}>+$3,000</span>,    "$200.00",    "$3,200.00",  "BTC deposit",         "Admin"],
          ]}
        />
      </div>
    </div>
  );
}

/* ─── APP SHELL ──────────────────────────────────────────────────────── */

export default function App() {
  const [auth, setAuth] = useState(null); // null | "user" | "admin"
  const [page, setPage] = useState("dashboard");

  // Load Plaid Link script once at the app level (available on all pages)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  function handleLogin(role) {
    setAuth(role);
    setPage(role === "admin" ? "admin-dashboard" : "dashboard");
  }

  if (!auth) return (
    <>
      <style>{GS}</style>
      <LoginPage onLogin={handleLogin} />
    </>
  );

  const pages = {
    "dashboard": <Dashboard />,
    "portfolio": <Portfolio />,
    "deposit":   <Deposit />,
    "bank":      <BankTransfer />,
    "history":   <History />,
    "admin-dashboard": <AdminDashboard />,
    "admin-users":     <AdminUsers />,
    "admin-deposits":  <AdminDeposits />,
    "admin-txns":      <AdminTransactions />,
  };

  return (
    <>
      <style>{GS}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} role={auth} onLogout={() => { setAuth(null); }} />
        <main style={{ flex: 1, padding: "36px 32px", overflowY: "auto", minWidth: 0, background: T.bg }}>
          {/* Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: T.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ color: T.goldDim }}>Luna Trade</span> · {auth === "admin" ? "Admin Portal" : "Client Portal"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="pulseDot" style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
              <span style={{ fontSize: 12, color: T.dim }}>API Online</span>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.goldFaint, border: `1px solid ${T.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.gold }}>
                {auth === "admin" ? "A" : "M"}
              </div>
            </div>
          </div>

          {pages[page] || <div style={{ color: T.dim }}>Page not found</div>}
        </main>
      </div>
    </>
  );
}
