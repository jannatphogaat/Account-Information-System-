import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCredit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.transactions.credit.path, {
        method: api.transactions.credit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Credit failed");
      return api.transactions.credit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "Success", description: "Credit added successfully", className: "bg-green-50 border-green-200 text-green-800" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

export function useDebit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.transactions.debit.path, {
        method: api.transactions.debit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Debit failed");
      return api.transactions.debit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "Success", description: "Debit added successfully", className: "bg-blue-50 border-blue-200 text-blue-800" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

export function useUndo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.transactions.undo.path, {
        method: api.transactions.undo.method,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Undo failed");
      }
      return api.transactions.undo.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "Undone", description: data.message });
    },
    onError: (error) => {
      toast({ title: "Cannot Undo", description: error.message, variant: "destructive" });
    }
  });
}

export function useRedo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.transactions.redo.path, {
        method: api.transactions.redo.method,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Redo failed");
      }
      return api.transactions.redo.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "Redone", description: data.message });
    },
    onError: (error) => {
      toast({ title: "Cannot Redo", description: error.message, variant: "destructive" });
    }
  });
}
