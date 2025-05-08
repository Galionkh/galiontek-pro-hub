import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export type ProfileFormValues = {
  id?: number;
  name: string;
  email: string;
  tel: string;
  business_name: string;
  address: string;
  business_type: string;
  id_number: string;
};

export function ProfileTab() {
  const { profile, loading, saveProfile, fetchProfile } = useProfile();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Recreate form when profile changes
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      tel: profile?.tel || "",
      business_name: profile?.business_name || "",
      address: profile?.address || "",
      business_type: profile?.business_type || "",
      id_number: profile?.id_number || "",
    },
  });
  
  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        tel: profile.tel || "",
        business_name: profile.business_name || "",
        address: profile.address || "",
        business_type: profile.business_type || "",
        id_number: profile.id_number || "",
      });
    }
  }, [profile, form]);
  
  const handleSubmit = async (data: ProfileFormValues) => {
    setFormSubmitted(true);
    await saveProfile(data);
    // Immediately fetch the updated profile after saving
    await fetchProfile();
    setFormSubmitted(false);
  };

  return (
    <Card dir="rtl">
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
              name="business_name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="business_name">שם העסק</FormLabel>
                  <FormControl>
                    <Input id="business_name" placeholder="שם העסק" {...field} className="text-right" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="address">כתובת</FormLabel>
                  <FormControl>
                    <Input id="address" placeholder="כתובת" {...field} className="text-right" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="business_type">סוג עסק</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="business_type" className="text-right">
                        <SelectValue placeholder="בחר סוג עסק" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="company">חברה</SelectItem>
                      <SelectItem value="authorized_dealer">עוסק מורשה</SelectItem>
                      <SelectItem value="exempt_dealer">עסק פטור</SelectItem>
                      <SelectItem value="employee">שכיר</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_number"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="id_number">מספר תעודת זהות או ח.פ</FormLabel>
                  <FormControl>
                    <Input id="id_number" placeholder="מספר תעודת זהות או ח.פ" {...field} className="text-right" />
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
  );
}
