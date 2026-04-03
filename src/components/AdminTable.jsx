import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import { getUsers, deleteUser, searchUsers } from '../api/adminApi';

export default function AdminTable({ keyword }) {

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 데이터 가져오기
  useEffect(()=>{
    fetchUsers();
  },[keyword]);

  const fetchUsers = async () => {
    try {
      let res;

      if (!keyword || keyword.trim() === "") {
        res = await getUsers();
      } else {
        res = await searchUsers(keyword);
      }

      setUsers(res.data); 
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  //  현재 페이지 데이터
  const start = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(start, start + itemsPerPage);

  // 삭제 클릭
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 삭제 
  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      await fetchUsers(); // 다시 불러오기
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  //  총 페이지 수
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="admin-table-container">

      {/* 헤더 */}
      <div className="admin-table-header">
        <div>ID</div>
        <div>이름</div>
        <div>이메일</div>
        <div>가입일</div>
        <div>관리</div>
      </div>

      {/* 리스트 */}
      {currentUsers.map((user) => (
        <div className="admin-table-row" key={user.id}>
          <div>{user.id}</div>
          <div>{user.name}</div>
          <div className="email">{user.email}</div>
          <div>
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div
            className="delete-btn"
            onClick={() => handleDeleteClick(user)}
          >
            삭제
          </div>
        </div>
      ))}

      {/*  페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <div
            key={i}
            className={currentPage === i + 1 ? "page active" : "page"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* 🔥 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-text">
              정말 삭제하시겠습니까?
            </p>

            <div className="modal-buttons">
              <button
                className="modal-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                아니오
              </button>

              <button
                className="modal-confirm"
                onClick={handleConfirmDelete}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}