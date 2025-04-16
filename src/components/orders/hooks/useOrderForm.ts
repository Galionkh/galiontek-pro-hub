
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/features/clients/types";
import { OrderFormProps } from "../OrderForm";

export function useOrderForm({ onClose, onSubmit, initialData }: Pick<OrderFormProps, "onClose" | "onSubmit" | "initialData">) {
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
      
      // Log the form data before submission to help with debugging
      console.log("Form data being submitted:", formData);
      
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

  return {
    formData,
    clients,
    isLoading,
    handleChange,
    handleSelectChange,
    handleSubmit
  };
}
