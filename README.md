# CosTrip Frontend

> **여행 지출 내역 기록 서비스** — React SPA 클라이언트  
> SK쉴더스 루키즈 5기 개발4팀

## 🌏 프로젝트 소개

CosTrip Frontend는 여행별로 예산을 설정하고, 지출 내역을 기록·조회·분석할 수 있는 여행 경비 관리 서비스입니다.

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| 상태 관리 | Zustand 5 |
| HTTP 통신 | Axios 1.x + Interceptor |
| 차트 | Recharts 3 + 커스텀 SVG 도넛 차트 |
| 라우팅 | React Router DOM 7 |
| 스타일 | CSS, Tailwind CSS 4 |
| 개발 환경 | ESLint, PostCSS, Autoprefixer |

---

## ✨ 핵심 기능

### 1. 인증 (로그인 / 회원가입)
- 이메일·비밀번호로 로그인 → 서버로부터 JWT 수신
- JWT와 사용자 정보(이름, 이메일, 역할)를 `localStorage`에 저장하여 새로고침 후에도 로그인 유지
- Zustand `authStore`에서 인증 상태를 전역 관리
- 비밀번호 변경 기능 지원
- 로그아웃 시 `localStorage` 초기화 + 상태 리셋

### 2. 여행 관리
- 내 여행 목록을 카드 형태로 표시 (대표 이미지 / 기본 이미지 fallback)
- 여행 생성 시 국가 이름 실시간 검색 자동완성, 기간·제목·카테고리별 예산 설정
- 여행 수정·삭제 지원

### 3. 지출 관리
- 날짜별 탭 이동으로 여행 기간 내 지출 날짜 선택
- 카테고리(식비·교통·숙박·쇼핑·관광·기타), 금액, 메모 입력
- 날짜·카테고리 필터링 및 최신순·금액순 정렬
- 상단 예산 바: 전체 예산 / 잔여 예산 / 여행 기간 실시간 표시
- 지출 수정·삭제

### 4. 영수증 OCR
- 영수증 입력 방식 선택 팝업: **파일 업로드** 또는 **웹캠 촬영**
- 선택한 이미지를 Base64로 인코딩 후 백엔드 `/api/receipt/analyze` 전송
- 응답으로 받은 합계 금액을 해당 지출 입력 필드에 자동 주입

### 5. 지출 통계
- **도넛 차트**: SVG로 직접 구현, 카테고리별 금액·비율 표시
- **지출 달력**: 여행 기간의 월 달력에 날짜별 소비 금액 표시
- 카테고리별 범례(Legend) 컴포넌트로 색상·금액·비율 목록 제공
- Recharts 기반 추가 차트 연동 가능 구조

### 6. 여행 후기 (메모·사진)
- 날짜별 메모 작성·수정·삭제
- 이미지 다중 첨부 (서버 업로드 후 URL로 렌더링)
- 후기 작성 여부에 따라 메인 카드에 버튼 상태 표시

### 7. 관리자 페이지
- `role === 'ADMIN'` 사용자에게만 메뉴 노출
- KPI 대시보드: 총 사용자 수 / 총 여행 수 / 총 지출액
- Top 5 여행지 목록 (순위·국가명·건수)
- 카테고리별 소비 비율 파이차트
- 사용자 목록 테이블: 이름·이메일·가입일 표시, 이름/이메일 키워드 검색, 삭제

---

## 📁 파일 구조

```
frontend-dev/
├── index.html
├── vite.config.js               # Vite 설정 (포트 3000)
├── package.json
├── tailwind.config.js
└── src/
    │
    ├── main.jsx                 # React 앱 진입점
    ├── App.jsx                  # 전체 화면 렌더링 (화면 상태 기반 라우팅)
    │                            # LoginScreen / RegisterScreen / MainScreen
    │                            # ExpenseScreen / StatsScreen / JournalScreen 등 포함
    │
    ├── router/
    │   └── index.jsx            # React Router 설정 (/ → Home)
    │
    ├── store/
    │   └── authStore.js         # Zustand 인증 스토어
    │                            # 상태: token, email, name, role
    │                            # 액션: login(), logout(), register()
    │                            # localStorage 연동으로 새로고침 후 유지
    │
    ├── api/                     # API 통신 모듈
    │   ├── axios.js             # 기본 Axios 인스턴스 (baseURL, JWT 인터셉터)
    │   ├── axiosInstance.js     # 고급 Axios 인스턴스
    │   │                        # 401 감지 시 자동 로그아웃 + 로그인 페이지 이동
    │   │                        # 서버 에러 메시지를 error.message로 교체
    │   ├── authApi.js           # 로그인·회원가입 API (AuthApi 클래스)
    │   ├── authStorage.js       # localStorage 키 상수 관리
    │   ├── tripApi.js           # 여행·지출·예산 API 함수 모음
    │   ├── expenseApi.js        # 지출 전용 API 함수
    │   ├── journalEntries.js    # 여행 후기·첨부파일 API
    │   └── adminApi.js          # 관리자 KPI·사용자 관리 API
    │
    ├── pages/
    │   ├── Home.jsx             # 메인 홈 페이지 (라우터 연결용)
    │   ├── StatsScreen.jsx      # 통계 화면 (도넛 차트 + 달력)
    │   └── AdminPage.jsx        # 관리자 페이지
    │
    ├── components/
    │   ├── AdminDashboard.jsx   # 관리자 KPI·통계 대시보드 컴포넌트
    │   ├── AdminTable.jsx       # 사용자 목록·검색·삭제 테이블
    │   ├── journal/
    │   │   └── TripJournalScreen.jsx  # 여행 후기 화면 (메모·이미지 관리)
    │   └── stats/
    │       ├── CategoryDonutChart.jsx  # SVG 커스텀 도넛 차트
    │       ├── MonthlyExpenseCalendar.jsx  # 날짜별 지출 달력
    │       ├── BudgetSummary.jsx       # 예산 사용 현황 요약
    │       ├── StatsLegend.jsx         # 카테고리별 색상·금액 범례
    │       ├── TripDayTabs.jsx         # 여행 날짜 탭 네비게이션
    │       └── statsUtils.js           # 통계 계산 유틸리티 함수
    │
    ├── styles/
    │   ├── admin.css            # 관리자 페이지 전용 스타일
    │   └── dashboard.css        # 대시보드 스타일
    │
    ├── app.css                  # 전역 스타일 (화면·버튼·폼 공통)
    ├── style.css                # 추가 전역 스타일
    │
    └── img/
        ├── logo.png             # CosTrip 로고
        └── user_img/
            └── admin/           # 관리자 화면용 이미지 에셋
```

---

## ▶ 실행 방법

### 사전 요구사항

| 항목 | 버전 |
|------|------|
| Node.js | 18 이상 |
| npm | 9 이상 |
| 백엔드 서버 | 실행 중이어야 함 |

### 1. 저장소 클론

```bash
git clone <repository-url>
cd frontend-dev
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정 (선택)

백엔드 서버 주소가 기본값(`http://25.2.109.64:8080/api`)과 다른 경우, `.env` 파일을 생성합니다.

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

> `.env` 파일이 없을 경우 `axiosInstance.js`에 정의된 기본 URL이 사용됩니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## ⚙ 환경 변수

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `VITE_API_BASE_URL` | `http://25.2.109.64:8080/api` | 백엔드 API 서버 주소 |

> Vite 환경변수는 반드시 `VITE_` 접두사를 붙여야 브라우저 코드에서 접근할 수 있습니다.
