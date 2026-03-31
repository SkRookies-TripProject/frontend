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
} from "../components/stats/statsUtils";

export default function StatsScreen({ onNavigate, trip, expenses = [] }) {
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
  const stats = buildCategoryStats(expenses);
  const { totalBudget, spentAmount, remainingBudget } = calculateBudgetSummary(
    trip.budget,
    expenses
  );

  const calendarData = buildMonthlyExpenseCalendar(
    trip.startDate,
    trip.endDate,
    expenses
  );

  return (
  <div className="screen stats-screen">
    <div className="detail-header">
      <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
      <span className="detail-title">{trip.flag} {trip.name} 통계</span>
      <span className="menu-icon">☰</span>
    </div>

    <div className="stats-content">
      <TripDayTabs days={tripDays} />

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