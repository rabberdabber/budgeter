"use client";

import { Transaction, BudgetLimit, CATEGORIES, Category } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface BudgetTrackerViewProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

function MobileTransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between py-2 border-b last:border-0"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <span className="text-sm font-mono ml-2">
            {formatCurrency(transaction.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BudgetTrackerView({
  transactions,
  budgetLimits,
}: BudgetTrackerViewProps) {
  const isMobile = useIsMobile();

  // Group transactions by category
  const groupedData = CATEGORIES.map((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === category && t.type === "expense"
    );
    const totalSpent = categoryTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const budgetLimit = budgetLimits.find((bl) => bl.category === category);

    return {
      category,
      transactions: categoryTransactions,
      totalSpent,
      budgetLimit: budgetLimit?.limit || 0,
      remaining: (budgetLimit?.limit || 0) - totalSpent,
      comments: budgetLimit?.comments,
    };
  });

  // Filter out categories with no activity and no budget
  const activeCategories = groupedData.filter(
    (data) => data.transactions.length > 0 || data.budgetLimit > 0
  );

  const getStatus = (spent: number, limit: number) => {
    if (limit === 0) return "no-limit";
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "over";
    if (percentage >= 80) return "warning";
    return "good";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "over":
        return <Badge variant="destructive" className="text-xs">Over Budget</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-xs">Near Limit</Badge>;
      case "good":
        return <Badge className="bg-green-500 text-xs">On Track</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">No Limit Set</Badge>;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {activeCategories.length === 0 ? (
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center">
              No transactions or budget limits set for this month.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Add a transaction or set a budget limit to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        activeCategories.map((data) => {
          const status = getStatus(data.totalSpent, data.budgetLimit);
          return (
            <Card key={data.category}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{data.category}</CardTitle>
                    {data.comments && (
                      <p className="text-xs text-muted-foreground truncate">
                        {data.comments}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-lg sm:text-2xl font-bold">
                        {formatCurrency(data.totalSpent)}
                      </span>
                      {data.budgetLimit > 0 && (
                        <span className="text-xs text-muted-foreground">
                          / {formatCurrency(data.budgetLimit)}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </CardHeader>
              {data.transactions.length > 0 && (
                <CardContent className="pt-0">
                  {isMobile ? (
                    <MobileTransactionList transactions={data.transactions} />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
