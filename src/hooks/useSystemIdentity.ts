
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseSystemIdentityProps {
  initialSystemName: string;
  initialLogoUrl: string;
  onSystemNameChange: (name: string) => void;
  onLogoChange: (url: string) => void;
}

export function useSystemIdentity({
  initialSystemName,
  initialLogoUrl,
  onSystemNameChange,
  onLogoChange,
}: UseSystemIdentityProps) {
  const [systemName, setSystemName] = useState(initialSystemName);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const { toast } = useToast();

  const handleSystemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSystemName(e.target.value);
  };

  const saveSystemName = async () => {
    if (!systemName.trim()) {
      toast({
        title: "שם המערכת לא יכול להיות ריק",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          system_name: systemName.trim(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      // Update document title
      document.title = systemName.trim();
      
      // Store in localStorage for persistence
      localStorage.setItem('systemName', systemName.trim());
      
      // Notify parent component
      onSystemNameChange(systemName.trim());
      
      toast({
        title: "שם המערכת נשמר בהצלחה",
        description: `שם המערכת עודכן ל-${systemName.trim()}`,
      });

      // Broadcast change to all other components
      const channel = supabase.channel('system-updates');
      await channel.send({
        type: 'broadcast',
        event: 'system_name_update',
        payload: { system_name: systemName.trim() },
      });
      supabase.removeChannel(channel);
      
    } catch (error) {
      console.error("Error saving system name:", error);
      toast({
        title: "שגיאה בשמירת שם המערכת",
        description: "אירעה שגיאה בעת שמירת שם המערכת. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Delete previous logo if exists
      if (logoUrl) {
        try {
          // Extract file path from the URL
          const urlParts = logoUrl.split('/');
          const bucketName = 'logos';
          const fileName = urlParts[urlParts.length - 1];
          
          await supabase.storage
            .from(bucketName)
            .remove([fileName]);
            
          console.log("Previous logo deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting previous logo:", deleteError);
          // Continue with upload even if delete fails
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '0',  // No cache to ensure fresh content
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL with timestamp to prevent caching
      const timestamp = new Date().getTime();
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(`${fileName}?t=${timestamp}`);

      setLogoUrl(publicUrl);
      onLogoChange(publicUrl);

      // Save the logo URL to user preferences
      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          logo_url: publicUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;
      
      // Update favicon
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.setAttribute('href', publicUrl);
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('logoUrl', publicUrl);

      // Broadcast change to all other components
      const channel = supabase.channel('system-updates');
      await channel.send({
        type: 'broadcast',
        event: 'logo_update',
        payload: { logo_url: publicUrl },
      });
      supabase.removeChannel(channel);
      
      toast({
        title: "הלוגו הועלה בהצלחה",
        description: "הלוגו הועלה ונשמר בהצלחה",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "שגיאה בהעלאת הלוגו",
        description: "אירעה שגיאה בעת העלאת הלוגו. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingLogo(false);
      // Reset file input
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const removeLogo = async () => {
    if (!logoUrl) return;
    
    try {
      setIsRemovingLogo(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Extract file path from the URL
      const urlParts = logoUrl.split('/');
      const bucketName = 'logos';
      const fileName = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
      
      // Delete the file from storage
      await supabase.storage
        .from(bucketName)
        .remove([fileName]);
      
      // Update user preferences to remove logo URL
      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          logo_url: null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;
      
      // Update local state
      setLogoUrl('');
      onLogoChange('');
      
      // Remove from localStorage
      localStorage.removeItem('logoUrl');
      
      // Reset favicon to default
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.setAttribute('href', '/favicon.svg');
      }
      
      // Broadcast change to all other components
      const channel = supabase.channel('system-updates');
      await channel.send({
        type: 'broadcast',
        event: 'logo_update',
        payload: { logo_url: null },
      });
      supabase.removeChannel(channel);
      
      toast({
        title: "הלוגו הוסר בהצלחה",
        description: "הלוגו הוסר מהמערכת",
      });
    } catch (error) {
      console.error("Error removing logo:", error);
      toast({
        title: "שגיאה בהסרת הלוגו",
        description: "אירעה שגיאה בעת הסרת הלוגו. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  return {
    systemName,
    logoUrl,
    isSaving,
    isUploadingLogo,
    isRemovingLogo,
    handleSystemNameChange,
    saveSystemName,
    handleLogoUpload,
    removeLogo
  };
}
