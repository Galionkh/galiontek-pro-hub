-- Add business_name and address columns to the profile table
ALTER TABLE public.profile
ADD COLUMN business_name TEXT,
ADD COLUMN address TEXT;