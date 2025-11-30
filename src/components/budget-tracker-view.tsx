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

interface BudgetTrackerViewProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
}

export function BudgetTrackerView({
  transactions,
  budgetLimits,
}: BudgetTrackerViewProps) {
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
        return <Badge variant="destructive">Over Budget</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Near Limit</Badge>;
      case "good":
        return <Badge className="bg-green-500">On Track</Badge>;
      default:
        return <Badge variant="outline">No Limit Set</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {activeCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">
              No transactions or budget limits set for this month.
            </p>
            <p className="text-sm text-muted-foreground">
              Add a transaction or set a budget limit to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        activeCategories.map((data) => {
          const status = getStatus(data.totalSpent, data.budgetLimit);
          return (
            <Card key={data.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{data.category}</CardTitle>
                    {data.comments && (
                      <p className="text-sm text-muted-foreground">
                        {data.comments}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {formatCurrency(data.totalSpent)}
                      </span>
                      {data.budgetLimit > 0 && (
                        <span className="text-sm text-muted-foreground">
                          / {formatCurrency(data.budgetLimit)}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </CardHeader>
              {data.transactions.length > 0 && (
                <CardContent>
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
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
