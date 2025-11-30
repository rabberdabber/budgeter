import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  List,
  TrendingDown,
  TrendingUp,
  Wallet,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    title: "Budget Tracker",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Current month budget overview",
  },
  {
    title: "All Transactions",
    href: "/dashboard/all",
    icon: List,
    description: "Complete transaction history",
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: TrendingDown,
    description: "View all expenses",
  },
  {
    title: "Income",
    href: "/dashboard/income",
    icon: TrendingUp,
    description: "View all income",
  },
  {
    title: "By Category",
    href: "/dashboard/by-category",
    icon: Wallet,
    description: "Kanban board view",
  },
  {
    title: "Overview",
    href: "/dashboard/overview",
    icon: BarChart3,
    description: "Charts and visualizations",
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <DollarSign className="h-6 w-6" />
            <span>Budget Tracker</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 space-y-0.5 px-3">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <Link href="/api/auth/signout">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
