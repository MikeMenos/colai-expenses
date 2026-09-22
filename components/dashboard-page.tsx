"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { ExpenseTable } from "@/components/expense-table";
import { MonthPicker } from "@/components/month-picker";
import { SummaryCards } from "@/components/summary-cards";
import { cn } from "@/lib/utils";
import {
  useDeleteExpense,
  useExpenseSummary,
  useExpenses,
} from "@/hooks/use-expenses";
import { useMonthParam } from "@/hooks/use-month-param";
import { formatMonthLabel } from "@/lib/month";

function DashboardContent() {
  const [month, setMonth] = useMonthParam();
  const { data: entries = [], isLoading: entriesLoading } = useExpenses(month);
  const { data: summary, isLoading: summaryLoading } = useExpenseSummary(month);
  const deleteMutation = useDeleteExpense(month);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">{formatMonthLabel(month)}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <MonthPicker value={month} onChange={setMonth} />
          <Link
            href={`/expenses/new?month=${month}`}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80",
            )}
          >
            <Plus className="size-4" />
            Νέα καταχώρηση
          </Link>
        </div>
      </div>

      <SummaryCards summary={summary} isLoading={summaryLoading} />

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Ημερήσιες καταχωρήσεις</h2>
        {entriesLoading ? (
          <p className="text-sm text-muted-foreground">Φόρτωση…</p>
        ) : (
          <ExpenseTable
            entries={entries}
            month={month}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </section>
    </div>
  );
}

export function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted-foreground">Φόρτωση…</p>}>
      <DashboardContent />
    </Suspense>
  );
}
