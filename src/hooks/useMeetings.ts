
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Meeting = {
  id: string;
  order_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  teaching_units: number;
  topic: string | null;
  created_at: string;
  updated_at: string;
};

export const useMeetings = (orderId: number) => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("order_id", orderId)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
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

  const createMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from("meetings")
        .insert([meetingData])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "המפגש נוצר בהצלחה",
      });

      // Refresh meetings list
      fetchMeetings();
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

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", id);

      if (error) throw error;

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

  const openMeetingForm = () => {
    setIsMeetingFormOpen(true);
  };

  const closeMeetingForm = () => {
    setIsMeetingFormOpen(false);
  };

  // Calculate summary information
  const getMeetingsSummary = () => {
    const totalMeetings = meetings.length;
    const totalMinutes = meetings.reduce((sum, meeting) => sum + meeting.duration_minutes, 0);
    const totalHours = totalMinutes / 60;
    const totalTeachingUnits = meetings.reduce((sum, meeting) => sum + meeting.teaching_units, 0);
    
    return {
      totalMeetings,
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalTeachingUnits: parseFloat(totalTeachingUnits.toFixed(2))
    };
  };

  return {
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
  };
};
