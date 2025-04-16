
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClientCard } from "./ClientCard";
import { Client } from "../types";

interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: () => void;
  onArchive: (client: Client) => Promise<void>;
  onDelete?: (client: Client) => void;
  onRestore?: (client: Client) => Promise<void>;
  isArchived?: boolean;
  showDeleteButton?: boolean;
  dir?: "ltr" | "rtl";
}

export function ClientsList({
  clients,
  isLoading,
  onEdit,
  onArchive,
  onDelete,
  onRestore,
  isArchived = false,
  showDeleteButton = true,
  dir = "ltr"
}: ClientsListProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">טוען לקוחות...</p>
        </div>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">
            {isArchived ? "אין לקוחות בארכיון" : "אין לקוחות פעילים"}
          </h2>
          <p>
            {isArchived ? "לקוחות שהועברו לארכיון יופיעו כאן" : "הוסף לקוח חדש כדי להתחיל"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4" dir={dir}>
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={showDeleteButton ? onDelete : undefined}
          onRestore={onRestore}
          isArchived={isArchived}
          dir={dir}
        />
      ))}
    </div>
  );
}
