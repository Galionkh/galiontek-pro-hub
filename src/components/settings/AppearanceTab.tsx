
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./appearance/ThemeToggle";
import { ColorSchemeSelector } from "./appearance/ColorSchemeSelector";
import { FontSizeControl } from "./appearance/FontSizeControl";
import { SystemIdentity } from "./appearance/SystemIdentity";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AppearanceTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
  const [fontSize, setFontSize] = useState(2);
  const [systemName, setSystemName] = useState("GalionTek");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
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
        if (data.system_name) setSystemName(data.system_name);
        if (data.logo_url) setLogoUrl(data.logo_url);
      }
    } catch (error) {
      console.error("Error loading system preferences:", error);
      setError("אירעה שגיאה בטעינת העדפות המערכת. אנא נסה שנית מאוחר יותר.");
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

  const handleSystemNameChange = (name: string) => {
    setSystemName(name);
  };

  const handleLogoChange = (url: string) => {
    setLogoUrl(url);
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <SystemIdentity
          systemName={systemName}
          logoUrl={logoUrl}
          onSystemNameChange={handleSystemNameChange}
          onLogoChange={handleLogoChange}
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
