
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useTransactions() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "שגיאה בטעינת נתונים",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      // Convert DB data to our Transaction type
      return (data || []).map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        amount: item.amount,
        description: item.description || '',
        date: item.date,
        // The 'notes' field might not exist in the database schema
        // so we'll exclude it from our mapped object
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (transaction: TransactionInput) => {
      if (!user) throw new Error("User not authenticated");
      
      // We're removing the notes field from the transaction input
      // if it's trying to be stored but not present in the database schema
      const { notes, ...transactionData } = transaction;
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "הצלחה",
        description: "הפעולה הכספית נשמרה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בשמירת הנתונים",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    addTransaction,
  };
}
