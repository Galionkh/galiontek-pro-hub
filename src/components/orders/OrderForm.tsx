
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/features/clients/types";

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
        setClients(data || []);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <div className="space-y-2">
        <Label htmlFor="title">כותרת הטופס</Label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_id">לקוח</Label>
        <Select 
          value={formData.client_id} 
          onValueChange={(value) => handleSelectChange("client_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="בחר לקוח" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">תאריך</Label>
        <Input 
          id="date" 
          name="date" 
          type="date" 
          value={formData.date} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">סטטוס</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="בחר סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">טיוטה</SelectItem>
            <SelectItem value="sent">נשלח</SelectItem>
            <SelectItem value="confirmed">מאושר</SelectItem>
            <SelectItem value="completed">הושלם</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">תיאור</Label>
        <Input 
          id="description" 
          name="description" 
          value={formData.description || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_terms">תנאי תשלום</Label>
        <Input 
          id="payment_terms" 
          name="payment_terms" 
          value={formData.payment_terms || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">הערות</Label>
        <Input 
          id="notes" 
          name="notes" 
          value={formData.notes || ""} 
          onChange={handleChange} 
        />
      </div>

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
