import { z } from 'zod';
import { insertTransactionSchema, transactions, redoLog } from './schema';

export const api = {
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      responses: {
        200: z.object({
          transactions: z.array(z.custom<typeof transactions.$inferSelect>()),
          balance: z.number(),
        }),
      },
    },
    credit: {
      method: 'POST' as const,
      path: '/api/credit',
      input: z.object({ amount: z.number().positive() }),
      responses: {
        200: z.custom<typeof transactions.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    debit: {
      method: 'POST' as const,
      path: '/api/debit',
      input: z.object({ amount: z.number().positive() }),
      responses: {
        200: z.custom<typeof transactions.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    undo: {
      method: 'POST' as const,
      path: '/api/undo',
      responses: {
        200: z.object({ message: z.string(), undone: z.custom<typeof transactions.$inferSelect>() }),
        400: z.object({ message: z.string() }),
      },
    },
    redo: {
      method: 'POST' as const,
      path: '/api/redo',
      responses: {
        200: z.object({ message: z.string(), redone: z.custom<typeof redoLog.$inferSelect>() }),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
