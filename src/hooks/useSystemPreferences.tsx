
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSystemPreferences() {
  const [systemName, setSystemName] = useState("GalionTek");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load system preferences
    loadSystemPreferences();
    
    // Subscribe to system updates channel
    const channel = supabase.channel('system-updates')
      .on('broadcast', { event: 'system_name_update' }, (payload) => {
        setSystemName(payload.payload.system_name);
      })
      .on('broadcast', { event: 'logo_update' }, (payload) => {
        setLogoUrl(payload.payload.logo_url || '');
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSystemPreferences = async () => {
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('system_name, logo_url')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        if (data.system_name) {
          setSystemName(data.system_name);
          // Update document title
          document.title = data.system_name;
        }
        
        if (data.logo_url) {
          setLogoUrl(data.logo_url);
          // Update favicon
          const link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.setAttribute('href', data.logo_url);
          }
        }
      }
    } catch (error) {
      console.error("Error loading system preferences:", error);
      setError("אירעה שגיאה בטעינת העדפות המערכת. אנא נסה שנית מאוחר יותר.");
    }
  };

  const handleSystemNameChange = (name: string) => {
    setSystemName(name);
  };

  const handleLogoChange = (url: string) => {
    setLogoUrl(url);
  };

  return {
    systemName,
    logoUrl,
    error,
    handleSystemNameChange,
    handleLogoChange
  };
}
