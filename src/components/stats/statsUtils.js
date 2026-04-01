const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CATEGORY_COLORS = {
  식비: "#34d399",
  교통: "#60a5fa",
  숙박: "#a78bfa",
  관광: "#fbbf24",
  쇼핑: "#f87171",
  기타: "#94a3b8",
};

export function getNormalizedExpenses(trip) {
  if (!trip) return [];

  // 1. dailyExpenses 구조가 있으면 우선 사용
  if (trip.dailyExpenses && typeof trip.dailyExpenses === "object") {
    return Object.entries(trip.dailyExpenses).flatMap(([dateKey, items]) =>
      (items || []).map((item) => ({
        ...item,
        expenseDate: item.expenseDate || item.date || dateKey,
      }))
    );
  }

  // 2. 기존 expenses 구조 사용
  if (Array.isArray(trip.expenses)) {
    return trip.expenses.map((item) => ({
      ...item,
      expenseDate: item.expenseDate || item.date || null,
    }));
  }

  return [];
}

function parseBudgetValue(budget) {
  if (typeof budget === "number") return budget;
  if (!budget) return 0;

  return Number(String(budget).replace(/[^0-9]/g, "")) || 0;
}

export function calculateBudgetSummary(budget, expenses = []) {
  const totalBudget = parseBudgetValue(budget);

  const spentAmount = expenses.reduce((sum, item) => {
    if (item.amount < 0) return sum + Math.abs(item.amount);
    return sum;
  }, 0);

  const remainingBudget = totalBudget - spentAmount;

  return {
    totalBudget,
    spentAmount,
    remainingBudget,
  };
}

export function buildTripDays(startDate, endDate) {
  if (!startDate || !endDate) return [];

  const result = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    result.push({
      dateKey: current.toISOString().split("T")[0],
      weekday: WEEKDAYS[current.getDay()],
      dayOfMonth: current.getDate(),
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

export function buildCategoryStats(expenses = []) {
  const grouped = {};

  expenses.forEach((item) => {
    const amount = item.amount < 0 ? Math.abs(item.amount) : 0;
    if (!amount) return;

    if (!grouped[item.category]) {
      grouped[item.category] = 0;
    }
    grouped[item.category] += amount;
  });

  const total = Object.values(grouped).reduce((a, b) => a + b, 0);

  return Object.entries(grouped).map(([label, amount]) => ({
    label,
    amount,
    pct: total === 0 ? 0 : Math.round((amount / total) * 100),
    color: CATEGORY_COLORS[label] || "#cbd5e1",
  }));
}
export function buildMonthlyExpenseCalendar(startDate, endDate, expenses = []) {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const year = start.getFullYear();
  const month = start.getMonth() + 1;

  const firstDay = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();

  const amountMap = new Map();

  expenses.forEach((expense) => {
    if (!expense.expenseDate) return;
    const key = expense.expenseDate;
    const current = amountMap.get(key) || 0;
    amountMap.set(key, current + Math.abs(Number(expense.amount || 0)));
  });

  const cells = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({
      isEmpty: true,
    });
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateObj = new Date(year, month - 1, day);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateKey = `${yyyy}-${mm}-${dd}`;

    const inTrip = dateObj >= start && dateObj <= end;

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

  return {
    year,
    month,
    cells,
  };
}