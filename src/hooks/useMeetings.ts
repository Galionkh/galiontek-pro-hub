
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Meeting, MeetingSummary } from "@/features/meetings/types";
import { fetchMeetings, createMeeting, updateMeeting, deleteMeeting } from "@/features/meetings/api/meetingsApi";
import { importFromExcel } from "@/features/meetings/utils/excelUtils";
import { calculateMeetingsSummary } from "@/features/meetings/utils/meetingCalculations";

export type { Meeting } from "@/features/meetings/types";

export const useMeetings = (orderId: number) => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);

  const fetchMeetingsList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMeetings(orderId);
      setMeetings(data);
    } catch (error: any) {
      console.error("Error fetching meetings:", error.message);
      toast({
        title: "שגיאה בטעינת המפגשים",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsCreating(true);
      await createMeeting(meetingData);

      toast({
        title: "נוצר בהצלחה",
        description: "המפגש נוצר בהצלחה",
      });

      // Refresh meetings list
      fetchMeetingsList();
      setIsMeetingFormOpen(false);
    } catch (error: any) {
      console.error("Error creating meeting:", error.message);
      toast({
        title: "שגיאה ביצירת מפגש",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateExistingMeeting = async (id: string, meetingData: Partial<Meeting>) => {
    try {
      setIsCreating(true);
      await updateMeeting(id, meetingData);

      // Refresh meetings list
      fetchMeetingsList();
      setIsMeetingFormOpen(false);
      
      toast({
        title: "עודכן בהצלחה",
        description: "המפגש עודכן בהצלחה",
      });
    } catch (error: any) {
      console.error("Error updating meeting:", error.message);
      toast({
        title: "שגיאה בעדכון מפגש",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteMeetingById = async (id: string) => {
    try {
      await deleteMeeting(id);

      // Update local state
      setMeetings(meetings.filter(meeting => meeting.id !== id));

      toast({
        title: "נמחק בהצלחה",
        description: "המפגש נמחק בהצלחה",
      });
    } catch (error: any) {
      console.error("Error deleting meeting:", error.message);
      toast({
        title: "שגיאה במחיקת מפגש",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const importFromExcelFile = async (file: File, use45MinuteUnits: boolean = true) => {
    try {
      setIsCreating(true);
      const result = await importFromExcel(file, orderId, use45MinuteUnits);
      
      // Refresh meetings list
      fetchMeetingsList();
      
      return result;
    } catch (error: any) {
      console.error("Error importing from Excel:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const openMeetingForm = () => {
    setIsMeetingFormOpen(true);
  };

  const closeMeetingForm = () => {
    setIsMeetingFormOpen(false);
  };

  // Calculate summary information
  const getMeetingsSummary = (use45MinuteUnits: boolean = true): MeetingSummary => {
    return calculateMeetingsSummary(meetings, use45MinuteUnits);
  };

  return {
    meetings,
    isLoading,
    isCreating,
    isMeetingFormOpen,
    fetchMeetings: fetchMeetingsList,
    createMeeting: createNewMeeting,
    updateMeeting: updateExistingMeeting,
    deleteMeeting: deleteMeetingById,
    importFromExcel: importFromExcelFile,
    openMeetingForm,
    closeMeetingForm,
    getMeetingsSummary
  };
};
