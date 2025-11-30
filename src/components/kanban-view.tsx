"use client";

import { Transaction, CATEGORIES, Category } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanViewProps {
  transactions: Transaction[];
}

export function KanbanView({ transactions }: KanbanViewProps) {
  const categoriesWithTransactions = CATEGORIES.map((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === category
    );
    const total = categoryTransactions.reduce((sum, t) => {
      if (t.type === "expense") {
        return sum - t.amount;
      }
      return sum + t.amount;
    }, 0);

    return {
      category,
      transactions: categoryTransactions,
      total,
    };
  }).filter((cat) => cat.transactions.length > 0);

  if (categoriesWithTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">No transactions found.</p>
          <p className="text-sm text-muted-foreground">
            Add your first transaction to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categoriesWithTransactions.map(({ category, transactions, total }) => (
        <Card key={category} className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{category}</CardTitle>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
              </span>
              <span className={`text-sm font-semibold ${total < 0 ? "text-destructive" : "text-green-600"}`}>
                {formatCurrency(Math.abs(total))}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className="p-3 hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm">
                          {transaction.description}
                        </span>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "secondary"
                          }
                          className="shrink-0"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatDate(transaction.date)}
                        </span>
                        <span
                          className={`font-mono font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      {transaction.comments && (
                        <p className="text-xs text-muted-foreground">
                          {transaction.comments}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
