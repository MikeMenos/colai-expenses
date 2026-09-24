import { z } from "zod";

export const createExpenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  licensePlate: z.string().trim().min(1, "License plate is required"),
  route: z.string().trim().min(1, "Route is required"),
  kilometers: z.number().min(0),
  fuel: z.number().min(0),
  parking: z.number().min(0),
  tolls: z.number().min(0),
  dining: z.number().min(0),
  other: z.number().min(0),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;
