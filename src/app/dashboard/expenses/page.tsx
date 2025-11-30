import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { TransactionsTable } from "@/components/transactions-table";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const allTransactions = await getTransactions(session.user.id);
  const expenses = allTransactions.filter((t) => t.type === "expense");

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Total: ₩{totalExpenses.toLocaleString("ko-KR")}
          </p>
        </div>
        <AddTransactionDialog userId={session.user.id} />
      </div>
      <TransactionsTable transactions={expenses} />
    </div>
  );
}
