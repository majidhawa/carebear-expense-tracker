import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import { createClient } from "@/lib/supabase/server";
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

  const conversionResult =
    await convertExpensesToBaseCurrency(userExpenses);

  const summary = calculateExpenseSummary(
    conversionResult.expenses,
  );

  const firstName =
    user.email?.split("@")[0]?.split(/[._-]/)[0] ?? "there";

  return (
    <main className="relative min-h-screen bg-[#f6f7f2] text-slate-950" style={{backgroundImage: "radial-gradient(circle, #cbd5c0 1px, transparent 1px)", backgroundSize: "24px 24px"}}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="blob-2 absolute right-[-120px] top-[-100px] h-96 w-96 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="blob-3 absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-teal-100/30 blur-3xl" />
        <div className="blob-4 absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="blob-1 absolute bottom-[30%] left-[15%] h-64 w-64 rounded-full bg-lime-100/25 blur-3xl" />
      </div>

      <header className="relative border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/10">
              CB
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                CareBearBooks
              </p>

              <h1 className="text-lg font-bold tracking-tight text-slate-950">
                Expense Tracker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">
                Signed in as
              </p>

              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                {user.email}
              </p>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="animate-dashboard-entry mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Financial workspace
              </span>

              <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Good to see you,{" "}
                <span className="text-emerald-700">
                  {firstName}
                </span>
                .
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Track spending, understand VAT, and keep your
                financial records organised from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-slate-500">
                  Base currency
                </p>

                <p className="mt-1 font-bold text-slate-950">
                  KES
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-slate-500">
                  VAT rate
                </p>

                <p className="mt-1 font-bold text-slate-950">
                  16%
                </p>
              </div>
            </div>
          </div>
        </section>

        {expensesError ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            We could not load your expenses. Please refresh and try again.
          </div>
        ) : (
          <section className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="animate-dashboard-entry-delay-1 space-y-8">
              {conversionResult.error ? (
                <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
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

                  <CategoryBreakdown
                    totals={summary.byCategory}
                  />

                  {conversionResult.rateDate ? (
                    <div className="flex items-center gap-2 px-1 text-xs text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Exchange rates dated{" "}
                      {conversionResult.rateDate}.
                    </div>
                  ) : null}
                </>
              )}

              <ExpenseList expenses={userExpenses} />
            </div>

            <aside className="animate-dashboard-entry-delay-2 xl:sticky xl:top-8">
              <ExpenseForm />
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
