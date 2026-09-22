"use client";

import { MonthSelector } from "@/components/month-selector";
import { formatCurrency } from "@/lib/format";
import type { MonthSummary } from "@/lib/types";

type DashboardSummaryProps = {
  month: string;
  onMonthChange: (month: string) => void;
  summary: MonthSummary | undefined;
  isLoading: boolean;
};

export function DashboardSummary({
  month,
  onMonthChange,
  summary,
  isLoading,
}: DashboardSummaryProps) {
  const pending = isLoading || !summary;

  return (
    <section
      aria-labelledby="grand-total-label"
      className="relative isolate overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--hero-from)_0%,var(--hero-to)_62%)] px-6 py-11 text-center text-white sm:px-10 sm:py-12"
      style={{ clipPath: "inset(0 round calc(var(--radius) * 2.2))" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-16 size-72 rounded-full bg-brand-teal/30 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-brand-teal/15 blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-3.5">
        <h1
          id="grand-total-label"
          className="text-xs font-medium tracking-[0.18em] text-white/95 uppercase"
        >
          Γενικό σύνολο
        </h1>

        {pending ? (
          <div
            className="h-12 w-56 animate-pulse rounded-lg bg-muted sm:h-14 sm:w-72"
            aria-hidden
          />
        ) : (
           <p className="text-4xl leading-none font-semibold tracking-tight tabular-nums sm:text-5xl">
            {formatCurrency(summary.grandTotal)}
          </p>
        )}

        <div className="flex flex-col items-center gap-2.5">
          <MonthSelector value={month} onChange={onMonthChange} tone="inverted" />
          <p className="text-sm text-white/85">
            {pending
              ? "Φόρτωση…"
              : `${summary.entryCount} ${
                  summary.entryCount === 1 ? "καταχώρηση" : "καταχωρήσεις"
                }`}
          </p>
        </div>
      </div>
    </section>
  );
}
