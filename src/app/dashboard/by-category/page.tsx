import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { KanbanView } from "@/components/kanban-view";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

export default async function ByCategoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">By Category</h1>
          <p className="text-muted-foreground">
            Kanban board view of your transactions
          </p>
        </div>
        <AddTransactionDialog />
      </div>
      <KanbanView transactions={transactions} />
    </div>
  );
}
