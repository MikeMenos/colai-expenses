"use client";

import { Suspense } from "react";
import { AddExpenseButton } from "@/components/add-expense-button";
import { DashboardSummary } from "@/components/dashboard-summary";
import { ExpenseHistory } from "@/components/expense-history";
import { ExpenseMetrics } from "@/components/expense-metrics";
import {
  useDeleteExpense,
  useExpenseSummary,
  useExpenses,
} from "@/hooks/use-expenses";
import { useMonthParam } from "@/hooks/use-month-param";

function DashboardContent() {
  const [month, setMonth] = useMonthParam();
  const { data: entries = [], isLoading: entriesLoading } = useExpenses(month);
  const { data: summary, isLoading: summaryLoading } = useExpenseSummary(month);
  const deleteMutation = useDeleteExpense(month);

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-4 pb-28 sm:px-6 sm:gap-10 sm:pt-6 sm:pb-32 lg:px-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          <DashboardSummary
            month={month}
            onMonthChange={setMonth}
            summary={summary}
            isLoading={summaryLoading}
          />

          <ExpenseMetrics summary={summary} isLoading={summaryLoading} />
        </div>

        <ExpenseHistory
          entries={entries}
          month={month}
          isLoading={entriesLoading}
          onDelete={(id) => deleteMutation.mutate(id)}
          isDeleting={deleteMutation.isPending}
        />
      </div>

      <AddExpenseButton month={month} />
    </>
  );
}

export function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted-foreground">Φόρτωση…</p>}>
      <DashboardContent />
    </Suspense>
  );
}
