import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-500">
            Signed in as
          </p>

          <p className="mt-1 font-semibold text-slate-950">
            {user.email}
          </p>

          <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-950">
            Welcome to your dashboard
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Your expense summaries, VAT totals, category breakdowns, and
            recent transactions will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
