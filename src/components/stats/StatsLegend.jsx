function formatCurrency(value) {
  return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
}

export default function StatsLegend({ stats = [] }) {
  return (
    <div className="stats-legend">
      {stats.map((item) => (
        <div key={item.label} className="legend-row">
          <span
            className="legend-dot"
            style={{ backgroundColor: item.color }}
          />
          <span className="legend-label">{item.label}</span>
          <span className="legend-amount">{formatCurrency(item.amount)}</span>
          <span className="legend-pct">{item.pct}%</span>
        </div>
      ))}
    </div>
  );
}