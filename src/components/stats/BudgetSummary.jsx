function formatCurrency(value) {
  return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
}

export default function BudgetSummary({
  totalBudget = 0,
  spentAmount = 0,
  remainingBudget = 0,
}) {
  return (
    <div className="budget-summary">
      <div className="budget-item">
        <div className="budget-label">전체예산</div>
        <div className="budget-amount">{formatCurrency(totalBudget)}</div>
      </div>

      <div className="budget-item">
        <div className="budget-label">사용금액</div>
        <div className="budget-amount">{formatCurrency(spentAmount)}</div>
      </div>

      <div className="budget-item">
        <div className="budget-label">잔여예산</div>
        <div className="budget-amount">{formatCurrency(remainingBudget)}</div>
      </div>
    </div>
  );
}