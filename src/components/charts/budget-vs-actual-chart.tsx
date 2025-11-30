"use client";

import { Transaction, BudgetLimit, CATEGORIES } from "@/types/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

export function BudgetVsActualChart({
  transactions,
  budgetLimits,
}: BudgetVsActualChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  // Get current month expenses
  const now = new Date();
  const currentMonthExpenses = expenses.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const data = CATEGORIES.map((category) => {
    const categoryExpenses = currentMonthExpenses.filter((t) => t.category === category);
    const actual = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
    const budgetLimit = budgetLimits.find((bl) => bl.category === category);
    const budget = budgetLimit?.limit || 0;

    return {
      category,
      actual,
      budget,
    };
  }).filter((d) => d.budget > 0 || d.actual > 0);

  const chartConfig = {
    actual: {
      label: "Actual Spending",
      color: "hsl(var(--chart-1))",
    },
    budget: {
      label: "Budget Limit",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
        <CardDescription>Compare your spending against budget limits (Current Month)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No budget data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="budget"
                fill="var(--color-budget)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                fill="var(--color-actual)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
