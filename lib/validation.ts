import { z } from "zod";

const routeExpenseSchema = z.object({
  route: z.string().trim(),
  kilometers: z.number().min(0, "Τα χιλιόμετρα δεν μπορεί να είναι αρνητικά"),
});

const routeExpensesSchema = z.array(routeExpenseSchema).superRefine(
  (routes, context) => {
    routes.forEach((route, index) => {
      const hasRoute = route.route.length > 0;
      const hasKilometers = route.kilometers > 0;
      const isOnlyEmptyPlaceholder =
        routes.length === 1 && !hasRoute && !hasKilometers;

      if (isOnlyEmptyPlaceholder) return;

      if (!hasRoute) {
        context.addIssue({
          code: "custom",
          message: "Η διαδρομή είναι υποχρεωτική",
          path: [index, "route"],
        });
      }
      if (!hasKilometers) {
        context.addIssue({
          code: "custom",
          message: "Τα χιλιόμετρα είναι υποχρεωτικά",
          path: [index, "kilometers"],
        });
      }
    });
  },
);

const amountExpenseSchema = z.object({
  amount: z.number().min(0, "Το ποσό δεν μπορεί να είναι αρνητικό"),
});

const amountExpensesSchema = z.array(amountExpenseSchema).superRefine(
  (expenses, context) => {
    if (expenses.length <= 1) return;

    expenses.forEach((expense, index) => {
      if (expense.amount <= 0) {
        context.addIssue({
          code: "custom",
          message: "Το ποσό είναι υποχρεωτικό",
          path: [index, "amount"],
        });
      }
    });
  },
);

export const createExpenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  licensePlate: z.string().trim().min(1, "License plate is required"),
  routes: routeExpensesSchema,
  fuel: amountExpensesSchema,
  parking: amountExpensesSchema,
  tolls: amountExpensesSchema,
  dining: amountExpensesSchema,
  other: amountExpensesSchema,
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;
