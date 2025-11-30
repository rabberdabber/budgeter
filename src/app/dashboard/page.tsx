import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions, getBudgetLimits } from "@/lib/firestore-server";
import { BudgetTrackerView } from "@/components/budget-tracker-view";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { AddBudgetLimitDialog } from "@/components/add-budget-limit-dialog";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch data
  const transactions = await getTransactions(session.user.id);
  const budgetLimits = await getBudgetLimits(session.user.id);

  // Filter for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground">
            {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <AddBudgetLimitDialog userId={session.user.id} />
          <AddTransactionDialog userId={session.user.id} />
        </div>
      </div>
      <BudgetTrackerView
        transactions={currentMonthTransactions}
        budgetLimits={budgetLimits}
      />
    </div>
  );
}
