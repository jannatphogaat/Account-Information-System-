export const api = {
  transactions: {
    list: {
      method: 'GET',
      path: '/api/transactions',
    },
    credit: {
      method: 'POST',
      path: '/api/credit',
    },
    debit: {
      method: 'POST',
      path: '/api/debit',
    },
    undo: {
      method: 'POST',
      path: '/api/undo',
    },
    redo: {
      method: 'POST',
      path: '/api/redo',
    },
  },
};

export function buildUrl(path, params) {
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
