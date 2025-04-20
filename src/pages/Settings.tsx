
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SyncTab } from "@/components/settings/SyncTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";
import { SidebarCustomizationTab } from "@/components/settings/SidebarCustomizationTab";
import { LogoUploadSection } from "@/components/settings/LogoUploadSection";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <h1 className="text-3xl font-bold">הגדרות</h1>
      
      <Tabs defaultValue="appearance">
        <TabsList className="w-full md:w-auto grid grid-cols-5">
          <TabsTrigger value="profile">פרופיל</TabsTrigger>
          <TabsTrigger value="sync">סנכרון</TabsTrigger>
          <TabsTrigger value="appearance">עיצוב</TabsTrigger>
          <TabsTrigger value="sidebar">תפריט ניווט</TabsTrigger>
          <TabsTrigger value="logo">לוגו</TabsTrigger>
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

        <TabsContent value="logo" className="mt-6">
          <LogoUploadSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
