
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export function AppearanceTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<string>("default");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [systemName, setSystemName] = useState("GalionTek");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewChanges, setPreviewChanges] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Load saved preferences
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme, font_size, dark_mode, system_name, logo_url')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading appearance settings:", error);
          return;
        }

        if (data) {
          if (data.theme) setTheme(data.theme);
          if (data.font_size) setFontSize(data.font_size);
          if (data.dark_mode !== null) setDarkMode(data.dark_mode);
          if (data.system_name) setSystemName(data.system_name);
          if (data.logo_url) setLogoUrl(data.logo_url);
          
          // Apply settings immediately on load
          applyAppearanceSettings(data.theme, data.font_size, data.dark_mode);
        }
      } catch (error) {
        console.error("Error loading appearance settings:", error);
      }
    };

    loadAppearanceSettings();
  }, []);

  // Apply changes in real-time if preview is enabled
  useEffect(() => {
    if (previewChanges) {
      applyAppearanceSettings(theme, fontSize, darkMode);
    }
  }, [theme, fontSize, darkMode, previewChanges]);

  const applyAppearanceSettings = (theme: string | null, fontSize: string | null, darkMode: boolean | null) => {
    // Apply theme changes
    document.documentElement.className = '';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    if (theme && theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }

    // Apply font size changes
    if (fontSize) {
      switch (fontSize) {
        case 'small':
          document.documentElement.style.fontSize = '14px';
          break;
        case 'medium':
          document.documentElement.style.fontSize = '16px';
          break;
        case 'large':
          document.documentElement.style.fontSize = '18px';
          break;
      }
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    
    if (file) {
      // Check file size (limit to 500KB)
      if (file.size > 500 * 1024) {
        setFileError("הקובץ גדול מדי. יש להעלות קובץ עד 500KB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setFileError("הקובץ אינו תמונה. יש להעלות תמונה בלבד");
        return;
      }
      
      setLogo(file);
    }
  };

  const saveAppearanceSettings = async () => {
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
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('system-assets')
          .upload(filePath, logo, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('system-assets')
          .getPublicUrl(filePath);

        newLogoUrl = publicUrl;
      }

      console.log("Saving preferences:", {
        user_id: session.user.id,
        system_name: systemName,
        logo_url: newLogoUrl,
        theme,
        font_size: fontSize,
        dark_mode: darkMode
      });

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          system_name: systemName,
          logo_url: newLogoUrl,
          theme,
          font_size: fontSize,
          dark_mode: darkMode
        });

      if (error) {
        console.error("Upsert error:", error);
        throw error;
      }

      // Apply appearance settings
      applyAppearanceSettings(theme, fontSize, darkMode);

      // Update favicon if logo was changed
      if (newLogoUrl) {
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

      setLogoUrl(newLogoUrl);

      toast({
        title: "העדפות נשמרו",
        description: "הגדרות המערכת והעיצוב עודכנו בהצלחה",
      });
      
      // Force reload sidebar to show changes
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error saving appearance settings:", error);
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
    <div className="space-y-6">
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
              <div className="flex-1 flex flex-col">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="flex-1"
                />
                {fileError && <p className="text-destructive text-sm mt-1">{fileError}</p>}
                <p className="text-sm text-muted-foreground mt-1">מקסימום 500KB, פורמט תמונה בלבד</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>עיצוב ומראה</CardTitle>
          <CardDescription>
            התאם את צבעי המערכת וגודל הטקסט
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="preview-changes">תצוגה מקדימה של שינויים</Label>
            <Switch
              id="preview-changes"
              checked={previewChanges}
              onCheckedChange={setPreviewChanges}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="theme">ערכת צבעים</Label>
            <RadioGroup 
              id="theme"
              value={theme} 
              onValueChange={setTheme}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default" className="flex-1">ברירת מחדל (סגול)</Label>
                <div className="h-6 w-6 rounded-full bg-primary" />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="blue" id="blue" />
                <Label htmlFor="blue" className="flex-1">כחול</Label>
                <div className="h-6 w-6 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="green" id="green" />
                <Label htmlFor="green" className="flex-1">ירוק</Label>
                <div className="h-6 w-6 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="orange" id="orange" />
                <Label htmlFor="orange" className="flex-1">כתום</Label>
                <div className="h-6 w-6 rounded-full bg-orange-500" />
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="fontSize">גודל טקסט</Label>
            <RadioGroup 
              id="fontSize"
              value={fontSize} 
              onValueChange={setFontSize}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">קטן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">בינוני</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">גדול</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode">מצב כהה</Label>
          </div>

          <Button 
            onClick={saveAppearanceSettings} 
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "שומר..." : "שמור שינויים"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
