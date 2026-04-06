import { useEffect, useState, useRef } from "react";import countries from "i18n-iso-countries";
import ko from "i18n-iso-countries/langs/ko.json";
import "./app.css";
import AdminPage from "./pages/AdminPage";
import StatsScreen from "./pages/StatsScreen";
import TripJournalScreen from "./components/journal/TripJournalScreen";
import { useAuthStore } from "./store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { getTrips, createTrip, updateTrip, deleteTrip, getTripBudgets, createExpense, getExpenses } from "./api/tripApi";

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

// API baseURL에는 /api가 포함되어 있으므로 썸네일 경로 조합 시에는 origin만 사용합니다.
function getBackendOrigin() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://25.2.109.64:8080/api";
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

// thumbnailPath가 있으면 백엔드 이미지를 우선 사용하고, 없으면 기존 대표/샘플 이미지로 fallback 합니다.
function resolveTripImage(trip) {
  if (trip?.thumbnailPath) {
    if (trip.thumbnailPath.startsWith("http")) {
      return trip.thumbnailPath;
    }

    const normalizedPath = trip.thumbnailPath.startsWith("/")
      ? trip.thumbnailPath
      : `/${trip.thumbnailPath}`;

    return `${getBackendOrigin()}${normalizedPath}`;
  }

  return trip?.coverImage || trip?.randomImage || getRandomImage();
}

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
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

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
  const { logout } = useAuthStore();

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
          onClick={(e) => { onNavigate("home"); }}>⌂</span>
        <span className="filter-serach-icon"
          onClick={(e) => { onNavigate("home"); }}>✈</span>
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
                  <div style={{ height: "1px", background: "#e5e7eb" }} />
                  <div style={{ padding: "10px 16px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onClick={() => {
                      if (window.confirm("로그아웃 하시겠습니까?")) {
                        setShowHeaderMenu(false);
                        logout();
                        onNavigate("login");
                      }
                    }}>
                    ↩ 로그아웃
                  </div>
                </>
              ) : (
                <div style={{ padding: "12px 16px", fontSize: "13px", color: "#9ca3af" }}>
                  여행을 먼저 선택해주세요
                  <div style={{ height: "1px", background: "#e5e7eb" }} />
                  <div style={{ padding: "10px 16px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onClick={() => {
                      if (window.confirm("로그아웃 하시겠습니까?")) {
                        setShowHeaderMenu(false);
                        logout();
                        onNavigate("login");
                      }
                    }}>
                    ↩ 로그아웃
                  </div>
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
                  src={resolveTripImage(trip)}
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
function TripDetailScreen({ onNavigate, trip, onUpdateTrip, onDeleteTrip, tripId  }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrices, setEditPrices] = useState({});
  const [ocrTargetId, setOcrTargetId] = useState(null);
  const [ocrPreview, setOcrPreview] = useState(null);
  const [receiptList, setReceiptList] = useState({}); // { expenseId: [{amount, storeName}, ...] }
  const [showOcrOptions, setShowOcrOptions] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(trip?.startDate ?? null);
  const [isDailyInputMode, setIsDailyInputMode] = useState(false);
  const [dailyInputItems, setDailyInputItems] = useState([{ category: "식비", amount: "", memo: "" }]);
  const getDefaultCategory = () => {
    return activeCategory === "ALL" ? "식비" : activeCategory;
  };
  const { logout } = useAuthStore();
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const budgetLabel = trip.budget?.replace("사용 예산: ", "") ?? trip.budget ?? "-";
  const dateTabs = buildTripDays(trip);
  const dailyExpenses = selectedDate ? (trip?.dailyExpenses || {})[selectedDate] || [] : [];
  const allExpenses = Object.values(trip?.dailyExpenses || {}).flat();
  const baseExpenses = selectedDate ? dailyExpenses : allExpenses;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses(tripId);
        setExpenses(res.data); // state에 저장
      } catch (error) {
        console.error("지출 내역 조회 실패", error);
      }
    };

    if (tripId) fetchExpenses();
  }, [tripId]);

  const handleDateSelect = (isoDate) => {
    setSelectedDate(isoDate);
    setActiveCategory("ALL");
    setIsDailyInputMode(false);
    setDailyInputItems([{ category: "식비", amount: "", memo: "" }]);
  };

  

  const addDailyItem = () =>
    setDailyInputItems((prev) => [
      ...prev,
      { category: getDefaultCategory(), amount: "", memo: "" }
    ]);

  const categoryMap = {
    "식비": "FOOD",
    "교통": "TRANSPORT",
    "숙박": "LODGING",
    "기타": "OTHER",
    "관광": "SIGHTSEEING",
    "쇼핑": "SHOPPING",
    "FOOD": "식비",
    "TRANSPORT": "교통",
    "LODGING": "숙박",
    "OTHER": "기타",
    "SIGHTSEEING": "관광",
    "SHOPPING": "쇼핑"
  };  

  const handleDailyItemChange = (index, field, value) =>
    setDailyInputItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const removeDailyItem = (index) =>
    setDailyInputItems((prev) => prev.filter((_, i) => i !== index));

  const saveDailyExpenses = async () => {
    const validItems = dailyInputItems.filter((item) => Number(item.amount) > 0);

    if (validItems.length === 0) {
      setIsDailyInputMode(false);
      return;
    }

    try {
      await Promise.all(
        validItems.map((item) => {
          const payload = {
            category: categoryMap[item.category] || "OTHER",
            amount: Number(item.amount),
            expenseDate: selectedDate,
            memo: item.memo || "",
          };
          console.log("Payload to send:", payload); // ✅ 여기서 찍어야 함
          return createExpense(trip.id, payload);
        })
      );

      // ✅ 2. 성공하면 기존 로직 유지 (UI 반영)
      const existing = (trip?.dailyExpenses || {})[selectedDate] || [];
      const nextId = Date.now();

      const newItems = validItems.map((item, i) => ({
        id: nextId + i,
        date: selectedDate,
        category: item.category,
        label: item.category,
        memo: item.memo,
        amount: -Math.abs(Number(item.amount)),
      }));

      onUpdateTrip({
        ...trip,
        dailyExpenses: {
          ...(trip.dailyExpenses || {}),
          [selectedDate]: [...existing, ...newItems],
        },
      });


      setIsDailyInputMode(false);
      setDailyInputItems([{ category: "식비", amount: "", memo: "" }]);

    } catch (err) {
      console.error(err);
      alert("지출 저장에 실패했습니다.");
    }
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
  const selected = new Date(selectedDate); // 문자열 -> Date

  const expenseDateSet = new Set(
    expenses.map(e => new Date(e.expenseDate).toDateString())
  );

  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.expenseDate);
    const selected = new Date(selectedDate);

    const isSameDate =
      d.getFullYear() === selected.getFullYear() &&
      d.getMonth() === selected.getMonth() &&
      d.getDate() === selected.getDate();

    const isSameCategory =
      activeCategory === "ALL" || categoryMap[e.category] === activeCategory;

    return isSameDate && isSameCategory;
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
  
  const handleReceiptClick = (expenseId) => {
    setOcrTargetId(expenseId);
    setShowOcrOptions(true);
  };

  const handleOpenWebcam = async () => {
    setShowOcrOptions(false);
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      alert("웹캠에 접근할 수 없어요.");
      setShowWebcam(false);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    video.srcObject?.getTracks().forEach((track) => track.stop());
    setShowWebcam(false);
    sendToOcr(base64);
  };

  const handleCloseWebcam = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setShowWebcam(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || ocrTargetId === null) return;
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    sendToOcr(base64);
    e.target.value = "";
  };

  const sendToOcr = async (base64) => {
    try {
      const response = await fetch("http://25.2.125.100:8080/api/receipt/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      if (!response.ok) throw new Error("서버 오류");
      const result = await response.json();
      const amount = result.total;
      const storeName = result.storeName ?? "영수증";

      if (amount) {
        // ✅ 모달 대신 목록에 바로 추가
        setReceiptList((prev) => ({
          ...prev,
          [ocrTargetId]: [...(prev[ocrTargetId] || []), { id: Date.now(), storeName, amount }],
        }));
      } else {
        alert("금액을 인식하지 못했어요. 직접 입력해 주세요.");
      }
    } catch {
      alert("영수증 인식에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleDeleteReceipt = (expenseId, receiptId) => {
    setReceiptList((prev) => ({
      ...prev,
      [expenseId]: (prev[expenseId] || []).filter((r) => r.id !== receiptId),
    }));
  };

  const handleApplyReceipts = (expenseId) => {
    const list = receiptList[expenseId] || [];
    const receiptTotal = list.reduce((sum, r) => sum + r.amount, 0);
    // 기존 입력값 + 영수증 합계
    const existing = Number(editPrices[expenseId]) || 0;
    setEditPrices((prev) => ({ ...prev, [expenseId]: String(existing + receiptTotal) }));
    setReceiptList((prev) => ({ ...prev, [expenseId]: [] }));
  };

  const handleOcrApply = () => {
    if (!ocrPreview) return;
    setEditPrices((prev) => ({ ...prev, [ocrPreview.id]: String(ocrPreview.amount) }));
    setOcrPreview(null);
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
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div className="edit-expense-row">
                  {/* 라벨 + 날짜 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="edit-expense-label">{e.label}</span>
                    {e.date && (
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                        {e.date.replace(/-/g, ".")}
                      </div>
                    )}
                  </div>

                  {/* 영수증 버튼 + 금액 입력 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => handleReceiptClick(e.id)}
                      style={{
                        fontSize: 11, color: "#2ecc71", border: "1px solid #2ecc71",
                        borderRadius: 6, padding: "3px 8px", background: "transparent",
                        cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >
                      📄 영수증
                    </button>
                    <div className="edit-expense-input-wrap">
                      <input className="input-field edit-amount-input" type="number"
                        value={editPrices[e.id] ?? ""}
                        onChange={(ev) =>
                          setEditPrices((prev) => ({ ...prev, [e.id]: ev.target.value }))} />
                      <span className="edit-expense-unit">원</span>
                    </div>
                  </div>

                  {/* 항목 삭제 버튼 */}
                  <button className="expense-delete-btn"
                    onClick={() => handleDeleteExpense(e.id)} title="이 항목 삭제">
                    🗑️
                  </button>
                </div>

                {/* ✅ 영수증 목록 */}
                {(receiptList[e.id] || []).length > 0 && (
                  <div style={{ marginTop: 6, marginLeft: 4, padding: "8px 10px",
                    background: "#1a2535", borderRadius: 8, fontSize: 12 }}>
                    {(receiptList[e.id] || []).map((receipt) => (
                      <div key={receipt.id}
                        style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", padding: "4px 0",
                          borderBottom: "1px solid #2e3d4f" }}>
                        <span style={{ color: "#ccc" }}>🧾 {receipt.storeName}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#2ecc71", fontWeight: 600 }}>
                            {receipt.amount.toLocaleString()}원
                          </span>
                          <button
                            onClick={() => handleDeleteReceipt(e.id, receipt.id)}
                            style={{ background: "none", border: "none", color: "#f87171",
                              cursor: "pointer", fontSize: 13, padding: 0 }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 합계 + 적용 버튼 */}
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginTop: 6 }}>
                      <span style={{ color: "#aaa" }}>
                        합계{" "}
                        <span style={{ color: "#fff", fontWeight: 700 }}>
                          {/* 기존값 + 영수증 합계 */}
                          {((Number(editPrices[e.id]) || 0) + (receiptList[e.id] || []).reduce((s, r) => s + r.amount, 0)).toLocaleString()}원
                        </span>
                      </span>
                      <button
                        onClick={() => handleApplyReceipts(e.id)}
                        style={{ fontSize: 11, color: "#fff", background: "#2ecc71",
                          border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                        합산 적용
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )))} 
        </div>

        {/* 파일/웹캠 선택 모달 */}
        {showOcrOptions && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#1e2a38", borderRadius: 14, padding: 24, width: 260, textAlign: "center" }}>
              <p style={{ color: "#fff", fontSize: 14, marginBottom: 20 }}>영수증 입력 방법 선택</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => { setShowOcrOptions(false); fileInputRef.current.click(); }}
                  style={{ padding: 12, borderRadius: 8, border: "1px solid #555",
                    background: "transparent", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                  📁 파일 업로드
                </button>
                <button onClick={handleOpenWebcam}
                  style={{ padding: 12, borderRadius: 8, border: "none",
                    background: "#2ecc71", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  📷 웹캠 촬영
                </button>
                <button onClick={() => setShowOcrOptions(false)}
                  style={{ padding: 8, borderRadius: 8, border: "none",
                    background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 12 }}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 웹캠 촬영 모달 */}
        {showWebcam && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", zIndex: 100, gap: 12 }}>
            <video ref={videoRef} autoPlay playsInline
              style={{ width: "100%", maxWidth: 300, borderRadius: 10 }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCloseWebcam}
                style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #555",
                  background: "transparent", color: "#aaa", cursor: "pointer" }}>
                취소
              </button>
              <button onClick={handleCapture}
                style={{ padding: "10px 24px", borderRadius: 8, border: "none",
                  background: "#2ecc71", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                📷 촬영
              </button>
            </div>
          </div>
        )}

        {/* OCR 금액 확인 모달 */}
        {ocrPreview && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#1e2a38", borderRadius: 14, padding: 24, width: 260, textAlign: "center" }}>
              <p style={{ color: "#fff", fontSize: 14, marginBottom: 8 }}>영수증에서 금액을 인식했어요</p>
              <p style={{ color: "#2ecc71", fontSize: 28, fontWeight: 700, margin: "12px 0" }}>
                {ocrPreview.amount.toLocaleString()}원
              </p>
              <p style={{ color: "#aaa", fontSize: 12, marginBottom: 20 }}>이 금액을 적용할까요?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setOcrPreview(null)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #555",
                    background: "transparent", color: "#aaa", cursor: "pointer" }}>
                  취소
                </button>
                <button onClick={handleOcrApply}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: "none",
                    background: "#2ecc71", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                  적용
                </button>
              </div>
            </div>
          </div>
        )}

        {/* hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleFileChange} />

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
        <span
          className="hamburger"
          onClick={(e) => {
            e.stopPropagation();
            setShowHeaderMenu((prev) => !prev);
          }}
        >
          ☰
        </span>

        {showHeaderMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 45,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              zIndex: 100,
              minWidth: "150px",
              overflow: "hidden"
            }}
          >
            {/* ✏️ 여행 수정 */}
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#374151"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => {
                setShowHeaderMenu(false);
                onNavigate("editTrip", trip);
              }}
            >
              ✏️ 여행 수정하기
            </div>

            <div style={{ height: "1px", background: "#e5e7eb" }} />

            {/* 🗑️ 여행 삭제 */}
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#ef4444"
              }}
              
              onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={async () => {
                if (window.confirm("이 여행을 삭제하시겠습니까?")) {
                  setShowHeaderMenu(false);

                  await onDeleteTrip(trip.id); 

                  onNavigate("home");
                }
              }}
            >
              🗑️ 여행 삭제하기
            </div>

            <div style={{ height: "1px", background: "#e5e7eb" }} />

            {/* ↩ 로그아웃 */}
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#374151"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => {
                if (window.confirm("로그아웃 하시겠습니까?")) {
                  setShowHeaderMenu(false);
                  logout();
                  onNavigate("login");
                }
              }}
            >
              ↩ 로그아웃
            </div>
          </div>
        )}
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
            const hasExpense = expenseDateSet.has(new Date(day.isoDate).toDateString());
            return (
              <div
                key={day.isoDate}
                className={`day-col${selectedDate === day.isoDate ? " day-col-active" : ""}`}
                onClick={() => handleDateSelect(day.isoDate)}
              >
                <div className="day-label">{day.label}</div>
                <div className="day-num">{day.date}</div>

                {hasExpense && (
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#10b981",
                      marginTop: 2
                    }}
                  />
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
              <div key={index} style={{ marginBottom: 8 }}>
                {/* 첫 줄: flex로 묶기 */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select className="input-field daily-select" value={item.category}
                    onChange={(e) => handleDailyItemChange(index, "category", e.target.value)}>
                    {["식비", "교통", "숙박", "관광", "쇼핑", "기타"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="daily-amount-wrap" style={{ flex: 1 }}>
                    <input className="input-field daily-amount-input" type="number" placeholder="금액"
                      value={item.amount} onChange={(e) => handleDailyItemChange(index, "amount", e.target.value)} />
                    <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 4 }}>원</span>
                  </div>

                  {dailyInputItems.length > 1 && (
                    <button onClick={() => removeDailyItem(index)}
                      style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
                  )}
                </div>

                {/* 둘째 줄: 메모 */}
                <input className="input-field daily-memo-input" type="text" placeholder="메모"
                  value={item.memo} onChange={(e) => handleDailyItemChange(index, "memo", e.target.value)}
                  style={{ width: "100%", marginTop: 4 }} 
                />
              </div>
            ))}

            {/* 버튼 줄 */}
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
                      <div className="expense-label">{categoryMap[expense.category] || expense.category}</div>
                      <div className="expense-sub">{expense.memo}</div>
                    </div>
                    <div className={`expense-amount ${-expense.amount < 0 ? "red-text" : "green-text"}`}>
                      {-expense.amount < 0 ? "-" : "+"}{Math.abs(expense.amount).toLocaleString()}
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

  // ✅ handleLogin — 이름만 설정, 여행 목록은 여기서 안 불러옴
  const handleLogin = (name) => {
    setUserName(name || "관리자");
  };

  // ✅ navigate — afterLogin 시 여행 목록 불러오기
  const navigate = async (destination, data) => {
    if (destination === "afterLogin") {
      if (data && data.name) {
      handleLogin(data.name); 
    }
      // 로그인 직후 여행 목록 DB에서 불러오기
      try {
        const res = await getTrips();
        const fetched = (res.data || []).map((t) => {
          const countryObj = COUNTRIES.find((c) => c.name === t.country);
          const flagUrl = countryObj
            ? `https://flagcdn.com/w320/${countryObj.code}.png`
            : "";
          return {
            id:             t.id,
            name:           t.title,
            country:        t.country,
            startDate:      t.startDate,
            endDate:        t.endDate,
            thumbnailPath:  t.thumbnailPath ?? null,
            flag:           flagUrl,
            budget:         t.totalBudget
                              ? `총 ${Number(t.totalBudget).toLocaleString()}원`
                              : "예산 미설정",
            totalBudget:    Number(t.totalBudget) || 0,
            budgetData:     [],
            dailyExpenses:  {},
            randomImage:    getRandomImage(),
            coverImage:     "",
            journalEntries: [],
          };
        });
        setTrips(fetched);
        setScreen(fetched.length === 0 ? "onboarding" : "home");
      } catch (err) {
        console.error("여행 목록 불러오기를 실패했습니다", err);
        setScreen("onboarding");
      }
      return;
    }
    if (destination === "back") { setScreen(prevScreen); return; }
    if (destination === "createTrip") { setEditingTrip(null); }
    if (destination === "editTrip") { setEditingTrip(data); setScreen("createTrip"); return;}

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
        thumbnailPath: saved.thumbnailPath ?? null,
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
    console.log("budgetData:", updatedTrip.budgetData);
    try {
      const budgets = (updatedTrip.budgetData || [])
        .filter((item) => String(item.amount).trim() !== "" && Number(item.amount) > 0)
        .map((item) => ({
          category: item.category,
          amount: Number(item.amount),
        }));

      if (screen !== "tripJournal") {
        const requestData = {
          title: updatedTrip.name,
          country: updatedTrip.country,
          startDate: updatedTrip.startDate,
          endDate: updatedTrip.endDate,
          budgets,
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

  const handleEditTrip = async (tripId) => {
    const target = trips.find((t) => t.id === tripId);
    try {
      // ✅ DB에서 해당 여행의 카테고리별 예산 불러오기
      const res = await getTripBudgets(tripId);
      const budgetData = (res.data || []).map((b) => ({
        category:       b.category,
        amount:         String(b.amount),  // input에 표시하려면 string으로
        customCategory: "",
      }));

      setEditingTrip({
        ...target,
        budgetData: budgetData.length > 0
          ? budgetData
          : [{ category: "식비", amount: "", customCategory: "" }],
      });
    } catch (err) {
      console.error("예산 목록 불러오기 실패", err);
      // 실패해도 수정 화면은 열어줌 — 빈 폼으로 시작
      setEditingTrip({
        ...target,
        budgetData: [{ category: "식비", amount: "", customCategory: "" }],
      });
    }
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
        return <TripDetailScreen onNavigate={navigate} trip={selectedTrip} onUpdateTrip={handleUpdateTrip} onDeleteTrip={handleDeleteTrip} tripId={selectedTripId} />;
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