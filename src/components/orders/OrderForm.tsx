
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/features/clients/types";
import { FormField } from "./form/FormField";
import { ClientSelector } from "./form/ClientSelector";
import { StatusSelector } from "./form/StatusSelector";
import { PricingFields } from "./form/PricingFields";

interface OrderFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEdit?: boolean;
}

export function OrderForm({ onClose, onSubmit, initialData, isEdit = false }: OrderFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "טופס הזמנה חדש",
    client_name: initialData?.client_name || "",
    client_id: initialData?.client_id || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    status: initialData?.status || "draft",
    notes: initialData?.notes || "",
    payment_terms: initialData?.payment_terms || "",
    description: initialData?.description || "",
    service_topic: initialData?.service_topic || "",
    hours: initialData?.hours || "",
    hourly_rate: initialData?.hourly_rate || "",
    total_amount: initialData?.total_amount || 0,
  });

  useEffect(() => {
    // Fetch clients for the dropdown
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        
        // Convert data to match the Client type by ensuring status is of the right type
        const typedClients = data?.map(client => ({
          ...client,
          status: (client.status as "active" | "pending" | "closed") || "active"
        })) as Client[];
        
        setClients(typedClients || []);
      } catch (error: any) {
        console.error("Error fetching clients:", error.message);
        toast({
          title: "שגיאה בטעינת לקוחות",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    fetchClients();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate total amount if both hours and hourly_rate are set
      if ((name === 'hours' || name === 'hourly_rate') && newData.hours && newData.hourly_rate) {
        newData.total_amount = parseFloat(newData.hours) * parseFloat(newData.hourly_rate);
      }
      
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If selecting a client, update client_name
    if (name === "client_id") {
      const selectedClient = clients.find(client => client.id.toString() === value);
      if (selectedClient) {
        setFormData(prev => ({ 
          ...prev, 
          client_name: selectedClient.name
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.client_id) {
      toast({
        title: "שגיאה",
        description: "בחירת לקוח היא שדה חובה",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "שגיאה בשמירת הטופס",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <FormField
        id="title"
        name="title"
        label="כותרת הטופס"
        value={formData.title}
        onChange={handleChange}
        required={true}
      />

      <ClientSelector 
        clientId={formData.client_id} 
        clients={clients} 
        onClientSelect={(value) => handleSelectChange("client_id", value)}
        isRequired={true}
      />

      <FormField
        id="date"
        name="date"
        label="תאריך"
        type="date"
        value={formData.date}
        onChange={handleChange}
      />

      <FormField
        id="service_topic"
        name="service_topic"
        label="נושא השירות / שם התוכנית"
        value={formData.service_topic || ""}
        onChange={handleChange}
      />

      <PricingFields 
        hours={formData.hours} 
        hourlyRate={formData.hourly_rate} 
        totalAmount={formData.total_amount} 
        onChange={handleChange}
      />

      <FormField
        id="payment_terms"
        name="payment_terms"
        label="תנאי תשלום"
        value={formData.payment_terms || ""}
        onChange={handleChange}
      />

      <StatusSelector 
        status={formData.status} 
        onStatusChange={(value) => handleSelectChange("status", value)}
      />

      <FormField
        id="description"
        name="description"
        label="תיאור"
        value={formData.description || ""}
        onChange={handleChange}
      />

      <FormField
        id="notes"
        name="notes"
        label="הערות"
        value={formData.notes || ""}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="ml-2">
          ביטול
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "שומר..." : isEdit ? "עדכן הזמנה" : "צור הזמנה"}
        </Button>
      </div>
    </form>
  );
}
