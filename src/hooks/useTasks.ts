
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: "urgent" | "later" | "completed";
};

export type TaskCategory = Task["category"];

export function useTasks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      })) as Task[];
    },
    enabled: !!user,
  });

  const groupedTasks = {
    urgent: tasks.filter(task => task.category === "urgent"),
    later: tasks.filter(task => task.category === "later"),
    completed: tasks.filter(task => task.category === "completed")
  };

  return {
    tasks,
    groupedTasks,
    isLoading
  };
}
