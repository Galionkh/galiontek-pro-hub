
/**
 * Calculates the duration in minutes between two time strings
 */
export const calculateDurationMinutes = (startTime: string, endTime: string): number | null => {
  if (!startTime || !endTime) return null;

  // Convert time strings to minutes since midnight
  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);

  if (endMinutes > startMinutes) {
    return endMinutes - startMinutes;
  }
  
  return null;
};

/**
 * Calculates teaching units based on duration and unit size
 */
export const calculateTeachingUnits = (
  durationMinutes: number | null, 
  use45MinuteUnits: boolean
): number | null => {
  if (durationMinutes === null) return null;
  
  const unitDuration = use45MinuteUnits ? 45 : 60;
  return parseFloat((durationMinutes / unitDuration).toFixed(2));
};
