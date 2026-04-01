import { useMemo, useState } from "react";
import BudgetSummary from "../components/stats/BudgetSummary";
import TripDayTabs from "../components/stats/TripDayTabs";
import CategoryDonutChart from "../components/stats/CategoryDonutChart";
import StatsLegend from "../components/stats/StatsLegend";
import MonthlyExpenseCalendar from "../components/stats/MonthlyExpenseCalendar";
import {
  buildTripDays,
  buildCategoryStats,
  calculateBudgetSummary,
  formatDateRange,
  buildMonthlyExpenseCalendar,
  getNormalizedExpenses,
} from "../components/stats/statsUtils";
import { all } from "axios";

export default function StatsScreen({ onNavigate, trip }) {
  const [selectedDate, setSelectedDate] = useState(null);

  if (!trip) {
    return (
      <div className="screen stats-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
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

  return (
  <div className="screen stats-screen">
    <div className="detail-header">
      <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
      <span className="detail-title">{trip.flag} {trip.name} 통계</span>
      <span className="menu-icon">☰</span>
    </div>

    <div className="stats-content">
      <TripDayTabs
        days={tripDays}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div style={{ padding: "0 20px 8px" }}>
        <button onClick={() => setSelectedDate(null)}>
          전체 통계
        </button>
      </div>

      <BudgetSummary
        totalBudget={totalBudget}
        spentAmount={spentAmount}
        remainingBudget={remainingBudget}
      />

      <div className="stats-date-range-box">
        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
      </div>

      <CategoryDonutChart stats={stats} />
      <StatsLegend stats={stats} />
      <MonthlyExpenseCalendar calendarData={calendarData} />
    </div>
  </div>
);
}