import { format } from "date-fns";
import { el } from "date-fns/locale";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("el-GR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function parseDateEl(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateEl(dateStr: string): string {
  return new Intl.DateTimeFormat("el-GR").format(parseDateEl(dateStr));
}

export function formatDayMonthEl(dateStr: string): string {
  return format(parseDateEl(dateStr), "d MMM", { locale: el });
}

export function formatWeekdayEl(dateStr: string): string {
  return format(parseDateEl(dateStr), "EEE", { locale: el });
}

export function formatAccessibleDateEl(dateStr: string): string {
  return format(parseDateEl(dateStr), "EEEE d MMMM yyyy", { locale: el });
}
