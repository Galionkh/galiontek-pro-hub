
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Task } from "./types";

export function useUpdateTask() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description || null,
          due_date: task.dueDate,
          category: task.category,
          priority: task.priority,
          tags: task.tags,
        })
        .eq('id', task.id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "המשימה עודכנה בהצלחה",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בעדכון המשימה",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
