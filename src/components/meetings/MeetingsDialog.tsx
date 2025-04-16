
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeetingForm } from "./MeetingForm";
import type { Meeting } from "@/features/meetings/types";

interface MeetingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  initialData: Meeting | null;
  orderId: number;
  use45MinuteUnits: boolean;
}

export const MeetingsDialog: React.FC<MeetingsDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  orderId,
  use45MinuteUnits,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'עריכת מפגש' : 'הוסף מפגש חדש'}</DialogTitle>
        </DialogHeader>
        <MeetingForm 
          orderId={orderId}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          initialData={initialData}
          use45MinuteUnits={use45MinuteUnits}
        />
      </DialogContent>
    </Dialog>
  );
};
