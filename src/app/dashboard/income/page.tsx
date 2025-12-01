import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions } from "@/lib/firestore-server";
import { FilteredTransactionsView } from "@/components/filtered-transactions-view";

export default async function IncomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();

  return (
    <FilteredTransactionsView
      transactions={transactions}
      title="Income"
      filterType="income"
      showTotal
    />
  );
}
