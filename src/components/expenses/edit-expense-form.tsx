"use client";

import { useActionState, useEffect } from "react";

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

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  const getFieldError = (field: string) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-white p-5 shadow-lg shadow-slate-900/5"
    >
      <input type="hidden" name="expense_id" value={expense.id} />

      <p className="mb-4 text-sm font-semibold text-slate-950">Editing: {expense.title}</p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`title-${expense.id}`}
            className="block text-sm font-semibold text-slate-700"
          >
            Title
          </label>

          <input
            id={`title-${expense.id}`}
            name="title"
            defaultValue={expense.title}
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          {getFieldError("title") ? (
            <p className="mt-1 text-sm text-red-600">{getFieldError("title")}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`amount-${expense.id}`}
              className="block text-sm font-semibold text-slate-700"
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
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            {getFieldError("amount") ? (
              <p className="mt-1 text-sm text-red-600">{getFieldError("amount")}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={`currency-${expense.id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Currency
            </label>

            <select
              id={`currency-${expense.id}`}
              name="currency"
              defaultValue={expense.currency}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              {EXPENSE_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`category-${expense.id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Category
            </label>

            <select
              id={`category-${expense.id}`}
              name="category"
              defaultValue={expense.category}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`expense-date-${expense.id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Date
            </label>

            <input
              id={`expense-date-${expense.id}`}
              name="expense_date"
              type="date"
              defaultValue={expense.expense_date}
              required
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm font-semibold text-slate-700">
          <input
            name="is_taxable"
            type="checkbox"
            defaultChecked={expense.is_taxable}
            className="h-4 w-4 accent-emerald-600"
          />
          Taxable expense
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
