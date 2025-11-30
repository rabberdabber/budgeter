export type TransactionType = "expense" | "income";

export type Category =
  | "Rent"
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Utilities"
  | "Gym/Healthcare"
  | "Entertainment"
  | "Subscriptions"
  | "Laundry/Other"
  | "Miscellaneous"
  | "Income"
  | "Savings";

export const CATEGORIES: Category[] = [
  "Rent",
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Utilities",
  "Gym/Healthcare",
  "Entertainment",
  "Subscriptions",
  "Laundry/Other",
  "Miscellaneous",
  "Income",
  "Savings",
];

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO date string
  type: TransactionType;
  comments?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetLimit {
  id?: string;
  category: Category;
  limit: number;
  userId: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
