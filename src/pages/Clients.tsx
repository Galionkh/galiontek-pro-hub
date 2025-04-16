
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Client } from "@/features/clients/types";
import { NewClientForm } from "@/features/clients/components/NewClientForm";
import { DeleteClientDialog } from "@/features/clients/components/DeleteClientDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientsSearch } from "@/features/clients/components/ClientsSearch";
import { ClientsList } from "@/features/clients/components/ClientsList";
import { useClientManagement } from "@/features/clients/hooks/useClientManagement";

export default function Clients() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");

  const {
    showDeleteDialog,
    setShowDeleteDialog,
    clientToDelete,
    clientHasOrders,
    handleDeleteClient,
    confirmDeleteClient,
    archiveClient,
    restoreClient
  } = useClientManagement(fetchClients);

  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const typedData = data?.map(client => ({
        ...client,
        status: (client.status || "active") as "active" | "pending" | "closed"
      })) as Client[];

      setClients(typedData || []);
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

  useEffect(() => {
    fetchClients();
  }, []);

  const activeClients = clients.filter(client => client.status !== "closed");
  const archivedClients = clients.filter(client => client.status === "closed");

  const filteredActiveClients = activeClients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.notes && client.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArchivedClients = archivedClients.filter((client) =>
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

      <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value as "active" | "archive")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">לקוחות פעילים</TabsTrigger>
          <TabsTrigger value="archive">ארכיון</TabsTrigger>
        </TabsList>

        <ClientsSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TabsContent value="active" className="mt-4">
          <ClientsList
            clients={filteredActiveClients}
            isLoading={isLoadingClients}
            onArchive={archiveClient}
            onDelete={handleDeleteClient}
            onEdit={fetchClients}
          />
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
          <ClientsList
            clients={filteredArchivedClients}
            isLoading={isLoadingClients}
            onArchive={archiveClient}
            onRestore={restoreClient}
            onDelete={handleDeleteClient}
            onEdit={fetchClients}
            isArchived={true}
          />
        </TabsContent>
      </Tabs>

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
