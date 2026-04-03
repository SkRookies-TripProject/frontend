import axios from "./axios";

// 백엔드 공통 응답 형식({ success, message, data })에서 실제 데이터만 꺼냅니다.
function unwrapApiData(responseData) {
  return responseData?.data ?? responseData ?? null;
}

// entryId/id 혼용에 대비해 화면에서 항상 entryId로 접근할 수 있게 맞춥니다.
function normalizeEntry(entry) {
  if (!entry) {
    return null;
  }

  return {
    ...entry,
    entryId: entry.entryId ?? entry.id,
  };
}

function normalizeAttachment(attachment) {
  if (!attachment) {
    return null;
  }

  return {
    ...attachment,
    attachmentId: attachment.attachmentId ?? attachment.id,
  };
}

// 여행 기준 메모 목록 조회
// recordDate가 있으면 날짜별 조회, 없으면 전체 조회로 동작합니다.
export async function listJournalEntries(tripId, recordDate) {
  const response = await axios.get(`/trips/${tripId}/journal-entries`, {
    params: recordDate ? { recordDate } : undefined,
  });
  const payload = unwrapApiData(response.data);
  const entries = Array.isArray(payload) ? payload : payload ? [payload] : [];

  return entries.map(normalizeEntry).filter(Boolean);
}

// 메모 상세 조회
export async function getJournalEntry(entryId) {
  const response = await axios.get(`/journal-entries/${entryId}`);
  return normalizeEntry(unwrapApiData(response.data));
}

// 메모 생성
// body 예시: { recordDate: "2026-04-04", memo: "첫째 날 메모" }
export async function createJournalEntry(tripId, body) {
  const response = await axios.post(`/trips/${tripId}/journal-entries`, body);
  return normalizeEntry(unwrapApiData(response.data));
}

export async function uploadJournalAttachments(entryId, files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post(`/journal-entries/${entryId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const payload = unwrapApiData(response.data);
  const attachments = Array.isArray(payload) ? payload : payload ? [payload] : [];

  return attachments.map(normalizeAttachment).filter(Boolean);
}

// 메모 수정
export async function updateJournalEntry(entryId, body) {
  const response = await axios.put(`/journal-entries/${entryId}`, body);
  return normalizeEntry(unwrapApiData(response.data));
}

// 메모 삭제
export async function deleteJournalEntry(entryId) {
  const response = await axios.delete(`/journal-entries/${entryId}`);
  return unwrapApiData(response.data);
}

export async function deleteJournalAttachment(attachmentId) {
  const response = await axios.delete(`/attachments/${attachmentId}`);
  return unwrapApiData(response.data);
}
