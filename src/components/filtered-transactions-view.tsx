"use client";

import { useMemo } from "react";
import { Transaction } from "@/types/models";
import { useMonth } from "@/contexts/month-context";
import { TransactionsTable } from "@/components/transactions-table";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { formatCurrency } from "@/lib/utils";

interface FilteredTransactionsViewProps {
  transactions: Transaction[];
  title: string;
  filterType?: "all" | "expense" | "income";
  showTotal?: boolean;
}

export function FilteredTransactionsView({
  transactions,
  title,
  filterType = "all",
  showTotal = false,
}: FilteredTransactionsViewProps) {
  const { selectedYear, selectedMonth, getMonthLabel } = useMonth();

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type if specified
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by month
    return filtered.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, filterType, selectedMonth, selectedYear]);

  const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {showTotal ? `${getMonthLabel()} • Total: ${formatCurrency(total)}` : getMonthLabel()}
          </p>
        </div>
        <AddTransactionDialog />
      </div>
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
}
