function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export default function CategoryDonutChart({ stats = [] }) {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  let currentAngle = 0;

  const total = stats.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="donut-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {stats.map((item) => {
          const angle = total === 0 ? 0 : (item.amount / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          return (
            <path
              key={item.label}
              d={describeArc(center, center, radius, startAngle, endAngle)}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}

        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#374151"
        >
          총 지출
        </text>
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#111827"
        >
          ₩{total.toLocaleString("ko-KR")}
        </text>
      </svg>
    </div>
  );
}