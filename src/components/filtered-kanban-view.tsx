"use client";

import { useMemo } from "react";
import { Transaction } from "@/types/models";
import { useMonth } from "@/contexts/month-context";
import { KanbanView } from "@/components/kanban-view";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

interface FilteredKanbanViewProps {
  transactions: Transaction[];
}

export function FilteredKanbanView({ transactions }: FilteredKanbanViewProps) {
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">By Category</h1>
          <p className="text-sm text-muted-foreground">
            {getMonthLabel()} • Kanban board view
          </p>
        </div>
        <AddTransactionDialog />
      </div>
      <KanbanView transactions={filteredTransactions} />
    </div>
  );
}
