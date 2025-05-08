-- Add business_type and id_number columns to the profile table
ALTER TABLE public.profile
ADD COLUMN business_type TEXT,
ADD COLUMN id_number TEXT;