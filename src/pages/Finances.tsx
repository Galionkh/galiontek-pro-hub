
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactions } from "@/hooks/useTransactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, "הסכום חייב להיות גדול מ-0"),
  description: z.string().min(1, "נא להזין תיאור"),
  date: z.string().min(1, "נא לבחור תאריך"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function Finances() {
  const [open, setOpen] = useState(false);
  const { transactions, isLoading, addTransaction } = useTransactions();
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income', // Set a default type (no longer optional)
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    // Ensure all required properties are explicitly set
    const transaction = {
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: data.date,
    };
    
    await addTransaction.mutateAsync(transaction);
    form.reset({
      type: 'income',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button"
                      variant={form.watch('type') === 'income' ? 'default' : 'outline'}
                      onClick={() => form.setValue('type', 'income')}
                      className="w-full"
                    >
                      הכנסה
                    </Button>
                    <Button 
                      type="button"
                      variant={form.watch('type') === 'expense' ? 'default' : 'outline'}
                      onClick={() => form.setValue('type', 'expense')}
                      className="w-full"
                    >
                      הוצאה
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סכום (₪)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            className="text-right"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תיאור</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-right" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תאריך</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={addTransaction.isPending}
                  >
                    {addTransaction.isPending ? 'שומר...' : 'שמור רישום'}
                  </Button>
                </form>
              </Form>
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

interface TransactionsListProps {
  transactions: any[];
  isLoading: boolean;
}

function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <span>טוען...</span>
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
