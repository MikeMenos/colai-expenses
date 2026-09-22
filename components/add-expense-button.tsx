"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function AddExpenseButton({ month }: { month: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
      <Link
        href={`/expenses/new?month=${month}`}
        aria-label="Νέα καταχώρηση"
        className="group pointer-events-auto relative flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand-teal)_0%,var(--brand-blue)_100%)] text-white shadow-lg shadow-brand-blue/25 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-blue/30 focus-visible:ring-4 focus-visible:ring-brand-teal/70 active:translate-y-0 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <Plus className="size-6" />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
        >
          Νέα καταχώρηση
        </span>
      </Link>
    </div>
  );
}
