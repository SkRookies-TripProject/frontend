const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/*
====================================================
기존 프론트 로컬 계산용 코드 (백엔드 통계 API 연동 시 미사용)
필요하면 나중에 다시 살릴 수 있도록 위에 모아둠
====================================================

// export function getNormalizedExpenses(trip) {
//   if (!trip) return [];

//   if (trip.dailyExpenses && typeof trip.dailyExpenses === "object") {
//     return Object.entries(trip.dailyExpenses).flatMap(([dateKey, items]) =>
//       (items || []).map((item) => ({
//         ...item,
//         expenseDate: String(item.expenseDate || item.date || dateKey).slice(0, 10),
//       }))
//     );
//   }

//   if (Array.isArray(trip.expenses)) {
//     return trip.expenses.map((item) => ({
//       ...item,
//       expenseDate: item.expenseDate || item.date
//         ? String(item.expenseDate || item.date).slice(0, 10)
//         : null,
//     }));
//   }

//   return [];
// }

// function parseBudgetValue(budget) {
//   if (typeof budget === "number") return budget;
//   if (!budget) return 0;

//   return Number(String(budget).replace(/[^0-9]/g, "")) || 0;
// }

// export function calculateBudgetSummary(budget, expenses = []) {
//   const totalBudget = parseBudgetValue(budget);

//   const spentAmount = expenses.reduce((sum, item) => {
//     if (item.amount < 0) return sum + Math.abs(item.amount);
//     return sum;
//   }, 0);

//   const remainingBudget = totalBudget - spentAmount;

//   return {
//     totalBudget,
//     spentAmount,
//     remainingBudget,
//   };
// }

// export function buildCategoryStats(expenses = []) {
//   const grouped = {};

//   expenses.forEach((item) => {
//     const amount = item.amount < 0 ? Math.abs(item.amount) : 0;
//     if (!amount) return;

//     if (!grouped[item.category]) {
//       grouped[item.category] = 0;
//     }
//     grouped[item.category] += amount;
//   });

//   const total = Object.values(grouped).reduce((a, b) => a + b, 0);

//   return Object.entries(grouped).map(([label, amount]) => ({
//     label,
//     amount,
//     pct: total === 0 ? 0 : Math.round((amount / total) * 100),
//     color: CATEGORY_COLORS[label] || "#cbd5e1",
//   }));
// }

// export function buildMonthlyExpenseCalendar(startDate, endDate, expenses = []) {
//   if (!startDate || !endDate) return null;

//   const start = parseLocalDate(startDate);
//   const end = parseLocalDate(endDate);

//   const year = start.getFullYear();
//   const month = start.getMonth() + 1;

//   const firstDay = new Date(year, month - 1, 1);
//   const lastDate = new Date(year, month, 0).getDate();
//   const startWeekday = firstDay.getDay();

//   const tripStartKey = formatLocalDateKey(start);
//   const tripEndKey = formatLocalDateKey(end);

//   const amountMap = new Map();

//   expenses.forEach((expense) => {
//     if (!expense.expenseDate) return;

//     const key = String(expense.expenseDate).slice(0, 10);
//     const current = amountMap.get(key) || 0;
//     amountMap.set(key, current + Math.abs(Number(expense.amount || 0)));
//   });

//   const cells = [];

//   for (let i = 0; i < startWeekday; i++) {
//     cells.push({
//       isEmpty: true,
//     });
//   }

//   for (let day = 1; day <= lastDate; day++) {
//     const dateObj = new Date(year, month - 1, day);
//     const dateKey = formatLocalDateKey(dateObj);

//     const inTrip = dateKey >= tripStartKey && dateKey <= tripEndKey;

//     cells.push({
//       isEmpty: false,
//       year,
//       month,
//       day,
//       dateKey,
//       inTrip,
//       amount: inTrip ? (amountMap.get(dateKey) || 0) : 0,
//     });
//   }

//   return {
//     year,
//     month,
//     cells,
//   };
// }

====================================================
*/

export const CATEGORY_LABELS = {
  FOOD: "식비",
  TRANSPORT: "교통",
  ACCOMMODATION: "숙박",
  TOURISM: "관광",
  SHOPPING: "쇼핑",
  ETC: "기타",
};

export const CATEGORY_COLORS = {
  FOOD: "#34d399",
  TRANSPORT: "#60a5fa",
  ACCOMMODATION: "#a78bfa",
  TOURISM: "#fbbf24",
  SHOPPING: "#f87171",
  ETC: "#94a3b8",
};

function parseLocalDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = String(dateString)
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatLocalDateKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildTripDays(startDate, endDate) {
  if (!startDate || !endDate) return [];

  const result = [];
  const current = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  while (current <= end) {
    result.push({
      dateKey: formatLocalDateKey(current),
      weekday: WEEKDAYS[current.getDay()],
      dayOfMonth: current.getDate(),
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "";

  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  return `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

/*
====================================================
추가 1) statistics 응답 -> 차트 / 범례용 stats 배열 변환
====================================================
*/
export function buildCategoryStatsFromApi(statisticsData) {
  const amounts = statisticsData?.categoryAmounts || {};
  const rates = statisticsData?.categoryRates || {};

  return Object.entries(amounts).map(([category, amount]) => ({
    label: CATEGORY_LABELS[category] || category,
    amount: Number(amount || 0),
    pct: Number(rates[category] || 0),
    color: CATEGORY_COLORS[category] || "#cbd5e1",
  }));
}

/*
====================================================
추가 2) statistics.dailyExpenses -> 달력용 calendarData 변환
====================================================
*/
export function buildMonthlyExpenseCalendarFromApi(
  startDate,
  endDate,
  dailyExpenses = []
) {
  if (!startDate || !endDate) return null;

  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  const year = start.getFullYear();
  const month = start.getMonth() + 1;

  const firstDay = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();

  const tripStartKey = formatLocalDateKey(start);
  const tripEndKey = formatLocalDateKey(end);

  const amountMap = new Map();
  dailyExpenses.forEach((item) => {
    amountMap.set(String(item.date).slice(0, 10), Number(item.amount || 0));
  });

  const cells = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ isEmpty: true });
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dateKey = formatLocalDateKey(dateObj);
    const inTrip = dateKey >= tripStartKey && dateKey <= tripEndKey;

    cells.push({
      isEmpty: false,
      year,
      month,
      day,
      dateKey,
      inTrip,
      amount: inTrip ? (amountMap.get(dateKey) || 0) : 0,
    });
  }

  return { year, month, cells };
}

/*
====================================================
추가 3) budget-summary 응답 -> BudgetSummary props용 정리
실제로는 거의 그대로 쓰지만, 안전하게 숫자화해서 반환
====================================================
*/
export function normalizeBudgetSummaryFromApi(budgetSummaryData) {
  return {
    totalBudget: Number(budgetSummaryData?.totalBudget || 0),
    spentAmount: Number(budgetSummaryData?.totalSpent || 0),
    remainingBudget: Number(budgetSummaryData?.remainingBudget || 0),
    usageRate: Number(budgetSummaryData?.usageRate || 0),
  };
}