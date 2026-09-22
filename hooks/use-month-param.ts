"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { currentMonth, isValidMonth } from "@/lib/month";

export function useMonthParam(): [string, (month: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = useMemo(() => {
    const param = searchParams.get("month");
    if (param && isValidMonth(param)) return param;
    return currentMonth();
  }, [searchParams]);

  const setMonth = useCallback(
    (nextMonth: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", nextMonth);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return [month, setMonth];
}
