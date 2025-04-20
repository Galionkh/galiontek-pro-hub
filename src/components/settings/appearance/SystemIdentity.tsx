
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SystemIdentityProps {
  systemName: string;
  logoUrl: string;
  onSystemNameChange: (name: string) => void;
  onLogoChange: (url: string) => void;
}

export function SystemIdentity({
  systemName,
  logoUrl,
  onSystemNameChange,
  onLogoChange,
}: SystemIdentityProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSystemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSystemNameChange(e.target.value);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onLogoChange(publicUrl);
      
      toast({
        title: "הלוגו הועלה בהצלחה",
        description: "הלוגו הועלה ונשמר בהצלחה",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "שגיאה בהעלאת הלוגו",
        description: "אירעה שגיאה בעת העלאת הלוגו. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="system-name">שם המערכת</Label>
        <div className="flex gap-2">
          <Input
            id="system-name"
            value={systemName}
            onChange={handleSystemNameChange}
            placeholder="הזן שם למערכת"
            className="flex-1"
          />
          <Button onClick={() => {}}>
            <Save className="h-4 w-4 mr-2" />
            שמור
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>לוגו המערכת</Label>
        <div className="flex items-center gap-4">
          {logoUrl && (
            <Avatar className="h-16 w-16">
              <AvatarImage src={logoUrl} alt="System Logo" />
              <AvatarFallback>{systemName.charAt(0) || "G"}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <Label
              htmlFor="logo-upload"
              className="flex items-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-accent"
            >
              <Image className="h-4 w-4" />
              {isSaving ? "מעלה..." : "העלה לוגו חדש"}
            </Label>
            {!logoUrl && (
              <p className="text-sm text-muted-foreground mt-2">
                טרם הועלה לוגו למערכת
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
