
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('System preferences function called');
    
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get the latest system preferences with timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000); // 5-second timeout
    
    try {
      const { data, error } = await supabaseClient
        .from('user_preferences')
        .select('system_name, logo_url, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .abortSignal(abortController.signal);
      
      clearTimeout(timeoutId);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
        throw error;
      }

      // Add cache-busting query parameter to logo URL if exists
      let logoUrl = null;
      if (data?.logo_url) {
        try {
          const timestamp = new Date().getTime();
          const urlObj = new URL(data.logo_url);
          
          // Make sure we're using HTTPS
          if (urlObj.protocol === 'http:') {
            urlObj.protocol = 'https:';
          }
          
          urlObj.searchParams.set('t', timestamp.toString());
          logoUrl = urlObj.toString();
        } catch (urlError) {
          console.error('Error parsing URL:', urlError);
          logoUrl = data?.logo_url;
        }
      }

      const responseData = {
        system_name: data?.system_name || 'GalionTek',
        logo_url: logoUrl,
        timestamp: new Date().toISOString(),
      };

      console.log('Returning system preferences:', JSON.stringify(responseData));

      return new Response(
        JSON.stringify(responseData),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      )
    } catch (dbError) {
      clearTimeout(timeoutId);
      if (dbError.name === 'AbortError') {
        console.error('Database query timed out');
        throw new Error('Database query timed out');
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error in system-preferences function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get system preferences',
        message: error.message || 'Unknown error',
        system_name: 'GalionTek', // Fallback values
        logo_url: null,
        status: 'error',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})
