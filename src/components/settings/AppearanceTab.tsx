
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sun, Moon, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppearanceTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState("purple");
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

    // Apply color scheme
    applyColorScheme(savedColorScheme || 'purple');
    
    // Apply font size
    applyFontSize(savedFontSize ? parseInt(savedFontSize) : 2);
  }, []);

  // Function to apply color scheme to document
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

  // Function to apply font size
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
    
    // Apply color scheme
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
    
    // Apply font size
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <p className="font-medium">מצב בהיר / כהה</p>
            </div>
            <p className="text-sm text-muted-foreground">החלף בין מצב בהיר למצב כהה</p>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch id="theme-mode" checked={darkMode} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color-scheme">ערכת צבעים</Label>
          <div className="flex flex-row gap-2 mt-2">
            <button 
              onClick={() => handleColorSchemeChange('purple')}
              className={`w-16 h-10 rounded-md bg-purple-500 text-white ${colorScheme === 'purple' ? 'ring-2 ring-primary' : ''}`}
            >
              סגול
            </button>
            <button 
              onClick={() => handleColorSchemeChange('blue')}
              className={`w-16 h-10 rounded-md bg-blue-500 text-white ${colorScheme === 'blue' ? 'ring-2 ring-primary' : ''}`}
            >
              כחול
            </button>
            <button 
              onClick={() => handleColorSchemeChange('green')}
              className={`w-16 h-10 rounded-md bg-green-500 text-white ${colorScheme === 'green' ? 'ring-2 ring-primary' : ''}`}
            >
              ירוק
            </button>
            <button 
              onClick={() => handleColorSchemeChange('orange')}
              className={`w-16 h-10 rounded-md bg-orange-500 text-white ${colorScheme === 'orange' ? 'ring-2 ring-primary' : ''}`}
            >
              כתום
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-size">גודל טקסט</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm">קטן</span>
            <Slider
              id="font-size"
              min={1}
              max={3}
              step={1}
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              className="flex-1"
            />
            <span className="text-sm">גדול</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
