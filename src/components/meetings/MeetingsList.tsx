
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
  if (isLoading) {
    return <LoadingMeetingsState />;
  }

  if (meetings.length === 0) {
    return <EmptyMeetingsState />;
  }

  return (
    <div className="overflow-x-auto" dir="rtl">
      <Table>
        <MeetingsTableHeader use45MinuteUnits={use45MinuteUnits} />
        <TableBody>
          {meetings.map((meeting) => (
            <MeetingRow 
              key={meeting.id}
              meeting={meeting}
              onEdit={onEdit}
              onDelete={onDelete}
              use45MinuteUnits={use45MinuteUnits}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
