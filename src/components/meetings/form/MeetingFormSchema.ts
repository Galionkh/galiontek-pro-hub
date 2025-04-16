
import { z } from "zod";

// Define form schema
export const meetingFormSchema = z.object({
  date: z.date({
    required_error: "יש לבחור תאריך למפגש",
  }),
  start_time: z.string({
    required_error: "יש להזין שעת התחלה",
  }),
  end_time: z.string({
    required_error: "יש להזין שעת סיום",
  }),
  topic: z.string().optional(),
});

export type MeetingFormValues = z.infer<typeof meetingFormSchema>;
