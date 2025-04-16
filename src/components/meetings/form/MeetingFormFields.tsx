
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MeetingFormValues } from "./MeetingFormSchema";

interface DateFieldProps {
  control: Control<MeetingFormValues>;
}

export const DateField: React.FC<DateFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

interface TimeFieldProps {
  control: Control<MeetingFormValues>;
  name: "start_time" | "end_time";
  label: string;
}

export const TimeField: React.FC<TimeFieldProps> = ({ control, name, label }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="time"
                placeholder={label}
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
  );
};

interface TopicFieldProps {
  control: Control<MeetingFormValues>;
}

export const TopicField: React.FC<TopicFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

interface DurationDisplayProps {
  durationMinutes: number | null;
  teachingUnits: number | null;
  use45MinuteUnits: boolean;
}

export const DurationDisplay: React.FC<DurationDisplayProps> = ({
  durationMinutes,
  teachingUnits,
  use45MinuteUnits,
}) => {
  if (durationMinutes === null || teachingUnits === null) {
    return null;
  }

  const unitType = use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות';
  const unitDuration = use45MinuteUnits ? 45 : 60;

  return (
    <div className="p-3 bg-muted rounded-md text-sm">
      <p>משך המפגש: {(durationMinutes / 60).toFixed(2)} שעות ({durationMinutes} דקות)</p>
      <p>{unitType}: {teachingUnits.toFixed(2)} יחידות של {unitDuration} דקות</p>
    </div>
  );
};
