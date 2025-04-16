
import type { Meeting, MeetingSummary } from "../types";

export const calculateMeetingsSummary = (
  meetings: Meeting[], 
  use45MinuteUnits: boolean = true
): MeetingSummary => {
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
