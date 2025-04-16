
/**
 * Calculate teaching units based on duration and unit type setting
 */
export const calculateTeachingUnits = (durationMinutes: number, use45MinuteUnits: boolean) => {
  if (use45MinuteUnits) {
    return durationMinutes / 45;
  } else {
    return durationMinutes / 60;
  }
};
