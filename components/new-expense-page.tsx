"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { ExpenseForm } from "@/components/expense-form";
import { useMonthParam } from "@/hooks/use-month-param";
import { formatMonthLabel } from "@/lib/month";

function NewExpenseContent() {
  const [month, setMonth] = useMonthParam();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/?month=${month}`}
          className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          Πίσω στο dashboard
        </Link>
        <div className="mt-3 mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Καταχώρηση εξόδου
          </h1>
          <p className="mt-1 text-muted-foreground">{formatMonthLabel(month)}</p>
        </div>
      </div>
      <ExpenseForm month={month} onMonthChange={setMonth} />
    </div>
  );
}

export function NewExpensePage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted-foreground">Φόρτωση…</p>}>
      <NewExpenseContent />
    </Suspense>
  );
}
