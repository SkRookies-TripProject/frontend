import React, {useEffect} from "react";
import AdminTable from "../components/AdminTable";
import AdminDashboard from "../components/AdminDashboard";
import "../styles/admin.css";
import logo from "../img/logo.png";
import { useAuthStore } from "../store/authStore";

export default function AdminPage({ onNavigate }) {

  const { role } = useAuthStore();

  useEffect(() => {
    if (role !== "ADMIN") {
      alert("관리자만 접근 가능합니다");
      onNavigate("login"); 
    }
  }, [role]);

  return (
    <div className="admin-page">

      {/* 🔥 상단바 */}
      <div className="admin-header">
        <img src={logo} alt="logo" className="admin-logo" />

        <h1 className="admin-title">관리자 페이지</h1>

        {/* 홈 버튼 */}
        <button
            className="home-btn"
            onClick={() => onNavigate && onNavigate("afterLogin")}
        >
            🏠 홈
        </button>
      </div>

      {/* 🔍 검색창 */}
      <div className="admin-search">
        <input
          type="text"
          placeholder="이름 또는 이메일을 입력해주세요"
        />
        <button>검색하기</button>
      </div>

      <AdminTable />
      <div className="admin-divider"></div>
      <AdminDashboard />

    </div>
  );
}