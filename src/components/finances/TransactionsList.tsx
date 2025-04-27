
import { Card } from "@/components/ui/card";
import { Loader2, Receipt, FileText, Filter } from "lucide-react";
import type { Transaction } from "@/hooks/useTransactions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount-high" | "amount-low">("newest");
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-muted-foreground">טוען רישומים...</p>
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <Receipt className="h-12 w-12 mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">אין רישומים</h2>
          <p className="mb-6">לחץ על "רישום חדש" כדי להתחיל</p>
        </div>
      </Card>
    );
  }
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch(sortOrder) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            placeholder="חיפוש לפי תיאור..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>מיון</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem
              checked={sortOrder === "newest"}
              onCheckedChange={() => setSortOrder("newest")}
            >
              חדש ביותר
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortOrder === "oldest"}
              onCheckedChange={() => setSortOrder("oldest")}
            >
              ישן ביותר
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortOrder === "amount-high"}
              onCheckedChange={() => setSortOrder("amount-high")}
            >
              סכום (גבוה לנמוך)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortOrder === "amount-low"}
              onCheckedChange={() => setSortOrder("amount-low")}
            >
              סכום (נמוך לגבוה)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p>לא נמצאו תוצאות לחיפוש</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 hover:bg-accent/10 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.description || 'ללא תיאור'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
      )}
      
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 px-1">
        <span>{filteredTransactions.length} רישומים</span>
      </div>
    </div>
  );
}
