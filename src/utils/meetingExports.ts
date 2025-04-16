
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import type { Order } from '@/features/clients/types';
import type { Meeting } from '@/hooks/useMeetings';
import { supabase } from '@/integrations/supabase/client';

// Helper function to get day of week in Hebrew
const getDayOfWeek = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "EEEE", { locale: he });
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy");
};

// Helper function to format time
const formatTime = (timeString: string) => {
  return timeString.substring(0, 5);
};

// Helper function to get client email
const getClientEmail = async (clientId: number | string | undefined): Promise<string | null> => {
  if (!clientId) return null;
  
  // Convert client_id to number if it's a string
  const id = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
  
  try {
    // Use a more generic approach to avoid TypeScript issues with column detection
    const { data, error } = await supabase
      .from('clients')
      .select('email')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching client email:', error);
      return null;
    }
    
    // Type guard to ensure data exists and has an email property
    if (data) {
      return data.email as string || null;
    }
    
    return null;
  } catch (err) {
    console.error('Exception fetching client email:', err);
    return null;
  }
};

// Create PDF
export const exportToPDF = async (
  order: Order, 
  meetings: Meeting[], 
  use45MinuteUnits: boolean = true
): Promise<string> => {
  // Create new document
  const doc = new jsPDF({
    orientation: 'landscape', 
    unit: 'mm',
    format: 'a4',
  });
  
  // Use a font that supports Hebrew (like Arial)
  doc.setFont('Courier', 'normal');
  doc.setR2L(true); // Set right-to-left for Hebrew
  
  // Add title
  doc.setFontSize(18);
  doc.text(`רשימת מפגשים: ${order.title || 'הזמנה'}`, doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // Add client info
  doc.setFontSize(12);
  doc.text(`לקוח: ${order.client_name || ''}`, 20, 30);
  doc.text(`תאריך: ${format(new Date(), 'dd/MM/yyyy')}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
  
  // Create summary card
  const totalMeetings = meetings.length;
  const totalMinutes = meetings.reduce((sum, m) => sum + m.duration_minutes, 0);
  const totalHours = totalMinutes / 60;
  const totalTeachingUnits = use45MinuteUnits ? (totalMinutes / 45) : (totalMinutes / 60);
  
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(20, 40, doc.internal.pageSize.width - 40, 25, 3, 3, 'F');
  
  doc.text(`סך מפגשים: ${totalMeetings}`, 40, 50);
  doc.text(`סך שעות בפועל: ${totalHours.toFixed(2)}`, doc.internal.pageSize.width / 2, 50);
  doc.text(`סך ${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}: ${totalTeachingUnits.toFixed(2)}`, doc.internal.pageSize.width - 40, 50);
  
  if (order.hours) {
    const isCompleted = totalTeachingUnits >= order.hours;
    const message = isCompleted 
      ? '✅ השירות הושלם בפועל' 
      : `⚠️ נותרו ${(order.hours - totalTeachingUnits).toFixed(2)} ${use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'} לסיום השירות`;
    
    doc.text(message, doc.internal.pageSize.width / 2, 60, { align: 'center' });
  }
  
  // Create meetings table
  const tableColumn = [
    "תאריך", 
    "יום", 
    "שעות", 
    "משך (שעות)", 
    use45MinuteUnits ? "יחידות הוראה" : "שעות אקדמיות", 
    "נושא"
  ];
  
  const tableRows = meetings.map(meeting => {
    const calculatedUnits = use45MinuteUnits 
      ? meeting.duration_minutes / 45 
      : meeting.duration_minutes / 60;
      
    return [
      formatDate(meeting.date),
      getDayOfWeek(meeting.date),
      `${formatTime(meeting.start_time)} - ${formatTime(meeting.end_time)}`,
      (meeting.duration_minutes / 60).toFixed(2),
      calculatedUnits.toFixed(2),
      meeting.topic || '-'
    ];
  });
  
  // @ts-ignore - jspdf-autotable adds this method
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'grid',
    styles: { 
      halign: 'right', 
      font: 'Courier',
      fontSize: 10 
    },
    headStyles: { 
      fillColor: [90, 70, 160],
      textColor: 255
    }
  });
  
  // Save the PDF
  const filename = `meetings-${order.id}-${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(filename);
  
  return filename;
};

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
