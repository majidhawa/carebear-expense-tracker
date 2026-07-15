import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account | CareBear Expense Tracker",
  description: "Create an account to securely manage your expenses.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            CareBearBooks
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start tracking expenses, VAT, and category spending securely.
          </p>
        </div>

        <SignupForm />
      </section>
    </main>
  );
}
