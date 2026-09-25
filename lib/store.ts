import { randomUUID } from "crypto";
import type { CreateExpenseInput, ExpenseEntry } from "@/lib/types";

const entries = new Map<string, ExpenseEntry>();

type LegacyExpenseEntry = Omit<
  ExpenseEntry,
  "routes" | "fuel" | "parking" | "tolls" | "dining" | "other" | "updatedAt"
> & {
  route: string;
  kilometers: number;
  fuel: number;
  parking: number;
  tolls: number;
  dining: number;
  other: number;
};

function monthFromDate(date: string): string {
  return date.slice(0, 7);
}

export function listByMonth(month: string): ExpenseEntry[] {
  return Array.from(entries.values())
    .filter((entry) => monthFromDate(entry.date) === month)
    .map(normalizeEntry)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getByDate(date: string): ExpenseEntry | undefined {
  const entry = Array.from(entries.values()).find((item) => item.date === date);
  return entry ? normalizeEntry(entry) : undefined;
}

export function create(input: CreateExpenseInput): ExpenseEntry {
  if (getByDate(input.date)) {
    throw new Error("DUPLICATE_DATE");
  }

  const now = new Date().toISOString();
  const entry: ExpenseEntry = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  entries.set(entry.id, entry);
  return entry;
}

export function update(id: string, input: CreateExpenseInput): ExpenseEntry | undefined {
  const stored = entries.get(id);
  if (!stored) return undefined;
  const current = normalizeEntry(stored);

  const reportForDate = getByDate(input.date);
  if (reportForDate && reportForDate.id !== id) {
    throw new Error("DUPLICATE_DATE");
  }

  const entry: ExpenseEntry = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  entries.set(id, entry);
  return entry;
}

export function deleteById(id: string): boolean {
  return entries.delete(id);
}

function normalizeEntry(entry: ExpenseEntry): ExpenseEntry {
  if (Array.isArray(entry.routes)) return entry;

  const legacy = entry as unknown as LegacyExpenseEntry;
  const amount = (value: number) => value > 0 ? [{ amount: value }] : [];
  const routes = legacy.route.trim() || legacy.kilometers > 0
    ? [{ route: legacy.route, kilometers: legacy.kilometers }]
    : [];
  return {
    id: legacy.id,
    date: legacy.date,
    licensePlate: legacy.licensePlate,
    routes,
    fuel: amount(legacy.fuel),
    parking: amount(legacy.parking),
    tolls: amount(legacy.tolls),
    dining: amount(legacy.dining),
    other: amount(legacy.other),
    createdAt: legacy.createdAt,
    updatedAt: legacy.createdAt,
  };
}
