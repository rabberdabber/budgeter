"use client";

import { Transaction, CATEGORIES } from "@/types/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface SpendingOverviewChartProps {
  transactions: Transaction[];
}

export function SpendingOverviewChart({ transactions }: SpendingOverviewChartProps) {
  const isMobile = useIsMobile();
  const expenses = transactions.filter((t) => t.type === "expense");

  const data = CATEGORIES.map((category) => {
    const categoryExpenses = expenses.filter((t) => t.category === category);
    const total = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);

    return {
      category,
      shortCategory: category.length > 8 ? category.slice(0, 6) + "..." : category,
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
          <div className="flex h-[250px] md:h-[300px] items-center justify-center text-muted-foreground">
            No expense data available
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
