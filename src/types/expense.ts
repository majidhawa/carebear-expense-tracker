import type {
  EXPENSE_CATEGORIES,
  EXPENSE_CURRENCIES,
} from "@/lib/constants/expenses";

export type ExpenseCurrency =
  (typeof EXPENSE_CURRENCIES)[number];

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  currency: ExpenseCurrency;
  category: ExpenseCategory;
  expense_date: string;
  is_taxable: boolean;
  created_at: string;
  updated_at: string;
};

export type ExpenseFormValues = {
  title: string;
  amount: number;
  currency: ExpenseCurrency;
  category: ExpenseCategory;
  expense_date: string;
  is_taxable: boolean;
};
