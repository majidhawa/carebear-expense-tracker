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

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

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
      className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Quick entry
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              Add an expense
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Record a transaction and include it in your financial summary.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-2xl font-light text-emerald-700 shadow-sm">
            +
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center justify-between text-sm font-semibold text-slate-700"
            >
              <span>Expense title</span>
              <span className="text-xs font-normal text-slate-400">
                Required
              </span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Office internet"
              maxLength={100}
              required
              className={inputClassName}
            />

            {getFieldError("title") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("title")}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-slate-700"
              >
                Amount
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  #
                </span>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className={`${inputClassName} pl-9`}
                />
              </div>

              {getFieldError("amount") ? (
                <p className="text-sm font-medium text-red-600">
                  {getFieldError("amount")}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-slate-700"
              >
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                defaultValue="KES"
                required
                className={inputClassName}
              >
                {EXPENSE_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              {getFieldError("currency") ? (
                <p className="text-sm font-medium text-red-600">
                  {getFieldError("currency")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                defaultValue=""
                required
                className={inputClassName}
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
                <p className="text-sm font-medium text-red-600">
                  {getFieldError("category")}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="expense_date"
                className="block text-sm font-semibold text-slate-700"
              >
                Expense date
              </label>

              <input
                id="expense_date"
                name="expense_date"
                type="date"
                required
                className={inputClassName}
              />

              {getFieldError("expense_date") ? (
                <p className="text-sm font-medium text-red-600">
                  {getFieldError("expense_date")}
                </p>
              ) : null}
            </div>
          </div>

          <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/60">
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-emerald-700 shadow-sm transition group-hover:scale-105">
                %
              </span>

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Taxable expense
                </span>

                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                  Include this amount in VAT calculations.
                </span>
              </span>
            </span>

            <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
              <input
                name="is_taxable"
                type="checkbox"
                className="peer sr-only"
              />

              <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/20" />

              <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </span>
          </label>

          {state.error ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span className="mt-0.5 font-bold">!</span>
              <span>{state.error}</span>
            </div>
          ) : null}

          {state.success ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <span className="mt-0.5 font-bold">✓</span>
              <span>{state.success}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <span className="absolute inset-y-0 -left-24 w-20 skew-x-[-20deg] bg-white/15 transition-all duration-700 group-hover:left-[120%]" />

            <span className="relative">
              {isPending ? "Saving expense..." : "Add expense"}
            </span>

            <span className="relative text-base transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>

          <p className="text-center text-xs leading-5 text-slate-400">
            Expense ownership is verified securely using your active session.
          </p>
        </div>
      </div>
    </form>
  );
}
