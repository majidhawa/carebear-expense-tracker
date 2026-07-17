# Technical Assessment Answers

## 1. How does Supabase Row Level Security protect the data?

Row Level Security enforces authorization inside PostgreSQL rather than relying only on the frontend. Each expense policy compares the authenticated user's ID, `auth.uid()`, with the row's `user_id`.

If RLS were disabled, a user could manipulate API requests or use the Supabase REST API directly to read, update, or delete another user's expenses. Frontend filtering would not be enough because requests can be created outside the application.

## 2. Where are the Supabase keys stored?

The Supabase project URL and publishable key are stored in `.env.local` during local development and in Vercel environment variables for deployment. `.env.local` is ignored by Git, while `.env.example` contains only the required variable names.

The publishable key is designed for browser and server requests made on behalf of authenticated users. It is safe to expose when Row Level Security is correctly configured.

The secret or service-role key can bypass Row Level Security and must only be used in trusted backend environments. I did not use it in this application.

## 3. What happens when a user signs in?

1. The user submits their email and password through the login form.
2. A Next.js Server Action validates the input using Zod.
3. The Server Action calls `supabase.auth.signInWithPassword`.
4. Supabase verifies the credentials and returns an authenticated session.
5. The session tokens are stored in cookies.
6. Middleware reads and refreshes the session when necessary.
7. The user is redirected to `/dashboard`.
8. The dashboard verifies the user again with `supabase.auth.getUser()` before rendering private content.
9. Supabase uses the authenticated session when evaluating Row Level Security policies.

The session lives in cookies between requests, allowing both the browser and server-side Next.js code to identify the user.

## 4. What happens if the exchange-rate API fails?

The exchange-rate request has a timeout, one retry, response validation, and one-hour caching.

If the provider is slow, unavailable, or returns an invalid response, the application catches the error and shows that converted totals are temporarily unavailable. The original expense list remains available because expenses are stored in their original currencies and currency conversion is used only for reporting.

With more time, I would persist dated exchange rates in the database and use the most recent valid cached rate as a clearly labelled fallback.

## 5. What AI-generated code did I change or reject?

AI initially suggested a five-second timeout for the currency API. During testing, the request occasionally exceeded that limit even though the endpoint was working.

I changed the implementation to use a fifteen-second timeout, added one retry, validated the returned rate, and kept a safe failure state. I made this change after testing the endpoint directly and confirming that the issue was network latency rather than an invalid API URL.

## 6. Debugging and code review

### Problems in the original snippet

1. The effect depends on `total`, while the effect also updates `total`. This can cause repeated requests or an infinite loop.
2. `setTotal(total + data.length)` uses the previous render's value and counts rows instead of adding expense amounts.
3. The Supabase error is ignored.
4. `data` may be `null`.
5. The expense state has no TypeScript type.
6. The mapped elements do not have a React `key`.
7. There is no loading state.
8. There is no user-facing error state.
9. The amount is displayed without currency formatting.
10. The query does not specify ordering.
11. Data ownership depends on RLS; without RLS, the query could return every user's expenses.

### Corrected version

```tsx
"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Expense } from "@/types/expense";

export function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function loadExpenses() {
      const { data, error: queryError } = await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (queryError) {
        setError("Could not load expenses.");
        setIsLoading(false);
        return;
      }

      setExpenses((data ?? []) as Expense[]);
      setIsLoading(false);
    }

    void loadExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );

  if (isLoading) {
    return <p>Loading expenses...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <div>
      <p>Total: {total.toFixed(2)}</p>

      {expenses.map((expense) => (
        <p key={expense.id}>
          {expense.title}: {expense.currency}{" "}
          {Number(expense.amount).toFixed(2)}
        </p>
      ))}
    </div>
  );
}