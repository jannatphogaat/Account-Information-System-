import { z } from 'zod';
import { transactions } from './schema';

export const errorSchemas = {
  common: z.object({
    message: z.string(),
  }),
};

export const api = {
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      responses: {
        200: z.object({
          transactions: z.array(z.custom<typeof transactions.$inferSelect>()),
          balance: z.number()
        })
      }
    },
    credit: {
      method: 'POST' as const,
      path: '/api/transactions/credit',
      input: z.object({ amount: z.number().positive() }),
      responses: {
        200: z.object({ balance: z.number(), message: z.string() }),
        400: errorSchemas.common
      }
    },
    debit: {
      method: 'POST' as const,
      path: '/api/transactions/debit',
      input: z.object({ amount: z.number().positive() }),
      responses: {
        200: z.object({ balance: z.number(), message: z.string() }),
        400: errorSchemas.common
      }
    },
    undo: {
      method: 'POST' as const,
      path: '/api/transactions/undo',
      responses: {
        200: z.object({ balance: z.number(), message: z.string() }),
        400: errorSchemas.common
      }
    },
    redo: {
      method: 'POST' as const,
      path: '/api/transactions/redo',
      responses: {
        200: z.object({ balance: z.number(), message: z.string() }),
        400: errorSchemas.common
      }
    }
  }
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
