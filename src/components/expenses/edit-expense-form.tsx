"use client";

import { useActionState } from "react";

import {
  updateExpense,
  type ExpenseActionState,
} from "@/app/expenses/actions";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CURRENCIES,
} from "@/lib/constants/expenses";
import type { Expense } from "@/types/expense";

type EditExpenseFormProps = {
  expense: Expense;
  onCancel: () => void;
};

const initialState: ExpenseActionState = {};

export function EditExpenseForm({
  expense,
  onCancel,
}: EditExpenseFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateExpense,
    initialState,
  );

  const getFieldError = (field: string) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <input type="hidden" name="expense_id" value={expense.id} />

      <div>
        <label
          htmlFor={`title-${expense.id}`}
          className="block text-sm font-medium text-slate-700"
        >
          Title
        </label>

        <input
          id={`title-${expense.id}`}
          name="title"
          defaultValue={expense.title}
          required
          maxLength={100}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
        />

        {getFieldError("title") ? (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("title")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`amount-${expense.id}`}
            className="block text-sm font-medium text-slate-700"
          >
            Amount
          </label>

          <input
            id={`amount-${expense.id}`}
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={expense.amount}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
          />

          {getFieldError("amount") ? (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("amount")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`currency-${expense.id}`}
            className="block text-sm font-medium text-slate-700"
          >
            Currency
          </label>

          <select
            id={`currency-${expense.id}`}
            name="currency"
            defaultValue={expense.currency}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
          >
            {EXPENSE_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`category-${expense.id}`}
            className="block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id={`category-${expense.id}`}
            name="category"
            defaultValue={expense.category}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`expense-date-${expense.id}`}
            className="block text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <input
            id={`expense-date-${expense.id}`}
            name="expense_date"
            type="date"
            defaultValue={expense.expense_date}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          name="is_taxable"
          type="checkbox"
          defaultChecked={expense.is_taxable}
        />
        Taxable expense
      </label>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
