
import React from "react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Trash2, Edit } from "lucide-react";
import type { Meeting } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MeetingsListProps {
  meetings: Meeting[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (meeting: Meeting) => void;
  use45MinuteUnits?: boolean;
}

export const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  isLoading,
  onDelete,
  onEdit,
  use45MinuteUnits = true,
}) => {
  // Helper function to format time
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // Helper function to get day of week in Hebrew
  const getDayOfWeek = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE", { locale: he });
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  };

  // Calculate teaching units based on the setting
  const calculateTeachingUnits = (durationMinutes: number) => {
    if (use45MinuteUnits) {
      return durationMinutes / 45;
    } else {
      return durationMinutes / 60;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>אין מפגשים מתוכננים עדיין.</p>
        <p>השתמש בכפתור 'הוסף מפגש' כדי ליצור מפגש חדש.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>תאריך</TableHead>
            <TableHead>יום</TableHead>
            <TableHead>שעות</TableHead>
            <TableHead>משך</TableHead>
            <TableHead>{use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}</TableHead>
            <TableHead>נושא</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.id}>
              <TableCell>{formatDate(meeting.date)}</TableCell>
              <TableCell className="font-medium">
                {getDayOfWeek(meeting.date)}
              </TableCell>
              <TableCell>
                {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
              </TableCell>
              <TableCell>
                {(meeting.duration_minutes / 60).toFixed(2)} שעות
              </TableCell>
              <TableCell>
                {calculateTeachingUnits(meeting.duration_minutes).toFixed(2)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {meeting.topic || "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(meeting)}
                    className="ml-1"
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(meeting.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
