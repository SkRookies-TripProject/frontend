const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CATEGORY_COLORS = {
  식비: "#34d399",
  교통: "#60a5fa",
  숙박: "#a78bfa",
  관광: "#fbbf24",
  쇼핑: "#f87171",
  기타: "#94a3b8",
};

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