
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">הגדרות</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="profile">פרופיל</TabsTrigger>
          <TabsTrigger value="sync">סנכרון</TabsTrigger>
          <TabsTrigger value="appearance">עיצוב</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטים אישיים</CardTitle>
              <CardDescription>עדכן את הפרטים האישיים שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא</Label>
                <Input id="name" placeholder="שם מלא" defaultValue="אלעד ישראלי" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input id="email" type="email" placeholder="אימייל" defaultValue="elad@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input id="phone" placeholder="טלפון" defaultValue="050-1234567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">שם העסק</Label>
                <Input id="business" placeholder="שם העסק" defaultValue="הרצאות וסדנאות מקצועיות" />
              </div>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>שמור שינויים</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
