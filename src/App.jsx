import { useState } from "react";
import "./app.css";

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
        <p className="find-link">비밀번호를 다시 확인하세요</p>
      </div>
      <GreenButton
        fullWidth
        onClick={() => {
          onLogin(fields.name.trim() || "관리자");
          onNavigate("afterLogin");
        }}
      >
        회원가입 후 로그인
      </GreenButton>
      <p className="sub-link">
        이미 계정이 있으신가요?{" "}
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
      <div className="onboarding-logo">Logo</div>
      <h2 className="onboarding-title">
        여행을 추가하고
        <br />
        예산을 관리해보세요
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
  { flag: "KR", name: "한국" },
  { flag: "US", name: "미국" },
  { flag: "JP", name: "일본" },
  { flag: "CN", name: "중국" },
  { flag: "FR", name: "프랑스" },
  { flag: "GB", name: "영국" },
  { flag: "TH", name: "태국" },
  { flag: "IT", name: "이탈리아" },
  { flag: "ES", name: "스페인" },
  { flag: "SG", name: "싱가포르" },
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
    });
  };

  return (
    <div className="screen create-trip-screen">
      <div className="top-bar">
        <span className="back-arrow" onClick={() => onNavigate("back")}>
          {"<"}
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
          placeholder="예: 도쿄 우정 여행"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />

        <div className="form-label" style={{ marginTop: 16 }}>
          예산
        </div>
        <input
          className="input-field"
          placeholder="예: 1000000"
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
              <span className="trip-card-flag">{trip.flag}</span>
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

function TripJournalScreen({ onNavigate, trip }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [reviewImage, setReviewImage] = useState(null);
  const [memo, setMemo] = useState("");
  const [reviewEntries, setReviewEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  if (!trip) {
    return (
      <div className="screen trip-journal-screen">
        <div className="journal-shell">
          <div className="journal-header">
            <span className="filter-icon" onClick={() => onNavigate("home")}>
              ⌂
            </span>
            <span className="journal-title">여행을 먼저 선택해주세요</span>
            <span className="hamburger">☰</span>
          </div>
        </div>
      </div>
    );
  }

  const tripDays = [
    { label: "월", date: 30, fullDate: "3월30일" },
    { label: "화", date: 31, fullDate: "3월31일" },
    { label: "수", date: 1, fullDate: "4월1일" },
    { label: "목", date: 2, fullDate: "4월2일" },
  ];

  const selectedDayInfo = tripDays[selectedDay];
  const selectedEntries = reviewEntries.filter((entry) => entry.dayIndex === selectedDay);
  const selectedEntry =
    reviewEntries.find((entry) => entry.id === selectedEntryId) ?? null;

  const handleReviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReviewImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleSaveReview = () => {
    if (!isWriting) {
      setSelectedEntryId(null);
      setIsWriting(true);
      return;
    }

    const nextEntry = {
      id: Date.now(),
      dayIndex: selectedDay,
      dateText: selectedDayInfo.fullDate,
      memo: memo.trim(),
      imagePreview: reviewImage?.preview ?? "",
    };

    setReviewEntries((prev) => [nextEntry, ...prev]);
    setMemo("");
    setReviewImage(null);
    setIsWriting(false);
    setSelectedEntryId(null);
  };

  const handleOpenEntry = (entryId) => {
    setIsWriting(false);
    setSelectedEntryId(entryId);
  };

  return (
    <div className="screen trip-journal-screen">
      <div className="journal-shell">
        <div className="journal-header">
          <span className="filter-icon" onClick={() => onNavigate("home")}>
            ⌂
          </span>
          <span className="journal-title">{trip.name}(후기)</span>
          <span className="hamburger">☰</span>
        </div>

        <div className="journal-days">
          {tripDays.map((day, index) => (
            <button
              key={`${day.label}-${day.date}`}
              className={`journal-day-btn${selectedDay === index ? " active" : ""}`}
              onClick={() => setSelectedDay(index)}
            >
              <span className="journal-day-label">{day.label}</span>
              <span className="journal-day-date">{day.date}</span>
            </button>
          ))}
        </div>
      </div>

      {isWriting ? (
        <div className="journal-content">
          <div className="journal-field">
            <label className="journal-label">이미지</label>
            <label className="journal-image-box">
              <input
                className="journal-image-input"
                type="file"
                accept="image/*"
                onChange={handleReviewImageChange}
              />
              {reviewImage ? (
                <div className="journal-image-preview-wrap">
                  <img
                    src={reviewImage.preview}
                    alt="후기 이미지 미리보기"
                    className="journal-image-preview"
                  />
                  <span className="journal-image-change">+ 이미지 변경</span>
                </div>
              ) : (
                <div className="journal-image-placeholder">
                  <span className="journal-image-plus">+</span>
                  <span>이미지 추가</span>
                </div>
              )}
            </label>
          </div>

          <div className="journal-field">
            <label className="journal-label">메모</label>
            <textarea
              className="journal-textarea journal-textarea-small"
              placeholder="다음에 참고할 메모를 적어보세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>
      ) : selectedEntry ? (
        <div className="journal-entry-detail">
          <div className="journal-entry-detail-date">{selectedEntry.dateText}</div>
          {selectedEntry.imagePreview ? (
            <img
              src={selectedEntry.imagePreview}
              alt="기록 이미지"
              className="journal-entry-detail-image"
            />
          ) : null}
          <div className="journal-entry-detail-card">
            <div className="journal-entry-detail-label">메모</div>
            <p className="journal-entry-detail-memo">
              {selectedEntry.memo || "작성된 메모가 없습니다."}
            </p>
          </div>
        </div>
      ) : selectedEntries.length > 0 ? (
        <div className="journal-entry-list">
          {selectedEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="journal-entry-card"
              onClick={() => handleOpenEntry(entry.id)}
            >
              <div className="journal-entry-top">
                <span className="journal-entry-date">{entry.dateText}</span>
                <span className="journal-entry-tag">
                  {entry.memo || "메모 없음"}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="journal-empty-state"></div>
      )}

      <GreenButton
        fullWidth
        onClick={() => {
          if (selectedEntry) {
            setSelectedEntryId(null);
            return;
          }

          handleSaveReview();
        }}
      >
        {selectedEntry ? "목록으로" : "기록하기"}
      </GreenButton>
    </div>
  );
}

const CATEGORIES = ["ALL", "식비", "교통", "숙박", "관광", "쇼핑", "기타"];

const DUMMY_EXPENSES = [
  { id: 1, category: "식비", label: "저녁 식사", amount: -15000 },
  { id: 2, category: "교통", label: "지하철", amount: -1350 },
  { id: 3, category: "숙박", label: "호텔 1박", amount: -80000 },
  { id: 4, category: "관광", label: "박물관 입장", amount: -12000 },
  { id: 5, category: "쇼핑", label: "기념품", amount: -25000 },
  { id: 6, category: "기타", label: "수수료", amount: -3000 },
  { id: 7, category: "식비", label: "아침 식사", amount: -32000 },
];

function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});

  if (!trip) {
    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>
            ⌂
          </span>
          <span className="detail-title">여행을 선택해주세요</span>
        </div>
        <p style={{ padding: "24px", color: "#888", textAlign: "center" }}>
          홈 화면에서 여행 카드를 선택해주세요.
        </p>
      </div>
    );
  }

  const budgetLabel = trip.budget.replace("사용 예산: ", "");

  const filteredExpenses =
    activeCategory === "ALL"
      ? DUMMY_EXPENSES
      : DUMMY_EXPENSES.filter((expense) => expense.category === activeCategory);

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
    if (onUpdateTrip) {
      onUpdateTrip({ ...trip, name: editName });
    }
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
            취소
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
          ⌂
        </span>
        <span className="detail-title">
          {trip.flag} {trip.name}
        </span>
        <span className="menu-icon">☰</span>
      </div>

      <div className="day-tabs">
        {["토", "일", "월", "화"].map((day, index) => (
          <div key={day} className="day-col">
            <div className="day-label">{day}</div>
            <div className="day-num">{[30, 31, 1, 2][index]}</div>
          </div>
        ))}
      </div>

      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체 예산</div>
          <div className="budget-amount">{budgetLabel}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여 예산</div>
          <div className="budget-amount">-</div>
        </div>
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

      <div className="expense-scroll">
        {filteredExpenses.length === 0 ? (
          <div className="expense-empty">
            <div>등록된 지출이 없습니다</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>
              수정 모드에서 추가해주세요
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
                className={`expense-amount ${
                  expense.amount < 0 ? "red-text" : "green-text"
                }`}
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
          통계
        </button>
        <button className="detail-action-btn edit-btn-main" onClick={enterEditMode}>
          수정
        </button>
      </div>
    </div>
  );
}

function StatsScreen({ onNavigate }) {
  const stats = [
    { label: "숙박", amount: "50,000원", pct: "42%", color: "#a78bfa" },
    { label: "쇼핑", amount: "50,000원", pct: "42%", color: "#f87171" },
    { label: "식비", amount: "50,000원", pct: "42%", color: "#34d399" },
  ];

  return (
    <div className="screen stats-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>
          ⌂
        </span>
        <span className="detail-title">통계</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="day-tabs">
        {["토", "일", "월", "화"].map((day, index) => (
          <div key={day} className="day-col">
            <div className="day-label">{day}</div>
            <div className="day-num">{[30, 31, 1, 2][index]}</div>
          </div>
        ))}
      </div>
      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체 예산</div>
          <div className="budget-amount">400,000</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여 예산</div>
          <div className="budget-amount">250,000</div>
        </div>
      </div>
      <div className="stats-date-range">3월 30일 - 4월 2일 카테고리별</div>
      <div className="donut-wrapper">
        <div className="donut"></div>
      </div>
      <div className="stats-legend">
        {stats.map((stat) => (
          <div key={stat.label} className="legend-row">
            <span className="legend-dot" style={{ background: stat.color }}></span>
            <span className="legend-label">{stat.label}</span>
            <span className="legend-amount">{stat.amount}</span>
            <span className="legend-pct">{stat.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpenseListScreen({ onNavigate }) {
  const items = [1, 2, 3, 4, 5];
  const categories = ["전체", "식비", "교통", "관광", "숙박", "쇼핑", "기타"];

  return (
    <div className="screen expense-list-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>
          ⌂
        </span>
        <span className="detail-title">지출 목록</span>
        <span className="menu-icon">☰</span>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="SEARCH HERE..." />
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
            <div className="expense-row-amount">10,000원</div>
            <button className="edit-btn">수정</button>
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

  const renderScreen = () => {
    const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || null;

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
        return <TripJournalScreen onNavigate={navigate} trip={selectedTrip} />;
      case "stats":
        return <StatsScreen onNavigate={navigate} />;
      case "expenseList":
        return <ExpenseListScreen onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-root">
      <nav className="top-nav">
        <div className="nav-logo">TripBudget</div>
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
