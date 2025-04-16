
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

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
      
      // Remove the use45MinuteUnits property if it exists
      const { use45MinuteUnits, ...validMeetingData } = meetingData as any;
      
      const { data, error } = await supabase
        .from("meetings")
        .insert([validMeetingData])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "המפגש נוצר בהצלחה",
      });

      // Add to calendar (implement in a separate function)
      if (data && data.length > 0) {
        await addToCalendar(data[0]);
      }

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

  const updateMeeting = async (id: string, meetingData: Partial<Meeting>) => {
    try {
      setIsCreating(true);
      
      const { error } = await supabase
        .from("meetings")
        .update(meetingData)
        .eq("id", id);

      if (error) throw error;

      // Update calendar entry (implement in a separate function)
      await updateCalendarEntry({id, ...meetingData} as Meeting);

      // Refresh meetings list
      fetchMeetings();
      setIsMeetingFormOpen(false);
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

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from calendar (implement in a separate function)
      await removeFromCalendar(id);

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

  // Calendar integration functions
  const addToCalendar = async (meeting: Meeting) => {
    try {
      // This would be implemented to add the meeting to a calendar system
      console.log("Adding meeting to calendar:", meeting);
      // Actual implementation would depend on your calendar system
    } catch (error) {
      console.error("Error adding to calendar:", error);
    }
  };

  const updateCalendarEntry = async (meeting: Meeting) => {
    try {
      // This would be implemented to update the meeting in a calendar system
      console.log("Updating meeting in calendar:", meeting);
      // Actual implementation would depend on your calendar system
    } catch (error) {
      console.error("Error updating calendar entry:", error);
    }
  };

  const removeFromCalendar = async (meetingId: string) => {
    try {
      // This would be implemented to remove the meeting from a calendar system
      console.log("Removing meeting from calendar:", meetingId);
      // Actual implementation would depend on your calendar system
    } catch (error) {
      console.error("Error removing from calendar:", error);
    }
  };

  const importFromExcel = async (file: File, use45MinuteUnits: boolean = true) => {
    try {
      setIsCreating(true);
      
      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Process data
      const newMeetings = jsonData.map((row: any) => {
        // Parse date - expected format in Excel: DD/MM/YYYY
        let meetingDate;
        if (typeof row.date === 'string') {
          const [day, month, year] = row.date.split('/');
          meetingDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (row.date instanceof Date) {
          meetingDate = format(row.date, 'yyyy-MM-dd');
        } else {
          throw new Error('Invalid date format in Excel file');
        }
        
        // Parse times
        const startTime = typeof row.start_time === 'string' ? row.start_time : '00:00';
        const endTime = typeof row.end_time === 'string' ? row.end_time : '00:00';
        
        // Calculate duration
        const getMinutes = (timeStr: string) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };
        
        const startMinutes = getMinutes(startTime);
        const endMinutes = getMinutes(endTime);
        const durationMinutes = endMinutes > startMinutes ? endMinutes - startMinutes : 0;
        
        // Calculate teaching units
        const unitDuration = use45MinuteUnits ? 45 : 60;
        const teachingUnits = parseFloat((durationMinutes / unitDuration).toFixed(2));
        
        return {
          order_id: orderId,
          date: meetingDate,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: durationMinutes,
          teaching_units: teachingUnits,
          topic: row.topic || null,
        };
      });
      
      // Filter out invalid meetings
      const validMeetings = newMeetings.filter(meeting => 
        meeting.duration_minutes > 0 && meeting.date
      );
      
      if (validMeetings.length === 0) {
        throw new Error('אין נתונים תקינים בקובץ האקסל');
      }
      
      // Insert meetings
      const { data: insertedData, error } = await supabase
        .from("meetings")
        .insert(validMeetings)
        .select();
      
      if (error) throw error;
      
      // Add to calendar
      if (insertedData) {
        for (const meeting of insertedData) {
          await addToCalendar(meeting);
        }
      }
      
      // Refresh meetings list
      fetchMeetings();
      
      return { importedCount: validMeetings.length };
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
  const getMeetingsSummary = (use45MinuteUnits: boolean = true) => {
    const totalMeetings = meetings.length;
    const totalMinutes = meetings.reduce((sum, meeting) => sum + meeting.duration_minutes, 0);
    const totalHours = totalMinutes / 60;
    
    let totalTeachingUnits;
    if (use45MinuteUnits) {
      totalTeachingUnits = totalMinutes / 45;
    } else {
      totalTeachingUnits = totalMinutes / 60;
    }
    
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
    updateMeeting,
    deleteMeeting,
    importFromExcel,
    openMeetingForm,
    closeMeetingForm,
    getMeetingsSummary
  };
};
