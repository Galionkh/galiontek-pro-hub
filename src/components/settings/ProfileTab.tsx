
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileFormValues } from "@/types/profile";

export function ProfileTab() {
  const { profile, loading, saveProfile, fetchProfile } = useProfile();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      tel: profile?.tel || "",
      orgname: profile?.orgname || "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        tel: profile.tel || "",
        orgname: profile.orgname || "",
      });
    }
  }, [profile, form]);
  
  const handleSubmit = async (data: ProfileFormValues) => {
    setFormSubmitted(true);
    await saveProfile(data);
    await fetchProfile();
    setFormSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>פרטים אישיים</CardTitle>
          <CardDescription>עדכן את הפרטים האישיים שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="name">שם מלא</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="שם מלא" {...field} className="text-right" />
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
                      <Input id="email" type="email" placeholder="אימייל" {...field} className="text-right" />
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
                      <Input id="phone" placeholder="טלפון" {...field} className="text-right" />
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
                      <Input id="business" placeholder="שם העסק" {...field} className="text-right" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={loading || formSubmitted} className="flex items-center gap-2">
                {(loading || formSubmitted) ? (
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
    </div>
  );
}
