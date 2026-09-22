"use client";

import { Suspense } from "react";
import { ExpenseForm } from "@/components/expense-form";
import { useMonthParam } from "@/hooks/use-month-param";
import { formatMonthLabel } from "@/lib/month";

function NewExpenseContent() {
  const [month, setMonth] = useMonthParam();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Καταχώρηση εξόδου
        </h1>
        <p className="text-muted-foreground">{formatMonthLabel(month)}</p>
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
