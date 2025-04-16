
import { format } from 'date-fns';
import type { Order } from '@/features/clients/types';
import type { Meeting } from '@/features/meetings/types';
import { getDayOfWeek, formatDate, formatTime } from '../utils/dateFormatUtils';
import { getClientEmail } from '@/features/clients/utils/clientDataUtils';

// Send email
export const sendEmail = async (
  order: Order, 
  meetings: Meeting[],
  use45MinuteUnits: boolean = true
): Promise<void> => {
  try {
    // Get client email if available
    const clientEmail = await getClientEmail(order.client_id);
    
    // Generate message text
    let subject = encodeURIComponent(`רשימת מפגשים: ${order.title || 'הזמנה'}`);
    
    // Generate HTML body
    let body = encodeURIComponent(`
      <h2 dir="rtl">רשימת מפגשים: ${order.title || 'הזמנה'}</h2>
      <p dir="rtl">לקוח: ${order.client_name || ''}</p>
      
      <div dir="rtl" style="margin: 15px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <p>סך מפגשים: ${meetings.length}</p>
        <p>סך שעות בפועל: ${(meetings.reduce((sum, m) => sum + m.duration_minutes, 0) / 60).toFixed(2)}</p>
        <p>סך ${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}: ${(meetings.reduce((sum, m) => sum + m.duration_minutes, 0) / (use45MinuteUnits ? 45 : 60)).toFixed(2)}</p>
      </div>
      
      <table dir="rtl" border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #5a46a0; color: white;">
            <th>תאריך</th>
            <th>יום</th>
            <th>שעות</th>
            <th>משך (שעות)</th>
            <th>${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}</th>
            <th>נושא</th>
          </tr>
        </thead>
        <tbody>
          ${meetings.map(meeting => {
            const calculatedUnits = use45MinuteUnits 
              ? meeting.duration_minutes / 45 
              : meeting.duration_minutes / 60;
              
            return `
              <tr>
                <td>${formatDate(meeting.date)}</td>
                <td>${getDayOfWeek(meeting.date)}</td>
                <td>${formatTime(meeting.start_time)} - ${formatTime(meeting.end_time)}</td>
                <td>${(meeting.duration_minutes / 60).toFixed(2)}</td>
                <td>${calculatedUnits.toFixed(2)}</td>
                <td>${meeting.topic || '-'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `);
    
    // Set destination email - if client email exists, use it as default
    let mailTo = clientEmail ? clientEmail : '';
    
    // Open the default mail client
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}&html=true`;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
