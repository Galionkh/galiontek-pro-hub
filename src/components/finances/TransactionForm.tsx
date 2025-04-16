
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TransactionInput } from "@/hooks/useTransactions";

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, "הסכום חייב להיות גדול מ-0"),
  description: z.string().min(1, "נא להזין תיאור"),
  date: z.string().min(1, "נא לבחור תאריך"),
});

type TransactionFormProps = {
  onSubmit: (data: TransactionInput) => Promise<void>;
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
    },
  });

  const handleSubmit = async (data: z.infer<typeof transactionSchema>) => {
    await onSubmit(data);
    form.reset({
      type: 'income',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'שומר...' : 'שמור רישום'}
        </Button>
      </form>
    </Form>
  );
}
