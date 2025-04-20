
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Client } from "../types";
import { ClientTypeSelector } from "./ClientTypeSelector";
import { EducationalClientForm } from "./EducationalClientForm";
import { CompanyClientForm } from "./CompanyClientForm";
import { IndividualClientForm } from "./IndividualClientForm";

interface EditClientFormProps {
  client: Client;
  onClientUpdated: () => void;
}

export function EditClientForm({ client, onClientUpdated }: EditClientFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [clientType, setClientType] = useState(client.client_type || "");
  const [formData, setFormData] = useState({
    name: client.name || "",
    contact: client.contact || "",
    email: client.email || "",
    status: client.status || "active",
    notes: client.notes || "",
    institution_number: client.institution_number || "",
    institution_type: client.institution_type || "",
    city: client.city || "",
    address: client.address || "",
    principal_name: client.principal_name || "",
    principal_email: client.principal_email || "",
    business_field: client.business_field || "",
    phone: client.phone || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: client.name || "",
      contact: client.contact || "",
      email: client.email || "",
      status: client.status || "active",
      notes: client.notes || "",
      institution_number: client.institution_number || "",
      institution_type: client.institution_type || "",
      city: client.city || "",
      address: client.address || "",
      principal_name: client.principal_name || "",
      principal_email: client.principal_email || "",
      business_field: client.business_field || "",
      phone: client.phone || "",
    });
    setClientType(client.client_type || "");
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!user || !clientType) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          ...formData,
          client_type: clientType,
        })
        .eq("id", client.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "הלקוח עודכן בהצלחה" });
      setIsOpen(false);
      onClientUpdated();
    } catch (error: any) {
      console.error("Error updating client:", error);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          ערוך פרטים
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>עריכת לקוח</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <ClientTypeSelector value={clientType} onChange={setClientType} />
          {renderFormByType()}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "מעדכן..." : "עדכן לקוח"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
