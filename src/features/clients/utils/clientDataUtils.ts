
import { supabase } from '@/integrations/supabase/client';

// Helper function to get client data
export const getClientData = async (clientId: number | string | undefined): Promise<any | null> => {
  if (!clientId) return null;
  
  // Convert client_id to number if it's a string
  const id = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching client data:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception fetching client data:', err);
    return null;
  }
};

// Helper function to get client email
export const getClientEmail = async (clientId: number | string | undefined): Promise<string | null> => {
  const clientData = await getClientData(clientId);
  
  // Safely check if the email property exists on the data object
  return clientData && typeof clientData === 'object' && 'email' in clientData 
    ? clientData.email as string 
    : null;
};
