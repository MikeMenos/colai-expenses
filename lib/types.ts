export type ExpenseEntry = {
  id: string;
  date: string;
  licensePlate: string;
  route: string;
  kilometers: number;
  fuel: number;
  parking: number;
  tolls: number;
  dining: number;
  other: number;
  createdAt: string;
};

export type ExpenseTotals = {
  kilometers: number;
  fuel: number;
  parking: number;
  tolls: number;
  dining: number;
  other: number;
};

export type MonthSummary = {
  month: string;
  totals: ExpenseTotals;
  mileageReimbursement: number;
  grandTotal: number;
  entryCount: number;
};

export type CreateExpenseInput = {
  date: string;
  licensePlate: string;
  route: string;
  kilometers: number;
  fuel: number;
  parking: number;
  tolls: number;
  dining: number;
  other: number;
};
