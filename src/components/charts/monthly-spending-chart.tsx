"use client";

import { Transaction } from "@/types/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface MonthlySpendingChartProps {
  transactions: Transaction[];
}

export function MonthlySpendingChart({ transactions }: MonthlySpendingChartProps) {
  const isMobile = useIsMobile();
  const expenses = transactions.filter((t) => t.type === "expense");

  // Group by month
  const monthlyData = expenses.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0,
        count: 0,
      };
    }

    acc[monthKey].total += transaction.amount;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, { month: string; total: number; count: number }>);

  const data = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  const chartConfig = {
    total: {
      label: "Total Spent",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Track your spending over time</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[250px] md:h-[300px] items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px] w-full">
            <LineChart data={data} margin={{ left: isMobile ? -10 : 0, right: isMobile ? 10 : 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  const [year, month] = value.split("-");
                  return isMobile ? `${month}` : `${month}/${year.slice(2)}`;
                }}
                fontSize={isMobile ? 10 : 12}
                interval={isMobile ? 1 : 0}
              />
              <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 50 : 60} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ r: isMobile ? 3 : 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
