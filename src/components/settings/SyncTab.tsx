
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function SyncTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>סנכרון עם שירותים חיצוניים</CardTitle>
        <CardDescription>חבר את החשבון שלך לשירותים חיצוניים</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Google Calendar</p>
            <p className="text-sm text-muted-foreground">סנכרן את היומן שלך עם Google Calendar</p>
          </div>
          <Switch id="google-calendar" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Gmail</p>
            <p className="text-sm text-muted-foreground">שליחת אימיילים אוטומטית דרך החשבון שלך</p>
          </div>
          <Switch id="gmail" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Google Drive</p>
            <p className="text-sm text-muted-foreground">גיבוי קבצים ומסמכים ב-Google Drive</p>
          </div>
          <Switch id="google-drive" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">WhatsApp</p>
            <p className="text-sm text-muted-foreground">שליחת התראות והודעות דרך WhatsApp</p>
          </div>
          <Switch id="whatsapp" />
        </div>
      </CardContent>
    </Card>
  );
}
