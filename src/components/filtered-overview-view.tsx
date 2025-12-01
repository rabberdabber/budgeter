"use client";

import { useMemo } from "react";
import { Transaction, BudgetLimit } from "@/types/models";
import { useMonth } from "@/contexts/month-context";
import { SpendingOverviewChart } from "@/components/charts/spending-overview-chart";
import { MonthlySpendingChart } from "@/components/charts/monthly-spending-chart";
import { SpendingByCategoryChart } from "@/components/charts/spending-by-category-chart";
import { BudgetVsActualChart } from "@/components/charts/budget-vs-actual-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilteredOverviewViewProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

export function FilteredOverviewView({ transactions, budgetLimits }: FilteredOverviewViewProps) {
  const { selectedYear, selectedMonth, getMonthLabel } = useMonth();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {getMonthLabel()} • Spending patterns and budget performance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">Monthly</TabsTrigger>
          <TabsTrigger value="category" className="text-xs sm:text-sm">Category</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs sm:text-sm">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SpendingOverviewChart transactions={filteredTransactions} />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <MonthlySpendingChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <SpendingByCategoryChart transactions={filteredTransactions} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetVsActualChart
            transactions={filteredTransactions}
            budgetLimits={budgetLimits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
