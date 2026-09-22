"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  fetchSummary,
} from "@/lib/api/expenses";
import type { CreateExpenseInput } from "@/lib/types";

export function expenseKeys(month: string) {
  return {
    list: ["expenses", month] as const,
    summary: ["summary", month] as const,
  };
}

export function useExpenses(month: string) {
  return useQuery({
    queryKey: expenseKeys(month).list,
    queryFn: () => fetchExpenses(month),
  });
}

export function useExpenseSummary(month: string) {
  return useQuery({
    queryKey: expenseKeys(month).summary,
    queryFn: () => fetchSummary(month),
  });
}

export function useCreateExpense(month: string) {
  const queryClient = useQueryClient();
  const keys = expenseKeys(month);

  return useMutation({
    mutationFn: (payload: CreateExpenseInput) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      queryClient.invalidateQueries({ queryKey: keys.summary });
    },
  });
}

export function useDeleteExpense(month: string) {
  const queryClient = useQueryClient();
  const keys = expenseKeys(month);

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      queryClient.invalidateQueries({ queryKey: keys.summary });
    },
  });
}
