import { useEffect, useState } from "react";import countries from "i18n-iso-countries";
import ko from "i18n-iso-countries/langs/ko.json";
import "./app.css";
import AdminPage from "./pages/AdminPage";
import StatsScreen from "./pages/StatsScreen";
import TripJournalScreen from "./components/journal/TripJournalScreen";

countries.registerLocale(ko);

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

// ─── 공통 날짜 헬퍼 ──────────────────────────────────────────────────────────
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

// ─── 화면 1: 로그인 ──────────────────────────────────────────────────────────
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

// ─── 화면 2: 회원가입 ────────────────────────────────────────────────────────
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

// ─── 화면 3: 온보딩 ──────────────────────────────────────────────────────────
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

// ─── 여행 생성용 상수 ────────────────────────────────────────────────────────
const COUNTRIES = Object.entries(countries.getNames("ko")).map(
  ([code, name]) => ({
    code: code.toLowerCase(),
    name,
  })
);

const CREATE_CATEGORIES = ["식비", "교통", "숙박", "관광", "쇼핑", "기타"];

// ─── 화면 4: 여행 생성 ───────────────────────────────────────────────────────
function CreateTripScreen({ onNavigate, onAddTrip }) {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState([
    { category: "식비", amount: "", customCategory: "" },
  ]);
  // 국가 검색 관련 상태
  const [countryInput, setCountryInput] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;

  // 입력한 국가명으로 드롭다운 후보 필터링
  const handleCountryInput = (e) => {
    const value = e.target.value;
    setCountryInput(value);

    if (selectedCountry && value !== selectedCountry.name) {
      setSelectedCountry(null);
    }

    if (value.trim() === "") {
      setFilteredCountries([]);
      setShowDropdown(false);
      setSelectedCountry(null);
      return;
    }

    const filtered = COUNTRIES.filter((country) =>
      country.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setShowDropdown(true);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setCountryInput(country.name);
    setShowDropdown(false);
  };

  // 예산 입력 행 추가
  const addCategoryBudget = () => {
    setCategoryBudgets((prev) => [
      ...prev,
      { category: "식비", amount: "", customCategory: "" },
    ]);
  };

  const handleBudgetChange = (index, field, value) => {
    setCategoryBudgets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalBudget = categoryBudgets.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  // 여행 생성 시 예산 입력값을 상세 화면용 expenses로 변환
  const handleCreate = () => {
    if (!tripName.trim()) return;

    const flagInfo = selectedCountry ? getFlagUrl(selectedCountry.code) : "🌍";
    const initialExpenses = categoryBudgets
      .filter((item) => Number(item.amount) > 0)
      .map((item, index) => ({
        id: index + 1,
        category:
          item.category === "기타" && item.customCategory
            ? item.customCategory
            : item.category,
        label:
          item.category === "기타" && item.customCategory
            ? item.customCategory
            : item.category,
        amount: -Number(item.amount),
      }));

    onAddTrip({
      name: tripName,
      flag: flagInfo,
      country: selectedCountry ? selectedCountry.name : countryInput,
      startDate,
      endDate,
      budget: `총 ${totalBudget.toLocaleString()}원`,
      budgetData: categoryBudgets,
      totalBudget,
      expenses: initialExpenses,
      coverImage: "",
      journalEntries: [],
    });
    onNavigate("home");
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
          style={{ padding: 0, overflow: "visible", position: "relative" }}
        >
          <div className="country-flag-large" style={{ paddingLeft: 12 }}>
            {selectedCountry ? (
              <img
                src={getFlagUrl(selectedCountry.code)}
                alt=""
                style={{
                  width: "30px",
                  height: "20px",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <span style={{ fontSize: "20px" }}>🌍</span>
            )}
          </div>
          <input
            className="country-search-input"
            placeholder="국가 이름을 검색하세요"
            value={countryInput}
            onChange={handleCountryInput}
            onFocus={() => {
              if (countryInput.trim() && !selectedCountry) setShowDropdown(true);
            }}
            autoComplete="off"
          />
        </div>

        {showDropdown && (
          <div className="country-dropdown">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="country-option"
                  onClick={() => handleSelectCountry(country)}
                >
                  <img
                    src={getFlagUrl(country.code)}
                    alt=""
                    style={{
                      width: "24px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  />
                  <span>{country.name}</span>
                </div>
              ))
            ) : (
              <div
                className="country-option"
                style={{ color: "#999", cursor: "default" }}
              >
                검색 결과가 없습니다
              </div>
            )}
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

        <div
          className="form-label"
          style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}
        >
          <span>예산 설정</span>
          <span
            onClick={addCategoryBudget}
            style={{ color: "#10b981", cursor: "pointer", fontSize: "14px" }}
          >
            + 추가
          </span>
        </div>

        {categoryBudgets.map((item, index) => (
          <div key={index} className="budget-input-group" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                className="input-field"
                style={{ flex: 1, marginBottom: 0 }}
                value={item.category}
                onChange={(e) => handleBudgetChange(index, "category", e.target.value)}
              >
                {CREATE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                className="input-field"
                style={{ flex: 1.5, marginBottom: 0 }}
                type="number"
                placeholder="금액"
                value={item.amount}
                onChange={(e) => handleBudgetChange(index, "amount", e.target.value)}
              />
            </div>
            {item.category === "기타" && (
              <input
                className="input-field"
                style={{ marginTop: 8 }}
                placeholder="카테고리명 입력"
                value={item.customCategory}
                onChange={(e) =>
                  handleBudgetChange(index, "customCategory", e.target.value)
                }
              />
            )}
          </div>
        ))}

        {totalBudget > 0 && (
          <p
            className="budget-preview"
            style={{ textAlign: "right", fontWeight: "bold", color: "#10b981" }}
          >
            총 {totalBudget.toLocaleString()}원
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
        <div className="home-banner-title">✈ {userName} 님의 여행기록</div>
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

// ─── 상세/통계용 더미 데이터 ─────────────────────────────────────────────────
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

// ─── 화면 6: 여행 상세 ───────────────────────────────────────────────────────
function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});
  // 정렬 기준
  const [sortOrder, setSortOrder] = useState("latest");
  // 전체/지출/수입 필터
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(trip?.startDate ?? null);

  // 선택 여행이 바뀌면 상세 화면 날짜 기준도 함께 갱신
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

  const budgetLabel = trip.budget?.replace("사용 예산: ", "") ?? trip.budget ?? "-";
  const dateTabs = buildTripDays(trip);
  // 여행 생성 단계에서 만든 지출 데이터가 있으면 우선 사용
  const baseExpenses = trip.expenses?.length ? trip.expenses : DUMMY_EXPENSES;
  // 카테고리/금액 조건을 반영한 상세 목록
  const filteredExpenses = [...baseExpenses]
    .filter((expense) =>
      activeCategory === "ALL" ? true : expense.category === activeCategory
    )
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

  // 수정 모드 진입 시 현재 값들을 입력창 상태로 펼쳐 놓음
  const enterEditMode = () => {
    setEditName(trip.name);
    const prices = {};
    baseExpenses.forEach((expense) => {
      prices[expense.id] = Math.abs(expense.amount).toString();
    });
    setEditPrices(prices);
    setIsEditMode(true);
  };

  // 여행 이름과 지출 금액 수정 내용 저장
  const handleSave = () => {
    if (onUpdateTrip) {
      const nextExpenses = baseExpenses.map((expense) => ({
        ...expense,
        amount:
          expense.amount < 0
            ? -Math.abs(Number(editPrices[expense.id] || 0))
            : Math.abs(Number(editPrices[expense.id] || 0)),
      }));

      onUpdateTrip({
        ...trip,
        name: editName,
        expenses: nextExpenses,
      });
    }
    setIsEditMode(false);
  };

  if (isEditMode) {
    // 수정 모드에서는 선택한 카테고리만 편집 대상으로 노출
    const editTargets =
      activeCategory === "ALL"
        ? baseExpenses
        : baseExpenses.filter((expense) => expense.category === activeCategory);

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
        <div
          className="detail-title-wrapper"
          style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
        >
          {trip.flag && trip.flag.startsWith("http") ? (
            <img
              src={trip.flag}
              alt=""
              style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px" }}
            />
          ) : (
            <span>{trip.flag || "🌍"}</span>
          )}
          <span className="detail-title" style={{ fontSize: "16px", fontWeight: "bold" }}>
            {trip.name}
          </span>
        </div>
        <span className="menu-icon">☰</span>
      </div>

      {dateTabs.length > 0 ? (
        <div className="day-tabs">
          {dateTabs.map((day) => (
            <div
              key={day.isoDate}
              className={`day-col${selectedDate === day.isoDate ? " day-col-active" : ""}`}
              onClick={() => setSelectedDate(day.isoDate)}
            >
              <div className="day-label">{day.label}</div>
              <div className="day-num">{day.date}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="day-tabs">
          <div style={{ padding: "10px 16px", fontSize: 12, color: "#aaa" }}>
            여행 기간이 설정되지 않았습니다
          </div>
        </div>
      )}

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
              {trip.startDate.replace(/-/g, ".")} {" ~ "} {trip.endDate.replace(/-/g, ".")}
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
              <div className={`expense-amount ${expense.amount < 0 ? "red-text" : "green-text"}`}>
                {expense.amount < 0 ? "-" : "+"}
                {Math.abs(expense.amount).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

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

// ─── 화면 7: 지출 목록 ───────────────────────────────────────────────────────
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

// ─── 메인 앱 ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [prevScreen, setPrevScreen] = useState("home");
  const [userName, setUserName] = useState("관리자");

  // 로그인 사용자명 반영
  const handleLogin = (name) => {
    setUserName(name || "관리자");
  };

  // 공통 화면 이동 함수
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

  // 여행 생성 후 홈 목록에 추가
  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [...prev, { id: Date.now(), ...newTrip }]);
    setScreen("home");
  };

  // 상세/후기에서 수정된 여행 데이터 반영
  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  // 현재 선택된 여행
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || null;

  // screen 값에 따라 각 화면 컴포넌트를 렌더링
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
            expenses={selectedTrip?.expenses || []}
          />
        );
      case "expenseList":
        return <ExpenseListScreen onNavigate={navigate} />;
      case "admin":
        return <AdminPage onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
    }
  };

  // 관리자 화면은 폰 목업이 아닌 단독 레이아웃으로 렌더링
  if (screen === "admin") {
    return (
      <div className="min-h-screen w-full bg-gray-100">
        <nav className="top-nav">
          <div className="nav-logo">✈ CosTrip</div>
        </nav>
        <AdminPage onNavigate={navigate} />
      </div>
    );
  }

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
            ["admin", "관리자"],
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
