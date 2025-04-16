
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { Meeting } from "../types";
import { addToCalendar } from "./calendarUtils";

export const importFromExcel = async (
  file: File, 
  orderId: number,
  use45MinuteUnits: boolean = true
): Promise<{ importedCount: number }> => {
  try {
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
        await addToCalendar(meeting as Meeting);
      }
    }
    
    return { importedCount: validMeetings.length };
  } catch (error: any) {
    console.error("Error importing from Excel:", error);
    throw error;
  }
};
