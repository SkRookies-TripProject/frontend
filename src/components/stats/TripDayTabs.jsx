export default function TripDayTabs({ days = [] }) {
  if (days.length === 0) return null;

  return (
    <div className="day-tabs trip-day-tabs-scroll">
      {days.map((day) => (
        <div key={day.dateKey} className="day-col">
          <div className="day-label">{day.weekday}</div>
          <div className="day-num">{day.dayOfMonth}</div>
        </div>
      ))}
    </div>
  );
}