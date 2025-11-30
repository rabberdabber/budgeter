"use client";

import { Transaction, CATEGORIES } from "@/types/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface SpendingOverviewChartProps {
  transactions: Transaction[];
}

export function SpendingOverviewChart({ transactions }: SpendingOverviewChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const data = CATEGORIES.map((category) => {
    const categoryExpenses = expenses.filter((t) => t.category === category);
    const total = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);

    return {
      category,
      total,
    };
  }).filter((d) => d.total > 0);

  const chartConfig = {
    total: {
      label: "Total Spent",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
        <CardDescription>Total spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data available
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
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
