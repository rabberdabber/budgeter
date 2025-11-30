import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions, getBudgetLimits } from "@/lib/firestore-server";
import { SpendingOverviewChart } from "@/components/charts/spending-overview-chart";
import { MonthlySpendingChart } from "@/components/charts/monthly-spending-chart";
import { SpendingByCategoryChart } from "@/components/charts/spending-by-category-chart";
import { BudgetVsActualChart } from "@/components/charts/budget-vs-actual-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();
  const budgetLimits = await getBudgetLimits();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Visualize your spending patterns and budget performance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Spending Overview</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SpendingOverviewChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <MonthlySpendingChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <SpendingByCategoryChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetVsActualChart
            transactions={transactions}
            budgetLimits={budgetLimits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
