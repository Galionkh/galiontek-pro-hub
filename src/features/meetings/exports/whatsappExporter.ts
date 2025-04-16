
import { format } from 'date-fns';
import type { Order } from '@/features/clients/types';
import type { Meeting } from '@/features/meetings/types';
import { getDayOfWeek, formatDate, formatTime } from '../utils/dateFormatUtils';

// Share via WhatsApp
export const shareViaWhatsApp = async (
  order: Order, 
  meetings: Meeting[],
  use45MinuteUnits: boolean = true
): Promise<void> => {
  try {
    // Generate message text
    let messageText = `*רשימת מפגשים: ${order.title || 'הזמנה'}*\n`;
    messageText += `לקוח: ${order.client_name || ''}\n\n`;
    
    // Summary
    const totalMeetings = meetings.length;
    const totalMinutes = meetings.reduce((sum, m) => sum + m.duration_minutes, 0);
    const totalHours = totalMinutes / 60;
    const totalTeachingUnits = use45MinuteUnits ? (totalMinutes / 45) : (totalMinutes / 60);
    
    messageText += `סך מפגשים: ${totalMeetings}\n`;
    messageText += `סך שעות בפועל: ${totalHours.toFixed(2)}\n`;
    messageText += `סך ${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}: ${totalTeachingUnits.toFixed(2)}\n\n`;
    
    // List of meetings
    meetings.forEach((meeting, index) => {
      const calculatedUnits = use45MinuteUnits 
        ? meeting.duration_minutes / 45 
        : meeting.duration_minutes / 60;
      
      messageText += `*מפגש ${index + 1}:*\n`;
      messageText += `📅 ${formatDate(meeting.date)} (${getDayOfWeek(meeting.date)})\n`;
      messageText += `🕒 ${formatTime(meeting.start_time)} - ${formatTime(meeting.end_time)}\n`;
      messageText += `⏱️ ${(meeting.duration_minutes / 60).toFixed(2)} שעות (${calculatedUnits.toFixed(2)} ${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'})\n`;
      
      if (meeting.topic) {
        messageText += `📝 ${meeting.topic}\n`;
      }
      
      messageText += '\n';
    });
    
    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
    throw error;
  }
};
