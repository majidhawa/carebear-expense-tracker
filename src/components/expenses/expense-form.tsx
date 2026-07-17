"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createExpense,
  type ExpenseActionState,
} from "@/app/expenses/actions";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CURRENCIES,
} from "@/lib/constants/expenses";

const initialState: ExpenseActionState = {};

export function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createExpense,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const getFieldError = (field: string) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-950">
          Add an expense
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Record a business or personal expense.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700"
        >
          Expense title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Office internet"
          maxLength={100}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
        />

        {getFieldError("title") ? (
          <p className="text-sm text-red-600">
            {getFieldError("title")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700"
          >
            Amount
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />

          {getFieldError("amount") ? (
            <p className="text-sm text-red-600">
              {getFieldError("amount")}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-slate-700"
          >
            Currency
          </label>

          <select
            id="currency"
            name="currency"
            defaultValue="KES"
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          >
            {EXPENSE_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          {getFieldError("currency") ? (
            <p className="text-sm text-red-600">
              {getFieldError("currency")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue=""
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          >
            <option value="" disabled>
              Select category
            </option>

            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {getFieldError("category") ? (
            <p className="text-sm text-red-600">
              {getFieldError("category")}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expense_date"
            className="block text-sm font-medium text-slate-700"
          >
            Expense date
          </label>

          <input
            id="expense_date"
            name="expense_date"
            type="date"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />

          {getFieldError("expense_date") ? (
            <p className="text-sm text-red-600">
              {getFieldError("expense_date")}
            </p>
          ) : null}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
        <input
          name="is_taxable"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600"
        />

        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Taxable expense
          </span>

          <span className="block text-sm text-slate-600">
            Include this expense when calculating VAT.
          </span>
        </span>
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving expense..." : "Add expense"}
      </button>
    </form>
  );
}
