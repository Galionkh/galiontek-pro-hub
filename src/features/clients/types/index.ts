export type Client = {
  id: number;
  name: string;
  contact: string;
  status: "active" | "pending" | "closed";
  notes?: string;
  email?: string;
  created_at: string;
  user_id?: string;
  client_type?: "educational" | "company" | "individual";
  institution_number?: string;
  institution_type?: string;
  city?: string;
  address?: string;
  principal_name?: string;
  principal_email?: string;
  business_field?: string;
};

export type Order = {
  id: number;
  title: string;
  client_name: string;
  status: string;
  date: string;
  created_at: string;
  user_id?: string;
  client_id?: number | string;
  hours?: number;
};
