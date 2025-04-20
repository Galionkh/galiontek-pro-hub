
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogoUploadSection } from "./LogoUploadSection";

export function SystemSettingsSection() {
  const [systemName, setSystemName] = useState("GalionTek");
  const [tempSystemName, setTempSystemName] = useState("GalionTek");
  const { toast } = useToast();

  useEffect(() => {
    const savedName = localStorage.getItem("system_name");
    if (savedName) {
      setSystemName(savedName);
      setTempSystemName(savedName);
    }
  }, []);

  const handleSystemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempSystemName(event.target.value);
  };

  const handleSave = () => {
    setSystemName(tempSystemName);
    localStorage.setItem("system_name", tempSystemName);
    document.title = tempSystemName + " - ניהול מרצים ומנחי סדנאות";
    
    toast({
      title: "שם המערכת עודכן",
      description: `שם המערכת שונה ל-${tempSystemName}`,
    });

    // Refresh the page to update all components
    window.location.reload();
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
            <Button onClick={handleSave}>
              שמור
            </Button>
          </div>
        </div>
        <LogoUploadSection />
      </CardContent>
    </Card>
  );
}
