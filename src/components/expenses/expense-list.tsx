"use client";

import { useMemo, useState } from "react";

import { deleteExpense } from "@/app/expenses/actions";
import { EditExpenseForm } from "@/components/expenses/edit-expense-form";
import { ExportExpensesButton } from "@/components/expenses/export-expenses-button";
import { EXPENSE_CATEGORIES } from "@/lib/constants/expenses";
import type { Expense } from "@/types/expense";

type ExpenseListProps = {
  expenses: Expense[];
};

type SortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";

const ITEMS_PER_PAGE = 6;

const categoryStyles: Record<string, string> = {
  Office: "bg-blue-50 text-blue-700",
  Travel: "bg-violet-50 text-violet-700",
  Meals: "bg-amber-50 text-amber-700",
  Utilities: "bg-cyan-50 text-cyan-700",
  Software: "bg-indigo-50 text-indigo-700",
  Transport: "bg-orange-50 text-orange-700",
  Health: "bg-rose-50 text-rose-700",
  Other: "bg-slate-100 text-slate-700",
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

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] =
    useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = expenses.filter((expense) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        expense.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        expense.category
          .toLowerCase()
          .includes(normalizedSearch) ||
        expense.currency
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "All" ||
        expense.category === category;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "highest") {
        return second.amount - first.amount;
      }

      if (sortBy === "lowest") {
        return first.amount - second.amount;
      }

      const firstDate = new Date(
        `${first.expense_date}T00:00:00`,
      ).getTime();

      const secondDate = new Date(
        `${second.expense_date}T00:00:00`,
      ).getTime();

      return sortBy === "oldest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [expenses, searchTerm, category, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredExpenses.length / ITEMS_PER_PAGE,
    ),
  );

  const safePage = Math.min(page, totalPages);

  const paginatedExpenses = filteredExpenses.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  function updateSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function updateSort(value: SortOption) {
    setSortBy(value);
    setPage(1);
  }

  if (expenses.length === 0) {
    return (
      <section className="rounded-[30px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-2xl text-emerald-700">
          +
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-950">
          No expenses yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
          Add your first expense to begin tracking
          spending, VAT, and category totals.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-visible rounded-[30px] border border-white/80 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className="border-b border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Transactions
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              Recent expenses
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Search, filter, and manage your recorded transactions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[620px]">
            <label className="relative sm:col-span-1">
              <span className="sr-only">
                Search expenses
              </span>

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  updateSearch(event.target.value)
                }
                placeholder="Search..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            <label>
              <span className="sr-only">
                Filter by category
              </span>

              <select
                value={category}
                onChange={(event) =>
                  updateCategory(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="All">
                  All categories
                </option>

                {EXPENSE_CATEGORIES.map(
                  (expenseCategory) => (
                    <option
                      key={expenseCategory}
                      value={expenseCategory}
                    >
                      {expenseCategory}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="sr-only">
                Sort expenses
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  updateSort(
                    event.target.value as SortOption,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="newest">
                  Newest first
                </option>
                <option value="oldest">
                  Oldest first
                </option>
                <option value="highest">
                  Highest amount
                </option>
                <option value="lowest">
                  Lowest amount
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>
            {filteredExpenses.length} result
            {filteredExpenses.length === 1 ? "" : "s"}
          </span>

          <div className="flex items-center gap-3">
            <ExportExpensesButton expenses={filteredExpenses} />

            {(searchTerm || category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCategory("All");
                  setSortBy("newest");
                  setPage(1);
                }}
                className="font-semibold text-emerald-700 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {paginatedExpenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-xl">
            ⌕
          </div>

          <h3 className="mt-4 font-bold text-slate-950">
            No matching expenses
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Try changing your search term or category filter.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {paginatedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 sm:p-6"
            >
              {editingId === expense.id ? (
                <EditExpenseForm
                  expense={expense}
                  onCancel={() =>
                    setEditingId(null)
                  }
                />
              ) : (
                <article className="group flex flex-col gap-5 rounded-[24px] border border-transparent p-2 transition duration-300 hover:border-slate-200 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                        categoryStyles[
                          expense.category
                        ] ??
                        categoryStyles.Other
                      }`}
                    >
                      {getInitials(expense.title)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold text-slate-950">
                          {expense.title}
                        </h3>

                        {expense.is_taxable ? (
                          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Taxable
                          </span>
                        ) : (
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            Non-taxable
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="font-medium">
                          {expense.category}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span>
                          {formatDate(
                            expense.expense_date,
                          )}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span>{expense.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold tracking-tight text-slate-950">
                        {formatAmount(
                          expense.amount,
                          expense.currency,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Original transaction
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 transition duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(expense.id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                        aria-label={`Edit ${expense.title}`}
                      >
                        ✎
                      </button>

                      <form action={deleteExpense}>
                        <input
                          type="hidden"
                          name="expense_id"
                          value={expense.id}
                        />

                        <button
                          type="submit"
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50"
                          aria-label={`Delete ${expense.title}`}
                        >
                          ×
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-500">
            Page {safePage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1,
                  ),
                )
              }
              className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
