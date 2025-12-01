import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { getTransactions } from "@/lib/firestore-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const transactions = await getTransactions();

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      transactions={transactions}
    >
      {children}
    </DashboardShell>
  );
}
