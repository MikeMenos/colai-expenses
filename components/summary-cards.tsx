"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MILEAGE_RATE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { MonthSummary } from "@/lib/types";

type SummaryCardsProps = {
  summary: MonthSummary | undefined;
  isLoading: boolean;
};

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { totals, mileageReimbursement, grandTotal } = summary;
  const outOfPocket =
    totals.parking + totals.tolls + totals.dining + totals.other;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Σύνολο χιλιομέτρων
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {formatNumber(totals.kilometers, 0)} km
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Χιλιομετρική αποζημίωση
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {formatCurrency(mileageReimbursement)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(totals.kilometers, 0)} × {MILEAGE_RATE}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Έξοδα (parking, διόδια, κ.λπ.)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(outOfPocket)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Parking {formatCurrency(totals.parking)} · Διόδια{" "}
            {formatCurrency(totals.tolls)} · Εστίαση{" "}
            {formatCurrency(totals.dining)} · Άλλο {formatCurrency(totals.other)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-[var(--brand-teal)]/40 bg-[var(--brand-teal)]/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--brand-blue)]">
            Γενικό σύνολο
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(grandTotal)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.entryCount} ημέρες καταχωρημένες
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
