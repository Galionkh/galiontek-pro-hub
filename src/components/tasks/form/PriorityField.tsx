
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";

interface PriorityFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export function PriorityField({ form }: PriorityFieldProps) {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>תיעדוף</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4 space-x-reverse rtl:space-x-reverse"
            >
              <FormItem className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <FormControl>
                  <RadioGroupItem value="high" />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal text-red-500">
                  גבוה
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <FormControl>
                  <RadioGroupItem value="medium" />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal text-amber-500">
                  בינוני
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <FormControl>
                  <RadioGroupItem value="low" />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal text-green-500">
                  נמוך
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
