
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Task, TasksQueryResult } from "./types";

export function useQueryTasks(): TasksQueryResult {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        toast({
          title: "שגיאה בטעינת משימות",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        category: task.category,
        priority: task.priority || "medium", // Default to medium if priority is missing
        tags: task.tags || [], // Default to empty array if tags are missing
      })) as Task[];
    },
    enabled: !!user,
  });

  const groupedTasks = {
    urgent: tasks.filter(task => task.category === "urgent"),
    later: tasks.filter(task => task.category === "later"),
    completed: tasks.filter(task => task.category === "completed")
  };

  const groupedByPriority = {
    high: tasks.filter(task => task.priority === "high"),
    medium: tasks.filter(task => task.priority === "medium"),
    low: tasks.filter(task => task.priority === "low"),
  };

  return {
    tasks,
    groupedTasks,
    groupedByPriority,
    isLoading
  };
}
