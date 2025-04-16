
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SyncTab } from "@/components/settings/SyncTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <h1 className="text-3xl font-bold">הגדרות</h1>
      
      <Tabs defaultValue="appearance">
        <TabsList className="w-full md:w-auto grid grid-cols-3">
          <TabsTrigger value="profile">פרופיל</TabsTrigger>
          <TabsTrigger value="sync">סנכרון</TabsTrigger>
          <TabsTrigger value="appearance">עיצוב</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
