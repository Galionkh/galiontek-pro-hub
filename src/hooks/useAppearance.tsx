
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hexToHSL, generateSecondaryColor } from "@/lib/colorUtils";

export function useAppearance() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
  const [customColor, setCustomColor] = useState<string | undefined>();
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
    
    // Get saved custom color
    const savedCustomColor = localStorage.getItem('customColor');
    if (savedCustomColor && savedColorScheme === 'custom') {
      setCustomColor(savedCustomColor);
    }
    
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
    if (savedColorScheme === 'custom' && savedCustomColor) {
      applyCustomColorScheme(savedCustomColor, savedTheme === 'dark');
    } else {
      applyColorScheme(savedColorScheme || 'purple');
    }
    
    applyFontSize(savedFontSize ? parseInt(savedFontSize) : 2);

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

  const applyColorScheme = (scheme: string) => {
    // Remove any existing color scheme classes
    document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange', 'theme-custom');
    
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

  const applyCustomColorScheme = (hexColor: string, isDarkMode: boolean) => {
    try {
      // Remove any existing color scheme classes
      document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange');
      document.documentElement.classList.add('theme-custom');
      
      // Convert HEX to HSL
      const primaryHsl = hexToHSL(hexColor);
      const secondaryHsl = generateSecondaryColor(primaryHsl, isDarkMode);
      
      // Apply CSS variables
      const root = document.documentElement;
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--secondary', secondaryHsl);
      
      // Set sidebar colors derived from primary
      root.style.setProperty('--sidebar-background', primaryHsl);
      root.style.setProperty('--sidebar-accent', adjustLightness(primaryHsl, isDarkMode ? 1.2 : 0.8));
      root.style.setProperty('--sidebar-border', adjustLightness(primaryHsl, isDarkMode ? 0.8 : 0.9));
      
      console.log(`Applied custom color: ${hexColor}, HSL: ${primaryHsl}, secondary: ${secondaryHsl}`);
    } catch (error) {
      console.error("Error applying custom color:", error);
      // Fallback to default purple
      applyColorScheme('purple');
    }
  };

  // Helper function to adjust lightness of HSL color for derived colors
  const adjustLightness = (hsl: string, factor: number): string => {
    const parts = hsl.split(' ');
    if (parts.length < 3) return hsl;
    
    const h = parts[0];
    const s = parts[1];
    const l = parseInt(parts[2]);
    const newL = Math.min(100, Math.max(0, Math.round(l * factor)));
    
    return `${h} ${s} ${newL}%`;
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
    
    // If not custom, apply predefined scheme
    if (scheme !== 'custom') {
      applyColorScheme(scheme);
    } 
    // If custom and we have a custom color, apply it
    else if (customColor) {
      applyCustomColorScheme(customColor, darkMode);
    }
  };

  const handleCustomColorChange = (hexColor: string) => {
    setCustomColor(hexColor);
    localStorage.setItem('customColor', hexColor);
    localStorage.setItem('colorScheme', 'custom');
    setColorScheme('custom');
    applyCustomColorScheme(hexColor, darkMode);
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

  return {
    darkMode,
    colorScheme,
    customColor,
    fontSize,
    systemName,
    logoUrl,
    error,
    setDarkMode,
    handleColorSchemeChange,
    handleCustomColorChange,
    handleFontSizeChange,
    handleSystemNameChange,
    handleLogoChange
  };
}
