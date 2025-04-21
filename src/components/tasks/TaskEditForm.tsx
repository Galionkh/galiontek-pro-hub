
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useUpdateTask } from "@/hooks/tasks";
import { useState } from "react";
import { Task } from "@/hooks/tasks";
import { TaskFields } from "./form/TaskFields";
import { taskSchema, TaskFormValues } from "./form/TaskFormSchema";
import { SubmitButton } from "./form/SubmitButton";

interface TaskEditFormProps {
  task: Task;
  onSuccess: () => void;
}

export function TaskEditForm({ task, onSuccess }: TaskEditFormProps) {
  const updateTask = useUpdateTask();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      dueDate: new Date(task.dueDate),
      category: task.category,
      priority: task.priority,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    updateTask.mutate({
      ...task,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toISOString().split('T')[0],
      category: data.category,
      priority: data.priority,
    }, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TaskFields form={form} />
        <SubmitButton isPending={updateTask.isPending} />
      </form>
    </Form>
  );
}
