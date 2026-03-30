import { useState } from "react";
import "./App.css";

// ─── 공통 컴포넌트 ───────────────────────────────────────────────────────────

function PhoneFrame({ children, title }) {
  return (
    <div className="phone-frame">
      <div className="phone-screen">{children}</div>
    </div>
  );
}

function GreenButton({ children, onClick, fullWidth }) {
  return (
    <button
      className={`green-btn${fullWidth ? " full-width" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─── 화면 1: 로그인 ──────────────────────────────────────────────────────────

function LoginScreen({ onNavigate }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="screen login-screen">
      <h1 className="login-title">로그인</h1>
      <div className="form-group">
        <input
          className="input-field"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="비밀번호 입력"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <p className="find-link">8자 이상 입력하세요</p>
      </div>
      <GreenButton fullWidth onClick={() => onNavigate("home")}>
        로그인
      </GreenButton>
      <p className="sub-link">
        계정이 없으신가요?{" "}
        <span className="link" onClick={() => onNavigate("register")}>
          회원가입하기
        </span>
      </p>
    </div>
  );
}

// ─── 화면 2: 회원가입 ────────────────────────────────────────────────────────

function RegisterScreen({ onNavigate }) {
  return (
    <div className="screen register-screen">
      <h1 className="register-title">회원가입</h1>
      <div className="form-group">
        {["사용자 이름", "이메일 입력", "아이디 입력", "비밀번호 입력"].map(
          (ph) => (
            <input key={ph} className="input-field" placeholder={ph} />
          )
        )}
        <p className="find-link">8자 이상 입력하세요</p>
        <input className="input-field" placeholder="비밀번호 재입력" />
        <p className="find-link">비밀번호를 확인하세요</p>
      </div>
      <GreenButton fullWidth onClick={() => onNavigate("login")}>
        회원가입/로그인
      </GreenButton>
      <p className="sub-link">
        계정이 있으신가요?{" "}
        <span className="link" onClick={() => onNavigate("login")}>
          로그인하기
        </span>
      </p>
    </div>
  );
}

// ─── 화면 3: 온보딩 ──────────────────────────────────────────────────────────

function OnboardingScreen({ onNavigate }) {
  return (
    <div className="screen onboarding-screen">
      <div className="onboarding-logo">Logo</div>
      <h2 className="onboarding-title">
        여행을 추가하고
        <br />
        예산을 관리해보세요!
      </h2>
      <p className="onboarding-sub link" onClick={() => onNavigate("login")}>
        가이드 바로가기
      </p>
      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={() => onNavigate("createTrip")}>
        여행 기록하기
      </GreenButton>
    </div>
  );
}

// ─── 화면 4: 여행 생성 ───────────────────────────────────────────────────────

function CreateTripScreen({ onNavigate }) {
  return (
    <div className="screen create-trip-screen">
      <div className="top-bar">
        <span className="back-arrow" onClick={() => onNavigate("home")}>
          ←
        </span>
      </div>
      <div className="create-info">
        <div className="flag-emoji">🇺🇸 미국</div>
        <div className="date-badge">2025년 3월30일 ~ 2026년 3월 31</div>
        <div className="trip-name-label">택시스 여행</div>
      </div>
      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={() => onNavigate("home")}>
        만들기
      </GreenButton>
    </div>
  );
}

// ─── 화면 5: 홈(여행 목록) ───────────────────────────────────────────────────

const TRIPS = [
  { id: 1, name: "미국 배낭여행", budget: "사용 예산: 100만원", flag: "🇺🇸" },
  { id: 2, name: "도쿄 우정여행", budget: "사용 예산: 120만원", flag: "🇯🇵" },
  { id: 3, name: "경주 가족여행", budget: "사용 예산: 70만원", flag: "🇰🇷" },
  { id: 4, name: "부산 광안리", budget: "사용 예산: 50만원", flag: "🇰🇷" },
];

function HomeScreen({ onNavigate }) {
  return (
    <div className="screen home-screen">
      <div className="home-header">
        <span className="filter-icon" onClick={() => onNavigate("tripFilter")}>
          ⊟
        </span>
      <span className="hamburger">☰</span>
      </div>
      <div className="trip-grid">
        {TRIPS.map((t) => (
          <div
            key={t.id}
            className="trip-card"
            onClick={() => onNavigate("tripDetail")}
          >
            <div className="trip-card-img">{t.flag}</div>
            <div className="trip-card-name">{t.name}</div>
            <div className="trip-card-budget">{t.budget}</div>
          </div>
        ))}
      </div>
      <GreenButton fullWidth onClick={() => onNavigate("createTrip")}>
        여행 기록하기
      </GreenButton>
    </div>
  );
}

// ─── 화면 6: 여행 상세 (지출 탭) ─────────────────────────────────────────────

function TripDetailScreen({ onNavigate }) {
  const [tab, setTab] = useState("지출");
  const tabs = ["지출", "회차", "수익", "목록"];
  return (
    <div className="screen trip-detail-screen">
      {/* 헤더 */}
      <div className="detail-header">
        <span className="home-icon">🏠</span>
        <span className="detail-title">대한민국</span>
        <span className="menu-icon">☰</span>
      </div>
      {/* 탭 */}
      <div className="day-tabs">
        {["월", "화", "수", "목"].map((d, i) => (
          <div key={d} className="day-col">
            <div className="day-label">{d}</div>
            <div className="day-num">{[30, 31, 1, 2][i]}</div>
          </div>
        ))}
      </div>
      {/* 예산 요약 */}
      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체예산</div>
          <div className="budget-amount">400,000</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여예산</div>
          <div className="budget-amount">250,000</div>
        </div>
      </div>
      {/* 날짜 섹션 */}
      <div className="day-section-title">3월 30일</div>
      <div className="expense-item red">
        <div>
          <div className="expense-label">미국 배낭여행</div>
          <div className="expense-sub">사용 예산 500원</div>
        </div>
        <div className="expense-amount red-text">- 150,000</div>
      </div>
      <div className="expense-item green-item">
        <div>
          <div className="expense-label">도쿄 우정여행</div>
          <div className="expense-sub">사용 예산 120만원</div>
        </div>
        <div className="expense-amount green-text">+ 400,000</div>
      </div>
      {/* 지출 카테고리 */}
      <div className="category-section">
        <div className="category-label">지출</div>
        <div className="category-tags">
          <span className="tag green-tag">식비</span>
          <span className="tag">수입</span>
        </div>
        <div className="category-label">지출</div>
        <span className="tag">하시경</span>
      </div>
      {/* 플로팅 버튼 */}
      <button className="fab" onClick={() => onNavigate("addExpense")}>
        +
      </button>
    </div>
  );
}

// ─── 화면 7: 통계 ────────────────────────────────────────────────────────────

function StatsScreen({ onNavigate }) {
  const stats = [
    { label: "숙박비", amount: "₩150,000", pct: "42%", color: "#a78bfa" },
    { label: "쇼핑", amount: "₩150,000", pct: "42%", color: "#f87171" },
    { label: "식비", amount: "₩150,000", pct: "42%", color: "#34d399" },
  ];
  return (
    <div className="screen stats-screen">
      <div className="detail-header">
        <span className="home-icon">🏠</span>
        <span className="detail-title">대한민국(통계)</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="day-tabs">
        {["월", "화", "수", "목"].map((d, i) => (
          <div key={d} className="day-col">
            <div className="day-label">{d}</div>
            <div className="day-num">{[30, 31, 1, 2][i]}</div>
          </div>
        ))}
      </div>
      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체예산</div>
          <div className="budget-amount">400,000</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여예산</div>
          <div className="budget-amount">250,000</div>
        </div>
      </div>
      <div className="stats-date-range">3월 30일 ~ 4월 2일 카테고리</div>
      {/* 도넛 차트 (CSS) */}
      <div className="donut-wrapper">
        <div className="donut"></div>
      </div>
      <div className="stats-legend">
        {stats.map((s) => (
          <div key={s.label} className="legend-row">
            <span
              className="legend-dot"
              style={{ background: s.color }}
            ></span>
            <span className="legend-label">{s.label}</span>
            <span className="legend-amount">{s.amount}</span>
            <span className="legend-pct">{s.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 화면 8: 지출 목록 (미국 배낭여행) ───────────────────────────────────────

function ExpenseListScreen({ onNavigate }) {
  const items = [1, 2, 3, 4, 5];
  const cats = ["전체", "음식", "교통", "관광", "숙박", "쇼핑", "기타"];
  return (
    <div className="screen expense-list-screen">
      <div className="detail-header">
        <span className="home-icon">🏠</span>
        <span className="detail-title">미국 배낭여행</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="🔍 SEARCH HERE..." />
      </div>
      <div className="cat-tabs">
        {cats.map((c) => (
          <span key={c} className="cat-tab">
            {c}
          </span>
        ))}
      </div>
      <div className="sub-row">
        <span className="sub-label">날짜</span>
        <span className="sub-label">최신순</span>
      </div>
      <div className="expense-list">
        {items.map((i) => (
          <div key={i} className="expense-row">
            <div className="expense-row-left">
              <div className="expense-color-bar green-bar"></div>
              <div>
                <div className="expense-row-date">2025.00.00 ~ 2025.00.00</div>
              </div>
            </div>
            <div className="expense-row-amount">10,000 원</div>
            <button className="edit-btn">✎</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[1, 2, 3, 4, 5].map((p) => (
          <span key={p} className={`page-dot${p === 1 ? " active" : ""}`}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 메인 앱 ─────────────────────────────────────────────────────────────────

const SCREEN_MAP = {
  login: LoginScreen,
  register: RegisterScreen,
  onboarding: OnboardingScreen,
  createTrip: CreateTripScreen,
  home: HomeScreen,
  tripDetail: TripDetailScreen,
  stats: StatsScreen,
  expenseList: ExpenseListScreen,
};

export default function App() {
  const [screen, setScreen] = useState("login");

  const ScreenComponent = SCREEN_MAP[screen] || LoginScreen;

  return (
    <div className="app-root">
      {/* 상단 내비게이션 */}
      <nav className="top-nav">
        <div className="nav-logo">✈ TripBudget</div>
        <div className="nav-links">
          {[
            ["login", "로그인"],
            ["register", "회원가입"],
            ["onboarding", "온보딩"],
            ["home", "홈"],
            ["tripDetail", "여행상세"],
            ["stats", "통계"],
            ["expenseList", "지출목록"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`nav-btn${screen === key ? " active" : ""}`}
              onClick={() => setScreen(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* 폰 목업 */}
      <div className="canvas">
        <div className="phone-mockup">
          <div className="phone-notch"></div>
          <div className="phone-inner">
            <ScreenComponent onNavigate={setScreen} />
          </div>
          <div className="phone-home-bar"></div>
        </div>
      </div>
    </div>
  );
}
