
import React from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Meeting } from "@/hooks/useMeetings";

interface MeetingActionButtonsProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => Promise<void>;
}

export const MeetingActionButtons: React.FC<MeetingActionButtonsProps> = ({
  meeting,
  onEdit,
  onDelete
}) => {
  return (
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
  );
};
