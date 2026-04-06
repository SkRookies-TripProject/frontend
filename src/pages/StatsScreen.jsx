import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axios";
import BudgetSummary from "../components/stats/BudgetSummary";
import TripDayTabs from "../components/stats/TripDayTabs";
import CategoryDonutChart from "../components/stats/CategoryDonutChart";
import StatsLegend from "../components/stats/StatsLegend";
import MonthlyExpenseCalendar from "../components/stats/MonthlyExpenseCalendar";
import {
  buildTripDays,
  formatDateRange,
  buildCategoryStatsBySelectedDate,
  buildMonthlyExpenseCalendarFromApi,
  normalizeBudgetSummaryFromApi,
  getSpentAmountBySelectedDate,
} from "../components/stats/statsUtils";

/*
====================================================
기존 프론트 로컬 계산 방식 import / 코드 (백엔드 통계 API 연동 시 미사용)
필요하면 나중에 다시 살릴 수 있도록 주석 처리
====================================================

// import {
//   buildTripDays,
//   buildCategoryStats,
//   calculateBudgetSummary,
//   formatDateRange,
//   buildMonthlyExpenseCalendar,
//   getNormalizedExpenses,
// } from "../components/stats/statsUtils";

// import { all } from "axios";

====================================================
*/

export default function StatsScreen({ onNavigate, trip }) {
  const [selectedDate, setSelectedDate] = useState(null);

  /*
  ====================================================
  추가) 백엔드 연동용 state
  ====================================================
  */
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateClick = (dateKey) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  };

  if (!trip) {
    return (
      <div className="screen stats-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>⌂</span>
          <span className="detail-title">여행 통계</span>
          <span className="menu-icon">☰</span>
        </div>
        <p style={{ padding: 24, textAlign: "center", color: "#888" }}>
          여행을 먼저 선택해주세요.
        </p>
      </div>
    );
  }

  const tripDays = buildTripDays(trip.startDate, trip.endDate);

  /*
  ====================================================
  기존 프론트 로컬 계산 방식 (백엔드 연동 시 미사용)
  ====================================================

  const allExpenses = useMemo(() => getNormalizedExpenses(trip), [trip]);

  const selectedExpenses = selectedDate
    ? allExpenses.filter((item) => item.expenseDate === selectedDate)
    : allExpenses;

  const stats = buildCategoryStats(selectedExpenses);

  const { totalBudget, spentAmount, remainingBudget } = calculateBudgetSummary(
    trip.totalBudget || trip.budget,
    selectedExpenses
  );

  const calendarData = buildMonthlyExpenseCalendar(
    trip.startDate,
    trip.endDate,
    allExpenses
  );
  */

  /*
  ====================================================
  추가) 통계 API 호출
  ====================================================
  */
  useEffect(() => {
    const fetchStatisticsData = async () => {
      if (!trip?.id) return;

      setLoading(true);
      setError("");

      try {
        const [budgetRes, statisticsRes] = await Promise.all([
          axiosInstance.get(`/trips/${trip.id}/budget-summary`),
          axiosInstance.get(`/trips/${trip.id}/statistics`),
        ]);

        setBudgetSummary(budgetRes.data?.data || null);
        setStatistics(statisticsRes.data?.data || null);
      } catch (err) {
        console.error("통계 API 조회 실패:", err);
        setError("통계 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatisticsData();
  }, [trip?.id]);

  /*
  ====================================================
  추가) API 응답 -> 화면용 데이터 변환
  ====================================================
  */
  const normalizedBudget = useMemo(
    () => normalizeBudgetSummaryFromApi(budgetSummary),
    [budgetSummary]
  );

  const spentAmount = useMemo(() => {
    return getSpentAmountBySelectedDate(statistics, selectedDate);
  }, [statistics, selectedDate]);

  const stats = useMemo(() => {
    return buildCategoryStatsBySelectedDate(statistics, selectedDate);
  }, [statistics, selectedDate]);

  const calendarData = useMemo(() => {
    return buildMonthlyExpenseCalendarFromApi(
      trip.startDate,
      trip.endDate,
      statistics?.dailyExpenses || []
    );
  }, [trip.startDate, trip.endDate, statistics]);

  return (
    <div className="screen stats-screen">
      <div className="detail-header">
        <span className="home-icon" onClick={() => onNavigate("home")}>⌂</span>

        <div
          className="detail-title-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flex: 1,
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {trip.flag && trip.flag.startsWith("http") ? (
            <img
              src={trip.flag}
              alt=""
              style={{
                width: "22px",
                height: "15px",
                objectFit: "cover",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
          ) : (
            <span>{trip.flag || "🌍"}</span>
          )}

          <span
            className="detail-title"
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {trip.name} 통계
          </span>
        </div>

        <span className="menu-icon">☰</span>
      </div>

      <div className="stats-content">
        <TripDayTabs
          days={tripDays}
          selectedDate={selectedDate}
          onSelectDate={handleDateClick}
        />

      <div
        style={{
          padding: "0 20px 8px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <button
          onClick={() => setSelectedDate(null)}
          style={{
            border: "1px solid #d1d5db",
            background: selectedDate === null ? "#22c55e" : "#ffffff",
            color: selectedDate === null ? "#ffffff" : "#000000",
            cursor: "pointer",
            borderRadius: "9999px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "700",
            boxShadow: selectedDate === null ? "0 4px 10px rgba(34, 197, 94, 0.18)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          전체 통계
        </button>
      </div>

        {loading && (
          <p style={{ padding: "0 20px 12px", color: "#888", textAlign: "center" }}>
            통계 불러오는 중...
          </p>
        )}

        {error && (
          <p style={{ padding: "0 20px 12px", color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}

        <BudgetSummary
          totalBudget={normalizedBudget.totalBudget}
          spentAmount={spentAmount}
          remainingBudget={normalizedBudget.remainingBudget}
        />

        <div className="stats-date-range-box">
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>

        <CategoryDonutChart stats={stats} totalSpent={spentAmount} />
        <StatsLegend stats={stats} />
        <MonthlyExpenseCalendar calendarData={calendarData} />
      </div>
    </div>
  );
}