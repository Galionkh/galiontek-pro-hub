
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCreateTask } from "@/hooks/tasks";
import { useState } from "react";
import { TaskFields } from "./form/TaskFields";
import { taskSchema, TaskFormValues } from "./form/TaskFormSchema";
import { SubmitButton } from "./form/SubmitButton";

interface CreateTaskFormProps {
  onSuccess: () => void;
}

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const createTask = useCreateTask();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      category: "later",
      priority: "medium",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    createTask.mutate({
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
        <SubmitButton isPending={createTask.isPending} />
      </form>
    </Form>
  );
}
