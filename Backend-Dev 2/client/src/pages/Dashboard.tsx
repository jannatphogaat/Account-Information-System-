import { Plus, Minus, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions, useCredit, useDebit, useUndo, useRedo } from "@/hooks/use-transactions";
import { BalanceCard } from "@/components/TransactionList"; // Corrected import in next step manually if needed, but assuming separate file
import { TransactionList } from "@/components/TransactionList";
import { BalanceCard as BalanceDisplay } from "@/components/BalanceCard";
import { ActionDialog } from "@/components/ActionDialog";

export default function Dashboard() {
  const { data, isLoading } = useTransactions();
  const creditMutation = useCredit();
  const debitMutation = useDebit();
  const undoMutation = useUndo();
  const redoMutation = useRedo();

  const transactions = data?.transactions || [];
  const balance = data?.balance || 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Decorative top gradient */}
      <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent w-full absolute top-0 left-0 -z-10" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <header className="text-center space-y-2 mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">My Wallet</h1>
          <p className="text-muted-foreground">Manage your finances with simplicity.</p>
        </header>

        {/* Balance Section */}
        <section>
          <BalanceDisplay balance={balance} isLoading={isLoading} />
        </section>

        {/* Actions Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ActionDialog 
            title="Add Deposit" 
            type="credit"
            onSubmit={(amount) => creditMutation.mutateAsync(amount)}
            isPending={creditMutation.isPending}
            trigger={
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all group"
              >
                <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors text-green-700">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold">Deposit</span>
              </Button>
            }
          />

          <ActionDialog 
            title="Withdraw Funds" 
            type="debit"
            onSubmit={(amount) => debitMutation.mutateAsync(amount)}
            isPending={debitMutation.isPending}
            trigger={
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all group"
              >
                <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors text-red-700">
                  <Minus className="w-6 h-6" />
                </div>
                <span className="font-semibold">Withdraw</span>
              </Button>
            }
          />

          <Button 
            variant="outline" 
            onClick={() => undoMutation.mutate()}
            disabled={undoMutation.isPending}
            className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-all group"
          >
            <div className="p-2 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors text-amber-700">
              {undoMutation.isPending ? <div className="w-6 h-6 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" /> : <RotateCcw className="w-6 h-6" />}
            </div>
            <span className="font-semibold">Undo</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => redoMutation.mutate()}
            disabled={redoMutation.isPending}
            className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group"
          >
            <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors text-blue-700">
              {redoMutation.isPending ? <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" /> : <RotateCw className="w-6 h-6" />}
            </div>
            <span className="font-semibold">Redo</span>
          </Button>
        </section>

        {/* Transaction History */}
        <section>
          <TransactionList transactions={transactions} isLoading={isLoading} />
        </section>

      </main>
    </div>
  );
}
