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

export function shiftMonth(month: string, delta: number): string {
  return format(addMonths(parseMonth(month), delta), "yyyy-MM");
}
