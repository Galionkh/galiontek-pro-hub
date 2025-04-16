
import React, { useEffect } from "react";
import { Plus, FileDown, Mail, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MeetingForm } from "./MeetingForm";
import { MeetingsList } from "./MeetingsList";
import { MeetingsSummary } from "./MeetingsSummary";
import { useMeetings } from "@/hooks/useMeetings";
import type { Order } from "@/hooks/useOrders";

interface MeetingsTabProps {
  order: Order;
}

export const MeetingsTab: React.FC<MeetingsTabProps> = ({ order }) => {
  const {
    meetings,
    isLoading,
    isCreating,
    isMeetingFormOpen,
    fetchMeetings,
    createMeeting,
    deleteMeeting,
    openMeetingForm,
    closeMeetingForm,
    getMeetingsSummary
  } = useMeetings(order.id);

  const { totalMeetings, totalHours, totalTeachingUnits } = getMeetingsSummary();

  // Fetch meetings when the component mounts
  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">מפגשי שירות</h3>
        <Button onClick={openMeetingForm}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף מפגש
        </Button>
      </div>

      <MeetingsSummary
        totalMeetings={totalMeetings}
        totalHours={totalHours}
        totalTeachingUnits={totalTeachingUnits}
        agreedHours={order.hours || null}
      />

      <MeetingsList
        meetings={meetings}
        isLoading={isLoading}
        onDelete={deleteMeeting}
      />

      {meetings.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 ml-2" />
              ייצוא ל־PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 ml-2" />
              שלח בוואטסאפ
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 ml-2" />
              שלח למייל
            </Button>
          </div>
        </>
      )}

      <Dialog open={isMeetingFormOpen} onOpenChange={closeMeetingForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>הוסף מפגש חדש</DialogTitle>
          </DialogHeader>
          <MeetingForm 
            orderId={order.id}
            onSubmit={createMeeting}
            onCancel={closeMeetingForm}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
