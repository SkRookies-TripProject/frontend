import { useState } from "react";
import "./app.css";
import countries from 'i18n-iso-countries';
import ko from 'i18n-iso-countries/langs/ko.json';
import AdminPage from "./pages/AdminPage";

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
      <GreenButton fullWidth onClick={() => {
        onLogin(name.trim() || "관리자");
        onNavigate("afterLogin");
      }}>
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
  const [fields, setFields] = useState({ name: "", email: "", id: "", pw: "", pw2: "" });
  const placeholders = ["사용자 이름", "이메일 입력", "아이디 입력", "비밀번호 입력"];
  const keys = ["name", "email", "id", "pw"];
  return (
    <div className="screen register-screen">
      <h1 className="register-title">회원가입</h1>
      <div className="form-group">
        {keys.map((k, i) => (
          <input
            key={k}
            className="input-field"
            placeholder={placeholders[i]}
            type={k === "pw" ? "password" : "text"}
            value={fields[k]}
            onChange={(e) => setFields((f) => ({ ...f, [k]: e.target.value }))}
          />
        ))}
        <p className="find-link">8자 이상 입력하세요</p>
        <input
          className="input-field"
          placeholder="비밀번호 재입력"
          type="password"
          value={fields.pw2}
          onChange={(e) => setFields((f) => ({ ...f, pw2: e.target.value }))}
        />
        <p className="find-link">비밀번호를 확인하세요</p>
      </div>
      <GreenButton fullWidth onClick={() => {
        onLogin(fields.name.trim() || "관리자");
        onNavigate("afterLogin");
      }}>
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

// ─── 국가 목록──────────────────────────────────────────────────────────────

const countryList = countries.getNames('ko');
// { KR: '대한민국', JP: '일본', US: '미국', ... }

const COUNTRIES = Object.entries(countries.getNames('ko')).map(([code, name]) => ({
  code: code.toLowerCase(),
  name, 
}));

const CREATE_CATEGORIES = ["식비", "교통", "숙박", "관광", "쇼핑", "기타"];
// ─── 화면 4: 여행 생성 ───────────────────────────────────────────────────────
function CreateTripScreen({ onNavigate, onAddTrip }) {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState([
    { category: "식비", amount: "", customCategory: "" }
  ]);

  // 국가 검색 관련 state
  const [countryInput, setCountryInput] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;

  // 텍스트 입력 시 국가 필터링
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

    const filtered = COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setShowDropdown(true);
  };

  // 드롭다운에서 국가 선택
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setCountryInput(country.name);
    setShowDropdown(false);
  };

  // --- 예산 관련 핸들러 ---
  const addCategoryBudget = () => {
    setCategoryBudgets([...categoryBudgets, { category: "식비", amount: "", customCategory: "" }]);
  };

  const handleBudgetChange = (index, field, value) => {
    const updated = [...categoryBudgets];
    updated[index][field] = value;
    setCategoryBudgets(updated);
  };

  // 총 예산 계산 
  const totalBudget = categoryBudgets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 만들기 버튼 (하나로 합침)
  const handleCreate = () => {
    if (!tripName.trim()) return;
    
    // FlagCDN 사용을 위해 이미지 URL 생성 혹은 코드 저장
    const flagInfo = selectedCountry ? getFlagUrl(selectedCountry.code) : "🌍";

    onAddTrip({
      name: tripName,
      flag: flagInfo, 
      country: selectedCountry ? selectedCountry.name : countryInput,
      startDate,
      endDate,
      budget: `총 ${totalBudget.toLocaleString()}원`, // 기존 리스트 표시용
      budgetData: categoryBudgets, // 상세 분석용
      totalBudget: totalBudget, 
    });
    onNavigate("home");
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
        <div className="country-selector" style={{ padding: 0, overflow: "visible", position: "relative" }}>
          <div className="country-flag-large" style={{ paddingLeft: 12 }}>
            {selectedCountry ? (
              <img 
                src={getFlagUrl(selectedCountry.code)} 
                alt="" 
                style={{ width: '30px', height: '20px', objectFit: 'cover', borderRadius: '2px' }} 
              />
            ) : (
              <span style={{ fontSize: '20px' }}>🌍</span>
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

        {/* 검색 드롭다운 */}
        {showDropdown && (
          <div className="country-dropdown">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <div key={c.code} className="country-option" onClick={() => handleSelectCountry(c)}>
                  <img src={getFlagUrl(c.code)} alt="" style={{ width: '24px', height: '16px', marginRight: '8px' }} />
                  <span>{c.name}</span>
                </div>
              ))
            ) : (
              <div className="country-option" style={{ color: "#999", cursor: "default" }}>검색 결과가 없습니다</div>
            )}
          </div>
        )}

        {/* 여행 기간 */}
        <div className="form-label" style={{ marginTop: 16 }}>여행 기간</div>
        <div className="date-row">
          <input className="input-field date-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="date-sep">~</span>
          <input className="input-field date-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        {/* 여행 제목 */}
        <div className="form-label" style={{ marginTop: 16 }}>여행 제목</div>
        <input className="input-field" placeholder="예) 도쿄 우정여행" value={tripName} onChange={(e) => setTripName(e.target.value)} />

        {/* 예산 설정 */}
        <div className="form-label" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>예산 설정</span>
          <span onClick={addCategoryBudget} style={{ color: '#10b981', cursor: 'pointer', fontSize: '14px' }}>+ 추가</span>
        </div>

        {categoryBudgets.map((item, index) => (
          <div key={index} className="budget-input-group" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                className="input-field" 
                style={{ flex: 1, marginBottom: 0 }}
                value={item.category}
                onChange={(e) => handleBudgetChange(index, "category", e.target.value)}
              >
                {CREATE_CATEGORIES.map(cat => cat !== "ALL" && <option key={cat} value={cat}>{cat}</option>)}
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
                onChange={(e) => handleBudgetChange(index, "customCategory", e.target.value)}
              />
            )}
          </div>
        ))}

        {totalBudget > 0 && (
          <p className="budget-preview" style={{ textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>
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
  return (
    <div className="screen home-screen">
      <div className="home-header">
        <span className="filter-icon" onClick={() => onNavigate("tripFilter")}>⊟</span>
        <span className="hamburger">☰</span>
      </div>

      {/* 유저 배너 */}
      <div className="home-banner">
        <div className="home-banner-title">✈ {userName} 님의 여행기록</div>
        <div className="home-banner-sub">지금까지의 여행을 한눈에 확인해보세요</div>
      </div>
        
        {/* 여행 카드 그리드 */}
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
            {/* 국기 썸네일 */}
            <div className="trip-card-thumb" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
            </div>
            
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

const DUMMY_EXPENSES = [
  { id: 1, category: "식비",  label: "점심 식사",    amount: -15000 },
  { id: 2, category: "교통",  label: "지하철",        amount: -1350  },
  { id: 3, category: "숙박",  label: "호텔 1박",      amount: -80000 },
  { id: 4, category: "관광",  label: "박물관 입장",   amount: -12000 },
  { id: 5, category: "쇼핑",  label: "기념품",        amount: -25000 },
  { id: 6, category: "기타",  label: "환전 수수료",   amount: -3000  },
  { id: 7, category: "식비",  label: "저녁 식사",     amount: -32000 },
];

// ─── 화면 6: 여행 상세 ────────────────────────────────────────────────────────

function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});
  // 정렬: "latest"=최신순 | "oldest"=오래된순 | "high"=금액높은순 | "low"=금액낮은순
  const [sortOrder, setSortOrder] = useState("latest");
  // 수입/지출 필터: "all" | "expense" | "income"
  const [amountFilter, setAmountFilter] = useState("all");
    // 선택된 날짜 탭 (기본: 시작일 첫 번째)
  const [selectedDate, setSelectedDate] = useState(
    trip.startDate ? trip.startDate : null
  );

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

  // 카테고리 + 수입/지출 필터 + 정렬 한 번에 처리
  const filteredExpenses = (() => {
    let list = activeCategory === "ALL"
      ? DUMMY_EXPENSES
      : DUMMY_EXPENSES.filter((e) => e.category === activeCategory);

    if (amountFilter === "expense") list = list.filter((e) => e.amount < 0);
    if (amountFilter === "income")  list = list.filter((e) => e.amount > 0);

    return [...list].sort((a, b) => {
      if (sortOrder === "latest") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      if (sortOrder === "high")   return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortOrder === "low")    return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });
  })();

  const enterEditMode = () => {
    setEditName(trip.name);
    const prices = {};
    DUMMY_EXPENSES.forEach((e) => {
      prices[e.id] = Math.abs(e.amount).toString();
    });
    setEditPrices(prices);
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (onUpdateTrip) onUpdateTrip({ ...trip, name: editName });
    setIsEditMode(false);
  };

  // ── 수정 모드 화면 ─────────────────────────────────────────────────────────
  if (isEditMode) {
    const editTargets = activeCategory === "ALL"
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
          <div className="edit-section-label">여행 제목</div>
          <input
            className="input-field"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

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

  // ── 날짜 탭 생성 헬퍼 ─────────────────────────────────────────────────────
  // startDate ~ endDate 범위의 날짜 배열을 생성 (최대 7일 표시)
  const buildDateTabs = () => {
    if (!trip.startDate || !trip.endDate) return [];
    const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
    const start = new Date(trip.startDate);
    const end   = new Date(trip.endDate);
    const tabs  = [];
    const cur   = new Date(start);
    while (cur <= end && tabs.length < 7) {
      tabs.push({
        dayLabel: DAY_LABELS[cur.getDay()],        // 요일 (월/화/수...)
        dateNum:  cur.getDate(),                    // 일(숫자)
        month:    cur.getMonth() + 1,               // 월
        fullDate: cur.toISOString().slice(0, 10),   // YYYY-MM-DD
      });
      cur.setDate(cur.getDate() + 1);
    }
    return tabs;
  };

  const dateTabs = buildDateTabs();

  // ── 일반 상세 화면 ─────────────────────────────────────────────────────────
  return (
    <div className="screen trip-detail-screen">
      {/* 헤더 */}
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
      <div className="detail-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
        </div>
        {/* 국기 이미지 처리 */}
        {trip.flag && trip.flag.startsWith('http') ? (
          <img 
            src={trip.flag} 
            alt="" 
            style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} 
          />
        ) : (
          <span>{trip.flag || "🌍"}</span>
        )}
        <span className="detail-title" style={{ fontSize: '16px', fontWeight: 'bold' }}>{trip.name}</span>
      </div>

      {/* 날짜 탭 — 등록한 기간으로 동적 생성 */}
      {dateTabs.length > 0 ? (
        <div className="day-tabs">
          {dateTabs.map((d) => (
            <div
              key={d.fullDate}
              className={`day-col${selectedDate === d.fullDate ? " day-col-active" : ""}`}
              onClick={() => setSelectedDate(d.fullDate)}
            >
              <div className="day-label">{d.dayLabel}</div>
              <div className="day-num">{d.dateNum}</div>
            </div>
          ))}
        </div>
      ) : (
        // 날짜 미입력 시 기간 안내 텍스트
        <div className="day-tabs">
          <div style={{ padding: "10px 16px", fontSize: 12, color: "#aaa" }}>
            여행 기간이 설정되지 않았습니다
          </div>
        </div>
      )}

      {/* 선택된 날짜 표시 배지 */}
      {selectedDate && (
        <div className="selected-date-badge">
          📅 {selectedDate.replace(/-/g, ".")} 지출 내역
        </div>
      )}

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
        {/* 여행 기간 표시 */}
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

      {/* 정렬 / 수입·지출 필터 행 */}
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
            { value: "all",     label: "전체" },
            { value: "expense", label: "지출" },
            { value: "income",  label: "수입" },
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

// ─── 화면 7: 통계 ────────────────────────────────────────────────────────────
// import pages/StatsScreen.jsx 해서 이 부분은 생략 가능

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
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [prevScreen, setPrevScreen] = useState("home");
  const [userName, setUserName] = useState("관리자");

  const handleLogin = (name) => {
    setUserName(name || "관리자");
  };

  const navigate = (dest) => {
    if (dest === "afterLogin") {
      setScreen(trips.length === 0 ? "onboarding" : "home");
      return;
    }
    if (dest === "back") {
      setScreen(prevScreen);
      return;
    }
    setPrevScreen(screen);
    setScreen(dest);
  };

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [...prev, { id: Date.now(), ...newTrip }]);
    setScreen("home");
  };

  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
  };

  const renderScreen = () => {
    const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;
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
        return <TripDetailScreen onNavigate={navigate} trip={selectedTrip} onUpdateTrip={handleUpdateTrip} />;
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
      case "admin":
        return <AdminPage onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
    }
  };
  // 🔥 관리자면 완전히 분리
  if (screen === "admin") {
    return (
      <div className="min-h-screen w-full bg-gray-100">
        <nav className="top-nav">
          <div className="nav-logo">✈ TripBudget</div>
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
            ["login",       "로그인"],
            ["register",    "회원가입"],
            ["onboarding",  "온보딩"],
            ["home",        "홈"],
            ["tripDetail",  "여행상세"],
            ["stats",       "통계"],
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
          <div className="phone-inner">
            {renderScreen()}
          </div>
        </div>
       </div>

    </div>
  );
}
