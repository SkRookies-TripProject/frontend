import React from "react";
import AdminTable from "../components/AdminTable";
import "../styles/admin.css";

export default function AdminPage() {
  return (
    <div className="relative z-50 min-h-screen w-full bg-gray-100 px-10 py-6">

      {/* 🔥 로고 + 관리자 페이지 제목 */}
      <div className="flex items-center mb-8">
        <img src="/src/img/logo.png" alt="logo" className="h-14 mr-4" />
        <h1 className="text-xl font-semibold">
          관리자 페이지 (사용자 관리)
        </h1>
      </div>

      {/* 🔍 검색창 */}
      <div className="flex justify-center mb-10">
        <div className="flex w-[500px] gap-2">
          <input
            type="text"
            placeholder="이름 또는 이메일을 입력해주세요"
            className="flex-1 border px-4 py-2 rounded"
          />
          <button className="bg-gray-400 text-white px-4 py-2 rounded">
            검색하기
          </button>
        </div>
      </div>

      {/* 📊 테이블 */}
      <AdminTable />

      {/* 📄 페이지네이션 */}
      <div className="flex justify-center mt-10 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`w-8 h-8 rounded ${
              n === 1 ? "bg-[#2FD5A6] text-white" : "bg-gray-300"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

    </div>
  );
}