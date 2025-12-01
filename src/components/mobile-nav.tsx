"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  List,
  TrendingDown,
  TrendingUp,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/models";
import { MonthSelector } from "@/components/month-selector";

interface MobileNavProps {
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

export function MobileNav({ user, transactions = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-2">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent direction="left" className="h-full w-[280px]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setOpen(false)}
              >
                <DollarSign className="h-5 w-5" />
                <DrawerTitle>Budget Tracker</DrawerTitle>
              </Link>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
            <Link href="/api/auth/signout" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>

      <MonthSelector transactions={transactions} />

      <Link href="/dashboard" className="flex items-center gap-1">
        <DollarSign className="h-5 w-5" />
      </Link>
    </header>
  );
}
