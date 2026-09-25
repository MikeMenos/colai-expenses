"use client";

import { Gauge } from "lucide-react";
import { isToday, isWeekend } from "date-fns";
import { AddExpenseButton } from "@/components/add-expense-button";
import { Badge } from "@/components/ui/badge";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { RouteLabel } from "@/components/route-label";
import { entryTotal, entryTotals } from "@/lib/calculations";
import {
  formatCurrency,
  formatDayMonthEl,
  formatNumber,
  formatWeekdayEl,
  parseDateEl,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MonthDayEntry } from "@/lib/month-days";
import type { ExpenseTotals } from "@/lib/types";

type ExpenseMobileListProps = {
  days: MonthDayEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function costChips(entry: ExpenseTotals) {
  return [
    { label: "Καύσιμα", value: entry.fuel },
    { label: "Parking", value: entry.parking },
    { label: "Διόδια", value: entry.tolls },
    { label: "Εστίαση", value: entry.dining },
    { label: "Άλλο", value: entry.other },
  ].filter((chip) => chip.value > 0);
}

export function ExpenseMobileList({
  days,
  onDelete,
  isDeleting,
}: ExpenseMobileListProps) {
  return (
    <ul className="flex flex-col gap-2 lg:hidden">
      {days.map((day) => {
        const localDate = parseDateEl(day.date);
        const today = isToday(localDate);
        const weekend = isWeekend(localDate);

        if (day.status === "empty") {
          return (
            <li
              key={day.date}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-muted/35 px-4 py-3",
                weekend && "bg-surface-amber/30",
                today && "border-brand-teal bg-surface-teal/40 ring-2 ring-brand-teal/25",
              )}
            >
              <div className="min-w-0">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-medium tabular-nums">
                    {formatDayMonthEl(day.date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatWeekdayEl(day.date)}
                  </span>
                  {today && <span className="text-xs font-medium text-accent-teal-ink">Σήμερα</span>}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="outline" className="border-dashed text-muted-foreground">
                    Χωρίς καταχώρηση
                  </Badge>
                  <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                    {formatCurrency(0)}
                  </span>
                </div>
              </div>
              <AddExpenseButton date={day.date} className="shrink-0" />
            </li>
          );
        }

        const entry = day.expenses[0];
        const totals = entryTotals(entry);
        const chips = costChips(totals);

        return (
          <li
            key={day.date}
            className={cn(
              "flex flex-col gap-2.5 rounded-2xl bg-card p-4 ring-1 ring-brand-blue/10 transition-colors hover:bg-surface-blue/40",
              weekend && "bg-surface-amber/20",
              today && "ring-2 ring-brand-teal/40",
            )}
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
                  {today && <span className="text-xs font-medium text-accent-teal-ink">Σήμερα</span>}
                </p>
                <p className="mt-1 inline-block rounded-md bg-surface-teal px-1.5 py-0.5 font-mono text-xs tracking-wide text-accent-teal-ink">
                  {entry.licensePlate}
                </p>
              </div>
              <p className="shrink-0 text-xl leading-tight font-semibold tabular-nums text-accent-blue-ink">
                {formatCurrency(entryTotal(entry))}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {entry.routes.map((route, index) => (
                <RouteLabel key={index} route={route.route} className="text-sm" />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-brand-blue/8 pt-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Gauge className="size-3.5" />
                  <span className="tabular-nums">
                    {formatNumber(totals.kilometers, 0)} km
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
              <div className="flex shrink-0 items-center gap-1">
                <AddExpenseButton date={day.date} compact hasExpenses />
                <DeleteEntryButton
                  entry={entry}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                  size="icon"
                  className="-mr-1 shrink-0 size-9 rounded-lg"
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
