import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { FilteredKanbanView } from "@/components/filtered-kanban-view";

export default async function ByCategoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();

  return <FilteredKanbanView transactions={transactions} />;
}
