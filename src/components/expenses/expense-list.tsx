"use client";

import { useState } from "react";

import { deleteExpense } from "@/app/expenses/actions";
import { EditExpenseForm } from "@/components/expenses/edit-expense-form";
import type { Expense } from "@/types/expense";

type ExpenseListProps = {
  expenses: Expense[];
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-lg font-bold text-slate-950">
          No expenses yet
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Add your first expense using the form.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-950">
          Recent expenses
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Your latest recorded transactions.
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {expenses.map((expense) => (
          <div key={expense.id} className="px-6 py-5">
            {editingId === expense.id ? (
              <EditExpenseForm
                expense={expense}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {expense.title}
                    </h3>

                    {expense.is_taxable ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Taxable
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {expense.category} · {formatDate(expense.expense_date)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-lg font-bold text-slate-950">
                    {formatAmount(expense.amount, expense.currency)}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(expense.id)}
                      className="text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      Edit
                    </button>

                    <form action={deleteExpense}>
                      <input
                        type="hidden"
                        name="expense_id"
                        value={expense.id}
                      />

                      <button
                        type="submit"
                        className="text-sm font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
