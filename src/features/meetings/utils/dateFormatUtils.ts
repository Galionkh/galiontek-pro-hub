
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';

// Helper function to get day of week in Hebrew
export const getDayOfWeek = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "EEEE", { locale: he });
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy");
};

// Helper function to format time
export const formatTime = (timeString: string) => {
  return timeString.substring(0, 5);
};
