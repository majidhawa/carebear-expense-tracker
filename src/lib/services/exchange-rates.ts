import { BASE_CURRENCY } from "@/lib/constants/expenses";
import type { Expense, ExpenseCurrency } from "@/types/expense";

type FrankfurterRateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type ConvertedExpensesResult = {
  expenses: Expense[];
  rateDate: string | null;
  error: string | null;
};

async function getRateToBase(
  currency: ExpenseCurrency,
): Promise<{ rate: number; date: string | null }> {
  if (currency === BASE_CURRENCY) {
    return {
      rate: 1,
      date: null,
    };
  }

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/${currency}/${BASE_CURRENCY}`,
    {
      next: {
        revalidate: 3600,
      },
    signal: AbortSignal.timeout(10000),
    },
  );

  if (!response.ok) {
    throw new Error(`Exchange API returned ${response.status}.`);
  }

  const data = (await response.json()) as FrankfurterRateResponse;

  if (!Number.isFinite(data.rate) || data.rate <= 0) {
    throw new Error("Exchange API returned an invalid rate.");
  }

  return {
    rate: data.rate,
    date: data.date,
  };
}

export async function convertExpensesToBaseCurrency(
  expenses: Expense[],
): Promise<ConvertedExpensesResult> {
  try {
    const currencies = [
      ...new Set(expenses.map((expense) => expense.currency)),
    ];

    const rateEntries = await Promise.all(
      currencies.map(async (currency) => {
        const result = await getRateToBase(currency);

        return [currency, result] as const;
      }),
    );

    const rates = new Map(rateEntries);

    const convertedExpenses = expenses.map((expense) => {
      const rate = rates.get(expense.currency)?.rate;

      if (!rate) {
        throw new Error(`No conversion rate found for ${expense.currency}.`);
      }

      return {
        ...expense,
        amount: expense.amount * rate,
        currency: BASE_CURRENCY,
      } as Expense;
    });

    const rateDate =
      rateEntries.find(([, result]) => result.date)?.[1].date ?? null;

    return {
      expenses: convertedExpenses,
      rateDate,
      error: null,
    };
  } catch (error) {
    console.error("Currency conversion failed:", error);

    return {
      expenses: [],
      rateDate: null,
      error:
        "Converted totals are temporarily unavailable. Your original expenses are still safe.",
    };
  }
}
