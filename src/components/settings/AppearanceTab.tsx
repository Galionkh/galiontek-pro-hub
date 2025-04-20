import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define available system icons
const systemIcons = [
  { value: "LayoutDashboard", label: "דשבורד" },
  { value: "Users", label: "משתמשים" },
  { value: "Settings", label: "הגדרות" },
  { value: "FileText", label: "מסמך" },
  { value: "Calendar", label: "יומן" },
];

export function AppearanceTab() {
  const [systemName, setSystemName] = useState("GalionTek");
  const [systemIcon, setSystemIcon] = useState("LayoutDashboard");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('system_name, system_icon')
          .single();

        if (error) throw error;

        if (data) {
          setSystemName(data.system_name || "GalionTek");
          setSystemIcon(data.system_icon || "LayoutDashboard");
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "עליך להתחבר כדי לשמור העדפות",
        });
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          system_name: systemName,
          system_icon: systemIcon,
        });

      if (error) throw error;

      toast({
        title: "ההעדפות נשמרו",
        description: "הגדרות המערכת עודכנו בהצלחה",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בעת שמירת ההעדפות",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>התאמה אישית</CardTitle>
          <CardDescription>
            התאם את שם המערכת והאייקון המוצגים בתפריט הניווט
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemName">שם המערכת</Label>
            <Input
              id="systemName"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="הזן שם למערכת"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="systemIcon">אייקון המערכת</Label>
            <Select value={systemIcon} onValueChange={setSystemIcon}>
              <SelectTrigger>
                <SelectValue placeholder="בחר אייקון" />
              </SelectTrigger>
              <SelectContent>
                {systemIcons.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{icon.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={savePreferences} 
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "שומר..." : "שמור שינויים"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
