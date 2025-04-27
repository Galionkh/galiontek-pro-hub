import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export type Order = {
  id: number;
  title: string;
  client_name: string;
  client_id: string;
  date: string;
  status: string;
  created_at: string;
  notes?: string;
  payment_terms?: string;
  description?: string;
  user_id?: string;
  service_topic?: string;
  hours?: number;
  hourly_rate?: number;
  total_amount?: number;
  invoice_number?: string;
  invoice_date?: string;
  payment_status?: string;
  invoice_issued?: boolean;
  tax_rate?: number;
  invoice_due_date?: string;
  payment_date?: string;
};

export const useOrders = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      toast({
        title: "שגיאה בטעינת ההזמנות",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const createNewOrderForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const createOrder = async (orderData: any) => {
    if (!user) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר כדי ליצור טופס הזמנה חדש",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log("Order data being inserted:", orderData);
      
      const { data, error } = await supabase
        .from("orders")
        .insert([{
          ...orderData,
          user_id: user.id
        }])
        .select();

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      console.log("Order created successfully:", data);

      toast({
        title: "נוצר בהצלחה",
        description: "טופס ההזמנה החדש נוצר בהצלחה",
      });

      fetchOrders();
      closeForm();
    } catch (error: any) {
      console.error("Error creating order form:", error.message);
      toast({
        title: "שגיאה ביצירת טופס הזמנה",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setOrders(orders.filter(order => order.id !== id));

      toast({
        title: "נמחק בהצלחה",
        description: "ההזמנה נמחקה בהצלחה",
      });
    } catch (error: any) {
      console.error("Error deleting order:", error.message);
      throw error;
    }
  };

  const sendOrderToClient = async (id: number) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "sent" })
        .eq("id", id);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: "sent" } : order
      ));
    } catch (error: any) {
      console.error("Error sending order to client:", error.message);
      throw error;
    }
  };

  const generateInvoiceNumber = async (orderId: number) => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      const { data: existingInvoices } = await supabase
        .from("orders")
        .select("invoice_number")
        .like('invoice_number', `INV-${year}${month}-%`);

      const currentCount = (existingInvoices?.length || 0) + 1;
      const invoiceNumber = `INV-${year}${month}-${String(currentCount).padStart(3, '0')}`;

      const { error } = await supabase
        .from("orders")
        .update({ 
          invoice_number: invoiceNumber,
          invoice_date: date.toISOString(),
          invoice_issued: true,
          payment_status: 'pending',
          invoice_due_date: new Date(date.setDate(date.getDate() + 30)).toISOString()
        })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "החשבונית נוצרה בהצלחה",
        description: `מספר חשבונית: ${invoiceNumber}`,
      });

      await fetchOrders();
    } catch (error: any) {
      console.error("Error generating invoice:", error.message);
      toast({
        title: "שגיאה ביצירת החשבונית",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelInvoice = async (orderId: number) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          payment_status: 'cancelled'
        })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "החשבונית בוטלה",
        description: "החשבונית סומנה כמבוטלת",
      });

      await fetchOrders();
    } catch (error: any) {
      console.error("Error cancelling invoice:", error.message);
      toast({
        title: "שגיאה בביטול החשבונית",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    orders,
    isLoading,
    isLoadingOrders,
    isFormOpen,
    fetchOrders,
    createNewOrderForm,
    closeForm,
    createOrder,
    deleteOrder,
    sendOrderToClient,
    generateInvoiceNumber,
    cancelInvoice
  };
};
