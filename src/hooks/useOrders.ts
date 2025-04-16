
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export type Order = {
  id: number;
  title: string;
  client_name: string;
  client_id?: string;
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
      
      // Log the orderData before insertion to debug
      console.log("Order data being inserted:", orderData);
      
      const { data, error } = await supabase
        .from("orders")
        .insert([{
          ...orderData,
          user_id: user.id
        }])
        .select();

      if (error) throw error;

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

      // Update local state to remove the deleted order
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

      // Update the status in the local state
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: "sent" } : order
      ));
    } catch (error: any) {
      console.error("Error sending order to client:", error.message);
      throw error;
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
  };
};
