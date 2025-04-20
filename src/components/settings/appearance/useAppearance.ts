
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAppearance() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
  const [fontSize, setFontSize] = useState(2);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    
    const savedColorScheme = localStorage.getItem('colorScheme') || 'purple';
    setColorScheme(savedColorScheme);
    
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    applyColorScheme(savedColorScheme || 'purple');
    applyFontSize(savedFontSize ? parseInt(savedFontSize) : 2);
  }, []);

  const applyColorScheme = (scheme: string) => {
    document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange');
    document.documentElement.classList.add(`theme-${scheme}`);
    
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

    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
  };

  const applyFontSize = (size: number) => {
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(getFontSizeClass(size));
    
    switch(size) {
      case 1:
        document.body.style.fontSize = '0.875rem';
        break;
      case 2:
        document.body.style.fontSize = '1rem';
        break;
      case 3:
        document.body.style.fontSize = '1.125rem';
        break;
      default:
        document.body.style.fontSize = '1rem';
    }
  };

  const getFontSizeClass = (size: number) => {
    const classes: Record<number, string> = {
      1: 'text-sm',
      2: 'text-base',
      3: 'text-lg'
    };
    return classes[size] || 'text-base';
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: "ערכת הנושא השתנתה",
      description: `עברת למצב ${!darkMode ? 'כהה' : 'בהיר'}`,
    });
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    
    applyColorScheme(scheme);
    
    toast({
      title: "ערכת צבעים עודכנה",
      description: `ערכת הצבעים השתנתה ל${getColorSchemeName(scheme)}`,
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    
    applyFontSize(newSize);
    
    toast({
      title: "גודל הטקסט עודכן",
      description: `גודל הטקסט השתנה ל${getFontSizeName(newSize)}`,
    });
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

  return {
    darkMode,
    colorScheme,
    fontSize,
    toggleTheme,
    handleColorSchemeChange,
    handleFontSizeChange
  };
}
