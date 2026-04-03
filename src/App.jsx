import { useEffect, useState } from "react";import countries from "i18n-iso-countries";
import ko from "i18n-iso-countries/langs/ko.json";
import "./app.css";
import AdminPage from "./pages/AdminPage";
import StatsScreen from "./pages/StatsScreen";
import TripJournalScreen from "./components/journal/TripJournalScreen";
import { useAuthStore } from "./store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { getTrips, createTrip, updateTrip, deleteTrip } from "./api/tripApi";

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
    return [{ label: "여행 기간을 등록하지 않았어요" }];
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

// ★ 여행의 전체 실제 지출 합계 계산 헬퍼
function calcTotalSpent(trip) {
  if (!trip?.dailyExpenses) return 0;
  return Object.values(trip.dailyExpenses)
    .flat()
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);
}

// ─── 화면 1: 로그인 ──────────────────────────────────────────────────────────
const inputClass =
    'w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white ' +
    'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';

function LoginScreen({ onNavigate, onLogin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("로그인 시도");
            await login(email, password);
            alert("로그인에 성공했습니다.");
            onNavigate("afterLogin");
        } catch (err) {
            console.log("로그인 실패");
            alert(err.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen login-screen">

            {/* 로고 */}
            <div className="logo-wrapper">
                <img src="/src/img/logo.png" alt="logo" className="logo" />
            </div>

            {/* 제목 */}
            <div className="login-title">로그인</div>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="이메일"
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="green-btn full-width"
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>

            </form>

            <div className="sub-link">
                계정이 없으신가요?{' '}
                <span className="link" onClick={() => onNavigate("register")}>
                    회원가입
                </span>
            </div>

        </div>
    );
}

// ─── 화면 2: 회원가입 ────────────────────────────────────────────────────────
function RegisterScreen({ onNavigate }) {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const { register } = useAuthStore();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            alert('회원가입 완료. 로그인해 주세요.');
            onNavigate("Login");
        } catch (err) {
            alert(err.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen register-screen">

            {/* 로고 */}
            <div className="logo-wrapper">
                <img src="/src/img/logo.png" alt="logo" className="logo" />
            </div>

            {/* 제목 */}
            <div className="register-title">회원가입</div>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름"
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일"
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        required
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="green-btn full-width"
                >
                    {loading ? '처리 중...' : '회원가입'}
                </button>

            </form>

            <div className="sub-link">
                이미 계정이 있으신가요?{' '}
                <span className="link" onClick={() => onNavigate("Login")}>
                    로그인
                </span>
            </div>

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
      <h2 className="onboarding-title">여행을 추가하고<br />예산을 관리해보세요!</h2>
      <p className="onboarding-sub link" onClick={() => onNavigate("login")}>가이드 바로가기</p>
      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={() => onNavigate("createTrip")}>여행 기록하기</GreenButton>
    </div>
  );
}

// ─── 여행 생성용 상수 ────────────────────────────────────────────────────────
const COUNTRIES = Object.entries(countries.getNames("ko")).map(([code, name]) => ({
  code: code.toLowerCase(), name,
}));
const CREATE_CATEGORIES = ["식비", "교통", "숙박", "관광", "쇼핑", "기타"];
const defaultImages = Array.from({ length: 30 }, (_, i) =>
  `/src/img/user_img/admin/Pic${i + 1}.jpg`
);

  const getRandomImage = () =>
    defaultImages[Math.floor(Math.random() * defaultImages.length)];

// ─── 화면 4: 여행 생성 / 수정 ────────────────────────────────────────────────
function CreateTripScreen({ onNavigate, onAddTrip, onUpdateTrip, editTrip }) {
  const isEditMode = !!editTrip;
  const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;

  const [tripName, setTripName] = useState(editTrip?.name ?? "");
  const [startDate, setStartDate] = useState(editTrip?.startDate ?? "");
  const [endDate, setEndDate] = useState(editTrip?.endDate ?? "");
  const [categoryBudgets, setCategoryBudgets] = useState(
    editTrip?.budgetData ?? [{ category: "식비", amount: "", customCategory: "" }]
  );
  const initialCountry = editTrip ? COUNTRIES.find((c) => c.name === editTrip.country) ?? null : null;
  const [countryInput, setCountryInput] = useState(editTrip?.country ?? "");
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const handleCountryInput = (e) => {
    const value = e.target.value;
    setCountryInput(value);
    if (selectedCountry && value !== selectedCountry.name) setSelectedCountry(null);
    if (value.trim() === "") { setFilteredCountries([]); setShowDropdown(false); setSelectedCountry(null); return; }
    setFilteredCountries(COUNTRIES.filter((c) => c.name.toLowerCase().includes(value.toLowerCase())));
    setShowDropdown(true);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country); setCountryInput(country.name); setShowDropdown(false);
  };

  const addCategoryBudget = () =>
    setCategoryBudgets((prev) => [...prev, { category: "식비", amount: "", customCategory: "" }]);

  const removeCategoryBudget = (index) =>
    setCategoryBudgets((prev) => prev.filter((_, i) => i !== index));

  const handleBudgetChange = (index, field, value) =>
    setCategoryBudgets((prev) => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });

  const totalBudget = categoryBudgets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSubmit = () => {
    if (!tripName.trim()) return;
    const flagInfo = selectedCountry ? getFlagUrl(selectedCountry.code) : editTrip?.flag ?? "🌍";
    const tripData = {
      name: tripName, flag: flagInfo,
      country: selectedCountry ? selectedCountry.name : countryInput,
      startDate, endDate,
      budget: `총 ${totalBudget.toLocaleString()}원`,
      budgetData: categoryBudgets, totalBudget,
    };
    if (isEditMode) {
      onUpdateTrip({ ...editTrip, ...tripData });
    } else {
      const initialExpenses = categoryBudgets
        .filter((item) => Number(item.amount) > 0)
        .map((item, index) => ({
          id: index + 1,
          category: item.category === "기타" && item.customCategory ? item.customCategory : item.category,
          label: item.category === "기타" && item.customCategory ? item.customCategory : item.category,
          amount: -Number(item.amount),
        }));
      onAddTrip({
        ...tripData,
        expenses: initialExpenses,
        coverImage: "",
        randomImage: getRandomImage(),
        journalEntries: []
      });
    }
    onNavigate("home");
  };

  return (
    <div className="screen create-trip-screen">
      <div className="top-bar">
        <span className="back-arrow" onClick={() => onNavigate(isEditMode ? "home" : "back")}>←</span>
        <span className="top-bar-title">{isEditMode ? "여행 수정하기" : "여행 기록하기"}</span>
      </div>
      <div className="create-form">
        <div className="form-label">국가</div>
        <div className="country-selector" style={{ padding: 0, overflow: "visible", position: "relative" }}>
          <div className="country-flag-large" style={{ paddingLeft: 12 }}>
            {selectedCountry ? (
              <img src={getFlagUrl(selectedCountry.code)} alt=""
                style={{ width: "30px", height: "20px", objectFit: "cover", borderRadius: "2px" }} />
            ) : <span style={{ fontSize: "20px" }}>🌍</span>}
          </div>
          <input className="country-search-input" placeholder="국가 이름을 검색하세요"
            value={countryInput} onChange={handleCountryInput}
            onFocus={() => { if (countryInput.trim() && !selectedCountry) setShowDropdown(true); }}
            autoComplete="off" />
        </div>
        {showDropdown && (
          <div className="country-dropdown">
            {filteredCountries.length > 0 ? filteredCountries.map((country) => (
              <div key={country.code} className="country-option" onClick={() => handleSelectCountry(country)}>
                <img src={getFlagUrl(country.code)} alt="" style={{ width: "24px", height: "16px", marginRight: "8px" }} />
                <span>{country.name}</span>
              </div>
            )) : (
              <div className="country-option" style={{ color: "#999", cursor: "default" }}>검색 결과가 없습니다</div>
            )}
          </div>
        )}
        <div className="form-label" style={{ marginTop: 16 }}>여행 기간</div>
        <div className="date-row">
          <input className="input-field date-input" type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)} />
          <span className="date-sep">~</span>
          <input className="input-field date-input" type="date" value={endDate}
            onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="form-label" style={{ marginTop: 16 }}>여행 제목</div>
        <input className="input-field" placeholder="예) 도쿄 우정여행" value={tripName}
          onChange={(e) => setTripName(e.target.value)} />
        <div className="form-label" style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
          <span>예산 설정</span>
          <span onClick={addCategoryBudget} style={{ color: "#10b981", cursor: "pointer", fontSize: "14px" }}>+ 추가</span>
        </div>
        {categoryBudgets.map((item, index) => (
          <div key={index} className="budget-input-group" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <select className="input-field" style={{ flex: 1, marginBottom: 0 }} value={item.category}
                onChange={(e) => handleBudgetChange(index, "category", e.target.value)}>
                {CREATE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input className="input-field" style={{ flex: 1.5, marginBottom: 0 }} type="number"
                placeholder="금액" value={item.amount}
                onChange={(e) => handleBudgetChange(index, "amount", e.target.value)} />
              {categoryBudgets.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault();
                  e.stopPropagation(); 
                  removeCategoryBudget(index);
                  }}      
                  style={{
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: "18px",
                    color: "#9ca3af", padding: "0 4px",
                    lineHeight: 1, flexShrink: 0,
                  }}
                  title="삭제"
                >
                  🗑️
                </button>
              )}
            </div>
            {item.category === "기타" && (
              <input className="input-field" style={{ marginTop: 8 }} placeholder="카테고리명 입력"
                value={item.customCategory}
                onChange={(e) => handleBudgetChange(index, "customCategory", e.target.value)} />
            )}
          </div>
        ))}
        {totalBudget > 0 && (
          <p className="budget-preview" style={{ textAlign: "right", fontWeight: "bold", color: "#10b981" }}>
            총 {totalBudget.toLocaleString()}원
          </p>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <GreenButton fullWidth onClick={handleSubmit}>{isEditMode ? "수정 완료" : "만들기"}</GreenButton>
    </div>
  );
}

// ─── 화면 5: 홈(여행 목록) ───────────────────────────────────────────────────
function HomeScreen({ trips, onNavigate, onSelectTrip, onDeleteTrip, onEditTrip, userName }) {
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [menuTargetId, setMenuTargetId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDeleteConfirm = () => {
    onDeleteTrip(deleteTargetId);
    setDeleteTargetId(null);
    setMenuTargetId(null);
  };

  return (
    <div className="screen home-screen"
      onClick={() => { setShowHeaderMenu(false); setMenuTargetId(null); }}>
      <div className="home-header">
        <span className="filter-icon"
          onClick={(e) => { e.stopPropagation(); onNavigate("tripFilter"); }}>⌂</span>
        <span className="filter-serach-icon"
          onClick={(e) => { e.stopPropagation(); onNavigate("tripFilter"); }}>✈</span>
        <div style={{ position: "relative" }}>
          <span className="hamburger"
            onClick={(e) => { e.stopPropagation(); setShowHeaderMenu((prev) => !prev); }}>☰</span>
          {showHeaderMenu && (
            <div onClick={(e) => e.stopPropagation()}
              style={{ position: "absolute", top: 28, right: 0, background: "#fff",
                border: "1px solid #e5e7eb", borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)", zIndex: 100, minWidth: "150px", overflow: "hidden" }}>
              {menuTargetId ? (
                <>
                  <div style={{ padding: "10px 16px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onClick={() => { setShowHeaderMenu(false); onEditTrip(menuTargetId); }}>
                    ✏️ 여행 수정하기
                  </div>
                  <div style={{ height: "1px", background: "#e5e7eb" }} />
                  <div style={{ padding: "10px 16px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: "8px", fontSize: "13px", color: "#ef4444" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onClick={() => { setShowHeaderMenu(false); setDeleteTargetId(menuTargetId); }}>
                    🗑️ 여행 삭제하기
                  </div>
                </>
              ) : (
                <div style={{ padding: "12px 16px", fontSize: "13px", color: "#9ca3af" }}>
                  여행을 먼저 선택해주세요
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="home-banner">
        <div className="home-banner-title">✈ {userName} 님의 여행기록</div>
        <div className="home-banner-sub">지금까지의 여행을 한눈에 확인해보세요</div>
      </div>

      <div className="trip-grid">
        {trips.map((trip) => {
          // ★ 실제 지출 합계
          const spent = calcTotalSpent(trip);
          return (
            <div key={trip.id} className="trip-card"
              onClick={() => { onSelectTrip(trip.id); onNavigate("tripDetail"); }}>
              <div className="trip-card-thumb">
                <img
                  src={trip.coverImage || trip.randomImage || getRandomImage()}
                  alt={`${trip.name} 대표 이미지`}
                  className="trip-card-image"
                />
              </div>
              <div className="trip-card-body">
                <div className="trip-card-name">{trip.name}</div>

                {/* ★ 예산 라인 */}
                <div className="trip-card-budget">{trip.budget}</div>

                {/* ★ 실제 지출 라인 — 지출이 있을 때만 표시 */}
                {spent > 0 && (
                  <div className="trip-card-spent">
                    지출 {spent.toLocaleString()}원
                  </div>
                )}

                <button className="trip-review-link"
                  onClick={(e) => { e.stopPropagation(); onSelectTrip(trip.id); onNavigate("tripJournal"); }}>
                  <span className="trip-review-plus">+</span>
                  <span>후기 작성</span>
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuTargetId(trip.id); setShowHeaderMenu(true); }}
                style={{ position: "absolute", top: 6, right: 6,
                  background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%",
                  width: "24px", height: "24px", cursor: "pointer", fontSize: "13px",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }} />
            </div>
          );
        })}
      </div>

      <GreenButton fullWidth onClick={() => onNavigate("createTrip")}>여행 기록하기</GreenButton>

      {deleteTargetId !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
          onClick={() => setDeleteTargetId(null)}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px 20px",
            width: "260px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>삭제</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>정말 삭제하시겠습니까?</div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button onClick={handleDeleteConfirm}
                style={{ padding: "8px 24px", background: "#10b981", color: "#fff",
                  border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>예</button>
              <button onClick={() => setDeleteTargetId(null)}
                style={{ padding: "8px 24px", background: "#f3f4f6", color: "#374151",
                  border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 상세/통계용 카테고리 ────────────────────────────────────────────────────
const CATEGORIES = ["ALL", "식비", "교통", "숙박", "관광", "쇼핑", "기타"];

// ─── 화면 6: 여행 상세 ───────────────────────────────────────────────────────
function TripDetailScreen({ onNavigate, trip, onUpdateTrip }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});
  const [sortOrder, setSortOrder] = useState("latest");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(trip?.startDate ?? null);
  const [isDailyInputMode, setIsDailyInputMode] = useState(false);
  const [dailyInputItems, setDailyInputItems] = useState([{ category: "식비", amount: "", memo: "" }]);
  const getDefaultCategory = () => {
    return activeCategory === "ALL" ? "식비" : activeCategory;
  };

  useEffect(() => {
    setSelectedDate(trip?.startDate ?? null);
    setIsDailyInputMode(false);
  }, [trip?.id, trip?.startDate]);

  const handleDateSelect = (isoDate) => {
    setSelectedDate(isoDate);
    setActiveCategory("ALL");
    const existing = (trip?.dailyExpenses || {})[isoDate];
    setIsDailyInputMode(!existing || existing.length === 0);
    setDailyInputItems([{ category: "식비", amount: "", memo: "" }]);
  };

  const addDailyItem = () =>
    setDailyInputItems((prev) => [
      ...prev,
      { category: getDefaultCategory(), amount: "", memo: "" }
    ]);

  const handleDailyItemChange = (index, field, value) =>
    setDailyInputItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const removeDailyItem = (index) =>
    setDailyInputItems((prev) => prev.filter((_, i) => i !== index));

  const saveDailyExpenses = () => {
    const validItems = dailyInputItems.filter((item) => Number(item.amount) > 0);
    if (validItems.length === 0) { setIsDailyInputMode(false); return; }
    const existing = (trip?.dailyExpenses || {})[selectedDate] || [];
    const nextId = Date.now();
    const newItems = validItems.map((item, i) => ({
      id: nextId + i, date: selectedDate, category: item.category,
      label: item.category, memo: item.memo, amount: -Math.abs(Number(item.amount)),
    }));
    onUpdateTrip({
      ...trip,
      dailyExpenses: { ...(trip.dailyExpenses || {}), [selectedDate]: [...existing, ...newItems] },
    });
    setIsDailyInputMode(false);
    setDailyInputItems([{ category: "식비", amount: "", memo: "" }]);
  };

  if (!trip) {
    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>⌂</span>
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
  const dailyExpenses = selectedDate ? (trip?.dailyExpenses || {})[selectedDate] || [] : [];
  const allExpenses = Object.values(trip?.dailyExpenses || {}).flat();
  const baseExpenses = selectedDate ? dailyExpenses : allExpenses;

  const filteredExpenses = [...baseExpenses]
    .filter((e) => activeCategory === "ALL" || e.category === activeCategory)
    .filter((e) => amountFilter === "all" ? true : amountFilter === "expense" ? e.amount < 0 : e.amount > 0)
    .sort((a, b) => {
      if (sortOrder === "latest") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      if (sortOrder === "high") return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortOrder === "low") return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });

  const totalSpent = allExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalBudgetNum = trip.totalBudget || 0;
  const remaining = totalBudgetNum - totalSpent;

  const enterEditMode = () => {
    setEditName(trip.name);
    const prices = {};
    allExpenses.forEach((e) => { prices[e.id] = Math.abs(e.amount).toString(); });
    setEditPrices(prices);
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (onUpdateTrip) {
      const nextDailyExpenses = {};
      Object.entries(trip?.dailyExpenses || {}).forEach(([date, items]) => {
        nextDailyExpenses[date] = items.map((e) => ({
          ...e,
          amount: editPrices[e.id] !== undefined ? -Math.abs(Number(editPrices[e.id])) : e.amount,
        }));
      });
      onUpdateTrip({ ...trip, name: editName, dailyExpenses: nextDailyExpenses });
    }
    setIsEditMode(false);
  };

  // ★ 수정 모드에서 특정 지출 항목 삭제
  const handleDeleteExpense = (targetId) => {
    const nextDailyExpenses = {};
    Object.entries(trip?.dailyExpenses || {}).forEach(([date, items]) => {
      const filtered = items.filter((e) => e.id !== targetId);
      // 해당 날짜에 항목이 남아있을 때만 키 유지
      if (filtered.length > 0) nextDailyExpenses[date] = filtered;
    });
    setEditPrices((prev) => { const next = { ...prev }; delete next[targetId]; return next; });
    onUpdateTrip({ ...trip, dailyExpenses: nextDailyExpenses });
  };

  // ── 수정 모드 화면 ─────────────────────────────────────────────────────────
  if (isEditMode) {
    const editTargets = activeCategory === "ALL"
      ? allExpenses
      : allExpenses.filter((e) => e.category === activeCategory);

    return (
      <div className="screen trip-detail-screen">
        <div className="detail-header">
          <span style={{ fontSize: 13, cursor: "pointer", color: "#2ecc71" }}
            onClick={() => setIsEditMode(false)}>← 취소</span>
          <span className="detail-title">수정</span>
          <span style={{ fontSize: 13, cursor: "pointer", color: "#2ecc71", fontWeight: 600 }}
            onClick={handleSave}>저장</span>
        </div>

        <div className="edit-form">
          <div className="edit-section-label">여행 제목</div>
          <input className="input-field" value={editName}
            onChange={(e) => setEditName(e.target.value)} />

          <div className="edit-section-label" style={{ marginTop: 20 }}>
            {activeCategory === "ALL" ? "전체" : activeCategory} 카테고리 금액
          </div>

          {editTargets.length === 0 ? (
            <p style={{ fontSize: 13, color: "#aaa", padding: "16px 0" }}>
              등록된 지출 항목이 없습니다.
            </p>
          ) : (
            editTargets.map((e) => (
              <div key={e.id} className="edit-expense-row">
                {/* 라벨 + 날짜 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="edit-expense-label">{e.label}</span>
                  {e.date && (
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                      {e.date.replace(/-/g, ".")}
                    </div>
                  )}
                </div>

                {/* 금액 입력 */}
                <div className="edit-expense-input-wrap">
                  <input className="input-field edit-amount-input" type="number"
                    value={editPrices[e.id] ?? ""}
                    onChange={(ev) =>
                      setEditPrices((prev) => ({ ...prev, [e.id]: ev.target.value }))} />
                  <span className="edit-expense-unit">원</span>
                </div>

                {/* ★ 항목 삭제 버튼 */}
                <button className="expense-delete-btn"
                  onClick={() => handleDeleteExpense(e.id)}
                  title="이 항목 삭제">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ flex: 1 }} />
        <GreenButton fullWidth onClick={handleSave}>저장하기</GreenButton>
      </div>
    );
  }

  // ── 일반 상세 화면 ─────────────────────────────────────────────────────────
  return (
    <div className="screen trip-detail-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>⌂</span>
        <div className="detail-title-wrapper"
          style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}>
          {trip.flag && trip.flag.startsWith("http") ? (
            <img src={trip.flag} alt=""
              style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px" }} />
          ) : <span>{trip.flag || "🌍"}</span>}
          <span className="detail-title" style={{ fontSize: "16px", fontWeight: "bold" }}>{trip.name}</span>
        </div>
        <span className="menu-icon">☰</span>
      </div>

      {/* ① 예산 요약 */}
      <div className="budget-summary">
        <div className="budget-item">
          <div className="budget-label">전체예산</div>
          <div className="budget-amount">{budgetLabel}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">잔여예산</div>
          <div className="budget-amount">
            {totalBudgetNum > 0 ? `${remaining.toLocaleString()}원` : "-"}
          </div>
        </div>
        {trip.startDate && trip.endDate && (
          <div className="budget-item" style={{ textAlign: "right" }}>
            <div className="budget-label">여행 기간</div>
            <div className="budget-amount" style={{ fontSize: 11, fontWeight: 500 }}>
              {trip.startDate.replace(/-/g, ".")} ~ {trip.endDate.replace(/-/g, ".")}
            </div>
          </div>
        )}
      </div>

      {/* ② 날짜 탭 */}
      {dateTabs.length > 0 ? (
        <div className="day-tabs">
          {dateTabs.map((day) => {
            const hasExpense = ((trip?.dailyExpenses || {})[day.isoDate] || []).length > 0;
            return (
              <div key={day.isoDate}
                className={`day-col${selectedDate === day.isoDate ? " day-col-active" : ""}`}
                onClick={() => handleDateSelect(day.isoDate)}>
                <div className="day-label">{day.label}</div>
                <div className="day-num">{day.date}</div>
                {hasExpense && (
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", marginTop: 2 }} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="day-tabs">
          <div style={{ padding: "10px 16px", fontSize: 12, color: "#aaa" }}>여행 기간이 설정되지 않았습니다</div>
        </div>
      )}

      {/* ③ 선택 날짜 배지 */}
      {selectedDate && (
        <div className="selected-date-badge">📅 {selectedDate.replace(/-/g, ".")} 지출 내역</div>
      )}

      {/* ④ 카테고리 필터 */}
      <div className="category-filter-row">
        {CATEGORIES.map((category) => (
          <button key={category}
            className={`cat-filter-btn${activeCategory === category ? " active" : ""}`}
            onClick={() => setActiveCategory(category)}>{category}</button>
        ))}
      </div>

      {/* ⑤ 정렬 / 필터 */}
      <div className="sort-filter-row">
        <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="high">금액 높은순</option>
          <option value="low">금액 낮은순</option>
        </select>
        <div className="amount-filter-group">
          {[{ value: "all", label: "전체" }, { value: "expense", label: "지출" }, { value: "income", label: "수입" }]
            .map(({ value, label }) => (
              <button key={value}
                className={`amount-filter-btn${amountFilter === value ? " active" : ""}`}
                onClick={() => setAmountFilter(value)}>{label}</button>
            ))}
        </div>
      </div>

      {/* ⑥ 지출 목록 or 입력 폼 */}
      <div className="expense-scroll">
        {!selectedDate && (
          <div className="expense-empty">
            <div>📅 날짜를 등록해 주세요</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>날짜를 등록하면 위 달력에서 날짜를 선택할 수 있어요</div>
          </div>
        )}

        {selectedDate && isDailyInputMode && (
          <div className="daily-input-form">
            <div className="daily-input-header">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>금액 등록</span>
              <span style={{ fontSize: 12, color: "#10b981", cursor: "pointer" }} onClick={addDailyItem}>+ 항목 추가</span>
            </div>
            {dailyInputItems.map((item, index) => (
              <div key={index} className="daily-input-row">
                <select className="input-field daily-select" value={item.category}
                  onChange={(e) => handleDailyItemChange(index, "category", e.target.value)}>
                  {["식비", "교통", "숙박", "관광", "쇼핑", "기타"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="daily-amount-wrap">
                  <input className="input-field daily-amount-input" type="number" placeholder="금액"
                    value={item.amount} onChange={(e) => handleDailyItemChange(index, "amount", e.target.value)} />
                  <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 4 }}>원</span>
                </div>
                {dailyInputItems.length > 1 && (
                  <button onClick={() => removeDailyItem(index)}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="daily-cancel-btn" onClick={() => setIsDailyInputMode(false)}>취소</button>
              <button className="daily-save-btn" onClick={saveDailyExpenses}>저장</button>
            </div>
          </div>
        )}

        {selectedDate && !isDailyInputMode && (
          <>
            {filteredExpenses.length === 0 ? (
              <div className="expense-empty">
                <div>아직 입력된 예산이 없어요...</div>
                <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>아래 + 버튼을 눌러 지출을 추가해보세요</div>
                <button
                  className="daily-add-btn"
                  onClick={() => {
                    setIsDailyInputMode(true);
                    setDailyInputItems([
                      { category: getDefaultCategory(), amount: "", memo: "" }
                    ]);
                  }}
                >
                  + 금액 입력하기
                </button>
              </div>
            ) : (
              <>
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div>
                      <div className="expense-label">{expense.label}</div>
                      <div className="expense-sub">{expense.category}</div>
                    </div>
                    <div className={`expense-amount ${expense.amount < 0 ? "red-text" : "green-text"}`}>
                      {expense.amount < 0 ? "-" : "+"}{Math.abs(expense.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
                <button
                  className="daily-more-btn"
                  onClick={() => {
                    setIsDailyInputMode(true);
                    setDailyInputItems([
                      { category: getDefaultCategory(), amount: "", memo: "" }
                    ]);
                  }}
                >
                  + 이 날 지출 추가
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* ⑦ 하단 버튼 */}
      <div className="detail-bottom-btns">
        <button className="detail-action-btn stats-btn" onClick={() => onNavigate("stats")}>📊 통계</button>
        <button className="detail-action-btn edit-btn-main" onClick={enterEditMode}>✏️ 수정</button>
      </div>
    </div>
  );
}

// ─── 화면 7: 지출 목록 ───────────────────────────────────────────────────────
//삭제

// ─── 메인 앱 ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [prevScreen, setPrevScreen] = useState("home");
  const [userName, setUserName] = useState("관리자");
  const [editingTrip, setEditingTrip] = useState(null);

  //로그인 후 db에서 여행 목록 불러오기
const handleLogin = async (name) => {   // async 추가
  setUserName(name || "관리자");
  try {
    const res = await getTrips();
    const fetched = (res.data || []).map((t) => {
      const countryObj = COUNTRIES.find((c) => c.name === t.country);
      const flagUrl = countryObj
        ? `https://flagcdn.com/w320/${countryObj.code}.png`
        : "";
      return {
        id:            t.id,
        name:          t.title,
        country:       t.country,
        startDate:     t.startDate,
        endDate:       t.endDate,
        flag:          flagUrl,
        budget:        t.totalBudget
                         ? `총 ${Number(t.totalBudget).toLocaleString()}원`
                         : "예산 미설정",
        totalBudget:   Number(t.totalBudget) || 0,
        budgetData:    [],
        dailyExpenses: {},
        randomImage:   getRandomImage(),
        coverImage:    "",
        journalEntries: [],
      };
    });
    setTrips(fetched);  // ✅ 오타 수정
  } catch (err) {
    console.error("여행 목록 불러오기 실패", err);
  }
};

  const navigate = (destination) => {
    if (destination === "afterLogin") { setScreen(trips.length === 0 ? "onboarding" : "home"); return; }
    if (destination === "back") { setScreen(prevScreen); return; }
    if (destination === "createTrip") { setEditingTrip(null); }
    setPrevScreen(screen);
    setScreen(destination);
  };

  //여행 등록
  const handleAddTrip = async (newTrip) => {
  try {
    const requestData = {
      title:     newTrip.name,          // name → title
      country:   newTrip.country,
      startDate: newTrip.startDate,
      endDate:   newTrip.endDate,
      budgets:   newTrip.budgetData
                   .filter((item) => Number(item.amount) > 0)
                   .map((item) => ({
                     category: item.category,
                     amount:   Number(item.amount),
                   })),
    };

    const res = await createTrip(requestData);
    const saved = res.data; // { id, title, country, startDate, endDate, ... }

    setTrips((prev) => [
      ...prev,
      {
        ...newTrip,
        id: saved.id,   
      },
    ]);
    setEditingTrip(null);
    setScreen("home");
  } catch (err) {
    alert("여행 등록에 실패했습니다.");
    console.error(err);
  }
};
  //여행 수정
  const handleUpdateTrip = async (updatedTrip) => {
  try {
    // 지출 수정(dailyExpenses)은 백엔드 별도 API — 여기선 여행 기본정보만 수정
    if (updatedTrip.name || updatedTrip.country) {
      const requestData = {
        title:     updatedTrip.name,
        country:   updatedTrip.country,
        startDate: updatedTrip.startDate,
        endDate:   updatedTrip.endDate,
        budgets:   (updatedTrip.budgetData || [])
                     .filter((item) => Number(item.amount) > 0)
                     .map((item) => ({
                       category: item.category,
                       amount:   Number(item.amount),
                     })),
      };
      await updateTrip(updatedTrip.id, requestData);
    }

    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    if (screen !== "tripJournal") setEditingTrip(null);
  } catch (err) {
    alert("여행 수정에 실패했습니다.");
    console.error(err);
  }
};
  //여행 삭제
  const handleDeleteTrip = async (tripId) => {
  try {
    await deleteTrip(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (selectedTripId === tripId) setSelectedTripId(null);
  } catch (err) {
    alert("여행 삭제에 실패했습니다.");
    console.error(err);
  }
};

  const handleEditTrip = (tripId) => {
    const target = trips.find((t) => t.id === tripId);
    setEditingTrip(target);
    setScreen("createTrip");
  };

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || null;

  const renderScreen = () => {
    switch (screen) {
      case "login": return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
      case "register": return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;
      case "onboarding": return <OnboardingScreen onNavigate={navigate} />;
      case "createTrip":
        return <CreateTripScreen onNavigate={navigate} onAddTrip={handleAddTrip}
          onUpdateTrip={handleUpdateTrip} editTrip={editingTrip} />;
      case "home":
        return <HomeScreen trips={trips} onNavigate={navigate} onSelectTrip={setSelectedTripId}
          onDeleteTrip={handleDeleteTrip} onEditTrip={handleEditTrip} userName={userName} />;
      case "tripDetail":
        return <TripDetailScreen onNavigate={navigate} trip={selectedTrip} onUpdateTrip={handleUpdateTrip} />;
      case "tripJournal":
        return <TripJournalScreen onNavigate={navigate} trip={selectedTrip}
          onUpdateTrip={handleUpdateTrip}
          renderButton={(label, onClick) => <GreenButton fullWidth onClick={onClick}>{label}</GreenButton>} />;
      case "stats":
      return (
        <StatsScreen
          onNavigate={navigate}
          trip={selectedTrip}
        />
      );
      case "admin":
        return <AdminPage onNavigate={navigate} />;
      default:
        return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
    }
  };

  if (screen === "admin") {
    return (
      <div className="min-h-screen w-full bg-gray-100">
        <nav className="top-nav"><div className="nav-logo">✈ CosTrip</div></nav>
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
            ["login","로그인"],["register","회원가입"],["onboarding","온보딩"],
            ["home","홈"],["tripDetail","여행상세"],["tripJournal","후기작성"],
            ["stats","통계"],["admin","관리자"],
          ].map(([key, label]) => (
            <button key={key} className={`nav-btn${screen === key ? " active" : ""}`}
              onClick={() => { if (key !== "createTrip") setEditingTrip(null); setScreen(key); }}>
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
