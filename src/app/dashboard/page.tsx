import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions, getBudgetLimits } from "@/lib/firestore-server";
import { BudgetTrackerWithMonthSelector } from "@/components/budget-tracker-with-month-selector";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all data - filtering happens client-side
  const transactions = await getTransactions();
  const budgetLimits = await getBudgetLimits();

  return (
    <BudgetTrackerWithMonthSelector
      transactions={transactions}
      budgetLimits={budgetLimits}
    />
  );
}
