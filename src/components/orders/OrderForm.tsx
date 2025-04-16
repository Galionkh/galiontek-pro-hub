
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/features/clients/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { NewClientForm } from "@/features/clients/components/NewClientForm";
import { Plus } from "lucide-react";

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
  const [isClientSheetOpen, setIsClientSheetOpen] = useState(false);

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
  }, [toast, isClientSheetOpen]);

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

  const handleClientAdded = () => {
    setIsClientSheetOpen(false);
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
        <Label htmlFor="client_id">לקוח <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Select 
            value={formData.client_id} 
            onValueChange={(value) => handleSelectChange("client_id", value)}
          >
            <SelectTrigger className="flex-1">
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
          
          <Sheet open={isClientSheetOpen} onOpenChange={setIsClientSheetOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>הוספת לקוח חדש</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NewClientForm onClientAdded={handleClientAdded} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
        <Label htmlFor="service_topic">נושא השירות / שם התוכנית</Label>
        <Input 
          id="service_topic" 
          name="service_topic" 
          value={formData.service_topic || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours">מספר שעות</Label>
          <Input 
            id="hours" 
            name="hours" 
            type="number" 
            min="0"
            step="0.5"
            value={formData.hours || ""} 
            onChange={handleChange} 
            className="ltr-input"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourly_rate">תעריף לשעה (₪)</Label>
          <Input 
            id="hourly_rate" 
            name="hourly_rate" 
            type="number"
            min="0"
            step="0.01"
            value={formData.hourly_rate || ""} 
            onChange={handleChange} 
            className="ltr-input"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_amount">סכום כולל (₪)</Label>
          <Input 
            id="total_amount" 
            name="total_amount" 
            type="number" 
            value={formData.total_amount || 0} 
            readOnly
            className="bg-gray-50 ltr-input"
            dir="ltr"
          />
        </div>
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
