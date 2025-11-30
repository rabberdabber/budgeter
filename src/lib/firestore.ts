import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { Transaction, BudgetLimit } from "@/types/models";

// Transactions
export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
) => {
  const transactionsRef = collection(firestore, "transactions");
  const now = new Date().toISOString();

  const docRef = await addDoc(transactionsRef, {
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
  const transactionRef = doc(firestore, "transactions", id);
  await updateDoc(transactionRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteTransaction = async (id: string) => {
  const transactionRef = doc(firestore, "transactions", id);
  await deleteDoc(transactionRef);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const transactionsRef = collection(firestore, "transactions");
  const q = query(transactionsRef, orderBy("date", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
};

// Budget Limits
export const addBudgetLimit = async (
  budgetLimit: Omit<BudgetLimit, "id" | "createdAt" | "updatedAt">
) => {
  const budgetLimitsRef = collection(firestore, "budgetLimits");
  const now = new Date().toISOString();

  const docRef = await addDoc(budgetLimitsRef, {
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
  const budgetLimitRef = doc(firestore, "budgetLimits", id);
  await updateDoc(budgetLimitRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteBudgetLimit = async (id: string) => {
  const budgetLimitRef = doc(firestore, "budgetLimits", id);
  await deleteDoc(budgetLimitRef);
};

export const getBudgetLimits = async (): Promise<BudgetLimit[]> => {
  const budgetLimitsRef = collection(firestore, "budgetLimits");
  const snapshot = await getDocs(budgetLimitsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BudgetLimit[];
};
