"use client";

import { useMemo } from "react";
import { ExpenseMobileList } from "@/components/expense-mobile-list";
import { ExpenseTable } from "@/components/expense-table";
import { buildMonthDays } from "@/lib/month-days";
import type { ExpenseEntry } from "@/lib/types";

type ExpenseHistoryProps = {
  entries: ExpenseEntry[];
  month: string;
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function ExpenseHistory({
  entries,
  month,
  isLoading,
  onDelete,
  isDeleting,
}: ExpenseHistoryProps) {
  const days = useMemo(() => buildMonthDays(month, entries), [entries, month]);
  const filledDays = days.filter((day) => day.status === "filled").length;

  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-3">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
        <h2 id="history-heading" className="font-heading text-lg font-semibold tracking-tight">
          Ημερήσιες καταχωρήσεις
        </h2>
        {!isLoading && (
          <span className="rounded-full bg-surface-blue px-2.5 py-1 text-xs font-semibold text-accent-blue-ink tabular-nums">
            {filledDays} από {days.length} ημέρες συμπληρωμένες
          </span>
        )}
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : (
        <>
          <ExpenseTable
            days={days}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
          <ExpenseMobileList
            days={days}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </section>
  );
}

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy role="status">
      <span className="sr-only">Φόρτωση καταχωρήσεων…</span>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl bg-surface-blue/60 lg:h-12"
        />
      ))}
    </div>
  );
}
