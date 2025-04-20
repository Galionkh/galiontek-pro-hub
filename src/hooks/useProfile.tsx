
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileFormValues } from "@/components/settings/ProfileTab";

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // פונקציה לטעינת נתוני הפרופיל מהדאטאבייס
  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is the error for no rows returned
        console.error("Error fetching profile:", error);
        toast({
          title: "שגיאה בטעינת פרופיל",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // If no profile exists yet, create a default one with the user's email
        const email = user.email || "";
        setProfile({
          name: "",
          email,
          tel: "",
          orgname: "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "שגיאה בטעינת פרופיל",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // פונקציה לשמירת נתוני הפרופיל בדאטאבייס
  const saveProfile = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "אינך מחובר",
        description: "עליך להתחבר כדי לשמור את הפרופיל",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const profileData = {
        user_id: user.id,
        name: data.name,
        email: data.email,
        tel: data.tel,
        orgname: data.orgname,
      };
      
      if (profile && profile.id) {
        // עדכון פרופיל קיים
        const { error } = await supabase
          .from("profile")
          .update(profileData)
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        // יצירת פרופיל חדש
        const { error } = await supabase
          .from("profile")
          .insert([profileData]);

        if (error) throw error;
      }

      toast({
        title: "הפרופיל נשמר בהצלחה",
        description: "הפרטים האישיים שלך עודכנו במערכת",
      });
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

  // טעינת נתוני הפרופיל בעת טעינת העמוד או שינוי המשתמש
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  return { profile, loading, saveProfile, fetchProfile };
}
