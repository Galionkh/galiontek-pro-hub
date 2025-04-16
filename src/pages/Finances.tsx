
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/finances/TransactionForm";
import { TransactionsList } from "@/components/finances/TransactionsList";

export default function Finances() {
  const [open, setOpen] = useState(false);
  const { transactions, isLoading, addTransaction } = useTransactions();
  
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">כספים</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>יצוא דוח PDF</span>
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>רישום חדש</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">רישום כספי חדש</DialogTitle>
              </DialogHeader>
              <TransactionForm 
                onSubmit={addTransaction.mutateAsync}
                onClose={() => setOpen(false)}
                isSubmitting={addTransaction.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4">
          <TabsTrigger value="all">הכל</TabsTrigger>
          <TabsTrigger value="income">הכנסות</TabsTrigger>
          <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger value="invoices">חשבוניות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <TransactionsList 
            transactions={transactions}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="income" className="mt-4">
          <TransactionsList 
            transactions={transactions.filter(t => t.type === 'income')}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <TransactionsList 
            transactions={transactions.filter(t => t.type === 'expense')}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">חשבוניות</h2>
              <p>כאן יוצגו החשבוניות שהנפקת</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
