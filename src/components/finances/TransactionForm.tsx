
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { DialogFooter } from "@/components/ui/dialog";
import { PiggyBank, Receipt, WalletCards } from "lucide-react";
import type { TransactionInput } from "@/hooks/useTransactions";

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, "הסכום חייב להיות גדול מ-0"),
  description: z.string().min(1, "נא להזין תיאור"),
  date: z.string().min(1, "נא לבחור תאריך"),
  notes: z.string().optional(),
});

type TransactionFormProps = {
  onSubmit: (data: TransactionInput) => Promise<any>;
  onClose: () => void;
  isSubmitting: boolean;
};

export function TransactionForm({ onSubmit, onClose, isSubmitting }: TransactionFormProps) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      await onSubmit(data as TransactionInput);
      form.reset({
        type: 'income',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            variant={form.watch('type') === 'income' ? 'default' : 'outline'}
            onClick={() => form.setValue('type', 'income')}
            className="w-full"
          >
            <PiggyBank className="mr-2 h-4 w-4" />
            הכנסה
          </Button>
          <Button 
            type="button"
            variant={form.watch('type') === 'expense' ? 'default' : 'outline'}
            onClick={() => form.setValue('type', 'expense')}
            className="w-full"
          >
            <Receipt className="mr-2 h-4 w-4" />
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
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>הערות (אופציונלי)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="text-right resize-none"
                  placeholder="הערות נוספות..."
                  rows={3}
                />
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
        
        <DialogFooter className="gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            ביטול
          </Button>
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <WalletCards className="h-4 w-4" />
            {isSubmitting ? 'שומר...' : 'שמור רישום'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
