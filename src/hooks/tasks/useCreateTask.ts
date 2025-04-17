
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Task } from "./types";

export function useCreateTask() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<Task, "id">) => {
      if (!user) throw new Error("User not authenticated");

      const taskData = {
        title: task.title,
        description: task.description || null,
        due_date: task.dueDate,
        category: task.category,
        priority: task.priority,
        tags: task.tags,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "המשימה נוצרה בהצלחה",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה ביצירת המשימה",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
