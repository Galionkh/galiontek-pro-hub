
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export type Order = {
  id: number;
  title: string;
  client_name: string;
  date: string;
  status: string;
  created_at: string;
  user_id?: string;
};

export const useOrders = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

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

  const createNewOrderForm = async () => {
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
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            title: "טופס הזמנה חדש",
            client_name: "לקוח חדש",
            date: new Date().toISOString().split("T")[0],
            status: "draft",
            user_id: user.id
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "טופס ההזמנה החדש נוצר בהצלחה",
      });

      fetchOrders();
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

  return {
    orders,
    isLoading,
    isLoadingOrders,
    fetchOrders,
    createNewOrderForm,
  };
};
