import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import { convertExpensesToBaseCurrency } from "@/lib/services/exchange-rates";
import { calculateExpenseSummary } from "@/lib/utils/expense-calculations";
import type { Expense } from "@/types/expense";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (expensesError) {
    console.error("Failed to load expenses:", expensesError);
  }

  const userExpenses = (expenses ?? []) as Expense[];

  const conversionResult = await convertExpensesToBaseCurrency(userExpenses);

  const summary = calculateExpenseSummary(conversionResult.expenses);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              CareBearBooks
            </p>
            <h1 className="text-xl font-bold text-slate-950">
              Expense Tracker
            </h1>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-slate-500">
              Signed in as
            </p>

            <p className="mt-1 font-semibold text-slate-950">
              {user.email}
            </p>

            <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-950">
              Your expense overview
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Review your recent expenses and keep your records organised.
            </p>
          </div>

          {expensesError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              We could not load your expenses. Please refresh and try again.
            </div>
          ) : (
            <>
              {conversionResult.error ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {conversionResult.error}
                </div>
              ) : (
                <>
                  <SummaryCards
                    gross={summary.gross}
                    net={summary.net}
                    tax={summary.tax}
                    count={summary.count}
                  />

                  <CategoryBreakdown totals={summary.byCategory} />

                  {conversionResult.rateDate ? (
                    <p className="text-xs text-slate-500">
                      Exchange rates dated {conversionResult.rateDate}.
                    </p>
                  ) : null}
                </>
              )}

              <ExpenseList expenses={userExpenses} />
            </>
          )}
        </div>

        <ExpenseForm />
      </section>
    </main>
  );
}
