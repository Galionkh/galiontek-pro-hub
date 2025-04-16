
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import type { Order } from '@/features/clients/types';
import type { Meeting } from '@/features/meetings/types';
import { getDayOfWeek, formatDate, formatTime } from '../utils/dateFormatUtils';

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
