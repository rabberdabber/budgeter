"use client";

import { useMemo } from "react";
import { Transaction, BudgetLimit } from "@/types/models";
import { BudgetTrackerView } from "@/components/budget-tracker-view";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { AddBudgetLimitDialog } from "@/components/add-budget-limit-dialog";
import { useMonth } from "@/contexts/month-context";

interface BudgetTrackerWithMonthSelectorProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

export function BudgetTrackerWithMonthSelector({
  transactions,
  budgetLimits,
}: BudgetTrackerWithMonthSelectorProps) {
  const { selectedYear, selectedMonth, getMonthLabel } = useMonth();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-sm text-muted-foreground">{getMonthLabel()}</p>
        </div>
        <div className="flex gap-2">
          <AddBudgetLimitDialog />
          <AddTransactionDialog />
        </div>
      </div>
      <BudgetTrackerView
        transactions={filteredTransactions}
        budgetLimits={budgetLimits}
      />
    </div>
  );
}
