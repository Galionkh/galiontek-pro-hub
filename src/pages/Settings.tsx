
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SyncTab } from "@/components/settings/SyncTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";
import { SidebarCustomizationTab } from "@/components/settings/SidebarCustomizationTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [connectionError, setConnectionError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  
  // Check Supabase connection on component mount
  useEffect(() => {
    checkConnection();
    
    // Create a channel to listen for Supabase reconnect events
    const channel = supabase.channel('db-connection-status');
    channel.on('system', { event: 'reconnect' }, () => {
      checkConnection();
    }).subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkConnection = async () => {
    try {
      setIsChecking(true);
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
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetryConnection = () => {
    toast({
      title: "מנסה להתחבר שוב",
      description: "בודק חיבור לשרת...",
    });
    
    checkConnection();
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <h1 className="text-3xl font-bold">הגדרות</h1>
      
      {connectionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="flex justify-between w-full items-center">
            <AlertDescription>
              שגיאת התחברות לשרת. חלק מהפונקציות לא יעבדו כראוי. אנא נסה שוב מאוחר יותר.
            </AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryConnection}
              disabled={isChecking}
              className="mr-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              נסה שוב
            </Button>
          </div>
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
