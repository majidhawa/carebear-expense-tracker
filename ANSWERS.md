# Technical Assessment Answers

## 1. How does Supabase Row Level Security protect the data?

Row Level Security (RLS) enforces authorization directly inside PostgreSQL rather than relying only on frontend checks.

Each expense belongs to a user through its `user_id`. The RLS policies compare the authenticated Supabase user's ID, `auth.uid()`, with the `user_id` stored on each expense row.

This ensures that authenticated users can only select, insert, update, or delete expense records they are authorized to access.

If RLS were disabled, frontend filtering alone would not provide sufficient protection. A user could bypass the application interface and send custom requests directly to the backend or Supabase API.

By enforcing authorization at the database level, unauthorized access is blocked even if someone manipulates the frontend or sends their own API requests.

---

## 2. Where are the Supabase keys stored?

During local development, the Supabase project URL and publishable key are stored in `.env.local`.

In production, the same values are configured using Vercel environment variables.

The local `.env.local` file is excluded from version control, while `.env.example` contains only placeholder variable names required to configure the application.

The application uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The publishable key is intended for use by applications connecting to Supabase and does not provide unrestricted database access. Data authorization is enforced through authentication and Row Level Security policies.

A secret or service-role key has elevated privileges and can bypass Row Level Security. It must only be used in trusted server environments and must never be exposed to the browser.

I did not use a service-role key in this application.

---

## 3. What happens when a user signs in?

The authentication flow works as follows:

1. The user submits their email and password through the login form.
2. A Next.js Server Action receives the submitted form data.
3. The input is validated using Zod.
4. The Server Action calls `supabase.auth.signInWithPassword`.
5. Supabase verifies the user's credentials and establishes an authenticated session.
6. Authentication information is maintained using cookies.
7. Middleware participates in keeping the authentication session available across requests.
8. After successful authentication, the user is redirected to `/dashboard`.
9. The dashboard retrieves the authenticated user using `supabase.auth.getUser()` before rendering private content.
10. Database queries execute using the authenticated Supabase session, allowing PostgreSQL Row Level Security policies to evaluate `auth.uid()` and restrict data access appropriately.

This creates multiple layers of protection.

Middleware provides route-level protection and session handling, the server verifies the authenticated user before accessing protected functionality, and RLS provides the final authorization boundary at the database level.

---

## 4. What happens if the exchange-rate API fails?

Currency conversion is isolated from the application's core expense storage.

Expenses are always stored using their original amount and currency. Exchange-rate conversion is performed only when generating normalized KES dashboard reporting.

The exchange-rate integration includes:

- A request timeout
- One retry for temporary failures
- Validation of returned exchange-rate data
- Server-side caching of successful requests
- Error handling around external API requests

If the exchange-rate provider is slow, unavailable, or returns an invalid response, the error is caught and the application handles the conversion failure gracefully rather than allowing the external service to crash the dashboard.

The user's original expense records remain stored safely in Supabase because currency conversion does not modify the original transactions.

With additional development time, I would persist dated exchange rates in the database and use the most recent valid stored rate as a clearly labelled fallback when the external provider is unavailable.

---

## 5. What AI-generated code did I change or reject?

One example involved the exchange-rate integration.

An initial AI-assisted implementation used a five-second timeout for the external currency API. During manual testing, I found that valid requests occasionally exceeded this timeout even though the API endpoint itself was working correctly.

I tested the endpoint independently and confirmed that the issue was network latency rather than an invalid URL or API response.

Based on that testing, I changed the implementation to use a fifteen-second timeout, added one retry for temporary failures, validated the returned exchange rate before using it, and preserved a safe failure state if conversion still failed.

This is an example of where I did not accept the initial suggestion as final. I tested the behaviour, identified the actual failure condition, and adjusted the implementation based on the observed results.

---

## 6. Debugging and Code Review

### Problems in the original snippet

The original implementation had several issues:

1. The effect depends on `total`, while the same effect also updates `total`. This can cause repeated requests or potentially an infinite loop.
2. `setTotal(total + data.length)` uses the value from the previous render and counts the number of rows instead of calculating the sum of expense amounts.
3. The Supabase query error is ignored.
4. The returned `data` may be `null`.
5. The expense state does not have an explicit TypeScript type.
6. Elements rendered using `.map()` do not have a React `key`.
7. There is no loading state while the request is running.
8. There is no user-facing error state if the request fails.
9. Expense amounts are displayed without consistent formatting.
10. The query does not specify an ordering for the returned expenses.
11. Data ownership ultimately depends on correctly configured Row Level Security. Without RLS, a broad query could expose expense records belonging to other users.

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
```

### Why this version is better

The corrected implementation:

- Fetches expenses only once when the component mounts
- Handles Supabase query errors
- Safely handles potentially null data
- Uses TypeScript for the expense state
- Calculates totals from actual expense amounts
- Adds stable React keys
- Provides loading and error states
- Orders expenses by date
- Relies on Row Level Security as the database-level authorization boundary

For the production application itself, I chose to perform the main dashboard data fetching in a Server Component rather than using this client-side pattern. This keeps the primary expense query on the server while still relying on Supabase authentication and Row Level Security for authorization.