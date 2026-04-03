import { useEffect, useState } from "react";
import { getStoredAccessToken } from "../../api/authStorage";
import {
  createJournalEntry,
  deleteJournalAttachment,
  deleteJournalEntry,
  listJournalEntries,
  uploadJournalAttachments,
  updateJournalEntry,
} from "../../api/journalEntries";

// yyyy-mm-dd 형식 날짜 문자열을 Date 객체로 변환합니다.
function parseLocalDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

// 여행 시작일~종료일 사이의 날짜 탭 데이터를 생성합니다.
function buildTripDays(trip) {
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const start = parseLocalDate(trip?.startDate);
  const end = parseLocalDate(trip?.endDate);

  if (!start || !end) return [];

  const days = [];
  const current = new Date(start);

  while (current <= end && days.length < 14) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");

    days.push({
      label: labels[current.getDay()],
      date: current.getDate(),
      fullDate: `${current.getMonth() + 1}월${current.getDate()}일`,
      isoDate: `${year}-${month}-${day}`,
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

// createdAt / updatedAt 값을 화면용 시간 텍스트로 바꿉니다.
function formatKoreanTime(dateLike) {
  if (!dateLike) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateLike));
}

// 백엔드 응답에서 id / entryId를 공통으로 처리하기 위한 헬퍼입니다.
function getEntryId(entry) {
  return entry?.entryId ?? entry?.id ?? null;
}

function buildDateText(recordDate) {
  const parsed = parseLocalDate(recordDate);
  if (!parsed) return recordDate ?? "";

  return `${parsed.getMonth() + 1}월${parsed.getDate()}일`;
}

function getBackendOrigin() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://25.2.109.64:8080/api";
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

function resolveAttachmentUrl(filePath) {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;

  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${getBackendOrigin()}${normalizedPath}`;
}

function normalizeImageItem(image, fallbackId) {
  if (!image) return null;

  if (typeof image === "string") {
    return {
      id: fallbackId,
      preview: image,
      attachmentId: null,
      filePath: null,
      file: null,
    };
  }

  return {
    ...image,
    id: image.id ?? image.attachmentId ?? fallbackId,
    preview: image.preview ?? resolveAttachmentUrl(image.filePath),
    attachmentId: image.attachmentId ?? null,
    filePath: image.filePath ?? null,
    file: image.file ?? null,
  };
}

function buildUploadedImageItems(attachments, prefix) {
  return (attachments ?? [])
    .map((attachment, index) =>
      normalizeImageItem(
        {
          ...attachment,
          preview: resolveAttachmentUrl(attachment.filePath),
        },
        `${prefix}-${index}`
      )
    )
    .filter(Boolean);
}

function extractEntryImages(entry) {
  const attachments =
    entry?.attachments ??
    entry?.attachmentList ??
    entry?.journalAttachments ??
    entry?.images ??
    [];

  if (Array.isArray(attachments) && attachments.length > 0) {
    return buildUploadedImageItems(attachments, `${getEntryId(entry)}-attachment`);
  }

  return (entry?.imagePreviews ?? [])
    .map((image, index) => normalizeImageItem(image, `${getEntryId(entry)}-image-${index}`))
    .filter(Boolean);
}

async function uploadImagesSafely(entryId, files) {
  if (!files.length) return [];

  try {
    const uploadedAttachments = await uploadJournalAttachments(entryId, files);
    return buildUploadedImageItems(uploadedAttachments, `${entryId}-uploaded`);
  } catch (error) {
    console.error("Failed to upload journal attachments:", error);
    return [];
  }
}

function hydrateEntry(entry, dayIndex) {
  if (!entry) return null;

  const entryId = getEntryId(entry);

  return {
    ...entry,
    id: entryId,
    dayIndex,
    dateText: buildDateText(entry.recordDate),
    imagePreviews: extractEntryImages(entry),
    createdTimeText: formatKoreanTime(entry.createdAt ?? entry.updatedAt),
  };
}

export default function TripJournalScreen({
  onNavigate,
  trip,
  onUpdateTrip,
  renderButton,
}) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [memo, setMemo] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [entriesByDay, setEntriesByDay] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tripDays = buildTripDays(trip);
  const selectedDayInfo = tripDays[selectedDay] ?? tripDays[0];
  const tripId = trip?.tripId ?? trip?.id ?? null;
  const selectedRecordDate = selectedDayInfo?.isoDate ?? null;
  const reviewEntries = selectedRecordDate ? entriesByDay[selectedRecordDate] ?? [] : [];
  const isCompactDayTabs = tripDays.length > 4;
  const selectedEntries = reviewEntries
    .filter((entry) => entry.dayIndex === selectedDay)
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? b.updatedAt ?? 0).getTime() -
        new Date(a.createdAt ?? a.updatedAt ?? 0).getTime()
    );
  const selectedEntry =
    selectedEntries.find((entry) => entry.id === selectedEntryId) ?? null;

  // 작성/수정 화면을 닫을 때 입력 상태를 초기화합니다.
  const resetEditor = () => {
    setMemo("");
    setReviewImages([]);
    setIsWriting(false);
    setEditingEntryId(null);
  };

  // 여행이 바뀌면 현재 선택 상태와 날짜별 메모 캐시를 함께 초기화합니다.
  useEffect(() => {
    setSelectedDay(0);
    setSelectedEntryId(null);
    setDeleteEntryId(null);
    resetEditor();
    setEntriesByDay({});
  }, [tripId]);

  // 선택한 여행/날짜의 메모 목록을 서버에서 조회합니다.
  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      if (!tripId || !selectedRecordDate || !getStoredAccessToken()) {
        return;
      }

      try {
        const loadedEntries = await listJournalEntries(tripId, selectedRecordDate);
        if (!isMounted) return;

        const hydratedEntries = loadedEntries
          .map((entry) => hydrateEntry(entry, selectedDay))
          .filter(Boolean);

        setEntriesByDay((prev) => ({
          ...prev,
          [selectedRecordDate]: hydratedEntries,
        }));
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load journal entries:", error);
      }
    }

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, [tripId, selectedRecordDate, selectedDay]);

  if (!trip) {
    return (
      <div className="screen trip-journal-screen">
        <div className="journal-shell">
          <div className="journal-header">
            <span className="filter-icon" onClick={() => onNavigate("home")}>
              ⌂
            </span>
            <span className="journal-title">여행을 먼저 선택해주세요</span>
            <span
              className="hamburger"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeaderMenu((prev) => !prev);
              }}
            >
              ☰
            </span>

            {showHeaderMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: 45,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  zIndex: 100,
                  minWidth: "150px",
                  overflow: "hidden"
                }}
              >
                {/* ↩ 로그아웃 */}
                <div
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#374151"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  onClick={() => {
                    if (window.confirm("로그아웃 하시겠습니까?")) {
                      setShowHeaderMenu(false);
                      logout();
                      onNavigate("login");
                    }
                  }}
                >
                  ↩ 로그아웃
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        );
      }

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setReviewImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        preview: URL.createObjectURL(file),
        file,
        attachmentId: null,
        filePath: null,
      })),
    ]);
  };

  // 기록하기 버튼 클릭 시
  // 1) 작성 모드 진입 또는
  // 2) 생성/수정 API 호출을 수행합니다.
  const handleSaveReview = async () => {
    if (!isWriting) {
      setSelectedEntryId(null);
      setEditingEntryId(null);
      setIsWriting(true);
      return;
    }

    if (!tripId || !selectedRecordDate || !selectedDayInfo || isSubmitting) return;

    const existingImages = reviewImages.filter((image) => !image.file);
    const newFiles = reviewImages
      .map((image) => image.file)
      .filter(Boolean);
    const payload = {
      recordDate: selectedRecordDate,
      memo: memo.trim().slice(0, 1000),
    };

    try {
      setIsSubmitting(true);

      // 기존 메모 수정
      if (editingEntryId !== null) {
        const savedEntry = await updateJournalEntry(editingEntryId, payload);
        const uploadedImages = await uploadImagesSafely(editingEntryId, newFiles);
        const nextEntry = {
          ...hydrateEntry(savedEntry, selectedDay),
          dateText: selectedDayInfo.fullDate,
          imagePreviews: [...existingImages, ...uploadedImages],
          updatedAt: savedEntry.updatedAt ?? new Date().toISOString(),
        };

        setEntriesByDay((prev) => ({
          ...prev,
          [selectedRecordDate]: (prev[selectedRecordDate] ?? []).map((entry) =>
            entry.id === editingEntryId ? nextEntry : entry
          ),
        }));

        resetEditor();
        setSelectedEntryId(editingEntryId);
        return;
      }

      // 새 메모 생성
      const savedEntry = await createJournalEntry(tripId, payload);
      const createdEntryId = getEntryId(savedEntry);
      const uploadedImages = await uploadImagesSafely(createdEntryId, newFiles);
      const nextEntry = {
        ...hydrateEntry(savedEntry, selectedDay),
        dateText: selectedDayInfo.fullDate,
        imagePreviews: [...existingImages, ...uploadedImages],
      };

      setEntriesByDay((prev) => ({
        ...prev,
        [selectedRecordDate]: [nextEntry, ...(prev[selectedRecordDate] ?? [])],
      }));

      if (onUpdateTrip) {
        onUpdateTrip({
          ...trip,
          journalEntries: [nextEntry, ...(trip.journalEntries ?? [])],
          coverImage: trip.coverImage || nextEntry.imagePreviews?.[0]?.preview || "",
        });
      }

      resetEditor();
      setSelectedEntryId(null);
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 API는 아직 없어 현재 화면 상태에서만 이미지 목록을 갱신합니다.
  const handleDeleteDetailImage = async (imageIndex) => {
    if (!selectedEntry || !selectedRecordDate) return;

    const targetImage = (selectedEntry.imagePreviews ?? [])[imageIndex];
    const nextImagePreviews = (selectedEntry.imagePreviews ?? []).filter(
      (_, index) => index !== imageIndex
    );

    try {
      if (targetImage?.attachmentId) {
        await deleteJournalAttachment(targetImage.attachmentId);
      }

      setEntriesByDay((prev) => ({
        ...prev,
        [selectedRecordDate]: (prev[selectedRecordDate] ?? []).map((entry) =>
          entry.id === selectedEntry.id
            ? { ...entry, imagePreviews: nextImagePreviews }
            : entry
        ),
      }));
    } catch (error) {
      console.error("Failed to delete journal attachment:", error);
    }
  };

  // 상세 화면에서 수정 버튼을 누르면 선택한 메모를 편집 상태로 전환합니다.
  const handleStartEditEntry = () => {
    if (!selectedEntry) return;

    setMemo(selectedEntry.memo ?? "");
    setReviewImages(
      (selectedEntry.imagePreviews ?? [])
        .map((imagePreview, index) =>
          normalizeImageItem(imagePreview, `${selectedEntry.id}-${index}`)
        )
        .filter(Boolean)
    );
    setEditingEntryId(selectedEntry.id);
    setSelectedEntryId(null);
    setIsWriting(true);
  };

  // 삭제 확인 모달을 띄우기 위해 대상 메모 id를 저장합니다.
  const handleRequestDeleteEntry = (entryId) => {
    setDeleteEntryId(entryId);
  };

  // 삭제 확인 시 서버 삭제 API를 호출하고 현재 날짜 목록에서 제거합니다.
  const handleConfirmDeleteEntry = async () => {
    if (!selectedRecordDate || deleteEntryId === null) {
      setDeleteEntryId(null);
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteJournalEntry(deleteEntryId);

      setEntriesByDay((prev) => ({
        ...prev,
        [selectedRecordDate]: (prev[selectedRecordDate] ?? []).filter(
          (entry) => entry.id !== deleteEntryId
        ),
      }));

      if (selectedEntryId === deleteEntryId) {
        setSelectedEntryId(null);
      }

      if (editingEntryId === deleteEntryId) {
        resetEditor();
      }
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
    } finally {
      setDeleteEntryId(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen trip-journal-screen">
      <div className="journal-shell">
        <div className="journal-header">
          <span className="filter-icon" onClick={() => onNavigate("home")}>
            ⌂
          </span>
          <span className="journal-title">{trip.name}(후기)</span>
          <span className="hamburger">☰</span>
        </div>
        <div className={`journal-days${isCompactDayTabs ? " compact" : ""}`}>
          {tripDays.map((day, index) => (
            <button
              key={day.isoDate ?? `${day.label}-${day.date}`}
              className={`journal-day-btn${selectedDay === index ? " active" : ""}`}
              onClick={() => {
                setSelectedDay(index);
                setSelectedEntryId(null);
                resetEditor();
              }}
            >
              <span className="journal-day-label">{day.label}</span>
              <span className="journal-day-date">{day.date}</span>
            </button>
          ))}
        </div>
      </div>

      {isWriting ? (
        <div className="journal-content">
          <div className="journal-field">
            <label className="journal-label">이미지</label>
            <label className="journal-image-box">
              <input
                className="journal-image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleReviewImageChange}
              />
              {reviewImages.length > 0 ? (
                <div className="journal-image-preview-wrap">
                  <div className="journal-image-preview-list">
                    {reviewImages.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.preview}
                        alt={`후기 이미지 미리보기 ${index + 1}`}
                        className="journal-image-preview"
                      />
                    ))}
                  </div>
                  <span className="journal-image-change">+ 이미지 추가</span>
                </div>
              ) : (
                <div className="journal-image-placeholder">
                  <span className="journal-image-plus">+</span>
                  <span>이미지 추가</span>
                </div>
              )}
            </label>
          </div>

          <div className="journal-field">
            <label className="journal-label">메모</label>
            <textarea
              className="journal-textarea journal-textarea-small"
              placeholder="다음에 참고할 메모를 적어보세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>
      ) : selectedEntry ? (
        <div className="journal-entry-detail">
          <div className="journal-entry-detail-date-row">
            <div className="journal-entry-detail-date">{selectedEntry.dateText}</div>
            <div className="journal-entry-time">
              {selectedEntry.createdTimeText || formatKoreanTime(selectedEntry.createdAt)}
            </div>
          </div>
          {selectedEntry.imagePreviews?.length ? (
            <div className="journal-entry-detail-images">
              {selectedEntry.imagePreviews.map((imagePreview, index) => (
                <div
                  key={imagePreview.id ?? `${selectedEntry.id}-${index}`}
                  className="journal-entry-detail-image-card"
                >
                  <button
                    type="button"
                    className="journal-entry-image-delete"
                    onClick={() => handleDeleteDetailImage(index)}
                  >
                    삭제
                  </button>
                  <img
                    src={imagePreview.preview}
                    alt={`기록 이미지 ${index + 1}`}
                    className="journal-entry-detail-image"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="journal-entry-detail-card">
            <div className="journal-entry-detail-label-row">
              <div className="journal-entry-detail-label">메모</div>
              <div className="journal-entry-detail-actions">
                <button
                  type="button"
                  className="journal-entry-edit-btn"
                  onClick={handleStartEditEntry}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="journal-entry-delete-btn"
                  onClick={() => handleRequestDeleteEntry(selectedEntry.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <p className="journal-entry-detail-memo">
              {selectedEntry.memo || "작성된 메모가 없습니다."}
            </p>
          </div>
        </div>
      ) : selectedEntries.length > 0 ? (
        <div className="journal-entry-list">
          {selectedEntries.map((entry) => (
            <div
              key={entry.id}
              className="journal-entry-card"
              onClick={() => {
                setIsWriting(false);
                setSelectedEntryId(entry.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsWriting(false);
                  setSelectedEntryId(entry.id);
                }
              }}
            >
              <div className="journal-entry-top">
                <span className="journal-entry-date">{entry.dateText}</span>
                <span className="journal-entry-tag">{entry.memo || "메모 없음"}</span>
              </div>
              <div className="journal-entry-bottom">
                <div className="journal-entry-time">
                  {entry.createdTimeText || formatKoreanTime(entry.createdAt)}
                </div>
                <button
                  type="button"
                  className="journal-entry-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestDeleteEntry(entry.id);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="journal-empty-state"></div>
      )}

      {deleteEntryId !== null ? (
        <div
          className="journal-confirm-overlay"
          onClick={() => setDeleteEntryId(null)}
        >
          <div
            className="journal-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="journal-confirm-title">삭제</div>
            <div className="journal-confirm-text">정말 삭제하시겠습니까?</div>
            <div className="journal-confirm-actions">
              <button
                type="button"
                className="journal-confirm-yes"
                onClick={handleConfirmDeleteEntry}
              >
                예
              </button>
              <button
                type="button"
                className="journal-confirm-no"
                onClick={() => setDeleteEntryId(null)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {renderButton(
        selectedEntry ? "목록으로" : isWriting ? (editingEntryId !== null ? "수정 저장" : "기록하기") : "기록하기",
        () => {
          if (selectedEntry) {
            setSelectedEntryId(null);
            return;
          }

          handleSaveReview();
        }
      )}
    </div>
  );
}
