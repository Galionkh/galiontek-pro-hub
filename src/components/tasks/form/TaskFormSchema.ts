
import * as z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "נדרשת כותרת למשימה"),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "נדרש תאריך יעד",
  }),
  category: z.enum(["urgent", "later", "completed"]),
  priority: z.enum(["high", "medium", "low"]),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
