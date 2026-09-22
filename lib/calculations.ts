import { MILEAGE_RATE } from "@/lib/constants";
import type { ExpenseEntry, ExpenseTotals, MonthSummary } from "@/lib/types";

export function sumExpenseTotals(entries: ExpenseEntry[]): ExpenseTotals {
  return entries.reduce(
    (acc, entry) => ({
      kilometers: acc.kilometers + entry.kilometers,
      parking: acc.parking + entry.parking,
      tolls: acc.tolls + entry.tolls,
      dining: acc.dining + entry.dining,
      other: acc.other + entry.other,
    }),
    { kilometers: 0, parking: 0, tolls: 0, dining: 0, other: 0 },
  );
}

export function mileageReimbursement(kilometers: number): number {
  return kilometers * MILEAGE_RATE;
}

export function outOfPocketTotal(totals: Omit<ExpenseTotals, "kilometers">): number {
  return totals.parking + totals.tolls + totals.dining + totals.other;
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
  return mileageReimbursement(entry.kilometers) + outOfPocketTotal(entry);
}
