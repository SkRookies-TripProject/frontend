import React from "react";
import "../styles/dashboard.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function AdminDashboard() {

  const kpi = {
    users: 1245,
    trips: 320,
    expenses: 8450000,
  };

  const topDestinations = [
    { name: "일본", count: 120 },
    { name: "미국", count: 98 },
    { name: "프랑스", count: 87 },
    { name: "태국", count: 76 },
    { name: "이탈리아", count: 65 },
  ];

  const categoryData = [
    { name: "식비", value: 40 },
    { name: "교통", value: 25 },
    { name: "숙박", value: 20 },
    { name: "기타", value: 15 },
  ];
  const RANK_COLORS = [
  "#FF6B6B", // 1위 빨강
  "#4D96FF", // 2위 파랑
  "#6BCB77", // 3위 초록
  "#FFD93D", // 4위 노랑
  "#845EC2", // 5위 보라
];

  // 🔥 다양한 색상
  const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D"];

  return (
    <div className="admin-dashboard">

      {/* KPI */}
      <div className="dashboard-kpi">
        <div className="kpi-card">
          <div className="kpi-title">총 사용자</div>
          <div className="kpi-value">{kpi.users}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">총 여행</div>
          <div className="kpi-value">{kpi.trips}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">총 지출</div>
          <div className="kpi-value">
            {kpi.expenses.toLocaleString()}원
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="dashboard-bottom">

        {/* 🔥 Top5 */}
        <div className="dashboard-box">
          <h2 className="dashboard-title">Top5 여행지</h2>

          <div className="top-list">
            {topDestinations.map((item, idx) => (
              <div key={idx} className="top-card">

                <div className="rank-badge"
                    style={{ background: RANK_COLORS[idx] }}>
                {idx + 1}
                </div>

                <div className="top-info">
                  <div className="destination-name">{item.name}</div>
                  <div className="destination-count">
                    {item.count}명 방문
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 파이차트 */}
        <div className="dashboard-box">
          <h2 className="dashboard-title">카테고리 소비 비율</h2>

          <div className="chart-wrapper">
          <PieChart width={320} height={320}>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    labelLine={false}
                    label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                    if (!cx || !cy) return null; // 🔥 안전장치

                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius * 0.6;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                        <text
                        x={x}
                        y={y}
                        fill="#fff"   // 🔥 흰색 글씨
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: "12px", fontWeight: "600" }}
                        >
                        {name} {(percent * 100).toFixed(0)}%
                        </text>
                    );
                    }}
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                    ))}
                </Pie>

                <Tooltip />
            </PieChart>
          </div>
        </div>

      </div>

    </div>
  );
}