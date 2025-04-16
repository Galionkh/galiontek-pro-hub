
import { Loader2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Client } from "../types";
import { ClientCard } from "./ClientCard";

interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  onArchive: (client: Client) => Promise<void>;
  onRestore?: (client: Client) => Promise<void>;
  onDelete: (client: Client) => void;
  onEdit: () => void;
  isArchived?: boolean;
}

export function ClientsList({
  clients,
  isLoading,
  onArchive,
  onRestore,
  onDelete,
  onEdit,
  isArchived = false,
}: ClientsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">טוען לקוחות...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          {!isArchived ? (
            <>
              <UserPlus className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">אין לקוחות פעילים</h2>
              <p>לחץ על "לקוח חדש" כדי להוסיף לקוח חדש</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">אין לקוחות בארכיון</h2>
              <p>לקוחות שהועברו לארכיון יופיעו כאן</p>
            </>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          isArchived={isArchived}
          onArchive={onArchive}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
