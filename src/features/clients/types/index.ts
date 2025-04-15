
export type Client = {
  id: number;
  name: string;
  contact: string;
  status: string;
  notes?: string;
  created_at: string;
  user_id?: string;
};

export type Order = {
  id: number;
  title: string;
  client_name: string;
  status: string;
  date: string;
  created_at: string;
  user_id?: string;
};
