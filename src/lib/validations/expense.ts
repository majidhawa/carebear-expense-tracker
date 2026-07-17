import { z } from "zod";

import {
  EXPENSE_CATEGORIES,
  EXPENSE_CURRENCIES,
} from "@/lib/constants/expenses";

export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  amount: z.coerce
    .number({
      message: "Enter a valid amount.",
    })
    .positive("Amount must be greater than zero.")
    .max(9_999_999_999.99, "Amount is too large."),

  currency: z.enum(EXPENSE_CURRENCIES, {
    message: "Select a supported currency.",
  }),

  category: z.enum(EXPENSE_CATEGORIES, {
    message: "Select a valid category.",
  }),

  expense_date: z
    .string()
    .min(1, "Select an expense date.")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Enter a valid expense date.",
    ),

  is_taxable: z.preprocess(
    (value) =>
      value === "on" ||
      value === "true" ||
      value === true,
    z.boolean(),
  ),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
