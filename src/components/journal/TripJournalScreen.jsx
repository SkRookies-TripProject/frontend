import { useState } from "react";

function buildTripDays(trip) {
  
 
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = [];
  const current = new Date(start);

  while (current <= end && days.length < 14) {
    days.push({
      label: labels[current.getDay()],
      date: current.getDate(),
      fullDate: `${current.getMonth() + 1}월${current.getDate()}일`,
      isoDate: current.toISOString().slice(0, 10),
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function formatKoreanTime(dateLike) {
  if (!dateLike) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateLike));
}

export default function TripJournalScreen({
  onNavigate,
  trip,
  onUpdateTrip,
  renderButton,
}) {
  // 후기 작성/상세/목록 흐름에서 사용하는 로컬 화면 상태
  const [selectedDay, setSelectedDay] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [memo, setMemo] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  if (!trip) {
    return (
      <div className="screen trip-journal-screen">
        <div className="journal-shell">
          <div className="journal-header">
            <span className="filter-icon" onClick={() => onNavigate("home")}>
              ⌂
            </span>
            <span className="journal-title">여행을 먼저 선택해주세요</span>
            <span className="hamburger">☰</span>
          </div>
        </div>
      </div>
    );
  }

  const tripDays = buildTripDays(trip);
  const reviewEntries = trip.journalEntries ?? [];
  const selectedDayInfo = tripDays[selectedDay] ?? tripDays[0];
  const isCompactDayTabs = tripDays.length > 4;
  // 선택한 날짜의 기록만 따로 보여주기 위한 필터링
  const selectedEntries = reviewEntries.filter((entry) => entry.dayIndex === selectedDay);
  const selectedEntry =
    selectedEntries.find((entry) => entry.id === selectedEntryId) ?? null;

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setReviewImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleSaveReview = () => {
    if (!isWriting) {
      setSelectedEntryId(null);
      setIsWriting(true);
      return;
    }

    // 사용자가 작성한 메모와 이미지를 날짜별 후기 기록으로 저장
    const createdAt = new Date().toISOString();
    const nextEntry = {
      id: Date.now(),
      dayIndex: selectedDay,
      dateText: selectedDayInfo?.fullDate ?? "",
      memo: memo.trim(),
      imagePreviews: reviewImages.map((image) => image.preview),
      createdAt,
      createdTimeText: formatKoreanTime(createdAt),
    };

    onUpdateTrip?.({
      ...trip,
      journalEntries: [nextEntry, ...reviewEntries],
      // 첫 후기 이미지가 메인 여행 카드 대표 이미지로 보이도록 연결
      coverImage: trip.coverImage || reviewImages[0]?.preview || "",
    });

    setMemo("");
    setReviewImages([]);
    setIsWriting(false);
    setSelectedEntryId(null);
  };

  const handleDeleteDetailImage = (imageIndex) => {
    if (!selectedEntry) return;

    const nextImagePreviews = (selectedEntry.imagePreviews ?? []).filter(
      (_, index) => index !== imageIndex
    );
    const nextEntries = reviewEntries.map((entry) =>
      entry.id === selectedEntry.id
        ? { ...entry, imagePreviews: nextImagePreviews }
        : entry
    );

    onUpdateTrip?.({
      ...trip,
      journalEntries: nextEntries,
      coverImage:
        trip.coverImage === selectedEntry.imagePreviews?.[imageIndex]
          ? nextImagePreviews[0] || ""
          : trip.coverImage,
    });
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
                setIsWriting(false);
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
        // 기록 목록에서 선택한 메모의 상세 보기 화면
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
                  key={`${selectedEntry.id}-${index}`}
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
                    src={imagePreview}
                    alt={`기록 이미지 ${index + 1}`}
                    className="journal-entry-detail-image"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="journal-entry-detail-card">
            <div className="journal-entry-detail-label">메모</div>
            <p className="journal-entry-detail-memo">
              {selectedEntry.memo || "작성된 메모가 없습니다."}
            </p>
          </div>
        </div>
      ) : selectedEntries.length > 0 ? (
        // 날짜별로 저장된 후기 목록 화면
        <div className="journal-entry-list">
          {selectedEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="journal-entry-card"
              onClick={() => {
                setIsWriting(false);
                setSelectedEntryId(entry.id);
              }}
            >
              <div className="journal-entry-top">
                <span className="journal-entry-date">{entry.dateText}</span>
                <span className="journal-entry-tag">{entry.memo || "메모 없음"}</span>
              </div>
              <div className="journal-entry-time">
                {entry.createdTimeText || formatKoreanTime(entry.createdAt)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="journal-empty-state"></div>
      )}

      {renderButton(
        selectedEntry ? "목록으로" : "기록하기",
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
