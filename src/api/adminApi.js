import instance from "./axios";

// 관리자 KPI 조회
export const getAdminDashboard = async () => {
  const response = await instance.get("/admin/dashboard");
  return response.data;
};

//  관리자 통계 (Top5 + 카테고리 비율) 
export const getAdminStats = async () => {
  const response = await instance.get("/admin/dashboard/stats");
  return response.data;
};

/* ----------사용자 관리 ----------- */
// 전체 사용자 조회
export const getUsers = async () => {
  const response = await instance.get("/admin/users");
  return response.data;
};

// 사용자 검색 (이름 or 이메일)
export const searchUsers = async (keyword) => {
  const response = await instance.get("/admin/users/search", {
    params: { keyword },
  });
  return response.data;
};

// 사용자 삭제
export const deleteUser = async (userId) => {
  const response = await instance.delete(`/admin/users/${userId}`);
  return response.data;
};