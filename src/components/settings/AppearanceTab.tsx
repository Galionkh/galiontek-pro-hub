import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AppearanceTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>התאמה אישית</CardTitle>
          <CardDescription>
            התאם את תצוגת המערכת לפי העדפותיך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>הגדרות תצוגה בפיתוח...</Label>
          </div>

          <Button 
            onClick={() => {}} 
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
