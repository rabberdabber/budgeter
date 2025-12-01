"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { MonthSelector } from "@/components/month-selector";
import { MonthProvider } from "@/contexts/month-context";
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";
import { Transaction } from "@/types/models";
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
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  transactions?: Transaction[];
}

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

export function DashboardShell({ children, user, transactions = [] }: DashboardShellProps) {
  const isDesktop = useMediaQuery(breakpoints.md);
  const pathname = usePathname();

  return (
    <MonthProvider>
      {!isDesktop ? (
        <div className="flex min-h-screen flex-col">
          <MobileNav user={user} transactions={transactions} />
          <main className="flex-1 overflow-y-auto bg-background p-4">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="w-64 flex-col border-r bg-muted/40 flex">
            <div className="flex h-16 items-center border-b px-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <DollarSign className="h-6 w-6" />
                <span>Budget Tracker</span>
              </Link>
            </div>

            {/* Month Selector in Sidebar */}
            <div className="border-b p-3">
              <MonthSelector transactions={transactions} />
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              {user && (
                <div className="mb-3 space-y-0.5 px-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              )}
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
      )}
    </MonthProvider>
  );
}
