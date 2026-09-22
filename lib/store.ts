import { randomUUID } from "crypto";
import type { CreateExpenseInput, ExpenseEntry } from "@/lib/types";

const entries = new Map<string, ExpenseEntry>();

function monthFromDate(date: string): string {
  return date.slice(0, 7);
}

export function listByMonth(month: string): ExpenseEntry[] {
  return Array.from(entries.values())
    .filter((entry) => monthFromDate(entry.date) === month)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getByDate(date: string): ExpenseEntry | undefined {
  return Array.from(entries.values()).find((entry) => entry.date === date);
}

export function create(input: CreateExpenseInput): ExpenseEntry {
  if (getByDate(input.date)) {
    throw new Error("DUPLICATE_DATE");
  }

  const entry: ExpenseEntry = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  entries.set(entry.id, entry);
  return entry;
}

export function deleteById(id: string): boolean {
  return entries.delete(id);
}
