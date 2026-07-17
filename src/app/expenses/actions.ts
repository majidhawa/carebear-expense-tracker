"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { expenseSchema } from "@/lib/validations/expense";

export type ExpenseActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createExpense(
  _previousState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const validation = expenseSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    category: formData.get("category"),
    expense_date: formData.get("expense_date"),
    is_taxable: formData.get("is_taxable"),
  });

  if (!validation.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Your session has expired. Please sign in again.",
    };
  }

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    title: validation.data.title,
    amount: validation.data.amount,
    currency: validation.data.currency,
    category: validation.data.category,
    expense_date: validation.data.expense_date,
    is_taxable: validation.data.is_taxable,
  });

  if (error) {
    console.error("Failed to create expense:", error);

    return {
      error: "We could not save the expense. Please try again.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: "Expense added successfully.",
  };
}

export async function deleteExpense(formData: FormData) {
  const expenseId = formData.get("expense_id");

  if (typeof expenseId !== "string" || !expenseId) {
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete expense:", error);
    return;
  }

  revalidatePath("/dashboard");
}

export async function updateExpense(
  _previousState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const expenseId = formData.get("expense_id");

  if (typeof expenseId !== "string" || !expenseId) {
    return {
      error: "Invalid expense.",
    };
  }

  const validation = expenseSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    category: formData.get("category"),
    expense_date: formData.get("expense_date"),
    is_taxable: formData.get("is_taxable"),
  });

  if (!validation.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Your session has expired. Please sign in again.",
    };
  }

  const { error } = await supabase
    .from("expenses")
    .update({
      title: validation.data.title,
      amount: validation.data.amount,
      currency: validation.data.currency,
      category: validation.data.category,
      expense_date: validation.data.expense_date,
      is_taxable: validation.data.is_taxable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update expense:", error);

    return {
      error: "We could not update the expense. Please try again.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: "Expense updated successfully.",
  };
}
