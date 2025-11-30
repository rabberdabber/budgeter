import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Decode base64-encoded private key for Vercel deployment
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY, "base64")
      .toString("utf8")
      .replace(/\\n/g, "\n")
  : undefined;

// Initialize Firebase Admin
if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId: "demo-budgeter" });
  } else {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

const db = getFirestore();

// Firestore batch limit is 500 operations
const BATCH_SIZE = 500;

async function commitBatch(
  docs: FirebaseFirestore.QueryDocumentSnapshot[],
  targetUserId: string
): Promise<number> {
  if (docs.length === 0) return 0;

  const batch = db.batch();
  let count = 0;

  for (const doc of docs) {
    if (doc.data().userId !== targetUserId) {
      batch.update(doc.ref, { userId: targetUserId });
      count++;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  return count;
}

async function migrateToUser() {
  console.log("Starting migration...\n");

  // Get user from users collection
  const usersSnapshot = await db.collection("users").limit(1).get();

  if (usersSnapshot.empty) {
    console.error("No user found in users collection. Please log in first.");
    process.exit(1);
  }

  const targetUserId = usersSnapshot.docs[0].id;
  const userData = usersSnapshot.docs[0].data();
  console.log(`Target user: ${userData.name || userData.email || targetUserId}`);
  console.log(`User ID: ${targetUserId}\n`);

  // Use a transaction to read all data atomically
  const { transactionDocs, budgetLimitDocs } = await db.runTransaction(
    async (transaction) => {
      const transactionsSnapshot = await transaction.get(
        db.collection("transactions")
      );
      const budgetLimitsSnapshot = await transaction.get(
        db.collection("budgetLimits")
      );

      return {
        transactionDocs: transactionsSnapshot.docs,
        budgetLimitDocs: budgetLimitsSnapshot.docs,
      };
    }
  );

  console.log(`Total transactions: ${transactionDocs.length}`);
  console.log(`Total budget limits: ${budgetLimitDocs.length}\n`);

  console.log(`Migrating all data to user: ${targetUserId}\n`);

  // Process transactions in batches
  let totalTransactions = 0;
  for (let i = 0; i < transactionDocs.length; i += BATCH_SIZE) {
    const batchDocs = transactionDocs.slice(i, i + BATCH_SIZE);
    const count = await commitBatch(batchDocs, targetUserId);
    totalTransactions += count;
    console.log(
      `Processed transactions batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }: ${count} updated`
    );
  }

  // Process budget limits in batches
  let totalBudgetLimits = 0;
  for (let i = 0; i < budgetLimitDocs.length; i += BATCH_SIZE) {
    const batchDocs = budgetLimitDocs.slice(i, i + BATCH_SIZE);
    const count = await commitBatch(batchDocs, targetUserId);
    totalBudgetLimits += count;
    console.log(
      `Processed budget limits batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }: ${count} updated`
    );
  }

  console.log(`\nMigration complete!`);
  console.log(`- ${totalTransactions} transactions migrated`);
  console.log(`- ${totalBudgetLimits} budget limits migrated`);
}

migrateToUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
