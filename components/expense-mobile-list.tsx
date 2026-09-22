"use client";

import { Gauge } from "lucide-react";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { RouteLabel } from "@/components/route-label";
import { entryTotal } from "@/lib/calculations";
import {
  formatCurrency,
  formatDayMonthEl,
  formatNumber,
  formatWeekdayEl,
} from "@/lib/format";
import type { ExpenseEntry } from "@/lib/types";

type ExpenseMobileListProps = {
  entries: ExpenseEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function costChips(entry: ExpenseEntry) {
  return [
    { label: "Parking", value: entry.parking },
    { label: "Διόδια", value: entry.tolls },
    { label: "Εστίαση", value: entry.dining },
    { label: "Άλλο", value: entry.other },
  ].filter((chip) => chip.value > 0);
}

export function ExpenseMobileList({
  entries,
  onDelete,
  isDeleting,
}: ExpenseMobileListProps) {
  return (
    <ul className="flex flex-col gap-2 lg:hidden">
      {entries.map((entry) => {
        const chips = costChips(entry);

        return (
          <li
            key={entry.id}
            className="flex flex-col gap-2.5 rounded-2xl bg-card p-4 ring-1 ring-brand-blue/10 transition-colors hover:bg-surface-blue/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-medium tabular-nums">
                    {formatDayMonthEl(entry.date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatWeekdayEl(entry.date)}
                  </span>
                </p>
                <p className="mt-1 inline-block rounded-md bg-surface-teal px-1.5 py-0.5 font-mono text-xs tracking-wide text-accent-teal-ink">
                  {entry.licensePlate}
                </p>
              </div>
              <p className="shrink-0 text-xl leading-tight font-semibold tabular-nums text-accent-blue-ink">
                {formatCurrency(entryTotal(entry))}
              </p>
            </div>

            <RouteLabel route={entry.route} className="text-sm" />

            <div className="flex items-center justify-between gap-2 border-t border-brand-blue/8 pt-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Gauge className="size-3.5" />
                  <span className="tabular-nums">
                    {formatNumber(entry.kilometers, 0)} km
                  </span>
                </span>
                {chips.map((chip) => (
                  <span key={chip.label}>
                    {chip.label}{" "}
                    <span className="font-medium tabular-nums text-foreground">
                      {formatCurrency(chip.value)}
                    </span>
                  </span>
                ))}
              </div>
              <DeleteEntryButton
                entry={entry}
                onDelete={onDelete}
                isDeleting={isDeleting}
                size="icon"
                className="-mr-1 shrink-0 size-9 rounded-lg"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
