import instance from "./axios";

//  지출 목록 조회 (필터 + 정렬)
export const getExpenses = async (tripId, params = {}) => {
  const response = await instance.get(`/trips/${tripId}/expenses`, {
    params: {
      category: params.category, // ex) FOOD
      date: params.date,         // ex) 2026-04-02
      sort: params.sort || "dateDesc", // 기본값
    },
  });

  return response.data;
};

//  지출 생성
export const createExpense = async (tripId, expenseData) => {
  const response = await instance.post(
    `/trips/${tripId}/expenses`,
    expenseData
  );
  return response.data;
};

//  총 지출 금액 조회
export const getTotalExpense = async (tripId) => {
  const response = await instance.get(`/trips/${tripId}/expenses/total`);
  return response.data;
};

//  지출 수정
export const updateExpense = async (expenseId, expenseData) => {
  const response = await instance.put(
    `/expenses/${expenseId}`,
    expenseData
  );
  return response.data;
};

//  지출 삭제
export const deleteExpense = async (expenseId) => {
  const response = await instance.delete(`/expenses/${expenseId}`);
  return response.data;
};

//  전체 예산 조회
export const getTotalBudget = async (tripId) => {
  const response = await instance.get(`/trips/${tripId}/budget`);
  return response.data;
};