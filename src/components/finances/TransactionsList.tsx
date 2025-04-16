
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Transaction } from "@/hooks/useTransactions";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">אין רישומים</h2>
          <p>לחץ על "רישום חדש" כדי להתחיל</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString('he-IL')}
              </p>
            </div>
            <div className={`font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {transaction.amount.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS'
              })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
