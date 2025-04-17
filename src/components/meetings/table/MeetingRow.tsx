
import React from "react";
import type { Meeting } from "@/hooks/useMeetings";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "../utils/DateFormatters";
import { MeetingActionButtons } from "./MeetingActionButtons";

interface MeetingRowProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => Promise<void>;
  use45MinuteUnits: boolean;
  isCompact?: boolean;
}

export const MeetingRow: React.FC<MeetingRowProps> = ({
  meeting,
  onEdit,
  onDelete,
  use45MinuteUnits,
  isCompact = false
}) => {
  if (isCompact) {
    return (
      <TableRow>
        <TableCell>{formatDate(meeting.date)}</TableCell>
        <TableCell>
          {meeting.start_time.slice(0, 5)} - {meeting.end_time.slice(0, 5)}
        </TableCell>
        <TableCell>{meeting.topic || "-"}</TableCell>
        <TableCell>
          <MeetingActionButtons
            meeting={meeting}
            onEdit={() => onEdit(meeting)}
            onDelete={() => onDelete(meeting.id)}
            isCompact={true}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{formatDate(meeting.date)}</TableCell>
      <TableCell>{meeting.start_time}</TableCell>
      <TableCell>{meeting.end_time}</TableCell>
      <TableCell>{meeting.duration_minutes}</TableCell>
      <TableCell>{meeting.teaching_units.toFixed(1)}</TableCell>
      <TableCell>{meeting.topic || "-"}</TableCell>
      <TableCell>
        <MeetingActionButtons
          meeting={meeting}
          onEdit={() => onEdit(meeting)}
          onDelete={() => onDelete(meeting.id)}
        />
      </TableCell>
    </TableRow>
  );
};
