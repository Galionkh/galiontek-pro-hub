
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pen, Trash2 } from "lucide-react";
import type { Meeting } from "@/hooks/useMeetings";

interface MeetingActionButtonsProps {
  meeting: Meeting;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isCompact?: boolean;
}

export const MeetingActionButtons: React.FC<MeetingActionButtonsProps> = ({
  meeting,
  onEdit,
  onDelete,
  isCompact = false
}) => {
  const handleDelete = async () => {
    await onDelete();
  };

  if (isCompact) {
    return (
      <div className="flex gap-1 justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-7 w-7"
        >
          <Pen className="h-3 w-3" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>מחיקת מפגש</AlertDialogTitle>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך למחוק את המפגש מתאריך {meeting.date}?
                פעולה זו לא ניתנת לביטול.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
      >
        <Pen className="h-4 w-4 ml-1" />
        ערוך
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 ml-1" />
            מחק
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת מפגש</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק את המפגש מתאריך {meeting.date}?
              פעולה זו לא ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
