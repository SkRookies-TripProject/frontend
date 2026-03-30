import { useState } from "react";
import "./App.css";

// ─── 공통 컴포넌트 ───────────────────────────────────────────────────────────

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
      <div className="logo-wrapper">
        <img src="/src/img/logo.png" alt="logo" className="logo" />
      </div>
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
      {/* 로그인 완료 시 "afterLogin" 이벤트 발생 → App에서 trips 유무 체크 */}
      <GreenButton fullWidth onClick={() => onNavigate("afterLogin")}>
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
      {/* 회원가입 완료 시도 "afterLogin" 이벤트 발생 → 신규 유저이므로 항상 온보딩으로 감 */}
      <GreenButton fullWidth onClick={() => onNavigate("afterLogin")}>
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

// ─── 화면 3: 온보딩 (여행 없을 때 홈) ────────────────────────────────────────

function OnboardingScreen({ onNavigate }) {
  return (
    <div className="screen onboarding-screen">
      <img src="/src/img/logo.png" alt="logo" className="logo" />
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

// ─── 국가 목록 ───────────────────────────────────────────────────────────────

const COUNTRIES = [
  { flag: "🇰🇷", name: "대한민국" },
  { flag: "🇺🇸", name: "미국" },
  { flag: "🇯🇵", name: "일본" },
  { flag: "🇨🇳", name: "중국" },
  { flag: "🇫🇷", name: "프랑스" },
  { flag: "🇩🇪", name: "독일" },
  { flag: "🇬🇧", name: "영국" },
  { flag: "🇮🇹", name: "이탈리아" },
  { flag: "🇪🇸", name: "스페인" },
  { flag: "🇹🇭", name: "태국" },
  { flag: "🇻🇳", name: "베트남" },
  { flag: "🇸🇬", name: "싱가포르" },
  { flag: "🇦🇺", name: "호주" },
  { flag: "🇨🇦", name: "캐나다" },
  { flag: "🇲🇽", name: "멕시코" },
  { flag: "🇧🇷", name: "브라질" },
  { flag: "🇮🇳", name: "인도" },
  { flag: "🇹🇷", name: "튀르키예" },
  { flag: "🇬🇷", name: "그리스" },
  { flag: "🇵🇹", name: "포르투갈" },
];
// ─── 화면 4: 여행 생성 ───────────────────────────────────────────────────────

function CreateTripScreen({ onNavigate, onAddTrip }) {
  const [tripName, setTripName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // 미국 기본값
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCreate = () => {
    if (!tripName.trim()) return;
    onAddTrip({
      name: tripName,
      flag: selectedCountry.flag,
      country: selectedCountry.name,
      startDate,
      endDate,
      budget: budget ? `사용 예산: ${budget}` : "사용 예산: 미설정",
    });
  };

  return (
    <div className="screen create-trip-screen">
      <div className="top-bar">
        <span className="back-arrow" onClick={() => onNavigate("back")}>←</span>
        <span className="top-bar-title">여행 기록하기</span>
      </div>

      <div className="create-form">
        {/* 국가 선택 */}
        <div className="form-label">국가</div>
        <div
          className="country-selector"
          onClick={() => setShowCountryPicker(!showCountryPicker)}
        >
          <span className="country-flag-large">{selectedCountry.flag}</span>
          <span className="country-name-text">{selectedCountry.name}</span>
          <span className="country-arrow">{showCountryPicker ? "▲" : "▼"}</span>
        </div>

        {/* 국가 드롭다운 */}
        {showCountryPicker && (
          <div className="country-dropdown">
            {COUNTRIES.map((c) => (
              <div
                key={c.name}
                className={`country-option${selectedCountry.name === c.name ? " selected" : ""}`}
                onClick={() => {
                  setSelectedCountry(c);
                  setShowCountryPicker(false);
                }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 여행 기간 */}
        <div className="form-label" style={{ marginTop: 16 }}>여행 기간</div>
        <div className="date-row">
          <input
            className="input-field date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="date-sep">~</span>
          <input
            className="input-field date-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* 여행 제목 */}
        <div className="form-label" style={{ marginTop: 16 }}>여행 제목</div>
        <input
          className="input-field"
          placeholder="예) 도쿄 우정여행"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />

        {/* 예산 */}
        <div className="form-label">총 예산</div>
        <input className="input-field" value={budget} onChange={(e) => setBudget(e.target.value)} />

        <input
          className="input-field"
          placeholder="예) 1000000"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        {budget && (
          <p className="budget-preview">
            {Number(budget).toLocaleString()}원
          </p>
        )}
      </div>

      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={handleCreate}>
        만들기
      </GreenButton>
    </div>
  );
}

// ─── 화면 5: 홈(여행 목록) ───────────────────────────────────────────────────

function HomeScreen({ trips, onNavigate, onSelectTrip }) {
  return (
    <div className="screen home-screen">
      <div className="home-header">
        <span className="filter-icon" onClick={() => onNavigate("tripFilter")}>⊟</span>
        <span className="hamburger">☰</span>
      </div>

      <div className="trip-grid">
        {trips.map((t) => (
          <div
            key={t.id}
            className="trip-card"
            onClick={() => {
              onSelectTrip(t.id);
              onNavigate("tripDetail");
            }}
          >
            {/* 국기 썸네일 영역 */}
            <div className="trip-card-thumb">
              <span className="trip-card-flag">{t.flag}</span>
            </div>
            {/* 텍스트 영역 */}
            <div className="trip-card-body">
              <div className="trip-card-name">{t.name}</div>
              <div className="trip-card-budget">{t.budget}</div>
            </div>
          </div>
        ))}
      </div>

      <GreenButton fullWidth onClick={() => onNavigate("createTrip")}>
        여행 기록하기
      </GreenButton>
    </div>
  );
}

// ─── 카테고리 목록 ───────────────────────────────────────────────────────────

const CATEGORIES = ["ALL", "식비", "교통", "숙박", "관광", "쇼핑", "기타"];

// 카테고리별 더미 지출 데이터 (실제로는 trip.expenses 등에서 가져올 것)
const DUMMY_EXPENSES = [
  { id: 1, category: "식비",  label: "점심 식사",   amount: -15000 },
  { id: 2, category: "교통",  label: "지하철",       amount: -1350  },
  { id: 3, category: "숙박",  label: "호텔 1박",     amount: -80000 },
  { id: 4, category: "관광",  label: "박물관 입장",  amount: -12000 },
  { id: 5, category: "쇼핑",  label: "기념품",       amount: -25000 },
  { id: 6, category: "기타",  label: "환전 수수료",  amount: -3000  },
  { id: 7, category: "식비",  label: "저녁 식사",   amount: -32000 },
];

// ─── 화면 6: 여행 상세 ────────────────────────────────────────────────────────

function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 모드용 로컬 상태
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});

  // trip이 없으면 방어
  if (!trip) {
    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
          <span className="detail-title">여행을 선택해주세요</span>
        </div>
        <p style={{ padding: "24px", color: "#888", textAlign: "center" }}>
          홈에서 여행 카드를 눌러 선택해주세요.
        </p>
      </div>
    );
  }

  const budgetLabel = trip.budget.replace("사용 예산: ", "");

  // 카테고리 필터링
  const filteredExpenses =
    activeCategory === "ALL"
      ? DUMMY_EXPENSES
      : DUMMY_EXPENSES.filter((e) => e.category === activeCategory);

  // 수정 모드 진입 — 현재 값으로 초기화
  const enterEditMode = () => {
    setEditName(trip.name);
    const prices = {};
    DUMMY_EXPENSES.forEach((e) => {
      prices[e.id] = Math.abs(e.amount).toString();
    });
    setEditPrices(prices);
    setIsEditMode(true);
  };

  // 수정 저장
  const handleSave = () => {
    if (onUpdateTrip) {
      onUpdateTrip({ ...trip, name: editName });
    }
    setIsEditMode(false);
  };

  // ── 수정 모드 화면 ─────────────────────────────────────────────────────────
  if (isEditMode) {
    const editTargets =
      activeCategory === "ALL"
        ? DUMMY_EXPENSES
        : DUMMY_EXPENSES.filter((e) => e.category === activeCategory);

    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span
            className="home-icon"
            style={{ fontSize: 14, cursor: "pointer", color: "#2ecc71" }}
            onClick={() => setIsEditMode(false)}
          >
            ← 취소
          </span>
          <span className="detail-title">수정</span>
          <span
            className="menu-icon"
            style={{ fontSize: 14, cursor: "pointer", color: "#2ecc71", fontWeight: 600 }}
            onClick={handleSave}
          >
            저장
          </span>
        </div>

        <div className="edit-form">
          {/* 여행 제목 수정 */}
          <div className="edit-section-label">여행 제목</div>
          <input
            className="input-field"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          {/* 현재 카테고리 지출 가격 수정 */}
          <div className="edit-section-label" style={{ marginTop: 20 }}>
            {activeCategory === "ALL" ? "전체" : activeCategory} 카테고리 금액
          </div>

          {editTargets.map((e) => (
            <div key={e.id} className="edit-expense-row">
              <span className="edit-expense-label">{e.label}</span>
              <div className="edit-expense-input-wrap">
                <input
                  className="input-field edit-amount-input"
                  type="number"
                  value={editPrices[e.id] ?? ""}
                  onChange={(ev) =>
                    setEditPrices((prev) => ({ ...prev, [e.id]: ev.target.value }))
                  }
                />
                <span className="edit-expense-unit">원</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <GreenButton fullWidth onClick={handleSave}>
          저장하기
        </GreenButton>
      </div>
    );
  }

  // ── 일반 상세 화면 ─────────────────────────────────────────────────────────
  return (
    <div className="screen trip-detail-screen">
      {/* 헤더 */}
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
        <span className="detail-title">{trip.flag} {trip.name}</span>
        <span className="menu-icon">☰</span>
      </div>

      {/* 날짜 탭 */}
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
          <div className="budget-amount">{budgetLabel}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여예산</div>
          <div className="budget-amount">-</div>
        </div>
      </div>

      {/* 카테고리 필터 버튼 */}
      <div className="category-filter-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-filter-btn${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 지출 목록 */}
      <div className="expense-scroll">
        {filteredExpenses.length === 0 ? (
          <div className="expense-empty">
            <div>등록된 지출이 없습니다</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>
              수정 버튼을 눌러 추가해주세요
            </div>
          </div>
        ) : (
          filteredExpenses.map((e) => (
            <div key={e.id} className="expense-item">
              <div>
                <div className="expense-label">{e.label}</div>
                <div className="expense-sub">{e.category}</div>
              </div>
              <div className={`expense-amount ${e.amount < 0 ? "red-text" : "green-text"}`}>
                {e.amount < 0 ? "-" : "+"}{Math.abs(e.amount).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 버튼 2개 */}
      <div className="detail-bottom-btns">
        <button className="detail-action-btn stats-btn" onClick={() => onNavigate("stats")}>
          📊 통계
        </button>
        <button className="detail-action-btn edit-btn-main" onClick={enterEditMode}>
          ✏️ 수정
        </button>
      </div>
    </div>
  );
}

// ─── 화면 7: 통계 test ────────────────────────────────────────────────────────────

function StatsScreen({ onNavigate }) {
  const stats = [
    { label: "숙박비", amount: "₩150,000", pct: "42%", color: "#a78bfa" },
    { label: "쇼핑", amount: "₩150,000", pct: "42%", color: "#f87171" },
    { label: "식비", amount: "₩150,000", pct: "42%", color: "#34d399" },
  ];
  return (
    <div className="screen stats-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
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
      <div className="donut-wrapper">
        <div className="donut"></div>
      </div>
      <div className="stats-legend">
        {stats.map((s) => (
          <div key={s.label} className="legend-row">
            <span className="legend-dot" style={{ background: s.color }}></span>
            <span className="legend-label">{s.label}</span>
            <span className="legend-amount">{s.amount}</span>
            <span className="legend-pct">{s.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 화면 8: 지출 목록 ───────────────────────────────────────────────────────

function ExpenseListScreen({ onNavigate }) {
  const items = [1, 2, 3, 4, 5];
  const cats = ["전체", "음식", "교통", "관광", "숙박", "쇼핑", "기타"];
  return (
    <div className="screen expense-list-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
        <span className="detail-title">미국 배낭여행</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="🔍 SEARCH HERE..." />
      </div>
      <div className="cat-tabs">
        {cats.map((c) => (
          <span key={c} className="cat-tab">{c}</span>
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
          <span key={p} className={`page-dot${p === 1 ? " active" : ""}`}>{p}</span>
        ))}
      </div>
    </div>
  );
}

// ─── 메인 앱 ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("login");
  // trips 상태를 최상위에서 관리
  const [trips, setTrips] = useState([]);
  // 현재 선택된 여행 ID
  const [selectedTripId, setSelectedTripId] = useState(null);
  // 이전 화면 기록 (뒤로가기용)
  const [prevScreen, setPrevScreen] = useState("home");

  const navigate = (dest) => {
    // 로그인/회원가입 완료 후 trips 유무에 따라 분기
    if (dest === "afterLogin") {
      setScreen(trips.length === 0 ? "onboarding" : "home");
      return;
    }
    // 뒤로가기
    if (dest === "back") {
      setScreen(prevScreen);
      return;
    }
    setPrevScreen(screen);
    setScreen(dest);
  };

  // CreateTripScreen에서 호출 — 새 여행 추가 후 홈으로 이동
  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [
      ...prev,
      { id: Date.now(), ...newTrip },
    ]);
    setScreen("home");
  };

  // TripDetailScreen 수정 모드에서 저장 시 호출
  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
  };

  const renderScreen = () => {
    const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

    switch (screen) {
      case "login":
        return <LoginScreen onNavigate={navigate} />;
      case "register":
        return <RegisterScreen onNavigate={navigate} />;
      case "onboarding":
        return <OnboardingScreen onNavigate={navigate} />;
      case "createTrip":
        return <CreateTripScreen onNavigate={navigate} onAddTrip={handleAddTrip} />;
      case "home":
        return <HomeScreen trips={trips} onNavigate={navigate} onSelectTrip={setSelectedTripId} />;
      case "tripDetail":
        return <TripDetailScreen onNavigate={navigate} trip={selectedTrip} onUpdateTrip={handleUpdateTrip} />;
      case "stats":
        return <StatsScreen onNavigate={navigate} />;
      case "expenseList":
        return <ExpenseListScreen onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-root">
      {/* 상단 내비게이션 (개발용 — 프로덕션에서 제거 가능) */}
      <nav className="top-nav">
        <div className="nav-logo">✈ CosTrip</div>
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
            {renderScreen()}
          </div>
          <div className="phone-home-bar"></div>
        </div>
      </div>
    </div>
  );
}
