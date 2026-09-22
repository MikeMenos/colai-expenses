import { NextResponse } from "next/server";
import * as store from "@/lib/store";
import { createExpenseSchema } from "@/lib/validation";
import { isValidMonth } from "@/lib/month";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !isValidMonth(month)) {
    return NextResponse.json(
      { error: "Query parameter month (YYYY-MM) is required" },
      { status: 400 },
    );
  }

  return NextResponse.json(store.listByMonth(month));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const entry = store.create(parsed.data);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_DATE") {
      return NextResponse.json(
        { error: "An entry already exists for this date" },
        { status: 409 },
      );
    }
    throw error;
  }
}
