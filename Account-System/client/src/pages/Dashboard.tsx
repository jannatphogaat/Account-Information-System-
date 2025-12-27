import { useState } from "react";
import { useTransactions, useAddCredit, useAddDebit, useUndo, useRedo } from "@/hooks/use-transactions";
import { TransactionDialog } from "@/components/TransactionDialog";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  RotateCw, 
  List, 
  LogOut,
  Wallet,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data, isLoading } = useTransactions();
  const { toast } = useToast();
  
  const addCredit = useAddCredit();
  const addDebit = useAddDebit();
  const undo = useUndo();
  const redo = useRedo();

  const [creditOpen, setCreditOpen] = useState(false);
  const [debitOpen, setDebitOpen] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [isExited, setIsExited] = useState(false);

  const handleExit = () => {
    setIsExited(true);
    toast({
      title: "Session Ended",
      description: "Thank you for using the Account Information System.",
      className: "bg-gray-900 text-white border-none",
    });
  };

  if (isExited) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-primary/10">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Thank You!</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Your session has ended securely. You may close this tab or refresh to start over.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Start New Session
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Activity className="w-4 h-4" />
          <span>System Active v1.0</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 pb-2">
          Account Information System
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Manage your finances with precision. Track every credit, debit, and modification in real-time.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Left Column: Controls & Output Area */}
        <div className="space-y-6">
          
          {/* Action Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setCreditOpen(true)}
              className="h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card hover:bg-green-50/50 hover:border-green-200 border-2 border-transparent transition-all group"
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-green-700">Add Credit</span>
            </Button>

            <Button
              onClick={() => setDebitOpen(true)}
              className="h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card hover:bg-red-50/50 hover:border-red-200 border-2 border-transparent transition-all group"
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Minus className="w-6 h-6 text-red-600" />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-red-700">Add Debit</span>
            </Button>

            <Button
              onClick={() => undo.mutate()}
              disabled={undo.isPending}
              className="h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card hover:bg-orange-50/50 hover:border-orange-200 border-2 border-transparent transition-all group"
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RotateCcw className={`w-6 h-6 text-orange-600 ${undo.isPending ? 'animate-spin' : ''}`} />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-orange-700">Undo</span>
            </Button>

            <Button
              onClick={() => redo.mutate()}
              disabled={redo.isPending}
              className="h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card hover:bg-blue-50/50 hover:border-blue-200 border-2 border-transparent transition-all group"
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RotateCw className={`w-6 h-6 text-blue-600 ${redo.isPending ? 'animate-spin' : ''}`} />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-blue-700">Redo</span>
            </Button>

            <Button
              onClick={() => setShowRecords(!showRecords)}
              className={`h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card border-2 border-transparent transition-all group ${showRecords ? 'bg-primary/5 border-primary/20' : 'hover:bg-purple-50/50 hover:border-purple-200'}`}
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <List className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-purple-700">
                {showRecords ? 'Hide Records' : 'Show Records'}
              </span>
            </Button>

            <Button
              onClick={handleExit}
              className="h-24 md:h-32 flex flex-col gap-3 rounded-2xl glass-card hover:bg-gray-100 hover:border-gray-300 border-2 border-transparent transition-all group"
              variant="outline"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogOut className="w-6 h-6 text-gray-600" />
              </div>
              <span className="font-semibold text-lg text-gray-700 group-hover:text-gray-900">Exit</span>
            </Button>
          </div>

          {/* Main Output Area (when Records hidden) */}
          <AnimatePresence mode="wait">
            {!showRecords && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-3xl p-8 text-center space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">System Output</h3>
                <div className="py-8">
                  <p className="text-3xl font-display font-medium text-gray-600">
                    {data?.transactions.length === 0 
                      ? "Ready for input..." 
                      : `Last action complete. Balance: $${data?.balance.toFixed(2) || '0.00'}`
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction List (when Records shown) */}
          <AnimatePresence mode="wait">
            {showRecords && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {isLoading ? (
                  <div className="p-12 text-center text-gray-400">Loading history...</div>
                ) : (
                  <TransactionList 
                    transactions={data?.transactions || []} 
                    balance={data?.balance || 0} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Quick Stats / Summary (Optional decoration) */}
        <div className="hidden lg:block space-y-6">
          <div className="glass-card p-6 rounded-3xl sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Account Summary
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
                <p className="text-primary-foreground/80 text-sm mb-1">Total Balance</p>
                <p className="text-3xl font-display font-bold">${data?.balance.toFixed(2) || '0.00'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                  <p className="text-green-600 text-xs font-bold uppercase mb-1">Total Credits</p>
                  <p className="text-xl font-bold text-gray-900">
                    {data?.transactions.filter(t => t.type === 'Credit').length || 0}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                  <p className="text-red-600 text-xs font-bold uppercase mb-1">Total Debits</p>
                  <p className="text-xl font-bold text-gray-900">
                    {data?.transactions.filter(t => t.type === 'Debit').length || 0}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  All transactions are recorded securely. Use Undo/Redo to correct mistakes immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransactionDialog 
        isOpen={creditOpen}
        onOpenChange={setCreditOpen}
        title="Add Credit"
        description="Enter the amount you want to add to your account balance."
        confirmLabel="Add Credit"
        type="credit"
        isPending={addCredit.isPending}
        onConfirm={(amount) => addCredit.mutate(amount)}
      />

      <TransactionDialog 
        isOpen={debitOpen}
        onOpenChange={setDebitOpen}
        title="Add Debit"
        description="Enter the amount you want to deduct from your account balance."
        confirmLabel="Add Debit"
        type="debit"
        isPending={addDebit.isPending}
        onConfirm={(amount) => addDebit.mutate(amount)}
      />
    </div>
  );
}
