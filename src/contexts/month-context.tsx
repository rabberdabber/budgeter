"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MonthContextType {
  selectedYear: number;
  selectedMonth: number;
  setMonth: (year: number, month: number) => void;
  getMonthLabel: () => string;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const setMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const getMonthLabel = () => {
    return new Date(selectedYear, selectedMonth).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MonthContext.Provider
      value={{ selectedYear, selectedMonth, setMonth, getMonthLabel }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
}
