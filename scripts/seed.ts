import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin
if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId: "demo-budgeter" });
  } else {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

const db = getFirestore();

// Default user ID - will match the first Google login
const userIdArg = process.argv.find((arg) => arg.startsWith("--user="));
const USER_ID = userIdArg?.split("=")[1] || process.env.SEED_USER_ID || "default-user";

// Get CSV file path from command line or use default
const fileArg = process.argv.find((arg) => arg.startsWith("--file="));
const csvPath = fileArg?.split("=")[1] || path.join(__dirname, "../data/november-2025.csv");

// Parse Korean Won amount string to number
function parseAmount(amountStr: string): number {
  // Remove ₩ symbol, commas, whitespace, and handle different encodings
  const cleaned = amountStr.replace(/[₩,\s\u00A9]/g, "").trim();
  return parseInt(cleaned, 10) || 0;
}

// Parse date string to ISO format (YYYY-MM-DD)
function parseDate(dateStr: string): string {
  // Handle "November 27, 2025" format
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // If parsing fails, try to extract manually
    const match = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
    if (match) {
      const [, month, day, year] = match;
      const monthMap: Record<string, string> = {
        January: "01", February: "02", March: "03", April: "04",
        May: "05", June: "06", July: "07", August: "08",
        September: "09", October: "10", November: "11", December: "12",
      };
      return `${year}-${monthMap[month]}-${day.padStart(2, "0")}`;
    }
    return new Date().toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

// Parse CSV content
function parseCSV(content: string) {
  const lines = content.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^\uFEFF/, "")); // Remove BOM

  const transactions: Array<{
    description: string;
    amount: number;
    category: string;
    date: string;
    type: "expense" | "income";
    comments?: string;
  }> = [];

  const budgetLimits: Array<{
    category: string;
    limit: number;
    comments?: string;
  }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line handling quoted values
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    const description = row["Description"] || "";
    const amount = parseAmount(row["Amount"] || "0");
    const budgetLimit = parseAmount(row["Budget Limit"] || "0");
    const category = row["Category"] || "";
    const comments = row["Comments"] || "";
    const date = row["Date"] || "";
    const type = (row["Type"] || "").toLowerCase() as "expense" | "income";

    // Skip budget cap rows for transactions, but extract budget limits
    if (description.includes("Budget Cap")) {
      if (budgetLimit > 0) {
        const limitEntry: { category: string; limit: number; comments?: string } = {
          category,
          limit: budgetLimit,
        };
        if (comments) limitEntry.comments = comments;
        budgetLimits.push(limitEntry);
      }
      continue;
    }

    // Add as transaction if it has an amount
    if (amount > 0) {
      const txEntry: {
        description: string;
        amount: number;
        category: string;
        date: string;
        type: "expense" | "income";
        comments?: string;
      } = {
        description,
        amount,
        category,
        date: parseDate(date),
        type: type === "income" ? "income" : "expense",
      };
      if (comments) txEntry.comments = comments;
      transactions.push(txEntry);
    }
  }

  return { transactions, budgetLimits };
}

async function seed() {
  console.log("Starting seed...");
  console.log(`Using user ID: ${USER_ID}`);
  console.log(`Reading CSV from: ${csvPath}`);

  // Check if CSV file exists
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    console.error("Please provide a valid CSV file path with --file=PATH");
    process.exit(1);
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const { transactions, budgetLimits } = parseCSV(csvContent);

  console.log(`Parsed ${transactions.length} transactions and ${budgetLimits.length} budget limits`);

  // Clear existing data for this user (optional)
  const clearExisting = process.argv.includes("--clear");
  if (clearExisting) {
    console.log("Clearing existing data...");

    const transactionsSnapshot = await db.collection("transactions").where("userId", "==", USER_ID).get();
    const budgetLimitsSnapshot = await db.collection("budgetLimits").where("userId", "==", USER_ID).get();

    const batch = db.batch();
    transactionsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    budgetLimitsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Cleared ${transactionsSnapshot.size} transactions and ${budgetLimitsSnapshot.size} budget limits`);
  }

  // Add transactions
  console.log(`Adding ${transactions.length} transactions...`);
  for (const transaction of transactions) {
    await db.collection("transactions").add({
      ...transaction,
      userId: USER_ID,
      createdAt: new Date().toISOString(),
    });
  }

  // Add budget limits
  console.log(`Adding ${budgetLimits.length} budget limits...`);
  for (const limit of budgetLimits) {
    await db.collection("budgetLimits").add({
      ...limit,
      userId: USER_ID,
      createdAt: new Date().toISOString(),
    });
  }

  console.log("\nSeed completed successfully!");
  console.log("\nSummary:");
  console.log(`- ${transactions.length} transactions added`);
  console.log(`- ${budgetLimits.length} budget limits added`);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  console.log(`\nTotal expenses: ₩${totalExpenses.toLocaleString()}`);
  console.log(`Total income: ₩${totalIncome.toLocaleString()}`);
  console.log(`Net: ₩${(totalIncome - totalExpenses).toLocaleString()}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
