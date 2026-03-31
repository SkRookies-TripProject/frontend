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
  const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;
  if (!trip) {
    return (
      <div className="screen stats-screen">
        <div className="detail-header">
          <span className="home-icon" onClick={() => onNavigate("home")}>🏠</span>
          <span className="detail-title">여행 통계</span>
          <span className="menu-icon"></span>
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
<div className="detail-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
          {/* 국기 이미지 처리 (URL인 경우와 이모지인 경우 대응) */}
          {trip.flag && trip.flag.startsWith('http') ? (
            <img 
              src={trip.flag} 
              alt="" 
              style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} 
            />
          ) : (
            <span>{trip.flag || "🌍"}</span>
          )}
          
          <span className="detail-title" style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {trip.name} 통계
          </span>
        </div>
        
        <span className="menu-icon" style={{ width: '24px' }}></span> {/* 좌우 균형을 위한 빈 공간 */}
      </div>

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
  );
}