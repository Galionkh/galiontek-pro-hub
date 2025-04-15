
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Trash2 } from "lucide-react";
import { Client } from "../types";
import { getStatusColor, getStatusText, formatDate } from "../utils/clientUtils";
import { EditClientForm } from "./EditClientForm";

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onArchive: (client: Client) => Promise<void>;
  onDelete: (client: Client) => void;
}

export function ClientCard({ client, onEdit, onArchive, onDelete }: ClientCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{client.name}</CardTitle>
        <Badge className={getStatusColor(client.status)}>
          {getStatusText(client.status)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <strong>איש קשר:</strong> {client.contact}
        </p>
        {client.notes && (
          <p className="text-muted-foreground text-sm mb-2">{client.notes}</p>
        )}
        {client.created_at && (
          <p className="text-muted-foreground text-sm mb-3">
            <strong>נוצר בתאריך:</strong> {formatDate(client.created_at)}
          </p>
        )}
        <div className="mt-4 flex space-x-2">
          <EditClientForm client={client} onClientUpdated={onEdit} />
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 mr-2"
            onClick={() => onArchive(client)}
          >
            <Archive className="h-4 w-4" />
            העבר לארכיון
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(client)}
          >
            <Trash2 className="h-4 w-4" />
            מחק
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
