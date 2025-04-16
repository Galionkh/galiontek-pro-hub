
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const taskSchema = z.object({
  title: z.string().min(1, "נדרשת כותרת למשימה"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "נדרש תאריך יעד"),
  category: z.enum(["urgent", "later", "completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
}

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split('T')[0],
      category: "later",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...data,
          user_id: user?.id,
        }]);

      if (error) throw error;

      toast({
        title: "המשימה נוצרה בהצלחה",
      });
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "שגיאה ביצירת המשימה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כותרת</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>תיאור (אופציונלי)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך יעד</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>קטגוריה</FormLabel>
              <FormControl>
                <select 
                  {...field} 
                  className="w-full p-2 border rounded-md"
                >
                  <option value="urgent">דחוף</option>
                  <option value="later">בהמשך</option>
                  <option value="completed">הושלם</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          צור משימה
        </Button>
      </form>
    </Form>
  );
}
