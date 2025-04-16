
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Client } from "../types";

export function useClientManagement(onClientUpdate: () => void) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientHasOrders, setClientHasOrders] = useState(false);

  const checkClientOrders = async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_name", clientId.toString())
        .eq("user_id", user?.id);

      if (error) throw error;
      return data?.length > 0;
    } catch (error: any) {
      console.error("Error checking client orders:", error.message);
      toast({
        title: "שגיאה בבדיקת הזמנות",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteClient = async (client: Client) => {
    setClientToDelete(client);
    const hasOrders = await checkClientOrders(client.id);
    setClientHasOrders(hasOrders);
    setShowDeleteDialog(true);
  };

  const confirmDeleteClient = async (deleteOrders: boolean = false) => {
    if (!clientToDelete || !user) return;

    try {
      if (deleteOrders && clientHasOrders) {
        const { error: ordersError } = await supabase
          .from("orders")
          .delete()
          .eq("client_name", clientToDelete.id.toString())
          .eq("user_id", user.id);

        if (ordersError) throw ordersError;
      }

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientToDelete.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "הלקוח נמחק בהצלחה" });
      onClientUpdate();
    } catch (error: any) {
      console.error("Error deleting client:", error.message);
      toast({
        title: "שגיאה במחיקת לקוח",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setClientToDelete(null);
    }
  };

  const archiveClient = async (client: Client) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("clients")
        .update({ status: "closed" })
        .eq("id", client.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "הלקוח הועבר לארכיון" });
      onClientUpdate();
    } catch (error: any) {
      console.error("Error archiving client:", error.message);
      toast({
        title: "שגיאה בהעברה לארכיון",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const restoreClient = async (client: Client) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("clients")
        .update({ status: "active" })
        .eq("id", client.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "הלקוח שוחזר בהצלחה" });
      onClientUpdate();
    } catch (error: any) {
      console.error("Error restoring client:", error.message);
      toast({
        title: "שגיאה בשחזור הלקוח",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    clientToDelete,
    clientHasOrders,
    handleDeleteClient,
    confirmDeleteClient,
    archiveClient,
    restoreClient
  };
}
