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
import { useIsMobile } from "@/hooks/useMediaQuery";

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

export function BudgetVsActualChart({
  transactions,
  budgetLimits,
}: BudgetVsActualChartProps) {
  const isMobile = useIsMobile();
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
      shortCategory: category.length > 8 ? category.slice(0, 6) + "..." : category,
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
        <CardTitle className="text-base md:text-lg">Budget vs Actual Spending</CardTitle>
        <CardDescription className="text-xs md:text-sm">Compare your spending against budget limits (Current Month)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[250px] md:h-[300px] items-center justify-center text-muted-foreground">
            No budget data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px] w-full">
            <BarChart data={data} margin={{ bottom: isMobile ? 60 : 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={isMobile ? "shortCategory" : "category"}
                angle={-45}
                textAnchor="end"
                height={isMobile ? 80 : 100}
                fontSize={isMobile ? 10 : 12}
                interval={0}
              />
              <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 50 : 60} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.category;
                  }
                  return label;
                }}
              />
              <ChartLegend
                content={<ChartLegendContent />}
                wrapperStyle={isMobile ? { fontSize: '10px' } : {}}
              />
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
