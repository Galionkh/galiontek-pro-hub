
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

export function AppearanceTab() {
  return (
    <Card>
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
            <Switch id="theme-mode" />
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
