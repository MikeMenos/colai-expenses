import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isValid,
  parseISO,
  startOfMonth,
} from "date-fns";
import { entryTotal } from "@/lib/calculations";
import { parseMonth } from "@/lib/month";
import type { ExpenseEntry } from "@/lib/types";

export type MonthDayEntry = {
  date: string;
  status: "filled" | "empty";
  expenses: ExpenseEntry[];
  total: number;
};

/**
 * Builds one entry per local calendar day. Expense dates are deliberately
 * matched as date-only strings instead of being parsed as UTC timestamps.
 */
export function buildMonthDays(
  month: string,
  expenses: ExpenseEntry[],
): MonthDayEntry[] {
  const expensesByDate = new Map<string, ExpenseEntry[]>();

  for (const expense of expenses) {
    const localDate = localDateKey(expense.date);
    const grouped = expensesByDate.get(localDate);
    if (grouped) {
      grouped.push(expense);
    } else {
      expensesByDate.set(localDate, [expense]);
    }
  }

  const monthDate = parseMonth(month);
  return eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  }).map((day) => {
    const date = format(day, "yyyy-MM-dd");
    const dayExpenses = expensesByDate.get(date) ?? [];

    return {
      date,
      status: dayExpenses.length > 0 ? "filled" : "empty",
      expenses: dayExpenses,
      total: dayExpenses.reduce((sum, expense) => sum + entryTotal(expense), 0),
    };
  });
}

function localDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : value.slice(0, 10);
}
