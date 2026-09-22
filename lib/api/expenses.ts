import { apiClient } from "@/lib/api/client";
import type { CreateExpenseInput, ExpenseEntry, MonthSummary } from "@/lib/types";

export async function fetchExpenses(month: string): Promise<ExpenseEntry[]> {
  const { data } = await apiClient.get<ExpenseEntry[]>("/api/expenses", {
    params: { month },
  });
  return data;
}

export async function fetchSummary(month: string): Promise<MonthSummary> {
  const { data } = await apiClient.get<MonthSummary>("/api/expenses/summary", {
    params: { month },
  });
  return data;
}

export async function createExpense(
  payload: CreateExpenseInput,
): Promise<ExpenseEntry> {
  const { data } = await apiClient.post<ExpenseEntry>("/api/expenses", payload);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await apiClient.delete(`/api/expenses/${id}`);
}
