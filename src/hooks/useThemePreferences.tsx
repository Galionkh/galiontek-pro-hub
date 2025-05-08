
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { applyColorScheme, applyCustomColorScheme, applyFontSize } from "@/lib/themeUtils";

export function useThemePreferences() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
  const [customColor, setCustomColor] = useState<string | undefined>();
  const [fontSize, setFontSize] = useState(2);
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
  }, []);

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

  const setThemeMode = (isDark: boolean) => {
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Re-apply color scheme when theme changes for custom colors
    if (colorScheme === 'custom' && customColor) {
      applyCustomColorScheme(customColor, isDark);
    }
  };

  return {
    darkMode,
    colorScheme,
    customColor,
    fontSize,
    setDarkMode: setThemeMode,
    handleColorSchemeChange,
    handleCustomColorChange,
    handleFontSizeChange
  };
}
