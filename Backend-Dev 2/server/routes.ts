import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.transactions.list.path, async (req, res) => {
    const data = await storage.getTransactions();
    res.json(data);
  });

  app.post(api.transactions.credit.path, async (req, res) => {
    try {
      const { amount } = api.transactions.credit.input.parse(req.body);
      const transaction = await storage.createTransaction('credit', amount);
      res.json(transaction);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.transactions.debit.path, async (req, res) => {
    try {
      const { amount } = api.transactions.debit.input.parse(req.body);
      const transaction = await storage.createTransaction('debit', amount);
      res.json(transaction);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.transactions.undo.path, async (req, res) => {
    const undone = await storage.undoLastTransaction();
    if (!undone) {
      return res.status(400).json({ message: "Nothing to undo" });
    }
    res.json({ message: "Undo successful", undone });
  });

  app.post(api.transactions.redo.path, async (req, res) => {
    const redone = await storage.redoLastUndone();
    if (!redone) {
      return res.status(400).json({ message: "Nothing to redo" });
    }
    res.json({ message: "Redo successful", redone });
  });

  return httpServer;
}
