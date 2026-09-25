import { MILEAGE_RATE } from "@/lib/constants";
import type { ExpenseEntry, ExpenseTotals, MonthSummary } from "@/lib/types";

export function sumExpenseTotals(entries: ExpenseEntry[]): ExpenseTotals {
  return entries.reduce(
    (acc, entry) => ({
      kilometers: acc.kilometers + sumRoutes(entry),
      fuel: acc.fuel + sumAmounts(entry.fuel),
      parking: acc.parking + sumAmounts(entry.parking),
      tolls: acc.tolls + sumAmounts(entry.tolls),
      dining: acc.dining + sumAmounts(entry.dining),
      other: acc.other + sumAmounts(entry.other),
    }),
    { kilometers: 0, fuel: 0, parking: 0, tolls: 0, dining: 0, other: 0 },
  );
}

export function mileageReimbursement(kilometers: number): number {
  return kilometers * MILEAGE_RATE;
}

export function outOfPocketTotal(totals: Omit<ExpenseTotals, "kilometers">): number {
  return totals.fuel + totals.parking + totals.tolls + totals.dining + totals.other;
}

export function grandTotal(totals: ExpenseTotals): number {
  return mileageReimbursement(totals.kilometers) + outOfPocketTotal(totals);
}

export function buildMonthSummary(
  month: string,
  entries: ExpenseEntry[],
): MonthSummary {
  const totals = sumExpenseTotals(entries);
  const reimbursement = mileageReimbursement(totals.kilometers);
  return {
    month,
    totals,
    mileageReimbursement: reimbursement,
    grandTotal: reimbursement + outOfPocketTotal(totals),
    entryCount: entries.length,
  };
}

export function entryTotal(entry: ExpenseEntry): number {
  const totals = entryTotals(entry);
  return grandTotal(totals);
}

export function sumAmounts(entries: ExpenseEntry["fuel"]): number {
  return entries.reduce((total, entry) => total + entry.amount, 0);
}

export function sumRoutes(entry: ExpenseEntry): number {
  return entry.routes.reduce((total, route) => total + route.kilometers, 0);
}

export function entryTotals(entry: ExpenseEntry): ExpenseTotals {
  return {
    kilometers: sumRoutes(entry),
    fuel: sumAmounts(entry.fuel),
    parking: sumAmounts(entry.parking),
    tolls: sumAmounts(entry.tolls),
    dining: sumAmounts(entry.dining),
    other: sumAmounts(entry.other),
  };
}
