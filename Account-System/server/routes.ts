import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    const balance = await storage.getBalance();
    res.json({ transactions, balance });
  });

  app.post(api.transactions.credit.path, async (req, res) => {
    try {
      const { amount } = api.transactions.credit.input.parse(req.body);
      await storage.createTransaction({ type: 'Credit', amount });
      const balance = await storage.getBalance();
      res.json({ balance, message: `Credit added. Balance = ${balance}` });
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.transactions.debit.path, async (req, res) => {
    try {
      const { amount } = api.transactions.debit.input.parse(req.body);
      await storage.createTransaction({ type: 'Debit', amount });
      const balance = await storage.getBalance();
      res.json({ balance, message: `Debit added. Balance = ${balance}` });
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.transactions.undo.path, async (req, res) => {
    try {
      const message = await storage.undoLastTransaction();
      const balance = await storage.getBalance();
      res.json({ balance, message });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Nothing to undo" });
    }
  });

  app.post(api.transactions.redo.path, async (req, res) => {
    try {
      const message = await storage.redoLastUndo();
      const balance = await storage.getBalance();
      res.json({ balance, message });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Nothing to redo" });
    }
  });

  // Simple seed function
  const existing = await storage.getTransactions();
  if (existing.length === 0) {
    console.log("Seeding database...");
    await storage.createTransaction({ type: 'Credit', amount: 500 });
    await storage.createTransaction({ type: 'Debit', amount: 100 });
    await storage.createTransaction({ type: 'Credit', amount: 200 });
    console.log("Seeding complete.");
  }

  return httpServer;
}
