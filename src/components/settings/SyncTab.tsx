
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export function SyncTab() {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [syncStatus, setSyncStatus] = useState({
    "google-calendar": false,
    "gmail": false,
    "google-drive": false,
    "whatsapp": false
  });
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSyncToggle = (service: string) => {
    // Check if profile email exists
    if (service === "gmail" && (!profile?.email || profile.email.trim() === "")) {
      toast({
        title: "אין כתובת אימייל",
        description: "יש להגדיר כתובת אימייל בהגדרות הפרופיל",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate sync process
    setSyncing(service);
    
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        [service]: !prev[service]
      }));
      setSyncing(null);
      
      // Show toast notification with email information where relevant
      const serviceDisplayName = getServiceName(service);
      const isConnecting = !syncStatus[service as keyof typeof syncStatus];
      const emailInfo = service === "gmail" && profile?.email ? ` (${profile.email})` : "";
      
      toast({
        title: isConnecting ? `${serviceDisplayName} חובר בהצלחה` : `${serviceDisplayName} נותק בהצלחה`,
        description: isConnecting 
          ? `השירות חובר בהצלחה${emailInfo}` 
          : `השירות נותק בהצלחה${emailInfo}`,
      });
    }, 1000);
  };

  const getServiceName = (serviceId: string) => {
    const names: Record<string, string> = {
      "google-calendar": "Google Calendar",
      "gmail": "Gmail",
      "google-drive": "Google Drive",
      "whatsapp": "WhatsApp"
    };
    return names[serviceId] || serviceId;
  };

  // For demonstration, show the current connected email in the Gmail card
  const getEmailDisplay = () => {
    if (syncStatus.gmail && profile?.email) {
      return ` (${profile.email})`;
    }
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          סנכרון עם שירותים חיצוניים
        </CardTitle>
        <CardDescription>חבר את החשבון שלך לשירותים חיצוניים</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Google Calendar</p>
            <p className="text-sm text-muted-foreground">סנכרן את היומן שלך עם Google Calendar</p>
          </div>
          <div className="flex items-center gap-2">
            {syncing === "google-calendar" && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch 
              id="google-calendar" 
              checked={syncStatus["google-calendar"]}
              onCheckedChange={() => handleSyncToggle("google-calendar")}
              disabled={syncing !== null}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Gmail{getEmailDisplay()}</p>
            <p className="text-sm text-muted-foreground">
              שליחת אימיילים אוטומטית דרך החשבון שלך
              {profile?.email && !syncStatus.gmail ? ` (${profile.email})` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {syncing === "gmail" && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch 
              id="gmail" 
              checked={syncStatus["gmail"]}
              onCheckedChange={() => handleSyncToggle("gmail")}
              disabled={syncing !== null}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Google Drive</p>
            <p className="text-sm text-muted-foreground">גיבוי קבצים ומסמכים ב-Google Drive</p>
          </div>
          <div className="flex items-center gap-2">
            {syncing === "google-drive" && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch 
              id="google-drive" 
              checked={syncStatus["google-drive"]}
              onCheckedChange={() => handleSyncToggle("google-drive")}
              disabled={syncing !== null}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">WhatsApp</p>
            <p className="text-sm text-muted-foreground">שליחת התראות והודעות דרך WhatsApp</p>
          </div>
          <div className="flex items-center gap-2">
            {syncing === "whatsapp" && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch 
              id="whatsapp" 
              checked={syncStatus["whatsapp"]}
              onCheckedChange={() => handleSyncToggle("whatsapp")}
              disabled={syncing !== null}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
