import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions, getBudgetLimits } from "@/lib/firestore-server";
import { FilteredOverviewView } from "@/components/filtered-overview-view";

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();
  const budgetLimits = await getBudgetLimits();

  return (
    <FilteredOverviewView
      transactions={transactions}
      budgetLimits={budgetLimits}
    />
  );
}
