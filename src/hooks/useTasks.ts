
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory = "urgent" | "later" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  tags?: string[];
};

type TasksQueryResult = {
  tasks: Task[];
  groupedTasks: {
    urgent: Task[];
    later: Task[];
    completed: Task[];
  };
  groupedByPriority: {
    high: Task[];
    medium: Task[];
    low: Task[];
  };
  isLoading: boolean;
};

export function useTasks(): TasksQueryResult {
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
        priority: task.priority || "medium", // תמיכה בנתונים קיימים ללא שדה priority
        tags: task.tags,
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

export function useDeleteTask() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "המשימה נמחקה בהצלחה",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה במחיקת המשימה",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
