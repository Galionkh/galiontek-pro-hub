
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/hooks/useOrders";

export const useOrderDetails = (orderId: number) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (error: any) {
        console.error("Error fetching order:", error.message);
        toast({
          title: "שגיאה בטעינת ההזמנה",
          description: error.message,
          variant: "destructive",
        });
        navigate("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, toast]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update(formData)
        .eq("id", orderId);

      if (error) throw error;
      
      // Update local state
      setOrder(prev => prev ? { ...prev, ...formData } : null);
      
      toast({
        title: "עודכן בהצלחה",
        description: "ההזמנה עודכנה בהצלחה",
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating order:", error.message);
      toast({
        title: "שגיאה בעדכון ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?")) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "נמחק בהצלחה",
        description: "ההזמנה נמחקה בהצלחה",
      });
      
      navigate("/orders");
    } catch (error: any) {
      console.error("Error deleting order:", error.message);
      toast({
        title: "שגיאה במחיקת ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendToClient = async () => {
    try {
      // First, update the status to "sent"
      const { error } = await supabase
        .from("orders")
        .update({ status: "sent" })
        .eq("id", orderId);

      if (error) throw error;
      
      // Update local state
      setOrder(prev => prev ? { ...prev, status: "sent" } : null);
      
      toast({
        title: "נשלח בהצלחה",
        description: "ההזמנה נשלחה ללקוח בהצלחה",
      });
    } catch (error: any) {
      console.error("Error sending order:", error.message);
      toast({
        title: "שגיאה בשליחת ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    order,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleSendToClient
  };
};
