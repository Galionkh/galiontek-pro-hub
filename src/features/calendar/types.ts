
export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  created_at: string;
  user_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  reminder?: boolean;
  reminder_time?: string;
}
