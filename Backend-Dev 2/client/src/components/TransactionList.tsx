import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, History } from "lucide-react";
import type { Transaction } from "@shared/schema";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border">
        <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto mb-4">
          <History className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No Transactions</h3>
        <p className="text-muted-foreground">Start adding credits or debits to see history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-border/60 overflow-hidden">
      <div className="p-6 border-b border-border/60 bg-gradient-to-r from-gray-50/50 to-white">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Transaction History
        </h3>
      </div>
      
      <div className="divide-y divide-border/60">
        <AnimatePresence initial={false}>
          {transactions.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="group p-5 hover:bg-gray-50/80 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${t.type === 'credit' 
                    ? 'bg-green-100/50 text-green-600' 
                    : 'bg-red-100/50 text-red-600'
                  }
                `}>
                  {t.type === 'credit' ? (
                    <ArrowUpCircle className="w-6 h-6" />
                  ) : (
                    <ArrowDownCircle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground capitalize">
                    {t.type === 'credit' ? 'Deposit' : 'Withdrawal'}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: #{index + 1} • {new Date(t.createdAt || Date.now()).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`
                font-display font-bold text-lg
                ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}
              `}>
                {t.type === 'credit' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
