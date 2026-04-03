import instance from "./axios";

// 여행 목록 조회
export const getTrips = async () => {
  const response = await instance.get("/trips");
  return response.data;
};

// 여행 상세 조회
export const getTrip = async (tripId) => {
  const response = await instance.get(`/trips/${tripId}`);
  return response.data;
};

// 여행 생성
export const createTrip = async (tripData) => {
  const response = await instance.post("/trips", tripData);
  return response.data;
};

// 여행 수정
export const updateTrip = async (tripId, tripData) => {
  const response = await instance.put(`/trips/${tripId}`, tripData);
  return response.data;
};

// 여행 삭제
export const deleteTrip = async (tripId) => {
  const response = await instance.delete(`/trips/${tripId}`);
  return response.data;
};

// 여행별 예산 목록 조회
export const getTripBudgets = async (tripId) => {
  const response = await instance.get(`/trips/${tripId}/budgets`);
  return response.data;
};