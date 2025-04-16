
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppearanceTab() {
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    
    // Apply the theme on initial load
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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
    <Card dir="rtl">
      <CardHeader>
        <CardTitle>תצוגה</CardTitle>
        <CardDescription>התאם את התצוגה לפי העדפותיך</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
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
          <Label htmlFor="font-size">גודל טקסט</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm">קטן</span>
            <input type="range" id="font-size" min="1" max="3" defaultValue="2" className="flex-1" />
            <span className="text-sm">גדול</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
