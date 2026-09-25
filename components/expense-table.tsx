"use client";

import { isToday, isWeekend } from "date-fns";
import { AddExpenseButton } from "@/components/add-expense-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { RouteLabel } from "@/components/route-label";
import { cn } from "@/lib/utils";
import {
  entryTotals,
  entryTotal,
  grandTotal,
  sumExpenseTotals,
} from "@/lib/calculations";
import {
  formatCurrency,
  formatDayMonthEl,
  formatNumber,
  formatWeekdayEl,
  parseDateEl,
} from "@/lib/format";
import type { MonthDayEntry } from "@/lib/month-days";

type ExpenseTableProps = {
  days: MonthDayEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function Amount({ value, strong }: { value: number; strong?: boolean }) {
  if (value === 0 && !strong) {
    return <span className="text-muted-foreground/60">—</span>;
  }
  return (
    <span className={cn("tabular-nums", strong && "font-semibold text-accent-blue-ink")}>
      {formatCurrency(value)}
    </span>
  );
}

export function ExpenseTable({
  days,
  onDelete,
  isDeleting,
}: ExpenseTableProps) {
  const entries = days.flatMap((day) => day.expenses);
  const totals = sumExpenseTotals(entries);

  return (
    <div className="hidden overflow-hidden rounded-2xl bg-card ring-1 ring-brand-blue/10 lg:block">
      <Table>
        <TableHeader>
          <TableRow className="border-brand-blue/10 bg-surface-blue/70 hover:bg-surface-blue/70">
            <ColumnHead className="pl-4">Ημερομηνία</ColumnHead>
            <ColumnHead>Αρ. κυκλ.</ColumnHead>
            <ColumnHead className="min-w-[180px]">Διαδρομή</ColumnHead>
            <ColumnHead align="right">Χιλιόμ.</ColumnHead>
            <ColumnHead align="right">Καύσιμα</ColumnHead>
            <ColumnHead align="right">Parking</ColumnHead>
            <ColumnHead align="right">Διόδια</ColumnHead>
            <ColumnHead align="right">Εστίαση</ColumnHead>
            <ColumnHead align="right">Άλλο</ColumnHead>
            <ColumnHead align="right" className="bg-surface-blue/60 text-accent-blue-ink">Σύνολο</ColumnHead>
            <TableHead className="w-40 pr-2" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {days.map((day) => {
            const localDate = parseDateEl(day.date);
            const today = isToday(localDate);
            const weekend = isWeekend(localDate);

            if (day.status === "empty") {
              return (
                <TableRow
                  key={day.date}
                  className={cn(
                    "border-border/50 border-dashed bg-muted/25 text-muted-foreground transition-colors hover:bg-muted/50",
                    weekend && "bg-surface-amber/25",
                    today && "bg-surface-teal/40 outline-2 -outline-offset-2 outline-brand-teal/35",
                  )}
                >
                  <TableCell className="py-2.5 pl-4">
                    <span className="font-medium tabular-nums text-foreground">
                      {formatDayMonthEl(day.date)}
                    </span>
                    <span className="ml-1.5 text-xs">
                      {formatWeekdayEl(day.date)}
                    </span>
                    {today && <span className="ml-1.5 text-xs font-medium text-accent-teal-ink">Σήμερα</span>}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="outline" className="border-dashed text-muted-foreground">
                      Χωρίς καταχώρηση
                    </Badge>
                  </TableCell>
                  <EmptyCells count={7} />
                  <TableCell className="bg-muted/30 py-2.5 text-right font-semibold tabular-nums">
                    {formatCurrency(0)}
                  </TableCell>
                  <TableCell className="py-2.5 pr-2 text-right">
                    <AddExpenseButton date={day.date} compact />
                  </TableCell>
                </TableRow>
              );
            }

            const entry = day.expenses[0];
            const totals = entryTotals(entry);
            return (
              <TableRow
                key={day.date}
                className={cn(
                  "border-border/50 transition-colors hover:bg-surface-blue/50",
                  weekend && "bg-surface-amber/20",
                  today && "bg-surface-teal/30 outline-2 -outline-offset-2 outline-brand-teal/35",
                )}
              >
                <TableCell className="py-3 pl-4">
                  <span className="font-medium tabular-nums">
                    {formatDayMonthEl(entry.date)}
                  </span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {formatWeekdayEl(entry.date)}
                  </span>
                  {today && <span className="ml-1.5 text-xs font-medium text-accent-teal-ink">Σήμερα</span>}
                </TableCell>
                <TableCell className="py-3">
                  <span className="rounded-md bg-surface-teal px-1.5 py-0.5 font-mono text-xs tracking-wide text-accent-teal-ink">
                    {entry.licensePlate}
                  </span>
                </TableCell>
                <TableCell className="max-w-[260px] py-3">
                  <div className="flex flex-col gap-1">
                    {entry.routes.map((route, index) => (
                      <RouteLabel key={index} route={route.route} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right tabular-nums">
                  {formatNumber(totals.kilometers, 0)}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Amount value={totals.fuel} />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Amount value={totals.parking} />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Amount value={totals.tolls} />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Amount value={totals.dining} />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Amount value={totals.other} />
                </TableCell>
                <TableCell className="bg-surface-blue/40 py-3 text-right">
                  <Amount value={entryTotal(entry)} strong />
                </TableCell>
                <TableCell className="py-3 pr-2">
                  <div className="flex items-center justify-end gap-1">
                    <AddExpenseButton date={day.date} compact hasExpenses />
                    <DeleteEntryButton
                      entry={entry}
                      onDelete={onDelete}
                      isDeleting={isDeleting}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter className="border-brand-blue/10 bg-surface-blue/70">
          <TableRow className="hover:bg-transparent">
            <TableCell className="py-3 pl-4 font-medium text-accent-blue-ink" colSpan={3}>
              Σύνολο μήνα
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {formatNumber(totals.kilometers, 0)}
            </TableCell>
              <TableCell className="py-3 text-right tabular-nums">
              {formatCurrency(totals.fuel)}
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {formatCurrency(totals.parking)}
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {formatCurrency(totals.tolls)}
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {formatCurrency(totals.dining)}
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {formatCurrency(totals.other)}
            </TableCell>
            <TableCell className="bg-surface-blue/50 py-3 text-right text-base font-semibold tabular-nums text-accent-blue-ink">
              {formatCurrency(grandTotal(totals))}
            </TableCell>
            <TableCell className="pr-2" />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function EmptyCells({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <TableCell key={index} className="py-2.5 text-right" aria-label="Δεν εφαρμόζεται">
      <span aria-hidden>—</span>
    </TableCell>
  ));
}

function ColumnHead({
  className,
  align = "left",
  ...props
}: React.ComponentProps<"th"> & { align?: "left" | "right" }) {
  return (
    <TableHead
      className={cn(
        "h-10 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
      {...props}
    />
  );
}
