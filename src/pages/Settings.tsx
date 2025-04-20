
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SyncTab } from "@/components/settings/SyncTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";
import { SidebarCustomizationTab } from "@/components/settings/SidebarCustomizationTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [connectionError, setConnectionError] = useState(false);
  
  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check connection
        const { error } = await supabase.from('user_preferences').select('id').limit(1);
        if (error && (error.message.includes('Failed to fetch') || error.code === 'PGRST301')) {
          setConnectionError(true);
        } else {
          setConnectionError(false);
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <h1 className="text-3xl font-bold">הגדרות</h1>
      
      {connectionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            שגיאת התחברות לשרת. חלק מהפונקציות לא יעבדו כראוי. אנא נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="appearance">
        <TabsList className="w-full md:w-auto grid grid-cols-4">
          <TabsTrigger value="profile">פרופיל</TabsTrigger>
          <TabsTrigger value="sync">סנכרון</TabsTrigger>
          <TabsTrigger value="appearance">עיצוב</TabsTrigger>
          <TabsTrigger value="sidebar">תפריט ניווט</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="sync" className="mt-6">
          <SyncTab />
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="sidebar" className="mt-6">
          <SidebarCustomizationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
