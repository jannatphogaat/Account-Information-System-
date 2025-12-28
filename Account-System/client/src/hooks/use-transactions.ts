import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type errorSchemas } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Helper to handle API errors safely
const handleApiError = async (res: Response) => {
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "An error occurred");
  }
  return res.json();
};

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path);
      const data = await handleApiError(res);
      return api.transactions.list.responses[200].parse(data);
    },
  });
}

export function useAddCredit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.transactions.credit.path, {
        method: api.transactions.credit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await handleApiError(res);
      return api.transactions.credit.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({
        title: "Success",
        description: data.message,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAddDebit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.transactions.debit.path, {
        method: api.transactions.debit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await handleApiError(res);
      return api.transactions.debit.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({
        title: "Success",
        description: data.message,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
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
      const data = await handleApiError(res);
      return api.transactions.undo.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({
        title: "Undo Successful",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot Undo",
        description: error.message,
        variant: "destructive",
      });
    },
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
      const data = await handleApiError(res);
      return api.transactions.redo.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({
        title: "Redo Successful",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot Redo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
