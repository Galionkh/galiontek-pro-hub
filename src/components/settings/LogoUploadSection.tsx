
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as LucideImage } from "lucide-react";

export function LogoUploadSection() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserLogo();
  }, []);

  const fetchUserLogo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('logo_url')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setLogoUrl(data?.logo_url ?? null);
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}_logo.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          logo_url: publicUrl
        });

      if (updateError) throw updateError;

      setLogoUrl(publicUrl);
      toast({
        title: "לוגו עודכן בהצלחה",
        description: "הלוגו שלך נשמר וייראה בכל רחבי המערכת"
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "שגיאה בהעלאת לוגו",
        description: "אירעה שגיאה בעת העלאת הלוגו",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          logo_url: null
        });

      if (updateError) throw updateError;

      setLogoUrl(null);
      toast({
        title: "לוגו הוסר",
        description: "הלוגו הוסר מהמערכת"
      });
    } catch (error) {
      console.error("Error removing logo:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>העלאת לוגו</CardTitle>
        <CardDescription>בחר לוגו חדש למערכת</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 border rounded-md flex items-center justify-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="לוגו המערכת" 
                className="max-w-full max-h-full object-contain" 
              />
            ) : (
              <LucideImage className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="logo-upload"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="logo-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                disabled={isUploading}
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'מעלה...' : 'העלה לוגו'}
                </span>
              </Button>
            </label>
            {logoUrl && (
              <Button 
                variant="destructive" 
                onClick={handleRemoveLogo}
              >
                הסר לוגו
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
