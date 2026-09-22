"use client";

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
  entryTotal,
  grandTotal,
  sumExpenseTotals,
} from "@/lib/calculations";
import {
  formatCurrency,
  formatDayMonthEl,
  formatNumber,
  formatWeekdayEl,
} from "@/lib/format";
import type { ExpenseEntry } from "@/lib/types";

type ExpenseTableProps = {
  entries: ExpenseEntry[];
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
  entries,
  onDelete,
  isDeleting,
}: ExpenseTableProps) {
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
            <ColumnHead align="right">Parking</ColumnHead>
            <ColumnHead align="right">Διόδια</ColumnHead>
            <ColumnHead align="right">Εστίαση</ColumnHead>
            <ColumnHead align="right">Άλλο</ColumnHead>
            <ColumnHead align="right" className="bg-surface-blue/60 text-accent-blue-ink">Σύνολο</ColumnHead>
            <TableHead className="w-10 pr-2" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="border-border/50 transition-colors hover:bg-surface-blue/50"
            >
              <TableCell className="py-3 pl-4">
                <span className="font-medium tabular-nums">
                  {formatDayMonthEl(entry.date)}
                </span>
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {formatWeekdayEl(entry.date)}
                </span>
              </TableCell>
              <TableCell className="py-3">
                <span className="rounded-md bg-surface-teal px-1.5 py-0.5 font-mono text-xs tracking-wide text-accent-teal-ink">
                  {entry.licensePlate}
                </span>
              </TableCell>
              <TableCell className="max-w-[260px] py-3">
                <RouteLabel route={entry.route} />
              </TableCell>
              <TableCell className="py-3 text-right tabular-nums">
                {formatNumber(entry.kilometers, 0)}
              </TableCell>
              <TableCell className="py-3 text-right">
                <Amount value={entry.parking} />
              </TableCell>
              <TableCell className="py-3 text-right">
                <Amount value={entry.tolls} />
              </TableCell>
              <TableCell className="py-3 text-right">
                <Amount value={entry.dining} />
              </TableCell>
              <TableCell className="py-3 text-right">
                <Amount value={entry.other} />
              </TableCell>
              <TableCell className="bg-surface-blue/40 py-3 text-right">
                <Amount value={entryTotal(entry)} strong />
              </TableCell>
              <TableCell className="py-3 pr-2">
                <DeleteEntryButton
                  entry={entry}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </TableCell>
            </TableRow>
          ))}
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
