import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ActionDialogProps {
  title: string;
  trigger: React.ReactNode;
  onSubmit: (amount: number) => Promise<unknown>;
  isPending: boolean;
  type: "credit" | "debit";
}

export function ActionDialog({ title, trigger, onSubmit, isPending, type }: ActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      await onSubmit(val);
      setOpen(false);
      setAmount("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-7 text-lg font-mono"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className={`
              w-full h-12 text-lg font-semibold rounded-xl
              ${type === 'credit' 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'
              }
            `}
            disabled={isPending || !amount || parseFloat(amount) <= 0}
          >
            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : `Confirm ${type === 'credit' ? 'Deposit' : 'Withdrawal'}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
