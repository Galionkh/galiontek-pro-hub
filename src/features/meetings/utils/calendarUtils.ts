
import type { Meeting } from "../types";

export const addToCalendar = async (meeting: Meeting): Promise<void> => {
  try {
    // This would be implemented to add the meeting to a calendar system
    console.log("Adding meeting to calendar:", meeting);
    // Actual implementation would depend on your calendar system
    // למשל, אינטגרציה עם Google Calendar או Outlook
  } catch (error) {
    console.error("Error adding to calendar:", error);
  }
};

export const updateCalendarEntry = async (meeting: Meeting): Promise<void> => {
  try {
    // This would be implemented to update the meeting in a calendar system
    console.log("Updating meeting in calendar:", meeting);
    // Actual implementation would depend on your calendar system
  } catch (error) {
    console.error("Error updating calendar entry:", error);
  }
};

export const removeFromCalendar = async (meetingId: string): Promise<void> => {
  try {
    // This would be implemented to remove the meeting from a calendar system
    console.log("Removing meeting from calendar:", meetingId);
    // Actual implementation would depend on your calendar system
  } catch (error) {
    console.error("Error removing from calendar:", error);
  }
};

// הוספת פונקציות חדשות ליצוא ויבוא אירועים
export const exportEventsToICS = async (events: any[]): Promise<string> => {
  try {
    // Implementation for exporting events to ICS format
    console.log("Exporting events to ICS format:", events);
    
    // הכנת קובץ ICS בסיסי (כאן יש להוסיף לוגיקה מתאימה עבור המבנה הנכון)
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//Event Calendar//EN\n";
    
    events.forEach(event => {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART:${formatDateForICS(new Date(event.date))}\n`;
      icsContent += `DTEND:${formatDateForICS(new Date(event.date))}\n`;
      icsContent += `LOCATION:${event.location}\n`;
      if (event.description) {
        icsContent += `DESCRIPTION:${event.description}\n`;
      }
      icsContent += `UID:${event.id}@yourdomain.com\n`;
      // Add recurring event information if applicable
      if (event.is_recurring && event.recurrence_pattern) {
        const rrule = formatRecurrenceRule(event.recurrence_pattern);
        if (rrule) {
          icsContent += `RRULE:${rrule}\n`;
        }
      }
      icsContent += "END:VEVENT\n";
    });
    
    icsContent += "END:VCALENDAR";
    
    return icsContent;
  } catch (error) {
    console.error("Error exporting events:", error);
    throw error;
  }
};

export const importEventsFromICS = async (icsContent: string): Promise<any[]> => {
  try {
    // Implementation for importing events from ICS format
    console.log("Importing events from ICS format");
    
    // כאן יש להוסיף פרסור של קובץ ICS ויצירת אובייקטי אירוע
    // זוהי דוגמה פשוטה מאוד שצריכה להיות מורחבת בהתאם לצורך
    
    const events: any[] = [];
    const eventStrings = icsContent.split("BEGIN:VEVENT");
    
    eventStrings.slice(1).forEach(eventStr => {
      const endIndex = eventStr.indexOf("END:VEVENT");
      if (endIndex !== -1) {
        const eventContent = eventStr.substring(0, endIndex);
        
        const titleMatch = eventContent.match(/SUMMARY:(.*?)(?:\r?\n)/);
        const dateMatch = eventContent.match(/DTSTART:(.*?)(?:\r?\n)/);
        const locationMatch = eventContent.match(/LOCATION:(.*?)(?:\r?\n)/);
        const descriptionMatch = eventContent.match(/DESCRIPTION:(.*?)(?:\r?\n)/);
        const rruleMatch = eventContent.match(/RRULE:(.*?)(?:\r?\n)/);
        
        if (titleMatch && dateMatch) {
          const event: any = {
            title: titleMatch[1],
            date: parseICSDate(dateMatch[1]),
            location: locationMatch ? locationMatch[1] : "",
            description: descriptionMatch ? descriptionMatch[1] : "",
            is_recurring: !!rruleMatch,
            recurrence_pattern: rruleMatch ? parseRecurrenceRule(rruleMatch[1]) : null
          };
          
          events.push(event);
        }
      }
    });
    
    return events;
  } catch (error) {
    console.error("Error importing events:", error);
    throw error;
  }
};

// פונקציות עזר פנימיות
function formatDateForICS(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function parseICSDate(icsDate: string): string {
  // המרה בסיסית מאוד שיש להרחיב
  const year = icsDate.substring(0, 4);
  const month = icsDate.substring(4, 6);
  const day = icsDate.substring(6, 8);
  return `${year}-${month}-${day}`;
}

// הפונקציות החדשות לטיפול בתדירויות של אירועים חוזרים
function formatRecurrenceRule(pattern: string): string | null {
  switch (pattern) {
    case 'daily':
      return 'FREQ=DAILY';
    case 'weekly':
      return 'FREQ=WEEKLY';
    case 'monthly':
      return 'FREQ=MONTHLY';
    case 'yearly':
      return 'FREQ=YEARLY';
    default:
      return null;
  }
}

function parseRecurrenceRule(rrule: string): string | null {
  if (rrule.includes('FREQ=DAILY')) {
    return 'daily';
  } else if (rrule.includes('FREQ=WEEKLY')) {
    return 'weekly';
  } else if (rrule.includes('FREQ=MONTHLY')) {
    return 'monthly';
  } else if (rrule.includes('FREQ=YEARLY')) {
    return 'yearly';
  }
  return null;
}
