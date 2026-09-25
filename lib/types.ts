export type RouteExpense = {
  route: string;
  kilometers: number;
};

export type AmountExpense = {
  amount: number;
};

export type ExpenseEntry = {
  id: string;
  date: string;
  licensePlate: string;
  routes: RouteExpense[];
  fuel: AmountExpense[];
  parking: AmountExpense[];
  tolls: AmountExpense[];
  dining: AmountExpense[];
  other: AmountExpense[];
  createdAt: string;
  updatedAt: string;
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
  routes: RouteExpense[];
  fuel: AmountExpense[];
  parking: AmountExpense[];
  tolls: AmountExpense[];
  dining: AmountExpense[];
  other: AmountExpense[];
};
