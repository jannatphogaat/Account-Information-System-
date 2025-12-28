import { db } from "./db.js";
import { transactions, redoLog } from "@shared/schema.js";
import { desc, eq } from "drizzle-orm";

export class DatabaseStorage {
  async getTransactions() {
    const all = await db.select().from(transactions).orderBy(transactions.id);
    
    // Calculate balance
    let balance = 0;
    all.forEach(t => {
      if (t.type === 'credit') balance += t.amount;
      else if (t.type === 'debit') balance -= t.amount;
    });

    return { transactions: all, balance };
  }

  async createTransaction(type, amount) {
    const [transaction] = await db
      .insert(transactions)
      .values({ type, amount })
      .returning();
    
    // Clear redo log on new action
    await db.delete(redoLog);

    return transaction;
  }

  async undoLastTransaction() {
    // Get last transaction
    const [last] = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.id))
      .limit(1);

    if (!last) return null;

    // Move to redo log
    await db.insert(redoLog).values({
      type: last.type,
      amount: last.amount,
      createdAt: last.createdAt
    });

    // Delete from transactions
    await db.delete(transactions).where(eq(transactions.id, last.id));

    return last;
  }

  async redoLastUndone() {
    // Get last from redo log
    const [last] = await db
      .select()
      .from(redoLog)
      .orderBy(desc(redoLog.id))
      .limit(1);

    if (!last) return null;

    // Move back to transactions
    await db.insert(transactions).values({
      type: last.type,
      amount: last.amount,
      createdAt: last.createdAt
    });

    // Delete from redo log
    await db.delete(redoLog).where(eq(redoLog.id, last.id));

    return last;
  }
}

export const storage = new DatabaseStorage();
