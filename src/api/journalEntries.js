import axios from "./axios";

function unwrapApiData(responseData) {
  return responseData?.data ?? responseData ?? null;
}

function normalizeEntry(entry) {
  if (!entry) {
    return null;
  }

  return {
    ...entry,
    entryId: entry.entryId ?? entry.id,
  };
}

export async function listJournalEntries(tripId, recordDate) {
  const response = await axios.get(`/api/trips/${tripId}/journal-entries`, {
    params: recordDate ? { recordDate } : undefined,
  });
  const payload = unwrapApiData(response.data);
  const entries = Array.isArray(payload) ? payload : payload ? [payload] : [];

  return entries.map(normalizeEntry).filter(Boolean);
}

export async function getJournalEntry(entryId) {
  const response = await axios.get(`/api/journal-entries/${entryId}`);
  return normalizeEntry(unwrapApiData(response.data));
}

export async function createJournalEntry(tripId, body) {
  const response = await axios.post(`/api/trips/${tripId}/journal-entries`, body);
  return normalizeEntry(unwrapApiData(response.data));
}

export async function updateJournalEntry(entryId, body) {
  const response = await axios.put(`/api/journal-entries/${entryId}`, body);
  return normalizeEntry(unwrapApiData(response.data));
}

export async function deleteJournalEntry(entryId) {
  const response = await axios.delete(`/api/journal-entries/${entryId}`);
  return unwrapApiData(response.data);
}
