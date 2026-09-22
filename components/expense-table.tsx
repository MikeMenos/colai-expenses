"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateEl, formatNumber } from "@/lib/format";
import type { ExpenseEntry } from "@/lib/types";

type ExpenseTableProps = {
  entries: ExpenseEntry[];
  month: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function ExpenseTable({
  entries,
  month,
  onDelete,
  isDeleting,
}: ExpenseTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-muted-foreground">
          Δεν υπάρχουν καταχωρήσεις για αυτόν τον μήνα.
        </p>
        <Link
          href={`/expenses/new?month=${month}`}
          className={cn(buttonVariants(), "mt-4 inline-flex cursor-pointer")}
        >
          Προσθήκη εξόδου
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ημερομηνία</TableHead>
            <TableHead>Αρ. κυκλ.</TableHead>
            <TableHead className="min-w-[200px]">Διαδρομή</TableHead>
            <TableHead className="text-right">Χιλιόμ.</TableHead>
            <TableHead className="text-right">Parking</TableHead>
            <TableHead className="text-right">Διόδια</TableHead>
            <TableHead className="text-right">Εστίαση</TableHead>
            <TableHead className="text-right">Άλλο</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap">
                {formatDateEl(entry.date)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {entry.licensePlate}
              </TableCell>
              <TableCell>{entry.route}</TableCell>
              <TableCell className="text-right">
                {formatNumber(entry.kilometers, 0)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(entry.parking)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(entry.tolls)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(entry.dining)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(entry.other)}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isDeleting}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Διαγραφή καταχώρησης για ${formatDateEl(entry.date)};`,
                      )
                    ) {
                      onDelete(entry.id);
                    }
                  }}
                  aria-label="Διαγραφή"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
