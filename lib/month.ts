import { addMonths, format, parse } from "date-fns";
import { el } from "date-fns/locale";

export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function parseMonth(month: string): Date {
  return parse(month, "yyyy-MM", new Date());
}

export function formatMonthLabel(month: string): string {
  const date = parseMonth(month);
  return format(date, "LLLL yyyy", { locale: el });
}

export function monthOptions(count = 12): { value: string; label: string }[] {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = format(d, "yyyy-MM");
    options.push({ value, label: formatMonthLabel(value) });
  }
  return options;
}

export function isValidMonth(month: string): boolean {
  return /^\d{4}-\d{2}$/.test(month);
}

export function isDateInMonth(date: string | null, month: string): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !date.startsWith(`${month}-`)) {
    return false;
  }

  const [year, monthNumber, day] = date.split("-").map(Number);
  const parsed = new Date(year, monthNumber - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === monthNumber - 1 &&
    parsed.getDate() === day
  );
}

export function shiftMonth(month: string, delta: number): string {
  return format(addMonths(parseMonth(month), delta), "yyyy-MM");
}
