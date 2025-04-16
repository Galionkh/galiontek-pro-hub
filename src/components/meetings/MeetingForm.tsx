
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define form schema
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

interface MeetingFormProps {
  orderId: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  orderId,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      start_time: "",
      end_time: "",
      topic: "",
    },
  });

  // For duration preview
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [teachingUnits, setTeachingUnits] = useState<number | null>(null);

  // Calculate duration when start time or end time changes
  useEffect(() => {
    const startTime = form.watch("start_time");
    const endTime = form.watch("end_time");

    if (startTime && endTime) {
      // Convert time strings to minutes since midnight
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const startMinutes = getMinutes(startTime);
      const endMinutes = getMinutes(endTime);

      if (endMinutes > startMinutes) {
        const duration = endMinutes - startMinutes;
        setDurationMinutes(duration);
        // Calculate teaching units (45-minute units)
        setTeachingUnits(parseFloat((duration / 45).toFixed(2)));
      } else {
        setDurationMinutes(null);
        setTeachingUnits(null);
      }
    }
  }, [form.watch("start_time"), form.watch("end_time")]);

  const handleSubmit = async (values: FormValues) => {
    if (!durationMinutes || !teachingUnits) {
      form.setError("end_time", {
        type: "manual",
        message: "יש להזין שעות תקינות (שעת סיום חייבת להיות מאוחרת משעת התחלה)",
      });
      return;
    }

    // Create meeting data object
    const meetingData = {
      order_id: orderId,
      date: format(values.date, "yyyy-MM-dd"),
      start_time: values.start_time,
      end_time: values.end_time,
      duration_minutes: durationMinutes,
      teaching_units: teachingUnits,
      topic: values.topic || null,
    };

    await onSubmit(meetingData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>תאריך</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-right font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>בחר תאריך</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שעת התחלה</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      placeholder="שעת התחלה"
                      {...field}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שעת סיום</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      placeholder="שעת סיום"
                      {...field}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {durationMinutes !== null && teachingUnits !== null && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p>משך המפגש: {(durationMinutes / 60).toFixed(2)} שעות ({durationMinutes} דקות)</p>
            <p>יחידות הוראה: {teachingUnits.toFixed(2)} יחידות של 45 דקות</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>נושא המפגש</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="הזן את נושא המפגש"
                  className="min-h-[80px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="ml-2"
          >
            ביטול
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "שומר..." : "שמור מפגש"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
