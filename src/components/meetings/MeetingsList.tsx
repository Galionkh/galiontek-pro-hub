
import React from "react";
import type { Meeting } from "@/hooks/useMeetings";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { EmptyMeetingsState } from "./states/EmptyMeetingsState";
import { LoadingMeetingsState } from "./states/LoadingMeetingsState";
import { MeetingsTableHeader } from "./table/MeetingsTableHeader";
import { MeetingRow } from "./table/MeetingRow";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

interface MeetingsListProps {
  meetings: Meeting[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (meeting: Meeting) => void;
  use45MinuteUnits?: boolean;
  isCompact?: boolean;
  limit?: number;
}

export const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  isLoading,
  onDelete,
  onEdit,
  use45MinuteUnits = true,
  isCompact = false,
  limit,
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingMeetingsState />;
  }

  if (meetings.length === 0) {
    return <EmptyMeetingsState />;
  }

  // אם במצב קומפקטי, הצג רק מספר מוגבל של מפגשים
  const displayedMeetings = limit ? meetings.slice(0, limit) : meetings;

  return (
    <div className="overflow-x-auto" dir="rtl">
      <Table>
        <MeetingsTableHeader use45MinuteUnits={use45MinuteUnits} isCompact={isCompact} />
        <TableBody>
          {displayedMeetings.map((meeting) => (
            <MeetingRow 
              key={meeting.id}
              meeting={meeting}
              onEdit={onEdit}
              onDelete={onDelete}
              use45MinuteUnits={use45MinuteUnits}
              isCompact={isCompact}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
