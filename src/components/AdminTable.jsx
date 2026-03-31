import React from "react";

const dummyUsers = [
  { id: 1234, name: "루키즈", email: "12@naver.com", date: "2026.01.01" },
  { id: 1234, name: "루키즈", email: "12@naver.com", date: "2026.01.01" },
  { id: 1234, name: "루키즈", email: "12@naver.com", date: "2026.01.01" },
  { id: 1234, name: "루키즈", email: "12@naver.com", date: "2026.01.01" },
  { id: 1234, name: "루키즈", email: "12@naver.com", date: "2026.01.01" },
];

export default function AdminTable() {
  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* 🔥 헤더 */}
      <div className="grid grid-cols-5 gap-4 text-center mb-4">
        <div className="bg-[#2FD5A6] text-white py-2 rounded">ID</div>
        <div className="bg-[#2FD5A6] text-white py-2 rounded">이름</div>
        <div className="bg-[#2FD5A6] text-white py-2 rounded">이메일</div>
        <div className="bg-[#2FD5A6] text-white py-2 rounded">가입일</div>
        <div className="bg-[#2FD5A6] text-white py-2 rounded">관리</div>
      </div>

      {/* 🔥 데이터 */}
      {dummyUsers.map((user, idx) => (
        <div
          key={idx}
          className="grid grid-cols-5 gap-4 text-center py-3 border-b text-sm"
        >
          <div>{user.id}</div>
          <div>{user.name}</div>
          <div className="underline">{user.email}</div>
          <div>{user.date}</div>
          <div>
            <button className="text-gray-600 hover:text-red-500">
              삭제
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}