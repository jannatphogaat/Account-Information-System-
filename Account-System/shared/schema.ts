import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// The main stack of active transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'Credit' or 'Debit'
  amount: real("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// The redo stack for storing undone transactions
export const redoStack = pgTable("redo_stack", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  amount: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
