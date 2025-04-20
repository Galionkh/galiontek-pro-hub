
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThemeToggleProps {
  initialDarkMode: boolean;
}

export function ThemeToggle({ initialDarkMode }: ThemeToggleProps) {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const { toast } = useToast();

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

  return (
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
  );
}
