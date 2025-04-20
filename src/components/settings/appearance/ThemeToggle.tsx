
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
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
        <Switch id="theme-mode" checked={darkMode} onCheckedChange={onToggle} />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
