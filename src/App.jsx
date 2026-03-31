import { useEffect, useState } from "react";
import "./app.css";
import StatsScreen from "./pages/StatsScreen";
import TripJournalScreen from "./components/journal/TripJournalScreen";

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

function buildTripDays(trip) {
  if (!trip?.startDate || !trip?.endDate) {
    return [
      { label: "월", date: 30, fullDate: "3월30일", isoDate: "2026-03-30" },
      { label: "화", date: 31, fullDate: "3월31일", isoDate: "2026-03-31" },
      { label: "수", date: 1, fullDate: "4월1일", isoDate: "2026-04-01" },
      { label: "목", date: 2, fullDate: "4월2일", isoDate: "2026-04-02" },
    ];
  }

  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = [];
  const current = new Date(start);

  while (current <= end && days.length < 14) {
    days.push({
      label: labels[current.getDay()],
      date: current.getDate(),
      fullDate: `${current.getMonth() + 1}월${current.getDate()}일`,
      isoDate: current.toISOString().slice(0, 10),
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function LoginScreen({ onNavigate, onLogin }) {
  const [name, setName] = useState("");
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
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <GreenButton
        fullWidth
        onClick={() => {
          onLogin(name.trim() || "관리자");
          onNavigate("afterLogin");
        }}
      >
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

function RegisterScreen({ onNavigate, onLogin }) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    id: "",
    pw: "",
    pw2: "",
  });
  const placeholders = [
    "사용자 이름",
    "이메일 입력",
    "아이디 입력",
    "비밀번호 입력",
  ];
  const keys = ["name", "email", "id", "pw"];

  return (
    <div className="screen register-screen">
      <h1 className="register-title">회원가입</h1>
      <div className="form-group">
        {keys.map((key, index) => (
          <input
            key={key}
            className="input-field"
            placeholder={placeholders[index]}
            type={key === "pw" ? "password" : "text"}
            value={fields[key]}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        ))}
        <p className="find-link">8자 이상 입력하세요</p>
        <input
          className="input-field"
          placeholder="비밀번호 재입력"
          type="password"
          value={fields.pw2}
          onChange={(e) =>
            setFields((prev) => ({ ...prev, pw2: e.target.value }))
          }
        />
        <p className="find-link">비밀번호를 확인하세요</p>
      </div>
      <GreenButton
        fullWidth
        onClick={() => {
          onLogin(fields.name.trim() || "관리자");
          onNavigate("afterLogin");
        }}
      >
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

function OnboardingScreen({ onNavigate }) {
  return (
    <div className="screen onboarding-screen">
      <div className="logo-wrapper">
        <img src="/src/img/logo.png" alt="logo" className="logo" />
      </div>
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

function CreateTripScreen({ onNavigate, onAddTrip }) {
  const [tripName, setTripName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
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
      coverImage: "",
      journalEntries: [],
    });
  };

  return (
    <div className="screen create-trip-screen">
      <div className="top-bar">
        <span className="back-arrow" onClick={() => onNavigate("back")}>
          ←
        </span>
        <span className="top-bar-title">여행 기록하기</span>
      </div>

      <div className="create-form">
        <div className="form-label">국가</div>
        <div
          className="country-selector"
          onClick={() => setShowCountryPicker((prev) => !prev)}
        >
          <span className="country-flag-large">{selectedCountry.flag}</span>
          <span className="country-name-text">{selectedCountry.name}</span>
          <span className="country-arrow">{showCountryPicker ? "▲" : "▼"}</span>
        </div>

        {showCountryPicker && (
          <div className="country-dropdown">
            {COUNTRIES.map((country) => (
              <div
                key={country.name}
                className={`country-option${
                  selectedCountry.name === country.name ? " selected" : ""
                }`}
                onClick={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="form-label" style={{ marginTop: 16 }}>
          여행 기간
        </div>
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

        <div className="form-label" style={{ marginTop: 16 }}>
          여행 제목
        </div>
        <input
          className="input-field"
          placeholder="예) 도쿄 우정여행"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />

        <div className="form-label" style={{ marginTop: 16 }}>
          예산
        </div>
        <input
          className="input-field"
          placeholder="예) 1000000"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        {budget && (
          <p className="budget-preview">{Number(budget).toLocaleString()}원</p>
        )}
      </div>

      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={handleCreate}>
        만들기
      </GreenButton>
    </div>
  );
}

function HomeScreen({ trips, onNavigate, onSelectTrip, userName }) {
  const defaultCoverImage = "/src/img/user_img/admin/Pic1.jpg";

  return (
    <div className="screen home-screen">
      <div className="home-header">
        <span className="filter-icon" onClick={() => onNavigate("tripFilter")}>
          ⌂
        </span>
        <span className="hamburger">☰</span>
      </div>

      <div className="home-banner">
        <div className="home-banner-title">{userName} 님의 여행기록</div>
        <div className="home-banner-sub">지금까지의 여행을 한눈에 확인해보세요</div>
      </div>

      <div className="trip-grid">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="trip-card"
            onClick={() => {
              onSelectTrip(trip.id);
              onNavigate("tripDetail");
            }}
          >
            <div className="trip-card-thumb">
              <img
                src={trip.coverImage || defaultCoverImage}
                alt={`${trip.name} 대표 이미지`}
                className="trip-card-image"
              />
            </div>
            <div className="trip-card-body">
              <div className="trip-card-name">{trip.name}</div>
              <div className="trip-card-budget">{trip.budget}</div>
              <button
                className="trip-review-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTrip(trip.id);
                  onNavigate("tripJournal");
                }}
              >
                <span className="trip-review-plus">+</span>
                <span>후기 작성</span>
              </button>
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

const CATEGORIES = ["ALL", "식비", "교통", "숙박", "관광", "쇼핑", "기타"];

const DUMMY_EXPENSES = [
  { id: 1, category: "식비", label: "점심 식사", amount: -15000 },
  { id: 2, category: "교통", label: "지하철", amount: -1350 },
  { id: 3, category: "숙박", label: "호텔 1박", amount: -80000 },
  { id: 4, category: "관광", label: "박물관 입장", amount: -12000 },
  { id: 5, category: "쇼핑", label: "기념품", amount: -25000 },
  { id: 6, category: "기타", label: "환전 수수료", amount: -3000 },
  { id: 7, category: "식비", label: "저녁 식사", amount: -32000 },
];

function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});
  const [sortOrder, setSortOrder] = useState("latest");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(trip?.startDate ?? null);

  useEffect(() => {
    setSelectedDate(trip?.startDate ?? null);
  }, [trip?.id, trip?.startDate]);

  if (!trip) {
    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>
            🏠
          </span>
          <span className="detail-title">여행을 선택해주세요</span>
        </div>
        <p style={{ padding: "24px", color: "#888", textAlign: "center" }}>
          홈에서 여행 카드를 눌러 선택해주세요.
        </p>
      </div>
    );
  }

  const budgetLabel = trip.budget.replace("사용 예산: ", "");
  const dateTabs = buildTripDays(trip);
  const filteredExpenses = [
    ...(activeCategory === "ALL"
      ? DUMMY_EXPENSES
      : DUMMY_EXPENSES.filter((expense) => expense.category === activeCategory)),
  ]
    .filter((expense) =>
      amountFilter === "all"
        ? true
        : amountFilter === "expense"
          ? expense.amount < 0
          : expense.amount > 0
    )
    .sort((a, b) => {
      if (sortOrder === "latest") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      if (sortOrder === "high") return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortOrder === "low") return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });

  const enterEditMode = () => {
    setEditName(trip.name);
    const prices = {};
    DUMMY_EXPENSES.forEach((expense) => {
      prices[expense.id] = Math.abs(expense.amount).toString();
    });
    setEditPrices(prices);
    setIsEditMode(true);
  };

  const handleSave = () => {
    onUpdateTrip?.({ ...trip, name: editName });
    setIsEditMode(false);
  };

  if (isEditMode) {
    const editTargets =
      activeCategory === "ALL"
        ? DUMMY_EXPENSES
        : DUMMY_EXPENSES.filter((expense) => expense.category === activeCategory);

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
            style={{
              fontSize: 14,
              cursor: "pointer",
              color: "#2ecc71",
              fontWeight: 600,
            }}
            onClick={handleSave}
          >
            저장
          </span>
        </div>

        <div className="edit-form">
          <div className="edit-section-label">여행 제목</div>
          <input
            className="input-field"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div className="edit-section-label" style={{ marginTop: 20 }}>
            {activeCategory === "ALL" ? "전체" : activeCategory} 카테고리 금액
          </div>

          {editTargets.map((expense) => (
            <div key={expense.id} className="edit-expense-row">
              <span className="edit-expense-label">{expense.label}</span>
              <div className="edit-expense-input-wrap">
                <input
                  className="input-field edit-amount-input"
                  type="number"
                  value={editPrices[expense.id] ?? ""}
                  onChange={(e) =>
                    setEditPrices((prev) => ({
                      ...prev,
                      [expense.id]: e.target.value,
                    }))
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

  return (
    <div className="screen trip-detail-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>
          🏠
        </span>
        <span className="detail-title">
          {trip.flag} {trip.name}
        </span>
        <span className="menu-icon">☰</span>
      </div>

      <div className="day-tabs">
        {dateTabs.length > 0 ? (
          dateTabs.map((day) => (
            <div
              key={day.isoDate}
              className={`day-col${selectedDate === day.isoDate ? " day-col-active" : ""}`}
              onClick={() => setSelectedDate(day.isoDate)}
            >
              <div className="day-label">{day.label}</div>
              <div className="day-num">{day.date}</div>
            </div>
          ))
        ) : (
          <div style={{ padding: "10px 16px", fontSize: 12, color: "#aaa" }}>
            여행 기간이 설정되지 않았습니다
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="selected-date-badge">
          📅 {selectedDate.replace(/-/g, ".")} 지출 내역
        </div>
      )}

      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체예산</div>
          <div className="budget-amount">{budgetLabel}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여예산</div>
          <div className="budget-amount">-</div>
        </div>
        {trip.startDate && trip.endDate && (
          <div className="budget-item" style={{ textAlign: "right" }}>
            <div className="budget-label">여행 기간</div>
            <div className="budget-amount" style={{ fontSize: 11, fontWeight: 500 }}>
              {trip.startDate.replace(/-/g, ".")}
              {" ~ "}
              {trip.endDate.replace(/-/g, ".")}
            </div>
          </div>
        )}
      </div>

      <div className="category-filter-row">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`cat-filter-btn${activeCategory === category ? " active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="sort-filter-row">
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="high">금액 높은순</option>
          <option value="low">금액 낮은순</option>
        </select>

        <div className="amount-filter-group">
          {[
            { value: "all", label: "전체" },
            { value: "expense", label: "지출" },
            { value: "income", label: "수입" },
          ].map(({ value, label }) => (
            <button
              key={value}
              className={`amount-filter-btn${amountFilter === value ? " active" : ""}`}
              onClick={() => setAmountFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="expense-scroll">
        {filteredExpenses.length === 0 ? (
          <div className="expense-empty">
            <div>등록된 지출이 없습니다</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>
              수정 버튼을 눌러 추가해주세요
            </div>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div>
                <div className="expense-label">{expense.label}</div>
                <div className="expense-sub">{expense.category}</div>
              </div>
              <div
                className={`expense-amount ${expense.amount < 0 ? "red-text" : "green-text"}`}
              >
                {expense.amount < 0 ? "-" : "+"}
                {Math.abs(expense.amount).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="detail-bottom-btns">
        <button
          className="detail-action-btn stats-btn"
          onClick={() => onNavigate("stats")}
        >
          📊 통계
        </button>
        <button className="detail-action-btn edit-btn-main" onClick={enterEditMode}>
          ✏️ 수정
        </button>
      </div>
    </div>
  );
}

function ExpenseListScreen({ onNavigate }) {
  const items = [1, 2, 3, 4, 5];
  const categories = ["전체", "음식", "교통", "관광", "숙박", "쇼핑", "기타"];

  return (
    <div className="screen expense-list-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>
          🏠
        </span>
        <span className="detail-title">지출 목록</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="🔍 SEARCH HERE..." />
      </div>
      <div className="cat-tabs">
        {categories.map((category) => (
          <span key={category} className="cat-tab">
            {category}
          </span>
        ))}
      </div>
      <div className="sub-row">
        <span className="sub-label">날짜</span>
        <span className="sub-label">최신순</span>
      </div>
      <div className="expense-list">
        {items.map((item) => (
          <div key={item} className="expense-row">
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
        {[1, 2, 3, 4, 5].map((page) => (
          <span key={page} className={`page-dot${page === 1 ? " active" : ""}`}>
            {page}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [prevScreen, setPrevScreen] = useState("home");
  const [userName, setUserName] = useState("관리자");

  const handleLogin = (name) => {
    setUserName(name || "관리자");
  };

  const navigate = (destination) => {
    if (destination === "afterLogin") {
      setScreen(trips.length === 0 ? "onboarding" : "home");
      return;
    }

    if (destination === "back") {
      setScreen(prevScreen);
      return;
    }

    setPrevScreen(screen);
    setScreen(destination);
  };

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [...prev, { id: Date.now(), ...newTrip }]);
    setScreen("home");
  };

  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || null;

  const renderScreen = () => {
    switch (screen) {
      case "login":
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
      case "register":
        return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;
      case "onboarding":
        return <OnboardingScreen onNavigate={navigate} />;
      case "createTrip":
        return <CreateTripScreen onNavigate={navigate} onAddTrip={handleAddTrip} />;
      case "home":
        return (
          <HomeScreen
            trips={trips}
            onNavigate={navigate}
            onSelectTrip={setSelectedTripId}
            userName={userName}
          />
        );
      case "tripDetail":
        return (
          <TripDetailScreen
            onNavigate={navigate}
            trip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        );
      case "tripJournal":
        return (
          <TripJournalScreen
            onNavigate={navigate}
            trip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
            renderButton={(label, onClick) => (
              <GreenButton fullWidth onClick={onClick}>
                {label}
              </GreenButton>
            )}
          />
        );
      case "stats":
        return (
          <StatsScreen
            onNavigate={navigate}
            trip={selectedTrip}
            expenses={DUMMY_EXPENSES}
          />
        );
      case "expenseList":
        return <ExpenseListScreen onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-root">
      <nav className="top-nav">
        <div className="nav-logo">✈ CosTrip</div>
        <div className="nav-links">
          {[
            ["login", "로그인"],
            ["register", "회원가입"],
            ["onboarding", "온보딩"],
            ["home", "홈"],
            ["tripDetail", "여행상세"],
            ["tripJournal", "후기작성"],
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

      <div className="canvas">
        <div className="phone-mockup">
          <div className="phone-notch"></div>
          <div className="phone-inner">{renderScreen()}</div>
          <div className="phone-home-bar"></div>
        </div>
      </div>
    </div>
  );
}
