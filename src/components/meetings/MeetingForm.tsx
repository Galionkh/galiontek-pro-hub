
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { 
  DateField, 
  TimeField, 
  TopicField, 
  DurationDisplay 
} from "./form/MeetingFormFields";
import { 
  meetingFormSchema, 
  type MeetingFormValues 
} from "./form/MeetingFormSchema";
import { 
  calculateDurationMinutes, 
  calculateTeachingUnits 
} from "./form/MeetingTimeUtils";
import type { Meeting } from "@/features/meetings/types";

interface MeetingFormProps {
  orderId: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Meeting | null;
  use45MinuteUnits?: boolean;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  orderId,
  onSubmit,
  onCancel,
  isSubmitting,
  initialData = null,
  use45MinuteUnits = true,
}) => {
  // Initialize form with existing data if editing
  const defaultValues: Partial<MeetingFormValues> = initialData
    ? {
        date: parse(initialData.date, 'yyyy-MM-dd', new Date()),
        start_time: initialData.start_time,
        end_time: initialData.end_time,
        topic: initialData.topic || '',
      }
    : {
        date: new Date(),
        start_time: '',
        end_time: '',
        topic: '',
      };

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues,
  });

  // For duration preview
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [teachingUnits, setTeachingUnits] = useState<number | null>(null);

  // Calculate duration when start time or end time changes
  useEffect(() => {
    const startTime = form.watch("start_time");
    const endTime = form.watch("end_time");

    const calculatedDuration = calculateDurationMinutes(startTime, endTime);
    setDurationMinutes(calculatedDuration);
    
    const calculatedUnits = calculateTeachingUnits(calculatedDuration, use45MinuteUnits);
    setTeachingUnits(calculatedUnits);
  }, [form.watch("start_time"), form.watch("end_time"), use45MinuteUnits]);

  const handleSubmit = async (values: MeetingFormValues) => {
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" dir="rtl">
        <DateField control={form.control} />

        <div className="grid grid-cols-2 gap-4">
          <TimeField 
            control={form.control} 
            name="start_time" 
            label="שעת התחלה" 
          />
          <TimeField 
            control={form.control} 
            name="end_time" 
            label="שעת סיום" 
          />
        </div>

        <DurationDisplay 
          durationMinutes={durationMinutes} 
          teachingUnits={teachingUnits}
          use45MinuteUnits={use45MinuteUnits} 
        />

        <TopicField control={form.control} />

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
            {isSubmitting ? "שומר..." : initialData ? "עדכן מפגש" : "שמור מפגש"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
