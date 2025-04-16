
export type Meeting = {
  id: string;
  order_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  teaching_units: number;
  topic: string | null;
  created_at: string;
  updated_at: string;
};

export type MeetingSummary = {
  totalMeetings: number;
  totalHours: number;
  totalTeachingUnits: number;
};

export type MeetingFormData = Omit<Meeting, 'id' | 'created_at' | 'updated_at'>;
