
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SystemSettingsSection() {
  const [systemName, setSystemName] = useState("GalionTek");
  const { toast } = useToast();

  // Load saved system name on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("system_name");
    if (savedName) {
      setSystemName(savedName);
    }
  }, []);

  const handleSystemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setSystemName(newName);
    localStorage.setItem("system_name", newName);
    
    toast({
      title: "שם המערכת עודכן",
      description: `שם המערכת שונה ל-${newName}`,
    });
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
          <Input
            id="system-name"
            value={systemName}
            onChange={handleSystemNameChange}
            placeholder="הכנס את שם המערכת"
          />
        </div>
      </CardContent>
    </Card>
  );
}
