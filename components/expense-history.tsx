"use client";

import Link from "next/link";
import { Plus, ReceiptText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ExpenseMobileList } from "@/components/expense-mobile-list";
import { ExpenseTable } from "@/components/expense-table";
import { cn } from "@/lib/utils";
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
  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="history-heading" className="font-heading text-lg font-semibold tracking-tight">
          Ημερήσιες καταχωρήσεις
        </h2>
        {!isLoading && entries.length > 0 && (
          <span className="rounded-full bg-surface-blue px-2.5 py-1 text-xs font-semibold text-accent-blue-ink tabular-nums">
            {entries.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : entries.length === 0 ? (
        <EmptyState month={month} />
      ) : (
        <>
          <ExpenseTable
            entries={entries}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
          <ExpenseMobileList
            entries={entries}
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

function EmptyState({ month }: { month: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ReceiptText className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold">Καμία καταχώρηση για τον επιλεγμένο μήνα</p>
        <p className="text-sm text-muted-foreground">
          Προσθέστε το πρώτο σας έξοδο για να δείτε το σύνολο.
        </p>
      </div>
      <Link
        href={`/expenses/new?month=${month}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "mt-1 bg-background",
        )}
      >
        <Plus />
        Νέα καταχώρηση
      </Link>
    </div>
  );
}
