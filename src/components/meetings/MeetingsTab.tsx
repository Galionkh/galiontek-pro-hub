
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MeetingsList } from "./MeetingsList";
import { MeetingsSummary } from "./MeetingsSummary";
import { MeetingsHeader } from "./MeetingsHeader";
import { MeetingsActions } from "./MeetingsActions";
import { MeetingsDialog } from "./MeetingsDialog";
import { FileImportInput, useFileInput } from "./FileImportInput";
import { useMeetings, type Meeting } from "@/hooks/useMeetings";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/features/clients/types";

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
    updateMeeting,
    deleteMeeting,
    openMeetingForm,
    closeMeetingForm,
    getMeetingsSummary,
    importFromExcel
  } = useMeetings(order.id);

  const { toast } = useToast();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [use45MinuteUnits, setUse45MinuteUnits] = useState(true);
  const { fileInputRef, triggerFileInput } = useFileInput();

  const { totalMeetings, totalHours, totalTeachingUnits } = getMeetingsSummary(use45MinuteUnits);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    openMeetingForm();
  };

  const handleCloseForm = () => {
    setSelectedMeeting(null);
    closeMeetingForm();
  };

  const handleFormSubmit = async (meetingData: any) => {
    try {
      if (selectedMeeting) {
        await updateMeeting(selectedMeeting.id, meetingData);
        toast({
          title: "מפגש עודכן",
          description: "המפגש עודכן בהצלחה",
        });
      } else {
        const { use45MinuteUnits: _, ...meetingDataToSave } = meetingData;
        
        await createMeeting({
          ...meetingDataToSave,
        });
        toast({
          title: "מפגש נוסף",
          description: "המפגש נוסף בהצלחה",
        });
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת המפגש",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importFromExcel(file, use45MinuteUnits);
      toast({
        title: "ייבוא הושלם",
        description: "המפגשים יובאו בהצלחה מקובץ האקסל",
      });
    } catch (error) {
      console.error("Error importing from Excel:", error);
      toast({
        title: "שגיאה בייבוא",
        description: "אירעה שגיאה בייבוא המפגשים מקובץ האקסל",
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <MeetingsHeader 
        onAddMeeting={openMeetingForm}
        onFileInputClick={triggerFileInput}
        use45MinuteUnits={use45MinuteUnits}
        setUse45MinuteUnits={setUse45MinuteUnits}
      />

      <MeetingsSummary
        totalMeetings={totalMeetings}
        totalHours={totalHours}
        totalTeachingUnits={totalTeachingUnits}
        agreedHours={order.hours || null}
        use45MinuteUnits={use45MinuteUnits}
      />

      <MeetingsList
        meetings={meetings}
        isLoading={isLoading}
        onDelete={deleteMeeting}
        onEdit={handleEditMeeting}
        use45MinuteUnits={use45MinuteUnits}
      />

      {meetings.length > 0 && (
        <>
          <Separator />
          <MeetingsActions 
            order={order}
            meetings={meetings}
            use45MinuteUnits={use45MinuteUnits}
          />
        </>
      )}

      <FileImportInput onFileChange={handleFileChange} />

      <MeetingsDialog
        isOpen={isMeetingFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating}
        initialData={selectedMeeting}
        orderId={order.id}
        use45MinuteUnits={use45MinuteUnits}
      />
    </div>
  );
};
