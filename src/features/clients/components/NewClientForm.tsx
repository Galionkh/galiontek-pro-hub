
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ClientFormDialog } from "./ClientFormDialog";
import { ClientTypeSelector } from "./ClientTypeSelector";
import { EducationalClientForm } from "./EducationalClientForm";
import { CompanyClientForm } from "./CompanyClientForm";
import { IndividualClientForm } from "./IndividualClientForm";

interface NewClientFormProps {
  onClientAdded: () => void;
}

export function NewClientForm({ onClientAdded }: NewClientFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [clientType, setClientType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    status: "active",
    notes: "",
    institution_number: "",
    institution_type: "",
    city: "",
    address: "",
    principal_name: "",
    principal_email: "",
    business_field: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!clientType) {
      toast({
        title: "שגיאה",
        description: "יש לבחור סוג לקוח",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.from("clients").insert({
        ...formData,
        user_id: user.id,
        client_type: clientType,
      });

      if (error) throw error;

      toast({ title: "הלקוח נוסף בהצלחה" });
      setFormData({
        name: "",
        contact: "",
        email: "",
        status: "active",
        notes: "",
        institution_number: "",
        institution_type: "",
        city: "",
        address: "",
        principal_name: "",
        principal_email: "",
        business_field: "",
      });
      setClientType("");
      setIsOpen(false);
      onClientAdded();
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({ 
        title: "שגיאה", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFormByType = () => {
    switch (clientType) {
      case "educational":
        return <EducationalClientForm formData={formData} onChange={handleChange} />;
      case "company":
        return <CompanyClientForm formData={formData} onChange={handleChange} />;
      case "individual":
        return <IndividualClientForm formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <ClientFormDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
      title="לקוח חדש"
      submitLabel="שמור לקוח"
      isLoading={loading}
      triggerButton={
        <Button variant="default" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          לקוח חדש
        </Button>
      }
    >
      <div className="space-y-6">
        <ClientTypeSelector value={clientType} onChange={setClientType} />
        {renderFormByType()}
      </div>
    </ClientFormDialog>
  );
}
