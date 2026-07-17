import { describe, expect, it } from "vitest";

import {
  calculateExpenseBreakdown,
  calculateExpenseSummary,
} from "@/lib/utils/expense-calculations";
import type { Expense } from "@/types/expense";

function createExpense(
  overrides: Partial<Expense> = {},
): Expense {
  return {
    id: "expense-1",
    user_id: "user-1",
    title: "Office internet",
    amount: 116,
    currency: "KES",
    category: "Utilities",
    expense_date: "2026-07-17",
    is_taxable: true,
    created_at: "2026-07-17T10:00:00.000Z",
    updated_at: "2026-07-17T10:00:00.000Z",
    ...overrides,
  };
}

describe("calculateExpenseBreakdown", () => {
  it("extracts VAT from a VAT-inclusive taxable expense", () => {
    const result = calculateExpenseBreakdown(116, true);

    expect(result.gross).toBe(116);
    expect(result.net).toBeCloseTo(100, 2);
    expect(result.tax).toBeCloseTo(16, 2);
  });

  it("returns zero VAT for a non-taxable expense", () => {
    const result = calculateExpenseBreakdown(116, false);

    expect(result).toEqual({
      gross: 116,
      net: 116,
      tax: 0,
    });
  });

  it("handles decimal expense amounts", () => {
    const result = calculateExpenseBreakdown(1_250.5, true);

    expect(result.gross).toBe(1_250.5);
    expect(result.net + result.tax).toBeCloseTo(
      result.gross,
      8,
    );
  });
});

describe("calculateExpenseSummary", () => {
  it("calculates gross, net, VAT, and expense count", () => {
    const expenses = [
      createExpense({
        id: "taxable-expense",
        amount: 116,
        is_taxable: true,
      }),
      createExpense({
        id: "non-taxable-expense",
        title: "Transport",
        amount: 200,
        category: "Transport",
        is_taxable: false,
      }),
    ];

    const summary = calculateExpenseSummary(expenses);

    expect(summary.gross).toBeCloseTo(316, 2);
    expect(summary.net).toBeCloseTo(300, 2);
    expect(summary.tax).toBeCloseTo(16, 2);
    expect(summary.count).toBe(2);
  });

  it("groups gross spending by category", () => {
    const expenses = [
      createExpense({
        id: "utility-1",
        amount: 100,
        category: "Utilities",
      }),
      createExpense({
        id: "utility-2",
        amount: 250,
        category: "Utilities",
      }),
      createExpense({
        id: "meal-1",
        amount: 400,
        category: "Meals",
      }),
    ];

    const summary = calculateExpenseSummary(expenses);

    expect(summary.byCategory).toEqual({
      Utilities: 350,
      Meals: 400,
    });
  });

  it("returns an empty summary when there are no expenses", () => {
    const summary = calculateExpenseSummary([]);

    expect(summary).toEqual({
      gross: 0,
      net: 0,
      tax: 0,
      count: 0,
      byCategory: {},
    });
  });
});
