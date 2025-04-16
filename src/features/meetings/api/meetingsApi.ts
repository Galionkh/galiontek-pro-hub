
import { supabase } from "@/integrations/supabase/client";
import type { Meeting, MeetingFormData } from "../types";
import { addToCalendar, updateCalendarEntry, removeFromCalendar } from "../utils/calendarUtils";

export const fetchMeetings = async (orderId: number): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("order_id", orderId)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching meetings:", error.message);
    throw error;
  }
};

export const createMeeting = async (meetingData: MeetingFormData): Promise<Meeting> => {
  try {
    // Remove the use45MinuteUnits property if it exists
    const { use45MinuteUnits, ...validMeetingData } = meetingData as any;
    
    const { data, error } = await supabase
      .from("meetings")
      .insert([validMeetingData])
      .select();

    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error("No data returned after creating meeting");
    }

    // Add to calendar
    await addToCalendar(data[0] as Meeting);

    return data[0] as Meeting;
  } catch (error: any) {
    console.error("Error creating meeting:", error.message);
    throw error;
  }
};

export const updateMeeting = async (id: string, meetingData: Partial<Meeting>): Promise<void> => {
  try {
    // Remove any non-meeting properties if they exist
    const { use45MinuteUnits, ...validMeetingData } = meetingData as any;
    
    const { error } = await supabase
      .from("meetings")
      .update(validMeetingData)
      .eq("id", id);

    if (error) throw error;

    // Update calendar entry
    await updateCalendarEntry({ id, ...validMeetingData } as Meeting);
  } catch (error: any) {
    console.error("Error updating meeting:", error.message);
    throw error;
  }
};

export const deleteMeeting = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Remove from calendar
    await removeFromCalendar(id);
  } catch (error: any) {
    console.error("Error deleting meeting:", error.message);
    throw error;
  }
};
