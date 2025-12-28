import { db } from "./db";
import { transactions, redoLog, type Transaction, type InsertTransaction, type RedoEntry } from "@shared/schema";
import { desc, eq, sql } from "drizzle-orm";

export interface IStorage {
  getTransactions(): Promise<{ transactions: Transaction[], balance: number }>;
  createTransaction(type: 'credit' | 'debit', amount: number): Promise<Transaction>;
  undoLastTransaction(): Promise<Transaction | null>;
  redoLastUndone(): Promise<RedoEntry | null>;
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<{ transactions: Transaction[], balance: number }> {
    const all = await db.select().from(transactions).orderBy(transactions.id);
    
    // Calculate balance
    let balance = 0;
    all.forEach(t => {
      if (t.type === 'credit') balance += t.amount;
      else if (t.type === 'debit') balance -= t.amount;
    });

    return { transactions: all, balance };
  }

  async createTransaction(type: 'credit' | 'debit', amount: number): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({ type, amount })
      .returning();
    
    // Clear redo log on new action, similar to standard undo/redo behavior
    await db.delete(redoLog);

    return transaction;
  }

  async undoLastTransaction(): Promise<Transaction | null> {
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

  async redoLastUndone(): Promise<RedoEntry | null> {
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
      createdAt: last.createdAt // Keep original timestamp? Or new? Let's keep original if possible, but schema defaults to now. We can override.
    });

    // Delete from redo log
    await db.delete(redoLog).where(eq(redoLog.id, last.id));

    return last;
  }
}

export const storage = new DatabaseStorage();
