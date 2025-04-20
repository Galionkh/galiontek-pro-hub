import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./appearance/ThemeToggle";
import { ColorSchemeSelector } from "./appearance/ColorSchemeSelector";
import { FontSizeControl } from "./appearance/FontSizeControl";
import { SystemIdentity } from "./appearance/SystemIdentity";

export function AppearanceTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
  const [fontSize, setFontSize] = useState(2);
  const [systemName, setSystemName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    
    // Get saved color scheme
    const savedColorScheme = localStorage.getItem('colorScheme') || 'purple';
    setColorScheme(savedColorScheme);
    
    // Get saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
    
    // Apply the theme on initial load
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply color scheme and font size
    applyColorScheme(savedColorScheme || 'purple');
    applyFontSize(savedFontSize ? parseInt(savedFontSize) : 2);

    // Load system preferences
    loadSystemPreferences();
  }, []);

  const loadSystemPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('system_name, logo_url')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSystemName(data[0].system_name || "");
        setLogoUrl(data[0].logo_url || "");
      }
    } catch (error) {
      console.error("Error loading system preferences:", error);
      toast({
        title: "שגיאה בטעינת העדפות המערכת",
        description: "אירעה שגיאה בטעינת שם המערכת והלוגו",
        variant: "destructive",
      });
    }
  };

  const applyColorScheme = (scheme: string) => {
    // Remove any existing color scheme classes
    document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange');
    // Add new color scheme class
    document.documentElement.classList.add(`theme-${scheme}`);
    
    // Update CSS variables based on the color scheme
    let primary, secondary;
    switch(scheme) {
      case 'purple':
        primary = '262 30% 50%';
        secondary = '260 100% 97%';
        break;
      case 'blue':
        primary = '210 100% 50%';
        secondary = '210 100% 97%';
        break;
      case 'green':
        primary = '142 76% 36%';
        secondary = '142 76% 97%';
        break;
      case 'orange':
        primary = '27 96% 61%';
        secondary = '27 100% 97%';
        break;
      default:
        primary = '262 30% 50%';
        secondary = '260 100% 97%';
    }

    // Apply CSS variables for both light and dark mode
    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
  };

  const applyFontSize = (size: number) => {
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(getFontSizeClass(size));
    
    // Update font size on the body
    switch(size) {
      case 1:
        document.body.style.fontSize = '0.875rem'; // text-sm
        break;
      case 2:
        document.body.style.fontSize = '1rem'; // text-base
        break;
      case 3:
        document.body.style.fontSize = '1.125rem'; // text-lg
        break;
      default:
        document.body.style.fontSize = '1rem';
    }
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    applyColorScheme(scheme);
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    applyFontSize(newSize);
  };

  const saveSystemPreferences = async (newLogoUrl?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          system_name: systemName,
          logo_url: newLogoUrl || logoUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "נשמר בהצלחה",
        description: "העדפות המערכת נשמרו בהצלחה",
      });
    } catch (error) {
      console.error("Error saving system preferences:", error);
      toast({
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בשמירת העדפות המערכת",
        variant: "destructive",
      });
    }
  };

  const getColorSchemeName = (scheme: string) => {
    const names: Record<string, string> = {
      'purple': 'סגול',
      'blue': 'כחול',
      'green': 'ירוק',
      'orange': 'כתום'
    };
    return names[scheme] || scheme;
  };

  const getFontSizeName = (size: number) => {
    const names: Record<number, string> = {
      1: 'קטן',
      2: 'בינוני',
      3: 'גדול'
    };
    return names[size] || 'בינוני';
  };

  const getFontSizeClass = (size: number) => {
    const classes: Record<number, string> = {
      1: 'text-sm',
      2: 'text-base',
      3: 'text-lg'
    };
    return classes[size] || 'text-base';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ערכת צבעים</CardTitle>
        <CardDescription>התאם את התצוגה לפי העדפותיך</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SystemIdentity
          systemName={systemName}
          logoUrl={logoUrl}
          onSystemNameChange={setSystemName}
          onLogoChange={setLogoUrl}
        />
        
        <ThemeToggle initialDarkMode={darkMode} />
        
        <ColorSchemeSelector
          currentScheme={colorScheme}
          onSchemeChange={handleColorSchemeChange}
        />
        
        <FontSizeControl
          currentSize={fontSize}
          onSizeChange={handleFontSizeChange}
        />
      </CardContent>
    </Card>
  );
}
