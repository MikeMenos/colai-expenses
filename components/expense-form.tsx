"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, lastDayOfMonth } from "date-fns";
import { el } from "date-fns/locale";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { isAxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthPicker } from "@/components/month-picker";
import { useCreateExpense } from "@/hooks/use-expenses";
import { mileageReimbursement } from "@/lib/calculations";
import { MILEAGE_RATE, ROUTE_PRESETS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { parseMonth } from "@/lib/month";
import {
  createExpenseSchema,
  type CreateExpenseFormValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type ExpenseFormProps = {
  month: string;
  onMonthChange: (month: string) => void;
};

export function ExpenseForm({ month, onMonthChange }: ExpenseFormProps) {
  const router = useRouter();
  const createMutation = useCreateExpense(month);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const monthStart = parseMonth(month);
  const monthEnd = lastDayOfMonth(monthStart);

  const form = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      date: format(monthStart, "yyyy-MM-dd"),
      licensePlate: "",
      route: "",
      kilometers: 0,
      parking: 0,
      tolls: 0,
      dining: 0,
      other: 0,
    },
  });

  const watched = form.watch();
  const selectedDate = useMemo(() => {
    try {
      const [y, m, d] = watched.date.split("-").map(Number);
      return new Date(y, m - 1, d);
    } catch {
      return monthStart;
    }
  }, [watched.date, monthStart]);

  const dayReimbursement = mileageReimbursement(Number(watched.kilometers) || 0);
  const dayOutOfPocket =
    (Number(watched.parking) || 0) +
    (Number(watched.tolls) || 0) +
    (Number(watched.dining) || 0) +
    (Number(watched.other) || 0);
  const dayTotal = dayReimbursement + dayOutOfPocket;

  async function onSubmit(values: CreateExpenseFormValues) {
    setSubmitError(null);
    try {
      await createMutation.mutateAsync(values);
      router.push(`/?month=${month}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setSubmitError("Υπάρχει ήδη καταχώρηση για αυτή την ημερομηνία.");
        return;
      }
      setSubmitError("Αποτυχία αποθήκευσης. Δοκιμάστε ξανά.");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex max-w-2xl flex-col gap-6"
    >
      <MonthPicker value={month} onChange={onMonthChange} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Ημερομηνία</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal",
                !watched.date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {watched.date
                ? format(selectedDate, "d MMMM yyyy", { locale: el })
                : "Επιλέξτε ημερομηνία"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    form.setValue("date", format(date, "yyyy-MM-dd"), {
                      shouldValidate: true,
                    });
                  }
                }}
                defaultMonth={monthStart}
                disabled={(date) => date < monthStart || date > monthEnd}
                locale={el}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.date && (
            <p className="text-sm text-destructive">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="licensePlate">Αριθ. κυκλοφορίας</Label>
          <Input
            id="licensePlate"
            placeholder="π.χ. XZP 6790"
            {...form.register("licensePlate")}
          />
          {form.formState.errors.licensePlate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.licensePlate.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="route">Διαδρομή</Label>
        <div className="flex flex-wrap gap-2">
          {ROUTE_PRESETS.map((preset) => (
            <Badge
              key={preset.value}
              variant="outline"
              className="cursor-pointer hover:bg-muted"
              onClick={() =>
                form.setValue("route", preset.value, { shouldValidate: true })
              }
            >
              {preset.label}
            </Badge>
          ))}
        </div>
        <textarea
          id="route"
          rows={3}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          placeholder="Περιγραφή διαδρομής ή σημείωση ημέρας"
          {...form.register("route")}
        />
        {form.formState.errors.route && (
          <p className="text-sm text-destructive">
            {form.formState.errors.route.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Χιλιόμετρα"
          id="kilometers"
          step="1"
          register={form.register("kilometers", { valueAsNumber: true })}
          error={form.formState.errors.kilometers?.message}
        />
        <NumberField
          label="Parking"
          id="parking"
          step="0.01"
          register={form.register("parking", { valueAsNumber: true })}
          error={form.formState.errors.parking?.message}
        />
        <NumberField
          label="Διόδια"
          id="tolls"
          step="0.01"
          register={form.register("tolls", { valueAsNumber: true })}
          error={form.formState.errors.tolls?.message}
        />
        <NumberField
          label="Έξοδα εστίασης"
          id="dining"
          step="0.01"
          register={form.register("dining", { valueAsNumber: true })}
          error={form.formState.errors.dining?.message}
        />
        <NumberField
          label="Άλλο"
          id="other"
          step="0.01"
          register={form.register("other", { valueAsNumber: true })}
          error={form.formState.errors.other?.message}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Προεπισκόπηση ημέρας</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            Αποζημίωση χιλιομέτρων ({MILEAGE_RATE} €/km):{" "}
            <strong>{formatCurrency(dayReimbursement)}</strong>
          </p>
          <p>
            Έξοδα εκτός αποζημίωσης:{" "}
            <strong>{formatCurrency(dayOutOfPocket)}</strong>
          </p>
          <p className="text-base font-semibold">
            Σύνολο ημέρας: {formatCurrency(dayTotal)}
          </p>
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">{submitError}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Καταχώρηση…" : "Καταχώρηση"}
          {!createMutation.isPending && <ArrowRight className="size-4" />}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          Ακύρωση
        </Button>
      </div>
    </form>
  );
}

function NumberField({
  label,
  id,
  step,
  register,
  error,
}: {
  label: string;
  id: string;
  step: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" min={0} step={step} {...register} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
