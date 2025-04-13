
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProfileFormValues = {
  id?: number;
  name: string;
  email: string;
  tel: string;
  orgname: string;
};

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      orgname: "",
    },
  });

  // פונקציה לטעינת נתוני הפרופיל מהדאטאבייס
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        form.reset({
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          tel: data.tel || "",
          orgname: data.orgname || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לשמירת נתוני הפרופיל בדאטאבייס
  const saveProfile = async (data: ProfileFormValues) => {
    try {
      setLoading(true);
      
      if (profile) {
        // עדכון פרופיל קיים
        const { error } = await supabase
          .from("profile")
          .update({
            name: data.name,
            email: data.email,
            tel: data.tel,
            orgname: data.orgname,
          })
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        // יצירת פרופיל חדש
        const { error } = await supabase
          .from("profile")
          .insert([
            {
              name: data.name,
              email: data.email,
              tel: data.tel,
              orgname: data.orgname,
            },
          ]);

        if (error) throw error;
      }

      toast({
        title: "הפרופיל נשמר בהצלחה",
        description: "הפרטים האישיים שלך עודכנו במערכת",
      });
      
      // טעינה מחדש של הנתונים
      fetchProfile();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "שגיאה בשמירת הפרופיל",
        description: error.message || "אירעה שגיאה בעת שמירת הפרטים האישיים",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // טעינת נתוני הפרופיל בעת טעינת העמוד
  useEffect(() => {
    fetchProfile();
  }, []);

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
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(saveProfile)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="name">שם מלא</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="שם מלא" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="email">אימייל</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="אימייל" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tel"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="phone">טלפון</FormLabel>
                        <FormControl>
                          <Input id="phone" placeholder="טלפון" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="orgname"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="business">שם העסק</FormLabel>
                        <FormControl>
                          <Input id="business" placeholder="שם העסק" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>שמור שינויים</span>
                  </Button>
                </form>
              </Form>
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
