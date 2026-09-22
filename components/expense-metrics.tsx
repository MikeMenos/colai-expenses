"use client";

import type { LucideIcon } from "lucide-react";
import { Car, Gauge, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MILEAGE_RATE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { MonthSummary } from "@/lib/types";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: React.ReactNode;
  className?: string;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl bg-neutral-100 ring-0 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-foreground/5 motion-reduce:hover:translate-y-0 dark:bg-neutral-900",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <Icon className="size-4" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {value}
          </p>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl bg-neutral-100 ring-0 dark:bg-neutral-900",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-3.5">
        <div className="h-8 w-32 animate-pulse rounded-xl bg-foreground/5" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-foreground/5" />
      </CardContent>
    </Card>
  );
}

type ExpenseMetricsProps = {
  summary: MonthSummary | undefined;
  isLoading: boolean;
};

export function ExpenseMetrics({ summary, isLoading }: ExpenseMetricsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton className="col-span-2 lg:col-span-1" />
      </div>
    );
  }

  const { totals, mileageReimbursement, entryCount } = summary;
  const outOfPocket =
    totals.parking + totals.tolls + totals.dining + totals.other;

  const breakdown = [
    { label: "Parking", value: totals.parking },
    { label: "Διόδια", value: totals.tolls },
    { label: "Εστίαση", value: totals.dining },
    { label: "Άλλο", value: totals.other },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      <MetricCard
        icon={Gauge}
        label="Σύνολο χιλιομέτρων"
        value={`${formatNumber(totals.kilometers, 0)} km`}
        hint={
          entryCount > 0
            ? `${formatNumber(totals.kilometers / entryCount, 0)} km / ημέρα`
            : undefined
        }
      />

      <MetricCard
        icon={Car}
        label="Χιλιομετρική αποζημίωση"
        value={formatCurrency(mileageReimbursement)}
        hint={`${formatNumber(totals.kilometers, 0)} km × ${MILEAGE_RATE} €`}
      />

      <MetricCard
        icon={Wallet}
        label="Έξοδα"
        value={formatCurrency(outOfPocket)}
        className="col-span-2 lg:col-span-1"
        hint={
          outOfPocket === 0 ? undefined : (
            <dl className="flex flex-wrap gap-x-3 gap-y-0.5">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-baseline gap-1">
                  <dt>{item.label}</dt>
                  <dd
                    className={cn(
                      "font-semibold tabular-nums",
                      item.value > 0 && "text-foreground",
                    )}
                  >
                    {formatCurrency(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
          )
        }
      />
    </div>
  );
}
