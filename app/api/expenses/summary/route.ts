import { NextResponse } from "next/server";
import { buildMonthSummary } from "@/lib/calculations";
import { isValidMonth } from "@/lib/month";
import * as store from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !isValidMonth(month)) {
    return NextResponse.json(
      { error: "Query parameter month (YYYY-MM) is required" },
      { status: 400 },
    );
  }

  const entries = store.listByMonth(month);
  return NextResponse.json(buildMonthSummary(month, entries));
}
