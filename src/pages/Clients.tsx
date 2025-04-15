
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Client } from "@/features/clients/types";
import { NewClientForm } from "@/features/clients/components/NewClientForm";
import { ClientCard } from "@/features/clients/components/ClientCard";
import { DeleteClientDialog } from "@/features/clients/components/DeleteClientDialog";

export default function Clients() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientHasOrders, setClientHasOrders] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error.message);
      toast({
        title: "שגיאה בטעינת לקוחות",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

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
    if (!clientToDelete) return;

    try {
      if (deleteOrders && clientHasOrders) {
        const { error: ordersError } = await supabase
          .from("orders")
          .delete()
          .eq("client_name", clientToDelete.id.toString())
          .eq("user_id", user?.id);

        if (ordersError) throw ordersError;
      }

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientToDelete.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "הלקוח נמחק בהצלחה",
      });

      fetchClients();
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
    try {
      const { error } = await supabase
        .from("clients")
        .update({ status: "closed" })
        .eq("id", client.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "הלקוח הועבר לארכיון",
      });

      fetchClients();
    } catch (error: any) {
      console.error("Error archiving client:", error.message);
      toast({
        title: "שגיאה בהעברה לארכיון",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.notes && client.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>
        <NewClientForm onClientAdded={fetchClients} />
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לקוחות..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoadingClients ? (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">טוען לקוחות...</p>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={fetchClients}
              onArchive={archiveClient}
              onDelete={handleDeleteClient}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <UserPlus className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">אין לקוחות עדיין</h2>
            <p>לחץ על "לקוח חדש" כדי להוסיף את הלקוח הראשון שלך</p>
          </div>
        </Card>
      )}

      <DeleteClientDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        clientToDelete={clientToDelete}
        hasOrders={clientHasOrders}
        onConfirmDelete={confirmDeleteClient}
        onArchive={archiveClient}
      />
    </div>
  );
}
