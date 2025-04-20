
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { SystemCustomizationSection } from "./SystemCustomizationSection";

export function AppearanceTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<string>("default");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme, font_size, dark_mode')
          .maybeSingle();

        if (error) {
          console.error("Error loading appearance settings:", error);
          return;
        }

        if (data) {
          if (data.theme) setTheme(data.theme);
          if (data.font_size) setFontSize(data.font_size);
          if (data.dark_mode !== null) setDarkMode(data.dark_mode);
        }
      } catch (error) {
        console.error("Error loading appearance settings:", error);
      }
    };

    loadAppearanceSettings();
  }, []);

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

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          theme,
          font_size: fontSize,
          dark_mode: darkMode
        });

      if (error) throw error;

      // Apply theme changes
      document.documentElement.className = '';
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
      if (theme !== 'default') {
        document.documentElement.classList.add(`theme-${theme}`);
      }

      // Apply font size changes
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

      toast({
        title: "העדפות נשמרו",
        description: "הגדרות העיצוב עודכנו בהצלחה",
      });
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בעת שמירת העדפות העיצוב",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SystemCustomizationSection />
      
      <Card>
        <CardHeader>
          <CardTitle>עיצוב ומראה</CardTitle>
          <CardDescription>
            התאם את צבעי המערכת וגודל הטקסט
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
