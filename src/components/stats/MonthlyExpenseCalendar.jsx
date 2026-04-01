function formatCurrency(value) {
  return value ? `₩${Number(value).toLocaleString("ko-KR")}` : "";
}

export default function MonthlyExpenseCalendar({ calendarData }) {
  if (!calendarData) return null;

  const { year, month, cells } = calendarData;

  return (
    <div className="monthly-calendar-section">
      <div className="monthly-calendar-title">일자별 지출 달력</div>

      <div className="monthly-calendar-header">
        {year}년 {month}월
      </div>

      <div className="monthly-calendar-weekdays">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

      <div className="monthly-calendar-grid">
        {cells.map((cell, index) => (
          <div
            key={`${cell.dateKey || "empty"}-${index}`}
            className={`monthly-calendar-cell ${cell.isEmpty ? "empty" : ""} ${cell.inTrip ? "in-trip" : ""}`}
          >
            {!cell.isEmpty && (
              <>
                <div className="monthly-calendar-day">{cell.day}</div>
                {cell.amount > 0 && (
                  <div className="monthly-calendar-amount">
                    {formatCurrency(cell.amount)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}