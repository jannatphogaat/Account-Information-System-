import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  isLoading: boolean;
}

export function BalanceCard({ balance, isLoading }: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl p-8 shadow-xl shadow-blue-200 text-primary-foreground">
      {/* Abstract Background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-primary-foreground/80 font-medium text-sm tracking-wider uppercase">Total Balance</h2>
          
          {isLoading ? (
            <div className="h-16 w-48 bg-white/20 rounded-lg animate-pulse mx-auto" />
          ) : (
            <h1 className="font-display font-bold text-6xl tracking-tight">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          )}
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-white">
            Available for immediate use
          </span>
        </div>
      </div>
    </div>
  );
}
