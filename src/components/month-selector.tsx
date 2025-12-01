"use client";

import { useMemo } from "react";
import { useMonth } from "@/contexts/month-context";
import { Transaction } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface MonthSelectorProps {
  transactions?: Transaction[];
}

function getAvailableMonths(transactions: Transaction[]): { year: number; month: number; label: string }[] {
  const monthsSet = new Set<string>();
  const months: { year: number; month: number; label: string }[] = [];

  // Add current month and past 12 months
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthsSet.has(key)) {
      monthsSet.add(key);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
    }
  }

  // Add months from transactions
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthsSet.has(key)) {
      monthsSet.add(key);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
    }
  });

  // Sort by date (newest first)
  months.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return months;
}

export function MonthSelector({ transactions = [] }: MonthSelectorProps) {
  const { selectedYear, selectedMonth, setMonth, getMonthLabel } = useMonth();
  const isMobile = useIsMobile();

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions]
  );

  const currentIndex = availableMonths.findIndex(
    (m) => m.year === selectedYear && m.month === selectedMonth
  );

  const handleMonthChange = (value: string) => {
    const [year, month] = value.split("-").map(Number);
    setMonth(year, month);
  };

  const handlePrevMonth = () => {
    if (currentIndex < availableMonths.length - 1) {
      const prev = availableMonths[currentIndex + 1];
      setMonth(prev.year, prev.month);
    }
  };

  const handleNextMonth = () => {
    if (currentIndex > 0) {
      const next = availableMonths[currentIndex - 1];
      setMonth(next.year, next.month);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handlePrevMonth}
        disabled={currentIndex >= availableMonths.length - 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Select
        value={`${selectedYear}-${selectedMonth}`}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className={isMobile ? "w-[100px] h-8 text-xs" : "w-[130px] h-8 text-sm"}>
          <Calendar className="h-3 w-3 mr-1" />
          <SelectValue>{getMonthLabel()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((m) => (
            <SelectItem key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleNextMonth}
        disabled={currentIndex <= 0}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
