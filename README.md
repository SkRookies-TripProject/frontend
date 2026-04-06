# CostTrip Frontend

여행 일정, 예산, 지출, 메모/후기, 통계 기능을 제공하는 여행 기록 서비스의 프론트엔드 프로젝트입니다.  
Vite + React 기반의 SPA로 구성되어 있으며, 백엔드 API와 연동하여 여행 데이터와 사용자 인증 정보를 처리합니다.

## 1. 프로젝트 개요

이 프로젝트는 사용자가 여행을 생성하고, 날짜별 지출과 메모를 기록하며, 통계 화면을 통해 소비 패턴을 확인할 수 있도록 구성된 프론트엔드 애플리케이션입니다.

주요 목적은 다음과 같습니다.

- 여행 생성 및 일정 관리
- 예산과 실제 지출 기록
- 날짜별 메모/후기 작성 및 이미지 업로드
- 여행별 소비 통계 시각화
- 관리자 전용 화면 제공

## 2. 기술 스택

- React 19
- Vite 8
- Axios
- Zustand
- React Router DOM
- Recharts
- i18n-iso-countries
- Tailwind CSS 설정 포함

## 3. 주요 기능

### 3.1 인증

- 로그인 / 회원가입
- JWT 토큰 기반 인증
- `localStorage`를 활용한 로그인 유지
- 401 응답 발생 시 자동 로그아웃 처리

### 3.2 여행 관리

- 여행 목록 조회
- 여행 생성 / 수정 / 삭제
- 여행 국가, 기간, 예산 등록
- 대표 썸네일 표시

### 3.3 지출 관리

- 날짜별 지출 입력
- 카테고리별 지출 관리
- 여행 상세 화면에서 일자별 내역 확인
- 데이터가 있는 날짜에 표시 점 노출

### 3.4 메모 / 후기 기능

- 날짜별 메모 작성 / 수정 / 삭제
- 메모 이미지 업로드
- 업로드 이미지 미리보기 및 개별 삭제
- 메모 상세 조회
- 메모가 있는 날짜에 초록 점 표시
- 메모 날짜 탭 가로 스크롤 지원

### 3.5 통계

- 예산 요약
- 카테고리별 소비 비율
- 날짜 기준 통계 조회
- 월별 소비 캘린더

### 3.6 관리자 기능

- 관리자 전용 페이지 접근 제어
- 회원/데이터 관리용 대시보드 및 테이블 화면

## 4. 프로젝트 구조

```text
src/
├─ App.jsx                         # 메인 앱 컨테이너, 화면 전환과 주요 상태 관리
├─ main.jsx                        # React 엔트리 포인트
├─ app.css                         # 메인 스타일
├─ style.css
│
├─ api/                            # 백엔드 통신 계층
│  ├─ adminApi.js
│  ├─ authApi.js
│  ├─ authStorage.js
│  ├─ axios.js
│  ├─ axiosInstance.js
│  ├─ expenseApi.js
│  ├─ journalEntries.js
│  └─ tripApi.js
│
├─ components/
│  ├─ journal/
│  │  └─ TripJournalScreen.jsx     # 메모/후기 화면
│  ├─ stats/
│  │  ├─ BudgetSummary.jsx
│  │  ├─ CategoryDonutChart.jsx
│  │  ├─ MonthlyExpenseCalendar.jsx
│  │  ├─ StatsLegend.jsx
│  │  ├─ TripDayTabs.jsx
│  │  └─ statsUtils.js
│  ├─ AdminDashboard.jsx
│  └─ AdminTable.jsx
│
├─ pages/
│  ├─ AdminPage.jsx
│  ├─ Home.jsx
│  └─ StatsScreen.jsx
│
├─ store/
│  └─ authStore.js                 # 인증 상태 관리 (Zustand)
│
├─ router/
│  └─ index.jsx
│
├─ styles/
│  ├─ admin.css
│  └─ dashboard.css
│
├─ assets/
└─ img/
```

## 5. 아키텍처 요약

이 프로젝트는 다음과 같은 구조로 동작합니다.

```text
main.jsx
  → BrowserRouter
    → App.jsx
      → Screen / Page / Component 렌더링
      → API 계층 호출
      → Zustand(authStore)와 연동
```

레이어 기준으로 정리하면 아래와 같습니다.

### 5.1 UI 레이어

- `App.jsx`
- `pages/*`
- `components/*`

사용자 입력, 화면 렌더링, 버튼 이벤트 처리 등 UI 로직을 담당합니다.

### 5.2 상태 레이어

- 전역 인증 상태: `src/store/authStore.js`
- 화면별 상태: `App.jsx`, `TripJournalScreen.jsx`, `StatsScreen.jsx` 등 각 화면 컴포넌트 내부 state

### 5.3 API 레이어

- `src/api/*`

백엔드 REST API 호출을 기능 단위로 분리합니다.

예시:

- 여행 관련: `tripApi.js`
- 메모/후기 관련: `journalEntries.js`
- 인증 관련: `authApi.js`

### 5.4 네트워크 공통 처리

- `axiosInstance.js`

공통 base URL, Authorization 헤더 자동 주입, 401 자동 로그아웃 등을 처리합니다.

## 6. 실행 방법

### 6.1 설치

```bash
npm install
```

### 6.2 개발 서버 실행

```bash
npm run dev
```

### 6.3 빌드

```bash
npm run build
```

### 6.4 빌드 결과 미리보기

```bash
npm run preview
```

### 6.5 린트

```bash
npm run lint
```

## 7. 환경 변수

현재 프로젝트는 `.env`에서 API 서버 주소를 관리합니다.

```env
VITE_API_BASE_URL=http://25.2.109.64:8080
```

실제 API 호출 시 일부 파일에서는 `/api` 경로를 덧붙여 사용하므로, 백엔드 배포 환경에 맞는 값으로 관리해야 합니다.

## 8. 인증 흐름

1. 사용자가 로그인 화면에서 이메일과 비밀번호를 입력합니다.
2. `authStore.login()`이 `authApi`를 호출합니다.
3. 로그인 성공 시 토큰과 사용자 정보가 `localStorage`와 Zustand store에 저장됩니다.
4. 이후 Axios 인터셉터가 모든 요청에 `Authorization: Bearer <token>` 헤더를 자동 주입합니다.
5. 토큰 만료 등으로 401 응답이 오면 자동 로그아웃 후 로그인 화면으로 이동합니다.

## 9. 주요 화면

### 9.1 로그인 / 회원가입

- 사용자 인증 진입 화면
- JWT 토큰 발급 및 저장

### 9.2 홈

- 여행 카드 목록 표시
- 대표 썸네일 표시
- 후기 작성 화면 및 여행 상세 화면 진입

### 9.3 여행 상세

- 여행별 예산 / 지출 정보 표시
- 날짜별 지출 기록 확인
- 날짜 탭에서 데이터 존재 여부 표시

### 9.4 메모 / 후기 화면

- 날짜별 메모 작성 / 수정 / 삭제
- 이미지 첨부 및 미리보기
- 업로드 이미지 개별 삭제
- 메모가 존재하는 날짜 점 표시
- 날짜 탭 스크롤 지원

### 9.5 통계 화면

- 예산 요약
- 카테고리 도넛 차트
- 날짜별 통계 및 캘린더

### 9.6 관리자 화면

- 관리자 권한 체크
- 관리용 대시보드 / 테이블 제공

## 10. API 연동 포인트

### 여행

- `GET /trips`
- `GET /trips/{tripId}`
- `POST /trips`
- `PUT /trips/{tripId}`
- `DELETE /trips/{tripId}`

### 지출

- `POST /trips/{tripId}/expenses`
- `GET /trips/{tripId}/expenses`
- `PUT /expenses/{expenseId}`
- `DELETE /expenses/{expenseId}`

### 메모 / 후기

- `GET /trips/{tripId}/journal-entries`
- `POST /trips/{tripId}/journal-entries`
- `PUT /journal-entries/{entryId}`
- `DELETE /journal-entries/{entryId}`
- `POST /journal-entries/{entryId}/attachments`
- `DELETE /attachments/{attachmentId}`

### 통계

- `GET /trips/{tripId}/budget-summary`
- `GET /trips/{tripId}/statistics`

## 11. 개발 시 참고 사항

- 현재 프로젝트는 `App.jsx` 비중이 큰 중앙집중형 구조입니다.
- 화면 전환은 일부 `react-router-dom`보다 내부 `screen` 상태 기반으로 동작합니다.
- 메모/후기 기능은 `TripJournalScreen.jsx`로 분리되어 있지만, 여행 상태는 상위 레벨과 함께 연결됩니다.
- 대표 썸네일은 백엔드 `thumbnailPath`를 우선 사용합니다.
- 이미지 로드 실패 시 프론트 fallback 처리 로직이 일부 포함되어 있습니다.

## 12. 향후 개선 포인트

- `App.jsx` 역할 분리
- 라우팅 구조 정리
- 화면별 state 분리 및 커스텀 훅화
- API 응답 타입 정리
- README에 화면 스크린샷 및 배포 정보 추가

---

프로젝트 문서나 발표 자료용으로 더 세분화된 문서가 필요하다면, 다음 형태로도 확장 가능합니다.

- 화면 설계 문서 버전
- 기능 명세서 버전
- API 연동 문서 버전
- 아키텍처 도식 버전
