import { db } from "./firebase-admin";
import { Transaction, BudgetLimit } from "@/types/models";

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  const snapshot = await db
    .collection("transactions")
    .orderBy("date", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
};

export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
) => {
  const now = new Date().toISOString();
  const docRef = await db.collection("transactions").add({
    ...transaction,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
) => {
  await db
    .collection("transactions")
    .doc(id)
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
};

export const deleteTransaction = async (id: string) => {
  await db.collection("transactions").doc(id).delete();
};

// Budget Limits
export const getBudgetLimits = async (): Promise<BudgetLimit[]> => {
  const snapshot = await db
    .collection("budgetLimits")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BudgetLimit[];
};

export const addBudgetLimit = async (
  budgetLimit: Omit<BudgetLimit, "id" | "createdAt" | "updatedAt">
) => {
  const now = new Date().toISOString();
  const docRef = await db.collection("budgetLimits").add({
    ...budgetLimit,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

export const updateBudgetLimit = async (
  id: string,
  updates: Partial<BudgetLimit>
) => {
  await db
    .collection("budgetLimits")
    .doc(id)
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
};

export const deleteBudgetLimit = async (id: string) => {
  await db.collection("budgetLimits").doc(id).delete();
};
