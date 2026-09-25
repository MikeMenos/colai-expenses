"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import {
  CalendarIcon,
  CircleParking,
  Fuel,
  Plus,
  Route as RouteIcon,
  Tickets,
  Trash2,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
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
import { useCreateExpense, useUpdateExpense } from "@/hooks/use-expenses";
import { mileageReimbursement } from "@/lib/calculations";
import { ROUTE_PRESETS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import { isDateInMonth, parseMonth } from "@/lib/month";
import type { CreateExpenseInput, ExpenseEntry } from "@/lib/types";
import {
  createExpenseSchema,
  type CreateExpenseFormValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type ExpenseFormProps = {
  month: string;
  initialDate?: string;
  existingEntry?: ExpenseEntry;
};

type AmountFieldName = "fuel" | "parking" | "tolls" | "dining" | "other";

const AMOUNT_SECTIONS: {
  name: AmountFieldName;
  label: string;
  addLabel: string;
  icon: LucideIcon;
  iconClassName: string;
}[] = [
  {
    name: "fuel",
    label: "Καύσιμα",
    addLabel: "Προσθήκη άλλου εξόδου καυσίμων",
    icon: Fuel,
    iconClassName: "bg-surface-teal text-accent-teal-ink",
  },
  {
    name: "parking",
    label: "Parking",
    addLabel: "Προσθήκη άλλου εξόδου parking",
    icon: CircleParking,
    iconClassName: "bg-surface-blue text-accent-blue-ink",
  },
  {
    name: "tolls",
    label: "Διόδια",
    addLabel: "Προσθήκη άλλου εξόδου διοδίων",
    icon: Tickets,
    iconClassName: "bg-surface-amber text-accent-amber-ink",
  },
  {
    name: "dining",
    label: "Έξοδα εστίασης",
    addLabel: "Προσθήκη άλλου εξόδου εστίασης",
    icon: Utensils,
    iconClassName: "bg-surface-teal text-accent-teal-ink",
  },
  {
    name: "other",
    label: "Άλλο",
    addLabel: "Προσθήκη άλλου εξόδου",
    icon: WalletCards,
    iconClassName: "bg-surface-blue text-accent-blue-ink",
  },
];

function initialValues(
  date: string,
  entry?: ExpenseEntry,
): CreateExpenseFormValues {
  if (!entry) {
    return {
      date,
      licensePlate: "",
      routes: [{ route: "", kilometers: 0 }],
      fuel: [{ amount: 0 }],
      parking: [{ amount: 0 }],
      tolls: [{ amount: 0 }],
      dining: [{ amount: 0 }],
      other: [{ amount: 0 }],
    };
  }

  return {
    date: entry.date,
    licensePlate: entry.licensePlate,
    routes: entry.routes.length ? entry.routes : [{ route: "", kilometers: 0 }],
    fuel: entry.fuel.length ? entry.fuel : [{ amount: 0 }],
    parking: entry.parking.length ? entry.parking : [{ amount: 0 }],
    tolls: entry.tolls.length ? entry.tolls : [{ amount: 0 }],
    dining: entry.dining.length ? entry.dining : [{ amount: 0 }],
    other: entry.other.length ? entry.other : [{ amount: 0 }],
  };
}

export function ExpenseForm({
  month,
  initialDate,
  existingEntry,
}: ExpenseFormProps) {
  const router = useRouter();
  const createMutation = useCreateExpense(month);
  const updateMutation = useUpdateExpense(month);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const monthStart = parseMonth(month);
  const defaultDate = initialDate && isDateInMonth(initialDate, month)
    ? initialDate
    : format(monthStart, "yyyy-MM-dd");

  const form = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: initialValues(defaultDate, existingEntry),
  });

  const routes = useFieldArray({ control: form.control, name: "routes" });
  const fuel = useFieldArray({ control: form.control, name: "fuel" });
  const parking = useFieldArray({ control: form.control, name: "parking" });
  const tolls = useFieldArray({ control: form.control, name: "tolls" });
  const dining = useFieldArray({ control: form.control, name: "dining" });
  const other = useFieldArray({ control: form.control, name: "other" });
  const amountArrays = { fuel, parking, tolls, dining, other };

  const watched = useWatch({ control: form.control });
  const watchedDate = watched.date ?? defaultDate;
  const watchedRoutes = watched.routes ?? [];
  const [selectedYear, selectedMonth, selectedDay] = watchedDate
    .split("-")
    .map(Number);
  const parsedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const selectedDate = Number.isNaN(parsedDate.getTime()) ? monthStart : parsedDate;
  const [calendarMonth, setCalendarMonth] = useState(selectedDate);

  const kilometers = watchedRoutes.reduce(
    (sum, route) => sum + (Number(route.kilometers) || 0),
    0,
  );
  const dayReimbursement = mileageReimbursement(kilometers);
  const dayOutOfPocket = AMOUNT_SECTIONS.reduce(
    (total, section) =>
      total +
      (watched[section.name] ?? []).reduce(
        (sum, expense) => sum + (Number(expense.amount) || 0),
        0,
      ),
    0,
  );
  const dayTotal = dayReimbursement + dayOutOfPocket;
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: CreateExpenseFormValues) {
    setSubmitError(null);
    const payload: CreateExpenseInput = {
      ...values,
      routes: values.routes.filter(
        (route) => route.route.trim().length > 0 || route.kilometers > 0,
      ),
      fuel: values.fuel.filter((expense) => expense.amount > 0),
      parking: values.parking.filter((expense) => expense.amount > 0),
      tolls: values.tolls.filter((expense) => expense.amount > 0),
      dining: values.dining.filter((expense) => expense.amount > 0),
      other: values.other.filter((expense) => expense.amount > 0),
    };

    try {
      if (existingEntry) {
        await updateMutation.mutateAsync({ id: existingEntry.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      router.push(`/?month=${payload.date.slice(0, 7)}`);
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
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      <Card>
        <CardContent className="grid grid-cols-2 items-start gap-2 px-3 pt-4 sm:gap-4 sm:px-6 sm:pt-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="expense-date">Ημερομηνία</Label>
            <Popover>
              <PopoverTrigger
                id="expense-date"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-8 w-full min-w-0 justify-start gap-1 overflow-hidden px-2 text-left font-normal sm:gap-1.5 sm:px-2.5",
                  !watchedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4" />
                <span className="truncate">
                  {watchedDate
                    ? format(selectedDate, "d MMM yyyy", { locale: el })
                    : "Επιλέξτε ημερομηνία"}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setCalendarMonth(date);
                      form.setValue("date", format(date, "yyyy-MM-dd"), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  captionLayout="dropdown"
                  navLayout="after"
                  startMonth={new Date(monthStart.getFullYear() - 10, 0, 1)}
                  endMonth={new Date(monthStart.getFullYear() + 10, 11, 1)}
                  locale={el}
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && (
              <FieldError message={form.formState.errors.date.message} />
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="licensePlate" className="truncate">
              Αριθμ. Κυκλοφορίας
            </Label>
            <Input
              id="licensePlate"
              placeholder="π.χ. XZP 6790"
              aria-invalid={Boolean(form.formState.errors.licensePlate)}
              {...form.register("licensePlate")}
            />
            {form.formState.errors.licensePlate && (
              <FieldError message={form.formState.errors.licensePlate.message} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CategoryIcon
              icon={RouteIcon}
              className="bg-surface-blue text-accent-blue-ink"
            />
            Διαδρομές
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {routes.fields.map((field, index) => {
            const routeError = form.formState.errors.routes?.[index];
            return (
              <div
                key={field.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Διαδρομή {index + 1}</h3>
                  {routes.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => routes.remove(index)}
                      aria-label={`Αφαίρεση διαδρομής ${index + 1}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`routes.${index}.route`}>Περιγραφή</Label>
                    <div className="flex flex-wrap gap-2">
                      {ROUTE_PRESETS.map((preset) => (
                        <Badge
                          key={preset.value}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() =>
                            form.setValue(`routes.${index}.route`, preset.value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          {preset.label}
                        </Badge>
                      ))}
                    </div>
                    <textarea
                      id={`routes.${index}.route`}
                      rows={2}
                      aria-invalid={Boolean(routeError?.route)}
                      className="flex min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30"
                      placeholder="Περιγραφή διαδρομής"
                      {...form.register(`routes.${index}.route`)}
                    />
                    {routeError?.route && <FieldError message={routeError.route.message} />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`routes.${index}.kilometers`}>Χιλιόμετρα</Label>
                    <Input
                      id={`routes.${index}.kilometers`}
                      type="number"
                      min={0}
                      step="0.1"
                      aria-invalid={Boolean(routeError?.kilometers)}
                      {...form.register(`routes.${index}.kilometers`, {
                        setValueAs: (value) => value === "" ? 0 : Number(value),
                      })}
                    />
                    {routeError?.kilometers && (
                      <FieldError message={routeError.kilometers.message} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {canAddRoute(watchedRoutes) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => routes.append({ route: "", kilometers: 0 })}
            >
              <Plus />
              Προσθήκη άλλης διαδρομής
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 md:grid-cols-2">
        {AMOUNT_SECTIONS.map((section) => (
          <AmountSection
            key={section.name}
            form={form}
            name={section.name}
            label={section.label}
            addLabel={section.addLabel}
            icon={section.icon}
            iconClassName={section.iconClassName}
            fields={amountArrays[section.name].fields}
            append={() => amountArrays[section.name].append({ amount: 0 })}
            remove={amountArrays[section.name].remove}
          />
        ))}
      </div>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <div className="sticky bottom-0 z-40 -mx-4 mt-2 border-t border-brand-blue/10 bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Σύνολο ημέρας
            </p>
            <p className="text-2xl leading-tight font-semibold tracking-tight tabular-nums text-accent-blue-ink">
              {formatCurrency(dayTotal)}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatNumber(kilometers, 0)} km συνολικά
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/?month=${month}`)}
              className="min-h-11"
            >
              Ακύρωση
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-h-11 px-5"
            >
              {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function AmountSection({
  form,
  name,
  label,
  addLabel,
  icon,
  iconClassName,
  fields,
  append,
  remove,
}: {
  form: UseFormReturn<CreateExpenseFormValues>;
  name: AmountFieldName;
  label: string;
  addLabel: string;
  icon: LucideIcon;
  iconClassName: string;
  fields: { id: string; amount: number }[];
  append: () => void;
  remove: (index: number) => void;
}) {
  const values = useWatch({ control: form.control, name });
  const errors = form.formState.errors[name];
  const canAdd = values.length > 0 && Number(values.at(-1)?.amount) > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CategoryIcon icon={icon} className={iconClassName} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.map((field, index) => {
          const error = errors?.[index]?.amount;
          const id = `${name}.${index}.amount`;
          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Label htmlFor={id}>{label} {index + 1}</Label>
                <div className="relative">
                  <Input
                    id={id}
                    type="number"
                    min={0}
                    step="0.01"
                    aria-invalid={Boolean(error)}
                    className="pr-8"
                    {...form.register(`${name}.${index}.amount`, {
                      setValueAs: (value) => value === "" ? 0 : Number(value),
                    })}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                    €
                  </span>
                </div>
                {error && <FieldError message={error.message} />}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  aria-label={`Αφαίρεση ${label.toLocaleLowerCase("el")} ${index + 1}`}
                  className="mt-6 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          );
        })}

        {canAdd && (
          <Button type="button" variant="outline" size="sm" onClick={append}>
            <Plus />
            {addLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("flex size-8 items-center justify-center rounded-lg", className)}
    >
      <Icon className="size-4" />
    </span>
  );
}

function canAddRoute(
  routes: { route?: string; kilometers?: number }[],
): boolean {
  const last = routes.at(-1);
  return Boolean(last?.route?.trim()) && Number(last?.kilometers) > 0;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
