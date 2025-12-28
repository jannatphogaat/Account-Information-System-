import { pgTable, text, serial, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// The "Active" stack - equivalent to type[], amount[], tos
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'credit' or 'debit'
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// The "Redo" stack - equivalent to redotype[], redoamount[], redotos
export const redoLog = pgTable("redo_log", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'credit' or 'debit'
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  amount: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type RedoEntry = typeof redoLog.$inferSelect;
