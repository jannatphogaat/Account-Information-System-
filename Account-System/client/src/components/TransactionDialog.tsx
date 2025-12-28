import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface TransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  onConfirm: (amount: number) => void;
  type: "credit" | "debit";
}

export function TransactionDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  isPending,
  onConfirm,
  type,
}: TransactionDialogProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onConfirm(val);
      setAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-none">
        <DialogHeader>
          <DialogTitle className={`text-2xl ${type === 'credit' ? 'text-green-600' : 'text-indigo-600'}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <Input
              type="number"
              placeholder="0.00"
              className="pl-8 text-lg py-6 bg-white/50 border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !amount}
              className={`
                btn-premium px-8 font-semibold shadow-lg
                ${type === 'credit' 
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }
              `}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
