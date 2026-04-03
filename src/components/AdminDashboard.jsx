import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getAdminDashboard, getAdminStats } from "../api/adminApi";

export default function AdminDashboard() {

  // 🔥 KPI
  const [kpi, setKpi] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalExpenseAmount: 0,
  });

  // 🔥 통계
  const [topDestinations, setTopDestinations] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    console.log("토큰:", localStorage.getItem("auth_token"));
    fetchDashboard();
    fetchStats();
  }, []);

  // =========================
  // KPI
  // =========================
  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setKpi(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔥 통계 (핵심)
  // =========================
  const fetchStats = async () => {
    try {
      const res = await getAdminStats();

      const data = res.data;

      // 🔥 Top5 변환
      setTopDestinations(
        data.topDestinations.map((item) => ({
          name: item.country,
          count: item.count,
        }))
      );

      // 🔥 카테고리 변환 (Recharts용)
      setCategoryData(
        data.categoryRatios.map((item) => ({
          name: item.category,
          value: item.percent,
        }))
      );

    } catch (err) {
      console.error(err);
    }
  };

  const RANK_COLORS = [
    "#FF6B6B",
    "#4D96FF",
    "#6BCB77",
    "#FFD93D",
    "#845EC2",
  ];

  const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D"];

  return (
    <div className="admin-dashboard">

      {/* KPI */}
      <div className="dashboard-kpi">
        <div className="kpi-card">
          <div className="kpi-title">총 사용자</div>
          <div className="kpi-value">{kpi.totalUsers}명</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">총 여행</div>
          <div className="kpi-value">{kpi.totalTrips}개</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">총 지출</div>
          <div className="kpi-value">
            {Number(kpi.totalExpenseAmount).toLocaleString()}원
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

                <div
                  className="rank-badge"
                  style={{ background: RANK_COLORS[idx] }}
                >
                  {idx + 1}
                </div>

                <div className="top-info">
                  <div className="destination-name">{item.name}</div>
                  <div className="destination-count">
                    {item.count}건
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
                  if (!cx || !cy) return null;

                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 0.6;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
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