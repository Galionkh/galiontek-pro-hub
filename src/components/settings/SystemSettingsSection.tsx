
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogoUploadSection } from "./LogoUploadSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function SystemSettingsSection() {
  const [systemName, setSystemName] = useState("GalionTek");
  const [tempSystemName, setTempSystemName] = useState("GalionTek");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSystemName = async () => {
      // First check localStorage
      const savedName = localStorage.getItem("system_name");
      if (savedName) {
        setSystemName(savedName);
        setTempSystemName(savedName);
      }

      // Then check Supabase if user is authenticated
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('system_name')
            .eq('user_id', user.id)
            .limit(1);

          if (error) {
            console.error("Error fetching system name:", error);
            throw error;
          }

          if (data && data.length > 0 && data[0].system_name) {
            setSystemName(data[0].system_name);
            setTempSystemName(data[0].system_name);
            // Also update localStorage
            localStorage.setItem("system_name", data[0].system_name);
          }
        } catch (error) {
          console.error("Error fetching system name:", error);
        }
      }
    };

    fetchSystemName();
  }, [user]);

  const handleSystemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempSystemName(event.target.value);
  };

  const handleSave = async () => {
    if (!tempSystemName.trim()) {
      toast({
        title: "שם המערכת לא יכול להיות ריק",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update localStorage
      localStorage.setItem("system_name", tempSystemName);
      
      // Update document title
      document.title = tempSystemName + " - ניהול מרצים ומנחי סדנאות";
      
      // Update system name state
      setSystemName(tempSystemName);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('system-name-updated', { 
        detail: { systemName: tempSystemName }
      }));

      // Save to Supabase if user is authenticated
      if (user) {
        try {
          // First check if a record already exists for this user
          const { data, error: fetchError } = await supabase
            .from('user_preferences')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (fetchError) {
            console.error("Error checking for existing preferences:", fetchError);
            throw fetchError;
          }

          let saveError;
          
          if (data && data.length > 0) {
            // Record exists, update it
            const { error } = await supabase
              .from('user_preferences')
              .update({ system_name: tempSystemName })
              .eq('user_id', user.id);
            
            saveError = error;
          } else {
            // Record doesn't exist, insert new one
            const { error } = await supabase
              .from('user_preferences')
              .insert({
                user_id: user.id,
                system_name: tempSystemName
              });
            
            saveError = error;
          }

          if (saveError) {
            console.error("Error saving to Supabase:", saveError);
            throw saveError;
          }
        } catch (error) {
          console.error("Error saving preferences to Supabase:", error);
          throw error;
        }
      }
      
      toast({
        title: "שם המערכת עודכן",
        description: `שם המערכת שונה ל-${tempSystemName}`,
      });

    } catch (error) {
      console.error("Error saving system name:", error);
      toast({
        title: "שגיאה בשמירת שם המערכת",
        description: "אירעה שגיאה בעת שמירת שם המערכת",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>הגדרות מערכת</CardTitle>
        <CardDescription>התאם את הגדרות המערכת הבסיסיות</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="system-name">שם המערכת</Label>
          <div className="flex gap-2">
            <Input
              id="system-name"
              value={tempSystemName}
              onChange={handleSystemNameChange}
              placeholder="הכנס את שם המערכת"
            />
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "שומר..." : "שמור"}
            </Button>
          </div>
        </div>
        <LogoUploadSection />
      </CardContent>
    </Card>
  );
}
