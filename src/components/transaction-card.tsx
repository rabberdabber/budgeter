"use client";

import { Transaction } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/transactions?id=${transaction.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">
                {formatDate(transaction.date)}
              </span>
              <Badge
                variant={transaction.type === "income" ? "default" : "secondary"}
                className="text-xs"
              >
                {transaction.type}
              </Badge>
            </div>
            <h4 className="font-medium text-sm truncate">
              {transaction.description}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {transaction.category}
              </span>
            </div>
            {transaction.comments && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {transaction.comments}
              </p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span
              className={`font-mono font-semibold text-sm whitespace-nowrap ${
                transaction.type === "income" ? "text-green-600" : "text-foreground"
              }`}
            >
              {transaction.type === "income" ? "+" : ""}
              {formatCurrency(transaction.amount)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2"
                  disabled={isDeleting}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TransactionCardListProps {
  transactions: Transaction[];
}

export function TransactionCardList({ transactions }: TransactionCardListProps) {
  if (transactions.length === 0) {
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
    <div>
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
