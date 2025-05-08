
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ThemeToggleProps {
  initialDarkMode: boolean;
  onThemeChange?: (isDarkMode: boolean) => void;
}

export function ThemeToggle({ initialDarkMode, onThemeChange }: ThemeToggleProps) {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const { toast } = useToast();

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Notify parent component about theme change
    if (onThemeChange) {
      onThemeChange(newDarkMode);
    }
    
    toast({
      title: newDarkMode ? "מצב כהה הופעל" : "מצב בהיר הופעל",
      description: newDarkMode 
        ? "המערכת עברה למצב תצוגה כהה" 
        : "המערכת עברה למצב תצוגה בהיר",
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="dark-mode">מצב כהה</Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="dark-mode" className="mr-2 cursor-pointer">
          {darkMode ? "מופעל" : "כבוי"}
        </Label>
      </div>
    </div>
  );
}
