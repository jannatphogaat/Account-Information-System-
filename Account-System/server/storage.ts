import { transactions, redoStack, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTransactions(): Promise<Transaction[]>;
  getBalance(): Promise<number>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  undoLastTransaction(): Promise<string>; // Returns message
  redoLastUndo(): Promise<string>; // Returns message
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(transactions.id);
  }

  async getBalance(): Promise<number> {
    const txs = await this.getTransactions();
    return txs.reduce((acc, t) => {
      return t.type === 'Credit' ? acc + t.amount : acc - t.amount;
    }, 0);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    // Clear redo stack on new transaction
    await db.delete(redoStack);

    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async undoLastTransaction(): Promise<string> {
    // Get last transaction
    const [last] = await db.select().from(transactions).orderBy(desc(transactions.id)).limit(1);

    if (!last) {
      throw new Error("Nothing to undo");
    }

    // Move to redo stack
    await db.insert(redoStack).values({
      type: last.type,
      amount: last.amount,
    });

    // Remove from transactions
    await db.delete(transactions).where(eq(transactions.id, last.id));

    const newBalance = await this.getBalance();
    return `Undo done. Balance = ${newBalance}`;
  }

  async redoLastUndo(): Promise<string> {
    // Get last redo
    const [last] = await db.select().from(redoStack).orderBy(desc(redoStack.id)).limit(1);

    if (!last) {
      throw new Error("Nothing to redo");
    }

    // Move to transactions
    await db.insert(transactions).values({
      type: last.type,
      amount: last.amount,
    });

    // Remove from redo stack
    await db.delete(redoStack).where(eq(redoStack.id, last.id));

    const newBalance = await this.getBalance();
    return `Redo done. Balance = ${newBalance}`;
  }
}

export const storage = new DatabaseStorage();
