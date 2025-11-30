import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { TransactionsTable } from "@/components/transactions-table";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

export default async function IncomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const allTransactions = await getTransactions();
  const income = allTransactions.filter((t) => t.type === "income");

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">
            Total: ₩{totalIncome.toLocaleString("ko-KR")}
          </p>
        </div>
        <AddTransactionDialog />
      </div>
      <TransactionsTable transactions={income} />
    </div>
  );
}
