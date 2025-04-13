
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProfileFormValues } from "@/components/settings/ProfileTab";

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);
  const { toast } = useToast();

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
      
      if (profile && profile.id) {
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

  return { profile, loading, saveProfile, fetchProfile };
}
