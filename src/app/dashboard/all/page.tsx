import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { TransactionsTable } from "@/components/transactions-table";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

export default async function AllTransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions(session.user.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
          <p className="text-muted-foreground">
            Complete history of all expenses and income
          </p>
        </div>
        <AddTransactionDialog userId={session.user.id} />
      </div>
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
