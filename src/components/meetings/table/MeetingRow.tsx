
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Meeting } from "@/hooks/useMeetings";
import { formatDate, formatTime, getDayOfWeek } from "../utils/DateFormatters";
import { calculateTeachingUnits } from "../utils/TeachingUnitCalculator";
import { MeetingActionButtons } from "./MeetingActionButtons";

interface MeetingRowProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => Promise<void>;
  use45MinuteUnits: boolean;
}

export const MeetingRow: React.FC<MeetingRowProps> = ({
  meeting,
  onEdit,
  onDelete,
  use45MinuteUnits
}) => {
  return (
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
        {calculateTeachingUnits(meeting.duration_minutes, use45MinuteUnits).toFixed(2)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {meeting.topic || "-"}
      </TableCell>
      <TableCell>
        <MeetingActionButtons 
          meeting={meeting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
