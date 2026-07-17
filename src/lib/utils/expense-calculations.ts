import { VAT_RATE } from "@/lib/constants/expenses";
import type { Expense } from "@/types/expense";

export type ExpenseBreakdown = {
  gross: number;
  net: number;
  tax: number;
};

export function calculateExpenseBreakdown(
  amount: number,
  isTaxable: boolean,
): ExpenseBreakdown {
  if (!isTaxable) {
    return {
      gross: amount,
      net: amount,
      tax: 0,
    };
  }

  const net = amount / (1 + VAT_RATE);
  const tax = amount - net;

  return {
    gross: amount,
    net,
    tax,
  };
}

export function calculateExpenseSummary(expenses: Expense[]) {
  return expenses.reduce(
    (summary, expense) => {
      const breakdown = calculateExpenseBreakdown(
        expense.amount,
        expense.is_taxable,
      );

      summary.gross += breakdown.gross;
      summary.net += breakdown.net;
      summary.tax += breakdown.tax;
      summary.count += 1;

      summary.byCategory[expense.category] =
        (summary.byCategory[expense.category] ?? 0) +
        breakdown.gross;

      return summary;
    },
    {
      gross: 0,
      net: 0,
      tax: 0,
      count: 0,
      byCategory: {} as Record<string, number>,
    },
  );
}
