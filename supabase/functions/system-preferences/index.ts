
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get the latest system preferences
    const { data, error } = await supabaseClient
      .from('user_preferences')
      .select('system_name, logo_url, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error)
      throw error
    }

    // Add cache-busting query parameter to logo URL if exists
    let logoUrl = null
    if (data?.logo_url) {
      try {
        const timestamp = new Date().getTime()
        const urlObj = new URL(data.logo_url)
        urlObj.searchParams.set('t', timestamp.toString())
        logoUrl = urlObj.toString()
      } catch (urlError) {
        console.error('Error parsing URL:', urlError)
        logoUrl = data.logo_url
      }
    }

    return new Response(
      JSON.stringify({
        system_name: data?.system_name || 'GalionTek',
        logo_url: logoUrl,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get system preferences',
        message: error.message || 'Unknown error',
        system_name: 'GalionTek', // Fallback values
        logo_url: null,
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
