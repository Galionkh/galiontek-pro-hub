
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

export function SystemCustomizationSection() {
  const [systemName, setSystemName] = useState("GalionTek");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('system_name, logo_url')
          .maybeSingle();

        if (error) {
          console.error("Error loading preferences:", error);
          return;
        }

        if (data) {
          if (data.system_name) setSystemName(data.system_name);
          if (data.logo_url) setLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setLogo(file);
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "עליך להתחבר כדי לשמור העדפות",
        });
        return;
      }

      let newLogoUrl = logoUrl;

      // Upload new logo if selected
      if (logo) {
        const fileExt = logo.name.split('.').pop();
        const filePath = `${session.user.id}/logo.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('system-assets')
          .upload(filePath, logo, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('system-assets')
          .getPublicUrl(filePath);

        newLogoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          system_name: systemName,
          logo_url: newLogoUrl,
        });

      if (error) throw error;

      toast({
        title: "ההעדפות נשמרו",
        description: "הגדרות המערכת עודכנו בהצלחה",
      });

      // Update favicon if logo was changed
      if (newLogoUrl) {
        // Fix the favicon update logic
        const linkElements = document.querySelectorAll("link[rel*='icon']");
        let linkElement: HTMLLinkElement;
        
        if (linkElements.length > 0) {
          linkElement = linkElements[0] as HTMLLinkElement;
        } else {
          linkElement = document.createElement('link');
          linkElement.rel = 'shortcut icon';
          document.head.appendChild(linkElement);
        }
        
        linkElement.type = 'image/x-icon';
        linkElement.href = newLogoUrl;
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בעת שמירת ההעדפות",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>התאמת המערכת</CardTitle>
        <CardDescription>
          התאם את שם המערכת והלוגו המוצגים במערכת
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="systemName">שם המערכת</Label>
          <Input
            id="systemName"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder="הזן שם למערכת"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">לוגו המערכת</Label>
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img src={logoUrl} alt="לוגו המערכת" className="h-10 w-10 object-contain" />
            )}
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="flex-1"
            />
          </div>
        </div>

        <Button 
          onClick={savePreferences} 
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? "שומר..." : "שמור שינויים"}
        </Button>
      </CardContent>
    </Card>
  );
}
