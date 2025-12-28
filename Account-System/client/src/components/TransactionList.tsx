import { motion, AnimatePresence } from "framer-motion";
import { type Transaction } from "@shared/schema";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  balance: number;
}

export function TransactionList({ transactions, balance }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white/40 rounded-3xl border border-white/40">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <History className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No transactions yet</h3>
        <p className="text-gray-500">Start by adding credit or debit to your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-500/5 border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white/50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {transactions.length} Records
            </span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {transactions.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${t.type === 'Credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                    }
                  `}>
                    {t.type === 'Credit' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.type}</p>
                    <p className="text-xs text-gray-400 font-mono">ID: #{t.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold font-mono ${t.type === 'Credit' ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.type === 'Credit' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="p-6 bg-gray-50/80 border-t border-gray-200/50">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Balance</p>
              <p className="text-xs text-gray-400 mt-1">Calculated from history</p>
            </div>
            <div className={`text-4xl font-bold font-display ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
