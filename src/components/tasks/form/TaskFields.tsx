
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";
import { DueDateField } from "./DueDateField";
import { PriorityField } from "./PriorityField";
import { CategoryField } from "./CategoryField";

interface TaskFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

export function TaskFields({ form }: TaskFieldsProps) {
  return (
    <>
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
      
      <DueDateField form={form} />
      <PriorityField form={form} />
      <CategoryField form={form} />
    </>
  );
}
